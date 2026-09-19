import { useMemo, useState } from 'react';
import { getSolutions, COMBO_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, parseNumList,
} from './shared';

interface Step {
  type: 'init' | 'take' | 'skip' | 'save' | 'cut' | 'done';
  i: number | null; // index candidate đang xét
  cur: number[];
  sum: number;
  result: number[][];
  message: string; codeLine: number;
}

const generateTrace = (cands: number[], target: number): Step[] => {
  const trace: Step[] = [];
  const res: number[][] = [];
  const snapRes = () => res.map((c) => [...c]);
  trace.push({
    type: 'init', i: null, cur: [], sum: 0, result: [],
    message: `candidates = [${cands.join(', ')}], target = <strong>${target}</strong>. Mỗi vị trí: nhánh <strong>lấy</strong> (giữ index, dùng lại được) / nhánh <strong>bỏ</strong> (index+1).`,
    codeLine: 2,
  });

  const dfs = (i: number, cur: number[], sum: number): void => {
    if (sum === target) {
      res.push([...cur]);
      trace.push({
        type: 'save', i, cur: [...cur], sum, result: snapRes(),
        message: `sum = <strong>${target}</strong> ✓ → lưu [${cur.join(', ')}] (bản sao).`,
        codeLine: 4,
      });
      return;
    }
    if (sum > target || i >= cands.length) {
      if (sum > target) {
        trace.push({
          type: 'cut', i, cur: [...cur], sum, result: snapRes(),
          message: `sum = <strong>${sum} > ${target}</strong> → cắt nhánh.`,
          codeLine: 8,
        });
      }
      return;
    }
    // nhánh lấy
    cur.push(cands[i]);
    trace.push({
      type: 'take', i, cur: [...cur], sum: sum + cands[i], result: snapRes(),
      message: `Lấy <strong>${cands[i]} [${i}]</strong> → cur = [${[...cur].join(', ')}], sum = ${sum + cands[i]}. Giữ index ${i} (được dùng lại).`,
      codeLine: 10,
    });
    dfs(i, cur, sum + cands[i]);
    cur.pop();
    // nhánh bỏ
    trace.push({
      type: 'skip', i, cur: [...cur], sum, result: snapRes(),
      message: `Bỏ <strong>${cands[i]} [${i}]</strong> → sang index <strong>${i + 1}</strong>, cur = [${cur.join(', ') || '∅'}].`,
      codeLine: 12,
    });
    dfs(i + 1, cur, sum);
  };
  dfs(0, [], 0);

  trace.push({
    type: 'done', i: null, cur: [], sum: 0, result: snapRes(),
    message: res.length === 0
      ? `Hoàn tất. Không tổ hợp nào → <strong>[]</strong>.`
      : `Hoàn tất. Tìm được <strong>${res.length}</strong> tổ hợp.`,
    codeLine: 2,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_COMBO = getSolutions('combination-sum-39');

export const CombinationVisualizer = () => {
  const [cStr, setCStr] = useState('2,3,6,7');
  const [tStr, setTStr] = useState('7');
  const [cands, setCands] = useState<number[]>([2, 3, 6, 7]);
  const [target, setTarget] = useState(7);
  const trace = useMemo(() => generateTrace(cands, target), [cands, target]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const na = parseNumList(a);
    const nt = Number(b);
    if (na.length === 0 || na.length > 5 || Number.isNaN(nt) || nt < 1 || nt > 30) return;
    pb.restart();
    setCands([...na].sort((x, y) => x - y));
    setTarget(nt);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/combination-sum-39" backLabel="Bài giảng Combination Sum"
        badge="Backtracking · Pick/Skip" title="Combination Sum" accent="trực quan"
        sub="Mỗi vị trí rẽ 2 nhánh: lấy (giữ index, dùng lại được) hoặc bỏ (sang index+1). Sum vượt là cắt."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>CANDIDATES · TARGET = {target}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cands.map((v, i) => {
              const isCur = step.i === i && (step.type === 'take' || step.type === 'skip' || step.type === 'save' || step.type === 'cut');
              return (
                <div
                  key={i}
                  style={{
                    minWidth: 48, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                    border: `2px solid ${isCur ? 'var(--accent)' : 'var(--border)'}`,
                    background: isCur ? 'rgba(255,181,71,.12)' : 'rgba(0,0,0,.25)',
                    color: isCur ? 'var(--accent)' : 'var(--fg)',
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                    boxShadow: isCur ? '0 0 12px var(--accent-glow)' : 'none',
                  }}
                >
                  {v}
                  <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>[{i}]</div>
                </div>
              );
            })}
          </div>
          <div className="card-title" style={{ marginTop: 14 }}>
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            CUR = [{step.cur.join(', ') || '∅'}] · SUM = {step.sum}
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, (step.sum / target) * 100)}%`,
                height: '100%',
                background: step.sum > target ? '#ff5f57' : step.sum === target ? 'var(--teal)' : 'var(--accent)',
                transition: 'all .3s var(--ease)',
              }}
            />
          </div>
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            TỔ HỢP TÌM ĐƯỢC ({step.result.length})
          </div>
          {step.result.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>chưa có</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {step.result.map((c, i) => (
                <p key={i} className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
                  [{c.join(', ')}]
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="candidates (≤5 số, đã sort auto):" value={cStr} onChange={setCStr} onEnter={() => build(cStr, tStr)} placeholder="2,3,6,7" maxWidth={180} />
        <InputField label="target (≤30):" value={tStr} onChange={setTStr} onEnter={() => build(cStr, tStr)} placeholder="7" maxWidth={80} />
        <button className="btn" onClick={() => build(cStr, tStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · t=7', value: '2,3,6,7|7' },
          { label: 'Nhỏ · [2,5] t=8', value: '2,5|8' },
          { label: 'Vô nghiệm · [2] t=1', value: '2|1' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setCStr(a);
          setTStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_COMBO}
          defaultLang="csharp"
          getHighlight={(lang) => [COMBO_LINE_MAP[lang][step.type]]}
          meta="Backtracking"
        />
      </div>
    </div>
  );
};
