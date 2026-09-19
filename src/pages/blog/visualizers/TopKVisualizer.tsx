import { useMemo, useState } from 'react';
import { getSolutions, TOPK_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'count' | 'bucket' | 'take' | 'done';
  freq: [number, number][]; // [val, count]
  buckets: number[][]; // index = tần suất
  result: number[];
  cur: number | null; // tần suất đang quét / giá trị đang đếm
  message: string; codeLine: number;
}

const generateTrace = (nums: number[], k: number): Step[] => {
  const trace: Step[] = [];
  const freq = new Map<number, number>();
  trace.push({
    type: 'init', freq: [], buckets: [], result: [], cur: null,
    message: `Đếm tần suất từng số, rồi bucket theo tần suất (index = số lần xuất hiện). Lấy K = <strong>${k}</strong>.`,
    codeLine: 1,
  });
  for (const x of nums) {
    freq.set(x, (freq.get(x) ?? 0) + 1);
    trace.push({
      type: 'count', freq: [...freq.entries()], buckets: [], result: [], cur: x,
      message: `Gặp <strong>${x}</strong> → count = <strong>${freq.get(x)}</strong>.`,
      codeLine: 2,
    });
  }
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, c] of freq) buckets[c].push(val);
  trace.push({
    type: 'bucket', freq: [...freq.entries()], buckets: buckets.map((b) => [...b]), result: [], cur: null,
    message: `Xếp bucket: ${buckets.map((b, f) => (b.length > 0 ? `f=${f}:[${b.join(',')}]` : '')).filter(Boolean).join(' · ')}.`,
    codeLine: 4,
  });
  const res: number[] = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    if (buckets[f].length === 0) continue;
    res.push(...buckets[f]);
    trace.push({
      type: 'take', freq: [...freq.entries()], buckets: buckets.map((b) => [...b]), result: [...res], cur: f,
      message: `Quét f = <strong>${f}</strong>: lấy [${buckets[f].join(', ')}] → đủ ${res.length}/${k}.`,
      codeLine: 7,
    });
  }
  trace.push({
    type: 'done', freq: [...freq.entries()], buckets: buckets.map((b) => [...b]), result: [...res], cur: null,
    message: `Hoàn tất. Top ${k} = <strong>[${res.slice(0, k).join(', ')}]</strong>.`,
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_TOPK = getSolutions('top-k-frequent-347');

export const TopKVisualizer = () => {
  const [str, setStr] = useState('1,1,1,2,2,3');
  const [kStr, setKStr] = useState('2');
  const [nums, setNums] = useState<number[]>([1, 1, 1, 2, 2, 3]);
  const [k, setK] = useState(2);
  const trace = useMemo(() => generateTrace(nums, k), [nums, k]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const maxF = Math.max(1, ...step.freq.map(([, c]) => c));

  const build = (v: string, w: string) => {
    const nv = parseNumList(v);
    const nk = Number(w);
    if (nv.length === 0 || nv.length > 12 || Number.isNaN(nk) || nk < 1) return;
    pb.restart();
    setNums(nv);
    setK(nk);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/top-k-frequent-347" backLabel="Bài giảng Top K Frequent"
        badge="Bucket Sort · O(n)" title="Top K Frequent" accent="trực quan"
        sub="Đếm tần suất → bucket theo tần suất → quét ngược từ cao xuống, đủ K thì dừng."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>TẦN SUẤT · K = {k}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', minHeight: 150, flexWrap: 'wrap' }}>
            {step.freq.map(([val, c]) => (
              <div key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>{c}×</span>
                <div
                  style={{
                    width: 44,
                    height: Math.max(10, (c / maxF) * 110),
                    borderRadius: '6px 6px 0 0',
                    background: step.cur === val && step.type === 'count' ? 'var(--accent)' : 'rgba(45,212,191,.25)',
                    border: '1px solid rgba(45,212,191,.5)',
                    borderBottom: 'none',
                  }}
                />
                <span className="mono" style={{ fontSize: 12 }}>{val}</span>
              </div>
            ))}
            {step.freq.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>đang đếm…</p>
            )}
          </div>
          {step.buckets.length > 0 && (
            <>
              <div className="card-title" style={{ marginTop: 14 }}><span className="dot"></span>BUCKETS (INDEX = TẦN SUẤT)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {step.buckets.map((b, f) =>
                  b.length === 0 ? null : (
                    <p key={f} className="mono" style={{ fontSize: 12.5, margin: 0, color: step.cur === f && step.type === 'take' ? 'var(--accent)' : 'var(--muted)' }}>
                      f={f}: [{b.join(', ')}]{step.cur === f && step.type === 'take' ? ' ← lấy' : ''}
                    </p>
                  ),
                )}
              </div>
            </>
          )}
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            RESULT ({step.result.length}/{k})
          </div>
          <p className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            [{step.result.slice(0, k).join(', ') || '—'}]
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤12 số):" value={str} onChange={setStr} onEnter={() => build(str, kStr)} placeholder="1,1,1,2,2,3" maxWidth={220} />
        <InputField label="k:" value={kStr} onChange={setKStr} onEnter={() => build(str, kStr)} placeholder="2" maxWidth={70} />
        <button className="btn" onClick={() => build(str, kStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · k=2', value: '1,1,1,2,2,3|2' },
          { label: 'k=1 · [1]', value: '1|1' },
          { label: 'Đều nhau · [4,1,-1,2,-1,2,3] k=2', value: '4,1,-1,2,-1,2,3|2' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setStr(a);
          setKStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_TOPK}
          defaultLang="csharp"
          getHighlight={(lang) => [TOPK_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(n)"
        />
      </div>
    </div>
  );
};
