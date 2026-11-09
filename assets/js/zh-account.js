(function(){
var API="https://api.cgbb.org", M={"vEmpty": "請填寫訊息內容。", "badEmail": "請輸入有效的電郵地址。", "badCode": "驗證碼不正確，請核對電郵後再試。", "expired": "驗證碼已過期或輸入錯誤次數過多，請重新獲取。", "badPw": "密碼最少需要8個字元。", "pwMismatch": "兩次輸入的密碼不一致。", "badLogin": "電郵或密碼不正確。如尚未設定密碼，請選擇下方「註冊」或「忘記密碼？」，以發送至會員電郵的驗證碼設定密碼。", "bot": "請先完成安全驗證，然後再試。", "noPw": "您尚未設定密碼，已為您轉至註冊：我們會以電郵發送驗證碼，供您設定密碼。", "rate": "嘗試次數過多。為保障帳戶安全，請稍候最多30分鐘再試。", "fail": "系統出現問題，請再試一次，或發送電郵至 secretariat@cgbb.org。", "codeHint": "已發送至 {email}，10分鐘內有效，輸入錯誤3次即失效。", "st_active": "有效", "st_pending": "待審批", "st_expired": "已過期", "st_declined": "未獲批准", "st_inactive": "暫停", "inP": "您的會員資格目前已暫停。如需重新啟用，請發送電郵至 secretariat@cgbb.org。", "pendB": "會員資格待審批", "pendP": "感謝您的申請。品信會正在審核您的會員資格，批准後我們會以電郵通知您，屆時即可使用全部會員服務，包括基線自測。", "expP": "您的會員資格已過期。如需續期，請發送電郵至 secretariat@cgbb.org。", "decP": "您的會員申請未獲批准。如有疑問，請發送電郵至 secretariat@cgbb.org。", "thDate": "日期", "thCo": "企業", "thScore": "參考評分", "thRep": "報告", "dlEn": "PDF（英文）", "dlZh": "PDF（中文）", "processing": "準備中", "failed": "未完成：請聯絡 secretariat@cgbb.org", "noRep": "暫未有自測報告。", "locale": "zh-HK", "refCopy": "複製連結", "copied": "已複製連結", "refStat": "成功推薦：{n} 位", "refMailSubj": "邀請您加入全球化品牌信任促進會（品信會）", "refMsg": "我是全球化品牌信任促進會（品信會）的會員，覺得您很適合加入。基本會籍免費，可在此申請：{link}", "nlOn": "已訂閱，謝謝。", "nlOff": "已取消訂閱，您將不會再收到會員通訊。", "upH": "進階會員", "upP": "為期一年的會員方案，包括全面信任評審。評分達80%或以上的品牌將獲發CGBB Verified Trusted 信任憑證。按年收費，自動續期，可隨時取消續期。", "upPrice": "每年 {p}", "upBtn": "升級我的會籍", "upSoon": "即將推出", "upSoonP": "網上信用卡付款尚未開通。您可提交升級申請，秘書處將向您發送費用及後續安排。", "upSecure": "由 Stripe 提供安全付款。您在 Stripe 頁面輸入卡資料，品信會不會接觸您的卡資料。", "upActiveH": "您是品信會進階會員", "upRenews": "將於 {d} 自動續期", "upEnds": "將於 {d} 結束，已關閉自動續期。", "upPastDue": "最近一次付款未能完成，請更新付款卡以保留進階會員資格。", "upManage": "管理付款", "upManageP": "更新付款卡、下載收據或取消續期。", "upOpening": "正在開啟安全付款頁面…", "upOk": "感謝您！付款已完成，進階會員資格將在片刻後顯示於此。", "upCancel": "已取消付款，未有收取任何費用。", "tierAdv": "進階", "upReq": "申請升級", "upMore": "了解權益"}, LANG="zh";
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
  if(path==='/api/account'){res(demoState.email?{status:'ok',member:{email:demoState.email,name:'Alex Chan',org:'Example Co.',category:'Organizational'},plan:demoState.adv?'advanced':'basic',memberNo:'CGBB-OM-2026-021',trust:/pending/i.test(demoState.email)?null:{domain:'example.com',verified:!/new/i.test(demoState.email),instructions:/new/i.test(demoState.email)?{options:[{record:{value:'cgbb-verify=3f9c1a7e'}},{url:'https://example.com/.well-known/cgbb-verify.txt',content:'cgbb-verify=3f9c1a7e'}]}:null,file_url:/new/i.test(demoState.email)?null:'https://api.cgbb.org/trust/example.com.json',verify_url:'https://cgbb.org/verify/?d=example.com',level:'member',published:{found:false}},membership:/pending/i.test(demoState.email)?{status:'pending',joined:new Date().toISOString()}:{status:'active',joined:'2026-10-02T00:00:00Z',approvedAt:'2026-10-05T00:00:00Z',validUntil:'2027-10-05T00:00:00Z'},referral:{code:'K7M2QX9',count:1,bonusMonths:3,months:3},billing:demoState.adv?{ready:true,price:{amount:31500,currency:'usd',list:59000,foundingUntil:'2027-01-05T16:00:00Z'},advanced:{status:'active',until:'2027-10-25T00:00:00Z',cancelAtPeriodEnd:false},canManage:true}:{ready:true,price:{amount:31500,currency:'usd',list:59000,foundingUntil:'2027-01-05T16:00:00Z'},advanced:null,canManage:false},reports:/pending/i.test(demoState.email)?[]:[{id:'CGBB-TD-20261012-A1B2C3',date:'2026-10-12T08:00:00Z',company:'Example Co.',status:'ready',score:64,band:{en:'Established',zh:'穩健'}}]}:{status:'signed_out'});return}
  if(path==='/api/auth/login'){demoState.email=body.email;res({status:'ok'});return}
  if(path==='/api/auth/logout'){demoState={};res({status:'ok'});return}
  if(path==='/api/account/newsletter'){res({status:'ok',newsletter:body.on});return}
  if(path==='/api/account/waitlist'){res({status:'ok'});return}
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
 $('[data-d="hi"]').textContent=m.name?(LANG==='zh'?'，':', ')+m.name:'';setD('email',m.email);setD('name',m.name);setD('org',m.org);setD('plan',PLN[j.plan||'basic']||'');var nf=$('[data-f="no"]');if(nf){nf.hidden=!j.memberNo;setD('no',j.memberNo)}
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
 renderRef(j.referral);renderUp(j.billing,ms);renderTj(j.trust);
 var nl=$('[data-nl]');if(nl)nl.checked=!!j.newsletter;
 var ac=document.querySelector('[data-acct]');if(ac){ac.innerHTML='<a class="btn btn-red" href="'+ac.getAttribute('data-href')+'">'+esc(ac.getAttribute('data-mine'))+'</a>'}
 show('dash');window.scrollTo({top:0});
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 upgPrefill();}
function upgPrefill(){if(!/[?&]upgrade=1/.test(location.search))return;if(UPREADY){history.replaceState(null,'',location.pathname);var u=$('#upgrade');if(u)setTimeout(function(){u.scrollIntoView({behavior:'smooth',block:'start'})},200);return}var t=$('#vtopic'),mm=$('#vmsg'),v=document.querySelector('.vip');if(!t||!mm||!v||v.offsetParent===null)return;t.value='membership';if(!mm.value)mm.value="我希望升級為進階會員（最少一年）並接受全面信任評審，以取得 CGBB Verified Trusted 信任憑證。請告知費用及後續安排。";history.replaceState(null,'',location.pathname);setTimeout(function(){v.scrollIntoView({behavior:'smooth',block:'start'});mm.focus({preventScroll:true})},60)}
(function(){var nl=$('[data-nl]');if(!nl)return;nl.addEventListener('change',function(){var on=nl.checked,msg=$('[data-nlmsg]');nl.disabled=true;
 call('POST','/api/account/newsletter',{on:on}).then(function(j){if(j.status==='ok'){msg.style.color='';msg.textContent=on?M.nlOn:M.nlOff}else{nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}}).catch(function(){nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}).then(function(){nl.disabled=false})})})();
var REFLINK='';
function money(p){try{return new Intl.NumberFormat(M.locale,{style:'currency',currency:p.currency.toUpperCase(),maximumFractionDigits:p.amount%100?2:0}).format(p.amount/100)}catch(e){return p.currency.toUpperCase()+' '+(p.amount/100)}}
function bgHtml(t){return '<details class="bgd"><summary>'+esc(BG.bgH)+'</summary><ul>'+BG.bg.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><p>'+esc(BG.lineL)+'</p><textarea readonly rows="2">'+esc('<p>✓ <a href="https://cgbb.org/verify/?d='+t.domain+'" target="_blank" rel="noopener">'+BG.lineTxt+'</a></p>')+'</textarea><p>'+esc(BG.headL)+'</p><textarea readonly rows="2">'+esc('<link rel="alternate" type="application/json" title="CGBB Website Trust Credential" href="/.well-known/trust.json">')+'</textarea><p>'+esc(BG.printL)+' <a href="/assets/badge/cgbb-member.png" download>cgbb-member.png</a> · <a href="/assets/badge/cgbb-member.svg" download>cgbb-member.svg</a></p></details>'}
function stepLi(n,cls,h,body){return '<li class="'+cls+'"><span class="n">'+(cls.indexOf('done')>=0?'✓':n)+'</span><div><h4>'+esc(h)+'</h4>'+body+'</div></li>'}
var BR={"title": "我的品牌", "hint": "每個品牌以其官網上的 CGBB 徽章確認，並各自擁有信任憑證及自測。", "add": "新增其他品牌", "addP": "在此帳戶下登記另一個品牌。輸入品牌名稱及官網，然後在該官網加上 CGBB 徽章，以確認網站屬於您。", "orgL": "品牌名稱", "webL": "品牌官網", "addBtn": "新增品牌", "allSet": "已完成設定", "left": "尚餘 {m} 個步驟", "left1": "尚餘 1 個步驟", "s3auto": "第 1 步加上的徽章即完成此步驟。", "pending": "等待秘書處審批", "s1todo": "在 {d} 首頁加上下方的 CGBB 徽章，然後按「檢查」。徽章可確認此網站屬於您。", "check": "檢查", "remove": "移除此品牌", "rmQ": "從帳戶中移除 {d}？其信任憑證及徽章將不再有效。", "exists": "此網站已在您的帳戶中。", "badOrg": "請輸入品牌名稱。", "main": "主要品牌", "s1by": "已確認：{d}（官網已展示徽章）"};
/* ---------- My brands: several brands under one account (8 Nov 2026) ---------- */
function brandCode(b){var vt=b.level==='verified_trusted';return '<a href="https://cgbb.org/verify/?d='+b.host+'" target="_blank" rel="noopener" title="Check at cgbb.org"><img src="https://api.cgbb.org/badge/'+b.host+'.svg" alt="'+(vt?ST.vtBadge:ST.memBadge)+'. Check at cgbb.org" height="74" loading="lazy"></a>'}
function badgeBlock(b){return '<p>'+esc(ST.s3p)+'</p><img class="bimg" src="https://api.cgbb.org/badge/'+esc(b.host)+'.svg" alt=""><textarea readonly rows="3" data-bcode>'+esc(brandCode(b))+'</textarea><div class="row"><button type="button" class="btn btn-line" data-bcopy>'+esc(ST.copy)+'</button><a href="'+esc(b.verify_url)+'" target="_blank" rel="noopener">'+esc(ST.view)+' →</a></div>'}
function brandSteps(b){var h=esc(b.host),bg=b.badge||{},bok=!!bg.ok,ok=!!(b.verified&&b.file_url),pub=b.published||{},pf=!!(pub.found&&pub.genuine),s1,s2,s3;
 var chk='<button type="button" class="btn btn-red" data-brchk="'+h+'">'+esc(BR.check)+'</button>';
 if(b.blocked)s1=stepLi(1,'',ST.s1,'<p class="warn">'+esc(TJ.taken)+'</p>');
 else if(b.pending)s1=stepLi(1,'',ST.s1,'<p class="muted">'+esc(BR.pending)+'</p>');
 else if(b.verified)s1=stepLi(1,'done',ST.s1,'<p class="ok">'+esc((b.method==='badge'?BR.s1by:ST.s1done).split('{d}').join(b.host))+'</p>');
 else s1=stepLi(1,'',ST.s1,'<p>'+esc(BR.s1todo.split('{d}').join(b.host))+'</p>'+badgeBlock(b)+'<div class="row" style="margin-top:8px">'+chk+'</div><p class="muted" data-brmsg="'+h+'"></p>');
 if(ok){s2=stepLi(2,pf?'done':'',ST.s2,'<p>'+esc(ST.s2p.split('{d}').join(b.host))+'</p>'+(pf?'<p class="ok">'+esc(ST.s2found)+'</p>':'<p class="muted">'+esc(ST.s2not)+'</p>')+'<div class="row"><a class="btn btn-red" href="'+esc(b.file_url)+'" download="trust.json">'+esc(TJ.dl)+'</a>'+(pf?'':'<button type="button" class="btn btn-line" data-brchk="'+h+'">'+esc(ST.s2check)+'</button>')+'</div>');
  s3=stepLi(3,bok?'done':'',ST.s3,(bok?'<p class="ok">'+esc(ST.s3found)+'</p>':'<p class="warn">'+esc(bg.found?ST.s3nolink:ST.s3not)+' <button type="button" class="linkbtn" data-brchk="'+h+'">'+esc(ST.s3chk)+'</button></p>')+(b.verified?badgeBlock(b):''))}
 else{s2=stepLi(2,'lock',ST.s2,'<p class="muted">'+esc(ST.lock)+'</p>');s3=stepLi(3,'lock',ST.s3,'<p class="muted">'+esc(b.verified||b.pending?ST.lock:BR.s3auto)+'</p>')}
 return '<ol class="ac-steps">'+s1+s2+s3+'</ol>'}
function brandCount(b){var ok=!!(b.verified&&b.file_url),pub=b.published||{};return (b.verified?1:0)+(ok&&pub.found&&pub.genuine?1:0)+(ok&&b.badge&&b.badge.ok?1:0)}
function addBrandBox(open){return '<details class="br-add"'+(open?' open':'')+'><summary>+ '+esc(BR.add)+'</summary><div class="br-addin"><p>'+esc(BR.addP)+'</p><div class="br-form"><label><span>'+esc(BR.orgL)+'</span><input type="text" data-brorg maxlength="160"></label><label><span>'+esc(BR.webL)+'</span><input type="text" data-brweb placeholder="brand.com" inputmode="url" autocapitalize="off" spellcheck="false"></label><button type="button" class="btn btn-red" data-bradd>'+esc(BR.addBtn)+'</button></div><p class="muted" data-bramsg></p></div></details>'}
var BROPEN={};
function renderBrands(t,sec,box){var L=t.brands||[],h3=$('h3',sec),hn=$('.hint',sec);if(h3){h3.hidden=false;h3.textContent=BR.title}if(hn){hn.hidden=false;hn.textContent=BR.hint}sec.classList.remove('tj-all');
 box.innerHTML=L.map(function(b){var n=brandCount(b),done=n===3,open=BROPEN[b.host]!==undefined?BROPEN[b.host]:!done;
  return '<details class="brand'+(done?' done':'')+'" data-brand="'+esc(b.host)+'"'+(open?' open':'')+'><summary><span class="tjck'+(done?'':' todo')+'" aria-hidden="true">'+(done?'✓':n+'/3')+'</span><span class="tjt"><b>'+esc(b.org||b.host)+(b.main?' <em>'+esc(BR.main)+'</em>':'')+'</b><small>'+esc(b.host)+' · '+esc(done?BR.allSet:(b.pending?BR.pending:(3-n===1?BR.left1:BR.left.replace('{m}',3-n))))+'</small></span></summary>'+brandSteps(b)+(b.main?'':'<p class="br-rm"><button type="button" class="linkbtn" data-brrm="'+esc(b.host)+'">'+esc(BR.remove)+'</button></p>')+'</details>'}).join('')+addBrandBox(false);
 stGate(L.some(function(b){return b.verified&&b.badge&&b.badge.ok}))}
function brandCall(body,btn,msg){if(btn)btn.disabled=true;if(msg)msg.textContent=TJ.wait;return call('POST','/api/account/brand',body).then(function(j){if(btn)btn.disabled=false;
  if(j.trust)renderTj(j.trust);var m2=msg&&document.body.contains(msg)?msg:null;
  if(j.status==='not_found_yet'){var k=$('[data-brmsg="'+body.check+'"]');if(k)k.textContent=TJ.notYet}
  else if(j.status==='bad_domain'&&m2)m2.textContent=TJ.bad;else if(j.status==='bad_org'&&m2)m2.textContent=BR.badOrg;else if(j.status==='domain_taken'&&m2)m2.textContent=TJ.taken;else if(j.status==='exists'&&m2)m2.textContent=BR.exists;else if(j.status==='rate_limited'&&m2)m2.textContent=M.rate;return j}).catch(function(){if(btn)btn.disabled=false;if(msg)msg.textContent=M.fail})}
document.addEventListener('click',function(e){var a=e.target.closest('[data-bradd]');if(a){var box=a.closest('.br-addin');brandCall({add:{org:($('[data-brorg]',box)||{}).value||'',domain:($('[data-brweb]',box)||{}).value||''}},a,$('[data-bramsg]',box)).then(function(j){if(j&&j.status==='ok'&&j.host){BROPEN[j.host]=true;if(LAST_T)renderTj(LAST_T);var el=$('[data-brand="'+j.host+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}});return}
 var c=e.target.closest('[data-brchk]');if(c){brandCall({check:c.dataset.brchk},c,null);return}
 var r=e.target.closest('[data-brrm]');if(r){if(!confirm(BR.rmQ.split('{d}').join(r.dataset.brrm)))return;brandCall({remove:r.dataset.brrm},r,null)}});
document.addEventListener('toggle',function(e){var d=e.target;if(d.matches&&d.matches('details.brand'))BROPEN[d.dataset.brand]=d.open},true);
var LAST_T=null;
function renderTj(t){var sec=$('[data-tj]'),box=$('[data-tjbody]');if(!sec||!box)return;if(!t){sec.hidden=true;return}sec.hidden=false;LAST_T=t;
 if((t.brands||[]).length>1)return renderBrands(t,sec,box);
 var h3x=$('h3',sec),hnx=$('.hint',sec);if(h3x&&h3x.dataset.t)h3x.textContent=h3x.dataset.t;else if(h3x)h3x.dataset.t=h3x.textContent;if(hnx&&hnx.dataset.t)hnx.textContent=hnx.dataset.t;else if(hnx)hnx.dataset.t=hnx.textContent;
 var ok=!!(t.verified&&t.file_url),s1,s2,s3;
 if(ok)s1=stepLi(1,'done',ST.s1,'<p class="ok">'+esc(ST.s1done.split('{d}').join(t.domain))+'</p>');
 else if(t.blocked)s1=stepLi(1,'',ST.s1,'<p class="warn">'+esc(TJ.taken)+'</p>');
 else if(t.domain&&!t.verified&&t.instructions){var o=t.instructions.options;s1=stepLi(1,'',ST.s1,'<p><b>'+esc(TJ.proveH.split('{d}').join(t.domain))+'</b><br>'+esc(TJ.proveP)+'</p><p><b>DNS</b> · '+esc(TJ.dns)+'<br><code>'+esc(o[0].record.value)+'</code></p><p><b>'+esc(TJ.fileL)+'</b> · '+esc(TJ.file)+'<br><code>'+esc(o[1].url)+'</code><br>'+esc(TJ.content)+' <code>'+esc(o[1].content)+'</code></p><div class="row"><button type="button" class="btn btn-red" data-tjcheck>'+esc(TJ.check)+'</button><button type="button" class="btn btn-line" data-tjchange>'+esc(TJ.change)+'</button></div><p class="muted" data-tjmsg></p>')}
 else s1=stepLi(1,'',ST.s1,'<p>'+esc(ST.s1p)+'</p><p class="tjrow"><input type="text" data-tjdomain placeholder="brand.com" value="'+esc(t.domain||'')+'" aria-label="'+esc(TJ.domainL)+'"><button type="button" class="btn btn-red" data-tjset>'+esc(TJ.set)+'</button></p><p class="muted" data-tjmsg></p>');
 if(ok){var pub=t.published||{},found=pub.found&&pub.genuine;
  s2=stepLi(2,found?'done':'',ST.s2,'<p>'+esc(ST.s2p.split('{d}').join(t.domain))+'</p>'+(found?'<p class="ok">'+esc(ST.s2found)+'</p>':'<p class="muted">'+esc(ST.s2not)+'</p>')+'<div class="row"><a class="btn btn-red" href="'+esc(t.file_url)+'" download="trust.json">'+esc(TJ.dl)+'</a>'+(found?'':'<button type="button" class="btn btn-line" data-tjrecheck>'+esc(ST.s2check)+'</button>')+'</div><p class="muted" data-tjmsg></p>');
  var vt=t.level==='verified_trusted',code='<a href="https://cgbb.org/verify/?d='+t.domain+'" target="_blank" rel="noopener" title="Check at cgbb.org"><img src="https://api.cgbb.org/badge/'+t.domain+'.svg" alt="'+(vt?ST.vtBadge:ST.memBadge)+'. Check at cgbb.org" height="74" loading="lazy"></a>';
  var bgk=t.badge||{},bok=!!bgk.ok;
  s3=stepLi(3,bok?'done':'',ST.s3,(bok?'<p class="ok">'+esc(ST.s3found)+'</p>':'<p class="warn">'+esc(bgk.found?ST.s3nolink:ST.s3not)+'<span class="qm" tabindex="0" role="note" aria-label="'+esc(ST.s3why)+'" data-tip="'+esc(ST.s3why)+'">?</span> <button type="button" class="linkbtn" data-tjrecheck>'+esc(ST.s3chk)+'</button></p>')+(vt?'<p class="ok">'+esc(ST.vt.replace('{s}',t.trust_score).replace('{d}',t.review_valid_until||''))+'</p>':'')+'<p>'+esc(ST.s3p)+'</p><img class="bimg" src="https://api.cgbb.org/badge/'+esc(t.domain)+'.svg" alt="'+esc(vt?ST.vtBadge:ST.memBadge)+'"><textarea readonly rows="3" data-bcode>'+esc(code)+'</textarea><div class="row"><button type="button" class="btn btn-line" data-bcopy>'+esc(ST.copy)+'</button><a href="'+esc(t.verify_url)+'" target="_blank" rel="noopener">'+esc(ST.view)+' →</a></div>'+bgHtml(t))}
 else{s2=stepLi(2,'lock',ST.s2,'<p class="muted">'+esc(ST.lock)+'</p>');s3=stepLi(3,'lock',ST.s3,'<p class="muted">'+esc(ST.lock)+'</p>')}
 var pf=!!(ok&&t.published&&t.published.found&&t.published.genuine),bk=!!(ok&&t.badge&&t.badge.ok),n=(ok?1:0)+(pf?1:0)+(bk?1:0),h3=$('h3',sec),hn=$('.hint',sec),ol='<ol class="ac-steps">'+s1+s2+s3+'</ol>';
 sec.classList.toggle('tj-all',n===3);if(h3)h3.hidden=n===3;if(hn)hn.hidden=n===3;
 if(n===3)box.innerHTML='<details class="tjdone"><summary><span class="tjck" aria-hidden="true">✓</span><span class="tjt"><b>'+esc(ST.allDone)+'</b><small>'+esc(ST.allDoneP)+' · '+esc(t.domain)+'</small></span></summary>'+ol+'</details>';
 else box.innerHTML='<div class="tjprog"><div class="tjbar"><i style="width:'+Math.round(n/3*100)+'%"></i></div><p>'+esc((3-n===1?ST.todo1:ST.todo).replace('{n}',n).replace('{m}',3-n))+'</p></div>'+ol;
 if(ok)box.insertAdjacentHTML('beforeend',addBrandBox(false));
 stGate(bk)}
function stGate(on){var g=$('[data-stgo]'),n=$('[data-stgate]');if(!g)return;g.classList.toggle('off',!on);if(on){g.removeAttribute('aria-disabled');g.removeAttribute('tabindex')}else{g.setAttribute('aria-disabled','true');g.setAttribute('tabindex','-1')}if(n)n.hidden=on}
document.addEventListener('click',function(e){var g=e.target.closest('[data-stgo].off');if(!g)return;e.preventDefault();var tj=$('[data-tj]');if(tj)tj.scrollIntoView({behavior:'smooth',block:'start'})});
document.addEventListener('click',function(e){var c=e.target.closest('[data-bcopy]');if(!c)return;var sc=c.closest('li')||document,ta=$('[data-bcode]',sc)||$('[data-bcode]');if(!ta)return;ta.select();try{navigator.clipboard.writeText(ta.value)}catch(er){document.execCommand('copy')}c.textContent=ST.copied;setTimeout(function(){c.textContent=ST.copy},2000)});
var ADV={"fnd": "創始會員價，至 2027 年 1 月 5 日，其後每年 {p}", "k": "進階 · 全面信任評審", "t": "品信會進階會籍", "p": "包含基本會籍全部內容，另加對品牌的全面、獨立信任評審。", "per": "/ 年", "b80": "未達 80%？您的會籍仍為進階會籍，品信會將根據評審報告提供支援建議，協助您達到 80% 評級。", "ak": "您的會籍", "at": "品信會進階會籍", "ab80": "如評分未達 80%，您的會籍仍為進階會籍，品信會將根據評審報告提供支援建議，協助您達到 80%。"},BG={"bgH": "徽章使用指引", "bg": ["放在每一頁的頁尾，緊貼聯絡資料或其他認可標誌。", "可選：在聯絡表格、結帳或註冊按鈕旁加一行簡短文字，連結至您的紀錄。", "請勿放在頂部橫幅、導覽列、彈出視窗或產品圖片中。", "請使用即時徽章並保持原尺寸（高 74px；手機上 60px），不要改色、裁切、拉伸或加上文字。", "必須連結至您自己的紀錄，並在新分頁開啟。"], "lineL": "表單或按鈕旁的一行文字：", "headL": "放在網頁 <head> 中，方便 AI 代理找到您的憑證：", "printL": "僅供印刷品及簡報使用：", "lineTxt": "CGBB Member: verify this site at cgbb.org"},ST={"s1": "確認您的網站", "s1done": "已確認：{d}", "s1p": "請輸入您的網站網域。我們會提供一段簡短驗證碼，加到網站後即可證明網站屬於貴機構。", "s2": "發布信任憑證", "s2p": "下載憑證文件，並發布於 https://{d}/.well-known/trust.json，讓 AI 代理可讀取並對照品信會登記冊核實。建議使用 AI 助手完成設定。", "s2found": "已在您的網站找到 ✓", "s2not": "尚未在您的網站找到。", "s2check": "重新檢查", "s3found": "已在您的官網找到徽章，並已連結至您的紀錄。", "s3not": "尚未在官網首頁找到徽章。進行基線自測須先展示徽章。", "s3nolink": "我們找到徽章，但它沒有連結至您的核實頁面。請改用以下代碼。", "s3why": "為何需要徽章？在官網首頁加上徽章，可證明您控制此網站，確保只有網站真正的擁有人才能進行自測並收到相關報告。", "allDone": "您已完成所有設定", "allDoneP": "網站已確認 · 憑證已發佈 · 徽章已上線", "todo": "已完成 {n}/3 個步驟，尚餘 {m} 個步驟即可完成帳戶設定。", "todo1": "已完成 {n}/3 個步驟，尚餘 1 個步驟即可完成帳戶設定。", "s3chk": "再次檢查", "s3": "加上會員徽章", "s3p": "將徽章放在官網，例如頁尾。徽章由品信會即時生成，並連結至您的紀錄，任何人都可核實。請複製以下代碼：", "copy": "複製代碼", "copied": "已複製", "lock": "確認網站後即可使用。", "view": "查看您的即時紀錄", "vt": "Verified Trusted（信任已核實）· {s}% · 有效期至 {d}", "vtBadge": "CGBB Verified Trusted", "memBadge": "CGBB Member · Website Trust Credential"},PLN={"basic": "基本會籍 · 免費", "advanced": "進階會籍", "advanced_past_due": "進階會籍 · 扣款失敗", "advanced_unpaid": "基本 · 已登記進階輪候名單", "basic_waitlist": "基本 · 已登記進階輪候名單"},UPB=["全面信任評審：品信會核查全部 15 項指標背後的證據", "可下載的完整信任評審報告", "評分達 80% 或以上，網站信任憑證升級為 Verified Trusted，以官方第三方信任評審為依據，並可使用 Verified Trusted 徽章", "會籍期內每季可再評審一次，每次均附報告，說明如何提升或維持評級"],UPTR="全面信任評審：確認網站後，秘書處會與您聯絡安排。";
var TJ={"ready": "您的網站信任憑證已可下載", "readyP": "請將其發佈於 https://{d}/.well-known/trust.json，AI 代理即可讀取並對照品信會登記冊核實。之後可在網站上展示 CGBB 會員徽章，代碼與擺放方式見 cgbb.org/zh/badge/。", "verify": "查看即時紀錄", "how": "了解詳情", "dl": "下載憑證檔案", "taken": "此網域已連結至另一位品信會會員，請電郵 secretariat@cgbb.org。", "proveH": "確認您擁有 {d} 的控制權", "proveP": "請完成以下其中一項（網站管理員可協助），然後按「立即核實」。", "dns": "為網域新增一條 TXT 記錄，數值為：", "fileL": "檔案", "file": "在以下地址發佈一個文字檔：", "content": "內容為：", "check": "立即核實", "change": "使用其他網域", "introP": "為您的網站免費取得經簽署的網站信任憑證：AI 代理可讀取的會員紀錄。它確認會員身份及網域控制權，並非信任評分。請輸入您的網站網域開始。", "domainL": "網站網域", "set": "取得網域驗證碼", "wait": "處理中…", "notYet": "尚未找到。DNS 更新可能需要幾分鐘，請稍後再試。", "bad": "請輸入您自己的網站網域，例如 brand.com（不可使用社交媒體頁面）。", "h": "免費網站信任憑證"};
document.addEventListener('click',function(e){var s=e.target.closest('[data-tjset],[data-tjcheck],[data-tjchange],[data-tjrecheck]');if(!s)return;
 if(s.hasAttribute('data-tjchange')){renderTj({domain:'',verified:false});return}
 var msg=$('[data-tjmsg]'),body=s.hasAttribute('data-tjrecheck')?{recheck:true}:s.hasAttribute('data-tjcheck')?{check:true}:{domain:($('[data-tjdomain]')||{}).value||''};s.disabled=true;if(msg)msg.textContent=TJ.wait;
 call('POST','/api/account/domain',body).then(function(j){s.disabled=false;if(j.trust)renderTj(j.trust);var m2=$('[data-tjmsg]');
  if(j.status==='not_found_yet'&&m2)m2.textContent=TJ.notYet;else if(j.status==='bad_domain'&&m2)m2.textContent=TJ.bad;else if(j.status==='domain_taken'&&m2)m2.textContent=TJ.taken;else if(j.status==='rate_limited'&&m2)m2.textContent=M.rate}).catch(function(){s.disabled=false;if(msg)msg.textContent=M.fail})});
// Advanced Membership is not open yet (Chris, 9 Nov 2026): members join a waiting list, no payment
var WL={"k": "進階 · 即將開放", "t": "品信會進階會籍", "p": "進階會籍將於品信會品牌可信度基線評估標準（第一版）正式發佈，並完成試行期及獨立專家審閱後開放。在此之前不收取任何費用。", "ul": ["全面信任評審：品信會核查每項指標背後的證據", "可下載的完整信任評審報告", "符合已發佈標準的品牌可取得 Verified Trusted 級別"], "btn": "登記輪候名單", "note": "現階段不收取任何費用。輪候名單上的會員將獲優先邀請。", "onH": "您已登記輪候名單", "onP": "謝謝。進階會籍開放時，我們將與您聯絡。在此期間不收取任何費用。", "saving": "正在儲存…"};
document.addEventListener('click',function(e){var go=e.target.closest('[data-upwait]');if(!go)return;go.disabled=true;go.textContent=WL.saving;
 call('POST','/api/account/waitlist',{lang:LANG}).then(function(j){if(j.status!=='ok')throw j;renderUp({waitlist:true},{})}).catch(function(){go.disabled=false;go.textContent=WL.btn;alert(M.fail)})});
var UPREADY=false;
function renderUp(b,ms){var box=$('[data-upbody]');if(!box)return;UPREADY=!!(b&&b.ready);var bd=$('[data-badge]');if(ms.tier==='advanced'&&bd&&!bd.querySelector('.tier'))bd.insertAdjacentHTML('beforeend','<span class="tier">'+esc(M.tierAdv)+'</span>');
 b=b||{};var a=b.advanced,h,li=function(x){return '<li>'+esc(x)+'</li>'};
 if(a&&(a.status==='active'||a.status==='past_due')){var pd=a.status==='past_due';
  h='<div class="advc on'+(pd?' warn':'')+'"><div class="advc-l"><span class="advc-k">'+esc(ADV.ak)+'</span><h4>'+esc(ADV.at)+'</h4><p>'+esc(pd?M.upPastDue:(a.cancelAtPeriodEnd?M.upEnds:M.upRenews).split('{d}').join(fmt(a.until)))+'</p><p>'+esc(UPTR)+'</p><p class="advc-80">'+esc(ADV.ab80)+'</p></div><div class="advc-r">'+(b.canManage?'<button type="button" class="btn '+(pd?'btn-red':'btn-line')+'" data-upportal>'+esc(M.upManage)+'</button><p class="secure">'+esc(M.upManageP)+'</p>':'')+'</div></div>'}
 else{var wl=!!b.waitlist;h='<div class="advc'+(wl?' on':'')+'"><div class="advc-l"><span class="advc-k">'+esc(WL.k)+'</span><h4>'+esc(WL.t)+'</h4><p>'+esc(wl?WL.onP:WL.p)+'</p>'+(wl?'':'<ul>'+WL.ul.map(li).join('')+'</ul>')+'</div><div class="advc-r">'+(wl?'<p class="secure"><b>'+esc(WL.onH)+'</b></p>':'<button type="button" class="btn btn-red" data-upwait>'+esc(WL.btn)+'</button><p class="secure">'+esc(WL.note)+'</p>')+'</div></div>'}
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
