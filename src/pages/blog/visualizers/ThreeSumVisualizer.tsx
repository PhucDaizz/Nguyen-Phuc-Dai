import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'outer' | 'skip' | 'inner' | 'found' | 'done';
  fixed: number | null; // index i cố định
  l: number | null;
  r: number | null;
  sum: number | null;
  triplets: number[][];
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

const generateTrace = (input: number[]): Step[] => {
  const nums = [...input].sort((a, b) => a - b);
  const trace: Step[] = [];
  const res: number[][] = [];
  const snap = () => res.map((t) => [...t]);

  trace.push({
    type: 'init', fixed: null, l: null, r: null, sum: null,
    triplets: [],
    message: `Sort tăng dần → [<strong>${nums.join(', ')}</strong>]. Cố định 1 số, 2 số còn lại two-pointers.`,
    codeLine: 1,
  });

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      trace.push({
        type: 'skip', fixed: i, l: null, r: null, sum: null,
        triplets: snap(),
        message: `i = <strong>${i}</strong> (${nums[i]} trùng ${nums[i - 1]}) → <strong>skip</strong> để khỏi trùng bộ ba.`,
        codeLine: 4,
      });
      continue;
    }
    let l = i + 1;
    let r = nums.length - 1;
    trace.push({
      type: 'outer', fixed: i, l, r, sum: null,
      triplets: snap(),
      message: `Cố định <strong>nums[${i}] = ${nums[i]}</strong>, l = ${l}, r = ${r}. Cần l+r = ${-nums[i]}.`,
      codeLine: 5,
    });
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        trace.push({
          type: 'found', fixed: i, l, r, sum,
          triplets: snap(),
          message: `<strong>${nums[i]} + ${nums[l]} + ${nums[r]} = 0</strong> → lưu [${nums[i]}, ${nums[l]}, ${nums[r]}]. Skip trùng 2 đầu rồi chụm vào.`,
          codeLine: 9,
        });
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      } else {
        trace.push({
          type: 'inner', fixed: i, l, r, sum,
          triplets: snap(),
          message: `<strong>${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}</strong> ${sum < 0 ? '< 0 → <strong>l++</strong> (cần tổng lớn hơn)' : '> 0 → <strong>r−−</strong> (cần tổng nhỏ hơn)'}.`,
          codeLine: sum < 0 ? 13 : 14,
        });
        if (sum < 0) l++;
        else r--;
      }
    }
  }

  trace.push({
    type: 'done', fixed: null, l: null, r: null, sum: null,
    triplets: snap(),
    message: res.length === 0
      ? 'Hoàn tất. Không có bộ ba nào tổng bằng 0 → <strong>[]</strong>.'
      : `Hoàn tất. Tìm được <strong>${res.length}</strong> bộ ba: ${res.map((t) => `[${t.join(', ')}]`).join(' ')}.`,
    codeLine: 17,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public IList<IList<int>> ThreeSum(int[] nums) {',
  '    Array.Sort(nums);',
  '    var res = new List<IList<int>>();',
  '    for (int i = 0; i < nums.Length - 2; i++) {',
  '        if (i > 0 && nums[i] == nums[i - 1]) continue;',
  '        int l = i + 1, r = nums.Length - 1;',
  '        while (l < r) {',
  '            int sum = nums[i] + nums[l] + nums[r];',
  '            if (sum == 0) {',
  '                res.Add(new List<int> { nums[i], nums[l], nums[r] });',
  '                while (l < r && nums[l] == nums[l + 1]) l++;',
  '                while (l < r && nums[r] == nums[r - 1]) r--;',
  '                l++; r--;',
  '            }',
  '            else if (sum < 0) l++;',
  '            else r--;',
  '        }',
  '    }',
  '    return res;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · [-1,0,1,2,-1,-4]', nums: '-1,0,1,2,-1,-4' },
  { label: 'Toàn 0 · [0,0,0]', nums: '0,0,0' },
  { label: 'Vô nghiệm · [1,2,-2,-1]', nums: '1,2,-2,-1' },
  { label: 'Nhỏ · [-1,0,1]', nums: '-1,0,1' },
];

// ===================== COMPONENT =====================
export const ThreeSumVisualizer = () => {
  const [numsStr, setNumsStr] = useState('-1,0,1,2,-1,-4');
  const [input, setInput] = useState<number[]>([-1, 0, 1, 2, -1, -4]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const sorted = useMemo(() => [...input].sort((a, b) => a - b), [input]);
  const trace = useMemo(() => generateTrace(input), [input]);
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
    const n = parseNums(nStr);
    if (n.length < 3 || n.length > 10) return;
    pause();
    setInput(n);
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

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/three-sum-15" className="btn ghost">← Bài giảng 3Sum</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Sort + Two Pointers · O(n²)</div>
      <h1>
        3Sum <span className="accent">trực quan</span>
      </h1>
      <p>
        Mảng đã sort: ô tím là số cố định i, 2 ô amber là l/r đang xét. Tổng = 0 thì lưu,
        âm thì l++, dương thì r−−, trùng thì skip.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title"><span className="dot"></span>MẢNG ĐÃ SORT</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sorted.map((v, i) => {
              const isFixed = step.fixed === i;
              const isLR = step.l === i || step.r === i;
              return (
                <div
                  key={i}
                  style={{
                    minWidth: 48,
                    textAlign: 'center',
                    padding: '8px 6px',
                    borderRadius: 8,
                    border: `2px solid ${isFixed ? '#c4b5fd' : isLR ? 'var(--accent)' : 'var(--border)'}`,
                    background: isFixed
                      ? 'rgba(196,181,253,.15)'
                      : isLR
                        ? 'var(--accent)'
                        : 'rgba(0,0,0,.25)',
                    color: isFixed ? '#c4b5fd' : isLR ? 'var(--bg)' : 'var(--fg)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: isFixed
                      ? '0 0 12px rgba(196,181,253,.4)'
                      : isLR
                        ? '0 0 12px var(--accent-glow)'
                        : 'none',
                    transition: 'all .3s var(--ease)',
                  }}
                >
                  {v}
                  <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>
                    {isFixed ? 'i' : ''}{step.l === i ? 'l' : ''}{step.r === i ? 'r' : ''}&nbsp;
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mono" style={{ fontSize: 13, margin: '12px 0 0', color: step.sum === 0 && step.sum !== null ? 'var(--teal)' : 'var(--accent)' }}>
            {step.sum === null
              ? '—'
              : `sum = ${sorted[step.fixed!]} + ${sorted[step.l!]} + ${sorted[step.r!]} = ${step.sum}${step.sum === 0 ? ' ✓ LƯU' : ''}`}
          </p>
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 12 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>SỐ CỐ ĐỊNH i</div>
            <p className="mono" style={{ fontSize: 15, margin: 0, color: '#c4b5fd' }}>
              {step.fixed === null ? '—' : `i = ${step.fixed} (=${sorted[step.fixed]})`}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.fixed === null ? '—' : `cần l + r = ${-sorted[step.fixed]}`}
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              BỘ BA TÌM ĐƯỢC ({step.triplets.length})
            </div>
            {step.triplets.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>chưa có</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {step.triplets.map((t, i) => (
                  <p key={i} className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
                    [{t.join(', ')}]
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
        <span className="mono" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)', fontWeight: 700, fontSize: 13, padding: '6px 12px', borderRadius: 8, flexShrink: 0 }}>
          {stepIdx + 1} / {trace.length}
        </span>
        <p style={{ margin: 0, fontSize: 14.5 }} dangerouslySetInnerHTML={{ __html: step.message }} />
      </div>

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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>nums (3–10 số):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 260 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr); }}
            placeholder="-1,0,1,2,-1,-4"
          />
          <button className="btn" onClick={() => build(numsStr)}>Build</button>
        </div>
      </div>

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

      <div className="code-block" style={{ marginTop: 14 }}>
        <div className="code-head">
          <div className="dots">
            <i style={{ background: '#ff5f57' }} />
            <i style={{ background: '#febc2e' }} />
            <i style={{ background: '#28c840' }} />
          </div>
          <div className="name">Solution.cs<span className="live" /></div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>O(n²) · O(1)</div>
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
