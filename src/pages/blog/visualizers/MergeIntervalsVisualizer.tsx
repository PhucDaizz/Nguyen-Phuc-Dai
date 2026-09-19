import { useMemo, useState } from 'react';
import { getSolutions, MERGE_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, IntervalBars,
} from './shared';

interface Step {
  type: 'init' | 'merge' | 'push' | 'done';
  idx: number | null;
  result: [number, number][];
  rest: [number, number][];
  message: string; codeLine: number;
}

const parseIntervals = (str: string): [number, number][] => {
  const out: [number, number][] = [];
  str.split(';').map((s) => s.trim()).filter(Boolean).forEach((p) => {
    const [a, b] = p.split(',').map((x) => Number(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b) && a <= b) out.push([a, b]);
  });
  return out;
};

const generateTrace = (input: [number, number][]): Step[] => {
  const trace: Step[] = [];
  const a = [...input].sort((x, y) => x[0] - y[0]);
  trace.push({
    type: 'init', idx: null, result: [], rest: a.map((x) => [...x] as [number, number]),
    message: `Sort theo start → [${a.map(([s, e]) => `[${s},${e}]`).join(', ') || '∅'}]. Giao thì kéo end, không thì chốt.`,
    codeLine: 1,
  });
  if (a.length === 0) {
    trace.push({
      type: 'done', idx: null, result: [], rest: [],
      message: 'Rỗng → <strong>[]</strong>.',
      codeLine: 1,
    });
    return trace;
  }
  const res: [number, number][] = [[...a[0]]];
  for (let i = 1; i < a.length; i++) {
    const [s, e] = a[i];
    const last = res[res.length - 1];
    if (s <= last[1]) {
      const prevEnd = last[1];
      last[1] = Math.max(last[1], e);
      trace.push({
        type: 'merge', idx: i, result: res.map((x) => [...x] as [number, number]), rest: a.slice(i + 1).map((x) => [...x] as [number, number]),
        message: `[${s},${e}]: start ${s} ≤ end ${prevEnd} → giao → kéo thành <strong>[${last}]</strong>.`,
        codeLine: 7,
      });
    } else {
      res.push([s, e]);
      trace.push({
        type: 'push', idx: i, result: res.map((x) => [...x] as [number, number]), rest: a.slice(i + 1).map((x) => [...x] as [number, number]),
        message: `[${s},${e}]: start ${s} > end ${last[1]} → rời nhau → chốt <strong>[${last}]</strong>, mở đoạn mới.`,
        codeLine: 8,
      });
    }
  }
  trace.push({
    type: 'done', idx: null, result: res.map((x) => [...x] as [number, number]), rest: [],
    message: `Hoàn tất → [${res.map(([s, e]) => `[${s},${e}]`).join(', ')}].`,
    codeLine: 8,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MERGE = getSolutions('merge-intervals-56');

export const MergeIntervalsVisualizer = () => {
  const [str, setStr] = useState('1,3;2,6;8,10;15,18');
  const [a, setA] = useState<[number, number][]>([[1, 3], [2, 6], [8, 10], [15, 18]]);
  const trace = useMemo(() => generateTrace(a), [a]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const na = parseIntervals(v);
    if (na.length === 0 || na.length > 7) return;
    pb.restart();
    setA(na);
  };

  const items = [
    ...step.result.map(([s, e], k) => ({
      s, e,
      label: k === step.result.length - 1 && step.type !== 'done' ? `đang gộp [${s},${e}]` : `chốt [${s},${e}]`,
      state: (k === step.result.length - 1 && step.type !== 'done' ? 'teal' : 'dim') as 'teal' | 'dim',
    })),
    ...step.rest.map(([s, e], k) => ({
      s, e,
      label: `[${s},${e}]`,
      state: (k === 0 && step.type !== 'done' && step.type !== 'init' ? 'cur' : undefined) as 'cur' | undefined,
    })),
  ];

  return (
    <div>
      <VizHeader
        backTo="/blog/merge-intervals-56" backLabel="Bài giảng Merge Intervals"
        badge="Sort + Merge · O(n log n)" title="Merge Intervals" accent="trực quan"
        sub="Sort start rồi quét: giao thì kéo dài end (teal), rời thì chốt đoạn cũ."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>TRỤC SỐ · ĐÃ SORT</div>
        <IntervalBars items={items} max={Math.max(1, ...a.flat())} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="intervals (đoạn cách ; — ≤7):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,3;2,6;8,10;15,18" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 4 đoạn', value: '1,3;2,6;8,10;15,18' },
          { label: 'Chưa sort · 8,10;1,3;2,6', value: '8,10;1,3;2,6' },
          { label: 'Gộp hết · 1,4;2,3', value: '1,4;2,3' },
          { label: 'Rời hết · 1,2;3,4', value: '1,2;3,4' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MERGE}
          defaultLang="csharp"
          getHighlight={(lang) => [MERGE_LINE_MAP[lang][step.type]]}
          meta="O(n log n)"
        />
      </div>
    </div>
  );
};
