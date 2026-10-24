(function(){
var API="https://api.cgbb.org", M={"badEmail": "Please enter a valid email address.", "badCode": "That code isn’t right. Please check the email and try again.", "expired": "That code has expired or was entered wrongly too many times. Please request a new one.", "cooldown": "You ran a diagnosis recently. You can run the next one from {date}. We recommend re-diagnosing every six months.", "inactive": "Your membership isn’t active at the moment, so the Trust Diagnosis is unavailable. Email secretariat@cgbb.org to renew or reactivate it.", "rate": "Too many attempts. For your security, please wait up to 30 minutes and try again.", "bot": "Please complete the security check, then try again.", "session": "Your session expired. Please confirm your email again.", "fail": "Something went wrong. Please try again, or email secretariat@cgbb.org.", "codeHint": "If {email} is an active member’s email, a code is on its way. It expires in 10 minutes and stops working after 3 wrong tries.", "doneP": "We’re scanning public data about {company} and preparing your report. It will be emailed to {email}, usually within 15 minutes."}, LANG="en";
var demo=!API||/[?&]demo=1/.test(location.search);
if(demo){var b=document.querySelector('.demo');if(b)b.hidden=false;}
var TS=window.CGBBTS||{token:function(){return ''},reset:function(){},scan:function(){}};
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var panels=$$('.dx-panel'), prog=$$('.dx-prog li'), nav=$('[data-mainnav]'), msg=$('[data-msg]'), msg1=$('[data-msg1]');
var st={email:'',token:'',cur:0};
function show(i){st.cur=i;panels.forEach(function(p,j){p.classList.toggle('on',j===i)});prog.forEach(function(p,j){p.classList.toggle('on',j===i);p.classList.toggle('done',j<i)});
 nav.hidden=i===0; $('[data-next]').style.display=i<3?'':'none'; $('[data-submit]').style.display=i===3?'':'none';
 if(i===3)review(); msg.classList.remove('on');}
function say(el,t){el.textContent=t;el.classList.add('on')}
function call(path,body){
 if(demo)return new Promise(function(res){setTimeout(function(){
  if(path==='/start')res({status:'code_sent'});
  else if(path==='/verify')res(body.code==='12345678'?{status:'ok',token:'demo'}:{status:'wrong_code'});
  else res({status:'queued',id:'CGBB-TD-DEMO',email:st.email});},500)});
 return fetch(API+'/api/diagnosis'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()});}
function busy(btn,on){btn.disabled=on}
function bad(q,on){q.classList.toggle('bad',on);return on}
// step 1
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
  if(j.status==='ok'){st.token=j.token;show(1);window.scrollTo({top:$('.dx').offsetTop-100,behavior:'smooth'});}
  else if(j.status==='expired'){say(msg1,M.expired)}
  else if(j.status==='rate_limited'){say(msg1,M.rate)}
  else bad(code.closest('.q'),true);
 }).catch(function(){say(msg1,M.fail)}).then(function(){busy(b,false)});}
$('[data-verify]').addEventListener('click',verify);
code.addEventListener('input',function(){code.closest('.q').classList.remove('bad');if(code.value.replace(/\D/g,'').length===8)verify()});
// validation
function valid(i){var p=panels[i],first=null;
 $$('.q[data-q]',p).forEach(function(q){var el=$('input,select',q);if(!el||el.type==='checkbox'&&!el.id)return;
  var b=el.type==='checkbox'?!el.checked:(el.required&&(!el.value.trim()||!el.checkValidity()));if(el.id==='web')b=!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(el.value.trim());
  if(bad(q,b)&&!first)first=q});
 $$('.lk',p).forEach(function(q){if(bad(q,!$('input:checked',q))&&!first)first=q});
 if(first){first.scrollIntoView({behavior:'smooth',block:'center'});var f=$('input,select',first);if(f)setTimeout(function(){f.focus({preventScroll:true})},300)}
 return !first}
document.addEventListener('change',function(e){var q=e.target.closest('.q,.lk');if(q)q.classList.remove('bad')});
document.addEventListener('input',function(e){var q=e.target.closest('.q');if(q&&q.classList.contains('bad'))q.classList.remove('bad')});
function val(id){return ($('#'+id)||{}).value||''}
function review(){var d={company:val('co'),website:val('web'),industry:val('ind'),hq:val('hq'),email:st.email};$$('[data-rv]').forEach(function(x){x.textContent=d[x.dataset.rv]||'—'})}
$('[data-next]').addEventListener('click',function(){if(valid(st.cur)){show(st.cur+1);window.scrollTo({top:$('.dx').offsetTop-100,behavior:'smooth'})}});
$('[data-back]').addEventListener('click',function(){show(st.cur-1);window.scrollTo({top:$('.dx').offsetTop-100,behavior:'smooth'})});
$('[data-submit]').addEventListener('click',function(){if(!valid(3))return;var b=this;busy(b,true);msg.classList.remove('on');
 var answers={};$$('.lk').forEach(function(q){answers[q.dataset.lk]=Number($('input:checked',q).value)});
 var body={token:st.token,lang:LANG,company:val('co').trim(),website:val('web').trim(),answers:answers,profile:{industry:val('ind'),hq:val('hq'),size:val('size'),role:val('role'),markets:$$('input[name=markets]:checked').map(function(c){return c.value}).join('; ')}};
 call('/submit',body).then(function(j){
  if(j.status==='queued'){$('.dx').hidden=true;$('.dx-prog').hidden=true;var d=$('[data-done]');$('[data-donep]').textContent=M.doneP.replace('{company}',body.company).replace('{email}',j.email||st.email);$('[data-doneid]').textContent=j.id;d.classList.add('on');d.focus();window.scrollTo({top:0,behavior:'smooth'});}
  else if(j.status==='session_expired'){say(msg,M.session);setTimeout(function(){show(0);em.readOnly=false;sent.classList.remove('on');$('[data-step1]').hidden=false},2500)}
  else say(msg,M.fail);
 }).catch(function(){say(msg,M.fail)}).then(function(){busy(b,false)});});
show(0);
})();
