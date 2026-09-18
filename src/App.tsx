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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        <CustomCursor />
        <Loader />
        <HeaderNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogListPage />} />
            <Route path="blind75" element={<Blind75Page />} />
            <Route path=":slug" element={<BlogDetailPage />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
