# Feature map and shortcode reference

> Split out of the single-file `AGENTS.md` guide on 2026-11-27. Section numbers (§N) are preserved from the
> original, so older references such as "AGENTS.md §11" resolve through the map in [`../AGENTS.md`](../AGENTS.md).
> Per-release rows live in [`../CHANGELOG.md`](../CHANGELOG.md).
> Covers: §5, §10.

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
- Markdown sources are pre-processed by `jtFixTimeStamps()`: AI-style citations `[[mm:ss](url)]` become `[mm:ss](url)`, and `[[mm:ss]]` becomes `mm:ss` (v1.2.120). Keep this pass before `__jtPrepareYouTubeShortcodes`.
- YouTube video ID `lyFcrrULyN0` is valid; YouTube oEmbed and its thumbnail have been checked previously.
- Every embed uses click-to-play; the iframe is only created after a user click (autoplay removed in v1.2.76).
- Center autoplay measures the **clipped** box (v1.2.138): `clipRectOf()` intersects the embed with every `overflow`-clipping ancestor, so an embed inside a collapsed `[rede]` fold or a collapsed `.jt-expandable` plays when it is fully (≥98%) visible and is skipped when the fold cuts it. Collapsing pauses (iframe kept) and expanding rescans.
- Search uses client-side filtering/pagination after loading Blogger feed data.
- SEO code sets canonical, Open Graph/Twitter metadata, and JSON-LD. Blogger-host redirects/canonical handling are in this file.
- Favicons are hostname-selected (`assets/img/favicon/shutupquick/`, `assets/img/favicon/deepstronglove/`, otherwise the flat `assets/img/*` set); add a new brand by creating its folder and extending the `brandIcon` check.
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

## 10. Shortcode reference (v1.2.111)

All shortcodes are processed by `src/23-yt-posts.html` and work on all three domains (`techlifeworld.com`, `shutupquick.com`, `deepstronglove.com`) because they share the same `@v1` CDN asset.

| Shortcode | Syntax | Output | Autoplay |
|---|---|---|---|
| YouTube | `[youtube link="URL"]` | 16:9 poster + play button | No (click to play) |
| Shorts | `[shorts link="URL"]` or `[shorts "URL"]` | 9:16 centered, max 360px | Yes: muted, only while it is the centered video |
| Map (1 place) | `[map "address"]`, `[map 'address']`, `[map address]` | 16:9 Google Maps embed, one marker | No |
| Map (multiple) | `[map "A", "B", "C"]` | 16:9 Google Maps **directions/waypoint** embed; route with default markers (no custom icons) | No |
| Map (My Maps) | `[map url="https://www.google.com/maps/d/embed?mid=..."]` | 16:9 Google **My Maps** embed; multiple custom pins/icons | No |
| Markdown | `[md]` ... `[/md]` (pair, any position, repeatable) | Only the enclosed range is rendered as Markdown | - |
| Markdown (legacy) | `[md]` alone, no `[/md]` | Whole post rendered as Markdown, `[md]` line dropped | - |
| Fold | `[rede]...[/rede]` or `[rade]...[/rade]` | Collapsed block with a "more" button | - |

Behavior notes:

- `[youtube]` accepts `youtu.be/`, `watch?v=`, `/embed/`, `/shorts/`, `/live/` URLs and a raw 11-character video id. A `/shorts/` URL is automatically upgraded to the Shorts layout and autoplay behavior.
- **All autoplay is muted** (`mute=1`), including a manual click; do not describe it as audible playback. Center autoplay (v1.2.116 to v1.2.118) picks the embed nearest the viewport center and starts it after a 500 ms dwell; only that one plays and every other embed is paused with its position kept. v1.2.119 first suppressed autoplay inside collapsed `[rede]`/`[rade]` folds and collapsed `.jt-expandable` bodies; v1.2.138 replaced that blanket block with the clipped-visibility rule above. Shorts use a centered 9:16 box and the same muted player.
- v1.2.145: a `댓글 N` bar at the end of each post — `댓글 쓰기` opens the native Blogger comment form and `보이기`/`숨기기` toggles a YouTube-style list (round avatar, name, relative time) loaded from the comment feed.
- v1.2.145: `[map]` iframes stay visible inside infinite-feed clones and are only given a `src` once their box has real size.
- v1.2.147: the `/search` page drops both side columns — the left menu rail (`#rd3Left`, `.rd3-left`, `#jtLeftToggle`) and the right `sidebar-container`/`sidebar-wrapper` are hidden under `body.search-view`, and `.main_content_container` switches from the three-column grid to a full-width block capped at `--rd3-max` (1360px). Verified with the built CSS: rails `display:none`, centre 1233px inside a 1265px container at a 1281px viewport, no horizontal overflow.
- v1.2.147: shortcodes inside `[md] … [/md]` render as embeds wherever they sit. The shortcode is swapped for an opaque token before Markdown and restored in the DOM after parsing, so `**[map "…"]**` no longer leaves a `****` artefact, a map alone in a paragraph is lifted out of it, a map mid-sentence splits the paragraph around it, and region text that the HTML indented by four or more spaces is dedented instead of turning into a code block. A shortcode inside a fenced block or inline code stays text.
- v1.2.146: a `[map]` box uses the post image's box — `.post-body .jt-map-embed` is `calc(100% - 48px)` (`calc(100% - 32px)` at ≤600px) centred by auto margins, and inside `.markdown` it is `width:100%` with no side margin; the old 900px cap and the extra 32px inset are gone, so map, image and YouTube embed share one width and one left edge. The sidebar `#Label1` (`widget Label`) is hidden with `#Label1{display:none !important}` in `21-three-column`.
- v1.2.144: the rail reserves an 18px band above and below the ten cards for its edge fades, so the gradient never washes over the first or last card text.
- v1.2.143: the recommended/popular rail is a hover carousel again — ten cards visible, wheel/arrow keys move one card and fetch the next page (20 at a time) near the end; only a genuinely empty page hands the wheel back to the page scroll.
- v1.2.142: a `[map]`/`[youtube]`/`[shorts]` shortcode inside `[md] … [/md]` survives whichever script runs first — `restoreShortcodes()` rewinds an already-expanded embed to its token before the markdown source is built. The contact page (`pages/contact.html`) shows a `마우스 클릭` bubble above the blurred phone/e-mail buttons until they are clicked.
- v1.2.140: a 16:9 embed inside `.markdown` takes the parent's padded content box (`width:100%`, no extra 48px), so it is exactly as wide as a post image; Shorts keep their 360px box. The sidebar `#BlogArchive1` (`widget BlogArchive`, '자료실') is hidden from `21-three-column` — a CSS hide, because the theme XML is never edited.
- `[map]` uses keyless Google endpoints. One place → `https://maps.google.com/maps?q=<address>&t=m&z=13&hl=ko&ie=UTF8&iwloc=&output=embed` (v1.2.146 lowered the initial zoom from 15 to 13, because a street-level frame looked too tight for a single place). Multiple quoted places → `https://maps.google.com/maps?saddr=<first>&daddr=<second>+to:<third>&output=embed` (route; fallback link uses `https://www.google.com/maps/dir/?api=1&...`). `url="..."` → the supplied Google My Maps/Maps embed URL is used directly (host/path validated to `https://(www.|maps.)?google.*/maps...`); use it for multiple pins with per-pin icons/colours. Marker colours/icons cannot be customised on the keyless single/route embeds. Map state is stored as JSON in `data-map`; renderer falls back to a legacy address string for old cached HTML.
- `[md]` ... `[/md]` (v1.2.122) renders **only the range between the pair**; paragraphs outside it keep their HTML, including images and embeds. Several pairs are allowed and each is rendered separately. A `[md]` with no `[/md]` keeps the v1.2.121 whole-body behavior (this is what `auto_blogger` writes), so old posts are unchanged. Unpaired markers are stripped from the visible text. Leading `&nbsp;` that Blogger puts before an indented paragraph is stripped per line, so a `##` heading still becomes a heading. `<b>/<strong>`, `<i>/<em>`, `<a href>` and `<img>` inside the region are turned back into Markdown first, so they are not lost. The `[rede]`/`[rade]` fold also switches the post to Markdown rendering.
- Shortcodes are parsed in post bodies only; titles and labels are ignored (`[youtube ...]` is stripped from feed titles).
- YouTube timestamp citations pasted by AI summaries (`[[00:51](https://www.youtube.com/watch?v=...&t=51)]`) are normalized to a normal link showing `00:51`; a link-stripped `[[00:51]]` becomes plain `00:51` (v1.2.120). A destination URL containing `)` is not matched, so keep YouTube URLs intact.
- Shortcode parsing runs in both the Markdown path (`__jtPrepareYouTubeShortcodes`) and the HTML path (`run()`), including infinite-scroll clones.
- **Naver Clip is planned, not implemented** (`[clip "..."]`, `[naverclip "..."]`). See §12 for the working oEmbed URL, the `naver.me` resolution blocker, and the implementation plan.
