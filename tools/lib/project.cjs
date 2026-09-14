'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../..');
// Resolve the parsers owned by this locked Hexo installation, not global packages.
const hexoRequire = createRequire(require.resolve('hexo/package.json'));
const yaml = hexoRequire('js-yaml');
const frontMatter = hexoRequire('hexo-front-matter');

function readYaml(file) {
  try {
    return yaml.load(fs.readFileSync(file, 'utf8')) || {};
  } catch (error) {
    if (error && error.code === 'ENOENT') throw new Error(`Missing configuration file: ${path.basename(file)}.`);
    // YAML exception messages can contain source snippets with credentials.
    throw new Error(`Cannot parse YAML: ${path.basename(file)} (${error.name})`);
  }
}

// Hexo itself accepts "public", "./public" and "public/"; compare normalized
// values so the guard checks intent instead of spelling.
function normalizeDirectory(value) {
  if (typeof value !== 'string') return value;
  return path.posix.normalize(value.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, ''));
}

// Values the theme would interpolate into a URL as a broken string.
const BOGUS_CDN_VALUE = /^(?:true|false|null|undefined|object|object object)$/i;

function validateConfiguration(config, theme, lock) {
  const errors = [];
  if (config.theme !== lock.name) errors.push(`theme must be ${lock.name} (case-sensitive).`);
  if (normalizeDirectory(config.public_dir) !== 'public' || normalizeDirectory(config.source_dir) !== 'source') {
    errors.push('These site tools require source_dir: source and public_dir: public.');
  }
  if (config.render_drafts) errors.push('render_drafts must remain false for the release build.');
  for (const [key, value] of Object.entries(theme.CDN?.option || {})) {
    // null is the theme's own "no override" sentinel; anything else must be a URL.
    if (value === null) continue;
    if (typeof value !== 'string' || !value.trim() || value.includes('[object') || BOGUS_CDN_VALUE.test(value.trim())) {
      errors.push(`CDN.option.${key} must be a URL string or null, not an object/boolean/serialized value.`);
    }
  }
  const warnings = [];
  const use = theme.comments?.use;
  const gitalkEnabled = Array.isArray(use) ? use.includes('Gitalk') : String(use || '').split(',').includes('Gitalk');
  if (gitalkEnabled) {
    if (!theme.gitalk?.client_id || !theme.gitalk?.client_secret) {
      warnings.push('Gitalk credentials are missing; set them in the ignored local theme config to enable comments.');
    } else {
      warnings.push('Gitalk embeds its configured client secret in public HTML. Ignoring config does not keep that value private.');
    }
  }
  return { errors, warnings };
}

function publishedPosts(hexo) {
  // Some plugins read locals while source processing is still in progress.
  // Hexo normally invalidates this cache only AFTER before_generate filters.
  hexo.locals.invalidate();
  return hexo.locals.get('posts').toArray().map(p => ({ source: p.source, path: p.path, title: p.title }));
}

// Hexo quotes scaffold values only when they contain ":" or start with "#"/"!!",
// so a title is written unquoted in most cases. Reject titles that YAML would
// then reinterpret, instead of silently writing a truncated or wrong title.
const YAML_LEADING = /^[-?:,\s]|^[%{}[\]&*!>|@'"`#]/;
const YAML_COERCED = /^(?:~|null|true|false|yes|no|on|off)$/i;
const YAML_NUMERIC = /^[\d.:+\-/\s]+$/;

function assertUsableTitle(title) {
  if (!title || /[\r\n]/.test(title)) throw new Error('Use one single-line title.');
  if (YAML_LEADING.test(title)) {
    throw new Error(`Title must not start with the YAML character "${title[0]}". Rephrase it, e.g. put a word first.`);
  }
  if (/[{}[\]]/.test(title)) throw new Error('Title must not contain { } [ ] (YAML would read it as a flow collection).');
  if (/\s#/.test(title)) throw new Error('Title must not contain " #" (YAML would cut the title off at the comment).');
  if (YAML_COERCED.test(title) || YAML_NUMERIC.test(title)) {
    throw new Error('Title must contain letters; YAML would store it as a boolean, null, number or date.');
  }
}

/** Confirm the written draft really carries the requested title and urlname. */
function draftTitleRoundTrips(file, title) {
  const parsed = frontMatter.parse(fs.readFileSync(file, 'utf8'));
  return parsed.title === title && parsed.urlname === title;
}

function report(result, label) {
  for (const message of result.warnings || []) console.warn(`[WARN ${label}] ${message}`);
  for (const message of result.errors || []) console.error(`[FAIL ${label}] ${message}`);
  if (result.errors?.length) throw new Error(`${label}: ${result.errors.length} validation error(s).`);
  if (result.counts) console.log(`[PASS ${label}] ${JSON.stringify(result.counts)}`);
}

module.exports = {
  root,
  yaml,
  readYaml,
  normalizeDirectory,
  validateConfiguration,
  publishedPosts,
  assertUsableTitle,
  draftTitleRoundTrips,
  report
};
