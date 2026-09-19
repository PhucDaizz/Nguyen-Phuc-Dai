// Dump phục vụ review thủ công: với mỗi map flagged → code csharp đánh số + map + trace steps.
// Chạy: node scripts/dump-review.mjs [slugPrefix]
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const filter = process.argv[2] ?? '';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dump-'));
execSync(`npx tsc src/data/solutions.ts --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck --declaration false --sourceMap false`, { cwd: ROOT, stdio: 'pipe' });
const sol = await import(pathToFileURL(path.join(tmp, 'solutions.js')).href);
const SOLUTIONS = sol.SOLUTIONS ?? sol.default?.SOLUTIONS;

const regSrc = fs.readFileSync(path.join(ROOT, 'src/pages/blog/visualizers/index.tsx'), 'utf8');
const vizSlugs = [...new Set([...regSrc.matchAll(/'([a-z0-9-]+)': \w+Visualizer/g)].map((m) => m[1]))];
const OVERRIDE = {
  LONGESTPAL_LINE_MAP: 'longest-palindrome-5', COUNTPAL_LINE_MAP: 'palindromic-substrings-647',
  MEETING2_LINE_MAP: 'meeting-rooms-ii-253', VALIDTREE_LINE_MAP: 'valid-tree-261',
  COMPONENTS_LINE_MAP: 'connected-components-323',
};
const mapNames = Object.keys(sol).filter((k) => k.endsWith('_LINE_MAP'));
const fileOfSlug = (slug) => {
  const m = regSrc.match(new RegExp(`'${slug}': (\\w+)`));
  if (!m) return null;
  const dir = path.join(ROOT, 'src/pages/blog/visualizers');
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.tsx') || ['index.tsx', 'shared.tsx'].includes(f)) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (new RegExp(`\\b(export\\s+)?(const|function)\\s+${m[1]}\\b`).test(src)) return f;
  }
  return null;
};

for (const name of mapNames) {
  const slug = OVERRIDE[name] ?? (() => {
    const re = new RegExp(`\\b${name}\\b`);
    const dir = path.join(ROOT, 'src/pages/blog/visualizers');
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.tsx') || ['index.tsx', 'shared.tsx'].includes(f)) continue;
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      if (re.test(src)) {
        for (const s of vizSlugs) if (src.includes(`getSolutions('${s}')`)) return s;
        const mm = src.match(/getSolutions\('([^']+)'\)/);
        if (mm) return mm[1];
      }
    }
    return null;
  })();
  if (!slug || (filter && !slug.startsWith(filter))) continue;
  const file = fileOfSlug(slug);
  const src = fs.readFileSync(path.join(ROOT, 'src/pages/blog/visualizers', file), 'utf8');
  console.log(`\n############ ${slug} [${file}] ${name} ############`);
  console.log('--- csharp (numbered) ---');
  (SOLUTIONS[slug]?.csharp ?? '').split('\n').forEach((l, n) => console.log(`  ${n}: ${l}`));
  console.log('--- map.csharp ---', JSON.stringify(sol[name].csharp));
  console.log('--- trace (type → codeLine) ---');
  const re2 = /type:\s*'(\w+)'/g;
  const pairs = [];
  let m2;
  while ((m2 = re2.exec(src))) {
    const after = src.slice(m2.index, m2.index + 600);
    const cm = after.match(/codeLine:\s*(\d+)/);
    pairs.push(`  ${m2[1]} → ${cm ? cm[1] : '?'}`);
  }
  console.log([...new Set(pairs)].join('\n'));
}
