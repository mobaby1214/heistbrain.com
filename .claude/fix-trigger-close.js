#!/usr/bin/env node
// Fix: dropdown triggers close the whole menu because the link-close
// handler doesn't skip them. Add the guard.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOME = path.join(ROOT, 'index.html');

const OLD = `document.querySelectorAll('#nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'));
});`;

const NEW = `document.querySelectorAll('#nav-links a').forEach(a => {
  if (!a.classList.contains('nav-dropdown-trigger')) {
    a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'));
  }
});`;

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.claude' || entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.name.endsWith('.html')) list.push(full);
  }
  return list;
}

const files = walk(ROOT);
let updated = 0, skipped = 0;

for (const file of files) {
  if (file === HOME) { skipped++; continue; }
  let src = fs.readFileSync(file, 'utf8');
  // Normalize line endings for matching
  const norm = src.replace(/\r\n/g, '\n');
  if (!norm.includes(OLD)) { skipped++; continue; }
  // Replace in normalized, then restore original line ending style
  const hasWindows = src.includes('\r\n');
  let out = norm.replace(OLD, NEW);
  if (hasWindows) out = out.replace(/(?<!\r)\n/g, '\r\n');
  fs.writeFileSync(file, out);
  updated++;
}

console.log(`Updated: ${updated}, Skipped: ${skipped}, Total: ${files.length}`);
