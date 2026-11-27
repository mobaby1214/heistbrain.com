/**
 * Visibility audit 2026-11, decision 4: check that noindexed pages and the
 * sitemap manifest agree.
 *
 * For every .html page with a robots noindex meta:
 *   - it has exactly ONE <meta name="robots"> tag (no conflicting duplicates)
 *   - pages in the programmatic folders keep "follow" (internal links still pass)
 *   - its URL (canonical or file path) is NOT in the manifest
 * Also checks that the business-fit and Bing-cited pages stay indexable and that no
 * manifest URL points at a noindex page.
 *
 * Usage (from the marketing repo root):
 *   node scripts/check-noindex.js [path/to/manifest.json ...]
 * Defaults to ./marketing-pages.json. Pass the app repo's
 * server/data/marketingPages.json too to check the deployed copy.
 * Exits 1 on any failure.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifests = process.argv.slice(2);
if (!manifests.length) manifests.push(path.join(ROOT, 'marketing-pages.json'));

const PROGRAMMATIC_DIRS = ['hashtags', 'best-time-to-post', 'caption-examples', 'content-ideas'];

// Kept indexable regardless of Search Console data (owner decision 4).
const BUSINESS_FIT = ['small-business', 'b2b', 'startup', 'freelance', 'coaching', 'marketing', 'ecommerce']
    .map((s) => `hashtags/${s}.html`);

// 0 Google impressions but cited by Bing Copilot (Bing Webmaster Tools AI
// Performance, Aug 27 - Nov 25, 2026), so they stay indexable for Bing grounding.
const BING_CITED = [
    'content-ideas/facebook.html', 'hashtags/education.html', 'hashtags/music.html',
    'hashtags/lifestyle.html', 'hashtags/crypto.html', 'hashtags/beauty.html',
    'hashtags/parenting.html', 'caption-examples/facebook.html', 'caption-examples/linkedin.html',
];
const KEEP_INDEXED = [...BUSINESS_FIT, ...BING_CITED];

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        if (name.startsWith('.') || name === 'node_modules' || name === 'scripts') continue;
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) walk(full, out);
        else if (name.endsWith('.html')) out.push(full);
    }
    return out;
}

const robotsTags = (html) => html.match(/<meta\s+name=["']robots["'][^>]*>/gi) || [];
const isNoindex = (tags) => tags.some((t) => /content=["'][^"']*\bnoindex\b/i.test(t));
const urlFor = (html, rel) => {
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    return (m ? m[1] : `https://heistbrain.com/${rel}`).replace('://www.heistbrain.com', '://heistbrain.com');
};

const failures = [];
const noindexPages = [];   // { rel, url }
const indexByRel = new Map();
for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const html = fs.readFileSync(file, 'utf8');
    const tags = robotsTags(html);
    const noindex = isNoindex(tags);
    indexByRel.set(rel, { noindex, url: urlFor(html, rel) });
    if (!noindex) continue;
    noindexPages.push({ rel, url: urlFor(html, rel) });
    if (tags.length !== 1) failures.push(`${rel}: ${tags.length} robots meta tags (want exactly 1)`);
    // Decision-4 pages must keep passing their internal links. (Older noindex
    // pages elsewhere, e.g. the blog/*.html redirect stubs, are out of scope.)
    const programmatic = PROGRAMMATIC_DIRS.some((d) => rel.startsWith(`${d}/`));
    if (programmatic && !tags.some((t) => /\bfollow\b/i.test(t.replace(/nofollow/gi, '')))) {
        failures.push(`${rel}: noindex without "follow"`);
    }
}

for (const rel of KEEP_INDEXED) {
    const p = indexByRel.get(rel);
    if (!p) failures.push(`${rel}: keep-indexed page missing`);
    else if (p.noindex) failures.push(`${rel}: keep-indexed page is noindex`);
}

for (const mf of manifests) {
    const urls = new Set(JSON.parse(fs.readFileSync(mf, 'utf8')).pages.map((p) => p.url));
    for (const { rel, url } of noindexPages) {
        const asPath = `https://heistbrain.com/${rel}`;
        if (urls.has(url) || urls.has(asPath)) failures.push(`${rel}: noindex but listed in ${path.basename(mf)}`);
    }
    for (const rel of KEEP_INDEXED) {
        const p = indexByRel.get(rel);
        if (p && !urls.has(p.url)) failures.push(`${rel}: keep-indexed page missing from ${path.basename(mf)}`);
    }
    console.log(`${mf}: ${urls.size} URLs`);
}

console.log(`noindex pages: ${noindexPages.length}`);
for (const { rel } of noindexPages) console.log(`  ${rel}`);
if (failures.length) {
    console.error(`\nFAIL (${failures.length}):`);
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
}
console.log('\nOK: every noindex page has exactly one robots meta, keeps follow, and is absent from the manifest.');
