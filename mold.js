/**
 * Mold Rendering Engine v0.1
 *
 * Reads a Mold JSON document and renders a complete, styled webpage
 * into a given DOM container. Theme-aware, responsive, animated.
 *
 * Usage:
 *   Mold.render(jsonObject, document.getElementById('app'));
 */
const Mold = (() => {
  'use strict';

  // ─── Theme Mood Palettes ────────────────────────────────────────────
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

  // Override accent colors from theme
  const ACCENT_MAP = {
    amber:   { primary: '#e8976b', glow: 'rgba(232,151,107,0.15)', tag: '#e8976b', tagBg: 'rgba(232,151,107,0.08)', tagBorder: 'rgba(232,151,107,0.25)' },
    purple:  { primary: '#8b7cf6', glow: 'rgba(139,124,246,0.15)', tag: '#b4a9f9', tagBg: 'rgba(139,124,246,0.1)', tagBorder: 'rgba(139,124,246,0.25)' },
    blue:    { primary: '#3b82f6', glow: 'rgba(59,130,246,0.15)', tag: '#60a5fa', tagBg: 'rgba(59,130,246,0.1)', tagBorder: 'rgba(59,130,246,0.25)' },
    green:   { primary: '#10b981', glow: 'rgba(16,185,129,0.15)', tag: '#34d399', tagBg: 'rgba(16,185,129,0.1)', tagBorder: 'rgba(16,185,129,0.25)' },
    red:     { primary: '#ef4444', glow: 'rgba(239,68,68,0.15)', tag: '#f87171', tagBg: 'rgba(239,68,68,0.1)', tagBorder: 'rgba(239,68,68,0.25)' },
    rose:    { primary: '#f43f5e', glow: 'rgba(244,63,94,0.15)', tag: '#fb7185', tagBg: 'rgba(244,63,94,0.1)', tagBorder: 'rgba(244,63,94,0.25)' },
    cyan:    { primary: '#06b6d4', glow: 'rgba(6,182,212,0.15)', tag: '#22d3ee', tagBg: 'rgba(6,182,212,0.1)', tagBorder: 'rgba(6,182,212,0.25)' },
  };

  // ─── CSS Generator ──────────────────────────────────────────────────
  function generateCSS() {
    return `
/* ===== Mold Engine — Golden Hour Design System ===== */

/* Reset & base */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --font-display: 'Outfit', system-ui, sans-serif;
  --font-body: 'Outfit', 'Noto Sans SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --max-width: 900px;
  --section-gap: 48px;
  --radius: 16px;
  --radius-sm: 10px;
  --transition: 0.25s ease;
  --transition-entrance: 0.4s ease-out;
}

html {
  -webkit-text-size-adjust: 100%;
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

/* Twilight sky background gradient */
.mold-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(232,151,107,0.04) 0%, transparent 40%),
              linear-gradient(225deg, rgba(155,142,196,0.035) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.mold-root > * {
  position: relative;
  z-index: 1;
}

/* Scrollbar */
.mold-root::-webkit-scrollbar { width: 6px; }
.mold-root::-webkit-scrollbar-track { background: var(--scrollbar-track); }
.mold-root::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }

/* ===== Entrance Animation ===== */
@keyframes mold-fadeInUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Layout ===== */
.mold-section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--section-gap) 32px;
}

.mold-section__heading {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 32px;
  position: relative;
  display: inline-block;
}

.mold-section__heading::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 32px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  opacity: 0.7;
}

/* ===== Scroll Reveal ===== */
.mold-reveal {
  animation: moldFadeUp 0.5s ease both;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.mold-reveal.mold-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.mold-stagger > * { transition-delay: calc(var(--i, 0) * 50ms); }

/* ===== HERO ===== */
.mold-hero {
  padding-top: 6rem;
  padding-bottom: 2rem;
  text-align: center;
  position: relative;
}

.mold-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--hero-gradient);
  pointer-events: none;
}

.mold-hero__name {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--text) 30%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.6rem;
}

.mold-hero__tagline {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  color: var(--text-secondary);
  font-weight: 400;
  letter-spacing: -0.3px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.mold-hero__links {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.mold-hero__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  transition: all var(--transition);
}

.mold-hero__link:hover {
  color: var(--accent);
  border-color: rgba(232,151,107,0.25);
  background: rgba(232,151,107,0.05);
  transform: translateY(-1px);
}

.mold-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: #faf6ef;
  background: linear-gradient(135deg, #e8976b, #d4886a);
  border: none;
  border-radius: var(--radius-sm);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 4px 16px rgba(232,151,107,0.2);
}

.mold-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(232,151,107,0.3);
}

/* ===== STATS ===== */
.mold-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.mold-stats__card {
  background: var(--card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 16px 12px;
  text-align: center;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  animation: mold-fadeInUp var(--transition-entrance) both;
}

.mold-stats__card:nth-child(1) { animation-delay: 0.03s; }
.mold-stats__card:nth-child(2) { animation-delay: 0.08s; }
.mold-stats__card:nth-child(3) { animation-delay: 0.13s; }
.mold-stats__card:nth-child(4) { animation-delay: 0.18s; }
.mold-stats__card:nth-child(5) { animation-delay: 0.23s; }
.mold-stats__card:nth-child(6) { animation-delay: 0.28s; }

.mold-stats__card:hover {
  border-color: rgba(232,151,107,0.25);
  box-shadow: 0 12px 32px rgba(232,151,107,0.08), 0 0 0 1px rgba(232,151,107,0.1);
  transform: translateY(-3px);
}

.mold-stats__value {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
  margin-bottom: 2px;
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
  padding-left: 2.5rem;
}

.mold-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--accent), rgba(255,220,180,0.08));
  border-radius: 1px;
}

.mold-timeline__entry {
  position: relative;
  padding-bottom: 2rem;
  padding-left: 0;
}

.mold-timeline__entry:last-child { padding-bottom: 0; }

.mold-timeline__dot {
  position: absolute;
  left: -2.5rem;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  border: 2.5px solid var(--accent);
  z-index: 1;
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
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.mold-timeline__text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ===== CARDS ===== */
.mold-cards {
  display: grid;
  gap: 12px;
}

.mold-cards--col-3 { grid-template-columns: repeat(3, 1fr); }
.mold-cards--col-2 { grid-template-columns: repeat(2, 1fr); }
.mold-cards--col-1 { grid-template-columns: 1fr; }

.mold-card {
  background: var(--card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
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
  transform: translateY(-3px);
}

.mold-card.mold-card--hidden {
  display: none;
}

.mold-card__image-wrap {
  position: relative;
  width: 100%;
  padding-top: 56%;
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
  transition: transform 0.4s ease-out;
}

.mold-card:hover .mold-card__image {
  transform: scale(1.03);
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
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mold-card__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.mold-card__tech {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--accent);
  margin-bottom: 12px;
  letter-spacing: 0;
  opacity: 0.85;
}

.mold-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
  flex: 1;
}

.mold-card__links {
  display: flex;
  gap: 12px;
  margin-top: 16px;
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
  transition: opacity var(--transition);
}

.mold-card__link:hover {
  opacity: 0.75;
}

.mold-card__link::after {
  content: '\\2192';
  font-size: 0.85em;
  transition: transform var(--transition);
}

.mold-card__link:hover::after {
  transform: translateX(3px);
}

/* Expand toggle */
.mold-expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin-top: 12px;
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
  border-color: rgba(232,151,107,0.25);
  color: var(--accent);
  background: rgba(232,151,107,0.05);
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
  gap: 8px;
}

.mold-skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--tag-text);
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  cursor: default;
}

.mold-skill-tag:hover {
  background: rgba(232,151,107,0.1);
  border-color: rgba(232,151,107,0.3);
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232,151,107,0.08);
}

/* ===== EXPERIENCE ===== */
.mold-experience__item {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 2rem;
  border-left: 2px solid var(--border);
}

.mold-experience__item:last-child { padding-bottom: 0; }

.mold-experience__item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.mold-experience__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
  letter-spacing: -0.3px;
}

.mold-experience__org {
  font-size: 0.88rem;
  color: var(--accent);
  font-weight: 400;
  margin-bottom: 2px;
}

.mold-experience__period {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.mold-experience__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ===== EDUCATION ===== */
.mold-education__item {
  padding-bottom: 1.5rem;
}

.mold-education__item:last-child { padding-bottom: 0; }

.mold-education__title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
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
  margin-top: 4px;
}

/* ===== WRITING ===== */
.mold-writing {
  display: grid;
  gap: 12px;
}

.mold-writing--has-images {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.mold-writing-card {
  background: var(--card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
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
  transform: translateY(-3px);
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
  transition: transform 0.4s ease-out;
}

.mold-writing-card:hover .mold-writing-card__image {
  transform: scale(1.03);
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
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mold-writing-card__title {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.mold-writing-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
  flex: 1;
}

.mold-writing-card__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  transition: opacity var(--transition);
}

.mold-writing-card__link:hover { opacity: 0.75; }
.mold-writing-card__link::after { content: '\\2192'; margin-left: 2px; transition: transform var(--transition); }
.mold-writing-card__link:hover::after { transform: translateX(3px); }

/* ===== FEATURES ===== */
.mold-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.mold-feature-card {
  background: var(--card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 22px;
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
  transform: translateY(-3px);
}

.mold-feature-card__icon {
  font-size: 1.8rem;
  margin-bottom: 12px;
  display: block;
}

.mold-feature-card__title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.mold-feature-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ===== CONTACT ===== */
.mold-contact {
  text-align: center;
  padding-top: 48px;
  padding-bottom: 48px;
}

.mold-contact__heading {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 12px;
}

.mold-contact__text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto 24px;
  line-height: 1.65;
}

.mold-contact__links {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.mold-contact__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  transition: all var(--transition);
}

.mold-contact__link:hover {
  border-color: rgba(232,151,107,0.25);
  color: var(--accent);
  background: rgba(232,151,107,0.05);
  transform: translateY(-1px);
}

/* ===== FOOTER ===== */
.mold-footer {
  text-align: center;
  padding: 32px;
  font-size: 0.82rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
  letter-spacing: 0.2px;
}

/* ===== LIGHTBOX ===== */
.mold-lang-switcher { position: fixed; top: 16px; right: 16px; z-index: 100; }
.mold-lang-btn { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 6px 14px; cursor: pointer; color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-mono); transition: all 0.2s; }
.mold-lang-btn:hover { border-color: var(--accent); color: var(--accent); }
.mold-lang-menu { display: none; position: absolute; top: 38px; right: 0; background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 6px 0; min-width: 120px; backdrop-filter: blur(14px); }
.mold-lang-menu.show { display: block; }
.mold-lang-menu a { display: block; padding: 6px 16px; color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; }
.mold-lang-menu a:hover { color: var(--accent); background: var(--accent-glow); }
.mold-lang-menu a.active { color: var(--accent); }

.mold-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 14, 23, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
  box-shadow: 0 24px 64px rgba(15,14,23,0.25);
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
  color: var(--text);
  background: rgba(232,151,107,0.1);
  border: 1px solid rgba(255,220,180,0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
}

.mold-lightbox__close:hover {
  background: rgba(232,151,107,0.2);
  border-color: rgba(232,151,107,0.25);
}

/* ===== Accessibility ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .mold-reveal { opacity: 1; transform: none; }
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .mold-cards--col-3 { grid-template-columns: repeat(2, 1fr); }

  .mold-section {
    padding-left: 24px;
    padding-right: 24px;
  }

  .mold-hero { padding-top: 4.5rem; }
  .mold-hero__name { font-size: 2.4rem; }
}

@media (max-width: 600px) {
  :root { --section-gap: 32px; }

  .mold-cards--col-3,
  .mold-cards--col-2 { grid-template-columns: 1fr; }

  .mold-features { grid-template-columns: 1fr; }

  .mold-writing { grid-template-columns: 1fr; }

  .mold-section {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mold-hero { padding-top: 3.5rem; padding-bottom: 1.5rem; }
  .mold-hero__name { font-size: 2rem; }
  .mold-hero__links { gap: 6px; }

  .mold-stats { grid-template-columns: repeat(2, 1fr); }
  .mold-stats__value { font-size: 1.5rem; }

  .mold-contact__heading { font-size: 1.6rem; }
}
`;
  }

  // ─── Helper: Create Element ─────────────────────────────────────────
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

  // ─── Helper: Render Link Icon ───────────────────────────────────────
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

  // ─── Lightbox ───────────────────────────────────────────────────────
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

    // Prevent closing when clicking the image itself
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

  // ─── Image with Fallback ───────────────────────────────────────────
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
        // Enable lightbox on loaded images
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

  // ─── Counter Animation ──────────────────────────────────────────────
  function animateCounter(element, rawValue) {
    // Parse numeric part: e.g. "7+" → 7, "10+" → 10, "5" → 5
    const match = rawValue.match(/^(\d+)/);
    if (!match) {
      element.textContent = rawValue;
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = rawValue.slice(match[0].length); // "+", "", etc.
    const duration = 1200;
    const start = performance.now();

    element.textContent = '0' + suffix;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // ─── Scroll Reveal Observer ─────────────────────────────────────────
  function initScrollReveal(root) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mold-visible');

            // Trigger counter animation for stats
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
  // Section Renderers
  // ═══════════════════════════════════════════════════════════════════

  const renderers = {};

  // ─── HERO ───────────────────────────────────────────────────────────
  renderers.hero = (data) => {
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
  };

  // ─── STATS ──────────────────────────────────────────────────────────
  renderers.stats = (data) => {
    const section = el('section', 'mold-section mold-reveal');
    if (data.id) section.id = data.id;
    if (data.animate) section.setAttribute('data-animate-counter', '');

    const grid = el('div', 'mold-stats mold-stagger');
    (data.items || []).forEach((item, i) => {
      const card = el('div', 'mold-stats__card mold-reveal');
      card.style.setProperty('--i', i);

      const val = el('div', 'mold-stats__value');
      val.setAttribute('data-value', item.value);
      // Show full value initially; counter will reset on scroll
      val.textContent = data.animate ? '0' : item.value;
      card.appendChild(val);

      card.appendChild(el('div', 'mold-stats__label', { text: item.label }));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  };

  // ─── TIMELINE ───────────────────────────────────────────────────────
  renderers.timeline = (data) => {
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
  };

  // ─── CARDS ──────────────────────────────────────────────────────────
  renderers.cards = (data) => {
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

      // Image / icon fallback
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

      // Links: support both singular "link" and plural "links"
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

      btn.innerHTML = `<span>${showLabel}</span> <span class="mold-expand-btn__chevron">▼</span>`;

      btn.addEventListener('click', () => {
        expanded = !expanded;
        grid.querySelectorAll('[data-expandable]').forEach((card) => {
          card.classList.toggle('mold-card--hidden', !expanded);
          if (expanded) {
            // Re-trigger reveal
            requestAnimationFrame(() => card.classList.add('mold-visible'));
          }
        });
        btn.innerHTML = `<span>${expanded ? hideLabel : showLabel}</span> <span class="mold-expand-btn__chevron">▼</span>`;
        btn.classList.toggle('mold-expand-btn--open', expanded);
      });

      section.appendChild(btn);
    }

    return section;
  };

  // ─── SKILLS ─────────────────────────────────────────────────────────
  renderers.skills = (data) => {
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
  };

  // ─── EXPERIENCE ─────────────────────────────────────────────────────
  renderers.experience = (data) => {
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
  };

  // ─── EDUCATION ──────────────────────────────────────────────────────
  renderers.education = (data) => {
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
  };

  // ─── WRITING ────────────────────────────────────────────────────────
  renderers.writing = (data) => {
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

      // Image or icon
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
  };

  // ─── FEATURES ───────────────────────────────────────────────────────
  renderers.features = (data) => {
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
  };

  // ─── CONTACT ────────────────────────────────────────────────────────
  renderers.contact = (data) => {
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
  };

  // ─── FOOTER ─────────────────────────────────────────────────────────
  renderers.footer = (data) => {
    const footer = el('footer', 'mold-footer mold-reveal');
    if (data.id) footer.id = data.id;
    footer.textContent = t(data.text) || '';
    return footer;
  };

  // ═══════════════════════════════════════════════════════════════════
  // Main Render
  // ═══════════════════════════════════════════════════════════════════

  // ─── i18n Support ──────────────────────────────────────────────────
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

    // Inject styles
    const existingStyle = document.getElementById('mold-engine-styles');
    if (existingStyle) existingStyle.remove();
    const style = document.createElement('style');
    style.id = 'mold-engine-styles';
    style.textContent = generateCSS();
    document.head.appendChild(style);

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

    // Apply theme
    applyTheme(json.theme || {}, container);

    // Initialize lightbox
    initLightbox(container);

    // Add language switcher if page has i18n
    if (json.page?.languages) {
      container.appendChild(createLangSwitcher(json.page.languages));
    }

    // Render sections
    (json.sections || []).forEach((sectionData) => {
      const renderer = renderers[sectionData.type];
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
      // Trigger counter animation for stats
      const statValues = container.querySelectorAll('.mold-stats__value');
      statValues.forEach((sv) => {
        const raw = sv.getAttribute('data-value');
        if (raw) animateCounter(sv, raw);
      });
    });
  }

  // ─── Public API ─────────────────────────────────────────────────────
  return { render, setLang, t };
})();

// Support CommonJS / ES module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mold;
}
