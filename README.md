# reddit-blogspot-cdn

Reddit 스타일 Blogger 위젯의 **CSS/JS 에셋 전용 공개 저장소**입니다.
jsDelivr CDN으로 서빙하며, Blogger에는 로더 코드만 넣습니다.

## Assets

| File | Purpose |
|---|---|
| `assets/css/21-three-column.css` | 반응형 3열 레이아웃 (좌측 레일 + 중앙 + 우측) |
| `assets/js/21-three-column.js` | 좌측 레일 생성, 기존 우측 사이드바를 3열 컬럼으로 전환 |
| `assets/css/11-infinite.css` | 글보기 무한 스크롤 로더/구분선 |
| `assets/js/11-infinite.js` | 다음 글 자동 로드 (휠/스크롤/IntersectionObserver) |

## jsDelivr (version pin)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.0.0/assets/css/21-three-column.css">
<script
  src="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.0.0/assets/js/21-three-column.js"
  defer></script>

<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.0.0/assets/css/11-infinite.css">
<script
  src="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.0.2/assets/js/11-infinite.js"
  defer></script>
```

> `@main` 대신 `@v1.0.0`처럼 버전을 고정하세요. 11번은 **v1.0.2**부터 Git 자동 배포 Edge API를 사용합니다.

## Blogger 설치

1. **21** CSS/JS는 모든 페이지에 로드해도 됩니다.
2. **11**은 글보기에서만 동작하도록 스크립트 내부에서 `item-view`를 확인합니다.
3. 기존 HTML/JavaScript 가젯에 인라인으로 넣었던 21·11 코드는 제거하고 위 로더만 남깁니다.

## 동작 메모

- 21: `1240px` 이상 3열, `1024~1239px` 좌측 아이콘 레일 + 중앙, `1024px` 미만 1열.
- 11: 현재 글의 `.post-outer-container` 뒤에 다음 글을 복제 삽입. 댓글/스크립트/iframe/광고/중복 id 제거.
- 11: 이미지 본문만 있는 글도 정상 글로 인정.
- 11: 같은 카테고리 우선 → 없으면 랜덤 → 반복.
- 11 v1.0.2: `https://reddit-blogspot-edge-git.pages.dev`의 `/api/blogger-feed`·`/api/blogger-post`를 먼저 사용하고, 실패하면 Blogger 직접 호출로 폴백합니다.
