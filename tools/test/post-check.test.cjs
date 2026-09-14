'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { checkPosts } = require('../lib/post-check.cjs');

const defaults = {
  title: '文章标题',
  date: '2022-07-25 22:07:16',
  urlname: '文章标题'
};

function fixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hexo-post-check-'));
  const sourceDir = path.join(temporary, 'source');
  fs.mkdirSync(sourceDir);
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  return {
    sourceDir,
    post(source = '_posts/example.md', options = {}) {
      const metadata = Object.entries({ ...defaults, ...options.metadata })
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`).join('\n');
      const body = options.body === undefined ? 'Actual article content.\n' : options.body;
      const text = options.raw === undefined ? `---\n${metadata}\n---\n${body}` : options.raw;
      const file = path.join(sourceDir, source);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
      return {
        source,
        path: options.route === undefined ? 'post/2022/07/example/index.html' : options.route,
        title: 'Hexo-derived fallback title'
      };
    },
    check(posts, options = {}) {
      return checkPosts({ sourceDir, posts, ...options });
    }
  };
}

function hasError(result, pattern) {
  assert.ok(result.errors.some(error => pattern.test(error)), JSON.stringify(result, null, 2));
  assert.ok(result.errors.every(error => typeof error === 'string'));
  assert.ok(result.warnings.every(warning => typeof warning === 'string'));
}

function passes(result, count = 1) {
  assert.deepEqual(result, { errors: [], warnings: [], counts: { posts: count } });
}

test('synchronous checker reads original metadata and leaves the source untouched', t => {
  const f = fixture(t);
  const post = f.post('_posts/中文文章.md', { metadata: { tags: '', categories: '' } });
  const file = path.join(f.sourceDir, post.source);
  const original = fs.readFileSync(file, 'utf8');
  const result = f.check([post]);
  assert.equal(result instanceof Promise, false);
  passes(result);
  assert.equal(fs.readFileSync(file, 'utf8'), original);
  assert.deepEqual(Object.keys(require('../lib/post-check.cjs')), ['checkPosts']);
});

for (const field of ['title', 'date', 'urlname']) {
  for (const [label, value] of [
    ['missing', undefined], ['bare', ''], ['null', 'null'], ['tilde null', '~'],
    ['empty string', '""'], ['blank string', '"   "'], ['quoted null', '"null"'],
    ['quoted undefined', '"undefined"'], ['boolean', 'false'], ['list', '[value]'],
    ['object', '{ value: bad }'], ['placeholder', '"{{ title }}"']
  ]) {
    test(`rejects ${label} original ${field}`, t => {
      const f = fixture(t);
      const post = f.post(undefined, { metadata: { [field]: value } });
      post.date = new Date('2022-07-25T22:07:16Z');
      hasError(f.check([post]), new RegExp(field));
    });
  }
}

test('original front matter is required even when Hexo supplied title and date', t => {
  const f = fixture(t);
  const post = f.post(undefined, { raw: 'Article with no front matter.\n' });
  post.date = new Date();
  const result = f.check([post]);
  for (const field of ['front matter', 'title', 'date', 'urlname']) hasError(result, new RegExp(field));
});

test('rejects nested optional metadata placeholders, not examples in article content', t => {
  const f = fixture(t);
  const post = f.post(undefined, {
    metadata: { tags: '["{{ tag }}"]', custom: '{ nested: "{{ value }}" }' },
    body: 'Example: `{{ template_variable }}`.'
  });
  const result = f.check([post]);
  hasError(result, /tags.*placeholder/);
  hasError(result, /custom.*placeholder/);
  const valid = f.post(undefined, { body: 'Example: `{{ template_variable }}`.' });
  passes(f.check([valid]));
});

for (const value of [
  '2022-07-25 22:07:16', '2022-07-25', '2024-02-29',
  '2026-09-14 19:58:24', '2022-07-25T22:07:16Z',
  '2022-07-25T22:07:16.123+08:00', '"2022-07-25 22:07"',
  '2022-7-5 9:8:7', '"Mon, 25 Jul 2022 22:07:16 +0800"'
]) {
  test(`accepts valid original date ${value}`, t => {
    const f = fixture(t);
    passes(f.check([f.post(undefined, { metadata: { date: value } })]));
  });
}

for (const value of [
  '2022-02-29', '2022-02-30', '2022-04-31', '2022-13-01', '2022-00-01',
  '2022-07-25 25:00:00', '2022-07-25 12:61:00', 'not-a-date',
  '"2022-07-25 trailing garbage"', '1658760000000'
]) {
  test(`rejects invalid original date ${value} without YAML or filesystem repair`, t => {
    const f = fixture(t);
    const post = f.post(undefined, { metadata: { date: value } });
    post.date = new Date();
    hasError(f.check([post]), /date/);
  });
}

test('supports BOM/CRLF, Hexo front matter without a prefix, and JSON front matter', t => {
  const f = fixture(t);
  for (const raw of [
    '\uFEFF---\r\ntitle: 中文\r\ndate: 2022-07-25 22:07:16\r\nurlname: 中文\r\n---\r\nBody.\r\n',
    'title: 中文\ndate: 2022-07-25 22:07:16\nurlname: 中文\n---\nBody.\n',
    ';;;\n"title": "中文", "date": "2022-07-25", "urlname": "中文"\n;;;\nBody.\n'
  ]) passes(f.check([f.post(undefined, { raw })]));
});

test('Chinese and C# metadata stay valid; only the generated path controls collision checks', t => {
  const f = fixture(t);
  const first = f.post('_posts/C#基础/C#基础.md', {
    metadata: { title: 'C#基础', urlname: 'C#基础', date: '2026-09-14 19:58:24' },
    route: '/post/2026/09/c-ji-chu/'
  });
  const second = f.post('_posts/另一篇.md', {
    metadata: { title: 'C#基础', urlname: 'C#基础' }, route: '/post/2022/07/c-ji-chu/'
  });
  passes(f.check([first, second]), 2);
});

test('explicit index urlname preserves the published Hello World URL', t => {
  const f = fixture(t);
  const post = f.post('_posts/hello-world.md', {
    metadata: { title: 'Hello World', urlname: 'index', date: '2022-06-22 18:45:04' },
    route: '/post/2022/06/index/'
  });
  passes(f.check([post], { baseline: { [post.source]: 'post/2022/06/index/index.html' } }));
});

test('different Chinese slugs with duplicate final pinyin paths collide', t => {
  const f = fixture(t);
  const posts = [
    f.post('_posts/龙.md', { metadata: { title: '龙', urlname: '龙' }, route: '/post/2022/07/long/' }),
    f.post('_posts/笼.md', { metadata: { title: '笼', urlname: '笼' }, route: '/post/2022/07/long/' })
  ];
  hasError(f.check(posts), /final path collision/);
});

for (const [first, second] of [
  ['post/Example/index.html', 'post/example/index.html'],
  ['post/example/index.html', 'post/%65xample/index.html'],
  ['post/EXAMPLE/index.html', 'post/%65xample/index.html'],
  ['post/example/index.html', 'post/%2565xample/index.html'],
  ['post/example/index.html', '/post/example/'],
  ['post/中文/index.html', '/post/%E4%B8%AD%E6%96%87/'],
  ['post/a/b/index.html', 'post/a%2fb/index.html']
]) {
  test(`detects normalized route aliases: ${first} and ${second}`, t => {
    const f = fixture(t);
    const result = f.check([
      f.post('_posts/a.md', { route: first }), f.post('_posts/b.md', { route: second })
    ]);
    hasError(result, /final path collision/);
  });
}

for (const route of [
  null, undefined, '', '   ', 7, '/', '../post/name/', '/post/../name/',
  'post/./name/', 'post/%2e%2e/name/', 'post/%252e%252e/name/',
  'post/a%2f..%2fname/', 'post//name/', '//other.example/post/',
  'https://other.example/post/', 'C:/post/name/', 'post\\name\\index.html',
  'post/%5cname/', 'post/name/?page=1', 'post/name/#fragment',
  'post/name%3fpage=1/', 'post/name%23fragment/', 'post/name%253fpage=1/',
  'post/name%00/', 'post/name\n/', ' post/name/', 'post/%/',
  'post/%ZZ/', 'post/%E4/', 'post/{{ urlname }}/',
  'post/null/index.html', 'post/UNDEFINED/index.html', 'post/%6eull/',
  'post/undefined.html'
]) {
  test(`rejects unsafe or absent final route ${JSON.stringify(route)}`, t => {
    const f = fixture(t);
    const post = f.post();
    post.path = route;
    hasError(f.check([post]), /final path/);
  });
}

test('allows ordinary slugs containing null or undefined as part of another word', t => {
  const f = fixture(t);
  passes(f.check([f.post(undefined, { route: '/post/nullability-and-undefined-behavior/' })]));
});

test('equivalent safe directory, file and encoded baseline routes pass', t => {
  const f = fixture(t);
  const post = f.post(undefined, { route: '/post/中文/' });
  for (const previous of ['/post/中文/', 'post/中文/index.html', 'post/%E4%B8%AD%E6%96%87/index.html']) {
    passes(f.check([post], { baseline: { [post.source]: previous } }));
  }
});

test('rejects baseline URL changes, including casing changes', t => {
  const f = fixture(t);
  const post = f.post();
  for (const previous of ['/post/2022/07/old/', '/post/2022/07/Example/']) {
    hasError(f.check([post], { baseline: { [post.source]: previous } }), /published URL changed/);
  }
});

test('rejects removed and renamed published sources, even if the route survives', t => {
  const f = fixture(t);
  const oldSource = '_posts/previously-published.md';
  const current = f.post('_posts/renamed.md');
  const baseline = { [oldSource]: current.path };
  hasError(f.check([], { baseline }), /previously published source is missing/);
  hasError(f.check([current], { baseline }), /previously published source is missing/);
});

test('allows a new valid post alongside unchanged published posts', t => {
  const f = fixture(t);
  const old = f.post('_posts/old.md');
  const added = f.post('_posts/new.md', { route: '/post/2026/09/new/' });
  passes(f.check([old, added], { baseline: { [old.source]: old.path } }), 2);
});

for (const body of ['', ' \n\t\n', '<!-- more -->', '<!-- comment\nonly -->\n<!-- another -->',
  '<!-- unfinished comment', '[//]: # (This is a Markdown comment)\n']) {
  test(`rejects empty or comment-only body ${JSON.stringify(body)}`, t => {
    const f = fixture(t);
    hasError(f.check([f.post(undefined, { body })]), /body is empty/);
  });
}

test('comments alongside content and code examples do not cause false empty-body errors', t => {
  const f = fixture(t);
  for (const body of ['<!-- note -->\nActual text.\n<!-- more -->', '```html\n<!-- example -->\n```']) {
    passes(f.check([f.post(undefined, { body })]));
  }
});

test('warns only for the exact allowlisted empty source and includes the reason', t => {
  const f = fixture(t);
  const source = '_posts/MySQL8_base/运算符.md';
  const empty = f.post(source, { body: '<!-- more -->\n' });
  const options = { emptyPostAllowlist: { [source]: 'Existing published placeholder retained without URL changes.' } };
  const result = f.check([empty], options);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /运算符.*Existing published placeholder/);
  assert.equal(result.counts.posts, 1);
  const other = f.post('_posts/another/运算符.md', { body: '', route: '/post/other/' });
  const mixed = f.check([empty, other], options);
  hasError(mixed, /another\/运算符.md.*body is empty/);
  assert.equal(mixed.warnings.length, 1);
});

for (const key of ['*', '_posts/*', '_posts/*.md', '_posts/', 'empty.md']) {
  test(`no blanket, directory, or basename empty-body allowance: ${key}`, t => {
    const f = fixture(t);
    const post = f.post('_posts/empty.md', { body: '' });
    const result = f.check([post], { emptyPostAllowlist: { [key]: 'Legacy placeholders' } });
    hasError(result, /body is empty/);
    assert.deepEqual(result.warnings, []);
  });
}

for (const reason of ['', '   ', null, true, {}]) {
  test(`empty-source exception requires a meaningful string reason: ${JSON.stringify(reason)}`, t => {
    const f = fixture(t);
    const post = f.post(undefined, { body: '' });
    const result = f.check([post], { emptyPostAllowlist: { [post.source]: reason } });
    hasError(result, /nonempty reason/);
    hasError(result, /body is empty/);
    assert.deepEqual(result.warnings, []);
  });
}

test('inherited allowlist entries and allowEmpty front matter cannot suppress empty-body errors', t => {
  const f = fixture(t);
  const post = f.post(undefined, { body: '', metadata: { allowEmpty: 'true', 'allow-empty': 'true' } });
  const emptyPostAllowlist = Object.create({ [post.source]: 'Inherited blanket permission' });
  hasError(f.check([post], { emptyPostAllowlist }), /body is empty/);
});

test('an empty-body exception does not exempt metadata, URL preservation, or missing sources', t => {
  const f = fixture(t);
  const post = f.post(undefined, { body: '', metadata: { urlname: undefined } });
  const options = {
    emptyPostAllowlist: { [post.source]: 'Existing placeholder' },
    baseline: { [post.source]: '/post/original/' }
  };
  const result = f.check([post], options);
  hasError(result, /urlname/);
  hasError(result, /published URL changed/);
  assert.equal(result.warnings.length, 1);
  hasError(f.check([], options), /previously published source is missing/);
});

test('parse errors do not expose original source excerpts', t => {
  const f = fixture(t);
  const secretMarker = 'DO_NOT_PRINT_PRIVATE_FIXTURE_CONTENT';
  const post = f.post(undefined, { raw: `---\ntitle: [${secretMarker}\ndate: 2022-07-25\nurlname: test\n---\nBody.` });
  const result = f.check([post]);
  hasError(result, /cannot parse original front matter/);
  assert.equal(JSON.stringify(result).includes(secretMarker), false);
});

test('missing original files and duplicate sources fail without throwing', t => {
  const f = fixture(t);
  const post = f.post();
  hasError(f.check([post, post]), /duplicate published source/);
  fs.unlinkSync(path.join(f.sourceDir, post.source));
  hasError(f.check([post], { baseline: { [post.source]: post.path } }), /cannot read original post/);
});

test('rejects source traversal and invalid input records', t => {
  const f = fixture(t);
  for (const source of ['../outside.md', '/outside.md', 'C:/outside.md', '_posts/../outside.md', '', null]) {
    hasError(f.check([{ source, path: '/post/name/' }]), /unsafe source path/);
  }
  hasError(f.check([null]), /unsafe source path/);
  hasError(checkPosts({ sourceDir: f.sourceDir, posts: null }), /posts must/);
  hasError(checkPosts({ posts: [] }), /sourceDir/);
  hasError(f.check([], { baseline: null }), /baseline must/);
  hasError(f.check([], { emptyPostAllowlist: true }), /emptyPostAllowlist must/);
  passes(f.check([]), 0);
});
