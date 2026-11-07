(function(){
var API="https://api.cgbb.org", M={"badEmail": "請輸入有效的電郵地址。", "badCode": "驗證碼不正確，請核對電郵後再試。", "expired": "驗證碼已過期或輸入錯誤次數過多，請重新獲取。", "cooldown": "您最近已完成自測，可於 {date} 起再次自測。我們建議每六個月重做一次。", "inactive": "您的會員資格目前未生效，因此暫時無法使用基線自測。如需續期或重新啟用，請發送電郵至 secretariat@cgbb.org。", "rate": "嘗試次數過多。為保障帳戶安全，請稍候最多30分鐘再試。", "bot": "請先完成安全驗證，然後再試。", "session": "連線已逾時，請重新確認電郵。", "fail": "系統出現問題，請再試一次，或發送電郵至 secretariat@cgbb.org。", "codeHint": "如 {email} 為有效會員電郵，驗證碼已發送，10分鐘內有效，輸入錯誤3次即失效。", "doneP": "我們正在掃描{company}的官網並準備基線報告，通常會在15分鐘內發送至 {email}。", "unanswered": "本頁仍有 {n} 項未回答。"}, LANG="zh";
var demo=!API||/[?&]demo=1/.test(location.search);
if(demo){var b=document.querySelector('.demo');if(b)b.hidden=false;}
var TS=window.CGBBTS||{token:function(){return ''},reset:function(){},scan:function(){}};
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var panels=$$('.dx-panel'), LAST=panels.length-1, prog=$$('.dx-prog li'), nav=$('[data-mainnav]'), msg=$('[data-msg]'), msg1=$('[data-msg1]');
var st={email:'',token:'',cur:0};
function show(i){st.cur=i;panels.forEach(function(p,j){p.classList.toggle('on',j===i)});prog.forEach(function(p,j){p.classList.toggle('on',j===i);p.classList.toggle('done',j<i)});
 nav.hidden=i===0; $('[data-next]').style.display=i<LAST?'':'none'; $('[data-submit]').style.display=i===LAST?'':'none';
 if(i===LAST)review(); msg.classList.remove('on'); left(panels[i]);}
function say(el,t){el.textContent=t;el.classList.add('on')}
function call(path,body){
 if(demo)return new Promise(function(res){setTimeout(function(){
  if(path==='/start')res({status:'code_sent'});
  else if(path==='/verify')res(body.code==='12345678'?{status:'ok',token:'demo'}:{status:'wrong_code'});
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
  if(j.status==='ok'){st.token=j.token;show(1);top()}
  else if(j.status==='expired'){say(msg1,M.expired)}
  else if(j.status==='rate_limited'){say(msg1,M.rate)}
  else bad(code.closest('.q'),true);
 }).catch(function(){say(msg1,M.fail)}).then(function(){busy(b,false)});}
$('[data-verify]').addEventListener('click',verify);
code.addEventListener('input',function(){code.closest('.q').classList.remove('bad');if(code.value.replace(/\D/g,'').length===8)verify()});
// questionnaire: conditional items
function val(q){var c=$('input:checked',q);return c?c.value:null}
function pick(kind,k){return $('.lk[data-kind="'+kind+'"][data-k="'+k+'"]')}
function deps(){
 $$('.lk[data-dep="sample"]').forEach(function(q){q.hidden=val(pick('sample',q.dataset.k))!=='y'});
 var r=pick('risk','operating');if(r)r.hidden=val(pick('risk','open'))!=='y';
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
document.addEventListener('change',function(e){var q=e.target.closest('.q,.lk');if(q)q.classList.remove('bad');deps();left(panels[st.cur])});
document.addEventListener('input',function(e){var q=e.target.closest('.q');if(q&&q.classList.contains('bad'))q.classList.remove('bad')});
function fv(id){return ($('#'+id)||{}).value||''}
function review(){var d={company:fv('co'),website:fv('web'),industry:fv('ind'),hq:fv('hq'),email:st.email};$$('[data-rv]').forEach(function(x){x.textContent=d[x.dataset.rv]||'—'})}
function top(){window.scrollTo({top:$('.dx-prog').offsetTop-90,behavior:'smooth'})}
function answers(){var a={checks:{},perf:{},sample:{},maturity:{},events:{},record:{},risk:{}};
 $$('.lk').forEach(function(q){var v=q.hidden?null:val(q),k=q.dataset.k,kind=q.dataset.kind;
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
$('[data-submit]').addEventListener('click',function(){if(!valid(LAST))return;var b=this;busy(b,true);msg.classList.remove('on');
 var body={token:st.token,lang:LANG,company:fv('co').trim(),website:fv('web').trim(),answers:answers(),profile:{industry:fv('ind'),hq:fv('hq'),size:fv('size'),role:fv('role'),markets:$$('input[name=markets]:checked').map(function(c){return c.value}).join('; ')}};
 call('/submit',body).then(function(j){
  if(j.status==='queued'){$('.dx').hidden=true;$('.dx-prog').hidden=true;var d=$('[data-done]');$('[data-donep]').textContent=M.doneP.replace('{company}',body.company).replace('{email}',j.email||st.email);$('[data-doneid]').textContent=j.id;d.classList.add('on');d.focus();window.scrollTo({top:0,behavior:'smooth'});}
  else if(j.status==='session_expired'){say(msg,M.session);setTimeout(function(){show(0);em.readOnly=false;sent.classList.remove('on');$('[data-step1]').hidden=false},2500)}
  else say(msg,M.fail);
 }).catch(function(){say(msg,M.fail)}).then(function(){busy(b,false)});});
deps();show(0);
})();
