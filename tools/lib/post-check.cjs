'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

// Use Hexo's own dependencies, including when npm nests them under Hexo.
const hexoRequire = createRequire(require.resolve('hexo/package.json'));
const frontMatter = hexoRequire('hexo-front-matter');
const moment = hexoRequire('moment');
const { JSON_SCHEMA } = hexoRequire('js-yaml');
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isMap = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const placeholder = /\{\{[\s\S]*?\}\}/;

function containsPlaceholder(value, seen = new Set()) {
  if (typeof value === 'string') return placeholder.test(value);
  if (!value || typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  return Object.entries(value).some(([key, item]) =>
    placeholder.test(key) || containsPlaceholder(item, seen));
}

function sourcePath(source) {
  if (typeof source !== 'string' || !source.trim()) return null;
  const normalized = source.replace(/\\/g, '/');
  if (/[\u0000-\u001f\u007f:]/.test(normalized) || normalized.startsWith('/')) return null;
  if (normalized.split('/').some(part => !part || part === '.' || part === '..')) return null;
  return normalized;
}

// Hexo locals expose /post/name/, while the route manifest may expose
// post/name/index.html. These denote the same URL. Casing is retained for
// baseline comparisons, but collision checks use the lowercase form.
function normalizeRoute(route) {
  if (typeof route !== 'string' || !route.trim()) {
    return { error: 'missing or blank final path' };
  }
  let decoded = route;
  // Also reject nested encodings of traversal and separators. Each successful
  // decode shortens the string, so this loop is bounded by the input length.
  while (decoded.includes('%')) {
    let next;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return { error: 'final path contains malformed percent encoding' };
    }
    if (next === decoded) break;
    decoded = next;
  }
  if (decoded !== decoded.trim() || /[\u0000-\u001f\u007f\\?#]/.test(decoded)) {
    return { error: 'final path contains unsafe whitespace, a separator, query, or fragment' };
  }
  if (decoded.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(decoded) || decoded.includes(':')) {
    return { error: 'final path must be a site-relative route, not an absolute URL or drive path' };
  }
  if (decoded.startsWith('/')) decoded = decoded.slice(1);
  if (!decoded) return { error: 'final path cannot be the site root' };
  if (decoded.endsWith('/')) decoded += 'index.html';
  const segments = decoded.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    return { error: 'final path contains empty or traversal segments' };
  }
  if (segments.some(segment => /^(?:null|undefined)(?:\.[^.]*)?$/i.test(segment))) {
    return { error: 'final path contains a null or undefined segment' };
  }
  if (placeholder.test(decoded)) return { error: 'final path contains an unresolved {{...}} placeholder' };
  return { path: decoded, collisionKey: decoded.toLowerCase() };
}

function isValidDate(value) {
  if (typeof value !== 'string') return false;
  // No Date constructor or filesystem fallback: both can silently repair bad
  // calendar dates. ISO covers current Hexo timestamps and timezone variants.
  return moment(value.trim(), [
    moment.ISO_8601,
    moment.RFC_2822,
    'YYYY-M-D H:m:s',
    'YYYY-M-D H:m',
    'YYYY-M-D'
  ], true).isValid();
}

function hasBody(content) {
  return Boolean(content
    .replace(/<!--[\s\S]*?(?:-->|$)/g, '')
    .replace(/^\s{0,3}\[(?:\/\/|comment)\]:\s*#\s*\([^\r\n]*\)\s*$/gm, '')
    .trim());
}

/** Check published Hexo locals against their original files without changing them. */
function checkPosts({ sourceDir, posts, baseline = {}, emptyPostAllowlist = {} } = {}) {
  const errors = [];
  const warnings = [];
  const result = { errors, warnings, counts: { posts: Array.isArray(posts) ? posts.length : 0 } };
  if (!Array.isArray(posts)) {
    errors.push('posts must be an array of published Hexo post records.');
    return result;
  }
  if (typeof sourceDir !== 'string' || !sourceDir.trim()) {
    errors.push('sourceDir must name the Hexo source directory.');
    return result;
  }
  if (!isMap(baseline)) {
    errors.push('baseline must map exact post sources to published paths.');
    baseline = {};
  }
  if (!isMap(emptyPostAllowlist)) {
    errors.push('emptyPostAllowlist must map exact post sources to nonempty reasons.');
    emptyPostAllowlist = {};
  }
  const allowedEmpty = new Map();
  for (const [source, reason] of Object.entries(emptyPostAllowlist)) {
    if (!sourcePath(source) || source.includes('*') || source.includes('?')) {
      errors.push(`${source}: empty-post allowlist requires an exact source path, not a wildcard.`);
    } else if (typeof reason !== 'string' || !reason.trim()) {
      errors.push(`${source}: empty-post allowlist requires a nonempty reason.`);
    } else {
      // Do not interpret patterns, directories, booleans, or inherited entries.
      allowedEmpty.set(source, reason.trim());
    }
  }

  const seenSources = new Set();
  const routes = new Map();
  const currentRoutes = new Map();
  const root = path.resolve(sourceDir);
  for (const post of posts) {
    const source = sourcePath(post && post.source);
    if (!source) {
      errors.push('A published post has a missing or unsafe source path.');
      continue;
    }
    if (seenSources.has(source)) errors.push(`${source}: duplicate published source.`);
    seenSources.add(source);

    const route = normalizeRoute(post.path);
    if (route.error) {
      errors.push(`${source}: ${route.error}.`);
    } else {
      currentRoutes.set(source, route.path);
      if (routes.has(route.collisionKey)) {
        errors.push(`${source}: final path collision with ${routes.get(route.collisionKey)} (${route.path}).`);
      } else {
        routes.set(route.collisionKey, source);
      }
    }

    let original;
    try {
      original = fs.readFileSync(path.resolve(root, source), 'utf8')
        .replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    } catch (error) {
      errors.push(`${source}: cannot read original post (${error.code || 'read error'}).`);
      continue;
    }
    let metadata;
    const split = frontMatter.split(original);
    try {
      // Preserve the original timestamp string. The default YAML timestamp
      // constructor normalizes e.g. February 30 before it can be validated.
      metadata = frontMatter.parse(original, { schema: JSON_SCHEMA });
    } catch {
      // Do not print the parser's source excerpt (it may contain private data).
      errors.push(`${source}: cannot parse original front matter.`);
      continue;
    }
    if (!split.data) errors.push(`${source}: missing original front matter.`);
    for (const field of ['title', 'date', 'urlname']) {
      const value = metadata[field];
      if (!own(metadata, field) || value === null || value === undefined ||
          (typeof value === 'string' && (!value.trim() || /^(?:null|undefined)$/i.test(value.trim())))) {
        errors.push(`${source}: original front matter ${field} is missing, null, or blank.`);
      } else if (typeof value !== 'string') {
        errors.push(`${source}: original front matter ${field} must be a nonempty string.`);
      } else if (field === 'date' && !placeholder.test(value) && !isValidDate(value)) {
        errors.push(`${source}: original front matter date is not a valid strict calendar date.`);
      }
    }
    // Optional tags/categories may be null in existing posts; placeholders in
    // any metadata are errors, but code examples in the article are not.
    for (const [field, value] of Object.entries(metadata)) {
      if (field !== '_content' && containsPlaceholder(value)) {
        errors.push(`${source}: front matter ${field} contains an unresolved {{...}} placeholder.`);
      }
    }
    if (!hasBody(split.content || '')) {
      if (allowedEmpty.has(source)) {
        warnings.push(`${source}: empty body allowed for this exact existing source: ${allowedEmpty.get(source)}`);
      } else {
        errors.push(`${source}: post body is empty after removing comments; an exact-source allowlist entry with a reason is required for an existing exception.`);
      }
    }
  }

  for (const [source, previous] of Object.entries(baseline)) {
    if (!seenSources.has(source)) {
      errors.push(`${source}: previously published source is missing from Hexo posts.`);
      continue;
    }
    const oldRoute = normalizeRoute(previous);
    if (oldRoute.error) {
      errors.push(`${source}: invalid baseline path (${oldRoute.error}).`);
    } else if (currentRoutes.has(source) && currentRoutes.get(source) !== oldRoute.path) {
      errors.push(`${source}: published URL changed from ${previous} to ${currentRoutes.get(source)}.`);
    }
  }
  return result;
}

module.exports = { checkPosts };
