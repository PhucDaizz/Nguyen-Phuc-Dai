import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BLIND75, leetcodeUrl } from '../../data/blind75';
import { ProblemStatement } from './ProblemStatement';
import { diffPill } from './visualizers/shared';

const CONFETTI_COLORS = ['#ffb547', '#ff7e5f', '#2dd4bf', '#f0e9d8'];

const VIDEO_ID = 'mZtKo3thUGw'; // Myles Smith – Stargazing (official MV)
// Mốc điệp khúc do user chốt — ĐỪNG ĐỔI số này nữa
const CHORUS_START = 39;

// Nạp YouTube IFrame API 1 lần duy nhất
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let ytApiPromise: Promise<void> | null = null;
const loadYtApi = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        resolve();
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
  }
  return ytApiPromise;
};

const STORE_KEY = 'dsa-blind75-done-v1';

// ---------- Roadmap tree definition (topic nào mở khóa topic nào) ----------
interface TreeNode {
  id: string;
  label: string;
  x: number; // center x trong canvas
  y: number; // center y trong canvas
  w?: number;
  problems: number[]; // LeetCode no thuộc node
}

const NODES: TreeNode[] = [
  { id: 'arrays', label: 'Arrays & Hashing', x: 600, y: 60, w: 200, problems: [1, 217, 238, 242, 49, 271] },
  { id: 'two-pointers', label: 'Two Pointers', x: 460, y: 220, w: 190, problems: [125, 11, 15] },
  { id: 'stack', label: 'Stack', x: 770, y: 220, w: 190, problems: [20] },
  { id: 'binary-search', label: 'Binary Search', x: 250, y: 380, w: 190, problems: [153, 33] },
  { id: 'sliding-window', label: 'Sliding Window', x: 500, y: 380, w: 190, problems: [3, 424, 76] },
  { id: 'linked-list', label: 'Linked List', x: 790, y: 380, w: 190, problems: [206, 141, 21, 23, 19, 143] },
  { id: 'trees', label: 'Trees', x: 545, y: 540, w: 190, problems: [104, 100, 226, 124, 102, 297, 572, 105, 230, 235] },
  { id: 'tries', label: 'Tries', x: 270, y: 700, w: 190, problems: [208, 211, 212] },
  { id: 'heap', label: 'Heap / Priority Queue', x: 545, y: 700, w: 200, problems: [23, 347, 295] },
  { id: 'backtracking', label: 'Backtracking', x: 860, y: 700, w: 190, problems: [39, 79] },
  { id: 'graphs', label: 'Graphs', x: 720, y: 860, w: 190, problems: [133, 207, 417, 200, 128] },
  { id: 'one-dp', label: '1-D Dynamic Programming', x: 990, y: 860, w: 210, problems: [70, 198, 213, 91, 322, 300, 55, 139, 5, 647] },
  { id: 'intervals', label: 'Intervals', x: 110, y: 1040, w: 170, problems: [57, 56, 435, 252, 253] },
  { id: 'greedy', label: 'Greedy', x: 350, y: 1040, w: 170, problems: [121, 53] },
  { id: 'adv-graphs', label: 'Advanced Graphs', x: 590, y: 1040, w: 190, problems: [269, 261, 323] },
  { id: 'two-dp', label: '2-D Dynamic Programming', x: 830, y: 1040, w: 210, problems: [62, 1143] },
  { id: 'bit', label: 'Bit Manipulation', x: 1060, y: 1040, w: 190, problems: [371, 191, 338, 268, 190] },
  { id: 'math', label: 'Math & Geometry', x: 945, y: 1220, w: 200, problems: [48, 54, 73, 152] },
];

const EDGES: [string, string][] = [
  ['arrays', 'two-pointers'],
  ['arrays', 'stack'],
  ['two-pointers', 'binary-search'],
  ['two-pointers', 'sliding-window'],
  ['two-pointers', 'linked-list'],
  ['binary-search', 'trees'],
  ['sliding-window', 'trees'],
  ['linked-list', 'trees'],
  ['trees', 'tries'],
  ['trees', 'heap'],
  ['trees', 'backtracking'],
  ['heap', 'intervals'],
  ['heap', 'greedy'],
  ['heap', 'adv-graphs'],
  ['backtracking', 'graphs'],
  ['backtracking', 'one-dp'],
  ['graphs', 'adv-graphs'],
  ['graphs', 'two-dp'],
  ['one-dp', 'two-dp'],
  ['one-dp', 'bit'],
  ['two-dp', 'math'],
  ['bit', 'math'],
];

const NODE_H = 64;
const CANVAS_W = 1200;
const CANVAS_H = 1300;

const edgePath = (a: TreeNode, b: TreeNode) => {
  const x1 = a.x;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y - NODE_H / 2;
  const dy = Math.max((y2 - y1) / 2, 20);
  return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
};

const loadDone = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const Blind75Page = () => {
  const [done, setDone] = useState<number[]>(() => loadDone());
  const [selected, setSelected] = useState<string>('arrays');
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(done));
  }, [done]);

  // Ctrl + cuộn chuột = zoom (chặn cuộn trang khi đang zoom cây)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(2.2, Math.max(0.4, +(z - Math.sign(e.deltaY) * 0.1).toFixed(2))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoomBy = (d: number) =>
    setZoom((z) => Math.min(2.2, Math.max(0.4, +(z + d).toFixed(2))));

  const fitWidth = () => {
    const el = scrollRef.current;
    if (!el) return;
    setZoom(Math.min(1, Math.max(0.4, +(el.clientWidth / CANVAS_W).toFixed(2))));
  };

  // Mobile/màn hẹp: mặc định thu cây vừa khung nhìn
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.clientWidth > 0 && el.clientWidth < CANVAS_W) {
      setZoom(+(el.clientWidth / CANVAS_W).toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneSet = useMemo(() => new Set(done), [done]);
  const nodeById = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  const ratio = (n: TreeNode) =>
    n.problems.length === 0 ? 0 : n.problems.filter((p) => doneSet.has(p)).length / n.problems.length;

  const uniqueNos = useMemo(() => [...new Set(BLIND75.map((p) => p.no))], []);
  const totalDone = uniqueNos.filter((n) => doneSet.has(n)).length;
  const complete = uniqueNos.length > 0 && totalDone === uniqueNos.length;

  // Bắn pháo hoa khi vừa chạm 74/74 (mỗi lần hoàn thành lại bắn lại)
  const celebratedRef = useRef(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  // Dựng/tắt trình phát ẩn theo musicOn + complete
  useEffect(() => {
    if (!musicOn || !complete) {
      setMusicPlaying(false);
      return;
    }
    let cancelled = false;
    let player: any = null;
    loadYtApi().then(() => {
      if (cancelled || !window.YT) return;
      player = new window.YT.Player('celebration-player', {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 1, start: CHORUS_START, loop: 1, playlist: VIDEO_ID },
        events: {
          onReady: (e: any) => e.target.playVideo(),
          onStateChange: (e: any) => setMusicPlaying(e.data === 1),
        },
      });
      playerRef.current = player;
    });
    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* đã unmount */
      }
      playerRef.current = null;
    };
  }, [musicOn, complete]);

  const toggleMusic = () => {
    const p = playerRef.current;
    if (!p || typeof p.getPlayerState !== 'function') return;
    if (p.getPlayerState() === 1) p.pauseVideo();
    else p.playVideo();
  };
  const fireConfetti = () => {
    const end = Date.now() + 2500;
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
    // 2 bên + giữa, kéo dài ~2.5s
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: CONFETTI_COLORS });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: CONFETTI_COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        startVelocity: 35,
        origin: { y: 0.5 },
        colors: CONFETTI_COLORS,
      });
    }, 900);
  };
  useEffect(() => {
    if (complete && !celebratedRef.current) {
      celebratedRef.current = true;
      // nhạc + pháo hoa cùng lúc (trong cùng gesture tick nên autoplay được phép)
      setMusicOn(true);
      // đợi layout ổn định rồi bắn
      const t = window.setTimeout(fireConfetti, 450);
      return () => window.clearTimeout(t);
    }
    if (!complete) {
      celebratedRef.current = false;
      setMusicOn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  const sel = nodeById[selected];
  const selProblems = sel
    ? sel.problems
        .map((no) => BLIND75.find((p) => p.no === no))
        .filter((p) => p !== undefined)
    : [];

  const toggle = (no: number) =>
    setDone((d) => (d.includes(no) ? d.filter((x) => x !== no) : [...d, no]));

  return (
    <div>
      <Link to="/blog" className="btn ghost">← Về Blog</Link>
      <div style={{ height: 18 }} />
      <div className="badge">Roadmap · Blind 75</div>
      <h1>
        Blind 75 <span className="accent">sơ đồ cây</span>
      </h1>
      <p>
        Click từng node để xem bài bên trong. Học xong bài nào thì <strong>tick luôn</strong> để
        lưu tiến độ — node nào xanh lá là xong 100%, thanh ngang dưới
        mỗi node là % cày được. Nghe đồn cày full cây sẽ có <strong>phần thưởng ở cuối</strong> đó 👀
      </p>

      <div className="card teal">
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          TIẾN ĐỘ CHUNG {totalDone}/{uniqueNos.length} · {Math.round((totalDone / uniqueNos.length) * 100)}%
        </div>
        <div style={{ height: 10, borderRadius: 100, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
          <div style={{ width: `${(totalDone / uniqueNos.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .4s var(--ease)' }} />
        </div>
        <div className="btn-row">
          <button className="btn ghost" onClick={() => { if (confirm('Xóa hết tiến độ Blind75?')) setDone([]); }}>Reset tiến độ</button>
        </div>
      </div>

      {complete && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            borderColor: 'rgba(255,181,71,.5)',
            boxShadow: '0 0 30px var(--accent-glow)',
            position: 'relative',
          }}
        >
          {musicOn && (
            <button
              onClick={toggleMusic}
              title={musicPlaying ? 'Tạm dừng nhạc' : 'Phát tiếp nhạc'}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid var(--border-strong)',
                background: 'rgba(0,0,0,.4)',
                color: 'var(--accent)',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .2s var(--ease)',
              }}
            >
              {musicPlaying ? '⏸' : '▶'}
            </button>
          )}
          <div className="badge" style={{ marginBottom: 12 }}>Blind 75 · Hoàn thành</div>
          <h2 style={{ margin: '0 0 8px', justifyContent: 'center' }}>
            🎉 Chúc mừng — {totalDone}/{uniqueNos.length}!
          </h2>
          <p style={{ margin: '0 auto 10px', maxWidth: 600 }}>
            74/74 không đơn thuần là một con số, mà là quả ngọt sau những giờ bạn bền bỉ
            đối diện với từng bài toán hóc búa, từng lỗi sai và cả những lần tưởng chừng bế tắc.
          </p>
          <p style={{ margin: '0 auto 14px', maxWidth: 600 }}>
            Thời gian và tâm sức bạn đã trao đi hôm nay chính là năng lực vững chắc của ngày mai.
            Cảm ơn bạn vì đã không bỏ cuộc và kiên nhẫn đi đến tận bài cuối cùng! 💪
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <button className="btn primary" onClick={fireConfetti}>Bắn pháo hoa lại 🎉</button>
          </div>
        </div>
      )}
      {/* Trình phát ẩn: điệp khúc Stargazing khi full 74/74 (YouTube chính chủ).
          Div ngoài cố định để React gỡ an toàn (YT thay div trong bằng iframe,
          gỡ thẳng div trong sẽ crash đen màn hình). */}
      {musicOn && complete && (
        <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div id="celebration-player" />
        </div>
      )}

      {/* ===== CÂY + SIDEBAR ===== */}
      <div className="blind-layout">
        {/* CÂY SVG (trái) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="btn-row" style={{ marginBottom: 10 }}>
            <button className="btn" onClick={() => zoomBy(-0.15)} title="Thu nhỏ">−</button>
            <span className="mono" style={{ alignSelf: 'center', fontSize: 12, color: 'var(--muted)', minWidth: 52, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button className="btn" onClick={() => zoomBy(0.15)} title="Phóng to">+</button>
            <button className="btn ghost" onClick={() => setZoom(1)}>100%</button>
            <button className="btn ghost" onClick={fitWidth} title="Thu vừa màn hình">Vừa màn hình</button>
            <span style={{ alignSelf: 'center', fontSize: 12, color: 'var(--muted)' }}>Mẹo: giữ Ctrl + cuộn chuột để zoom</span>
          </div>
          <div className="blind-tree-scroll" ref={scrollRef}>
          <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              backgroundColor: '#0b0e14',
              backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          >
          <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0 }}>
            {EDGES.map(([from, to]) => (
              <path
                key={`${from}-${to}`}
                d={edgePath(nodeById[from], nodeById[to])}
                fill="none"
                stroke="rgba(255,255,255,.28)"
                strokeWidth={3}
              />
            ))}
          </svg>
          {NODES.map((n) => {
            const r = ratio(n);
            const complete = r === 1 && n.problems.length > 0;
            const isSel = selected === n.id;
            const w = n.w ?? 190;
            return (
              <button
                key={n.id}
                onClick={() => setSelected(n.id)}
                style={{
                  all: 'unset',
                  position: 'absolute',
                  left: n.x - w / 2,
                  top: n.y - NODE_H / 2,
                  width: w,
                  height: NODE_H,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  background: complete ? '#2f6b4f' : '#3d4560',
                  border: isSel ? '2px solid var(--accent)' : '2px solid transparent',
                  boxShadow: complete
                    ? '0 0 18px rgba(46,204,113,.45)'
                    : isSel
                      ? '0 0 18px var(--accent-glow)'
                      : 'none',
                  transition: 'all .25s var(--ease)',
                }}
              >
                <span>{n.label}</span>
                <span style={{ width: '85%', height: 4, borderRadius: 100, background: 'rgba(255,255,255,.35)', overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: `${r * 100}%`, height: '100%', background: complete ? '#fff' : '#2dd4bf' }} />
                </span>
              </button>
            );
          })}
          </div>
          </div>
        </div>
        </div>

        {/* SIDEBAR BÀI TRONG NODE (phải, sticky) */}
        {sel && (
          <aside className="card blind-sidebar">
            <div className="card-title">
              <span className="dot"></span>
              {sel.label.toUpperCase()} · {sel.problems.filter((p) => doneSet.has(p)).length}/{sel.problems.length}
            </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selProblems.map((p) => {
              const checked = doneSet.has(p.no);
              return (
                <div
                  key={p.no}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '12px 14px', borderRadius: 14,
                    border: '1px solid var(--border)',
                    background: checked ? 'rgba(45,212,191,.05)' : 'rgba(0,0,0,.2)',
                    opacity: checked ? 0.75 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(p.no)}
                    style={{ marginTop: 4, width: 16, height: 16, accentColor: '#2dd4bf', cursor: 'pointer' }}
                    title="Đánh dấu đã làm"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>#{p.no}</span>
                      <strong style={{ fontSize: 14.5, textDecoration: checked ? 'line-through' : 'none' }}>
                        {p.title}
                      </strong>
                      <span className={diffPill(p.difficulty)}>{p.difficulty}</span>
                      {p.premium && <span className="pill premium">PREMIUM</span>}
                    </div>
                    <p style={{ fontSize: 13, margin: '6px 0', color: 'rgba(240,233,216,.75)' }}>
                      <span style={{ color: 'var(--accent)' }}>{p.viTitle}</span> — {p.summary}
                    </p>
                    <ProblemStatement p={p} compact />
                    <div className="btn-row">
                      {p.guideSlug && <Link to={`/blog/${p.guideSlug}`} className="btn primary" style={{ padding: '4px 10px', fontSize: 12 }}>Hướng dẫn →</Link>}
                      <a href={leetcodeUrl(p)} target="_blank" rel="noreferrer" className="btn ghost" style={{ padding: '4px 10px', fontSize: 12 }}>
                        LeetCode ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
