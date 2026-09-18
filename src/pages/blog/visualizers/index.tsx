import { Link, useParams } from 'react-router-dom';
import { TwoSumVisualizer } from './TwoSumVisualizer';

// Registry: slug bài giảng → visualizer tương ứng.
// Thêm bài mới: import component + thêm 1 dòng vào map.
const VISUALIZERS: Record<string, () => React.JSX.Element> = {
  'two-sum-1': TwoSumVisualizer,
};

export const hasVisualizer = (slug: string) => slug in VISUALIZERS;

export const VisualizerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const Viz = slug ? VISUALIZERS[slug] : undefined;

  if (!Viz) {
    return (
      <div className="dsa-narrow">
        <div className="badge">Visualizer</div>
        <h1>Chưa có <span className="accent">mô phỏng</span></h1>
        <p>Bài “{slug}” chưa có visualizer. Quay lại bài giảng hoặc danh sách Blind75.</p>
        <div className="btn-row">
          {slug && (
            <Link to={`/blog/${slug}`} className="btn primary">← Về bài giảng</Link>
          )}
          <Link to="/blog/blind75" className="btn">Sơ đồ cây →</Link>
        </div>
      </div>
    );
  }

  return <Viz />;
};
