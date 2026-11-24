#!/usr/bin/env node
/**
 * Keeps css/tokens.css identical to the app's design tokens
 * (content-generator-v3/app/styles/tokens.css): the one source of truth for
 * colour, type, space, radius, shadow, motion and layering on both the app
 * and this site. Rules: content-generator-v3/docs/DESIGN-CONTRACT.md.
 *
 *   node scripts/sync-tokens.js            copy the app's tokens.css into css/tokens.css
 *   node scripts/sync-tokens.js --check    exit 1 if css/tokens.css was hand-edited, or
 *                                          (when the app checkout is present) is stale
 *
 * Source: $HEIST_APP_DIR, else ../content-generator-v3 next to this repo.
 * No dependencies. css/tokens.css is generated: never edit it by hand.
 *
 * Linked by index.html. Its header, hero and how-it-works strip carry
 * data-theme="light". Phase 4 step 1 links it on the other pages, which
 * render from shared partials. A dark page needs data-theme="dark" on
 * <html>; without it the light theme's values apply.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE = path.resolve(__dirname, '..');
const OUT = path.join(SITE, 'css', 'tokens.css');
const APP = process.env.HEIST_APP_DIR || path.resolve(SITE, '..', 'content-generator-v3');
const SRC = path.join(APP, 'app', 'styles', 'tokens.css');

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const norm = (s) => s.replace(/\r\n/g, '\n');
const header = (body) => `/* GENERATED from content-generator-v3/app/styles/tokens.css by scripts/sync-tokens.js. Do not edit. sha256:${sha(body)} */\n`;

function readCopy() {
    if (!fs.existsSync(OUT)) return null;
    const text = norm(fs.readFileSync(OUT, 'utf8'));
    const m = text.match(/^\/\* GENERATED [^\n]*sha256:([0-9a-f]{16}) \*\/\n/);
    if (!m) return { text, body: text, declared: null };
    return { text, body: text.slice(m[0].length), declared: m[1] };
}

function main() {
    const check = process.argv.includes('--check');
    const hasSource = fs.existsSync(SRC);

    if (!check) {
        if (!hasSource) {
            console.error(`Can't find the app's tokens.css at ${SRC}. Set HEIST_APP_DIR to your content-generator-v3 checkout.`);
            process.exit(1);
        }
        const body = norm(fs.readFileSync(SRC, 'utf8'));
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
        fs.writeFileSync(OUT, header(body) + body);
        console.log(`css/tokens.css synced from ${path.relative(SITE, SRC) || SRC} (sha256:${sha(body)})`);
        return;
    }

    const copy = readCopy();
    const problems = [];
    if (!copy) problems.push('css/tokens.css is missing. Run: node scripts/sync-tokens.js');
    else if (!copy.declared) problems.push('css/tokens.css has no GENERATED header. Run: node scripts/sync-tokens.js');
    else if (sha(copy.body) !== copy.declared) problems.push('css/tokens.css was edited by hand. Edit the app\'s tokens.css instead, then run: node scripts/sync-tokens.js');
    if (copy && hasSource) {
        const body = norm(fs.readFileSync(SRC, 'utf8'));
        if (body !== copy.body) problems.push(`css/tokens.css is behind the app's tokens.css (${SRC}). Run: node scripts/sync-tokens.js`);
    } else if (!hasSource) {
        console.log(`(app checkout not found at ${APP}; checked the copy's integrity only)`);
    }
    if (problems.length) {
        console.error(problems.map((p) => '- ' + p).join('\n'));
        process.exit(1);
    }
    console.log('css/tokens.css is intact' + (hasSource ? ' and matches the app.' : '.'));
}

main();
