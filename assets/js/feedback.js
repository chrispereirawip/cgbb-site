// Public message forms (.fbk) on the standard, About and Verify pages: a comment on the standard, a report about a
// badge or registry record, or a correction / complaint. Posts JSON to the CGBB API; messages go to the Secretariat.
(function () {
  var API = 'https://api.cgbb.org/api/feedback';
  [].slice.call(document.querySelectorAll('form.fbk')).forEach(function (f) {
    var msg = f.querySelector('.msg'), btn = f.querySelector('button[type=submit]'), label = btn.textContent;
    function say(key, ok, id) { msg.className = 'msg ' + (ok ? 'ok' : 'err'); msg.textContent = (f.getAttribute('data-m-' + key) || '').replace('{id}', id || ''); }
    function val(n) { var el = f.elements[n]; return el ? String(el.value || '').trim() : ''; }
    // a link such as /about/?kind=record&subject=brand.com#concern opens the form ready to fill in
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('kind') && f.elements.kind && f.elements.kind.tagName === 'SELECT') f.elements.kind.value = q.get('kind');
      if (q.get('subject') && f.elements.subject && !f.elements.subject.value) f.elements.subject.value = q.get('subject').slice(0, 200);
    } catch (e) {}
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(val('email'))) { say('email'); f.elements.email.focus(); return; }
      if (val('message').length < 10) { say('empty'); f.elements.message.focus(); return; }
      btn.disabled = true; btn.textContent = f.getAttribute('data-m-sending') || label; msg.textContent = '';
      var body = { kind: val('kind'), name: val('name'), email: val('email'), org: val('org'), subject: val('subject'), message: val('message'), website2: val('website2'), lang: f.getAttribute('data-lang') || 'en',
        turnstileToken: window.CGBBTS ? window.CGBBTS.token(f) : '' };
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          if (j.status === 'ok') { say('ok', true, j.id || ''); f.elements.message.value = ''; if (f.elements.subject) f.elements.subject.value = ''; }
          else say(j.status === 'bot_check' ? 'bot' : j.status === 'rate_limited' ? 'rate' : j.status === 'invalid_email' ? 'email' : j.status === 'empty' ? 'empty' : 'fail');
        })
        .catch(function () { say('fail'); })
        .then(function () { btn.disabled = false; btn.textContent = label; if (window.CGBBTS) window.CGBBTS.reset(f); });
    });
  });
})();
