import { useMemo, useState } from 'react';
import { getSolutions, INSERT_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, IntervalBars,
} from './shared';

interface Step {
  type: 'init' | 'keep' | 'merge' | 'insert' | 'done';
  idx: number | null;
  cur: [number, number]; // newInterval hiện tại
  result: [number, number][];
  merged: [number, number][]; // đoạn gốc đã bị gộp (tiêu thụ)
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

const generateTrace = (a: [number, number][], nw0: [number, number]): Step[] => {
  const trace: Step[] = [];
  let nw: [number, number] = [...nw0];
  const res: [number, number][] = [];
  const merged: [number, number][] = [];
  const snapR = () => res.map((x) => [...x] as [number, number]);
  const snapM = () => merged.map((x) => [...x] as [number, number]);
  trace.push({
    type: 'init', idx: null, cur: [...nw], result: [], merged: [], rest: [...a],
    message: `Chèn [${nw}] vào list đã sort. 3 vùng: hết trước → giữ, giao → gộp, sau → chèn.`,
    codeLine: 1,
  });
  let i = 0;
  while (i < a.length && a[i][1] < nw[0]) {
    res.push(a[i]);
    trace.push({
      type: 'keep', idx: i, cur: [...nw], result: snapR(), merged: snapM(), rest: a.slice(i + 1).map((x) => [...x] as [number, number]),
      message: `[${a[i]}] hết trước [${nw}] (end ${a[i][1]} < ${nw[0]}) → <strong>giữ nguyên</strong>.`,
      codeLine: 4,
    });
    i++;
  }
  while (i < a.length && a[i][0] <= nw[1]) {
    const before: [number, number] = [...a[i]];
    const oldEnd = nw[1];
    nw = [Math.min(nw[0], a[i][0]), Math.max(nw[1], a[i][1])];
    merged.push(before);
    trace.push({
      type: 'merge', idx: i, cur: [...nw], result: snapR(), merged: snapM(), rest: a.slice(i + 1).map((x) => [...x] as [number, number]),
      message: `[${before}] có start ${before[0]} ≤ end ${oldEnd} của new → <strong>giao nhau</strong> → new nở thành <strong>[${nw}]</strong>.`,
      codeLine: 7,
    });
    i++;
  }
  res.push([...nw]);
  trace.push({
    type: 'insert', idx: null, cur: [...nw], result: snapR(), merged: snapM(), rest: a.slice(i).map((x) => [...x] as [number, number]),
    message: `Chèn <strong>[${nw}]</strong> (đã nuốt ${merged.length} đoạn), giữ nốt phần sau.`,
    codeLine: 11,
  });
  trace.push({
    type: 'done', idx: null, cur: [...nw], result: snapR(), merged: snapM(), rest: [],
    message: `Hoàn tất → [${res.map(([s, e]) => `[${s},${e}]`).join(', ')}].`,
    codeLine: 11,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_INSERT = getSolutions('insert-interval-57');

export const InsertIntervalVisualizer = () => {
  const [aStr, setAStr] = useState('1,3;6,9');
  const [nStr, setNStr] = useState('2,5');
  const [a, setA] = useState<[number, number][]>([[1, 3], [6, 9]]);
  const [nw0, setNw0] = useState<[number, number]>([2, 5]);
  const trace = useMemo(() => generateTrace(a, nw0), [a, nw0]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (x: string, y: string) => {
    const na = parseIntervals(x);
    const parts = y.split(',').map((s) => Number(s.trim()));
    if (na.length > 6 || parts.length !== 2 || parts.some(Number.isNaN) || parts[0] > parts[1]) return;
    pb.restart();
    setA(na);
    setNw0([parts[0], parts[1]]);
  };

  const inList = (list: [number, number][], s: number, e: number) =>
    list.some(([x, y]) => x === s && y === e);

  // List gốc giữ nguyên thứ tự, mỗi đoạn 1 badge trạng thái
  const items: { s: number; e: number; label: string; state?: 'cur' | 'teal' | 'dim' | 'bad' | 'dashed' }[] = [
    { s: step.cur[0], e: step.cur[1], label: `new = [${step.cur}]`, state: 'dashed' as const },
    ...a.map(([s, e], k) => {
      const eaten = inList(step.merged, s, e);
      const kept = inList(step.result, s, e);
      const isCur = step.idx === k && (step.type === 'keep' || step.type === 'merge');
      if (isCur && step.type === 'merge') return { s, e, label: `[${s},${e}] \u0110ANG G\u1ED8P`, state: 'cur' as const };
      if (isCur) return { s, e, label: `[${s},${e}] GI\u1EEE`, state: 'cur' as const };
      if (eaten) return { s, e, label: `[${s},${e}] \u0110\u00C3 GOP`, state: 'teal' as const };
      if (kept) return { s, e, label: `[${s},${e}] GI\u1EEE`, state: 'dim' as const };
      return { s, e, label: `[${s},${e}] CH\u1EDC`, state: undefined };
    }),
  ];

  return (
    <div>
      <VizHeader
        backTo="/blog/insert-interval-57" backLabel="Bài giảng Insert Interval"
        badge="3 Vùng · O(n)" title="Insert Interval" accent="trực quan"
        sub="Thanh new (viền đứt) nở dần mỗi lần gộp. List gốc giữ nguyên thứ tự, mỗi đoạn 1 badge: GIỮ (mờ) · ĐÃ GỘP (teal) · ĐANG GỘP/XÉT (amber) · CHỜ."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>TRỤC SỐ · NEW = [{step.cur.join(',')}]</div>
        <IntervalBars items={items} max={Math.max(1, ...a.flat(), ...nw0)} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="intervals (đoạn cách ;):" value={aStr} onChange={setAStr} onEnter={() => build(aStr, nStr)} placeholder="1,3;6,9" maxWidth={200} />
        <InputField label="new [s,e]:" value={nStr} onChange={setNStr} onEnter={() => build(aStr, nStr)} placeholder="2,5" maxWidth={90} />
        <button className="btn" onClick={() => build(aStr, nStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · [2,5]', value: '1,3;6,9|2,5' },
          { label: 'Nuốt 2 đoạn · [2,7] → [1,9]', value: '1,3;6,9|2,7' },
          { label: 'Chèn đầu · [0,0]', value: '1,3;6,9|0,0' },
          { label: 'Gộp hết · [0,10]', value: '1,3;6,9|0,10' },
          { label: 'Rỗng + [5,7]', value: '|5,7' },
        ]}
        onPick={(v) => {
          const [x, y] = v.split('|');
          setAStr(x);
          setNStr(y);
          build(x, y);
        }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_INSERT}
          defaultLang="csharp"
          getHighlight={(lang) => [INSERT_LINE_MAP[lang][step.type]]}
          meta="O(n)"
        />
      </div>
    </div>
  );
};
