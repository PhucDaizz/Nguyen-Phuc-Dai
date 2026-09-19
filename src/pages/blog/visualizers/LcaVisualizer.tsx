import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';
import { getSolutions, LCA_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'go' | 'found' | 'done';
  cur: number | null; // array index node đang đứng
  path: number[]; // đường đã đi
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

const generateTrace = (arr: (number | null)[], p: number, q: number): Step[] => {
  const trace: Step[] = [];
  const root = toObj(arr);
  trace.push({
    type: 'init', cur: null, path: [],
    message: `BST + p = <strong>${p}</strong>, q = <strong>${q}</strong>. Cùng nhỏ đi trái, cùng lớn đi phải, rẽ nhánh là LCA.`,
    codeLine: 1,
  });
  if (!root) {
    trace.push({
      type: 'done', cur: null, path: [],
      message: 'Cây rỗng.',
      codeLine: 7,
    });
    return trace;
  }
  let cur: TNode | null = root;
  const path: number[] = [];
  while (cur) {
    path.push(cur.idx);
    if (p < cur.val && q < cur.val) {
      trace.push({
        type: 'go', cur: cur.idx, path: [...path],
        message: `<strong>${p}, ${q} < ${cur.val}</strong> → cả 2 nằm trái → đi <strong>trái</strong>.`,
        codeLine: 4,
      });
      cur = cur.left;
      continue;
    }
    if (p > cur.val && q > cur.val) {
      trace.push({
        type: 'go', cur: cur.idx, path: [...path],
        message: `<strong>${p}, ${q} > ${cur.val}</strong> → cả 2 nằm phải → đi <strong>phải</strong>.`,
        codeLine: 5,
      });
      cur = cur.right;
      continue;
    }
    trace.push({
      type: 'found', cur: cur.idx, path: [...path],
      message: `Tại <strong>${cur.val}</strong>: p, q rẽ 2 hướng (hoặc trùng node) → đây là LCA → return <strong>${cur.val}</strong>.`,
      codeLine: 6,
    });
    trace.push({
      type: 'done', cur: cur.idx, path: [...path],
      message: `Hoàn tất. Tổ tiên chung thấp nhất của ${p} và ${q} = <strong>${cur.val}</strong>.`,
      codeLine: 6,
    });
    return trace;
  }
  trace.push({
    type: 'done', cur: null, path: [...path],
    message: 'Đi hết cây không thấy (p/q không trong cây) → <strong>null</strong>.',
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_LCA = getSolutions('lowest-common-ancestor-235');

export const LcaVisualizer = () => {
  const [str, setStr] = useState('6,2,8,0,4,7,9,null,null,3,5');
  const [pStr, setPStr] = useState('2');
  const [qStr, setQStr] = useState('8');
  const [arr, setArr] = useState<(number | null)[]>([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
  const [p, setP] = useState(2);
  const [q, setQ] = useState(8);
  const trace = useMemo(() => generateTrace(arr, p, q), [arr, p, q]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, a: string, b: string) => {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) return;
    pb.restart();
    setArr(parseTreeList(v));
    setP(na);
    setQ(nb);
  };

  const states: Record<number, TreeNodeState> = {};
  step.path.forEach((i) => {
    states[i] = 'done';
  });
  if (step.cur !== null) states[step.cur] = step.type === 'found' || step.type === 'done' ? 'add' : 'cur';
  // đánh dấu p, q nếu thấy trong cây
  arr.forEach((v, i) => {
    if ((v === p || v === q) && states[i] === undefined) states[i] = 'seen';
  });

  return (
    <div>
      <VizHeader
        backTo="/blog/lowest-common-ancestor-235" backLabel="Bài giảng LCA BST"
        badge="BST Walk · O(h)" title="LCA of BST" accent="trực quan"
        sub="Đi 1 đường từ root xuống: cùng nhỏ rẽ trái, cùng lớn rẽ phải, rẽ nhánh là đáp án."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>BST · P = {p}, Q = {q}</div>
          <TreeSvg values={arr} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>ĐƯỜNG ĐÃ ĐI</div>
            <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
              {step.path.length === 0 ? '—' : step.path.map((i) => arr[i]).join(' → ')}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              chỉ 1 đường duy nhất, không duyệt cả cây
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              LCA
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.type === 'found' || step.type === 'done'
                ? step.cur === null
                  ? 'null'
                  : arr[step.cur]
                : '?'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="bst:" value={str} onChange={setStr} onEnter={() => build(str, pStr, qStr)} placeholder="6,2,8,0,4,7,9,null,null,3,5" maxWidth={280} />
        <InputField label="p:" value={pStr} onChange={setPStr} onEnter={() => build(str, pStr, qStr)} placeholder="2" maxWidth={70} />
        <InputField label="q:" value={qStr} onChange={setQStr} onEnter={() => build(str, pStr, qStr)} placeholder="8" maxWidth={70} />
        <button className="btn" onClick={() => build(str, pStr, qStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · p=2,q=8 → 6', value: '6,2,8,0,4,7,9,null,null,3,5|2|8' },
          { label: 'Cùng nhánh · p=2,q=4 → 2', value: '6,2,8,0,4,7,9,null,null,3,5|2|4' },
          { label: 'Sâu · p=3,q=5 → 4', value: '6,2,8,0,4,7,9,null,null,3,5|3|5' },
        ]}
        onPick={(v) => {
          const [t, a, b] = v.split('|');
          setStr(t);
          setPStr(a);
          setQStr(b);
          build(t, a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_LCA}
          defaultLang="csharp"
          getHighlight={(lang) => [LCA_LINE_MAP[lang][step.type]]}
          meta="O(h) · O(1)"
        />
      </div>
    </div>
  );
};
