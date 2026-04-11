#!/usr/bin/env node
// Fix mobile nav alignment on all interior pages.
// - Adds width:100% and box-sizing to panel links so tabs fill their row
// - Replaces `.nav-links a{display:block!important;font-size:18px}` snippet
//   with the full-width version

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const OLD = `.nav-links a{display:block!important;font-size:18px}`;
const NEW = `.nav-links a{display:block!important;font-size:18px;width:100%;box-sizing:border-box;text-align:left}.nav-links a::after{display:none!important}`;

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
let updated = 0;
let skipped = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes(OLD)) { skipped++; continue; }
  fs.writeFileSync(file, src.replace(OLD, NEW));
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Skipped (no match): ${skipped}`);
console.log(`Total HTML files: ${files.length}`);
