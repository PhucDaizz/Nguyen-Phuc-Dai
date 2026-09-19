import { useMemo, useState } from 'react';
import { getSolutions, BITADD_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, BitRow,
} from './shared';

interface Step {
  type: 'init' | 'iter' | 'done';
  a: number;
  b: number;
  carry: number | null;
  message: string; codeLine: number;
}

const toU = (n: number) => n >>> 0;

const generateTrace = (a0: number, b0: number): Step[] => {
  const trace: Step[] = [];
  let a = toU(a0);
  let b = toU(b0);
  trace.push({
    type: 'init', a, b, carry: null,
    message: `Cộng <strong>${a} + ${b}</strong> không dùng +/−. XOR = cộng không nhớ, AND&lt;&lt;1 = phần nhớ. Lặp tới khi nhớ = 0.`,
    codeLine: 1,
  });
  let guard = 0;
  while (b !== 0 && guard++ < 40) {
    const carry = toU((a & b) << 1);
    const sum = toU(a ^ b);
    trace.push({
      type: 'iter', a: sum, b: carry, carry,
      message: `XOR = <strong>${sum}</strong> (cộng không nhớ), nhớ = <strong>${carry}</strong>. ${carry === 0 ? 'Nhớ = 0 → dừng.' : 'Tiếp tục với cặp mới.'}`,
      codeLine: 2,
    });
    a = sum;
    b = carry;
  }
  trace.push({
    type: 'done', a, b, carry: null,
    message: `Hoàn tất. Kết quả = <strong>${a}</strong>.`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_BITADD = getSolutions('sum-two-integers-371');

const BITS = 8;

export const BitAddVisualizer = () => {
  const [aStr, setAStr] = useState('11');
  const [bStr, setBStr] = useState('1');
  const [a0, setA0] = useState(11);
  const [b0, setB0] = useState(1);
  const trace = useMemo(() => generateTrace(a0, b0), [a0, b0]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (x: string, y: string) => {
    const na = Number(x);
    const nb = Number(y);
    if (Number.isNaN(na) || Number.isNaN(nb) || na < 0 || nb < 0 || na > 255 || nb > 255) return;
    pb.restart();
    setA0(Math.floor(na));
    setB0(Math.floor(nb));
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/sum-two-integers-371" backLabel="Bài giảng Sum of Two Integers"
        badge="Bit Manipulation · O(1)" title="Add without +" accent="trực quan"
        sub="Mạch cộng full-adder: XOR cộng không nhớ (teal), AND<<1 là phần nhớ (amber). 8-bit minh họa."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>CỘNG NHỊ PHÂN (8 BIT)</div>
        <BitRow label="a (cộng không nhớ)" value={step.a} bits={BITS} doneBits={step.type !== 'init' ? [0, 1, 2, 3, 4, 5, 6, 7] : []} />
        <BitRow label="b (phần nhớ)" value={step.b} bits={BITS} hot={step.carry !== null && step.b !== 0 ? [0] : []} />
        {step.carry !== null && (
          <p className="mono" style={{ fontSize: 12, color: 'var(--accent)', margin: '4px 0 0' }}>
            nhớ vừa tính = {step.carry}
          </p>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="a (0–255):" value={aStr} onChange={setAStr} onEnter={() => build(aStr, bStr)} placeholder="11" maxWidth={90} />
        <InputField label="b (0–255):" value={bStr} onChange={setBStr} onEnter={() => build(aStr, bStr)} placeholder="1" maxWidth={90} />
        <button className="btn" onClick={() => build(aStr, bStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Cơ bản · 11+1', value: '11|1' },
          { label: 'Nhớ dây chuyền · 15+1', value: '15|1' },
          { label: '0+0', value: '0|0' },
          { label: '255+1 → tràn 8-bit', value: '255|1' },
        ]}
        onPick={(v) => {
          const [x, y] = v.split('|');
          setAStr(x);
          setBStr(y);
          build(x, y);
        }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_BITADD}
          defaultLang="csharp"
          getHighlight={(lang) => [BITADD_LINE_MAP[lang][step.type]]}
          meta="O(1) · 32 bước"
        />
      </div>
    </div>
  );
};
