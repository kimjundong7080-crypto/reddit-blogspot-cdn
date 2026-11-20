# reddit-blogspot-cdn

Reddit 스타일 Blogger 위젯의 **CSS/JS 에셋 전용 공개 저장소**입니다.
jsDelivr CDN으로 서빙하며, Blogger에는 로더 코드만 넣습니다.

## Assets

| File | Purpose |
|---|---|
| `assets/css/21-three-column.css` | 반응형 3열 레이아웃 (좌측 레일 + 중앙 + 우측) |
| `assets/js/21-three-column.js` | 좌측 레일 생성, 기존 우측 사이드바를 3열 컬럼으로 전환 |
| `assets/css/11-infinite.css` | 글보기 무한 스크롤 로더/구분선 |
| `assets/js/11-infinite.js` | 다음 글 자동 로드 (휠/스크롤/IntersectionObserver) + Turnstile 게이트 |
| `assets/css/22-post-image.css`, `assets/js/22-post-image.js` | 본문 이미지 지연 로딩 / R2 이미지 치환 |
| `assets/css/23-yt-posts.css`, `assets/js/23-yt-posts.js` | 공용 위젯: SEO·추천글·숏코드(`[md]`/`[youtube]`/`[rede]`)·정적 페이지 렌더·`/search` 라벨 필터/페이지네이션 |
| `assets/css/24-home.css`, `assets/js/24-home.js` | 홈 랜딩(`/p/home.html`) 전체 |
| `pages/resume.html`, `pages/contact.html` | 정적 페이지 원본 (iframe srcdoc로 렌더) |

> 상세한 인수인계 규칙·환경·배포 절차는 **[AGENTS.md](./AGENTS.md)** 를 참고하세요.

## 소스와 빌드

`assets/`는 직접 수정하지 않습니다. 아래 위젯 HTML에서 `<style>`·`<script>`를 추출해 생성합니다.

| Source | Generated |
|---|---|
| `src/21-three-column.html` | `assets/css/21-three-column.css`, `assets/js/21-three-column.js` |
| `src/11-infinite.html` | `assets/css/11-infinite.css`, `assets/js/11-infinite.js` |

```bash
npm run build                  # package.json 버전으로 생성
npm run check                  # 생성물이 최신인지 검사
npm run release -- 1.0.5       # 빌드 + 커밋 + 태그 + push
```

릴리스 태그는 `v1.0.5` 형식입니다. GitHub Actions(`.github/workflows/verify.yml`)가 push/PR마다 생성물이 소스와 일치하는지 검사합니다.

## jsDelivr (version pin)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.2.76/assets/css/21-three-column.css">
<script
  src="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.2.76/assets/js/21-three-column.js"
  defer></script>

<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.2.76/assets/css/11-infinite.css">
<script
  src="https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1.2.76/assets/js/11-infinite.js"
  defer></script>
```

> `@main` 대신 `@v1.2.76`처럼 버전을 고정하세요. 21·11 모두 **v1.2.76** 기준입니다.

## Blogger 설치

1. **21** CSS/JS는 모든 페이지에 로드해도 됩니다.
2. **11**은 글보기에서만 동작하도록 스크립트 내부에서 `item-view`를 확인합니다.
3. 기존 HTML/JavaScript 가젯에 인라인으로 넣었던 21·11 코드는 제거하고 위 로더만 남깁니다.

## 동작 메모

- 21: `1240px` 이상 3열, `1024~1239px` 좌측 아이콘 레일 + 중앙, `1024px` 미만 1열.
- 21 v1.0.5: `1024~1239px`에서 테마의 음수 마진으로 인한 가로 스크롤을 방지.
- 11: 현재 글의 `.post-outer-container` 뒤에 다음 글을 복제 삽입. 댓글/스크립트/iframe/광고/중복 id 제거.
- 11: 이미지 본문만 있는 글도 정상 글로 인정.
- 11: 같은 카테고리 우선 → 없으면 랜덤 → 이미 본 글은 제외하고 피드 끝에서 종료.
- 11 v1.0.5: 로더/종료 상태에 `role=status`·`aria-live` 적용, 추가 글 이미지 `loading=lazy`·`decoding=async`.
- 11 v1.0.5: `https://reddit-blogspot-edge.pages.dev`의 `/api/blogger-feed`·`/api/blogger-post`를 먼저 사용하고, 실패하면 Blogger 직접 호출로 폴백합니다.
