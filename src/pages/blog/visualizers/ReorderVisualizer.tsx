import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, Chain, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'middle' | 'split' | 'reverse' | 'merge' | 'done';
  phase: string;
  // phase middle
  slow: number | null;
  fast: number | null;
  // phase reverse
  firstHalf: number[];
  secondHalf: number[]; // đã đảo tới step này (thứ tự hiện tại)
  revDone: boolean;
  // phase merge
  order: number[]; // thứ tự values đã đan tới step này (index gốc)
  message: string; codeLine: number;
}

const generateTrace = (vals: number[]): Step[] => {
  const trace: Step[] = [];
  const n = vals.length;

  trace.push({
    type: 'init', phase: 'Tìm giữa',
    slow: null, fast: null, firstHalf: [], secondHalf: [], revDone: false, order: [],
    message: `3 bước: <strong>chia đôi</strong> (slow/fast) → <strong>đảo nửa sau</strong> → <strong>đan xen</strong>.`,
    codeLine: 1,
  });

  if (n < 2) {
    trace.push({
      type: 'done', phase: 'Xong',
      slow: null, fast: null, firstHalf: [...vals], secondHalf: [], revDone: true, order: vals.map((_, i) => i),
      message: n === 0 ? 'List rỗng → không làm gì.' : '1 node → đã đúng thứ tự.',
      codeLine: 1,
    });
    return trace;
  }

  // Phase 1: slow/fast (mô phỏng index)
  let slow = 0;
  let fast = 0;
  trace.push({
    type: 'middle', phase: 'Tìm giữa',
    slow, fast, firstHalf: [], secondHalf: [], revDone: false, order: [],
    message: `Slow/fast cùng xuất phát ở <strong>[0]</strong>.`,
    codeLine: 5,
  });
  while (fast + 2 < n + (n % 2 === 0 ? 0 : 1) && fast + 1 < n) {
    // fast nhảy 2, slow nhảy 1 — dừng khi fast tới cuối
    const nf = Math.min(fast + 2, n - 1);
    const ns = slow + 1;
    // dừng nếu fast đã ở cuối và slow vượt quá giữa
    if (fast === n - 1 || fast === n - 2) break;
    slow = ns;
    fast = nf;
    trace.push({
      type: 'middle', phase: 'Tìm giữa',
      slow, fast, firstHalf: [], secondHalf: [], revDone: false, order: [],
      message: `Slow → <strong>[${slow}]</strong>, fast → <strong>[${fast}]</strong>.`,
      codeLine: 5,
    });
    if (fast >= n - 1) break;
  }
  const mid = slow;
  trace.push({
    type: 'split', phase: 'Chia đôi',
    slow: mid, fast: null,
    firstHalf: vals.slice(0, mid + 1), secondHalf: vals.slice(mid + 1),
    revDone: false, order: [],
    message: `Giữa ở <strong>[${mid}]</strong>. Cắt: nửa đầu [${vals.slice(0, mid + 1).join(', ')}], nửa sau [${vals.slice(mid + 1).join(', ') || '∅'}].`,
    codeLine: 9,
  });

  // Phase 2: đảo nửa sau
  const second = vals.slice(mid + 1);
  const rev: number[] = [];
  const revIdx: number[] = [];
  for (let k = second.length - 1; k >= 0; k--) {
    rev.push(second[k]);
    revIdx.push(mid + 1 + k);
  }
  // minh họa từng bước đảo: rev dần đầy
  const cur: number[] = [];
  const curIdx: number[] = [];
  for (let k = 0; k < rev.length; k++) {
    cur.push(rev[k]);
    curIdx.push(revIdx[k]);
    trace.push({
      type: 'reverse', phase: 'Đảo nửa sau',
      slow: null, fast: null,
      firstHalf: vals.slice(0, mid + 1), secondHalf: [...cur],
      revDone: false, order: [],
      message: `Đảo: lấy <strong>${rev[k]}</strong> lên đầu nửa sau → [${cur.join(', ')}].`,
      codeLine: 12,
    });
  }

  // Phase 3: đan xen
  const first = vals.slice(0, mid + 1);
  const order: number[] = [];
  const orderIdx: number[] = [];
  let a = 0;
  let b = 0;
  while (a < first.length || b < rev.length) {
    if (a < first.length) {
      order.push(first[a]);
      orderIdx.push(a);
      a++;
    }
    if (b < rev.length) {
      order.push(rev[b]);
      orderIdx.push(revIdx[b]);
      b++;
    }
    trace.push({
      type: 'merge', phase: 'Đan xen',
      slow: null, fast: null,
      firstHalf: first, secondHalf: rev,
      revDone: true, order: [...orderIdx],
      message: `Đan xen → [${order.join(', ')}].`,
      codeLine: 20,
    });
  }

  trace.push({
    type: 'done', phase: 'Xong',
    slow: null, fast: null,
    firstHalf: first, secondHalf: rev,
    revDone: true, order: [...orderIdx],
    message: `Hoàn tất. Result = <strong>[${order.join(', ')}]</strong>.`,
    codeLine: 20,
  });
  return trace;
};

const CSHARP_LINES = [
  'public void ReorderList(ListNode head) {',
  '    if (head == null || head.next == null) return;',
  '    ListNode slow = head, fast = head;',
  '    while (fast != null && fast.next != null) {',
  '        slow = slow.next; fast = fast.next.next;',
  '    }',
  '    ListNode prev = null, curr = slow.next;',
  '    slow.next = null;',
  '    while (curr != null) {',
  '        ListNode next = curr.next;',
  '        curr.next = prev;',
  '        prev = curr;',
  '        curr = next;',
  '    }',
  '    ListNode first = head, second = prev;',
  '    while (second != null) {',
  '        ListNode t1 = first.next, t2 = second.next;',
  '        first.next = second;',
  '        second.next = t1;',
  '        first = t1; second = t2;',
  '    }',
  '}',
];

export const ReorderVisualizer = () => {
  const [str, setStr] = useState('1,2,3,4');
  const [vals, setVals] = useState<number[]>([1, 2, 3, 4]);
  const trace = useMemo(() => generateTrace(vals), [vals]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length > 7) return;
    pb.restart();
    setVals(nv);
  };

  const midTags: Record<number, string[]> = {};
  if (step.slow !== null) midTags[step.slow] = [...(midTags[step.slow] ?? []), 'slow'];
  if (step.fast !== null) midTags[step.fast] = [...(midTags[step.fast] ?? []), 'fast'];

  return (
    <div>
      <VizHeader
        backTo="/blog/reorder-list-143" backLabel="Bài giảng Reorder List"
        badge="Split + Reverse + Merge" title="Reorder List" accent="trực quan"
        sub="Chia đôi bằng slow/fast → đảo nửa sau → đan xen 2 nửa. Phase hiện tại ghi trên mỗi panel."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>LIST GỐC</div>
        <Chain values={vals} tags={step.phase === 'Tìm giữa' ? midTags : undefined} />
        {(step.phase === 'Chia đôi' || step.phase === 'Đảo nửa sau') && (
          <>
            <div className="card-title" style={{ marginTop: 12 }}><span className="dot"></span>NỬA ĐẦU (GIỮ NGUYÊN)</div>
            <Chain values={step.firstHalf} />
            <div className="card-title" style={{ marginTop: 12 }}>
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              NỬA SAU (ĐANG ĐẢO)
            </div>
            <Chain values={step.secondHalf} />
          </>
        )}
        {(step.phase === 'Đan xen' || step.phase === 'Xong') && (
          <>
            <div className="card-title" style={{ marginTop: 12 }}>
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              KẾT QUẢ ĐAN XEN ({step.order.length})
            </div>
            <Chain values={step.order.map((oi) => vals[oi])} />
          </>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          PHASE: {step.phase.toUpperCase()}
        </div>
        <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
          {step.phase === 'Tìm giữa' && 'slow ×1, fast ×2 — fast hết thì slow ở giữa'}
          {step.phase === 'Chia đôi' && 'cắt slow.next = null'}
          {step.phase === 'Đảo nửa sau' && 'lật mũi tên nửa sau như Reverse List'}
          {(step.phase === 'Đan xen' || step.phase === 'Xong') && 'first→second→first.next…'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="list (≤7 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3,4" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Chẵn · [1,2,3,4]', value: '1,2,3,4' },
          { label: 'Lẻ · [1,2,3,4,5]', value: '1,2,3,4,5' },
          { label: '2 node · [1,2]', value: '1,2' },
          { label: '1 node · [1]', value: '1' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
