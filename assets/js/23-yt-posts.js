/* Reddit-style Blogger YouTube post list — v1.0.18 */
(function(){
  if(window.__ytPosts)return; window.__ytPosts=1;
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
  function fetchFeed(){
    return fetch('/feeds/posts/default?alt=json&max-results=20',{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      ['catch'](function(){
        return fetch('https://reddit-blogspot-edge.pages.dev/api/blogger-feed?max=20')
          .then(function(r){if(!r.ok)throw 0;return r.json();});
      });
  }
  ready(function(){
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
      var seen={},n=0;
      for(var i=0;i<entries.length&&n<12;i++){
        var e=entries[i];
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
          img.src=thumb; img.alt=title; img.loading='lazy'; img.decoding='async';
          img.onerror=function(){this.style.display='none';this.parentNode.classList.add('yt-thumb-empty');};
          box.appendChild(img);
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
      }
      count.textContent=String(n);
      if(!n){list.appendChild(el('div','yt-empty','표시할 글이 없습니다.'));}
    })['catch'](function(){
      list.appendChild(el('div','yt-empty','글을 불러오지 못했습니다.'));
    });
  });
})();
