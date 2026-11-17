/* Self-test: start a re-test from the member's last answers for the same website (Chris, 18 Nov 2026).
   The same answers always give the same result, so the member changes only what has changed since last time. */
(function () {
  var API = 'https://api.cgbb.org', L = (document.documentElement.lang || 'en').toLowerCase();
  var lang = /hans/.test(L) ? 'cn' : /^zh/.test(L) ? 'zh' : 'en';
  var T = {
    en: 'We filled in your answers from your last self-test on {date}. Change only what has changed since then: the same answers always give the same result.',
    zh: '已帶入您 {date} 上次自測的回答。請只修改此後有變化的項目：相同的回答必然得到相同的結果。',
    cn: '已带入您 {date} 上次自测的回答。请只修改此后有变化的项目：相同的回答必然得到相同的结果。'
  }[lang];
  var done = '';
  function pick(q, v) {
    if (v === undefined || v === null || v === '') return;
    var el = q.querySelector('input[type=radio][value="' + String(v).replace(/"/g, '') + '"]');
    if (el && !el.checked) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  function fill(a) {
    // the "did any complaint or dispute arise" question first: it decides which checks are shown
    [].slice.call(document.querySelectorAll('.lk[data-kind="ev"]')).forEach(function (q) { pick(q, (a.events || {}).D2); });
    [].slice.call(document.querySelectorAll('.lk')).forEach(function (q) {
      var k = q.getAttribute('data-k'), kind = q.getAttribute('data-kind');
      var src = { check: a.checks, sample: a.sample, perf: a.perf, mat: a.maturity, rec: a.record, risk: a.risk }[kind];
      if (src) pick(q, src[k]);
    });
  }
  function profile(p) {
    var map = { ind: p.industry, hq: p.hq, size: p.size, role: p.role };
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el && !el.value && map[id]) { el.value = map[id]; el.dispatchEvent(new Event('change', { bubbles: true })); } });
    String(p.markets || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (m) {
      var el = document.querySelector('input[name=markets][value="' + m.replace(/"/g, '') + '"]'); if (el && !el.checked) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  }
  function load() {
    var w = (document.getElementById('web') || {}).value || '';
    if (!w || w === done) return; done = w;
    fetch(API + '/api/diagnosis/last?website=' + encodeURIComponent(w), { credentials: 'include' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || j.status !== 'ok' || !j.answers) return;
      profile(j.profile || {}); fill(j.answers);
      var host = document.querySelector('.dx-prog') || document.querySelector('.dx-panel');
      if (host && !document.getElementById('dx-pre')) {
        var n = document.createElement('p'); n.id = 'dx-pre'; n.setAttribute('role', 'status');
        n.style.cssText = 'margin:0 0 16px;padding:10px 14px;border-left:3px solid #A40706;background:#faf3f3;font-size:15px;line-height:1.6';
        n.textContent = T.replace('{date}', j.date || ''); host.parentNode.insertBefore(n, host);
      }
    }).catch(function () {});
  }
  // the brand is chosen with the "Continue" button of the first panel (or the brand selector); look once it is set
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-bxgo],[data-next]')) setTimeout(load, 50); }, true);
  document.addEventListener('change', function (e) { if (e.target && e.target.id === 'brsel') { done = ''; setTimeout(load, 50); } }, true);
})();
