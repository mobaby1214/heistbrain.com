/**
 * T-11 (conversion audit) — generate the marketing-page manifest that the
 * Heist app's dynamic /sitemap.xml route serves alongside live blog posts.
 *
 * Why this exists: heistbrain.com's sitemap used to be a static file (137
 * URLs, stale lastmod, included /404.html, missed 105 live posts). nginx now
 * routes /sitemap.xml to the Node app, which merges THIS manifest (static
 * marketing pages) with the live blog_posts table at request time.
 *
 * URL policy: each page is listed at its own canonical URL (root pages
 * canonicalize clean — /about — while subdirectory pages canonicalize with
 * .html; we mirror the tags rather than fight them). Excluded: 404.html,
 * blog.html (301 → /blog), blog/*.html (301s / redirect stubs to the dynamic
 * blog). lastmod = the file's last git commit date.
 *
 * Run from the marketing repo root after adding/removing pages:
 *   node scripts/generate-sitemap-manifest.js
 * then copy ./marketing-pages.json over the app repo's
 * server/data/marketingPages.json and commit BOTH repos.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (name.startsWith('.') || name === 'node_modules' || name === 'scripts') continue;
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full, out);
        else if (name.endsWith('.html')) out.push(full);
    }
    return out;
}

const files = walk(ROOT);
const pages = [];
for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (rel === '404.html') continue;               // never in a sitemap
    if (rel === 'blog.html') continue;              // 301 → dynamic /blog
    if (rel.startsWith('blog/')) continue;          // legacy twins/stubs, all 301
    const html = fs.readFileSync(file, 'utf8');
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    let url = m ? m[1] : `https://heistbrain.com/${rel}`;
    // Normalize: sitemap is apex-only.
    url = url.replace('://www.heistbrain.com', '://heistbrain.com');
    let lastmod = null;
    try {
        lastmod = execSync(`git log -1 --format=%cI -- "${rel}"`, { cwd: ROOT }).toString().trim().slice(0, 10) || null;
    } catch (_) { /* leave null */ }
    pages.push({ url, lastmod });
}

// De-dupe on URL (several files could share a canonical), keep newest lastmod.
const byUrl = new Map();
for (const p of pages) {
    const prev = byUrl.get(p.url);
    if (!prev || (p.lastmod && (!prev.lastmod || p.lastmod > prev.lastmod))) byUrl.set(p.url, p);
}
const result = Array.from(byUrl.values()).sort((a, b) => a.url.localeCompare(b.url));

const json = JSON.stringify({ generated_at: new Date().toISOString(), pages: result }, null, 2) + '\n';
fs.writeFileSync(path.join(ROOT, 'marketing-pages.json'), json);
console.log(`marketing-pages.json — ${result.length} pages`);
