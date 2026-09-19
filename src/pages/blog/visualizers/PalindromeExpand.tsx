import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell,
} from './shared';
import { getSolutions, LONGESTPAL_LINE_MAP, COUNTPAL_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'center' | 'done';
  center: [number, number] | null; // [l, r] tâm đang bung
  cur: [number, number] | null; // [l, r] hiện tại khi bung
  best: [number, number] | null; // [l, r] dài nhất
  count: number; // cho 647 (bài 5 bỏ qua)
  message: string; codeLine: number;
}

// Dùng chung cho 5 (giữ dài nhất) và 647 (đếm). mode quyết định message/result.
const generateTrace = (s: string, mode: 'longest' | 'count'): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', center: null, cur: null, best: null, count: 0,
    message: `Mỗi vị trí bung 2 tâm (lẻ + chẵn). ${mode === 'longest' ? 'Giữ chuỗi dài nhất.' : 'Khớp lần nào đếm lần đó.'}`,
    codeLine: 2,
  });
  let best: [number, number] | null = null;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    for (const [l0, r0] of [[i, i], [i, i + 1]] as [number, number][]) {
      let l = l0;
      let r = r0;
      let matched = false;
      while (l >= 0 && r < s.length && s[l] === s[r]) {
        matched = true;
        if (mode === 'longest') {
          if (!best || r - l + 1 > best[1] - best[0] + 1) best = [l, r];
        } else {
          count++;
        }
        trace.push({
          type: 'center',
          center: [l0, r0],
          cur: [l, r],
          best: mode === 'longest' ? best : null,
          count,
          message:
            mode === 'longest'
              ? `Tâm (${l0},${r0}): bung tới [${l},${r}] = "${s.slice(l, r + 1)}" dài <strong>${r - l + 1}</strong>${best && best[0] === l && best[1] === r ? ' ← best mới!' : ''}.`
              : `Tâm (${l0},${r0}): [${l},${r}] = "${s.slice(l, r + 1)}" đối xứng → <strong>+1</strong> (tổng ${count}).`,
          codeLine: 3,
        });
        l--;
        r++;
      }
      if (!matched) {
        trace.push({
          type: 'center',
          center: [l0, r0],
          cur: null,
          best: mode === 'longest' ? best : null,
          count,
          message: `Tâm (${l0},${r0}): '${s[l0] ?? ''}' vs '${s[r0] ?? ''}' lệch ngay → bỏ.`,
          codeLine: 3,
        });
      }
    }
  }
  const bestStr = best ? s.slice(best[0], best[1] + 1) : '';
  trace.push({
    type: 'done', center: null, cur: null, best, count,
    message:
      mode === 'longest'
        ? s.length === 0
          ? 'Chuỗi rỗng → <strong>""</strong>.'
          : `Hoàn tất. Dài nhất = "<strong>${bestStr}</strong>" (dài ${best ? best[1] - best[0] + 1 : 0}).`
        : `Hoàn tất. Đếm được <strong>${count}</strong> chuỗi con đối xứng.`,
    codeLine: mode === 'longest' ? 13 : 3,
  });
  return trace;
};

const PalExpand = ({ slug, backLabel, badge, title, mode, presets, stats }: {
  slug: string;
  backLabel: string;
  badge: string;
  title: string;
  mode: 'longest' | 'count';
  presets: { label: string; value: string }[];
  stats: string;
}) => {
  const [str, setStr] = useState(presets[0].value);
  const [s, setS] = useState(presets[0].value);
  const trace = useMemo(() => generateTrace(s, mode), [s, mode]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  // SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace)
  const solutions = getSolutions(slug);
  const lineMap = mode === 'longest' ? LONGESTPAL_LINE_MAP : COUNTPAL_LINE_MAP;

  const build = (v: string) => {
    const nv = v.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    pb.restart();
    setS(nv);
  };

  const inCur = (i: number) =>
    step.cur !== null && i >= step.cur[0] && i <= step.cur[1];
  const inBest =
    mode === 'longest' && step.best !== null && step.type !== 'init';

  return (
    <div>
      <VizHeader
        backTo={`/blog/${slug}`} backLabel={backLabel}
        badge={badge} title={title} accent="trực quan"
        sub="Bung 2 phía từ mỗi tâm (lẻ + chẵn): khớp thì mở rộng tiếp, lệch thì dừng."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>CHUỖI · {mode === 'longest' ? `BEST = "${step.best ? s.slice(step.best[0], step.best[1] + 1) : '—'}"` : `ĐẾM = ${step.count}`}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {s.split('').map((c, i) => {
            const cur = inCur(i);
            const best =
              inBest && step.best !== null && i >= step.best[0] && i <= step.best[1];
            const isCenter =
              step.center !== null && (i === step.center[0] || i === step.center[1]);
            return (
              <ArrCell
                key={i}
                v={c}
                sub={`${isCenter ? 'TÂM ' : ''}[${i}]`}
                state={cur ? 'cur' : best ? 'teal' : undefined}
              />
            );
          })}
          {s.length === 0 && (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng</p>
          )}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s (chữ/số, ≤10):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="babad" maxWidth={200} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={presets}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={solutions}
          defaultLang="csharp"
          getHighlight={(lang) => [lineMap[lang][step.type]]}
          meta={stats}
        />
      </div>
    </div>
  );
};

export const LongestPalVisualizer = () => (
  <PalExpand
    slug="longest-palindrome-5"
    backLabel="Bài giảng Longest Palindrome"
    badge="Expand Center · O(n²)"
    title="Longest Palindrome"
    mode="longest"
    stats="O(n²) · O(1)"
    presets={[
      { label: 'LeetCode · babad', value: 'babad' },
      { label: 'Chẵn · cbbd → bb', value: 'cbbd' },
      { label: '1 chữ · a', value: 'a' },
      { label: 'Rỗng', value: '' },
    ]}
  />
);

export const CountPalVisualizer = () => (
  <PalExpand
    slug="palindromic-substrings-647"
    backLabel="Bài giảng Palindromic Substrings"
    badge="Expand Center · Count"
    title="Count Palindromes"
    mode="count"
    stats="O(n²) · O(1)"
    presets={[
      { label: 'LeetCode · aaa → 6', value: 'aaa' },
      { label: 'abc → 3', value: 'abc' },
      { label: 'abba → 6', value: 'abba' },
    ]}
  />
);
