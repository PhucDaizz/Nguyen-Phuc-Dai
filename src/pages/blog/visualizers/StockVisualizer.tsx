import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'visit' | 'newbest' | 'newmin' | 'done';
  day: number | null; // ngày đang xét
  price: number | null;
  min: number;
  minDay: number;
  best: number;
  buy: number | null; // ngày mua của best hiện tại
  sell: number | null; // ngày bán của best hiện tại
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

const generateTrace = (prices: number[]): Step[] => {
  const trace: Step[] = [];
  if (prices.length === 0) {
    trace.push({
      type: 'done', day: null, price: null, min: 0, minDay: -1,
      best: 0, buy: null, sell: null,
      message: 'Mảng rỗng — không giao dịch được, trả về <strong>0</strong>.',
      codeLine: 8,
    });
    return trace;
  }
  let min = prices[0];
  let minDay = 0;
  let best = 0;
  let buy: number | null = null;
  let sell: number | null = null;

  trace.push({
    type: 'init', day: 0, price: prices[0], min, minDay,
    best, buy, sell,
    message: `Khởi tạo: <strong>min = ${prices[0]}</strong> (ngày 0), <strong>best = 0</strong>.`,
    codeLine: 1,
  });

  for (let i = 0; i < prices.length; i++) {
    const p = prices[i];
    const profit = p - min;
    trace.push({
      type: 'visit', day: i, price: p, min, minDay,
      best, buy, sell,
      message: `Ngày <strong>${i}</strong> giá <strong>${p}</strong>: bán hôm nay lời <strong>${p} − ${min} = ${profit}</strong>.`,
      codeLine: 4,
    });
    if (profit > best) {
      const prevBest = best;
      best = profit;
      buy = minDay;
      sell = i;
      trace.push({
        type: 'newbest', day: i, price: p, min, minDay,
        best, buy, sell,
        message: `<strong>${profit} > ${prevBest}</strong> → best mới = <strong>${best}</strong> (mua ngày ${minDay}, bán ngày ${i}).`,
        codeLine: 4,
      });
    }
    if (p < min) {
      min = p;
      minDay = i;
      trace.push({
        type: 'newmin', day: i, price: p, min, minDay,
        best, buy, sell,
        message: `Giá <strong>${p}</strong> thấp nhất từ trước tới nay → min mới = <strong>${p}</strong> (ngày ${i}).`,
        codeLine: 5,
      });
    }
  }

  trace.push({
    type: 'done', day: null, price: null, min, minDay,
    best, buy, sell,
    message: buy !== null
      ? `Hoàn tất. Lời nhất = <strong>${best}</strong> (mua ngày ${buy} giá ${prices[buy]}, bán ngày ${sell} giá ${prices[sell!]}).`
      : `Hoàn tất. Giá chỉ giảm → không giao dịch, trả về <strong>0</strong>.`,
    codeLine: 8,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public int MaxProfit(int[] prices) {',
  '    int min = prices[0];',
  '    int best = 0;',
  '    foreach (int p in prices) {',
  '        best = Math.Max(best, p - min);',
  '        min = Math.Min(min, p);',
  '    }',
  '    return best;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · [7,1,5,3,6,4]', nums: '7,1,5,3,6,4' },
  { label: 'Giảm dần · [7,6,4,3,1] → 0', nums: '7,6,4,3,1' },
  { label: 'Tăng dần · [1,2,3,4,5] → 4', nums: '1,2,3,4,5' },
  { label: 'Nhỏ · [2,4,1] → 2', nums: '2,4,1' },
  { label: 'Đi ngang · [5,5,5] → 0', nums: '5,5,5' },
];

// ===================== COMPONENT =====================
export const StockVisualizer = () => {
  const [numsStr, setNumsStr] = useState('7,1,5,3,6,4');
  const [prices, setPrices] = useState<number[]>([7, 1, 5, 3, 6, 4]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(prices), [prices]);
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
    if (n.length === 0) return;
    pause();
    setPrices(n);
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

  const maxP = Math.max(...prices, 1);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/best-time-stock-121" className="btn ghost">← Bài giảng Best Time Stock</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      {/* 1. HEADER */}
      <div className="badge">Greedy · 1 Pass</div>
      <h1>
        Buy &amp; Sell Stock <span className="accent">trực quan</span>
      </h1>
      <p>
        Cột amber là ngày đang xét, cột teal viền là giá thấp nhất từng thấy (điểm mua),
        cặp mua→bán tốt nhất được tô sáng. Mỗi ngày chỉ hỏi: “bán hôm nay lời bao nhiêu?”.
      </p>

      {/* 2. MAIN GRID */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        {/* Bar chart */}
        <div className="card">
          <div className="card-title"><span className="dot"></span>GIÁ THEO NGÀY · BEST = {step.best}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', minHeight: 220, flexWrap: 'wrap' }}>
            {prices.map((p, i) => {
              const isCur = step.day === i;
              const isMin = step.minDay === i;
              const inBest = step.buy !== null && step.sell !== null && (i === step.buy || i === step.sell);
              return (
                <div key={i} style={{ flex: 1, minWidth: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="mono" style={{ fontSize: 11, color: isCur ? 'var(--accent)' : 'var(--muted)' }}>{p}</span>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(8, (p / maxP) * 170),
                      borderRadius: '6px 6px 0 0',
                      background: inBest
                        ? 'rgba(45,212,191,.35)'
                        : isCur
                          ? 'var(--accent)'
                          : isMin
                            ? 'rgba(45,212,191,.15)'
                            : 'rgba(255,255,255,.08)',
                      border: `2px solid ${inBest ? 'var(--teal)' : isCur ? 'var(--accent)' : isMin ? 'rgba(45,212,191,.6)' : 'transparent'}`,
                      borderBottom: 'none',
                      boxShadow: inBest
                        ? '0 0 16px var(--teal-glow)'
                        : isCur
                          ? '0 0 16px var(--accent-glow)'
                          : 'none',
                      transition: 'all .3s var(--ease)',
                    }}
                  />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                    d{i}{i === step.buy ? ' B' : ''}{i === step.sell ? ' S' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0' }}>
            B = ngày mua tốt nhất · S = ngày bán tốt nhất
          </p>
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 12 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        {/* State panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>MIN — GIÁ THẤP NHẤT TỪNG THẤY</div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.min} <span style={{ fontSize: 12, color: 'var(--muted)' }}>ngày {step.minDay}</span>
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              BEST — LỜI NHẤT
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {step.best}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.buy !== null ? `mua ngày ${step.buy} → bán ngày ${step.sell}` : 'chưa có giao dịch lời'}
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>prices:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 260 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr); }}
            placeholder="7,1,5,3,6,4"
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
