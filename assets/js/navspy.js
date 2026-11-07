/* Homepage: the menu underline follows the section you are reading (Home at the top, Publications in Research & publications). */
(function(){
  var homes = [].slice.call(document.querySelectorAll('.navlink[data-home]')), pubs = [].slice.call(document.querySelectorAll('.navlink[href$="#publications"]')), sec = document.getElementById('publications');
  if (!homes.length || !pubs.length || !sec) return;
  function set(onPub){ homes.forEach(function(a){ onPub ? a.removeAttribute('aria-current') : a.setAttribute('aria-current', 'page'); }); pubs.forEach(function(a){ onPub ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); }); }
  function spy(){ var r = sec.getBoundingClientRect(), mid = window.innerHeight * 0.35; set(r.top <= mid && r.bottom > mid); }
  pubs.forEach(function(a){ a.addEventListener('click', function(){ set(true); }); });
  homes.forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
  window.addEventListener('scroll', spy, { passive: true }); spy();
})();
