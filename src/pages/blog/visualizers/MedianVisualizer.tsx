import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'add' | 'median' | 'done';
  lo: number[]; // max-heap (hiển thị sort giảm dần để dễ đọc)
  hi: number[]; // min-heap (tăng dần)
  median: number | null;
  added: number | null;
  medians: number[];
  message: string; codeLine: number;
}

// Mô phỏng 2 heap bằng mảng sort (minh họa bất biến; heap thật trong code)
const generateTrace = (seq: number[]): Step[] => {
  const trace: Step[] = [];
  let lo: number[] = [];
  let hi: number[] = [];
  const medians: number[] = [];
  trace.push({
    type: 'init', lo: [], hi: [], median: null, added: null, medians: [],
    message: `2 heap: <strong>lo</strong> (max-heap, nửa dưới) + <strong>hi</strong> (min-heap, nửa trên). Mọi số lo ≤ mọi số hi, size chênh ≤ 1.`,
    codeLine: 7,
  });
  for (const x of seq) {
    // addNum: vào lo → chuyển max sang hi → cân bằng
    lo = [...lo, x].sort((a, b) => b - a);
    const move = lo.shift()!;
    hi = [...hi, move].sort((a, b) => a - b);
    if (lo.length < hi.length) {
      const back = hi.shift()!;
      lo = [back, ...lo].sort((a, b) => b - a);
    }
    const med = lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2;
    medians.push(med);
    trace.push({
      type: 'add', lo: [...lo], hi: [...hi], median: med, added: x, medians: [...medians],
      message: `add <strong>${x}</strong>: vào lo → chuyển max (<strong>${move}</strong>) sang hi → cân bằng. lo=[${lo.join(', ')}], hi=[${hi.join(', ')}].`,
      codeLine: 9,
    });
    trace.push({
      type: 'median', lo: [...lo], hi: [...hi], median: med, added: null, medians: [...medians],
        message: lo.length > hi.length
          ? `lo nhiều hơn → median = đỉnh lo = <strong>${med}</strong>.`
          : `Bằng nhau → median = (${lo[0]} + ${hi[0]})/2 = <strong>${med}</strong>.`,
      codeLine: 13,
    });
  }
  trace.push({
    type: 'done', lo: [...lo], hi: [...hi], median: medians[medians.length - 1] ?? null, added: null, medians: [...medians],
    message: seq.length === 0
      ? 'Chưa add số nào.'
      : `Hoàn tất. Dãy median: [${medians.join(', ')}].`,
    codeLine: 13,
  });
  return trace;
};

const CSHARP_LINES = [
  'public class MedianFinder {',
  '    private readonly PriorityQueue<int, int> lo; // max-heap: priority = -val',
  '    private readonly PriorityQueue<int, int> hi; // min-heap',
  '    public MedianFinder() {',
  '        lo = new PriorityQueue<int, int>();',
  '        hi = new PriorityQueue<int, int>();',
  '    }',
  '    public void AddNum(int x) {',
  '        lo.Enqueue(x, -x);',
  '        hi.Enqueue(lo.Peek(), lo.Dequeue());',
  '        if (lo.Count < hi.Count)',
  '            lo.Enqueue(hi.Peek(), -hi.Dequeue());',
  '    }',
  '    public double FindMedian() {',
  '        if (lo.Count > hi.Count) return lo.Peek();',
  '        return (lo.Peek() + hi.Peek()) / 2.0;',
  '    }',
  '}',
];

const HeapRow = ({ label, values, color, top }: {
  label: string; values: number[]; color: string; top: boolean;
}) => (
  <div style={{ marginBottom: 10 }}>
    <div className="demo-label" style={{ marginBottom: 4 }}>{label} (size {values.length})</div>
    {values.length === 0 ? (
      <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng</p>
    ) : (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {values.map((v, i) => (
          <div
            key={i}
            style={{
              minWidth: 44, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
              border: `2px solid ${i === 0 ? color : 'var(--border)'}`,
              background: i === 0 ? 'rgba(255,181,71,.1)' : 'rgba(0,0,0,.25)',
              color: i === 0 ? color : 'var(--fg)',
              fontFamily: "'JetBrains Mono', monospace", fontWeight: i === 0 ? 700 : 400, fontSize: 14,
              boxShadow: i === 0 ? '0 0 10px var(--accent-glow)' : 'none',
            }}
          >
            {v}
            <div style={{ fontSize: 8, color: 'var(--muted)' }}>{i === 0 && top ? 'đỉnh' : ''}&nbsp;</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const MedianVisualizer = () => {
  const [str, setStr] = useState('1,2,3');
  const [seq, setSeq] = useState<number[]>([1, 2, 3]);
  const trace = useMemo(() => generateTrace(seq), [seq]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length === 0 || nv.length > 8) return;
    pb.restart();
    setSeq(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/find-median-295" backLabel="Bài giảng Find Median"
        badge="Two Heaps · O(log n)" title="Median Stream" accent="trực quan"
        sub="Số mới vào lo → chuyển max sang hi → cân bằng size. Median đọc từ 1-2 đỉnh, không cần sort cả dòng."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>2 HEAP · VỪA ADD {step.added === null ? '—' : step.added}
          </div>
          <HeapRow label="lo — max-heap (nửa dưới, giảm dần)" values={step.lo} color="var(--accent)" top />
          <HeapRow label="hi — min-heap (nửa trên, tăng dần)" values={step.hi} color="var(--teal)" top />
          <p className="mono" style={{ fontSize: 11, color: step.lo.length - step.hi.length > 1 || step.hi.length > step.lo.length ? '#ff5f57' : 'var(--teal)', margin: '4px 0 0' }}>
            bất biến: mọi lo ≤ mọi hi · chênh size = {Math.abs(step.lo.length - step.hi.length)} (≤ 1 ✓)
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              MEDIAN
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.median === null ? '?' : step.median}
            </p>
          </div>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>LỊCH SỬ MEDIAN</div>
            <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--accent)' }}>
              [{step.medians.join(', ') || '—'}]
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="dãy add (≤8 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 1,2,3 → 1.5, 2', value: '1,2,3' },
          { label: 'Giảm dần · 5,4,3,2,1', value: '5,4,3,2,1' },
          { label: 'Trùng · 2,2,2', value: '2,2,2' },
          { label: 'Âm · -1,-2,-3', value: '-1,-2,-3' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(log n) add" />
    </div>
  );
};
