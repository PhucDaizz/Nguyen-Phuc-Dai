import type { TreeNodeState } from './shared';

export interface TrieObj {
  ch: string; // ký tự cạnh từ cha (root = '')
  end: boolean;
  word: string | null; // từ kết thúc tại đây (cho 212)
  kids: Record<string, TrieObj>;
}

export const newTrie = (): TrieObj => ({ ch: '', end: false, word: null, kids: {} });

// Vẽ Trie theo tầng BFS. states key theo path (vd "app", root = "").
export const TrieSvg = ({ root, states }: {
  root: TrieObj; states?: Record<string, TreeNodeState>;
}) => {
  const W = 720;
  const LH = 84;
  const R = 20;
  const TOP = 44;

  interface Item {
    node: TrieObj;
    path: string;
    depth: number;
    parentPath: string | null;
  }
  const levels = new Map<number, Item[]>();
  const edges: [string, string][] = [];
  const q: Item[] = [{ node: root, path: '', depth: 0, parentPath: null }];
  while (q.length > 0) {
    const it = q.shift()!;
    if (!levels.has(it.depth)) levels.set(it.depth, []);
    levels.get(it.depth)!.push(it);
    if (it.parentPath !== null) edges.push([it.parentPath, it.path]);
    Object.keys(it.node.kids)
      .sort()
      .forEach((c) => {
        q.push({ node: it.node.kids[c], path: it.path + c, depth: it.depth + 1, parentPath: it.path });
      });
  }
  const maxD = levels.size === 0 ? 0 : Math.max(...levels.keys());
  const H = TOP * 2 + maxD * LH;

  const pos = new Map<string, { x: number; y: number }>();
  levels.forEach((items, d) => {
    items.forEach((it, k) => {
      pos.set(it.path, { x: (W * (k + 1)) / (items.length + 1), y: TOP + d * LH });
    });
  });

  const styleFor = (st?: TreeNodeState) => {
    switch (st) {
      case 'cur':
        return { fill: '#ffb547', stroke: '#ffb547', color: '#0a0e1a', glow: 'drop-shadow(0 0 14px rgba(255,181,71,.7))' };
      case 'add':
        return { fill: 'rgba(45,212,191,.3)', stroke: '#2dd4bf', color: '#2dd4bf', glow: 'drop-shadow(0 0 12px rgba(45,212,191,.6))' };
      case 'seen':
        return { fill: 'rgba(255,181,71,.14)', stroke: '#ffb547', color: '#f0e9d8', glow: undefined };
      case 'done':
        return { fill: 'rgba(45,212,191,.1)', stroke: 'rgba(45,212,191,.55)', color: 'rgba(45,212,191,.9)', glow: undefined };
      case 'bad':
        return { fill: 'rgba(255,95,87,.15)', stroke: '#ff5f57', color: '#ff5f57', glow: 'drop-shadow(0 0 10px rgba(255,95,87,.5))' };
      default:
        return { fill: '#161d33', stroke: 'rgba(255,255,255,.2)', color: '#f0e9d8', glow: undefined };
    }
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {edges.map(([a, b]) => {
        const pa = pos.get(a);
        const pb = pos.get(b);
        if (!pa || !pb) return null;
        return (
          <line
            key={`${a}>${b}`}
            x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke="rgba(255,255,255,.18)" strokeWidth={2}
          />
        );
      })}
      {[...pos.entries()].map(([path, p]) => {
        // tìm node theo path
        let node: TrieObj = root;
        for (const c of path) node = node.kids[c];
        const st = styleFor(states?.[path]);
        return (
          <g key={path || 'root'}>
            <circle
              cx={p.x} cy={p.y} r={R}
              fill={st.fill} stroke={st.stroke} strokeWidth={node.end ? 3 : 2}
              style={{ transition: 'all .3s', ...(st.glow ? { filter: st.glow } : {}) }}
            />
            <text
              x={p.x} y={p.y}
              textAnchor="middle" dominantBaseline="central"
              fill={st.color}
              fontFamily="'JetBrains Mono', monospace" fontSize={14} fontWeight={700}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {path === '' ? '★' : node.ch}
            </text>
            {node.end && (
              <circle cx={p.x + 13} cy={p.y - 13} r={5} fill="#2dd4bf" opacity={0.9} />
            )}
          </g>
        );
      })}
    </svg>
  );
};
