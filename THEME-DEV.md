# Mold Theme Development Guide

> How to create a custom Mold theme plugin.

---

## Overview

A Mold theme is a single JavaScript file that registers itself with the core engine. It controls everything visual: colors, fonts, layouts, spacing, hover effects, and how each section type renders.

The core engine handles: JSON parsing, DOM helpers, animation, i18n, lightbox, scroll-reveal.
Your theme handles: what it looks like.

---

## Minimal Theme (Start Here)

```javascript
// my-theme.theme.js
(() => {
  const { el, linkIcon } = Mold;

  // 1. Define moods (color palettes)
  const MOODS = {
    'my-dark': {
      '--bg': '#111',
      '--card': '#222',
      '--text': '#eee',
      '--accent': '#ff6600',
      '--border': '#333',
    }
  };

  // 2. Define CSS
  function generateCSS() {
    return `
      .mold-root { font-family: sans-serif; }
      .mold-section { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
      .mold-hero__name { font-size: 3rem; font-weight: 700; }
      /* ... your styles ... */
    `;
  }

  // 3. Define section renderers
  function renderHero(data) {
    const section = el('section', 'mold-section mold-hero');
    section.appendChild(el('h1', 'mold-hero__name', { text: data.name }));
    if (data.tagline) section.appendChild(el('p', 'mold-hero__tagline', { text: data.tagline }));
    return section;
  }

  function renderFooter(data) {
    const footer = el('footer', 'mold-section mold-footer');
    footer.textContent = Mold.t(data.text) || '';
    return footer;
  }

  // 4. Register everything
  Mold.registerTheme('my-theme', {
    moods: MOODS,
    defaultMood: 'my-dark',
    generateCSS,
    applyTheme: (theme, container) => {
      // Apply CSS variables from mood
      const mood = MOODS[theme.mood] || MOODS['my-dark'];
      Object.entries(mood).forEach(([k, v]) => container.style.setProperty(k, v));

      // Inject CSS
      let style = document.getElementById('mold-theme-styles');
      if (!style) { style = document.createElement('style'); style.id = 'mold-theme-styles'; document.head.appendChild(style); }
      style.textContent = generateCSS();
    }
  });

  // 5. Register section renderers
  Mold.registerSection('hero', renderHero);
  Mold.registerSection('footer', renderFooter);
  // Register all 11 types...
})();
```

---

## Core Utilities Available

Your theme can use these from the `Mold` global:

| Utility | Description |
|---------|-------------|
| `Mold.el(tag, classNames, attrs)` | Create DOM element. `attrs.text` auto-translates via i18n. |
| `Mold.linkIcon(label)` | Returns SVG icon HTML for "GitHub", "LinkedIn", "Email", etc. |
| `Mold.createImage(src, icon, wrapClass, imgClass, fallbackClass)` | Image with icon fallback on error. |
| `Mold.animateCounter(element, rawValue)` | Animate number counting up (e.g. "7+" → 0→7). |
| `Mold.openLightbox(src)` | Open image in fullscreen lightbox overlay. |
| `Mold.t(value)` | Translate: returns string if string, picks current language if i18n object. |

---

## Section Types to Implement

Your theme must register a renderer for each section type. Each receives the section's JSON data and must return a DOM element.

| Type | Data fields | Purpose |
|------|------------|---------|
| `hero` | name, tagline, links[], cta | Page header |
| `stats` | items[{value,label}], animate | Number highlights |
| `timeline` | heading, entries[{year,text,pulse}] | Career story |
| `cards` | heading, columns, expandable, items[{title,tech,description,image,icon,link}] | Project grid |
| `skills` | heading, tags[] | Skill tag cloud |
| `experience` | heading, items[{title,org,period,description}] | Work history |
| `education` | heading, items[{title,org,year,detail}] | Education |
| `writing` | heading, items[{title,description,image,link}] | Blog/publications |
| `features` | heading, items[{icon,title,description}] | Feature highlight cards |
| `contact` | heading, text, links[] | CTA section |
| `footer` | text | Page footer |

If you skip a section type, the core shows a fallback "no renderer" message.

---

## Renderer Function Signature

```javascript
function renderSectionType(data) {
  // data = the section JSON object
  // Must return a DOM element (usually <section>)
  
  const section = Mold.el('section', 'mold-section mold-my-section mold-reveal');
  // Build DOM...
  return section;
}

Mold.registerSection('sectionType', renderSectionType);
```

**Important:** Add `mold-section` class for spacing and `mold-reveal` class for scroll-reveal animation.

---

## CSS Variables Your Theme Should Define

The core expects these CSS variables on `.mold-root`:

| Variable | Description |
|----------|-------------|
| `--bg` | Page background |
| `--card` | Card/surface background |
| `--text` | Primary text color |
| `--text-secondary` | Muted text |
| `--accent` | Primary accent color |
| `--accent-glow` | Accent with low opacity (for shadows) |
| `--border` | Border color |
| `--font-display` | Display/heading font |
| `--font-body` | Body text font |
| `--font-mono` | Monospace font |

---

## Theme Registration

```javascript
Mold.registerTheme('theme-name', {
  moods: { ... },           // Color palettes object
  defaultMood: 'mood-name', // Fallback if JSON doesn't specify mood
  generateCSS: () => '...', // Returns CSS string
  applyTheme: (themeConfig, container) => {
    // Called during render
    // Apply CSS variables, inject styles, load fonts
  }
});
```

---

## Loading Your Theme

```html
<script src="https://moldpage.dev/engine/mold-core.js"></script>
<script src="your-theme.theme.js"></script>
<script>
  Mold.render(pageJson, document.getElementById('mold-root'));
</script>
```

Core must load first. Theme self-registers on load. Then `render()` uses the registered theme.

---

## Tips

- Study `themes/golden-hour.theme.js` as a complete reference implementation
- Start with the minimal example above, add sections one at a time
- Use `Mold.el()` for all DOM creation — it handles i18n automatically
- Add `mold-reveal` class to sections for entrance animations
- Test with the example JSON: `example-portfolio.mold.json`
- Your theme CSS should be self-contained — don't depend on external stylesheets

---

## Custom Section Types

The 11 built-in types (hero, stats, cards, etc.) cover most portfolio/personal sites. But you are **not limited to these**.

Register any custom type:

```javascript
// Define a new section type
function renderGallery(data) {
  const section = Mold.el('section', 'mold-section mold-gallery mold-reveal');
  // Build your gallery DOM...
  data.images.forEach(img => {
    section.appendChild(Mold.createImage(img.src, '🖼️', 'gallery-item', 'gallery-img', 'gallery-fallback'));
  });
  return section;
}

// Register it
Mold.registerSection('gallery', renderGallery);
```

Then use it in JSON:
```json
{
  "type": "gallery",
  "id": "photos",
  "heading": "My Work",
  "images": [
    {"src": "photo1.jpg", "caption": "Project A"},
    {"src": "photo2.jpg", "caption": "Project B"}
  ]
}
```

The core engine doesn't care what the type is called or what data it contains — it just passes the JSON object to your renderer. **You define the schema, you define the rendering.**

Ideas for custom types:
- `gallery` — image grid/masonry
- `pricing` — pricing table with tiers
- `testimonial` — quote cards from clients
- `video` — embedded video player
- `faq` — accordion Q&A
- `map` — embedded map
- `cta-banner` — full-width call-to-action
- `logo-wall` — client/partner logos
- `blog-list` — article previews with dates

No limit on how many types a theme can register.

---

*Mold Theme Development Guide v1.0 — April 2026*
