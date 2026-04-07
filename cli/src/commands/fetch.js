const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { BASE_RAW_URL } = require('../constants');
const { findComponent, listComponents, suggestSimilar } = require('../registry');
const { bold, dim, green, cyan, white, banner, error, success, info, componentCard } = require('../display');
const { VERSION } = require('../constants');

async function fetchCommand(key) {
  banner(VERSION);

  if (!key) {
    error('Please specify a component key.');
    console.log(`  ${dim('Usage:')} vibe-ui fetch ${cyan('<key>')}`);
    console.log(`  ${dim('Example:')} vibe-ui fetch gradient-wave`);
    console.log('');
    console.log(`  ${dim('Run')} vibe-ui list ${dim('to see all available components.')}`);
    console.log('');
    process.exit(1);
  }

  console.log(`  Fetching ${cyan(key)}...`);
  console.log('');

  const component = await findComponent(key);

  if (!component) {
    error(`Component "${key}" not found.`);

    const all = await listComponents();
    const suggestions = suggestSimilar(key, all);

    if (suggestions.length > 0) {
      console.log(`  ${dim('Did you mean:')}`);
      console.log('');
      for (const s of suggestions) {
        console.log(`    ${green(s.key)} ${dim('—')} ${s.name}`);
      }
      console.log('');
    }

    console.log(`  ${dim('Run')} vibe-ui list ${dim('to see all available components.')}`);
    console.log('');
    process.exit(1);
  }

  // Create output directory
  const outDir = path.join(process.cwd(), key);
  await fs.mkdir(outDir, { recursive: true });

  // Download each file (try local first, then remote)
  const downloaded = [];
  // __dirname = cli/src/commands → ../../.. = repo root
  const localBase = path.resolve(__dirname, '..', '..', '..', 'components');

  for (const file of component.files) {
    const localFile = path.join(localBase, component.category, component.key, file);

    try {
      let content;
      if (fsSync.existsSync(localFile)) {
        content = await fs.readFile(localFile, 'utf-8');
      } else {
        const url = `${BASE_RAW_URL}/${component.category}/${component.key}/${file}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        content = await res.text();
      }
      const outPath = path.join(outDir, file);
      await fs.writeFile(outPath, content, 'utf-8');
      downloaded.push(file);
    } catch (e) {
      error(`Failed to download ${file}: ${e.message}`);
    }
  }

  if (downloaded.length === 0) {
    error('No files were downloaded.');
    process.exit(1);
  }

  // Success output
  const badges = [];
  if (component.cssOnly) badges.push(cyan(' CSS only'));
  const badgeStr = badges.join('');

  success(bold(white(component.name)) + badgeStr);
  console.log(`  ${dim(component.description)}`);
  console.log('');
  console.log(`  ${dim('Category')}  ${component.category}`);
  console.log(`  ${dim('Files')}     ${downloaded.join(', ')}`);
  console.log('');
  console.log(`  ${green('Downloaded to')} ./${key}/`);
  console.log('');
  console.log(`  ${dim('Next: tell your AI')} "use the code in ./${key}/index.html"`);
  console.log('');
}

module.exports = fetchCommand;
