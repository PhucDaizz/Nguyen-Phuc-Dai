import { useMemo, useState } from 'react';
import { getSolutions, MISSING_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'xor' | 'done';
  i: number | null;
  xor: number;
  paired: [number, number][]; // cặp (i, nums[i]) đã triệt
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  let xor = nums.length;
  const paired: [number, number][] = [];
  trace.push({
    type: 'init', i: null, xor, paired: [],
    message: `xor bắt đầu = n = <strong>${nums.length}</strong>. Mỗi i: xor ^= i ^ nums[i] — đủ đôi tự triệt.`,
    codeLine: 1,
  });
  nums.forEach((v, i) => {
    xor = xor ^ i ^ v;
    paired.push([i, v]);
    trace.push({
      type: 'xor', i, xor, paired: [...paired],
      message: `i = ${i}: xor ^= ${i} ^ ${v} → xor = <strong>${xor}</strong>.`,
      codeLine: 3,
    });
  });
  trace.push({
    type: 'done', i: null, xor, paired: [...paired],
    message: `Mọi cặp đủ đôi triệt nhau, dư lại số thiếu = <strong>${xor}</strong>.`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MISSING = getSolutions('missing-number-268');

export const MissingVisualizer = () => {
  const [str, setStr] = useState('3,0,1');
  const [nums, setNums] = useState<number[]>([3, 0, 1]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length === 0 || nv.length > 8 || new Set(nv).size !== nv.length) return;
    if (nv.some((x) => x < 0 || x > nv.length)) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/missing-number-268" backLabel="Bài giảng Missing Number"
        badge="XOR · O(1) Space" title="Missing Number" accent="trực quan"
        sub="XOR hết index lẫn value: số nào đủ đôi tự triệt (mờ đi), số lẻ loi còn lại là đáp án."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>MẢNG (RANGE 0..{nums.length})</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {nums.map((v, i) => {
              const used = step.paired.some(([pi]) => pi === i);
              const isCur = step.i === i && step.type === 'xor';
              return (
                <ArrCell
                  key={i}
                  v={v}
                  sub={`i=${i}`}
                  state={isCur ? 'cur' : used ? 'dim' : undefined}
                />
              );
            })}
          </div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: '10px 0 0' }}>
            cặp đã triệt: {step.paired.length === 0 ? '—' : step.paired.map(([i, v]) => `(${i}^${v})`).join(' ')}
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            XOR TÍCH LŨY
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            {step.xor}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            x ^ x = 0 — đủ đôi tự mất
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (phân biệt, 0..n, ≤8 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="3,0,1" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · thiếu 2', value: '3,0,1' },
          { label: 'Thiếu cuối · [0,1] → 2', value: '0,1' },
          { label: 'Thiếu đầu · [1,2] → 0', value: '1,2' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MISSING}
          defaultLang="csharp"
          getHighlight={(lang) => [MISSING_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
