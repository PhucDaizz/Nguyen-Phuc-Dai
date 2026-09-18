import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'swap' | 'flip' | 'done';
  phase: 'transpose' | 'reverse';
  a: [number, number] | null;
  b: [number, number] | null;
  row: number | null;
  grid: number[][];
  message: string; codeLine: number;
}

const parseMatrix = (str: string, square: boolean): number[][] => {
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
  if (square && (rows.length !== w || rows.length > 4)) return [];
  if (rows.length > 5 || w > 6) return [];
  return rows;
};

const generateTrace = (init: number[][]): Step[] => {
  const trace: Step[] = [];
  const n = init.length;
  const g = init.map((row) => [...row]);
  const snap = () => g.map((row) => [...row]);
  trace.push({
    type: 'init', phase: 'transpose', a: null, b: null, row: null, grid: snap(),
    message: `Xoay 90° = <strong>chuyển vị</strong> (swap chéo chính) rồi <strong>lật ngang</strong> từng hàng.`,
    codeLine: 1,
  });
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [g[i][j], g[j][i]] = [g[j][i], g[i][j]];
      trace.push({
        type: 'swap', phase: 'transpose', a: [i, j], b: [j, i], row: null, grid: snap(),
        message: `Swap chéo chính: (${i},${j}) ↔ (${j},${i}) — chỉ swap <strong>j > i</strong> (nửa trên).`,
        codeLine: 4,
      });
    }
  }
  for (let i = 0; i < n; i++) {
    g[i].reverse();
    trace.push({
      type: 'flip', phase: 'reverse', a: null, b: null, row: i, grid: snap(),
      message: `Lật ngang hàng <strong>${i}</strong>: [${g[i].slice().reverse().join(', ')}] → [${g[i].join(', ')}].`,
      codeLine: 7,
    });
  }
  trace.push({
    type: 'done', phase: 'reverse', a: null, b: null, row: null, grid: snap(),
    message: 'Hoàn tất — in-place, không ma trận phụ.',
    codeLine: 7,
  });
  return trace;
};

const CSHARP_LINES = [
  'public void Rotate(int[][] m) {',
  '    int n = m.Length;',
  '    for (int i = 0; i < n; i++)',
  '        for (int j = i + 1; j < n; j++)',
  '            (m[i][j], m[j][i]) = (m[j][i], m[i][j]);',
  '    foreach (var row in m)',
  '        Array.Reverse(row);',
  '}',
];

export const RotateVisualizer = () => {
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
    const ng = parseMatrix(v, true);
    if (ng.length === 0) return;
    pb.restart();
    setGrid(ng);
  };

  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (step.a && r === step.a[0] && c === step.a[1]) return 'cur';
    if (step.b && r === step.b[0] && c === step.b[1]) return 'cur';
    if (step.row !== null && r === step.row && step.phase === 'reverse') return 'add';
    if (r === c) return 'seen';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/rotate-image-48" backLabel="Bài giảng Rotate Image"
        badge="Transpose + Reflect · O(1)" title="Rotate Image" accent="trực quan"
        sub="Chéo chính mờ (không đụng), cặp swap amber, hàng đang lật teal."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>
          {step.phase === 'transpose' ? 'BƯỚC 1 — CHUYỂN VỊ (CHÉO CHÍNH)' : 'BƯỚC 2 — LẬT NGANG TỪNG HÀNG'}
        </div>
        <GridBoard rows={step.grid} getState={getState} size={52} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="matrix vuông (hàng cách ; — ≤4×4):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3;4,5,6;7,8,9" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3×3', value: '1,2,3;4,5,6;7,8,9' },
          { label: '2×2', value: '1,2;3,4' },
          { label: '4×4', value: '1,2,3,4;5,6,7,8;9,10,11,12;13,14,15,16' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n²) · O(1)" />
    </div>
  );
};
