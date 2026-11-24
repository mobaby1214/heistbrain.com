#!/usr/bin/env node
/**
 * Browser checks for the homepage hero ("The Case File" dossier).
 * Run before shipping any change to index.html's hero, dossier or nav:
 *
 *   node scripts/check-homepage.js [outDir]
 *
 * It serves this checkout itself (GitHub Pages style) and drives Chromium at
 * 1440, 1024, 768 and 375px: no sideways scroll, CTA hrefs and labels, every
 * card and the brief open, fit, take focus and close with Escape, the Next
 * chain, outside-press close, the approval demo, tilt, the sheet pull, card
 * lift, the staggered entrance, keyboard order, reduced motion and no-JS.
 * Screenshots go to outDir (default: a temp folder). Exits 1 on any FAIL.
 *
 * Needs Playwright: from node_modules here, else $HEIST_APP_DIR, else
 * ../content-generator-v3 (the app repo has it). The rules it checks:
 * content-generator-v3/docs/brand-messaging.md, "The dossier".
 */
'use strict';
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

const SITE = path.resolve(__dirname, '..');
function loadPlaywright() {
  const tries = ['playwright', process.env.HEIST_APP_DIR && path.join(process.env.HEIST_APP_DIR, 'node_modules', 'playwright'),
    path.resolve(SITE, '..', 'content-generator-v3', 'node_modules', 'playwright')].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (_) { /* next */ } }
  console.error('Playwright not found. npm i -D playwright here, or set HEIST_APP_DIR to the app checkout.');
  process.exit(2);
}
const { chromium } = loadPlaywright();
const OUT = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'heist-homepage-'));
fs.mkdirSync(OUT, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const base = path.join(SITE, url === '/' ? 'index.html' : url);
  const file = [base, base + '.html', path.join(base, 'index.html')]
    .find((f) => f.startsWith(SITE) && fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
let BASE = '';
const results = [];
function log(ok, msg) { results.push((ok ? 'PASS ' : 'FAIL ') + msg); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function page(browser, opts) {
  const ctx = await browser.newContext(opts);
  // Block third-party noise (GA) so console checks are about our code.
  await ctx.route(/googletagmanager|google-analytics/, (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  return { ctx, p, errors };
}

async function overflow(p) {
  return p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    wide: [...document.querySelectorAll('.cf-hero *, .cf-how *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > window.innerWidth + 1 || r.left < -1) && !el.closest('.cf-panel[hidden]'); })
      .slice(0, 5).map((el) => el.className && el.className.baseVal === undefined ? el.className : el.tagName) }));
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  BASE = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch();
  const widths = [[1440, 900], [1024, 768], [768, 1024], [375, 812]];
  for (const [w, h] of widths) {
    const touch = w <= 768;
    const { ctx, p, errors } = await page(browser, { viewport: { width: w, height: h }, hasTouch: touch, isMobile: w <= 400, deviceScaleFactor: 1 });
    await sleep(2800);
    await p.screenshot({ path: path.join(OUT, `w${w}-fold.png`) });
    const hero = await p.$('.cf-hero');
    await hero.screenshot({ path: path.join(OUT, `w${w}-hero.png`) });
    const how = await p.$('.cf-how');
    await how.screenshot({ path: path.join(OUT, `w${w}-how.png`) });
    const o = await overflow(p);
    log(o.sw <= o.iw, `w${w} no horizontal scroll (scrollWidth ${o.sw} / ${o.iw}) ${o.wide.length ? 'wide: ' + o.wide.join(',') : ''}`);
    const cta = await p.evaluate(() => { const a = document.querySelector('.cf-hero [data-cta="hero"]'); const r = a.getBoundingClientRect(); return { href: a.getAttribute('href'), text: a.textContent.trim(), bottom: r.bottom }; });
    log(cta.href === 'https://app.heistbrain.com/?utm_source=landing&utm_medium=cta&utm_content=hero#signup', `w${w} hero CTA href intact`);
    log(cta.text === 'Create my first month', `w${w} hero CTA label "${cta.text}"`);
    if (w >= 1024) log(cta.bottom <= h, `w${w} hero CTA above the fold (bottom ${Math.round(cta.bottom)} / ${h})`);
    // Every card: open, screenshot, check fit, close.
    for (const name of ['brief', 'voice', 'month', 'rules', 'time']) {
      const sel = `[data-open="${name}"]`;
      if (touch) await p.tap(sel); else await p.click(sel);
      await sleep(750);
      const st = await p.evaluate((n) => {
        const panel = document.getElementById('cf-panel-' + n); const r = panel.getBoundingClientRect();
        const t = document.querySelector('[data-open="' + n + '"]');
        return { hidden: panel.hidden, expanded: t.getAttribute('aria-expanded'), focus: document.activeElement && document.activeElement.id,
          scroll: panel.scrollHeight - panel.clientHeight, left: r.left, right: r.right, iw: innerWidth, top: r.top, bottom: r.bottom, ih: innerHeight };
      }, name);
      log(!st.hidden && st.expanded === 'true', `w${w} ${name}: opens, aria-expanded=${st.expanded}`);
      log(st.focus === 'cf-ph-' + name, `w${w} ${name}: focus moves to the panel heading (${st.focus})`);
      log(st.scroll <= 1, `w${w} ${name}: content fits without an inner scroll (overflow ${st.scroll}px)`);
      log(st.left >= 0 && st.right <= st.iw, `w${w} ${name}: panel inside the viewport horizontally (${Math.round(st.left)}..${Math.round(st.right)})`);
      log(st.top >= 60 && st.bottom <= st.ih + 1, `w${w} ${name}: panel scrolled into view (${Math.round(st.top)}..${Math.round(st.bottom)} of ${st.ih})`);
      await p.screenshot({ path: path.join(OUT, `w${w}-panel-${name}.png`) });
      if (name === 'rules') {
        await (touch ? p.tap('[data-approve]') : p.click('[data-approve]'));
        await sleep(900);
        await p.screenshot({ path: path.join(OUT, `w${w}-panel-rules-approved.png`) });
        const s = await p.evaluate(() => ({ status: document.querySelector('.cf-status').textContent, undo: !document.querySelector('[data-undo]').hidden, live: document.querySelector('[data-live]').textContent }));
        log(s.status.indexOf('Approved') === 0 && s.undo, `w${w} rules: Approve stamps and schedules ("${s.status}")`);
        await (touch ? p.tap('[data-undo]') : p.click('[data-undo]'));
        await (touch ? p.tap('.cf-mode label:nth-child(3)') : p.click('.cf-mode label:nth-child(3)'));
        const m = await p.evaluate(() => [...document.querySelectorAll('.cf-mode-note')].map((n) => n.hidden));
        log(m[0] === true && m[1] === false, `w${w} rules: Autopilot switches the note`);
        await (touch ? p.tap('.cf-mode label:nth-child(2)') : p.click('.cf-mode label:nth-child(2)'));
      }
      await p.keyboard.press('Escape');
      await sleep(550);
      const c = await p.evaluate((n) => ({ hidden: document.getElementById('cf-panel-' + n).hidden, focus: document.activeElement && document.activeElement.getAttribute('data-open'), pulled: document.querySelectorAll('.is-pulled').length, inert: document.querySelectorAll('.cf-dossier [inert]').length }), name);
      log(c.hidden && c.focus === name && !c.pulled && !c.inert, `w${w} ${name}: Escape closes and returns focus (${c.focus}), card back in place`);
    }
    // Next chain + outside click
    await (touch ? p.tap('[data-open="brief"]') : p.click('[data-open="brief"]'));
    await sleep(600);
    for (const n of ['voice', 'month', 'rules', 'time']) {
      await (touch ? p.tap(`#cf-panel-${n === 'voice' ? 'brief' : ({ month: 'voice', rules: 'month', time: 'rules' })[n]} [data-next]`) : p.click(`#cf-panel-${({ voice: 'brief', month: 'voice', rules: 'month', time: 'rules' })[n]} [data-next]`));
      await sleep(450);
    }
    const chain = await p.evaluate(() => [...document.querySelectorAll('.cf-panel')].filter((x) => !x.hidden).map((x) => x.id));
    log(chain.length === 1 && chain[0] === 'cf-panel-time', `w${w} Next walks brief → voice → month → rules → time (${chain.join(',')})`);
    await (touch ? p.tap('.cf-eyebrow') : p.click('.cf-eyebrow'));
    await sleep(550);
    const out = await p.evaluate(() => [...document.querySelectorAll('.cf-panel')].every((x) => x.hidden));
    log(out, `w${w} a press outside the panel closes it`);
    const o2 = await overflow(p);
    log(o2.sw <= o2.iw, `w${w} still no horizontal scroll after the panels (${o2.sw})`);
    log(errors.length === 0, `w${w} console clean ${errors.join(' | ')}`);
    await ctx.close();
  }

  // ── Desktop pointer: tilt, sheet pull, card lift ──
  {
    const { ctx, p } = await page(browser, { viewport: { width: 1440, height: 900 } });
    await sleep(2600);
    const box = await (await p.$('.cf-dossier')).boundingBox();
    await p.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15, { steps: 6 });
    await sleep(700);
    const t = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-folder')).transform);
    log(t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)', `tilt follows the cursor (${t.slice(0, 40)}…)`);
    await p.screenshot({ path: path.join(OUT, 'tilt.png') });
    const sh = await (await p.$('.cf-sheet-h')).boundingBox();
    await p.mouse.move(sh.x + 40, sh.y + 10, { steps: 4 });
    await sleep(700);
    const pull = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-sheet')).translate);
    log(pull.indexOf('-22px') >= 0, `the sheet slides out on hover (translate ${pull})`);
    await p.screenshot({ path: path.join(OUT, 'sheet-hover.png') });
    const card = await (await p.$('[data-open="month"]')).boundingBox();
    await p.mouse.move(card.x + card.width / 2, card.y + card.height / 2, { steps: 4 });
    await sleep(600);
    const lift = await p.evaluate(() => getComputedStyle(document.querySelector('[data-open="month"]')).translate);
    log(/-1[78]px|-18px/.test(lift), `a card lifts on hover (translate ${lift})`);
    await p.screenshot({ path: path.join(OUT, 'card-hover.png') });
    await p.mouse.move(5, 5, { steps: 3 });
    await sleep(700);
    const t2 = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-folder')).transform);
    log(t2 === 'none' || /matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\)|matrix\(1, 0, 0, 1, 0, 0\)/.test(t2), `tilt returns to rest when the pointer leaves (${t2.slice(0, 40)})`);
    // Entrance timeline: stamp hidden early, visible late.
    await p.reload({ waitUntil: 'domcontentloaded' });
    await sleep(350);
    const early = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-sheet .cf-stamp')).opacity);
    await p.screenshot({ path: path.join(OUT, 'entrance-350ms.png') });
    await sleep(700);
    await p.screenshot({ path: path.join(OUT, 'entrance-1050ms.png') });
    await sleep(1600);
    const late = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-sheet .cf-stamp')).opacity);
    log(+early < 0.2 && +late > 0.8, `staggered entrance: stamp lands after the cards (opacity ${early} → ${late})`);
    // Keyboard order
    await p.reload({ waitUntil: 'networkidle' });
    await sleep(2400);
    await p.focus('.cf-hero [data-cta="hero"]');
    const order = [];
    for (let i = 0; i < 7; i++) {
      await p.keyboard.press('Tab');
      order.push(await p.evaluate(() => { const a = document.activeElement; return a.getAttribute('data-open') || a.getAttribute('href') || a.className; }));
    }
    log(order.slice(0, 6).join(',') === '#how,brief,voice,month,rules,time', `keyboard order: ${order.join(' → ')}`);
    // Enter opens, focus in panel, Tab stays in panel content, Escape returns
    await p.focus('[data-open="voice"]');
    await sleep(500);
    await p.screenshot({ path: path.join(OUT, 'card-focus.png') });
    await p.keyboard.press('Enter');
    await sleep(600);
    await p.keyboard.press('Tab');
    const inPanel = await p.evaluate(() => !!document.activeElement.closest('#cf-panel-voice'));
    log(inPanel, 'Enter opens a card; Tab moves within the open panel');
    await p.keyboard.press('Escape');
    await sleep(500);
    log(await p.evaluate(() => document.activeElement.getAttribute('data-open') === 'voice'), 'Escape returns focus to the card');
    await ctx.close();
  }

  // ── Analytics: the dossier reports what visitors explore ──
  {
    const { ctx, p, errors } = await page(browser, { viewport: { width: 1440, height: 900 } });
    await sleep(2400);
    const events = () => p.evaluate(() => (window.dataLayer || [])
      .filter((a) => a && a[0] === 'event' && String(a[1]).indexOf('dossier_') === 0)
      .map((a) => [a[1], a[2] || {}]));
    await p.click('[data-open="voice"]');
    await sleep(500);
    await p.click('#cf-panel-voice [data-next]');
    await sleep(400);
    await p.click('#cf-panel-month [data-next]');
    await sleep(400);
    await p.click('.cf-mode label:nth-child(3)');
    await p.click('[data-edit]');
    await p.click('[data-edit]');
    await p.click('[data-approve]');
    await sleep(300);
    await p.keyboard.press('Escape');
    await sleep(500);
    await p.click('[data-open="voice"]');                // a panel seen before: panels_seen stays 3
    await sleep(500);
    const ev = await events();
    const opens = ev.filter((e) => e[0] === 'dossier_open').map((e) => `${e[1].panel}/${e[1].source}/${e[1].panels_seen}`);
    log(opens.join(',') === 'voice/card/1,month/next/2,rules/next/3,voice/card/3', `dossier_open events carry panel, source and depth (${opens.join(' ')})`);
    const rest = ev.filter((e) => e[0] !== 'dossier_open').map((e) => e[0] + (e[1].mode ? ':' + e[1].mode : ''));
    log(rest.join(',') === 'dossier_mode:auto,dossier_edit,dossier_approve', `approval demo events (${rest.join(' ')})`);
    log(errors.length === 0, 'analytics: console clean ' + errors.join(' | '));
    await ctx.close();
  }

  // ── Reduced motion ──
  {
    const { ctx, p, errors } = await page(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await sleep(150);
    const s = await p.evaluate(() => ({ stamp: getComputedStyle(document.querySelector('.cf-sheet .cf-stamp')).opacity, card: getComputedStyle(document.querySelector('.cf-card')).opacity, sheet: getComputedStyle(document.querySelector('.cf-sheet')).opacity }));
    log(+s.stamp > 0.8 && +s.card === 1 && +s.sheet === 1, `reduced motion: everything is in place at once (stamp ${s.stamp}, card ${s.card})`);
    const box = await (await p.$('.cf-dossier')).boundingBox();
    await p.mouse.move(box.x + box.width * 0.9, box.y + 40, { steps: 5 });
    await sleep(300);
    const t = await p.evaluate(() => getComputedStyle(document.querySelector('.cf-folder')).transform);
    log(t === 'none', `reduced motion: no tilt (${t})`);
    await p.click('[data-open="month"]');
    await sleep(80);
    const vis = await p.evaluate(() => { const pn = document.getElementById('cf-panel-month'); return { hidden: pn.hidden, op: getComputedStyle(pn.querySelector('h3')).opacity, tf: getComputedStyle(pn).transform }; });
    log(!vis.hidden && +vis.op === 1 && vis.tf === 'none', `reduced motion: panels appear in place, no fly-out (${vis.tf})`);
    await p.screenshot({ path: path.join(OUT, 'reduced-panel.png') });
    log(errors.length === 0, 'reduced motion: console clean ' + errors.join(' | '));
    await ctx.close();
  }

  // ── No JS: the hero still reads ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await sleep(2600);
    const s = await p.evaluate(() => ({ stamp: getComputedStyle(document.querySelector('.cf-sheet .cf-stamp')).opacity, h1: document.querySelector('.cf-h1').innerText.replace(/\s+/g, ' ') }));
    log(+s.stamp > 0.8, `no JS: the dossier is fully drawn (stamp ${s.stamp})`);
    await p.screenshot({ path: path.join(OUT, 'nojs.png') });
    await ctx.close();
  }

  await browser.close();
  console.log(results.join('\n'));
  const fails = results.filter((r) => r.startsWith('FAIL')).length;
  console.log('\n' + (results.length - fails) + ' pass, ' + fails + ' fail. Screenshots: ' + OUT);
  server.close();
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); server.close(); process.exit(1); });
