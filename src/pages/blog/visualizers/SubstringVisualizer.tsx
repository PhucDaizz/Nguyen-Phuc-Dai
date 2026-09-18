import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress,
} from './shared';

interface Step {
  type: 'init' | 'expand' | 'shrink' | 'done';
  l: number; r: number;
  win: string[];
  best: number;
  message: string; codeLine: number;
}

const generateTrace = (s: string): Step[] => {
  const trace: Step[] = [];
  const seen = new Set<string>();
  let l = 0;
  let best = 0;
  trace.push({
    type: 'init', l: 0, r: -1, win: [], best,
    message: `Cửa sổ <strong>[l, r]</strong> + set. Mở r từng bước, gặp trùng thì co l.`,
    codeLine: 1,
  });
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      trace.push({
        type: 'shrink', l, r, win: s.slice(l, r).split(''), best,
        message: `'<strong>${s[r]}</strong>' đã có trong cửa sổ → xóa s[${l}]='${s[l]}', <strong>l → ${l + 1}</strong>.`,
        codeLine: 5,
      });
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
    trace.push({
      type: 'expand', l, r, win: s.slice(l, r + 1).split(''), best,
      message: `Thêm '<strong>${s[r]}</strong>' → cửa sổ [${l}, ${r}] dài <strong>${r - l + 1}</strong>, best = <strong>${best}</strong>.`,
      codeLine: 9,
    });
  }
  trace.push({
    type: 'done', l, r: s.length - 1, win: [], best,
    message: s.length === 0
      ? 'Chuỗi rỗng → <strong>0</strong>.'
      : `Hoàn tất. Chuỗi con dài nhất không lặp dài <strong>${best}</strong>.`,
    codeLine: 11,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int LengthOfLongestSubstring(string s) {',
  '    var seen = new HashSet<char>();',
  '    int l = 0, best = 0;',
  '    for (int r = 0; r < s.Length; r++) {',
  '        while (seen.Contains(s[r])) {',
  '            seen.Remove(s[l]);',
  '            l++;',
  '        }',
  '        seen.Add(s[r]);',
  '        best = Math.Max(best, r - l + 1);',
  '    }',
  '    return best;',
  '}',
];

export const SubstringVisualizer = () => {
  const [str, setStr] = useState('abcabcbb');
  const [s, setS] = useState('abcabcbb');
  const trace = useMemo(() => generateTrace(s), [s]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setS(v);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/longest-substring-3" backLabel="Bài giảng Longest Substring"
        badge="Sliding Window · O(n)" title="Longest Substring" accent="trực quan"
        sub="Mở r từng ký tự, gặp trùng thì co l tới khi hết trùng. Khung amber là cửa sổ hiện tại."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>CHUỖI · BEST = {step.best}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {s.split('').map((c, i) => {
            const inWin = i >= step.l && i <= step.r && step.r >= 0;
            const isR = step.type !== 'done' && step.type !== 'init' && i === step.r;
            return (
              <div
                key={i}
                style={{
                  minWidth: 40, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                  border: `2px solid ${isR ? 'var(--teal)' : inWin ? 'var(--accent)' : 'var(--border)'}`,
                  background: isR ? 'rgba(45,212,191,.15)' : inWin ? 'rgba(255,181,71,.1)' : 'rgba(0,0,0,.25)',
                  color: isR ? 'var(--teal)' : inWin ? 'var(--accent)' : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15,
                  transition: 'all .3s var(--ease)',
                }}
              >
                {c}
                <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>
                  {step.l === i ? 'l' : ''}{isR ? 'r' : ''}&nbsp;
                </div>
              </div>
            );
          })}
          {s.length === 0 && (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>chuỗi rỗng</p>
          )}
        </div>
        <p className="mono" style={{ fontSize: 12.5, margin: '12px 0 0', color: 'var(--teal)' }}>
          window = [{step.win.join('') || '∅'}] · dài {step.r >= step.l && step.r >= 0 ? step.r - step.l + 1 : 0}
        </p>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s:" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="abcabcbb" maxWidth={240} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · abcabcbb → 3', value: 'abcabcbb' },
          { label: 'Toàn trùng · bbbbb → 1', value: 'bbbbb' },
          { label: 'pwwkew → 3', value: 'pwwkew' },
          { label: 'Rỗng → 0', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n)" />
    </div>
  );
};
