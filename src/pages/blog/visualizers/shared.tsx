import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== PLAYBACK HOOK (dùng chung mọi visualizer) =====================
export interface Playback {
  stepIdx: number;
  playing: boolean;
  speed: number;
  setSpeed: (n: number) => void;
  play: () => void;
  pause: () => void;
  stepFwd: () => void;
  stepBack: () => void;
  reset: () => void;
  restart: () => void; // dùng sau khi Build input mới
}

export function usePlayback(traceLength: number): Playback {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const pause = useCallback(() => {
    setPlaying(false);
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= traceLength - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setStepIdx((i) => i + 1), speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, stepIdx, speed, traceLength]);

  useEffect(() => () => pause(), [pause]);

  const play = useCallback(() => {
    setStepIdx((i) => (i >= traceLength - 1 ? 0 : i));
    setPlaying(true);
  }, [traceLength]);
  const stepFwd = useCallback(() => {
    pause();
    setStepIdx((i) => Math.min(i + 1, traceLength - 1));
  }, [pause, traceLength]);
  const stepBack = useCallback(() => {
    pause();
    setStepIdx((i) => Math.max(i - 1, 0));
  }, [pause]);
  const reset = useCallback(() => {
    pause();
    setStepIdx(0);
  }, [pause]);

  const apiRef = useRef({ play, pause, stepFwd, stepBack, reset });
  apiRef.current = { play, pause, stepFwd, stepBack, reset };
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
      const api = apiRef.current;
      if (e.code === 'Space') {
        e.preventDefault();
        if (playingRef.current) api.pause();
        else api.play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        api.stepFwd();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        api.stepBack();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        api.reset();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return { stepIdx, playing, speed, setSpeed, play, pause, stepFwd, stepBack, reset, restart: reset };
}

// ===================== UI PIECES =====================
export const VizHeader = ({ backTo, backLabel, badge, title, accent, sub }: {
  backTo: string; backLabel: string; badge: string;
  title: string; accent: string; sub: string;
}) => (
  <>
    <div className="btn-row">
      <Link to={backTo} className="btn ghost">← {backLabel}</Link>
      <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
    </div>
    <div style={{ height: 18 }} />
    <div className="badge">{badge}</div>
    <h1>
      {title} <span className="accent">{accent}</span>
    </h1>
    <p>{sub}</p>
  </>
);

export const StepBar = ({ idx, total, message }: { idx: number; total: number; message: string }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
    <span className="mono" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)', fontWeight: 700, fontSize: 13, padding: '6px 12px', borderRadius: 8, flexShrink: 0 }}>
      {idx + 1} / {total}
    </span>
    <p style={{ margin: 0, fontSize: 14.5 }} dangerouslySetInnerHTML={{ __html: message }} />
  </div>
);

export const ControlsCard = ({ pb, total, children }: {
  pb: Playback; total: number; children?: React.ReactNode;
}) => (
  <div className="card" style={{ marginTop: 14 }}>
    <div className="btn-row" style={{ alignItems: 'center' }}>
      <button className="btn primary" onClick={pb.playing ? pb.pause : pb.play}>
        {pb.playing ? 'Pause' : 'Play'}
      </button>
      <button className="btn" onClick={pb.stepBack} disabled={pb.stepIdx <= 0}>Back</button>
      <button className="btn" onClick={pb.stepFwd} disabled={pb.stepIdx >= total - 1}>Step</button>
      <button className="btn" onClick={pb.reset}>Reset</button>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 12 }}>
        Tốc độ
        <input
          type="range"
          min={200}
          max={2000}
          step={100}
          value={pb.speed}
          onChange={(e) => pb.setSpeed(Number(e.target.value))}
          style={{ width: 90, accentColor: '#ffb547' }}
        />
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', minWidth: 52 }}>{pb.speed}ms</span>
      </span>
    </div>
    {children && <div className="btn-row" style={{ marginTop: 10 }}>{children}</div>}
  </div>
);

export const InputField = ({ label, value, onChange, onEnter, placeholder, maxWidth }: {
  label: string; value: string; onChange: (v: string) => void;
  onEnter: () => void; placeholder?: string; maxWidth?: number;
}) => (
  <>
    <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>{label}</label>
    <input
      className="dsa-search"
      style={{ maxWidth: maxWidth ?? 260 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
      }}
      placeholder={placeholder}
    />
  </>
);

export const PresetsRow = ({ items, onPick }: {
  items: { label: string; value: string }[]; onPick: (value: string) => void;
}) => (
  <>
    <div className="btn-row" style={{ marginTop: 14 }}>
      {items.map((p) => (
        <button key={p.label} className="btn ghost" onClick={() => onPick(p.value)}>
          {p.label}
        </button>
      ))}
    </div>
    <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
      Phím tắt: Space Play/Pause · → Step · ← Back · R Reset
    </p>
  </>
);

export const CodePanel = ({ lines, active, stats }: {
  lines: string[]; active: number; stats: string;
}) => (
  <div className="code-block" style={{ marginTop: 14 }}>
    <div className="code-head">
      <div className="dots">
        <i style={{ background: '#ff5f57' }} />
        <i style={{ background: '#febc2e' }} />
        <i style={{ background: '#28c840' }} />
      </div>
      <div className="name">Solution.cs<span className="live" /></div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{stats}</div>
    </div>
    <pre>
      <code>
        {lines.map((ln, i) => (
          <span key={i} className={`line ${active === i ? 'active' : ''}`}>
            {ln || ' '}
          </span>
        ))}
      </code>
    </pre>
  </div>
);

export const ThinProgress = ({ idx, total }: { idx: number; total: number }) => (
  <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
    <div style={{ width: `${((idx + 1) / total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
  </div>
);

// Ô mảng chung: value + nhãn dưới (index / pointer)
export const ArrCell = ({ v, sub, state }: {
  v: number | string; sub?: string;
  state?: 'cur' | 'teal' | 'dim' | 'bad' | 'fixed';
}) => {
  const border =
    state === 'cur' ? 'var(--accent)'
      : state === 'teal' ? 'var(--teal)'
        : state === 'bad' ? '#ff5f57'
          : state === 'fixed' ? '#c4b5fd'
            : state === 'dim' ? 'rgba(45,212,191,.5)'
              : 'var(--border)';
  const bg =
    state === 'cur' ? 'var(--accent)'
      : state === 'teal' ? 'rgba(45,212,191,.2)'
        : state === 'bad' ? 'rgba(255,95,87,.15)'
          : state === 'fixed' ? 'rgba(196,181,253,.15)'
            : state === 'dim' ? 'rgba(45,212,191,.08)'
              : 'rgba(0,0,0,.25)';
  const color =
    state === 'cur' ? 'var(--bg)'
      : state === 'teal' || state === 'dim' ? 'var(--teal)'
        : state === 'bad' ? '#ff5f57'
          : state === 'fixed' ? '#c4b5fd'
            : 'var(--fg)';
  return (
    <div
      style={{
        minWidth: 52,
        textAlign: 'center',
        padding: '8px 6px',
        borderRadius: 8,
        border: `2px solid ${border}`,
        background: bg,
        color,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 14,
        boxShadow:
          state === 'cur' ? '0 0 14px var(--accent-glow)'
            : state === 'teal' ? '0 0 14px var(--teal-glow)'
              : state === 'bad' ? '0 0 14px rgba(255,95,87,.5)'
                : 'none',
        transform: state === 'cur' ? 'scale(1.1)' : 'scale(1)',
        transition: 'all .3s var(--ease)',
      }}
    >
      {v}
      {sub !== undefined && (
        <div style={{ fontSize: 9, fontWeight: 400, color: state === 'cur' ? 'var(--bg)' : 'var(--muted)' }}>{sub}</div>
      )}
    </div>
  );
};

// Chuỗi linked list ngang: node → node, nhãn pointer dưới mỗi node
export const Chain = ({ values, tags, cycleTo }: {
  values: (number | string)[];
  tags?: Record<number, string[]>;
  cycleTo?: number | null;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', rowGap: 14 }}>
    {values.map((v, i) => (
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span
            style={{
              minWidth: 46,
              textAlign: 'center',
              padding: '8px 8px',
              borderRadius: '50%',
              border: '2px solid var(--border-strong)',
              background: 'var(--bg-3)',
              color: 'var(--fg)',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {v}
          </span>
          <span className="mono" style={{ fontSize: 9, color: 'var(--accent)', minHeight: 12 }}>
            {(tags?.[i] ?? []).join(' ')}
          </span>
        </span>
        {i < values.length - 1 && (
          <span className="mono" style={{ color: 'var(--muted)', fontSize: 14 }}>→</span>
        )}
        {i === values.length - 1 && cycleTo !== null && cycleTo !== undefined && (
          <span className="mono" style={{ color: 'var(--teal)', fontSize: 11 }}>↩ về [{cycleTo}]</span>
        )}
      </span>
    ))}
    {values.length === 0 && (
      <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>null (rỗng)</span>
    )}
  </div>
);

export const parseNumList = (str: string): number[] =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !Number.isNaN(n));
