import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'calc' | 'done';
  i: number | null;
  curMax: number;
  curMin: number;
  best: number;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', i: null, curMax: 0, curMin: 0, best: 0,
    message: `Track đồng thời <strong>max và min</strong>: số âm nhân nhau lật dấu, đảo vai trò.`,
    codeLine: 1,
  });
  if (nums.length === 0) {
    trace.push({
      type: 'done', i: null, curMax: 0, curMin: 0, best: 0,
      message: 'Mảng rỗng.',
      codeLine: 1,
    });
    return trace;
  }
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];
  trace.push({
    type: 'calc', i: 0, curMax, curMin, best,
    message: `Bắt đầu: max = min = best = <strong>${nums[0]}</strong>.`,
    codeLine: 1,
  });
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const cands = [x, curMax * x, curMin * x];
    const nMax = Math.max(...cands);
    const nMin = Math.min(...cands);
    curMax = nMax;
    curMin = nMin;
    if (nMax > best) best = nMax;
    trace.push({
      type: 'calc', i, curMax, curMin, best,
      message: `x = <strong>${x}</strong>: ứng viên {${x}, ${cands[1]}, ${cands[2]}} → max = <strong>${nMax}</strong>, min = <strong>${nMin}</strong>, best = <strong>${best}</strong>${x < 0 ? ' (âm lật vai trò!)' : ''}.`,
      codeLine: 7,
    });
  }
  trace.push({
    type: 'done', i: null, curMax, curMin, best,
    message: `Hoàn tất. Tích lớn nhất = <strong>${best}</strong>.`,
    codeLine: 10,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int MaxProduct(int[] nums) {',
  '    int curMax = nums[0], curMin = nums[0], best = nums[0];',
  '    for (int i = 1; i < nums.Length; i++) {',
  '        int x = nums[i];',
  '        int[] c = { x, curMax * x, curMin * x };',
  '        curMax = c.Max();',
  '        curMin = c.Min();',
  '        best = Math.Max(best, curMax);',
  '    }',
  '    return best;',
  '}',
];

export const MaxProductVisualizer = () => {
  const [str, setStr] = useState('2,3,-2,4');
  const [nums, setNums] = useState<number[]>([2, 3, -2, 4]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v);
    if (nv.length === 0 || nv.length > 10) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/max-product-152" backLabel="Bài giảng Max Product"
        badge="Min/Max DP · O(n)" title="Max Product" accent="trực quan"
        sub="Âm × âm thành dương: min hôm nay có thể thành max ngày mai — nên track cả 2."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>MẢNG · BEST = {step.best}</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {nums.map((v, i) => (
              <ArrCell
                key={i}
                v={v}
                sub={`[${i}]`}
                state={step.i === i ? 'cur' : step.i !== null && i < step.i ? 'dim' : undefined}
              />
            ))}
          </div>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>MAX / MIN TỚI HIỆN TẠI</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ArrCell v={step.curMax} sub="curMax" state="teal" />
              <ArrCell v={step.curMin} sub="curMin" state="dim" />
            </div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
              3 ứng viên: x · max×x · min×x
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              BEST
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.best}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤10 số):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="2,3,-2,4" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · → 6', value: '2,3,-2,4' },
          { label: 'Bẫy max-only · [-2,3,-4] → 24', value: '-2,3,-4' },
          { label: 'Có 0 · [-2,0,-1] → 0', value: '-2,0,-1' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(1)" />
    </div>
  );
};
