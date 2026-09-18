import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell,
} from './shared';

interface Step {
  type: 'init' | 'calc' | 'done';
  i: number | null; // prefix đang tính
  hitJ: number | null; // j giúp dp[i] = true
  dp: boolean[];
  message: string; codeLine: number;
}

const generateTrace = (s: string, dict: Set<string>): Step[] => {
  const trace: Step[] = [];
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  trace.push({
    type: 'init', i: null, hitJ: null, dp: [...dp],
    message: `dp[i] = prefix i chữ cắt được. dp[0] = true. Từ điển: {${[...dict].join(', ') || '∅'}}.`,
    codeLine: 2,
  });
  for (let i = 1; i <= n; i++) {
    let hit: number | null = null;
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.slice(j, i))) {
        hit = j;
        break;
      }
    }
    dp[i] = hit !== null;
    trace.push({
      type: 'calc', i, hitJ: hit, dp: [...dp],
      message: hit !== null
        ? `dp[<strong>${i}</strong>] (${s.slice(0, i)}): dp[${hit}] ✓ + "<strong>${s.slice(hit, i)}</strong>" trong dict → <strong>true</strong>.`
        : `dp[<strong>${i}</strong>] (${s.slice(0, i)}): không có điểm cắt hợp lệ → <strong>false</strong>.`,
      codeLine: 5,
    });
  }
  trace.push({
    type: 'done', i: null, hitJ: null, dp: [...dp],
    message: `Hoàn tất. dp[${n}] = <strong>${dp[n] ? 'true' : 'false'}</strong>.`,
    codeLine: 10,
  });
  return trace;
};

const CSHARP_LINES = [
  'public bool WordBreak(string s, IList<string> dict) {',
  '    var set = new HashSet<string>(dict);',
  '    var dp = new bool[s.Length + 1];',
  '    dp[0] = true;',
  '    for (int i = 1; i <= s.Length; i++)',
  '        for (int j = 0; j < i; j++)',
  '            if (dp[j] && set.Contains(s.Substring(j, i - j))) {',
  '                dp[i] = true;',
  '                break;',
  '            }',
  '    return dp[s.Length];',
  '}',
];

export const WordBreakVisualizer = () => {
  const [sStr, setSStr] = useState('leetcode');
  const [dStr, setDStr] = useState('leet,code');
  const [s, setS] = useState('leetcode');
  const [dict, setDict] = useState<Set<string>>(new Set(['leet', 'code']));
  const trace = useMemo(() => generateTrace(s, dict), [s, dict]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const ns = a.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12);
    const nd = new Set(
      b.split(',').map((x) => x.trim().toLowerCase().replace(/[^a-z]/g, '')).filter((x) => x !== ''),
    );
    if (ns.length === 0 || nd.size === 0) return;
    pb.restart();
    setS(ns);
    setDict(nd);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/word-break-139" backLabel="Bài giảng Word Break"
        badge="DP Prefix · O(n²)" title="Word Break" accent="trực quan"
        sub="dp[i] đúng khi có điểm cắt j: dp[j] đúng + đoạn [j,i) trong từ điển. Ô teal = cắt được."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>CHUỖI S</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {s.split('').map((c, i) => (
            <ArrCell
              key={i}
              v={c}
              sub={`[${i}]`}
              state={
                step.i !== null && i < step.i && step.dp[step.i]
                  ? step.hitJ !== null && i >= step.hitJ
                    ? 'teal'
                    : 'dim'
                  : undefined
              }
            />
          ))}
        </div>
        <div className="card-title" style={{ marginTop: 14 }}><span className="dot"></span>BẢNG DP</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {step.dp.map((v, i) => (
            <ArrCell
              key={i}
              v={v ? 'T' : 'F'}
              sub={`dp[${i}]`}
              state={step.i === i ? (v ? 'teal' : 'cur') : v ? 'dim' : undefined}
            />
          ))}
        </div>
        {step.hitJ !== null && step.i !== null && (
          <p className="mono" style={{ fontSize: 12, color: 'var(--teal)', margin: '10px 0 0' }}>
            điểm cắt j = {step.hitJ}: "{s.slice(0, step.hitJ)}" ✓ + "{s.slice(step.hitJ, step.i)}" ∈ dict
          </p>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="s (chữ, ≤12):" value={sStr} onChange={setSStr} onEnter={() => build(sStr, dStr)} placeholder="leetcode" maxWidth={180} />
        <InputField label="dict (phẩy):" value={dStr} onChange={setDStr} onEnter={() => build(sStr, dStr)} placeholder="leet,code" maxWidth={200} />
        <button className="btn" onClick={() => build(sStr, dStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · true', value: 'leetcode|leet,code' },
          { label: 'Bẫy tham lam · false', value: 'catsandog|cats,dog,sand,and,cat' },
          { label: 'Lặp từ · aaaa/aa → true', value: 'aaaa|aa' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setSStr(a);
          setDStr(b);
          build(a, b);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n²)" />
    </div>
  );
};
