import type { BlindProblem } from '../../data/blind75';

// Đề bài tiếng Anh + ví dụ, hiển thị đầu mỗi bài (sidebar, list, detail).
export const ProblemStatement = ({ p, compact = false }: { p: BlindProblem; compact?: boolean }) => (
  <div
    style={{
      borderLeft: '3px solid var(--accent)',
      background: 'rgba(255,181,71,.05)',
      borderRadius: '0 10px 10px 0',
      padding: '10px 12px',
      margin: '8px 0',
    }}
  >
    <div className="demo-label" style={{ marginBottom: 4 }}>Problem · EN</div>
    <p style={{ fontSize: compact ? 12.5 : 13.5, margin: '0 0 8px', color: 'rgba(240,233,216,.9)' }}>
      {p.statement}
    </p>
    {p.examples.slice(0, compact ? 1 : 2).map((ex, i) => (
      <p key={i} className="mono" style={{ fontSize: 12, margin: '0 0 4px', color: 'var(--teal)' }}>
        Ex: <span style={{ color: 'rgba(240,233,216,.85)' }}>{ex.input} → {ex.output}</span>
        {ex.note && <span style={{ color: 'var(--muted)' }}> ({ex.note})</span>}
      </p>
    ))}
    {!compact && (
      <p className="mono" style={{ fontSize: 11, margin: '4px 0 0', color: 'var(--muted)' }}>
        {p.constraints.join(' · ')}
      </p>
    )}
  </div>
);
