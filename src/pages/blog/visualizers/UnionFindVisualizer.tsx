import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GraphSvg, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'union' | 'cycle' | 'done';
  roots: number[]; // root của từng node
  cur: [number, number] | null; // cạnh đang xét
  ok: boolean | null;
  message: string; codeLine: number;
}

const parseEdges = (str: string, n: number): [number, number][] => {
  const out: [number, number][] = [];
  str.split(',').map((s) => s.trim()).filter(Boolean).forEach((p) => {
    const [a, b] = p.split('-').map((x) => Number(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b) && a >= 0 && a < n && b >= 0 && b < n) out.push([a, b]);
  });
  return out;
};

interface Cfg {
  mode: 'tree' | 'count';
  slug: string;
  backLabel: string;
  badge: string;
  title: string;
  sub: string;
  presets: { label: string; value: string }[];
  intro: string;
}

const generateTrace = (n: number, edges: [number, number][], mode: 'tree' | 'count'): Step[] => {
  const trace: Step[] = [];
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const snap = () => parent.map((_, i) => find(i));

  if (mode === 'tree') {
    trace.push({
      type: 'init', roots: snap(), cur: null, ok: null,
      message: `Cây ⟺ <strong>cạnh = n−1 (${edges.length} vs ${n - 1})</strong> VÀ liên thông. Union từng cạnh, gặp 2 đầu cùng root là có vòng.`,
      codeLine: 1,
    });
    if (edges.length !== n - 1) {
      trace.push({
        type: 'done', roots: snap(), cur: null, ok: false,
        message: `Cạnh ${edges.length} ≠ n−1 (${n - 1}) → chắc chắn không phải cây → <strong>false</strong>, khỏi union.`,
        codeLine: 1,
      });
      return trace;
    }
  } else {
    trace.push({
      type: 'init', roots: snap(), cur: null, ok: null,
      message: `Union hết ${edges.length} cạnh rồi <strong>đếm root khác nhau</strong>. Node lẻ tự là 1 cụm.`,
      codeLine: 1,
    });
  }

  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) {
      trace.push({
        type: 'cycle', roots: snap(), cur: [a, b], ok: mode === 'tree' ? false : null,
        message: mode === 'tree'
          ? `Cạnh ${a}−${b}: cùng root ${ra} → <strong>có vòng</strong> → false.`
          : `Cạnh ${a}−${b}: cùng root ${ra} → đã chung cụm, bỏ qua.`,
        codeLine: mode === 'tree' ? 10 : 8,
      });
      if (mode === 'tree') {
        trace.push({
          type: 'done', roots: snap(), cur: [a, b], ok: false,
          message: 'Hoàn tất → <strong>false</strong>.',
          codeLine: 10,
        });
        return trace;
      }
      continue;
    }
    parent[ra] = rb;
    trace.push({
      type: 'union', roots: snap(), cur: [a, b], ok: null,
      message: `Cạnh ${a}−${b}: root ${ra} ≠ ${rb} → gộp (root ${ra} → ${rb}).`,
      codeLine: mode === 'tree' ? 11 : 8,
    });
  }

  if (mode === 'tree') {
    trace.push({
      type: 'done', roots: snap(), cur: null, ok: true,
      message: `Đủ ${edges.length} = n−1 cạnh, không vòng → liên thông → <strong>true</strong>.`,
      codeLine: 12,
    });
  } else {
    const groups = new Set(snap()).size;
    trace.push({
      type: 'done', roots: snap(), cur: null, ok: null,
      message: `Hoàn tất. Số root khác nhau = <strong>${groups}</strong> cụm: ${[...new Set(snap())].join(', ')}.`,
      codeLine: 10,
    });
  }
  return trace;
};

const CSHARP_TREE = [
  'public bool ValidTree(int n, int[][] edges) {',
  '    if (edges.Length != n - 1) return false;',
  '    var parent = Enumerable.Range(0, n).ToArray();',
  '    int Find(int x) => parent[x] == x ? x : (parent[x] = Find(parent[x]));',
  '    foreach (var (a, b) in edges.Select(e => (e[0], e[1]))) {',
  '        if (Find(a) == Find(b)) return false;',
  '        parent[Find(a)] = Find(b);',
  '    }',
  '    return true;',
  '}',
];

const CSHARP_COUNT = [
  'public int CountComponents(int n, int[][] edges) {',
  '    var parent = Enumerable.Range(0, n).ToArray();',
  '    int Find(int x) => parent[x] == x ? x : (parent[x] = Find(parent[x]));',
  '    foreach (var (a, b) in edges.Select(e => (e[0], e[1])))',
  '        parent[Find(a)] = Find(b);',
  '    return new HashSet<int>(Enumerable.Range(0, n).Select(Find)).Count;',
  '}',
];

const UnionFindViz = ({ cfg }: { cfg: Cfg }) => {
  const [nStr, setNStr] = useState(cfg.presets[0].value.split('|')[0]);
  const [eStr, setEStr] = useState(cfg.presets[0].value.split('|')[1] ?? '');
  const [n, setN] = useState(Number(cfg.presets[0].value.split('|')[0]));
  const [edges, setEdges] = useState<[number, number][]>(
    parseEdges(cfg.presets[0].value.split('|')[1] ?? '', Number(cfg.presets[0].value.split('|')[0])),
  );
  const trace = useMemo(() => generateTrace(n, edges, cfg.mode), [n, edges, cfg.mode]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const nn = Number(a);
    if (Number.isNaN(nn) || nn < 1 || nn > 7) return;
    pb.restart();
    setN(nn);
    setEdges(parseEdges(b, nn));
  };

  const states: Record<number, TreeNodeState> = {};
  if (step.cur) {
    states[step.cur[0]] = step.type === 'cycle' && cfg.mode === 'tree' ? 'bad' : 'cur';
    states[step.cur[1]] = step.type === 'cycle' && cfg.mode === 'tree' ? 'bad' : 'cur';
  }

  // nhóm theo root để hiển thị cụm
  const groups = new Map<number, number[]>();
  step.roots.forEach((r, i) => {
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(i);
  });

  return (
    <div>
      <VizHeader
        backTo={`/blog/${cfg.slug}`} backLabel={cfg.backLabel}
        badge={cfg.badge} title={cfg.title} accent="trực quan"
        sub={cfg.sub}
      />
      <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{cfg.intro}</p>
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>ĐỒ THỊ · CẠNH ĐANG XÉT {step.cur ? `${step.cur[0]}−${step.cur[1]}` : '—'}</div>
          <GraphSvg n={n} edges={edges} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>ROOT MỖI NODE</div>
            <p className="mono" style={{ fontSize: 12, margin: 0, color: 'var(--muted)', lineHeight: 2 }}>
              {step.roots.map((r, i) => `${i}→${r}`).join('  ')}
            </p>
            <div className="card-title" style={{ marginTop: 10 }}><span className="dot"></span>CÁC CỤM ({groups.size})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...groups.entries()].map(([r, members]) => (
                <p key={r} className="mono" style={{ fontSize: 12.5, margin: 0, color: 'var(--teal)' }}>
                  root {r}: [{members.join(', ')}]
                </p>
              ))}
            </div>
          </div>
          {cfg.mode === 'tree' && (
            <div className="card teal" style={{ margin: 0 }}>
              <div className="card-title">
                <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
                RESULT
              </div>
              <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.ok === false ? '#ff5f57' : step.ok === true ? 'var(--teal)' : 'var(--accent)', margin: 0 }}>
                {step.ok === null ? '?' : step.ok ? 'true' : 'false'}
              </p>
            </div>
          )}
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="n (≤7):" value={nStr} onChange={setNStr} onEnter={() => build(nStr, eStr)} placeholder="5" maxWidth={70} />
        <InputField label="edges a-b:" value={eStr} onChange={setEStr} onEnter={() => build(nStr, eStr)} placeholder="0-1,0-2,0-3,1-4" maxWidth={280} />
        <button className="btn" onClick={() => build(nStr, eStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={cfg.presets}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setNStr(a);
          setEStr(b ?? '');
          build(a, b ?? '');
        }}
      />
      <CodePanel lines={cfg.mode === 'tree' ? CSHARP_TREE : CSHARP_COUNT} active={step.codeLine} stats="O(V+E)" />
    </div>
  );
};

export const ValidTreeVisualizer = () => (
  <UnionFindViz
    cfg={{
      mode: 'tree',
      slug: 'valid-tree-261',
      backLabel: 'Bài giảng Valid Tree',
      badge: 'Union Find · Premium',
      title: 'Valid Tree',
      sub: 'Cạnh = n−1 và không vòng. Cạnh nối 2 node cùng root (đỏ) là có vòng → false ngay.',
      presets: [
        { label: 'Cây · true', value: '5|0-1,0-2,0-3,1-4' },
        { label: 'Có vòng · false', value: '5|0-1,1-2,2-3,1-3,1-4' },
        { label: 'Thiếu cạnh · false', value: '4|0-1,2-3' },
      ],
      intro: 'Premium: đọc đề gốc cần LeetCode Premium, logic union-find ở đây đầy đủ.',
    }}
  />
);

export const ComponentsVisualizer = () => (
  <UnionFindViz
    cfg={{
      mode: 'count',
      slug: 'connected-components-323',
      backLabel: 'Bài giảng Connected Components',
      badge: 'Union Find · Premium',
      title: 'Connected Count',
      sub: 'Union hết cạnh rồi đếm root khác nhau. Cạnh thừa (cùng root) thì bỏ qua.',
      presets: [
        { label: '2 cụm', value: '5|0-1,1-2,3-4' },
        { label: 'Rời hết · 4 cụm', value: '4|' },
        { label: '1 cụm', value: '4|0-1,1-2,2-3' },
      ],
      intro: 'Premium: đọc đề gốc cần LeetCode Premium, logic union-find ở đây đầy đủ.',
    }}
  />
);
