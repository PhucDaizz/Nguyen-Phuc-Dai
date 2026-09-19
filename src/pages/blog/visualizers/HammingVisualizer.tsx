import { useMemo, useState } from 'react';
import { getSolutions, HAMMING_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, BitRow,
} from './shared';

interface Step {
  type: 'init' | 'strip' | 'done';
  n: number;
  count: number;
  killed: number | null; // bit vừa gạt (vị trí)
  gone: number[]; // vị trí bit đã gạt
  message: string; codeLine: number;
}

const lowestOne = (n: number) => {
  let p = 0;
  while (((n >>> p) & 1) === 0) p++;
  return p;
};

const generateTrace = (n0: number): Step[] => {
  const trace: Step[] = [];
  let n = n0 >>> 0;
  let count = 0;
  const gone: number[] = [];
  trace.push({
    type: 'init', n, count, killed: null, gone: [],
    message: `<strong>n & (n−1)</strong> gạt đúng bit 1 thấp nhất. Đếm tới khi n = 0 — số steps = số bit 1.`,
    codeLine: 2,
  });
  while (n !== 0) {
    const p = lowestOne(n);
    n = (n & (n - 1)) >>> 0;
    count++;
    gone.push(p);
    trace.push({
      type: 'strip', n, count, killed: p, gone: [...gone],
      message: `Gạt bit 1 ở vị trí <strong>${p}</strong> → n = <strong>${n}</strong>, đếm = <strong>${count}</strong>.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', n, count, killed: null, gone: [...gone],
    message: n0 === 0
      ? 'n = 0 từ đầu → <strong>0</strong> bit 1.'
      : `n = 0 → dừng. Tổng <strong>${count}</strong> bit 1.`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_HAMMING = getSolutions('number-of-1-bits-191');

export const HammingVisualizer = () => {
  const [str, setStr] = useState('11');
  const [n0, setN0] = useState(11);
  const trace = useMemo(() => generateTrace(n0), [n0]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = Number(v);
    if (Number.isNaN(nv) || nv < 0 || nv > 255) return;
    pb.restart();
    setN0(Math.floor(nv));
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/number-of-1-bits-191" backLabel="Bài giảng Number of 1 Bits"
        badge="n & (n−1) · O(k)" title="Count 1 Bits" accent="trực quan"
        sub="Mỗi step gạt đúng 1 bit 1 (amber). Ô teal là bit đã gạt. Số steps = số bit 1, không phải 32."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>NHỊ PHÂN (8 BIT) · N = {step.n}</div>
          <BitRow
            label="n"
            value={step.n}
            bits={8}
            hot={step.killed !== null ? [step.killed] : []}
            doneBits={step.gone.filter((g) => g !== step.killed)}
          />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            ĐẾM BIT 1
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            {step.count}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            {step.killed !== null ? `vừa gạt bit ${step.killed}` : step.type === 'done' ? 'xong' : 'chưa gạt'}
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="n (0–255):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="11" maxWidth={100} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: '11 (1011) → 3', value: '11' },
          { label: '128 → 1', value: '128' },
          { label: '255 → 8', value: '255' },
          { label: '0 → 0', value: '0' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_HAMMING}
          defaultLang="csharp"
          getHighlight={(lang) => [HAMMING_LINE_MAP[lang][step.type]]}
          meta="O(k) bit 1"
        />
      </div>
    </div>
  );
};
