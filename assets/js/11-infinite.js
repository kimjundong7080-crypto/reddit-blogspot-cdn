/* Reddit-style Blogger post infinite scroll — v1.0.14 (stable end + dedupe + lazy) */
(function(){
  /* ======================= 【 ⚙️ 설정 】 ======================= */
  var CFG={
    ahead: 3,        /* 미리 받아둘 다음 글 수 */
    gap:   1000,     /* 하단에서 이 px 이내면 로드 */
    max:   0,        /* 0 = 피드 끝까지 */
    feedMax: 500,    /* 현재 글을 찾을 최근 피드 수 */
    edgeBase: 'https://reddit-blogspot-edge.pages.dev',
    useEdge: true    /* 실패하면 Blogger 직접 호출로 자동 폴백 */
  };
  /* ============================================================= */

  if(window.__jtInfinite)return; window.__jtInfinite=1;

  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}
  function up(u){return (typeof u==='string'&&u.indexOf('http://')===0)?('https://'+u.slice(7)):u;}
  function pathKey(u){try{return new URL(u,location.href).pathname;}catch(e){return (u||'').split('?')[0].split('#')[0];}}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function isPostView(){
    if(document.body.classList.contains('feed-view'))return false;
    if(location.pathname==='/'||location.pathname==='')return false;
    return !!document.querySelector('.post-outer-container');
  }

  ready(function(){
    if(!isPostView())return;

    var current=document.querySelector('.post-outer-container');
    if(!current)return;
    var curPath=location.pathname;

    /* 현재 글(댓글 포함) 뒤에 무한 피드 삽입 */
    var feed=document.createElement('div');
    feed.id='jtInfiniteFeed';
    if(current.parentNode){current.parentNode.insertBefore(feed,current.nextSibling);}
    else{document.body.appendChild(feed);}

    var loader=document.createElement('div');
    loader.className='jt-inf-loader';
    loader.setAttribute('role','status');
    loader.setAttribute('aria-live','polite');
    loader.innerHTML='<i></i>Loading more posts…';
    feed.appendChild(loader);

    var end=document.createElement('div');
    end.className='jt-inf-end';
    end.setAttribute('role','status');
    end.setAttribute('aria-live','polite');
    feed.appendChild(end);

    var cand=[], cache={}, ptr=-1, appended=0, done=false, randomMode=false, booted=false, busy=false, fails=0;
    var seen={}; seen[curPath]=1;

    function showEnd(msg){
      if(done)return;
      done=true; busy=false;
      loader.classList.remove('on');
      end.textContent=msg||'모든 글을 불러왔습니다.';
      end.style.display='block';
    }

    function nearBottom(){
      return (window.pageYOffset+window.innerHeight)>=(document.documentElement.scrollHeight-CFG.gap);
    }

    function cleanClone(article){
      var clone=article.cloneNode(true);
      var kill=clone.querySelectorAll(
        '#comments,.comments,.comments-content,.comment-form,.comment-footer,'+
        'script,iframe,style,.post-share-buttons,.share-buttons,.post-sidebar,'+
        '.inline-ad,.post-ads,.adsbygoogle,[data-ad-client]'
      );
      for(var i=0;i<kill.length;i++){if(kill[i].parentNode)kill[i].parentNode.removeChild(kill[i]);}

      /* 중복 id 제거 (본문/댓글 앵커 충돌 방지) */
      var ids=clone.querySelectorAll('[id]');
      for(var k=0;k<ids.length;k++)ids[k].removeAttribute('id');

      /* 이미지 지연 로딩 + 원본 비율 유지 (레이아웃 시프트 방지) */
      var imgs=clone.querySelectorAll('img');
      for(var m=0;m<imgs.length;m++){
        imgs[m].setAttribute('loading','lazy');
        imgs[m].setAttribute('decoding','async');
        imgs[m].style.maxWidth='100%';
        imgs[m].style.height='auto';
      }
      return clone;
    }

    function edgePath(path){
      return CFG.edgeBase.replace(/\/$/, '') + path;
    }
    function directFeed(){
      return fetch('/feeds/posts/default?alt=json&max-results='+CFG.feedMax)
        .then(function(r){if(!r.ok)throw 0;return r.json();});
    }
    function fetchFeed(){
      if(!CFG.useEdge||!CFG.edgeBase)return directFeed();
      return fetch(edgePath('/api/blogger-feed?max='+CFG.feedMax))
        .then(function(r){if(!r.ok)throw 0;return r.json();})
        ['catch'](function(){return directFeed();});
    }
    function directPost(u){
      return fetch(u).then(function(r){if(!r.ok)throw 0;return r.text();});
    }
    function fetchPostText(u){
      if(!CFG.useEdge||!CFG.edgeBase)return directPost(u);
      return fetch(edgePath('/api/blogger-post?url='+encodeURIComponent(u)))
        .then(function(r){if(!r.ok)throw 0;return r.text();})
        ['catch'](function(){return directPost(u);});
    }

    function fetchPage(u){
      return fetchPostText(u).then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        var he=doc.querySelector('.post-outer-container')||doc.querySelector('.post-outer');
        if(!he)return null;
        var body=he.querySelector('.post-body');
        if(!body)return null;
        /* 이미지/영상만 있는 글도 정상 글로 인정 (textContent가 비어 있을 수 있음) */
        var hasText=(body.textContent||'').trim().length>0;
        var hasMedia=!!body.querySelector('img,video,picture,figure,svg');
        if(!hasText&&!hasMedia)return null;
        var titleEl=he.querySelector('.post-title');
        var title=titleEl?(titleEl.textContent||'').trim():(doc.title||'');
        return {node:cleanClone(he),title:title};
      });
    }

    function build(item,url){
      var wrap=document.createElement('div');
      wrap.className='jt-inf-post';
      wrap.setAttribute('data-url',url);
      wrap.appendChild(item.node);
      loader.parentNode.insertBefore(wrap,loader);
      appended++;
      seen[pathKey(url)]=1;
    }

    function preload(){
      var endAt=Math.min(ptr+1+CFG.ahead,cand.length-1);
      for(var k=ptr+1;k<=endAt;k++){
        var u=cand[k];
        if(!u||pathKey(u)===curPath||seen[pathKey(u)]||u in cache)continue;
        cache[u]=null;
        (function(uu){fetchPage(uu).then(function(c){cache[uu]=c||'fail';}).catch(function(){cache[uu]='fail';});})(u);
      }
    }

    function loadNext(){
      if(busy||done)return;
      if(CFG.max&&appended>=CFG.max){showEnd();return;}
      busy=true;loader.classList.add('on');

      (function attempt(){
        if(done){busy=false;loader.classList.remove('on');return;}
        if(fails>Math.max(4,cand.length+1)){showEnd('더 불러올 글을 찾지 못했습니다.');return;}

        if(ptr+1>=cand.length){showEnd();return;}

        var u=cand[ptr+1];
        if(!u||pathKey(u)===curPath||seen[pathKey(u)]){ptr++;setTimeout(attempt,20);return;}
        var c=cache[u];
        if(c===undefined)preload();
        if(c===undefined||c===null){setTimeout(attempt,150);return;}
        if(c==='fail'||typeof c!=='object'){fails++;ptr++;setTimeout(attempt,20);return;}

        ptr++;fails=0;build(c,u);busy=false;loader.classList.remove('on');preload();
      })();
    }

    fetchFeed().then(function(d){
      var en=(d.feed&&d.feed.entry)||[],i;
      var urls=[];
      for(i=0;i<en.length;i++){
        var u='';
        (en[i].link||[]).forEach(function(l){if(l.rel==='alternate')u=up(l.href);});
        urls.push(u);
      }

      var idx=-1,cats=[];
      for(i=0;i<urls.length;i++){
        if(pathKey(urls[i])===curPath){
          idx=i;
          cats=(en[i].category||[]).map(function(c){return c.term;});
          break;
        }
      }

      if(idx<0){
        /* 오래된 글: 현재 글이 피드 범위 밖이면 전체 랜덤으로 시작 */
        randomMode=true;
        for(i=0;i<urls.length;i++){if(pathKey(urls[i])!==curPath)cand.push(urls[i]);}
        shuffle(cand);
      }else{
        if(cats.length){
          for(i=0;i<urls.length;i++){
            if(i===idx)continue;
            var ec=(en[i].category||[]).map(function(c){return c.term;});
            for(var m=0;m<ec.length;m++){
              if(cats.indexOf(ec[m])>=0){cand.push(urls[i]);break;}
            }
          }
        }
        if(!cand.length){
          randomMode=true;
          for(i=0;i<urls.length;i++){if(i!==idx)cand.push(urls[i]);}
          shuffle(cand);
        }
      }

      ptr=-1;preload();booted=true;
      if(nearBottom())setTimeout(loadNext,80);
    }).catch(function(){showEnd('피드를 불러오지 못했습니다.');});

    var armed=false;
    function onScroll(){
      if(!booted||busy||done)return;
      if(nearBottom())loadNext();
    }
    window.addEventListener('scroll',function(){armed=true;onScroll();},{passive:true});
    window.addEventListener('wheel',function(e){
      if(e.deltaY>0){armed=true;onScroll();}
    },{passive:true});
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(en){
        if(armed&&en[0].isIntersecting&&booted)loadNext();
      },{rootMargin:'700px'});
      io.observe(loader);
    }
  });
})();
