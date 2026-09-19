import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions, TWOSUM_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

// ===================== TRACE ENGINE (build → generateTrace → render) =====================
interface MapEntry {
  val: number;
  idx: number;
}

interface Step {
  type: 'init' | 'visit' | 'check' | 'found' | 'store' | 'done';
  current: number | null; // index đang xét
  need: number | null; // phần bù đang hỏi
  needHit: boolean; // need có trong map không
  seen: MapEntry[]; // map tại step này
  result: number[] | null;
  message: string; // HTML cho phép <strong>
  codeLine: number; // 0-based
}

const parseNums = (str: string): number[] =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

const generateTrace = (nums: number[], target: number): Step[] => {
  const trace: Step[] = [];
  const seen = new Map<number, number>();
  const snap = () => [...seen.entries()].map(([val, idx]) => ({ val, idx }));

  trace.push({
    type: 'init',
    current: null,
    need: null,
    needHit: false,
    seen: [],
    result: null,
    message: `Khởi tạo: <strong>seen = {}</strong>, duyệt từng số, hỏi “<strong>${target} − x</strong> đã thấy chưa?”.`,
    codeLine: 2,
  });

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    trace.push({
      type: 'visit',
      current: i,
      need,
      needHit: false,
      seen: snap(),
      result: null,
      message: `Xét <strong>nums[${i}] = ${nums[i]}</strong> → cần <strong>need = ${target} − ${nums[i]} = ${need}</strong>.`,
      codeLine: 4,
    });
    if (seen.has(need)) {
      const j = seen.get(need)!;
      trace.push({
        type: 'found',
        current: i,
        need,
        needHit: true,
        seen: snap(),
        result: [j, i],
        message: `<strong>${need}</strong> đã có trong map (index ${j}) → return <strong>[${j}, ${i}]</strong>.`,
        codeLine: 6,
      });
      trace.push({
        type: 'done',
        current: i,
        need,
        needHit: true,
        seen: snap(),
        result: [j, i],
        message: `Hoàn tất. Result = <strong>[${j}, ${i}]</strong> vì nums[${j}] + nums[${i}] = ${target}.`,
        codeLine: 9,
      });
      return trace;
    }
    trace.push({
      type: 'check',
      current: i,
      need,
      needHit: false,
      seen: snap(),
      result: null,
      message: `<strong>${need}</strong> chưa có trong map → miss.`,
      codeLine: 5,
    });
    seen.set(nums[i], i);
    trace.push({
      type: 'store',
      current: i,
      need: null,
      needHit: false,
      seen: snap(),
      result: null,
      message: `Lưu <strong>${nums[i]} → ${i}</strong> vào map để các số sau hỏi.`,
      codeLine: 7,
    });
  }

  trace.push({
    type: 'done',
    current: null,
    need: null,
    needHit: false,
    seen: snap(),
    result: null,
    message: `Duyệt hết mảng, không cặp nào cộng bằng <strong>${target}</strong> → trả về mảng rỗng.`,
    codeLine: 9,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_TWOSUM = getSolutions('two-sum-1');

const PRESETS = [
  { label: 'Cơ bản · [2,7,11,15], t=9', nums: '2,7,11,15', target: 9 },
  { label: 'LeetCode · [3,2,4], t=6', nums: '3,2,4', target: 6 },
  { label: 'Trùng số · [3,3], t=6', nums: '3,3', target: 6 },
  { label: 'Cặp cuối · [1,2,3,4,5], t=9', nums: '1,2,3,4,5', target: 9 },
  { label: 'Vô nghiệm · [1,2,3], t=7', nums: '1,2,3', target: 7 },
];

// ===================== COMPONENT =====================
export const TwoSumVisualizer = () => {
  const [numsStr, setNumsStr] = useState('2,7,11,15');
  const [targetStr, setTargetStr] = useState('9');
  const [nums, setNums] = useState<number[]>([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(nums, target), [nums, target]);
  const step: Step = trace[Math.min(stepIdx, trace.length - 1)];

  const pause = useCallback(() => {
    setPlaying(false);
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= trace.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setStepIdx((i) => i + 1), speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, stepIdx, speed, trace.length]);

  useEffect(() => () => pause(), [pause]);

  const play = () => {
    if (stepIdx >= trace.length - 1) setStepIdx(0);
    setPlaying(true);
  };
  const stepFwd = () => {
    pause();
    setStepIdx((i) => Math.min(i + 1, trace.length - 1));
  };
  const stepBack = () => {
    pause();
    setStepIdx((i) => Math.max(i - 1, 0));
  };
  const reset = () => {
    pause();
    setStepIdx(0);
  };
  const build = (nStr: string, tStr: string) => {
    const n = parseNums(nStr);
    const t = Number(tStr);
    if (n.length === 0 || Number.isNaN(t)) return;
    pause();
    setNums(n);
    setTarget(t);
    setStepIdx(0);
  };

  // Phím tắt (bỏ qua khi focus input)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        playing ? pause() : play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFwd();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBack();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stepIdx, trace.length]);

  const seenIdx = new Set(step.seen.map((s) => s.idx));
  const foundIdx = new Set(step.result ?? []);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/two-sum-1" className="btn ghost">← Bài giảng Two Sum</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      {/* 1. HEADER */}
      <div className="badge">Hash Map · Arrays</div>
      <h1>
        Two Sum <span className="accent">trực quan</span>
      </h1>
      <p>
        Xem từng bước thuật toán hỏi “phần bù còn thiếu” trong map — ô amber là số đang xét,
        ô teal là số đã lưu, cặp tìm thấy sáng xanh.
      </p>

      {/* 2. MAIN GRID */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Visualization panel */}
        <div className="card">
          <div className="card-title"><span className="dot"></span>MẢNG NUMS · TARGET = {target}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {nums.map((v, i) => {
              const isCur = step.current === i;
              const isFound = foundIdx.has(i);
              const isSeen = seenIdx.has(i);
              return (
                <div
                  key={i}
                  style={{
                    minWidth: 56,
                    textAlign: 'center',
                    padding: '10px 8px',
                    borderRadius: 10,
                    border: `2px solid ${isFound ? 'var(--teal)' : isCur ? 'var(--accent)' : isSeen ? 'rgba(45,212,191,.5)' : 'var(--border)'}`,
                    background: isFound
                      ? 'rgba(45,212,191,.2)'
                      : isCur
                        ? 'var(--accent)'
                        : isSeen
                          ? 'rgba(45,212,191,.08)'
                          : 'rgba(0,0,0,.25)',
                    color: isCur && !isFound ? 'var(--bg)' : isFound || isSeen ? 'var(--teal)' : 'var(--fg)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: isFound
                      ? '0 0 18px var(--teal-glow)'
                      : isCur
                        ? '0 0 18px var(--accent-glow)'
                        : 'none',
                    transform: isCur ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all .3s var(--ease)',
                  }}
                >
                  {v}
                  <div style={{ fontSize: 10, fontWeight: 400, color: 'var(--muted)', marginTop: 2 }}>
                    [{i}]
                  </div>
                </div>
              );
            })}
          </div>
          {step.need !== null && (
            <p className="mono" style={{ fontSize: 13, color: step.needHit ? 'var(--teal)' : 'var(--accent)', margin: 0 }}>
              need = {target} − {step.current !== null ? nums[step.current] : '?'} = {step.need}
              {step.needHit ? ' ✓ có trong map' : ' ✗ chưa có'}
            </p>
          )}
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        {/* State panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>SEEN MAP (value → index)</div>
            {step.seen.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>map rỗng</p>
            ) : (
              <div className="demo" style={{ padding: 12 }}>
                {step.seen.map((s) => (
                  <p key={`${s.val}-${s.idx}`} className="mono" style={{ fontSize: 12.5, margin: 0, color: 'var(--accent)' }}>
                    {s.val} <span style={{ color: 'var(--muted)' }}>→</span> [{s.idx}]
                  </p>
                ))}
              </div>
            )}
            <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', margin: '8px 0 0' }}>size = {step.seen.length}</p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.result ? `[${step.result.join(', ')}]` : '[ ]'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. DESCRIPTION BAR */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
        <span className="mono" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)', fontWeight: 700, fontSize: 13, padding: '6px 12px', borderRadius: 8, flexShrink: 0 }}>
          {stepIdx + 1} / {trace.length}
        </span>
        <p style={{ margin: 0, fontSize: 14.5 }} dangerouslySetInnerHTML={{ __html: step.message }} />
      </div>

      {/* 4. CONTROLS */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <button className="btn primary" onClick={playing ? pause : play}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn" onClick={stepBack} disabled={stepIdx <= 0}>Back</button>
          <button className="btn" onClick={stepFwd} disabled={stepIdx >= trace.length - 1}>Step</button>
          <button className="btn" onClick={reset}>Reset</button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 12 }}>
            Tốc độ
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: 90, accentColor: '#ffb547' }}
            />
            <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', minWidth: 52 }}>{speed}ms</span>
          </span>
        </div>
        <div className="btn-row" style={{ marginTop: 10 }}>
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>nums:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 220 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr, targetStr); }}
            placeholder="2,7,11,15"
          />
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>target:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 100 }}
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr, targetStr); }}
            placeholder="9"
          />
          <button className="btn" onClick={() => build(numsStr, targetStr)}>Build</button>
        </div>
      </div>

      {/* 5. PRESETS */}
      <div className="btn-row" style={{ marginTop: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn ghost"
            onClick={() => {
              setNumsStr(p.nums);
              setTargetStr(String(p.target));
              build(p.nums, String(p.target));
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
        Phím tắt: Space Play/Pause · → Step · ← Back · R Reset
      </p>

      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_TWOSUM}
          defaultLang="csharp"
          getHighlight={(lang) => [TWOSUM_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(n)"
        />
      </div>
    </div>
  );
};
