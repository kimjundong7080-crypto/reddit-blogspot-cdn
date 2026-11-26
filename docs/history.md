# History, remaining work and investigations

> Split out of the single-file `AGENTS.md` guide on 2026-11-27. Section numbers (§N) are preserved from the
> original, so older references such as "AGENTS.md §11" resolve through the map in [`../AGENTS.md`](../AGENTS.md).
> Per-release rows live in [`../CHANGELOG.md`](../CHANGELOG.md).
> Covers: §6, §11, §12, §13.

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

## 11. Remaining work and known issues (2026-11-23, v1.2.122)

1. **All autoplay is muted.** `playBox()` always builds the iframe with `mute=1` (plus `autoplay=1&loop=1`), including a manual play-button click. This is intentional for browser autoplay policy; do not describe playback as audible. If unmuted manual playback is ever wanted, change only the user-initiated path and re-test on all three domains.
2. **Search-engine registration is NOT done.** Google Search Console, Naver Search Advisor, Bing Webmaster Tools and Daum registration require account/DNS actions. Verified ready: `/sitemap.xml` (URLs plus lastmod), `/sitemap-pages.xml`, RSS (`/feeds/posts/default?alt=rss`), and `robots.txt` already lists `Sitemap: https://<domain>/sitemap.xml`. HTML meta-tag verification cannot be satisfied by this project because the head is injected by JavaScript; use DNS TXT verification (domain property), then submit the sitemaps. Re-check DNS propagation with `nslookup` after the user adds records.
3. **Favicon appearance can lag.** New sets live in `assets/img/favicon/shutupquick/` and `assets/img/favicon/deepstronglove/` (SVG, 16/32/48 PNG, ICO, 180px apple-touch) and are chosen by hostname; techlifeworld keeps the flat set. Browsers and Google search results cache favicons aggressively, so a stale icon after release is expected. The rasterizer and ICO packer used to generate the PNG/ICO files were a temporary script and were deleted; regenerate from the SVG sources if sizes change and never hand-edit PNG/ICO.
4. **Home rotation semantics.** Only `/` and `/p/home.html` on shutupquick/deepstronglove rotate. State lives in `localStorage` (`jt-home-rotation`: `hrefs`, `i`, `last`, `t`) with a 10-minute pool TTL; the first visit on a fresh browser shows the newest post, later visits advance one post and never repeat the previous one. The Home button and rail link still point at the newest post (v1.2.105/106 behavior). techlifeworld keeps `/` to `/p/home.html`. Clearing site data resets the sequence.
5. **Expander click-path coverage gap.** The `.jt-expandable` pause-on-click handler is gated by `JT_NO_LANDING` (shutupquick/deepstronglove) and cannot run on localhost, so it was verified indirectly: the same pause/rescan logic was exercised through the `[rede]` fold handler and the scroll/scan fallback. Live shutupquick showed 1 embed inside a collapsed expander with 0 players. If this area changes, test on a real domain.
6. **Vertical detection is URL-based.** Only `/shorts/` URLs and the `[shorts]` shortcode get the 9:16 layout; a vertical video linked as `watch?v=` or `youtu.be/` is treated as 16:9. Use `[shorts]`.
7. **Infinite-scroll clones.** Clones lose iframes during sanitization; the mount logic re-creates players when visible. Re-test with several Shorts posts after infinite scroll appends clones.
8. **No automated tests.** Verification is manual browser checks plus `node scripts/build.mjs`, `node scripts/build.mjs --check`, `node --check assets/js/23-yt-posts.js`, and `git diff --check`. Temporary harnesses (home rotation, collapsed autoplay, favicon mapping) were deleted; rebuild them if the logic changes.
9. **CDN purge lag.** jsDelivr `@v1` keeps a 12 h `s-maxage`; purge after the new tag is indexed. Early purges can still return an older `x-jsd-version`, and repeated purges can be throttled. Confirm the served version before declaring a release live. (v1.2.119 verified: resolve 1.2.119, JS header 1.2.119, CDN and local hashes equal.)
10. **Naver Clip embed is NOT implemented yet.** See §12; do not claim support until the `[clip]` shortcode and the resolver decision exist.
11. **`naver.me` cannot be expanded client-side** (CORS plus opaque redirect); a server-side resolver or a full `m.naver.com/shorts/?seedMediaId=...` URL is required.
12. **Naver player autoplay is not controllable** (the oEmbed page starts paused and ignores query parameters); plan click-to-play 9:16 instead.
13. **Live check limits for v1.2.119.** Playback was verified as player presence plus `data-paused` state, never audio, and autoplay is muted. Rotation was verified over three consecutive visits per domain in an incognito tab.
14. **Timestamp normalization limits.** `jtFixTimeStamps()` matches only `[[mm:ss](url)]`, `[[h:mm:ss](url)]` and `[[mm:ss]]`; a destination containing `)` is skipped and a bare `[00:01](url)` is already valid. It runs on the raw Markdown source, so it also applies inside `[rede]` folds but not to hand-written HTML posts that never enter the Markdown path.
15. **Untracked preview file.** `icon-preview.png` at the repo root is a report screenshot; it is not committed and can be deleted.

## 12. Naver Clip investigation (2026-11-22)

Request: treat `https://naver.me/x3cEg2Iw` like YouTube Shorts — centered inline playback.

Findings:

- `naver.me/x3cEg2Iw` returns a 302 to
  `https://link.naver.com/bridge?url=https%3A%2F%2Fm.naver.com%2Fshorts%2F%3FseedMediaId%3D<32 hex>%26serviceType%3DCLIP...&dst=naversearchapp://...`.
- The **working inline embed** is:
  `https://m.naver.com/shorts/oembed/?seedMediaId=<32 hex>&serviceType=CLIP`
  It renders the clip (verified with `4B440BBD4CA14AC8D3F3ED51FD7A4A9AC4E9`: video 720×1280, title/sound shown, starts paused with a mute control).
- These variants do **not** work: `?url=https://naver.me/...` (shows "비공개 또는 삭제되어 볼 수 없는 클립입니다"), `?url=<full m.naver URL>`, `oembed.json`, `tv.naver.com/oembed`, and extra `autoplay`/`mute` query parameters (video stays paused).
- `naver.me` has no public unshorten API. The Naver Open API `/v1/util/shorturl` only shortens and was discontinued 2024-11-28. `api.allorigins.win`, `corsproxy.io`, and `api.codetabs.com` were unavailable/401/522 from this environment.
- The repo has `cloudflare/shortlinks` (`techlifeworld-shortlinks`) with a `/15544` redirect route. A `/naver-resolve?url=...` endpoint could fetch `naver.me` with `redirect:"manual"`/`"follow"` server-side, parse `seedMediaId` from the `Location`/bridge HTML, and return JSON with CORS. It is **not implemented**, and `wrangler whoami` reports "You are not authenticated"; no `CLOUDFLARE_API_TOKEN`/`CF_*` env var is present. Deploying the worker needs the user to authenticate (`wrangler login`) or provide a token/route approval. The route would also need `www.techlifeworld.com/naver-resolve*` in `cloudflare/shortlinks/wrangler.toml`.

Implementation plan once unblocked:

1. Add `[clip "URL"]` / `[naverclip "URL"]` / `[naver "URL"]` to both shortcode paths and the scanned-post guard.
2. If the URL contains `seedMediaId=<32 hex>`, build the oembed iframe and reuse the `.jt-yt-embed.jt-shorts` 9:16 centered layout (height 640/max 360px). Do **not** promise autoplay.
3. If the URL is `naver.me/...`, call the resolver endpoint (preferred) or render a centered "네이버 클립 열기" card that links out. Never iframe `naver.me` directly: it shows the `link.naver.com` app-bridge page.
4. Add a poster/click-to-play button and a visible fallback link, similar to the map fallback, so blocked embeds still leave a usable action.
5. Verify on all three domains and update §10/§11.

## 13. Session record — 2026-11-24 (v1.2.125, v1.2.128, v1.2.129)

What happened, in order, so the next AI does not repeat it:

1. **v1.2.125 — dark-mode text.** Hand-written/pasted posts kept an inline `color:#1f1f1f` that beat `.post-body{color:#e6e8eb}` on the `#0f1113` background. Fix: `jtFixInlineTextColors()` replaces only colours under 3:1 contrast, stores the original in `data-jt-fix-color`, restores it in light mode, and re-runs on theme toggle / load / 600 ms / 2200 ms / a debounced `MutationObserver`. Verified on a local copy of `sa.html` and live on three domains.
2. **v1.2.126 → v1.2.128 — rail hover action.** Two attempts failed live because the Blogger theme styles these nodes with `!important`; the working recipe is an inner `<span class="yt-card">` surface plus `transform: … !important` on hover, scoped to `:not(.is-out)`, with `overflow:clip; overflow-clip-margin:14px` on `.yt-viewport` so the lifted card and its shadow are not clipped.
3. **Docs consolidation.** The three attempts had produced three CHANGELOG rows and three AGENTS bullets. They are now **one row (v1.2.128) and one bullet** describing only the final behavior plus the traps worth remembering; commit `a2ca75d` (docs only, pushed before the next release).
4. **v1.2.129 — one hover interaction on three surfaces.** The rail lift was extended to the left menu `.rd3-link` (new `--rd3-ring` variable, white in the dark `body.rd3-layout` block) and to `#jtSearchApp .jt-sp-item` (accent border + deeper shadow in dark). Both use `transform:…!important`, `:hover` + `:focus-visible`, and `prefers-reduced-motion` keeps colours only. Commit `e1ecdf7`, tag `v1.2.129`, purged and served as 1.2.129.
5. **Verification used, on all three domains** (`/search` carries both the left menu and the cards, so one tab per domain was enough): served CSS fetched and replayed as a class, then `getComputedStyle` — menu `matrix(1.02, 0, 0, 1.02, 0, -2)` at 169 px wide, cards `matrix(1.02, …)` at 223×245 (218×193 on techlifeworld), rest state `transform:none`, card counts 3/5/20.

Remaining work in this repo (nothing is broken; these are unverified or deferred items):

1. **Real-pointer check** of all three hover surfaces (rail, left menu, `/search` cards) — plus touch devices, where `:hover` sticks after a tap on some browsers.
2. **Reduced-motion and print** were not re-checked after v1.2.129; print styles (`@media print`) hide the rail per §5, but the new `transform` is worth one PDF render if anyone changes that area.
3. **`.rd3-link` hover inside the collapsed rail** (`body.jt-left-collapsed`) and at widths under 900 px: the 1.02 scale on a 169 px link is ~1.7 px per side and can overlap the `.rd3-left-inner` right border. Cosmetic; fix by lowering the scale for that breakpoint only if the user notices.
4. **Theme-level wiring is still user-only** (image mapping `22-post-image.js`, the shortlink Worker). Nothing in this session needed the theme XML, and the prohibited theme folder was not opened.
5. **Search-card hover on a page with no results / one card** was not exercised; the rule is a pure transform so a missing neighbour changes nothing, but the empty state was not re-tested after the change.
6. `icon-preview.png` at the repo root is still untracked (user's screenshot); do not commit or delete it without asking.

## 14. Session record — 2026-11-27 (v1.2.142 – v1.2.145)

Read this before touching the rail, the map shortcode, the markdown renderer or the comment block.

What shipped, in order:

1. **v1.2.142 — maps/videos disappearing from `[md]` posts.** The shortcode expander (`run()`) replaced `[map]`/`[youtube]` with placeholder divs before the markdown renderer ran, and the renderer strips HTML, so the embed vanished. `restoreShortcodes(root)` turns every `.jt-map-embed` back into its raw `[map ...]` token before `marked.parse`, so the renderer tokenises the shortcode itself. The same release added the `마우스 클릭` bubble on `pages/contact.html` (white pill + tail, 2.2 s float, hidden once `.is-revealed`).
2. **v1.2.143 — the rail shows ten cards.** `RAIL_LIMIT` was deleted; `RAIL_VISIBLE = 10` now means *how many cards are on screen*, not a total load cap. Feed paging stays at 20 entries, and `exhausted` may only be set by an empty feed response. With ten cards in a ten-card viewport `max = length - visible` is 0, so any load cap silently kills the wheel carousel.
3. **v1.2.144 — the rail fades stopped covering card text.** The viewport was exactly 838 px (ten cards × 84 px), so the 38 px edge gradients sat on the first and last titles. It is now `box-sizing:border-box; height:874px; padding:18px 0`, the gradients are 18 px inside those padding bands, and the icon-mode module keeps the same 874 px box. Harness: first card top 18, tenth card bottom 856, one wheel still gives `translateY(-84px)`.
4. **v1.2.145 — two changes in one release.**
   - **Maps inside infinite-feed clones.** `11-infinite.css` hides every iframe in a cloned post (`iframe:not(.jt-yt-frame)`), which also hid `[map]` iframes: the same map was `display:block` in the original post and `display:none` at 0×0 in the clone. Map iframes now carry `.jt-map-frame`, the selector excludes it, and a map iframe only receives its `src` once its box has a non-zero size (`revealMap` + `IntersectionObserver`, re-checked by `__jtRefreshMaps()` when an `ify-fold`/`jt-expandable` opens), so a hidden box can no longer load a blank Google Maps frame.
   - **YouTube-style comment bar at the end of every post.** `댓글 N` + `댓글 쓰기` + `보이기`. Writing is the *native* Blogger form in an iframe (`blogger.com/comment/frame/<blogId>?po=<postId>&hl=ko&skin=contempo&isAmp=false`); the list is the per-post comment feed loaded with JSONP (`blogger.com/feeds/<blogId>/<postId>/comments/default?alt=json-in-script`), because that feed sends no CORS header. Blog and post ids come from the same-origin `/feeds/posts/default?alt=json&path=<pathname>`, so no theme XML was needed. Labels: closed → `댓글 쓰기`, open → `쓰기 취소`; `보이기` ⇄ `숨기기`. The state is kept in `writeOpen`/`listOpen` plus `syncWrite()` — an earlier `var open = form.hidden` read as if it were the *current* state and looked like swapped labels.

Remaining work and open issues (nothing here is broken; each item is unverified or deferred):

1. **No real comment has ever been rendered.** All three blogs report 0 comments, so the item layout (avatar, name, relative time, HTML body) was verified only with a fake feed in `harness/comments.html`. Next step: ask the user for approval to post one comment on a live post (or a draft), then confirm the list, the count, and that the iframe form actually submits.
2. **Replies render flat.** The comments feed returns replies as separate entries with `thr$in-reply-to`; each becomes a top-level row. If threading matters, group children under the parent entry by that field.
3. **The comment form has a fixed height** (440 px, 400 px under 768 px). Blogger normally resizes its iframe through its own helper script; we do not load it. Auto-height needs a `postMessage` listener that accepts only `blogger.com` origins.
4. **No refresh after posting.** The form is cross-origin, so a successful submit does not update the list or the count until the page reloads. A cheap improvement is a `focus` re-fetch on the tab regaining focus, or a manual refresh button.
5. **The bar is item-page only and dependent on one feed call.** It requires `body.item-view`, a `.post-body` outside `#jtInfiniteFeed`, and a successful `/feeds/posts/default?alt=json&path=` lookup. If that call fails there is no retry and no bar at all — a silent, non-fatal no-op that is hard to notice. Add a retry (or read the ids from the widget markup) if users report a missing bar.
6. **A blog with comments disabled** shows Blogger own notice inside the iframe; we have no fallback text. Check the Blog settings before promising the feature on a new domain.
7. **Every future iframe feature must join the clone rules.** `11-infinite.css` hides `iframe:not(.jt-yt-frame):not(.jt-map-frame)` inside `#jtInfiniteFeed`; a new embed without its own class disappears silently in cloned cards. Also add the new block to the `cleanClone` kill list if it must not be copied.
8. **`harness/_tmp_serve.mjs` was deleted** (it had been committed by accident in the v1.2.145 release and removed in `b805419`). Both harness pages need a tiny static server plus one fake `/feeds/posts/default` JSON, and `harness/comments.html` replaces `document.head.appendChild` to answer the JSONP callback. Recreate that file locally when re-testing; commit it only under a real name if the project wants it.
9. **Rail numbers came from a not-found page once.** The v1.2.144 measurements were taken on `techlifeworld.com/2026/11/blog-post_500.html`, which returns the 404 page (it still renders `#ytPosts`). The CSS is shared, but re-measure on a real post the next time the rail changes.
10. **jsDelivr `@v1` still lags by minutes.** After v1.2.145 the edge already served the new JS while `data.jsdelivr.com/resolved?specifier=v1` still answered `1.2.144`. Always confirm with `x-jsd-version` **and** the file body, not only the alias endpoint.
11. `icon-preview.png` at the repository root is still untracked (the user near screenshot); do not commit or delete it without asking.
