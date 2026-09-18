import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GridBoard, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'wave' | 'done';
  phase: 'pacific' | 'atlantic' | 'done';
  pac: string[]; // "r,c"
  atl: string[];
  wave: [number, number][];
  message: string; codeLine: number;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
const key = (r: number, c: number) => `${r},${c}`;

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
  return rows;
};

// BFS từng đợt sóng từ biên, đi ngược (thấp → cao)
const floodWaves = (
  h: number[][],
  starts: [number, number][],
  push: (wave: [number, number][], seen: Set<string>) => void,
): Set<string> => {
  const R = h.length;
  const C = h[0].length;
  const seen = new Set<string>();
  let frontier: [number, number][] = [];
  for (const [r, c] of starts) {
    if (!seen.has(key(r, c))) {
      seen.add(key(r, c));
      frontier.push([r, c]);
    }
  }
  push([...frontier], new Set(seen));
  while (frontier.length > 0) {
    const next: [number, number][] = [];
    for (const [r, c] of frontier) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
        if (seen.has(key(nr, nc)) || h[nr][nc] < h[r][c]) continue;
        seen.add(key(nr, nc));
        next.push([nr, nc]);
      }
    }
    if (next.length === 0) break;
    frontier = next;
    push([...frontier], new Set(seen));
  }
  return seen;
};

const generateTrace = (h: number[][]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', phase: 'pacific', pac: [], atl: [], wave: [],
    message: `Pacific = <strong>trên + trái</strong>, Atlantic = <strong>dưới + phải</strong>. Loang ngược từ 2 bờ vào (chỉ lên cao), giao nhau là đáp án.`,
    codeLine: 2,
  });
  if (h.length === 0) {
    trace.push({
      type: 'done', phase: 'done', pac: [], atl: [], wave: [],
      message: 'Ma trận rỗng.',
      codeLine: 2,
    });
    return trace;
  }
  const R = h.length;
  const C = h[0].length;
  const pacStarts: [number, number][] = [];
  const atlStarts: [number, number][] = [];
  for (let c = 0; c < C; c++) {
    pacStarts.push([0, c]);
    atlStarts.push([R - 1, c]);
  }
  for (let r = 0; r < R; r++) {
    pacStarts.push([r, 0]);
    atlStarts.push([r, C - 1]);
  }

  let pacSeen = new Set<string>();
  floodWaves(h, pacStarts, (wave, seen) => {
    pacSeen = seen;
    trace.push({
      type: 'wave', phase: 'pacific', pac: [...seen], atl: [], wave,
      message: `Pacific loang thêm <strong>${wave.length}</strong> ô: ${wave.map(([r, c]) => `(${r},${c})=${h[r][c]}`).join(' ')}. Đã phủ ${seen.size} ô.`,
      codeLine: 16,
    });
  });
  let atlSeen = new Set<string>();
  floodWaves(h, atlStarts, (wave, seen) => {
    atlSeen = seen;
    trace.push({
      type: 'wave', phase: 'atlantic', pac: [...pacSeen], atl: [...seen], wave,
      message: `Atlantic loang thêm <strong>${wave.length}</strong> ô: ${wave.map(([r, c]) => `(${r},${c})=${h[r][c]}`).join(' ')}. Đã phủ ${seen.size} ô.`,
      codeLine: 17,
    });
  });

  const both = [...pacSeen].filter((k) => atlSeen.has(k));
  trace.push({
    type: 'done', phase: 'done', pac: [...pacSeen], atl: [...atlSeen], wave: [],
    message: `Giao nhau <strong>${both.length}</strong> ô: ${both.map((k) => `(${k})=${h[Number(k.split(',')[0])][Number(k.split(',')[1])]}`).join(' ')}.`,
    codeLine: 21,
  });
  return trace;
};

const CSHARP_LINES = [
  'public IList<IList<int>> PacificAtlantic(int[][] h) {',
  '    int R = h.Length, C = h[0].Length;',
  '    var pac = new HashSet<string>();',
  '    var atl = new HashSet<string>();',
  '    void Dfs(int r, int c, HashSet<string> seen, int prev) {',
  '        if (r < 0 || c < 0 || r >= R || c >= C) return;',
  '        string k = r + "," + c;',
  '        if (seen.Contains(k) || h[r][c] < prev) return;',
  '        seen.Add(k);',
  '        Dfs(r+1, c, seen, h[r][c]);',
  '        Dfs(r-1, c, seen, h[r][c]);',
  '        Dfs(r, c+1, seen, h[r][c]);',
  '        Dfs(r, c-1, seen, h[r][c]);',
  '    }',
  '    for (int c = 0; c < C; c++) {',
  '        Dfs(0, c, pac, h[0][c]);',
  '        Dfs(R-1, c, atl, h[R-1][c]);',
  '    }',
  '    for (int r = 0; r < R; r++) {',
  '        Dfs(r, 0, pac, h[r][0]);',
  '        Dfs(r, C-1, atl, h[r][C-1]);',
  '    }',
  '    var res = new List<IList<int>>();',
  '    foreach (var k in pac)',
  '        if (atl.Contains(k)) {',
  '            var p = k.Split(",");',
  '            res.Add(new List<int> { int.Parse(p[0]), int.Parse(p[1]) });',
  '        }',
  '    return res;',
  '}',
];

export const PacificVisualizer = () => {
  const [str, setStr] = useState('1,2,2,3,5;3,2,3,4,4;2,4,5,3,1;6,7,1,4,5;5,1,1,2,4');
  const [h, setH] = useState<number[][]>([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ]);
  const trace = useMemo(() => generateTrace(h), [h]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nh = parseMatrix(v);
    if (nh.length === 0 || nh.length > 5 || nh[0].length > 5) return;
    pb.restart();
    setH(nh);
  };

  const pacSet = new Set(step.pac);
  const atlSet = new Set(step.atl);
  const waveSet = new Set(step.wave.map(([r, c]) => key(r, c)));
  const getState = (r: number, c: number): TreeNodeState | undefined => {
    const k = key(r, c);
    if (waveSet.has(k)) return 'cur';
    const inP = pacSet.has(k);
    const inA = atlSet.has(k);
    if (inP && inA) return 'add';
    if (inP) return 'done';
    if (inA) return 'seen';
    return undefined;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/pacific-atlantic-417" backLabel="Bài giảng Pacific Atlantic"
        badge="Multi-source BFS · O(m·n)" title="Pacific Atlantic" accent="trực quan"
        sub="Sóng amber là đợt loang hiện tại. Teal = Pacific phủ, vàng = Atlantic phủ, xanh sáng = cả 2 (đáp án)."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>
          {step.phase === 'pacific' ? 'LOANG PACIFIC (TRÊN+TRÁI)' : step.phase === 'atlantic' ? 'LOANG ATLANTIC (DƯỚI+PHẢI)' : `GIAO NHAU (${step.pac.filter((k) => atlSet.has(k)).length} Ô)`}
          {' '}· PAC {step.pac.length} / ATL {step.atl.length}
        </div>
        <GridBoard rows={h} getState={getState} />
        <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '10px 0 0' }}>
          teal = Pacific · vàng = Atlantic · xanh sáng = cả 2 · viền amber = sóng hiện tại
        </p>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="matrix (hàng cách ; — ≤5×5):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,2,3,5;3,2,..." maxWidth={320} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 5×5 → 7 ô', value: '1,2,2,3,5;3,2,3,4,4;2,4,5,3,1;6,7,1,4,5;5,1,1,2,4' },
          { label: 'Nhỏ · [1,2]', value: '1,2' },
          { label: 'Bằng nhau · 2×2', value: '2,2;2,2' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m·n)" />
    </div>
  );
};
