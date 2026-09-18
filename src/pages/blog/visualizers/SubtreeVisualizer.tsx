import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'cand' | 'pair' | 'found' | 'fail' | 'done';
  cand: number | null; // index gốc trong cây lớn đang thử
  pa: number | null; // index trong R của cặp đang so
  pbIdx: number | null; // index trong S của cặp đang so
  ok: boolean | null;
  tried: number;
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

const valAt = (arr: (number | null)[], i: number | null): number | null =>
  i === null || i < 0 || i >= arr.length ? null : arr[i];

// So chi tiết 2 cây theo cặp BFS, trả về các step + kết quả.
// Cặp (null-slot, null-slot) coi như khớp và không sinh con.
const diffTrace = (
  R: (number | null)[],
  S: (number | null)[],
  cand: number,
  push: (s: Step) => void,
): boolean => {
  const queue: [number | null, number | null][] = [[cand, 0]];
  while (queue.length > 0) {
    const [pi, qi] = queue.shift()!;
    const pv = valAt(R, pi);
    const qv = valAt(S, qi);
    const label = (v: number | null) => (v === null ? 'null' : v);
    if (pv === null && qv === null) {
      push({
        type: 'pair', cand, pa: pi, pbIdx: qi, ok: true, tried: 0,
        message: `Cặp (null, null) → khớp, bỏ qua.`,
        codeLine: 3,
      });
      continue;
    }
    if (pv === null || qv === null || pv !== qv) {
      push({
        type: 'pair', cand, pa: pi, pbIdx: qi, ok: false, tried: 0,
        message: `Cặp (<strong>${label(pv)}</strong>, <strong>${label(qv)}</strong>) → lệch ✗ → candidate này loại.`,
        codeLine: 3,
      });
      return false;
    }
    push({
      type: 'pair', cand, pa: pi, pbIdx: qi, ok: true, tried: 0,
      message: `Cặp (<strong>${pv}</strong>, <strong>${qv}</strong>) khớp ✓ → đẩy 2 cặp con (trái, phải).`,
      codeLine: 3,
    });
    // con của slot pi trong R (vượt mảng = null-slot), con của qi trong S
    const kids = (idx: number | null, arr: (number | null)[]) => {
      if (idx === null) return [null, null] as [number | null, number | null];
      const l = 2 * idx + 1;
      const r = 2 * idx + 2;
      const at = (c: number) => (c < arr.length ? c : null);
      return [at(l), at(r)] as [number | null, number | null];
    };
    const [pl, pr] = kids(pi, R);
    const [ql, qr] = kids(qi, S);
    queue.push([pl, ql], [pr, qr]);
    if (queue.length > 64) break;
  }
  return true;
};

// liệt kê node object kèm array index (BFS)
const enumerate = (root: TNode | null): { node: TNode; idx: number }[] => {
  if (!root) return [];
  const out: { node: TNode; idx: number }[] = [];
  const q: { node: TNode; idx: number }[] = [{ node: root, idx: 0 }];
  while (q.length > 0) {
    const cur = q.shift()!;
    out.push(cur);
    if (cur.node.left) q.push({ node: cur.node.left, idx: 2 * cur.idx + 1 });
    if (cur.node.right) q.push({ node: cur.node.right, idx: 2 * cur.idx + 2 });
  }
  return out;
};

const generateTrace = (R: (number | null)[], S: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  const root = toObj(R);
  const sub = toObj(S);
  trace.push({
    type: 'init', cand: null, pa: null, pbIdx: null, ok: null, tried: 0,
    message: 'Mỗi node của cây lớn thử sameTree với cây con. Đúng 1 vị trí là true.',
    codeLine: 1,
  });
  if (!sub) {
    trace.push({
      type: 'done', cand: null, pa: null, pbIdx: null, ok: true, tried: 0,
      message: 'Cây con rỗng → là con của mọi cây → <strong>true</strong>.',
      codeLine: 1,
    });
    return trace;
  }
  if (!root) {
    trace.push({
      type: 'done', cand: null, pa: null, pbIdx: null, ok: false, tried: 0,
      message: 'Cây lớn rỗng mà cây con còn → <strong>false</strong>.',
      codeLine: 2,
    });
    return trace;
  }
  const cands = enumerate(root);
  for (let k = 0; k < cands.length; k++) {
    const { node, idx } = cands[k];
    trace.push({
      type: 'cand', cand: idx, pa: null, pbIdx: null, ok: null, tried: k + 1,
      message: `Thử candidate <strong>${node.val} [${idx}]</strong> — so từng cặp với cây con:`,
      codeLine: 3,
    });
    const match = diffTrace(R, S, idx, (s) => trace.push({ ...s, tried: k + 1 }));
    if (match) {
      trace.push({
        type: 'found', cand: idx, pa: null, pbIdx: null, ok: true, tried: k + 1,
        message: `Mọi cặp đều khớp ✓ → cây con nằm ở node <strong>${node.val} [${idx}]</strong> → <strong>true</strong>, dừng.`,
        codeLine: 3,
      });
      trace.push({
        type: 'done', cand: idx, pa: null, pbIdx: null, ok: true, tried: k + 1,
        message: `Hoàn tất sau ${k + 1} candidate → <strong>true</strong>.`,
        codeLine: 3,
      });
      return trace;
    }
    trace.push({
      type: 'fail', cand: idx, pa: null, pbIdx: null, ok: null, tried: k + 1,
      message: `Candidate <strong>${node.val} [${idx}]</strong> loại → thử node tiếp theo.`,
      codeLine: 4,
    });
  }
  trace.push({
    type: 'done', cand: null, pa: null, pbIdx: null, ok: false, tried: cands.length,
    message: `Thử hết ${cands.length} node, không vị trí nào khớp → <strong>false</strong>.`,
    codeLine: 4,
  });
  return trace;
};

const CSHARP_LINES = [
  'public bool IsSubtree(TreeNode root, TreeNode subRoot) {',
  '    if (subRoot == null) return true;',
  '    if (root == null) return false;',
  '    if (IsSameTree(root, subRoot)) return true;',
  '    return IsSubtree(root.left, subRoot) || IsSubtree(root.right, subRoot);',
  '}',
];

export const SubtreeVisualizer = () => {
  const [rStr, setRStr] = useState('3,4,5,1,2');
  const [sStr, setSStr] = useState('4,1,2');
  const [R, setR] = useState<(number | null)[]>([3, 4, 5, 1, 2]);
  const [S, setS] = useState<(number | null)[]>([4, 1, 2]);
  const trace = useMemo(() => generateTrace(R, S), [R, S]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    pb.restart();
    setR(parseTreeList(a));
    setS(parseTreeList(b));
  };

  // R: candidate amber (khớp xong → teal), cặp đang so sáng theo đúng/sai
  const states: Record<number, TreeNodeState> = {};
  if (step.cand !== null) states[step.cand] = step.ok === true ? 'add' : 'cur';
  if (step.pa !== null && step.pa !== step.cand && R[step.pa] !== null) {
    states[step.pa] = step.ok === false ? 'bad' : 'add';
  } else if (step.pa !== null && step.pa === step.cand && step.type === 'pair') {
    states[step.pa] = step.ok === false ? 'bad' : 'add';
  }
  // S: node đang so
  const statesS: Record<number, TreeNodeState> = {};
  if (step.pbIdx !== null && S[step.pbIdx] !== null) {
    statesS[step.pbIdx] = step.ok === false ? 'bad' : 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/subtree-572" backLabel="Bài giảng Subtree"
        badge="DFS + SameTree · O(m·n)" title="Subtree Check" accent="trực quan"
        sub="Thử sameTree ở từng node cây lớn: so từng cặp node 2 cây (teal = khớp, đỏ = lệch), đúng hết mới true."
      />
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY LỚN · ĐÃ THỬ {step.tried}</div>
          <TreeSvg values={R} states={states} />
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY CON · ĐANG SO {step.pbIdx === null ? '—' : S[step.pbIdx] === null || S[step.pbIdx] === undefined ? 'null' : S[step.pbIdx]}</div>
          <TreeSvg values={S} states={statesS} />
        </div>
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT
        </div>
        <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.ok === false ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
          {step.ok === null ? '?' : step.ok ? 'true' : 'false'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="root:" value={rStr} onChange={setRStr} onEnter={() => build(rStr, sStr)} placeholder="3,4,5,1,2" maxWidth={200} />
        <InputField label="subRoot:" value={sStr} onChange={setSStr} onEnter={() => build(rStr, sStr)} placeholder="4,1,2" maxWidth={160} />
        <button className="btn" onClick={() => build(rStr, sStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Khớp · true', value: '3,4,5,1,2|4,1,2' },
          { label: 'Lệch lá · false', value: '3,4,5,1,2,null,null,null,null,0|4,1,2' },
          { label: 'Nhỏ · [1,1]/[1]', value: '1,1|1' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setRStr(a);
          setSStr(b);
          build(a, b);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m·n)" />
    </div>
  );
};
