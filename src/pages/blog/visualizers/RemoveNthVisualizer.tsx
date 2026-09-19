import { useMemo, useState } from 'react';
import { getSolutions, REMOVENTH_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, Chain, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'gap' | 'move' | 'remove' | 'done';
  fast: number | null; // index trong mảng mở rộng [dummy, ...vals]; -1 = null
  slow: number | null;
  removed: number | null; // index (trong vals) đã xóa
  result: number[];
  message: string; codeLine: number;
}

// Mô hình mảng: positions 0 = dummy, 1..n = vals
const generateTrace = (vals: number[], n: number): Step[] => {
  const trace: Step[] = [];
  const name = (p: number | null) => (p === null || p < 0 ? 'null' : p === 0 ? 'dummy' : `node ${vals[p - 1]} [${p - 1}]`);
  let fast = 0;
  let slow = 0;

  trace.push({
    type: 'init', fast: 0, slow: 0, removed: null,
    result: [...vals],
    message: `Dummy đứng trước head. Fast đi trước <strong>${n + 1}</strong> bước (n + 1) để slow dừng trước node cần xóa.`,
    codeLine: 1,
  });

  if (n >= vals.length) {
    // fast đi quá list → sau khi đi hết, fast = null
    trace.push({
      type: 'gap', fast: -1, slow: 0, removed: null,
      result: [...vals],
      message: `n = ${n} ≥ độ dài list → fast chạy ra null, slow vẫn ở dummy → xóa <strong>head</strong>.`,
      codeLine: 5,
    });
    const res = vals.slice(1);
    trace.push({
      type: 'remove', fast: -1, slow: 0, removed: 0,
      result: res,
      message: `dummy.next = head.next → bỏ node <strong>${vals[0]}</strong>. Result = [${res.join(', ') || '∅'}].`,
      codeLine: 10,
    });
    trace.push({
      type: 'done', fast: -1, slow: 0, removed: 0,
      result: res,
      message: `Hoàn tất → return dummy.next = <strong>[${res.join(', ') || '∅'}]</strong>.`,
      codeLine: 11,
    });
    return trace;
  }

  for (let k = 0; k <= n; k++) fast++;
  trace.push({
    type: 'gap', fast, slow, removed: null,
    result: [...vals],
    message: `Fast đi trước ${n + 1} bước → fast ở ${name(fast)}, slow ở ${name(slow)}.`,
    codeLine: 5,
  });

  // Cùng đi tới khi fast ra null (position n+1). slow dừng trước node cần xóa.
  // Quy ước: position p (0 = dummy) giữ vals[p-1]; node bị xóa = vals[slow].
  while (fast <= vals.length) {
    fast++;
    slow++;
    if (fast > vals.length) {
      trace.push({
        type: 'move', fast: -1, slow, removed: null,
        result: [...vals],
        message: `Fast tới <strong>null</strong> → slow dừng ở ${name(slow)}, ngay trước node <strong>${vals[slow]} [${slow}]</strong> cần xóa.`,
        codeLine: 6,
      });
      break;
    }
    trace.push({
      type: 'move', fast, slow, removed: null,
      result: [...vals],
      message: `Cả 2 cùng bước: fast ở ${name(fast)}, slow ở ${name(slow)}.`,
      codeLine: 6,
    });
  }

  const res = vals.filter((_, i) => i !== slow);
  trace.push({
    type: 'remove', fast: -1, slow, removed: slow,
    result: res,
    message: `slow.next = slow.next.next → bỏ node <strong>${vals[slow]} [${slow}]</strong>. Result = [${res.join(', ') || '∅'}].`,
    codeLine: 10,
  });
  trace.push({
    type: 'done', fast: -1, slow, removed: slow,
    result: res,
    message: `Hoàn tất → return dummy.next = <strong>[${res.join(', ') || '∅'}]</strong>.`,
    codeLine: 11,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_REMOVENTH = getSolutions('remove-nth-19');
// codeLine map thực tế: init→1, gap→4, move→5, remove→6, done→7 — chỉnh dưới trace
// (dùng index dòng C# thật)
const fixLine = (s: Step): Step => {
  const map: Record<Step['type'], number> = { init: 1, gap: 4, move: 5, remove: 6, done: 7 };
  return { ...s, codeLine: map[s.type] };
};

export const RemoveNthVisualizer = () => {
  const [str, setStr] = useState('1,2,3,4,5');
  const [nStr, setNStr] = useState('2');
  const [vals, setVals] = useState<number[]>([1, 2, 3, 4, 5]);
  const [n, setN] = useState(2);
  const trace = useMemo(() => generateTrace(vals, n).map(fixLine), [vals, n]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, w: string) => {
    const nv = parseNumList(v);
    const nn = Number(w);
    if (nv.length === 0 || nv.length > 7 || Number.isNaN(nn) || nn < 1) return;
    pb.restart();
    setVals(nv);
    setN(nn);
  };

  // tags theo position: dummy ở index -1 trong Chain? Chain chỉ render vals.
  // Quy ước tags trên vals index: slow-1 / fast-1 (position p → vals index p-1)
  const tags: Record<number, string[]> = {};
  const mark = (p: number | null, label: string) => {
    if (p !== null && p >= 1 && p <= vals.length) {
      tags[p - 1] = [...(tags[p - 1] ?? []), label];
    }
  };
  mark(step.slow, 'slow');
  mark(step.fast, 'fast');

  return (
    <div>
      <VizHeader
        backTo="/blog/remove-nth-19" backLabel="Bài giảng Remove Nth"
        badge="Two Pointers Gap · O(n)" title="Remove Nth Node" accent="trực quan"
        sub="Fast đi trước n+1 bước, rồi cả 2 cùng đi — slow dừng ngay trước node cần xóa. Nhãn slow/fast dưới mỗi node."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>LIST · N = {n} · SLOW {step.slow === 0 ? '(dummy)' : step.slow === null || step.slow < 0 ? '(null)' : `ở node [${step.slow - 1}]`}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
          [D]{vals.map((_, i) => ` → [${i}]`).join('')} → ∅
          {step.removed !== null && <span style={{ color: '#ff5f57' }}> · đã xóa [{step.removed}]</span>}
        </div>
        <Chain
          values={vals.map((v, i) => (step.removed === i ? `✕${v}` : v))}
          tags={tags}
        />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT
        </div>
        <p className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
          [{step.result.join(', ') || '∅'}]
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="list (≤7 số):" value={str} onChange={setStr} onEnter={() => build(str, nStr)} placeholder="1,2,3,4,5" maxWidth={180} />
        <InputField label="n:" value={nStr} onChange={setNStr} onEnter={() => build(str, nStr)} placeholder="2" maxWidth={70} />
        <button className="btn" onClick={() => build(str, nStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · n=2', value: '1,2,3,4,5|2' },
          { label: 'Xóa head · n=5', value: '1,2,3,4,5|5' },
          { label: 'Xóa đuôi · n=1', value: '1,2,3|1' },
        ]}
        onPick={(v) => {
          const [nv, nn] = v.split('|');
          setStr(nv);
          setNStr(nn);
          build(nv, nn);
        }}
      />
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_REMOVENTH}
          defaultLang="csharp"
          getHighlight={(lang) => [REMOVENTH_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
