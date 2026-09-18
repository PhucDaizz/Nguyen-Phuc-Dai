import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { getPostBySlug, ALGORITHM_POSTS } from '../../data/algorithms';

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="blog-container blog-narrow">
        <h1>Không tìm thấy bài viết</h1>
        <p className="blog-sub">Slug “{slug}” chưa tồn tại. Quay lại danh sách để học tiếp.</p>
        <Link to="/blog" className="blog-back">
          <ArrowLeft size={14} /> Về Blog
        </Link>
      </div>
    );
  }

  const related = ALGORITHM_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <div className="blog-container blog-narrow">
      <Link to="/blog" className="blog-back">
        <ArrowLeft size={14} /> Tất cả bài viết
      </Link>
      <p className="blog-eyebrow">
        {post.category} · {post.difficulty}
      </p>
      <h1>{post.title}</h1>
      <div className="blog-detail-meta">
        <span>
          <Calendar size={13} /> {post.date}
        </span>
        <span>
          <Clock size={13} /> {post.readMinutes} phút đọc
        </span>
        <span className="blog-mono">
          Time {post.complexity.time} · Space {post.complexity.space}
        </span>
      </div>
      <p className="blog-lead">{post.summary}</p>

      {post.content.map((para, i) => (
        <p key={i} className="blog-para">
          {para}
        </p>
      ))}

      {post.code && (
        <>
          <h3>Code minh họa ({post.code.language})</h3>
          <pre className="blog-code">
            <code>{post.code.snippet}</code>
          </pre>
        </>
      )}

      <div className="blog-tags">
        {post.tags.map((t) => (
          <span key={t} className="blog-chip static">
            #{t}
          </span>
        ))}
      </div>

      {related.length > 0 && (
        <div className="blog-related">
          <h3>Đọc tiếp</h3>
          {related.map((r) => (
            <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-related-link">
              → {r.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
