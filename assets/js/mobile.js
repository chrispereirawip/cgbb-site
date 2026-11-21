// Phones only (Chris, 20–21 Nov 2026): a much simpler front page, so a visitor can join quickly. The long sections fold
// into tap-to-open rows (they open in place), and a "Join free" bar stays at the bottom of the screen.
(function(){
if(!window.matchMedia||!matchMedia('(max-width:640px)').matches)return;
var L=document.documentElement.lang||'en';
var T={en:{b:'How the Brand Trust Baseline works',n:'News and events',l:'The council and founding institutions'},
'zh-Hant':{b:'品牌可信度基線評估如何運作',n:'新聞與活動',l:'理事會及創始機構'},
'zh-Hans':{b:'品牌可信度基线评估如何运作',n:'新闻与活动',l:'理事会及创始机构'}}[L]||{};
function fold(els,title){els=els.filter(Boolean);if(!els.length||!title)return;var d=document.createElement('details');d.className='m-fold';var s=document.createElement('summary');s.textContent=title;d.appendChild(s);els[0].parentNode.insertBefore(d,els[0]);els.forEach(function(e){d.appendChild(e)})}
var $=function(q){return document.querySelector(q)};
fold([$('#baseline')],T.b);
fold([$('#news')],T.n);
fold([$('#leadership .orgs'),$('#leadership .ppl')],T.l);
// a link or address that points inside a folded row opens it first
function reveal(id,scroll){var el=id&&document.getElementById(id);if(!el)return;var d=el.closest('details.m-fold');if(d&&!d.open){d.open=true}if(d&&scroll)setTimeout(function(){el.scrollIntoView({block:'start'})},60)}
document.addEventListener('click',function(e){var a=e.target.closest('a[href*="#"]');if(!a)return;var h=a.getAttribute('href');var i=h.indexOf('#');if(i<0)return;var p=h.slice(0,i);if(p&&p!==location.pathname)return;reveal(h.slice(i+1),true)});
reveal(location.hash.slice(1),true);addEventListener('hashchange',function(){reveal(location.hash.slice(1),true)});
// "Join free" bar: shown once the first button has scrolled away, hidden again at the closing call to action and footer
var bar=$('.m-bar'),first=$('.m-j');
if(bar&&first&&'IntersectionObserver' in window){var seen={};var upd=function(){bar.classList.toggle('on',!seen.first&&!seen.end)};
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.target===first)seen.first=x.isIntersecting;else seen[x.target.tagName+x.target.id]=x.isIntersecting});seen.end=!!(seen['SECTIONmembership']||seen['FOOTER']);upd()});
io.observe(first);var m=$('#membership'),f=$('footer');if(m)io.observe(m);if(f)io.observe(f);document.body.classList.add('m-pad')}
})();
