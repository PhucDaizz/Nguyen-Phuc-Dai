import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, ArrCell, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'visit' | 'found' | 'done';
  l: number; r: number; m: number | null;
  foundIdx: number | null;
  message: string; codeLine: number;
}

const generateTrace = (nums: number[], target: number): Step[] => {
  const trace: Step[] = [];
  let l = 0;
  let r = nums.length - 1;
  trace.push({
    type: 'init', l, r, m: null, foundIdx: null,
    message: `Tìm <strong>${target}</strong>. Mỗi bước: ít nhất 1 nửa sorted — target trong nửa sorted thì vào đó.`,
    codeLine: 1,
  });
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] === target) {
      trace.push({
        type: 'found', l, r, m, foundIdx: m,
        message: `m = <strong>${m}</strong> (${nums[m]}) = target → return <strong>${m}</strong>.`,
        codeLine: 4,
      });
      trace.push({
        type: 'done', l, r, m, foundIdx: m,
        message: `Hoàn tất. Tìm thấy tại index <strong>${m}</strong>.`,
        codeLine: 4,
      });
      return trace;
    }
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) {
        trace.push({
          type: 'visit', l, r, m, foundIdx: null,
          message: `Nửa trái [${nums[l]}..${nums[m]}] sorted, ${target} nằm trong → <strong>r = ${m - 1}</strong>.`,
          codeLine: 6,
        });
        r = m - 1;
      } else {
        trace.push({
          type: 'visit', l, r, m, foundIdx: null,
          message: `Nửa trái [${nums[l]}..${nums[m]}] sorted nhưng ${target} ngoài → <strong>l = ${m + 1}</strong>.`,
          codeLine: 7,
        });
        l = m + 1;
      }
    } else {
      if (nums[m] < target && target <= nums[r]) {
        trace.push({
          type: 'visit', l, r, m, foundIdx: null,
          message: `Nửa phải [${nums[m]}..${nums[r]}] sorted, ${target} nằm trong → <strong>l = ${m + 1}</strong>.`,
          codeLine: 9,
        });
        l = m + 1;
      } else {
        trace.push({
          type: 'visit', l, r, m, foundIdx: null,
          message: `Nửa phải [${nums[m]}..${nums[r]}] sorted nhưng ${target} ngoài → <strong>r = ${m - 1}</strong>.`,
          codeLine: 10,
        });
        r = m - 1;
      }
    }
  }
  trace.push({
    type: 'done', l, r, m: null, foundIdx: null,
    message: `Hết khoảng tìm → không có ${target} → return <strong>−1</strong>.`,
    codeLine: 13,
  });
  return trace;
};

const CSHARP_LINES = [
  'public int Search(int[] nums, int target) {',
  '    int l = 0, r = nums.Length - 1;',
  '    while (l <= r) {',
  '        int m = l + (r - l) / 2;',
  '        if (nums[m] == target) return m;',
  '        if (nums[l] <= nums[m]) {',
  '            if (nums[l] <= target && target < nums[m]) r = m - 1;',
  '            else l = m + 1;',
  '        } else {',
  '            if (nums[m] < target && target <= nums[r]) l = m + 1;',
  '            else r = m - 1;',
  '        }',
  '    }',
  '    return -1;',
  '}',
];

export const RotatedSearchVisualizer = () => {
  const [str, setStr] = useState('4,5,6,7,0,1,2');
  const [tStr, setTStr] = useState('0');
  const [nums, setNums] = useState<number[]>([4, 5, 6, 7, 0, 1, 2]);
  const [target, setTarget] = useState(0);
  const trace = useMemo(() => generateTrace(nums, target), [nums, target]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string, t: string) => {
    const n = parseNumList(v);
    const tv = Number(t);
    if (n.length < 1 || Number.isNaN(tv)) return;
    pb.restart();
    setNums(n);
    setTarget(tv);
  };

  const stateOf = (i: number): 'cur' | 'teal' | 'dim' | undefined => {
    if (step.foundIdx === i) return 'teal';
    if (step.m === i) return 'cur';
    if (i < step.l || i > step.r) return 'dim';
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
        backTo="/blog/search-rotated-33" backLabel="Bài giảng Search Rotated"
        badge="Binary Search · O(log n)" title="Search Rotated" accent="trực quan"
        sub="Mỗi bước xác định nửa nào sorted, target trong nửa sorted thì vào đó. Vùng xám là phần đã loại."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>MẢNG · TARGET = {target}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {nums.map((v, i) => (
            <ArrCell key={i} v={v} sub={subOf(i)} state={stateOf(i)} />
          ))}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums:" value={str} onChange={setStr} onEnter={() => build(str, tStr)} placeholder="4,5,6,7,0,1,2" maxWidth={220} />
        <InputField label="target:" value={tStr} onChange={setTStr} onEnter={() => build(str, tStr)} placeholder="0" maxWidth={90} />
        <button className="btn" onClick={() => build(str, tStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Thấy · t=0', value: '4,5,6,7,0,1,2|0' },
          { label: 'Không thấy · t=3', value: '4,5,6,7,0,1,2|3' },
          { label: 'Đầu mảng · t=4', value: '4,5,6,7,0,1,2|4' },
          { label: '1 số · [1] t=0', value: '1|0' },
        ]}
        onPick={(v) => {
          const [n, t] = v.split('|');
          setStr(n);
          setTStr(t);
          build(n, t);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(log n) · O(1)" />
    </div>
  );
};
