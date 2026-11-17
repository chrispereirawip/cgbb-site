/* Admin: white paper files and download log (Weijing, 17 Nov 2026). Shown only to signed-in staff. */
(function () {
  var box = document.getElementById('wpadmin'); if (!box) return;
  var API = 'https://api.cgbb.org', sortK = 'at', sortD = -1, data = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bj(iso) { if (!iso) return ''; var d = new Date(new Date(iso).getTime() + 8 * 3600e3); return d.toISOString().slice(0, 16).replace('T', ' '); }
  function mb(n) { return (n / 1048576).toFixed(1) + ' MB'; }
  function load() { return fetch(API + '/api/staff/whitepaper', { credentials: 'include' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.status === 'ok') { data = j; draw(); } }); }
  function fileRow(kind, label) {
    var f = data.files[kind];
    return '<div class="wpa-f"><b>' + label + '</b><span>' + (f ? esc(f.name) + ' · ' + mb(f.size) + ' · ' + bj(f.at) + ' · ' + esc(f.by) : 'Not uploaded yet 尚未上傳') + '</span>' +
      '<label class="wpa-up" title="Replaces the stored PDF. Members get the new file from their next download. 替換後台儲存的 PDF，會員下次下載即為新檔。">Replace PDF 替換檔案<input type="file" accept="application/pdf" data-kind="' + kind + '" hidden></label></div>';
  }
  function draw() {
    var rows = data.downloads.slice().sort(function (a, b) { return String(a[sortK] || '').localeCompare(String(b[sortK] || '')) * sortD; });
    var th = [['at', 'Time (Beijing) 時間'], ['name', 'Member 會員'], ['org', 'Organisation 機構'], ['email', 'Email 電郵'], ['ip', 'IP'], ['country', 'Country 地區']];
    box.hidden = false;
    box.innerHTML = '<h2>White paper 白皮書</h2>' +
      '<p class="wpa-n">The full edition is stamped for each member when they download it. Each download is recorded here (member, organisation, time, IP), so a leaked copy can be traced by its watermark. 完整版在會員下載時即時加上個人水印，每次下載均記錄於此，文件外傳時可憑水印追溯。</p>' +
      fileRow('full', 'Full edition 完整版') + fileRow('preview', 'Preview 試讀版') +
      '<div class="wpa-k"><div><b>' + data.downloads.length + '</b>Full-edition downloads 完整版下載</div><div><b>' + data.preview.total + '</b>Preview downloads 試讀版下載</div><div><b>' + data.notify.length + '</b>Emails left 留下電郵</div>' +
      '<a class="wpa-t" href="' + API + '/api/staff/whitepaper/test" title="Downloads a stamped copy marked as a test. Not counted as a member download. 下載一份測試水印版，不計入會員下載記錄。">Download a test copy 下載測試版</a></div>' +
      '<div class="wpa-w"><table><thead><tr>' + th.map(function (h) { return '<th data-k="' + h[0] + '" title="Click to sort 點擊排序">' + h[1] + (sortK === h[0] ? (sortD > 0 ? ' ▲' : ' ▼') : '') + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (r) { return '<tr title="' + esc(r.stamp) + '"><td>' + bj(r.at) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.org) + '</td><td>' + esc(r.email) + '</td><td>' + esc(r.ip) + '</td><td>' + esc(r.country) + '</td></tr>'; }).join('') : '<tr><td colspan="6">No full-edition downloads yet. 暫無完整版下載記錄。</td></tr>') + '</tbody></table></div>' +
      (data.preview.days.length ? '<p class="wpa-n"><b>Preview downloads by day 試讀版每日下載：</b> ' + data.preview.days.slice(0, 14).map(function (d) { return d.day + ' · ' + d.count; }).join('　') + '</p>' : '') +
      (data.notify.length ? '<p class="wpa-n"><b>“Notify me” emails 通知電郵：</b> ' + data.notify.map(function (n) { return esc(n.email) + ' (' + bj(n.at).slice(0, 10) + ')'; }).join(', ') + '</p>' : '') + '<p class="wpa-m" role="status"></p>';
  }
  box.addEventListener('click', function (e) { var t = e.target.closest('th[data-k]'); if (!t) return; var k = t.getAttribute('data-k'); if (k === sortK) sortD = -sortD; else { sortK = k; sortD = 1; } draw(); });
  box.addEventListener('change', function (e) {
    var i = e.target; if (!i.matches('input[type=file][data-kind]') || !i.files[0]) return;
    var m = box.querySelector('.wpa-m'); m.textContent = 'Uploading… 上傳中…';
    fetch(API + '/api/staff/whitepaper/upload?kind=' + i.getAttribute('data-kind'), { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/pdf' }, body: i.files[0] })
      .then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (j) { if (j.status === 'ok') return load().then(function () { box.querySelector('.wpa-m').textContent = 'File replaced. 檔案已替換。'; }); m.textContent = 'Upload failed: please choose a PDF under 24 MB. 上傳失敗：請選擇 24 MB 以內的 PDF。'; })
      .catch(function () { m.textContent = 'Upload failed. 上傳失敗。'; });
  });
  load();
})();
