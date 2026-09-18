import { Outlet } from 'react-router-dom';

export const BlogLayout = () => {
  return (
    <div className="blog-page">
      <div className="noise-overlay" />
      <Outlet />
    </div>
  );
};
