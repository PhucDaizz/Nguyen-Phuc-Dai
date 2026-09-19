import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions, PARENS_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'push' | 'match' | 'mismatch' | 'invalid' | 'done';
  pos: number | null; // vị trí ký tự đang xét
  char: string | null;
  stack: string[]; // đáy → đỉnh
  result: boolean | null;
  message: string;
  codeLine: number; // 0-based
}

const PAIR: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPENS = new Set(['(', '[', '{']);
const BRACKETS = new Set(['(', ')', '[', ']', '{', '}']);

const generateTrace = (s: string): Step[] => {
  const trace: Step[] = [];
  const st: string[] = [];
  const snap = () => [...st];

  trace.push({
    type: 'init', pos: null, char: null,
    stack: [], result: null,
    message: 'Khởi tạo: <strong>stack rỗng</strong>. Mở ngoặc thì push, đóng ngoặc thì pop đối chiếu.',
    codeLine: 1,
  });

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!BRACKETS.has(c)) {
      trace.push({
        type: 'invalid', pos: i, char: c,
        stack: snap(), result: false,
        message: `Ký tự '<strong>${c}</strong>' không phải ngoặc → chuỗi không hợp lệ → <strong>false</strong>.`,
        codeLine: 5,
      });
      trace.push({
        type: 'done', pos: i, char: c,
        stack: snap(), result: false,
        message: `Hoàn tất. Gặp ký tự lạ → <strong>false</strong>.`,
        codeLine: 5,
      });
      return trace;
    }
    if (OPENS.has(c)) {
      st.push(c);
      trace.push({
        type: 'push', pos: i, char: c,
        stack: snap(), result: null,
        message: `'<strong>${c}</strong>' là ngoặc mở → <strong>push</strong>. Stack: [${snap().join(' ')}].`,
        codeLine: 4,
      });
      continue;
    }
    const top = st.pop();
    if (top !== PAIR[c]) {
      trace.push({
        type: 'mismatch', pos: i, char: c,
        stack: snap(), result: false,
        message: `'<strong>${c}</strong>' cần '${PAIR[c]}' nhưng đỉnh stack là ${top === undefined ? '<strong>rỗng</strong>' : `<strong>'${top}'</strong>`} → <strong>false</strong>.`,
        codeLine: 5,
      });
      trace.push({
        type: 'done', pos: i, char: c,
        stack: snap(), result: false,
        message: `Hoàn tất. Đóng/mở không khớp → <strong>false</strong>.`,
        codeLine: 5,
      });
      return trace;
    }
    trace.push({
      type: 'match', pos: i, char: c,
      stack: snap(), result: null,
      message: `'<strong>${c}</strong>' khớp '${PAIR[c]}' trên đỉnh → <strong>pop</strong>. Stack còn: [${snap().join(' ') || 'rỗng'}].`,
      codeLine: 5,
    });
  }

  const ok = st.length === 0;
  trace.push({
    type: 'done', pos: null, char: null,
    stack: snap(), result: ok,
    message: s.length === 0
      ? 'Chuỗi rỗng — không có gì để sai → <strong>true</strong>.'
      : ok
        ? 'Duyệt hết, stack rỗng → mọi ngoặc đều đóng đúng → <strong>true</strong>.'
        : `Duyệt hết mà stack còn [${snap().join(' ')}] (thiếu ngoặc đóng) → <strong>false</strong>.`,
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_PARENS = getSolutions('valid-parentheses-20');

const PRESETS = [
  { label: 'Chuẩn · ()[]{} → true', s: '()[]{}' },
  { label: 'Sai loại · (] → false', s: '(]' },
  { label: 'Sai thứ tự · ([)] → false', s: '([)]' },
  { label: 'Lồng nhau · {[()]} → true', s: '{[()]}' },
  { label: 'Thiếu đóng · ( → false', s: '(' },
  { label: 'Rỗng · "" → true', s: '' },
];

// ===================== COMPONENT =====================
export const ParenthesesVisualizer = () => {
  const [rawStr, setRawStr] = useState('()[]{}');
  const [raw, setRaw] = useState('()[]{}');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(raw), [raw]);
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
  const build = (v: string) => {
    pause();
    setRaw(v);
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

  const fail = step.type === 'mismatch' || step.type === 'invalid' ||
    (step.type === 'done' && step.result === false);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/valid-parentheses-20" className="btn ghost">← Bài giảng Valid Parentheses</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Stack · LIFO</div>
      <h1>
        Valid Parentheses <span className="accent">trực quan</span>
      </h1>
      <p>
        Ngoặc mở push xuống stack, ngoặc đóng pop lên đối chiếu — ô amber là ký tự đang xét,
        đỉnh stack sáng teal, sai là đỏ ngay.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title"><span className="dot"></span>CHUỖI NGOẶC</div>
          {raw.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: '0 0 12px' }}>chuỗi rỗng</p>
          ) : (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {raw.split('').map((c, i) => {
                const isCur = step.pos === i;
                const bad = isCur && fail;
                return (
                  <div
                    key={i}
                    style={{
                      minWidth: 44,
                      textAlign: 'center',
                      padding: '10px 6px',
                      borderRadius: 10,
                      border: `2px solid ${bad ? '#ff5f57' : isCur ? 'var(--accent)' : 'var(--border)'}`,
                      background: bad ? 'rgba(255,95,87,.15)' : isCur ? 'var(--accent)' : 'rgba(0,0,0,.25)',
                      color: bad ? '#ff5f57' : isCur ? 'var(--bg)' : 'var(--fg)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 17,
                      boxShadow: bad ? '0 0 14px rgba(255,95,87,.5)' : isCur ? '0 0 14px var(--accent-glow)' : 'none',
                      transition: 'all .3s var(--ease)',
                    }}
                  >
                    {c}
                    <div style={{ fontSize: 9, fontWeight: 400, color: bad || isCur ? 'inherit' : 'var(--muted)' }}>[{i}]</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="card-title"><span className="dot"></span>STACK (ĐỈNH Ở TRÊN)</div>
          {step.stack.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>stack rỗng</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6, maxWidth: 220 }}>
              {step.stack.map((c, i) => {
                const isTop = i === step.stack.length - 1;
                return (
                  <div
                    key={i}
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      borderRadius: 8,
                      border: `2px solid ${isTop ? 'var(--teal)' : 'var(--border)'}`,
                      background: isTop ? 'rgba(45,212,191,.12)' : 'rgba(0,0,0,.25)',
                      color: isTop ? 'var(--teal)' : 'var(--fg)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 16,
                      boxShadow: isTop ? '0 0 12px var(--teal-glow)' : 'none',
                    }}
                  >
                    {c}{isTop ? ' ← top' : ''}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>KÝ TỰ ĐANG XÉT</div>
            <p className="mono" style={{ fontSize: 24, fontWeight: 700, color: fail ? '#ff5f57' : 'var(--accent)', margin: 0 }}>
              {step.char === null ? '—' : `'${step.char}'`}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.char === null
                ? '—'
                : OPENS.has(step.char)
                  ? 'ngoặc mở → push'
                  : `ngoặc đóng → cần '${PAIR[step.char] ?? '?'}'`}
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.result === false ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
              {step.result === null ? '?' : step.result ? 'true' : 'false'}
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>s:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 240 }}
            value={rawStr}
            onChange={(e) => setRawStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(rawStr); }}
            placeholder="()[]{}"
          />
          <button className="btn" onClick={() => build(rawStr)}>Build</button>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn ghost"
            onClick={() => {
              setRawStr(p.s);
              build(p.s);
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
          solutions={SOLUTIONS_PARENS}
          defaultLang="csharp"
          getHighlight={(lang) => [PARENS_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(n)"
        />
      </div>
    </div>
  );
};
