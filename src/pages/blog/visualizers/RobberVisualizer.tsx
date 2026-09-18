import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'house' | 'done';
  i: number | null;
  take: boolean | null; // nhà i: trộm hay bỏ
  prev2: number;
  prev1: number;
  cur: number | null;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', i: null, take: null, prev2: 0, prev1: 0, cur: null,
    message: `Nhà i: trộm = prev2 + nums[i], bỏ = prev1. Lấy max. Chỉ cần <strong>2 biến lăn</strong>.`,
    codeLine: 1,
  });
  let prev2 = 0;
  let prev1 = 0;
  nums.forEach((x, i) => {
    const take = prev2 + x;
    const cur = Math.max(prev1, take);
    trace.push({
      type: 'house', i, take: take > prev1, prev2, prev1, cur,
      message: `Nhà ${i} (=${x}): trộm = ${prev2}+${x} = <strong>${take}</strong> vs bỏ = <strong>${prev1}</strong> → ${take > prev1 ? `trộm, cur = <strong>${cur}</strong>` : `bỏ, cur = <strong>${cur}</strong>`}.`,
      codeLine: 4,
    });
    prev2 = prev1;
    prev1 = cur;
  });
  trace.push({
    type: 'done', i: null, take: null, prev2, prev1, cur: prev1,
    message: nums.length === 0
      ? 'Không nhà nào → <strong>0</strong>.'
      : `Hoàn tất. Trộm được nhiều nhất <strong>${prev1}</strong>.`,
    codeLine: 8,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int Rob(int[] nums) {',
  '    int prev2 = 0, prev1 = 0;',
  '    foreach (int x in nums) {',
  '        int cur = Math.Max(prev1, prev2 + x);',
  '        prev2 = prev1;',
  '        prev1 = cur;',
  '    }',
  '    return prev1;',
  '}',
];

export const RobberVisualizer = () => {
  const [str, setStr] = useState('2,7,9,3,1');
  const [nums, setNums] = useState<number[]>([2, 7, 9, 3, 1]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const maxV = Math.max(1, ...nums);

  const build = (v: string) => {
    const nv = parseNumList(v).filter((x) => x >= 0);
    if (nv.length > 10) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/house-robber-198" backLabel="Bài giảng House Robber"
        badge="Linear DP · O(1)" title="House Robber" accent="trực quan"
        sub="Từng nhà: trộm (xanh) hay bỏ (xám). Ô amber là nhà đang quyết định, 2 biến lăn bên phải."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>DÃY NHÀ · CUR = {step.cur === null ? '—' : step.cur}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', minHeight: 170, flexWrap: 'wrap' }}>
            {nums.map((v, i) => {
              const isCur = step.i === i;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, minWidth: 40 }}>
                  <span className="mono" style={{ fontSize: 11, color: isCur ? 'var(--accent)' : 'var(--muted)' }}>{v}</span>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(8, (v / maxV) * 130),
                      borderRadius: '6px 6px 0 0',
                      background: isCur
                        ? step.take
                          ? 'rgba(45,212,191,.35)'
                          : 'rgba(255,255,255,.14)'
                        : 'rgba(255,255,255,.07)',
                      border: `2px solid ${isCur ? (step.take ? 'var(--teal)' : 'var(--accent)') : 'transparent'}`,
                      borderBottom: 'none',
                      boxShadow: isCur ? (step.take ? '0 0 14px var(--teal-glow)' : '0 0 14px var(--accent-glow)') : 'none',
                      transition: 'all .3s var(--ease)',
                    }}
                  />
                  <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>
                    {isCur ? (step.take ? 'TRỘM' : 'BỎ') : `[${i}]`}
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
            <div className="card-title"><span className="dot"></span>2 BIẾN LĂN</div>
            <p className="mono" style={{ fontSize: 13, margin: 0 }}>
              <span style={{ color: 'var(--muted)' }}>prev2 (tới i−2) = </span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{step.prev2}</span>
            </p>
            <p className="mono" style={{ fontSize: 13, margin: '6px 0 0' }}>
              <span style={{ color: 'var(--muted)' }}>prev1 (tới i−1) = </span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{step.prev1}</span>
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              TỐT NHẤT
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.cur === null ? (step.type === 'done' ? step.prev1 : '?') : step.cur}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="houses (≤10 số ≥0):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="2,7,9,3,1" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 12', value: '2,7,9,3,1' },
          { label: 'Bẫy tham lam · [2,1,1,2] → 4', value: '2,1,1,2' },
          { label: '1 nhà', value: '5' },
          { label: 'Rỗng', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
