/* Reddit-style Blogger 3-column layout — v1.2.2 */
(function(){
  if(window.__rd3Layout)return; window.__rd3Layout=1;
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}

  var I={
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.5 10.8 12 3.5l8.5 7.3V20a.8.8 0 0 1-.8.8h-5.1v-6h-5.2v6H4.3a.8.8 0 0 1-.8-.8z"/></svg>',
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2"/></svg>'
  };
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function iconFor(text,idx){
    var t=String(text||'').toLowerCase();
    if(idx===0||t==='home'||t==='홈')return I.home;
    if(t.indexOf('about')>=0||t.indexOf('소개')>=0)return I.info;
    if(t.indexOf('contact')>=0||t.indexOf('연락')>=0)return I.mail;
    if(t.indexOf('post')>=0||t.indexOf('글')>=0||t.indexOf('archive')>=0)return I.grid;
    return I.link;
  }
  function active(href){
    try{
      var p=new URL(href,location.href).pathname;
      if(p==='/')return location.pathname==='/'||location.pathname==='';
      return location.pathname.indexOf(p)===0;
    }catch(e){return false;}
  }
  function pageLinks(){
    var out=[],seen={};
    var nodes=document.querySelectorAll('.centered-top-secondline .PageList a, .PageList a');
    for(var i=0;i<nodes.length;i++){
      var a=nodes[i],t=(a.textContent||'').trim(),h=a.getAttribute('href')||'';
      if(!t||!h||seen[h])continue;
      seen[h]=1;out.push({t:t,h:h});
    }
    return out;
  }

  ready(function(){
    var box=document.querySelector('.main_content_container');
    if(!box||document.getElementById('rd3Left'))return;
    document.body.classList.add('rd3-layout');

    var links=pageLinks();
    if(!links.length){
      links=[
        {t:'Home',h:'/'},
        {t:'All posts',h:'/search'},
        {t:'About',h:'/p/about-us.html'},
        {t:'Contact',h:'/p/contact-us.html'}
      ];
    }
    if(!links.some(function(x){return x.h==='/'||x.t.toLowerCase()==='home';})){
      links.unshift({t:'Home',h:'/'});
    }

    var nav='';
    for(var i=0;i<links.length&&i<10;i++){
      var l=links[i];
      nav+='<a class="rd3-link'+(active(l.h)?' is-active':'')+'" href="'+esc(l.h)+'"'+(active(l.h)?' aria-current="page"':'')+'>'
        +'<span class="rd3-ico" aria-hidden="true">'+iconFor(l.t,i)+'</span>'
        +'<span class="rd3-label">'+esc(l.t)+'</span></a>';
    }

    var left=document.createElement('aside');
    left.id='rd3Left';
    left.className='rd3-left';
    left.setAttribute('aria-label','왼쪽 사이드바');
    left.innerHTML='<div class="rd3-left-inner">'
      +'<p class="rd3-title">Menu</p>'
      +'<nav class="rd3-nav" aria-label="사이트 메뉴">'+nav+'</nav>'
      +'<div class="rd3-left-slot" id="rd3-left-slot"></div>'
      +'</div>';
    box.insertBefore(left,box.firstChild);

    var leftToggle=document.createElement('button');
    leftToggle.type='button';
    leftToggle.id='jtLeftToggle';
    leftToggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    document.body.appendChild(leftToggle);

    var leftKey='jt-left-collapsed';
    function setLeftCollapsed(collapsed){
      document.body.classList.toggle('jt-left-collapsed',collapsed);
      leftToggle.setAttribute('aria-label',collapsed?'왼쪽 메뉴 펼치기':'왼쪽 메뉴 접기');
      leftToggle.title=collapsed?'왼쪽 메뉴 펼치기':'왼쪽 메뉴 접기';
    }
    var leftCollapsed=false;
    try{leftCollapsed=localStorage.getItem(leftKey)==='1';}catch(e){}
    setLeftCollapsed(leftCollapsed);
    leftToggle.onclick=function(){
      var collapsed=!document.body.classList.contains('jt-left-collapsed');
      setLeftCollapsed(collapsed);
      try{localStorage.setItem(leftKey,collapsed?'1':'0');}catch(e){}
    };

    var right=box.querySelector(':scope > .sidebar-container');
    if(right){
      right.classList.remove('sidebar-invisible');
      right.setAttribute('aria-hidden','false');
    }
  });
})();
