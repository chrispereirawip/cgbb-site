/* The CGBB white paper card (Weijing, 17 Nov 2026): preview for everyone, full edition for approved members.
   The full PDF never sits on this site: api.cgbb.org stamps a copy for the signed-in member on each download. */
(function () {
  var box = document.getElementById('wpdl'); if (!box) return;
  var API = 'https://api.cgbb.org', lang = box.getAttribute('data-lang') || 'en';
  var ED = lang === 'en' ? 'en' : 'cn', OTHER = ED === 'en' ? 'cn' : 'en';
  var T = {
    en: { pre: 'Download the preview (PDF)', preT: 'Cover, credits, contents and executive summary. Free, no sign-up.', full: 'Members: download the full edition', join: 'Become a member to get the full edition', pend: 'Full edition: available once your membership is approved', fullT: 'Your copy is marked with your name, organisation and the date. Please do not pass it on.', joinT: 'The full edition is for approved CGBB members. Basic membership is free.', alt: 'Chinese edition 中文版:', altPre: 'preview', altFull: 'full edition (members)', apply: '/apply/' },
    zh: { pre: '下載試讀版（PDF）', preT: '封面、署名、目錄、執行摘要及導言。免費，無需登記。', full: '會員下載完整版', join: '註冊會員，下載完整版', pend: '完整版：會員資格審核通過後即可下載', fullT: '下載的文件帶有您的姓名、機構及日期水印，請勿外傳。', joinT: '完整版僅向已通過審核的品信會會員開放。基本會籍免費。', alt: '英文版 English edition：', altPre: '試讀版', altFull: '完整版（會員）', apply: '/zh/apply/' },
    cn: { pre: '下载试读版（PDF）', preT: '封面、署名、目录、执行摘要和导言。免费，无需登记。', full: '会员下载完整版', join: '注册会员，下载完整版', pend: '完整版：会员资格审核通过后即可下载', fullT: '下载的文件带有您的姓名、公司及日期水印，请勿外传。', joinT: '完整版仅向已通过审核的品信会会员开放。基本会籍免费。', alt: '英文版 English edition：', altPre: '试读版', altFull: '完整版（会员）', apply: '/cn/apply/' }
  }[lang];
  function el(tag, attrs, txt) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt) e.textContent = txt; return e; }
  var row = el('div', { 'class': 'wpd-row' });
  var pre = el('a', { 'class': 'btn btn-red', href: API + '/whitepaper/preview?lang=' + ED, title: T.preT }, T.pre);
  var full = el('a', { 'class': 'btn btn-line', href: T.apply, title: T.joinT }, T.join);
  row.appendChild(pre); row.appendChild(full);
  var note = el('p', { 'class': 'wpd-note' }, T.joinT);
  // the other language edition, as plain links under the buttons
  var alt = el('p', { 'class': 'wpd-note wpd-alt' }, T.alt + ' ');
  var altPre = el('a', { href: API + '/whitepaper/preview?lang=' + OTHER }, T.altPre), altFull = el('a', { href: T.apply }, T.altFull);
  alt.appendChild(altPre); alt.appendChild(document.createTextNode(' · ')); alt.appendChild(altFull);
  box.appendChild(row); box.appendChild(note); box.appendChild(alt);
  // signed-in member? then the second button downloads their stamped copy
  fetch(API + '/api/account', { credentials: 'include' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (a) {
    if (!a || !a.whitepaper) return;
    var w = a.whitepaper, can = ED === 'en' ? w.canDownloadEn : w.canDownload, canO = OTHER === 'en' ? w.canDownloadEn : w.canDownload;
    if (can) { full.href = API + '/api/account/whitepaper?lang=' + ED; full.textContent = T.full; full.title = T.fullT; note.textContent = T.fullT; }
    else if (a.membership && a.membership.status === 'pending') { full.textContent = T.pend; full.removeAttribute('href'); full.className = 'btn btn-line wpd-off'; }
    if (canO) altFull.href = API + '/api/account/whitepaper?lang=' + OTHER;
  }).catch(function () {});
})();
