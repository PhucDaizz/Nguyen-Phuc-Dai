import { useMemo, useState } from 'react';
import { getSolutions, MERGEK_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, TreeSvg, Chain, type TreeNodeState,
} from './shared';

interface HItem {
  list: number; // list thứ mấy
  val: number;
  pos: number; // vị trí head hiện tại trong list đó
}

interface Step {
  type: 'init' | 'push' | 'sift' | 'pop' | 'done';
  heap: HItem[];
  result: number[];
  hi: number[]; // vị trí heap đang spotlight (swap/cột mới/root)
  lastTaken: { list: number; val: number } | null;
  note: string; // nhãn phase: pop / sift-down / push / sift-up
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

const snapHeap = (h: HItem[]) => h.map((x) => ({ ...x }));

const generateTrace = (lists: number[][]): Step[] => {
  const trace: Step[] = [];
  const res: number[] = [];
  const heap: HItem[] = [];

  trace.push({
    type: 'init', heap: [], result: [], hi: [], lastTaken: null,
    note: 'Min-heap là gì?',
    message: `Min-heap = cây nhị phân đầy đủ mà <strong>cha ≤ 2 con</strong> → <strong>root luôn là số nhỏ nhất</strong>. Pop/push xong phải "sửa" (sift) để giữ luật này.`,
    codeLine: 1,
  });

  // Push head từng list (kèm sift-up minh họa)
  lists.forEach((l, li) => {
    heap.push({ list: li, val: l[0], pos: 0 });
    trace.push({
      type: 'push', heap: snapHeap(heap), result: [...res], hi: [heap.length - 1], lastTaken: null,
      note: 'push (sift-up)',
      message: `Push head list ${li + 1} (<strong>${l[0]}</strong>) vào cuối heap.`,
      codeLine: 3,
    });
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].val >= heap[p].val) break;
      [heap[i], heap[p]] = [heap[p], heap[i]];
      trace.push({
        type: 'sift', heap: snapHeap(heap), result: [...res], hi: [p, i], lastTaken: null,
        note: 'sift-up',
        message: `Con <strong>${heap[p].val}</strong> < cha <strong>${heap[i].val}</strong> → đổi chỗ, leo tiếp.`,
        codeLine: 3,
      });
      i = p;
    }
  });

  // Vòng chính: pop min → push next
  let guard = 0;
  while (heap.length > 0 && guard++ < 60) {
    // pop root
    const top = heap[0];
    const last = heap.pop()!;
    res.push(top.val);
    if (heap.length > 0) {
      heap[0] = last;
      trace.push({
        type: 'pop', heap: snapHeap(heap), result: [...res], hi: [0], lastTaken: { list: top.list, val: top.val },
        note: 'pop min',
        message: `Root <strong>${top.val}</strong> (list ${top.list + 1}) là min → lấy ra nối vào result. Đưa phần tử cuối (<strong>${last.val}</strong>) lên root, cây đang vỡ luật.`,
        codeLine: 7,
      });
      // sift-down
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let m = i;
        if (l < heap.length && heap[l].val < heap[m].val) m = l;
        if (r < heap.length && heap[r].val < heap[m].val) m = r;
        if (m === i) break;
        [heap[i], heap[m]] = [heap[m], heap[i]];
        trace.push({
          type: 'sift', heap: snapHeap(heap), result: [...res], hi: [i, m], lastTaken: { list: top.list, val: top.val },
          note: 'sift-down',
          message: `<strong>${heap[m].val}</strong> lớn hơn con <strong>${heap[i].val}</strong> → đổi chỗ, chìm tiếp.`,
          codeLine: 7,
        });
        i = m;
      }
    } else {
      trace.push({
        type: 'pop', heap: [], result: [...res], hi: [], lastTaken: { list: top.list, val: top.val },
        note: 'pop min',
        message: `Lấy nốt <strong>${top.val}</strong> (list ${top.list + 1}) → heap rỗng.`,
        codeLine: 7,
      });
    }
    // push next của list vừa pop
    const np = top.pos + 1;
    if (np < lists[top.list].length) {
      heap.push({ list: top.list, val: lists[top.list][np], pos: np });
      trace.push({
        type: 'push', heap: snapHeap(heap), result: [...res], hi: [heap.length - 1], lastTaken: { list: top.list, val: top.val },
        note: 'push (sift-up)',
        message: `List ${top.list + 1} còn số → push tiếp <strong>${lists[top.list][np]}</strong> vào cuối heap.`,
        codeLine: 10,
      });
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i].val >= heap[p].val) break;
        [heap[i], heap[p]] = [heap[p], heap[i]];
        trace.push({
          type: 'sift', heap: snapHeap(heap), result: [...res], hi: [p, i], lastTaken: { list: top.list, val: top.val },
          note: 'sift-up',
          message: `Con <strong>${heap[p].val}</strong> < cha <strong>${heap[i].val}</strong> → đổi chỗ.`,
          codeLine: 10,
        });
        i = p;
      }
    }
  }

  trace.push({
    type: 'done', heap: [], result: [...res], hi: [], lastTaken: null,
    note: 'xong',
    message: `Heap rỗng → xong. Mỗi node vào/ra heap 1 lần, mỗi lần O(log k) → tổng <strong>O(N log k)</strong>. Result = [${res.join(', ') || '∅'}].`,
    codeLine: 12,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MERGEK = getSolutions('merge-k-lists-23');

export const MergeKVisualizer = () => {
  const [str, setStr] = useState('1,4,5;1,3,4;2,6');
  const [lists, setLists] = useState<number[][]>([[1, 4, 5], [1, 3, 4], [2, 6]]);
  const trace = useMemo(() => generateTrace(lists), [lists]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const ls = parseLists(v);
    if (ls.length === 0 || ls.length > 4 || ls.flat().length > 12) return;
    // mỗi list phải đã sort (min-heap merge yêu cầu đầu vào sort)
    if (!ls.every((l) => l.every((x, i) => i === 0 || l[i - 1] <= x))) return;
    pb.restart();
    setLists(ls);
  };

  const states: Record<number, TreeNodeState> = {};
  step.hi.forEach((h) => {
    states[h] = 'cur';
  });

  return (
    <div>
      <VizHeader
        backTo="/blog/merge-k-lists-23" backLabel="Bài giảng Merge K Lists"
        badge="Min-Heap · O(N log k)" title="Merge K Lists" accent="trực quan"
        sub="Heap vẽ dạng cây: cha luôn ≤ con nên root = min. Pop root rồi sift-down, push cuối rồi sift-up — xem từng bước đổi chỗ."
      />
      <div className="rule">
        <p style={{ margin: 0 }}>
          <strong>Min-heap nhớ 1 câu:</strong> cha ≤ 2 con → root là min.
          <strong> Pop</strong> = lấy root, đưa cuối lên, chìm xuống (sift-down).
          <strong> Push</strong> = thêm vào cuối, nổi lên (sift-up).
        </p>
      </div>
      <div className="card">
        <div className="card-title"><span className="dot"></span>CÁC LIST ĐẦU VÀO (ĐÃ SORT)</div>
        {lists.length === 0 && (
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng</p>
        )}
        {lists.map((l, li) => (
          <div key={li} style={{ marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>list {li + 1}: </span>
            <Chain values={l} />
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>MIN-HEAP (DẠNG CÂY) · {step.note.toUpperCase()} · SIZE {step.heap.length}
          </div>
          {step.heap.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>heap rỗng</p>
          ) : (
            <TreeSvg
              values={step.heap.map((h) => h.val)}
              states={states}
            />
          )}
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
            mảng heap: [{step.heap.map((h) => `${h.val}(L${h.list + 1})`).join(', ') || '∅'}] · root = min
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            RESULT ({step.result.length})
          </div>
          <Chain values={step.result} />
          {step.lastTaken && (
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
              vừa lấy {step.lastTaken.val} (list {step.lastTaken.list + 1})
            </p>
          )}
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="lists đã sort (cách nhau ; — ≤4 list, 12 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,4,5;1,3,4;2,6" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 3 lists', value: '1,4,5;1,3,4;2,6' },
          { label: '2 lists · 1,3/2,4', value: '1,3;2,4' },
          { label: '1 list · [1,2,3]', value: '1,2,3' },
        ]}
        onPick={(v) => {
          setStr(v);
          build(v);
        }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MERGEK}
          defaultLang="csharp"
          getHighlight={(lang) => [MERGEK_LINE_MAP[lang][step.type]]}
          meta="O(N log k) · O(k)"
        />
      </div>
    </div>
  );
};
