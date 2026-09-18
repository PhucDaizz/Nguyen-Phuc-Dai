import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, Chain, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'take' | 'drain' | 'done';
  i: number; // con trỏ l1 (index trong a)
  j: number; // con trỏ l2 (index trong b)
  result: number[];
  lastFrom: 'a' | 'b' | null;
  message: string; codeLine: number;
}

const generateTrace = (a: number[], b: number[]): Step[] => {
  const trace: Step[] = [];
  const res: number[] = [];
  let i = 0;
  let j = 0;
  trace.push({
    type: 'init', i, j, result: [], lastFrom: null,
    message: `Dummy head + 2 con trỏ. Nhỏ hơn thì nối. a=[${a.join(', ') || '∅'}], b=[${b.join(', ') || '∅'}].`,
    codeLine: 1,
  });
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      res.push(a[i]);
      trace.push({
        type: 'take', i, j, result: [...res], lastFrom: 'a',
        message: `<strong>${a[i]} ≤ ${b[j]}</strong> → nối a[${i}]=${a[i]}. i++.`,
        codeLine: 5,
      });
      i++;
    } else {
      res.push(b[j]);
      trace.push({
        type: 'take', i, j, result: [...res], lastFrom: 'b',
        message: `<strong>${b[j]} < ${a[i]}</strong> → nối b[${j}]=${b[j]}. j++.`,
        codeLine: 8,
      });
      j++;
    }
  }
  const rest = i < a.length ? a.slice(i) : b.slice(j);
  if (rest.length > 0) {
    res.push(...rest);
    trace.push({
      type: 'drain', i, j, result: [...res], lastFrom: i < a.length ? 'a' : 'b',
      message: `Một list hết → nối nốt phần còn lại: [${rest.join(', ')}].`,
      codeLine: 12,
    });
  }
  trace.push({
    type: 'done', i, j, result: [...res], lastFrom: null,
    message: `Hoàn tất. Result = <strong>[${res.join(', ') || '∅'}]</strong>.`,
    codeLine: 13,
  });
  return trace;
};

const CSHARP_LINES = [
  'public ListNode MergeTwoLists(ListNode l1, ListNode l2) {',
  '    var dummy = new ListNode();',
  '    var cur = dummy;',
  '    while (l1 != null && l2 != null) {',
  '        if (l1.val <= l2.val) {',
  '            cur.next = l1;',
  '            l1 = l1.next;',
  '        } else {',
  '            cur.next = l2;',
  '            l2 = l2.next;',
  '        }',
  '        cur = cur.next;',
  '    }',
  '    cur.next = l1 ?? l2;',
  '    return dummy.next;',
  '}',
];

const isSorted = (a: number[]) => a.every((v, i) => i === 0 || a[i - 1] <= v);

export const MergeTwoVisualizer = () => {
  const [aStr, setAStr] = useState('1,2,4');
  const [bStr, setBStr] = useState('1,3,4');
  const [a, setA] = useState<number[]>([1, 2, 4]);
  const [b, setB] = useState<number[]>([1, 3, 4]);
  const trace = useMemo(() => generateTrace(a, b), [a, b]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const sorted = isSorted(a) && isSorted(b);

  const build = (va: string, vb: string) => {
    const na = parseNumList(va);
    const nb = parseNumList(vb);
    if (na.length > 7 || nb.length > 7) return;
    pb.restart();
    setA(na);
    setB(nb);
  };

  const tagsA: Record<number, string[]> = {};
  if (step.i < a.length) tagsA[step.i] = ['l1'];
  const tagsB: Record<number, string[]> = {};
  if (step.j < b.length) tagsB[step.j] = ['l2'];

  return (
    <div>
      <VizHeader
        backTo="/blog/merge-two-lists-21" backLabel="Bài giảng Merge Two Lists"
        badge="Two Pointers · Linked List" title="Merge Two Lists" accent="trực quan"
        sub="Nhỏ hơn thì nối, hết một list thì nối nốt list còn lại. Nhãn l1/l2 là 2 con trỏ."
      />
      {!sorted && (
        <div className="rule" style={{ borderColor: 'rgba(255,95,87,.4)' }}>
          <p style={{ margin: 0 }}>List đầu vào chưa sort — thuật toán vẫn chạy nhưng kết quả không đảm bảo đúng.</p>
        </div>
      )}
      <div className="card">
        <div className="card-title"><span className="dot"></span>LIST 1</div>
        <Chain values={a} tags={tagsA} />
        <div className="card-title" style={{ marginTop: 12 }}><span className="dot"></span>LIST 2</div>
        <Chain values={b} tags={tagsB} />
        <div className="card-title" style={{ marginTop: 12 }}>
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT ({step.result.length})
        </div>
        <Chain values={step.result} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="l1 (đã sort):" value={aStr} onChange={setAStr} onEnter={() => build(aStr, bStr)} placeholder="1,2,4" maxWidth={160} />
        <InputField label="l2 (đã sort):" value={bStr} onChange={setBStr} onEnter={() => build(aStr, bStr)} placeholder="1,3,4" maxWidth={160} />
        <button className="btn" onClick={() => build(aStr, bStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · [1,2,4]/[1,3,4]', value: '1,2,4|1,3,4' },
          { label: 'Rỗng + [0]', value: '|0' },
          { label: 'Xen kẽ · [1,3,5]/[2,4,6]', value: '1,3,5|2,4,6' },
        ]}
        onPick={(v) => {
          const [na, nb] = v.split('|');
          setAStr(na);
          setBStr(nb);
          build(na, nb);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n+m) · O(1)" />
    </div>
  );
};
