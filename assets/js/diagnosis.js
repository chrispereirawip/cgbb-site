(function(){
var API="https://api.cgbb.org", M={"badEmail": "Please enter a valid email address.", "badCode": "That code isn’t right. Please check the email and try again.", "expired": "That code has expired or was entered wrongly too many times. Please request a new one.", "cooldown": "You ran the self-test recently. You can run the next one from {date}. We recommend repeating it every six months.", "inactive": "Your membership isn’t active at the moment, so the Baseline self-test is unavailable. Email secretariat@cgbb.org to renew or reactivate it.", "rate": "Too many attempts. For your security, please wait up to 30 minutes and try again.", "bot": "Please complete the security check, then try again.", "session": "Your session expired. Please confirm your email again.", "fail": "Something went wrong. Please try again, or email secretariat@cgbb.org.", "codeHint": "If {email} is an active member’s email, a code is on its way. It expires in 10 minutes and stops working after 3 wrong tries.", "doneP": "We’re scanning {company}’s website and public records to prepare your report.", "doneM": "Usually within 15 minutes, to {email}.", "locked": "From your membership: the self-test covers your organisation and the website you confirmed with the CGBB badge.", "step": "Step {i} of {n} · {t} · {c}", "unanswered": "{n} questions on this page still need an answer."}, LANG="en";
var demo=!API||/[?&]demo=1/.test(location.search);
if(demo){var b=document.querySelector('.demo');if(b)b.hidden=false;}
var TS=window.CGBBTS||{token:function(){return ''},reset:function(){},scan:function(){}};
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var panels=$$('.dx-panel'), LAST=panels.length-1, prog=$$('.dx-prog li'), nav=$('[data-mainnav]'), msg=$('[data-msg]'), msg1=$('[data-msg1]');
var st={email:'',token:'',cur:0};
function show(i){st.cur=i;panels.forEach(function(p,j){p.classList.toggle('on',j===i)});
 nav.hidden=i===0; $('[data-next]').style.display=i<LAST?'':'none'; $('[data-submit]').style.display=i===LAST?'':'none';
 if(i===LAST)review(); msg.classList.remove('on'); left(panels[i]); paint();}
var pg=$('.dx-prog'),curl=$('[data-cur]');
function need(q){var el=$('input,select,textarea',q);if(!el||el.type==='checkbox'&&!el.id)return null;if(el.type==='checkbox')return {ok:el.checked};if(!el.required)return null;return {ok:!!el.value.trim()&&el.checkValidity()}}
function stat(i){if(i===0)return {a:st.token?1:0,n:1};var p=panels[i],a=0,n=0;$$('.q[data-q]',p).forEach(function(q){var r=need(q);if(r){n++;if(r.ok)a++}});open(p).forEach(function(q){n++;if(val(q))a++});return {a:a,n:n}}
function paint(){var go=!!st.token;pg.classList.toggle('go',go);prog.forEach(function(li,j){var s=stat(j),done=s.n>0&&s.a===s.n&&j<LAST;li.classList.toggle('on',j===st.cur);li.classList.toggle('fin',done&&j!==st.cur);li.classList.toggle('part',!done&&s.a>0&&j!==st.cur);
 $('.c',li).textContent=j===0||j===LAST||!s.n?'':s.a+'/'+s.n;if(j===st.cur)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');
 if(go&&j>0){li.tabIndex=0;li.setAttribute('role','button')}else{li.removeAttribute('tabindex');li.removeAttribute('role')}});
 var s=stat(st.cur);if(curl)curl.textContent=M.step.replace('{i}',st.cur+1).replace('{n}',prog.length).replace('{t}',$('.t',prog[st.cur]).textContent).replace(' · {c}',st.cur>0&&st.cur<LAST&&s.n?' · '+s.a+'/'+s.n:'')}
function jump(li){if(!li||!st.token)return;var i=+li.dataset.i;if(i===st.cur)return;show(i);top()}
pg.addEventListener('click',function(e){jump(e.target.closest('li'))});
pg.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var li=e.target.closest('li');if(li){e.preventDefault();jump(li)}}});
function say(el,t){el.textContent=t;el.classList.add('on')}
function call(path,body){
 if(demo)return new Promise(function(res){setTimeout(function(){
  if(path==='/start')res({status:'code_sent'});
  else if(path==='/verify')res(body.code==='12345678'?{status:'ok',token:'demo',company:'Brightleaf Co.',website:'brightleaf.co',brands:[{company:'Brightleaf Co.',website:'brightleaf.co'},{company:'Leafline Tea',website:'leafline.com'}]}:{status:'wrong_code'});
  else res({status:'queued',id:'CGBB-BL-DEMO',email:st.email});},500)});
 return fetch(API+'/api/diagnosis'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()});}
function busy(btn,on){btn.disabled=on}
function bad(q,on){q.classList.toggle('bad',on);return on}
// step 1: member email and code
var em=$('#em'), code=$('#code'), sent=$('[data-sent]'), nm=$('[data-notmember]'), pd=$('[data-pending]'), startB=$('[data-start]');
function start(){msg1.classList.remove('on');nm.classList.remove('on');pd.classList.remove('on');
 if(bad(em.closest('.q'),!em.value.trim()||!em.checkValidity())){em.focus();return}
 st.email=em.value.trim().toLowerCase(); busy(startB,true);
 var p0=$('[data-p="0"]');call('/start',{email:st.email,lang:LANG,turnstileToken:TS.token(p0)}).then(function(j){TS.reset(p0);
  if(j.status==='not_member'){nm.classList.add('on');sent.classList.remove('on');$('[data-step1]').hidden=true;}
  else if(j.status==='pending'){pd.classList.add('on');sent.classList.remove('on');$('[data-step1]').hidden=true;}
  else if(j.status==='code_sent'){sent.classList.add('on');$('[data-step1]').hidden=true;em.readOnly=true;$('[data-codehint]').textContent=M.codeHint.replace('{email}',st.email);code.focus();}
  else if(j.status==='cooldown')say(msg1,M.cooldown.replace('{date}',j.next));
  else if(j.status==='inactive')say(msg1,M.inactive);
  else if(j.status==='rate_limited')say(msg1,M.rate);
  else if(j.status==='bot_check')say(msg1,M.bot);
  else if(j.status==='invalid_email')bad(em.closest('.q'),true);
  else say(msg1,M.fail);
 }).catch(function(){say(msg1,M.fail)}).then(function(){busy(startB,false)});}
startB.addEventListener('click',start);
em.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();start()}});
$('[data-resend]').addEventListener('click',function(){em.readOnly=false;start()});
$$('[data-other]').forEach(function(b){b.addEventListener('click',function(){em.readOnly=false;em.value='';sent.classList.remove('on');nm.classList.remove('on');pd.classList.remove('on');$('[data-step1]').hidden=false;msg1.classList.remove('on');em.focus()})});
function verify(){var v=code.value.replace(/\D/g,'');if(bad(code.closest('.q'),v.length<6||v.length>8))return;var b=$('[data-verify]');busy(b,true);
 call('/verify',{email:st.email,code:v}).then(function(j){
  if(j.status==='ok'){st.token=j.token;if(j.brands&&j.brands.length>1&&!$('#brsel')){var esc=function(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};var q0=$('#co').closest('.q');q0.insertAdjacentHTML('beforebegin','<div class="q brq" style="grid-column:1/-1"><label for="brsel">Which brand is this self-test for?</label><select id="brsel">'+j.brands.map(function(x,i){return '<option value="'+i+'">'+esc(x.company)+' · '+esc(x.website)+'</option>'}).join('')+'</select></div>');$('#brsel').addEventListener('change',function(){var x=j.brands[+this.value];$('#co').value=x.company;$('#web').value=x.website});q0.style.display='none';$('#web').closest('.q').style.display='none';$('.brq').insertAdjacentHTML('beforeend','<p class="lockn">'+M.locked+'</p>')}if(j.website){var co=$('#co'),wb=$('#web');co.value=j.company||co.value;wb.value=j.website;co.readOnly=wb.readOnly=true;co.classList.add('locked');wb.classList.add('locked');var ch=$('.hint',co.closest('.q'));if(ch)ch.style.display='none';var q=wb.closest('.q');if(q&&!$('.lockn',q))q.insertAdjacentHTML('beforeend','<p class="lockn">'+M.locked+'</p>')}show(1);top()}
  else if(j.status==='expired'){say(msg1,M.expired)}
  else if(j.status==='rate_limited'){say(msg1,M.rate)}
  else bad(code.closest('.q'),true);
 }).catch(function(){say(msg1,M.fail)}).then(function(){busy(b,false)});}
$('[data-verify]').addEventListener('click',verify);
code.addEventListener('input',function(){code.closest('.q').classList.remove('bad');if(code.value.replace(/\D/g,'').length===8)verify()});
// questionnaire: conditional items
function val(q){var c=$('input:checked',q);return c?c.value:null}
// questions worded so that Yes is always the good answer: flip back to the scoring engine's wording (Yes = problem)
function eff(q){var v=val(q);if(q&&q.dataset.flip&&(v==='y'||v==='n'))return v==='y'?'n':'y';return v}
function pick(kind,k){return $('.lk[data-kind="'+kind+'"][data-k="'+k+'"]')}
function deps(){
 $$('.lk[data-dep="sample"]').forEach(function(q){q.hidden=val(pick('sample',q.dataset.k))!=='y'});
 var r=pick('risk','operating');if(r)r.hidden=eff(pick('risk','open'))!=='y';
 var ev=pick('ev','events'),no=ev&&val(ev)==='n';$$('.lk[data-ev]').forEach(function(q){q.hidden=no});
 $$('.lk[hidden]').forEach(function(q){q.classList.remove('bad')});}
function open(p){return $$('.lk',p).filter(function(q){return !q.hidden})}
function left(p){var el=$('[data-left]',p);if(!el)return;var n=open(p).filter(function(q){return !val(q)}).length;el.textContent=n?M.unanswered.replace('{n}',n):''}
// validation
function valid(i){var p=panels[i],first=null;
 $$('.q[data-q]',p).forEach(function(q){var el=$('input,select',q);if(!el||el.type==='checkbox'&&!el.id)return;
  var b=el.type==='checkbox'?!el.checked:(el.required&&(!el.value.trim()||!el.checkValidity()));if(el.id==='web')b=!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(el.value.trim());
  if(bad(q,b)&&!first)first=q});
 open(p).forEach(function(q){if(bad(q,!val(q))&&!first)first=q});
 if(first){first.scrollIntoView({behavior:'smooth',block:'center'});var f=$('input,select',first);if(f)setTimeout(function(){f.focus({preventScroll:true})},300)}
 return !first}
document.addEventListener('change',function(e){var q=e.target.closest('.q,.lk');if(q)q.classList.remove('bad');deps();left(panels[st.cur]);paint()});
document.addEventListener('input',function(e){var q=e.target.closest('.q');if(q&&q.classList.contains('bad'))q.classList.remove('bad');if(q)paint()});
function fv(id){return ($('#'+id)||{}).value||''}
function review(){var d={company:fv('co'),website:fv('web'),industry:fv('ind'),hq:fv('hq'),email:st.email};$$('[data-rv]').forEach(function(x){x.textContent=d[x.dataset.rv]||'—'})}
function top(){var y=panels[st.cur].getBoundingClientRect().top+window.scrollY-pg.offsetHeight-16;if(window.scrollY>y)window.scrollTo({top:y,behavior:'smooth'})}
function answers(){var a={checks:{},perf:{},sample:{},maturity:{},events:{},record:{},risk:{}};
 $$('.lk').forEach(function(q){var v=q.hidden?null:eff(q),k=q.dataset.k,kind=q.dataset.kind;
  if(kind==='check'){a.checks[k]=v||'na'}
  else if(kind==='sample'){a.sample[k]=v||'u'}
  else if(kind==='perf'){a.perf[k]=v&&v!=='u'?Number(v):'u'}
  else if(kind==='mat'){a.maturity[k]=v&&v!=='u'?Number(v):'u'}
  else if(kind==='rec'){a.record[k]=v&&v!=='u'?Number(v):'u'}
  else if(kind==='ev'){a.events.D2=v}
  else if(kind==='risk'){a.risk[k]=v||'n'}});
 return a}
$('[data-next]').addEventListener('click',function(){if(valid(st.cur)){show(st.cur+1);top()}});
$('[data-back]').addEventListener('click',function(){show(st.cur-1);top()});
$('[data-submit]').addEventListener('click',function(){for(var k=1;k<LAST;k++){var t=stat(k);if(t.a<t.n){show(k);valid(k);return}}if(!valid(LAST))return;var b=this;busy(b,true);msg.classList.remove('on');
 var body={token:st.token,lang:LANG,company:fv('co').trim(),website:fv('web').trim(),answers:answers(),profile:{industry:fv('ind'),hq:fv('hq'),size:fv('size'),role:fv('role'),markets:$$('input[name=markets]:checked').map(function(c){return c.value}).join('; ')}};
 call('/submit',body).then(function(j){
  if(j.status==='queued'){$('.dx').hidden=true;$('.dx-prog').hidden=true;var d=$('[data-done]');$('[data-donep]').textContent=M.doneP.replace('{company}',body.company).replace('{email}',j.email||st.email);$('[data-doneid]').textContent=j.id;$('[data-donem]').textContent=M.doneM.replace('{email}',j.email||st.email);var ph=$$('.dx-path span');if(ph[0]){ph[0].className='ok';$('b',ph[0]).textContent='✓'}if(ph[1])ph[1].className='on';d.classList.add('on');d.focus({preventScroll:true});window.scrollTo({top:d.getBoundingClientRect().top+window.scrollY-24,behavior:'smooth'});}
  else if(j.status==='session_expired'){say(msg,M.session);setTimeout(function(){show(0);em.readOnly=false;sent.classList.remove('on');$('[data-step1]').hidden=false},2500)}
  else say(msg,M.fail);
 }).catch(function(){say(msg,M.fail)}).then(function(){busy(b,false)});});

/* ---------- signed-in members: no email code, choose a brand (8 Nov 2026) ---------- */
var BX={"pickH": "Choose your brand", "pickP": "Signed in as {email}. Choose the brand this self-test is for. Only brands with the CGBB badge on their website are listed.", "signinH": "Sign in to run the self-test", "signinP": "The Baseline self-test runs inside your member account. Sign in, then start it from there.", "signinBtn": "Sign in to my account", "noBadgeH": "Add the CGBB badge first", "noBadgeP": "Before the self-test, {host} needs to show the CGBB Member badge, linked to its verification page. This shows that you control the website.", "noSiteP": "First confirm your website in your member account and add the CGBB Member badge to it.", "pendH": "Membership pending approval", "pendP": "The self-test opens as soon as your membership is approved.", "inactH": "Membership not active", "acct": "Go to my account", "cont": "Continue", "stepLbl": "Brand", "loading": "Loading your brands…"},p0=panels[0];
(function(){var h=document.createElement('div');h.className='bx';h.setAttribute('data-bx','');h.innerHTML='<p class="bx-load">'+BX.loading+'</p>';p0.insertBefore(h,p0.firstChild);
 $$('h2,.intro,.q,.cf-ts,[data-step1]',p0).forEach(function(x){if(!x.closest('[data-bx]')){x.setAttribute('data-old','');x.style.display='none'}});
 var lab=$('.dx-prog li[data-i="0"] .t');if(lab)lab.textContent=BX.stepLbl;})();
function bxBlock(h,p,btn){$('[data-bx]').innerHTML='<h2>'+h+'</h2><p class="intro">'+p+'</p>'+(btn?'<div class="ctas"><a class="btn btn-red" href="'+btn[1]+'">'+btn[0]+'</a></div>':'')}
function bxPick(j){var esc=function(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 $('[data-bx]').innerHTML='<h2>'+BX.pickH+'</h2><p class="intro">'+esc(BX.pickP.replace('{email}',j.email||''))+'</p><div class="bx-list" role="radiogroup">'+j.brands.map(function(x,i){return '<label class="bx-b"><input type="radio" name="bxb" value="'+i+'"'+(i===0?' checked':'')+'><span><b>'+esc(x.company)+'</b><small>'+esc(x.website)+'</small></span></label>'}).join('')+'</div><div class="nav"><span class="sp"></span><button type="button" class="btn btn-red" data-bxgo>'+BX.cont+'</button></div>';
 $('[data-bxgo]').addEventListener('click',function(){var x=j.brands[+($('input[name=bxb]:checked')||{value:0}).value],co=$('#co'),wb=$('#web');co.value=x.company;wb.value=x.website;co.readOnly=wb.readOnly=true;co.classList.add('locked');wb.classList.add('locked');var ch=$('.hint',co.closest('.q'));if(ch)ch.style.display='none';var q=wb.closest('.q');if(q&&!$('.lockn',q))q.insertAdjacentHTML('beforeend','<p class="lockn">'+M.locked+'</p>');st.email=j.email||'';show(1);top()})}
function bxSession(){var p=demo?Promise.resolve({status:'ok',token:'demo',email:'mei@brightleaf.co',brands:[{company:'Brightleaf Co.',website:'brightleaf.co'},{company:'Leafline Tea',website:'leafline.com'}]}):fetch(API+'/api/diagnosis/session',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:'{}'}).then(function(r){return r.json()});
 p.then(function(j){if(j.status==='ok'){st.token=j.token;bxPick(j);paint();return}
  if(j.status==='no_badge')return bxBlock(BX.noBadgeH,BX.noBadgeP.replace('{host}',j.host||''),[BX.acct,'/account/#trust']);
  if(j.status==='no_site')return bxBlock(BX.noBadgeH,BX.noSiteP,[BX.acct,'/account/#trust']);
  if(j.status==='pending')return bxBlock(BX.pendH,BX.pendP,[BX.acct,'/account/']);
  if(j.status==='inactive')return bxBlock(BX.inactH,M.inactive,[BX.acct,'/account/']);
  if(j.status==='cooldown')return bxBlock(BX.pickH,M.cooldown.replace('{date}',j.next||''),[BX.acct,'/account/']);
  bxBlock(BX.signinH,BX.signinP,[BX.signinBtn,'/account/#login'])}).catch(function(){bxBlock(BX.signinH,M.fail,[BX.signinBtn,'/account/#login'])})}
deps();show(0);bxSession();
})();
