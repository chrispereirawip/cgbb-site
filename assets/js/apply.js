try{var _r=new URLSearchParams(location.search).get('ref');if(_r)sessionStorage.setItem('cgbb_ref',_r)}catch(e){}
(function(){
  var ACCESS_KEY = '72f93922-676c-4d18-affe-c5ecb4b6d602';
  var form = document.querySelector('form.app');
  var steps = [].slice.call(form.querySelectorAll('.step'));
  var prog = [].slice.call(document.querySelectorAll('.steps li'));
  var cat = form.querySelector('[data-category]');
  var back = form.querySelector('[data-back]'), next = form.querySelector('[data-next]'), submit = form.querySelector('[data-submit]');
  var savedEl = form.querySelector('[data-saved]'), fail = form.querySelector('[data-fail]'), botFail = form.querySelector('[data-botfail]');
  var TS = window.CGBBTS || {token:function(){return ''}, reset:function(){}, scan:function(){}};
  var KEY = 'cgbb-apply-draft';
  var cur = 0;

  function isOrg(){ return /Organizational/.test(cat.value); }
  function active(){ return steps.filter(function(s){ var k=s.dataset.step; if(k==='individual') return !isOrg(); if(k==='organization') return isOrg(); return true; }); }
  function show(i){
    var list = active(); cur = Math.max(0, Math.min(i, list.length-1));
    steps.forEach(function(s){ s.classList.toggle('on', s===list[cur]); s.disabled = list.indexOf(s) < 0; });
    prog.forEach(function(p){ var s = form.querySelector('[data-step="'+p.dataset.for+'"]'); var idx = list.indexOf(s);
      p.classList.toggle('skip', idx < 0); p.classList.toggle('on', idx === cur); p.classList.toggle('done', idx > -1 && idx < cur); });
    var n=1; prog.forEach(function(p){ if(!p.classList.contains('skip')) p.querySelector('.n').textContent = n++; });
    back.style.visibility = cur ? 'visible' : 'hidden';
    next.style.display = cur < list.length-1 ? '' : 'none';
    submit.style.display = cur === list.length-1 ? '' : 'none';
    if (window.CGBBTS) window.CGBBTS.scan();
  }
  function syncOther(){
    form.querySelectorAll('[data-other-for]').forEach(function(box){ var sel=document.getElementById(box.dataset.otherFor); var on=/^Other/.test(sel.value); box.classList.toggle('on', on); box.querySelector('input').required = on; });
    form.querySelectorAll('[data-other-group]').forEach(function(box){ var g=document.getElementById(box.dataset.otherGroup); var on=[].some.call(g.querySelectorAll('input[type=checkbox]'), function(c){ return c.checked && /^Other/.test(c.value); }); box.classList.toggle('on', on); box.querySelector('input').required = on; });
  }
  function fixUrl(el){ var v = el.value.trim(); if (v && !/^https?:\/\//i.test(v)) v = 'https://' + v.replace(/^\/+/, ''); el.value = v; }
  form.addEventListener('blur', function(e){ if (e.target.matches && e.target.matches('[data-url]')) fixUrl(e.target); }, true);
  function validStep(step){
    step.querySelectorAll('[data-url]').forEach(fixUrl);
    var ok = true, first = null;
    step.querySelectorAll('.q').forEach(function(q){
      var bad = false;
      if (q.dataset.group){ if (q.dataset.required && !q.querySelector('.opts input:checked')) bad = true; }
      else if (q.dataset.radio){ if (!q.querySelector('input:checked')) bad = true; }
      q.querySelectorAll('input:not([type=checkbox]):not([type=radio]),select,textarea').forEach(function(el){ if (el.offsetParent !== null || el.closest('.other.on')) { if (!el.checkValidity()) bad = true; } });
      q.classList.toggle('bad', bad);
      if (bad){ ok = false; first = first || q; }
    });
    if (first){ var f = first.querySelector('input,select,textarea'); first.scrollIntoView({behavior:'smooth', block:'center'}); if (f) setTimeout(function(){ f.focus({preventScroll:true}); }, 300); }
    return ok;
  }
  function collect(){
    var data = {};
    active().forEach(function(step){
      step.querySelectorAll('.q').forEach(function(q){
        if (q.dataset.group){ var v=[].map.call(q.querySelectorAll('.opts input:checked'), function(c){ return c.value; }); if (v.length) data[q.dataset.group] = v.join('; '); }
        if (q.dataset.radio){ var c=q.querySelector('input:checked'); if (c) data[q.dataset.radio] = c.value; }
        q.querySelectorAll('[data-key]').forEach(function(el){ if (el.value.trim() && (el.offsetParent !== null || !el.closest('.other'))) data[el.dataset.key] = el.value.trim(); });
      });
    });
    return data;
  }
  function save(){
    try {
      var all = {}; form.querySelectorAll('input,select,textarea').forEach(function(el){ if (!el.name || el.name==='botcheck' || /^cf-turnstile/.test(el.name)) return; if (el.type==='checkbox'||el.type==='radio'){ all[el.name]=all[el.name]||[]; if (el.checked) all[el.name].push(el.value); } else all[el.name]=el.value; });
      localStorage.setItem(KEY, JSON.stringify(all)); savedEl.innerHTML = SAVED;
    } catch(e){}
  }
  function restore(){
    try {
      var all = JSON.parse(localStorage.getItem(KEY)||'null'); if (!all) return;
      form.querySelectorAll('input,select,textarea').forEach(function(el){ if (!(el.name in all)) return; var v=all[el.name]; if (el.type==='checkbox'||el.type==='radio') el.checked = v.indexOf(el.value) > -1; else el.value = v; });
    } catch(e){}
  }
  var SAVED = 'Progress saved on this device / <span lang="zh-Hant">進度已保存在此裝置</span>';

  form.querySelectorAll('textarea[maxlength]').forEach(function(t){ var c=form.querySelector('[data-count-for="'+t.id+'"]'); var u=function(){ c.textContent = t.value.length+' / '+t.maxLength; }; t.addEventListener('input', u); u(); });
  form.addEventListener('change', function(e){ syncOther(); if (e.target===cat) show(cur); var q=e.target.closest('.q'); if (q) q.classList.remove('bad'); save(); });
  form.addEventListener('input', function(e){ var q=e.target.closest('.q'); if (q && q.classList.contains('bad')) validStep(q.parentNode) ; save(); });
  next.addEventListener('click', function(){ if (validStep(active()[cur])) { show(cur+1); window.scrollTo({top: form.offsetTop - 120, behavior:'smooth'}); } });
  back.addEventListener('click', function(){ show(cur-1); window.scrollTo({top: form.offsetTop - 120, behavior:'smooth'}); });
  form.addEventListener('submit', function(e){
    e.preventDefault(); fail.classList.remove('on'); botFail.classList.remove('on');
    if (!validStep(active()[cur])) return;
    if (form.botcheck.checked) return;
    var d = collect();
    var name = [d['First Name'], d['Last Name']].filter(Boolean).join(' ');
    var payload = Object.assign({ access_key: ACCESS_KEY, subject: 'New CGBB membership application: ' + name + ' (' + (isOrg() ? 'Organizational' : 'Individual') + ')', from_name: 'cgbb.org membership form', replyto: d['Email'], 'Page language': document.documentElement.lang }, d);
    if (!ACCESS_KEY) { fail.classList.add('on'); return; }
    submit.disabled = true; botFail.classList.remove('on');
    // 1) register the applicant as a member (Turnstile bot check), 2) send the application email to the Secretariat
    fetch('https://api.cgbb.org/api/members/register', {method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: d['Email'], name: name, org: d['Organization Name'] || d['Current Organization'] || '', category: isOrg() ? 'Organizational' : 'Individual', lang: document.documentElement.lang, app: d, newsletter: !!(d['Email Updates'] && String(d['Email Updates']).length), ref: (function(){try{var r=(new URLSearchParams(location.search).get('ref')||'');if(r)sessionStorage.setItem('cgbb_ref',r);return r||sessionStorage.getItem('cgbb_ref')||''}catch(e){return ''}})(), turnstileToken: TS.token(form)})})
      .then(function(r){ return r.json(); }).catch(function(){ return {}; })
      .then(function(rj){
        TS.reset(form);
        if (rj && rj.error === 'bot_check') { var e = new Error('bot'); e.bot = true; throw e; }
        return fetch('https://api.web3forms.com/submit', { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body: JSON.stringify(payload) });
      })
      .then(function(r){ return r.json(); })
      .then(function(j){ if (!j.success) throw new Error(j.message||'failed'); try{ localStorage.removeItem(KEY); }catch(e){} form.style.display='none'; document.querySelector('.steps').style.display='none'; var dn=document.querySelector('[data-done]'); dn.classList.add('on'); dn.focus(); window.scrollTo({top:0, behavior:'smooth'}); })
      .catch(function(e){ (e && e.bot ? botFail : fail).classList.add('on'); submit.disabled = false; });
  });

  (function(){
    var sel = form.querySelector('[data-countries]'); if (!sel) return;
    var codes = 'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(' ');
    var fixed = { CN: ['China','中國'], HK: ['Hong Kong','香港'], MO: ['Macao','澳門'], TW: ['Taiwan','臺灣'] };
    var en = null, zh = null; try { en = new Intl.DisplayNames(['en'], {type:'region'}); zh = new Intl.DisplayNames(['zh-Hant'], {type:'region'}); } catch(e){}
    var list = codes.map(function(c){ var n = fixed[c] || [en ? en.of(c) : c, zh ? zh.of(c) : '']; return n[1] && n[1] !== n[0] ? n[0] + ' / ' + n[1] : n[0]; });
    list.sort(function(a,b){ return a.localeCompare(b, 'en'); });
    list.push('Other / 其他');
    // pin China, Hong Kong, Macao and Taiwan at the top as well as in the A-Z list
    var top = ['CN','HK','MO','TW'].map(function(c){ return fixed[c][0] + ' / ' + fixed[c][1]; });
    var g1 = document.createElement('optgroup'); g1.label = '\u00a0'; top.forEach(function(v){ var o = document.createElement('option'); o.value = v; o.textContent = v; g1.appendChild(o); }); sel.appendChild(g1);
    var g2 = document.createElement('optgroup'); g2.label = 'A–Z'; list.forEach(function(v){ var o = document.createElement('option'); o.value = v; o.textContent = v; g2.appendChild(o); }); sel.appendChild(g2);
  })();
  restore();
  syncOther(); show(0);
})();
