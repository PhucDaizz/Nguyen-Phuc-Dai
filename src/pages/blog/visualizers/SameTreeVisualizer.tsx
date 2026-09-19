import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';
import { getSolutions, SAMETREE_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'compare' | 'done';
  p: number | null; // index trong cây P
  q: number | null; // index trong cây Q
  ok: boolean | null;
  checked: [number, number][]; // cặp đã khớp
  message: string; codeLine: number;
}

const generateTrace = (P: (number | null)[], Q: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  const pEmpty = P.length === 0 || P[0] === null;
  const qEmpty = Q.length === 0 || Q[0] === null;
  const checked: [number, number][] = [];
  const snap = () => checked.map((c) => [...c] as [number, number]);

  trace.push({
    type: 'init', p: null, q: null, ok: null, checked: [],
    message: 'So song song 2 cây: cùng null → true, 1 null/khác giá trị → false ngay.',
    codeLine: 1,
  });

  if (pEmpty && qEmpty) {
    trace.push({
      type: 'done', p: null, q: null, ok: true, checked: [],
      message: 'Cả 2 rỗng → <strong>true</strong>.',
      codeLine: 1,
    });
    return trace;
  }

  // BFS cặp song song
  const queue: [number | null, number | null][] = [[pEmpty ? null : 0, qEmpty ? null : 0]];
  while (queue.length > 0) {
    const [pi, qi] = queue.shift()!;
    const pv = pi === null ? null : P[pi];
    const qv = qi === null ? null : Q[qi];
    if (pv === null && qv === null) {
      trace.push({
        type: 'compare', p: pi, q: qi, ok: true, checked: snap(),
        message: 'Cặp (null, null) → khớp, bỏ qua.',
        codeLine: 1,
      });
      continue;
    }
    if (pv === null || qv === null || pv !== qv) {
      trace.push({
        type: 'compare', p: pi, q: qi, ok: false, checked: snap(),
        message: `Cặp (<strong>${pv === null ? 'null' : pv}</strong>, <strong>${qv === null ? 'null' : qv}</strong>) → lệch → <strong>false</strong>.`,
        codeLine: 2,
      });
      trace.push({
        type: 'done', p: pi, q: qi, ok: false, checked: snap(),
        message: 'Hoàn tất → <strong>false</strong>.',
        codeLine: 2,
      });
      return trace;
    }
    checked.push([pi!, qi!]);
    trace.push({
      type: 'compare', p: pi, q: qi, ok: true, checked: snap(),
      message: `Cặp (<strong>${pv}</strong>, <strong>${qv}</strong>) khớp ✓ → so tiếp 2 cặp con (trái, phải).`,
      codeLine: 3,
    });
    // luôn đẩy đủ cặp trái + phải (thiếu = null) để bắt lệch cấu trúc;
    // cặp (null, null) không sinh con nên không lặp vô hạn
    const childAt = (arr: (number | null)[], idx: number | null, k: number): number | null => {
      if (idx === null) return null;
      const c = 2 * idx + 1 + k;
      return c < arr.length ? arr[c] === null ? null : c : null;
    };
    queue.push([childAt(P, pi, 0), childAt(Q, qi, 0)]);
    queue.push([childAt(P, pi, 1), childAt(Q, qi, 1)]);
    if (queue.length > 64) break;
  }

  trace.push({
    type: 'done', p: null, q: null, ok: true, checked: snap(),
    message: `Mọi cặp đều khớp (${checked.length} node) → <strong>true</strong>.`,
    codeLine: 3,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_SAMETREE = getSolutions('same-tree-100');

export const SameTreeVisualizer = () => {
  const [pStr, setPStr] = useState('1,2,3');
  const [qStr, setQStr] = useState('1,2,3');
  const [P, setP] = useState<(number | null)[]>([1, 2, 3]);
  const [Q, setQ] = useState<(number | null)[]>([1, 2, 3]);
  const trace = useMemo(() => generateTrace(P, Q), [P, Q]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    pb.restart();
    setP(parseTreeList(a));
    setQ(parseTreeList(b));
  };

  const mkStates = (me: number | null, other: [number, number][], selfFirst: boolean) => {
    const st: Record<number, TreeNodeState> = {};
    other.forEach(([pi, qi]) => {
      const mine = selfFirst ? pi : qi;
      if (mine !== null) st[mine] = 'done';
    });
    if (me !== null) st[me] = step.ok === false ? 'bad' : 'cur';
    return st;
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/same-tree-100" backLabel="Bài giảng Same Tree"
        badge="DFS Song Song · O(n)" title="Same Tree" accent="trực quan"
        sub="Duyệt cặp node cùng vị trí ở 2 cây: khớp thì đi tiếp, lệch 1 cặp là false ngay."
      />
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY P</div>
          <TreeSvg values={P} states={mkStates(step.p, step.checked, true)} />
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CÂY Q</div>
          <TreeSvg values={Q} states={mkStates(step.q, step.checked, false)} />
        </div>
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          CẶP ĐÃ KHỚP: {step.checked.length} · RESULT
        </div>
        <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.ok === false ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
          {step.ok === null ? '?' : step.ok ? 'true' : 'false'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="p:" value={pStr} onChange={setPStr} onEnter={() => build(pStr, qStr)} placeholder="1,2,3" maxWidth={180} />
        <InputField label="q:" value={qStr} onChange={setQStr} onEnter={() => build(pStr, qStr)} placeholder="1,2,3" maxWidth={180} />
        <button className="btn" onClick={() => build(pStr, qStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Giống · [1,2,3]', value: '1,2,3|1,2,3' },
          { label: 'Khác cấu trúc · [1,2]/[1,null,2]', value: '1,2|1,null,2' },
          { label: 'Khác giá trị · [1,2,1]/[1,1,2]', value: '1,2,1|1,1,2' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setPStr(a);
          setQStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_SAMETREE}
          defaultLang="csharp"
          getHighlight={(lang) => [SAMETREE_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(h)"
        />
      </div>
    </div>
  );
};
