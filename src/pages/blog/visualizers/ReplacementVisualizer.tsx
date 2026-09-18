import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress,
} from './shared';

interface Step {
  type: 'init' | 'expand' | 'shrink' | 'done';
  l: number; r: number;
  maxFreq: number;
  need: number; // số ký tự phải đổi = dài − maxFreq
  best: number;
  message: string; codeLine: number;
}

const A = (ch: string) => ch.charCodeAt(0) - 65;

const generateTrace = (s: string, k: number): Step[] => {
  const trace: Step[] = [];
  const count = new Array(26).fill(0);
  let l = 0;
  let maxFreq = 0;
  let best = 0;
  trace.push({
    type: 'init', l: 0, r: -1, maxFreq: 0, need: 0, best,
    message: `Chuỗi HOA + k = <strong>${k}</strong>. Cửa sổ hợp lệ khi dài − maxFreq ≤ k.`,
    codeLine: 1,
  });
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++count[A(s[r])]);
    trace.push({
      type: 'expand', l, r, maxFreq, need: r - l + 1 - maxFreq, best,
      message: `Thêm '<strong>${s[r]}</strong>' → maxFreq = <strong>${maxFreq}</strong>, cần đổi ${r - l + 1} − ${maxFreq} = <strong>${r - l + 1 - maxFreq}</strong> (k = ${k}).`,
      codeLine: 4,
    });
    while (r - l + 1 - maxFreq > k) {
      trace.push({
        type: 'shrink', l, r, maxFreq, need: r - l + 1 - maxFreq, best,
        message: `Cần đổi <strong>${r - l + 1 - maxFreq} > ${k}</strong> → co l (bỏ '${s[l]}'), <strong>l → ${l + 1}</strong>.`,
        codeLine: 5,
      });
      count[A(s[l])]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  trace.push({
    type: 'done', l, r: s.length - 1, maxFreq, need: 0, best,
    message: s.length === 0
      ? 'Chuỗi rỗng → <strong>0</strong>.'
      : `Hoàn tất. Dài nhất sau ≤ ${k} lần đổi = <strong>${best}</strong>.`,
    codeLine: 9,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int CharacterReplacement(string s, int k) {',
  '    int[] count = new int[26];',
  '    int l = 0, maxFreq = 0, best = 0;',
  '    for (int r = 0; r < s.Length; r++) {',
  "        maxFreq = Math.Max(maxFreq, ++count[s[r] - 'A']);",
  '        while (r - l + 1 - maxFreq > k) {',
  "            count[s[l] - 'A']--;",
  '            l++;',
  '        }',
  '        best = Math.Max(best, r - l + 1);',
  '    }',
  '    return best;',
  '}',
];

export const ReplacementVisualizer = () => {
  const [sStr, setSStr] = useState('ABAB');
  const [kStr, setKStr] = useState('2');
  const [s, setS] = useState('ABAB');
  const [k, setK] = useState(2);
  const clean = useMemo(() => s.toUpperCase().replace(/[^A-Z]/g, ''), [s]);
  const trace = useMemo(() => generateTrace(clean, k), [clean, k]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, kk: string) => {
    const kn = Number(kk);
    if (Number.isNaN(kn) || kn < 0) return;
    pb.restart();
    setS(v);
    setK(kn);
  };
  const ok = step.need <= k;

  return (
    <div>
      <VizHeader
        backTo="/blog/char-replacement-424" backLabel="Bài giảng Char Replacement"
        badge="Sliding Window · O(n)" title="Char Replacement" accent="trực quan"
        sub="Cửa sổ hợp lệ khi số ký tự phải đổi (dài − maxFreq) ≤ k. Khung xanh = hợp lệ, đỏ = phải co."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>CHUỖI · K = {k} · BEST = {step.best}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {clean.split('').map((c, i) => {
            const inWin = i >= step.l && i <= step.r && step.r >= 0;
            return (
              <div
                key={i}
                style={{
                  minWidth: 40, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                  border: `2px solid ${inWin ? (ok ? 'var(--teal)' : '#ff5f57') : 'var(--border)'}`,
                  background: inWin
                    ? ok
                      ? 'rgba(45,212,191,.12)'
                      : 'rgba(255,95,87,.12)'
                    : 'rgba(0,0,0,.25)',
                  color: inWin ? (ok ? 'var(--teal)' : '#ff5f57') : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15,
                  transition: 'all .3s var(--ease)',
                }}
              >
                {c}
                <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>
                  {step.l === i ? 'l' : ''}{step.r === i && step.type !== 'done' ? 'r' : ''}&nbsp;
                </div>
              </div>
            );
          })}
          {clean.length === 0 && (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng</p>
          )}
        </div>
        <p className="mono" style={{ fontSize: 12.5, margin: '12px 0 0', color: ok ? 'var(--teal)' : '#ff5f57' }}>
          dài − maxFreq = {step.r >= step.l && step.r >= 0 ? step.r - step.l + 1 : 0} − {step.maxFreq} = {step.need} {ok ? '≤' : '>'} k={k}
        </p>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s (chữ HOA):" value={sStr} onChange={setSStr} onEnter={() => build(sStr, kStr)} placeholder="ABAB" maxWidth={180} />
        <InputField label="k:" value={kStr} onChange={setKStr} onEnter={() => build(sStr, kStr)} placeholder="2" maxWidth={80} />
        <button className="btn" onClick={() => build(sStr, kStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · ABAB k=2 → 4', value: 'ABAB|2' },
          { label: 'AABABBA k=1 → 4', value: 'AABABBA|1' },
          { label: 'k=0 · AABA → 2', value: 'AABA|0' },
        ]}
        onPick={(v) => {
          const [ns, nk] = v.split('|');
          setSStr(ns);
          setKStr(nk);
          build(ns, nk);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
