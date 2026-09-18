import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'compare' | 'done';
  l: number | null;
  r: number | null;
  match: boolean | null;
  result: boolean | null;
  message: string;
  codeLine: number; // 0-based
}

const clean = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

const generateTrace = (raw: string): Step[] => {
  const s = clean(raw);
  const trace: Step[] = [];
  trace.push({
    type: 'init', l: null, r: null, match: null, result: null,
    message: `Làm sạch: bỏ ký tự lạ + lowercase → "<strong>${s || '(rỗng)'}</strong>" (${s.length} ký tự).`,
    codeLine: 1,
  });
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) {
      trace.push({
        type: 'compare', l, r, match: false, result: false,
        message: `s[<strong>${l}</strong>] = '${s[l]}' ≠ s[<strong>${r}</strong>] = '${s[r]}' → <strong>false</strong>.`,
        codeLine: 5,
      });
      trace.push({
        type: 'done', l, r, match: false, result: false,
        message: `Hoàn tất. Cặp đầu tiên đã lệch → không đối xứng → <strong>false</strong>.`,
        codeLine: 5,
      });
      return trace;
    }
    trace.push({
      type: 'compare', l, r, match: true, result: null,
      message: `s[<strong>${l}</strong>] = s[<strong>${r}</strong>] = '${s[l]}' ✓ → chụm vào trong.`,
      codeLine: 5,
    });
    l++;
    r--;
  }
  trace.push({
    type: 'done', l: null, r: null, match: true, result: true,
    message: s.length === 0
      ? 'Chuỗi rỗng sau khi làm sạch → coi như đối xứng → <strong>true</strong>.'
      : 'Hai đầu gặp nhau mà chưa lệch lần nào → <strong>true</strong>.',
    codeLine: 8,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public bool IsPalindrome(string s) {',
  '    int l = 0, r = s.Length - 1;',
  '    while (l < r) {',
  '        while (l < r && !char.IsLetterOrDigit(s[l])) l++;',
  '        while (l < r && !char.IsLetterOrDigit(s[r])) r--;',
  "        if (char.ToLower(s[l]) != char.ToLower(s[r])) return false;",
  '        l++; r--;',
  '    }',
  '    return true;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · Panama → true', s: 'A man, a plan, a canal: Panama' },
  { label: 'Sai · race a car → false', s: 'race a car' },
  { label: 'Khoảng trắng → true', s: ' ' },
  { label: 'Ngắn · ab_a → true', s: 'ab_a' },
  { label: 'Số · 0P → false', s: '0P' },
];

// ===================== COMPONENT =====================
export const PalindromeVisualizer = () => {
  const [rawStr, setRawStr] = useState('A man, a plan, a canal: Panama');
  const [raw, setRaw] = useState('A man, a plan, a canal: Panama');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const s = useMemo(() => clean(raw), [raw]);
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

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/valid-palindrome-125" className="btn ghost">← Bài giảng Valid Palindrome</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Two Pointers · Strings</div>
      <h1>
        Valid Palindrome <span className="accent">trực quan</span>
      </h1>
      <p>
        Hai con trỏ chụm từ 2 đầu vào giữa — ô amber là cặp đang so, khớp thì vào tiếp,
        lệch 1 cặp là false ngay.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title"><span className="dot"></span>CHUỖI ĐÃ LÀM SẠCH ({s.length})</div>
          {s.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>rỗng sau khi làm sạch</p>
          ) : (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {s.split('').map((c, i) => {
                const isPtr = step.l === i || step.r === i;
                const bad = step.match === false && isPtr;
                return (
                  <div
                    key={i}
                    style={{
                      minWidth: 38,
                      textAlign: 'center',
                      padding: '8px 6px',
                      borderRadius: 8,
                      border: `2px solid ${bad ? '#ff5f57' : isPtr ? (step.match ? 'var(--teal)' : 'var(--accent)') : 'var(--border)'}`,
                      background: bad
                        ? 'rgba(255,95,87,.15)'
                        : isPtr
                          ? step.match
                            ? 'rgba(45,212,191,.15)'
                            : 'var(--accent)'
                          : 'rgba(0,0,0,.25)',
                      color: isPtr && !step.match && !bad ? 'var(--bg)' : bad ? '#ff5f57' : isPtr ? 'var(--teal)' : 'var(--fg)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: bad ? '0 0 14px rgba(255,95,87,.5)' : isPtr ? '0 0 14px var(--accent-glow)' : 'none',
                      transition: 'all .3s var(--ease)',
                    }}
                  >
                    {c}
                    <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>
                      {step.l === i ? 'L' : ''}{step.r === i ? 'R' : ''}&nbsp;
                    </div>
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
            <div className="card-title"><span className="dot"></span>CON TRỎ L / R</div>
            <p className="mono" style={{ fontSize: 15, margin: 0, color: 'var(--accent)' }}>
              L = {step.l === null ? '—' : step.l} · R = {step.r === null ? '—' : step.r}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.match === null ? 'chưa so cặp nào' : step.match ? 'cặp hiện tại khớp ✓' : 'cặp hiện tại lệch ✗'}
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
            style={{ maxWidth: 300 }}
            value={rawStr}
            onChange={(e) => setRawStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(rawStr); }}
            placeholder="A man, a plan, a canal: Panama"
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
