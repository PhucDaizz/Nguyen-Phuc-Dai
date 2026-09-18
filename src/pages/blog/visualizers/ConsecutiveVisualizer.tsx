import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'skip' | 'run' | 'done';
  x: number | null; // số đang xét
  runVals: number[]; // dãy đang đếm
  best: number;
  bestRun: number[];
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  const set = new Set(nums);
  let best = 0;
  let bestRun: number[] = [];
  trace.push({
    type: 'init', x: null, runVals: [], best: 0, bestRun: [],
    message: `Bỏ hết vào set. Chỉ đếm từ <strong>"đầu dãy"</strong> (thiếu x−1) → mỗi số thăm đúng 1 lần.`,
    codeLine: 1,
  });
  for (const x of set) {
    if (!set.has(x - 1)) {
      // đếm lên
      const run = [x];
      let cur = x;
      while (set.has(cur + 1)) {
        cur++;
        run.push(cur);
      }
      if (run.length > best) {
        best = run.length;
        bestRun = [...run];
      }
      trace.push({
        type: 'run', x, runVals: [...run], best, bestRun: [...bestRun],
        message: `<strong>${x}</strong> thiếu ${x - 1} → đầu dãy! Đếm lên: [${run.join(', ')}] dài <strong>${run.length}</strong>, best = <strong>${best}</strong>.`,
        codeLine: 8,
      });
    } else {
      trace.push({
        type: 'skip', x, runVals: [], best, bestRun: [...bestRun],
        message: `<strong>${x}</strong> có ${x - 1} trong set → không phải đầu dãy → <strong>bỏ qua</strong> (đã đếm ở dãy khác).`,
        codeLine: 5,
      });
    }
  }
  trace.push({
    type: 'done', x: null, runVals: [], best, bestRun: [...bestRun],
    message: nums.length === 0
      ? 'Mảng rỗng → <strong>0</strong>.'
      : `Hoàn tất. Dãy liên tiếp dài nhất: [${bestRun.join(', ')}] dài <strong>${best}</strong>.`,
    codeLine: 11,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int LongestConsecutive(int[] nums) {',
  '    var set = new HashSet<int>(nums);',
  '    int best = 0;',
  '    foreach (int x in set) {',
  '        if (set.Contains(x - 1)) continue;',
  '        int cur = x, len = 1;',
  '        while (set.Contains(cur + 1)) { cur++; len++; }',
  '        best = Math.Max(best, len);',
  '    }',
  '    return best;',
  '}',
];

export const ConsecutiveVisualizer = () => {
  const [str, setStr] = useState('100,4,200,1,3,2');
  const [nums, setNums] = useState<number[]>([100, 4, 200, 1, 3, 2]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length > 12) return;
    pb.restart();
    setNums(nv);
  };

  const runSet = new Set(step.runVals);
  const bestSet = new Set(step.bestRun);

  return (
    <div>
      <VizHeader
        backTo="/blog/longest-consecutive-128" backLabel="Bài giảng Longest Consecutive"
        badge="Hash Set · O(n)" title="Longest Consecutive" accent="trực quan"
        sub="Chỉ đếm từ đầu dãy (thiếu x−1): số giữa dãy thì bỏ qua vì đã đếm rồi. Dãy đang đếm sáng amber, best teal."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>MẢNG · BEST = {step.best}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {nums.map((v, i) => {
              const inRun = runSet.has(v);
              const inBest = bestSet.has(v) && step.type === 'done';
              const isX = step.x === v && (step.type === 'run' || step.type === 'skip');
              return (
                <ArrCell
                  key={i}
                  v={v}
                  sub={isX ? (step.type === 'run' ? 'đầu!' : 'bỏ') : `[${i}]`}
                  state={inBest ? 'teal' : inRun ? 'cur' : isX ? 'dim' : undefined}
                />
              );
            })}
            {nums.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>mảng rỗng</p>
            )}
          </div>
          <p className="mono" style={{ fontSize: 12.5, margin: '12px 0 0', color: 'var(--teal)' }}>
            dãy đang đếm: [{step.runVals.join(', ') || '—'}] · best: [{step.bestRun.join(', ') || '—'}]
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            DÀI NHẤT
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            {step.best}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            mỗi số thăm đúng 1 lần → O(n)
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤12 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="100,4,200,1,3,2" maxWidth={240} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · dài 4', value: '100,4,200,1,3,2' },
          { label: 'Trùng · [0,0] → 1', value: '0,0' },
          { label: 'Rời rạc · [9,1,4,7,3] → 2', value: '9,1,4,7,3' },
          { label: 'Âm · [-2,-1,0,2] → 3', value: '-2,-1,0,2' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(n)" />
    </div>
  );
};
