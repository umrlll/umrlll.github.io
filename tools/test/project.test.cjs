'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const Hexo = require('hexo');
const { root, yaml, readYaml, normalizeDirectory, validateConfiguration, publishedPosts, assertUsableTitle, draftTitleRoundTrips } = require('../lib/project.cjs');
const { sanitize, suspectPaths, exampleText } = require('../config-example.cjs');
const { setup, verifyTheme, readLock, gitExecutable, runGit } = require('../setup.cjs');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'config/theme-lock.json'), 'utf8'));

const baseConfig = { theme: lock.name, public_dir: 'public', source_dir: 'source', render_drafts: false };
test('published post collection invalidates partial Hexo locals before URL validation', () => {
  let stale = true;
  const locals = {
    invalidate() { stale = false; },
    get(name) {
      assert.equal(name, 'posts');
      return { toArray: () => stale ? [] : [{ source: '_posts/a.md', path: '/post/a/', title: 'A' }] };
    }
  };
  assert.deepEqual(publishedPosts({ locals }), [{ source: '_posts/a.md', path: '/post/a/', title: 'A' }]);
});

test('CDN overrides reject object/boolean values instead of making object Object URLs', () => {
  for (const bad of [{ enable: true }, true, 123, '']) {
    assert.equal(validateConfiguration(baseConfig, { CDN: { option: { local_search: bad } } }, lock).errors.length, 1);
  }
  assert.equal(validateConfiguration(baseConfig, { CDN: { option: { local_search: null, main: '/js/main.js' } } }, lock).errors.length, 0);
});

test('configuration refuses unsafe build paths, theme case mismatch and published drafts', () => {
  assert.equal(validateConfiguration({ ...baseConfig, theme: 'butterfly', public_dir: '../outside', render_drafts: true }, {}, lock).errors.length, 3);
});

test('credential examples redact nested credentials without mutating original config', () => {
  const source = { gitalk: { client_id: 'private-test-id', client_secret: 'private-test-secret', owner: 'author' }, nested: [{ accessKeyId: 'id', SecretKey: 'key', api_token: 'token' }], local_search: { enable: true } };
  const result = sanitize(source);
  assert.equal(result.gitalk.client_secret, '');
  assert.equal(result.gitalk.client_id, '');
  assert.equal(result.nested[0].SecretKey, '');
  assert.equal(result.nested[0].api_token, '');
  assert.equal(result.local_search.enable, true);
  assert.equal(source.gitalk.client_secret, 'private-test-secret');
  assert.deepEqual(yaml.load(exampleText(source)), result);
});

test('versioned example matches sanitized active settings without containing credentials', () => {
  assert.deepEqual(readYaml(path.join(root, 'config/butterfly.example.yml')), sanitize(readYaml(path.join(root, '_config.Butterfly.yml'))));
});

test('post and draft scaffolds provide nonempty title-based urlname and explicit date', async () => {
  const hexo = new Hexo(root, { silent: true });
  await hexo.init();
  try {
    for (const layout of ['post', 'draft']) {
      for (const title of ['C#基础', '学习: 基础']) {
        const rendered = await hexo.post._renderScaffold({ title, layout, date: new Date('2026-09-14T00:00:00Z') });
        const matter = require('node:module').createRequire(require.resolve('hexo/package.json'))('hexo-front-matter').parse(rendered);
        assert.equal(matter.title, title);
        assert.equal(matter.urlname, title);
        assert.ok(matter.date);
      }
    }
  } finally { await hexo.exit(); }
});

test('setup restores exact commit from a local fixture, preserves settings and refuses dirty/wrong commits', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'site-setup-test-'));
  try {
    const repo = path.join(fixture, 'upstream');
    const project = path.join(fixture, 'project');
    fs.mkdirSync(repo);
    fs.mkdirSync(path.join(project, 'config'), { recursive: true });
    const git = gitExecutable();
    runGit(git, ['init', '--quiet'], repo, false, fixture);
    fs.writeFileSync(path.join(repo, 'theme.txt'), 'pinned theme\n');
    runGit(git, ['add', 'theme.txt'], repo, false, fixture);
    runGit(git, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'fixture'], repo, false, fixture);
    const commit = runGit(git, ['rev-parse', 'HEAD'], repo, true, fixture);
    fs.writeFileSync(path.join(project, 'config/theme-lock.json'), JSON.stringify({ name: 'Butterfly', directory: 'themes/Butterfly', repository: repo, commit }));
    fs.writeFileSync(path.join(project, 'config/butterfly.example.yml'), 'gitalk:\n  client_secret: ""\n');
    setup(project);
    assert.equal(verifyTheme(project).commit, commit);
    const local = path.join(project, '_config.Butterfly.yml');
    fs.writeFileSync(local, 'local settings must be preserved\n');
    setup(project);
    assert.equal(fs.readFileSync(local, 'utf8'), 'local settings must be preserved\n');
    const checkout = path.join(project, 'themes/Butterfly');
    fs.writeFileSync(path.join(checkout, 'theme.txt'), 'uncommitted customizations\n');
    assert.throws(() => setup(project), /local changes/);
    assert.equal(fs.readFileSync(path.join(checkout, 'theme.txt'), 'utf8'), 'uncommitted customizations\n');
    runGit(git, ['add', 'theme.txt'], checkout, false, fixture);
    runGit(git, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'different commit'], checkout, false, fixture);
    assert.throws(() => setup(project), /HEAD differs/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});

test('title guard rejects YAML-hostile titles and accepts normal ones', () => {
  for (const bad of ['Java 8 新特性 #1', '*star', '!tag', '>quote', '|pipe', '@at', '`tick', '%percent', '#hash', '- 横线', '[bracket]', '{括号}', '&anchor', 'null', 'true', '123', '2026-09-14', '', 'two\nlines']) {
    assert.throws(() => assertUsableTitle(bad), Error, `expected rejection: ${bad}`);
  }
  for (const good of ['C#基础', '学习: 基础', 'MySQL 笔记', '运算符', 'Java 8 新特性']) {
    assert.doesNotThrow(() => assertUsableTitle(good), `expected acceptance: ${good}`);
  }
});

test('a written draft whose title was mangled is detected, not silently accepted', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'draft-check-'));
  try {
    const file = path.join(fixture, 'draft.md');
    fs.writeFileSync(file, '---\ntitle: Java 8 新特性\nurlname: Java 8 新特性\n---\n\n正文\n');
    assert.equal(draftTitleRoundTrips(file, 'Java 8 新特性 #1'), false);
    assert.equal(draftTitleRoundTrips(file, 'Java 8 新特性'), true);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});

test('directory guard accepts Hexo-valid spellings and rejects a different path', () => {
  assert.equal(normalizeDirectory('public/'), 'public');
  assert.equal(normalizeDirectory('./public'), 'public');
  assert.equal(normalizeDirectory('source\\'), 'source');
  assert.equal(validateConfiguration({ ...baseConfig, public_dir: 'public/', source_dir: './source' }, {}, lock).errors.length, 0);
  assert.equal(validateConfiguration({ ...baseConfig, public_dir: '../outside/' }, {}, lock).errors.length, 1);
});

test('CDN guard rejects serialized/boolean strings and accepts URLs or null', () => {
  for (const bad of ['true', 'undefined', 'object Object', 'object', '   ']) {
    assert.equal(validateConfiguration(baseConfig, { CDN: { option: { local_search: bad } } }, lock).errors.length, 1, bad);
  }
  const good = { CDN: { option: { local_search: null, main: '/js/main.js', third: 'https://cdn.example/x.js' } } };
  assert.equal(validateConfiguration(baseConfig, good, lock).errors.length, 0);
});

test('theme lock refuses transport helpers and git option injection', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lock-check-'));
  try {
    fs.mkdirSync(path.join(fixture, 'config'), { recursive: true });
    const file = path.join(fixture, 'config/theme-lock.json');
    const base = { name: 'Butterfly', directory: 'themes/Butterfly', commit: 'a'.repeat(40) };
    for (const repository of ['ext::sh -c whoami', 'transport::evil', '--upload-pack=evil', '']) {
      fs.writeFileSync(file, JSON.stringify({ ...base, repository }));
      assert.throws(() => readLock(fixture), Error, `expected rejection: ${repository}`);
    }
    for (const repository of ['https://github.com/jerryc127/hexo-theme-butterfly.git', 'git@github.com:jerryc127/hexo-theme-butterfly.git', 'file:///tmp/theme']) {
      fs.writeFileSync(file, JSON.stringify({ ...base, repository }));
      assert.equal(readLock(fixture).commit, base.commit);
    }
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});

test('setup explains an existing non-git theme directory instead of looping forever', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-nongit-'));
  try {
    fs.mkdirSync(path.join(fixture, 'config'), { recursive: true });
    fs.mkdirSync(path.join(fixture, 'themes/Butterfly'), { recursive: true });
    fs.writeFileSync(path.join(fixture, 'config/theme-lock.json'), JSON.stringify({
      name: 'Butterfly', directory: 'themes/Butterfly', repository: 'https://example.invalid/theme.git', commit: 'a'.repeat(40)
    }));
    fs.writeFileSync(path.join(fixture, 'config/butterfly.example.yml'), 'gitalk:\n  client_secret: ""\n');
    assert.throws(() => setup(fixture), /not a pinned git checkout/);
    assert.throws(() => setup(fixture), /not a pinned git checkout/);
    assert.ok(fs.existsSync(path.join(fixture, 'themes/Butterfly')), 'directory must not be removed');
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});

test('config example keeps non-plain values instead of collapsing them to {}', () => {
  const date = new Date('2020-01-01T00:00:00Z');
  const result = sanitize({ footer: { since: date }, gitalk: { client_secret: 'x' } });
  assert.ok(result.footer.since instanceof Date);
  assert.equal(result.gitalk.client_secret, '');
  assert.deepEqual(suspectPaths({ a: { b: `ghp_${'A'.repeat(20)}` }, c: 'plain' }), ['a.b']);
  assert.deepEqual(suspectPaths({ a: 'plain value' }), []);
});

test('deploy requires explicit confirmation before any build or push', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'tools/site.cjs'), 'deploy'], { cwd: root, stdio: 'ignore' });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
});
