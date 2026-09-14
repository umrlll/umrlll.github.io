'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');
const {
  root, readYaml, validateConfiguration, publishedPosts,
  assertUsableTitle, draftTitleRoundTrips, report
} = require('./lib/project.cjs');
const { verifyTheme } = require('./setup.cjs');
const { checkPosts } = require('./lib/post-check.cjs');
const { checkOutput } = require('./lib/output-check.cjs');

const COMMANDS = ['build', 'clean', 'check-posts', 'check-output', 'new', 'deploy'];

async function main() {
  const command = process.argv[2];
  if (!COMMANDS.includes(command)) {
    throw new Error(`Usage: node tools/site.cjs ${COMMANDS.join('|')}`);
  }
  // No deployment, network push, or cleaning is possible without this explicit flag.
  if (command === 'deploy' && !(process.argv.length === 4 && process.argv[3] === '--confirm')) {
    throw new Error('Deployment is opt-in: npm run deploy -- --confirm. Nothing was built or pushed.');
  }
  const lock = verifyTheme(root);
  const configFile = path.join(root, `_config.${lock.name}.yml`);
  if (!fs.existsSync(configFile)) throw new Error('Local theme config missing. Run npm run setup first.');
  report(validateConfiguration(readYaml(path.join(root, '_config.yml')), readYaml(configFile), lock), 'config');

  const hexo = new Hexo(root, { silent: true });
  let loggedErrors = 0;
  const originalError = hexo.log.error.bind(hexo.log);
  hexo.log.error = (...args) => { loggedErrors++; originalError(...args); };
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'config/validation.json'), 'utf8'));
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'config/post-urls.json'), 'utf8'));
  let posts = [];
  try {
    await hexo.init();
    // Only the known generated output may be removed by this tool.
    const assertExpectedOutput = () => {
      if (path.resolve(hexo.public_dir) !== path.join(root, 'public')) {
        throw new Error('Refusing to touch an unexpected output directory.');
      }
    };
    if (command === 'clean') {
      assertExpectedOutput();
      await hexo.call('clean');
      console.log('Cleaned the generated output directory and database cache.');
      return;
    }
    if (command === 'new') {
      const title = process.argv.slice(3).join(' ').trim();
      assertUsableTitle(title);
      const result = await hexo.post.create({ title, layout: 'draft' });
      if (!draftTitleRoundTrips(result.path, title)) {
        throw new Error(`Draft written to ${path.relative(root, result.path)}, but its title/urlname did not parse back exactly. `
          + 'Fix or delete that file, then retry with a simpler title.');
      }
      console.log(`Draft created: ${path.relative(root, result.path)}. Fill the body and review date/urlname/cover before publishing.`);
      return;
    }
    // Runs while Hexo generates: post URLs are final by then, and a failing
    // check throws inside the hook so generate --bail stops the build.
    hexo.extend.filter.register('before_generate', () => {
      posts = publishedPosts(hexo);
      report(checkPosts({ sourceDir: hexo.source_dir, posts, baseline, emptyPostAllowlist: policy.emptyPostAllowlist }), 'posts');
    });

    if (command === 'build' || command === 'deploy') {
      assertExpectedOutput();
      await hexo.call('clean');
      await hexo.call('generate', { bail: true, force: true });
    } else {
      await hexo.load();
    }
    if (loggedErrors) throw new Error(`Hexo logged ${loggedErrors} error(s); build is not publishable.`);
    if (command !== 'check-posts') {
      report(checkOutput({ publicDir: hexo.public_dir, posts, siteUrl: hexo.config.url }), 'output');
      console.log(`[PASS URLs] ${Object.keys(baseline).length} existing article URLs preserved.`);
    }
    if (command === 'deploy') await hexo.call('deploy');
    else console.log('No deployment performed.');
  } finally {
    await hexo.exit();
  }
}

main().catch(error => { console.error(`[STOP] ${error.message}`); process.exitCode = 1; });
