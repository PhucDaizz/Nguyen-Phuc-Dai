import { useMemo, useState } from 'react';
import { getSolutions, CLONE_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, GraphSvg, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'create' | 'edge' | 'done';
  cur: number | null;
  cloned: number[];
  mapPairs: [number, number][];
  message: string; codeLine: number;
}

// Input edges "0-1,0-3,1-2,2-3" (vô hướng)
const parseEdges = (str: string): [number[], [number, number][]] => {
  const edges: [number, number][] = [];
  const nodes = new Set<number>();
  str.split(',').map((s) => s.trim()).filter(Boolean).forEach((p) => {
    const [a, b] = p.split('-').map((x) => Number(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b) && a !== b) {
      edges.push([a, b]);
      nodes.add(a);
      nodes.add(b);
    }
  });
  const ids = [...nodes].sort((x, y) => x - y);
  // chuẩn hóa về 0..n-1 giữ nguyên label
  return [ids, edges];
};

const adjOf = (ids: number[], edges: [number, number][]) => {
  const m = new Map<number, number[]>();
  ids.forEach((id) => m.set(id, []));
  edges.forEach(([a, b]) => {
    m.get(a)!.push(b);
    m.get(b)!.push(a);
  });
  m.forEach((v) => v.sort((x, y) => x - y));
  return m;
};

const generateTrace = (ids: number[], edges: [number, number][]): Step[] => {
  const trace: Step[] = [];
  const adj = adjOf(ids, edges);
  const cloned: number[] = [];
  const pairs: [number, number][] = [];
  trace.push({
    type: 'init', cur: null, cloned: [], mapPairs: [],
    message: `Đồ thị ${ids.length} node, ${edges.length} cạnh. Map old→new + DFS: <strong>tạo clone trước</strong> rồi mới đi sâu (vòng không treo).`,
    codeLine: 1,
  });
  if (ids.length === 0) {
    trace.push({
      type: 'done', cur: null, cloned: [], mapPairs: [],
      message: 'Đồ thị rỗng → return <strong>null</strong>.',
      codeLine: 9,
    });
    return trace;
  }
  const seen = new Set<number>();
  const dfs = (u: number): void => {
    seen.add(u);
    cloned.push(u);
    pairs.push([u, u]);
    trace.push({
      type: 'create', cur: u, cloned: [...cloned], mapPairs: pairs.map((p) => [...p] as [number, number]),
      message: `Tạo clone <strong>C${u}</strong> cho node ${u}, cho vào map trước.`,
      codeLine: 5,
    });
    for (const v of adj.get(u)!) {
      if (!seen.has(v)) {
        dfs(v);
      } else {
        trace.push({
          type: 'edge', cur: u, cloned: [...cloned], mapPairs: pairs.map((p) => [...p] as [number, number]),
          message: `Neighbor <strong>${v}</strong> đã có clone → nối C${u} → <strong>C${v} có sẵn</strong> (không tạo mới, không treo vòng).`,
          codeLine: 7,
        });
      }
    }
  };
  dfs(ids[0]);
  trace.push({
    type: 'done', cur: null, cloned: [...cloned], mapPairs: pairs.map((p) => [...p] as [number, number]),
    message: `Hoàn tất. Clone đủ ${cloned.length} node, cạnh nối đúng bản sao → deep copy độc lập.`,
    codeLine: 9,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_CLONE = getSolutions('clone-graph-133');

export const CloneVisualizer = () => {
  const [str, setStr] = useState('0-1,0-3,1-2,2-3');
  const [ids, setIds] = useState<number[]>([0, 1, 2, 3]);
  const [edges, setEdges] = useState<[number, number][]>([[0, 1], [0, 3], [1, 2], [2, 3]]);
  const trace = useMemo(() => generateTrace(ids, edges), [ids, edges]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const [ni, ne] = parseEdges(v);
    if (ni.length === 0 || ni.length > 7) return;
    pb.restart();
    setIds(ni);
    setEdges(ne);
  };

  // map label gốc → vị trí 0..n-1 để vẽ
  const posOf = new Map(ids.map((id, i) => [id, i]));
  const mappedEdges = edges.map(([a, b]) => [posOf.get(a)!, posOf.get(b)!] as [number, number]);
  const states: Record<number, TreeNodeState> = {};
  step.cloned.forEach((id) => {
    states[posOf.get(id)!] = 'done';
  });
  if (step.cur !== null) states[posOf.get(step.cur)!] = 'cur';

  return (
    <div>
      <VizHeader
        backTo="/blog/clone-graph-133" backLabel="Bài giảng Clone Graph"
        badge="DFS + Map · O(V+E)" title="Clone Graph" accent="trực quan"
        sub="Tạo clone trước, cho vào map rồi mới đi sâu — gặp lại node cũ thì dùng clone có sẵn."
      />
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>GỐC ({step.cloned.length}/{ids.length} ĐÃ CLONE)</div>
          <GraphSvg n={ids.length} edges={mappedEdges} states={states} labels={ids} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            BẢN SAO + MAP
          </div>
          <GraphSvg n={ids.length} edges={mappedEdges} states={states} labels={ids.map((id) => `C${id}`)} />
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
            map: {step.mapPairs.length === 0 ? '∅' : step.mapPairs.map(([a]) => `${a}→C${a}`).join(', ')}
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="edges a-b (≤7 node):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="0-1,0-3,1-2,2-3" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Vòng 4 · square', value: '0-1,0-3,1-2,2-3' },
          { label: 'Tam giác · triangle', value: '0-1,1-2,2-0' },
          { label: 'Đường · line', value: '0-1,1-2,2-3' },
          { label: '1 node tự vòng', value: '0-0' },
        ]}
        onPick={(v) => {
          if (v === '0-0') {
            pb.restart();
            setIds([0]);
            setEdges([[0, 0]]);
            setStr(v);
            return;
          }
          setStr(v);
          build(v);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_CLONE}
          defaultLang="csharp"
          getHighlight={(lang) => [CLONE_LINE_MAP[lang][step.type]]}
          meta="O(V+E)"
        />
      </div>
    </div>
  );
};
