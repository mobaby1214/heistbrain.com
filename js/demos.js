/* demos.js — Case File interactive demos (fixtures only, no network).
   Progressive enhancement: pages render usable static content without this
   file; it adds tabs, switchers and the plan finder. Loaded with `defer`. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var fired = {};
  function track(id) {
    if (fired[id]) return;
    fired[id] = true;
    if (typeof window.gtag === 'function') window.gtag('event', 'demo_open', { demo: id });
  }

  /* ── 1 · Four-stage case-file explorer ───────────────────────── */
  document.querySelectorAll('[data-demo="explorer"]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.cfx-tab'));
    var stages = Array.prototype.slice.call(root.querySelectorAll('.cfx-stage'));
    if (!tabs.length || tabs.length !== stages.length) return;

    var tablist = root.querySelector('.cfx-tabs');
    if (tablist) tablist.setAttribute('role', 'tablist');

    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on) { t.setAttribute('data-theme', 'light'); } else { t.removeAttribute('data-theme'); }
        stages[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      track('explorer');
    }

    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', stages[i].id);
      stages[i].setAttribute('role', 'tabpanel');
      stages[i].setAttribute('aria-labelledby', t.id);
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });

    root.querySelectorAll('.cfx-next').forEach(function (btn, i) {
      btn.addEventListener('click', function () { select((i + 1) % tabs.length, true); });
    });

    tabs[0].setAttribute('aria-selected', 'true');
    select(0, false);
    fired.explorer = false; /* don't count the initial render as an open */
  });

  /* ── Shared chip switcher (Brain notebook + chat demo) ───────── */
  function chipSwitcher(root, chipSel, sceneSel, id) {
    var chips = Array.prototype.slice.call(root.querySelectorAll(chipSel));
    var scenes = Array.prototype.slice.call(root.querySelectorAll(sceneSel));
    if (!chips.length || chips.length !== scenes.length) return;
    function select(i) {
      chips.forEach(function (c, j) {
        c.setAttribute('aria-pressed', i === j ? 'true' : 'false');
        scenes[j].hidden = i !== j;
      });
      track(id);
    }
    chips.forEach(function (c, i) {
      c.addEventListener('click', function () {
        select(i);
      });
    });
    select(0);
    fired[id] = false;
  }

  document.querySelectorAll('[data-demo="brain"]').forEach(function (root) {
    chipSwitcher(root, '.bnb-chip', '.bnb-voice', 'brain');
  });

  document.querySelectorAll('[data-demo="chat"]').forEach(function (root) {
    chipSwitcher(root, '.a2c-chip', '.a2c-scene', 'chat');
  });

  /* ── 5 · Plan finder + time math ─────────────────────────────── */
  document.querySelectorAll('[data-demo="plan-finder"]').forEach(function (root) {
    /* Entitlements mirror the plan cards on this page — keep in sync. */
    var PLANS = {
      starter: { name: 'Starter', price: '$19/mo', anchor: 'pricing-starter',
        why: '1 Brand Brain, 100 posts a month, 5 campaigns. Runs on your own AI API key; Heist + your AI starts on Pro.' },
      pro: { name: 'Pro', price: '$49/mo', anchor: 'pricing-pro',
        why: '1 Brand Brain, 500 posts a month, 20 campaigns, and Heist + your AI (Claude, ChatGPT).' },
      founder: { name: 'Founder', price: '$99/mo', anchor: 'pricing-founder',
        why: '5 Brand Brains, 3 team seats, unlimited posts and campaigns, approvals and roles, and Heist + your AI (Claude, ChatGPT).' },
      agency: { name: 'Agency', price: '$199/mo', anchor: 'pricing-agency',
        why: 'Up to 25 Brand Brains, 10 team seats, unlimited posts and campaigns, approvals and roles, and Heist + your AI (Claude, ChatGPT).' }
    };

    var out = root.querySelector('.pf-result');
    function answer(name) {
      var el = root.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }
    function recommend() {
      var brands = answer('pf-brands'), volume = answer('pf-volume'), chat = answer('pf-chat');
      if (!brands || !volume || !chat) return null;
      if (brands === 'many') return PLANS.agency;
      if (brands === 'few') return PLANS.founder;
      if (volume === 'high') return PLANS.founder;
      if (volume === 'mid' || chat === 'yes') return PLANS.pro;
      return PLANS.starter;
    }
    function render() {
      var p = recommend();
      if (!p) { out.hidden = true; return; }
      out.hidden = false;
      out.querySelector('.plan').innerHTML = p.name + '<small>' + p.price + '</small>';
      out.querySelector('.why').textContent = p.why;
      var go = out.querySelector('a.go');
      go.href = 'https://app.heistbrain.com/?utm_source=landing&utm_medium=cta&utm_content=plan-finder#signup';
      go.setAttribute('data-cta', 'plan-finder-' + p.anchor);
      track('plan-finder');
    }
    root.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.addEventListener('change', render);
    });
    out.hidden = true;

    /* Time math: states the cost of the user's own numbers, claims nothing. */
    var hrs = root.querySelector('#pf-hours'), rate = root.querySelector('#pf-rate');
    var mathOut = root.querySelector('.pf-math-out');
    function math() {
      var h = parseFloat(hrs.value), r = parseFloat(rate.value);
      if (!isFinite(h) || !isFinite(r) || h < 0 || r < 0) { mathOut.textContent = ''; return; }
      var monthly = Math.round(h * 4.33 * r);
      mathOut.innerHTML = 'At ' + h + ' hours a week, content costs you about <strong>$' +
        monthly.toLocaleString('en-US') + '/month</strong> of your own time. Weigh that against the plan prices above — the hours are the real line item.';
      track('plan-finder');
    }
    if (hrs && rate && mathOut) {
      [hrs, rate].forEach(function (el) { el.addEventListener('input', math); });
      math();
    }
  });
})();
