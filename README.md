# Mold — The AI-Native Web Standard

> **HTML is for humans. Mold is for AI.**

Mold is a JSON-based web page format designed from the ground up for AI. Any AI can create, read, and modify Mold websites through a simple API — using 97% fewer tokens than traditional HTML editing.

**Live demo:** [moldpage.dev](https://moldpage.dev)

---

## The Problem

Every time AI edits a website, it reads hundreds of lines of HTML, figures out what to change, rewrites the code, and hopes nothing breaks. That's thousands of tokens burned for one small edit.

## The Solution

Mold replaces HTML with structured JSON. AI doesn't wrestle with `<div class="card">` — it sends one API call:

```bash
# Change the hero tagline — one request, 100 tokens
curl -X PUT /api/page/portfolio/section/intro \
  -d '{"tagline": "Builder. Communicator. Maker."}'
```

**That's it.** No file reading. No parsing. No rewriting. 100 tokens instead of 3,500.

---

## How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Any AI     │───▶│   Mold API   │───▶│  mold.js     │
│  (free tier  │    │  (JSON CRUD) │    │  (renders    │
│   works)     │◀───│              │    │   in browser)│
└──────────────┘    └──────────────┘    └──────────────┘
```

1. **Mold Schema** — Your website described in clean JSON. No HTML, no CSS.
2. **Mold Engine** (`mold.js`) — 55KB browser runtime that renders JSON into a beautiful webpage.
3. **Mold API** — HTTP endpoints for AI to create/read/update/delete anything on the page.

---

## Create a Website in 3 Steps

**You don't need to know JSON, APIs, or code.** Just talk to your AI.

### Step 1: Paste the recipe
Give [`recipe-developer-portfolio.md`](recipe-developer-portfolio.md) to any AI chatbot (ChatGPT, Gemini, Grok, Claude — even free tiers).

### Step 2: Answer questions
The AI asks your name, title, projects, skills. You answer in plain language.

### Step 3: Get your site
The AI generates a complete HTML file. Upload to GitHub Pages — your site is live in 2 minutes.

---

## Tested With

| Model | Free? | Correct API call? |
|-------|-------|--------------------|
| ChatGPT (free) | ✅ | ✅ First try |
| Gemini Flash | ✅ | ✅ First try |
| Grok Flash | ✅ | ✅ First try |
| Claude Opus | Paid | ✅ First try |

**4/4 models, 100% success rate.** Even the cheapest AI models can operate Mold perfectly — because the API docs are designed for machines, not humans.

---

## Token Economics

| Operation | HTML | Mold | Savings |
|-----------|------|------|---------|
| Change a title | ~3,500 tokens | ~100 tokens | **97%** |
| Read page structure | ~2,400 tokens | ~200 tokens | **92%** |
| Read API docs | ~1,700 tokens | ~560 tokens | **67%** |
| Create page from scratch | ~10,000 tokens | ~1,000 tokens | **90%** |

When AI does the building, token cost is the #1 metric. Mold makes every operation 10-35x cheaper.

---

## Two API Docs — Human + AI

Mold ships with two documentation files for the same API:

| | `API-DOCS.md` | `API-AI.md` |
|---|---|---|
| For | Humans | AI models |
| Tokens | ~1,700 | ~560 |
| Style | Formatted, explained | Compressed, structured |
| Purpose | Understanding | Execution |

The AI version is 67% smaller. Feed it to a cheap model and it performs like an expensive one.

---

## Built-in Themes

| Mood | Vibe |
|------|------|
| `golden-hour` | Warm amber, twilight, cinematic |
| `professional-dark` | Dark, purple accent, tech feel |
| `professional-light` | Clean, editorial, warm |
| `minimal` | Maximum whitespace |
| `bold` | High contrast, saturated |

Switch themes with one API call:
```bash
curl -X PUT /api/page/portfolio/meta \
  -d '{"theme": {"mood": "golden-hour"}}'
```

---

## Section Types

Build pages from 11 composable section types:

| Type | Purpose |
|------|---------|
| `hero` | Page header with name, tagline, links |
| `stats` | Animated number highlights |
| `timeline` | Career/story timeline with pulse animation |
| `cards` | Project grid with images, expand/collapse |
| `skills` | Tag cloud |
| `experience` | Work history |
| `education` | Degrees and certifications |
| `writing` | Blog posts and publications |
| `features` | Highlight cards with icons |
| `contact` | CTA with links |
| `footer` | Page footer |

---

## Multi-language (i18n)

Any text field supports instant multi-language:

```json
// Single language
"tagline": "Builder. Communicator. Maker."

// Multi-language — engine auto-switches
"tagline": {
  "en": "Builder. Communicator. Maker.",
  "zh": "建造者。沟通者。创客。",
  "fr": "Créateur. Communicateur. Maker."
}
```

---

## Free Hosting

**Option 1: GitHub Pages (free, unlimited)**
1. Save generated HTML as `index.html`
2. Push to `yourusername.github.io` repo
3. Enable Pages in Settings
4. Live in 2 minutes

**Option 2: moldpage.dev (free, first 100 sites)**
We host it for you. Just send the output.

---

## Files

```
mold/
├── mold.js                          # Rendering engine (55KB)
├── SPEC.md                          # Schema specification
├── API-DOCS.md                      # Human-readable API docs
├── API-AI.md                        # AI-optimized API docs
├── recipe-developer-portfolio.md    # AI recipe for portfolio creation
├── example-portfolio.mold.json      # Complete example page
└── README.md
```

---

## The Thesis

Three waves of digitization:
1. **Paper → Digital files** (computers can store it)
2. **Text → Vectors** (AI can understand it)
3. **Interfaces → APIs** (AI can operate it)

Mold is wave three for the web. When AI does most of the building, the format should be designed for AI — not retrofitted from human-readable code.

> *"API-ification is not just an efficiency play. It's an economic one. When every AI interaction costs tokens, a 35x reduction in cost per operation isn't a feature — it's the entire point."*

---

## Author

Built by [Gerald Yang](https://geraldya.github.io) — AI Solutions Builder, author of [Tokenomic: REPRICED by AI](https://a.co/d/04EfeYcG).

Mold was born from building 10 production web services in 6 months and realizing that AI editing HTML is like a Formula 1 car driving on a dirt road. The road needed to change.

---

## License

MIT — free for personal and commercial use.
