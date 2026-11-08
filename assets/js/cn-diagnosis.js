(function(){
var API="https://api.cgbb.org", M={"badEmail": "请输入有效的邮箱地址。", "badCode": "验证码不正确，请核对邮件后再试。", "expired": "验证码已过期或输入错误次数过多，请重新获取。", "cooldown": "您最近已完成自测，可于 {date} 起再次自测。我们建议每六个月重做一次。", "inactive": "您的会员资格目前未生效，因此暂时无法使用基线自测。如需续期或重新启用，请发送邮件至 secretariat@cgbb.org。", "rate": "尝试次数过多。为保障账户安全，请稍候最多30分钟再试。", "bot": "请先完成安全验证，然后再试。", "session": "连线已逾时，请重新确认邮件。", "fail": "系统出现问题，请再试一次，或发送邮件至 secretariat@cgbb.org。", "codeHint": "如 {email} 为有效会员邮件，验证码已发送，10分钟内有效，输入错误3次即失效。", "doneP": "我们正在扫描{company}的官网及公开记录，以准备您的报告。", "doneM": "通常于 15 分钟内发送至 {email}。", "locked": "依据您的会员记录：自测只适用于贵机构，以及已通过 CGBB 徽章确认的网站。", "step": "第 {i} 步，共 {n} 步 · {t} · {c}", "unanswered": "本页仍有 {n} 项未回答。"}, LANG="zh";
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
function jump(li){if(!li||!st.token)return;var i=+li.dataset.i;if(i===0||i===st.cur)return;show(i);top()}
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
  if(j.status==='ok'){st.token=j.token;if(j.brands&&j.brands.length>1&&!$('#brsel')){var esc=function(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};var q0=$('#co').closest('.q');q0.insertAdjacentHTML('beforebegin','<div class="q brq" style="grid-column:1/-1"><label for="brsel">此自测适用于哪个品牌？</label><select id="brsel">'+j.brands.map(function(x,i){return '<option value="'+i+'">'+esc(x.company)+' · '+esc(x.website)+'</option>'}).join('')+'</select></div>');$('#brsel').addEventListener('change',function(){var x=j.brands[+this.value];$('#co').value=x.company;$('#web').value=x.website});q0.style.display='none';$('#web').closest('.q').style.display='none';$('.brq').insertAdjacentHTML('beforeend','<p class="lockn">'+M.locked+'</p>')}if(j.website){var co=$('#co'),wb=$('#web');co.value=j.company||co.value;wb.value=j.website;co.readOnly=wb.readOnly=true;co.classList.add('locked');wb.classList.add('locked');var ch=$('.hint',co.closest('.q'));if(ch)ch.style.display='none';var q=wb.closest('.q');if(q&&!$('.lockn',q))q.insertAdjacentHTML('beforeend','<p class="lockn">'+M.locked+'</p>')}show(1);top()}
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
deps();show(0);
})();
