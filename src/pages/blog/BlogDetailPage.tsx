import { Link, useParams } from 'react-router-dom';
import { GRIND_PROBLEMS, getGrindBySlug } from '../../data/grind75';

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getGrindBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="dsa-narrow">
        <div className="badge">404</div>
        <h1>Chưa có <span className="accent">bài này</span></h1>
        <p>Slug “{slug}” chưa tồn tại.</p>
        <Link to="/blog" className="btn primary">← Về danh sách Grind75</Link>
      </div>
    );
  }

  const lines = post.code.split('\n');
  const related = GRIND_PROBLEMS.filter((p) => p.slug !== post.slug && p.week === post.week).slice(0, 2);

  return (
    <div>
      <Link to="/blog" className="btn ghost">← Tất cả bài Grind75</Link>
      <div style={{ height: 18 }} />
      <div className="badge">Tuần {post.week} · {post.pattern} · #{post.no}</div>
      <h1>
        {post.title} <span className="accent">— {post.viTitle}</span>
      </h1>
      <p>{post.summary}</p>
      <div>
        <span className="pill amber">{post.difficulty}</span>
        <span className="pill">TIME {post.time}</span>
        <span className="pill">SPACE {post.space}</span>
      </div>

      <div className="rule">
        <p style={{ margin: 0 }}><strong>{post.rule}</strong></p>
      </div>

      <div className="dsa-layout" style={{ marginTop: 32 }}>
        <aside className="toc">
          <a href="#nhan-dien">01 · Nhận diện</a>
          <a href="#solution">02 · Solution</a>
          <a href="#dryrun">03 · Dry-run</a>
          <a href="#pitfalls">04 · Bẫy</a>
        </aside>

        <main>
          <h2 id="nhan-dien" style={{ marginTop: 0 }}>Nhận diện pattern</h2>
          <div className="card">
            <div className="card-title"><span className="dot"></span>CHECKLIST — HỎI 4 CÂU NÀY</div>
            <ul className="checklist">
              {post.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <h2 id="solution">Solution</h2>
          <div className="code-block">
            <div className="code-head">
              <div className="dots">
                <i style={{ background: '#ff5f57' }} />
                <i style={{ background: '#febc2e' }} />
                <i style={{ background: '#28c840' }} />
              </div>
              <div className="name">{post.filename}<span className="live" /></div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{post.time} · {post.space}</div>
            </div>
            <pre>
              <code>
                {lines.map((ln, i) => (
                  <span key={i} className={`line ${post.highlightLines.includes(i + 1) ? 'active' : ''}`}>
                    <span className="ln">{i + 1}</span>{ln || ' '}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          <h2 id="dryrun">Dry-run</h2>
          <div className="card teal">
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              INPUT
            </div>
            <p className="mono" style={{ color: 'var(--teal)' }}>{post.dryRun.input}</p>
            <div className="demo">
              <div className="demo-label">trace từng bước</div>
              {post.dryRun.trace.map((t) => (
                <p key={t} className="mono" style={{ fontSize: 12.5, margin: 0 }}>→ {t}</p>
              ))}
              <div className="demo-label">output</div>
              <p className="mono" style={{ color: 'var(--accent)', margin: 0 }}>{post.dryRun.output}</p>
            </div>
          </div>

          <h2 id="pitfalls">Bẫy thường gặp</h2>
          <div className="grid-2">
            {post.pitfalls.map((pit) => (
              <div key={pit} className="card">
                <div className="card-title"><span className="dot"></span>LƯU Ý</div>
                <p style={{ margin: 0, fontSize: 13.5 }}>{pit}</p>
              </div>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2>Đọc tiếp tuần {post.week}</h2>
              <div className="grid-2">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card-title"><span className="dot"></span>#{r.no} · {r.pattern}</div>
                    <h3 style={{ marginTop: 0 }}>{r.title}</h3>
                    <p style={{ fontSize: 13.5, margin: 0 }}>{r.viTitle}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
