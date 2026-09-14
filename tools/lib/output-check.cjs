'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

// Resolve the parser through Hexo's own dependency tree, including nested installs.
const hexoRequire = createRequire(require.resolve('hexo/package.json'));
const utilRequire = createRequire(hexoRequire.resolve('hexo-util/package.json'));
const { Parser } = utilRequire(utilRequire.resolve('htmlparser2'));

const URL_ATTRIBUTES = {
  script: ['src'],
  link: ['href'],
  img: ['src', 'data-src'],
  source: ['src'],
  a: ['href'],
  iframe: ['src'],
  video: ['src', 'poster'],
  audio: ['src']
};
const HTML_FILE = /\.html?$/i;
const SCHEME = /^[a-z][a-z\d+.-]*:/i;
const SPACE = /[\t\n\f\r ]/;

// Diagnostics never include HTML, URL credentials, or query/fragment values.
function label(value) {
  const pathname = String(value).split(/[?#]/, 1)[0]
    .replace(/^([a-z][a-z\d+.-]*:)?\/\/[^/]*@/i, '$1//[redacted]@')
    .replace(/[\u0000-\u001f\u007f]/g, ' ');
  return JSON.stringify(pathname.length > 180 ? `${pathname.slice(0, 177)}...` : pathname);
}

function containsObjectUrl(value) {
  if (/\[object\s+Object\]/i.test(value)) return true;
  // A malformed query must not prevent checking an encoded pathname.
  for (const candidate of [value, value.split(/[?#]/, 1)[0]]) {
    try {
      if (/\[object\s+Object\]/i.test(decodeURIComponent(candidate))) return true;
    } catch {
      // Invalid path encoding is reported by normalizePath, not from query data.
    }
  }
  return false;
}

// Follow srcset's URL/descriptor states: commas inside a data URL (or any URL)
// are not separators; trailing commas and descriptor-ending commas are.
function srcsetUrls(value) {
  const urls = [];
  let position = 0;
  while (position < value.length) {
    while (position < value.length && (SPACE.test(value[position]) || value[position] === ',')) position++;
    const start = position;
    while (position < value.length && !SPACE.test(value[position])) position++;
    let url = value.slice(start, position);
    if (!url) break;
    if (url.endsWith(',')) {
      url = url.replace(/,+$/, '');
    } else {
      let parentheses = 0;
      while (position < value.length) {
        const character = value[position++];
        if (character === '(') parentheses++;
        else if (character === ')' && parentheses) parentheses--;
        else if (character === ',' && !parentheses) break;
      }
    }
    if (url) urls.push(url);
  }
  return urls;
}

/**
 * Audit generated HTML without changing it or making network requests.
 * References counts actual URL attributes/srcset candidates, including skipped
 * external, empty, query-only, and fragment-only references; posts is input size.
 * Same-origin absolute URLs map from the origin root into publicDir.
 * @param {{publicDir: string, posts?: Array<{source: string, path: string, title: string}>, siteUrl?: string}} options
 * @returns {{errors: string[], warnings: string[], counts: {htmlFiles: number, references: number, posts: number}}}
 */
function checkOutput({ publicDir, posts = [], siteUrl } = {}) {
  const errors = [];
  const warnings = [];
  const counts = { htmlFiles: 0, references: 0, posts: Array.isArray(posts) ? posts.length : 0 };
  const result = { errors, warnings, counts };
  if (!Array.isArray(posts)) {
    errors.push('posts must be an array of published post metadata.');
    posts = [];
  }
  if (typeof publicDir !== 'string' || !publicDir) {
    errors.push('publicDir must name an output directory.');
    return result;
  }

  const root = path.resolve(publicDir);
  try {
    if (!fs.statSync(root).isDirectory()) {
      errors.push('The output path is not a directory.');
      return result;
    }
  } catch (error) {
    errors.push(`Cannot read output directory (${error.code || 'filesystem error'}).`);
    return result;
  }

  let site;
  if (siteUrl) {
    try {
      site = new URL(siteUrl);
      if (!['http:', 'https:'].includes(site.protocol)) throw new Error('unsupported origin');
    } catch {
      site = undefined;
      warnings.push('siteUrl is not a valid HTTP(S) URL; absolute URLs are not checked locally.');
    }
  }

  const files = new Set();
  const foldedFiles = new Map();
  let symlinks = 0;
  function walk(directory, prefix) {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      errors.push(`Cannot list output directory ${label(prefix || '/')} (${error.code || 'filesystem error'}).`);
      return;
    }
    entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) {
        // Never follow a symlink that could leave the audited output tree.
        symlinks++;
      } else if (entry.isDirectory()) {
        walk(path.join(directory, entry.name), relative);
      } else if (entry.isFile()) {
        files.add(relative);
        if (!foldedFiles.has(relative.toLowerCase())) foldedFiles.set(relative.toLowerCase(), relative);
      }
    }
  }
  walk(root, '');
  if (symlinks) warnings.push(`Symbolic links not followed: ${symlinks}.`);

  function normalizePath(rawPath, fromFile, context) {
    let decoded;
    try {
      decoded = decodeURIComponent(rawPath).replace(/\\/g, '/');
    } catch {
      errors.push(`Malformed URL path encoding in ${context}.`);
      return null;
    }
    if (/[\u0000-\u001f\u007f]/.test(decoded)) {
      errors.push(`Invalid control character in URL path in ${context}.`);
      return null;
    }
    const segments = decoded.startsWith('/') || !fromFile
      ? [] : fromFile.split('/').slice(0, -1);
    // Do not use URL.pathname or path.normalize here: they erase traversal
    // evidence, and Windows existence checks silently accept incorrect casing.
    for (const segment of decoded.split('/')) {
      if (!segment || segment === '.') continue;
      if (segment === '..') {
        if (!segments.length) {
          errors.push(`URL traversal outside public directory in ${context}.`);
          return null;
        }
        segments.pop();
      } else {
        segments.push(segment);
      }
    }
    return {
      pathname: segments.join('/'),
      directory: !segments.length || /(?:\/|(?:^|\/)\.{1,2})$/.test(decoded)
    };
  }

  function findTarget(route) {
    const index = route.pathname ? `${route.pathname}/index.html` : 'index.html';
    const candidates = route.directory ? [index] : [route.pathname, index];
    for (const candidate of candidates) {
      if (files.has(candidate)) return { file: candidate };
    }
    for (const candidate of candidates) {
      const differentlyCased = foldedFiles.get(candidate.toLowerCase());
      if (differentlyCased) return { caseMismatch: differentlyCased };
    }
    return {};
  }

  let externalReferences = 0;
  function checkReference(rawValue, file, tag, attribute) {
    counts.references++;
    const context = `${label(file)} (${tag}[${attribute}])`;
    const value = rawValue.trim().replace(/[\t\n\r]/g, '');
    if (containsObjectUrl(value)) {
      errors.push(`Invalid [object Object] URL in ${context}.`);
      return;
    }
    if (!value || value.startsWith('#') || value.startsWith('?')) return;

    let pathname = value.split(/[?#]/, 1)[0].replace(/\\/g, '/');
    if (SCHEME.test(value) || pathname.startsWith('//')) {
      const scheme = value.match(SCHEME);
      if (scheme && !/^https?:$/i.test(scheme[0])) {
        externalReferences++;
        return;
      }
      let absolute;
      try {
        absolute = new URL(value, site ? site.href : 'https://output-check.invalid/');
      } catch {
        errors.push(`Malformed HTTP(S) URL in ${context}.`);
        return;
      }
      if (!site || absolute.origin !== site.origin) {
        externalReferences++;
        return;
      }
      // Strip only scheme/authority, retaining raw dot segments for traversal
      // checks instead of using the already-normalized WHATWG URL pathname.
      const authority = pathname.match(/^(?:https?:)?\/\/[^/]*/i);
      if (!authority) {
        errors.push(`Malformed same-origin absolute URL in ${context}.`);
        return;
      }
      pathname = pathname.slice(authority[0].length) || '/';
    }
    const route = normalizePath(pathname, file, context);
    if (!route) return;
    const target = findTarget(route);
    if (target.file) return;
    if (target.caseMismatch) {
      errors.push(`Case mismatch for local reference ${label(route.pathname || '/')} in ${context}; actual file is ${label(target.caseMismatch)}.`);
    } else {
      errors.push(`Missing local reference ${label(route.pathname || '/')} in ${context}.`);
    }
  }

  const titles = new Map();
  const htmlFiles = [...files].filter(file => HTML_FILE.test(file));
  counts.htmlFiles = htmlFiles.length;
  for (const file of htmlFiles) {
    let html;
    try {
      html = fs.readFileSync(path.join(root, ...file.split('/')), 'utf8');
    } catch (error) {
      errors.push(`Cannot read HTML output ${label(file)} (${error.code || 'filesystem error'}).`);
      continue;
    }
    let title = null;
    let inTitle = false;
    const parser = new Parser({
      onopentag(tag, attributes) {
        if (tag === 'title' && title === null) {
          title = '';
          inTitle = true;
        }
        const names = Object.prototype.hasOwnProperty.call(URL_ATTRIBUTES, tag) ? URL_ATTRIBUTES[tag] : [];
        for (const attribute of names) {
          if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
            checkReference(attributes[attribute], file, tag, attribute);
          }
        }
        if ((tag === 'img' || tag === 'source') && Object.prototype.hasOwnProperty.call(attributes, 'srcset')) {
          const srcset = attributes.srcset;
          // An accidentally serialized object must not be split into a
          // misleading partial URL by srcset's whitespace/descriptor grammar.
          const candidates = containsObjectUrl(srcset) ? [srcset] : srcsetUrls(srcset);
          for (const candidate of candidates) checkReference(candidate, file, tag, 'srcset');
        }
      },
      ontext(text) {
        if (inTitle) title += text;
      },
      onclosetag(tag) {
        if (tag === 'title') inTitle = false;
      }
    }, { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true, xmlMode: false });
    try {
      parser.end(html);
      titles.set(file, title === null ? null : title.trim());
    } catch {
      errors.push(`Cannot parse HTML output ${label(file)}.`);
    }
  }

  const seenPosts = new Set();
  for (const post of posts) {
    if (!post || typeof post.path !== 'string' || !post.path.trim()) {
      errors.push('Published post is missing its generated path.');
      continue;
    }
    const value = post.path.trim().replace(/[\t\n\r]/g, '');
    const context = `post output ${label(value)}`;
    if (containsObjectUrl(value)) {
      errors.push('Invalid [object Object] URL in a published post path.');
      continue;
    }
    if (SCHEME.test(value) || /^[\\/]{2}/.test(value)) {
      errors.push('Published post path must be a local generated route.');
      continue;
    }
    const route = normalizePath(value.split(/[?#]/, 1)[0], '', context);
    if (!route) continue;
    const target = findTarget(route);
    const key = target.file || (route.directory ? `${route.pathname ? `${route.pathname}/` : ''}index.html` : route.pathname);
    if (seenPosts.has(key)) errors.push(`Duplicate post path ${label(key)}.`);
    seenPosts.add(key);
    if (!target.file) {
      if (target.caseMismatch) {
        errors.push(`Case mismatch for ${context}; actual file is ${label(target.caseMismatch)}.`);
      } else {
        errors.push(`Missing ${context}.`);
      }
      continue;
    }
    const title = titles.get(target.file);
    if (title === null || title === undefined) {
      errors.push(`Missing readable HTML title in post output ${label(target.file)}.`);
    } else if (typeof post.title !== 'string' || !(title === post.title || title.startsWith(`${post.title} | `))) {
      errors.push(`Post title mismatch in ${label(target.file)}.`);
    }
  }

  if (externalReferences) warnings.push(`External or custom-scheme references not validated: ${externalReferences}.`);
  return result;
}

module.exports = { checkOutput };
