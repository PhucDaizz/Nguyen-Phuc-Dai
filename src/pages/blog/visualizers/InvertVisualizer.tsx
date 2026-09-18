import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'swap' | 'done';
  idx: number | null; // node đang swap
  arr: (number | null)[]; // cây tại step này
  message: string; codeLine: number;
}

interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
}

const toObj = (arr: (number | null)[]): TNode | null => {
  if (arr.length === 0 || arr[0] === null) return null;
  const nodes = arr.map((v) => (v === null ? null : { val: v, left: null, right: null } as TNode));
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length) nodes[i]!.left = nodes[l];
    if (r < nodes.length) nodes[i]!.right = nodes[r];
  }
  return nodes[0];
};

const toArr = (root: TNode | null): (number | null)[] => {
  if (!root) return [];
  const out: (number | null)[] = [];
  const q: (TNode | null)[] = [root];
  while (q.length > 0) {
    const n = q.shift()!;
    if (!n) {
      out.push(null);
      continue;
    }
    out.push(n.val);
    q.push(n.left, n.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
};

// BFS order các node tồn tại (theo object, map về array index ban đầu)
const bfsOrder = (root: TNode | null): TNode[] => {
  if (!root) return [];
  const order: TNode[] = [];
  const q: TNode[] = [root];
  while (q.length > 0) {
    const node = q.shift()!;
    order.push(node);
    if (node.left) q.push(node.left);
    if (node.right) q.push(node.right);
  }
  return order;
};

// slot hiện tại của 1 object trong cây (để highlight đúng dù cây khuyết)
const locate = (root: TNode | null, target: TNode): number | null => {
  if (!root) return null;
  const q: { n: TNode; i: number }[] = [{ n: root, i: 0 }];
  while (q.length > 0) {
    const { n, i } = q.shift()!;
    if (n === target) return i;
    if (n.left) q.push({ n: n.left, i: 2 * i + 1 });
    if (n.right) q.push({ n: n.right, i: 2 * i + 2 });
  }
  return null;
};

const generateTrace = (init: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  const root = toObj(init);
  trace.push({
    type: 'init', idx: null,
    arr: [...init],
    message: 'Gương cây = swap trái/phải <strong>mọi node</strong>, duyệt BFS từ root.',
    codeLine: 1,
  });
  if (!root) {
    trace.push({
      type: 'done', idx: null, arr: [],
      message: 'Cây rỗng → return <strong>null</strong>.',
      codeLine: 1,
    });
    return trace;
  }
  // Duyệt object-BFS, node nào cũng swap đúng 1 lần (cha trước con) → đúng cả cây khuyết
  const visited = new Set<TNode>();
  for (;;) {
    const node = bfsOrder(root).find((n) => !visited.has(n)) ?? null;
    if (!node) break;
    visited.add(node);
    const lv = node.left ? node.left.val : '∅';
    const rv = node.right ? node.right.val : '∅';
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    const arr = toArr(root);
    trace.push({
      type: 'swap', idx: locate(root, node),
      arr,
      message: `Swap ở node <strong>${node.val}</strong>: trái (${lv}) ↔ phải (${rv}).`,
      codeLine: 2,
    });
  }
  const final = toArr(root);
  trace.push({
    type: 'done', idx: null,
    arr: final,
    message: `Hoàn tất. Cây đã lật gương: <strong>[${final.map((v) => (v === null ? 'null' : v)).join(', ')}]</strong>.`,
    codeLine: 5,
  });
  return trace;
};

const CSHARP_LINES = [
  'public TreeNode InvertTree(TreeNode root) {',
  '    if (root == null) return null;',
  '    (root.left, root.right) = (root.right, root.left);',
  '    InvertTree(root.left);',
  '    InvertTree(root.right);',
  '    return root;',
  '}',
];

export const InvertVisualizer = () => {
  const [str, setStr] = useState('4,2,7,1,3,6,9');
  const [arr, setArr] = useState<(number | null)[]>([4, 2, 7, 1, 3, 6, 9]);
  const trace = useMemo(() => generateTrace(arr), [arr]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setArr(parseTreeList(v));
  };

  // Node được swap nằm yên tại slot của nó (chỉ đổi 2 con) → highlight đúng slot
  // trong cây HIỆN TẠI, không sợ trùng giá trị.
  const states: Record<number, TreeNodeState> = {};
  if (step.idx !== null && step.idx < step.arr.length && step.arr[step.idx] !== null) {
    states[step.idx] = 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/invert-tree-226" backLabel="Bài giảng Invert Tree"
        badge="DFS · Mirror" title="Invert Tree" accent="trực quan"
        sub="Swap trái/phải từng node theo BFS — cây lật gương dần. Node amber là đang swap."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>CÂY ĐANG LẬT</div>
        <TreeSvg values={step.arr} states={states} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="tree (level-order):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="4,2,7,1,3,6,9" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · [4,2,7,1,3,6,9]', value: '4,2,7,1,3,6,9' },
          { label: 'Nhỏ · [2,1,3]', value: '2,1,3' },
          { label: 'Lệch · [1,null,2]', value: '1,null,2' },
          { label: '1 node', value: '1' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(h)" />
    </div>
  );
};
