/* Reddit-style Blogger YouTube post list — v1.0.58 */
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
  function initHomeHero(){
    if(document.querySelector('.jt-hero'))return;
    var body=document.querySelector('.post-body');
    if(!body)return;
    var id='lyFcrrULyN0';
    var poster='https://i.ytimg.com/vi/'+id+'/sddefault.jpg';
    var hero=document.createElement('div');
    hero.className='jt-hero';
    hero.innerHTML='<div class="jt-hero-media"><img class="jt-hero-poster" src="'+poster+'" alt="" loading="eager" fetchpriority="high" decoding="async"><button type="button" class="jt-hero-play" aria-label="히어로 영상 재생"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button></div>'
      +'<div class="jt-hero-copy"><p class="jt-hero-kicker">JUST TECH</p><h2 class="jt-hero-title">산업 자동화 기술 아카이브</h2><p class="jt-hero-sub">로봇·설비·자동화 현장을 기록합니다.</p></div>';
    body.insertBefore(hero,body.firstChild);
    var media=hero.querySelector('.jt-hero-media');
    var play=hero.querySelector('.jt-hero-play');
    if(play){
      play.onclick=function(){
        media.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=0&loop=1&playlist='+id+'&controls=0&modestbranding=1&playsinline=1&rel=0" title="JUST TECH 히어로 영상" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      };
    }
  }
  function initHomeFooter(){
    if(document.querySelector('.jt-home-footer'))return;
    var footer=document.createElement('footer');
    footer.className='jt-home-footer';
    footer.innerHTML='<div class="jt-home-footer-inner">'
      +'<div><p class="jt-home-footer-brand">JUST TECH</p><p class="jt-home-footer-desc">산업 자동화·로봇·설비 기술 자료를 기록하는 블로그입니다.</p></div>'
      +'<nav class="jt-home-footer-nav" aria-label="푸터 메뉴"><a href="/">홈</a><a href="/search">전체 글</a><a href="/p/about-us.html">About</a><a href="/p/contact-us.html">Contact</a></nav>'
      +'<p class="jt-home-footer-copy">© 2026 JUST TECH. All rights reserved.</p>'
      +'</div>';
    (document.querySelector('.all-container')||document.body).appendChild(footer);
  }
  function initHomeLanding(){
    if(document.querySelector('.jt-landing'))return;
    var body=document.querySelector('.post-body');
    if(!body)return;
    document.body.classList.add('jt-landing-page');
    var poster='https://i.ytimg.com/vi/lyFcrrULyN0/sddefault.jpg';
    var card='<a class="jt-project-card" href="/search"><span class="jt-project-media"><img alt="" loading="lazy" decoding="async"></span><span class="jt-project-body"><small>PROJECT</small><strong class="jt-project-title">자동화 프로젝트</strong><span class="jt-project-desc">현장 적용 사례</span></span></a>';
    var landing=document.createElement('div');
    landing.className='jt-landing';
    landing.innerHTML=
      '<nav class="jt-landing-nav">'
      +'<a class="jt-landing-brand" href="/p/home.html"><span class="jt-brand-mark">JT</span><span>JUST TECH<small>INDUSTRIAL AUTOMATION</small></span></a>'
      +'<div class="jt-landing-navlinks"><a href="#jt-services">서비스</a><a href="#jt-projects">프로젝트</a><a href="#jt-about">소개</a></div>'
      +'<a class="jt-landing-cta" href="mailto:qwe6973@proton.me">프로젝트 문의</a>'
      +'</nav>'
      +'<section class="jt-landing-hero">'
      +'<div class="jt-landing-copy"><p class="jt-eyebrow">INDUSTRIAL AUTOMATION STUDIO</p>'
      +'<h1>자동화의 모든 순간을<br><em>한 곳에서</em></h1>'
      +'<p class="jt-lead">로봇·조립·검사·포장 설비까지. 현장 중심의 자동화 기술 자료와 프로젝트를 한눈에 확인하세요.</p>'
      +'<div class="jt-hero-actions"><a class="jt-btn-primary" href="/search">프로젝트 보기</a><a class="jt-btn-secondary" href="mailto:qwe6973@proton.me">상담 문의</a></div>'
      +'<div class="jt-trust"><span>로봇 자동화</span><span>조립 설비</span><span>검사 장비</span><span>포장 자동화</span></div></div>'
      +'<div class="jt-hero-visual"><img src="'+poster+'" alt="자동화 설비" loading="eager" fetchpriority="high" decoding="async"><div class="jt-floating-card"><strong>현장 중심 자동화 아카이브</strong><span>로봇 · 설비 · 검사 · 포장</span></div></div>'
      +'</section>'
      +'<section class="jt-landing-section" id="jt-services"><div class="jt-section-head"><div><p class="jt-eyebrow">WHAT WE DO</p><h2>자동화의 전 과정을 다룹니다</h2></div><a href="/search">전체 자료 →</a></div>'
      +'<div class="jt-cards">'
      +'<div class="jt-service-card"><span class="jt-service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="11" rx="2"/><path d="M9 7V4m6 3V4M8 11h.01M16 11h.01M9 15h6"/></svg></span><h3>로봇 자동화</h3><p>용접·조립·핸들링 로봇과 셀 설계.</p></div>'
      +'<div class="jt-service-card"><span class="jt-service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg></span><h3>조립 설비</h3><p>반자동·전자동 조립 라인 구축.</p></div>'
      +'<div class="jt-service-card"><span class="jt-service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.5l2 2 3.5-3.5"/></svg></span><h3>검사 장비</h3><p>비전·치수·외관 검사 자동화.</p></div>'
      +'<div class="jt-service-card"><span class="jt-service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 8 8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/></svg></span><h3>포장 자동화</h3><p>포장·라벨링·이송 시스템.</p></div>'
      +'</div></section>'
      +'<section class="jt-landing-section" id="jt-projects"><div class="jt-section-head"><div><p class="jt-eyebrow">SELECTED PROJECTS</p><h2>현장에서 검증된 프로젝트</h2></div><a href="/search">프로젝트 더 보기 →</a></div>'
      +'<div class="jt-projects" id="jtLandingProjects">'+card+card+card+'</div></section>'
      +'<section class="jt-landing-section" id="jt-about"><div class="jt-section-head"><div><p class="jt-eyebrow">ABOUT JUST TECH</p><h2>현장을 이해하는 자동화 파트너</h2></div><a href="/search">기술 자료 →</a></div>'
      +'<p class="jt-lead" style="max-width:760px">JUST TECH는 산업 자동화·로봇·설비 기술 자료를 기록하고 공유합니다. 실제 현장의 문제를 중심으로 설계, 제작, 적용 과정을 정리합니다.</p></section>'
      +'<div class="jt-cta"><div><h2>다음 자동화 프로젝트를 함께 시작하세요</h2><p>설비·로봇·검사·포장 자동화 상담을 받아보세요.</p></div><a href="mailto:qwe6973@proton.me">문의하기</a></div>';
    body.insertBefore(landing,body.firstChild);
    setTimeout(loadLandingProjects,500);
  }
  function loadLandingProjects(){
    var grid=document.getElementById('jtLandingProjects');
    if(!grid)return;
    fetchFeed(1,6).then(function(data){
      var entries=(data.feed&&data.feed.entry)||[];
      for(var i=0;i<entries.length&&i<3;i++){
        var e=entries[i],card=grid.children[i];
        if(!card)continue;
        var links=e.link||[],href='';
        for(var k=0;k<links.length;k++){if(links[k].rel==='alternate'){href=https(links[k].href);break;}}
        if(href)card.href=href;
        var title=(e.title&&e.title.$t||'').trim();
        var cat=(e.category&&e.category[0]&&e.category[0].term)||'';
        var t=card.querySelector('.jt-project-title'),d=card.querySelector('.jt-project-desc');
        if(t&&title)t.textContent=title;
        if(d&&cat)d.textContent=cat;
        var thumb=e.media$thumbnail&&e.media$thumbnail.url||'';
        if(thumb){
          thumb=thumb.replace(/\/s\d+(-c)?\//,'/w600-h400-c/');
          var img=card.querySelector('img');
          if(img){
            img.style.display='block';
            img.onerror=function(){this.style.display='none';};
            img.src=thumb;
          }
        }
      }
    })['catch'](function(){});
  }
  function fetchFeed(start,max){
    var qs='?alt=json&max-results='+max+(start>1?'&start-index='+start:'');
    return fetch('/feeds/posts/default'+qs,{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      ['catch'](function(){
        return fetch('https://reddit-blogspot-edge.pages.dev/api/blogger-feed?max='+max)
          .then(function(r){if(!r.ok)throw 0;return r.json();});
      });
  }
  ready(function(){
    initTheme();
    initQuickNav();
    if(location.pathname==='/p/home.html'){initHomeLanding();initHomeFooter();return;}
    setTimeout(watchPostImages,800);
    var root=document.getElementById('ytPosts');
    if(!root)return;
    var head=el('div','yt-head');
    head.appendChild(document.createTextNode('추천·인기 글'));
    var count=el('span','yt-count','LIVE');
    head.appendChild(count);
    root.appendChild(head);
    var viewport=el('div','yt-viewport');
    var list=el('div','yt-list');
    viewport.appendChild(list);
    root.appendChild(viewport);

    var seen={},nextStart=1,loading=false,exhausted=false,idx=0,step=66,visible=14;

    function makeItem(e){
      var links=e.link||[],href='';
      for(var k=0;k<links.length;k++){if(links[k].rel==='alternate'){href=https(links[k].href);break;}}
      if(!href||seen[href])return null;
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
      info.appendChild(el('span','yt-title',title));
      info.appendChild(el('span','yt-meta',[date,cat].filter(Boolean).join(' · ')));
      a.appendChild(box);a.appendChild(info);
      return a;
    }

    function measure(){
      var first=list.firstElementChild;
      var h=first?first.getBoundingClientRect().height:70;
      step=(h||70)+2;
    }

    function setPos(i,animate){
      list.style.transition=animate?'transform .55s cubic-bezier(.22,.9,.3,1)':'none';
      list.style.transform='translateY('+(-i*step)+'px)';
    }

    function addEntries(entries,cb){
      var i=0,added=0;
      function step(){
        while(i<entries.length){
          var a=makeItem(entries[i++]);
          if(!a)continue;
          list.appendChild(a);added++;
          measure();
          setTimeout(step,40);
          return;
        }
        measure();
        if(cb)cb(added);
      }
      step();
    }

    function loadMore(cb){
      if(loading||exhausted){if(cb)cb();return;}
      loading=true;
      fetchFeed(nextStart,20).then(function(data){
        var entries=(data.feed&&data.feed.entry)||[];
        if(!entries.length){
          exhausted=true;loading=false;
          if(cb)cb();
          return;
        }
        nextStart+=entries.length;
        addEntries(entries,function(added){
          if(!added)exhausted=true;
          loading=false;
          if(cb)cb();
        });
      })['catch'](function(){
        loading=false;
        if(cb)cb();
      });
    }

    function outCurrent(){
      var cur=list.children[idx];
      if(cur){
        cur.classList.add('is-out');
        setTimeout(function(){cur.classList.remove('is-out');},700);
      }
    }

    function advance(){
      if(loading)return;
      var n=list.children.length;
      if(!n){loadMore(function(){setPos(0,false);});return;}
      var max=Math.max(0,n-visible);
      if(idx<max){
        outCurrent();
        idx++;
        setPos(idx,true);
      }else if(!exhausted){
        loadMore(function(){advance();});
      }else{
        outCurrent();
        idx=0;
        setPos(0,false);
      }
    }

    function retreat(){
      if(loading||idx<=0)return;
      idx--;
      setPos(idx,true);
    }

    root.addEventListener('wheel',function(e){
      if(!e.deltaY)return;
      e.preventDefault();
      if(e.deltaY>0)advance();else retreat();
    },{passive:false});

    measure();
    loadMore(function(){setPos(0,false);measure();});
  });
})();
