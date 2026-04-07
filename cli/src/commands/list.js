const { listComponents, getCategories } = require('../registry');
const { bold, dim, green, cyan, white, banner, componentCard } = require('../display');
const { VERSION } = require('../constants');

async function listCommand(categoryFilter) {
  banner(VERSION);

  const categories = await getCategories();
  const components = await listComponents(categoryFilter);

  if (categoryFilter && components.length === 0) {
    console.log(`  No components found in category "${categoryFilter}".`);
    console.log('');
    console.log(`  ${dim('Available categories:')}`);
    for (const cat of categories) {
      console.log(`    ${cyan(cat.id)} ${dim('—')} ${cat.description}`);
    }
    console.log('');
    return;
  }

  console.log(`  ${bold(white(`${components.length} components available`))}`);
  console.log('');

  // Group by category
  const grouped = {};
  for (const comp of components) {
    if (!grouped[comp.category]) grouped[comp.category] = [];
    grouped[comp.category].push(comp);
  }

  for (const cat of categories) {
    const items = grouped[cat.id];
    if (!items) continue;

    console.log(`  ${bold(cat.name)}`);
    console.log(`  ${dim('─'.repeat(40))}`);
    console.log('');

    for (const comp of items) {
      componentCard(comp);
    }
  }

  console.log(`  ${dim('Usage:')} vibe-ui fetch ${cyan('<key>')}`);
  console.log('');
}

module.exports = listCommand;
