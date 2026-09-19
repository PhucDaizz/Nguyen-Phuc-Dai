import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';
import { getSolutions, MAXDEPTH_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'visit' | 'done';
  idx: number | null; // array index node đang thăm
  depth: number;
  best: number;
  seen: number[];
  message: string; codeLine: number;
}

// DFS preorder trên mảng level-order (con tồn tại mới đi)
const childrenOf = (arr: (number | null)[], i: number) => {
  const out: number[] = [];
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < arr.length && arr[l] !== null) out.push(l);
  if (r < arr.length && arr[r] !== null) out.push(r);
  return out;
};

const depthOfIdx = (i: number) => Math.floor(Math.log2(i + 1)) + 1;

const generateTrace = (arr: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  if (arr.length === 0 || arr[0] === null) {
    trace.push({
      type: 'done', idx: null, depth: 0, best: 0, seen: [],
      message: 'Cây rỗng → depth = <strong>0</strong>.',
      codeLine: 1,
    });
    return trace;
  }
  let best = 0;
  const seen: number[] = [];
  trace.push({
    type: 'init', idx: null, depth: 0, best: 0, seen: [],
    message: `DFS từ root. depth(node) = 1 + max(trái, phải), null = 0. Giữ <strong>best</strong> lớn nhất.`,
    codeLine: 2,
  });
  // preorder đệ quy trái-trước
  const dfs = (i: number) => {
    const d = depthOfIdx(i);
    if (d > best) best = d;
    seen.push(i);
    trace.push({
      type: 'visit', idx: i, depth: d, best, seen: [...seen],
      message: `Thăm <strong>${arr[i]} [${i}]</strong> ở sâu ${d} → best = <strong>${best}</strong>.`,
      codeLine: 2,
    });
    for (const c of childrenOf(arr, i)) dfs(c);
  };
  dfs(0);
  trace.push({
    type: 'done', idx: null, depth: 0, best, seen: [...seen],
    message: `Hoàn tất. Chiều cao cây = <strong>${best}</strong>.`,
    codeLine: 2,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MAXDEPTH = getSolutions('max-depth-104');

export const MaxDepthVisualizer = () => {
  const [str, setStr] = useState('3,9,20,null,null,15,7');
  const [arr, setArr] = useState<(number | null)[]>([3, 9, 20, null, null, 15, 7]);
  const trace = useMemo(() => generateTrace(arr), [arr]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setArr(parseTreeList(v));
  };

  const states: Record<number, TreeNodeState> = {};
  step.seen.forEach((i) => {
    states[i] = 'done';
  });
  if (step.idx !== null) states[step.idx] = 'cur';

  return (
    <div>
      <VizHeader
        backTo="/blog/max-depth-104" backLabel="Bài giảng Max Depth"
        badge="DFS · O(n)" title="Max Depth" accent="trực quan"
        sub="DFS từng node theo preorder, giữ best = độ sâu lớn nhất. Node amber là đang thăm, teal mờ là xong."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY · BEST = {step.best}</div>
          <TreeSvg values={arr} states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>NODE ĐANG THĂM</div>
            <p className="mono" style={{ fontSize: 15, margin: 0, color: 'var(--accent)' }}>
              {step.idx === null ? '—' : `${arr[step.idx]} (sâu ${step.depth})`}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              depth = 1 + max(trái, phải)
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              CHIỀU CAO (BEST)
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.best}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="tree (level-order, null = trống):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="3,9,20,null,null,15,7" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · depth 3', value: '3,9,20,null,null,15,7' },
          { label: 'Lệch phải · depth 2', value: '1,null,2' },
          { label: '1 node', value: '1' },
          { label: 'Rỗng', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MAXDEPTH}
          defaultLang="csharp"
          getHighlight={(lang) => [MAXDEPTH_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(h)"
        />
      </div>
    </div>
  );
};
