import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, Chain,
} from './shared';

interface Step {
  type: 'init' | 'push' | 'pop' | 'done';
  heap: { list: number; val: number; idx: number }[]; // head của từng list còn lại
  result: number[];
  lastTaken: { list: number; val: number } | null;
  message: string; codeLine: number;
}

// Input: "1,4,5;1,3,4;2,6"
const parseLists = (str: string): number[][] =>
  str
    .split(';')
    .map((part) =>
      part
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map(Number)
        .filter((n) => !Number.isNaN(n)),
    )
    .filter((l) => l.length > 0);

const generateTrace = (lists: number[][]): Step[] => {
  const trace: Step[] = [];
  // heap: mảng các {list, idx} trỏ head hiện tại
  let heap = lists.map((l, li) => ({ list: li, val: l[0], idx: 0 }));
  const snapHeap = () => heap.map((h) => ({ ...h }));
  const res: number[] = [];
  trace.push({
    type: 'init', heap: snapHeap(), result: [], lastTaken: null,
    message: `Push head của ${lists.length} list vào min-heap: [${heap.map((h) => h.val).join(', ') || '∅'}].`,
    codeLine: 3,
  });
  while (heap.length > 0) {
    heap.sort((x, y) => x.val - y.val);
    const top = heap.shift()!;
    res.push(top.val);
    const nextIdx = top.idx + 1;
    const hasNext = nextIdx < lists[top.list].length;
    if (hasNext) {
      heap.push({ list: top.list, val: lists[top.list][nextIdx], idx: nextIdx });
    }
    trace.push({
      type: 'pop', heap: snapHeap(), result: [...res],
      lastTaken: { list: top.list, val: top.val },
      message: `Pop min <strong>${top.val}</strong> (list ${top.list + 1}) → nối vào result${hasNext ? `, push tiếp <strong>${lists[top.list][nextIdx]}</strong>.` : ', list này hết.'}`,
      codeLine: 8,
    });
  }
  trace.push({
    type: 'done', heap: [], result: [...res], lastTaken: null,
    message: `Heap rỗng → xong. Result = <strong>[${res.join(', ') || '∅'}]</strong>.`,
    codeLine: 13,
  });
  return trace;
};

const CSHARP_LINES = [
  'public ListNode MergeKLists(ListNode[] lists) {',
  '    var heap = new PriorityQueue<ListNode, int>();',
  '    foreach (var node in lists)',
  '        if (node != null) heap.Enqueue(node, node.val);',
  '    var dummy = new ListNode();',
  '    var cur = dummy;',
  '    while (heap.Count > 0) {',
  '        var node = heap.Dequeue();',
  '        cur.next = node;',
  '        cur = cur.next;',
  '        if (node.next != null) heap.Enqueue(node.next, node.next.val);',
  '    }',
  '    return dummy.next;',
  '}',
];

export const MergeKVisualizer = () => {
  const [str, setStr] = useState('1,4,5;1,3,4;2,6');
  const [lists, setLists] = useState<number[][]>([[1, 4, 5], [1, 3, 4], [2, 6]]);
  const trace = useMemo(() => generateTrace(lists), [lists]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const ls = parseLists(v);
    if (ls.length === 0 || ls.length > 4 || ls.flat().length > 12) return;
    pb.restart();
    setLists(ls);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/merge-k-lists-23" backLabel="Bài giảng Merge K Lists"
        badge="Min-Heap · O(N log k)" title="Merge K Lists" accent="trực quan"
        sub="Heap luôn giữ head nhỏ nhất của mỗi list: pop min → nối → push next. Mỗi node vào/ra heap đúng 1 lần."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>CÁC LIST ĐẦU VÀO</div>
        {lists.map((l, li) => (
          <div key={li} style={{ marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>list {li + 1}: </span>
            <Chain values={l} />
          </div>
        ))}
        <div className="card-title" style={{ marginTop: 12 }}><span className="dot"></span>MIN-HEAP ({step.heap.length})</div>
        {step.heap.length === 0 ? (
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>heap rỗng</p>
        ) : (
          <div className="demo" style={{ padding: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {[...step.heap].sort((x, y) => x.val - y.val).map((h, i) => (
              <span
                key={`${h.list}-${h.idx}`}
                className="mono"
                style={{
                  fontSize: 13,
                  fontWeight: i === 0 ? 700 : 400,
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  background: i === 0 ? 'rgba(255,181,71,.12)' : 'transparent',
                  color: i === 0 ? 'var(--accent)' : 'var(--fg)',
                }}
              >
                {h.val}<span style={{ fontSize: 10, color: 'var(--muted)' }}> (L{h.list + 1})</span>
              </span>
            ))}
          </div>
        )}
        <div className="card-title" style={{ marginTop: 12 }}>
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT ({step.result.length})
        </div>
        <Chain values={step.result} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="lists (cách nhau dấu ; — tối đa 4 list, 12 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,4,5;1,3,4;2,6" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3 lists', value: '1,4,5;1,3,4;2,6' },
          { label: 'Rỗng · []', value: '' },
          { label: '1 list · [1,2,3]', value: '1,2,3' },
          { label: 'Xen kẽ · 1,5;2,6;3,4', value: '1,5;2,6;3,4' },
        ]}
        onPick={(v) => {
          // preset rỗng: ép về [] thủ công
          if (v === '') {
            pb.restart();
            setLists([]);
            setStr('');
            return;
          }
          setStr(v);
          build(v);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(N log k) · O(k)" />
    </div>
  );
};
