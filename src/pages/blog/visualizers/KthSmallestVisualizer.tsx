import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'visit' | 'found' | 'done';
  idx: number | null; // array index node đang thăm (inorder)
  count: number;
  answer: number | null;
  visited: number[]; // index đã thăm theo inorder
  message: string; codeLine: number;
}

interface TNode {
  val: number;
  idx: number;
  left: TNode | null;
  right: TNode | null;
}

const toObj = (arr: (number | null)[]): TNode | null => {
  if (arr.length === 0 || arr[0] === null) return null;
  const nodes = arr.map((v, i) => (v === null ? null : { val: v, idx: i, left: null, right: null } as TNode));
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length) nodes[i]!.left = nodes[l];
    if (r < nodes.length) nodes[i]!.right = nodes[r];
  }
  return nodes[0];
};

const generateTrace = (arr: (number | null)[], k: number): Step[] => {
  const trace: Step[] = [];
  const root = toObj(arr);
  trace.push({
    type: 'init', idx: null, count: 0, answer: null, visited: [],
    message: `Inorder BST ra dãy tăng. Đếm tới <strong>K = ${k}</strong> thì dừng, khỏi duyệt hết.`,
    codeLine: 2,
  });
  if (!root) {
    trace.push({
      type: 'done', idx: null, count: 0, answer: null, visited: [],
      message: 'Cây rỗng.',
      codeLine: 9,
    });
    return trace;
  }
  let count = 0;
  let answer: number | null = null;
  const visited: number[] = [];
  const snap = () => [...visited];
  let stopped = false;

  const inorder = (node: TNode | null): void => {
    if (!node || stopped) return;
    inorder(node.left);
    if (stopped) return;
    count++;
    visited.push(node.idx);
    if (count === k) {
      answer = node.val;
      stopped = true;
      trace.push({
        type: 'found', idx: node.idx, count, answer, visited: snap(),
        message: `Thăm <strong>${node.val}</strong>: count = <strong>${count} = K</strong> → đáp án, dừng luôn.`,
        codeLine: 7,
      });
      return;
    }
    trace.push({
      type: 'visit', idx: node.idx, count, answer: null, visited: snap(),
      message: `Thăm <strong>${node.val}</strong>: count = <strong>${count}</strong> (chưa = ${k}).`,
      codeLine: 6,
    });
    inorder(node.right);
  };
  inorder(root);

  trace.push({
    type: 'done', idx: null, count, answer, visited: snap(),
    message: answer !== null
      ? `Hoàn tất. Số nhỏ thứ ${k} = <strong>${answer}</strong> (đã dừng sớm, không duyệt hết cây).`
      : `Hoàn tất. Cây chỉ có ${count} node (< K = ${k}) → không có đáp án.`,
    codeLine: 9,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int KthSmallest(TreeNode root, int k) {',
  '    int count = 0, answer = -1;',
  '    void Inorder(TreeNode node) {',
  '        if (node == null || answer != -1) return;',
  '        Inorder(node.left);',
  '        if (++count == k) { answer = node.val; return; }',
  '        Inorder(node.right);',
  '    }',
  '    Inorder(root);',
  '    return answer;',
  '}',
];

export const KthSmallestVisualizer = () => {
  const [str, setStr] = useState('3,1,4,null,2');
  const [kStr, setKStr] = useState('1');
  const [arr, setArr] = useState<(number | null)[]>([3, 1, 4, null, 2]);
  const [k, setK] = useState(1);
  const trace = useMemo(() => generateTrace(arr, k), [arr, k]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, w: string) => {
    const nk = Number(w);
    if (Number.isNaN(nk) || nk < 1) return;
    pb.restart();
    setArr(parseTreeList(v));
    setK(nk);
  };

  const states: Record<number, TreeNodeState> = {};
  step.visited.forEach((i) => {
    states[i] = 'done';
  });
  if (step.idx !== null) states[step.idx] = step.type === 'found' ? 'add' : 'cur';

  return (
    <div>
      <VizHeader
        backTo="/blog/kth-smallest-230" backLabel="Bài giảng Kth Smallest"
        badge="Inorder BST · O(h+k)" title="Kth Smallest" accent="trực quan"
        sub="Inorder BST ra dãy tăng dần — đếm tới K là đáp án, dừng sớm khỏi duyệt hết cây."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>BST · COUNT = {step.count}/{k}</div>
          <TreeSvg values={arr} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>DÃY INORDER TỚI HIỆN TẠI</div>
            <p className="mono" style={{ fontSize: 14, margin: 0, color: 'var(--teal)' }}>
              [{step.visited.map((i) => arr[i]).join(', ') || '—'}]
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              tăng dần — phần tử thứ K là đáp án
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              ANSWER
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.answer === null ? '?' : step.answer}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="bst (level-order):" value={str} onChange={setStr} onEnter={() => build(str, kStr)} placeholder="3,1,4,null,2" maxWidth={220} />
        <InputField label="k:" value={kStr} onChange={setKStr} onEnter={() => build(str, kStr)} placeholder="1" maxWidth={70} />
        <button className="btn" onClick={() => build(str, kStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · k=1', value: '3,1,4,null,2|1' },
          { label: 'k=3 · [5,3,6,2,4] → 4', value: '5,3,6,2,4,null,null,1|3' },
          { label: 'k quá lớn', value: '3,1,4,null,2|9' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setStr(a);
          setKStr(b);
          build(a, b);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(h+k)" />
    </div>
  );
};
