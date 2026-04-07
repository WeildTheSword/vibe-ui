const fs = require('fs');
const path = require('path');
const { REGISTRY_URL } = require('./constants');
const { error } = require('./display');

let _cache = null;

async function fetchRegistry() {
  if (_cache) return _cache;

  // Try local file first (for development / when running from repo)
  // __dirname = cli/src → ../../website = repo_root/website
  const localPath = path.resolve(__dirname, '..', '..', 'website', 'registry.json');
  if (fs.existsSync(localPath)) {
    try {
      _cache = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      return _cache;
    } catch (e) {
      // Fall through to remote
    }
  }

  try {
    const res = await fetch(REGISTRY_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _cache = await res.json();
    return _cache;
  } catch (e) {
    error(`Failed to fetch registry: ${e.message}`);
    error('Check your internet connection and try again.');
    process.exit(1);
  }
}

async function findComponent(key) {
  const registry = await fetchRegistry();
  return registry.components.find(c => c.key === key) || null;
}

async function searchComponents(query) {
  const registry = await fetchRegistry();
  const q = query.toLowerCase();
  return registry.components.filter(c =>
    c.key.includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some(t => t.includes(q))
  );
}

async function listComponents(category) {
  const registry = await fetchRegistry();
  if (category) {
    return registry.components.filter(c => c.category === category);
  }
  return registry.components;
}

async function getCategories() {
  const registry = await fetchRegistry();
  return registry.categories;
}

function suggestSimilar(key, components) {
  const scored = components.map(c => {
    let score = 0;
    const a = key.toLowerCase();
    const b = c.key.toLowerCase();
    if (b.includes(a) || a.includes(b)) score += 3;
    const aWords = a.split('-');
    const bWords = b.split('-');
    for (const w of aWords) {
      if (bWords.some(bw => bw.includes(w) || w.includes(bw))) score += 1;
    }
    return { component: c, score };
  });
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.component);
}

module.exports = { fetchRegistry, findComponent, searchComponents, listComponents, getCategories, suggestSimilar };
