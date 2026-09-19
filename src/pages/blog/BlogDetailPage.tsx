import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BLIND75, leetcodeUrl } from '../../data/blind75';
import { getGuide } from '../../data/guides';
import { ProblemStatement } from './ProblemStatement';
import { hasVisualizer } from './visualizers';
import { diffPill } from './visualizers/shared';
import { Seo, articleJsonLd } from '../../components/Seo';

const STUDY_STEPS = [
  ['Đọc đề', 'Đọc Problem EN + ví dụ để hiểu input/output. Đừng vội nhìn lời giải.'],
  ['Nhận diện pattern', 'Đọc mục Nhận diện pattern → tự nghĩ 10–15 phút: bài này giống pattern/bài nào đã gặp?'],
  ['Hiểu ý tưởng', 'Đọc Ý tưởng từng bước + các quyết định trong code. Hiểu rồi mới mở code để đối chiếu.'],
  ['Dry-run', 'Chạy Dry-run bằng miệng hoặc trên giấy với ví dụ. Sai ở đâu thì dừng ở đó và tìm nguyên nhân.'],
  ['Chốt pattern', 'Ghi lại 1 câu Pattern cần nhớ, tick tiến độ trên sơ đồ cây → rồi qua Mô phỏng trực quan.'],
];

const StudyModal = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(4,6,12,.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, width: '100%', margin: 0, maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className="card-title">
          <span className="dot"></span>HỌC BÀI NÀY SAO CHO VÀO
          <button
            onClick={onClose}
            title="Đóng (Esc)"
            style={{
              marginLeft: 'auto',
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <div className="badge">5 bước · ~30 phút/bài</div>
        <ol style={{ margin: '0 0 14px', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: 14 }}>
          {STUDY_STEPS.map(([title, body], i) => (
            <li key={i}>
              <strong style={{ color: 'var(--accent)' }}>B{i + 1}. {title}.</strong> {body}
            </li>
          ))}
        </ol>
        <div className="rule">
          <p style={{ margin: 0, fontSize: 13 }}>
            <strong>Nguyên tắc:</strong> Hiểu rồi mới nhớ. Thuộc code mà không hiểu
            pattern thì gặp bài mới vẫn bí. <strong>Sai không sao — sai, tìm ra lý do,
            rồi ghi lại mới là học.</strong>
          </p>
        </div>
        <div className="btn-row">
          <button className="btn primary" onClick={onClose}>Rõ rồi, học thôi →</button>
        </div>
      </div>
    </div>
  );
};

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showStudy, setShowStudy] = useState(false);
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
  // Cùng nhánh: ưu tiên theo pattern (relatedSlugs) rồi mới cùng category
  const bySlugs = (guide.relatedSlugs ?? [])
    .flatMap((gs) => {
      const g = getGuide(gs);
      if (!g) return [];
      const b = BLIND75.find((p) => p.no === g.blindNo);
      return b && b.no !== meta.no ? [b] : [];
    })
    .slice(0, 2);
  const related =
    bySlugs.length > 0
      ? bySlugs
      : BLIND75.filter((p) => p.category === meta.category && p.no !== meta.no).slice(0, 2);

  return (
    <div>
      <Seo
        title={`${meta.title} (${meta.viTitle}) — hướng dẫn + mô phỏng | Nguyễn Phúc Đại`}
        description={`${meta.title}: ${meta.summary} Bài giảng tiếng Việt: nhận diện pattern, ý tưởng, code, dry-run, bẫy thường gặp.`}
        path={`/blog/${slug}`}
        ogType="article"
        jsonLd={articleJsonLd({
          headline: `${meta.title} — ${meta.viTitle}`,
          description: meta.summary,
          path: `/blog/${slug}`,
          difficulty: meta.difficulty,
        })}
      />
      <div className="btn-row">
        <Link to="/blog" className="btn ghost">← Tất cả bài Blind75</Link>
        <Link to="/blog/blind75" className="btn ghost">Sơ đồ cây</Link>
        <button className="btn ghost" onClick={() => setShowStudy(true)} title="Hướng dẫn cách học bài này">
          ? Cách học
        </button>
      </div>
      <div style={{ height: 18 }} />
      <div className="badge">Blind 75 · {meta.category} · #{meta.no}</div>
      <h1>
        {meta.title} <span className="accent">— {meta.viTitle}</span>
      </h1>
      <p>{meta.summary}</p>
      {blind && <ProblemStatement p={blind} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '16px 0' }}>
        <span className={diffPill(meta.difficulty)}>{meta.difficulty}</span>
        <span className="pill">TIME {guide.time}</span>
        <span className="pill">SPACE {guide.space}</span>
        {blind && (
          <a href={leetcodeUrl(blind)} target="_blank" rel="noreferrer" className="btn ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
            Đề gốc LeetCode ↗
          </a>
        )}
        {slug && hasVisualizer(slug) && (
          <Link to={`/blog/${slug}/visualize`} className="btn primary" style={{ padding: '6px 14px', fontSize: 12.5, whiteSpace: 'nowrap' }}>
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
          <a href="#ytuong">02 · Ý tưởng</a>
          <a href="#solution">03 · Solution</a>
          <a href="#dryrun">04 · Dry-run</a>
          <a href="#pitfalls">05 · Bẫy</a>
        </aside>

        <main>
          <h2 id="nhan-dien" style={{ marginTop: 0 }}>Nhận diện pattern</h2>
          {guide.insight && <p>{guide.insight}</p>}
          {guide.bruteForce && (
            <div className="card">
              <div className="card-title"><span className="dot"></span>BRUTE FORCE → TỐI ƯU</div>
              <p style={{ margin: 0, fontSize: 14 }}>{guide.bruteForce}</p>
            </div>
          )}
          <div className="card">
            <div className="card-title"><span className="dot"></span>CHECKLIST TỰ HỎI</div>
            <ul className="checklist">
              {guide.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {guide.idea && (
            <>
              <h2 id="ytuong">Ý tưởng (hiểu trước khi đọc code)</h2>
              <div className="card">
                <div className="card-title"><span className="dot"></span>CÁC BƯỚC</div>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 14 }}>
                  {guide.idea.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </>
          )}

          <h2 id="solution">Solution</h2>
          {guide.decisions && (
            <div className="rule">
              <p style={{ margin: '0 0 8px' }}><strong>Quyết định quan trọng trong code:</strong></p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: 13.5 }}>
                {guide.decisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
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
                    {ln || ' '}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          {guide.complexityWhy && (
            <div className="demo" style={{ marginTop: 14 }}>
              <div className="demo-label">độ phức tạp — vì sao</div>
              <p className="mono" style={{ fontSize: 12.5, margin: 0 }}>
                Time {guide.time}: {guide.complexityWhy.time}
              </p>
              <p className="mono" style={{ fontSize: 12.5, margin: '6px 0 0' }}>
                Space {guide.space}: {guide.complexityWhy.space}
              </p>
            </div>
          )}

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

          {guide.takeaway && (
            <div className="rule">
              <p style={{ margin: 0 }}><strong>Pattern cần nhớ:</strong> {guide.takeaway}</p>
            </div>
          )}

          {related.length > 0 && (
            <>
              <h2>{bySlugs.length > 0 ? 'Cùng pattern — đọc tiếp' : `Cùng nhánh ${meta.category}`}</h2>
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
      {showStudy && <StudyModal onClose={() => setShowStudy(false)} />}
      {/* Nút (?) nổi góc phải dưới — mở lại hướng dẫn bất cứ lúc nào */}
      <button
        onClick={() => setShowStudy(true)}
        title="Hướng dẫn cách học (?)"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 1500,
          width: 46,
          height: 46,
          borderRadius: '50%',
          border: '1px solid rgba(255,181,71,.5)',
          background: 'rgba(10,14,26,.9)',
          backdropFilter: 'blur(10px)',
          color: 'var(--accent)',
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          cursor: 'pointer',
          boxShadow: '0 0 18px var(--accent-glow)',
          transition: 'transform .2s var(--ease)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ?
      </button>
    </div>
  );
};
