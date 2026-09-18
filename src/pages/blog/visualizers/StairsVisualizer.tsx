import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell,
} from './shared';

interface Step {
  type: 'init' | 'step' | 'done';
  i: number | null; // bậc đang tính
  a: number; // dp[i-2]
  b: number; // dp[i-1]
  message: string; codeLine: number;
}

const generateTrace = (n: number): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', i: null, a: 1, b: 2,
    message: `dp[n] = dp[n−1] + dp[n−2]. Base: <strong>dp[1] = 1, dp[2] = 2</strong>. Chỉ cần 2 biến lăn (a, b).`,
    codeLine: 1,
  });
  if (n <= 0) {
    trace.push({
      type: 'done', i: null, a: 0, b: 0,
      message: 'n = 0 → <strong>0</strong> cách.',
      codeLine: 1,
    });
    return trace;
  }
  if (n <= 2) {
    trace.push({
      type: 'done', i: null, a: 1, b: 2,
      message: `n = ${n} → base case = <strong>${n}</strong>.`,
      codeLine: 1,
    });
    return trace;
  }
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    trace.push({
      type: 'step', i, a, b,
      message: `Bậc <strong>${i}</strong>: từ ${i - 1} bước 1 + từ ${i - 2} bước 2 → dp[${i}] = ${b} + ${a} = <strong>${c}</strong>. Lăn: a=${b}, b=${c}.`,
      codeLine: 4,
    });
    a = b;
    b = c;
  }
  trace.push({
    type: 'done', i: null, a, b,
    message: `Hoàn tất. Leo ${n} bậc có <strong>${b}</strong> cách.`,
    codeLine: 6,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int ClimbStairs(int n) {',
  '    if (n <= 2) return n;',
  '    int a = 1, b = 2;',
  '    for (int i = 3; i <= n; i++) {',
  '        int c = a + b;',
  '        a = b;',
  '        b = c;',
  '    }',
  '    return b;',
  '}',
];

export const StairsVisualizer = () => {
  const [str, setStr] = useState('5');
  const [n, setN] = useState(5);
  const trace = useMemo(() => generateTrace(n), [n]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = Number(v);
    if (Number.isNaN(nv) || nv < 0 || nv > 12) return;
    pb.restart();
    setN(Math.floor(nv));
  };

  // cầu thang: bậc i cao i ô, bậc đang tính sáng
  const top = Math.max(n, 1);

  return (
    <div>
      <VizHeader
        backTo="/blog/climbing-stairs-70" backLabel="Bài giảng Climbing Stairs"
        badge="Fibonacci DP · O(n)" title="Climbing Stairs" accent="trực quan"
        sub="Tới bậc i chỉ từ i−1 (bước 1) hoặc i−2 (bước 2): cộng 2 con số, lăn 2 biến."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CẦU THANG · N = {n}</div>
          {n === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>không có bậc nào</p>
          ) : (
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', minHeight: 180 }}>
              {Array.from({ length: n }, (_, k) => {
                const i = k + 1;
                const isCur = step.i === i;
                const done = step.i !== null ? i < step.i : step.type === 'done';
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
                    <span className="mono" style={{ fontSize: 10, color: isCur ? 'var(--accent)' : done ? 'var(--teal)' : 'var(--muted)', fontWeight: 700 }}>
                      {isCur || done || step.type === 'done' ? dpVal(n, i, step) : ''}
                      &nbsp;
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: Math.max(10, (i / top) * 150),
                        borderRadius: '6px 6px 0 0',
                        background: isCur ? 'rgba(255,181,71,.3)' : done ? 'rgba(45,212,191,.15)' : 'rgba(255,255,255,.06)',
                        border: `2px solid ${isCur ? 'var(--accent)' : done ? 'rgba(45,212,191,.5)' : 'transparent'}`,
                        borderBottom: 'none',
                        transition: 'all .3s var(--ease)',
                      }}
                    />
                    <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>{i}</span>
                  </div>
                );
              })}
            </div>
          )}
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>2 BIẾN LĂN</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ArrCell v={step.a} sub="a = dp[i−2]" state="dim" />
              <ArrCell v={step.b} sub="b = dp[i−1]" state="cur" />
            </div>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              ĐÁP ÁN
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.type === 'done' ? step.b : '?'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="n (0–12):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="5" maxWidth={90} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Cơ bản · n=5 → 8', value: '5' },
          { label: 'n=2 → 2', value: '2' },
          { label: 'n=1 → 1', value: '1' },
          { label: 'n=10 → 89', value: '10' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};

// giá trị dp hiển thị trên từng bậc (tính lại Fibonacci tới bậc đó)
const fibCache = new Map<number, number>();
const dpVal = (n: number, i: number, step: { type: string }): number | '' => {
  if (step.type === 'init') return '';
  if (!fibCache.has(i)) {
    let a = 1;
    let b = 2;
    if (i === 1) fibCache.set(1, 1);
    else if (i === 2) fibCache.set(2, 2);
    else {
      for (let k = 3; k <= i; k++) {
        const c = a + b;
        a = b;
        b = c;
      }
      fibCache.set(i, b);
    }
  }
  void n;
  return fibCache.get(i) ?? '';
};
