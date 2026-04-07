const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const magenta = (s) => `\x1b[35m${s}\x1b[0m`;
const white = (s) => `\x1b[97m${s}\x1b[0m`;
const bgGreen = (s) => `\x1b[42m\x1b[30m${s}\x1b[0m`;

const TICK = green('✓');
const CROSS = red('✗');
const ARROW = dim('→');
const DOT = dim('·');

function banner(version) {
  console.log('');
  console.log(`  ${bold(green('vibe-ui'))} ${dim(`v${version}`)}`);
  console.log('');
}

function error(msg) {
  console.log(`  ${CROSS} ${red(msg)}`);
  console.log('');
}

function success(msg) {
  console.log(`  ${TICK} ${msg}`);
}

function info(msg) {
  console.log(`  ${dim(msg)}`);
}

function table(rows) {
  for (const row of rows) {
    console.log(`  ${row}`);
  }
}

function componentCard(comp) {
  const badges = [];
  if (comp.cssOnly) badges.push(cyan('CSS'));
  const badgeStr = badges.length ? ` ${badges.join(' ')}` : '';
  console.log(`  ${bold(white(comp.name))}${badgeStr}`);
  console.log(`  ${dim(comp.description)}`);
  console.log(`  ${dim('fetch:')} ${green(`npx vibe-ui fetch ${comp.key}`)}`);
  console.log('');
}

module.exports = {
  bold, dim, green, cyan, red, yellow, magenta, white, bgGreen,
  TICK, CROSS, ARROW, DOT,
  banner, error, success, info, table, componentCard
};
