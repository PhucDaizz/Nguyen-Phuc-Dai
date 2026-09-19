import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, GridBoard, type TreeNodeState,
} from './shared';
import { getSolutions, UNIQUEPATHS_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'cell' | 'done';
  r: number | null;
  c: number | null;
  dp: number[][];
  from: ('top' | 'left' | 'start') | null;
  message: string; codeLine: number;
}

const generateTrace = (m: number, n: number): Step[] => {
  const trace: Step[] = [];
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const snap = () => dp.map((row) => [...row]);
  trace.push({
    type: 'init', r: null, c: null, dp: snap(), from: null,
    message: `Lưới ${m}×${n}. Ô = trên + trái; hàng đầu/cột đầu = 1. Chỉ cần <strong>1 hàng lăn</strong> (ở đây hiện full bảng cho dễ nhìn).`,
    codeLine: 1,
  });
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let from: Step['from'];
      if (r === 0 || c === 0) {
        dp[r][c] = 1;
        from = 'start';
        trace.push({
          type: 'cell', r, c, dp: snap(), from,
          message: `Ô (${r},${c}) ở biên → <strong>1</strong> (chỉ 1 đường đi men biên).`,
          codeLine: 4,
        });
      } else {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        from = 'top';
        trace.push({
          type: 'cell', r, c, dp: snap(), from,
          message: `Ô (${r},${c}) = trên (${dp[r - 1][c]}) + trái (${dp[r][c - 1]}) = <strong>${dp[r][c]}</strong>.`,
          codeLine: 4,
        });
      }
    }
  }
  trace.push({
    type: 'done', r: null, c: null, dp: snap(), from: null,
    message: `Hoàn tất. Đáp án ô cuối = <strong>${dp[m - 1][n - 1]}</strong>.`,
    codeLine: 6,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_UNIQUEPATHS = getSolutions('unique-paths-62');

export const UniquePathsVisualizer = () => {
  const [mStr, setMStr] = useState('3');
  const [nStr, setNStr] = useState('7');
  const [m, setM] = useState(3);
  const [n, setN] = useState(7);
  const trace = useMemo(() => generateTrace(m, n), [m, n]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const nm = Number(a);
    const nn = Number(b);
    if (Number.isNaN(nm) || Number.isNaN(nn) || nm < 1 || nn < 1 || nm > 5 || nn > 8) return;
    pb.restart();
    setM(Math.floor(nm));
    setN(Math.floor(nn));
  };

  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (step.r === r && step.c === c) return 'cur';
    if (step.from === 'top' && step.r !== null && step.c !== null) {
      if ((r === step.r - 1 && c === step.c) || (r === step.r && c === step.c - 1)) return 'seen';
    }
    if (step.dp[r]?.[c] > 0) return 'done';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/unique-paths-62" backLabel="Bài giảng Unique Paths"
        badge="Grid DP · O(m·n)" title="Unique Paths" accent="trực quan"
        sub="Mỗi ô = trên + trái. Ô amber đang tính, 2 ô vàng là nguồn cộng vào."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>LƯỚI {m}×{n} · ĐÁP ÁN GÓC PHẢI-DƯỚI</div>
        <GridBoard rows={step.dp} getState={getState} size={Math.min(52, Math.floor(440 / Math.max(n, 1)))} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="m (≤5):" value={mStr} onChange={setMStr} onEnter={() => build(mStr, nStr)} placeholder="3" maxWidth={70} />
        <InputField label="n (≤8):" value={nStr} onChange={setNStr} onEnter={() => build(mStr, nStr)} placeholder="7" maxWidth={70} />
        <button className="btn" onClick={() => build(mStr, nStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3×7 → 28', value: '3|7' },
          { label: 'Vuông · 3×3 → 6', value: '3|3' },
          { label: '1 hàng · 1×5 → 1', value: '1|5' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setMStr(a);
          setNStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_UNIQUEPATHS}
          defaultLang="csharp"
          getHighlight={(lang) => [UNIQUEPATHS_LINE_MAP[lang][step.type]]}
          meta="O(m·n) · O(n)"
        />
      </div>
    </div>
  );
};
