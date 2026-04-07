/**
 * Mold Core Engine v0.2
 *
 * Core rendering engine — theme-agnostic.
 * Provides: DOM helpers, i18n, lightbox, scroll reveal, animation,
 * link icons, CSS variable injection, and render orchestration.
 *
 * Themes register themselves via:
 *   Mold.registerTheme(name, themeObj)
 *   Mold.registerSection(type, rendererFn)
 *
 * Usage:
 *   <script src="mold-core.js"></script>
 *   <script src="themes/golden-hour.theme.js"></script>
 *   <script>
 *     Mold.render(jsonObject, document.getElementById('mold-root'));
 *   </script>
 */
const Mold = (() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // Theme & Section Registries
  // ═══════════════════════════════════════════════════════════════════
  const _themes = {};
  const _sectionRenderers = {};

  function registerTheme(name, themeObj) {
    _themes[name] = themeObj;
  }

  function registerSection(type, rendererFn) {
    _sectionRenderers[type] = rendererFn;
  }

  // ═══════════════════════════════════════════════════════════════════
  // i18n
  // ═══════════════════════════════════════════════════════════════════
  let currentLang = 'en';
  let currentJson = null;
  let currentContainer = null;

  function t(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value[currentLang] || value['en'] || Object.values(value)[0] || '';
    }
    return String(value);
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('mold-lang', lang);
    if (currentJson && currentContainer) render(currentJson, currentContainer);
  }

  function createLangSwitcher(languages) {
    const wrap = document.createElement('div');
    wrap.className = 'mold-lang-switcher';
    wrap.innerHTML = `<button class="mold-lang-btn">${currentLang.toUpperCase()}</button><div class="mold-lang-menu"></div>`;
    const menu = wrap.querySelector('.mold-lang-menu');
    const btn = wrap.querySelector('.mold-lang-btn');
    languages.forEach(l => {
      const a = document.createElement('a');
      a.textContent = l.label || l.code;
      a.className = l.code === currentLang ? 'active' : '';
      a.onclick = () => { setLang(l.code); menu.classList.remove('show'); };
      menu.appendChild(a);
    });
    btn.onclick = () => menu.classList.toggle('show');
    return wrap;
  }

  // ═══════════════════════════════════════════════════════════════════
  // DOM Helper
  // ═══════════════════════════════════════════════════════════════════
  function el(tag, classNames, attrs) {
    const e = document.createElement(tag);
    if (classNames) {
      (typeof classNames === 'string' ? classNames.split(' ') : classNames)
        .filter(Boolean)
        .forEach(c => e.classList.add(c));
    }
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'text') e.textContent = t(v);
        else if (k === 'html') e.innerHTML = t(v);
        else e.setAttribute(k, typeof v === 'object' ? t(v) : v);
      });
    }
    return e;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Link Icons (SVG)
  // ═══════════════════════════════════════════════════════════════════
  function linkIcon(label) {
    const lbl = (label || '').toLowerCase();
    if (lbl.includes('github'))     return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
    if (lbl.includes('linkedin'))   return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';
    if (lbl.includes('email') || lbl.includes('mail')) return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
    if (lbl.includes('demo'))       return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    if (lbl.includes('amazon'))     return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
    if (lbl.includes('maker'))      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';
    if (lbl.includes('article') || lbl.includes('read')) return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
    if (lbl.includes('resume') || lbl.includes('download')) return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  }

  // ═══════════════════════════════════════════════════════════════════
  // Lightbox
  // ═══════════════════════════════════════════════════════════════════
  let lightboxEl = null;
  let lightboxImg = null;

  function initLightbox(root) {
    lightboxEl = el('div', 'mold-lightbox');
    lightboxImg = el('img', 'mold-lightbox__img');
    const closeBtn = el('button', 'mold-lightbox__close', { html: '&times;', 'aria-label': 'Close' });

    lightboxEl.appendChild(lightboxImg);
    lightboxEl.appendChild(closeBtn);
    root.appendChild(lightboxEl);

    function closeLightbox() {
      lightboxEl.classList.remove('mold-lightbox--active');
    }

    lightboxEl.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    lightboxImg.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function openLightbox(src) {
    if (!lightboxEl) return;
    lightboxImg.src = src;
    lightboxEl.classList.add('mold-lightbox--active');
  }

  // ═══════════════════════════════════════════════════════════════════
  // Image with Fallback (shared utility for themes)
  // ═══════════════════════════════════════════════════════════════════
  function createImage(src, icon, wrapClass, imgClass, fallbackClass) {
    const wrap = el('div', wrapClass);

    if (src) {
      const img = el('img', imgClass, { src, alt: '', loading: 'lazy' });

      img.addEventListener('error', () => {
        img.remove();
        if (icon) {
          const fb = el('div', fallbackClass, { text: icon });
          wrap.appendChild(fb);
        }
      });

      img.addEventListener('load', () => {
        wrap.style.cursor = 'pointer';
        wrap.addEventListener('click', () => openLightbox(src));
      });

      wrap.appendChild(img);
    } else if (icon) {
      const fb = el('div', fallbackClass, { text: icon });
      wrap.appendChild(fb);
    }

    return wrap;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Counter Animation
  // ═══════════════════════════════════════════════════════════════════
  function animateCounter(element, rawValue) {
    const match = rawValue.match(/^(\d+)/);
    if (!match) {
      element.textContent = rawValue;
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = rawValue.slice(match[0].length);
    const duration = 1200;
    const start = performance.now();

    element.textContent = '0' + suffix;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════════════════════════════
  // Scroll Reveal
  // ═══════════════════════════════════════════════════════════════════
  function initScrollReveal(root) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mold-visible');

            if (entry.target.hasAttribute('data-animate-counter')) {
              const statValues = entry.target.querySelectorAll('.mold-stats__value');
              statValues.forEach((sv) => {
                const raw = sv.getAttribute('data-value');
                if (raw && !sv._animated) {
                  sv._animated = true;
                  animateCounter(sv, raw);
                }
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    root.querySelectorAll('.mold-reveal').forEach((el) => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════════════════════
  // Theme Application (CSS variables)
  // ═══════════════════════════════════════════════════════════════════
  function applyTheme(themeConfig, root) {
    // Find the registered theme by mood name or fall back
    const themeName = themeConfig.mood || 'golden-hour';
    let themePlugin = null;

    // Search registered themes for one that handles this mood
    for (const [name, plugin] of Object.entries(_themes)) {
      if (plugin.moods && plugin.moods[themeName]) {
        themePlugin = plugin;
        break;
      }
    }

    if (!themePlugin) {
      // No theme handles this mood — try the first registered theme
      const firstKey = Object.keys(_themes)[0];
      if (firstKey) themePlugin = _themes[firstKey];
    }

    if (themePlugin && themePlugin.applyTheme) {
      themePlugin.applyTheme(themeConfig, root);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // Core CSS — theme-independent structural styles
  // ═══════════════════════════════════════════════════════════════════
  function generateCoreCSS() {
    return `
/* ===== Mold Core — Structural CSS ===== */

/* Reset & base */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --font-display: system-ui, sans-serif;
  --font-body: system-ui, sans-serif;
  --font-mono: monospace;
  --max-width: 900px;
  --section-gap: 56px;
  --radius: 16px;
  --radius-sm: 10px;
  --radius-pill: 20px;
  --transition: 0.25s ease;
  --transition-fast: 0.15s ease;
  --transition-entrance: 0.4s ease-out;
  --transition-emphasis: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  /* Fallback colors when no theme is loaded */
  --bg: #f5f5f5;
  --bg-secondary: #e8e8e8;
  --card: #ffffff;
  --card-hover: #fafafa;
  --card-border: #ddd;
  --text: #111;
  --text-secondary: #555;
  --text-muted: #888;
  --accent: #333;
  --accent-glow: rgba(0,0,0,0.05);
  --border: #ddd;
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06);
  --tag-bg: #eee;
  --tag-border: #ddd;
  --tag-text: #333;
  --scrollbar-thumb: #ccc;
  --scrollbar-track: #f5f5f5;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body, .mold-root {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  font-size: 0.95rem;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

.mold-root {
  min-height: 100vh;
  position: relative;
}

.mold-root > * {
  position: relative;
  z-index: 1;
}

/* Scrollbar */
.mold-root::-webkit-scrollbar { width: 5px; }
.mold-root::-webkit-scrollbar-track { background: var(--scrollbar-track); }
.mold-root::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
.mold-root::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* ===== Entrance Animations ===== */
@keyframes mold-fadeInUp {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes mold-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes mold-slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Layout ===== */
.mold-section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--section-gap) 32px;
}

/* ===== Scroll Reveal ===== */
.mold-reveal {
  animation: mold-fadeInUp 0.5s ease both;
  transition: opacity var(--transition-emphasis),
              transform var(--transition-emphasis);
}

.mold-reveal.mold-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.mold-stagger > * { transition-delay: calc(var(--i, 0) * 50ms); }

/* ===== LIGHTBOX ===== */
.mold-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 14, 23, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  cursor: zoom-out;
}

.mold-lightbox--active {
  opacity: 1;
  visibility: visible;
}

.mold-lightbox__img {
  max-width: 92vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--radius);
  box-shadow: 0 24px 64px rgba(15,14,23,0.3);
  transform: scale(0.96);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mold-lightbox--active .mold-lightbox__img {
  transform: scale(1);
}

.mold-lightbox__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
}

.mold-lightbox__close:hover {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.2);
}

/* ===== LANGUAGE SWITCHER ===== */
.mold-lang-switcher { position: fixed; top: 16px; right: 16px; z-index: 100; }
.mold-lang-btn {
  background: var(--card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-family: var(--font-mono);
  transition: all 0.2s;
}
.mold-lang-btn:hover { border-color: var(--accent); color: var(--accent); }
.mold-lang-menu {
  display: none;
  position: absolute;
  top: 42px;
  right: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px 0;
  min-width: 120px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(15,14,23,0.15);
}
.mold-lang-menu.show { display: block; }
.mold-lang-menu a {
  display: block;
  padding: 8px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mold-lang-menu a:hover { color: var(--accent); background: var(--accent-glow); }
.mold-lang-menu a.active { color: var(--accent); }

/* ===== Focus Accessibility ===== */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .mold-reveal { opacity: 1; transform: none; }
}

/* ===== No Theme Fallback ===== */
.mold-no-theme {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  font-family: var(--font-body);
}
.mold-no-theme__title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
}
.mold-no-theme__msg {
  font-size: 0.9rem;
}

/* ===== Responsive — Tablet ===== */
@media (max-width: 900px) {
  .mold-section {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* ===== Responsive — Mobile ===== */
@media (max-width: 600px) {
  :root { --section-gap: 40px; }
  .mold-section {
    padding-left: 16px;
    padding-right: 16px;
  }
}
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Main Render
  // ═══════════════════════════════════════════════════════════════════
  function render(json, container) {
    if (!json || !container) {
      console.error('[Mold] render() requires a JSON object and a DOM container.');
      return;
    }

    currentJson = json;
    currentContainer = container;

    // Restore saved language
    const savedLang = localStorage.getItem('mold-lang');
    if (savedLang) currentLang = savedLang;

    // Clean container
    container.innerHTML = '';
    container.classList.add('mold-root');

    // Inject core styles
    const existingStyle = document.getElementById('mold-engine-styles');
    if (existingStyle) existingStyle.remove();
    const style = document.createElement('style');
    style.id = 'mold-engine-styles';
    style.textContent = generateCoreCSS();
    document.head.appendChild(style);

    // Inject theme styles if a theme is registered
    const existingThemeStyle = document.getElementById('mold-theme-styles');
    if (existingThemeStyle) existingThemeStyle.remove();

    const themeConfig = json.theme || {};
    const themeMood = themeConfig.mood || 'golden-hour';
    let activeTheme = null;

    // Find theme plugin that handles this mood
    for (const [name, plugin] of Object.entries(_themes)) {
      if (plugin.moods && plugin.moods[themeMood]) {
        activeTheme = plugin;
        break;
      }
    }
    if (!activeTheme) {
      const firstKey = Object.keys(_themes)[0];
      if (firstKey) activeTheme = _themes[firstKey];
    }

    if (activeTheme) {
      // Inject theme CSS
      if (activeTheme.generateCSS) {
        const themeStyle = document.createElement('style');
        themeStyle.id = 'mold-theme-styles';
        themeStyle.textContent = activeTheme.generateCSS();
        document.head.appendChild(themeStyle);
      }

      // Apply theme variables
      if (activeTheme.applyTheme) {
        activeTheme.applyTheme(themeConfig, container);
      }
    }

    // Apply page metadata
    if (json.page) {
      if (json.page.title) document.title = json.page.title;
      if (json.page.lang)  document.documentElement.lang = json.page.lang;
      if (json.page.description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = json.page.description;
      }
      if (json.page.favicon) {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = json.page.favicon;
      }
    }

    // Initialize lightbox
    initLightbox(container);

    // Add language switcher if page has i18n
    if (json.page?.languages) {
      container.appendChild(createLangSwitcher(json.page.languages));
    }

    // Check if any section renderers are registered
    const hasRenderers = Object.keys(_sectionRenderers).length > 0;

    if (!hasRenderers) {
      // No theme loaded — show fallback
      const noTheme = el('div', 'mold-no-theme');
      noTheme.appendChild(el('div', 'mold-no-theme__title', { text: 'No theme loaded' }));
      noTheme.appendChild(el('p', 'mold-no-theme__msg', {
        text: 'Include a theme script (e.g. golden-hour.theme.js) to render this page.'
      }));

      // Still show raw section data as plain text
      (json.sections || []).forEach((sectionData) => {
        const raw = el('div', 'mold-section');
        if (sectionData.heading || sectionData.name) {
          raw.appendChild(el('h2', null, { text: sectionData.heading || sectionData.name || sectionData.type }));
        }
        if (sectionData.tagline) raw.appendChild(el('p', null, { text: sectionData.tagline }));
        if (sectionData.text) raw.appendChild(el('p', null, { text: sectionData.text }));
        container.appendChild(raw);
      });

      container.insertBefore(noTheme, container.firstChild);
      return;
    }

    // Render sections via registered renderers
    (json.sections || []).forEach((sectionData) => {
      const renderer = _sectionRenderers[sectionData.type];
      if (renderer) {
        container.appendChild(renderer(sectionData));
      } else {
        console.warn(`[Mold] Unknown section type: "${sectionData.type}"`);
      }
    });

    // Apply staggered animation delays and trigger counters
    requestAnimationFrame(() => {
      const sections = container.querySelectorAll('.mold-section');
      sections.forEach((sec, i) => {
        sec.style.animationDelay = (i * 0.08) + 's';
        sec.classList.add('mold-visible');
      });
      const statValues = container.querySelectorAll('.mold-stats__value');
      statValues.forEach((sv) => {
        const raw = sv.getAttribute('data-value');
        if (raw) animateCounter(sv, raw);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════════
  return {
    render,
    setLang,
    t,
    registerTheme,
    registerSection,
    // Utilities exposed for theme plugins
    el,
    linkIcon,
    createImage,
    animateCounter,
    initScrollReveal,
    openLightbox,
  };
})();

// Support CommonJS / ES module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mold;
}
