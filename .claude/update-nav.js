#!/usr/bin/env node
// One-shot script to propagate the new nav block across all pages.
// Run from worktree root: node .claude/update-nav.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const NEW_NAV = `  <div class="nav-links" id="nav-links">
    <a href="/#how">How It Works</a>
    <div class="nav-dropdown">
      <a href="/tools/" class="nav-dropdown-trigger">Tools <svg class="nav-caret-tools" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
      <div class="nav-dropdown-menu">
        <a href="/tools/hooks.html">Hook Generator</a>
        <a href="/tools/character-counter.html">Character Counter</a>
        <a href="/tools/brand-voice-analyzer.html">Brand Voice Analyzer</a>
        <a href="/tools/best-time-to-post.html">Best Time to Post</a>
        <a href="/tools/hashtag-generator.html">Hashtag Generator</a>
        <a href="/tools/" class="see-all">See all 15 tools &rarr;</a>
      </div>
    </div>
    <div class="nav-dropdown">
      <a href="/for/" class="nav-dropdown-trigger">Solutions <svg class="nav-caret-tools" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
      <div class="nav-dropdown-menu">
        <a href="/for/agencies.html">For Agencies</a>
        <a href="/for/coaches.html">For Coaches</a>
        <a href="/for/consultants.html">For Consultants</a>
        <a href="/for/ecommerce.html">For Ecommerce</a>
        <a href="/for/fitness-creators.html">For Fitness Creators</a>
        <a href="/for/freelancers.html">For Freelancers</a>
        <a href="/for/real-estate.html">For Real Estate</a>
        <a href="/for/saas.html">For SaaS</a>
        <a href="/for/nonprofits.html">For Nonprofits</a>
        <a href="/for/authors.html">For Authors</a>
        <a href="/for/" class="see-all">See all solutions &rarr;</a>
      </div>
    </div>
    <div class="nav-dropdown">
      <a href="/resources/" class="nav-dropdown-trigger">Resources <svg class="nav-caret-tools" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
      <div class="nav-dropdown-menu">
        <a href="/guides/">Guides</a>
        <a href="/benchmarks/">Benchmarks</a>
        <a href="/blog">Blog</a>
        <a href="/templates/">Templates</a>
        <a href="/glossary/">Glossary</a>
        <a href="/quiz/brand-voice.html">Brand Voice Quiz</a>
        <a href="/resources/" class="see-all">All resources &rarr;</a>
      </div>
    </div>
    <a href="/#pricing">Pricing</a>
    <a href="https://app.heistbrain.com/#login" class="nav-login">Login</a>
    <a href="https://app.heistbrain.com/#signup" class="nav-cta">Get Your Time Back &rarr;</a>
  </div>`;

// Regex: match from `<div class="nav-links" id="nav-links">` through its closing `</div>`
// right before `<button class="nav-hamburger"`
const NAV_RE = /[ \t]*<div class="nav-links" id="nav-links">[\s\S]*?<\/div>\s*(?=<button class="nav-hamburger")/;

// Walk the tree
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
let unchanged = 0;

// Skip the homepage — it uses anchors `#how` / `#pricing` not `/#how` and was already edited manually
const HOME = path.join(ROOT, 'index.html');

for (const file of files) {
  if (file === HOME) { skipped++; continue; }
  const src = fs.readFileSync(file, 'utf8');
  if (!NAV_RE.test(src)) { skipped++; continue; }
  const out = src.replace(NAV_RE, NEW_NAV);
  if (out === src) { unchanged++; continue; }
  fs.writeFileSync(file, out);
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Skipped (no match / homepage): ${skipped}`);
console.log(`Unchanged: ${unchanged}`);
console.log(`Total HTML files: ${files.length}`);
