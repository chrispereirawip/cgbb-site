(function(){
function copy(text,btn){var done=function(){var o=btn.textContent;btn.textContent=btn.getAttribute('data-done')||'Copied';setTimeout(function(){btn.textContent=o},2000)};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){fallback(text);done()})}else{fallback(text);done()}}
function fallback(text){var t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}
document.addEventListener('click',function(e){
 var b=e.target.closest('[data-copy]');if(b){var p=document.querySelector('[data-prompt]');if(p)copy(p.textContent,b);return}
 var m=e.target.closest('[data-copymcp]');if(m){var c=document.querySelector('[data-mcp]');if(c)copy(c.textContent,m)}});
})();
