import { Link, useParams } from 'react-router-dom';
import { BLIND75, leetcodeUrl } from '../../data/blind75';
import { getGuide } from '../../data/guides';
import { ProblemStatement } from './ProblemStatement';
import { hasVisualizer } from './visualizers';

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuide(slug) : undefined;

  if (!guide) {
    return (
      <div className="dsa-narrow">
        <div className="badge">Blog · Blind 75</div>
        <h1>Bài này <span className="accent">chưa có hướng dẫn</span></h1>
        <p>
          Slug “{slug}” chưa có bài giảng tiếng Việt. Bạn có thể đọc đề gốc trên LeetCode
          hoặc quay lại danh sách Blind75 để chọn bài khác.
        </p>
        <div className="btn-row">
          <Link to="/blog" className="btn primary">← Về danh sách Blind75</Link>
          <Link to="/blog/blind75" className="btn">Sơ đồ cây →</Link>
        </div>
      </div>
    );
  }

  const blind = BLIND75.find((p) => p.no === guide.blindNo);
  const meta = blind ?? {
    no: guide.blindNo,
    lcSlug: '',
    ...guide.fallbackMeta!,
  };
  const lines = guide.code.split('\n');
  const related = BLIND75.filter((p) => p.category === meta.category && p.no !== meta.no).slice(0, 2);

  return (
    <div>
      <div className="btn-row">
        <Link to="/blog" className="btn ghost">← Tất cả bài Blind75</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
      </div>
      <div style={{ height: 18 }} />
      <div className="badge">Blind 75 · {meta.category} · #{meta.no}</div>
      <h1>
        {meta.title} <span className="accent">— {meta.viTitle}</span>
      </h1>
      <p>{meta.summary}</p>
      {blind && <ProblemStatement p={blind} />}
      <div>
        <span className="pill amber">{meta.difficulty}</span>
        <span className="pill">TIME {guide.time}</span>
        <span className="pill">SPACE {guide.space}</span>
        {blind && (
          <a href={leetcodeUrl(blind)} target="_blank" rel="noreferrer" className="btn ghost" style={{ padding: '4px 10px', fontSize: 12 }}>
            Đề gốc LeetCode ↗
          </a>
        )}
        {slug && hasVisualizer(slug) && (
          <Link to={`/blog/${slug}/visualize`} className="btn primary" style={{ padding: '4px 10px', fontSize: 12 }}>
            Mô phỏng trực quan →
          </Link>
        )}
      </div>

      <div className="rule">
        <p style={{ margin: 0 }}><strong>{guide.rule}</strong></p>
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
              {guide.checklist.map((c) => (
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
              <div className="name">{guide.filename}<span className="live" /></div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{guide.time} · {guide.space}</div>
            </div>
            <pre>
              <code>
                {lines.map((ln, i) => (
                  <span key={i} className={`line ${guide.highlightLines.includes(i + 1) ? 'active' : ''}`}>
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
            <p className="mono" style={{ color: 'var(--teal)' }}>{guide.dryRun.input}</p>
            <div className="demo">
              <div className="demo-label">trace từng bước</div>
              {guide.dryRun.trace.map((t) => (
                <p key={t} className="mono" style={{ fontSize: 12.5, margin: 0 }}>→ {t}</p>
              ))}
              <div className="demo-label">output</div>
              <p className="mono" style={{ color: 'var(--accent)', margin: 0 }}>{guide.dryRun.output}</p>
            </div>
          </div>

          <h2 id="pitfalls">Bẫy thường gặp</h2>
          <div className="grid-2">
            {guide.pitfalls.map((pit) => (
              <div key={pit} className="card">
                <div className="card-title"><span className="dot"></span>LƯU Ý</div>
                <p style={{ margin: 0, fontSize: 13.5 }}>{pit}</p>
              </div>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2>Cùng nhánh {meta.category}</h2>
              <div className="grid-2">
                {related.map((r) => {
                  return (
                    <div key={r.no} className="card">
                      <div className="card-title"><span className="dot"></span>#{r.no} · {r.pattern}</div>
                      <h3 style={{ marginTop: 0 }}>{r.title}</h3>
                      <p style={{ fontSize: 13.5, margin: 0 }}>{r.viTitle}</p>
                      <div className="btn-row">
                        {r.guideSlug && <Link to={`/blog/${r.guideSlug}`} className="btn primary">Hướng dẫn →</Link>}
                        <a href={leetcodeUrl(r)} target="_blank" rel="noreferrer" className="btn ghost">LeetCode ↗</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
