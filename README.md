# Mold — AI-Native Web Page Standard

> HTML is for humans. Mold is for AI.

Mold is a JSON-based web page format that lets any AI create and manage websites through APIs. 97% fewer tokens than editing HTML.

## How It Works

1. Describe your website in JSON (Mold Schema)
2. mold.js renders it into a beautiful webpage
3. AI modifies it through simple API calls — 100 tokens instead of 3,500

## Tested With

| Model | Free? | Works? |
|-------|-------|--------|
| Grok Flash | ✅ | ✅ |
| Gemini Flash | ✅ | ✅ |
| ChatGPT Free | ✅ | ✅ |
| Claude Opus | Paid | ✅ |

## Quick Start

Want a portfolio site? Give the `recipe-developer-portfolio.md` file to any AI chatbot. It will walk you through creating your site step by step.

## Files

- `mold.js` — Rendering engine (load via script tag)
- `SPEC.md` — Schema specification
- `API-DOCS.md` — Human-readable API docs
- `API-AI.md` — AI-optimized API docs (67% smaller)
- `recipe-developer-portfolio.md` — AI recipe for creating a portfolio
- `example-portfolio.mold.json` — Example Mold page

## License

MIT

---

Created by [Gerald Yang](https://geraldya.github.io) — Author of [Tokenomic: REPRICED by AI](https://a.co/d/04EfeYcG)
