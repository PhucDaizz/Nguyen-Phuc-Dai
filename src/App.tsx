import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { CustomCursor } from './components/CustomCursor';
import { HeaderNav } from './components/HeaderNav';
import { Loader } from './components/Loader';
import { HomePage } from './pages/HomePage';
import { BlogLayout } from './pages/blog/BlogLayout';
import { BlogListPage } from './pages/blog/BlogListPage';
import { BlogDetailPage } from './pages/blog/BlogDetailPage';
import { Blind75Page } from './pages/blog/Blind75Page';
import { VisualizerPage } from './pages/blog/visualizers';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppShell() {
  const { pathname } = useLocation();
  // Hiệu ứng nặng của portfolio (boot loader 3D, cursor hạt) chỉ chạy ở trang chủ.
  // Route /blog giữ nhẹ: vào thẳng, không boot screen, không cursor custom.
  const isBlog = pathname.startsWith('/blog');

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      {!isBlog && <CustomCursor />}
      {!isBlog && <Loader />}
      <HeaderNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogLayout />}>
          <Route index element={<BlogListPage />} />
          <Route path="blind75" element={<Blind75Page />} />
          <Route path=":slug/visualize" element={<VisualizerPage />} />
          <Route path=":slug" element={<BlogDetailPage />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </MotionConfig>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
