---
name: dsa-html-style
description: >
  Personal HTML visual style guide for generating single-file HTML pages (demos,
  dashboards, algorithm visualizations, landing pages, interactive tools).
  Triggers whenever the user asks to create/build/generate an HTML page, web demo,
  visualization, dashboard, or any standalone HTML artifact — unless the user gives
  explicit, different styling instructions for that specific page. Enforces a fixed
  design system: dark 3-layer background, amber/coral + teal accents, Space Grotesk
  + JetBrains Mono fonts, glowing cards, code blocks with line highlight, and
  purposeful motion. Keywords: tao trang html, html demo, visualization, dashboard,
  trang web, style guide, boilerplate html.
---

# DSA HTML Style

A fixed design system for every standalone HTML page this assistant generates.
The core philosophy: **each page is an experience, not a document** — dark premium
dashboard aesthetic, warm accents, depth through layered backgrounds and glow
shadows, every decorative detail purposeful.

## When to apply

- User asks for any HTML page / demo / visualization / dashboard / tool / landing page.
- User asks for "mô phỏng", "visualize", "minh họa trực quan" một bài toán → áp dụng
  thêm [references/visualizer.md](references/visualizer.md) (trace-engine + 7 khối page,
  code solution bằng C#).
- User says "theo phong cách của tôi", "dùng style guide", or references this skill.
- **Do NOT apply** when the user explicitly specifies a different style (e.g. light theme,
  specific brand palette, existing design system) for that particular page.
- **Blog DSA / Grind75 trong portfolio này**: luôn áp dụng style này cho mọi page
  dưới route `/blog` (list + detail), trừ khi user yêu cầu style khác.

## Golden rules (never break)

1. **Dark background only** — never white/pure-black backgrounds (`--bg: #0a0e1a`).
2. **Warm foreground** — `#f0e9d8` cream, never pure white text.
3. **Exactly 2 accent families** — amber `#ffb547` (primary) + coral `#ff7e5f` (gradient
   partner); teal `#2dd4bf` strictly for secondary/success states.
4. **Glow, not solid shadows** — floating elements use colored `box-shadow` glow
   (`rgba(255,181,71,.4)`), never solid black shadows.
5. **Mono for data** — numbers, code, labels, badges, stat values → JetBrains Mono.
6. **Token-first** — never hardcode hex inside components; always `var(--...)`.

## Workflow (order matters)

1. **Tokens**: declare the `:root` block exactly as defined in
   [references/design-tokens.md](references/design-tokens.md).
2. **Background**: stack the 3 layers (gradient ellipses → masked grid → floating blobs).
3. **Layout**: `.container` (max-width 1280px) → `.layout` (sticky TOC + main) or
   `.grid-2` / `.grid-3`.
4. **Components**: card → button → badge/pill → code block → demo panels.
5. **Motion**: add `cubic-bezier(0.4, 0, 0.2, 1)` transitions and purposeful animations.
6. **JS last**: interactions, TOC scroll-spy, canvas logic — after all CSS is set.

## Quick reference

| Element        | Rule                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Fonts          | Space Grotesk (UI) + JetBrains Mono (data/code), Google Fonts, 2 fonts max                         |
| Radius         | 20px large card · 14px small card · 8–9px button                                                |
| Gap            | 14–18px between cards · 24px card padding                                                        |
| Card signature | 1px gradient light-bar on top edge (`::before`, amber or teal)                                     |
| Badge          | pill, mono uppercase, pulsing amber dot                                                            |
| Code block     | window header (3 colored dots + filename + pulse dot), line numbers, amber left-border active line |
| Syntax colors  | kw coral · fn amber · var teal · num #c4b5fd · str #a3e635 · com muted italic                 |
| Animation      | 0.3–0.5s duration; pulse = active, pop-in = newly added, slide-in = entered queue                 |
| Background     | 3 stacked fixed layers,`pointer-events: none`, `z-index: 0`, content at `z-index: 1`               |

## Forbidden

- Tailwind default blue `#3b82f6`, indigo, purple, neon pink.
- `system-ui` / Inter as the only font.
- Border-radius 2–4px.
- Solid black `box-shadow`.
- Animations longer than 1s or purely decorative motion.

## Resources

- [references/design-tokens.md](references/design-tokens.md) — full token list, component
  CSS (card, button, badge, code block, checklist, rule box, pill, TOC, demo panel), the
  3-layer background recipe, animation keyframes, and the Do/Don't checklist.
- [assets/boilerplate.html](assets/boilerplate.html) — copy-paste starting page with all
  tokens, background layers, grid layout and one of each core component wired up.
  Copy it, replace content, keep the tokens.
- [references/visualizer.md](references/visualizer.md) — **mẫu chuẩn visualizer từng bài
  toán**: trace-engine (`build → generateTrace → renderStep`), 7 khối page bắt buộc
  (header+stats, visualization SVG, state cards, description-bar, controls
  Play/Back/Step/Reset + speed + custom input, presets, shortcuts, code panel),
  node visuals theo cấu trúc dữ liệu. Solution code luôn viết bằng **C#**.
- [assets/visualizer-reference.html](assets/visualizer-reference.html) — reference
  implementation hoàn chỉnh (BFS Level Order Traversal): copy cấu trúc + CSS trạng thái
  node (`idle/in-queue/current/child-enqueue/processed`), đổi data + trace theo bài mới.

## Portfolio mapping (React, không phải single-file HTML)

Khi áp dụng vào React portfolio này, map class trong skill sang scope `.dsa-scope`:

- `body` background 3-layer → `.dsa-scope` + `.dsa-scope::before/::after`
- `.container` → `.dsa-container` (giữ `HeaderNav` fixed, padding-top 7rem)
- `.card`, `.badge`, `.pill`, `.btn`, `.rule`, `.code-block`, `.checklist`,
  `.demo`, `.toc`, `.grid-2/3` → giữ nguyên tên class nhưng bọc trong `.dsa-scope`
  để không vỡ theme 3D của trang chủ `/`.
- Fonts: import Space Grotesk + JetBrains Mono trong `src/pages/blog/dsa.css`
  qua `@import` Google Fonts.
- Mỗi bài Blind75: badge (category + pattern) → h1 → rule (ý tưởng chính) →
  card checklist (nhận diện pattern) → code-block (solution + highlight dòng key)
  → card teal (complexity + test) → demo (dry-run / edge cases).
- Visualizer từng bài toán: tuân thủ [references/visualizer.md](references/visualizer.md).
