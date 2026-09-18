import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'init' | 'visit' | 'group' | 'done';
  current: number | null; // index từ đang xét
  key: string | null; // key vừa tính
  groups: Record<string, string[]>; // nhóm tại step này
  message: string;
  codeLine: number; // 0-based
}

const sortedKey = (w: string) => w.split('').sort().join('');

const parseWords = (str: string): string[] =>
  str
    .split(',')
    .map((s) => s.trim().replace(/^"|"$/g, ''));

const generateTrace = (words: string[]): Step[] => {
  const trace: Step[] = [];
  const groups: Record<string, string[]> = {};
  const snap = () => Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, [...v]]));

  trace.push({
    type: 'init', current: null, key: null,
    groups: {},
    message: `Khởi tạo: <strong>map rỗng</strong>. Mỗi từ sẽ sort chữ cái làm key.`,
    codeLine: 1,
  });

  words.forEach((w, i) => {
    const key = sortedKey(w);
    trace.push({
      type: 'visit', current: i, key,
      groups: snap(),
      message: `Từ <strong>"${w}"</strong> → sort → key = "<strong>${key}</strong>".`,
      codeLine: 5,
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
    trace.push({
      type: 'group', current: i, key,
      groups: snap(),
      message: `Push "<strong>${w}</strong>" vào nhóm "<strong>${key}</strong>" → [${groups[key].map((x) => `"${x}"`).join(', ')}].`,
      codeLine: 7,
    });
  });

  const out = Object.values(groups).map((g) => `[${g.map((x) => `"${x}"`).join(', ')}]`).join(', ');
  trace.push({
    type: 'done', current: null, key: null,
    groups: snap(),
    message: `Hoàn tất. Result = <strong>[${out}]</strong> — ${Object.keys(groups).length} nhóm.`,
    codeLine: 9,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public IList<IList<string>> GroupAnagrams(string[] strs) {',
  '    var map = new Dictionary<string, List<string>>();',
  '    foreach (string w in strs) {',
  '        char[] arr = w.ToCharArray();',
  '        Array.Sort(arr);',
  '        string key = new string(arr);',
  '        if (!map.ContainsKey(key)) map[key] = new List<string>();',
  '        map[key].Add(w);',
  '    }',
  '    return new List<IList<string>>(map.Values);',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · eat,tea,tan,ate,nat,bat', nums: 'eat,tea,tan,ate,nat,bat' },
  { label: 'Rỗng · [""]', nums: '""' },
  { label: '1 chữ · a', nums: 'a' },
  { label: 'Dồn nhóm · abc,bca,cab,xyz', nums: 'abc,bca,cab,xyz' },
];

// ===================== COMPONENT =====================
export const GroupVisualizer = () => {
  const [wordsStr, setWordsStr] = useState('eat,tea,tan,ate,nat,bat');
  const [words, setWords] = useState<string[]>(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timer = useRef<number | null>(null);

  const trace = useMemo(() => generateTrace(words), [words]);
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
    pause();
    setWords(parseWords(nStr));
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

  const groupKeys = Object.keys(step.groups);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/group-anagrams-49" className="btn ghost">← Bài giảng Group Anagrams</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Sorted Key · Hash Map</div>
      <h1>
        Group Anagrams <span className="accent">trực quan</span>
      </h1>
      <p>
        Mỗi từ sort chữ cái thành key (eat/tea/ate → aet) rồi rơi vào đúng nhóm của key đó —
        ô amber là từ đang xét, nhóm vừa thêm sáng teal.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title"><span className="dot"></span>TỪ ĐẦU VÀO</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {words.map((w, i) => {
              const isCur = step.current === i;
              return (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: `2px solid ${isCur ? 'var(--accent)' : 'var(--border)'}`,
                    background: isCur ? 'var(--accent)' : 'rgba(0,0,0,.25)',
                    color: isCur ? 'var(--bg)' : 'var(--fg)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: isCur ? '0 0 16px var(--accent-glow)' : 'none',
                    transform: isCur ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all .3s var(--ease)',
                  }}
                >
                  "{w}"
                  <div style={{ fontSize: 9, fontWeight: 400, color: isCur ? 'var(--bg)' : 'var(--muted)', textAlign: 'center' }}>
                    key: {sortedKey(w) || '∅'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card-title"><span className="dot"></span>CÁC NHÓM ({groupKeys.length})</div>
          {groupKeys.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>chưa có nhóm nào</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groupKeys.map((k) => (
                <div
                  key={k}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1px solid ${step.key === k ? 'var(--teal)' : 'var(--border)'}`,
                    background: step.key === k ? 'rgba(45,212,191,.07)' : 'rgba(0,0,0,.2)',
                    boxShadow: step.key === k ? '0 0 14px var(--teal-glow)' : 'none',
                    transition: 'all .3s var(--ease)',
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: 'var(--teal)' }}>"{k || '∅'}": </span>
                  <span className="mono" style={{ fontSize: 13 }}>
                    {step.groups[k].map((x) => `"${x}"`).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>KEY ĐANG XÉT</div>
            <p className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {step.key === null ? '—' : `"${step.key || '∅'}"`}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              sort chữ cái của từ hiện tại
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              SỐ NHÓM
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {groupKeys.length}
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>strs (cách nhau dấu phẩy):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 300 }}
            value={wordsStr}
            onChange={(e) => setWordsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(wordsStr); }}
            placeholder="eat,tea,tan,ate,nat,bat"
          />
          <button className="btn" onClick={() => build(wordsStr)}>Build</button>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn ghost"
            onClick={() => {
              setWordsStr(p.nums);
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
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>O(n·k log k)</div>
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
