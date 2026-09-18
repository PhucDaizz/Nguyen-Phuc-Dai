import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'cell' | 'done';
  i: number | null; // hàng (a)
  j: number | null; // cột (b)
  match: boolean | null;
  dp: number[][];
  message: string; codeLine: number;
}

const generateTrace = (a: string, b: string): Step[] => {
  const trace: Step[] = [];
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const snap = () => dp.map((row) => [...row]);
  trace.push({
    type: 'init', i: null, j: null, match: null, dp: snap(),
    message: `Bảng ${m + 1}×${n + 1} (hàng 0/cột 0 = 0). Khớp thì +1 đường chéo, lệch thì max(trên, trái). a="${a}", b="${b}".`,
    codeLine: 2,
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        trace.push({
          type: 'cell', i, j, match: true, dp: snap(),
          message: `'${a[i - 1]}' = '${b[j - 1]}' ✓ → dp[${i}][${j}] = chéo ${dp[i - 1][j - 1]} + 1 = <strong>${dp[i][j]}</strong>.`,
          codeLine: 6,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        trace.push({
          type: 'cell', i, j, match: false, dp: snap(),
          message: `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(trên ${dp[i - 1][j]}, trái ${dp[i][j - 1]}) = <strong>${dp[i][j]}</strong>.`,
          codeLine: 6,
        });
      }
    }
  }
  trace.push({
    type: 'done', i: null, j: null, match: null, dp: snap(),
    message: m === 0 || n === 0
      ? 'Một chuỗi rỗng → <strong>0</strong>.'
      : `Hoàn tất. Ô góc phải-dưới = <strong>${dp[m][n]}</strong>.`,
    codeLine: 10,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int LongestCommonSubsequence(string a, string b) {',
  '    int m = a.Length, n = b.Length;',
  '    var dp = new int[m+1, n+1];',
  '    for (int i = 1; i <= m; i++)',
  '        for (int j = 1; j <= n; j++)',
  '            dp[i,j] = a[i-1] == b[j-1]',
  '                ? dp[i-1,j-1] + 1',
  '                : Math.Max(dp[i-1,j], dp[i,j-1]);',
  '    return dp[m,n];',
  '}',
];

export const LcsVisualizer = () => {
  const [aStr, setAStr] = useState('abcde');
  const [bStr, setBStr] = useState('ace');
  const [a, setA] = useState('abcde');
  const [b, setB] = useState('ace');
  const trace = useMemo(() => generateTrace(a, b), [a, b]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (x: string, y: string) => {
    const na = x.toLowerCase().replace(/[^a-z]/g, '').slice(0, 7);
    const nb = y.toLowerCase().replace(/[^a-z]/g, '').slice(0, 7);
    if (na.length === 0 || nb.length === 0) return;
    pb.restart();
    setA(na);
    setB(nb);
  };

  // bảng có header hàng/cột chữ
  const rows: (number | string)[][] = [
    ['∅', ...b.split('')],
    ...step.dp.slice(1).map((row, i) => [a[i] ?? '', ...row.slice(1)]),
  ];
  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (r === 0 || c === 0) return undefined;
    const i = r;
    const j = c;
    if (step.i === i && step.j === j) return step.match ? 'add' : 'cur';
    if (step.i !== null && step.j !== null) {
      // nguồn: chéo / trên / trái của ô hiện tại
      if (step.match && i === step.i - 1 && j === step.j - 1) return 'seen';
      if (!step.match && ((i === step.i - 1 && j === step.j) || (i === step.i && j === step.j - 1))) return 'seen';
    }
    if (step.dp[i]?.[j] > 0) return 'done';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/lcs-1143" backLabel="Bài giảng LCS"
        badge="2-D DP · O(m·n)" title="LCS Table" accent="trực quan"
        sub="Khớp thì +1 đường chéo (teal), lệch thì max 2 ô vàng. Ô góc phải-dưới là đáp án."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>BẢNG DP · a="{a}" b="{b}"</div>
        <GridBoard rows={rows} getState={getState} size={40} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="a (≤7 chữ):" value={aStr} onChange={setAStr} onEnter={() => build(aStr, bStr)} placeholder="abcde" maxWidth={160} />
        <InputField label="b (≤7 chữ):" value={bStr} onChange={setBStr} onEnter={() => build(aStr, bStr)} placeholder="ace" maxWidth={160} />
        <button className="btn" onClick={() => build(aStr, bStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · → 3', value: 'abcde|ace' },
          { label: 'Giống hệt · abc/abc → 3', value: 'abc|abc' },
          { label: 'Không chung · abc/def → 0', value: 'abc|def' },
        ]}
        onPick={(v) => {
          const [x, y] = v.split('|');
          setAStr(x);
          setBStr(y);
          build(x, y);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m·n)" />
    </div>
  );
};
