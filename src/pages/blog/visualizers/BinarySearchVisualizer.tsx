import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions, BINARYSEARCH_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

// ===================== TRACE ENGINE (build → generateTrace → render) =====================
type StepType = 'init' | 'visit' | 'narrow' | 'done';

interface Step {
  type: StepType;
  l: number;
  r: number; // exclusive
  m: number | null;
  result: number | null; // index tìm thấy, -1 nếu miss, null nếu chưa xong
  message: string; // HTML cho phép <strong>
}

const parseNums = (str: string): number[] =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

const isSorted = (a: number[]) => a.every((v, i) => i === 0 || a[i - 1] <= v);

const generateTrace = (nums: number[], target: number): Step[] => {
  const trace: Step[] = [];
  let l = 0;
  let r = nums.length;
  trace.push({
    type: 'init',
    l,
    r,
    m: null,
    result: null,
    message: `Khởi tạo vùng tìm kiếm <strong>[l, r) = [0, ${nums.length})</strong> — nửa khoảng, r exclusive nên không off-by-one.`,
  });
  if (nums.length === 0) {
    trace.push({
      type: 'done',
      l,
      r,
      m: null,
      result: -1,
      message: `Mảng rỗng → vùng tìm kiếm rỗng ngay từ đầu → return <strong>-1</strong>.`,
    });
    return trace;
  }
  while (l < r) {
    const m = (l + r) >> 1;
    trace.push({
      type: 'visit',
      l,
      r,
      m,
      result: null,
      message: `m = (${l} + ${r}) >> 1 = <strong>${m}</strong> → nums[${m}] = <strong>${nums[m]}</strong>, so với target = <strong>${target}</strong>.`,
    });
    if (nums[m] >= target) {
      r = m;
      trace.push({
        type: 'narrow',
        l,
        r,
        m,
        result: null,
        message: `nums[${m}] = ${nums[m]} ≥ ${target} → đáp án (nếu có) nằm bên TRÁI → <strong>r = ${m}</strong>, vùng còn <strong>[${l}, ${r})</strong>.`,
      });
    } else {
      l = m + 1;
      trace.push({
        type: 'narrow',
        l,
        r,
        m,
        result: null,
        message: `nums[${m}] = ${nums[m]} < ${target} → đáp án (nếu có) nằm bên PHẢI → <strong>l = ${m + 1}</strong>, vùng còn <strong>[${l}, ${r})</strong>.`,
      });
    }
  }
  const hit = l < nums.length && nums[l] === target;
  trace.push({
    type: 'done',
    l,
    r,
    m: null,
    result: hit ? l : -1,
    message: hit
      ? `Vùng còn đúng 1 ứng viên: nums[${l}] = ${target} → return <strong>${l}</strong>.`
      : `Vùng còn lại ${l >= nums.length ? 'tràn mảng' : `nums[${l}] = ${nums[l]} ≠ ${target}`} → return <strong>-1</strong>.`,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_BS = getSolutions('binary-search-704');

const PRESETS = [
  { label: 'Tìm thấy giữa', nums: '1,3,5,7,9', target: 7 },
  { label: 'Tìm thấy đầu', nums: '2,4,6,8', target: 2 },
  { label: 'Không thấy', nums: '1,3,5,7,9', target: 4 },
  { label: '1 phần tử', nums: '5', target: 5 },
  { label: 'Mảng rỗng', nums: '', target: 1 },
];

// ===================== COMPONENT =====================
export const BinarySearchVisualizer = () => {
  const [numsStr, setNumsStr] = useState('1,3,5,7,9');
  const [targetStr, setTargetStr] = useState('7');
  const [nums, setNums] = useState<number[]>([1, 3, 5, 7, 9]);
  const [target, setTarget] = useState(7);
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
    let n = parseNums(nStr);
    const t = Number(tStr);
    if (Number.isNaN(t)) return;
    if (!isSorted(n)) n = [...n].sort((a, b) => a - b);
    pause();
    setNums(n);
    setNumsStr(n.join(','));
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

  const inRange = (i: number) => i >= step.l && i < step.r;
  const isFound = step.result !== null && step.result >= 0;

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/binary-search-704" className="btn ghost">← Bài giảng Binary Search</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      {/* 1. HEADER */}
      <div className="badge">Binary Search · Arrays</div>
      <h1>
        Binary Search <span className="accent">trực quan</span>
      </h1>
      <p>
        Xem template nửa khoảng [l, r) thu hẹp một nửa mỗi bước — ô amber là m đang xét,
        vùng mờ là phần đã loại, biên l/r bám theo từng bước.
      </p>

      {/* 2. MAIN GRID */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Visualization panel */}
        <div className="card">
          <div className="card-title"><span className="dot"></span>MẢNG NUMS · TARGET = {target}</div>
          {nums.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>mảng rỗng — vùng tìm kiếm [0, 0)</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {nums.map((v, i) => {
                const cur = step.m === i;
                const found = isFound && step.result === i;
                const out = !inRange(i);
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 14,
                        color: step.l === i ? 'var(--teal)' : step.r === i ? '#fb7185' : cur ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      {step.l === i ? 'l' : step.r === i ? 'r' : cur ? 'm' : ''}
                    </div>
                    <div
                      style={{
                        minWidth: 56,
                        textAlign: 'center',
                        padding: '10px 8px',
                        borderRadius: 10,
                        border: `2px solid ${found ? 'var(--teal)' : cur ? 'var(--accent)' : 'var(--border)'}`,
                        background: found
                          ? 'rgba(45,212,191,.2)'
                          : cur
                            ? 'var(--accent)'
                            : out
                              ? 'rgba(0,0,0,.45)'
                              : 'rgba(0,0,0,.25)',
                        opacity: out && !found ? 0.35 : 1,
                        color: cur && !found ? 'var(--bg)' : found ? 'var(--teal)' : 'var(--fg)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        fontSize: 16,
                        boxShadow: found
                          ? '0 0 18px var(--teal-glow)'
                          : cur
                            ? '0 0 18px var(--accent-glow)'
                            : 'none',
                        transform: cur ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all .3s var(--ease)',
                      }}
                    >
                      {v}
                      <div style={{ fontSize: 10, fontWeight: 400, color: 'var(--muted)', marginTop: 2 }}>
                        [{i}]
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mono" style={{ fontSize: 13, color: 'var(--teal)', margin: 0 }}>
            l = {step.l} · r = {step.r} · vùng còn lại [{step.l}, {step.r}) = {Math.max(0, step.r - step.l)} phần tử
          </p>
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        {/* State panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>BIÊN TÌM KIẾM</div>
            <div className="demo" style={{ padding: 12 }}>
              <p className="mono" style={{ fontSize: 12.5, margin: 0, color: 'var(--teal)' }}>
                l = {step.l} <span style={{ color: 'var(--muted)' }}>(bao gồm)</span>
              </p>
              <p className="mono" style={{ fontSize: 12.5, margin: '4px 0 0', color: '#fb7185' }}>
                r = {step.r} <span style={{ color: 'var(--muted)' }}>(loại trừ)</span>
              </p>
              <p className="mono" style={{ fontSize: 12.5, margin: '4px 0 0', color: 'var(--accent)' }}>
                m = {step.m === null ? '—' : step.m}
              </p>
            </div>
            <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', margin: '8px 0 0' }}>
              template [l, r): r exclusive nên l = m + 1 / r = m không off-by-one
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.result === null || step.result === undefined ? '[ ]' : `[${step.result}]`}
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>nums (sorted):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 220 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr, targetStr); }}
            placeholder="1,3,5,7,9"
          />
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>target:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 100 }}
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr, targetStr); }}
            placeholder="7"
          />
          <button className="btn" onClick={() => build(numsStr, targetStr)}>Build</button>
        </div>
        <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 0' }}>
          Mảng phải sorted — nếu nhập chưa sorted sẽ tự sort lại.
        </p>
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

      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên từng tab) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_BS}
          defaultLang="csharp"
          getHighlight={(lang) => [BINARYSEARCH_LINE_MAP[lang][step.type]]}
          meta="O(log n) · O(1)"
        />
      </div>
    </div>
  );
};
