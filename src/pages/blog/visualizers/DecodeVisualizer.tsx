import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell,
} from './shared';

interface Step {
  type: 'init' | 'visit' | 'one' | 'two' | 'roll' | 'done';
  i: number | null; // prefix đang tính (độ dài)
  prev2: number;
  prev1: number;
  cur: number | null;
  usedOne: boolean;
  usedTwo: boolean;
  message: string; codeLine: number;
}

const generateTrace = (s: string): Step[] => {
  const trace: Step[] = [];
  const n = s.length;
  trace.push({
    type: 'init', i: null, prev2: 1, prev1: 0, cur: null,
    usedOne: false, usedTwo: false,
    message: `Chỉ cần <strong>2 biến lăn</strong>: prev2 = dp[i−2], prev1 = dp[i−1] — đúng như code (không có mảng dp).`,
    codeLine: 1,
  });
  if (n === 0) {
    trace.push({
      type: 'done', i: null, prev2: 1, prev1: 0, cur: 0,
      usedOne: false, usedTwo: false,
      message: 'Chuỗi rỗng → <strong>0</strong> cách.',
      codeLine: 11,
    });
    return trace;
  }
  let prev2 = 1;
  let prev1 = s[0] === '0' ? 0 : 1;
  trace.push({
    type: 'visit', i: 1, prev2, prev1, cur: null,
    usedOne: false, usedTwo: false,
    message: `Base: prev1 = dp[1] = <strong>${prev1}</strong> ('${s[0]}' ${s[0] === '0' ? 'đứng một mình vô nghĩa → 0' : '1 cách'}).`,
    codeLine: 2,
  });
  for (let i = 2; i <= n; i++) {
    let cur = 0;
    trace.push({
      type: 'visit', i, prev2, prev1, cur: null,
      usedOne: false, usedTwo: false,
      message: `Tính dp[<strong>${i}</strong>] ("${s.slice(0, i)}"): cur = 0. Xét 1 chữ '${s[i - 1]}' rồi 2 chữ '${s.slice(i - 2, i)}'.`,
      codeLine: 4,
    });
    const one = s[i - 1] !== '0';
    if (one) cur += prev1;
    trace.push({
      type: 'one', i, prev2, prev1, cur,
      usedOne: one, usedTwo: false,
      message: one
        ? `1 chữ '${s[i - 1]}' ≠ 0 → cur += prev1 = <strong>${prev1}</strong> → cur = ${cur}.`
        : `1 chữ '${s[i - 1]}' = 0, đứng một mình vô nghĩa → <strong>bỏ qua</strong>, cur = ${cur}.`,
      codeLine: 5,
    });
    const two = Number(s.slice(i - 2, i));
    const twoOk = two >= 10 && two <= 26;
    if (twoOk) cur += prev2;
    trace.push({
      type: 'two', i, prev2, prev1, cur,
      usedOne: one, usedTwo: twoOk,
      message: twoOk
        ? `2 chữ '${s.slice(i - 2, i)}' = ${two} trong 10..26 → cur += prev2 = <strong>${prev2}</strong> → cur = <strong>${cur}</strong>.`
        : `2 chữ '${s.slice(i - 2, i)}' = ${two} ngoài 10..26 → <strong>bỏ qua</strong>, cur = ${cur}.`,
      codeLine: 7,
    });
    trace.push({
      type: 'roll', i, prev2: prev1, prev1: cur, cur,
      usedOne: one, usedTwo: twoOk,
      message: `Lăn biến: prev2 = ${prev1} (cũ), prev1 = <strong>${cur}</strong>. Mảng dp cũ không cần nữa.`,
      codeLine: 8,
    });
    prev2 = prev1;
    prev1 = cur;
  }
  trace.push({
    type: 'done', i: null, prev2, prev1, cur: prev1,
    usedOne: false, usedTwo: false,
    message: `Hoàn tất. Số cách giải mã = prev1 = <strong>${prev1}</strong>.`,
    codeLine: 11,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int NumDecodings(string s) {',
  '    int prev2 = 1;',
  "    int prev1 = s[0] == '0' ? 0 : 1;",
  '    for (int i = 2; i <= s.Length; i++) {',
  '        int cur = 0;',
  "        if (s[i-1] != '0') cur += prev1;",
  '        int two = int.Parse(s.Substring(i-2, 2));',
  '        if (two >= 10 && two <= 26) cur += prev2;',
  '        prev2 = prev1;',
  '        prev1 = cur;',
  '    }',
  '    return prev1;',
  '}',
];

export const DecodeVisualizer = () => {
  const [str, setStr] = useState('226');
  const [s, setS] = useState('226');
  const trace = useMemo(() => generateTrace(s), [s]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = v.replace(/[^0-9]/g, '').slice(0, 8);
    pb.restart();
    setS(nv);
  };

  // ký tự đang xét: 1 chữ (i-1) và 2 chữ (i-2, i-1)
  const hotOne = step.i !== null && step.i >= 1 ? step.i - 1 : -1;
  const hotTwo = step.i !== null && step.i >= 2 ? step.i - 2 : -1;

  return (
    <div>
      <VizHeader
        backTo="/blog/decode-ways-91" backLabel="Bài giảng Decode Ways"
        badge="Rolling DP · O(1)" title="Decode Ways" accent="trực quan"
        sub="Không có mảng dp — chỉ 3 số lăn: cur = (1 chữ? prev1) + (2 chữ? prev2). Ô amber là chữ đang xét."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CHUỖI SỐ · ĐANG TÍNH PREFIX {step.i === null ? '—' : step.i}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {s.split('').map((c, i) => {
              const isOne = i === hotOne && step.type !== 'init' && step.type !== 'done';
              const isTwo = i === hotTwo && step.usedTwo && step.type !== 'init' && step.type !== 'done';
              return (
                <ArrCell
                  key={i}
                  v={c}
                  sub={`[${i}]`}
                  state={isOne ? 'cur' : isTwo ? 'teal' : undefined}
                />
              );
            })}
            {s.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng</p>
            )}
          </div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '10px 0 0' }}>
            amber = chữ thứ i (1-chữ số) · teal = cặp 2 chữ số (nếu hợp lệ)
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>3 SỐ LĂN</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ArrCell v={step.prev2} sub="prev2" state="dim" />
              <ArrCell v={step.prev1} sub="prev1" state="dim" />
              <ArrCell v={step.cur === null ? '?' : step.cur} sub="cur" state="cur" />
            </div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
              cur = {step.usedOne ? '+prev1' : '~~prev1~~'} {step.usedTwo ? '+prev2' : '~~prev2~~'} → roll: prev2=prev1, prev1=cur
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              ĐÁP ÁN = PREV1
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.type === 'done' ? step.prev1 : '?'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s (chỉ số, ≤8 chữ):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="226" maxWidth={180} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 226 → 3', value: '226' },
          { label: 'Số 0 · 06 → 0', value: '06' },
          { label: '10 → 1', value: '10' },
          { label: '1111 → 5', value: '1111' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
