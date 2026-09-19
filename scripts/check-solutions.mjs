// Verify solutions đa ngôn ngữ + line maps.
// Chạy: node scripts/check-solutions.mjs
// 1. coverage: mọi guide slug đều có SOLUTIONS đủ 6 ngôn ngữ
// 2. line map (*_LINE_MAP): đủ 6 ngôn ngữ, mọi index nằm trong số dòng code
// 3. mọi file visualizer đều đã chuyển sang SolutionTabs
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const LANGS = ['ts', 'csharp', 'python', 'java', 'cpp', 'js'];
let errors = 0;
const fail = (msg) => { errors++; console.error('FAIL:', msg); };
const ok = (msg) => console.log('ok:', msg);

// --- compile solutions.ts sang CJS temp để require ---
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sol-check-'));
execSync(
  `npx tsc src/data/solutions.ts --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck --declaration false --sourceMap false`,
  { cwd: ROOT, stdio: 'pipe' },
);
const sol = (await import(pathToFileURL(path.join(tmp, 'solutions.js')).href)).default
  ?? await import(pathToFileURL(path.join(tmp, 'solutions.js')).href);
const SOLUTIONS = sol.SOLUTIONS;

// --- slugs từ guides.ts và registry ---
const guidesSrc = fs.readFileSync(path.join(ROOT, 'src/data/guides.ts'), 'utf8');
const guideSlugs = [...new Set([...guidesSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]))];
const regSrc = fs.readFileSync(path.join(ROOT, 'src/pages/blog/visualizers/index.tsx'), 'utf8');
const vizSlugs = [...new Set([...regSrc.matchAll(/'([a-z0-9-]+)': \w+Visualizer/g)].map((m) => m[1]))];
const guideCodes = {};
for (const m of guidesSrc.matchAll(/slug: '([^']+)'(?:[\s\S]*?)code: `([\s\S]*?)`,\r?\n    highlightLines/g)) {
  guideCodes[m[1]] = m[2].replace(/\r\n/g, '\n');
}

// --- 1. coverage SOLUTIONS ---
for (const slug of guideSlugs) {
  const entry = SOLUTIONS[slug];
  if (!entry) { fail(`thiếu SOLUTIONS['${slug}']`); continue; }
  for (const lang of LANGS) {
    if (!entry[lang]?.trim()) fail(`SOLUTIONS['${slug}'] thiếu ngôn ngữ ${lang}`);
  }
  // ts phải khớp guide.code (giữ highlightLines đúng)
  if (guideCodes[slug] && entry.ts && entry.ts !== guideCodes[slug]) {
    fail(`SOLUTIONS['${slug}'].ts khác guide.code`);
  }
}
ok(`coverage SOLUTIONS: ${guideSlugs.length} slugs`);

// --- 2. line maps ---
// File dùng slug động (getSolutions theo prop/mode) → map slug thủ công
const MAP_SLUG_OVERRIDE = {
  LONGESTPAL_LINE_MAP: 'longest-palindrome-5',
  COUNTPAL_LINE_MAP: 'palindromic-substrings-647',
  MEETING2_LINE_MAP: 'meeting-rooms-ii-253',
  VALIDTREE_LINE_MAP: 'valid-tree-261',
  COMPONENTS_LINE_MAP: 'connected-components-323',
};
const mapNames = Object.keys(sol).filter((k) => k.endsWith('_LINE_MAP'));
const mappedLangs = new Set();
for (const name of mapNames) {
  const map = sol[name];
  // tìm slug mà map này phục vụ: dò file visualizer import tên này
  for (const lang of LANGS) {
    if (!map[lang]) { fail(`${name} thiếu ngôn ngữ ${lang}`); continue; }
    const code = SOLUTIONS[slugOfMap(name)]?.[lang];
    if (!code) continue; // slug chưa có entry → đã báo ở mục 1
    const n = code.split('\n').length;
    for (const [tag, idx] of Object.entries(map[lang])) {
      if (!Number.isInteger(idx) || idx < 0 || idx >= n) {
        fail(`${name}.${lang}.${tag} = ${idx} ngoài khoảng (0..${n - 1})`);
      }
    }
  }
}
function slugOfMap(name) {
  if (MAP_SLUG_OVERRIDE[name]) return MAP_SLUG_OVERRIDE[name];
  // whole-word match (tránh PRODUCT_LINE_MAP dính MAXPRODUCT_LINE_MAP)
  const re = new RegExp(`\\b${name}\\b`);
  // dò ngược: file visualizer nào import map này → slug có getSolutions literal trong file
  const dir = path.join(ROOT, 'src/pages/blog/visualizers');
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.tsx') || f === 'index.tsx' || f === 'shared.tsx') continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (re.test(src)) {
      for (const slug of vizSlugs) {
        const line = regSrc.split('\n').find((l) => l.includes(`'${slug}'`));
        if (line && src.includes(`getSolutions('${slug}')`)) return slug;
      }
      // fallback: suy từ getSolutions('slug') trong file
      const m = src.match(/getSolutions\('([^']+)'\)/);
      if (m) return m[1];
    }
  }
  return '__unknown__';
}
ok(`line maps: ${mapNames.length} maps (${mapNames.join(', ') || 'none'})`);

// map phải phủ mọi slug có visualizer
for (const slug of vizSlugs) {
  const has = mapNames.some((n) => slugOfMap(n) === slug);
  if (!has) fail(`slug có visualizer nhưng thiếu line map: ${slug}`);
  mappedLangs.add(slug);
}

// --- 3. mọi file visualizer dùng SolutionTabs ---
const dir = path.join(ROOT, 'src/pages/blog/visualizers');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx') && !['index.tsx', 'shared.tsx', 'TrieView.tsx'].includes(f));
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  if (!src.includes('SolutionTabs')) fail(`${f} chưa chuyển sang SolutionTabs`);
}
ok(`visualizer files dùng SolutionTabs: ${files.length} files`);

console.log(errors === 0 ? '\nPASS: tất cả yêu cầu đạt.' : `\n${errors} LỖI — chưa đạt.`);
process.exit(errors === 0 ? 0 : 1);
