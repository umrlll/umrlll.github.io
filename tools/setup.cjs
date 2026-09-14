'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');

function gitExecutable() {
  const candidates = [process.env.GIT_EXECUTABLE, 'git'];
  if (process.platform === 'win32') {
    candidates.push(path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Git/cmd/git.exe'));
  }
  for (const candidate of candidates.filter(Boolean)) {
    const result = spawnSync(candidate, ['--version'], { stdio: 'ignore', windowsHide: true });
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error('Git not found. Install Git or set GIT_EXECUTABLE to its executable path.');
}

function runGit(git, args, cwd, capture = false, root = ROOT) {
  let scratch;
  let fd;
  try {
    if (capture) {
      const cache = path.join(root, '.cache/site-tools');
      fs.mkdirSync(cache, { recursive: true });
      scratch = fs.mkdtempSync(path.join(cache, 'git-'));
      fd = fs.openSync(path.join(scratch, 'stdout'), 'w+');
    }
    // File descriptors/inherited stdio avoid named-pipe capture on Windows.
    const result = spawnSync(git, args, {
      cwd,
      stdio: ['ignore', capture ? fd : 'inherit', 'inherit'],
      windowsHide: true,
      // Never let a scripted setup block on an interactive credential prompt.
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' }
    });
    if (result.error || result.status !== 0) throw new Error(`Git ${args[0]} failed (exit ${result.status ?? 'unavailable'}).`);
    return capture ? fs.readFileSync(path.join(scratch, 'stdout'), 'utf8').trim() : '';
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    if (scratch) fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function readLock(root) {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'config/theme-lock.json'), 'utf8'));
  if (!/^[a-f0-9]{40}$/.test(lock.commit) || !/^[A-Za-z0-9_-]+$/.test(lock.name) || lock.directory !== `themes/${lock.name}`) {
    throw new Error('Invalid theme lock: require a full commit SHA and matching themes/<name> directory.');
  }
  // This file is versioned, so it must not be able to smuggle a git transport
  // helper (ext::) or a leading "-" that git would read as an option.
  if (typeof lock.repository !== 'string' || !lock.repository.trim()
      || lock.repository.startsWith('-') || lock.repository.includes('::')) {
    throw new Error('Invalid theme lock: repository must be a plain https/ssh/git@ URL or local path.');
  }
  return lock;
}

function examplePath(root, lock) {
  return path.join(root, `config/${lock.name.toLowerCase()}.example.yml`);
}

function verifyTheme(root = ROOT) {
  const lock = readLock(root);
  const dir = path.join(root, lock.directory);
  const parent = path.dirname(dir);
  const parentEntries = fs.existsSync(parent) ? fs.readdirSync(parent) : [];
  // Enforce the documented exact-case layout instead of relying on Windows/macOS
  // case-insensitive filesystem lookups.
  if (!parentEntries.includes(path.basename(dir))) {
    throw new Error(`${lock.directory} is missing (or differently cased). Run npm run setup.`);
  }
  if (!fs.existsSync(path.join(dir, '.git'))) {
    throw new Error(`${lock.directory} exists but is not a pinned git checkout. Move or delete it yourself; this command will not touch it.`);
  }
  const git = gitExecutable();
  const head = runGit(git, ['rev-parse', '--verify', 'HEAD'], dir, true, root);
  if (head !== lock.commit) throw new Error('Theme HEAD differs from config/theme-lock.json. Existing checkout was not changed.');
  const dirty = runGit(git, ['status', '--porcelain', '--untracked-files=all'], dir, true, root);
  if (dirty) throw new Error('Theme has local changes. Back them up/review them; setup never resets or discards them.');
  return lock;
}

function setup(root = ROOT) {
  const lock = readLock(root);
  const destination = path.join(root, lock.directory);
  const example = examplePath(root, lock);
  if (!fs.existsSync(example)) {
    throw new Error(`Recovery template missing: config/${lock.name.toLowerCase()}.example.yml.`);
  }
  if (!fs.existsSync(destination)) {
    const git = gitExecutable();
    const parent = path.dirname(destination);
    fs.mkdirSync(parent, { recursive: true });
    const temporary = fs.mkdtempSync(path.join(parent, '.theme-setup-'));
    try {
      runGit(git, ['clone', '--no-checkout', '--', lock.repository, temporary], root, false, root);
      runGit(git, ['checkout', '--detach', lock.commit], temporary, false, root);
      fs.renameSync(temporary, destination);
    } finally {
      // Only ever remove our own temporary directory, never the destination.
      if (fs.existsSync(temporary)) fs.rmSync(temporary, { recursive: true, force: true });
    }
  }
  verifyTheme(root);
  const local = path.join(root, `_config.${lock.name}.yml`);
  if (!fs.existsSync(local)) {
    fs.copyFileSync(example, local, fs.constants.COPYFILE_EXCL);
    console.log('Created local theme config from the credential-free example. Configure comments locally if required.');
  } else {
    console.log('Existing local theme config preserved (not overwritten).');
  }
  console.log(`Theme verified: ${lock.name} ${lock.commit.slice(0, 12)}. No source files staged or committed.`);
}

if (require.main === module) {
  try { setup(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { setup, verifyTheme, readLock, examplePath, runGit, gitExecutable };
