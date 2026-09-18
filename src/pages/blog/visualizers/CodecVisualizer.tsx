import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ===================== TRACE ENGINE =====================
interface Step {
  type: 'encode' | 'decode-scan' | 'decode-cut' | 'init-decode' | 'done';
  phase: 'encode' | 'decode';
  wordIdx: number | null; // từ đang encode
  encoded: string; // chuỗi đã encode tới step này
  decoded: string[]; // từ đã decode tới step này
  scanPos: [number, number] | null; // [i, j] pointer khi decode
  cutRange: [number, number] | null; // [start, end) đoạn vừa cắt
  message: string;
  codeLine: number; // 0-based
}

const parseWords = (str: string): string[] =>
  str.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));

const enc = (w: string) => `${w.length}#${w}`;

const generateTrace = (words: string[]): Step[] => {
  const trace: Step[] = [];
  let encoded = '';
  const snapDec: string[] = [];

  words.forEach((w, i) => {
    encoded += enc(w);
    trace.push({
      type: 'encode', phase: 'encode', wordIdx: i,
      encoded, decoded: [...snapDec],
      scanPos: null, cutRange: null,
      message: `Encode "<strong>${w || '(rỗng)'}</strong>" → "<strong>${enc(w) || '0#'}</strong>". Chuỗi chung: "<strong>${encoded}</strong>".`,
      codeLine: 3,
    });
  });

  trace.push({
    type: 'init-decode', phase: 'decode', wordIdx: null,
    encoded, decoded: [],
    scanPos: null, cutRange: null,
    message: `Decode "<strong>${encoded || '(rỗng)'}</strong>": đọc số tới "#" làm độ dài, cắt đúng bấy nhiêu ký tự.`,
    codeLine: 9,
  });

  let i = 0;
  while (i < encoded.length) {
    let j = i;
    while (encoded[j] !== '#') j++;
    const len = Number(encoded.slice(i, j));
    trace.push({
      type: 'decode-scan', phase: 'decode', wordIdx: null,
      encoded, decoded: [...snapDec],
      scanPos: [i, j], cutRange: null,
      message: `Đọc từ vị trí <strong>${i}</strong> tới "#" ở <strong>${j}</strong> → len = <strong>${len}</strong>.`,
      codeLine: 11,
    });
    const word = encoded.slice(j + 1, j + 1 + len);
    snapDec.push(word);
    trace.push({
      type: 'decode-cut', phase: 'decode', wordIdx: null,
      encoded, decoded: [...snapDec],
      scanPos: null, cutRange: [j + 1, j + 1 + len],
      message: `Cắt <strong>${len}</strong> ký tự sau "#" → "<strong>${word || '(rỗng)'}</strong>". Nhảy tới vị trí <strong>${j + 1 + len}</strong>.`,
      codeLine: 13,
    });
    i = j + 1 + len;
  }

  trace.push({
    type: 'done', phase: 'decode', wordIdx: null,
    encoded, decoded: [...snapDec],
    scanPos: null, cutRange: null,
    message: `Hoàn tất. Decode ra <strong>[${snapDec.map((w) => `"${w}"`).join(', ')}]</strong> — khớp danh sách gốc.`,
    codeLine: 16,
  });
  return trace;
};

// ===================== C# SOLUTION =====================
const CSHARP_LINES = [
  'public string Encode(IList<string> strs) {',
  '    var sb = new StringBuilder();',
  '    foreach (string s in strs)',
  "        sb.Append(s.Length).Append('#').Append(s);",
  '    return sb.ToString();',
  '}',
  'public IList<string> Decode(string s) {',
  '    var res = new List<string>();',
  '    int i = 0;',
  "    while (i < s.Length) {",
  '        int j = i;',
  "        while (s[j] != '#') j++;",
  '        int len = int.Parse(s.Substring(i, j - i));',
  '        res.Add(s.Substring(j + 1, len));',
  '        i = j + 1 + len;',
  '    }',
  '    return res;',
  '}',
];

const PRESETS = [
  { label: 'LeetCode · leet,code,love,you', nums: 'leet,code,love,you' },
  { label: 'Chào hỏi · hello,world', nums: 'hello,world' },
  { label: 'Dấu # · #,# #', nums: '#,##' },
  { label: 'Rỗng · [""]', nums: '""' },
];

// ===================== COMPONENT =====================
export const CodecVisualizer = () => {
  const [wordsStr, setWordsStr] = useState('leet,code,love,you');
  const [words, setWords] = useState<string[]>(['leet', 'code', 'love', 'you']);
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

  // Render chuỗi encoded với segment vừa cắt + pointer i/j
  const renderEncoded = () => {
    if (step.encoded.length === 0)
      return <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>chuỗi rỗng</p>;
    const chars = step.encoded.split('');
    return (
      <p className="mono" style={{ fontSize: 15, lineHeight: 2.2, margin: 0, wordBreak: 'break-all' }}>
        {chars.map((c, i) => {
          const inCut = step.cutRange !== null && i >= step.cutRange[0] && i < step.cutRange[1];
          const isPtr =
            step.scanPos !== null && (i === step.scanPos[0] || i === step.scanPos[1]);
          const isHash = c === '#';
          return (
            <span
              key={i}
              style={{
                padding: '2px 3px',
                borderRadius: 4,
                background: inCut
                  ? 'rgba(45,212,191,.25)'
                  : isPtr
                    ? 'var(--accent)'
                    : isHash
                      ? 'rgba(255,181,71,.15)'
                      : 'transparent',
                color: inCut ? 'var(--teal)' : isPtr ? 'var(--bg)' : isHash ? 'var(--accent)' : 'var(--fg)',
                border: isHash && !isPtr && !inCut ? '1px dashed rgba(255,181,71,.5)' : '1px solid transparent',
                fontWeight: inCut || isPtr || isHash ? 700 : 400,
              }}
            >
              {c}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog/encode-decode-strings-271" className="btn ghost">← Bài giảng Encode/Decode</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />

      <div className="badge">Length Prefix · Design</div>
      <h1>
        Encode &amp; Decode <span className="accent">trực quan</span>
      </h1>
      <p>
        Encode: mỗi chuỗi thành “len#str” rồi nối lại. Decode: đọc số tới "#" làm độ dài rồi cắt
        đúng bấy nhiêu ký tự — ký tự "#" viền đứt, pointer i/j nền amber, đoạn vừa cắt nền teal.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-title">
            <span className="dot"></span>
            {step.phase === 'encode' ? 'PHASE 1 — ENCODE' : 'PHASE 2 — DECODE'}
          </div>
          <div className="demo-label" style={{ marginBottom: 4 }}>Từ gốc</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {words.length === 0 && (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>danh sách rỗng</p>
            )}
            {words.map((w, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: `2px solid ${step.wordIdx === i ? 'var(--accent)' : 'var(--border)'}`,
                  background: step.wordIdx === i ? 'var(--accent)' : 'rgba(0,0,0,.25)',
                  color: step.wordIdx === i ? 'var(--bg)' : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: 'all .3s var(--ease)',
                }}
              >
                "{w}"
              </div>
            ))}
          </div>
          <div className="demo-label" style={{ marginBottom: 4 }}>Chuỗi chung</div>
          <div className="demo" style={{ padding: 12 }}>{renderEncoded()}</div>
          <div style={{ height: 3, background: 'rgba(255,255,255,.05)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ width: `${((stepIdx + 1) / trace.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', transition: 'width .4s var(--ease)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>POINTER</div>
            <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--accent)' }}>
              {step.scanPos ? `i = ${step.scanPos[0]} (bắt đầu số) · j = ${step.scanPos[1]} (vị trí #)` : '—'}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
              {step.phase === 'encode' ? 'đang nối chuỗi' : 'đang quét tìm #'}
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              DECODED ({step.decoded.length})
            </div>
            {step.decoded.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>chưa cắt từ nào</p>
            ) : (
              <p className="mono" style={{ fontSize: 13, margin: 0, color: 'var(--teal)' }}>
                [{step.decoded.map((w) => `"${w}"`).join(', ')}]
              </p>
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
          <label className="mono" style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>strs (cách nhau dấu phẩy):</label>
          <input
            className="dsa-search"
            style={{ maxWidth: 300 }}
            value={wordsStr}
            onChange={(e) => setWordsStr(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') build(wordsStr); }}
            placeholder="leet,code,love,you"
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
