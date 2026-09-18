import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, Chain, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'move' | 'found' | 'done';
  slow: number;
  fast: number;
  result: boolean | null;
  message: string; codeLine: number;
}

// Mô phỏng Floyd trên mảng + pos nối vòng (pos = -1: không vòng)
const nxt = (i: number, n: number, pos: number) => (i + 1 < n ? i + 1 : pos);

const generateTrace = (vals: number[], pos: number): Step[] => {
  const trace: Step[] = [];
  const n = vals.length;
  if (n === 0) {
    trace.push({
      type: 'done', slow: -1, fast: -1, result: false,
      message: 'List rỗng → không vòng → <strong>false</strong>.',
      codeLine: 7,
    });
    return trace;
  }
  let slow = 0;
  let fast = 0;
  trace.push({
    type: 'init', slow, fast, result: null,
    message: pos === -1
      ? `Không vòng (pos = −1). <strong>slow = fast = head</strong>. Thỏ đi 2, rùa đi 1.`
      : `Đuôi nối về index <strong>${pos}</strong>. <strong>slow = fast = head</strong>. Thỏ đi 2, rùa đi 1.`,
    codeLine: 1,
  });

  if (pos === -1) {
    // Đường thẳng: thỏ luôn trước rùa, tới null là hết
    while (fast + 2 < n) {
      slow += 1;
      fast += 2;
      trace.push({
        type: 'move', slow, fast, result: null,
        message: `Rùa → <strong>${vals[slow]} [${slow}]</strong>, thỏ → <strong>${vals[fast]} [${fast}]</strong>. Thỏ vẫn trước, đi tiếp.`,
        codeLine: 3,
      });
    }
    trace.push({
      type: 'done', slow, fast, result: false,
      message: `Thỏ bước tiếp sẽ ra null mà chưa gặp rùa → không vòng → <strong>false</strong>.`,
      codeLine: 7,
    });
    return trace;
  }

  // Có vòng: Floyd, di chuyển trước rồi mới so (do-while)
  let guard = 0;
  while (guard++ < 3 * n + 10) {
    slow = nxt(slow, n, pos);
    fast = nxt(nxt(fast, n, pos), n, pos);
    if (slow === fast) {
      trace.push({
        type: 'found', slow, fast, result: true,
        message: `Thỏ gặp rùa tại node <strong>${vals[slow]} [${slow}]</strong> → có vòng → <strong>true</strong>.`,
        codeLine: 6,
      });
      trace.push({
        type: 'done', slow, fast, result: true,
        message: `Hoàn tất. slow = fast → <strong>true</strong>.`,
        codeLine: 6,
      });
      return trace;
    }
    trace.push({
      type: 'move', slow, fast, result: null,
      message: `Rùa → <strong>${vals[slow]} [${slow}]</strong>, thỏ → <strong>${vals[fast]} [${fast}]</strong>. Chưa gặp, đi tiếp.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', slow, fast, result: false,
    message: 'Hoàn tất → <strong>false</strong>.',
    codeLine: 7,
  });
  return trace;
};

const CSHARP_LINES = [
  'public bool HasCycle(ListNode head) {',
  '    ListNode slow = head, fast = head;',
  '    while (fast != null && fast.next != null) {',
  '        slow = slow.next;',
  '        fast = fast.next.next;',
  '        if (slow == fast) return true;',
  '    }',
  '    return false;',
  '}',
];

export const CycleVisualizer = () => {
  const [str, setStr] = useState('3,2,0,-4');
  const [posStr, setPosStr] = useState('1');
  const [vals, setVals] = useState<number[]>([3, 2, 0, -4]);
  const [pos, setPos] = useState(1);
  const trace = useMemo(() => generateTrace(vals, pos), [vals, pos]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, p: string) => {
    const n = parseNumList(v);
    const pv = Number(p);
    if (n.length === 0 || n.length > 8 || Number.isNaN(pv) || pv < -1 || pv >= n.length) return;
    pb.restart();
    setVals(n);
    setPos(pv);
  };

  const tags: Record<number, string[]> = {};
  if (step.slow >= 0) tags[step.slow] = [...(tags[step.slow] ?? []), 'slow🐢'];
  if (step.fast >= 0) tags[step.fast] = [...(tags[step.fast] ?? []), 'fast🐇'];

  return (
    <div>
      <VizHeader
        backTo="/blog/linked-list-cycle-141" backLabel="Bài giảng Linked List Cycle"
        badge="Slow / Fast · O(1)" title="Linked List Cycle" accent="trực quan"
        sub="Rùa đi 1, thỏ đi 2: gặp nhau là có vòng, thỏ ra null là không. pos = index đuôi nối về (−1 = không vòng)."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>LIST · POS = {pos}</div>
        <Chain values={vals} tags={tags} cycleTo={pos === -1 ? null : pos} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT
        </div>
        <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.result === true ? 'var(--teal)' : 'var(--accent)', margin: 0 }}>
          {step.result === null ? '?' : step.result ? 'true' : 'false'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="list (≤8 số):" value={str} onChange={setStr} onEnter={() => build(str, posStr)} placeholder="3,2,0,-4" maxWidth={200} />
        <InputField label="pos:" value={posStr} onChange={setPosStr} onEnter={() => build(str, posStr)} placeholder="1" maxWidth={70} />
        <button className="btn" onClick={() => build(str, posStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Có vòng · pos=1', value: '3,2,0,-4|1' },
          { label: 'Không vòng · pos=-1', value: '1,2|-1' },
          { label: 'Vòng tự thân · pos=0', value: '1,2|0' },
        ]}
        onPick={(v) => {
          const [n, p] = v.split('|');
          setStr(n);
          setPosStr(p);
          build(n, p);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
