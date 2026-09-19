// Audit line maps: (1) map csharp có nằm trong tập codeLine của trace không (bắt lỗi chép sai);
// (2) dòng csharp trỏ tới có phải `}`/trống không (bắt trace stale).
// Chạy: node scripts/audit-linemaps.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'));
execSync(`npx tsc src/data/solutions.ts --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck --declaration false --sourceMap false`, { cwd: ROOT, stdio: 'pipe' });
const sol = await import(pathToFileURL(path.join(tmp, 'solutions.js')).href);
const SOLUTIONS = sol.SOLUTIONS ?? sol.default?.SOLUTIONS;
const ranging = (s) => s; // noop

// slug -> map name: dò file visualizer import map + getSolutions literal (override cho file động)
const regSrc = fs.readFileSync(path.join(ROOT, 'src/pages/blog/visualizers/index.tsx'), 'utf8');
const vizSlugs = [...new Set([...regSrc.matchAll(/'([a-z0-9-]+)': \w+Visualizer/g)].map((m) => m[1]))];
const OVERRIDE = {
  LONGESTPAL_LINE_MAP: 'longest-palindrome-5', COUNTPAL_LINE_MAP: 'palindromic-substrings-647',
  MEETING2_LINE_MAP: 'meeting-rooms-ii-253', VALIDTREE_LINE_MAP: 'valid-tree-261',
  COMPONENTS_LINE_MAP: 'connected-components-323',
};
const mapNames = Object.keys(sol).filter((k) => k.endsWith('_LINE_MAP'));
const slugOfMap = (name) => {
  if (OVERRIDE[name]) return OVERRIDE[name];
  if (name === 'TWOSUM_LINE_MAP') return 'two-sum-1';
  const re = new RegExp(`\\b${name}\\b`);
  const dir = path.join(ROOT, 'src/pages/blog/visualizers');
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.tsx') || ['index.tsx', 'shared.tsx'].includes(f)) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (re.test(src)) {
      for (const slug of vizSlugs) {
        if (src.includes(`getSolutions('${slug}')`)) return slug;
      }
      const m = src.match(/getSolutions\('([^']+)'\)/);
      if (m) return m[1];
    }
  }
  return null;
};

// slug -> file visualizer (từ registry cần tên component -> file: dò import)
const fileOfSlug = (slug) => {
  const m = regSrc.match(new RegExp(`'${slug}': (\\w+)`));
  if (!m) return null;
  const comp = m[1];
  const dir = path.join(ROOT, 'src/pages/blog/visualizers');
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.tsx') || ['index.tsx', 'shared.tsx'].includes(f)) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (new RegExp(`\\b(export\\s+)?(const|function)\\s+${comp}\\b`).test(src)) return f;
  }
  return null;
};

let issues = 0;
for (const name of mapNames) {
  const slug = slugOfMap(name);
  if (!slug) { console.log(`WARN ${name}: không dò được slug`); continue; }
  const file = fileOfSlug(slug);
  if (!file) continue;
  const src = fs.readFileSync(path.join(ROOT, 'src/pages/blog/visualizers', file), 'utf8');
  // tập codeLine theo type trong trace
  const byType = {};
  const re = /type:\s*'(\w+)'[\s\S]{0,400}?codeLine:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    (byType[m[1]] ??= new Set()).add(Number(m[2]));
  }
  const map = sol[name].csharp;
  const code = SOLUTIONS[slug]?.csharp ?? '';
  const lines = code.split('\n');
  for (const [tag, idx] of Object.entries(map)) {
    const set = byType[tag];
    if (set && !set.has(idx)) {
      issues++;
      console.log(`COPY-ERR ${slug} ${name}.${tag}=${idx} (trace có: ${[...set].join(',')}) [${file}]`);
    }
    const line = (lines[idx] ?? '<out-of-range>').trim();
    if (line === '' || line === '}' || line === '{' || line === '});' || line === '});') {
      issues++;
      console.log(`STALE ${slug} ${name}.${tag}=${idx} trỏ dòng "${line}" [${file}]`);
    }
  }
}
console.log(issues === 0 ? 'AUDIT PASS' : `AUDIT: ${issues} điểm cần xem`);
