import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell, parseNumList,
} from './shared';
import { getSolutions, JUMP_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'jump' | 'done';
  i: number | null;
  reach: number; // i + nums[i]
  goal: number;
  win: boolean; // tới được goal không
  message: string; codeLine: number;
}

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  let goal = nums.length - 1;
  trace.push({
    type: 'init', i: null, reach: 0, goal, win: false,
    message: `Goal = index cuối (<strong>${goal}</strong>). Đi từ phải sang trái: tới được goal thì goal lùi về đó.`,
    codeLine: 1,
  });
  for (let i = nums.length - 1; i >= 0; i--) {
    const reach = i + nums[i];
    const win = reach >= goal;
    if (win) goal = i;
    trace.push({
      type: 'jump', i, reach, goal, win,
      message: `i = <strong>${i}</strong> (nhảy ${nums[i]}): tới <strong>${reach}</strong> ${win ? `≥ goal → goal lùi về <strong>${i}</strong> ✓` : `< goal (${goal}) → goal giữ nguyên ✗`}.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', i: null, reach: 0, goal, win: goal === 0,
    message: goal === 0
      ? 'Goal về tới <strong>0</strong> → từ đầu đi được tới đích → <strong>true</strong>.'
      : `Goal kẹt ở <strong>${goal}</strong> → không tới được → <strong>false</strong>.`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_JUMP = getSolutions('jump-game-55');

export const JumpVisualizer = () => {
  const [str, setStr] = useState('2,3,1,1,4');
  const [nums, setNums] = useState<number[]>([2, 3, 1, 1, 4]);
  const trace = useMemo(() => generateTrace(nums), [nums]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nv = parseNumList(v).filter((x) => x >= 0);
    if (nv.length === 0 || nv.length > 10) return;
    pb.restart();
    setNums(nv);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/jump-game-55" backLabel="Bài giảng Jump Game"
        badge="Greedy Ngược · O(n)" title="Jump Game" accent="trực quan"
        sub="Goal lùi dần từ cuối về: đứng ở i mà nhảy tới goal thì goal thành i. Về tới 0 là thắng."
      />
      <div className="card">
          <div className="card-title"><span className="dot"></span>MẢNG NHẢY · GOAL = {step.goal}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {nums.map((v, i) => {
            const isCur = step.i === i;
            const isGoal = step.goal === i;
            const passed = i > step.goal;
            return (
              <ArrCell
                key={i}
                v={v}
                sub={`${isGoal ? 'GOAL ' : ''}[${i}]`}
                state={isCur ? (step.win ? 'teal' : 'bad') : isGoal ? 'teal' : passed ? 'dim' : undefined}
              />
            );
          })}
        </div>
        {step.i !== null && step.type === 'jump' && (
          <p className="mono" style={{ fontSize: 12.5, margin: '12px 0 0', color: step.win ? 'var(--teal)' : '#ff5f57' }}>
            {step.i} + {nums[step.i]} = {step.reach} {step.win ? `≥ goal → goal = ${step.i} ✓` : `< goal → giữ ✗`}
          </p>
        )}
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="nums (≤10 số ≥0):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="2,3,1,1,4" maxWidth={220} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Được · [2,3,1,1,4]', value: '2,3,1,1,4' },
          { label: 'Kẹt số 0 · [3,2,1,0,4]', value: '3,2,1,0,4' },
          { label: '1 số · [0] → true', value: '0' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_JUMP}
          defaultLang="csharp"
          getHighlight={(lang) => [JUMP_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
