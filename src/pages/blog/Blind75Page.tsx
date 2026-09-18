import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BLIND75, BLIND_CATEGORIES, leetcodeUrl, type BlindProblem } from '../../data/blind75';

const STORE_KEY = 'dsa-blind75-done-v1';
const diffClass = (d: BlindProblem['difficulty']) =>
  d === 'Easy' ? 'pill' : d === 'Medium' ? 'pill amber' : 'pill amber';

const loadDone = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const Blind75Page = () => {
  const [done, setDone] = useState<number[]>(() => loadDone());
  const [open, setOpen] = useState<string[]>(BLIND_CATEGORIES);
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (no: number) =>
    setDone((d) => (d.includes(no) ? d.filter((x) => x !== no) : [...d, no]));
  const toggleCat = (cat: string) =>
    setOpen((o) => (o.includes(cat) ? o.filter((x) => x !== cat) : [...o, cat]));

  const uniqueNos = useMemo(() => [...new Set(BLIND75.map((p) => p.no))], []);
  const doneSet = useMemo(() => new Set(done), [done]);
  const totalDone = uniqueNos.filter((n) => doneSet.has(n)).length;

  return (
    <div>
      <Link to="/blog" className="btn ghost">← Về Blog</Link>
      <div style={{ height: 18 }} />
      <div className="badge">Roadmap · Blind 75</div>
      <h1>
        Blind 75 <span className="accent">sơ đồ cây</span>
      </h1>
      <p>
        Clone đầy đủ 75 đầu bài theo đúng nhóm của NeetCode: click LeetCode để đọc đề gốc,
        bài nào có nút <span className="mono" style={{ color: 'var(--accent)' }}>“Hướng dẫn”</span> là
        đã có bài giảng tiếng Việt trong blog. Tick checkbox để lưu tiến độ (localStorage).
      </p>

      <div className="rule">
        <p style={{ margin: 0 }}>
          <strong>Tiến độ của bạn: {totalDone}/{uniqueNos.length}</strong> — mỗi category là 1
          nhánh cây, xong nhánh nào thu gọn nhánh đó. Thứ tự khuyên học: Array → String →
          Linked List → Tree → Binary → DP → Interval → Matrix → Heap → Graph.
        </p>
      </div>

      {/* progress tổng */}
      <div className="card teal">
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          OVERALL {totalDone}/{uniqueNos.length} · {Math.round((totalDone / uniqueNos.length) * 100)}%
        </div>
        <div style={{ height: 10, borderRadius: 100, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
          <div style={{ width: `${(totalDone / uniqueNos.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .4s var(--ease)' }} />
        </div>
        <div className="btn-row">
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((f) => (
            <button key={f} className={`btn ${filter === f ? 'primary' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tất cả' : f}
            </button>
          ))}
          <button className="btn ghost" onClick={() => setOpen(BLIND_CATEGORIES)}>Mở hết</button>
          <button className="btn ghost" onClick={() => setOpen([])}>Thu hết</button>
          <button className="btn ghost" onClick={() => { if (confirm('Xóa hết tiến độ Blind75?')) setDone([]); }}>Reset</button>
        </div>
      </div>

      {/* cây category */}
      {BLIND_CATEGORIES.map((cat) => {
        const items = BLIND75.filter(
          (p) => p.category === cat && (filter === 'all' || p.difficulty === filter),
        );
        if (items.length === 0) return null;
        const catDone = items.filter((p) => doneSet.has(p.no)).length;
        const isOpen = open.includes(cat);
        return (
          <div key={cat} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => toggleCat(cat)}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '18px 24px', boxSizing: 'border-box' }}
            >
              <span className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{isOpen ? '▾' : '▸'}</span>
              <span style={{ fontWeight: 700, fontSize: 17 }}>{cat}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                {catDone}/{items.length}
              </span>
              <span style={{ flex: 1, height: 6, borderRadius: 100, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                <span style={{ display: 'block', width: `${items.length ? (catDone / items.length) * 100 : 0}%`, height: '100%', background: 'var(--teal)' }} />
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((p) => {
                  const checked = doneSet.has(p.no);
                  return (
                    <div
                      key={`${cat}-${p.no}`}
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
                          <span className={diffClass(p.difficulty)}>{p.difficulty}</span>
                          {p.premium && <span className="pill amber">PREMIUM</span>}
                        </div>
                        <p style={{ fontSize: 13, margin: '6px 0', color: 'rgba(240,233,216,.75)' }}>
                          <span style={{ color: 'var(--accent)' }}>{p.viTitle}</span> — {p.summary}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: 11, color: 'var(--teal)' }}>{p.pattern}</span>
                          {p.guideSlug ? (
                            <Link to={`/blog/${p.guideSlug}`} className="btn primary" style={{ padding: '4px 10px', fontSize: 12 }}>
                              Hướng dẫn →
                            </Link>
                          ) : null}
                          <a href={leetcodeUrl(p)} target="_blank" rel="noreferrer" className="btn ghost" style={{ padding: '4px 10px', fontSize: 12 }}>
                            LeetCode ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
