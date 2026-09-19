import { useMemo, useState } from 'react';
import { getSolutions, ZEROES_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'flag' | 'mark' | 'zero' | 'edge' | 'done';
  grid: number[][];
  hot: [number, number][];
  firstRow: boolean | null;
  firstCol: boolean | null;
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

const generateTrace = (init: number[][]): Step[] => {
  const trace: Step[] = [];
  const R = init.length;
  const C = init[0]?.length ?? 0;
  const g = init.map((row) => [...row]);
  const snap = () => g.map((row) => [...row]);
  trace.push({
    type: 'init', grid: snap(), hot: [], firstRow: null, firstCol: null,
    message: `Dùng <strong>hàng 0 + cột 0 làm cờ</strong> (2 biến riêng cho cờ của chính chúng). Không gian phụ O(1).`,
    codeLine: 1,
  });
  if (R === 0 || C === 0) {
    trace.push({
      type: 'done', grid: snap(), hot: [], firstRow: false, firstCol: false,
      message: 'Ma trận rỗng.',
      codeLine: 1,
    });
    return trace;
  }
  let fr = false;
  let fc = false;
  for (let c = 0; c < C; c++) if (g[0][c] === 0) fr = true;
  for (let r = 0; r < R; r++) if (g[r][0] === 0) fc = true;
  trace.push({
    type: 'flag', grid: snap(), hot: [], firstRow: fr, firstCol: fc,
    message: `Quét cờ: hàng 0 có số 0? <strong>${fr ? 'CÓ' : 'không'}</strong> · cột 0 có số 0? <strong>${fc ? 'CÓ' : 'không'}</strong>.`,
    codeLine: 5,
  });
  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (g[r][c] === 0) {
        g[r][0] = 0;
        g[0][c] = 0;
        trace.push({
          type: 'mark', grid: snap(), hot: [[r, c], [r, 0], [0, c]], firstRow: fr, firstCol: fc,
          message: `Ô (${r},${c}) = 0 → đánh dấu cờ <strong>hàng ${r}</strong> (ô (${r},0)) + <strong>cột ${c}</strong> (ô (0,${c})).`,
          codeLine: 10,
        });
      }
    }
  }
  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (g[r][0] === 0 || g[0][c] === 0) {
        if (g[r][c] !== 0) {
          g[r][c] = 0;
          trace.push({
            type: 'zero', grid: snap(), hot: [[r, c]], firstRow: fr, firstCol: fc,
            message: `Ô (${r},${c}): cờ hàng/cột bật → zero.`,
            codeLine: 16,
          });
        }
      }
    }
  }
  if (fr) {
    for (let c = 0; c < C; c++) g[0][c] = 0;
    trace.push({
      type: 'edge', grid: snap(), hot: [], firstRow: fr, firstCol: fc,
      message: `Cờ hàng 0 bật → zero cả hàng 0.`,
      codeLine: 19,
    });
  }
  if (fc) {
    for (let r = 0; r < R; r++) g[r][0] = 0;
    trace.push({
      type: 'edge', grid: snap(), hot: [], firstRow: fr, firstCol: fc,
      message: `Cờ cột 0 bật → zero cả cột 0.`,
      codeLine: 20,
    });
  }
  trace.push({
    type: 'done', grid: snap(), hot: [], firstRow: fr, firstCol: fc,
    message: 'Hoàn tất — O(1) bộ nhớ phụ.',
    codeLine: 20,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_ZEROES = getSolutions('set-zeroes-73');

export const ZeroesVisualizer = () => {
  const [str, setStr] = useState('1,1,1;1,0,1;1,1,1');
  const [grid, setGrid] = useState<number[][]>([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
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

  const hotSet = new Set(step.hot.map(([r, c]) => `${r},${c}`));
  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (hotSet.has(`${r},${c}`)) return 'cur';
    // cờ hàng 0 / cột 0 đã bật → teal
    if ((r === 0 || c === 0) && step.grid[r]?.[c] === 0 && step.type !== 'init') return 'add';
    if (step.grid[r]?.[c] === 0) return 'seen';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/set-zeroes-73" backLabel="Bài giảng Set Zeroes"
        badge="In-place Markers · O(1)" title="Set Zeroes" accent="trực quan"
        sub="Hàng 0 + cột 0 làm cờ (teal), ô amber là đang xử lý. 2 cờ riêng cho hàng/cột 0."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>MA TRẬN · CỜ HÀNG0={step.firstRow === null ? '?' : step.firstRow ? '0!' : '1'} CỘT0={step.firstCol === null ? '?' : step.firstCol ? '0!' : '1'}</div>
          <GridBoard rows={step.grid} getState={getState} size={50} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            GIAI ĐOẠN
          </div>
          <p className="mono" style={{ fontSize: 14, margin: 0, color: 'var(--teal)' }}>
            {step.type === 'init' && '0 · chuẩn bị cờ'}
            {step.type === 'flag' && '1 · quét 2 cờ'}
            {step.type === 'mark' && '2 · đánh dấu cờ'}
            {step.type === 'zero' && '3 · zero theo cờ'}
            {step.type === 'edge' && '4 · xử lý hàng/cột 0'}
            {step.type === 'done' && '✓ xong'}
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="matrix (≤5×6):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,1,1;1,0,1;1,1,1" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 1 số 0', value: '1,1,1;1,0,1;1,1,1' },
          { label: '0 ở hàng 0', value: '0,1,2,0;3,4,5,2;1,3,1,5' },
          { label: 'Không số 0', value: '1,2;3,4' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_ZEROES}
          defaultLang="csharp"
          getHighlight={(lang) => [ZEROES_LINE_MAP[lang][step.type]]}
          meta="O(m·n) · O(1)"
        />
      </div>
    </div>
  );
};
