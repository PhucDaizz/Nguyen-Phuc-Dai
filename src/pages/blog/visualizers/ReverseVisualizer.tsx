import { useMemo, useState } from 'react';
import { getSolutions, REVERSE_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'visit' | 'flip' | 'done';
  prev: number | null; // index node prev (-1 = null)
  curr: number | null;
  next: number | null;
  links: (number | null)[]; // links[i] = index next hiện tại (null = hết)
  flipped: number[]; // index các node đã lật
  message: string; codeLine: number;
}

const generateTrace = (vals: number[]): Step[] => {
  const trace: Step[] = [];
  const links: (number | null)[] = vals.map((_, i) => (i + 1 < vals.length ? i + 1 : null));
  const snap = () => [...links];
  const flippedSnap = () => [...flipped];
  const flipped: number[] = [];
  let prev: number | null = null;
  let curr: number | null = vals.length > 0 ? 0 : null;

  trace.push({
    type: 'init', prev, curr, next: curr !== null ? links[curr] : null,
    links: snap(), flipped: flippedSnap(),
    message: `Khởi tạo: <strong>prev = null, curr = head</strong>. Lật từng mũi tên về prev.`,
    codeLine: 1,
  });

  while (curr !== null) {
    const next = links[curr];
    trace.push({
      type: 'visit', prev, curr, next,
      links: snap(), flipped: flippedSnap(),
      message: `curr = <strong>${vals[curr]}</strong>: lưu <strong>next = ${next === null ? 'null' : vals[next]}</strong> trước kẻo mất list.`,
      codeLine: 4,
    });
    links[curr] = prev;
    flipped.push(curr);
    trace.push({
      type: 'flip', prev, curr, next,
      links: snap(), flipped: flippedSnap(),
      message: `Lật mũi tên: <strong>${vals[curr]} → ${prev === null ? 'null' : vals[prev]}</strong>. Rồi prev, curr cùng bước tới.`,
      codeLine: 5,
    });
    prev = curr;
    curr = next;
  }

  trace.push({
    type: 'done', prev, curr: null, next: null,
    links: snap(), flipped: flippedSnap(),
    message: vals.length === 0
      ? 'List rỗng → return <strong>null</strong>.'
      : `curr = null → xong. Head mới = <strong>${vals[prev!]} (prev)</strong>.`,
    codeLine: 9,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_REVERSE = getSolutions('reverse-linked-list-206');

export const ReverseVisualizer = () => {
  const [str, setStr] = useState('1,2,3,4,5');
  const [vals, setVals] = useState<number[]>([1, 2, 3, 4, 5]);
  const trace = useMemo(() => generateTrace(vals), [vals]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const n = parseNumList(v);
    if (n.length > 8) return;
    pb.restart();
    setVals(n);
  };

  const tagOf = (i: number): string => {
    const t: string[] = [];
    if (step.prev === i) t.push('prev');
    if (step.curr === i) t.push('curr');
    if (step.next === i) t.push('next');
    return t.join(' ');
  };

  // Mũi tên CỦA node i (links[i]) + ghi rõ GIÁ TRỊ đích để khỏi nhầm với link của next:
  // null chưa lật → ∅, null đã lật → ←∅, trỏ về trước → ←giá_trị, trỏ tới sau → →giá_trị
  const arrowOf = (i: number) => {
    const nx = step.links[i];
    const isFlipped = step.flipped.includes(i);
    if (nx === null) return isFlipped ? '←∅' : '∅';
    return nx < i ? `←${vals[nx]}` : `→${vals[nx]}`;
  };

  // Màu mũi tên: teal = đã lật, muted = chưa
  const arrowColor = (i: number) => {
    return step.flipped.includes(i) ? 'var(--teal)' : 'var(--muted)';
  };

  // Khi xong: đi theo links từ head mới để ra thứ tự thật
  const doneOrder: number[] | null =
    step.type === 'done' && step.prev !== null
      ? (() => {
          const order: number[] = [];
          const seen = new Set<number>();
          let c: number | null = step.prev;
          while (c !== null && !seen.has(c)) {
            seen.add(c);
            order.push(c);
            c = step.links[c];
          }
          return order;
        })()
      : null;

  return (
    <div>
      <VizHeader
        backTo="/blog/reverse-linked-list-206" backLabel="Bài giảng Reverse List"
        badge="Linked List · O(1) Space" title="Reverse List" accent="trực quan"
        sub="Lưu next → lật mũi tên về prev → bước tới. Mũi tên ghi giá trị đích: ←1 = node này trỏ về node 1 (đã lật, teal), →3 = còn trỏ tới node 3, ←∅ = đuôi mới."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>LIST · HEAD {step.type === 'done' && step.prev !== null ? `= ${vals[step.prev]}` : ''}</div>
        {vals.length === 0 ? (
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>null (rỗng)</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', rowGap: 16 }}>
            {vals.map((v, i) => {
              const flipped = step.flipped.includes(i);
              const isPtr = step.prev === i || step.curr === i || step.next === i;
              return (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span
                      style={{
                        minWidth: 46, textAlign: 'center', padding: '8px', borderRadius: '50%',
                        border: `2px solid ${isPtr ? 'var(--accent)' : flipped ? 'rgba(45,212,191,.6)' : 'var(--border-strong)'}`,
                        background: isPtr ? 'rgba(255,181,71,.12)' : flipped ? 'rgba(45,212,191,.08)' : 'var(--bg-3)',
                        color: isPtr ? 'var(--accent)' : flipped ? 'var(--teal)' : 'var(--fg)',
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                        boxShadow: isPtr ? '0 0 12px var(--accent-glow)' : 'none',
                      }}
                    >
                      {v}
                    </span>
                    <span className="mono" style={{ fontSize: 9, color: 'var(--accent)', minHeight: 12 }}>{tagOf(i)}</span>
                  </span>
                  {/* Mũi tên sau mọi node (kể cả cuối), màu theo trạng thái lật */}
                  <span className="mono" style={{ color: arrowColor(i), fontSize: 14, marginLeft: 2, marginRight: 2, display: 'inline-flex', alignItems: 'center' }}>
                    {arrowOf(i)}
                  </span>
                </span>
              );
            })}
          </div>
        )}
        {doneOrder && (
          <>
            <div className="card-title" style={{ marginTop: 14 }}>
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              KẾT QUẢ (ĐI TỪ HEAD MỚI)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {doneOrder.map((oi, k) => (
                <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span
                    className="mono"
                    style={{
                      minWidth: 42, textAlign: 'center', padding: '8px', borderRadius: '50%',
                      border: '2px solid var(--teal)', background: 'rgba(45,212,191,.12)',
                      color: 'var(--teal)', fontWeight: 700, fontSize: 14,
                      boxShadow: '0 0 12px var(--teal-glow)',
                    }}
                  >
                    {vals[oi]}
                  </span>
                  <span className="mono" style={{ color: 'var(--teal)', fontSize: 14 }}>
                    {k < doneOrder.length - 1 ? '→' : '∅'}
                  </span>
                </span>
              ))}
              {doneOrder.length === 0 && (
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>∅ (rỗng)</span>
              )}
            </div>
          </>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="list (≤8 số, rỗng = null):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3,4,5" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Cơ bản · [1,2,3,4,5]', value: '1,2,3,4,5' },
          { label: 'LeetCode · [1,2]', value: '1,2' },
          { label: '1 node · [1]', value: '1' },
          { label: 'Rỗng', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_REVERSE}
          defaultLang="csharp"
          getHighlight={(lang) => [REVERSE_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
