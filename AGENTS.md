# AGENTS.md — JUST TECH Blogger 운영 작업 지침

이 문서는 **다른 AI/작업자가 이어서 작업할 때** 반드시 따라야 하는 규칙입니다.

## 0. 절대 규칙

1. **로컬 테마 파일 수정 금지**
   - `theme-8527623594727332987.optimized.xml` 및 `theme-8527623594727332987.xml`은 수정하지 않는다.
   - 테마는 이미 9개 CDN URL을 `@v1`로 사용한다.
   - 앞으로 테마/가젯 URL은 다시 수정하지 않는다.

2. **작업은 GitHub 저장소에서만**
   - `kimjundong7080-crypto/reddit-blogspot-cdn` (public)
   - 원본: `src/*.html`
   - 빌드 결과: `assets/css/*.css`, `assets/js/*.js`
   - 이미지: `assets/img/home/*`

3. **토큰/비밀 커밋 금지**
   - GitHub PAT, Cloudflare 토큰, `.dev.vars`를 저장소에 올리지 않는다.

4. **태그 재사용 금지**
   - 릴리스마다 새 `v1.x.y` 태그를 만든다.
   - 기존 태그를 force-update하지 않는다.

## 1. 현재 구조

| 대상 | 값 |
|---|---|
| 블로그 | https://www.techlifeworld.com |
| Blog ID | `8527623594727332987` |
| CDN | https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn |
| 운영 문서 | https://github.com/kimjundong7080-crypto/techlifeworld-ops |
| CDN 방식 | jsDelivr + GitHub |
| 테마 로드 | `@v1` (major alias) |
| 최신 태그 | `v1.2.9` |

테마의 9개 URL은 모두 `@v1`이다. 새 `v1.x.y` 태그를 발행하면 테마 수정 없이 반영된다.

## 2. 현재 홈 캐러셀 상태

`Smarter Software, Stronger Business.` 섹션:

- 카드 6개
- 영상 6개: pomf2 MP4
- 자동재생 없음
- 마우스 호버 시에만 재생
- 마우스가 벗어나면 일시정지 + 포스터 표시
- 재생 시작 0.5초 건너뛰기
- 썸네일: 영상 중간 프레임 JPEG (6개)
- 호버 카드 `flex-grow: 3.4`

### 소스 위치

| 파일 | 역할 |
|---|---|
| `src/24-home.html` | 홈 랜딩 원본 (여기를 수정) |
| `assets/js/24-home.js` | build 결과 (직접 수정 금지) |
| `assets/css/24-home.css` | build 결과 (직접 수정 금지) |
| `assets/img/home/poster-1.jpg` ~ `poster-6.jpg` | 중간 프레임 썸네일 |

### 영상 URL (현재)

1. `https://pomf2.lain.la/f/1xdltask.mp4`
2. `https://pomf2.lain.la/f/5znwgux4.mp4`
3. `https://pomf2.lain.la/f/g6nb4aus.mp4`
4. `https://pomf2.lain.la/f/wx4t7zlc.mp4`
5. `https://pomf2.lain.la/f/3c1gcz5g.mp4`
6. `https://pomf2.lain.la/f/0m5whhmk.mp4`

## 3. 표준 작업 절차

### 3-1. 수정

`src/24-home.html`만 수정한다.

- 영상 URL: `hzCards`의 `hzCard(...)` 6줄
- 제목/포스터: `hzCard(title, poster, src)`
- 호버/재생: `playVideo()` / `pauseVideo()`
- 중간 프레임 포스터: `assets/img/home/poster-N.jpg`

### 3-2. 영상 교체 시 포스터 생성

영상을 바꾸면 **영상 중간 프레임**을 JPEG로 다시 만든다.

```powershell
ffmpeg -i input.mp4 -ss <duration/2> -frames:v 1 -vf scale=800:-2 -q:v 3 assets/img/home/poster-N.jpg
```

- 800×450, JPEG q3
- 파일명은 `poster-1.jpg` ~ `poster-6.jpg`
- 영상 개수가 바뀌면 카드 수/포스터 수/`hzCards`도 같이 수정

### 3-3. 빌드/검증

```powershell
npm run build
npm run check
node --check assets/js/24-home.js
```

### 3-4. 릴리스

```powershell
npm run release -- 1.2.10
```

또는 GitHub API로 commit + tag.

### 3-5. jsDelivr purge

릴리스 후 `@v1` alias 캐시를 지운다.

```text
https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/24-home.js
https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/css/24-home.css
```

### 3-6. 확인

- `@v1`이 새 버전을 반환하는지
- `24-home.js`에 `autoplay`가 없는지
- `jt-hz-poster` 6개인지
- 포스터 이미지 6개가 200인지
- 실제 브라우저에서 호버 재생/이탈 정지

## 4. 홈 캐러셀 동작 규칙

- `<video preload="none">` 유지 → 초기 영상 로딩 금지
- `autoplay` 속성 금지
- 호버 시:
  - `video.preload='auto'`
  - `video.load()` (readyState < 1)
  - `video.play()`
  - `loadedmetadata`에서 `currentTime = 0.5`
- `playing` 이벤트에서 포스터 숨김
- `pause`/`mouseleave`에서 포스터 표시
- `timeupdate`에서 루프 시 앞 0.5초 건너뛰기
- 포스터는 `<img loading="lazy" decoding="async">`

## 5. 버전/캐시 규칙

- 테마는 `@v1` 사용 → 새 `v1.x` 태그만 발행
- `v2.0.0` 발행 시에만 테마의 `@v1` → `@v2` 한 번 수정 (예외)
- `@v1` alias는 캐시된다. 릴리스 후 purge.
- 고정 태그(`@v1.2.9`)는 immutable이므로 재사용/force-update 금지

## 6. 금지/주의

- `theme-8527623594727332987.optimized.xml` 수정 금지
- `widgets/` 로컬 폴더 복원 금지 (삭제됨)
- Blogger 테마/가젯 URL 수정 금지
- `assets/` 직접 수정 금지 (build 사용)
- 영상 6개를 한 번에 `preload="auto"`로 바꾸지 말 것 (초기 속도 저하)
- poster 이미지를 빼고 영상 middle-seek로 썸네일을 만들지 말 것 (초기 속도/호버 재생 문제 재발)

## 7. 파일 맵

```
reddit-blogspot-cdn/
├─ src/24-home.html
├─ assets/
│  ├─ css/24-home.css
│  ├─ js/24-home.js
│  └─ img/home/poster-1..6.jpg
├─ scripts/build.mjs
├─ scripts/release.mjs
└─ package.json
```

## 8. 현재 릴리스

- 최신: `v1.2.9`
- 주요 변경: 이미지 포스터, 호버 전용 재생, 0.5초 스킵, 중간 프레임 썸네일
- `@v1` → `v1.2.9` 확인 완료

## 9. 인수인계 체크리스트

- [ ] 로컬 테마 XML을 열지 않았는가
- [ ] `src/24-home.html`만 수정했는가
- [ ] `npm run build` / `check` 통과
- [ ] `autoplay` 0개
- [ ] `jt-hz-poster` 6개
- [ ] 포스터 6개 200
- [ ] 새 `v1.x` 태그 발행
- [ ] `@v1` purge
- [ ] 실제 호버 재생/이탈 정지 확인
