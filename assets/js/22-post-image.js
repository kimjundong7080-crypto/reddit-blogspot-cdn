/* Reddit-style Blogger post image (R2 mapping) — v1.2.152 (index.json mapping + fallback) */
/* 22 post image — 본문 이미지를 R2(i/index.json) 매핑으로 치환
   1) https://pub-….r2.dev/i/index.json = { "파일명": "i/<hash>.ext" }
   2) 본문 <img> 의 URL 마지막 파일명이 매핑에 있으면 R2 원본으로 바꿈
   3) 매핑에 없거나 R2 로드 실패 → 원래 Blogger URL 그대로 유지(안전 폴백)
   4) 무한 스크롤/지연 로딩 대응: MutationObserver 로 새 이미지도 처리
   설정 변경은 전역 window.JT_R2 로 덮어쓸 수 있습니다. */
(function () {
  'use strict';
  var CFG = window.JT_R2 || {};
  var HOST = (CFG.host || 'https://pub-b1e181c4ed0440489fcbbb5cb9aceaa6.r2.dev').replace(/\/+$/, '');
  var INDEX_URL = CFG.index || (HOST + '/i/index.json');
  var CACHE_KEY = CFG.cacheKey || 'jt-r2-index-v1';
  var TTL = typeof CFG.ttlMs === 'number' ? CFG.ttlMs : 21600000; /* 6h */
  var SELECTOR = CFG.selector || '.post-body img, .jt-inf-post .post-body img, .post-body.entry-content img';
  var DEBUG = !!CFG.debug;

  var index = null;      /* { 파일명: 'i/hash.ext' } */
  var lowerIndex = {};   /* 소문자 파일명 폴백 색인 */
  var pending = false;
  var queued = [];

  function log() {
    if (!DEBUG) return;
    try { console.info.apply(console, ['[jt-r2]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.at || !o.files) return null;
      if (Date.now() - o.at > TTL) return null;
      return o.files;
    } catch (e) { return null; }
  }

  function writeCache(files) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), host: HOST, files: files }));
    } catch (e) {}
  }

  function normalizeName(name) {
    /* Blogger URL 은 파일명이 percent-encoded 이고, 크기 접두사(s1600/, w1200-h630-…)가 붙는다. */
    var s = name;
    try { s = decodeURIComponent(s); } catch (e) {}
    return s.replace(/\s+/g, ' ').trim();
  }

  function fileNameOf(url) {
    if (!url) return '';
    var clean = String(url).split('#')[0].split('?')[0];
    var seg = clean.substring(clean.lastIndexOf('/') + 1);
    return normalizeName(seg);
  }

  function r2UrlFor(url) {
    if (!index || !url) return '';
    if (url.indexOf(HOST + '/') === 0) return '';           /* 이미 R2 */
    var name = fileNameOf(url);
    if (!name) return '';
    var key = index[name];
    if (!key) {
      /* 예전 업로드가 소문자로 색인한 경우가 있어 소문자 비교를 한 번 더 시도한다.
         (다른 파일을 잘못 붙이지 않도록, 이름이 정확히 같은 것만 소문자로 비교) */
      key = lowerIndex[name.toLowerCase()];
    }
    if (!key) {
      /* Blogger 이 이름 뒤에 -1, -2 를 붙이는 경우까지는 추측하지 않는다(오결합 방지). */
      return '';
    }
    return HOST + '/' + String(key).replace(/^\/+/, '');
  }

  function restore(img) {
    var original = img.getAttribute('data-jt-r2-original');
    if (!original) return;
    img.removeAttribute('data-jt-r2-original');
    img.removeAttribute('data-jt-r2');
    img.classList.remove('jt-r2-img');
    img.src = original;
    log('R2 로드 실패 → 원본 유지', original);
  }

  function swap(img) {
    if (!index || !img || img.getAttribute('data-jt-r2') === '1') return;
    if (img.closest('[data-jt-r2-skip]')) return;
    var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    var next = r2UrlFor(src);
    if (!next) return;

    img.setAttribute('data-jt-r2-original', src);
    /* srcset/sizes 가 남아 있으면 브라우저가 원본을 다시 고르므로 함께 정리한다. */
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    img.setAttribute('data-jt-r2', '1');
    img.classList.add('jt-r2-img');
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      restore(img);
    });
    img.src = next;

    /* 부모 링크(클릭 시 원본 열기)도 R2 로 맞춰 둔다 */
    var a = img.closest('a');
    if (a && /blogger\.googleusercontent\.com|googleusercontent\.com/.test(a.getAttribute('href') || '')) {
      var hrefNext = r2UrlFor(a.getAttribute('href'));
      if (hrefNext) a.setAttribute('href', hrefNext);
    }
    log('치환', src, '→', next);
  }

  function scan(root) {
    if (!index) return 0;
    var base = root && root.querySelectorAll ? root : document;
    var imgs = base.querySelectorAll(SELECTOR);
    var n = 0;
    for (var i = 0; i < imgs.length; i++) {
      var before = imgs[i].getAttribute('data-jt-r2');
      swap(imgs[i]);
      if (before !== '1' && imgs[i].getAttribute('data-jt-r2') === '1') n++;
    }
    return n;
  }

  function flush() {
    queued = [];
    var n = scan(document);
    if (n) log('치환 ' + n + '개');
  }

  function requestScan(node) {
    if (node && node.nodeType === 1) {
      queued.push(node);
    }
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      pending = false;
      var nodes = queued.slice();
      queued = [];
      if (!nodes.length) { flush(); return; }
      var total = 0;
      for (var i = 0; i < nodes.length; i++) total += scan(nodes[i]);
      if (total) log('치환 ' + total + '개 (부분)');
    });
  }

  function observe() {
    if (!window.MutationObserver || !document.body) return;
    var mo = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.type === 'attributes') { requestScan(r.target.parentNode); continue; }
        if (r.addedNodes && r.addedNodes.length) {
          for (var j = 0; j < r.addedNodes.length; j++) {
            var nd = r.addedNodes[j];
            if (nd.nodeType === 1) requestScan(nd);
          }
        }
      }
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'data-src']
    });
  }

  function withIndex(files) {
    index = files || {};
    lowerIndex = {};
    for (var k in index) {
      if (!Object.prototype.hasOwnProperty.call(index, k)) continue;
      var lk = String(k).toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(lowerIndex, lk)) lowerIndex[lk] = index[k];
    }
    flush();
    observe();
    window.addEventListener('load', function () { flush(); });
    window.addEventListener('hashchange', function () { requestScan(document.body); });
    /* 위젯/무한 스크롤이 fetch 로 붙이는 경우를 한 번 더 확인 */
    setTimeout(flush, 1200);
    setTimeout(flush, 3200);
  }

  function loadIndex() {
    var cached = readCache();
    if (cached) { withIndex(cached); log('캐시 사용', Object.keys(cached).length + '개'); }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', INDEX_URL + '?t=' + Math.floor(Date.now() / 60000), true);
    xhr.timeout = 8000;
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) { log('index HTTP ' + xhr.status); return; }
      var data;
      try { data = JSON.parse(xhr.responseText); } catch (e) { log('index JSON 파싱 실패'); return; }
      var files = (data && data.files) || {};
      if (!Object.keys(files).length) { log('index 비어 있음'); if (!index) withIndex({}); return; }
      writeCache(files);
      withIndex(files);
      log('index 로드', Object.keys(files).length + '개');
    };
    xhr.onerror = xhr.ontimeout = function () {
      log('index 요청 실패 → 원본 유지');
      if (!index) withIndex({});
    };
    try { xhr.send(); } catch (e) { if (!index) withIndex({}); }
  }

  /* 외부(검증·디버깅)에서 상태를 확인할 수 있게 노출 */
  window.JTR2Images = {
    host: HOST,
    indexUrl: INDEX_URL,
    refresh: function () { flush(); return index; },
    files: function () { return index; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIndex);
  } else {
    loadIndex();
  }
})();
