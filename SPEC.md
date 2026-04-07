# Mold Schema Specification v0.1

> AI-native web page description format.
> "HTML is for humans. Mold is for AI."

---

## 1. Top-Level Structure

Every Mold document is a JSON object with these top-level keys:

```json
{
  "mold": "0.1",
  "page": {
    "id": "portfolio",
    "title": "Gerald Yang — Builder",
    "description": "AI Solutions Builder portfolio",
    "lang": "en",
    "favicon": "favicon.svg"
  },
  "theme": { ... },
  "sections": [ ... ]
}
```

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `mold` | string | yes | Schema version |
| `page` | object | yes | Page metadata |
| `theme` | object | yes | Visual theme definition |
| `sections` | array | yes | Ordered list of page sections |

---

## 2. Theme

Themes define the visual language. AI picks a mood, engine handles the rest.

```json
{
  "theme": {
    "mood": "professional-dark",
    "accent": "amber",
    "fonts": {
      "display": "Syne",
      "body": "DM Sans",
      "mono": "JetBrains Mono"
    }
  }
}
```

### Built-in Moods

| Mood | Description |
|------|-------------|
| `professional-dark` | Dark bg, clean lines, tech feel |
| `professional-light` | Light bg, warm, editorial |
| `golden-hour` | Warm amber tones, Miyazaki-inspired |
| `minimal` | Maximum whitespace, minimal color |
| `bold` | High contrast, strong colors |

---

## 3. Sections

Sections are the building blocks of a page. Each section has a `type`.

```json
{
  "type": "hero",
  "id": "intro",
  ...section-specific properties
}
```

### Section Types

#### `hero` — Page header / introduction
```json
{
  "type": "hero",
  "id": "intro",
  "name": "Gerald Yang",
  "tagline": "Builder. Communicator. Maker.",
  "links": [
    { "label": "GitHub", "url": "https://github.com/GeraldYa" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/gerald-yang-ai" },
    { "label": "Email", "url": "mailto:gerald6331@gmail.com" }
  ],
  "cta": { "label": "Download Resume", "url": "resume.pdf", "style": "primary" }
}
```

#### `stats` — Numeric highlights
```json
{
  "type": "stats",
  "id": "numbers",
  "items": [
    { "value": "7+", "label": "Production Services" },
    { "value": "5", "label": "AI Agents Deployed" },
    { "value": "10+", "label": "Years in Tech" },
    { "value": "9+", "label": "Years Client-Facing" }
  ],
  "animate": true
}
```

#### `timeline` — Career / story timeline
```json
{
  "type": "timeline",
  "id": "story",
  "heading": "My Story",
  "entries": [
    { "year": "2015", "text": "Small computer shop. Fixed machines, sold tech, learned people." },
    { "year": "2018", "text": "Store Manager. Revenue up 100%+." },
    { "year": "2022", "text": "Geek Squad field tech by day. 3D printing maker by night." },
    { "year": "2025", "text": "Self-taught code. 6 months to 10 production services." },
    { "year": "Now", "text": "Looking for a team that values builders who communicate.", "pulse": true }
  ]
}
```

#### `cards` — Grid of project/content cards
```json
{
  "type": "cards",
  "id": "projects",
  "heading": "Projects",
  "columns": 3,
  "expandable": { "visible": 6, "label": "Show 4 more" },
  "items": [
    {
      "title": "Multi-Agent AI Platform",
      "tech": "Claude API / Telegram / Docker",
      "description": "5 specialized AI agents with autonomous task execution...",
      "image": "screenshots/multi-agent.jpg",
      "icon": "🤖",
      "link": { "label": "View on GitHub", "url": "https://github.com/..." }
    }
  ]
}
```

#### `skills` — Tag cloud / skill list
```json
{
  "type": "skills",
  "id": "techstack",
  "heading": "Tech Stack",
  "tags": ["Claude API", "Node.js", "Python", "Docker", "Linux", "Git"]
}
```

#### `experience` — Work history
```json
{
  "type": "experience",
  "id": "work",
  "heading": "Experience",
  "items": [
    {
      "title": "Geek Squad Field Agent",
      "org": "Best Buy Canada",
      "period": "Oct 2022 - Present",
      "description": "Self-directed field technician..."
    }
  ]
}
```

#### `education` — Education and certs
```json
{
  "type": "education",
  "id": "edu",
  "heading": "Education",
  "items": [
    { "title": "Bachelor of Arts in Economics", "org": "Brock University", "year": "2016" },
    { "title": "Certifications", "detail": "CompTIA A+ (2023) / Apple ATLAS" }
  ]
}
```

#### `writing` — Blog / publications
```json
{
  "type": "writing",
  "id": "writing",
  "heading": "Writing",
  "items": [
    {
      "title": "Tokenomic: REPRICED by AI",
      "description": "Published book (Amazon, Feb 2026).",
      "image": "book-cover.jpg",
      "link": { "label": "View on Amazon", "url": "https://a.co/..." }
    },
    {
      "title": "How I Built a 5-Agent AI Platform",
      "description": "Architecture decisions and lessons learned.",
      "link": { "label": "Read Article", "url": "blog-multi-agent.html" }
    }
  ]
}
```

#### `features` — Highlight cards (Beyond Code style)
```json
{
  "type": "features",
  "id": "beyond",
  "heading": "Beyond Code",
  "items": [
    { "icon": "🎓", "title": "Tech Communicator", "description": "9+ years explaining complex technology..." },
    { "icon": "🤝", "title": "Client-Facing", "description": "Thousands of consultations..." }
  ]
}
```

#### `contact` — CTA / contact section
```json
{
  "type": "contact",
  "id": "connect",
  "heading": "Let's Connect",
  "text": "I ship products, explain technology, and solve real problems.",
  "links": [
    { "label": "Email", "url": "mailto:gerald6331@gmail.com" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/gerald-yang-ai" }
  ]
}
```

#### `footer` — Page footer
```json
{
  "type": "footer",
  "text": "© 2026 Gerald Yang — Built with purpose."
}
```

---

## 4. Engine Behavior

- Engine reads JSON → generates DOM → applies theme
- Each section type has a registered renderer
- Theme mood maps to CSS variables
- `animate: true` triggers scroll-reveal animations
- `expandable` adds show/hide toggle for card grids
- Images with missing files auto-fallback to icon
- Responsive: 3-col → 2-col → 1-col automatic

---

## 5. API Contract (Preview)

```
GET    /api/page/:id              → full page JSON
PUT    /api/page/:id              → replace full page
GET    /api/page/:id/section/:sid → single section
PUT    /api/page/:id/section/:sid → update section
POST   /api/page/:id/section      → add section
DELETE /api/page/:id/section/:sid → remove section
```

---

*Mold Schema v0.1 — April 2026*
