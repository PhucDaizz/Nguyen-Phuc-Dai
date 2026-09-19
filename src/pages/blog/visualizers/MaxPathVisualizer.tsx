import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';
import { getSolutions, MAXPATH_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'visit' | 'done';
  idx: number | null; // array index node đang tính
  gain: number | null; // gain trả về cha
  best: number;
  computed: number[]; // index đã tính xong
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

const generateTrace = (arr: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  const root = toObj(arr);
  trace.push({
    type: 'init', idx: null, gain: null, best: -Infinity, computed: [],
    message: 'Post-order: mỗi node trả lên gain tốt nhất 1 nhánh, cập nhật max toàn cục bằng cả 2 nhánh. Gain âm → bỏ (0).',
    codeLine: 2,
  });
  if (!root) {
    trace.push({
      type: 'done', idx: null, gain: null, best: -Infinity, computed: [],
      message: 'Cây rỗng.',
      codeLine: 1,
    });
    return trace;
  }
  let best = -Infinity;
  const gainOf = new Map<number, number>();
  const computed: number[] = [];
  const snap = () => [...computed];

  const dfs = (node: TNode | null): number => {
    if (!node) return 0;
    const gl = Math.max(0, dfs(node.left));
    const gr = Math.max(0, dfs(node.right));
    const myBest = node.val + gl + gr;
    if (myBest > best) best = myBest;
    const ret = node.val + Math.max(gl, gr);
    gainOf.set(node.idx, ret);
    computed.push(node.idx);
    trace.push({
      type: 'visit', idx: node.idx, gain: ret, best, computed: snap(),
      message: `Node <strong>${node.val} [${node.idx}]</strong>: trái +${gl}, phải +${gr} → qua đây max = <strong>${node.val}+${gl}+${gr} = ${myBest}</strong>, best = <strong>${best}</strong>, trả lên <strong>${ret}</strong>.`,
      codeLine: 6,
    });
    return ret;
  };
  dfs(root);

  trace.push({
    type: 'done', idx: null, gain: null, best, computed: snap(),
    message: `Hoàn tất. Đường đi tổng lớn nhất = <strong>${best}</strong>.`,
    codeLine: 1,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MAXPATH = getSolutions('max-path-sum-124');

export const MaxPathVisualizer = () => {
  const [str, setStr] = useState('-10,9,20,null,null,15,7');
  const [arr, setArr] = useState<(number | null)[]>([-10, 9, 20, null, null, 15, 7]);
  const trace = useMemo(() => generateTrace(arr), [arr]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setArr(parseTreeList(v));
  };

  const states: Record<number, TreeNodeState> = {};
  step.computed.forEach((i) => {
    states[i] = 'done';
  });
  if (step.idx !== null) states[step.idx] = 'cur';

  return (
    <div>
      <VizHeader
        backTo="/blog/max-path-sum-124" backLabel="Bài giảng Max Path Sum"
        badge="DFS + Global Max · Hard" title="Max Path Sum" accent="trực quan"
        sub="Mỗi node tính đường tốt nhất ĐI QUA nó (cả 2 nhánh) để cập nhật best, nhưng chỉ trả lên 1 nhánh."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>CÂY · BEST = {Number.isFinite(step.best) ? step.best : '−∞'}
          </div>
          <TreeSvg values={arr} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>GAIN TRẢ LÊN CHA</div>
            <p className="mono" style={{ fontSize: 15, margin: 0, color: 'var(--accent)' }}>
              {step.gain === null ? '—' : `+${step.gain}`}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              val + max(nhánh trái, nhánh phải, 0)
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              BEST TOÀN CỤC
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {Number.isFinite(step.best) ? step.best : '−∞'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="tree (level-order):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="-10,9,20,null,null,15,7" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 42', value: '-10,9,20,null,null,15,7' },
          { label: 'Nhỏ · [1,2,3] → 6', value: '1,2,3' },
          { label: 'Toàn âm · [-3] → -3', value: '-3' },
          { label: 'Rẽ nhánh · [5,4,8,11,null,13,4,7,2]', value: '5,4,8,11,null,13,4,7,2' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MAXPATH}
          defaultLang="csharp"
          getHighlight={(lang) => [MAXPATH_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(h)"
        />
      </div>
    </div>
  );
};
