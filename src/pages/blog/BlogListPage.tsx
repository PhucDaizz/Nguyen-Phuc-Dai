import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GRIND_PROBLEMS, GRIND_WEEKS } from '../../data/grind75';
import { blindCount } from '../../data/blind75';

export const BlogListPage = () => {
  const [query, setQuery] = useState('');
  const [week, setWeek] = useState<number | 'all'>('all');

  const posts = useMemo(
    () =>
      GRIND_PROBLEMS.filter((p) => {
        const matchWeek = week === 'all' || p.week === week;
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.viTitle.toLowerCase().includes(q) ||
          p.pattern.toLowerCase().includes(q);
        return matchWeek && matchQ;
      }),
    [query, week],
  );

  const patterns = [...new Set(GRIND_PROBLEMS.map((p) => p.pattern))];

  return (
    <div>
      <div className="badge">Blog · DSA Grind75</div>
      <h1>
        Grind75 <span className="accent">dễ hiểu nhất</span>
      </h1>
      <p>
        Mỗi bài đúng 1 pattern — quy tắc nhận diện, code TypeScript ngắn gọn, dry-run từng bước.
        Học theo tuần, mỗi tuần 1 kỹ năng, không lan man.
      </p>

      <div className="rule">
        <p style={{ margin: 0 }}>
          <strong>Cách học:</strong> đọc QUY TẮC → tự code 15 phút → so solution → chạy dry-run
          bằng miệng → ghi lại 1 câu “khi nào dùng pattern này”.
        </p>
      </div>

      <h2>Lộ trình 8 tuần</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <span className="dot"></span>Tiến độ
          </div>
          <div className="mono" style={{ display: 'flex', gap: 24 }}>
            <div><div className="dsa-stat">{GRIND_PROBLEMS.length}</div><div className="demo-label">bài mẫu</div></div>
            <div><div className="dsa-stat">8</div><div className="demo-label">tuần</div></div>
            <div><div className="dsa-stat">{patterns.length}</div><div className="demo-label">pattern</div></div>
          </div>
          <div className="btn-row">
            {( ['all', ...GRIND_WEEKS.map((w) => w.week)] as const ).map((w) => (
              <button
                key={String(w)}
                className={`btn ${week === w ? 'primary' : ''}`}
                onClick={() => setWeek(w as number | 'all')}
              >
                {w === 'all' ? 'Tất cả' : `Tuần ${w}`}
              </button>
            ))}
          </div>
        </div>
        <div className="card teal">
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            Tuần này học gì
          </div>
          {GRIND_WEEKS.filter((w) => week === 'all' || w.week === week)
            .slice(0, 3)
            .map((w) => (
              <p key={w.week} style={{ fontSize: 13.5, margin: '0 0 8px' }}>
                <span className="mono" style={{ color: 'var(--teal)' }}>W{w.week}</span> · {w.focus}
                <br />
                <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>{w.goal}</span>
              </p>
            ))}
          <input
            className="dsa-search"
            placeholder="Tìm bài, pattern... (vd: stack, dp, binary search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <h2>Sơ đồ cây Blind 75</h2>
      <Link to="/blog/blind75" className="card teal" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          ROADMAP · {blindCount} ĐẦU BÀI THEO NHÓM NEETCODE
        </div>
        <h3 style={{ marginTop: 0 }}>Mở sơ đồ cây Blind 75 →</h3>
        <p style={{ fontSize: 13.5 }}>
          Đầy đủ số bài, độ khó, tag, pattern + link LeetCode gốc. Tick để lưu tiến độ,
          bài nào có hướng dẫn tiếng Việt sẽ hiện nút “Hướng dẫn”.
        </p>
      </Link>

      <h2>Bài viết ({posts.length})</h2>      <div className="grid-3">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card-title">
              <span className="dot"></span>#{p.no} · Tuần {p.week} · {p.pattern}
            </div>
            <h3 style={{ marginTop: 0 }}>{p.title}</h3>
            <p style={{ fontSize: 13.5 }}>{p.viTitle} — {p.summary.slice(0, 90)}…</p>
            <div>
              <span className="pill amber">{p.difficulty}</span>
              <span className="pill">{p.time}</span>
              <span className="pill">{p.space}</span>
            </div>
            <div className="btn-row">
              <span className="btn primary">Học ngay →</span>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <p>Không tìm thấy bài. Thử từ khóa khác.</p>}
    </div>
  );
};
