import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell, parseNumList,
} from './shared';
import { getSolutions, MAXSUBARRAY_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'calc' | 'done';
  i: number | null;
  cur: number;
  best: number;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', i: null, cur: 0, best: -Infinity,
    message: `Kadane: cur = max(x, cur+x) — cộng tiếp hay bắt đầu lại. best giữ max. Khởi tạo −∞ để đúng cả mảng âm.`,
    codeLine: 1,
  });
  if (nums.length === 0) {
    trace.push({
      type: 'done', i: null, cur: 0, best: -Infinity,
      message: 'Mảng rỗng.',
      codeLine: 1,
    });
    return trace;
  }
  let cur = nums[0];
  let best = nums[0];
  trace.push({
    type: 'calc', i: 0, cur, best,
    message: `Bắt đầu: cur = best = <strong>${nums[0]}</strong>.`,
    codeLine: 1,
  });
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const extend = cur + x;
    cur = Math.max(x, extend);
    if (cur > best) best = cur;
    trace.push({
      type: 'calc', i, cur, best,
      message: `x = <strong>${x}</strong>: cộng tiếp ${extend} vs bắt đầu lại ${x} → cur = <strong>${cur}</strong>${cur === x && extend !== x ? ' (bỏ quá khứ!)' : ''}, best = <strong>${best}</strong>.`,
      codeLine: 4,
    });
  }
  trace.push({
    type: 'done', i: null, cur, best,
    message: `Hoàn tất. Dãy con tổng lớn nhất = <strong>${best}</strong>.`,
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_MAXSUBARRAY = getSolutions('max-subarray-53');

export const MaxSubarrayVisualizer = () => {
  const [str, setStr] = useState('-2,1,-3,4,-1,2,1,-5,4');
  const [nums, setNums] = useState<number[]>([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length > 10) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/max-subarray-53" backLabel="Bài giảng Maximum Subarray"
        badge="Kadane · O(n)" title="Maximum Subarray" accent="trực quan"
        sub="Mỗi số: cộng tiếp quá khứ hay bắt đầu lại từ đây — lấy max. Ô amber là đang quyết định."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>MẢNG · CUR = {step.cur} · BEST = {Number.isFinite(step.best) ? step.best : '−∞'}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {nums.map((v, i) => (
              <ArrCell
                key={i}
                v={v}
                sub={`[${i}]`}
                state={step.i === i ? 'cur' : step.i !== null && i < step.i ? 'dim' : undefined}
              />
            ))}
            {nums.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>mảng rỗng</p>
            )}
          </div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: '10px 0 0' }}>
            dim = đã qua · amber = đang xét (cộng tiếp vs bắt đầu lại)
          </p>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            BEST
          </div>
          <p className="mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
            {Number.isFinite(step.best) ? step.best : '−∞'}
          </p>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤10 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="-2,1,-3,4,-1,2,1,-5,4" maxWidth={260} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · → 6', value: '-2,1,-3,4,-1,2,1,-5,4' },
          { label: 'Toàn âm · [-1] → -1', value: '-1' },
          { label: 'Tăng · [1,2,3] → 6', value: '1,2,3' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_MAXSUBARRAY}
          defaultLang="csharp"
          getHighlight={(lang) => [MAXSUBARRAY_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
