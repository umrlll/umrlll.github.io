'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { checkOutput } = require('../lib/output-check.cjs');

function fixture(t, files) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hexo-output-check-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    const filename = path.join(directory, ...name.split('/'));
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, content, 'utf8');
  }
  return directory;
}

function post(route, title = 'Hello') {
  return { source: '_posts/hello.md', path: route, title };
}

function assertNoErrors(result) {
  assert.deepEqual(result.errors, []);
}

test('resolves directory routes and relative paths through real index.html files', t => {
  const publicDir = fixture(t, {
    'index.html': '<a href="/post/hello/">Post</a><a href="/post/hello">Alias</a>',
    'post/hello/index.html': '<title>Hello | Site</title><a href="../../">Home</a><img src="../../assets/icon.png">',
    'assets/icon.png': ''
  });
  const result = checkOutput({ publicDir, posts: [post('/post/hello/')] });
  assertNoErrors(result);
  assert.deepEqual(result.counts, { htmlFiles: 2, references: 4, posts: 1 });
});

test('accepts explicit generated index.html post routes', t => {
  const publicDir = fixture(t, { 'post/2022/07/foo/index.html': '<title>Hello</title>' });
  assertNoErrors(checkOutput({ publicDir, posts: [post('post/2022/07/foo/index.html')] }));
});

test('checks every supported resource attribute and srcset candidate', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <SCRIPT SRC="/assets/app.js"></SCRIPT><link href="/assets/style.css">
      <img src="/assets/hero.jpg" data-src="/assets/full.jpg" srcset="/assets/small.jpg 1x, /assets/large.jpg 2x">
      <source src="/assets/media.webm" srcset="/assets/a.webp 400w, /assets/b.webp 800w">
      <video src="/assets/media.mp4" poster="/assets/poster.jpg"></video>
      <audio src="/assets/sound.ogg"></audio><iframe src="/embedded/"></iframe><a href="/readme.txt">Text</a>`,
    'assets/app.js': '', 'assets/style.css': '', 'assets/hero.jpg': '', 'assets/full.jpg': '',
    'assets/small.jpg': '', 'assets/large.jpg': '', 'assets/media.webm': '',
    'assets/a.webp': '', 'assets/b.webp': '', 'assets/media.mp4': '',
    'assets/poster.jpg': '', 'assets/sound.ogg': '', 'embedded/index.html': '', 'readme.txt': ''
  });
  const result = checkOutput({ publicDir });
  assertNoErrors(result);
  assert.deepEqual(result.counts, { htmlFiles: 2, references: 14, posts: 0 });
});

test('reports missing scripts, styles, images, sources, media, frames and links', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <script src="missing.js"></script><link href="missing.css">
      <img src="missing.png" data-src="missing-full.png" srcset="missing-small.png 1x, missing-large.png 2x">
      <source src="missing.webm" srcset="missing-a.webp 400w, missing-b.webp 800w">
      <video src="missing.mp4" poster="missing-poster.jpg"></video>
      <audio src="missing.ogg"></audio><iframe src="missing-frame/"></iframe><a href="missing-page/">Link</a>`
  });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 14);
  assert.ok(result.errors.every(error => /Missing local reference/.test(error)));
  assert.equal(result.counts.references, 14);
});

test('errors on an object serialized into a script src URL', t => {
  const publicDir = fixture(t, { 'index.html': '<script src="[object Object]"></script>' });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Invalid \[object Object\] URL.*script\[src\]/);
});

test('detects encoded, external and srcset object URLs before skipping schemes', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <script src="/%5Bobject%20Object%5D?token=never-echo-this"></script>
      <video poster="https://cdn.test/[object Object]?key=never-echo-this"></video>
      <source srcset="[object Object] 1x, /unused.png 2x">
      <a href="tencent://message/[object Object]?secret=never-echo-this">Broken</a>`
  });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 4);
  assert.ok(result.errors.every(error => /Invalid \[object Object\] URL/.test(error)));
  assert.doesNotMatch(JSON.stringify(result), /never-echo-this/);
});

test('ignores fake tags in inline JavaScript and comments', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <script>const template = '<img src="fake.png"><link href="fake.css"><iframe src="fake.html">';
        const loader = '<script src="fake.js">'; const config = {src: '[object Object]'};</script>
      <!-- <a href="/fake-page/">Hidden</a><source srcset="fake.webp 2x"><img data-src="fake-lazy.png"> -->
      <p>&lt;img src="fake-escaped.png"&gt;</p>`
  });
  const result = checkOutput({ publicDir });
  assertNoErrors(result);
  assert.equal(result.counts.references, 0);
});

test('enforces exact case for file names and directory components on every OS', t => {
  const publicDir = fixture(t, {
    'index.html': '<img src="assets/Photo.PNG"><img src="Assets/photo.png">',
    'Assets/Photo.PNG': '',
    'post/Hello/index.html': '<title>Hello</title>'
  });
  const result = checkOutput({ publicDir, posts: [post('/post/hello/')] });
  assert.equal(result.errors.length, 3);
  assert.ok(result.errors.every(error => /Case mismatch/.test(error)));
});

test('requires exact index.html casing for a directory route', t => {
  const publicDir = fixture(t, {
    'index.html': '<a href="/section/">Section</a>',
    'section/Index.html': '<title>Section</title>'
  });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Case mismatch/);
});

test('does not accept an empty directory as a generated page', t => {
  const publicDir = fixture(t, { 'index.html': '<a href="/empty/">Empty</a>' });
  fs.mkdirSync(path.join(publicDir, 'empty'));
  const result = checkOutput({ publicDir, posts: [post('/empty/')] });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /Missing local reference/);
  assert.match(result.errors[1], /Missing post output/);
});

test('checks same-origin absolute and protocol-relative URLs as local', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <a href="https://EXAMPLE.test:443/post/hello/?token=hidden#top">Post</a>
      <img src="//example.test/assets/photo.png"><script src="https://example.test/assets/app.js?key=hidden"></script>
      <img src="https://other.test/missing.png?token=hidden">`,
    'post/hello/index.html': '<title>Hello | Site</title>',
    'assets/photo.png': '', 'assets/app.js': ''
  });
  const result = checkOutput({ publicDir, siteUrl: 'https://example.test/', posts: [post('/post/hello/')] });
  assertNoErrors(result);
  assert.equal(result.counts.references, 4);
  assert.deepEqual(result.warnings, ['External or custom-scheme references not validated: 1.']);
  assert.doesNotMatch(JSON.stringify(result), /hidden|other\.test/);
});

test('reports missing same-origin assets without credentials or query values', t => {
  const publicDir = fixture(t, {
    'index.html': '<script src="https://private-user:private-password@example.test/missing.js?token=private-token#private-fragment"></script>'
  });
  const result = checkOutput({ publicDir, siteUrl: 'https://example.test/' });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing local reference "missing\.js"/);
  assert.doesNotMatch(JSON.stringify(result), /private-|token=|example\.test/);
});

test('skips tencent and other custom or remote schemes without printing URLs', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <a href="tencent://message/?uin=private-value&amp;Site=private-value">Chat</a>
      <a href="mailto:private-value@example.test">Mail</a><a href="tel:private-value">Phone</a>
      <a href="javascript:void(0)">Action</a><img src="data:image/png;base64,private-value">
      <video src="blob:https://example.test/private-value"></video><img src="//remote.test/private-value">`
  });
  const result = checkOutput({ publicDir });
  assertNoErrors(result);
  assert.equal(result.counts.references, 7);
  assert.deepEqual(result.warnings, ['External or custom-scheme references not validated: 7.']);
  assert.doesNotMatch(JSON.stringify(result), /private-value|remote\.test/);
});

test('ignores query and fragment values for local existence checks', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <script src="assets/app.js?token=private-value&amp;bad=%ZZ#private-value"></script>
      <a href="?token=private-value">Query only</a><a href="#private-value">Fragment only</a>
      <a href="/index.html?token=private-value#private-value">Home</a>
      <img src="missing.png?token=private-value#private-value">`,
    'assets/app.js': ''
  });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing local reference "missing\.png"/);
  assert.equal(result.counts.references, 5);
  assert.doesNotMatch(JSON.stringify(result), /private-value|token=|bad=/);
});

test('decodes UTF-8, spaces, slashes and HTML entities without double decoding or changing plus', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <a href="/%E4%B8%AD%E6%96%87/">Unicode</a><img src="assets/my%20photo%23one.png">
      <img src="assets%2Fplus%2Bphoto.png"><img src="assets/plus+photo.png">
      <img src="assets/literal%2520.png"><img src="assets/a&amp;b.png">`,
    '中文/index.html': '<title>中文</title>',
    'assets/my photo#one.png': '', 'assets/plus+photo.png': '',
    'assets/literal%20.png': '', 'assets/a&b.png': ''
  });
  const result = checkOutput({ publicDir, posts: [post('/%E4%B8%AD%E6%96%87/index.html', '中文')] });
  assertNoErrors(result);
  assert.equal(result.counts.references, 6);
});

test('reports malformed pathname percent encoding without echoing query secrets', t => {
  const publicDir = fixture(t, {
    'index.html': '<img src="/%ZZ.png?key=private-value"><img src="/%E0%A4%A.png?key=private-value">'
  });
  const result = checkOutput({ publicDir });
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.every(error => /Malformed URL path encoding/.test(error)));
  assert.doesNotMatch(JSON.stringify(result), /private-value/);
});

test('rejects literal, encoded and backslash traversal outside public', t => {
  const directory = fixture(t, {
    'public/index.html': String.raw`
      <img src="../outside.png"><img src="/../../outside.png"><img src="/%2e%2e/outside.png">
      <img src="..%2Foutside.png"><img src="..\outside.png"><img src="%2e%2e%5coutside.png">
      <img src="https://example.test/../outside.png?key=private-value">
      <img src="//example.test/%2e%2e/outside.png">`,
    'outside.png': 'This file exists outside public.'
  });
  const result = checkOutput({ publicDir: path.join(directory, 'public'), siteUrl: 'https://example.test/' });
  assert.equal(result.errors.length, 8);
  assert.ok(result.errors.every(error => /URL traversal outside public directory/.test(error)));
  assert.doesNotMatch(JSON.stringify(result), /private-value/);
});

test('rejects a generated post path that traverses outside public', t => {
  const publicDir = fixture(t, { 'index.html': '<title>Hello</title>' });
  const result = checkOutput({ publicDir, posts: [post('../index.html')] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /URL traversal outside public directory/);
});

test('handles srcset descriptors, trailing separators and commas in data URLs', t => {
  const publicDir = fixture(t, {
    'index.html': `
      <img srcset="data:image/svg+xml,%3Csvg%3E%3C/svg%3E 1x, /wide.png 2x">
      <source srcset="/one.png, /two.png 2x, /encoded%2Cname.png 3x,">
      <img srcset="/literal,comma.png 1x, /wide.png 2x">`,
    'wide.png': '', 'one.png': '', 'two.png': '', 'encoded,name.png': '', 'literal,comma.png': ''
  });
  const result = checkOutput({ publicDir });
  assertNoErrors(result);
  assert.equal(result.counts.references, 7);
  assert.deepEqual(result.warnings, ['External or custom-scheme references not validated: 1.']);
});

test('detects duplicate published paths, including directory and encoded aliases', t => {
  const publicDir = fixture(t, { 'post/hello/index.html': '<title>Hello | Site</title>' });
  const result = checkOutput({
    publicDir,
    posts: [post('/post/hello/'), post('post/hello/index.html'), post('/post/%68ello/')]
  });
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.every(error => /Duplicate post path/.test(error)));
  assert.equal(result.counts.posts, 3);
});

test('detects duplicate missing generated paths as well as missing pages', t => {
  const publicDir = fixture(t, { 'index.html': '' });
  const result = checkOutput({ publicDir, posts: [post('post/missing/index.html'), post('post/missing/index.html')] });
  assert.equal(result.errors.filter(error => /Duplicate post path/.test(error)).length, 1);
  assert.equal(result.errors.filter(error => /Missing post output/.test(error)).length, 2);
});

test('requires each published post page to exist independently of other HTML', t => {
  const publicDir = fixture(t, { 'index.html': '<title>Hello</title>' });
  const result = checkOutput({ publicDir, posts: [post('post/missing/index.html')] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing post output/);
});

test('accepts exact and site-suffixed titles with HTML entity decoding', t => {
  const title = '中文 & "quoted" < text';
  const publicDir = fixture(t, {
    'exact/index.html': '<title>中文 &amp; &quot;quoted&quot; &lt; text</title>',
    'suffix/index.html': '<title>中文 &amp; &quot;quoted&quot; &lt; text | Site</title>'
  });
  assertNoErrors(checkOutput({ publicDir, posts: [post('/exact/', title), post('/suffix/', title)] }));
});

test('rejects wrong titles, loose prefixes and non-pipe separators', t => {
  const publicDir = fixture(t, {
    'wrong/index.html': '<title>Wrong article | Site</title>',
    'prefix/index.html': '<title>Hello extra | Site</title>',
    'separator/index.html': '<title>Hello - Site</title>'
  });
  const result = checkOutput({ publicDir, posts: [post('/wrong/'), post('/prefix/'), post('/separator/')] });
  assert.equal(result.errors.length, 3);
  assert.ok(result.errors.every(error => /Post title mismatch/.test(error)));
});

test('reports missing titles rather than accepting an unrelated heading', t => {
  const publicDir = fixture(t, { 'post/hello/index.html': '<h1>Hello</h1>' });
  const result = checkOutput({ publicDir, posts: [post('/post/hello/')] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing readable HTML title/);
});

test('returns structured errors for a missing output directory or invalid posts input', t => {
  const publicDir = fixture(t, { 'index.html': '' });
  const missing = checkOutput({ publicDir: path.join(publicDir, 'not-generated'), posts: [post('/hello/')] });
  assert.match(missing.errors[0], /Cannot read output directory/);
  assert.deepEqual(missing.counts, { htmlFiles: 0, references: 0, posts: 1 });
  const invalid = checkOutput({ publicDir, posts: null });
  assert.equal(invalid.errors.length, 1);
  assert.match(invalid.errors[0], /posts must be an array/);
});
