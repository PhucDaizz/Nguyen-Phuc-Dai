import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'house' | 'runEnd' | 'done';
  run: 'A' | 'B' | null; // A = bỏ cuối [0..n-2], B = bỏ đầu [1..n-1]
  i: number | null;
  take: boolean | null;
  prev2: number;
  prev1: number;
  bestA: number | null;
  bestB: number | null;
  best: number | null;
  message: string; codeLine: number;
}

const runRange = (
  nums: number[], l: number, r: number,
  trace: Step[], run: 'A' | 'B',
  label: string,
): number => {
  let prev2 = 0;
  let prev1 = 0;
  for (let i = l; i <= r; i++) {
    const take = prev2 + nums[i];
    const cur = Math.max(prev1, take);
    trace.push({
      type: 'house', run, i, take: take > prev1, prev2, prev1,
      bestA: null, bestB: run === 'B' ? cur : null, best: null,
      message: `${label} — nhà ${i} (=${nums[i]}): trộm = ${prev2}+${nums[i]}=${take} vs bỏ = ${prev1} → ${take > prev1 ? `trộm (<strong>${cur}</strong>)` : `bỏ (<strong>${cur}</strong>)`}.`,
      codeLine: 5,
    });
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
};

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', run: null, i: null, take: null, prev2: 0, prev1: 0,
    bestA: null, bestB: null, best: null,
    message: `Vòng tròn: đầu–cuối kề nhau → chạy 2 lần: <strong>A bỏ cuối</strong> [0..${nums.length - 2}] và <strong>B bỏ đầu</strong> [1..${nums.length - 1}].`,
    codeLine: 1,
  });
  if (nums.length === 0) {
    trace.push({
      type: 'done', run: null, i: null, take: null, prev2: 0, prev1: 0,
      bestA: null, bestB: null, best: 0,
      message: 'Không nhà nào → <strong>0</strong>.',
      codeLine: 12,
    });
    return trace;
  }
  if (nums.length === 1) {
    trace.push({
      type: 'done', run: null, i: null, take: null, prev2: 0, prev1: 0,
      bestA: null, bestB: null, best: nums[0],
      message: `1 nhà → trộm luôn = <strong>${nums[0]}</strong>.`,
      codeLine: 1,
    });
    return trace;
  }
  const bestA = runRange(nums, 0, nums.length - 2, trace, 'A', 'Run A (bỏ cuối)');
  trace.push({
    type: 'runEnd', run: 'A', i: null, take: null, prev2: 0, prev1: 0,
    bestA, bestB: null, best: null,
    message: `Run A xong = <strong>${bestA}</strong>. Giờ run B (bỏ đầu), reset 2 biến lăn.`,
    codeLine: 12,
  });
  const bestB = runRange(nums, 1, nums.length - 1, trace, 'B', 'Run B (bỏ đầu)');
  const best = Math.max(bestA, bestB);
  trace.push({
    type: 'done', run: null, i: null, take: null, prev2: 0, prev1: 0,
    bestA, bestB, best,
    message: `max(A=${bestA}, B=${bestB}) = <strong>${best}</strong>.`,
    codeLine: 12,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int Rob2(int[] nums) {',
  '    if (nums.Length == 1) return nums[0];',
  '    int RobRange(int l, int r) {',
  '        int prev2 = 0, prev1 = 0;',
  '        for (int i = l; i <= r; i++) {',
  '            int cur = Math.Max(prev1, prev2 + nums[i]);',
  '            prev2 = prev1;',
  '            prev1 = cur;',
  '        }',
  '        return prev1;',
  '    }',
  '    return Math.Max(RobRange(0, nums.Length - 2), RobRange(1, nums.Length - 1));',
  '}',
];

export const Robber2Visualizer = () => {
  const [str, setStr] = useState('2,3,2');
  const [nums, setNums] = useState<number[]>([2, 3, 2]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const maxV = Math.max(1, ...nums);

  const build = (v: string) => {
    const nv = parseNumList(v).filter((x) => x >= 0);
    if (nv.length > 8) return;
    pb.restart();
    setNums(nv);
  };

  // vùng active theo run
  const active = (i: number) => {
    if (step.run === 'A') return i <= nums.length - 2;
    if (step.run === 'B') return i >= 1;
    return true;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/house-robber-ii-213" backLabel="Bài giảng House Robber II"
        badge="DP × 2 Runs · O(n)" title="House Robber II" accent="trực quan"
        sub="Vòng tròn → 2 run loại trừ: A bỏ cuối, B bỏ đầu. Vùng mờ là nhà bị loại ở run hiện tại."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>
            {step.run === null ? 'VÒNG TRÒN (ĐẦU–CUỐI KỀ NHAU)' : step.run === 'A' ? 'RUN A — BỎ NHÀ CUỐI' : 'RUN B — BỎ NHÀ ĐẦU'}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', minHeight: 160, flexWrap: 'wrap' }}>
            {nums.map((v, i) => {
              const out = !active(i);
              const isCur = step.i === i;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, minWidth: 38, opacity: out ? 0.3 : 1 }}>
                  <span className="mono" style={{ fontSize: 11, color: isCur ? 'var(--accent)' : 'var(--muted)' }}>{v}</span>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(8, (v / maxV) * 120),
                      borderRadius: '6px 6px 0 0',
                      background: isCur ? (step.take ? 'rgba(45,212,191,.35)' : 'rgba(255,255,255,.14)') : 'rgba(255,255,255,.07)',
                      border: `2px solid ${isCur ? (step.take ? 'var(--teal)' : 'var(--accent)') : 'transparent'}`,
                      borderBottom: 'none',
                      transition: 'all .3s var(--ease)',
                    }}
                  />
                  <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>
                    {out ? 'LOẠI' : isCur ? (step.take ? 'TRỘM' : 'BỎ') : `[${i}]`}
                  </span>
                </div>
              );
            })}
            {nums.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>không nhà nào</p>
            )}
          </div>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>RUN A / RUN B</div>
            <p className="mono" style={{ fontSize: 14, margin: 0 }}>
              <span style={{ color: 'var(--muted)' }}>A (bỏ cuối) = </span>
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{step.bestA === null ? '?' : step.bestA}</span>
            </p>
            <p className="mono" style={{ fontSize: 14, margin: '6px 0 0' }}>
              <span style={{ color: 'var(--muted)' }}>B (bỏ đầu) = </span>
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>
                {step.bestB !== null ? step.bestB : '?'}
              </span>
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              ĐÁP ÁN = MAX(A, B)
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.type === 'done' && step.best !== null ? step.best : '?'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="houses vòng tròn (≤8 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="2,3,2" maxWidth={200} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · [2,3,2] → 3', value: '2,3,2' },
          { label: '[1,2,3,1] → 4', value: '1,2,3,1' },
          { label: '1 nhà · [5]', value: '5' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
