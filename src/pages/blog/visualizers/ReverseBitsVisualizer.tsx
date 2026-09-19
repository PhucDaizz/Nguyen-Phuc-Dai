import { useMemo, useState } from 'react';
import { getSolutions, REVERSEBITS_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, BitRow,
} from './shared';

interface Step {
  type: 'init' | 'bit' | 'done';
  k: number | null; // vòng thứ mấy (0..31)
  n: number; // n còn lại
  res: number;
  message: string; codeLine: number;
}

const generateTrace = (n0: number): Step[] => {
  const trace: Step[] = [];
  let n = n0 >>> 0;
  let res = 0;
  trace.push({
    type: 'init', k: null, n, res,
    message: `32 vòng: bóc bit cuối của n (<strong>amber</strong>) đắp sang trái res (<strong>teal</strong>). Dùng &gt;&gt;&gt; (unsigned!).`,
    codeLine: 2,
  });
  for (let k = 0; k < 32; k++) {
    const bit = n & 1;
    res = (res << 1) | bit;
    n = n >>> 1;
    trace.push({
      type: 'bit', k, n: n >>> 0, res: res >>> 0,
      message: `Vòng ${k}: bóc bit <strong>${bit}</strong> → res = <strong>${res >>> 0}</strong>, n còn ${n >>> 0}.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', k: null, n: 0, res: res >>> 0,
    message: `Hết 32 vòng → kết quả <strong>${res >>> 0}</strong> (>>> 0 để ra unsigned).`,
    codeLine: 6,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_REVERSEBITS = getSolutions('reverse-bits-190');

export const ReverseBitsVisualizer = () => {
  const [str, setStr] = useState('43261596');
  const [n0, setN0] = useState(43261596);
  const trace = useMemo(() => generateTrace(n0), [n0]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = Number(v);
    if (Number.isNaN(nv) || nv < 0 || nv > 4294967295) return;
    pb.restart();
    setN0(Math.floor(nv));
  };

  // bit vừa bóc = LSB của n TRƯỚC khi dịch — suy từ res hiện tại khó; highlight bit 0 của n
  return (
    <div>
      <VizHeader
        backTo="/blog/reverse-bits-190" backLabel="Bài giảng Reverse Bits"
        badge="Shift · 32 Vòng" title="Reverse Bits" accent="trực quan"
        sub="Bóc bit cuối n đắp sang trái res, 32 vòng. Ô amber = bit vừa bóc."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>N CÒN LẠI → RES ĐANG DỰNG · VÒNG {step.k === null ? '—' : step.k + 1}/32
        </div>
        <BitRow label="n (còn lại)" value={step.n} bits={32} hot={step.type === 'bit' ? [0] : []} />
        <BitRow label="res (đang dựng)" value={step.res} bits={32} doneBits={step.k !== null ? [31] : []} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="n (0–4294967295):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="43261596" maxWidth={180} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 43261596', value: '43261596' },
          { label: 'Nhỏ · 5 (101)', value: '5' },
          { label: '0 → 0', value: '0' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_REVERSEBITS}
          defaultLang="csharp"
          getHighlight={(lang) => [REVERSEBITS_LINE_MAP[lang][step.type]]}
          meta="O(1) · 32"
        />
      </div>
    </div>
  );
};
