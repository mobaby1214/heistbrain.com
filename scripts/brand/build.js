#!/usr/bin/env node
/**
 * Builds Heist's brand assets in "The Case File" look from one drawing.
 *
 *   node scripts/brand/build.js
 *
 * Writes (paths from the site root):
 *   img/heist-bandit.svg   the bare bandit mark, transparent (the source drawing)
 *   img/heist-mark.svg     the mark in a parchment stamp seal: nav logo, schema logo
 *   img/heist-mark.webp    the seal at 192px (what the page navs load)
 *   favicon.svg            a burgundy tile with the mark in parchment
 *   favicon-32.png         the tile at 32px
 *   apple-touch-icon.png   the tile at 180px, full bleed (iOS rounds the corners)
 *   og-image.png           the 1200x630 share card, from scripts/brand/og-image.html
 *
 * Colours are the Case File tokens (content-generator-v3/app/styles/tokens.css).
 * Needs Playwright: from node_modules here, else $HEIST_APP_DIR, else
 * ../content-generator-v3. The share card loads Schibsted Grotesk from Google Fonts.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const SITE = path.resolve(__dirname, '..', '..');
const C = { burgundy: '#7A1F1F', deep: '#5E1616', darker: '#451111', top: '#8C2828', ink: '#141414',
  paper: '#F3EEE3', sheet: '#FBF8F1', muted: '#E3DACA', fold: '#6A1A1A' };

// One drawing on a 200 x 200 grid, centred on (100, 99): fedora, the eyes in
// the shadow of the brim, a folded bandana. p maps each part to a colour.
function bandit(p) {
  return [
    `<ellipse cx="100" cy="84" rx="70" ry="13" fill="${p.brimTop}"/>`,
    `<path d="M63 86 C63 64 66 46 74 33 C79 25 88 25 100 33 C112 25 121 25 126 33 C134 46 137 64 137 86 Z" fill="${p.crown}"/>`,
    `<path d="M64.2 70 H135.8 C136.3 75 136.7 80 137 86 H63 C63.3 80 63.7 75 64.2 70 Z" fill="${p.band}"/>`,
    `<path d="M30 84 C30 92.5 62 97.5 100 97.5 C138 97.5 170 92.5 170 84 C158 90 132 92 100 92 C68 92 42 90 30 84 Z" fill="${p.brimLip}"/>`,
    `<rect x="63" y="94" width="74" height="24" rx="11" fill="${p.mask}"/>`,
    `<ellipse cx="85" cy="105.5" rx="9.5" ry="5.6" fill="${p.eye}"/>`,
    `<ellipse cx="115" cy="105.5" rx="9.5" ry="5.6" fill="${p.eye}"/>`,
    `<circle cx="89.5" cy="106" r="3.5" fill="${p.pupil}"/>`,
    `<circle cx="119.5" cy="106" r="3.5" fill="${p.pupil}"/>`,
    `<path d="M57 112 C78 115.5 122 115.5 143 112 C141 129 131 146 114 159.5 C107.5 164.5 103.5 168.5 100 174 C96.5 168.5 92.5 164.5 86 159.5 C69 146 59 129 57 112 Z" fill="${p.scarf}"/>`,
    `<path d="M57 112 C68 113.9 84 114.9 100 115 V174 C96.5 168.5 92.5 164.5 86 159.5 C69 146 59 129 57 112 Z" fill="${p.scarfFold}"/>`,
    `<path d="M57 112 C78 115.5 122 115.5 143 112" fill="none" stroke="${p.hem}" stroke-width="2.4" stroke-linecap="round"/>`,
  ].join('\n    ');
}
const onLight = { crown: C.burgundy, brimTop: C.top, brimLip: C.deep, band: C.ink, mask: C.ink, eye: C.sheet, pupil: C.ink,
  scarf: C.burgundy, scarfFold: C.fold, hem: C.darker };
const onBurgundy = { crown: C.paper, brimTop: C.sheet, brimLip: C.muted, band: C.darker, mask: C.darker, eye: C.paper, pupil: C.darker,
  scarf: C.paper, scarfFold: C.muted, hem: C.muted };

const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Heist">\n  <title>Heist</title>';
const tile = (rx) => `${head}
  <rect width="200" height="200"${rx ? ` rx="${rx}"` : ''} fill="${C.burgundy}"/>
  <g transform="translate(100 101) scale(1.08) translate(-100 -99)">
    ${bandit(onBurgundy)}
  </g>
</svg>\n`;
const svgs = {
  'img/heist-bandit.svg': `${head}\n  <g>\n    ${bandit(onLight)}\n  </g>\n</svg>\n`,
  'img/heist-mark.svg': `${head}
  <circle cx="100" cy="100" r="98" fill="${C.paper}"/>
  <circle cx="100" cy="100" r="90" fill="none" stroke="${C.burgundy}" stroke-width="6"/>
  <g transform="translate(100 101) scale(.9) translate(-100 -99)">
    ${bandit(onLight)}
  </g>
</svg>\n`,
  'favicon.svg': tile(44),
};
const rasters = [
  { from: svgs['img/heist-mark.svg'], out: 'img/heist-mark.webp', size: 192, type: 'image/webp', quality: 0.95 },
  { from: svgs['favicon.svg'], out: 'favicon-32.png', size: 32, type: 'image/png' },
  { from: tile(0), out: 'apple-touch-icon.png', size: 180, type: 'image/png' },
];

function loadPlaywright() {
  const tries = ['playwright', process.env.HEIST_APP_DIR && path.join(process.env.HEIST_APP_DIR, 'node_modules', 'playwright'),
    path.resolve(SITE, '..', 'content-generator-v3', 'node_modules', 'playwright')].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (_) { /* next */ } }
  console.error('Playwright not found. Set HEIST_APP_DIR to the app checkout.');
  process.exit(2);
}

(async () => {
  for (const [rel, svg] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(SITE, rel), svg);
    console.log('wrote', rel);
  }
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const r of rasters) {
    const dataUrl = await page.evaluate(async ({ svg, size, type, quality }) => {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      await img.decode();
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, size, size);
      return c.toDataURL(type, quality);
    }, { svg: r.from, size: r.size, type: r.type, quality: r.quality });
    if (!dataUrl.startsWith('data:' + r.type)) throw new Error(r.out + ': this browser cannot encode ' + r.type);
    fs.writeFileSync(path.join(SITE, r.out), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('wrote', r.out, r.size + 'px');
  }
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await card.goto(pathToFileURL(path.join(__dirname, 'og-image.html')).href, { waitUntil: 'networkidle' });
  await card.evaluate(() => document.fonts.ready);
  await card.screenshot({ path: path.join(SITE, 'og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('wrote og-image.png 1200x630');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
