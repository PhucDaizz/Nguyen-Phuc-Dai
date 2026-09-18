import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'visit' | 'found' | 'store' | 'done';
  current: number | null; // index đang xét
  value: number | null;
  hit: boolean; // value đã có trong set chưa
  seen: number[]; // set tại step này
  result: boolean | null;
  dupIndex: number | null; // index lần đầu thấy giá trị trùng
  message: string;
  codeLine: number; // 0-based
}

const parseNums = (str: string): number[] =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

const generateTrace = (nums: number[]): Step[] => {
  const trace: Step[] = [];
  const seen = new Set<number>();
  const firstIdx = new Map<number, number>();
  const snap = () => [...seen];

  trace.push({
    type: 'init', current: null, value: null, hit: false,
    seen: [], result: null, dupIndex: null,
    message: 'Khởi tạo: <strong>seen = {}</strong>. Mỗi số chỉ hỏi 1 câu: “đã thấy mày chưa?”.',
    codeLine: 1,
  });

  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    trace.push({
      type: 'visit', current: i, value: x, hit: false,
      seen: snap(), result: null, dupIndex: null,
      message: `Xét <strong>nums[${i}] = ${x}</strong> — có trong set chưa?`,
      codeLine: 3,
    });
    if (seen.has(x)) {
      trace.push({
        type: 'found', current: i, value: x, hit: true,
        seen: snap(), result: true, dupIndex: firstIdx.get(x) ?? null,
        message: `<strong>${x}</strong> đã thấy ở index ${firstIdx.get(x)} → trùng! Return <strong>true</strong>.`,
        codeLine: 4,
      });
      trace.push({
        type: 'done', current: i, value: x, hit: true,
        seen: snap(), result: true, dupIndex: firstIdx.get(x) ?? null,
        message: `Hoàn tất. <strong>${x}</strong> xuất hiện ≥ 2 lần → <strong>true</strong>.`,
        codeLine: 4,
      });
      return trace;
    }
    seen.add(x);
    firstIdx.set(x, i);
    trace.push({
      type: 'store', current: i, value: x, hit: false,
      seen: snap(), result: null, dupIndex: null,
      message: `<strong>${x}</strong> chưa có → add vào set.`,
      codeLine: 3,
    });
  }

  trace.push({
    type: 'done', current: null, value: null, hit: false,
    seen: snap(), result: false, dupIndex: null,
    message: nums.length === 0
      ? 'Mảng rỗng — không có gì để trùng → <strong>false</strong>.'
      : 'Duyệt hết mảng, mọi phần tử đều khác nhau → <strong>false</strong>.',
    codeLine: 6,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public bool ContainsDuplicate(int[] nums) {',
  '    var seen = new HashSet<int>();',
  '    foreach (int x in nums) {',
  '        if (!seen.Add(x))',
  '            return true;',
  '    }',
  '    return false;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · [1,2,3,1] → true', nums: '1,2,3,1' },
  { label: 'Không trùng · [1,2,3,4] → false', nums: '1,2,3,4' },
  { label: 'Dài · [1,1,1,3,3,4,3,2,4,2]', nums: '1,1,1,3,3,4,3,2,4,2' },
  { label: '1 phần tử · [0] → false', nums: '0' },
  { label: 'Rỗng · [] → false', nums: '' },
];

// ===================== COMPONENT =====================
export const DuplicateVisualizer = () => {
  const [numsStr, setNumsStr] = useState('1,2,3,1');
  const [nums, setNums] = useState<number[]>([1, 2, 3, 1]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(nums), [nums]);
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
  const build = (nStr: string) => {
    // Cho phép mảng rỗng để demo edge case
    const n = nStr.trim() === '' ? [] : parseNums(nStr);
    if (nStr.trim() !== '' && n.length === 0) return;
    pause();
    setNums(n);
    setStepIdx(0);
  };

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

  const seenSet = new Set(step.seen);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/contains-duplicate-217" className="btn ghost">← Bài giảng Contains Duplicate</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      {/* 1. HEADER */}
      <div className="badge">Hash Set · Arrays</div>
      <h1>
        Contains Duplicate <span className="accent">trực quan</span>
      </h1>
      <p>
        Mỗi số chỉ bị hỏi 1 câu “đã thấy chưa” — ô amber là số đang xét, ô teal là số đã lưu,
        gặp lại số cũ là trùng ngay, tô sáng cả 2 vị trí.
      </p>

      {/* 2. MAIN GRID */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Visualization panel */}
        <div className="card">
          <div className="card-title"><span className="dot"></span>MẢNG NUMS</div>
          {nums.length === 0 ? (
            <p className="mono" style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>[ ] — mảng rỗng</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {nums.map((v, i) => {
                const isCur = step.current === i;
                const isDupPair = step.dupIndex === i || (step.hit && step.current === i);
                const isSeen = seenSet.has(v) && !(step.hit && step.current === i);
                return (
                  <div
                    key={i}
                    style={{
                      minWidth: 56,
                      textAlign: 'center',
                      padding: '10px 8px',
                      borderRadius: 10,
                      border: `2px solid ${isDupPair ? 'var(--teal)' : isCur ? 'var(--accent)' : isSeen ? 'rgba(45,212,191,.5)' : 'var(--border)'}`,
                      background: isDupPair
                        ? 'rgba(45,212,191,.2)'
                        : isCur
                          ? 'var(--accent)'
                          : isSeen
                            ? 'rgba(45,212,191,.08)'
                            : 'rgba(0,0,0,.25)',
                      color: isCur && !step.hit ? 'var(--bg)' : isDupPair || isSeen ? 'var(--teal)' : 'var(--fg)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 16,
                      boxShadow: isDupPair
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
          )}
          {step.value !== null && (
            <p className="mono" style={{ fontSize: 13, color: step.hit ? 'var(--teal)' : 'var(--accent)', margin: 0 }}>
              {step.value} {step.hit ? '✓ đã có trong set → TRÙNG' : '✗ chưa có → add'}
            </p>
          )}
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        {/* State panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>SEEN SET</div>
            {step.seen.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>set rỗng</p>
            ) : (
              <div className="demo" style={{ padding: 12 }}>
                <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--accent)' }}>
                  {'{ '}{step.seen.join(', ')}{' }'}
                </p>
              </div>
            )}
            <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', margin: '8px 0 0' }}>size = {step.seen.length}</p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.result === true ? 'var(--teal)' : 'var(--accent)', margin: 0 }}>
              {step.result === null ? '?' : step.result ? 'true' : 'false'}
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
            style={{ maxWidth: 260 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr); }}
            placeholder="1,2,3,1"
          />
          <button className="btn" onClick={() => build(numsStr)}>Build</button>
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
              build(p.nums);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
        Phím tắt: Space Play/Pause · → Step · ← Back · R Reset
      </p>

      {/* 6. CODE PANEL C# */}
      <div className="code-block" style={{ marginTop: 14 }}>
        <div className="code-head">
          <div className="dots">
            <i style={{ background: '#ff5f57' }} />
            <i style={{ background: '#febc2e' }} />
            <i style={{ background: '#28c840' }} />
          </div>
          <div className="name">Solution.cs<span className="live" /></div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>O(n) · O(n)</div>
        </div>
        <pre>
          <code>
            {CSHARP_LINES.map((ln, i) => (
              <span key={i} className={`line ${step.codeLine === i ? 'active' : ''}`}>
                {ln || ' '}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
