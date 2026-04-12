#!/usr/bin/env node
// Fix interior pages: make mobile dropdown menus collapsed by default
// with tap-to-toggle, matching index.html behavior.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOME = path.join(ROOT, 'index.html');

// ── CSS fix ──
// Replace the always-visible dropdown-menu rule in the first mobile media query
const OLD_CSS = `.nav-dropdown-menu{position:static;transform:none;opacity:1!important;visibility:visible!important;background:transparent;border:none;padding:0;margin:6px 0 0 16px;box-shadow:none;min-width:0}`;

const NEW_CSS = `.nav-dropdown-menu{position:static;transform:none;background:transparent;border:none;padding:0;margin:6px 0 0 16px;box-shadow:none;min-width:0;max-height:0;overflow:hidden;opacity:1;visibility:visible;transition:max-height 0.3s ease}.nav-dropdown.open .nav-dropdown-menu{max-height:720px;opacity:1!important;visibility:visible!important}`;

// ── JS fix ──
// Replace the simple hamburger toggle with one that also handles dropdown triggers
const OLD_JS = `// Mobile menu
document.getElementById('nav-hamburger')?.addEventListener('click', () => {
  document.getElementById('nav-links')?.classList.toggle('open');
});
document.querySelectorAll('#nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'));
});`;

const NEW_JS = `// Mobile menu
document.getElementById('nav-hamburger')?.addEventListener('click', () => {
  document.getElementById('nav-links')?.classList.toggle('open');
});
document.querySelectorAll('#nav-links a').forEach(a => {
  if (!a.classList.contains('nav-dropdown-trigger')) {
    a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'));
  }
});
// Mobile dropdown toggle
document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dd = trigger.parentElement;
      dd.classList.toggle('open');
    }
  });
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
let cssFixed = 0, jsFixed = 0, skipped = 0;

for (const file of files) {
  if (file === HOME) { skipped++; continue; }
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (src.includes(OLD_CSS)) {
    src = src.replace(OLD_CSS, NEW_CSS);
    cssFixed++;
    changed = true;
  }

  if (src.includes(OLD_JS)) {
    src = src.replace(OLD_JS, NEW_JS);
    jsFixed++;
    changed = true;
  }

  if (changed) fs.writeFileSync(file, src);
  else skipped++;
}

console.log(`CSS fixed: ${cssFixed}`);
console.log(`JS fixed: ${jsFixed}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total: ${files.length}`);
