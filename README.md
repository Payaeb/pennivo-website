# pennivo-website

The landing page for [Pennivo](https://github.com/Payaeb/pennivo) — markdown, modernized.

Live at **[pennivo.app](https://pennivo.app)**.

## Stack

- Plain HTML, CSS, and vanilla JavaScript
- No build step, no framework, no dependencies
- Hosted on Cloudflare Pages
- Design tokens mirror `packages/ui/src/styles/tokens.css` from the main Pennivo repo

## Local development

Open `index.html` directly in a browser, or serve the directory with any static
file server. For example:

```bash
# Python 3
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit http://localhost:8000.

## Structure

```
.
├── index.html          # Single-page landing
├── styles.css          # All styles (light + dark via data-theme)
├── script.js           # Theme toggle + GitHub Releases fetcher
├── assets/
│   ├── logo.png        # 512px Pennivo logo
│   ├── favicon.ico
│   └── screenshots/    # App screenshots used on the page
└── _headers            # Cloudflare Pages cache headers
```

## Deploying

This site auto-deploys to Cloudflare Pages on every push to `main`.
No build command, no output directory — Cloudflare serves the repo root as-is.

## License

MIT — see the main [Pennivo repo](https://github.com/Payaeb/pennivo) for the
full license. Copyright © 2026 Paya Ebrahimi.
