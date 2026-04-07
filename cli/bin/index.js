#!/usr/bin/env node

const { VERSION } = require('../src/constants');
const { bold, dim, green, cyan, banner } = require('../src/display');

const args = process.argv.slice(2);
const command = args[0];
const param = args[1];

// Parse flags
const flags = {};
for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    flags[key] = val || true;
  }
}

async function main() {
  if (flags.version || flags.v) {
    console.log(VERSION);
    return;
  }

  switch (command) {
    case 'fetch':
    case 'get':
    case 'add': {
      const fetchCommand = require('../src/commands/fetch');
      await fetchCommand(param);
      break;
    }

    case 'list':
    case 'ls': {
      const listCommand = require('../src/commands/list');
      await listCommand(flags.category || param);
      break;
    }

    case 'search':
    case 'find': {
      const searchCommand = require('../src/commands/search');
      await searchCommand(args.slice(1).join(' '));
      break;
    }

    case 'help':
    case '--help':
    case '-h':
    case undefined: {
      banner(VERSION);
      console.log(`  ${bold('Beautiful UI effects for vibecoders.')}`);
      console.log(`  ${dim('Browse, copy, paste, ship.')}`);
      console.log('');
      console.log(`  ${bold('Commands')}`);
      console.log('');
      console.log(`    ${green('fetch')} ${cyan('<key>')}        Download a component into your project`);
      console.log(`    ${green('list')}  ${dim('[category]')}    List all available components`);
      console.log(`    ${green('search')} ${cyan('<query>')}     Search components by name or tag`);
      console.log('');
      console.log(`  ${bold('Examples')}`);
      console.log('');
      console.log(`    ${dim('$')} vibe-ui fetch gradient-wave`);
      console.log(`    ${dim('$')} vibe-ui list`);
      console.log(`    ${dim('$')} vibe-ui search particles`);
      console.log(`    ${dim('$')} vibe-ui list --category=backgrounds`);
      console.log('');
      console.log(`  ${dim('Browse components at')} ${cyan('https://github.com/WeildTheSword/vibe-ui')}`);
      console.log('');
      break;
    }

    default: {
      banner(VERSION);
      console.log(`  Unknown command: "${command}"`);
      console.log(`  ${dim('Run')} vibe-ui --help ${dim('to see available commands.')}`);
      console.log('');
    }
  }
}

main().catch(e => {
  console.error(`\n  \x1b[31m✗ ${e.message}\x1b[0m\n`);
  process.exit(1);
});
