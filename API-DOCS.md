# Mold API Documentation v0.1

> For AI agents: this document tells you exactly how to create and modify web pages through Mold's API. Every operation is one HTTP request.

Base URL: `http://localhost:3090`

---

## Quick Reference — Common Operations

| You want to... | Method | Endpoint | Body |
|----------------|--------|----------|------|
| Get the full page | GET | `/api/page/portfolio` | — |
| Change the page title | PUT | `/api/page/portfolio/meta` | `{"page":{"title":"New Title"}}` |
| Change the theme | PUT | `/api/page/portfolio/meta` | `{"theme":{"mood":"golden-hour"}}` |
| Change a heading | PUT | `/api/page/portfolio/section/intro` | `{"tagline":"New tagline"}` |
| Add a project card | POST | `/api/page/portfolio/section/projects/item` | `{"title":"My Project","tech":"Node.js","description":"..."}` |
| Delete a section | DELETE | `/api/page/portfolio/section/beyond` | — |
| Reorder a section | PUT | `/api/page/portfolio/section/story/move` | `{"to":1}` |

---

## Prompt → API Mapping Table

For cheap/fast AI models — just match the user's intent to the API call:

| User says | API call |
|-----------|----------|
| "Change my name to X" | `PUT /api/page/{id}/section/intro` body: `{"name":"X"}` |
| "Update my tagline" | `PUT /api/page/{id}/section/intro` body: `{"tagline":"X"}` |
| "Add a new project" | `POST /api/page/{id}/section/projects/item` body: `{"title":"...","tech":"...","description":"..."}` |
| "Remove the skills section" | `DELETE /api/page/{id}/section/techstack` |
| "Change theme to dark" | `PUT /api/page/{id}/meta` body: `{"theme":{"mood":"professional-dark"}}` |
| "Change accent color to blue" | `PUT /api/page/{id}/meta` body: `{"theme":{"accent":"blue"}}` |
| "Add a timeline entry" | `POST /api/page/{id}/section/story/item` body: `{"year":"2026","text":"..."}` |
| "Update the 3rd project" | `PUT /api/page/{id}/section/projects/item/2` body: `{"title":"..."}` |
| "Delete the last project" | `DELETE /api/page/{id}/section/projects/item/{last_index}` |
| "Move contact section to top" | `PUT /api/page/{id}/section/connect/move` body: `{"to":0}` |
| "Add Chinese translation" | `PUT /api/page/{id}/section/intro` body: `{"tagline":{"en":"...","zh":"..."}}` |
| "Change footer text" | `PUT /api/page/{id}/section/footer` body: `{"text":"New footer"}` |
| "Add a new section" | `POST /api/page/{id}/section` body: `{"type":"features","id":"new-section","heading":"...","items":[...]}` |

---

## Endpoints — Full Reference

### Pages

#### List all pages
```
GET /api/pages
```
Response:
```json
[{"id": "portfolio", "title": "Gerald Yang — Builder", "file": "portfolio.mold.json"}]
```

#### Get full page
```
GET /api/page/:id
```
Response: Complete Mold JSON document.

#### Create page
```
POST /api/page
Content-Type: application/json

{
  "mold": "0.1",
  "page": {"id": "my-site", "title": "My Site"},
  "theme": {"mood": "golden-hour", "accent": "amber"},
  "sections": []
}
```

#### Update full page
```
PUT /api/page/:id
Content-Type: application/json

{...complete Mold JSON...}
```

#### Delete page
```
DELETE /api/page/:id
```

---

### Page Metadata & Theme

#### Get metadata
```
GET /api/page/:id/meta
```
Response:
```json
{
  "page": {"id": "portfolio", "title": "...", "lang": "en"},
  "theme": {"mood": "golden-hour", "accent": "amber", "fonts": {...}}
}
```

#### Update metadata
```
PUT /api/page/:id/meta
Content-Type: application/json

{"page": {"title": "New Title"}}
```
Or change theme:
```json
{"theme": {"mood": "professional-dark", "accent": "blue"}}
```

---

### Sections

#### List sections
```
GET /api/page/:id/sections
```
Response:
```json
[
  {"id": "intro", "type": "hero"},
  {"id": "numbers", "type": "stats"},
  {"id": "story", "type": "timeline"},
  {"id": "projects", "type": "cards"},
  ...
]
```

#### Get section
```
GET /api/page/:id/section/:sid
```

#### Update section
```
PUT /api/page/:id/section/:sid
Content-Type: application/json

{"heading": "New Heading", "tagline": "New tagline"}
```
Note: merges with existing data. Only include fields you want to change.

#### Add section
```
POST /api/page/:id/section
Content-Type: application/json

{
  "type": "features",
  "id": "my-features",
  "heading": "Why Me",
  "items": [
    {"icon": "🚀", "title": "Fast Learner", "description": "..."}
  ]
}
```
Inserts before footer by default. Add `"_position": 3` to insert at specific index.

#### Delete section
```
DELETE /api/page/:id/section/:sid
```

#### Move section
```
PUT /api/page/:id/section/:sid/move
Content-Type: application/json

{"to": 2}
```
`to` is the target index (0-based).

---

### Items (Cards, Timeline entries, etc.)

#### Add item
```
POST /api/page/:id/section/:sid/item
Content-Type: application/json

{"title": "New Project", "tech": "Python", "description": "...", "icon": "🔥"}
```

#### Update item by index
```
PUT /api/page/:id/section/:sid/item/:index
Content-Type: application/json

{"title": "Updated Title"}
```
Index is 0-based.

#### Delete item by index
```
DELETE /api/page/:id/section/:sid/item/:index
```

---

## Section Types Reference

| Type | Required fields | Optional fields |
|------|----------------|-----------------|
| `hero` | `name` | `tagline`, `links[]`, `cta` |
| `stats` | `items[]` (value, label) | `animate` |
| `timeline` | `entries[]` (year, text) | `heading`, `pulse` on last entry |
| `cards` | `items[]` (title, description) | `heading`, `columns`, `expandable`, `tech`, `image`, `icon`, `link(s)` |
| `skills` | `tags[]` | `heading` |
| `experience` | `items[]` (title, org, period) | `heading`, `description` |
| `education` | `items[]` (title) | `heading`, `org`, `year`, `detail` |
| `writing` | `items[]` (title) | `heading`, `description`, `image`, `link` |
| `features` | `items[]` (icon, title) | `heading`, `description` |
| `contact` | `links[]` | `heading`, `text` |
| `footer` | `text` | — |

---

## Theme Moods

| Mood | Vibe |
|------|------|
| `professional-dark` | Dark bg, purple accent, tech feel |
| `professional-light` | Light bg, clean, editorial |
| `golden-hour` | Warm amber, twilight, Miyazaki-inspired |
| `minimal` | Maximum whitespace, minimal color |
| `bold` | High contrast, strong saturated colors |

## Accent Colors

`amber` · `purple` · `blue` · `green` · `red` · `rose` · `cyan`

---

## i18n (Multi-language)

Any text field can be a string OR a language object:

```json
// Simple (single language)
"tagline": "Builder. Communicator. Maker."

// Multi-language
"tagline": {
  "en": "Builder. Communicator. Maker.",
  "zh": "建造者。沟通者。创客。",
  "fr": "Créateur. Communicateur. Maker.",
  "es": "Constructor. Comunicador. Maker."
}
```

Engine automatically picks the right language. Add `page.languages` to enable the language switcher.

---

## Error Responses

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing required field) |
| 404 | Page/section/item not found |
| 500 | Server error |

All errors return: `{"error": "description"}`

---

## View Rendered Page

```
GET /view/:id
```
Returns HTML that loads mold.js and renders the page from the API.

---

*Mold API v0.1 — April 2026*
