const { searchComponents } = require('../registry');
const { bold, dim, green, cyan, white, banner, error, componentCard } = require('../display');
const { VERSION } = require('../constants');

async function searchCommand(query) {
  banner(VERSION);

  if (!query) {
    error('Please specify a search query.');
    console.log(`  ${dim('Usage:')} vibe-ui search ${cyan('<query>')}`);
    console.log(`  ${dim('Example:')} vibe-ui search gradient`);
    console.log('');
    return;
  }

  console.log(`  Searching for "${cyan(query)}"...`);
  console.log('');

  const results = await searchComponents(query);

  if (results.length === 0) {
    console.log(`  ${dim('No components match your search.')}`);
    console.log(`  ${dim('Try a broader term or run')} vibe-ui list ${dim('to browse all.')}`);
    console.log('');
    return;
  }

  console.log(`  ${bold(white(`${results.length} result${results.length === 1 ? '' : 's'}`))}  `);
  console.log('');

  for (const comp of results) {
    componentCard(comp);
  }
}

module.exports = searchCommand;
