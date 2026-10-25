(function(){
var API="https://api.cgbb.org", M={"vEmpty": "Please write your message.", "badEmail": "Please enter a valid email address.", "badCode": "That code isn’t right. Please check the email and try again.", "expired": "That code has expired or was entered wrongly too many times. Please request a new one.", "badPw": "Please use at least 8 characters.", "pwMismatch": "The passwords don’t match.", "badLogin": "The email or password isn’t right. If you haven’t set a password yet, choose Sign up below (or Forgot password?) to create one with a code sent to your member email.", "bot": "Please complete the security check, then try again.", "noPw": "You haven’t set a password yet. We’ve switched you to sign up: we’ll email you a code to create one.", "rate": "Too many attempts. For your security, please wait up to 30 minutes and try again.", "fail": "Something went wrong. Please try again, or email secretariat@cgbb.org.", "codeHint": "Sent to {email}. The code expires in 10 minutes and stops working after 3 wrong tries.", "st_active": "Active", "st_pending": "Pending approval", "st_expired": "Expired", "st_declined": "Not approved", "st_inactive": "Inactive", "inP": "Your membership is currently inactive. Email secretariat@cgbb.org if you’d like to reactivate it.", "pendB": "Membership pending approval", "pendP": "Thank you for applying. CGBB is reviewing your membership. We’ll email you once it’s approved, and you’ll then have access to all member services, including the Trust Diagnosis.", "expP": "Your membership has expired. Email secretariat@cgbb.org to renew it.", "decP": "Your membership application was not approved. If you think this is a mistake, email secretariat@cgbb.org.", "thDate": "Date", "thCo": "Company", "thScore": "Indicative score", "thRep": "Report", "dlEn": "PDF (English)", "dlZh": "PDF (中文)", "processing": "Being prepared", "failed": "Not completed: email secretariat@cgbb.org", "noRep": "You haven’t run a Trust Diagnosis yet. <a href=\"/diagnosis/\">Start your free diagnosis</a>.", "locale": "en-GB", "refCopy": "Copy link", "copied": "Link copied", "refStat": "Successful referrals: {n} · {m} months added to your membership", "refMailSubj": "Join the Council for Global Brand Building (CGBB)", "refMsg": "I’m a member of the Council for Global Brand Building (CGBB) and I think you’d be a good fit. Membership is free. You can apply here: {link}", "nlOn": "Subscribed. Thank you.", "nlOff": "Unsubscribed. You won’t receive newsletters.", "upH": "Advanced membership", "upP": "A one-year membership that includes a comprehensive Trust Review. Brands scoring 80% or higher receive a CGBB-verified trust.json file. Billed yearly and renews automatically; you can cancel the renewal at any time.", "upPrice": "{p} per year", "upBtn": "Upgrade my membership", "upSoon": "Coming soon", "upSoonP": "Online card payment isn’t open yet. Request an upgrade and the Secretariat will send you the fee and next steps.", "upSecure": "Secure payment by Stripe. You enter your card on Stripe’s page; card details never reach CGBB.", "upActiveH": "You’re an Advanced member", "upRenews": "Renews automatically on {d}", "upEnds": "Ends on {d}. Automatic renewal is off.", "upPastDue": "Your last payment didn’t go through. Please update your card to keep your Advanced membership.", "upManage": "Manage billing", "upManageP": "Update your card, download invoices or cancel the renewal.", "upOpening": "Opening secure payment…", "upOk": "Thank you! Your payment went through. Your Advanced membership will appear here in a moment.", "upCancel": "Payment cancelled. Nothing was charged.", "tierAdv": "Advanced", "upReq": "Request upgrade", "upMore": "What’s included"}, LANG="en";
var demo=!API||/[?&]demo=1/.test(location.search);
if(demo){var db=document.querySelector('.demo');if(db)db.hidden=false;}
var TS=window.CGBBTS||{token:function(){return ''},reset:function(){},scan:function(){}};
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var hero=$('.ac-hero');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(d){if(!d)return '—';try{return new Date(d).toLocaleDateString(M.locale,{year:'numeric',month:'long',day:'numeric'})}catch(e){return d.slice(0,10)}}
function say(k,t){var el=$('[data-m="'+k+'"]');el.textContent=t;el.classList.add('on')}
function clear(k){$('[data-m="'+k+'"]').classList.remove('on')}
function bad(el,on){var q=el.closest('.q');q.classList.toggle('bad',on);if(on)el.focus();return on}
document.addEventListener('input',function(e){var q=e.target.closest('.q');if(q)q.classList.remove('bad')});
var demoState={};
function call(method,path,body){
 if(demo)return new Promise(function(res){setTimeout(function(){
  if(path==='/api/account'){res(demoState.email?{status:'ok',member:{email:demoState.email,name:'Alex Chan',org:'Example Co.',category:'Organizational'},membership:/pending/i.test(demoState.email)?{status:'pending',joined:new Date().toISOString()}:{status:'active',joined:'2026-10-02T00:00:00Z',approvedAt:'2026-10-05T00:00:00Z',validUntil:'2028-01-05T00:00:00Z',bonusMonths:3},referral:{code:'K7M2QX9',count:1,bonusMonths:3,months:3},billing:demoState.adv?{ready:true,price:{amount:780000,currency:'hkd'},advanced:{status:'active',until:'2027-10-25T00:00:00Z',cancelAtPeriodEnd:false},canManage:true}:{ready:true,price:{amount:780000,currency:'hkd'},advanced:null,canManage:false},reports:/pending/i.test(demoState.email)?[]:[{id:'CGBB-TD-20261012-A1B2C3',date:'2026-10-12T08:00:00Z',company:'Example Co.',status:'ready',score:64,band:{en:'Established',zh:'穩健'}}]}:{status:'signed_out'});return}
  if(path==='/api/auth/login'){demoState.email=body.email;res({status:'ok'});return}
  if(path==='/api/auth/logout'){demoState={};res({status:'ok'});return}
  if(path==='/api/account/newsletter'){res({status:'ok',newsletter:body.on});return}
  if(path==='/api/account/upgrade'){demoState.adv=true;res({status:'ok',url:location.pathname+'?upgrade=success'});return}
  if(path==='/api/account/billing-portal'){res({status:'ok',url:location.pathname});return}
  if(path==='/api/account/contact'){res({status:'ok',id:'MSG-DEMO-1A2B3C'});return}
  if(path==='/api/auth/code'){res(/nonmember/i.test(body.email)?{status:'not_member'}:{status:'code_sent'});return}
  if(path==='/api/auth/set-password'){if(body.code!=='12345678'){res({status:'wrong_code'});return}demoState.email=body.email;res({status:'ok'});return}
 },400)});
 var o={method:method,credentials:'include',headers:{}};
 if(body){o.headers['Content-Type']='application/json';o.body=JSON.stringify(body)}
 return fetch(API+path,o).then(function(r){return r.json()});}
function busy(b,on){if(b)b.disabled=on}
// panels
function show(p){$$('.ac-panel').forEach(function(x){x.classList.toggle('on',x.dataset.p===p)});$('[data-dash]').classList.toggle('on',p==='dash');hero.hidden=p==='dash';TS.scan();
 var f=$('.ac-panel.on input:not([hidden])');if(f&&p!=='dash')setTimeout(function(){f.focus({preventScroll:true})},50);}
function route(){var h=(location.hash||'').slice(1);show(h==='signup'||h==='forgot'?h:'login')}
window.addEventListener('hashchange',function(){if(!$('[data-dash]').classList.contains('on'))route()});
// login
$('[data-loginform]').addEventListener('submit',function(ev){ev.preventDefault();clear('login');
 var em=$('#lem'),pw=$('#lpw'),b=$('button[type=submit]',this);
 if(bad(em,!em.value.trim()||!em.checkValidity()))return; if(bad(pw,!pw.value))return;
 busy(b,true);
 var lf=this;call('POST','/api/auth/login',{email:em.value.trim().toLowerCase(),password:pw.value,turnstileToken:TS.token(lf)}).then(function(j){TS.reset(lf);
  if(j.status==='ok'){pw.value='';load()}
  else if(j.status==='no_password'){var se=$('#signup-em');se.value=em.value.trim();location.hash='signup';say('signup',M.noPw)}
  else if(j.status==='rate_limited')say('login',M.rate);
  else if(j.status==='bot_check')say('login',M.bot);
  else{say('login',M.badLogin);['signup','forgot'].forEach(function(k){var x=$('#'+k+'-em');if(x&&!x.value)x.value=em.value.trim()})}
 }).catch(function(){say('login',M.fail)}).then(function(){busy(b,false)});});
// sign up / forgot
['signup','forgot'].forEach(function(mode){
 var P=$('[data-p="'+mode+'"]'), em=$('#'+mode+'-em'), s1=$('[data-s1]',P), s2=$('[data-s2]',P), nm=$('[data-nm]',P), code=$('#'+mode+'-code'), pw=$('#'+mode+'-pw'), pw2=$('#'+mode+'-pw2'), email='';
 function send(){clear(mode);nm.classList.remove('on');
  if(bad(em,!em.value.trim()||!em.checkValidity()))return;
  email=em.value.trim().toLowerCase();var b=$('[data-send]',P);busy(b,true);
  call('POST','/api/auth/code',{email:email,lang:LANG,turnstileToken:TS.token(s1)}).then(function(j){TS.reset(s1);
   if(j.status==='code_sent'){s1.hidden=true;s2.classList.add('on');$('[data-uname]',P).value=email;$('[data-codehint]',P).textContent=M.codeHint.replace('{email}',email);code.focus()}
   else if(j.status==='not_member'){s1.hidden=true;nm.classList.add('on')}
   else if(j.status==='rate_limited')say(mode,M.rate);
   else if(j.status==='bot_check')say(mode,M.bot);
   else if(j.status==='invalid_email')bad(em,true);
   else say(mode,M.fail);
  }).catch(function(){say(mode,M.fail)}).then(function(){busy(b,false)});}
 $('[data-send]',P).addEventListener('click',send);
 em.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();send()}});
 $('[data-resend]',P).addEventListener('click',function(){s2.classList.remove('on');s1.hidden=false;send()});
 $$('[data-other]',P).forEach(function(b){b.addEventListener('click',function(){s2.classList.remove('on');nm.classList.remove('on');s1.hidden=false;em.value='';clear(mode);em.focus()})});
 s2.addEventListener('submit',function(ev){ev.preventDefault();clear(mode);
  var c=code.value.replace(/\D/g,'');
  if(bad(code,c.length<6||c.length>8))return; if(bad(pw,pw.value.length<8))return; if(bad(pw2,pw2.value!==pw.value))return;
  var b=$('button[type=submit]',s2);busy(b,true);
  call('POST','/api/auth/set-password',{email:email,code:c,password:pw.value,lang:LANG}).then(function(j){
   if(j.status==='ok'){pw.value='';pw2.value='';code.value='';load()}
   else if(j.status==='wrong_code')bad(code,true);
   else if(j.status==='expired')say(mode,M.expired);
   else if(j.status==='rate_limited')say(mode,M.rate);
   else if(j.status==='weak_password')bad(pw,true);
   else say(mode,M.fail);
  }).catch(function(){say(mode,M.fail)}).then(function(){busy(b,false)});});
});
// dashboard
function setD(k,v){var el=$('[data-d="'+k+'"]');if(el)el.textContent=v||'—'}
function render(j){
 var m=j.member, ms=j.membership; $('[data-admin]').hidden=!j.isAdmin;
 $('[data-d="hi"]').textContent=m.name?(LANG==='zh'?'，':', ')+m.name:'';setD('email',m.email);setD('name',m.name);setD('org',m.org);setD('category',m.category);
 setD('joined',fmt(ms.joined));setD('approved',fmt(ms.approvedAt));setD('valid',fmt(ms.validUntil));
 $('[data-f="approved"]').hidden=!ms.approvedAt;$('[data-f="valid"]').hidden=!ms.validUntil;$('[data-f="joined"]').hidden=!!ms.approvedAt;
 var bd=$('[data-badge]');bd.className='badge '+ms.status;bd.textContent=M['st_'+ms.status]||ms.status;
 var note=$('[data-note]'),nb=$('[data-noteb]'),np=$('[data-notep]');
 note.hidden=ms.status==='active';
 if(ms.status==='pending'){nb.textContent=M.pendB;np.textContent=M.pendP}
 else if(ms.status==='expired'){nb.textContent=M.st_expired;np.textContent=M.expP}
 else if(ms.status==='declined'){nb.textContent=M.st_declined;np.textContent=M.decP}
 else if(ms.status==='inactive'){nb.textContent=M.st_inactive;np.textContent=M.inP}
 $('[data-active]').hidden=ms.status!=='active';
 var R=$('[data-reps]');
 if(!j.reports||!j.reports.length){R.innerHTML='<p class="empty">'+M.noRep+'</p>'}
 else{var h='<table class="reps"><thead><tr><th>'+M.thDate+'</th><th>'+M.thCo+'</th><th>'+M.thScore+'</th><th>'+M.thRep+'</th></tr></thead><tbody>';
  j.reports.forEach(function(r){var dl=API+'/api/account/report?id='+encodeURIComponent(r.id);
   var link=r.status==='ready'?'<a href="'+dl+'&lang=en">'+M.dlEn+'</a><br><a href="'+dl+'&lang=zh">'+M.dlZh+'</a>':(r.status==='failed'?M.failed:M.processing);
   h+='<tr><td>'+esc(fmt(r.date))+'</td><td>'+esc(r.company)+'<span class="id">'+esc(r.id)+'</span></td><td>'+(r.score!=null?'<span class="sc">'+r.score+'<small>'+esc(r.band?(LANG==='zh'?r.band.zh:r.band.en):'')+'</small></span>':'—')+'</td><td>'+link+'</td></tr>'});
  R.innerHTML=h+'</tbody></table>'}
 renderRef(j.referral);renderUp(j.billing,ms);
 var nl=$('[data-nl]');if(nl)nl.checked=!!j.newsletter;
 var ac=document.querySelector('[data-acct]');if(ac){ac.innerHTML='<a class="btn btn-red" href="'+ac.getAttribute('data-href')+'">'+esc(ac.getAttribute('data-mine'))+'</a>'}
 show('dash');window.scrollTo({top:0});
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 upgPrefill();}
function upgPrefill(){if(!/[?&]upgrade=1/.test(location.search))return;if(UPREADY){history.replaceState(null,'',location.pathname);var u=$('#upgrade');if(u)setTimeout(function(){u.scrollIntoView({behavior:'smooth',block:'start'})},200);return}var t=$('#vtopic'),mm=$('#vmsg'),v=document.querySelector('.vip');if(!t||!mm||!v||v.offsetParent===null)return;t.value='membership';if(!mm.value)mm.value="I would like to upgrade to Advanced membership (minimum one year) and take the comprehensive Trust Review, with a view to obtaining a CGBB-verified trust.json file. Please send me the fee and next steps.";history.replaceState(null,'',location.pathname);setTimeout(function(){v.scrollIntoView({behavior:'smooth',block:'start'});mm.focus({preventScroll:true})},60)}
(function(){var nl=$('[data-nl]');if(!nl)return;nl.addEventListener('change',function(){var on=nl.checked,msg=$('[data-nlmsg]');nl.disabled=true;
 call('POST','/api/account/newsletter',{on:on}).then(function(j){if(j.status==='ok'){msg.style.color='';msg.textContent=on?M.nlOn:M.nlOff}else{nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}}).catch(function(){nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}).then(function(){nl.disabled=false})})})();
var REFLINK='';
function money(p){try{return new Intl.NumberFormat(M.locale,{style:'currency',currency:p.currency.toUpperCase(),maximumFractionDigits:p.amount%100?2:0}).format(p.amount/100)}catch(e){return p.currency.toUpperCase()+' '+(p.amount/100)}}
var UPREADY=false;
function renderUp(b,ms){var box=$('[data-upbody]');if(!box)return;UPREADY=!!(b&&b.ready);var bd=$('[data-badge]');if(ms.tier==='advanced'&&bd&&!bd.querySelector('.tier'))bd.insertAdjacentHTML('beforeend','<span class="tier">'+esc(M.tierAdv)+'</span>');
 b=b||{};var a=b.advanced,h;
 if(a&&(a.status==='active'||a.status==='past_due')){var pd=a.status==='past_due';
  h='<div class="upcard '+(pd?'warn':'on')+'"><div><p><b>'+esc(M.upActiveH)+'</b></p><p>'+esc(pd?M.upPastDue:(a.cancelAtPeriodEnd?M.upEnds:M.upRenews).split('{d}').join(fmt(a.until)))+'</p><p class="secure">'+esc(M.upManageP)+'</p></div>'+(b.canManage?'<button type="button" class="btn '+(pd?'btn-red':'btn-line')+'" data-upportal>'+esc(M.upManage)+'</button>':'')+'</div>'}
 else{h='<div class="upcard"><div><p>'+esc(M.upP)+'</p>'+(b.price?'<p class="price">'+esc(M.upPrice.split('{p}').join(money(b.price)))+'</p>':'')+(b.ready?'<p class="secure">'+esc(M.upSecure)+'</p>':'<p class="secure">'+esc(M.upSoonP)+'</p>')+'<p class="secure"><a href="/upgrade/">'+esc(M.upMore)+' →</a></p></div>'+(b.ready?'<button type="button" class="btn btn-red" data-upgo>'+esc(M.upBtn)+'</button>':'<a class="btn btn-line" href="?upgrade=1">'+esc(M.upReq)+'</a>')+'</div>'}
 box.innerHTML=h}
document.addEventListener('click',function(e){var go=e.target.closest('[data-upgo],[data-upportal]');if(!go)return;var portal=go.hasAttribute('data-upportal'),label=go.textContent;go.disabled=true;go.textContent=M.upOpening;
 call('POST',portal?'/api/account/billing-portal':'/api/account/upgrade',{lang:LANG}).then(function(j){if(j.status==='ok'&&j.url){location.href=j.url;return}throw j}).catch(function(){go.disabled=false;go.textContent=label;alert(M.fail)})});
(function(){var q=new URLSearchParams(location.search).get('upgrade');if(q!=='success'&&q!=='cancel')return;var el=$('[data-upmsg]');if(!el)return;el.hidden=false;el.className='upbanner'+(q==='success'?'':' off');el.textContent=q==='success'?M.upOk:M.upCancel;
 history.replaceState(null,'',location.pathname);if(q!=='success')return;var n=0;(function poll(){if(++n>10)return;setTimeout(function(){call('GET','/api/account').then(function(j){if(j.status==='ok'&&j.billing&&j.billing.advanced&&j.billing.advanced.status==='active'){renderUp(j.billing,j.membership);setD('valid',fmt(j.membership.validUntil))}else poll()}).catch(poll)},3000)})()})();
function renderRef(r){var box=$('[data-refer]');if(!box)return;box.hidden=!(r&&r.code);if(!r||!r.code)return;
 REFLINK='https://cgbb.org'+(LANG==='zh'?'/zh/apply/':'/apply/')+'?ref='+encodeURIComponent(r.code);
 $('[data-reflink]').value=REFLINK;var msg=M.refMsg.replace('{link}',REFLINK);
 $('[data-refmail]').href='mailto:?subject='+encodeURIComponent(M.refMailSubj)+'&body='+encodeURIComponent(msg);
 $('[data-refwa]').href='https://wa.me/?text='+encodeURIComponent(msg);
 $('[data-refshare]').hidden=!navigator.share;
 var st=$('[data-refstat]');st.hidden=!r.count;if(r.count)st.textContent=M.refStat.replace('{n}',r.count).replace('{m}',r.bonusMonths||r.count*3);}
(function(){var b=$('[data-refbtn]'),p=$('[data-refpanel]');if(!b)return;
 b.addEventListener('click',function(){p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)$('[data-reflink]').select()});
 function ok(){var o=$('[data-refok]');o.hidden=false;clearTimeout(ok.t);ok.t=setTimeout(function(){o.hidden=true},2500)}
 $('[data-refcopy]').addEventListener('click',function(){var i=$('[data-reflink]');
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(REFLINK).then(ok,function(){i.select();try{document.execCommand('copy');ok()}catch(e){}})}
  else{i.select();try{document.execCommand('copy');ok()}catch(e){}}});
 $('[data-refshare]').addEventListener('click',function(){if(navigator.share)navigator.share({title:M.refMailSubj,text:M.refMsg.replace('{link}',''),url:REFLINK}).catch(function(){})});
})();
(function(){var f=$('[data-vform]'),dn=$('[data-vdone]'),er=$('[data-verr]');if(!f)return;
 f.addEventListener('submit',function(ev){ev.preventDefault();er.classList.remove('on');var msg=$('#vmsg').value.trim();
  if(msg.length<5){er.textContent=M.vEmpty;er.classList.add('on');$('#vmsg').focus();return}
  var b=$('button[type=submit]',f);busy(b,true);
  call('POST','/api/account/contact',{topic:$('#vtopic').value,phone:$('#vphone').value.trim(),message:msg,lang:LANG}).then(function(j){
   if(j.status==='ok'){f.hidden=true;$('[data-vref]').textContent=j.id;dn.classList.add('on');dn.focus();$('#vmsg').value=''}
   else if(j.status==='rate_limited'){er.textContent=M.rate;er.classList.add('on')}
   else if(j.status==='empty'){er.textContent=M.vEmpty;er.classList.add('on')}
   else{er.textContent=M.fail;er.classList.add('on')}
  }).catch(function(){er.textContent=M.fail;er.classList.add('on')}).then(function(){busy(b,false)})});
 $('[data-vagain]').addEventListener('click',function(){dn.classList.remove('on');f.hidden=false;$('#vmsg').focus()});
})();
function load(){return call('GET','/api/account').then(function(j){if(j.status==='ok')render(j);else route()}).catch(function(){route()})}
$('[data-logout]').addEventListener('click',function(){var b=this;busy(b,true);call('POST','/api/auth/logout').then(function(){location.hash='login';route();var a=document.querySelector('[data-acct]');if(a&&a.dataset.orig)a.innerHTML=a.dataset.orig}).catch(function(){}).then(function(){busy(b,false)})});
var acct=document.querySelector('[data-acct]');if(acct)acct.dataset.orig=acct.innerHTML;
route();load();
})();
