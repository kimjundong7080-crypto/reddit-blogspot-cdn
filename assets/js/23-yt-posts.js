/* Reddit-style Blogger YouTube post list — v1.2.19 */
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
    if(location.pathname==='/p/home.html')return;
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
      var categories=e.category||[];
      var hasCad=categories.some(function(category){
        return String(category.term||'').trim().toLowerCase()==='cad';
      });
      if(!hasCad)return null;
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

  window.__jtPrepareYouTubeShortcodes=function(source){
    var pattern=/\[youtube\s+link\s*=\s*["']([^"']+)["']\s*\]/gi;
    return String(source).replace(pattern,function(full,link){
      link=String(link||'').trim();
      var match=link.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
      if(!match)match=link.match(/^([A-Za-z0-9_-]{11})$/);
      var id=match?match[1]:'';
      return id?'\n<div class="jt-yt-embed" data-yt="'+id+'"></div>\n':full;
    });
  };

  (function(){
    if(window.__jtMarkdown)return; window.__jtMarkdown=1;
    var pending=[],markedLoading=false;
    function toText(html){
      html=html.replace(/<\s*br\s*\/?\s*>/gi,'\n')
        .replace(/<\s*\/\s*(p|div|h[1-6]|li|blockquote|tr|section|article)\s*>/gi,'\n')
        .replace(/<[^>]*>/g,'');
      var ta=document.createElement('textarea');
      ta.innerHTML=html;
      return ta.value.replace(/\r/g,'');
    }
    function appendHtml(container,html){
      var t=document.createElement('div');t.innerHTML=html||'';
      while(t.firstChild)container.appendChild(t.firstChild);
    }
    function buildFold(html){
      var fold=document.createElement('div');fold.className='ify-fold';
      var inner=document.createElement('div');inner.className='ify-fold-inner';inner.innerHTML=html||'';
      var imgs=inner.querySelectorAll('img');
      for(var i=0;i<imgs.length;i++){
        var im=imgs[i],src=im.getAttribute('src');
        if(src){im.setAttribute('data-src',src);im.removeAttribute('src');}
        im.setAttribute('loading','lazy');im.setAttribute('decoding','async');
      }
      fold.appendChild(inner);
      var more=document.createElement('div');more.className='ify-fold-more';
      var btn=document.createElement('button');btn.type='button';btn.className='ify-fold-btn';
      btn.setAttribute('aria-expanded','false');btn.textContent='더보기';
      btn.addEventListener('click',function(){
        var open=fold.className.indexOf('is-open')<0;
        fold.className=open?'ify-fold is-open':'ify-fold';
        btn.setAttribute('aria-expanded',open?'true':'false');
        btn.textContent=open?'접기':'더보기';
        if(open){
          var lazy=inner.querySelectorAll('img[data-src]');
          for(var k=0;k<lazy.length;k++){
            lazy[k].setAttribute('src',lazy[k].getAttribute('data-src'));
            lazy[k].removeAttribute('data-src');
          }
        }
      });
      more.appendChild(btn);fold.appendChild(more);
      return fold;
    }
    function renderInto(container,src){
      if(window.__jtPrepareYouTubeShortcodes)src=window.__jtPrepareYouTubeShortcodes(src);
      var re=/\[r[ea]de\]([\s\S]*?)\[\/r[ea]de\]/gi,last=0,m;
      container.innerHTML='';
      while((m=re.exec(src))!==null){
        if(m.index>last)appendHtml(container,window.marked.parse(src.slice(last,m.index)));
        container.appendChild(buildFold(window.marked.parse(m[1])));
        last=re.lastIndex;
      }
      if(last<src.length)appendHtml(container,window.marked.parse(src.slice(last)));
    }
    function addCopy(root){
      var pres=root.querySelectorAll('pre');
      for(var i=0;i<pres.length;i++)(function(pre){
        if(pre.getAttribute('data-copy'))return;
        pre.setAttribute('data-copy','1');
        var box=document.createElement('div');box.className='md-code';
        pre.parentNode.insertBefore(box,pre);box.appendChild(pre);
        var btn=document.createElement('button');btn.type='button';btn.className='md-copy';btn.textContent='복사';
        btn.addEventListener('click',function(){
          var text=pre.textContent;
          var done=function(){btn.textContent='복사됨';setTimeout(function(){btn.textContent='복사';},1500);};
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(text).then(done,function(){copyFallback(text,done);});
          }else copyFallback(text,done);
        });
        box.appendChild(btn);
      })(pres[i]);
    }
    function copyFallback(text,done){
      var ta=document.createElement('textarea');ta.value=text;
      ta.style.position='fixed';ta.style.top='-9999px';document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');if(done)done();}catch(e){}
      document.body.removeChild(ta);
    }
    function renderPending(){
      if(!pending.length)return;
      if(!(window.marked&&window.marked.parse)){
        if(markedLoading)return;
        markedLoading=true;
        var script=document.createElement('script');
        script.src='https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.async=true;
        script.onload=function(){markedLoading=false;renderPending();};
        script.onerror=function(){markedLoading=false;};
        document.body.appendChild(script);
        return;
      }
      var jobs=pending;pending=[];
      for(var k=0;k<jobs.length;k++){
        var job=jobs[k];
        if(job.wrap){
          var wrap=document.createElement('div');wrap.className='markdown';
          job.el.innerHTML='';job.el.classList.add('md-ready');job.el.appendChild(wrap);
          renderInto(wrap,job.src);addCopy(job.el);
        }else{
          renderInto(job.el,job.src);addCopy(job.el);
        }
      }
      if(window.__jtRunYouTubeShortcodes)window.__jtRunYouTubeShortcodes();
    }
    function scan(){
      var bodies=document.querySelectorAll('.post-body');
      for(var b=0;b<bodies.length;b++){
        var body=bodies[b];
        if(body.__jtMarkdownScanned)continue;
        body.__jtMarkdownScanned=true;
        var nodes=body.querySelectorAll('.markdown');
        if(nodes.length){
          for(var i=0;i<nodes.length;i++)pending.push({el:nodes[i],src:toText(nodes[i].innerHTML)});
          continue;
        }
        var text=toText(body.innerHTML),lines=text.split('\n'),idx=0;
        while(idx<lines.length&&lines[idx].trim()==='')idx++;
        if(idx<lines.length&&lines[idx].trim().toLowerCase()==='[md]'){
          lines.splice(0,idx+1);pending.push({el:body,src:lines.join('\n'),wrap:true});
        }else if(/\[r[ea]de\][\s\S]*?\[\/r[ea]de\]/i.test(text)){
          pending.push({el:body,src:text,wrap:true});
        }
      }
      renderPending();
    }
    ready(function(){
      scan();
      if(window.MutationObserver&&document.body){
        new MutationObserver(function(){
          scan();
          if(window.__jtRunYouTubeShortcodes)window.__jtRunYouTubeShortcodes();
        }).observe(document.body,{childList:true,subtree:true});
      }
    });
  })();

  (function(){
    if(window.__jtYouTube)return; window.__jtYouTube=1;
    function ytId(value){
      value=String(value||'').trim();
      var match=value.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
      if(match)return match[1];
      match=value.match(/^([A-Za-z0-9_-]{11})$/);
      return match?match[1]:'';
    }
    function startPlayback(box,id,observer){
      if(box.getAttribute('data-loaded')||!document.documentElement.contains(box))return;
      box.setAttribute('data-loaded','1');
      if(observer)observer.disconnect();
      box.__jtYtObserver=null;
      if(box.__jtYtFallback){
        window.removeEventListener('scroll',box.__jtYtFallback);
        window.removeEventListener('resize',box.__jtYtFallback);
        box.__jtYtFallback=null;
      }
      var frame=document.createElement('iframe');
      frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1';
      frame.title='YouTube video';
      frame.setAttribute('frameborder','0');
      frame.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      frame.setAttribute('allowfullscreen','');
      frame.setAttribute('loading','lazy');
      box.appendChild(frame);box.classList.add('ready');
    }
    function mount(box){
      var id=box.getAttribute('data-yt');
      if(!id||box.getAttribute('data-loaded')||box.__jtYtObserver||box.__jtYtTimer)return;
      function cancelTimer(){
        if(box.__jtYtTimer){clearTimeout(box.__jtYtTimer);box.__jtYtTimer=null;}
      }
      function schedule(observer){
        if(box.__jtYtTimer||box.getAttribute('data-loaded'))return;
        box.__jtYtTimer=setTimeout(function(){
          box.__jtYtTimer=null;
          var rect=box.getBoundingClientRect();
          var height=window.innerHeight||document.documentElement.clientHeight;
          var visible=rect.bottom>0&&rect.top<height&&rect.right>0&&rect.left<window.innerWidth;
          if(visible)startPlayback(box,id,observer);
        },500);
      }
      if('IntersectionObserver' in window){
        var observer=new IntersectionObserver(function(entries){
          for(var i=0;i<entries.length;i++){
            var entry=entries[i];
            if(entry.target!==box)continue;
            if(entry.isIntersecting&&entry.intersectionRatio>=0.25)schedule(observer);
            else cancelTimer();
          }
        },{threshold:0.25});
        box.__jtYtObserver=observer;
        observer.observe(box);
      }else{
        var check=function(){
          var rect=box.getBoundingClientRect();
          var height=window.innerHeight||document.documentElement.clientHeight;
          if(rect.bottom>0&&rect.top<height&&rect.right>0&&rect.left<window.innerWidth)schedule(null);
          else cancelTimer();
        };
        box.__jtYtFallback=check;
        window.addEventListener('scroll',check,{passive:true});
        window.addEventListener('resize',check);
        check();
      }
    }
    function run(){
      var bodies=document.querySelectorAll('.post-body');
      var paragraph=/<p>\s*\[youtube\s+link\s*=\s*["']([^"']+)["']\s*\]\s*<\/p>/gi;
      var shortcode=/\[youtube\s+link\s*=\s*["']([^"']+)["']\s*\]/gi;
      for(var b=0;b<bodies.length;b++){
        var body=bodies[b];
        if(body.getAttribute('data-yt-scanned')&&body.innerHTML.indexOf('[youtube')===-1)continue;
        var html=body.innerHTML,found=false;
        html=html.replace(paragraph,function(full,link){
          var id=ytId(link);if(!id)return full;
          found=true;return '<div class="jt-yt-embed" data-yt="'+id+'"></div>';
        });
        html=html.replace(shortcode,function(full,link){
          var id=ytId(link);if(!id)return full;
          found=true;return '<div class="jt-yt-embed" data-yt="'+id+'"></div>';
        });
        if(found){body.innerHTML=html;body.setAttribute('data-yt-scanned','1');}
      }
      var boxes=document.querySelectorAll('.jt-yt-embed');
      for(var i=0;i<boxes.length;i++)mount(boxes[i]);
    }
    window.__jtRunYouTubeShortcodes=run;
    ready(run);
    window.addEventListener('load',run);
    setTimeout(run,1200);
    if(window.MutationObserver&&document.body){
      new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
    }
  })();
})();
