/* Reddit-style Blogger YouTube post list — v1.2.83 */
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
  /* /search : 라벨 필터 + 번호 페이지네이션 */
  function initSearchApp(){
    var path=location.pathname;
    if(path!=='/search'&&path.indexOf('/search/label/')!==0)return;
    if(document.getElementById('jtSearchApp'))return;
    var anchor=document.querySelector('.blog-posts')||document.getElementById('blog-pager')||document.querySelector('.status-msg-body');
    if(!anchor||!anchor.parentNode)return;

    var app=el('div');app.id='jtSearchApp';
    var bar=el('div','jt-sp-bar');
    var status=el('p','jt-sp-status');
    var list=el('div','jt-sp-list');
    var pager=el('nav','jt-sp-pager');
    pager.setAttribute('aria-label','페이지 이동');
    app.appendChild(bar);app.appendChild(status);app.appendChild(list);app.appendChild(pager);
    anchor.parentNode.insertBefore(app,anchor);

    var qs=new URLSearchParams(location.search);
    var labelFromPath='';
    var lm=path.match(/^\/search\/label\/(.+)$/);
    if(lm){try{labelFromPath=decodeURIComponent(lm[1]);}catch(e){labelFromPath=lm[1];}}
    var state={
      q:(qs.get('q')||'').trim(),
      label:(labelFromPath||qs.get('label')||'').trim(),
      page:parseInt(qs.get('page'),10)||1,
      per:20
    };

    function plain(s){
      return String(s||'')
        .replace(/<style[\s\S]*?<\/style>/gi,' ')
        .replace(/<script[\s\S]*?<\/script>/gi,' ')
        .replace(/<[^>]*>/g,' ')
        .replace(/&nbsp;/gi,' ')
        .replace(/&amp;/gi,'&')
        .replace(/&lt;/gi,'<')
        .replace(/&gt;/gi,'>')
        .replace(/&quot;/gi,'"')
        .replace(/&#0?39;/g,"'")
        .replace(/\s+/g,' ')
        .trim();
    }
    function cut(s,n){return s.length>n?s.slice(0,n-1).trim()+'…':s;}
    function bigThumb(u){
      if(!u)return '';
      return https(u).replace(/\/s\d+(-c)?\//,'/w400-h225-c/').replace(/=s\d+(-c)?$/,'=w400-h225-c');
    }
    function normalize(e){
      var links=e.link||[],href='';
      for(var i=0;i<links.length;i++){if(links[i].rel==='alternate'){href=https(links[i].href);break;}}
      if(!href)return null;
      var cats=[];
      (e.category||[]).forEach(function(c){
        var t=String(c.term||'').trim();
        if(t&&cats.indexOf(t)===-1)cats.push(t);
      });
      return {
        href:href,
        title:plain(e.title&&e.title.$t)||'게시물',
        snip:cut(plain(e.summary&&e.summary.$t),140),
        cats:cats,
        date:dateText(e.published&&e.published.$t),
        thumb:bigThumb((e.media$thumbnail&&e.media$thumbnail.url)||'')
      };
    }

    var all=[],labelMap={};
    function matches(p){
      if(state.label){
        var want=state.label.toLowerCase(),hit=false;
        for(var i=0;i<p.cats.length;i++){if(p.cats[i].toLowerCase()===want){hit=true;break;}}
        if(!hit)return false;
      }
      if(state.q){
        var q=state.q.toLowerCase();
        if((p.title+' '+p.snip+' '+p.cats.join(' ')).toLowerCase().indexOf(q)===-1)return false;
      }
      return true;
    }
    function syncUrl(){
      var ps=[];
      if(state.q)ps.push('q='+encodeURIComponent(state.q));
      if(state.label)ps.push('label='+encodeURIComponent(state.label));
      if(state.page>1)ps.push('page='+state.page);
      try{history.replaceState(null,'','/search'+(ps.length?'?'+ps.join('&'):''));}catch(e){}
    }
    function go(p){
      state.page=p;
      render();
      syncUrl();
      try{app.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){window.scrollTo(0,app.offsetTop-16);}
    }
    function pageNumbers(cur,total){
      var out=[],win=5,i;
      if(total<=win+2){
        for(i=1;i<=total;i++)out.push(i);
        return out;
      }
      var start=Math.max(1,cur-2),end=Math.min(total,start+win-1);
      start=Math.max(1,end-win+1);
      if(start>1){out.push(1);if(start>2)out.push('…');}
      for(i=start;i<=end;i++)out.push(i);
      if(end<total){if(end<total-1)out.push('…');out.push(total);}
      return out;
    }
    function makeItem(p){
      var a=el('a','jt-sp-item');
      a.href=p.href;
      if(p.thumb){
        var box=el('span','jt-sp-thumb');
        var img=el('img');
        img.alt='';
        img.loading='lazy';
        img.decoding='async';
        img.onerror=function(){box.classList.add('is-empty');};
        img.src=p.thumb;
        box.appendChild(img);
        a.appendChild(box);
      }
      var body=el('span','jt-sp-body');
      body.appendChild(el('span','jt-sp-title',p.title));
      if(p.snip)body.appendChild(el('span','jt-sp-snip',p.snip));
      var meta=[p.date].concat(p.cats.slice(0,2)).filter(Boolean).join(' · ');
      if(meta)body.appendChild(el('span','jt-sp-meta',meta));
      a.appendChild(body);
      return a;
    }
    function renderChips(){
      bar.innerHTML='';
      var arr=[];
      for(var k in labelMap){if(labelMap.hasOwnProperty(k))arr.push(labelMap[k]);}
      arr.sort(function(a,b){return b.count-a.count;});
      var chips=[{name:'',label:'전체',count:all.length}];
      arr.forEach(function(o){chips.push(o);});
      chips.forEach(function(c){
        var b=el('button','jt-sp-chip');
        b.type='button';
        b.appendChild(document.createTextNode(c.label));
        b.appendChild(el('small',null,String(c.count)));
        var on=(state.label||'').toLowerCase()===(c.name||'').toLowerCase();
        if(on)b.classList.add('is-on');
        b.setAttribute('aria-pressed',on?'true':'false');
        b.addEventListener('click',function(){
          state.label=c.name;
          state.page=1;
          renderChips();
          render();
          syncUrl();
        });
        bar.appendChild(b);
      });
    }
    function renderPager(total){
      pager.innerHTML='';
      function addBtn(text,disabled,current,onClick,aria){
        var b=el('button','jt-sp-pg',text);
        b.type='button';
        if(disabled)b.disabled=true;
        if(current){b.classList.add('is-on');b.setAttribute('aria-current','page');}
        if(aria)b.setAttribute('aria-label',aria);
        if(onClick&&!disabled&&!current)b.addEventListener('click',onClick);
        pager.appendChild(b);
      }
      addBtn('이전',state.page<=1,false,function(){go(state.page-1);},'이전 페이지');
      pageNumbers(state.page,total).forEach(function(n){
        if(n==='…'){pager.appendChild(el('span','jt-sp-gap','…'));return;}
        addBtn(String(n),false,n===state.page,function(){go(n);},n+' 페이지');
      });
      addBtn('다음',state.page>=total,false,function(){go(state.page+1);},'다음 페이지');
    }
    function render(){
      var filtered=all.filter(matches);
      var total=Math.max(1,Math.ceil(filtered.length/state.per));
      if(state.page>total)state.page=total;
      if(state.page<1)state.page=1;
      var from=(state.page-1)*state.per;
      var slice=filtered.slice(from,from+state.per);
      list.innerHTML='';
      if(!slice.length){
        list.appendChild(el('p','jt-sp-empty',state.q?('"'+state.q+'" 검색 결과가 없습니다.'):'표시할 글이 없습니다.'));
      }else{
        slice.forEach(function(p){list.appendChild(makeItem(p));});
      }
      var st='총 '+filtered.length+'개의 글';
      if(state.label)st+=' · '+state.label;
      if(state.q)st+=' · "'+state.q+'"';
      status.textContent=st;
      renderPager(total);
    }

    fetch('/feeds/posts/summary?alt=json&max-results=150',{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      ['catch'](function(){
        return fetch('https://reddit-blogspot-edge.pages.dev/api/blogger-feed?max=150')
          .then(function(r){if(!r.ok)throw 0;return r.json();});
      })
      .then(function(data){
        var entries=(data.feed&&data.feed.entry)||[];
        all=entries.map(normalize).filter(Boolean);
        all.forEach(function(p){
          p.cats.forEach(function(c){
            var k=c.toLowerCase();
            if(!labelMap[k])labelMap[k]={name:c,label:c,count:0};
            labelMap[k].count++;
          });
        });
        document.documentElement.classList.add('jt-search-app');
        renderChips();
        render();
      })
      ['catch'](function(){
        status.textContent='목록을 불러오지 못했습니다. 아래 기본 목록을 이용해 주세요.';
      });
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
    initSearchApp();
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
      var ytSource=(e.content&&e.content.$t)||(e.summary&&e.summary.$t)||(e.title&&e.title.$t)||'';
      var ytMatch=ytSource.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/i);
      var ytId=ytMatch?ytMatch[1]:((ytSource.match(/\[youtube\s+link\s*=\s*["']([^"']+)["']/i)||[])[1]||'');
      if(ytId){
        var ytLink=ytId;
        var linkIdMatch=ytLink.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
        ytId=linkIdMatch?linkIdMatch[1]:(/^[A-Za-z0-9_-]{11}$/.test(ytLink)?ytLink:'');
      }
      if(!hasCad&&!ytId)return null;
      var links=e.link||[],href='';
      for(var k=0;k<links.length;k++){if(links[k].rel==='alternate'){href=https(links[k].href);break;}}
      if(!href||seen[href])return null;
      seen[href]=1;
      var cat=(e.category&&e.category[0]&&e.category[0].term)||'';
      var title=(e.title&&e.title.$t||'').trim()||cat||'게시물';
      var date=dateText(e.published&&e.published.$t);
      var thumb=ytId?'https://i.ytimg.com/vi/'+ytId+'/default.jpg':thumbUrl(e.media$thumbnail&&e.media$thumbnail.url||'');

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
        if(ytId){
          a.addEventListener('mouseenter',function(){
            if(a.classList.contains('is-yt-hover'))return;
            a.classList.add('is-yt-hover');
            var frame=document.createElement('iframe');
            frame.src='https://www.youtube-nocookie.com/embed/'+ytId+'?autoplay=1&mute=1&loop=1&playlist='+ytId+'&controls=0&modestbranding=1&rel=0&playsinline=1';
            frame.title=title+' 무음 미리보기';
            frame.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
            frame.setAttribute('allowfullscreen','');
            frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
            box.appendChild(frame);
          });
          a.addEventListener('mouseleave',function(){
            a.classList.remove('is-yt-hover');
            var frames=box.querySelectorAll('iframe');
            for(var fi=0;fi<frames.length;fi++)frames[fi].remove();
          });
        }
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
    var activePlaybackBox=null;
    function ytId(value){
      value=String(value||'').trim();
      var match=value.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
      if(match)return match[1];
      match=value.match(/^([A-Za-z0-9_-]{11})$/);
      return match?match[1]:'';
    }
    function stopPlayback(box){
      if(!box)return;
      box.removeAttribute('data-loaded');
      box.classList.remove('ready');
      var frames=box.querySelectorAll('iframe');
      for(var i=0;i<frames.length;i++)frames[i].remove();
    }
    function startPlayback(box,id,observer){
      if(box.getAttribute('data-loaded')||!document.documentElement.contains(box))return;
      if(activePlaybackBox&&activePlaybackBox!==box)stopPlayback(activePlaybackBox);
      activePlaybackBox=box;
      box.setAttribute('data-loaded','1');
      if(observer)observer.disconnect();
      box.__jtYtObserver=null;
      var frame=document.createElement('iframe');
      frame.className='jt-yt-frame';
      frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&loop=1&playlist='+id+'&playsinline=1&rel=0&modestbranding=1';
      frame.title='YouTube video';
      frame.setAttribute('frameborder','0');
      frame.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      frame.setAttribute('allowfullscreen','');
      frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
      frame.setAttribute('loading','lazy');
      frame.onload=function(){
        box.classList.add('ready');
      };
      box.appendChild(frame);
    }
    function mount(box){
      var id=box.getAttribute('data-yt');
      if(!id)return;
      var loaded=box.getAttribute('data-loaded');
      if(box.__jtYtMounted)return;
      if(loaded){
        box.removeAttribute('data-loaded');
        box.classList.remove('ready');
        var oldFrames=box.querySelectorAll('iframe');
        for(var fi=0;fi<oldFrames.length;fi++)oldFrames[fi].remove();
      }
      box.__jtYtMounted=1;
      var thumb=document.createElement('img');
      thumb.className='jt-yt-thumb';
      var thumbSources=[
        'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg',
        'https://i.ytimg.com/vi/'+id+'/sddefault.jpg',
        'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'
      ];
      var thumbSourceIndex=0;
      thumb.src=thumbSources[thumbSourceIndex];
      thumb.alt='YouTube 동영상 썸네일';
      thumb.loading='lazy';
      thumb.decoding='async';
      thumb.referrerPolicy='no-referrer';
      /* maxres가 없는 영상은 120×90 회색 이미지가 200으로 오므로 크기로 판별해 다음 해상도로 넘어간다. */
      thumb.onload=function(){
        if(thumbSourceIndex<thumbSources.length-1&&thumb.naturalWidth<=120){
          thumbSourceIndex++;
          thumb.src=thumbSources[thumbSourceIndex];
        }
      };
      thumb.onerror=function(){
        thumbSourceIndex++;
        if(thumbSourceIndex<thumbSources.length)thumb.src=thumbSources[thumbSourceIndex];
        else thumb.style.display='none';
      };
      var play=document.createElement('button');
      play.type='button';
      play.className='jt-yt-play';
      play.setAttribute('aria-label','YouTube 동영상 재생');
      play.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      play.addEventListener('click',function(){startPlayback(box,id,null);});
      box.appendChild(thumb);
      box.appendChild(play);
      /* 단일 글에서도 자동재생하지 않고 포스터+재생 버튼을 유지한다.
         자동재생이 차단되는 브라우저에서 검은 화면/멈춤으로 보이던 문제를 없앤다. */
    }
    /* 숏코드가 제목(h1~h6)처럼 잘림(clamp) 스타일 안에 들어간 경우 임베드를 밖으로 꺼낸다 */
    function unclipEmbed(box){
      var h=box.parentNode;
      while(h&&h!==document.body){
        if(h.classList&&h.classList.contains('post-body'))return;
        if(/^(H1|H2|H3|H4|H5|H6)$/.test(h.tagName))break;
        h=h.parentNode;
      }
      if(!h||h===document.body)return;
      if(!h.textContent.replace(/\s+/g,'')){
        h.parentNode.insertBefore(box,h);
        h.parentNode.removeChild(h);
        return;
      }
      h.style.setProperty('max-height','none','important');
      h.style.setProperty('overflow','visible','important');
      h.style.setProperty('-webkit-line-clamp','unset','important');
      h.style.setProperty('display','block','important');
    }
    function run(){
      var bodies=document.querySelectorAll('.post-body');
      var paragraph=/<p>\s*\[youtube\s+link\s*=\s*["']([^"']+)["']\s*\]\s*<\/p>/gi;
      /* 제목/스팬 등 태그로 감싸진 숏코드도 처리: 대괄호 전체를 잡은 뒤 태그를 제거해 ID 추출 */
      var shortcode=/\[youtube[^\]]{0,400}\]/gi;
      for(var b=0;b<bodies.length;b++){
        var body=bodies[b];
        /* 홈 랜딩(.jt-landing)은 위젯이 만든 UI이므로 숏코드 치환 대상에서 제외한다.
           제목 데이터에 남은 [youtube ...] 문자열을 숏코드로 오인해 innerHTML을
           다시 쓰면 랜딩 DOM이 재생성되어 공개(reveal) 옵저버가 끊긴다. */
        if(body.querySelector('.jt-landing'))continue;
        if(body.getAttribute('data-yt-scanned')&&body.innerHTML.indexOf('[youtube')===-1)continue;
        var html=body.innerHTML,found=false;
        html=html.replace(paragraph,function(full,link){
          var id=ytId(link);if(!id)return full;
          found=true;return '<div class="jt-yt-embed" data-yt="'+id+'"></div>';
        });
        html=html.replace(shortcode,function(full){
          var plainText=full.replace(/<[^>]*>/g,' ');
          var lm=plainText.match(/link\s*=\s*["']([^"']+)["']/i)||plainText.match(/https?:\/\/[^\s"'<\]]+/i);
          var id=lm?ytId(lm[1]||lm[0]):'';
          if(!id)return full;
          found=true;return '<div class="jt-yt-embed" data-yt="'+id+'"></div>';
        });
        if(found){
          body.innerHTML=html;
          body.setAttribute('data-yt-scanned','1');
          var em=body.querySelectorAll('.jt-yt-embed');
          for(var e2=0;e2<em.length;e2++)unclipEmbed(em[e2]);
        }
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

  (function(){
    if(window.__jtSeo)return; window.__jtSeo=1;
    var ORIGIN='https://www.techlifeworld.com';
    var SITE='JUST TECH';
    var HOME_TITLE='JUST TECH | 산업 자동화·로봇·설비 기술 아카이브';
    var HOME_DESC='로봇·조립·검사·포장 설비까지 산업 자동화 현장의 설계·제작·적용 사례와 기술 자료를 정리한 JUST TECH 블로그입니다.';
    var FALLBACK_DESC='산업 자동화·로봇·설비 기술 자료를 기록하는 JUST TECH 블로그입니다.';
    if(/\.blogspot\.com$/i.test(location.hostname)){
      var bsTarget=ORIGIN+location.pathname+location.search;
      var bsCanonical=document.querySelector('link[rel="canonical"]');
      if(bsCanonical)bsCanonical.setAttribute('href',bsTarget);
      else{var bsLink=document.createElement('link');bsLink.rel='canonical';bsLink.href=bsTarget;(document.head||document.getElementsByTagName('head')[0]).appendChild(bsLink);}
      var bsRobots=document.querySelector('meta[name="robots"]');
      if(!bsRobots){bsRobots=document.createElement('meta');bsRobots.setAttribute('name','robots');(document.head||document.getElementsByTagName('head')[0]).appendChild(bsRobots);}
      bsRobots.setAttribute('content','noindex, nofollow');
      location.replace(bsTarget);
      return;
    }
    function head(){return document.head||document.getElementsByTagName('head')[0];}
    /* 파비콘: 테마 XML을 수정할 수 없으므로 head에 직접 주입한다. */
    (function(){
      var base='https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/img/';
      var old=head().querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]');
      for(var i=0;i<old.length;i++)if(old[i].parentNode)old[i].parentNode.removeChild(old[i]);
      function add(rel,type,file,sizes){
        var l=document.createElement('link');
        l.rel=rel;if(type)l.type=type;l.href=base+file;if(sizes)l.sizes=sizes;
        head().appendChild(l);
      }
      add('icon','image/svg+xml','favicon.svg','any');
      add('icon','image/png','favicon-32.png','32x32');
      add('icon','image/png','favicon-16.png','16x16');
      add('icon','image/x-icon','favicon.ico','16x16 32x32 48x48');
      add('apple-touch-icon','image/png','apple-touch-icon.png','180x180');
      var tc=head().querySelector('meta[name="theme-color"]');
      if(!tc){tc=document.createElement('meta');tc.setAttribute('name','theme-color');head().appendChild(tc);}
      if(!tc.getAttribute('content'))tc.setAttribute('content','#1f7a5c');
    })();
    function fillMeta(attr,key,value){
      if(!value)return;
      var m=head().querySelector('meta['+attr+'="'+key+'"]');
      if(!m){m=document.createElement('meta');m.setAttribute(attr,key);head().appendChild(m);}
      if(!(m.getAttribute('content')||'').trim())m.setAttribute('content',value);
    }
    function setMeta(attr,key,value){
      if(!value)return;
      var m=head().querySelector('meta['+attr+'="'+key+'"]');
      if(!m){m=document.createElement('meta');m.setAttribute(attr,key);head().appendChild(m);}
      m.setAttribute('content',value);
    }
    function clean(s){
      return String(s||'')
        .replace(/<[^>]*>/g,' ')
        .replace(/&nbsp;|&#160;/gi,' ')
        .replace(/&amp;/gi,'&')
        .replace(/&lt;/gi,'<')
        .replace(/&gt;/gi,'>')
        .replace(/&quot;/gi,'"')
        .replace(/&#39;/gi,"'")
        .replace(/\[(?:\/)?(?:md|rede|rade)\]/gi,' ')
        .replace(/\[youtube[^\]]*\]/gi,' ')
        .replace(/```[\s\S]*?```/g,' ')
        .replace(/\s+/g,' ')
        .trim();
    }
    function cut(s,max){
      s=clean(s);
      if(s.length<=max)return s;
      var t=s.slice(0,max),i=Math.max(t.lastIndexOf('다.'),t.lastIndexOf('. '));
      if(i<max*0.55)i=t.lastIndexOf(' ');
      if(i>max*0.55)t=t.slice(0,i);
      return t.replace(/[\s,·]+$/,'')+'.';
    }
    function bodyText(){
      var b=document.querySelector('.post-body');
      if(!b)return '';
      var c=b.cloneNode(true),drop=c.querySelectorAll('script,style,iframe,.jt-yt-embed,.ify-fold-more,.jt-landing');
      for(var i=0;i<drop.length;i++)if(drop[i].parentNode)drop[i].parentNode.removeChild(drop[i]);
      return c.textContent||'';
    }
    function ogImage(){
      var m=head().querySelector('meta[property="og:image"]'),u=m&&(m.getAttribute('content')||'');
      if(u)return u;
      var yt=document.querySelector('.jt-yt-embed[data-yt]');
      var id=yt&&yt.getAttribute('data-yt');
      if(!id){
        var fr=document.querySelector('.post-body iframe[src*="youtube"]');
        var mm=fr&&fr.src.match(/(?:embed\/|v=)([A-Za-z0-9_-]{11})/);
        id=mm&&mm[1];
      }
      if(id)return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';
      var img=document.querySelector('.post-body img, .jt-project-media img');
      return img&&img.src?img.src:ORIGIN+'/favicon.ico';
    }
    function putLd(id,data){
      var el=document.getElementById(id);
      if(!el){el=document.createElement('script');el.type='application/ld+json';el.id=id;head().appendChild(el);}
      el.textContent=JSON.stringify(data);
    }
    var isHome=location.pathname==='/p/home.html'||location.pathname==='/';
    var isSearchPage=location.pathname==='/search';
    var isArchivePage=/^\/\d{4}\/\d{2}\/?$/.test(location.pathname);
    /* 정적 페이지(/p/*.html)는 posts 피드에 없으므로
       item-view 로 취급하지 않는다. (불필요한 feeds/posts 404 방지) */
    var isStaticPage=!!(document.documentElement&&document.documentElement.classList.contains('jt-static-page'))
      ||(/^\/p\/[^/]+\.html$/.test(location.pathname)&&location.pathname!=='/p/home.html');
    var isItem=!!(document.body&&document.body.classList.contains('item-view'))&&!isStaticPage;
    var rawTitle=(document.title||'').replace(/\s+/g,' ').trim();
    var headline=rawTitle.replace(/\s*\|\s*JUST TECH$/,'')||SITE;
    if(isHome){
      document.title=HOME_TITLE;
    }else if(isSearchPage){
      document.title='검색 | '+SITE;
    }else if(isArchivePage){
      var am=location.pathname.match(/(\d{4})\/(\d{2})/);
      document.title=(am?am[1]+'년 '+parseInt(am[2],10)+'월 아카이브':'아카이브')+' | '+SITE;
    }else if((isItem||isStaticPage)&&rawTitle&&rawTitle.indexOf(SITE)<0){
      document.title=rawTitle+' | '+SITE;
    }
    if(!head().querySelector('meta[name="robots"]')){
      if(isSearchPage||isArchivePage)fillMeta('name','robots','noindex, follow');
    }
    if(!head().querySelector('meta[name="robots"]')&&(isItem||isHome)){
      fillMeta('name','robots','index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
    fillMeta('property','og:site_name',SITE);
    fillMeta('property','og:locale','ko_KR');
    fillMeta('name','twitter:card','summary_large_image');
    if(isHome){
      document.title=HOME_TITLE;
      setMeta('name','description',HOME_DESC);
      setMeta('property','og:description',HOME_DESC);
      fillMeta('property','og:type','website');
      fillMeta('name','twitter:title',HOME_TITLE);
      setMeta('name','twitter:description',HOME_DESC);
      setMeta('property','og:title',HOME_TITLE);
      var homeImage='https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/img/home/poster-1.jpg';
      if(!head().querySelector('meta[property="og:image"]'))setMeta('property','og:image',homeImage);
      if(!head().querySelector('meta[name="twitter:image"]'))setMeta('name','twitter:image',homeImage);
      putLd('jt-ld-website',{'@context':'https://schema.org','@graph':[
        {'@type':'WebSite','@id':ORIGIN+'/#website','url':ORIGIN+'/p/home.html','name':SITE,
          'alternateName':'테크라이프월드','description':HOME_DESC,'inLanguage':'ko',
          'publisher':{'@id':ORIGIN+'/#organization'},
          'potentialAction':{'@type':'SearchAction',
            'target':{'@type':'EntryPoint','urlTemplate':ORIGIN+'/search?q={search_term_string}'},
            'query-input':'required name=search_term_string'}},
        {'@type':'Organization','@id':ORIGIN+'/#organization','name':SITE,'url':ORIGIN+'/p/home.html',
          'description':FALLBACK_DESC}
      ]});
    }else if(isItem){
      var canonical=(document.querySelector('link[rel=canonical]')||{}).href||(ORIGIN+location.pathname);
      var initialDesc=cut(bodyText(),150)||(headline+' 관련 산업 자동화 기술 자료와 적용 사례를 정리한 JUST TECH 글입니다.');
      setMeta('name','description',initialDesc);
      setMeta('property','og:description',initialDesc);
      setMeta('name','twitter:description',initialDesc);
      fillMeta('property','og:type','article');
      fillMeta('name','twitter:title',headline);
      if(!head().querySelector('meta[property="og:image"]'))setMeta('property','og:image',ogImage());
      if(!head().querySelector('meta[name="twitter:image"]'))setMeta('name','twitter:image',ogImage());
      function renderArticle(extra){
        extra=extra||{};
        var desc=extra.desc||initialDesc;
        var graph=[{
          '@type':'BlogPosting','@id':canonical+'#article',
          'mainEntityOfPage':{'@type':'WebPage','@id':canonical},
          'headline':headline,'description':desc,'image':[ogImage()],'inLanguage':'ko',
          'author':{'@type':'Organization','name':SITE,'url':ORIGIN+'/p/home.html'},
          'publisher':{'@type':'Organization','name':SITE,'url':ORIGIN+'/p/home.html'},
          'isPartOf':{'@type':'Blog','name':SITE,'url':ORIGIN+'/p/home.html'}
        }];
        if(extra.published)graph[0].datePublished=extra.published;
        if(extra.updated)graph[0].dateModified=extra.updated;
        if(extra.section)graph[0].articleSection=extra.section;
        graph.push({'@type':'BreadcrumbList','itemListElement':[
          {'@type':'ListItem','position':1,'name':'홈','item':ORIGIN+'/p/home.html'},
          {'@type':'ListItem','position':2,'name':headline,'item':canonical}
        ]});
        putLd('jt-ld-article',{'@context':'https://schema.org','@graph':graph});
      }
      renderArticle({});
      var postPath=location.pathname;
      try{postPath=decodeURIComponent(postPath);}catch(e){}
      fetch('/feeds/posts/default?alt=json&path='+encodeURIComponent(postPath),{credentials:'same-origin'})
        .then(function(r){return r.ok?r.json():null;})
        .then(function(j){
          var e=j&&j.feed&&j.feed.entry&&j.feed.entry[0];
          if(!e)return;
          var cats=(e.category||[]).map(function(c){return c.term;}).filter(Boolean);
          var desc=cut(e.summary&&e.summary.$t,150)||initialDesc;
          setMeta('name','description',desc);
          setMeta('property','og:description',desc);
          setMeta('name','twitter:description',desc);
          renderArticle({
            published:e.published&&e.published.$t,
            updated:e.updated&&e.updated.$t,
            desc:desc,
            section:cats[0]||''
          });
        })['catch'](function(){});
    }else{
      var path=location.pathname;
      var pageTitle=document.title||SITE;
      var pageDesc=path==='/p/about.html'
        ? 'JUST TECH의 산업 자동화·로봇·생산설비 설계/제작 경험과 기술 아카이브를 소개합니다.'
        : (path==='/p/contact-us.html'||path==='/p/contact.html')
          ? '산업 자동화·로봇·조립·검사·포장 설비의 설계와 제작 상담 안내입니다.'
          : FALLBACK_DESC;
      setMeta('name','description',pageDesc);
      setMeta('property','og:description',pageDesc);
      setMeta('name','twitter:description',pageDesc);
      setMeta('property','og:title',pageTitle);
      fillMeta('name','twitter:title',pageTitle);
      fillMeta('property','og:type','website');
      var fallbackImage='https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/img/home/poster-1.jpg';
      if(!head().querySelector('meta[property="og:image"]'))setMeta('property','og:image',fallbackImage);
      if(!head().querySelector('meta[name="twitter:image"]'))setMeta('name','twitter:image',fallbackImage);
      if(isStaticPage&&!head().querySelector('meta[name="robots"]')){
        var privatePage=path==='/p/resume.html'||path==='/p/contact-us.html'||path==='/p/contact.html';
        setMeta('name','robots',privatePage?'noindex, follow':'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }
    }
  })();

  (function(){
    if(window.__jtStaticPage)return; window.__jtStaticPage=1;
    var PAGES={
      '/p/resume.html':{file:'pages/resume.html',title:'이력서 | JUST TECH',label:'이력서',frame:'이력서',resume:true},
      '/p/contact-us.html':{file:'pages/contact.html',title:'Contact | JUST TECH',label:'문의',frame:'문의 페이지',css:'html,body{min-height:0 !important;height:auto !important}body{align-items:flex-start !important;padding:24px !important}'},
      '/p/contact.html':{file:'pages/contact.html',title:'Contact | JUST TECH',label:'문의',frame:'문의 페이지',css:'html,body{min-height:0 !important;height:auto !important}body{align-items:flex-start !important;padding:24px !important}'}
    };
    var page=PAGES[location.pathname];
    if(!page||!window.fetch)return;
    var BASE='https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/';
    var RAW='https://raw.githubusercontent.com/kimjundong7080-crypto/reddit-blogspot-cdn/main/';
    var FILE_URL=BASE+page.file;
    function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}
    function staticHost(){
      var el=document.getElementById('jtStaticHost');
      if(!el){
        el=document.createElement('div');
        el.id='jtStaticHost';
        var area=document.getElementById('page_body')||document.querySelector('.main_content_container')||document.body;
        area.insertBefore(el,area.firstChild);
      }
      return el;
    }
    function mount(html){
      var box=staticHost();
      if(page.css)html=html.indexOf('</head>')>=0?html.replace('</head>','<style>'+page.css+'</style></head>'):('<style>'+page.css+'</style>'+html);
      var frame=document.createElement('iframe');
      frame.setAttribute('title',page.frame);
      frame.setAttribute('scrolling','no');
      frame.style.height='1200px';
      frame.srcdoc=html;
      frame.addEventListener('load',function(){
        function fit(){
          try{
            var doc=frame.contentDocument;
            if(!doc)return;
            var body=doc.body;
            var h=body?body.getBoundingClientRect().height:0;
            if(!h||h<200)h=doc.documentElement.scrollHeight;
            if(h>200)frame.style.height=(h+8)+'px';
          }catch(e){}
        }
        fit();setTimeout(fit,400);setTimeout(fit,1400);
        try{frame.contentWindow.addEventListener('resize',fit);}catch(e){}
      });
      box.appendChild(frame);
    }
    ready(function(){
      if(document.querySelector('.post-body.entry-content'))return;
      if(!document.querySelector('.status-msg-body'))return;
      document.documentElement.classList.add('jt-static-page');
      if(page.resume)document.documentElement.classList.add('jt-resume-page');
      document.title=page.title;
      if(!document.querySelector('meta[name="robots"]')){
        var rb=document.createElement('meta');rb.setAttribute('name','robots');rb.setAttribute('content','noindex, follow');
        (document.head||document.getElementsByTagName('head')[0]).appendChild(rb);
      }
      fetch(FILE_URL,{cache:'no-cache'})
        .then(function(r){if(!r.ok)throw 0;return r.text();})
        ['catch'](function(){return fetch(RAW+page.file).then(function(r){if(!r.ok)throw 0;return r.text();});})
        .then(mount)
        ['catch'](function(){
          staticHost().innerHTML='<p style="padding:32px;text-align:center">'+page.label+' 페이지를 불러오지 못했습니다. <a href="'+FILE_URL+'">원본 열기</a></p>';
        });
    });
  })();
})();

  /* 404: 기본 Blogger 안내 대신 홈/검색/최근 글로 안내한다. */
  (function(){
    if(window.__jt404)return; window.__jt404=1;
    if(!document.querySelector('.status-msg-body'))return;
    var path=location.pathname;
    if(path==='/search'||path.indexOf('/search/label/')===0)return;
    if(path==='/p/home.html'||path==='/')return;
    if(path==='/p/resume.html'||path==='/p/contact-us.html'||path==='/p/contact.html')return;
    function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}
    function head(){return document.head||document.getElementsByTagName('head')[0];}
    function setMeta(attr,key,value){
      var m=head().querySelector('meta['+attr+'="'+key+'"]');
      if(!m){m=document.createElement('meta');m.setAttribute(attr,key);head().appendChild(m);}
      m.setAttribute('content',value);
    }
    ready(function(){
      var box=document.querySelector('.status-msg-body');
      if(!box)return;
      box.innerHTML='<div class="jt-404">'
        +'<p class="jt-404-code">404</p>'
        +'<h1>페이지를 찾을 수 없습니다</h1>'
        +'<p>주소가 변경되었거나 삭제된 페이지입니다. 아래에서 원하는 글을 찾아보세요.</p>'
        +'<div class="jt-404-actions"><a class="jt-404-btn primary" href="/p/home.html">홈으로</a><a class="jt-404-btn" href="/search">글 검색</a></div>'
        +'<ul class="jt-404-recent" aria-label="최근 글"></ul>'
        +'</div>';
      var title='페이지를 찾을 수 없음 | JUST TECH';
      document.title=title;
      setMeta('property','og:title',title);
      setMeta('name','twitter:title',title);
      setMeta('name','description','요청한 페이지를 찾을 수 없습니다. JUST TECH 홈이나 검색에서 원하는 글을 찾아보세요.');
      setMeta('property','og:description','요청한 페이지를 찾을 수 없습니다. JUST TECH 홈이나 검색에서 원하는 글을 찾아보세요.');
      setMeta('name','robots','noindex, follow');
      var ul=box.querySelector('.jt-404-recent');
      if(!ul)return;
      fetch('/feeds/posts/default?alt=json&max-results=6',{credentials:'same-origin'})
        .then(function(r){return r.ok?r.json():null;})
        .then(function(j){
          var entries=(j&&j.feed&&j.feed.entry)||[],shown=0;
          for(var i=0;i<entries.length&&shown<3;i++){
            var e=entries[i],title=(e.title&&e.title.$t||'').replace(/\s+/g,' ').trim();
            if(!title||/\[youtube/i.test(title))continue;
            var href='',links=e.link||[];
            for(var k=0;k<links.length;k++){if(links[k].rel==='alternate'){href=links[k].href;break;}}
            if(!href)continue;
            var li=document.createElement('li'),a=document.createElement('a');
            a.href=href;a.textContent=title;li.appendChild(a);ul.appendChild(li);shown++;
          }
          if(!shown)ul.style.display='none';
        })
        ['catch'](function(){ul.style.display='none';});
    });
  })();
