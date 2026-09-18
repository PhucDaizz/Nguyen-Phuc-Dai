import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'go' | 'done';
  r: number | null;
  c: number | null;
  order: [number, number][];
  top: number;
  bottom: number;
  left: number;
  right: number;
  message: string; codeLine: number;
}

const parseMatrix = (str: string): number[][] => {
  const rows = str
    .split(';')
    .map((row) =>
      row
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    )
    .filter((row) => row.length > 0);
  if (rows.length === 0) return [];
  const w = rows[0].length;
  if (!rows.every((r) => r.length === w)) return [];
  if (rows.length > 5 || w > 6) return [];
  return rows;
};

const generateTrace = (m: number[][]): Step[] => {
  const trace: Step[] = [];
  const R = m.length;
  const C = m[0]?.length ?? 0;
  trace.push({
    type: 'init', r: null, c: null, order: [], top: 0, bottom: R - 1, left: 0, right: C - 1,
    message: `4 biên: top/bottom/left/right. Đi hết 1 cạnh thì co biên đó, check biên sau mỗi cạnh.`,
    codeLine: 4,
  });
  if (R === 0 || C === 0) {
    trace.push({
      type: 'done', r: null, c: null, order: [], top: 0, bottom: -1, left: 0, right: -1,
      message: 'Ma trận rỗng.',
      codeLine: 4,
    });
    return trace;
  }
  let top = 0;
  let bottom = R - 1;
  let left = 0;
  let right = C - 1;
  const order: [number, number][] = [];
  const snap = () => order.map(([x, y]) => [x, y] as [number, number]);
  const push = (r: number, c: number, edge: string) => {
    order.push([r, c]);
    trace.push({
      type: 'go', r, c, order: snap(), top, bottom, left, right,
      message: `Cạnh ${edge}: lấy <strong>${m[r][c]} (${r},${c})</strong> — thứ ${order.length}. Biên: t=${top} b=${bottom} l=${left} r=${right}.`,
      codeLine: edge === 'trên' ? 6 : edge === 'phải' ? 8 : edge === 'dưới' ? 10 : 13,
    });
  };
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) push(top, c, 'trên');
    top++;
    for (let r = top; r <= bottom; r++) push(r, right, 'phải');
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) push(bottom, c, 'dưới');
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) push(r, left, 'trái');
      left++;
    }
  }
  trace.push({
    type: 'done', r: null, c: null, order: snap(), top, bottom, left, right,
    message: `Hết biên → xong. Thứ tự: [${order.map(([r, c]) => m[r][c]).join(', ')}].`,
    codeLine: 4,
  });
  return trace;
};

const CSHARP_LINES = [
  'public IList<int> SpiralOrder(int[][] m) {',
  '    var res = new List<int>();',
  '    int top = 0, bot = m.Length - 1;',
  '    int left = 0, right = m[0].Length - 1;',
  '    while (top <= bot && left <= right) {',
  '        for (int c = left; c <= right; c++) res.Add(m[top][c]);',
  '        top++;',
  '        for (int r = top; r <= bot; r++) res.Add(m[r][right]);',
  '        right--;',
  '        if (top <= bot) {',
  '            for (int c = right; c >= left; c--) res.Add(m[bot][c]);',
  '            bot--;',
  '        }',
  '        if (left <= right) {',
  '            for (int r = bot; r >= top; r--) res.Add(m[r][left]);',
  '            left++;',
  '        }',
  '    }',
  '    return res;',
  '}',
];

export const SpiralVisualizer = () => {
  const [str, setStr] = useState('1,2,3;4,5,6;7,8,9');
  const [grid, setGrid] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const trace = useMemo(() => generateTrace(grid), [grid]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const ng = parseMatrix(v);
    if (ng.length === 0) return;
    pb.restart();
    setGrid(ng);
  };

  const orderIdx = new Map(step.order.map(([r, c], k) => [`${r},${c}`, k]));
  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (step.r === r && step.c === c && step.type === 'go') return 'cur';
    if (orderIdx.has(`${r},${c}`)) return 'done';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/spiral-matrix-54" backLabel="Bài giảng Spiral Matrix"
        badge="Boundary Shrink · O(m·n)" title="Spiral Order" accent="trực quan"
        sub="Đi 4 cạnh xoắn ốc, hết cạnh co biên. Ô amber là vừa lấy, teal mờ là đã lấy (số thứ tự trong message)."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>MA TRẬN · BIÊN t={step.top} b={step.bottom} l={step.left} r={step.right}
          </div>
          <GridBoard rows={grid} getState={getState} size={50} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            THỨ TỰ ({step.order.length})
          </div>
          <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)', lineHeight: 2 }}>
            [{step.order.map(([r, c]) => grid[r][c]).join(', ') || '—'}]
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="matrix (≤5×6):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3;4,5,6;7,8,9" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3×3', value: '1,2,3;4,5,6;7,8,9' },
          { label: 'Dẹt · 1×4', value: '1,2,3,4' },
          { label: 'Dọc · 3×1', value: '1;2;3' },
          { label: 'Chữ nhật · 3×4', value: '1,2,3,4;5,6,7,8;9,10,11,12' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m·n)" />
    </div>
  );
};
