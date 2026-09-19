import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions, PRODUCT_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'prefix' | 'suffix' | 'done';
  phase: 'prefix' | 'suffix' | 'done';
  i: number | null;
  answer: number[];
  suffix: number;
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
  const n = nums.length;
  const answer = new Array(n).fill(1);
  if (n > 0) answer[0] = 1;

  trace.push({
    type: 'init', phase: 'prefix', i: null,
    answer: [...answer], suffix: 1,
    message: `Pass 1 — tích prefix: <strong>answer[0] = 1</strong>, mỗi ô sau = ô trước × số bên trái nó.`,
    codeLine: 3,
  });

  for (let i = 1; i < n; i++) {
    answer[i] = answer[i - 1] * nums[i - 1];
    trace.push({
      type: 'prefix', phase: 'prefix', i,
      answer: [...answer], suffix: 1,
      message: `answer[<strong>${i}</strong>] = answer[${i - 1}] × nums[${i - 1}] = ${answer[i - 1]} × ${nums[i - 1]} = <strong>${answer[i]}</strong>.`,
      codeLine: 5,
    });
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    const before = answer[i];
    answer[i] *= suffix;
    trace.push({
      type: 'suffix', phase: 'suffix', i,
      answer: [...answer], suffix,
      message: `Pass 2 — i=<strong>${i}</strong>: answer[${i}] = ${before} × suffix(${suffix}) = <strong>${answer[i]}</strong>, rồi suffix ×= nums[${i}] (${nums[i]}).`,
      codeLine: 8,
    });
    suffix *= nums[i];
  }

  trace.push({
    type: 'done', phase: 'done', i: null,
    answer: [...answer], suffix,
    message: `Hoàn tất. Result = <strong>[${answer.join(', ')}]</strong> — mỗi ô là tích mọi số trừ chính nó, không dùng phép chia.`,
    codeLine: 11,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_PRODUCT = getSolutions('product-except-self-238');

const PRESETS = [
  { label: 'Cơ bản · [1,2,3,4]', nums: '1,2,3,4' },
  { label: 'Có số 0 · [-1,1,0,-3,3]', nums: '-1,1,0,-3,3' },
  { label: '2 số · [2,3]', nums: '2,3' },
  { label: 'Âm · [-2,-3,-4]', nums: '-2,-3,-4' },
];

// ===================== COMPONENT =====================
const Row = ({ label, values, highlight, color }: {
  label: string; values: (number | string)[]; highlight: number | null; color: string;
}) => (
  <div style={{ marginBottom: 10 }}>
    <div className="demo-label" style={{ marginBottom: 4 }}>{label}</div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            minWidth: 52,
            textAlign: 'center',
            padding: '8px 6px',
            borderRadius: 8,
            border: `2px solid ${highlight === i ? color : 'var(--border)'}`,
            background: highlight === i ? 'rgba(255,181,71,.12)' : 'rgba(0,0,0,.25)',
            color: highlight === i ? color : 'var(--fg)',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: 14,
            boxShadow: highlight === i ? '0 0 14px var(--accent-glow)' : 'none',
            transition: 'all .3s var(--ease)',
          }}
        >
          {v}
          <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>[{i}]</div>
        </div>
      ))}
    </div>
  </div>
);

export const ProductVisualizer = () => {
  const [numsStr, setNumsStr] = useState('1,2,3,4');
  const [nums, setNums] = useState<number[]>([1, 2, 3, 4]);
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
    const n = parseNums(nStr);
    if (n.length < 2) return;
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

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/product-except-self-238" className="btn ghost">← Bài giảng Product Except Self</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Prefix / Suffix · O(1) Space</div>
      <h1>
        Product Except Self <span className="accent">trực quan</span>
      </h1>
      <p>
        Pass 1 đi trái→phải gom tích bên trái vào answer, pass 2 đi phải→trái nhân thêm tích
        bên phải (suffix). Ô viền amber là ô đang tính.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title">
            <span className="dot"></span>
            {step.phase === 'prefix' ? 'PASS 1 — PREFIX (TRÁI → PHẢI)' : step.phase === 'suffix' ? 'PASS 2 — SUFFIX (PHẢI → TRÁI)' : 'HOÀN TẤT'}
          </div>
          <Row label="nums (đầu vào)" values={nums} highlight={step.i} color="var(--accent)" />
          <Row label="answer (tích lũy)" values={step.answer} highlight={step.i} color="var(--teal)" />
          {step.phase === 'suffix' && (
            <p className="mono" style={{ fontSize: 13, color: 'var(--teal)', margin: 0 }}>
              suffix = {step.suffix} (tích mọi số bên phải i)
            </p>
          )}
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>PHASE</div>
            <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {step.phase === 'prefix' ? '1/2 · prefix' : step.phase === 'suffix' ? '2/2 · suffix' : 'xong'}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.phase === 'suffix' ? `suffix hiện tại = ${step.suffix}` : 'suffix = 1 (chưa dùng)'}
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              [{step.answer.join(', ')}]
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>nums (≥2 số):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 260 }}
            value={numsStr}
            onChange={(e) => setNumsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(numsStr); }}
            placeholder="1,2,3,4"
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

      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_PRODUCT}
          defaultLang="csharp"
          getHighlight={(lang) => [PRODUCT_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
