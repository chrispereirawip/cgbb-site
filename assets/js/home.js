(function(){var d=new Date(),p=function(n){return(n<10?'0':'')+n},td=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
var ev=document.getElementById('events');if(!ev)return;var pl=ev.querySelector('.ev-past .ev-list'),moved=[];
ev.querySelectorAll('.right > .ev-list > .ev, .ev-member .ev').forEach(function(c){var e=c.getAttribute('data-end');if(e&&e<td){c.classList.remove('featured');moved.push(c)}});
if(!moved.length)return;moved.forEach(function(c){pl.appendChild(c)});
[].slice.call(pl.children).sort(function(a,b){return(b.getAttribute('data-end')||'').localeCompare(a.getAttribute('data-end')||'')}).forEach(function(c){pl.appendChild(c)});
pl.parentNode.hidden=false;var m=ev.querySelector('.ev-member');if(m&&!m.querySelector('.ev'))m.hidden=true;
var main=ev.querySelector('.right > .ev-list'),f=main.querySelector('.ev');if(f)f.classList.add('featured');else main.querySelector('.ev-none').hidden=false})();
