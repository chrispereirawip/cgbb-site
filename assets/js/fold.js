// Opens an in-page dropdown (<details id="...">) from a link or the address hash, e.g. /#trust-book or /apply/#advanced.
(function(){
function open(id,scroll){var d=id&&document.getElementById(id);if(!d||d.tagName!=='DETAILS')return false;d.open=true;if(scroll)setTimeout(function(){d.scrollIntoView({behavior:'smooth',block:'start'})},60);return true}
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;if(open(a.getAttribute('href').slice(1),true))e.preventDefault()});
function fromHash(){open(location.hash.slice(1),true)}
fromHash();addEventListener('hashchange',fromHash);
})();
