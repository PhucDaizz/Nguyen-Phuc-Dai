import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'visit' | 'move' | 'done';
  l: number;
  r: number;
  area: number;
  best: number;
  bestPair: [number, number] | null;
  moveSide: 'l' | 'r' | null; // bên vừa dời ở step này
  message: string;
  codeLine: number; // 0-based
}

const parseNums = (str: string): number[] =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !Number.isNaN(n) && n >= 0);

const generateTrace = (h: number[]): Step[] => {
  const trace: Step[] = [];
  let l = 0;
  let r = h.length - 1;
  let best = 0;
  let bestPair: [number, number] | null = null;

  trace.push({
    type: 'init', l, r, area: 0, best, bestPair,
    moveSide: null,
    message: `Khởi tạo: <strong>l = 0, r = ${r}, best = 0</strong>. Diện tích = min(2 cột) × khoảng cách.`,
    codeLine: 1,
  });

  while (l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);
    const isBest = area > best;
    if (isBest) {
      best = area;
      bestPair = [l, r];
    }
    trace.push({
      type: 'visit', l, r, area, best, bestPair,
      moveSide: null,
      message: `l=<strong>${l}</strong>(${h[l]}), r=<strong>${r}</strong>(${h[r]}): area = min(${h[l]},${h[r]}) × ${r - l} = <strong>${area}</strong>${isBest ? ' ← best mới!' : ''}.`,
      codeLine: 3,
    });
    let moved: 'l' | 'r';
    let reason: string;
    const hl = h[l];
    const hr = h[r];
    if (hl < hr) {
      l++;
      moved = 'l';
      reason = `cột trái thấp hơn (${hl} < ${hr}) → dời <strong>l → ${l}</strong>`;
    } else {
      r--;
      moved = 'r';
      reason = hl === hr
        ? `2 cột bằng nhau (${hl} = ${hr}) → dời <strong>r → ${r}</strong>`
        : `cột phải thấp hơn (${hr} < ${hl}) → dời <strong>r → ${r}</strong>`;
    }
    trace.push({
      type: 'move', l, r, area, best, bestPair,
      moveSide: moved,
      message: `${reason}. Cột thấp là bottleneck, giữ cột cao để còn cơ hội.`,
      codeLine: 4,
    });
  }

  trace.push({
    type: 'done', l, r, area: 0, best, bestPair,
    moveSide: null,
    message: bestPair
      ? `Hoàn tất. Diện tích lớn nhất = <strong>${best}</strong> (cột ${bestPair[0]} và ${bestPair[1]}).`
      : 'Hoàn tất.',
    codeLine: 6,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public int MaxArea(int[] height) {',
  '    int l = 0, r = height.Length - 1, best = 0;',
  '    while (l < r) {',
  '        best = Math.Max(best, Math.Min(height[l], height[r]) * (r - l));',
  '        if (height[l] < height[r]) l++; else r--;',
  '    }',
  '    return best;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · [1,8,6,2,5,4,8,3,7] → 49', nums: '1,8,6,2,5,4,8,3,7' },
  { label: 'Nhỏ · [1,1] → 1', nums: '1,1' },
  { label: '2 đầu cao · [4,3,2,1,4] → 16', nums: '4,3,2,1,4' },
  { label: 'Tăng dần · [1,2,3,4,5] → 6', nums: '1,2,3,4,5' },
];

// ===================== COMPONENT =====================
export const ContainerVisualizer = () => {
  const [numsStr, setNumsStr] = useState('1,8,6,2,5,4,8,3,7');
  const [h, setH] = useState<number[]>([1, 8, 6, 2, 5, 4, 8, 3, 7]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(h), [h]);
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
    if (n.length < 2) return;
    pause();
    setH(n);
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

  const maxH = Math.max(...h, 1);
  const waterH = step.bestPair ? Math.min(h[step.bestPair[0]], h[step.bestPair[1]]) : 0;

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/container-most-water-11" className="btn ghost">← Bài giảng Container Water</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Two Pointers · Greedy</div>
      <h1>
        Container Water <span className="accent">trực quan</span>
      </h1>
      <p>
        2 cột L/R chụm vào nhau — cột nào đang xét viền amber, vùng nước của best hiện tại tô teal.
        Luôn dời cột thấp hơn vì nó là bottleneck.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title"><span className="dot"></span>BÌNH NƯỚC · BEST = {step.best}</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', minHeight: 230, position: 'relative' }}>
            {h.map((v, i) => {
              const isL = step.l === i;
              const isR = step.r === i;
              const isPtr = isL || isR;
              const inBest =
                step.bestPair !== null &&
                i >= Math.min(step.bestPair[0], step.bestPair[1]) &&
                i <= Math.max(step.bestPair[0], step.bestPair[1]) &&
                v <= waterH;
              return (
                <div key={i} style={{ flex: 1, minWidth: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
                  <span className="mono" style={{ fontSize: 10, color: isPtr ? 'var(--accent)' : 'var(--muted)' }}>{v}</span>
                  <div style={{ width: '100%', height: Math.max(6, (v / maxH) * 180), position: 'relative', borderRadius: '4px 4px 0 0', background: 'rgba(255,255,255,.1)' }}>
                    {inBest && waterH > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: `${(waterH / maxH) * 180}px`,
                          maxHeight: '100%',
                          background: 'rgba(45,212,191,.35)',
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '4px 4px 0 0',
                        border: `2px solid ${isPtr ? 'var(--accent)' : 'transparent'}`,
                        borderBottom: 'none',
                        boxShadow: isPtr ? '0 0 12px var(--accent-glow)' : 'none',
                      }}
                    />
                  </div>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>
                    {isL ? 'L' : ''}{isR ? 'R' : ''}&nbsp;
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: '10px 0 0' }}>
            Vùng teal = mực nước của best hiện tại ({step.best})
          </p>
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 12 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>DIỆN TÍCH ĐANG XÉT</div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {step.area}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              min({h[step.l]},{h[step.r]}) × {step.r - step.l} · vừa dời: {step.moveSide === 'l' ? 'L →' : step.moveSide === 'r' ? '← R' : '—'}
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              BEST
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.best}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.bestPair ? `cột ${step.bestPair[0]} ↔ ${step.bestPair[1]}` : 'chưa có'}
            </p>
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>height (≥2 cột):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 260 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr); }}
            placeholder="1,8,6,2,5,4,8,3,7"
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
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>O(n) · O(1)</div>
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
