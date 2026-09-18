import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress,
} from './shared';

interface Step {
  type: 'init' | 'expand' | 'shrink' | 'done';
  l: number; r: number;
  have: number; needCount: number;
  best: string;
  message: string; codeLine: number;
}

const generateTrace = (s: string, t: string): Step[] => {
  const trace: Step[] = [];
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const win = new Map<string, number>();
  let have = 0;
  let l = 0;
  let best = '';

  trace.push({
    type: 'init', l: 0, r: -1, have: 0, needCount: need.size, best: '',
    message: t.length > s.length
      ? `t dài hơn s → không thể chứa → return <strong>""</strong> ngay.`
      : `Cần đủ ${need.size} loại chữ {${[...need.entries()].map(([c, n]) => `${c}×${n}`).join(', ')}}. Mở r, đủ thì co l.`,
    codeLine: 1,
  });
  if (t.length > s.length) {
    trace.push({
      type: 'done', l: 0, r: -1, have: 0, needCount: need.size, best: '',
      message: 'Hoàn tất → <strong>""</strong>.',
      codeLine: 1,
    });
    return trace;
  }

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    win.set(c, (win.get(c) ?? 0) + 1);
    if (need.has(c) && win.get(c) === need.get(c)) have++;
    trace.push({
      type: 'expand', l, r, have, needCount: need.size, best,
      message: `Thêm s[${r}]='${c}' → have = <strong>${have}/${need.size}</strong>.`,
      codeLine: 8,
    });
    while (have === need.size) {
      if (best === '' || r - l + 1 < best.length) {
        best = s.slice(l, r + 1);
        trace.push({
          type: 'shrink', l, r, have, needCount: need.size, best,
          message: `Đủ chữ! Cửa sổ [${l}, ${r}] dài ${r - l + 1} → best mới = "<strong>${best}</strong>". Co tiếp l.`,
          codeLine: 11,
        });
      } else {
        trace.push({
          type: 'shrink', l, r, have, needCount: need.size, best,
          message: `Đủ chữ nhưng [${l}, ${r}] dài ${r - l + 1} ≥ best (${best.length}) → co <strong>l → ${l + 1}</strong>.`,
          codeLine: 11,
        });
      }
      const d = s[l];
      win.set(d, win.get(d)! - 1);
      if (need.has(d) && win.get(d)! < need.get(d)!) have--;
      l++;
    }
  }

  trace.push({
    type: 'done', l, r: s.length - 1, have, needCount: need.size, best,
    message: best === ''
      ? 'Hoàn tất. Không cửa sổ nào đủ chữ → <strong>""</strong>.'
      : `Hoàn tất. Cửa sổ nhỏ nhất = "<strong>${best}</strong>" (dài ${best.length}).`,
    codeLine: 19,
  });
  return trace;
};

const CSHARP_LINES = [
  'public string MinWindow(string s, string t) {',
  '    if (t.Length > s.Length) return "";',
  '    var need = new Dictionary<char, int>();',
  '    foreach (char c in t) need[c] = need.GetValueOrDefault(c) + 1;',
  '    var win = new Dictionary<char, int>();',
  '    int have = 0, l = 0;',
  '    string best = "";',
  '    for (int r = 0; r < s.Length; r++) {',
  '        char c = s[r];',
  '        win[c] = win.GetValueOrDefault(c) + 1;',
  '        if (need.ContainsKey(c) && win[c] == need[c]) have++;',
  '        while (have == need.Count) {',
  '            if (best == "" || r - l + 1 < best.Length) best = s.Substring(l, r - l + 1);',
  '            char d = s[l];',
  '            win[d]--;',
  '            if (need.ContainsKey(d) && win[d] < need[d]) have--;',
  '            l++;',
  '        }',
  '    }',
  '    return best;',
  '}',
];

export const MinWindowVisualizer = () => {
  const [sStr, setSStr] = useState('ADOBECODEBANC');
  const [tStr, setTStr] = useState('ABC');
  const [s, setS] = useState('ADOBECODEBANC');
  const [t, setT] = useState('ABC');
  const trace = useMemo(() => generateTrace(s, t), [s, t]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const valid = step.have === step.needCount && step.needCount > 0;

  const build = (v: string, w: string) => {
    pb.restart();
    setS(v);
    setT(w);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/min-window-76" backLabel="Bài giảng Min Window"
        badge="Sliding Window · Hard" title="Min Window" accent="trực quan"
        sub="Mở r tới khi đủ chữ (have = need), rồi co l để tối thiểu. Khung teal = đang đủ chữ."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>S · HAVE = {step.have}/{step.needCount} · BEST = "{step.best || '∅'}"
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {s.split('').map((c, i) => {
            const inWin = i >= step.l && i <= step.r && step.r >= 0;
            return (
              <div
                key={i}
                style={{
                  minWidth: 34, textAlign: 'center', padding: '7px 5px', borderRadius: 8,
                  border: `2px solid ${inWin ? (valid ? 'var(--teal)' : 'var(--accent)') : 'var(--border)'}`,
                  background: inWin
                    ? valid
                      ? 'rgba(45,212,191,.12)'
                      : 'rgba(255,181,71,.1)'
                    : 'rgba(0,0,0,.25)',
                  color: inWin ? (valid ? 'var(--teal)' : 'var(--accent)') : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                  transition: 'all .3s var(--ease)',
                }}
              >
                {c}
                <div style={{ fontSize: 8, fontWeight: 400, color: 'var(--muted)' }}>
                  {step.l === i ? 'l' : ''}{step.r === i && step.type !== 'done' ? 'r' : ''}&nbsp;
                </div>
              </div>
            );
          })}
          {s.length === 0 && (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>s rỗng</p>
          )}
        </div>
        <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: '10px 0 0' }}>
          t = "{t}" · cần: {[...new Map([...t].map((c) => [c, [...t].filter((x) => x === c).length] as [string, number])).entries()].map(([c, n]) => `${c}×${n}`).join(', ') || '∅'}
        </p>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s:" value={sStr} onChange={setSStr} onEnter={() => build(sStr, tStr)} placeholder="ADOBECODEBANC" maxWidth={220} />
        <InputField label="t:" value={tStr} onChange={setTStr} onEnter={() => build(sStr, tStr)} placeholder="ABC" maxWidth={100} />
        <button className="btn" onClick={() => build(sStr, tStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · BANC', value: 'ADOBECODEBANC|ABC' },
          { label: '1 chữ · a/a', value: 'a|a' },
          { label: 'Vô nghiệm · a/aa', value: 'a|aa' },
        ]}
        onPick={(v) => {
          const [ns, nt] = v.split('|');
          setSStr(ns);
          setTStr(nt);
          build(ns, nt);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m+n)" />
    </div>
  );
};
