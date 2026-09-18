import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'level' | 'visit' | 'levelEnd' | 'done';
  queue: number[]; // array index trong queue
  level: number[];
  result: number[][];
  cur: number | null;
  message: string; codeLine: number;
}

const childrenOf = (arr: (number | null)[], i: number) => {
  const out: number[] = [];
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < arr.length && arr[l] !== null && arr[l] !== undefined) out.push(l);
  if (r < arr.length && arr[r] !== null && arr[r] !== undefined) out.push(r);
  return out;
};

const generateTrace = (arr: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  if (arr.length === 0 || arr[0] === null) {
    trace.push({
      type: 'done', queue: [], level: [], result: [], cur: null,
      message: 'Cây rỗng → return <strong>[]</strong>.',
      codeLine: 2,
    });
    return trace;
  }
  const queue: number[] = [0];
  const result: number[][] = [];
  const snapRes = () => result.map((l) => [...l]);
  trace.push({
    type: 'init', queue: [0], level: [], result: [], cur: null,
    message: 'Khởi tạo: <strong>queue = [root]</strong>. Mỗi tầng chốt levelSize rồi xử lý đúng bấy nhiêu node.',
    codeLine: 4,
  });
  let depth = 0;
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    trace.push({
      type: 'level', queue: [...queue], level: [], result: snapRes(), cur: null,
      message: `Tầng <strong>${depth}</strong>: levelSize = <strong>${size}</strong> — sẽ dequeue ${size} node.`,
      codeLine: 6,
    });
    for (let k = 0; k < size; k++) {
      const idx = queue.shift()!;
      level.push(arr[idx] as number);
      for (const c of childrenOf(arr, idx)) queue.push(c);
      trace.push({
        type: 'visit', queue: [...queue], level: [...level], result: snapRes(), cur: idx,
        message: `Dequeue <strong>${arr[idx]}</strong> → level = [${level.join(', ')}], enqueue con (nếu có). Queue còn ${queue.length}.`,
        codeLine: 9,
      });
    }
    result.push([...level]);
    trace.push({
      type: 'levelEnd', queue: [...queue], level: [...level], result: snapRes(), cur: null,
      message: `Xong tầng ${depth} → push <strong>[${level.join(', ')}]</strong> vào result.`,
      codeLine: 14,
    });
    depth++;
  }
  trace.push({
    type: 'done', queue: [], level: [], result: snapRes(), cur: null,
    message: `Queue rỗng → xong. Result có <strong>${result.length}</strong> tầng.`,
    codeLine: 16,
  });
  return trace;
};

const CSHARP_LINES = [
  'public IList<IList<int>> LevelOrder(TreeNode root) {',
  '    var res = new List<IList<int>>();',
  '    if (root == null) return res;',
  '    var q = new Queue<TreeNode>();',
  '    q.Enqueue(root);',
  '    while (q.Count > 0) {',
  '        int size = q.Count;',
  '        var level = new List<int>();',
  '        for (int i = 0; i < size; i++) {',
  '            var node = q.Dequeue();',
  '            level.Add(node.val);',
  '            if (node.left != null) q.Enqueue(node.left);',
  '            if (node.right != null) q.Enqueue(node.right);',
  '        }',
  '        res.Add(level);',
  '    }',
  '    return res;',
  '}',
];

export const LevelOrderVisualizer = () => {
  const [str, setStr] = useState('3,9,20,null,null,15,7');
  const [arr, setArr] = useState<(number | null)[]>([3, 9, 20, null, null, 15, 7]);
  const trace = useMemo(() => generateTrace(arr), [arr]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setArr(parseTreeList(v));
  };

  const inQueue = new Set(step.queue);
  const states: Record<number, TreeNodeState> = {};
  arr.forEach((v, i) => {
    if (v === null) return;
    if (step.cur === i) states[i] = 'cur';
    else if (inQueue.has(i)) states[i] = 'seen';
    else if (step.level.includes(v as number) && step.type !== 'done') {
      // node trong level hiện tại (so giá trị — trùng giá trị có thể sáng thừa, chấp nhận)
      states[i] = 'add';
    }
  });

  return (
    <div>
      <VizHeader
        backTo="/blog/level-order-102" backLabel="Bài giảng Level Order"
        badge="BFS · Queue" title="Level Order" accent="trực quan"
        sub="Chốt levelSize đầu mỗi tầng, dequeue đúng ngần ấy node. Amber nhạt = trong queue, amber đặc = đang xử lý."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY · QUEUE {step.queue.length}</div>
          <TreeSvg values={arr} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>QUEUE (FIFO)</div>
            {step.queue.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>queue rỗng</p>
            ) : (
              <div className="demo" style={{ padding: 10, flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {step.queue.map((qi, k) => (
                  <span
                    key={`${qi}-${k}`}
                    className="mono"
                    style={{
                      fontSize: 13, fontWeight: k === 0 ? 700 : 400,
                      padding: '4px 10px', borderRadius: 8,
                      border: `1px solid ${k === 0 ? 'var(--accent)' : 'var(--border)'}`,
                      background: k === 0 ? 'var(--accent)' : 'rgba(255,181,71,.08)',
                      color: k === 0 ? 'var(--bg)' : 'var(--accent)',
                    }}
                  >
                    {arr[qi]}
                  </span>
                ))}
              </div>
            )}
            <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', margin: '8px 0 0' }}>← front (dequeue) · enqueue →</p>
          </div>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>CURRENT LEVEL</div>
            <p className="mono" style={{ fontSize: 14, margin: 0, color: 'var(--teal)' }}>
              [{step.level.join(', ') || '—'}]
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT ({step.result.length} TẦNG)
            </div>
            {step.result.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>[ ]</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {step.result.map((lv, i) => (
                  <p key={i} className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
                    [{i}] [{lv.join(', ')}]
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="tree (level-order):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="3,9,20,null,null,15,7" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3 tầng', value: '3,9,20,null,null,15,7' },
          { label: 'Hoàn hảo · 7 node', value: '1,2,3,4,5,6,7' },
          { label: 'Lệch · [1,null,2,null,3]', value: '1,null,2,null,3' },
          { label: 'Rỗng', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(n)" />
    </div>
  );
};
