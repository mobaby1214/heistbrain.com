#!/usr/bin/env node
// Add dropdown toggle JS to interior pages that have hamburger menu but no dropdown toggle.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOME = path.join(ROOT, 'index.html');

const DROPDOWN_JS = `
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

// Also fix the link close handler to not fire on dropdown triggers
const OLD_LINK_CLOSE = `document.querySelectorAll('#nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links')?.classList.remove('open'));
});`;

const NEW_LINK_CLOSE = `document.querySelectorAll('#nav-links a').forEach(a => {
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

  // Skip if already has dropdown toggle
  if (src.includes('nav-dropdown-trigger') && src.includes('classList.toggle(\'open\')') && src.includes('window.innerWidth')) {
    skipped++;
    continue;
  }

  // Must have hamburger JS
  if (!src.includes('nav-hamburger') || !src.includes('addEventListener')) {
    skipped++;
    continue;
  }

  let changed = false;

  // Fix link close to skip triggers
  if (src.includes(OLD_LINK_CLOSE)) {
    src = src.replace(OLD_LINK_CLOSE, NEW_LINK_CLOSE);
    changed = true;
  }

  // Add dropdown JS before closing </script>
  // Find the last </script> that follows the hamburger code
  const hamIdx = src.lastIndexOf('nav-hamburger');
  if (hamIdx !== -1) {
    const scriptEndIdx = src.indexOf('</script>', hamIdx);
    if (scriptEndIdx !== -1) {
      src = src.slice(0, scriptEndIdx) + DROPDOWN_JS + '\n' + src.slice(scriptEndIdx);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, src);
    updated++;
  } else {
    skipped++;
  }
}

console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total: ${files.length}`);
