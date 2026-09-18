import { Outlet } from 'react-router-dom';
import './dsa.css';

export const BlogLayout = () => {
  return (
    <div className="dsa-scope">
      <div className="dsa-container">
        <Outlet />
        <footer>DSA Grind75 · dễ &amp; dễ hiểu nhất · Space Grotesk + JetBrains Mono</footer>
      </div>
    </div>
  );
};
