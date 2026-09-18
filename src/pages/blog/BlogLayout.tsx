import { Outlet } from 'react-router-dom';
import './dsa.css';

export const BlogLayout = () => {
  return (
    <div className="dsa-scope">
      <div className="dsa-container">
        <Outlet />
        <footer>
          Blind 75 · biên soạn bởi <strong style={{ color: 'var(--accent)' }}>Nguyễn Phúc Đại</strong>
        </footer>
      </div>
    </div>
  );
};
