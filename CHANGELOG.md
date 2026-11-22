# JUST TECH CDN — Consolidated Work Log

Last updated: 2026-11-21 (UTC)
Repository: `reddit-blogspot-cdn`
Latest published release: **v1.2.113**

This is the consolidated English record for the work cycle that ended with v1.2.113.
Detailed handoff and operating rules remain in `AGENTS.md`.

## 1. Operating constraints

- Work is confined to the `15-2` task folder. Do not read or write other project folders.
- The Blogger theme XML files are **never read or edited**; they are very large and token-expensive.
- CDN assets are served from jsDelivr with the `@v1` major alias. Release tags are never reused.
- Do not publish (commit/tag/push/purge) without approval. All releases below were explicitly approved.

## 2. Release history

| Version | Commit | Summary |
|---|---|---|
| v1.2.67 | `dfd3d42` | Home mid-page stall fixed; Blogger feed called directly before the dead Edge API; unused Turnstile CSS removed. |
| v1.2.68 | `bc658aa` | `/p/resume.html` and `/p/contact-us.html` restored as live Blogger pages (HTTP 200); static pages excluded from item-view feed logic. |
| v1.2.69 | `623d9b2` | Infinite-scroll clones no longer hide the clicked YouTube player (`iframe:not(.jt-yt-frame)`). |
| v1.2.70 | — | Contact page real phone (`010-4361-6611`, `tel:`) and `mailto:` link; icon fixes. |
| v1.2.71 | `853d5e5` | All `/p/*.html` pages excluded from item-view logic; home project cards get poster fallbacks; resume photo uses an absolute URL. |
| v1.2.72 | `53b0dee` | Search/archive titles: `검색 \| JUST TECH`, `YYYY년 M월 아카이브 \| JUST TECH`. |
| v1.2.73 | `46a0529` | SEO metadata for static/search/archive pages; About `index`, resume/contact `noindex`; YouTube-only posts get a video thumbnail as `og:image`. |
| v1.2.74 | `dc9aca4` | New `JT` favicon set + head injection + `theme-color=#1f7a5c`; single-post loop parameter added. |
| v1.2.75 | `92a02dc` | Home feed cache key `jt-home-feed-v2` with a 5-minute TTL; new YouTube post published. |
| v1.2.76 | `439d500` | **Definitive YouTube fix**: single-post autoplay removed; every embed is poster + play button, iframe created only on click, then loops. |
| v1.2.77 | `9aa5b31` | Branded 404 page (recent posts, Home/Search buttons, noindex); infinite scroll skipped on `.status-msg-body` pages. |
| v1.2.78 | `d7c76ae` | **Home mid-page freeze hardened.** Landing subtree is cloned after hero typing, which detached the reveal `IntersectionObserver` and left `#jt-about`/`.jt-cta` at `opacity:0`. Added a document-level reveal ticker (rAF + 15×800 ms re-check), idempotent re-init of carousel/typing/ceremony, and clone-safe "already typed" guards. |
| v1.2.79 | `7a80b54` | **`/search` result cards are now responsive**: 4 columns on desktop → 3 at ≤1100px → 2 at ≤900px → 1 at ≤640px. Cards switched to a vertical layout (16:9 thumbnail on top, title/meta below). |
| v1.2.80 | `6002f4b` | **Quick nav moved and restyled**: no longer bottom-center (was overlapping the `/search` page numbers); now a vertical pill fixed at the right edge, vertically centered. Buttons 36→44px (icons 22px), background 50% transparent (`rgba(255,255,255,.5)` / `rgba(10,14,17,.5)`), stronger border + layered shadow. Verified: no intersection with pager at any scroll position. |
| v1.2.81 | `6483107` | **Recommended-posts list scaled ~1.3×**: `.yt-item` 78→101px, thumbnail 122→159px, title 12.5→16px, meta 11→14px. Scroll step (measured) becomes 103px; wheel-driven advance still animates. |
| v1.2.82 | `d5b2114` | **Left menu rail narrowed 20%**: effective grid column 220→176px at every desktop breakpoint, `--rd3-left-w` 250→200px, and `#jtLeftToggle` `left` 220→176px. Verified live: rail 176px, center column +44px, labels unclipped, no horizontal overflow. |
| v1.2.83 | `ba8073f` | **High-resolution YouTube thumbnails first**: `.jt-yt-thumb` now tries `maxresdefault.jpg` → `sddefault.jpg` → `hqdefault.jpg`. A 120px-wide placeholder (returned for videos without maxres) is detected and skipped. Verified: 1280×720 thumbnail, 16:9 filled, no letterbox. |
| v1.2.84 | `235e45d` | **Hover preview requires an 0.8 s dwell**: `#ytPosts .yt-item` starts the muted YouTube iframe only after an 800 ms `setTimeout`; `mouseleave` clears the timer and removes the iframe. Verified live: 17 ms / 450 ms hovers inserted 0 iframes, a sustained hover created one `youtube-nocookie` iframe at 817 ms, exit removed it. |
| v1.2.85 | `50183be` | **Wider recommended-post text column, smaller type**: right sidebar column 280→320px; `#ytPosts` thumbnail 159→124px, item 101→82px (centered), title 16→14px, meta 14→12px. Verified: text block 93→153.3px, item 82px, thumb 124×69.8px, no horizontal overflow. |
| v1.2.86 | `0402ee7` | **`/search` top space**: `#jtSearchApp` padding-top 4→32px so the label chips no longer sit flush against the content above. Verified: padding-top 32px, ~31px gap, no overflow. |
| v1.2.87 | `0588aef` | **`/search` mobile top space**: the `≤640px` override for `#jtSearchApp` padding-top 4→24px. Verified: `@v1` serves 1.2.87 with the mobile rule present. |
| v1.2.88 | `6df1995` | **`/search` card titles on one line**: `.jt-sp-title` now uses `white-space:nowrap; overflow:hidden; text-overflow:ellipsis`. Verified: 20/20 titles 21px tall, 6 ellipsized, uniform 180×171px cards, no horizontal overflow. |
| v1.2.89 | `28fb549` | **Quick nav + theme button docked beside the recommended posts**: `dockQuickControls()` positions both fixed elements 10px right of `#ytPosts`. Bug: used `window.innerWidth`, so both overlapped the list by 6px. |
| v1.2.90 | `3a07a44` | **Docking offset fixed**: measurement now uses `document.documentElement.clientWidth` (scrollbar excluded). Verified: +9px gap to `#ytPosts`, 0.3px alignment between the two controls, no overlap, stable after scrolling. |
| v1.2.91 | `9c73c0f` | **`/search` YouTube thumbnails**: posts without a `media$thumbnail` fall back to `i.ytimg.com/vi/<id>/mqdefault.jpg`, and snippets are stripped of `[youtube ...]`/`[md]`/`[rede]` markers. Verified: 320×180 thumbnail rendered, 0 raw shortcodes on the page, 0 console errors. |
| v1.2.92 | `28d0df8` | **Infinite-scroll freeze fixed**: post fetches time out after 10 s (feed 12 s), the dead Edge API fallback is disabled, a 15 s per-URL watchdog skips stalled candidates, and `build()` errors cannot strand `busy=true`. A forced hang recovered in ~10.1 s and appended the next post. |
| v1.2.93 | `c8d592d` | **Contact/static pages cleaned up**: the left rail, its toggle, the right sidebar (`#ytPosts`), and the floating quick nav are hidden; the grid becomes a full-width block. `11-infinite` also hard-skips `html.jt-static-page`. Verified live: all side elements `display:none`, no horizontal overflow, no infinite feed. |
| v1.2.94 | `c1c605c` | **Contact auto-scroll root cause fixed**: the iframe body's `min-height:100vh` plus resize-driven refit made the frame grow ~240px/0.5 s forever. `23-yt-posts` injects `min-height:0`/top alignment and sets a stable height. Also briefly hid `#jtQuickNav` on all `item-view` pages (reverted in v1.2.95). |
| v1.2.95 | `03b12e0` | **Contact quick nav + stable live fix**: `#jtQuickNav` on `/p/contact-us.html` is horizontal, centered at the bottom (14px), and has `class=""`; post pages keep the original right-edge nav. Verified live: iframe 950px constant for 8+ s, `scrollY` 0, no height growth, nav centered/bottom. |
| v1.2.96 | `db13aec` | **Contact page trimmed and contact details protected**: removed the `김준동` tag, consultation hours, and address. Phone/email are now blurred placeholders with no plaintext/`tel:`/`mailto:` in the source; values are XOR+base64 encoded and decoded on click (first click reveals, next dials/mails). Verified live: no plaintext before click, correct reveal after, iframe stable. |
| v1.2.97 | `3d1a7cb` | Release bookkeeping for the contact/privacy work (no functional change beyond version bumps). |
| v1.2.98 | `12b7407` | **Two-domain routing**: `shutupquick.com` / `deepstronglove.com` skip the `/p/home.html` landing, and their left menu drops Home/About/Contact page links; techlifeworld.com unchanged. |
| v1.2.99 | `a17c414` | **Home → newest post**: on the two domains `/` and `/p/home.html` read `/feeds/posts/default?alt=json&max-results=1` and redirect to the newest post (fallback `/` when empty). |
| v1.2.100 | `fc5746a` | **Menu fallback filter**: the hardcoded Home/All posts/About/Contact fallback is filtered too, so About/Contact links disappear on the two domains. |
| v1.2.101 | `b66397c` | **Long-post expander on the two domains**: post bodies over 900px clamp with a fade and a `더보기` button; clicking toggles `is-open`/`접기` and restores full height. Applies to infinite-scroll clones via MutationObserver; short posts and techlifeworld.com are unaffected. Verified live: 514px post → no button; 2200px block → 900px clamp + button; open → none; techlifeworld 2756px body → 0 buttons. |
| v1.2.102 | `07c9ece` | **Blurred cut-off area**: the collapsed expander's bottom gap grows to 120px and uses `backdrop-filter: blur(6px)` with a masked gradient (light/dark variants), so the clipped text is blurred rather than only faded. |
| v1.2.103 | `1b7e5ec` | **Search thumbnails from post content and related-post scoring (first pass)**: `normalize()` falls back to the first `<img>` in the feed content, and the recommended list starts using the current post's labels/title. |
| v1.2.104 | `43c94be` | **Related-post recommendations**: `loadRelatedContext()` reads DOM labels plus `/feeds/posts/default?alt=json&path=<path>` (2.5 s timeout), scores entries by label overlap ×5 and title-token overlap ×2 (CAD/YouTube +1), excludes the current post, and sorts each feed batch by score before rendering. |
| v1.2.105 | `7fa1d78` | **Cached latest-post routing**: the two domains cache the newest post URL in `localStorage` for 10 minutes; `/` and `/p/home.html` use the cache for an instant redirect, and the Home quick-nav button points at it. The rail also rewrites its Home link from the cache. |
| v1.2.106 | `91c95b1` | **Home-link sync**: after the first feed batch resolves, `jtApplyLatestLinks()` updates the quick-nav and rail Home links to the newest post immediately (not only on the next page load). |
| v1.2.107 | `ac59bf4` | **Image click guard**: `guardImageClicks()` unwraps `<a>` elements around post images (Blogger Google/R2/plain image URLs) while skipping landing, YouTube poster/thumb, and `jt-*`/`yt-*` anchors, so clicking an image no longer opens the original in a new window or the Blogger lightbox. Re-runs on load and on DOM mutations, including infinite-scroll clones. |
| v1.2.108 | `19dc992` | **Search thumbnails fixed for R2 images**: `/search` was reading `/feeds/posts/summary`, which omits post content and therefore all `<img>` tags. It now reads `/feeds/posts/default?alt=json&max-results=150`, so `firstImage()` finds R2 URLs. Verified with the v1.2.108 script: `청소` (1600px), `fdsfds` (1199px), and `test37` (1199px) thumbnails load; one post (`4325reff`) has only a `[이미지: ...]` text placeholder and no real image. |
| v1.2.109 | `f91c5b9` | **Domain-aware branding**: `src/23-yt-posts.html` picks SEO/site strings from a `BRAND` table by `location.hostname` — `techlifeworld.com` → JUST TECH, `shutupquick.com` → 삶의 지혜, `deepstronglove.com` → 일상의 즐거움 — covering `SITE`, home/item/about/contact descriptions, `alternateName`, static-page titles, and the 404 title/description (exposed as `window.__jtBrand`). `SELF_ORIGIN` now feeds JSON-LD `@id`/`url`, the canonical fallback and the favicon fallback so other domains no longer point at techlifeworld (`ORIGIN` is kept only for the `.blogspot.com` redirect). Dead code removed: never-called `initHomeHero()` and its unused `html.jt-home-page .jt-hero*` CSS (90 lines). Verified: brand selection per host, build/`--check`/`node --check`, and `@v1` serving 1.2.109 after purge. |
| v1.2.110 | `9183cf4` | **Google Maps embed shortcode** for all three domains: `[map "자연어 주소 또는 지명"]` becomes a responsive 16:9 `.jt-map-embed` with a keyless `https://www.google.com/maps?q=<address>&z=15&hl=ko&output=embed` iframe (lazy, `referrerpolicy=no-referrer-when-downgrade`). Handles double/single/unquoted forms and the malformed `[map "..."']`, in both the Markdown (`__jtPrepareYouTubeShortcodes`) and HTML (`run()`) paths, with the scanned-post guard extended to `[map`. Verified live by injecting shortcodes on deepstronglove and techlifeworld: iframes created with encoded addresses, `display:block`, 1.778 ratio; the Google endpoint returns 200. |
| v1.2.111 | `40e07f0` | **Vertical Shorts embeds** for all three domains: `/shorts/` YouTube links (via `[youtube link]`) and the new `[shorts link="..."]` / `[shorts "URL"]` shortcodes render a centered 9:16 `.jt-yt-embed.jt-shorts` box (max 360px wide) and start a muted, looping, `playsinline` iframe automatically **0.5 s** after mount. Off-screen Shorts wait for an `IntersectionObserver` (25% visible) instead of autoplaying; multiple Shorts may play muted at once, while normal videos keep the click-to-play poster. Verified live on techlifeworld (360×640, ratio 0.563, no iframe at 300 ms, autoplay iframe at ~1 s) and deepstronglove (autoplay after scrolling into view); normal video still requires a click. |
| v1.2.112 | `bdfd04e` | **Wider map/YouTube embeds**: regular `.jt-yt-embed` and `.jt-map-embed` changed from `width:min(calc(100% - 96px),820px)` to `min(calc(100% - 32px),900px)` (desktop) and from `calc(100% - 32px)` to `calc(100% - 24px)` at ≤768px, cutting the side margin roughly in half. Shorts keep their 360px centered width. Verified live on shutupquick `/2026/11/sssss.html`: the map and an injected YouTube embed are both 688px wide (387px tall) with 16px left/right gaps, up from 624px/48px gaps. |
| v1.2.113 | `01c31ae` | **Map visibility fallback**: map iframes now use the classic `https://maps.google.com/maps?q=...&t=m&z=15&hl=ko&ie=UTF8&iwloc=&output=embed` endpoint with `loading="eager"`. The map box shows the address as a centered placeholder (`.jt-map-note`) behind the iframe and a visible `Google 지도에서 열기` link (`.jt-map-fallback`, new tab) after it, so ad blockers/privacy extensions or Google-embed blocks still leave usable output. Verified live (688×387, iframe loaded) and with `maps.google.com` aborted: the address and fallback link remain visible. |

Documentation commits include: `2eacd93`, `487e4a6`, `943e9ce`, `3c03953`, `5ccdaba`, `82a8caf`, `1e91b15`, `ebf4003`.

Tooling note (2026-11-22): a user-global Kilo skill, `surgical-code-edit`, was added at `C:\Users\ssii\.kilo\skills\surgical-code-edit\SKILL.md` (79 lines). It standardizes minimal, convention-preserving code edits with mandatory lint/typecheck/test verification and explicit stop rules for ambiguity, destructive publishing, external paths, secrets, and unrequested dependency/API changes. It is not part of this repository or the release artifacts; see AGENTS.md §9.

Documentation addition (2026-11-22): added AGENTS.md §10 Shortcode reference (`[youtube]`, `[shorts]`, `[map]`, `[md]`, `[rede]`/`[rade]`) and §11 remaining work/known issues for the v1.2.111 Shorts-autoplay release.

## 3. Blogger data operations

- Restored pages:
  - `/p/resume.html` — page id `8369950385896197882`
  - `/p/contact-us.html` — page id `3994593479765014806`
  - Both return HTTP 200 and render their `pages/*.html` content through an iframe `srcdoc` loader.
- Fixed the only raw YouTube shortcode used as a post title: post id `2698047383991785144`, now “Tam Otomatik Vidalama Makinası ve 3 Robotlu Montaj Hattı”; the URL was unchanged.
- Published a new YouTube post:
  - Title: “두산 협동로봇 솔루션적용: 스크류 체결”
  - URL: `https://www.techlifeworld.com/2026/11/blog-post.html`
  - Post id `2105647337331496730`; video `4GL2ndz7etQ`; label `CAD`.
  - Body contains the `[youtube link="..."]` shortcode and a short Korean description.

## 4. Verification summary

- Home: reveal animation stays attached; project/about/CTA sections reach `opacity:1`; no broken images; no horizontal overflow at 390/768/1440 px.
- Home v1.2.78 re-check (fresh load after `cache:'reload'` of all nine CDN assets): after scrolling top→bottom, all five `.jt-reveal` blocks (`hero`, `#jt-services`, `#jt-projects`, `#jt-about`, `.jt-cta`) carry `is-in` with `opacity:1`; 0 sections remain hidden; carousel hover plays MP4 (`paused:false`, currentTime advancing); 0 console errors.
- YouTube: every embed shows a poster + play button with **0 iframes** before click; clicking creates one iframe at 612×344, `loop=1&playlist` active, no site console errors.
- Infinite scroll: appends posts, no autoplay inside clones, no Edge API requests, and no feed on 404 pages. Stalled post fetches are skipped after ~10 s, so the loader no longer spins forever.
- Static pages: resume/contact render, have `noindex, follow`, and load their photo/contact data correctly.
- 404: branded panel, three recent posts, `noindex, follow`, no stray infinite-scroll post; the only console error is the expected 404 resource.
- Favicon: SVG/16/32/ICO + apple-touch links injected on every page; assets return HTTP 200; `theme-color` is `#1f7a5c`.
- SEO: descriptive `og:title` on search/archive/static pages; About indexable; resume/contact noindex; video posts use the YouTube thumbnail for `og:image`.
- Carousel: 0 MP4 requests before hover; hover plays the first video; all six MP4 sources respond normally.

## 5. Deployment and cache state

- `@v1` currently serves: `23-yt-posts.js` **1.2.91**, `23-yt-posts.css` **1.2.88**, `11-infinite.js` **1.2.92**, `11-infinite.css` **1.2.88**, `24-home.js` **1.2.78**, and `24-home.css` / `21-three-column.css/js` / `22-post-image.css` **1.2.85**. Favicon assets are live.
- All required jsDelivr purges completed. **No pending purge or scheduled wakeup remains.**
- Working tree is clean.
- Home feed now uses a 5-minute cache (`jt-home-feed-v2`); old browsers may need a hard refresh to receive v1.2.76/77 scripts, and `@v1` assets can remain cached for up to seven days.

## 6. Known caveats

- The YouTube iframe may emit its own `compute-pressure` Permissions-Policy message after playback starts; it is generated by YouTube, not this site.
- A 404 page logs the expected 404 network error in DevTools; the branded panel still renders correctly.
- Turnstile remains disabled in the code. Do not re-enable it without an explicit request.
