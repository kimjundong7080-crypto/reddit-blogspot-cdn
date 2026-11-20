# AGENTS.md — JUST TECH Blogger 운영 작업 지침 (인수인계 문서)

이 문서는 **다른 AI/작업자가 이어서 작업할 때** 반드시 따라야 하는 규칙과 현재 상태를 정리한 문서입니다.
최종 업데이트: 2026-11-20 / 최신 릴리스: **v1.2.59**

---

## 0. 절대 규칙

1. **로컬 테마 XML 파일은 읽지도 수정하지도 않는다**
   - `theme-8527623594727332987.optimized.xml`, `theme-8527623594727332987.xml`
   - 파일이 커서 토큰을 많이 소모하며, 테마는 이미 9개 CDN URL을 `@v1`로 사용한다.
   - 테마/가젯 URL은 다시 수정하지 않는다.
2. **작업은 GitHub 저장소에서만**
   - 저장소: `https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn` (public, branch `main`)
   - 원본: `src/*.html` / 정적 페이지: `pages/*.html`
   - 빌드 결과: `assets/css/*.css`, `assets/js/*.js` (직접 수정 금지)
3. **토큰/비밀 커밋 금지**
   - GitHub PAT, Cloudflare 토큰, `.dev.vars`를 저장소에 올리지 않는다.
4. **태그 재사용 금지**
   - 릴리스마다 새 `v1.x.y` 태그를 만든다. 기존 태그를 force-update하지 않는다.

---

## 1. 환경 / GitHub 접속 (다른 AI가 이어받을 때)

### 로컬 경로
```text
D:\코드 수정 작업\15_블로그 스팟\15-2_블로그 스팟(레딧 )\blo\reddit-blogspot-cdn
```
> 폴더명에 한글이 섞여 있으므로 **경로 오타 시 `os error 267 SpawnFailed`** 가 발생한다. 정확히 복사해서 사용할 것.

### 실행 파일 절대 경로 (PATH 미등록 환경 대비)
```text
C:\Program Files\nodejs\node.exe
C:\Program Files\Git\cmd\git.exe
```
PowerShell 프로필 로딩 차단 경고(`running scripts is disabled`)는 매 실행마다 출력되지만 **정상 동작에는 영향 없음**.

### Git 설정 (이미 완료됨)
- remote: `https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn.git`
- branch: `main`
- `user.name`: `kimjundong7080-crypto`
- `credential.helper`: `manager` (Windows 자격 증명 관리자에 인증 정보 저장됨)
- **PAT 원문은 저장소/문서에 기록하지 않는다.** 새 PC/새 세션에서 push가 403이면 GitHub에서 새 PAT(classic, `repo` 권한)를 발급받아 `git push` 시 입력하면 된다.

### 인증이 깨졌을 때 복구 순서
```powershell
# 1) 잘못된 insteadOf/SSH 설정 확인
& 'C:\Program Files\Git\cmd\git.exe' config --global --list
# 2) HTTPS 원격 유지 (SSH 사용 안 함)
& 'C:\Program Files\Git\cmd\git.exe' remote set-url origin https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn.git
# 3) push 시 아이디 + PAT 입력 (이후 자격 증명 관리자에 저장)
& 'C:\Program Files\Git\cmd\git.exe' push origin main
```

---

## 2. 현재 구조

| 대상 | 값 |
|---|---|
| 블로그 | https://www.techlifeworld.com |
| Blog ID | `8527623594727332987` |
| 홈 랜딩 | https://www.techlifeworld.com/p/home.html |
| 검색/목록 | https://www.techlifeworld.com/search |
| 이력서 | https://www.techlifeworld.com/p/resume.html |
| Contact | https://www.techlifeworld.com/p/contact-us.html |
| CDN 저장소 | https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn |
| CDN 방식 | jsDelivr + GitHub (`@v1` major alias) |
| 엣지 API | https://reddit-blogspot-edge.pages.dev (`/api/blogger-feed`) |
| 최신 태그 | **v1.2.59** |

테마의 9개 URL은 모두 `@v1`이다. 새 `v1.x.y` 태그를 발행하면 테마 수정 없이 반영된다.

---

## 3. 파일 맵

```
reddit-blogspot-cdn/
├─ src/
│  ├─ 11-infinite.html      # 글보기 무한 스크롤 (Turnstile 인증 게이트 포함)
│  ├─ 21-three-column.html  # 3열 레이아웃
│  ├─ 22-post-image.html    # 본문 이미지 처리 / R2 치환
│  ├─ 23-yt-posts.html      # 공용 위젯: SEO, 추천글, 숏코드, 정적페이지, /search 앱
│  └─ 24-home.html          # 홈 랜딩 전체 (히어로/서비스/프로젝트/캐러셀/푸터)
├─ pages/
│  ├─ resume.html           # 한국식 이력서 (A4, 흰 배경) — iframe srcdoc로 렌더
│  └─ contact.html          # Contact 페이지 — iframe srcdoc로 렌더
├─ assets/
│  ├─ css/, js/             # build 결과 (직접 수정 금지)
│  └─ img/home/poster-1..6.jpg
├─ scripts/build.mjs        # src → assets 추출 빌드
├─ scripts/release.mjs      # 빌드+커밋+태그+push (pages/ 포함)
└─ package.json
```

---

## 4. 표준 작업 절차

### 4-1. 수정
- `src/*.html`만 수정한다. `assets/`는 빌드 산출물이므로 직접 수정 금지.
- 정적 페이지(이력서/Contact)는 `pages/*.html` 직접 수정.

### 4-2. 빌드 / 검증
```powershell
& 'C:\Program Files\nodejs\node.exe' scripts/build.mjs
& 'C:\Program Files\nodejs\node.exe' scripts/build.mjs --check
& 'C:\Program Files\nodejs\node.exe' --check assets/js/23-yt-posts.js
```

### 4-3. 릴리스 (새 태그)
```powershell
& 'C:\Program Files\nodejs\node.exe' scripts/release.mjs 1.2.43
```
- 먼저 로컬에서 수정과 미리보기를 마치고, 사용자가 최종 결과를 확인하기 전에는 커밋·태그·푸시·CDN purge를 하지 않는다.
- `release.mjs`는 `package.json`, `assets`, `src`, `scripts`, `.github`, `pages`, `README.md`를 커밋하고 태그를 push한다.
- **태그 번호는 항상 이전보다 크게** (재사용 금지).

### 4-4. jsDelivr purge
수정한 파일 경로만 purge 한다. (`throttled:true`가 나오면 몇 분 후 재시도)
```text
https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/23-yt-posts.js
https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/css/23-yt-posts.css
https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/pages/resume.html
```
PowerShell 예:
```powershell
(Invoke-WebRequest -UseBasicParsing 'https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/23-yt-posts.js').Content
```

### 4-5. 배포 확인
```powershell
$u='https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/23-yt-posts.js'
$r=Invoke-WebRequest -UseBasicParsing -Headers @{'Cache-Control'='no-cache'} $u
$r.Headers['x-jsd-version']   # 새 버전인지 확인
```

---

## 5. 캐시 주의사항 (중요)

- jsDelivr `@v1` 응답은 `Cache-Control: public, max-age=604800` → **방문자 브라우저에 최대 7일 캐시**.
- purge는 엣지 캐시만 지운다. 이미 받은 방문자는 새로고침(Ctrl+F5) 전까지 구버전을 볼 수 있다.
- **테마 XML을 수정할 수 없으므로 URL에 `?v=` 쿼리를 붙일 수 없다.** 이 제약을 항상 설명할 것.
- 23-yt-posts의 정적 페이지 로더는 `fetch(FILE_URL,{cache:'no-cache'})`로 변경됨(v1.2.42). 이전의 `force-cache`는 구버전 고정 문제가 있었음.

---

## 6. 현재 구현 상태 (v1.2.54)

### 6-1. 홈 랜딩 (`src/24-home.html`)
- 타이핑 애니메이션 2곳: 히어로(`자동화의 모든 순간을 한 곳에서`), 서비스 제목(`자동화의 전 과정을 다룹니다`) — `IntersectionObserver`, 1회 실행, `prefers-reduced-motion` 대응.
- 섹션 순서: 히어로 → 서비스 → **SELECTED PROJECTS** → **Smarter Software carousel** → ABOUT → CTA.
- `Smarter Software, Stronger Business.` 캐러셀
  - 카드 6개, 호버 시에만 MP4 재생, 이탈 시 정지·초기화(0.5초 스킵)
  - 썸네일 **가로 1 : 세로 2** (`aspect-ratio:1/2`), `object-fit:cover`로 좌우 잘라 채움
  - 영상은 기본 `opacity:0` → 호버 시 표시 (검은 배경 노출 방지)
  - 사이트 인라인 CSS에 밀리지 않도록 `html.jt-home-page body ...` 특이성 + JS 인라인 `!important` 강제
- 푸터: 브랜드 20px / 설명·메뉴·이메일 14px / 저작권 13px
- 문의 이메일: **ssii@naver.com** (XOR 난독화, 소스에 평문 없음)
  - `JT_MAIL_CODE` + `JT_MAIL_KEY(27)`, `data-jt-mail` 속성에 런타임 바인딩
  - 평문 검색(`qwe6973`, `ssii@`, `naver.com`) 결과 0건이어야 함

### 6-2. `/search` 앱 (`src/23-yt-posts.html`)
- 라벨 필터 칩(전체/CAD/NEW/…) + 건수 표시
- 번호 페이지네이션: `이전 1 2 3 4 다음` (20개/페이지), 5개 초과 시 `1 … 4 5 6 … 12`
- 데이터: `/feeds/posts/summary?alt=json&max-results=150` 1회 로드 후 클라이언트 필터/페이징
- URL 상태: `?q=`, `?label=`, `?page=` (`history.replaceState`)
- 기존 Blogger `.blog-posts`/`#blog-pager`는 성공 시에만 숨김 (`html.jt-search-app` 클래스)
- **Blogger `start=` 단독 페이징은 동작하지 않는다** (`updated-max` 필요) → 그래서 클라이언트 렌더 방식 사용

### 6-3. 정적 페이지 (`pages/` + 23-yt-posts 렌더러)
- `/p/resume.html`, `/p/contact-us.html` 은 Blogger 404 셸 위에 `fetch` → iframe `srcdoc`로 렌더
- 높이 자동 측정, 다크모드에서도 **흰 배경** 강제(`html.jt-static-page body{background:#fff!important}`)
- `pages/resume.html`: 한국식 이력서(인적사항/학력/희망조건/경력/자격/컴퓨터 활용/운전/자기소개), A4(210×297mm), 인쇄 `@page A4 margin 5mm`, `인쇄 · PDF 저장` 버튼
- 이력서 사진은 `pages/resume-photo.jpg`에 있으며 로컬 파일 미리보기는 상대 경로, Blogger `iframe srcdoc`에서는 `data-published-src`의 jsDelivr `@v1` 경로를 사용한다. 사진 파일도 이력서와 함께 릴리스해야 한다.
- 인쇄 CSS는 경력사항과 자기소개서를 새 페이지에서 시작하며, 본문은 페이지 사이에서 흐르도록 한다. 최종 PDF 페이지 수는 브라우저 인쇄 미리보기에서 확인할 것.

### 6-4. SEO (`src/23-yt-posts.html` IIFE `window.__jtSeo`)
- canonical/OG/Twitter/JSON-LD(WebSite, Organization, BlogPosting, BreadcrumbList)
- `.blogspot.com` 호스트 → canonical 교체 + `noindex,nofollow` + 리디렉트
- `/search`, `/YYYY/MM/` 아카이브 → `noindex, follow`
- `madomiad.blogspot.com` → `www.techlifeworld.com` 301 확인 완료

### 6-5. 숏코드 / 기타
- `[md]` 마크다운, `[youtube link="..."]` 뷰포트 25% 진입 시 0.5초 후 무음 자동재생, `[rede]`/`[rade]` 더보기 접기
- 무한 스크롤 시 Turnstile 인증 게이트(30분 유효, localStorage)

---

## 7. 금지 / 주의

- 테마 XML 열람·수정 금지
- `assets/` 직접 수정 금지 (반드시 build)
- 영상 6개를 한 번에 `preload="auto"`로 바꾸지 말 것 (초기 속도 저하)
- 포스터를 빼고 영상 middle-seek로 썸네일을 만들지 말 것 (검은 화면/재생 문제 재발)
- 이메일을 평문으로 다시 넣지 말 것 (봇 수집 방지)
- `pages/*.html`은 jsDelivr이 `text/plain`으로 서빙하므로 **직접 URL로 열리지 않는다.** 반드시 Blogger 페이지 + iframe 렌더 경로 사용.

---

## 8. 릴리스 이력 (최근)

| 태그 | 내용 |
|---|---|
| v1.2.20~21 | 카드 호버 영상, 섹션 순서(프로젝트 위로) |
| v1.2.22~27 | SEO, 중복문서 차단, 검색/아카이브 noindex |
| v1.2.30~32 | 이력서/Contact 정적 페이지, About 다크모드 |
| v1.2.33~35 | 홈 제목 자간 확대, 모바일 줄바꿈 |
| v1.2.36~37 | 카드 썸네일 1:2 비율, 검은 배경 제거 |
| v1.2.38 | 푸터 글자 확대 |
| v1.2.39 | 이메일 ssii@naver.com + XOR 난독화 |
| v1.2.40 | `/search` 라벨 필터 + 번호 페이지네이션 |
| v1.2.41 | 이력서 한국식 A4 재작성 |
| v1.2.42 | 정적 페이지 `no-cache`, 정적 페이지 흰 배경 |
| v1.2.43 | 인수인계 문서 최신화 |
| v1.2.44 | About 링크를 `/p/about.html`로 통일 |
| v1.2.45 | 이력서 인쇄 여백·정보 난독화·전용 레이아웃 |
| v1.2.46 | 인쇄 좌우 여백 축소 및 우클릭 블러 보호 강화 |
| v1.2.47 | 이력서 전문형 디자인 개선 |
| v1.2.48 | 인쇄 표 테두리 강화 및 글자 크기 확대 |
| v1.2.49 | 이력서 제목 중앙 정렬, 브랜드 표시 제거, 사진 영역 확대 |
| v1.2.50 | 사진 영역을 인적사항 높이에 맞추고 주소를 두 줄로 표시 |
| v1.2.51 | 최신 인적사항·학력·희망조건·경력·자격·기술 이력 반영 |
| v1.2.52 | 출생월·주소·희망임금 수정 및 취득일 표기 제거 |
| v1.2.53 | 도메인 삭제 및 경력 순서를 오래된 이력부터 표시 |
| v1.2.54 | 서명자 제거 및 날짜 자동 갱신 |
| v1.2.55 | 이력서 사진·자기소개서 추가, 경력·자격·정렬·글자 및 인쇄 레이아웃 보강 |
| v1.2.56 | 유튜브 숏코드 썸네일 우선 표시 및 클릭 재생·Referrer 정책 보강 |
| v1.2.57 | 구버전 iframe 상태를 썸네일 구조로 복구하고 유튜브 포스트를 사이드바 추천 목록에 포함 |
| v1.2.58 | 본문 유튜브 뷰포인트 진입 시 무음 자동재생 복구, 16:9 썸네일 위치 보정 및 좌우 여백 추가 |
| v1.2.59 | iframe 로드 전 썸네일을 최상단에 유지해 검은 전환 화면과 원본 썸네일 위치 이탈 방지 |

---

## 9. 인수인계 체크리스트

- [ ] 테마 XML을 열지 않았는가
- [ ] `src/*.html`(또는 `pages/*.html`)만 수정했는가
- [ ] `build` → `--check` → `node --check` 통과
- [ ] 새 `v1.x.y` 태그 발행 (기존 태그 재사용 없음)
- [ ] `pages/resume-photo.jpg`를 이력서 HTML과 함께 포함
- [ ] 수정 파일 jsDelivr purge
- [ ] `x-jsd-version` 헤더로 새 버전 확인
- [ ] 실제 브라우저에서 화면 확인 (캐시 때문에 Ctrl+F5 필요할 수 있음)
- [ ] 이메일 평문 미노출 확인

## 10. 최신 인수인계 (2026-11-20)

- 이력서 요청 반영: 본문 글자 확대 및 검정색 통일, 인적사항·희망직종 좌측 정렬, 학력 중앙 정렬, 회사명·경력기간·직무명·경력 설명 수정, 경력 20년 11개월 표기, 자격 구분을 `국가기술자격`으로 통일.
- 사진을 추가하고 3:4 표시 비율로 맞췄다. 자기소개서는 다섯 문단으로 보강해 이력서 맨 마지막에 배치했다.
- 변경 파일: `pages/resume.html`, `pages/resume-photo.jpg`, `scripts/release.mjs`, `AGENTS.md`. 릴리스 커밋에도 Co-authored-by trailer를 포함하도록 했다. 사진 원본 크기는 413×531이며 GPS EXIF 항목은 없다.
- 로컬 및 실제 Blogger 페이지(`https://www.techlifeworld.com/p/resume.html`)에서 본문·사진을 확인했다. 이미지 응답은 413×531이며, 모바일 사진 프레임은 78×104(3:4), 데스크톱도 인적사항 표 높이에 맞춰 표시된다.
- `node scripts/build.mjs --check`, `node --check scripts/release.mjs`, `git diff --check` 통과. A4 인쇄 CSS에서 경력사항·자기소개서의 페이지 나눔을 확인했으나 실제 인쇄/PDF 페이지 수는 별도 확인이 필요하다.
- GitHub `main`과 태그 `v1.2.55` 배포 완료(릴리스 커밋 `06ee25b24ce26c4e57061df0ad8ef6a85bcd7f47`). 로컬 브랜치는 `origin/main`과 동기화됐다.
- jsDelivr `@v1`의 `pages/resume.html`, `pages/resume-photo.jpg` 캐시 purge가 모두 `throttled:false`로 완료됐다. 두 URL 모두 HTTP 200 및 `x-jsd-version: 1.2.55`를 확인했다.
- 브라우저 캐시에 따라 방문자 화면은 최대 7일간 이전 내용일 수 있으므로 필요 시 강력 새로고침한다. 테마 XML은 열지 않는다.

### v1.2.56 유튜브 숏코드 수정

- 실제 문제 포스트: `https://www.techlifeworld.com/2026/11/youtube-linkhttpsyoutubelyfcrrulyn0.html`
- 원인 진단: 숏코드 변환은 정상 동작했으나 기존 구현이 썸네일을 만들지 않고 iframe을 즉시 생성했다. 유효한 동영상 ID와 공개 썸네일은 확인되었으므로 유입 차단은 iframe 재생/Referrer 처리 문제로 판단한다.
- 수정: `src/23-yt-posts.html`의 YouTube 섹션에 `hqdefault.jpg` 썸네일을 먼저 표시하고, 재생 버튼을 누른 뒤에만 `youtube-nocookie.com` iframe을 생성한다.
- iframe에 `referrerpolicy="strict-origin-when-cross-origin"`을 추가했다.
- 배포 상태: 소스 수정과 패키지 버전 v1.2.56 메타데이터는 준비됐으나, 샌드박스의 로컬 네트워크/Git 쓰기 차단으로 빌드 산출물 갱신, 커밋, 태그, 푸시, jsDelivr purge가 아직 완료되지 않았다.
