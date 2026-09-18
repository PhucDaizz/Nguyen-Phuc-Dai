# Design Tokens & Component CSS

The complete, authoritative spec for the style. Copy CSS verbatim — it is already
tuned (colors, spacing, glow, timing).

## 1. Color tokens

Declare exactly once in `:root`. Everything else references `var(--...)`.

```css
:root {
  /* 3-layer dark background + warm foreground */
  --bg:        #0a0e1a;   /* deepest */
  --bg-2:      #0d1424;   /* mid */
  --bg-3:      #161d33;   /* solid surfaces */

  --fg:        #f0e9d8;   /* cream, NOT pure white */
  --muted:     #7a83a3;   /* secondary text, labels, meta */

  /* primary accents */
  --accent:    #ffb547;   /* amber */
  --accent-2:  #ff7e5f;   /* coral */
  --accent-glow: rgba(255, 181, 71, 0.4);

  /* secondary accent — states only */
  --teal:      #2dd4bf;
  --teal-glow: rgba(45, 212, 191, 0.4);

  /* translucent surfaces */
  --card:        rgba(255, 255, 255, 0.025);
  --border:      rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.15);

  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 8px;
  --ease:      cubic-bezier(0.4, 0, 0.2, 1);
}
```

Forbidden palette: Tailwind blue `#3b82f6`, indigo, purple, neon pink.

## 2. Typography

Google Fonts, exactly two families:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Font | Size / style |
|---|---|---|
| H1 | Space Grotesk 700 | `clamp(40px, 6vw, 72px)`, letter-spacing `-0.02em` |
| H2 | Space Grotesk 700 | `clamp(28px, 3.5vw, 40px)`, amber gradient bar `::before` |
| H3 | Space Grotesk 700 | 18px, colored `--accent` |
| Body | Space Grotesk 400 | 14–15px, `rgba(240,233,216,.85)` |
| Label | JetBrains Mono 600 | 11px, UPPERCASE, letter-spacing `0.12em`, `--muted` |
| Stat / number / code | JetBrains Mono | 600–700, `--accent` for emphasis |

H1 accent word uses gradient text:
```css
h1 .accent {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## 3. Three-layer background (signature)

Stack as `body` background + two `body::before/::after` fixed pseudo-layers.
All decorative layers: `pointer-events: none; z-index: 0;`. Content wrapper: `position: relative; z-index: 1;`.

```css
body {
  font-family: 'Space Grotesk', sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
  overflow-x: hidden;
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(255,181,71,.07), transparent 50%),
    radial-gradient(ellipse 60% 50% at 80% 100%, rgba(45,212,191,.07), transparent 50%);
  background-attachment: fixed;
}
/* Layer 2 — masked grid */
body::before {
  content: ''; position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none; z-index: 0;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
}
/* Layer 3 — floating blobs */
body::after {
  content: ''; position: fixed; inset: 0;
  background-image:
    radial-gradient(circle at 25% 30%, rgba(255,181,71,.05), transparent 35%),
    radial-gradient(circle at 75% 70%, rgba(45,212,191,.05), transparent 35%);
  pointer-events: none; z-index: 0;
  animation: bgFloat 24s ease-in-out infinite;
}
@keyframes bgFloat {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(-30px, 25px); }
}
```

## 4. Layout

```css
.container { max-width: 1280px; margin: 0 auto; padding: 48px 28px 80px; position: relative; z-index: 1; }
.layout  { display: grid; grid-template-columns: 220px 1fr; gap: 40px; }
.grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.grid-3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 900px) {
  .layout, .grid-2, .grid-3 { grid-template-columns: 1fr; }
}
```

Sticky TOC (scroll-spy in JS):
```css
.toc { position: sticky; top: 24px; align-self: start; font-family: 'JetBrains Mono', monospace;
       font-size: 12px; max-height: calc(100vh - 48px); overflow-y: auto; }
.toc a { display: block; color: var(--muted); text-decoration: none; padding: 6px 12px;
         border-left: 2px solid var(--border); transition: all .2s; }
.toc a:hover, .toc a.active { color: var(--accent); border-left-color: var(--accent); }
```

## 5. Card (signature component)

Every card: translucent background, blurred border, and a 1px gradient light-bar
across its top edge. `.card.teal` swaps the bar to teal for secondary/result panels.

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  margin-bottom: 18px;
}
.card::before {
  content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.4;
}
.card.teal::before { background: linear-gradient(90deg, transparent, var(--teal), transparent); }
.card-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted);
  font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace; }
.card-title .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
  box-shadow: 0 0 8px var(--accent); }
```

## 6. Buttons, pills, badge

```css
.btn { background: transparent; border: 1px solid var(--border-strong); color: var(--fg);
  padding: 9px 16px; border-radius: 9px; font-family: 'Space Grotesk', sans-serif;
  font-weight: 500; font-size: 13px; cursor: pointer; transition: all .2s var(--ease);
  display: inline-flex; align-items: center; gap: 6px; }
.btn:hover { border-color: var(--accent); background: rgba(255,181,71,.06); color: var(--accent); }
.btn:active { transform: translateY(1px); }
.btn.primary { background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: var(--bg); border-color: transparent; font-weight: 700; }
.btn.primary:hover { box-shadow: 0 4px 20px var(--accent-glow); color: var(--bg); }
.btn.ghost { border-color: transparent; color: var(--muted); }
.btn.ghost:hover { color: var(--teal); background: rgba(45,212,191,.06); }

.pill { display: inline-block; padding: 4px 10px; background: rgba(45,212,191,.1);
  border: 1px solid rgba(45,212,191,.3); color: var(--teal); border-radius: 100px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; margin: 2px; }
.pill.amber { background: rgba(255,181,71,.1); border-color: rgba(255,181,71,.3); color: var(--accent); }

.badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
  background: rgba(255,181,71,.08); border: 1px solid rgba(255,181,71,.2); border-radius: 100px;
  color: var(--accent); font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; margin-bottom: 18px; font-family: 'JetBrains Mono', monospace; }
.badge::before { content: ''; width: 6px; height: 6px; background: var(--accent);
  border-radius: 50%; box-shadow: 0 0 8px var(--accent); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.7); } }
```

## 7. Code block

Window-style header (3 macOS dots: `#ff5f57 / #febc2e / #28c840`), filename + teal
pulse dot. Active line highlighted with amber left border.

```css
.code-block { background: rgba(0,0,0,.35); border: 1px solid var(--border);
  border-radius: var(--radius-md); overflow: hidden; margin: 14px 0; }
.code-head { display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,.2); }
.code-head .name { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted);
  display: flex; align-items: center; gap: 8px; }
pre { padding: 16px 18px; overflow-x: auto; font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px; line-height: 1.75; }
pre code .line { display: block; padding: 1px 10px; margin: 0 -10px; border-left: 3px solid transparent; }
pre code .line.active { background: rgba(255,181,71,.08); border-left-color: var(--accent); }
pre code .ln { color: var(--muted); opacity: .4; margin-right: 14px; user-select: none;
  display: inline-block; min-width: 20px; text-align: right; }
```

Syntax token colors (wrap code in spans):
`kw` `#ff7e5f` · `fn` `var(--accent)` · `var` `var(--teal)` · `num` `#c4b5fd` ·
`str` `#a3e635` · `com` `var(--muted)` italic · `punc` `var(--muted)`.

## 8. Lists, rule callouts, demo panel

```css
.checklist { list-style: none; padding: 0; }
.checklist li { padding: 8px 0 8px 28px; position: relative; font-size: 14.5px; }
.checklist li::before { content: ''; position: absolute; left: 0; top: 13px; width: 14px; height: 14px;
  border: 1.5px solid var(--accent); border-radius: 4px; background: rgba(255,181,71,.06); }
.checklist li::after { content: ''; position: absolute; left: 4px; top: 16px; width: 6px; height: 3px;
  border-left: 1.5px solid var(--accent); border-bottom: 1.5px solid var(--accent); transform: rotate(-45deg); }

.rule { background: linear-gradient(135deg, rgba(255,181,71,.08), rgba(255,126,95,.04));
  border: 1px solid rgba(255,181,71,.25); border-radius: var(--radius-md);
  padding: 16px 20px; margin: 14px 0; position: relative; }
.rule::before { content: 'QUY TẮC'; position: absolute; top: -8px; left: 16px; background: var(--bg);
  color: var(--accent); font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
  letter-spacing: 0.15em; padding: 2px 8px; border: 1px solid rgba(255,181,71,.25); border-radius: 4px; }
.rule.danger { background: linear-gradient(135deg, rgba(255,95,87,.1), rgba(255,95,87,.03));
  border-color: rgba(255,95,87,.3); }
.rule.danger::before { content: 'TRÁNH'; color: #ff5f57; border-color: rgba(255,95,87,.3); }

.demo { display: flex; flex-direction: column; gap: 14px; padding: 20px;
  background: rgba(0,0,0,.25); border-radius: var(--radius-md); border: 1px dashed var(--border); }
.demo-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.1em; }
```

## 9. Motion

- Universal easing: `cubic-bezier(0.4, 0, 0.2, 1)`, durations 0.3–0.5s (max 1s).
- Purpose mapping: `pulse` = active/processing · `pop-in` = newly added element ·
  `slide-in` = item entered a queue · `ringPulse` = node being processed.
- Reusable keyframes:

```css
@keyframes pulseDemo { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
@keyframes floatDemo { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes spinDemo  { to { transform: rotate(360deg); } }
```

## 10. Page chrome

```css
footer { margin-top: 80px; padding-top: 28px; border-top: 1px solid var(--border);
  text-align: center; color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 12px; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
::selection { background: var(--accent); color: var(--bg); }
```

## 11. Do / Don't checklist

**Do:** glow shadows on floating elements · active-line highlight in code · instant
feedback on every interaction · uppercase + letter-spacing for small labels · mono +
large + bold stat values · light-bar on card top · blurred borders on all surfaces.

**Don't:** white or pure-black backgrounds · Tailwind blue/indigo/purple defaults ·
`system-ui`/Inter alone · 2–4px border radius · solid black box-shadow · unbounded
paragraph width · animations over 1s.
