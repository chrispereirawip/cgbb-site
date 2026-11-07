(function(){
var API="https://api.cgbb.org", M={"vEmpty": "请填写信息内容。", "badEmail": "请输入有效的邮箱地址。", "badCode": "验证码不正确，请核对邮件后再试。", "expired": "验证码已过期或输入错误次数过多，请重新获取。", "badPw": "密码最少需要8个字元。", "pwMismatch": "两次输入的密码不一致。", "badLogin": "邮件或密码不正确。如尚未设定密码，请选择下方“注册”或“忘记密码？”，以发送至会员邮件的验证码设定密码。", "bot": "请先完成安全验证，然后再试。", "noPw": "您尚未设定密码，已为您转至注册：我们会以邮件发送验证码，供您设定密码。", "rate": "尝试次数过多。为保障账户安全，请稍候最多30分钟再试。", "fail": "系统出现问题，请再试一次，或发送邮件至 secretariat@cgbb.org。", "codeHint": "已发送至 {email}，10分钟内有效，输入错误3次即失效。", "st_active": "有效", "st_pending": "待审批", "st_expired": "已过期", "st_declined": "未获批准", "st_inactive": "暂停", "inP": "您的会员资格目前已暂停。如需重新启用，请发送邮件至 secretariat@cgbb.org。", "pendB": "会员资格待审批", "pendP": "感谢您的申请。品信会正在审核您的会员资格，批准后我们会以邮件通知您，届时即可使用全部会员服务，包括基线自测。", "expP": "您的会员资格已过期。如需续期，请发送邮件至 secretariat@cgbb.org。", "decP": "您的会员申请未获批准。如有疑问，请发送邮件至 secretariat@cgbb.org。", "thDate": "日期", "thCo": "企业", "thScore": "参考评分", "thRep": "报告", "dlEn": "PDF（英文）", "dlZh": "PDF（中文）", "processing": "准备中", "failed": "未完成：请联系 secretariat@cgbb.org", "noRep": "您尚未进行基线自测。<a href=\"/cn/diagnosis/\">开始免费诊断</a>。", "locale": "zh-HK", "refCopy": "复制链接", "copied": "已复制链接", "refStat": "成功推荐：{n} 位", "refMailSubj": "邀请您加入全球化品牌信任促进会（品信会）", "refMsg": "我是全球化品牌信任促进会（品信会）的会员，觉得您很适合加入。会员资格免费，可在此申请：{link}", "nlOn": "已订阅，谢谢。", "nlOff": "已取消订阅，您将不会再收到会员通讯。", "upH": "进阶会员", "upP": "为期一年的会员方案，包括全面信任评审。评分达80%或以上的品牌将获发CGBB Verified Trusted 信任凭证。按年收费，自动续期，可随时取消续期。", "upPrice": "每年 {p}", "upBtn": "升级我的会籍", "upSoon": "即将推出", "upSoonP": "网上信用卡付款尚未开通。您可提交升级申请，秘书处将向您发送费用及后续安排。", "upSecure": "由 Stripe 提供安全付款。您在 Stripe 页面输入卡资料，品信会不会接触您的卡资料。", "upActiveH": "您是品信会进阶会员", "upRenews": "将于 {d} 自动续期", "upEnds": "将于 {d} 结束，已关闭自动续期。", "upPastDue": "最近一次付款未能完成，请更新付款卡以保留进阶会员资格。", "upManage": "管理付款", "upManageP": "更新付款卡、下载收据或取消续期。", "upOpening": "正在开启安全付款页面…", "upOk": "感谢您！付款已完成，进阶会员资格将在片刻后显示于此。", "upCancel": "已取消付款，未有收取任何费用。", "tierAdv": "进阶", "upReq": "申请升级", "upMore": "了解权益"}, LANG="zh";
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
  if(path==='/api/account'){res(demoState.email?{status:'ok',member:{email:demoState.email,name:'Alex Chan',org:'Example Co.',category:'Organizational'},membership:/pending/i.test(demoState.email)?{status:'pending',joined:new Date().toISOString()}:{status:'active',joined:'2026-10-02T00:00:00Z',approvedAt:'2026-10-05T00:00:00Z',validUntil:'2028-01-05T00:00:00Z',bonusMonths:3},referral:{code:'K7M2QX9',count:1,bonusMonths:3,months:3},billing:demoState.adv?{ready:true,price:{amount:780000,currency:'hkd'},advanced:{status:'active',until:'2027-10-25T00:00:00Z',cancelAtPeriodEnd:false},canManage:true}:{ready:true,price:{amount:780000,currency:'hkd'},advanced:null,canManage:false},reports:/pending/i.test(demoState.email)?[]:[{id:'CGBB-TD-20261012-A1B2C3',date:'2026-10-12T08:00:00Z',company:'Example Co.',status:'ready',score:64,band:{en:'Established',zh:'稳健'}}]}:{status:'signed_out'});return}
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
 renderRef(j.referral);renderUp(j.billing,ms);renderTj(j.trust);
 var nl=$('[data-nl]');if(nl)nl.checked=!!j.newsletter;
 var ac=document.querySelector('[data-acct]');if(ac){ac.innerHTML='<a class="btn btn-red" href="'+ac.getAttribute('data-href')+'">'+esc(ac.getAttribute('data-mine'))+'</a>'}
 show('dash');window.scrollTo({top:0});
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 upgPrefill();}
function upgPrefill(){if(!/[?&]upgrade=1/.test(location.search))return;if(UPREADY){history.replaceState(null,'',location.pathname);var u=$('#upgrade');if(u)setTimeout(function(){u.scrollIntoView({behavior:'smooth',block:'start'})},200);return}var t=$('#vtopic'),mm=$('#vmsg'),v=document.querySelector('.vip');if(!t||!mm||!v||v.offsetParent===null)return;t.value='membership';if(!mm.value)mm.value="我希望升级为进阶会员（最少一年）并接受全面信任评审，以取得 CGBB Verified Trusted 信任凭证。请告知费用及后续安排。";history.replaceState(null,'',location.pathname);setTimeout(function(){v.scrollIntoView({behavior:'smooth',block:'start'});mm.focus({preventScroll:true})},60)}
(function(){var nl=$('[data-nl]');if(!nl)return;nl.addEventListener('change',function(){var on=nl.checked,msg=$('[data-nlmsg]');nl.disabled=true;
 call('POST','/api/account/newsletter',{on:on}).then(function(j){if(j.status==='ok'){msg.style.color='';msg.textContent=on?M.nlOn:M.nlOff}else{nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}}).catch(function(){nl.checked=!on;msg.style.color='var(--red)';msg.textContent=M.fail}).then(function(){nl.disabled=false})})})();
var REFLINK='';
function money(p){try{return new Intl.NumberFormat(M.locale,{style:'currency',currency:p.currency.toUpperCase(),maximumFractionDigits:p.amount%100?2:0}).format(p.amount/100)}catch(e){return p.currency.toUpperCase()+' '+(p.amount/100)}}
function renderTj(t){var sec=$('[data-tj]'),box=$('[data-tjbody]');if(!sec||!box)return;if(!t){sec.hidden=true;return}sec.hidden=false;var h='';
 if(t.verified&&t.file_url){h='<div class="upcard on"><div><p><b>'+esc(TJ.ready)+'</b></p><p>'+esc(TJ.readyP.split('{d}').join(t.domain))+'</p>'+(t.level==='verified_trusted'?'<p><b style="color:#1d6b3a">✓ '+esc('Verified Trusted（信任已核实）· {s}% · 有效期至 {d}'.replace('{s}',t.trust_score).replace('{d}',t.review_valid_until||''))+'</b></p><p>'+esc('在官网展示 Verified Trusted 徽章（点击可查看即时记录）：')+'</p><textarea readonly rows="3" style="width:100%;font-size:12px">'+esc('<a href="https://cgbb.org/verify/?d='+t.domain+'" title="Verify at cgbb.org"><img src="https://cgbb.org/assets/badge/cgbb-verified-trust.png" alt="CGBB Verified Trusted" width="260" height="75"></a>')+'</textarea>':'<p>'+esc('可在官网（例如页尾）展示 CGBB Member 会员标志（点击可查看即时记录）：')+'</p><img src="/assets/badge/cgbb-member.png" alt="CGBB Member · Website Trust Credential" width="208" height="60" style="display:block;margin:6px 0 8px"><textarea readonly rows="3" style="width:100%;font-size:12px">'+esc('<a href="https://cgbb.org/verify/?d='+t.domain+'" target="_blank" rel="noopener" title="Verify at cgbb.org"><img src="https://cgbb.org/assets/badge/cgbb-member.png" alt="CGBB Member · Website Trust Credential. Verify at cgbb.org" width="180" height="52" loading="lazy"></a>')+'</textarea><p style="font-size:14px;color:#5F5F5F">'+esc('Verified Trusted 徽章属进阶会员：在全面信任评审中，品牌可信度基线评分达 80% 或以上、证据充分且没有未解决的重大风险。')+' <a href="/cn/upgrade/">'+esc('了解进阶会员')+'</a></p>')+'<p class="secure"><a href="'+esc(t.verify_url)+'" target="_blank" rel="noopener">'+esc(TJ.verify)+'</a> · <a href="/'+(LANG==='zh'?'zh/':'')+'agents/">'+esc(TJ.how)+'</a></p></div><a class="btn btn-red" href="'+esc(t.file_url)+'" download="trust.json">'+esc(TJ.dl)+'</a></div>'}
 else if(t.blocked){h='<div class="upcard warn"><p>'+esc(TJ.taken)+'</p></div>'}
 else if(t.domain&&!t.verified&&t.instructions){var o=t.instructions.options;h='<div class="upcard"><div style="flex:1 1 420px"><p><b>'+esc(TJ.proveH.split('{d}').join(t.domain))+'</b></p><p>'+esc(TJ.proveP)+'</p><p class="tjopt"><b>DNS</b> · '+esc(TJ.dns)+'<br><code>'+esc(o[0].record.value)+'</code></p><p class="tjopt"><b>'+esc(TJ.fileL)+'</b> · '+esc(TJ.file)+'<br><code>'+esc(o[1].url)+'</code><br>'+esc(TJ.content)+' <code>'+esc(o[1].content)+'</code></p><p class="secure" data-tjmsg></p></div><div style="display:flex;flex-direction:column;gap:8px"><button type="button" class="btn btn-red" data-tjcheck>'+esc(TJ.check)+'</button><button type="button" class="btn btn-line" data-tjchange>'+esc(TJ.change)+'</button></div></div>'}
 else{h='<div class="upcard"><div style="flex:1 1 420px"><p>'+esc(TJ.introP)+'</p><p class="tjrow"><input type="text" data-tjdomain placeholder="brand.com" value="'+esc(t.domain||'')+'" aria-label="'+esc(TJ.domainL)+'"><button type="button" class="btn btn-red" data-tjset>'+esc(TJ.set)+'</button></p><p class="secure" data-tjmsg></p></div></div>'}
 box.innerHTML=h}
var TJ={"ready": "您的网站信任凭证已可下载", "readyP": "请将其发布于 https://{d}/.well-known/trust.json，AI 代理即可读取并对照品信会登记册核实。之后可在网站上展示 CGBB 会员徽章，代码与摆放方式见 cgbb.org/cn/badge/。", "verify": "查看即时记录", "how": "了解详情", "dl": "下载凭证文件", "taken": "此域名已链接至另一位品信会会员，请邮件 secretariat@cgbb.org。", "proveH": "确认您拥有 {d} 的控制权", "proveP": "请完成以下其中一项（网站管理员可协助），然后按“立即核实”。", "dns": "为域名新增一条 TXT 记录，数值为：", "fileL": "文件", "file": "在以下地址发布一个文字档：", "content": "内容为：", "check": "立即核实", "change": "使用其他域名", "introP": "为您的网站免费取得经签署的网站信任凭证：AI 代理可读取的会员记录。它确认会员身份及域名控制权，并非信任评分。请输入您的网站域名开始。", "domainL": "网站域名", "set": "取得域名验证码", "wait": "处理中…", "notYet": "尚未找到。DNS 更新可能需要几分钟，请稍后再试。", "bad": "请输入您自己的网站域名，例如 brand.com（不可使用社交媒体页面）。", "h": "免费网站信任凭证"};
document.addEventListener('click',function(e){var s=e.target.closest('[data-tjset],[data-tjcheck],[data-tjchange]');if(!s)return;
 if(s.hasAttribute('data-tjchange')){renderTj({domain:'',verified:false});return}
 var msg=$('[data-tjmsg]'),body=s.hasAttribute('data-tjcheck')?{check:true}:{domain:($('[data-tjdomain]')||{}).value||''};s.disabled=true;if(msg)msg.textContent=TJ.wait;
 call('POST','/api/account/domain',body).then(function(j){s.disabled=false;if(j.trust)renderTj(j.trust);var m2=$('[data-tjmsg]');
  if(j.status==='not_found_yet'&&m2)m2.textContent=TJ.notYet;else if(j.status==='bad_domain'&&m2)m2.textContent=TJ.bad;else if(j.status==='domain_taken'&&m2)m2.textContent=TJ.taken;else if(j.status==='rate_limited'&&m2)m2.textContent=M.rate}).catch(function(){s.disabled=false;if(msg)msg.textContent=M.fail})});
var UPREADY=false;
function renderUp(b,ms){var box=$('[data-upbody]');if(!box)return;UPREADY=!!(b&&b.ready);var bd=$('[data-badge]');if(ms.tier==='advanced'&&bd&&!bd.querySelector('.tier'))bd.insertAdjacentHTML('beforeend','<span class="tier">'+esc(M.tierAdv)+'</span>');
 b=b||{};var a=b.advanced,h;
 if(a&&(a.status==='active'||a.status==='past_due')){var pd=a.status==='past_due';
  h='<div class="upcard '+(pd?'warn':'on')+'"><div><p><b>'+esc(M.upActiveH)+'</b></p><p>'+esc(pd?M.upPastDue:(a.cancelAtPeriodEnd?M.upEnds:M.upRenews).split('{d}').join(fmt(a.until)))+'</p><p class="secure">'+esc(M.upManageP)+'</p></div>'+(b.canManage?'<button type="button" class="btn '+(pd?'btn-red':'btn-line')+'" data-upportal>'+esc(M.upManage)+'</button>':'')+'</div>'}
 else{h='<div class="upcard"><div><p>'+esc(M.upP)+'</p>'+(b.price?'<p class="price">'+esc(M.upPrice.split('{p}').join(money(b.price)))+'</p>':'')+(b.ready?'<p class="secure">'+esc(M.upSecure)+'</p>':'<p class="secure">'+esc(M.upSoonP)+'</p>')+'<p class="secure"><a href="/cn/upgrade/">'+esc(M.upMore)+' →</a></p></div>'+(b.ready?'<button type="button" class="btn btn-red" data-upgo>'+esc(M.upBtn)+'</button>':'<a class="btn btn-line" href="?upgrade=1">'+esc(M.upReq)+'</a>')+'</div>'}
 box.innerHTML=h}
document.addEventListener('click',function(e){var go=e.target.closest('[data-upgo],[data-upportal]');if(!go)return;var portal=go.hasAttribute('data-upportal'),label=go.textContent;go.disabled=true;go.textContent=M.upOpening;
 call('POST',portal?'/api/account/billing-portal':'/api/account/upgrade',{lang:LANG}).then(function(j){if(j.status==='ok'&&j.url){location.href=j.url;return}throw j}).catch(function(){go.disabled=false;go.textContent=label;alert(M.fail)})});
(function(){var q=new URLSearchParams(location.search).get('upgrade');if(q!=='success'&&q!=='cancel')return;var el=$('[data-upmsg]');if(!el)return;el.hidden=false;el.className='upbanner'+(q==='success'?'':' off');el.textContent=q==='success'?M.upOk:M.upCancel;
 history.replaceState(null,'',location.pathname);if(q!=='success')return;var n=0;(function poll(){if(++n>10)return;setTimeout(function(){call('GET','/api/account').then(function(j){if(j.status==='ok'&&j.billing&&j.billing.advanced&&j.billing.advanced.status==='active'){renderUp(j.billing,j.membership);setD('valid',fmt(j.membership.validUntil))}else poll()}).catch(poll)},3000)})()})();
function renderRef(r){var box=$('[data-refer]');if(!box)return;box.hidden=!(r&&r.code);if(!r||!r.code)return;
 REFLINK='https://cgbb.org'+(LANG==='zh'?'/cn/apply/':'/apply/')+'?ref='+encodeURIComponent(r.code);
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
