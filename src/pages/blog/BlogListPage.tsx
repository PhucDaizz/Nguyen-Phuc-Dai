import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BrainCircuit } from 'lucide-react';
import { ALGORITHM_POSTS } from '../../data/algorithms';

const CATEGORIES = ['All', 'Big-O', 'Sorting', 'Searching', 'Graph', 'Dynamic Programming', 'Data Structure'] as const;

export const BlogListPage = () => {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');

  const posts = useMemo(() => {
    return ALGORITHM_POSTS.filter((p) => {
      const matchCat = category === 'All' || p.category === category;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [category, query]);

  return (
    <div className="blog-container">
      <header className="blog-hero">
        <p className="blog-eyebrow">
          <BrainCircuit size={14} /> Blog / Thuật toán
        </p>
        <h1>
          Học thuật toán <span className="blog-accent">từ gốc</span>
        </h1>
        <p className="blog-sub">
          Ghi chép ngắn gọn, có code TypeScript chạy được — Big-O, Sorting, Searching, Graph, DP.
        </p>
        <input
          className="blog-search"
          placeholder="Tìm bài viết, tag... (vd: bfs, dp, big-o)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="blog-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`blog-chip ${category === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="blog-grid">
        {posts.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="blog-card"
          >
            <div className="blog-card-meta">
              <span className="blog-badge">{post.category}</span>
              <span className={`blog-level ${post.difficulty.toLowerCase()}`}>{post.difficulty}</span>
            </div>
            <h2>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
            <div className="blog-card-footer">
              <span>
                <Clock size={13} /> {post.readMinutes} min · {post.complexity.time}
              </span>
              <Link to={`/blog/${post.slug}`} className="blog-read">
                Đọc <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {posts.length === 0 && <p className="blog-empty">Không tìm thấy bài viết. Thử từ khóa khác.</p>}
    </div>
  );
};
