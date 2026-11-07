(function(){
var f=document.querySelector('[data-verify]');if(!f)return;var out=document.querySelector('[data-result]'),zh=f.getAttribute('data-lang')==='zh',inp=f.querySelector('input');
var API='https://api.cgbb.org';
var T=zh?{ok:'✓ 有效的品信會會員紀錄',okVT:'✓ 有效 · CGBB Verified Trusted（信任已核實）',warn:'紀錄有效，但此網站上的檔案並非真實',warnP:'此網站上的 trust.json 曾被修改或複製，請勿依賴；以下登記冊紀錄為準。',inact:'目前無效',none:'沒有品信會紀錄',org:'機構',site:'網站',lvl:'級別',rev:'入會審核',revS:'品信會秘書處',revP:'認可合作夥伴（5R Wire），秘書處可隨時覆核',mem:'會籍',until:'有效期至',pub:'網站上的憑證',pubY:'已發佈（真實）',pubM:'找到檔案，但與紀錄不符',pubN:'尚未發佈',chk:'查詢時間',
member:'會員（CGBB Member）：已確認會籍、網站網域及聯絡人，不含信任評分',vt:'CGBB Verified Trusted（信任已核實）',full:'查看完整紀錄 →',ms:{active:'有效',inactive:'無效',suspended:'已暫停',expired:'已過期',revoked:'已撤銷'},
note:'品信會確認：此機構是經秘書處審核的品信會會員，控制此網站，並已核實聯絡人。',noteVT:'品信會確認：此機構是經秘書處審核的品信會會員，控制此網站，並已通過品信會全面信任評審，評審結果見上方的品牌可信度基線評估。',noteNo:'這不代表對其產品、品質、財務狀況、合規或商業行為的保證，請繼續進行一般的供應商盡職審查。',
ref:function(r,d){return '您從 '+r+' 而來，但此紀錄屬於 '+d+'。如果徽章顯示在 '+r+' 上，它對該網站並非真實。'},
noneP:function(d){return '品信會沒有 '+d+' 的紀錄。此網站上顯示的任何品信會徽章或憑證均不應採信。'},inactP:'此網站曾有品信會紀錄，但目前無效（會籍已過期、暫停或撤銷）。請勿依賴網站上顯示的品信會徽章或憑證。',
badD:'品信會不會為社交平台頁面或共用網站地址發出紀錄，因此這類頁面上的品信會聲明不可能是真實的。',
mine:'這是您的機構？',apply:'申請成為會員 →',bad:'請輸入網站地址，例如 brand.com',err:'暫時無法連接品信會登記冊，這並不代表該網站沒有紀錄。',errL:'直接打開紀錄 →',busy:'正在查詢登記冊…'}
:{ok:'✓ Valid CGBB Member record',okVT:'✓ Valid · CGBB Verified Trusted',warn:'Record active, but the file on this website is not genuine',warnP:'The trust.json on this website was altered or copied. Do not rely on it; the registry record below is authoritative.',inact:'Not currently valid',none:'No CGBB record',org:'Organisation',site:'Website',lvl:'Level',rev:'Admitted by',revS:'CGBB Secretariat',revP:'Accredited partner (5R Wire); the Secretariat may review at any time',mem:'Membership',until:'Valid until',pub:'Credential on the website',pubY:'Published (genuine)',pubM:'A file was found but does not match this record',pubN:'Not yet published',chk:'Checked',
member:'CGBB Member: membership, website domain and contact confirmed (no trust score)',vt:'CGBB Verified Trusted',full:'See the full record →',ms:{},
note:'CGBB confirms that this organisation is a CGBB member reviewed by the Secretariat, that it controls this website, and that its contact has been verified.',noteVT:'CGBB confirms that this organisation is a CGBB member reviewed by the Secretariat, that it controls this website, and that it passed the CGBB Trust Review, with the Brand Trust Baseline shown above.',noteNo:'It is not a guarantee of the company’s products, quality, financial standing, compliance or conduct. Continue your normal supplier due diligence.',
ref:function(r,d){return 'You came from '+r+', but this record is for '+d+'. If the badge was on '+r+', it is not genuine for that website.'},
noneP:function(d){return 'CGBB has no record for '+d+'. Any CGBB badge or credential shown on this website should not be relied on.'},inactP:'This website had a CGBB record, but it is not currently valid (the membership expired, was suspended or revoked). Do not rely on a CGBB badge or credential shown on it.',
badD:'CGBB does not issue records for social media profiles or shared hosting addresses, so a CGBB claim on such a page cannot be genuine.',
mine:'Is this your organisation?',apply:'Apply for membership →',bad:'Enter a website address, for example brand.com',err:'The CGBB registry could not be reached just now. This does not mean the website has no record.',errL:'Open the record directly →',busy:'Checking the registry…'};
var BL=zh?{h:'品牌可信度基線評估',st:'整體狀態',sc:'基線評分',sp:'證據支持度',cov:'覆蓋率',risk:'未解決的重大風險',no:'沒有',yes:'有',rv:'評審日期',how:'計分方法 →',href:'/zh/baseline/',S:{mature:'穩定成熟',stable:'較為穩定',basic:'基本建立',initial:'初步建立',lacking:'基礎不足'},P:{high:'高',medium:'中',low:'低',insufficient:'不足以判斷'},N:{A:'可識別性與信息一致性',B:'外部評價與履約口碑',C:'合規與治理',D:'透明度與響應',E:'責任實踐與本地化'}}
:{h:'Brand Trust Baseline',st:'Overall status',sc:'Baseline score',sp:'Evidence support',cov:'coverage',risk:'Unresolved major risk',no:'None',yes:'Yes',rv:'Reviewed',how:'How it is scored →',href:'/baseline/',S:{mature:'Trust well established',stable:'Trust established',basic:'Trust developing',initial:'Trust at an early stage',lacking:'Trust foundations lacking'},P:{high:'High',medium:'Medium',low:'Low',insufficient:'Not enough to judge'},N:{A:'Identifiability and consistency',B:'Reviews and delivery record',C:'Compliance and governance',D:'Transparency and response',E:'Responsibility and localisation'}};
function baseline(c,b){var w=el('div','vf-bl');w.appendChild(el('p','vf-blh',BL.h));
 rows(w,[[BL.st,BL.S[b.status]||b.status],[BL.sc,b.score+' / 100'],[BL.sp,(BL.P[b.evidence_support]||b.evidence_support)+' · '+BL.cov+' '+b.evidence_coverage+'%'],[BL.risk,b.unresolved_major_risk?BL.yes:BL.no],[BL.rv,b.reviewed]]);
 ['A','B','C','D','E'].forEach(function(k){var v=b.sections&&b.sections[k],r=el('div','vf-bs');r.appendChild(el('span','n',k));r.appendChild(el('span','l',BL.N[k]));var bar=el('span','b'),i=el('i');i.style.width=(typeof v==='number'?Math.max(2,v*20):0)+'%';bar.appendChild(i);r.appendChild(bar);r.appendChild(el('span','v',typeof v==='number'?String(v):'ND'));w.appendChild(r)});
 var a=link(BL.href,BL.how);var pp=el('p','vf-small');pp.appendChild(a);w.appendChild(pp);c.appendChild(w)}
function host(v){v=String(v||'').trim();if(!v)return '';if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(v))v='http://'+v;var h='';try{h=new URL(v).hostname}catch(e){return ''}h=h.toLowerCase().replace(/^www\./,'').replace(/\.$/,'');return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(h)?h:''}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function link(h,x){var a=el('a',null,x);a.href=h;return a}
function card(cls,st){out.textContent='';var c=el('div','vf-card'+(cls?' '+cls:''));c.appendChild(el('div','vf-st',st));out.appendChild(c);return c}
function rows(c,r){var dl=el('dl');r.forEach(function(x){if(!x[1])return;dl.appendChild(el('dt',null,x[0]));dl.appendChild(el('dd',null,x[1]))});c.appendChild(dl)}
function para(c,x,cls){c.appendChild(el('p',cls||null,x))}
function foot(c,nodes){var p=el('p','ft');nodes.forEach(function(x,i){if(i)p.appendChild(document.createTextNode(' '));p.appendChild(typeof x==='string'?document.createTextNode(x):x)});c.appendChild(p)}
function rec(d){return API+'/verify/'+encodeURIComponent(d)+(zh?'?lang=zh':'')}
function when(t){return t?String(t).slice(0,16).replace('T',' ')+' UTC':''}
var ref='';try{if(document.referrer)ref=host(new URL(document.referrer).hostname)}catch(e){}
function fromOther(d){return ref&&ref!=='cgbb.org'&&ref!=='api.cgbb.org'&&ref!==d&&!(ref.slice(-d.length-1)==='.'+d)}
function run(raw,push){var d=host(raw);if(!d){card('bad',T.bad);return}
 inp.value=d;if(push){try{history.replaceState(null,'','?d='+encodeURIComponent(d))}catch(e){}}
 out.textContent='';out.appendChild(el('p','vf-eg',T.busy));
 fetch(API+'/verify/'+encodeURIComponent(d)+'?format=json',{headers:{accept:'application/json'}}).then(function(r){if(!r.ok&&r.status!==404)throw 0;return r.json()}).then(function(v){
  var c;
  if(v.status==='valid'){var p=v.published_on_site,fake=p&&p.found&&!(p.genuine&&p.matches_domain),vt=v.level==='verified_trusted';
   c=card(fake?'warn':'',fake?T.warn:(vt?T.okVT:T.ok));
   if(fromOther(d))para(c,T.ref(ref,d),'vf-ref');
   if(fake)para(c,T.warnP);
   rows(c,[[T.site,v.domain],[T.org,v.organisation],[T.lvl,vt?T.vt+(v.trust_score!=null?' · '+v.trust_score+'%':''):T.member],[T.rev,v.reviewed_by==='accredited_partner'?T.revP:T.revS],[T.mem,(T.ms[v.membership_status]||v.membership_status||'')+(v.membership_number?' · '+v.membership_number:'')],[T.until,v.valid_until],[T.pub,p?(p.found?(p.genuine&&p.matches_domain?T.pubY:T.pubM):T.pubN):''],[T.chk,when(v.checked_at)]]);
   if(vt&&v.baseline)baseline(c,v.baseline);
   para(c,(vt?T.noteVT:T.note)+' '+T.noteNo,'vf-small');foot(c,[link(rec(d),T.full)])}
  else if(v.status==='inactive'){c=card('warn',T.inact);if(fromOther(d))para(c,T.ref(ref,d),'vf-ref');rows(c,[[T.site,v.domain],[T.org,v.organisation],[T.mem,T.ms[v.membership_status]||v.membership_status],[T.chk,when(v.checked_at)]]);para(c,T.inactP);foot(c,[link(rec(d),T.full)])}
  else if(v.status==='invalid_domain'){c=card('bad',T.none);para(c,T.badD)}
  else if(v.status==='not_found'){c=card('bad',T.none);para(c,T.noneP(d));foot(c,[T.mine,link(f.getAttribute('data-apply'),T.apply)])}
  else throw 0;
 }).catch(function(){var c=card('warn',T.err);foot(c,[link(rec(d),T.errL)])})}
f.addEventListener('submit',function(e){e.preventDefault();run(inp.value,true)});
var q=new URLSearchParams(location.search).get('d');if(q){inp.value=q;run(q,false)}
})();
