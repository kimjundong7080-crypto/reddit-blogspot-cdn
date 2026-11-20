# JUST TECH Blogger/CDN — Handoff and Operating Guide

Last updated: 2026-11-20
Latest published release: **v1.2.79**
Current local package version: **1.2.79**

This document is the handoff for the next AI or engineer. Release v1.2.79 is published and all changed assets are current at `@v1`. See `CHANGELOG.md` for the consolidated English work log.

## 1. Current status — read first

- Repository: `D:\코드 수정 작업\15_블로그 스팟\15-2_블로그 스팟(레딧 )\blo\reddit-blogspot-cdn`
- Branch: `main`; latest release commit: `7a80b54 Release v1.2.79`.
- Latest GitHub release/tag: `v1.2.79`. The release script updates and pushes both `main` and a new version tag.
- **v1.2.79 is published.** Content:
  - **`/search` results are a responsive card grid**: 4 columns on desktop, 3 at ≤1100px, 2 at ≤900px, 1 at ≤640px. Cards are vertical (16:9 thumbnail on top, title/meta below). Verified live: desktop `179px ×4`, mobile `327px ×1`, no horizontal overflow.
- **v1.2.78 is published.** Content:
  - **Home mid-page freeze hardened.** The home landing subtree is cloned after hero typing; the clone kept the CSS classes but lost the JS expandos, so the reveal `IntersectionObserver` kept watching detached nodes and `#jt-about` / `.jt-cta` never received `is-in` (opacity stayed 0). A document-level reveal ticker (rAF on scroll/resize + 15×800 ms re-check) now reveals any `.jt-reveal` block in view regardless of node identity, and carousel/typing/ceremony init is re-run idempotently with clone-safe guards.
- **CDN status:** `23-yt-posts.css` is **1.2.79** at `@v1`; `24-home.js` is **1.2.78**; `23-yt-posts.js` and `11-infinite.js` are **1.2.77**. Favicon assets live. No pending purge.
- **Blogger Pages restored on 2026-11-20**: `/p/resume.html` (page id `8369950385896197882`) and `/p/contact-us.html` (page id `3994593479765014806`) now return **HTTP 200**. Each page's content is a small inline iframe loader that renders the corresponding `pages/*.html` from jsDelivr inside `#jtStaticHost`; the Blogger page body itself is hidden by the existing `.jt-static-page` CSS.
- Build/checks currently pass: `node scripts/build.mjs`, `node scripts/build.mjs --check`, `node --check assets/js/11-infinite.js`, `node --check assets/js/23-yt-posts.js`, `node --check assets/js/24-home.js`, `git diff --check`.
- Live checks on 2026-11-20 (fresh isolated browser context):
  - Home landing: `.jt-landing` keeps `__jtReveal`, project card titles contain no raw shortcode, `#jt-projects` / `#jt-about` / `.jt-cta` reach `opacity:1` and `.is-in`, 0 console errors, no Turnstile/challenge requests.
  - YouTube post: poster + play button in the post view; clicking creates the iframe (612×344) with `loop=1&playlist`; infinite scroll appended posts with no active iframes inside clones; **0 Edge API requests** and 0 console errors.
  - Clone click-to-play: on `/2026/11/_1.html`, clicking the play button in a cloned vlog post produces a visible `iframe.jt-yt-frame` (652×367) and hides the poster; 0 console errors.
  - `/p/resume.html` and `/p/contact-us.html`: HTTP 200, iframe `srcdoc` mounted, resume/contact text present, `post-outer-container` hidden, titles set, and **0 console errors** with `23-yt-posts.js` v1.2.71. Contact shows `010-4361-6611` (`tel:01043616611`) and `ssii@naver.com` (`mailto:`); resume photo loads at 413px natural width.
  - `/p/about.html`: title `About | JUST TECH`, no `/feeds/posts/...?path=` 404, 0 console errors.
  - Home project cards: 0 broken images; cards without a Blogger thumbnail use `poster-N.jpg`; 0 console errors.
  - Home project data: the previously raw `[youtube ...]` title now shows the real YouTube title; no raw shortcode remains.
  - Blogger feed `/feeds/posts/default?alt=json&max-results=500` returns 200 in under a second.
  - Edge API remains **404**; treat it as unavailable.

### Recently completed performance/UX work (published)

- All YouTube shortcode embeds (post, listing, search, infinite-scroll clone) use a poster + play button; the iframe is created only on click. Single-post autoplay was removed in v1.2.76 to avoid black/frozen players when autoplay is blocked.
- Only one YouTube iframe is kept active at a time; starting another removes the previous iframe.
- YouTube thumbnails use `hqdefault.jpg` with lazy loading, fall back to `sddefault.jpg` once, then hide.
- Infinite scroll marks the Edge API unavailable for the rest of the page session after the first failed request, avoiding repeated 404/timeout calls.
- YouTube shortcodes wrapped in other tags (e.g. inside an `h3` with `-webkit-line-clamp`) are now parsed, and the resulting embed is moved out of clipped wrappers.
- Embed thumbnail sizing/visibility is forced with `!important` selectors that beat `22-post-image`'s body-image rules (16:9, no letterbox, play button above the poster).

## 2. Non-negotiable project rules

1. **Never open, read, or edit the Blogger theme XML.** The files are very large and burn tokens. In particular, do not read:
   - `theme-8527623594727332987.optimized.xml`
   - `theme-8527623594727332987.xml`
   The theme already references nine CDN URLs pinned to the `@v1` major alias; do not modify theme/gadget URLs.
2. **Stay inside the `15-2` task folder.** Do not read or write any other folder, including the external `06_블로그 스팟 API 글쓰기` tool; it is no longer permitted. Source, docs, and temp test files must live under `15-2`.
3. Edit source files under `src/` and static page files under `pages/`. `assets/css/` and `assets/js/` are generated by the build and must not be edited manually.
4. Never commit credentials, GitHub PATs, Cloudflare tokens, `.dev.vars`, or other secrets. Do not record PATs in documentation.
5. Never reuse or force-update a release tag. Each release must use a higher `v1.x.y` version.
6. **Do not commit, tag, push, purge, or otherwise publish before the user has reviewed and approved the result.**
7. Preserve current behavior except where the user requested a change. Do not re-enable Turnstile without a request.
8. Respect the latest user preference: use GitHub + jsDelivr; the earlier R2 hosting proposal was cancelled.

## 3. Repository and environment

- GitHub repository: `https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn`
- Remote: `https://github.com/kimjundong7080-crypto/reddit-blogspot-cdn.git`
- Primary branch: `main`
- Node.js: `C:\Program Files\nodejs\node.exe`
- Git: `C:\Program Files\Git\cmd\git.exe`
- PowerShell profile warnings about script execution policy may appear; they have not prevented these commands from working.
- Git authentication is configured through Windows Credential Manager. If push returns 403, follow the repository's normal credential repair process without exposing or documenting the token.

### Important URLs

| Purpose | URL |
|---|---|
| Blog | `https://www.techlifeworld.com` |
| Blog ID | `8527623594727332987` |
| Home landing page | `https://www.techlifeworld.com/p/home.html` |
| Search | `https://www.techlifeworld.com/search` |
| Resume | `https://www.techlifeworld.com/p/resume.html` |
| Contact | `https://www.techlifeworld.com/p/contact-us.html` |
| Edge API | `https://reddit-blogspot-edge.pages.dev` |
| CDN alias | `https://cdn.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/` |
| YouTube test post | `https://www.techlifeworld.com/2026/11/youtube-linkhttpsyoutubelyfcrrulyn0.html` |

## 4. Project structure and build flow

```text
reddit-blogspot-cdn/
├─ src/
│  ├─ 11-infinite.html       # Single-post infinite scrolling
│  ├─ 21-three-column.html   # Three-column layout
│  ├─ 22-post-image.html     # Post image handling / R2 URL replacement
│  ├─ 23-yt-posts.html       # YouTube, Markdown, search, SEO, static-page widgets
│  └─ 24-home.html           # Home landing page and carousel
├─ pages/
│  ├─ resume.html            # Resume rendered via iframe srcdoc
│  ├─ resume-photo.jpg       # Resume photo; include with resume release
│  └─ contact.html           # Contact page rendered via iframe srcdoc
├─ assets/
│  ├─ css/                   # Generated CSS; do not edit directly
│  ├─ js/                    # Generated JavaScript; do not edit directly
│  └─ img/home/              # Home carousel posters
├─ scripts/build.mjs         # Extracts CSS/JS from src/ into assets/
├─ scripts/release.mjs       # Builds, commits, tags, and pushes a release
└─ package.json
```

The Blogger theme loads the CDN assets through jsDelivr `@v1`. `scripts/build.mjs` extracts inline CSS/JS from `src/*.html` and writes matching files under `assets/`.

## 5. Current feature map

### Home landing — `src/24-home.html`

- Landing page is `/p/home.html`; `/` is the Blogger root and may render the blog listing instead.
- Sections include hero, services, selected projects, feature carousel, about, CTA, and footer.
- Project cards load Blogger feed data; recent data is cached in localStorage.
- The carousel has six cards. MP4 playback is intended only on hover/focus, with `preload="none"` before interaction. Do not preload all six videos.
- External carousel MP4 host: `pomf2.lain.la`. Include it in future network investigations if the home page still stalls.
- Home layout supports dark mode and reduced-motion preferences.
- Contact email is assembled at runtime from XOR-obfuscated character codes; do not put the plaintext address in source.

### YouTube, search, SEO, and static pages — `src/23-yt-posts.html`

- Supports `[youtube link="..."]`, Markdown `[md]`, and `[rede]`/`[rade]` folded sections.
- YouTube video ID `lyFcrrULyN0` is valid; YouTube oEmbed and its thumbnail have been checked previously.
- Every embed uses click-to-play; the iframe is only created after a user click (autoplay removed in v1.2.76).
- Search uses client-side filtering/pagination after loading Blogger feed data.
- SEO code sets canonical, Open Graph/Twitter metadata, and JSON-LD. Blogger-host redirects/canonical handling are in this file.
- `/p/resume.html` and `/p/contact-us.html` fetch static HTML from jsDelivr and render it via iframe `srcdoc`. jsDelivr may serve these page files as `text/plain`, so test them through Blogger, not by opening the raw CDN URL directly.
- Resume print CSS targets A4. A real A4 PDF render on 2026-11-20 produced **3 pages**.

### Infinite scrolling — `src/11-infinite.html`

- Runs only on single-post pages, inserts related/other posts, and clones their Blogger markup.
- The clone wrapper is `.jt-inf-post`; scripts, iframes, comments, and ad elements are removed from cloned HTML.
- Turnstile was temporarily removed in release `v1.2.60`. A challenge was nevertheless observed in a later live browser session; its source was not conclusively identified. The current repository code should remain without the Turnstile gate unless the user asks otherwise.
- A circuit breaker avoids retrying a failed Edge API for every subsequently loaded post.

### Contact page — `pages/contact.html`

- Korean-language content, dark-mode styling, and parent-page theme synchronization were added and released in `v1.2.62`.
- The contact action uses `mailto:ssii@naver.com`.

## 6. Relevant work history

### Earlier releases

- `v1.2.20–21`: Home carousel hover videos and section ordering.
- `v1.2.22–27`: SEO metadata, duplicate-document handling, and search/archive noindex behavior.
- `v1.2.30–32`: Static resume/contact pages and dark-mode work.
- `v1.2.33–39`: Home typography, mobile layout, footer, and obfuscated email.
- `v1.2.40`: Search label filters and numbered pagination.
- `v1.2.41–55`: Resume design, profile photo, copy, alignment, typography, and print layout. `v1.2.55` was deployed; final PDF page count remains unverified.

### YouTube and site UI releases

- `v1.2.56–59`: YouTube shortcode thumbnails/player behavior, Referrer Policy, viewport autoplay, 16:9 sizing, and black-frame/thumbnail positioning fixes.
- `v1.2.60`: Temporarily removed the infinite-scroll Turnstile gate. Turnstile remains disabled; v1.2.67 removed the leftover CSS, and no challenge was observed in the v1.2.76/77 live checks.
- `v1.2.61`: Prevented autoplay in infinite-scroll clones to reduce browser load.
- `v1.2.62`: Adjusted home carousel card width/gap/hover expansion and media ratio; translated Contact content to Korean and synchronized dark mode. Home CSS/JS and Contact HTML purges succeeded.
- `v1.2.63`: Published the YouTube single-iframe/autoplay-on-post-only fix, lazy thumbnails, and the infinite-scroll Edge API circuit breaker.
- `v1.2.64`: YouTube shortcode parsing made tag-tolerant (handles shortcodes wrapped in `<span>`/headings).
- `v1.2.65`: Embeds inside clamped headings are moved out so they are not clipped.
- `v1.2.66`: Fixed thumbnail letterboxing and play-button stacking against `22-post-image`'s `!important` body-image rules; poster now fills 16:9 with a clickable play button on listing/clone embeds.
- `v1.2.67`:
  - Infinite scroll queries Blogger directly first and uses Edge only as a fallback; unused Turnstile CSS removed (Turnstile temporarily disabled, no gate in code). Verified: 0 Edge requests, 4 posts appended, no autoplay inside clones.
  - **Home mid-page stall fixed.** Root cause: a project card title contained the raw `[youtube link="..."]` text from post data; `23-yt-posts` treated it as a shortcode and rewrote the whole home `.post-body` via `innerHTML`, recreating `.jt-landing` and detaching the reveal `IntersectionObserver`. `#jt-projects`, `#jt-about`, and `.jt-cta` stayed at `opacity:0`, so the page appeared frozen from the middle. Fix: skip `.post-body` containing `.jt-landing` in shortcode parsing, strip `[youtube ...]` from home project titles, and re-bind reveal if the landing is rebuilt. Verified in a fresh browser context: same landing node kept, project/about/CTA sections reach `opacity:1`/`.is-in`, no raw shortcode, 0 console errors.
- `v1.2.68`:
  - Restored `/p/resume.html` and `/p/contact-us.html` as live Blogger Pages (200) using an inline iframe loader in the page content; the theme's existing `.jt-static-page` CSS hides the Blogger page body and chrome.
  - `23-yt-posts` SEO: static pages are excluded from `item-view` logic, removing the `/feeds/posts/default?path=...` 404 console error.
- `v1.2.69`:
  - **Clone video “stuck” fixed.** `11-infinite` hid all clone iframes with `!important`; the clicked YouTube player was inserted but invisible. The player iframe now carries `.jt-yt-frame`, and the hide rule uses `iframe:not(.jt-yt-frame)`. Verified live on `/2026/11/_1.html`: iframe visible (652×367), `.ready`, poster hidden, console clean.
- `v1.2.70`:
  - `pages/contact.html`: replaced the `123-456-7890` placeholder with the real `010-4361-6611` (`tel:`), made the email a `mailto:` link, fixed the phone/map icons.
- `v1.2.71`:
  - Generalized static-page detection to every `/p/*.html` page (except home), removing the About page feed 404 while keeping `| JUST TECH` in the title.
  - Home project cards without a feed thumbnail now fall back to `assets/img/home/poster-N.jpg` (no broken images).
  - Resume photo uses an absolute jsDelivr `src`, removing the initial `/p/resume-photo.jpg` 404 inside `srcdoc`.
- `v1.2.72`:
  - Search/archive titles now use `검색 | JUST TECH` and `YYYY년 M월 아카이브 | JUST TECH` instead of the Blogger blog name. Verified live: search title `검색 | JUST TECH`, archive title `2026년 11월 아카이브 | JUST TECH`, 0 console errors.
- `v1.2.73`:
  - SEO metadata for non-item pages: `og:title`/`twitter:title` now match the descriptive title on search/archive/static pages; About/Contact get page-specific descriptions; About is indexable while resume/contact are `noindex, follow`.
  - `ogImage()` now falls back to the YouTube thumbnail (`i.ytimg.com/vi/<id>/hqdefault.jpg`) for video-only posts, and item pages set `og:image` when Blogger did not provide one.
  - Static pages use `assets/img/home/poster-1.jpg` as the OG/Twitter image fallback.
- `v1.2.74`:
  - Added the favicon set (`favicon.svg`/16/32/48/ico + apple-touch-icon) and head injection on every page; `theme-color` is set to `#1f7a5c`.
  - Single-post YouTube autoplay now loops (`loop=1&playlist=<id>`), preventing the video from stopping on the end-screen overlay after the 18-second clip.
  - Favicon assets verified 200 at `@v1` and `@v1.2.74`; favicon links, SVG/PNG/ICO sizes, and `theme-color` verified locally.
- `v1.2.75`:
  - Home feed cache key bumped to `jt-home-feed-v2` and TTL reduced to 5 minutes so new posts reach the landing quickly.
  - New post “두산 협동로봇 솔루션적용: 스크류 체결” (`/2026/11/blog-post.html`, post id `2105647337331496730`, YouTube `4GL2ndz7etQ`) published via the Blogger API with the shortcode and a Korean description; label `CAD`.
  - Fresh browser verification: the new post is the first home project card (poster + correct title), all 4 cards have images (0 broken), and the search result list starts with the new post. Post page: embed iframe visible (620×349), no raw shortcode, infinite scroll appends posts.
- `v1.2.76`:
  - **YouTube play reliability fix.** Removed single-post autoplay entirely; `mount()` now leaves the poster + play button in place and the iframe is created only on click. This is the definitive fix for the black/frozen player seen when a browser blocks or delays autoplay. The clicked player keeps `loop=1&playlist=<id>`.
  - Live verification (fresh Chrome): before click 0 iframes with a visible 480px thumbnail and play button; after click 1 iframe, `ready`, 612×344, playing; 0 console errors. Home first card/search first result/new-post SEO meta all verified.
- `v1.2.77`:
  - Branded 404 panel replaces Blogger's default message: 404 code, Korean heading, Home/Search buttons, and up to three recent posts; title `페이지를 찾을 수 없음 | JUST TECH`, `robots=noindex, follow`, OG/Twitter title and description.
  - `11-infinite` skips pages containing `.status-msg-body`, so 404 and static fallback pages no longer append a stray infinite-scroll post below the message.
  - Live verification: 404 panel renders, recent posts populate, no `#jtInfiniteFeed`, correct title/robots; the new YouTube post still click-plays at 612×344 with loop; home first card/search unaffected.
- `v1.2.78`:
  - **Home mid-page freeze root cause (2nd).** After v1.2.67 removed the shortcode-driven `innerHTML` rewrite, a **clone of the `.jt-landing` subtree** still occurred after hero typing (the clone kept classes/styles but lost JS expandos such as `__jtReveal`). The reveal `IntersectionObserver` therefore kept watching detached nodes, so `#jt-projects` / `#jt-about` / `.jt-cta` could stay at `opacity:0` — the page appeared frozen from the middle.
  - Fix: `revealTick()` + `bindRevealTicker()` reveal any `.jt-landing .jt-reveal:not(.is-in)` block that is in the viewport on scroll/resize and on a 15×800 ms re-check; `initLandingReveal()` no longer depends on the node-identity flag; carousel/hero-typing/service-ceremony init is re-run idempotently, with "already typed/cloned" guards that jump straight to the finished state instead of replaying.
  - Verified live (fresh load after `cache:'reload'`): all five `.jt-reveal` blocks reach `is-in`/`opacity:1`, 0 hidden sections, carousel hover plays MP4, 0 console errors.
- `v1.2.79`:
  - `/search` results switched from a single vertical list to a responsive grid: `repeat(4,minmax(0,1fr))` by default, 3 columns at ≤1100px, 2 at ≤900px, and 1 at ≤640px.
  - Cards are vertical (portrait thumbnail on top, title/snippet/meta below); thumbnail is full-width 16:9.
  - Verified live: desktop computed `179px 179px 179px 179px`, mobile (390px) `327px`, no horizontal overflow.
- Earlier R2 static hosting proposal was explicitly cancelled. Continue using GitHub/jsDelivr.

### Verification notes (2026-11-20, v1.2.63–77)

- A YouTube post loads with a poster + play button; clicking creates the iframe and plays with **no Edge API requests** after v1.2.67.
- `/p/resume.html` and `/p/contact-us.html` return 200 and render the resume/contact iframes with 0 console errors; `/p/about.html` also has no feed 404 after v1.2.71.
- Search and monthly archive titles are now descriptive (`검색 | JUST TECH`, `2026년 11월 아카이브 | JUST TECH`) after v1.2.72.
- v1.2.73 SEO meta verified locally: search/archive `og:title` descriptive; About `robots=index, follow`; resume/contact `robots=noindex, follow`; vlog post `og:image=https://i.ytimg.com/vi/opVMctYiY6s/hqdefault.jpg`.
- v1.2.74 favicon verified locally: head contains SVG/32/16/ICO/apple-touch icon links, `theme-color=#1f7a5c`, 0 console errors; favicon assets are HTTP 200 on jsDelivr.
- v1.2.74 loop fix verified in the embed URL: `...&loop=1&playlist=lyFcrrULyN0...`; v1.2.76 now applies it after a click (no autoplay).
- v1.2.75 fresh-context check: new post “두산 협동로봇 솔루션적용: 스크류 체결” is first on the home project cards with `poster-1.jpg`, no broken images, and first in search results. The post page renders the 4GL2ndz7etQ player at 620×349 with no raw shortcode.
- Home stale-cache caveat: the old 6-hour `jt-home-feed-v1` cache may keep the previous project cards for up to 6 hours on browsers that had loaded the old `24-home.js`; a hard refresh loads the v2/5-minute cache immediately.
- v1.2.76 live check (fresh Chrome): the new post shows a poster (480px thumbnail) + play button with 0 iframes; clicking plays the 4GL2ndz7etQ video at 612×344 with `loop=1&playlist` and 0 console errors. Home first card, search first result, favicon links/theme-color, and the SEO meta on About/resume/contact/vlog all verified.
- The YouTube player may emit its own `compute-pressure` Permissions-Policy message after playback starts; it comes from the YouTube iframe, not this site.
- v1.2.77 404 check: `/this-page-does-not-exist-xyz` shows the branded panel with the three newest posts, `noindex, follow`, no infinite feed, and only the expected 404 network console message.
- `/p/resume.html`, `/p/contact-us.html`, `/p/about.html` all have page-specific descriptions and a poster OG image fallback after v1.2.73.
- Blogger Pages API probe confirmed `<script>` is preserved in page content; the restored pages use an inline loader instead of relying on the 404 fallback.
- Infinite-scroll clone embeds show a 16:9 poster and a clickable 64px play button; after v1.2.69 clicking shows the player iframe (previously it stayed hidden by the clone iframe rule).
- The `vlog` post's embed is no longer clipped and no raw `[youtube ...]` text remains in its body.
- The only raw `[youtube ...]` post title was fixed on 2026-11-20 through the Blogger API (post id `2698047383991785144`, now “Tam Otomatik Vidalama Makinası ve 3 Robotlu Montaj Hattı”); the URL stayed the same. `loadLandingProjects` still strips any future shortcode-like titles as a safety net.
- Visitors with a browser cache of older `@v1` files may keep the old home behavior for up to seven days; a hard refresh clears it.

## 7. Build, validation, release, and cache procedures

Run from the repository root:

```powershell
node scripts/build.mjs
node scripts/build.mjs --check
node --check assets/js/11-infinite.js
node --check assets/js/23-yt-posts.js
git diff --check
```

For a release, choose a version greater than `1.2.78` and never reuse a tag:

```powershell
node scripts/release.mjs 1.2.79
```

`release.mjs` rebuilds assets, updates version references, commits the release, creates an annotated tag, and pushes `main` plus the tag. Review its staged file set and resulting release before running it. Commit messages include:

```text
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

After an approved release:

1. Purge only the changed jsDelivr resources. For the current local fix, the JavaScript URLs would be:
   - `https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/11-infinite.js`
   - `https://purge.jsdelivr.net/gh/kimjundong7080-crypto/reddit-blogspot-cdn@v1/assets/js/23-yt-posts.js`
2. If purge reports throttling, wait and retry later.
3. Check `x-jsd-version` from a no-cache request to the changed CDN assets.
4. Test in the live browser. Existing visitor browser caches may retain `@v1` assets for up to seven days; a hard refresh may be required.

The Blogger theme URLs are fixed and use `@v1`; do not edit the theme or add query parameters to it.

## 8. Known open items

- The `23-yt-posts.js@v1` purge completed on 2026-11-20; `@v1` reports **1.2.76**. The favicon links, click-to-play behavior, loop, and SEO meta are live.
- Turnstile remains disabled. A challenge was observed once after the v1.2.60 removal, but none was observed in the v1.2.76/77 live checks. Do not re-enable the gate without a user request.
- The home “loading stops midway” symptom is hardened in v1.2.78: reveal no longer depends on a single observer attached to one node, so a cloned/replaced landing still reveals `#jt-projects`, `#jt-about`, and `.jt-cta`. Verified in a fresh browser; cached visitors may need a hard refresh.
- The actual cloner of `.jt-landing` has never been identified with certainty (classes survive, expandos do not). Keep the ticker/guards in place; if a future change adds listeners to landing child nodes, re-bind them the same idempotent way.
- Resume print layout verified on 2026-11-20 with a real A4 PDF render: **3 pages**, no clipped forced breaks beyond `.career-section` / `.self-intro-section`. Printable output uses the real resume data; re-check if content length changes.
- `/p/resume.html` and `/p/contact-us.html` restored on 2026-11-20 as live Blogger Pages (HTTP 200) with page IDs `8369950385896197882` and `3994593479765014806`. The page body contains the inline jsDelivr iframe loader; if those pages are ever deleted again, recreate them with the same titles (`resume`, `contact-us`) and the loader content.
- No raw `[youtube ...]` post titles or labels remain as of 2026-11-20 (the one affected post was corrected through the Blogger API).
- Blogger admin-only work remains with the user: search description, custom robots.txt, page titles, Search Console address change for `madomiad.blogspot.com`.
