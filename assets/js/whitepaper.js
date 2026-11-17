/* The CGBB white paper card (Weijing, 17 Nov 2026): preview for everyone, full edition for approved members.
   The full PDF never sits on this site: api.cgbb.org stamps a copy for the signed-in member on each download. */
(function () {
  var box = document.getElementById('wpdl'); if (!box) return;
  var API = 'https://api.cgbb.org', lang = box.getAttribute('data-lang') || 'en';
  var T = {
    en: { pre: 'Download the preview (PDF)', preT: 'Cover, credits, contents, executive summary and introduction. Free, no sign-up.', full: 'Members: download the full edition', join: 'Become a member to get the full edition', pend: 'Full edition: available once your membership is approved', fullT: 'Your copy is marked with your name, organisation and the date. Please do not pass it on.', joinT: 'The full edition (104 pages) is for approved CGBB members. Basic membership is free.', ph: 'Email (optional)', nt: 'Tell me when the English edition is out', ok: 'Thank you. We will email you.', bad: 'Please enter a valid email address.', err: 'Not sent. Please try again.', apply: '/apply/' },
    zh: { pre: '下載試讀版（PDF）', preT: '封面、署名、目錄、執行摘要及導言。免費，無需登記。', full: '會員下載完整版', join: '註冊會員，下載完整版', pend: '完整版：會員資格審核通過後即可下載', fullT: '下載的文件帶有您的姓名、機構及日期水印，請勿外傳。', joinT: '完整版（共 104 頁）僅向已通過審核的品信會會員開放。基本會籍免費。', ph: '電郵（選填）', nt: '完整版和英文版發布時通知我', ok: '謝謝，我們會以電郵通知您。', bad: '請輸入有效的電郵地址。', err: '未能提交，請重試。', apply: '/zh/apply/' },
    cn: { pre: '下载试读版（PDF）', preT: '封面、署名、目录、执行摘要和导言。免费，无需登记。', full: '会员下载完整版', join: '注册会员，下载完整版', pend: '完整版：会员资格审核通过后即可下载', fullT: '下载的文件带有您的姓名、公司及日期水印，请勿外传。', joinT: '完整版（共 104 页）仅向已通过审核的品信会会员开放。基本会籍免费。', ph: '邮箱（选填）', nt: '完整版和英文版发布时通知我', ok: '谢谢，我们会发邮件通知您。', bad: '请输入有效的邮箱地址。', err: '未能提交，请重试。', apply: '/cn/apply/' }
  }[lang];
  function el(tag, attrs, txt) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt) e.textContent = txt; return e; }
  var row = el('div', { 'class': 'wpd-row' });
  var pre = el('a', { 'class': 'btn btn-red', href: API + '/whitepaper/preview', title: T.preT }, T.pre);
  var full = el('a', { 'class': 'btn btn-line', href: T.apply, title: T.joinT }, T.join);
  row.appendChild(pre); row.appendChild(full);
  var note = el('p', { 'class': 'wpd-note' }, T.joinT);
  var form = el('form', { 'class': 'wpd-form', novalidate: '' });
  var inp = el('input', { type: 'email', placeholder: T.ph, 'aria-label': T.ph, autocomplete: 'email' });
  var hp = el('input', { type: 'text', name: 'website2', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', style: 'position:absolute;left:-9999px' });
  var sub = el('button', { type: 'submit', 'class': 'wpd-sub' }, T.nt), msg = el('span', { 'class': 'wpd-msg', role: 'status' });
  form.appendChild(inp); form.appendChild(hp); form.appendChild(sub); form.appendChild(msg);
  box.appendChild(row); box.appendChild(note); box.appendChild(form);
  form.addEventListener('submit', function (e) {
    e.preventDefault(); var v = inp.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) { msg.textContent = T.bad; return; }
    sub.disabled = true;
    fetch(API + '/api/whitepaper/notify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: v, lang: lang, website2: hp.value }) })
      .then(function (r) { msg.textContent = r.ok ? T.ok : T.err; if (r.ok) inp.value = ''; }).catch(function () { msg.textContent = T.err; }).then(function () { sub.disabled = false; });
  });
  // signed-in member? then the second button downloads their stamped copy
  fetch(API + '/api/account', { credentials: 'include' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (a) {
    if (!a || !a.whitepaper) return;
    if (a.whitepaper.canDownload) { full.href = API + '/api/account/whitepaper'; full.textContent = T.full; full.title = T.fullT; note.textContent = T.fullT; }
    else if (a.membership && a.membership.status === 'pending') { full.textContent = T.pend; full.removeAttribute('href'); full.className = 'btn btn-line wpd-off'; }
  }).catch(function () {});
})();
