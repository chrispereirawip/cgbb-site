(function(){
var f=document.querySelector('[data-verify]');if(!f)return;var out=document.querySelector('[data-result]'),zh=f.getAttribute('data-lang')==='zh',inp=f.querySelector('input');
var API='https://api.cgbb.org';
var T=zh?{ok:'✓ 已在品信會登記冊核實',inact:'目前無效',none:'沒有品信會紀錄',org:'機構',site:'網站',lvl:'級別',mem:'會籍',until:'有效期至',pub:'網站上的憑證',pubY:'已發佈（真實）',pubM:'找到檔案，但與紀錄不符',pubN:'尚未發佈',
member:'CGBB Member：已確認會籍、網站及聯絡人（不含信任評分）',vt:'CGBB Verified Trusted',active:'有效',full:'查看完整紀錄 →',
noneP:function(d){return '品信會沒有 '+d+' 的紀錄。此網站上顯示的任何品信會徽章或憑證均不應採信。'},inactP:'此網站曾有品信會紀錄，但目前無效。請勿依賴其顯示的品信會徽章或憑證。',
mine:'這是您的機構？',apply:'申請成為會員 →',bad:'請輸入網站地址，例如 brand.com',err:'暫時無法連接登記冊。',errL:'直接打開紀錄 →',busy:'正在查詢登記冊…'}
:{ok:'✓ Verified in the CGBB registry',inact:'Not currently valid',none:'No CGBB record',org:'Organisation',site:'Website',lvl:'Level',mem:'Membership',until:'Valid until',pub:'Credential on the website',pubY:'Published (genuine)',pubM:'A file was found but does not match this record',pubN:'Not yet published',
member:'CGBB Member: membership, website and contact confirmed (no trust score)',vt:'CGBB Verified Trusted',active:'Active',full:'See the full record →',
noneP:function(d){return 'CGBB has no record for '+d+'. Any CGBB badge or credential shown on this website should not be relied on.'},inactP:'This website had a CGBB record, but it is not currently valid. Do not rely on a CGBB badge or credential shown on it.',
mine:'Is this your organisation?',apply:'Apply for membership →',bad:'Enter a website address, for example brand.com',err:'The registry could not be reached just now.',errL:'Open the record directly →',busy:'Checking the registry…'};
function host(v){v=String(v||'').trim().toLowerCase().replace(/^[a-z]+:\/\//,'').replace(/^www\./,'').split(/[\/?#\s]/)[0].replace(/:\d+$/,'');return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v)?v:''}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function link(h,x){var a=el('a',null,x);a.href=h;return a}
function card(cls,st){out.textContent='';var c=el('div','vf-card'+(cls?' '+cls:''));c.appendChild(el('div','vf-st',st));out.appendChild(c);return c}
function rows(c,r){var dl=el('dl');r.forEach(function(x){if(!x[1])return;dl.appendChild(el('dt',null,x[0]));dl.appendChild(el('dd',null,x[1]))});c.appendChild(dl)}
function foot(c,parts){var p=el('p','ft');parts.forEach(function(x,i){if(i)p.appendChild(document.createTextNode(' · '));p.appendChild(typeof x==='string'?document.createTextNode(x):x)});c.appendChild(p)}
function rec(d){return API+'/verify/'+encodeURIComponent(d)+(zh?'?lang=zh':'')}
function run(raw,push){var d=host(raw);if(!d){var c=card('bad',T.bad);return}
 inp.value=d;if(push){try{history.replaceState(null,'','?d='+encodeURIComponent(d))}catch(e){}}
 out.textContent='';out.appendChild(el('p','vf-eg',T.busy));
 fetch(API+'/verify/'+encodeURIComponent(d)+'?format=json',{headers:{accept:'application/json'}}).then(function(r){return r.json()}).then(function(v){
  if(v.status==='valid'){var c=card('',T.ok),p=v.published_on_site;
   rows(c,[[T.org,v.organisation],[T.site,v.domain],[T.lvl,v.level==='verified_trusted'?T.vt:T.member],[T.mem,(v.membership_status==='active'?T.active:v.membership_status||'')+(v.membership_number?' · '+v.membership_number:'')],[T.until,v.valid_until],[T.pub,p?(p.found?(p.genuine&&p.matches_domain?T.pubY:T.pubM):T.pubN):'']]);
   foot(c,[link(rec(d),T.full)])}
  else if(v.status==='inactive'){var c2=card('warn',T.inact);rows(c2,[[T.org,v.organisation],[T.site,v.domain]]);c2.appendChild(el('p',null,T.inactP));foot(c2,[link(rec(d),T.full)])}
  else if(v.status==='invalid_domain'){card('bad',T.bad)}
  else{var c3=card('bad',T.none);c3.appendChild(el('p',null,T.noneP(d)));var fp=el('p','ft',T.mine+' ');fp.appendChild(link(f.getAttribute('data-apply'),T.apply));c3.appendChild(fp)}
 }).catch(function(){var c4=card('warn',T.err);foot(c4,[link(rec(d),T.errL)])})}
f.addEventListener('submit',function(e){e.preventDefault();run(inp.value,true)});
document.querySelectorAll('.vf-eg a[href^="?d="]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();run(a.getAttribute('href').slice(3),true)})});
var q=new URLSearchParams(location.search).get('d');if(q)run(q,false);
})();
