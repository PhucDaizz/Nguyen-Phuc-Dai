import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'calc' | 'done';
  i: number | null;
  bestJ: number | null; // j cho dp[i] tốt nhất (−1 = đứng một mình)
  dp: number[];
  best: number;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let best = n > 0 ? 1 : 0;
  trace.push({
    type: 'init', i: null, bestJ: null, dp: [...dp], best,
    message: `dp[i] = 1 + max(dp[j]) với mọi j < i mà nums[j] < nums[i]. Khởi tạo dp = 1 hết.`,
    codeLine: 1,
  });
  for (let i = 0; i < n; i++) {
    let bj = -1;
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        bj = j;
      }
    }
    if (dp[i] > best) best = dp[i];
    trace.push({
      type: 'calc', i, bestJ: bj, dp: [...dp], best,
      message: bj === -1
        ? `i = <strong>${i}</strong> (${nums[i]}): không có j < i nào nhỏ hơn → dp[${i}] = <strong>1</strong>.`
        : `i = <strong>${i}</strong> (${nums[i]}): nối sau nums[${bj}] = ${nums[bj]} → dp[${i}] = <strong>${dp[i]}</strong>. Best = <strong>${best}</strong>.`,
      codeLine: 5,
    });
  }
  trace.push({
    type: 'done', i: null, bestJ: null, dp: [...dp], best,
    message: n === 0
      ? 'Mảng rỗng → <strong>0</strong>.'
      : `Hoàn tất. Đáp án = max toàn bộ dp = <strong>${best}</strong> (không phải dp cuối!).`,
    codeLine: 8,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int LengthOfLIS(int[] nums) {',
  '    if (nums.Length == 0) return 0;',
  '    var dp = new int[nums.Length];',
  '    Array.Fill(dp, 1);',
  '    int best = 1;',
  '    for (int i = 0; i < nums.Length; i++) {',
  '        for (int j = 0; j < i; j++)',
  '            if (nums[j] < nums[i]) dp[i] = Math.Max(dp[i], dp[j] + 1);',
  '        best = Math.Max(best, dp[i]);',
  '    }',
  '    return best;',
  '}',
];

export const LisVisualizer = () => {
  const [str, setStr] = useState('10,9,2,5,3,7,101,18');
  const [nums, setNums] = useState<number[]>([10, 9, 2, 5, 3, 7, 101, 18]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const maxV = Math.max(1, ...nums, ...step.dp);

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length > 10) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/lis-300" backLabel="Bài giảng LIS"
        badge="DP O(n²) · patience O(n log n)" title="Longest Increasing" accent="trực quan"
        sub="Mỗi số nối sau số nhỏ hơn tốt nhất đứng trước nó. Cột amber = đang tính, teal = tiền thân tốt nhất."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>MẢNG (CỘT = GIÁ TRỊ, SỐ TRÊN = DP) · BEST = {step.best}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', minHeight: 170, flexWrap: 'wrap' }}>
          {nums.map((v, i) => {
            const isCur = step.i === i;
            const isPrev = step.bestJ === i;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, minWidth: 40 }}>
                <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: isCur ? 'var(--accent)' : isPrev ? 'var(--teal)' : 'var(--muted)' }}>
                  {step.dp[i] ?? '—'}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: Math.max(8, (v / maxV) * 120),
                    borderRadius: '6px 6px 0 0',
                    background: isCur ? 'rgba(255,181,71,.3)' : isPrev ? 'rgba(45,212,191,.3)' : 'rgba(255,255,255,.07)',
                    border: `2px solid ${isCur ? 'var(--accent)' : isPrev ? 'var(--teal)' : 'transparent'}`,
                    borderBottom: 'none',
                    transition: 'all .3s var(--ease)',
                  }}
                />
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{v}[{i}]</span>
              </div>
            );
          })}
          {nums.length === 0 && (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>mảng rỗng</p>
          )}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤10 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="10,9,2,5,3,7,101,18" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · → 4', value: '10,9,2,5,3,7,101,18' },
          { label: 'Giảm dần · → 1', value: '5,4,3,2,1' },
          { label: 'Tăng dần · → 5', value: '1,2,3,4,5' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n²) · O(n)" />
    </div>
  );
};
