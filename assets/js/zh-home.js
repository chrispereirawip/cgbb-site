(function(){
/* Events come live from the admin panel (api /api/events). The list built into the page stays as the fallback. */
var C={"api": "https://api.cgbb.org", "lang": "zh", "members": "創始機構及合作夥伴活動", "past": "過往活動", "none": "新活動即將公佈。", "more": "活動詳情 →", "tbc": "日期待定"},ev=document.getElementById('events');if(!ev||!window.fetch)return;var R=ev.querySelector('.right');if(!R)return;
var zh=C.lang==='zh',MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pk(o){o=o||{};return zh?(o.zh||o.en||''):(o.en||o.zh||'')}
function p2(n){return(n<10?'0':'')+n}
var d0=new Date(),today=d0.getFullYear()+'-'+p2(d0.getMonth()+1)+'-'+p2(d0.getDate());
function endOf(e){var d=e.end||e.start||'';return d.length===7?d+'-31':d}
function when(e){var s=(e.start||'').split('-'),y=s[0],m=+s[1]||1,d=+s[2]||0,en=(e.end||'').split('-'),em=+en[1]||0,ed=+en[2]||0;
 if(pk(e.dateLabel))return [pk(e.dateLabel),y];
 if(!d||e.tbc)return [zh?m+'月':MON[m-1],y];
 var multi=ed&&(ed!==d||em!==m)&&(e.end||'')>(e.start||'');
 if(zh)return [m+'月'+d+'日'+(multi?'–'+(em!==m?em+'月':'')+ed+'日':''),y];
 return [d+(multi?(em!==m?' '+MON[m-1]+' – '+ed+' '+MON[em-1]:'–'+ed+' '+MON[m-1]):' '+MON[m-1]),y]}
function card(e,feat){var w=when(e),t=pk(e.text);
 var items=(e.items||[]).length?'<ul class="tbc">'+e.items.map(function(x){return '<li><span class="d">'+esc(pk(x.date))+'</span><span>'+esc(pk(x.title))+'</span></li>'}).join('')+'</ul>':'';
 return '<div class="ev'+(feat?' featured':'')+'" data-end="'+esc(endOf(e))+'"><div class="when"><div class="m">'+esc(w[0])+'</div><div class="y">'+esc(w[1])+'</div></div><div class="what">'
  +(e.image&&/^https:\/\//i.test(e.image)?'<img class="evimg" src="'+esc(e.image)+'" alt="" loading="lazy">':'')
  +(pk(e.by)?'<div class="by">'+esc(pk(e.by))+'</div>':'')+'<div class="title">'+esc(pk(e.title))+'</div>'+(pk(e.city)?'<div class="where">'+esc(pk(e.city))+'</div>':'')
  +(t?'<p>'+esc(t).replace(/\n+/g,'<br>')+'</p>':'')+items+(e.tbc?'<div class="note">'+esc(C.tbc)+'</div>':'')
  +(e.url&&/^https?:\/\//i.test(e.url)?'<a class="more" href="'+esc(e.url)+'" target="_blank" rel="noopener">'+esc(pk(e.linkLabel)||C.more)+'</a>':'')+'</div></div>'}
R.classList.add('ev-wait');var done=false,tm=setTimeout(function(){if(!done)R.classList.remove('ev-wait')},2500);
fetch(C.api+'/api/events',{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){done=true;clearTimeout(tm);R.classList.remove('ev-wait');if(!j||j.status!=='ok'||!j.seeded)return;
 var L=j.events||[],up=function(e){return endOf(e)>=today},by=function(a,b){return String(a.start).localeCompare(String(b.start))};
 var own=L.filter(function(e){return e.kind!=='partner'&&up(e)}).sort(by),par=L.filter(function(e){return e.kind==='partner'&&up(e)}).sort(by),past=L.filter(function(e){return !up(e)}).sort(function(a,b){return endOf(b).localeCompare(endOf(a))});
 var h='<div class="ev-list">'+own.map(function(e,i){return card(e,i===0)}).join('')+(own.length?'':'<div class="ev-none">'+esc(C.none)+'</div>')+'</div>';
 if(par.length)h+='<div class="ev-sub ev-member"><div class="label">'+esc(C.members)+'</div><div class="ev-list">'+par.map(function(e){return card(e)}).join('')+'</div></div>';
 if(past.length)h+='<div class="ev-sub ev-past"><div class="label">'+esc(C.past)+'</div><div class="ev-list">'+past.map(function(e){return card(e)}).join('')+'</div></div>';
 R.innerHTML=h}).catch(function(){done=true;R.classList.remove('ev-wait')})})();
