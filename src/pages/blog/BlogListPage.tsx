import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BLIND75, BLIND_CATEGORIES } from '../../data/blind75';
import { GUIDES } from '../../data/guides';
import { ProblemStatement } from './ProblemStatement';
import { diffPill } from './visualizers/shared';
import { Seo } from '../../components/Seo';

const hasGuide = (no: number) =>
  Object.values(GUIDES).some((g) => g.blindNo === no);

export const BlogListPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [onlyGuides, setOnlyGuides] = useState(false);

  const posts = useMemo(() => {
    const seen = new Set<number>();
    return BLIND75.filter((p) => {
      if (seen.has(p.no)) return false; // Merge K hiện 2 nhánh → chỉ hiện 1 lần
      seen.add(p.no);
      if (category !== 'all' && p.category !== category) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (onlyGuides && !hasGuide(p.no)) return false;
      const q = query.toLowerCase();
      return (
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.viTitle.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q)
      );
    });
  }, [query, category, difficulty, onlyGuides]);

  const guideSlugFor = (no: number) =>
    Object.values(GUIDES).find((g) => g.blindNo === no)?.slug;

  // Bài có guide nhưng không thuộc Blind75 (vd binary-search-704): hiện riêng để không mồ côi
  const blindNos = useMemo(() => new Set(BLIND75.map((p) => p.no)), []);
  const extras = useMemo(() => {
    const q = query.toLowerCase();
    return Object.values(GUIDES).filter((g) => {
      if (blindNos.has(g.blindNo) || !g.fallbackMeta) return false;
      if (!q) return true;
      const m = g.fallbackMeta;
      return (
        g.slug.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.viTitle.toLowerCase().includes(q) ||
        m.pattern.toLowerCase().includes(q)
      );
    });
  }, [query, blindNos]);

  return (
    <div>
      <Seo
        title="Blog thuật toán Blind75 tiếng Việt | Nguyễn Phúc Đại"
        description="Tuyển tập 75 bài Blind75 giảng lại tiếng Việt: pattern, đề gốc LeetCode, bài giảng chi tiết, mô phỏng trực quan và sơ đồ cây lộ trình."
        path="/blog"
      />
      <div className="badge">Blog · Thuật toán</div>
      <h1>
        Học thuật toán <span className="accent">dễ hiểu nhất</span>
      </h1>
      <p>
        Tuyển tập 75 bài kinh điển theo lộ trình Blind75, được mình giảng lại bằng tiếng Việt:
        mỗi bài có pattern, độ khó và link đề gốc. Bài nào gắn nút “Hướng dẫn” là có bài giảng
        chi tiết kèm mô phỏng trực quan từng bước chạy.
      </p>

      <div className="rule">
        <p style={{ margin: 0 }}>
          <strong>Cách học gợi ý:</strong> đọc quy tắc → tự code 15 phút → so solution →
          dry-run bằng miệng → ghi lại 1 câu “gặp dạng nào thì dùng pattern này”.
        </p>
      </div>

      <h2>Sơ đồ cây tiến độ</h2>
      <Link to="/blog/blind75" className="card teal" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          ROADMAP · SƠ ĐỒ CÂY THEO LỘ TRÌNH HỌC
        </div>
        <h3 style={{ marginTop: 0 }}>Mở sơ đồ cây Blind 75 →</h3>
        <p style={{ fontSize: 13.5, margin: 0 }}>
          10 nhánh chủ đề thu/mở trực quan, đánh dấu lưu tiến độ và thanh theo dõi chi tiết từng nhánh.
        </p>
      </Link>

      <h2>Tất cả bài ({posts.length})</h2>
      <div className="card">
        <div className="card-title"><span className="dot"></span>BỘ LỌC</div>
        <input
          className="dsa-search"
          placeholder="Tìm bài, pattern... (vd: stack, dp, sliding window)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="btn-row">
          <button className={`btn ${category === 'all' ? 'primary' : ''}`} onClick={() => setCategory('all')}>Tất cả</button>
          {BLIND_CATEGORIES.map((c) => (
            <button key={c} className={`btn ${category === c ? 'primary' : ''}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="btn-row">
          {(['all', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button key={d} className={`btn ${difficulty === d ? 'primary' : ''}`} onClick={() => setDifficulty(d)}>
              {d === 'all' ? 'Mọi độ khó' : d}
            </button>
          ))}
          <button className={`btn ${onlyGuides ? 'primary' : ''}`} onClick={() => setOnlyGuides((v) => !v)}>
            {onlyGuides ? '✓ Có hướng dẫn' : 'Có hướng dẫn'}
          </button>
        </div>
      </div>

      <div className="grid-3">
        {posts.map((p) => {
          const gs = guideSlugFor(p.no);
          return (
            <div key={p.no} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-title">
                <span className="dot"></span>#{p.no} · {p.category} · {p.pattern}
              </div>
              <h3 style={{ marginTop: 0 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5 }}>
                <span style={{ color: 'var(--accent)' }}>{p.viTitle}</span> — {p.summary}
              </p>
              <ProblemStatement p={p} compact />
              <div>
                <span className={diffPill(p.difficulty)}>{p.difficulty}</span>
                {p.premium && <span className="pill premium">PREMIUM</span>}
                {gs && <span className="pill">CÓ HƯỚNG DẪN</span>}
              </div>
              <div className="btn-row">
                {gs && <Link to={`/blog/${gs}`} className="btn primary">Hướng dẫn →</Link>}
                <a href={`https://leetcode.com/problems/${p.lcSlug}/`} target="_blank" rel="noreferrer" className="btn ghost">
                  LeetCode ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
      {posts.length === 0 && <p>Không tìm thấy bài. Thử từ khóa khác.</p>}

      {extras.length > 0 && (
        <>
          <h2>Bài bổ trợ ({extras.length})</h2>
          <p style={{ fontSize: 13.5 }}>
            Bài nền tảng ngoài Blind75 nhưng được các bài khác nhắc tới — có đủ bài giảng 6 ngôn ngữ.
          </p>
          <div className="grid-3">
            {extras.map((g) => {
              const m = g.fallbackMeta!;
              return (
                <div key={g.slug} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-title">
                    <span className="dot"></span>#{g.blindNo} · {m.category} · {m.pattern}
                  </div>
                  <h3 style={{ marginTop: 0 }}>{m.title}</h3>
                  <p style={{ fontSize: 13.5 }}>
                    <span style={{ color: 'var(--accent)' }}>{m.viTitle}</span> — {m.summary}
                  </p>
                  <div>
                    <span className={diffPill(m.difficulty)}>{m.difficulty}</span>
                    <span className="pill">CÓ HƯỚNG DẪN</span>
                  </div>
                  <div className="btn-row">
                    <Link to={`/blog/${g.slug}`} className="btn primary">Hướng dẫn →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
