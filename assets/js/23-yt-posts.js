/* Reddit-style Blogger YouTube post list — v1.0.26 */
(function(){
  if(window.__ytPosts)return; window.__ytPosts=1;
  if(location.pathname==='/p/home.html')document.documentElement.classList.add('jt-home-page');
  if(location.pathname==='/'&&!window.__jtHomeRedirect){
    window.__jtHomeRedirect=1;
    location.replace('/p/home.html');
    return;
  }
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
  function https(u){return (typeof u==='string'&&u.indexOf('http://')===0)?('https://'+u.slice(7)):u;}
  function thumbUrl(u){
    if(!u)return '';
    return u.replace(/\/s\d+(-c)?\//,'/w160-h90-c/').replace(/=s\d+(-c)?$/,'=w160-h90-c');
  }
  function dateText(s){
    var d=new Date(s);
    if(isNaN(d.getTime()))return '';
    return d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
  }
  function initTheme(){
    var key='jt-theme',saved=null;
    try{saved=localStorage.getItem(key);}catch(e){}
    var mode=(saved==='dark'||saved==='light')?saved:((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
    var btn=document.getElementById('jtThemeToggle');
    if(!btn){
      btn=document.createElement('button');
      btn.id='jtThemeToggle';
      btn.type='button';
      document.body.appendChild(btn);
    }
    function apply(m){
      document.documentElement.setAttribute('data-theme',m);
      var dark=m==='dark';
      btn.textContent=dark?'☀':'☾';
      btn.setAttribute('aria-pressed',dark?'true':'false');
      btn.setAttribute('aria-label',dark?'라이트 모드로 전환':'다크 모드로 전환');
      btn.title=dark?'라이트 모드로 전환':'다크 모드로 전환';
    }
    btn.onclick=function(){
      var next=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
      apply(next);
      try{localStorage.setItem(key,next);}catch(e){}
    };
    apply(mode);
  }
  function initQuickNav(){
    if(document.getElementById('jtQuickNav'))return;
    var nav=document.createElement('nav');
    nav.id='jtQuickNav';
    nav.setAttribute('aria-label','빠른 이동');
    var home=document.createElement('a');
    home.className='jt-qn-btn';
    home.href='/';
    home.title='홈';
    home.setAttribute('aria-label','홈');
    home.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>';
    var top=document.createElement('button');
    top.type='button';
    top.className='jt-qn-btn';
    top.title='맨 위로';
    top.setAttribute('aria-label','맨 위로');
    top.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    function sync(){
      if(window.scrollY<180){top.classList.add('is-dim');}else{top.classList.remove('is-dim');}
    }
    top.onclick=function(){
      var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    };
    nav.appendChild(home);nav.appendChild(top);
    document.body.appendChild(nav);
    window.addEventListener('scroll',sync,{passive:true});
    sync();
  }
  function lazyPostImages(scope){
    var imgs=(scope||document).querySelectorAll('.post-body img');
    for(var i=0;i<imgs.length;i++){
      var im=imgs[i];
      if(!im.getAttribute('loading'))im.setAttribute('loading','lazy');
      if(!im.getAttribute('decoding'))im.setAttribute('decoding','async');
    }
  }
  function watchPostImages(){
    lazyPostImages(document);
    var feed=document.getElementById('jtInfiniteFeed');
    if(!feed||!window.MutationObserver||feed.__jtLazyObs)return;
    feed.__jtLazyObs=1;
    new MutationObserver(function(){lazyPostImages(feed);}).observe(feed,{childList:true,subtree:true});
  }
  function fetchFeed(){
    return fetch('/feeds/posts/default?alt=json&max-results=20',{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      ['catch'](function(){
        return fetch('https://reddit-blogspot-edge.pages.dev/api/blogger-feed?max=20')
          .then(function(r){if(!r.ok)throw 0;return r.json();});
      });
  }
  ready(function(){
    initTheme();
    initQuickNav();
    setTimeout(watchPostImages,800);
    var root=document.getElementById('ytPosts');
    if(!root)return;
    var head=el('div','yt-head');
    head.appendChild(document.createTextNode('추천·인기 글'));
    var count=el('span','yt-count','');
    head.appendChild(count);
    root.appendChild(head);
    var list=el('div','yt-list');
    root.appendChild(list);

    fetchFeed().then(function(data){
      var entries=(data.feed&&data.feed.entry)||[];
      var seen={},n=0,idx=0;

      function addNext(){
        while(idx<entries.length&&n<12){
          var e=entries[idx++];
          var links=e.link||[],href='';
          for(var k=0;k<links.length;k++){if(links[k].rel==='alternate'){href=https(links[k].href);break;}}
          if(!href||seen[href])continue;
          seen[href]=1;
          var cat=(e.category&&e.category[0]&&e.category[0].term)||'';
          var title=(e.title&&e.title.$t||'').trim()||cat||'게시물';
          var date=dateText(e.published&&e.published.$t);
          var thumb=thumbUrl(e.media$thumbnail&&e.media$thumbnail.url||'');

          var a=el('a','yt-item');
          a.href=href;
          var box=el('span','yt-thumb');
          if(thumb){
            var img=el('img');
            box.classList.add('is-loading');
            function loaded(){
              box.classList.remove('is-loading');
              box.classList.add('is-loaded');
            }
            img.onload=loaded;
            img.onerror=function(){
              img.style.display='none';
              box.classList.remove('is-loading');
              box.classList.add('yt-thumb-empty');
            };
            img.alt=title;
            img.loading='lazy';
            img.decoding='async';
            img.setAttribute('fetchpriority','low');
            img.src=thumb;
            box.appendChild(img);
            if(img.complete&&img.naturalWidth)loaded();
          }else{
            box.classList.add('yt-thumb-empty');
          }
          var info=el('span','yt-info');
          var h=el('span','yt-title',title);
          var meta=el('span','yt-meta',[date,cat].filter(Boolean).join(' · '));
          info.appendChild(h);info.appendChild(meta);
          a.appendChild(box);a.appendChild(info);
          list.appendChild(a);
          n++;
          count.textContent=String(n);
          setTimeout(addNext,35);
          return;
        }
        count.textContent=String(n);
        if(!n){list.appendChild(el('div','yt-empty','표시할 글이 없습니다.'));}
      }
      addNext();
    })['catch'](function(){
      list.appendChild(el('div','yt-empty','글을 불러오지 못했습니다.'));
    });
  });
})();
