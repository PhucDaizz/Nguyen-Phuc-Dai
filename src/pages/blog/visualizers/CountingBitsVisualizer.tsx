import { useMemo, useState } from 'react';
import { getSolutions, COUNTING_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell,
} from './shared';

interface Step {
  type: 'init' | 'calc' | 'done';
  i: number | null;
  half: number | null;
  bit: number | null;
  dp: number[];
  message: string; codeLine: number;
}

const generateTrace = (n: number): Step[] => {
  const trace: Step[] = [];
  const dp = new Array(n + 1).fill(0);
  trace.push({
    type: 'init', i: null, half: null, bit: null, dp: [...dp],
    message: `dp[i] = dp[i>>1] + (i&1): bỏ bit cuối (đã tính) rồi cộng lại bit cuối. dp[0] = 0.`,
    codeLine: 1,
  });
  for (let i = 1; i <= n; i++) {
    const half = i >> 1;
    const bit = i & 1;
    dp[i] = dp[half] + bit;
    trace.push({
      type: 'calc', i, half, bit, dp: [...dp],
      message: `dp[<strong>${i}</strong>] (${i.toString(2)}₂) = dp[${half}] (${dp[half]}) + bit cuối ${bit} = <strong>${dp[i]}</strong>.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', i: null, half: null, bit: null, dp: [...dp],
    message: `Hoàn tất 1 pass O(n) → [${dp.join(', ')}].`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_COUNTING = getSolutions('counting-bits-338');

export const CountingBitsVisualizer = () => {
  const [str, setStr] = useState('5');
  const [n, setN] = useState(5);
  const trace = useMemo(() => generateTrace(n), [n]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = Number(v);
    if (Number.isNaN(nv) || nv < 1 || nv > 16) return;
    pb.restart();
    setN(Math.floor(nv));
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/counting-bits-338" backLabel="Bài giảng Counting Bits"
        badge="DP + Bits · O(n)" title="Counting Bits" accent="trực quan"
        sub="Số i bỏ bit cuối thành i>>1 (đã tính) rồi +1 nếu bit cuối là 1. Ô amber đang tính, teal là nửa đã dùng."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>MẢNG DP 0..{n}</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {step.dp.map((v, i) => (
            <ArrCell
              key={i}
              v={v}
              sub={`${i}(${i.toString(2)})`}
              state={
                step.i === i ? 'cur' : step.half === i && step.type === 'calc' ? 'teal' : i < (step.i ?? 0) || step.type === 'done' ? 'dim' : undefined
              }
            />
          ))}
        </div>
        {step.i !== null && step.type === 'calc' && (
          <p className="mono" style={{ fontSize: 12.5, margin: '12px 0 0', color: 'var(--teal)' }}>
            dp[{step.i}] = dp[{step.half}] ({step.dp[step.half ?? 0]}) + {step.bit} = {step.dp[step.i]}
          </p>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="n (1–16):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="5" maxWidth={80} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'n=5', value: '5' },
          { label: 'n=2', value: '2' },
          { label: 'n=8', value: '8' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_COUNTING}
          defaultLang="csharp"
          getHighlight={(lang) => [COUNTING_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(n)"
        />
      </div>
    </div>
  );
};
