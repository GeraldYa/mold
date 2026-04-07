/**
 * Mold Theme: Golden Hour v0.2
 *
 * Self-registering theme plugin for the Mold rendering engine.
 * Contains all mood palettes, accent maps, section renderers,
 * font loading, and visual CSS.
 *
 * Requires: mold-core.js loaded first (provides Mold global)
 */
(() => {
  'use strict';

  // Shorthand references to core utilities
  const { el, linkIcon, createImage, animateCounter } = Mold;

  // ─── Mood Palettes ──────────────────────────────────────────────────
  const MOODS = {
    'professional-dark': {
      '--bg':            '#0a0a14',
      '--bg-secondary':  '#0e0e1e',
      '--card':          '#13132a',
      '--card-hover':    '#1a1a38',
      '--card-border':   '#1f1f3a',
      '--text':          '#e8e6f0',
      '--text-secondary':'#9896a8',
      '--text-muted':    '#6b6980',
      '--accent':        '#8b7cf6',
      '--accent-glow':   'rgba(139, 124, 246, 0.15)',
      '--accent-secondary': '#f59e0b',
      '--accent-secondary-glow': 'rgba(245, 158, 11, 0.15)',
      '--border':        '#1e1e35',
      '--hero-gradient':  'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,124,246,0.12) 0%, transparent 70%)',
      '--shadow-card':   '0 4px 24px rgba(0,0,0,0.35)',
      '--shadow-card-hover': '0 8px 40px rgba(139,124,246,0.12)',
      '--tag-bg':        'rgba(139, 124, 246, 0.1)',
      '--tag-border':    'rgba(139, 124, 246, 0.25)',
      '--tag-text':      '#b4a9f9',
      '--scrollbar-thumb':'#2a2a48',
      '--scrollbar-track':'#0a0a14',
    },
    'professional-light': {
      '--bg':            '#fafaf8',
      '--bg-secondary':  '#f4f3ef',
      '--card':          '#ffffff',
      '--card-hover':    '#fefefe',
      '--card-border':   '#e8e6df',
      '--text':          '#1a1a1a',
      '--text-secondary':'#555555',
      '--text-muted':    '#888888',
      '--accent':        '#2563eb',
      '--accent-glow':   'rgba(37, 99, 235, 0.1)',
      '--accent-secondary': '#dc2626',
      '--accent-secondary-glow': 'rgba(220, 38, 38, 0.1)',
      '--border':        '#e5e5e0',
      '--hero-gradient':  'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.06) 0%, transparent 70%)',
      '--shadow-card':   '0 2px 12px rgba(0,0,0,0.06)',
      '--shadow-card-hover': '0 6px 24px rgba(0,0,0,0.1)',
      '--tag-bg':        'rgba(37, 99, 235, 0.06)',
      '--tag-border':    'rgba(37, 99, 235, 0.2)',
      '--tag-text':      '#2563eb',
      '--scrollbar-thumb':'#d0d0d0',
      '--scrollbar-track':'#fafaf8',
    },
    'golden-hour': {
      '--bg':            '#0f0e17',
      '--bg-secondary':  '#1a1830',
      '--card':          'rgba(26, 24, 48, 0.35)',
      '--card-hover':    'rgba(26, 24, 48, 0.5)',
      '--card-border':   'rgba(255, 220, 180, 0.08)',
      '--text':          '#e8e4dc',
      '--text-secondary':'#8a8598',
      '--text-muted':    '#6b6574',
      '--accent':        '#e8976b',
      '--accent-glow':   'rgba(232, 151, 107, 0.12)',
      '--accent-secondary': '#9b8ec4',
      '--accent-secondary-glow': 'rgba(155, 142, 196, 0.12)',
      '--border':        'rgba(255, 220, 180, 0.08)',
      '--hero-gradient':  'linear-gradient(135deg, rgba(232,151,107,0.06) 0%, transparent 50%), linear-gradient(225deg, rgba(155,142,196,0.05) 0%, transparent 50%)',
      '--shadow-card':   'none',
      '--shadow-card-hover': '0 12px 32px rgba(232,151,107,0.08), 0 0 0 1px rgba(232,151,107,0.1)',
      '--tag-bg':        'rgba(232, 151, 107, 0.08)',
      '--tag-border':    'rgba(232, 151, 107, 0.25)',
      '--tag-text':      '#e8976b',
      '--scrollbar-thumb':'#1a1830',
      '--scrollbar-track':'#0f0e17',
    },
    'minimal': {
      '--bg':            '#ffffff',
      '--bg-secondary':  '#fafafa',
      '--card':          '#ffffff',
      '--card-hover':    '#fafafa',
      '--card-border':   '#eeeeee',
      '--text':          '#111111',
      '--text-secondary':'#666666',
      '--text-muted':    '#999999',
      '--accent':        '#111111',
      '--accent-glow':   'rgba(0, 0, 0, 0.04)',
      '--accent-secondary': '#666666',
      '--accent-secondary-glow': 'rgba(0, 0, 0, 0.03)',
      '--border':        '#eaeaea',
      '--hero-gradient':  'none',
      '--shadow-card':   '0 1px 4px rgba(0,0,0,0.04)',
      '--shadow-card-hover': '0 4px 16px rgba(0,0,0,0.06)',
      '--tag-bg':        '#f5f5f5',
      '--tag-border':    '#e0e0e0',
      '--tag-text':      '#333333',
      '--scrollbar-thumb':'#ddd',
      '--scrollbar-track':'#fff',
    },
    'bold': {
      '--bg':            '#000000',
      '--bg-secondary':  '#0a0a0a',
      '--card':          '#111111',
      '--card-hover':    '#1a1a1a',
      '--card-border':   '#2a2a2a',
      '--text':          '#ffffff',
      '--text-secondary':'#bbbbbb',
      '--text-muted':    '#777777',
      '--accent':        '#ff3366',
      '--accent-glow':   'rgba(255, 51, 102, 0.15)',
      '--accent-secondary': '#00d4ff',
      '--accent-secondary-glow': 'rgba(0, 212, 255, 0.15)',
      '--border':        '#222222',
      '--hero-gradient':  'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,51,102,0.1) 0%, transparent 70%)',
      '--shadow-card':   '0 4px 24px rgba(0,0,0,0.5)',
      '--shadow-card-hover': '0 8px 40px rgba(255,51,102,0.15)',
      '--tag-bg':        'rgba(255, 51, 102, 0.1)',
      '--tag-border':    'rgba(255, 51, 102, 0.3)',
      '--tag-text':      '#ff6b8a',
      '--scrollbar-thumb':'#333',
      '--scrollbar-track':'#000',
    },
  };

  // ─── Accent Map ─────────────────────────────────────────────────────
  const ACCENT_MAP = {
    amber:   { primary: '#e8976b', glow: 'rgba(232,151,107,0.15)', tag: '#e8976b', tagBg: 'rgba(232,151,107,0.08)', tagBorder: 'rgba(232,151,107,0.25)' },
    purple:  { primary: '#8b7cf6', glow: 'rgba(139,124,246,0.15)', tag: '#b4a9f9', tagBg: 'rgba(139,124,246,0.1)', tagBorder: 'rgba(139,124,246,0.25)' },
    blue:    { primary: '#3b82f6', glow: 'rgba(59,130,246,0.15)', tag: '#60a5fa', tagBg: 'rgba(59,130,246,0.1)', tagBorder: 'rgba(59,130,246,0.25)' },
    green:   { primary: '#10b981', glow: 'rgba(16,185,129,0.15)', tag: '#34d399', tagBg: 'rgba(16,185,129,0.1)', tagBorder: 'rgba(16,185,129,0.25)' },
    red:     { primary: '#ef4444', glow: 'rgba(239,68,68,0.15)', tag: '#f87171', tagBg: 'rgba(239,68,68,0.1)', tagBorder: 'rgba(239,68,68,0.25)' },
    rose:    { primary: '#f43f5e', glow: 'rgba(244,63,94,0.15)', tag: '#fb7185', tagBg: 'rgba(244,63,94,0.1)', tagBorder: 'rgba(244,63,94,0.25)' },
    cyan:    { primary: '#06b6d4', glow: 'rgba(6,182,212,0.15)', tag: '#22d3ee', tagBg: 'rgba(6,182,212,0.1)', tagBorder: 'rgba(6,182,212,0.25)' },
  };

  // ─── Font Loader ────────────────────────────────────────────────────
  function loadFonts(fonts) {
    const families = [];
    if (fonts.display) families.push(fonts.display + ':wght@400;600;700');
    if (fonts.body)    families.push(fonts.body + ':wght@400;600;700');
    if (fonts.mono)    families.push(fonts.mono + ':wght@400;700');

    if (families.length === 0) return;

    const familyParam = families
      .map(f => 'family=' + f.replace(/ /g, '+'))
      .join('&');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${familyParam}&display=swap`;
    document.head.appendChild(link);
  }

  // ─── Theme Applicator ───────────────────────────────────────────────
  function applyTheme(theme, root) {
    const mood = MOODS[theme.mood] || MOODS['professional-dark'];
    const vars = { ...mood };

    // Override accent-secondary with theme.accent if specified
    if (theme.accent && ACCENT_MAP[theme.accent]) {
      const a = ACCENT_MAP[theme.accent];
      vars['--accent-secondary'] = a.primary;
      vars['--accent-secondary-glow'] = a.glow;
    }

    // Apply CSS variables to root
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Font overrides
    if (theme.fonts) {
      if (theme.fonts.display) root.style.setProperty('--font-display', `'${theme.fonts.display}', sans-serif`);
      if (theme.fonts.body)    root.style.setProperty('--font-body', `'${theme.fonts.body}', sans-serif`);
      if (theme.fonts.mono)    root.style.setProperty('--font-mono', `'${theme.fonts.mono}', monospace`);
      loadFonts(theme.fonts);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // Theme CSS — all visual styles
  // ═══════════════════════════════════════════════════════════════════
  function generateCSS() {
    return `
/* ===== Golden Hour Theme — Design System v2 ===== */

/* Font defaults */
:root {
  --font-display: 'Outfit', system-ui, sans-serif;
  --font-body: 'Outfit', 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Twilight sky — warm amber top-left, cool violet bottom-right */
.mold-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 20% 0%, rgba(232,151,107,0.16) 0%, transparent 50%),
    radial-gradient(ellipse 100% 80% at 80% 100%, rgba(155,142,196,0.12) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 50% 50%, rgba(232,151,107,0.05) 0%, transparent 70%),
    radial-gradient(ellipse 80% 40% at 30% 70%, rgba(155,142,196,0.06) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* Subtle noise texture for depth */
.mold-root::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.012;
  pointer-events: none;
  z-index: 0;
}

/* ===== Section Heading ===== */
.mold-section__heading {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 1.25;
  color: var(--text);
  margin-bottom: 28px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  animation: mold-slideDown 0.5s ease both;
}

.mold-section__heading::after {
  display: none;
}

/* ===== HERO ===== */
.mold-hero {
  padding-top: 7rem;
  padding-bottom: 3rem;
  text-align: center;
  position: relative;
}

.mold-hero__name {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 4rem);
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.08;
  color: var(--text);
  margin-bottom: 0.75rem;
  animation: mold-fadeInUp 0.6s ease both;
}

.mold-hero__tagline {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: -0.3px;
  line-height: 1.55;
  margin-bottom: 2rem;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  animation: mold-fadeInUp 0.6s ease 0.1s both;
}

.mold-hero__links {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  animation: mold-fadeInUp 0.6s ease 0.2s both;
}

.mold-hero__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: transparent;
  transition: all var(--transition);
}

.mold-hero__link:hover {
  color: var(--accent);
  border-color: rgba(232,151,107,0.35);
  background: rgba(232,151,107,0.06);
  box-shadow: 0 0 20px rgba(232,151,107,0.1);
  transform: translateY(-2px);
}

.mold-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: #faf6ef;
  background: linear-gradient(135deg, #e8976b 0%, #d4886a 60%, #c47a5e 100%);
  border: none;
  border-radius: var(--radius-pill);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 4px 20px rgba(232,151,107,0.25);
  animation: mold-fadeInUp 0.6s ease 0.3s both;
}

.mold-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(232,151,107,0.35);
  filter: brightness(1.05);
}

/* ===== STATS ===== */
.mold-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
}

.mold-stats__card {
  text-align: center;
  padding: 4px 0;
  transition: transform var(--transition);
  animation: mold-fadeInUp var(--transition-entrance) both;
}

.mold-stats__card:nth-child(1) { animation-delay: 0.03s; }
.mold-stats__card:nth-child(2) { animation-delay: 0.08s; }
.mold-stats__card:nth-child(3) { animation-delay: 0.13s; }
.mold-stats__card:nth-child(4) { animation-delay: 0.18s; }
.mold-stats__card:nth-child(5) { animation-delay: 0.23s; }
.mold-stats__card:nth-child(6) { animation-delay: 0.28s; }

.mold-stats__card:hover {
  transform: translateY(-2px);
}

.mold-stats__value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
  margin-bottom: 4px;
  text-shadow: 0 0 24px rgba(232,151,107,0.15);
}

.mold-stats__label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* ===== TIMELINE ===== */
.mold-timeline {
  position: relative;
  padding-left: 2.2rem;
}

.mold-timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: linear-gradient(to bottom, var(--accent), rgba(255,220,180,0.06));
  border-radius: 1px;
}

.mold-timeline__entry {
  position: relative;
  padding-bottom: 2.2rem;
  padding-left: 0;
}

.mold-timeline__entry:last-child { padding-bottom: 0; }

.mold-timeline__dot {
  position: absolute;
  left: -2.2rem;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--accent);
  z-index: 1;
  box-shadow: 0 0 10px rgba(232,151,107,0.15);
}

.mold-timeline__entry--pulse .mold-timeline__dot {
  animation: mold-pulse 2s ease-in-out infinite;
  background: var(--accent);
  border-color: var(--accent);
}

@keyframes mold-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,151,107,0.4); }
  50% { box-shadow: 0 0 0 6px rgba(232,151,107,0); }
}

.mold-timeline__year {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.04em;
  margin-bottom: 5px;
}

.mold-timeline__text {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ===== CARDS ===== */
.mold-cards {
  display: grid;
  gap: 16px;
}

.mold-cards--col-3 { grid-template-columns: repeat(3, 1fr); }
.mold-cards--col-2 { grid-template-columns: repeat(2, 1fr); }
.mold-cards--col-1 { grid-template-columns: 1fr; }

.mold-card {
  background: var(--card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  display: flex;
  flex-direction: column;
  animation: mold-fadeInUp var(--transition-entrance) both;
}

.mold-card:nth-child(1) { animation-delay: 0.03s; }
.mold-card:nth-child(2) { animation-delay: 0.08s; }
.mold-card:nth-child(3) { animation-delay: 0.13s; }
.mold-card:nth-child(4) { animation-delay: 0.18s; }
.mold-card:nth-child(5) { animation-delay: 0.23s; }
.mold-card:nth-child(6) { animation-delay: 0.28s; }

.mold-card:hover {
  border-color: rgba(232,151,107,0.25);
  box-shadow: 0 12px 32px rgba(232,151,107,0.08), 0 0 0 1px rgba(232,151,107,0.1);
  transform: translateY(-4px);
}

.mold-card.mold-card--hidden {
  display: none;
}

.mold-card__image-wrap {
  position: relative;
  width: 100%;
  padding-top: 52%;
  overflow: hidden;
  background: var(--bg-secondary);
  cursor: pointer;
}

.mold-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.mold-card:hover .mold-card__image {
  transform: scale(1.04);
}

.mold-card__icon-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: var(--bg-secondary);
}

.mold-card__body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mold-card__title {
  font-family: var(--font-display);
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.mold-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.mold-card__tech-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--tag-text);
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: var(--radius-pill);
  padding: 2px 10px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  line-height: 1.6;
}

.mold-card__tech:not(:has(.mold-card__tech-tag)) {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--accent);
  letter-spacing: 0;
  opacity: 0.85;
  display: block;
}

.mold-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
  flex: 1;
}

.mold-card__links {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.mold-card__link {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all var(--transition);
  padding: 4px 0;
}

.mold-card__link:hover {
  color: var(--text);
}

.mold-card__link::after {
  content: '\\2192';
  font-size: 0.85em;
  transition: transform var(--transition);
}

.mold-card__link:hover::after {
  transform: translateX(4px);
}

/* Expand toggle */
.mold-expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.mold-expand-btn:hover {
  border-color: rgba(232,151,107,0.3);
  color: var(--accent);
  background: rgba(232,151,107,0.04);
}

.mold-expand-btn__chevron {
  transition: transform var(--transition);
  font-size: 0.7em;
}

.mold-expand-btn--open .mold-expand-btn__chevron {
  transform: rotate(180deg);
}

/* ===== SKILLS ===== */
.mold-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mold-skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 7px 16px;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--tag-text);
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: var(--radius-pill);
  transition: all var(--transition);
  cursor: default;
}

.mold-skill-tag:hover {
  background: rgba(232,151,107,0.1);
  border-color: rgba(232,151,107,0.4);
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(232,151,107,0.1), 0 4px 12px rgba(232,151,107,0.06);
}

/* ===== EXPERIENCE ===== */
.mold-experience__item {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 2.2rem;
  border-left: 2px solid var(--border);
  transition: border-color var(--transition);
}

.mold-experience__item:last-child { padding-bottom: 0; }

.mold-experience__item:hover {
  border-left-color: var(--accent);
}

.mold-experience__item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  transition: box-shadow var(--transition);
}

.mold-experience__item:hover::before {
  box-shadow: 0 0 8px rgba(232,151,107,0.3);
}

.mold-experience__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
  letter-spacing: -0.3px;
}

.mold-experience__org {
  font-size: 0.88rem;
  color: var(--accent);
  font-weight: 400;
  margin-bottom: 3px;
}

.mold-experience__period {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.mold-experience__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ===== EDUCATION ===== */
.mold-education__item {
  padding-bottom: 1.8rem;
}

.mold-education__item:last-child { padding-bottom: 0; }

.mold-education__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
  letter-spacing: -0.3px;
}

.mold-education__org {
  font-size: 0.88rem;
  color: var(--accent);
  font-weight: 400;
}

.mold-education__year {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mold-education__detail {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-top: 6px;
  line-height: 1.65;
}

/* ===== WRITING ===== */
.mold-writing {
  display: grid;
  gap: 16px;
}

.mold-writing--has-images {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.mold-writing-card {
  background: var(--card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  display: flex;
  flex-direction: column;
  animation: mold-fadeInUp var(--transition-entrance) both;
}

.mold-writing-card:nth-child(1) { animation-delay: 0.03s; }
.mold-writing-card:nth-child(2) { animation-delay: 0.08s; }
.mold-writing-card:nth-child(3) { animation-delay: 0.13s; }

.mold-writing-card:hover {
  border-color: rgba(232,151,107,0.25);
  box-shadow: 0 12px 32px rgba(232,151,107,0.08), 0 0 0 1px rgba(232,151,107,0.1);
  transform: translateY(-4px);
}

.mold-writing-card__image-wrap {
  position: relative;
  width: 100%;
  padding-top: 50%;
  overflow: hidden;
  background: var(--bg-secondary);
  cursor: pointer;
}

.mold-writing-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.mold-writing-card:hover .mold-writing-card__image {
  transform: scale(1.04);
}

.mold-writing-card__icon-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: var(--bg-secondary);
}

.mold-writing-card__body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mold-writing-card__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.mold-writing-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
  flex: 1;
}

.mold-writing-card__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 18px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  transition: all var(--transition);
}

.mold-writing-card__link:hover { color: var(--text); }
.mold-writing-card__link::after { content: '\\2192'; margin-left: 2px; transition: transform var(--transition); }
.mold-writing-card__link:hover::after { transform: translateX(4px); }

/* ===== FEATURES ===== */
.mold-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.mold-feature-card {
  background: var(--card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 24px;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  animation: mold-fadeInUp var(--transition-entrance) both;
}

.mold-feature-card:nth-child(1) { animation-delay: 0.03s; }
.mold-feature-card:nth-child(2) { animation-delay: 0.08s; }
.mold-feature-card:nth-child(3) { animation-delay: 0.13s; }
.mold-feature-card:nth-child(4) { animation-delay: 0.18s; }

.mold-feature-card:hover {
  border-color: rgba(232,151,107,0.25);
  box-shadow: 0 12px 32px rgba(232,151,107,0.08), 0 0 0 1px rgba(232,151,107,0.1);
  transform: translateY(-4px);
}

.mold-feature-card__icon {
  font-size: 1.8rem;
  margin-bottom: 14px;
  display: block;
}

.mold-feature-card__title {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
  letter-spacing: -0.3px;
}

.mold-feature-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ===== CONTACT ===== */
.mold-contact {
  text-align: center;
  padding-top: 56px;
  padding-bottom: 56px;
}

.mold-contact__inner {
  background: var(--card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 48px 40px;
  max-width: 560px;
  margin: 0 auto;
}

.mold-contact__heading {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 12px;
  border: none;
}

.mold-contact__text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 420px;
  margin: 0 auto 28px;
  line-height: 1.7;
}

.mold-contact__links {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.mold-contact__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: transparent;
  transition: all var(--transition);
}

.mold-contact__link:hover {
  border-color: rgba(232,151,107,0.35);
  color: var(--accent);
  background: rgba(232,151,107,0.06);
  box-shadow: 0 0 20px rgba(232,151,107,0.1);
  transform: translateY(-2px);
}

/* ===== FOOTER ===== */
.mold-footer {
  text-align: center;
  padding: 28px 32px;
  font-size: 0.78rem;
  color: var(--text-muted);
  opacity: 0.7;
  border-top: 1px solid var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
  letter-spacing: 0.2px;
  transition: opacity var(--transition);
}

.mold-footer:hover {
  opacity: 1;
}

/* ===== Responsive — Tablet ===== */
@media (max-width: 900px) {
  .mold-cards--col-3 { grid-template-columns: repeat(2, 1fr); }
  .mold-hero { padding-top: 5rem; }
  .mold-hero__name { font-size: clamp(2.4rem, 6vw, 3rem); }
  .mold-stats { gap: 28px; }
  .mold-contact__inner { padding: 36px 28px; }
}

/* ===== Responsive — Mobile ===== */
@media (max-width: 600px) {
  .mold-cards--col-3,
  .mold-cards--col-2 { grid-template-columns: 1fr; }

  .mold-features { grid-template-columns: 1fr; }
  .mold-writing { grid-template-columns: 1fr; }

  .mold-hero { padding-top: 3.5rem; padding-bottom: 2rem; }
  .mold-hero__name { font-size: 2.2rem; letter-spacing: -1px; }
  .mold-hero__tagline { font-size: 1rem; margin-bottom: 1.5rem; }
  .mold-hero__links { gap: 8px; }

  .mold-stats { gap: 24px; }
  .mold-stats__value { font-size: 1.6rem; }

  .mold-contact__heading { font-size: 1.5rem; }
  .mold-contact__inner { padding: 32px 20px; }
  .mold-contact__links { gap: 8px; }

  .mold-skill-tag { padding: 6px 12px; font-size: 0.78rem; }
}
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Section Renderers
  // ═══════════════════════════════════════════════════════════════════

  // ─── HERO ───────────────────────────────────────────────────────────
  function renderHero(data) {
    const section = el('section', 'mold-section mold-hero mold-reveal');
    if (data.id) section.id = data.id;

    const name = el('h1', 'mold-hero__name', { text: data.name || '' });
    section.appendChild(name);

    if (data.tagline) {
      section.appendChild(el('p', 'mold-hero__tagline', { text: data.tagline }));
    }

    if (data.links && data.links.length) {
      const linksWrap = el('div', 'mold-hero__links');
      data.links.forEach((lnk) => {
        const a = el('a', 'mold-hero__link', { href: lnk.url, target: '_blank', rel: 'noopener' });
        a.innerHTML = linkIcon(lnk.label) + ' ' + lnk.label;
        linksWrap.appendChild(a);
      });
      section.appendChild(linksWrap);
    }

    if (data.cta) {
      const cta = el('a', 'mold-hero__cta', { href: data.cta.url, target: '_blank', rel: 'noopener' });
      cta.innerHTML = linkIcon(data.cta.label) + ' ' + data.cta.label;
      section.appendChild(cta);
    }

    return section;
  }

  // ─── STATS ──────────────────────────────────────────────────────────
  function renderStats(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;
    if (data.animate) section.setAttribute('data-animate-counter', '');

    const grid = el('div', 'mold-stats mold-stagger');
    (data.items || []).forEach((item, i) => {
      const card = el('div', 'mold-stats__card mold-reveal');
      card.style.setProperty('--i', i);

      const val = el('div', 'mold-stats__value');
      val.setAttribute('data-value', item.value);
      val.textContent = data.animate ? '0' : item.value;
      card.appendChild(val);

      card.appendChild(el('div', 'mold-stats__label', { text: item.label }));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  }

  // ─── TIMELINE ───────────────────────────────────────────────────────
  function renderTimeline(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const tl = el('div', 'mold-timeline mold-stagger');

    (data.entries || []).forEach((entry, i) => {
      const cls = 'mold-timeline__entry mold-reveal' + (entry.pulse ? ' mold-timeline__entry--pulse' : '');
      const item = el('div', cls);
      item.style.setProperty('--i', i);

      item.appendChild(el('div', 'mold-timeline__dot'));
      item.appendChild(el('div', 'mold-timeline__year', { text: entry.year }));
      item.appendChild(el('p', 'mold-timeline__text', { text: entry.text }));

      tl.appendChild(item);
    });

    section.appendChild(tl);
    return section;
  }

  // ─── CARDS ──────────────────────────────────────────────────────────
  function renderCards(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const cols = data.columns || 3;
    const grid = el('div', `mold-cards mold-cards--col-${cols} mold-stagger`);

    const items = data.items || [];
    const expandable = data.expandable;
    const visibleCount = expandable ? expandable.visible : items.length;

    items.forEach((item, i) => {
      const card = el('div', 'mold-card mold-reveal');
      card.style.setProperty('--i', i % cols);

      if (expandable && i >= visibleCount) {
        card.classList.add('mold-card--hidden');
        card.setAttribute('data-expandable', '');
      }

      if (item.image || item.icon) {
        card.appendChild(
          createImage(item.image, item.icon, 'mold-card__image-wrap', 'mold-card__image', 'mold-card__icon-fallback')
        );
      }

      const body = el('div', 'mold-card__body');
      body.appendChild(el('h3', 'mold-card__title', { text: item.title }));

      if (item.tech) {
        body.appendChild(el('div', 'mold-card__tech', { text: item.tech }));
      }

      if (item.description) {
        body.appendChild(el('p', 'mold-card__desc', { text: item.description }));
      }

      const links = item.links || (item.link ? [item.link] : []);
      if (links.length) {
        const linksWrap = el('div', 'mold-card__links');
        links.forEach((lnk) => {
          const a = el('a', 'mold-card__link', { href: lnk.url, target: '_blank', rel: 'noopener' });
          a.innerHTML = linkIcon(lnk.label) + ' ' + lnk.label;
          linksWrap.appendChild(a);
        });
        body.appendChild(linksWrap);
      }

      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);

    // Expand/collapse button
    if (expandable && items.length > visibleCount) {
      const btn = el('button', 'mold-expand-btn');
      const hiddenCount = items.length - visibleCount;
      const showLabel = expandable.label || `Show ${hiddenCount} more`;
      const hideLabel = 'Show less';
      let expanded = false;

      btn.innerHTML = `<span>${showLabel}</span> <span class="mold-expand-btn__chevron">\u25BC</span>`;

      btn.addEventListener('click', () => {
        expanded = !expanded;
        grid.querySelectorAll('[data-expandable]').forEach((card) => {
          card.classList.toggle('mold-card--hidden', !expanded);
          if (expanded) {
            requestAnimationFrame(() => card.classList.add('mold-visible'));
          }
        });
        btn.innerHTML = `<span>${expanded ? hideLabel : showLabel}</span> <span class="mold-expand-btn__chevron">\u25BC</span>`;
        btn.classList.toggle('mold-expand-btn--open', expanded);
      });

      section.appendChild(btn);
    }

    return section;
  }

  // ─── SKILLS ─────────────────────────────────────────────────────────
  function renderSkills(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const cloud = el('div', 'mold-skills mold-stagger');
    (data.tags || []).forEach((tag, i) => {
      const t = el('span', 'mold-skill-tag mold-reveal', { text: tag });
      t.style.setProperty('--i', i);
      cloud.appendChild(t);
    });

    section.appendChild(cloud);
    return section;
  }

  // ─── EXPERIENCE ─────────────────────────────────────────────────────
  function renderExperience(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const list = el('div', 'mold-stagger');
    (data.items || []).forEach((item, i) => {
      const entry = el('div', 'mold-experience__item mold-reveal');
      entry.style.setProperty('--i', i);

      entry.appendChild(el('h3', 'mold-experience__title', { text: item.title }));
      if (item.org) entry.appendChild(el('div', 'mold-experience__org', { text: item.org }));
      if (item.period) entry.appendChild(el('div', 'mold-experience__period', { text: item.period }));
      if (item.description) entry.appendChild(el('p', 'mold-experience__desc', { text: item.description }));

      list.appendChild(entry);
    });

    section.appendChild(list);
    return section;
  }

  // ─── EDUCATION ──────────────────────────────────────────────────────
  function renderEducation(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const list = el('div', 'mold-stagger');
    (data.items || []).forEach((item, i) => {
      const entry = el('div', 'mold-education__item mold-reveal');
      entry.style.setProperty('--i', i);

      entry.appendChild(el('h3', 'mold-education__title', { text: item.title }));
      if (item.org) entry.appendChild(el('div', 'mold-education__org', { text: item.org }));
      if (item.year) entry.appendChild(el('div', 'mold-education__year', { text: item.year }));
      if (item.detail) entry.appendChild(el('p', 'mold-education__detail', { text: item.detail }));

      list.appendChild(entry);
    });

    section.appendChild(list);
    return section;
  }

  // ─── WRITING ────────────────────────────────────────────────────────
  function renderWriting(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const hasImages = (data.items || []).some((item) => item.image);
    const grid = el('div', `mold-writing ${hasImages ? 'mold-writing--has-images' : ''} mold-stagger`);

    (data.items || []).forEach((item, i) => {
      const card = el('div', 'mold-writing-card mold-reveal');
      card.style.setProperty('--i', i);

      if (item.image || item.icon) {
        card.appendChild(
          createImage(item.image, item.icon, 'mold-writing-card__image-wrap', 'mold-writing-card__image', 'mold-writing-card__icon-fallback')
        );
      }

      const body = el('div', 'mold-writing-card__body');
      body.appendChild(el('h3', 'mold-writing-card__title', { text: item.title }));
      if (item.description) body.appendChild(el('p', 'mold-writing-card__desc', { text: item.description }));

      if (item.link) {
        const a = el('a', 'mold-writing-card__link', { href: item.link.url, target: '_blank', rel: 'noopener' });
        a.innerHTML = linkIcon(item.link.label) + ' ' + item.link.label;
        body.appendChild(a);
      }

      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  }

  // ─── FEATURES ───────────────────────────────────────────────────────
  function renderFeatures(data) {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-section__heading', { text: data.heading }));
    }

    const grid = el('div', 'mold-features mold-stagger');
    (data.items || []).forEach((item, i) => {
      const card = el('div', 'mold-feature-card mold-reveal');
      card.style.setProperty('--i', i);

      if (item.icon) card.appendChild(el('span', 'mold-feature-card__icon', { text: item.icon }));
      card.appendChild(el('h3', 'mold-feature-card__title', { text: item.title }));
      if (item.description) card.appendChild(el('p', 'mold-feature-card__desc', { text: item.description }));

      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  }

  // ─── CONTACT ────────────────────────────────────────────────────────
  function renderContact(data) {
    const section = el('section', 'mold-section mold-contact mold-reveal');
    if (data.id) section.id = data.id;

    if (data.heading) {
      section.appendChild(el('h2', 'mold-contact__heading', { text: data.heading }));
    }

    if (data.text) {
      section.appendChild(el('p', 'mold-contact__text', { text: data.text }));
    }

    if (data.links && data.links.length) {
      const linksWrap = el('div', 'mold-contact__links');
      data.links.forEach((lnk) => {
        const a = el('a', 'mold-contact__link', { href: lnk.url, target: '_blank', rel: 'noopener' });
        a.innerHTML = linkIcon(lnk.label) + ' ' + lnk.label;
        linksWrap.appendChild(a);
      });
      section.appendChild(linksWrap);
    }

    return section;
  }

  // ─── FOOTER ─────────────────────────────────────────────────────────
  function renderFooter(data) {
    const footer = el('footer', 'mold-footer mold-reveal');
    if (data.id) footer.id = data.id;
    footer.textContent = Mold.t(data.text) || '';
    return footer;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Self-register theme and all section renderers
  // ═══════════════════════════════════════════════════════════════════
  Mold.registerTheme('golden-hour', {
    moods: MOODS,
    accentMap: ACCENT_MAP,
    applyTheme: applyTheme,
    generateCSS: generateCSS,
  });

  Mold.registerSection('hero', renderHero);
  Mold.registerSection('stats', renderStats);
  Mold.registerSection('timeline', renderTimeline);
  Mold.registerSection('cards', renderCards);
  Mold.registerSection('skills', renderSkills);
  Mold.registerSection('experience', renderExperience);
  Mold.registerSection('education', renderEducation);
  Mold.registerSection('writing', renderWriting);
  Mold.registerSection('features', renderFeatures);
  Mold.registerSection('contact', renderContact);
  Mold.registerSection('footer', renderFooter);

})();
