import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions, ANAGRAM_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'count' | 'check' | 'fail' | 'done';
  phase: 'count' | 'verify' | 'done';
  side: 's' | 't' | null;
  pos: number | null; // vị trí ký tự đang xét
  counts: Record<string, number>; // bảng đếm tại step này
  result: boolean | null;
  message: string;
  codeLine: number; // 0-based
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const generateTrace = (s: string, t: string): Step[] => {
  const trace: Step[] = [];
  const counts: Record<string, number> = {};
  const snap = () => ({ ...counts });

  if (s.length !== t.length) {
    trace.push({
      type: 'done', phase: 'done', side: null, pos: null,
      counts: {}, result: false,
      message: `Dài khác nhau (<strong>${s.length} ≠ ${t.length}</strong>) → không thể là hoán vị → <strong>false</strong>, khỏi đếm.`,
      codeLine: 1,
    });
    return trace;
  }

  trace.push({
    type: 'init', phase: 'count', side: 's', pos: null,
    counts: {}, result: null,
    message: `Dài bằng nhau (${s.length}). Phase 1 — đếm từng chữ của <strong>s</strong> (+1).`,
    codeLine: 2,
  });

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    counts[c] = (counts[c] ?? 0) + 1;
    trace.push({
      type: 'count', phase: 'count', side: 's', pos: i,
      counts: snap(), result: null,
      message: `s[<strong>${i}</strong>] = '<strong>${c}</strong>' → count['${c}'] = <strong>${counts[c]}</strong>.`,
      codeLine: 3,
    });
  }

  trace.push({
    type: 'init', phase: 'verify', side: 't', pos: null,
    counts: snap(), result: null,
    message: `Phase 2 — trừ từng chữ của <strong>t</strong> (−1). Ô nào âm là sai ngay.`,
    codeLine: 4,
  });

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    counts[c] = (counts[c] ?? 0) - 1;
    if (counts[c] < 0) {
      trace.push({
        type: 'fail', phase: 'verify', side: 't', pos: i,
        counts: snap(), result: false,
        message: `t[<strong>${i}</strong>] = '<strong>${c}</strong>' → count['${c}'] = <strong>${counts[c]} (âm!)</strong> → <strong>false</strong>.`,
        codeLine: 5,
      });
      trace.push({
        type: 'done', phase: 'done', side: null, pos: null,
        counts: snap(), result: false,
        message: `Hoàn tất. Thừa chữ '<strong>${c}</strong>' → không phải hoán vị → <strong>false</strong>.`,
        codeLine: 5,
      });
      return trace;
    }
    trace.push({
      type: 'check', phase: 'verify', side: 't', pos: i,
      counts: snap(), result: null,
      message: `t[<strong>${i}</strong>] = '<strong>${c}</strong>' → count['${c}'] = <strong>${counts[c]}</strong> (vẫn ≥ 0).`,
      codeLine: 5,
    });
  }

  trace.push({
    type: 'done', phase: 'done', side: null, pos: null,
    counts: snap(), result: true,
    message: `Mọi ô về 0 — 2 chuỗi cùng tần suất → <strong>true</strong>.`,
    codeLine: 7,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_ANAGRAM = getSolutions('valid-anagram-242');

const PRESETS = [
  { label: 'LeetCode · anagram/nagaram → true', s: 'anagram', t: 'nagaram' },
  { label: 'Sai · rat/car → false', s: 'rat', t: 'car' },
  { label: 'Dài khác · a/ab → false', s: 'a', t: 'ab' },
  { label: 'Trùng lặp · aacc/ccaa → true', s: 'aacc', t: 'ccaa' },
];

// ===================== COMPONENT =====================
const CharRow = ({ label, str, active, activeColor }: {
  label: string; str: string; active: number | null; activeColor: string;
}) => (
  <div style={{ marginBottom: 10 }}>
    <div className="demo-label" style={{ marginBottom: 4 }}>{label}</div>
    {str.length === 0 ? (
      <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>chuỗi rỗng</p>
    ) : (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {str.split('').map((c, i) => (
          <div
            key={i}
            style={{
              minWidth: 40,
              textAlign: 'center',
              padding: '8px 6px',
              borderRadius: 8,
              border: `2px solid ${active === i ? activeColor : 'var(--border)'}`,
              background: active === i ? 'rgba(255,181,71,.12)' : 'rgba(0,0,0,.25)',
              color: active === i ? activeColor : 'var(--fg)',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 15,
              boxShadow: active === i ? '0 0 14px var(--accent-glow)' : 'none',
              transition: 'all .3s var(--ease)',
            }}
          >
            {c}
            <div style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)' }}>[{i}]</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const AnagramVisualizer = () => {
  const [sStr, setSStr] = useState('anagram');
  const [tStr, setTStr] = useState('nagaram');
  const [s, setS] = useState('anagram');
  const [t, setT] = useState('nagaram');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const clean = (x: string) => x.toLowerCase().replace(/[^a-z]/g, '');
  const trace = useMemo(() => generateTrace(clean(s), clean(t)), [s, t]);
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
  const build = (ns: string, nt: string) => {
    pause();
    setS(ns);
    setT(nt);
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

  const shownCounts = ALPHA.split('').filter((c) => (step.counts[c] ?? 0) !== 0 || step.phase !== 'done');

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/valid-anagram-242" className="btn ghost">← Bài giảng Valid Anagram</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Frequency Count · Strings</div>
      <h1>
        Valid Anagram <span className="accent">trực quan</span>
      </h1>
      <p>
        Phase 1 cộng tần suất từng chữ của s, phase 2 trừ từng chữ của t — ô nào âm là sai ngay.
        Bảng đếm chỉ hiện chữ khác 0.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title">
            <span className="dot"></span>
            {step.phase === 'count' ? 'PHASE 1 — ĐẾM S (+1)' : step.phase === 'verify' ? 'PHASE 2 — TRỪ T (−1)' : 'HOÀN TẤT'}
          </div>
          <CharRow label="s" str={clean(s)} active={step.side === 's' ? step.pos : null} activeColor="var(--accent)" />
          <CharRow label="t" str={clean(t)} active={step.side === 't' ? step.pos : null} activeColor="var(--teal)" />
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>BẢNG ĐẾM 26 CHỮ</div>
            {shownCounts.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>
                mọi ô = 0 {step.result === true ? '✓ khớp hết' : ''}
              </p>
            ) : (
              <div className="demo" style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {shownCounts.map((c) => (
                  <span
                    key={c}
                    className="mono"
                    style={{
                      fontSize: 12.5,
                      padding: '3px 8px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      background: (step.counts[c] ?? 0) < 0 ? 'rgba(255,95,87,.12)' : 'rgba(255,181,71,.08)',
                      color: (step.counts[c] ?? 0) < 0 ? '#ff5f57' : 'var(--accent)',
                    }}
                  >
                    {c}:{step.counts[c] ?? 0}
                  </span>
                ))}
              </div>
            )}
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
            style={{ maxWidth: 160 }}
            value={sStr}
            onChange={(e) => setSStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(sStr, tStr); }}
            placeholder="anagram"
          />
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>t:</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 160 }}
            value={tStr}
            onChange={(e) => setTStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(sStr, tStr); }}
            placeholder="nagaram"
          />
          <button className="btn" onClick={() => build(sStr, tStr)}>Build</button>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn ghost"
            onClick={() => {
              setSStr(p.s);
              setTStr(p.t);
              build(p.s, p.t);
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
          solutions={SOLUTIONS_ANAGRAM}
          defaultLang="csharp"
          getHighlight={(lang) => [ANAGRAM_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(1)"
        />
      </div>
    </div>
  );
};
