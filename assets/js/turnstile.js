// Cloudflare Turnstile (bot check) for the public forms: application, Trust Diagnosis, "send code" and login.
// Each form has an empty <div class="cf-ts" data-action="..." data-language="en|zh-tw">. Widgets are rendered once they
// are visible (CGBBTS.scan(), called when a panel or step is shown). Tokens are single use: forms call
// CGBBTS.reset(scope) after each request. If Turnstile can't load, forms still submit and the API decides.
(function () {
  var KEY = '0x4AAAAAAFkMtWjz2cfxTZO-';
  var ready = false;
  function widgets(scope) { return [].slice.call((scope || document).querySelectorAll('.cf-ts')); }
  function render(el) {
    if (!ready || el.getAttribute('data-ts-id') !== null || el.offsetParent === null) return;
    try {
      var id = window.turnstile.render(el, {
        sitekey: KEY,
        action: el.getAttribute('data-action') || undefined,
        language: el.getAttribute('data-language') || 'auto',
        theme: 'light',
        'response-field': false,
        'refresh-expired': 'auto'
      });
      el.setAttribute('data-ts-id', id);
    } catch (e) {}
  }
  function idOf(scope) {
    var el = scope && (scope.classList && scope.classList.contains('cf-ts') ? scope : scope.querySelector('.cf-ts'));
    return el ? el.getAttribute('data-ts-id') : null;
  }
  window.CGBBTS = {
    scan: function () { widgets().forEach(render); },
    token: function (scope) {
      var id = idOf(scope);
      if (!ready || id === null) return '';
      try { return window.turnstile.getResponse(id) || ''; } catch (e) { return ''; }
    },
    reset: function (scope) {
      var id = idOf(scope);
      if (ready && id !== null) { try { window.turnstile.reset(id); } catch (e) {} }
    }
  };
  window.cgbbTurnstileReady = function () { ready = true; window.CGBBTS.scan(); };
  // re-check for newly visible widgets when the page changes (panels, steps, hash routes)
  window.addEventListener('hashchange', function () { setTimeout(window.CGBBTS.scan, 0); });
  document.addEventListener('click', function () { setTimeout(window.CGBBTS.scan, 0); }, true);
})();
