import { useState } from 'react';
import type { SolutionLang } from '../../data/solutions';

export interface TabSolution {
  lang: SolutionLang;
  label: string;
  filename: string;
  code: string;
}

interface Props {
  solutions: TabSolution[];
  defaultLang?: SolutionLang;
  /** Trả về các dòng (0-based) cần highlight cho từng ngôn ngữ — tab nào cũng sáng đúng dòng */
  getHighlight?: (lang: SolutionLang) => number[];
  meta?: string; // text góc phải header (vd "O(n) · O(n)")
  title?: string;
}

/**
 * Khối code đa ngôn ngữ dạng tab. Dùng chung cho:
 * - trang chi tiết bài (/blog/:slug): TS là tab mặc định
 * - trang visualize (/blog/:slug/visualize): C# mặc định + highlight dòng trace
 * Bài nào chưa có entry đa ngôn ngữ → truyền 1 solution duy nhất, render như cũ.
 */
export const SolutionTabs = ({
  solutions,
  defaultLang,
  getHighlight,
  meta,
  title = 'Solution',
}: Props) => {
  const initial = solutions.findIndex((s) => s.lang === defaultLang);
  const [active, setActive] = useState(initial >= 0 ? initial : 0);
  const current = solutions[active];
  const lines = current.code.split('\n');
  const hl = getHighlight?.(current.lang) ?? [];

  if (solutions.length === 1) {
    return (
      <div className="code-block">
        <div className="code-head">
          <div className="dots">
            <i style={{ background: '#ff5f57' }} />
            <i style={{ background: '#febc2e' }} />
            <i style={{ background: '#28c840' }} />
          </div>
          <div className="name">{current.filename}<span className="live" /></div>
          {meta && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{meta}</div>}
        </div>
        <pre>
          <code>
            {lines.map((ln, i) => (
              <span
                key={i}
                className={`line ${hl.includes(i) ? 'active' : ''}`}
              >
                {ln || ' '}
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <div className="dots">
          <i style={{ background: '#ff5f57' }} />
          <i style={{ background: '#febc2e' }} />
          <i style={{ background: '#28c840' }} />
        </div>
        <div className="name">{title}<span className="live" /></div>
        {meta && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{meta}</div>}
      </div>
      <div className="sol-tabs" role="tablist" aria-label="Solution languages">
        {solutions.map((s, i) => (
          <button
            key={s.lang}
            role="tab"
            aria-selected={i === active}
            className={`sol-tab ${i === active ? 'on' : ''}`}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <pre>
        <code>
          {lines.map((ln, i) => (
            <span
              key={`${current.lang}-${i}`}
              className={`line ${hl.includes(i) ? 'active' : ''}`}
            >
              {ln || ' '}
            </span>
          ))}
        </code>
      </pre>
      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
        {current.filename}
      </div>
    </div>
  );
};
