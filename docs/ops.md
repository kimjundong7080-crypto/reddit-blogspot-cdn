# Environment, build and release operations

> Split out of the single-file `AGENTS.md` guide on 2026-11-27. Section numbers (§N) are preserved from the
> original, so older references such as "AGENTS.md §11" resolve through the map in [`../AGENTS.md`](../AGENTS.md).
> Per-release rows live in [`../CHANGELOG.md`](../CHANGELOG.md).
> Covers: §3, §4, §7, §9.

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

## 7. Build, validation, release, and cache procedures

Run from the repository root:

```powershell
node scripts/build.mjs
node scripts/build.mjs --check
node --check assets/js/11-infinite.js
node --check assets/js/23-yt-posts.js
git diff --check
```

For a release, choose a version greater than the current latest tag (`v1.2.117`) and never reuse a tag:

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

## Harness (local, offline)

`harness/rail.html` loads the built `assets/css|js/23-yt-posts.*` against a stubbed Blogger feed (24 + 20
items over two pages, then empty) so rail behaviour can be checked without the live sites:

```bash
python -m http.server 8123 --bind 127.0.0.1   # from the repository root
# then open http://127.0.0.1:8123/harness/rail.html
```

Two environment workarounds live in the page, not in `src/`: short `setTimeout` delays are routed through a
`MessageChannel` because a hidden tab clamps them to ~1 s (the rail adds one item per 40 ms), and tests can
inject `.yt-list{transition:none}` to read exact offsets. The preview browser cannot emulate a coarse
pointer, so the touch branch is exercised by re-applying the compiled
`@media (hover:none),(pointer:coarse)` block as `@media all`.

## 9. Local agent skills (Kilo)

Global skills live in `C:\Users\ssii\.kilo\skills\<skill-name>\SKILL.md` and are loaded by name + description. A newly added skill appears only after a Kilo restart or a new session.

- **`surgical-code-edit`** (added 2026-11-22): minimal, convention-preserving code changes with mandatory verification. Triggers on code modification/fix/refactor/patch requests ("코드 수정", "고쳐", "fix", "patch", "implement"); excludes review-only, plan-only, docs-only, and unrequested broad rewrites. Enforces stop conditions for ambiguity, destructive git/publish actions, external paths, secrets, and unrequested dependency/API changes. Workflow: LSP/grep locate → read local context → one- or two-line patch intent → minimal edit → project lint/typecheck/test/build (fallback syntax or smoke check) → concise report with `path:line` and evidence. File is 79 lines and follows progressive disclosure.
- **`token-budget`**: keeps context/cache usage low (LSP first, read ranges not whole files, summarize logs).
- **`agent-md-refactor`**: splits bloated instruction files into linked docs.

These skills are user-global configuration, not part of this repository; this section documents them for the next AI. Do not copy the SKILL.md files into the repo or the release.
