import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import './dsa.css';

const THEME_KEY = 'dsa-blog-theme';

export const BlogLayout = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="dsa-scope" data-theme={theme}>
      {/* Nút chuyển đổi Light / Dark mode chỉ xuất hiện ở blog */}
      <div
        className="dsa-theme-toggle-container"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 999,
        }}
      >
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 100,
            border: '1px solid var(--border-strong)',
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            color: 'var(--fg)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {theme === 'dark' ? <Sun size={16} color="var(--accent)" /> : <Moon size={16} color="var(--accent)" />}
          <span>{theme === 'dark' ? 'Sáng' : 'Tối'}</span>
        </button>
      </div>

      <div className="dsa-container">
        <Outlet />
        <footer>
          Blind 75 · biên soạn bởi <strong style={{ color: 'var(--accent)' }}>Nguyễn Phúc Đại</strong>
        </footer>
      </div>
    </div>
  );
};

