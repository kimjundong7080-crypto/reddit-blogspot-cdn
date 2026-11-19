/* Reddit-style Blogger home landing — v1.2.7 */
(function(){
  if(window.__jtHomeWidget)return; window.__jtHomeWidget=1;
  if(location.pathname!=='/p/home.html')return;
  document.documentElement.classList.add('jt-home-page');
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}
  var HOME_FEED_KEY='jt-home-feed-v1',HOME_FEED_TTL=21600000;
  function readHomeCache(allowStale){
    try{
      var raw=localStorage.getItem(HOME_FEED_KEY);
      if(!raw)return null;
      var box=JSON.parse(raw);
      if(!box||!box.data)return null;
      if(!allowStale&&Date.now()-box.t>HOME_FEED_TTL)return null;
      return box.data;
    }catch(e){return null;}
  }
  function writeHomeCache(data){
    try{localStorage.setItem(HOME_FEED_KEY,JSON.stringify({t:Date.now(),data:data}));}catch(e){}
  }
  function fetchHomeFeed(start,max){
    var useCache=(start===1&&max===6);
    if(useCache){var cached=readHomeCache(false);if(cached)return Promise.resolve(cached);}
    var qs='?alt=json&max-results='+max+(start>1?'&start-index='+start:'');
    var load=fetch('/feeds/posts/default'+qs,{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      ['catch'](function(){
        return fetch('https://reddit-blogspot-edge.pages.dev/api/blogger-feed?max='+max)
          .then(function(r){if(!r.ok)throw 0;return r.json();});
      });
    return load.then(function(data){
      if(useCache)writeHomeCache(data);
      return data;
    })['catch'](function(err){
      if(useCache){var stale=readHomeCache(true);if(stale)return stale;}
      throw err;
    });
  }
  function https(u){return (typeof u==='string'&&u.indexOf('http://')===0)?('https://'+u.slice(7)):u;}
  function initHomeFooter(){
    if(document.querySelector('.jt-home-footer'))return;
    var footer=document.createElement('footer');
    footer.className='jt-home-footer';
    footer.innerHTML='<div class="jt-home-footer-inner">'
      +'<div><p class="jt-home-footer-brand">JUST TECH</p><p class="jt-home-footer-desc">산업 자동화·로봇·설비 기술 자료를 기록하는 블로그입니다.</p></div>'
      +'<nav class="jt-home-footer-nav" aria-label="푸터 메뉴"><a href="/">홈</a><a href="/search">전체 글</a><a href="/p/about-us.html">About</a><a href="/p/contact-us.html">Contact</a></nav>'
      +'<div class="jt-home-footer-contact"><p>PROJECT INQUIRY</p><a href="mailto:qwe6973@proton.me">qwe6973@proton.me</a></div>'
      +'<p class="jt-home-footer-copy">© 2026 JUST TECH. All rights reserved.</p>'
      +'</div>';
    (document.querySelector('.all-container')||document.body).appendChild(footer);
  }
  function initHomeLanding(){
    if(document.querySelector('.jt-landing'))return;
    var body=document.querySelector('#jt-home-root')||document.querySelector('.post-body');
    if(body&&body.id==='jt-home-root'&&(body.offsetParent===null||body.getClientRects().length===0)){
      var host=document.querySelector('.all-container')||document.body;
      host.insertBefore(body,host.firstChild);
    }
    if(!body&&location.pathname==='/p/home.html'){
      body=document.createElement('div');
      body.className='post-body entry-content';
      var host=document.querySelector('#page_body')||document.querySelector('.main_content_container')||document.body;
      host.insertBefore(body,host.firstChild);
    }
    if(!body)return;
    document.body.classList.add('jt-landing-page');
    var poster='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&q=75';
    var card='<a class="jt-project-card" href="/search"><span class="jt-project-media"><img alt="" loading="lazy" decoding="async"></span><span class="jt-project-body"><small>PROJECT</small><strong class="jt-project-title">자동화 프로젝트</strong><span class="jt-project-desc">현장 적용 사례</span></span></a>';
    var hzArrow='<svg class="jt-hz-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M15.707 8.707L8.707 15.707L7.293 14.293L12.586 9H0V7H12.586L7.293 1.707L8.707 0.292999L15.707 7.293C16.098 7.684 16.098 8.316 15.707 8.707Z"/></svg>';
    function hzCard(title,poster,src){
      return '<article class="jt-hz-card"><div class="jt-hz-media"><video class="jt-hz-video" muted loop playsinline preload="metadata"><source src="'+src+'" type="video/mp4"></video></div><div class="jt-hz-footer"><h3 class="jt-hz-title">'+title+'</h3>'+hzArrow+'</div></article>';
    }
    var hzCards=hzCard('3D Floor Plans','https://st.hzcdn.com/static/houzzPro/3DFloorPlans@4x.webp','https://pomf2.lain.la/f/1xdltask.mp4')
      +hzCard('Selections','https://st.hzcdn.com/static/houzzPro/Selections@4x.webp','https://pomf2.lain.la/f/5znwgux4.mp4')
      +hzCard('Estimates','https://st.hzcdn.com/static/houzzPro/Estimates@4x.webp','https://pomf2.lain.la/f/g6nb4aus.mp4')
      +hzCard('Takeoffs','https://st.hzcdn.com/static/houzzPro/Takeoffs@4x.webp','https://pomf2.lain.la/f/wx4t7zlc.mp4')
      +hzCard('Schedule','https://st.hzcdn.com/static/houzzPro/Schedule@4x.webp','https://pomf2.lain.la/f/3c1gcz5g.mp4')
      +hzCard('Projects',poster,'https://pomf2.lain.la/f/0m5whhmk.mp4');
    var hzSection='<section class="jt-hz-features" id="jt-features"><div class="jt-hz-container"><h2 class="jt-hz-header">Smarter Software, <span class="jt-hz-accent">Stronger Business.</span></h2><div class="jt-hz-carousel"><div class="jt-hz-viewport"><div class="jt-hz-track" id="jtHzTrack">'+hzCards+'</div></div></div><div class="jt-hz-controls"><button class="jt-hz-nav" id="jtHzPrev" type="button" aria-label="Previous"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12.756 18.495l1.989-1.99L8.239 10l6.505-6.506-1.989-1.989-7.499 7.5a1.409 1.409 0 000 1.99l7.5 7.5z"/></svg></button><button class="jt-hz-nav" id="jtHzNext" type="button" aria-label="Next"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M7.244 18.495l-1.989-1.99L11.761 10 5.256 3.494l1.989-1.989 7.5 7.5c.549.549.549 1.44 0 1.99l-7.5 7.5h-.001z"/></svg></button></div></div></section>';
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
      +hzSection
      +'<section class="jt-landing-section" id="jt-projects"><div class="jt-section-head"><div><p class="jt-eyebrow">SELECTED PROJECTS</p><h2>현장에서 검증된 프로젝트</h2></div><a href="/search">프로젝트 더 보기 →</a></div>'
      +'<div class="jt-projects" id="jtLandingProjects">'+card+card+card+card+'</div></section>'
      +'<section class="jt-landing-section jt-about" id="jt-about"><div class="jt-about-grid"><div><p class="jt-eyebrow">ABOUT JUST TECH</p><h2>현장을 이해하는<br>자동화 파트너</h2></div><div><p class="jt-about-copy">JUST TECH는 산업 자동화·로봇·설비 기술 자료를 기록하고 공유합니다. 실제 현장의 문제를 중심으로 설계, 제작, 적용 과정을 정리합니다.</p><a class="jt-about-link" href="/search">기술 자료 살펴보기 →</a></div></div></section>'
      +'<div class="jt-cta"><div><h2>다음 자동화 프로젝트를 함께 시작하세요</h2><p>설비·로봇·검사·포장 자동화 상담을 받아보세요.</p></div><a href="mailto:qwe6973@proton.me">문의하기</a></div>';
    body.insertBefore(landing,body.firstChild);
    initLandingReveal();
    requestAnimationFrame(function(){initFeatureCarousel();});
    if('requestIdleCallback' in window){requestIdleCallback(function(){loadLandingProjects();},{timeout:1600});}else{setTimeout(loadLandingProjects,700);}
  }
  function initLandingReveal(){
    var root=document.querySelector('.jt-landing');
    if(!root||root.__jtReveal)return;
    root.__jtReveal=1;
    if(!('IntersectionObserver' in window))return;
    var els=[].slice.call(root.querySelectorAll('.jt-landing-hero, .jt-landing-section, .jt-cta'));
    if(!els.length)return;
    root.classList.add('jt-reveal-ready');
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.08,rootMargin:'0px 0px -50px 0px'});
    els.forEach(function(el,i){
      el.classList.add('jt-reveal');
      el.style.transitionDelay=(i%4)*45+'ms';
      io.observe(el);
    });
  }
  function initTopHeroFrame(){
    var frame=document.querySelector('.jt-home-hero-frame');
    if(!frame||frame.__jtSrcReady)return;
    var src=frame.getAttribute('data-hero-src');
    if(!src)return;
    frame.__jtSrcReady=1;
    fetch(src,{credentials:'omit'}).then(function(r){
      if(!r.ok)throw 0;
      return r.text();
    }).then(function(html){
      if(html&&html.indexOf('<style')>=0){
        html=html.replace('</head>','<style>html,body{height:100%;overflow:hidden}.hero{min-height:100%!important;padding:12px 24px!important}.hero__inner{background:rgba(5,6,10,.54)!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:16px!important;padding:14px 24px!important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.hero__title{font-size:clamp(1.6rem,3vw,2.4rem)!important;margin-bottom:6px!important;text-shadow:0 2px 18px rgba(0,0,0,.65)!important}.hero__subtitle{font-size:clamp(.8rem,1.1vw,1rem)!important;line-height:1.45!important}</style></head>');
        frame.srcdoc=html;
      }
    })['catch'](function(){});
  }
  function initFeatureCarousel(){
    var track=document.getElementById('jtHzTrack');
    if(!track||track.__jtHzReady)return;
    track.__jtHzReady=1;
    var viewport=track.parentElement;
    var cards=Array.prototype.slice.call(track.children);
    var prev=document.getElementById('jtHzPrev');
    var next=document.getElementById('jtHzNext');
    if(!cards.length||!prev||!next)return;
    var index=0;
    function gapSize(){
      var cs=getComputedStyle(track);
      return parseFloat(cs.columnGap||cs.gap)||0;
    }
    function stepSize(){
      return cards[0].getBoundingClientRect().width+gapSize();
    }
    function visibleCount(){
      var vw=viewport.getBoundingClientRect().width;
      return Math.max(1,Math.round((vw+gapSize())/stepSize()));
    }
    function maxIndex(){
      return Math.max(0,cards.length-visibleCount());
    }
    function render(){
      index=Math.min(Math.max(index,0),maxIndex());
      track.style.transform='translateX('+(-index*stepSize())+'px)';
      prev.disabled=index===0;
      next.disabled=index>=maxIndex();
    }
    prev.addEventListener('click',function(){index--;render();});
    next.addEventListener('click',function(){index++;render();});
    var resizeTimer;
    window.addEventListener('resize',function(){
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(render,100);
    });
    render();
    function showThumbnail(video){
      if(!video||!isFinite(video.duration)||video.duration<=0)return;
      try{video.currentTime=video.duration*0.5;}catch(e){}
    }
    function initCardVideo(video){
      if(!video||video.__jtThumbReady)return;
      video.__jtThumbReady=1;
      video.addEventListener('loadedmetadata',function(){showThumbnail(video);});
      video.addEventListener('timeupdate',function(){
        if(!video.paused&&video.currentTime>0&&video.currentTime<0.5)video.currentTime=0.5;
      });
      if(video.readyState>=1)showThumbnail(video);
    }
    cards.forEach(function(card){
      var video=card.querySelector('.jt-hz-video');
      if(!video)return;
      initCardVideo(video);
      function playVideo(){
        try{video.currentTime=0.5;}catch(e){}
        video.muted=true;
        var p=video.play();
        if(p&&p.catch)p.catch(function(){});
      }
      function pauseVideo(){video.pause();showThumbnail(video);}
      card.addEventListener('mouseenter',playVideo);
      card.addEventListener('mouseleave',pauseVideo);
      card.addEventListener('focusin',playVideo);
      card.addEventListener('focusout',pauseVideo);
    });
  }
  function loadLandingProjects(){
    var grid=document.getElementById('jtLandingProjects');
    if(!grid)return;
    fetchHomeFeed(1,6).then(function(data){
      var entries=(data.feed&&data.feed.entry)||[];
      for(var i=0;i<entries.length&&i<4;i++){
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
      var fcards=document.querySelectorAll('.jt-feature-card');
      for(var j=0;j<fcards.length&&entries.length;j++){
        var fe=entries[(j+3)%entries.length];
        var fthumb=fe.media$thumbnail&&fe.media$thumbnail.url||'';
        if(fthumb){
          fthumb=fthumb.replace(/\/s\d+(-c)?\//,'/w600-h400-c/');
          var fimg=fcards[j].querySelector('img');
          if(fimg){
            fimg.style.display='block';
            fimg.onerror=function(){this.style.display='none';};
            fimg.src=fthumb;
          }
        }
      }
    })['catch'](function(){});
  }
    ready(function(){initHomeLanding();initHomeFooter();});
})();
