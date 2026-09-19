import { useMemo, useState } from 'react';
import { getSolutions, NONOVERLAP_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, IntervalBars,
} from './shared';

interface Step {
  type: 'init' | 'keep' | 'remove' | 'done';
  idx: number | null;
  end: number;
  removed: number;
  kept: [number, number][];
  gone: [number, number][];
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
  const a = [...input].sort((x, y) => x[1] - y[1]);
  trace.push({
    type: 'init', idx: null, end: -Infinity, removed: 0, kept: [], gone: [],
    message: `Sort theo <strong>END</strong> (không phải start!): [${a.map(([s, e]) => `[${s},${e}]`).join(', ') || '∅'}]. Giữ đoạn kết thúc sớm nhất.`,
    codeLine: 1,
  });
  let end = -Infinity;
  let removed = 0;
  const kept: [number, number][] = [];
  const gone: [number, number][] = [];
  a.forEach(([s, e], i) => {
    if (s >= end) {
      end = e;
      kept.push([s, e]);
      trace.push({
        type: 'keep', idx: i, end, removed, kept: kept.map((x) => [...x] as [number, number]), gone: gone.map((x) => [...x] as [number, number]),
        message: `[${s},${e}]: start ${s} ≥ end cũ → <strong>giữ</strong>, end = ${e}.`,
        codeLine: 6,
      });
    } else {
      removed++;
      gone.push([s, e]);
      trace.push({
        type: 'remove', idx: i, end, removed, kept: kept.map((x) => [...x] as [number, number]), gone: gone.map((x) => [...x] as [number, number]),
        message: `[${s},${e}]: start ${s} < end ${end} → giao → <strong>xóa</strong> (${removed}).`,
        codeLine: 7,
      });
    }
  });
  trace.push({
    type: 'done', idx: null, end, removed, kept: kept.map((x) => [...x] as [number, number]), gone: gone.map((x) => [...x] as [number, number]),
    message: `Hoàn tất. Xóa ít nhất <strong>${removed}</strong> đoạn.`,
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_NONOVERLAP = getSolutions('non-overlapping-435');

export const NonOverlapVisualizer = () => {
  const [str, setStr] = useState('1,2;2,3;3,4;1,3');
  const [a, setA] = useState<[number, number][]>([[1, 2], [2, 3], [3, 4], [1, 3]]);
  const trace = useMemo(() => generateTrace(a), [a]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const na = parseIntervals(v);
    if (na.length === 0 || na.length > 7) return;
    pb.restart();
    setA(na);
  };

  const sorted = [...a].sort((x, y) => x[1] - y[1]);
  const items = sorted.map(([s, e], i) => {
    const isCur = step.idx === i && step.type !== 'done' && step.type !== 'init';
    const isKept = step.kept.some(([ks, ke]) => ks === s && ke === e);
    const isGone = step.gone.some(([ks, ke]) => ks === s && ke === e);
    return {
      s, e,
      label: isCur ? `xét [${s},${e}]` : `[${s},${e}]`,
      state: (isCur ? 'cur' : isGone ? 'bad' : isKept ? 'teal' : undefined) as 'cur' | 'teal' | 'bad' | undefined,
    };
  });

  return (
    <div>
      <VizHeader
        backTo="/blog/non-overlapping-435" backLabel="Bài giảng Non-overlapping"
        badge="Greedy by End · O(n log n)" title="Non-overlapping" accent="trực quan"
        sub="Sort theo END rồi tham lam: giữ đoạn kết thúc sớm nhất (teal), giao thì xóa (đỏ)."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>ĐÃ SORT END · END = {step.end === -Infinity ? '−∞' : step.end}</div>
          <IntervalBars items={items} max={Math.max(1, ...a.flat())} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            ĐÃ XÓA
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: '#ff7e7e', margin: 0 }}>
            {step.removed}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            giữ {step.kept.length} · chạm nhau (start=end) vẫn giữ được
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="intervals (≤7 đoạn):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2;2,3;3,4;1,3" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · → 1', value: '1,2;2,3;3,4;1,3' },
          { label: 'Bẫy sort-start · [1,100],[2,3],[3,4]', value: '1,100;2,3;3,4' },
          { label: 'Rời hết · → 0', value: '1,2;3,4' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_NONOVERLAP}
          defaultLang="csharp"
          getHighlight={(lang) => [NONOVERLAP_LINE_MAP[lang][step.type]]}
          meta="O(n log n)"
        />
      </div>
    </div>
  );
};
