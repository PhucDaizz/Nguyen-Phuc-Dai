import { useMemo, useState } from 'react';
import { getSolutions, ISLANDS_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'sink' | 'island' | 'done';
  grid: string[][];
  sunk: [number, number][]; // ô vừa chìm ở step này
  count: number;
  message: string; codeLine: number;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

const parseGrid = (str: string): string[][] => {
  const rows = str
    .split(';')
    .map((row) =>
      row
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s === '0' || s === '1'),
    )
    .filter((row) => row.length > 0);
  if (rows.length === 0) return [];
  const w = rows[0].length;
  if (!rows.every((r) => r.length === w)) return [];
  return rows;
};

const generateTrace = (init: string[][]): Step[] => {
  const trace: Step[] = [];
  const R = init.length;
  const C = init[0]?.length ?? 0;
  const grid = init.map((row) => [...row]);
  const snap = () => grid.map((row) => [...row]);
  let count = 0;

  trace.push({
    type: 'init', grid: snap(), sunk: [], count,
    message: `Quét mọi ô: gặp "1" thì +1 đảo và chìm cả cụm. Chỉ đi <strong>4 hướng</strong>.`,
    codeLine: 13,
  });
  if (R === 0) {
    trace.push({
      type: 'done', grid: snap(), sunk: [], count,
      message: 'Lưới rỗng → <strong>0</strong>.',
      codeLine: 19,
    });
    return trace;
  }

  const sink = (r: number, c: number, batch: [number, number][]): void => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    batch.push([r, c]);
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc, batch);
  };

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === '1') {
        count++;
        const batch: [number, number][] = [];
        sink(r, c, batch);
        trace.push({
          type: 'island', grid: snap(), sunk: [...batch], count,
          message: `Ô (${r},${c}) là đất mới → đảo thứ <strong>${count}</strong>, chìm cả cụm ${batch.length} ô: ${batch.map(([x, y]) => `(${x},${y})`).join(' ')}.`,
          codeLine: 16,
        });
      }
    }
  }

  trace.push({
    type: 'done', grid: snap(), sunk: [], count,
    message: `Hoàn tất. Đếm được <strong>${count}</strong> đảo (cả lưới đã chìm).`,
    codeLine: 19,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_ISLANDS = getSolutions('number-of-islands-200');

export const IslandsVisualizer = () => {
  const [str, setStr] = useState('1,1,0;1,0,0;0,0,1');
  const [grid, setGrid] = useState<string[][]>([
    ['1', '1', '0'],
    ['1', '0', '0'],
    ['0', '0', '1'],
  ]);
  const trace = useMemo(() => generateTrace(grid), [grid]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const ng = parseGrid(v);
    if (ng.length === 0 || ng.length > 5 || ng[0].length > 6) return;
    pb.restart();
    setGrid(ng);
  };

  const sunkSet = new Set(step.sunk.map(([r, c]) => `${r},${c}`));
  const getState = (r: number, c: number): TreeNodeState | undefined => {
    if (sunkSet.has(`${r},${c}`)) return 'cur';
    if (step.grid[r]?.[c] === '1') return 'seen';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/number-of-islands-200" backLabel="Bài giảng Number of Islands"
        badge="Flood Fill · O(m·n)" title="Number of Islands" accent="trực quan"
        sub="Gặp đất mới thì +1 và chìm cả cụm (amber = vừa chìm). Ô đất chưa thăm viền vàng."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>LƯỚI · ĐÃ ĐẾM {step.count} ĐẢO</div>
          <GridBoard rows={step.grid} getState={getState} />
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '10px 0 0' }}>
            1 = đất · 0 = nước · viền vàng = đất chưa thăm · amber = vừa chìm
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            SỐ ĐẢO
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            {step.count}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            {step.sunk.length > 0 ? `vừa chìm ${step.sunk.length} ô` : 'đang quét…'}
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="grid 0/1 (hàng cách ; — ≤5×6):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,1,0;1,0,0;0,0,1" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Nhỏ · 2 đảo', value: '1,1,0;1,0,0;0,0,1' },
          { label: 'LeetCode · 3 đảo', value: '1,1,0,0,0;1,1,0,0,0;0,0,1,0,0;0,0,0,1,1' },
          { label: 'Chéo nhau · 5 đảo', value: '1,0,1;0,1,0;1,0,1' },
          { label: 'Toàn nước', value: '0,0;0,0' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_ISLANDS}
          defaultLang="csharp"
          getHighlight={(lang) => [ISLANDS_LINE_MAP[lang][step.type]]}
          meta="O(m·n)"
        />
      </div>
    </div>
  );
};
