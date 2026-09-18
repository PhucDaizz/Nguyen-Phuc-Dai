import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'visit' | 'done';
  l: number; r: number; m: number | null;
  goRight: boolean | null;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  let l = 0;
  let r = nums.length - 1;
  trace.push({
    type: 'init', l, r, m: null, goRight: null,
    message: `Mảng xoay đã sort, số phân biệt. So <strong>nums[mid]</strong> với <strong>nums[right]</strong> để biết min nằm nửa nào.`,
    codeLine: 1,
  });
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] > nums[r]) {
      trace.push({
        type: 'visit', l, r, m, goRight: true,
        message: `m = <strong>${m}</strong> (${nums[m]}) > nums[r] = ${nums[r]} → min nằm nửa phải → <strong>l = ${m + 1}</strong>.`,
        codeLine: 4,
      });
      l = m + 1;
    } else {
      trace.push({
        type: 'visit', l, r, m, goRight: false,
        message: `m = <strong>${m}</strong> (${nums[m]}) ≤ nums[r] = ${nums[r]} → min nằm nửa trái (kể cả m) → <strong>r = ${m}</strong>.`,
        codeLine: 5,
      });
      r = m;
    }
  }
  trace.push({
    type: 'done', l, r, m: null, goRight: null,
    message: `l = r = <strong>${l}</strong> → min = <strong>nums[${l}] = ${nums[l]}</strong>.`,
    codeLine: 7,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int FindMin(int[] nums) {',
  '    int l = 0, r = nums.Length - 1;',
  '    while (l < r) {',
  '        int m = l + (r - l) / 2;',
  '        if (nums[m] > nums[r]) l = m + 1;',
  '        else r = m;',
  '    }',
  '    return nums[l];',
  '}',
];

const isRotatedSorted = (a: number[]) => {
  if (a.length < 2) return true;
  const s = [...a].sort((x, y) => x - y);
  const key = a.join(',');
  for (let k = 0; k < s.length; k++) {
    const rot = [...s.slice(k), ...s.slice(0, k)].join(',');
    if (rot === key) return true;
  }
  return false;
};

export const RotatedMinVisualizer = () => {
  const [str, setStr] = useState('3,4,5,1,2');
  const [nums, setNums] = useState<number[]>([3, 4, 5, 1, 2]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];
  const valid = isRotatedSorted(nums);

  const build = (v: string) => {
    const n = parseNumList(v);
    if (n.length < 2 || new Set(n).size !== n.length) return;
    pb.restart();
    setNums(n);
  };

  const stateOf = (i: number): 'cur' | 'teal' | 'dim' | undefined => {
    if (step.m === i) return 'cur';
    if (i < step.l || i > step.r) return 'dim';
    if (step.type === 'done' && i === step.l) return 'teal';
    return undefined;
  };
  const subOf = (i: number) => {
    const t: string[] = [`[${i}]`];
    if (step.l === i) t.push('L');
    if (step.r === i) t.push('R');
    if (step.m === i) t.push('M');
    return t.join(' ');
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/find-min-rotated-153" backLabel="Bài giảng Find Min Rotated"
        badge="Binary Search · O(log n)" title="Find Minimum" accent="trực quan"
        sub="So nums[mid] với nums[right]: lớn hơn thì min ở nửa phải, không thì ở nửa trái. Vùng xám là nửa đã loại."
      />
      {!valid && (
        <div className="rule" style={{ borderColor: 'rgba(255,95,87,.4)' }}>
          <p style={{ margin: 0 }}>Mảng này không phải dạng xoay của mảng đã sort (hoặc có số trùng) — kết quả chỉ mang tính minh họa.</p>
        </div>
      )}
      <div className="card">
        <div className="card-title"><span className="dot"></span>MẢNG · L={step.l} R={step.r}{step.m !== null ? ` M=${step.m}` : ''}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {nums.map((v, i) => (
            <ArrCell key={i} v={v} sub={subOf(i)} state={stateOf(i)} />
          ))}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (phân biệt):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="3,4,5,1,2" maxWidth={260} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Cơ bản · [3,4,5,1,2]', value: '3,4,5,1,2' },
          { label: 'LeetCode · [4,5,6,7,0,1,2]', value: '4,5,6,7,0,1,2' },
          { label: 'Chưa xoay · [11,13,15,17]', value: '11,13,15,17' },
          { label: '2 số · [2,1]', value: '2,1' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(log n) · O(1)" />
    </div>
  );
};
