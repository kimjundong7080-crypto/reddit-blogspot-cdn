# JUST TECH Blogger/CDN — Handoff and Operating Guide

Last updated: 2026-11-21
Latest published release: **v1.2.108**
Current local package version: **1.2.108**

This document is the handoff for the next AI or engineer. Release v1.2.108 is published and all changed assets are current at `@v1` once the pending JS purge completes. See `CHANGELOG.md` for the consolidated English work log.

## 1. Current status — read first

- **Unreleased local change — domain-aware branding.** `src/23-yt-posts.html` now selects SEO/site strings from a `BRAND` table by `location.hostname`: `techlifeworld.com` → JUST TECH, `shutupquick.com` → 삶의 지혜, `deepstronglove.com` → 일상의 즐거움. Changed values: `SITE`, `HOME_TITLE`, `HOME_DESC`, `FALLBACK_DESC`, item/about/contact descriptions, home `alternateName`, static-page titles (`PAGES`), and the 404 title/description. Brand is shared as `window.__jtBrand` for the later IIFEs. In the same change: `SELF_ORIGIN` (current `location.protocol//host`) replaced `ORIGIN` for JSON-LD `@id`/`url`, the canonical fallback and the favicon fallback, so other domains no longer point at techlifeworld; `ORIGIN` is still used only for the `.blogspot.com` redirect target. Dead code removed: the never-called `initHomeHero()` and its unused `html.jt-home-page .jt-hero*` CSS block. Build/`--check`/`node --check` pass; not released yet, so `@v1` still serves the old body.
- Repository: `D:\코드 수정 작업\15_블로그 스팟\RedditBlogspotCdn\blo\reddit-blogspot-cdn`
- Workspace folder renamed to **RedditBlogspotCdn** (English letters only, no spaces/special characters). The previous Korean/parenthesized folder name is obsolete; use the path above.
- Branch: `main`; latest release commit: `19dc992 Release v1.2.108`.
- Latest GitHub release/tag: `v1.2.108`. The release script updates and pushes both `main` and a new version tag.
- **v1.2.108 is published.** Content:
  - **Search thumbnails fixed for R2 images**: `/search` fetched `/feeds/posts/summary`, which strips post content (and every `<img>`), so `firstImage()` never saw the R2 URLs. It now fetches `/feeds/posts/default?alt=json&max-results=150`; verified with the 1.2.108 script that `청소` (1600px), `fdsfds` (1199px), and `test37` (1199px) R2 thumbnails render. `4325reff` has only a `[이미지: ...]` placeholder in its content and no real image.
  - **CDN caveat:** at handoff time `@v1` still served the **1.2.105** JS body because the `@v1` JS purge was throttled; the switch to 1.2.108 was scheduled. CSS already serves 1.2.108.
- **v1.2.107 is published.** Content: `guardImageClicks()` unwraps image anchors so a post-image click no longer opens the original/new window or the Blogger lightbox; skips landing, YouTube poster/thumb, and `jt-*`/`yt-*` anchors; re-runs on mutations and clones.
- **v1.2.106 is published.** Content: after the first feed batch, `jtApplyLatestLinks()` points the quick-nav and rail Home links at the newest post immediately.
- **v1.2.105 is published.** Content: the two domains cache the newest post URL in `localStorage` for 10 minutes; `/` and `/p/home.html` use it for an instant redirect, and the Home button/rail link use it.
- **v1.2.104 is published.** Content: related-post recommendations: `loadRelatedContext()` reads DOM labels plus the path feed (`/feeds/posts/default?alt=json&path=<path>`, 2.5 s timeout), scores by label overlap ×5 and title-token overlap ×2 (CAD/YouTube +1), excludes the current post, and sorts each batch by relevance.
- **v1.2.103 is published.** Content: first-pass content-image thumbnails for `/search` plus initial related-post scoring.
- **v1.2.102 is published.** Content: the collapsed expander's 120px bottom gap now uses `backdrop-filter: blur(6px)` with a masked gradient, so the cut-off text is blurred rather than only faded.
- **v1.2.101 is published.** Content (two domains only; techlifeworld.com unchanged):
  - **Long-post “더보기” expander** on `shutupquick.com` / `deepstronglove.com` item views: a `.post-body.entry-content` taller than 900px gets `jt-expandable` (max-height 900px + fade) and a `더보기` button after it; clicking toggles `is-open`, the height, and the label `더보기`/`접기`. It also runs for infinite-scroll clones via a debounced MutationObserver and does not touch short posts.
  - Verified live on deepstronglove: short body 514px → 0 buttons; after appending a 2200px block the body clamps to 900px with a visible `더보기`; open → `max-height:none`/`접기`; close → 900px/`더보기`. On techlifeworld the same 2756px body gets no button.
- **v1.2.100 is published.** Content (domain-specific; techlifeworld.com behavior unchanged):
  - `shutupquick.com` and `deepstronglove.com` no longer use the `/p/home.html` landing. The home screen and the Home button resolve through `/`, fetch the newest post (`/feeds/posts/default?alt=json&max-results=1`), and `location.replace` to it. If the feed is empty (e.g. shutupquick), the blog listing stays.
  - `/p/home.html` on those two hosts redirects to the newest post (or `/` when empty). `24-home` skips rendering the landing on both hosts.
  - The left-menu fallback and PageList filter now hide `/p/home.html`, `/p/about.html`, `/p/contact-us.html` (and `/p/contact.html`) on those two hosts only. `techlifeworld.com` keeps Home/About/Contact and the landing.
  - Verified live: deepstronglove `/` → `/2026/11/fdsfds.html`; its rail shows only Home + All posts; shutupquick `/` stays (0 posts) with the same two links; techlifeworld `/` still → `/p/home.html` with landing and all four links.
- **v1.2.96 is published.** Content:
  - **Contact page trimmed**: the "김준동" name tag, the consultation-hours card (평일 09:00–18:00), and the address (대구광역시 달서구) were removed.
  - **Phone/email anti-crawl + click-to-reveal**: no plaintext phone/email/mailto/tel remains in `pages/contact.html`. Each contact is a blurred placeholder (`filter:blur(4px)`) whose value is XOR+base64 encoded in JS and decoded only on a human click; the first click reveals the text, the next opens `tel:`/`mailto:`. The "상담 문의하기" button also builds its mailto from the encoded value.
  - Verified live: before click `김준동`/hours/address/plain phone/plain email all absent, two blurred placeholders; after click the phone (`010-4361-6611`) and email (`ssii@naver.com`) reveal with correct `tel:`/`mailto:`; iframe height stable (810px), `scrollY` 0.
- **v1.2.95 is published.** Content:
  - **Contact auto-scroll fixed.** The contact iframe grew forever because `pages/contact.html` body has `min-height:100vh` + centered flex and the loader refit height on every iframe resize. `23-yt-posts` now injects `html,body{height:auto;min-height:0}` and top-aligns the iframe body, then sets a stable measured height. Verified live: iframe 950px constant for 8+ s, `scrollY` 0, no document-height growth.
  - **Contact quick nav at bottom center.** On `/p/contact-us.html` `#jtQuickNav` is `display:flex` horizontally, centered at `bottom:14px` (safe-area aware). It now carries `class=""`. Post pages keep the original right-edge vertical quick nav (the broad `item-view` hide from v1.2.94 was reverted).
- **v1.2.94 is published but superseded.** It introduced the contact frame-fit guard and briefly hid `#jtQuickNav` on every `item-view` page; v1.2.95 scopes the nav change to the contact page.
- **v1.2.93 is published.** Content:
  - **Contact/static pages are single-column with no side widgets.** On `/p/contact-us.html` the left menu rail (`#rd3Left`), its toggle (`#jtLeftToggle`), the right sidebar (`#ytPosts` / `.sidebar-container`), and the floating quick nav (`#jtQuickNav`) are hidden; the 3-column grid becomes a full-width block layout.
  - **Infinite scroll is hard-disabled on static pages.** `11-infinite` now returns immediately when `html.jt-static-page` is set, in addition to the existing `/p/` path check.
  - Verified live in a fresh isolated browser context: all five side elements compute `display:none`, the main container is `display:block` (1124px host, no horizontal overflow), and `#jtInfiniteFeed` is absent.
- **v1.2.92 is published.** Content:
  - **Infinite-scroll freeze fixed.** Post fetches now time out after 10 s (feed 12 s), the dead Edge API fallback is disabled, and a per-candidate 15 s watchdog skips a stalled URL. A hung request can no longer leave the “Loading more posts…” spinner running forever.
  - Verified live: normal scroll appended 11 posts with 0 errors; forcing `/2026/11/blog-post.html` to hang produced the loader at ~1 s and recovery at ~10.1 s, after which the next post appended and the loader hid.
- **v1.2.91 is published.** Content:
  - **`/search` cards show YouTube thumbnails**: when a post has no `media$thumbnail`, `normalize()` extracts the video id from the feed content/summary (`youtu.be`, `?v=`, `/embed/`, `/shorts/`, `/live/`) and uses `https://i.ytimg.com/vi/<id>/mqdefault.jpg` (16:9, 320×180). Snippets run through `cleanSnip()` so `[youtube ...]`, `[md]` and `[rede]` markers no longer appear.
  - Verified live: the "Tam Otomatik Vidalama…" card renders an `i.ytimg.com/.../mqdefault.jpg` image (naturalWidth 320, no `is-empty`), 3 YouTube cards all load, 0 cards contain `[youtube`, 0 console errors.
- **v1.2.90 is published.** Content:
  - **Quick nav and theme button docked to the right of the recommended-posts widget**: `dockQuickControls()` measures `#ytPosts` (fallback `.sidebar-container`) and sets both fixed elements' inline `right` so their left edge is 10px past the widget's right edge. Applies only at ≥1240px with an 8px minimum gap; otherwise the CSS defaults (right edge of the viewport, 14px/18px) remain.
  - v1.2.89 shipped the same feature but used `window.innerWidth`, which includes the scrollbar and pushed both controls 6px over the list. v1.2.90 uses `document.documentElement.clientWidth`.
  - Verified live (1964px viewport): `#ytPosts` right 1638.3, nav left 1647.3 (**+9px gap**), theme button left 1647.7 (0.3px aligned), both inside the viewport, zero overlap with the list, gap unchanged after scrolling.
- **v1.2.89 is published.** Content:
  - Initial quick-nav/theme-button docking implementation (see v1.2.90 for the scrollbar fix).
- **v1.2.88 is published.** Content:
  - **`/search` card titles are single-line**: `.jt-sp-title` now uses `white-space:nowrap; overflow:hidden; text-overflow:ellipsis` (was free-wrapping with `word-break:keep-all`). Cards became uniform height.
  - Verified live (hard reload): 20/20 titles are 21px tall (one line-height), 6 long titles show an ellipsis, cards are a uniform 180×171px, no horizontal overflow, 0 console errors.
- **v1.2.87 is published.** Content:
  - **`/search` top spacing**: `#jtSearchApp` top padding 4→**32px** on desktop (v1.2.86) and 4→**24px** inside the ≤640px block (v1.2.87), so the label chips are separated from the content above.
  - Verified live: `padding-top:32px`, `.jt-sp-bar` starts at y=32 with a ~31px gap above it, no horizontal overflow (scrollWidth = clientWidth).
- **v1.2.85 is published.** Content:
  - **Wider recommended-post text column with smaller type**: the right sidebar grid column is 280→**320px** (`--rd3-right-w`, the ≥1240px grid, and the collapsed-rail grid). In `#ytPosts`, the thumbnail is 159→**124px**, gap 12→10px, item height 101→**82px** (vertically centered), title 16→**14px**, meta 14→**12px**.
  - Verified live: `.yt-item` 82px tall / 303.3px wide, `.yt-thumb` 124px (69.8px tall, 16:9), title 14px with a **153.3px** text block (was ~93px), meta 12px, grid `176px 800px 320px`, no horizontal overflow (scrollWidth = clientWidth).
- **v1.2.84 is published.** Content:
  - **Hover preview requires an 0.8 s dwell**: `#ytPosts .yt-item` now starts the muted YouTube iframe only after `mouseenter` has been held for 800 ms (`setTimeout`). `mouseleave` clears the pending timer and removes any iframe, so cards swept over while scrolling never start playback.
  - Verified live on `/2026/11/blog-post.html`: 17 ms and 450 ms hovers produced 0 iframes (no insertion recorded by `MutationObserver`); a 2 s hover produced exactly one `youtube-nocookie` iframe at 817 ms; leaving removed the iframe and `.is-yt-hover`.
- **v1.2.83 is published.** Content:
  - **High-resolution YouTube thumbnails first**: `thumbSources` is now `maxresdefault.jpg` → `sddefault.jpg` → `hqdefault.jpg`. YouTube returns a 120×90 gray placeholder (HTTP 200) for videos without `maxres`, so `onload` checks `naturalWidth<=120` and advances to the next source.
  - Verified live on `/2026/11/blog-post.html`: `.jt-yt-thumb` src ends with `maxresdefault.jpg`, natural size 1280×720, fills the 16:9 box with no letterbox.
- **v1.2.82 is published.** Content:
  - **Left menu rail narrowed by 20%**: the effective left grid column is 220→**176px** at all desktop breakpoints (≥1240 and 1024–1239), `--rd3-left-w` 250→200px, and `#jtLeftToggle` `left` 220→176px. Verified live: rail 176px, center column +44px, labels unclipped, no horizontal overflow.
  - Note: `#jtLeftToggle` is `position:fixed` from the viewport edge, so on wide screens (max-width 1360 centered) it does not sit flush against the rail's right edge. This is pre-existing behavior, not introduced by v1.2.82.
- **v1.2.81 is published.** Content:
  - **Recommended-posts list (`#ytPosts`) scaled ~1.3×**: `.yt-item` 78→101px, thumbnail 122→159px, title 12.5→16px, meta 11→14px, gap/padding/radius adjusted. The JS measures item height, so the scroll step automatically becomes 103px. Verified live: 101px items, 159px thumbs, 16px titles; wheel advance still animates. Note: the list advances on wheel input only — there is no auto-timer.
- **v1.2.80 is published.** Content:
  - **Floating quick nav (`#jtQuickNav`) moved from bottom-center to the right edge, vertically centered**, so it no longer covers the `/search` page numbers. Buttons are 44px (icons 22px, 42px on ≤600px), the pill background is 50% transparent in both themes, and the border plus layered shadow were strengthened. Verified: nav rect never intersects the pager; right margin 14px, exact vertical center.
- **v1.2.79 is published.** Content:
  - **`/search` results are a responsive card grid**: 4 columns on desktop, 3 at ≤1100px, 2 at ≤900px, 1 at ≤640px. Cards are vertical (16:9 thumbnail on top, title/meta below). Verified live: desktop `179px ×4`, mobile `327px ×1`, no horizontal overflow.
- **v1.2.78 is published.** Content:
  - **Home mid-page freeze hardened.** The home landing subtree is cloned after hero typing; the clone kept the CSS classes but lost the JS expandos, so the reveal `IntersectionObserver` kept watching detached nodes and `#jt-about` / `.jt-cta` never received `is-in` (opacity stayed 0). A document-level reveal ticker (rAF on scroll/resize + 15×800 ms re-check) now reveals any `.jt-reveal` block in view regardless of node identity, and carousel/typing/ceremony init is re-run idempotently with clone-safe guards.
- **CDN status (`@v1`, measured 2026-11-21):** `23-yt-posts.css` **1.2.108**, `21-three-column.js` **1.2.106**, `24-home.js` **1.2.106**, `11-infinite.js` **1.2.93**, `11-infinite.css` **1.2.88**, `24-home.css` **1.2.85**, `21-three-column.css` **1.2.85**, `22-post-image.css` **1.2.85**, `pages/contact.html` **1.2.96**, but `23-yt-posts.js` is still cached at **1.2.105**. The `@v1` JS purge hit jsDelivr throttling (reset ~16:05 UTC); a wakeup is scheduled to purge and verify. s-maxage is 12 h, so the purge is required.
- **Blogger Pages restored on 2026-11-20**: `/p/resume.html` (page id `8369950385896197882`) and `/p/contact-us.html` (page id `3994593479765014806`) now return **HTTP 200**. Each page's content is a small inline iframe loader that renders the corresponding `pages/*.html` from jsDelivr inside `#jtStaticHost`; the Blogger page body itself is hidden by the existing `.jt-static-page` CSS.
- Build/checks currently pass: `node scripts/build.mjs`, `node scripts/build.mjs --check`, `node --check assets/js/11-infinite.js`, `node --check assets/js/23-yt-posts.js`, `node --check assets/js/24-home.js`, `git diff --check`.
- Live checks on 2026-11-20 (fresh isolated browser context):
  - Home landing: `.jt-landing` keeps `__jtReveal`, project card titles contain no raw shortcode, `#jt-projects` / `#jt-about` / `.jt-cta` reach `opacity:1` and `.is-in`, 0 console errors, no Turnstile/challenge requests.
  - YouTube post: poster + play button in the post view; clicking creates the iframe (612×344) with `loop=1&playlist`; infinite scroll appended posts with no active iframes inside clones; **0 Edge API requests** and 0 console errors.
  - Clone click-to-play: on `/2026/11/_1.html`, clicking the play button in a cloned vlog post produces a visible `iframe.jt-yt-frame` (652×367) and hides the poster; 0 console errors.
  - `/p/resume.html` and `/p/contact-us.html`: HTTP 200, iframe `srcdoc` mounted, resume/contact text present, `post-outer-container` hidden, titles set, and **0 console errors**. Contact shows `010-4361-6611` (`tel:01043616611`) and `ssii@naver.com` (`mailto:`); resume photo loads at 413px natural width.
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
- `v1.2.80`:
  - `#jtQuickNav` moved from bottom-center to `right:14px; top:50%; transform:translateY(-50%)` with a vertical layout, so it cannot cover the centered `/search` pager.
  - Buttons 36→44px (`svg` 22px; 42px/21px at ≤600px). Background alpha 0.5 in both themes; border `rgba(255,255,255,.6)` light / `.35` dark; layered shadow with an inset highlight.
  - Verified live on `/search` at 640px viewport: nav 57×107 rect, exact vertical center, 0 intersections with the pager at 50px scroll steps.
- `v1.2.81`:
  - `#ytPosts` list items scaled ~1.3×: `.yt-item` height/flex 78→101px, `.yt-thumb` 122→159px, title 12.5→16px, meta 11→14px, gap 9→12px, padding 6px 8px, radius 10px.
  - `measure()` in `23-yt-posts` derives the scroll step from the first item's height, so no JS change was needed (step becomes 103px with the 2px gap).
  - Live check on `/2026/11/blog-post.html` (after `cache:'reload'`): all 20 items 101px, thumb 159px, title 16px, meta 14px; wheel advance translates `-103px` with the 0.55s easing.
- `v1.2.82`:
  - Left rail 20% narrower: `@media (min-width:1240px)` grid `220px`→`176px`, `1024–1239` blocks `220px`→`176px`, `--rd3-left-w` 250→200px, `#jtLeftToggle` `left` 220→176px.
  - Verified live on `/search` at a 1964px viewport: `.rd3-left` 176px, center 840px (was 796px), right 280px, total 1328+padding = 1360; menu labels 165/165 (no clipping), 0 horizontal overflow, toggle at x=176.
- `v1.2.83`:
  - YouTube embed thumbnails request the highest available resolution first: `maxresdefault.jpg` → `sddefault.jpg` → `hqdefault.jpg`.
  - Because YouTube answers missing `maxres` images with a 120×90 gray placeholder (HTTP 200), `onload` checks `naturalWidth<=120` and falls through to the next source; `onerror` keeps the old behavior.
  - Verified live: `maxresdefault.jpg`, 1280×720, `object-fit:cover` inside the 16:9 box, no letterbox; a second post thumbnail also loaded at maxres.
- `v1.2.84`:
  - Hover preview on `#ytPosts` cards is delayed by 0.8 s: `mouseenter` starts an 800 ms `setTimeout` (`hoverTimer`) instead of inserting the iframe immediately; `mouseleave` clears the timer and removes iframes.
  - Guards: re-entering while a timer is pending or while `.is-yt-hover` is already set does nothing; the timer callback re-checks the class before creating the iframe.
  - Verified live: short hovers (17 ms / 450 ms) inserted 0 iframes; a sustained hover created one `youtube-nocookie` iframe after 817 ms; pointer exit removed it and cleared `.is-yt-hover`.
- `v1.2.85`:
  - Recommended-posts title area widened: right sidebar column 280→320px (`--rd3-right-w`, ≥1240px grid, collapsed-rail grid), `#ytPosts .yt-thumb` 159→124px, gap 12→10px, item 101→82px with `align-items:center`.
  - Type reduced: `.yt-title` 16→14px (line-height 1.36), `.yt-meta` 14→12px. The clamp stays at 2 lines.
  - Verified live after a hard reload: item 82×(303.3)px, thumb 124×69.8px, title 14px with a 153.3px text block, meta 12px, grid `176px 800px 320px`, scrollWidth == clientWidth (no horizontal overflow).
  - Reminder: jsDelivr `@v1` keeps a 7-day edge cache; visitors may need Ctrl+F5 after a release. Purge both the tagged path and the `@v1` path.
- `v1.2.86` / `v1.2.87`:
  - `/search` gets top breathing room: `#jtSearchApp` padding-top 4→32px on desktop (v1.2.86) and the `@media (max-width:640px)` override 4→24px (v1.2.87).
  - Verified live: computed `padding-top:32px`, `.jt-sp-bar` top at 32px with ~31px of clearance above, no horizontal overflow.
- `v1.2.88`:
  - `/search` result-card titles are clamped to one line: `.jt-sp-title` gains `white-space:nowrap; overflow:hidden; text-overflow:ellipsis` and loses `word-break:keep-all`.
  - Verified live: all 20 titles 21px tall (1 line), 6 ellipsized, uniform 180×171px cards, no horizontal overflow, 0 console errors.
- `v1.2.89` / `v1.2.90`:
  - `dockQuickControls()` + `bindDockControls()` dock `#jtQuickNav` and `#jtThemeToggle` to the right of `#ytPosts` (fallback `.sidebar-container`): both get an inline `right` so their left edge is 10px past the widget's right edge. Only at ≥1240px and when the resulting gap is ≥8px; on narrower screens or missing widgets the inline value is cleared and the CSS defaults apply.
  - v1.2.89 used `window.innerWidth`, which includes the scrollbar, so fixed `right` resolved against `clientWidth` and both controls overlapped the list by 6px. v1.2.90 switched to `document.documentElement.clientWidth`.
  - Verified live: gap +9px, nav/toggle left edges aligned within 0.3px, no overlap, viewport-safe, stable after scrolling.
- `v1.2.92`:
  - **Infinite-scroll “Loading more posts…” freeze fixed.** Root cause: `fetchPostText` had no timeout and fell back to the dead Edge API; a stalled request left `cache[u]` null, so `loadNext` polled forever while the loader stayed visible.
  - Fix: `withTimeout` (post 10 s, feed 12 s), `CFG.useEdge=false` (Edge is confirmed 404), a 15 s per-URL watchdog that marks a stalled candidate as failed and advances, and a try/catch around `build()` so an exception cannot strand `busy=true`.
  - Verified live: normal scroll appended 11 posts with 0 console errors; a forced hang on `/2026/11/blog-post.html` showed the loader at ~1 s and recovered at ~10.1 s, appending the next post and hiding the loader.
- `v1.2.91`:
  - `/search` cards use the YouTube video thumbnail when the feed has no `media$thumbnail`: `ytVideoId()` extracts the id from the post content/summary and the card uses `i.ytimg.com/vi/<id>/mqdefault.jpg` (16:9 320×180).
  - `cleanSnip()` strips `[youtube ...]`, `[md]` and `[rede]` markers from card snippets, so raw shortcodes no longer appear.
  - Verified live: the shortcode-only post now shows a 320×180 thumbnail, no `is-empty`, 3 YouTube cards load, 0 `[youtube` occurrences on the page, 0 console errors.
- Earlier R2 static hosting proposal was explicitly cancelled. Continue using GitHub/jsDelivr.

### Verification notes (2026-11-20/21, v1.2.63–91)

- v1.2.78–91 live checks are recorded in §1: home reveal ticker, `/search` responsive grid/spacing/single-line titles, high-resolution and fallback YouTube thumbnails, 0.8 s hover preview, recommended-list sizing, left-rail width, and quick-nav/theme-button docking.

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
- v1.2.92 infinite-scroll check: normal scroll on `/2026/11/_1.html` appended 11 posts with the loader hidden each time; a forced hang on the first candidate recovered in ~10.1 s, skipped it, appended the next post, and hid the loader with 0 console errors.
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

For a release, choose a version greater than the current latest tag (`v1.2.108`) and never reuse a tag:

```powershell
node scripts/release.mjs 1.2.97
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

- **Pending purge:** `@v1/assets/js/23-yt-posts.js` is still the 1.2.105 body (12 h s-maxage) because the purge API was throttled. A wakeup is scheduled for ~16:07 UTC to purge and verify 1.2.108 (search R2 thumbnails, image-click guard, related posts, blurred expander). The CSS already serves 1.2.108. All other assets and `pages/contact.html` are current.
- Turnstile remains disabled. A challenge was observed once after the v1.2.60 removal, but none was observed in the v1.2.76/77 live checks. Do not re-enable the gate without a user request.
- The home “loading stops midway” symptom is hardened in v1.2.78: reveal no longer depends on a single observer attached to one node, so a cloned/replaced landing still reveals `#jt-projects`, `#jt-about`, and `.jt-cta`. Verified in a fresh browser; cached visitors may need a hard refresh.
- The actual cloner of `.jt-landing` has never been identified with certainty (classes survive, expandos do not). Keep the ticker/guards in place; if a future change adds listeners to landing child nodes, re-bind them the same idempotent way.
- Resume print layout verified on 2026-11-20 with a real A4 PDF render: **3 pages**, no clipped forced breaks beyond `.career-section` / `.self-intro-section`. Printable output uses the real resume data; re-check if content length changes.
- `/p/resume.html` and `/p/contact-us.html` restored on 2026-11-20 as live Blogger Pages (HTTP 200) with page IDs `8369950385896197882` and `3994593479765014806`. The page body contains the inline jsDelivr iframe loader; if those pages are ever deleted again, recreate them with the same titles (`resume`, `contact-us`) and the loader content.
- No raw `[youtube ...]` post titles or labels remain as of 2026-11-20 (the one affected post was corrected through the Blogger API).
- Blogger admin-only work remains with the user: search description, custom robots.txt, page titles, Search Console address change for `madomiad.blogspot.com`.
