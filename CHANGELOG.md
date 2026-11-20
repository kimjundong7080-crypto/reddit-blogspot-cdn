# JUST TECH CDN — Consolidated Work Log

Last updated: 2026-11-20 (UTC)
Repository: `reddit-blogspot-cdn`
Latest published release: **v1.2.81**

This is the consolidated English record for the work cycle that ended with v1.2.81.
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

Documentation commits: `2eacd93`, `487e4a6`, `943e9ce`, `3c03953`, `5ccdaba`.

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
- Infinite scroll: appends posts, no autoplay inside clones, no Edge API requests, and no feed on 404 pages.
- Static pages: resume/contact render, have `noindex, follow`, and load their photo/contact data correctly.
- 404: branded panel, three recent posts, `noindex, follow`, no stray infinite-scroll post; the only console error is the expected 404 resource.
- Favicon: SVG/16/32/ICO + apple-touch links injected on every page; assets return HTTP 200; `theme-color` is `#1f7a5c`.
- SEO: descriptive `og:title` on search/archive/static pages; About indexable; resume/contact noindex; video posts use the YouTube thumbnail for `og:image`.
- Carousel: 0 MP4 requests before hover; hover plays the first video; all six MP4 sources respond normally.

## 5. Deployment and cache state

- `23-yt-posts.js`, `23-yt-posts.css`, and `11-infinite.js` are **v1.2.77** at `@v1.2.77`; `23-yt-posts.css` is now **v1.2.79** (search grid). `24-home.js` is **v1.2.78** at `@v1`.
- All required jsDelivr purges completed. **No pending purge or scheduled wakeup remains.**
- Working tree is clean.
- Home feed now uses a 5-minute cache (`jt-home-feed-v2`); old browsers may need a hard refresh to receive v1.2.76/77 scripts, and `@v1` assets can remain cached for up to seven days.

## 6. Known caveats

- The YouTube iframe may emit its own `compute-pressure` Permissions-Policy message after playback starts; it is generated by YouTube, not this site.
- A 404 page logs the expected 404 network error in DevTools; the branded panel still renders correctly.
- Turnstile remains disabled in the code. Do not re-enable it without an explicit request.
