import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress,
} from './shared';

interface Step {
  type: 'start' | 'visit' | 'dead' | 'found' | 'done';
  r: number | null;
  c: number | null;
  k: number; // số chữ đã khớp
  path: [number, number][]; // đường đang đi
  message: string; codeLine: number;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

const generateTrace = (board: string[][], word: string): Step[] => {
  const trace: Step[] = [];
  const R = board.length;
  const C = board[0]?.length ?? 0;
  trace.push({
    type: 'start', r: null, c: null, k: 0, path: [],
    message: `Thử mọi ô làm điểm bắt đầu, DFS 4 hướng khớp từng chữ của "<strong>${word || '(rỗng)'}</strong>". Ô đã thăm đè "#" rồi rỡ lại.`,
    codeLine: 2,
  });
  if (word.length === 0) {
    trace.push({
      type: 'done', r: null, c: null, k: 0, path: [],
      message: 'Từ rỗng → <strong>true</strong>.',
      codeLine: 4,
    });
    return trace;
  }
  if (R === 0 || C === 0) {
    trace.push({
      type: 'done', r: null, c: null, k: 0, path: [],
      message: 'Bảng rỗng → <strong>false</strong>.',
      codeLine: 18,
    });
    return trace;
  }

  const vis = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  const path: [number, number][] = [];
  const snapPath = (): [number, number][] => path.map((p) => [...p] as [number, number]);
  let solved = false;
  let guard = 0;
  const MAX = 300;

  const dfs = (r: number, c: number, k: number): boolean => {
    if (solved || guard > MAX) return solved;
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C || vis[r][c] || board[r][c] !== word[k]) return false;
    vis[r][c] = true;
    path.push([r, c]);
    guard++;
    if (guard <= MAX) {
      trace.push({
        type: 'visit', r, c, k: k + 1, path: snapPath(),
        message: `Ô (${r},${c})='${board[r][c]}' khớp chữ thứ <strong>${k}</strong> ('${word[k]}') → đã khớp <strong>${k + 1}/${word.length}</strong>.`,
        codeLine: 10,
      });
    }
    for (const [dr, dc] of DIRS) {
      if (dfs(r + dr, c + dc, k + 1)) {
        if (k + 1 === word.length) {
          solved = true;
          trace.push({
            type: 'found', r, c, k: k + 1, path: snapPath(),
            message: `Hết chữ tại ô (${r},${c}) → tìm được "<strong>${word}</strong>" → <strong>true</strong>, dừng.`,
            codeLine: 4,
          });
        }
        vis[r][c] = false;
        path.pop();
        return true;
      }
      if (solved || guard > MAX) break;
    }
    if (!solved && guard <= MAX) {
      trace.push({
        type: 'dead', r, c, k: k + 1, path: snapPath(),
        message: `Từ ô (${r},${c}) 4 hướng đều cụt → <strong>backtrack</strong> (rỡ dấu, lùi lại).`,
        codeLine: 13,
      });
    }
    vis[r][c] = false;
    path.pop();
    return false;
  };

  for (let r = 0; r < R && !solved; r++) {
    for (let c = 0; c < C && !solved; c++) {
      if (board[r][c] === word[0]) {
        if (dfs(r, c, 0)) break;
      }
      if (guard > MAX) break;
    }
  }

  trace.push({
    type: 'done', r: null, c: null, k: solved ? word.length : 0, path: [],
    message: solved
      ? `Hoàn tất → <strong>true</strong>.`
      : guard > MAX
        ? `Trace quá dài nên dừng sớm (giới hạn ${MAX} steps) — hãy thử bảng/từ nhỏ hơn. Kết luận tạm: <strong>chưa thấy</strong>.`
        : `Thử hết điểm bắt đầu, không đường nào khớp → <strong>false</strong>.`,
    codeLine: 18,
  });
  return trace;
};

const CSHARP_LINES = [
  'public bool Exist(char[][] board, string word) {',
  '    int R = board.Length, C = board[0].Length;',
  '    bool Dfs(int r, int c, int k) {',
  '        if (k == word.Length) return true;',
  '        if (r < 0 || c < 0 || r >= R || c >= C) return false;',
  '        if (board[r][c] != word[k]) return false;',
  '        char tmp = board[r][c];',
  '        board[r][c] = \'#\';',
  '        bool found = Dfs(r+1,c,k+1) || Dfs(r-1,c,k+1)',
  '                   || Dfs(r,c+1,k+1) || Dfs(r,c-1,k+1);',
  '        board[r][c] = tmp;',
  '        return found;',
  '    }',
  '    for (int r = 0; r < R; r++)',
  '        for (int c = 0; c < C; c++)',
  '            if (board[r][c] == word[0] && Dfs(r, c, 0)) return true;',
  '    return false;',
  '}',
];

const parseBoard = (str: string): string[][] =>
  str
    .split(';')
    .map((row) =>
      row
        .split(',')
        .map((s) => s.trim().toUpperCase().slice(0, 1))
        .filter((s) => /^[A-Z]$/.test(s)),
    )
    .filter((row) => row.length > 0);

export const WordSearchVisualizer = () => {
  const [bStr, setBStr] = useState('A,B,C;S,F,C;A,D,E');
  const [wStr, setWStr] = useState('ABCCED');
  const [board, setBoard] = useState<string[][]>([
    ['A', 'B', 'C'],
    ['S', 'F', 'C'],
    ['A', 'D', 'E'],
  ]);
  const [word, setWord] = useState('ABCCED');
  const trace = useMemo(() => generateTrace(board, word.toUpperCase()), [board, word]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (b: string, w: string) => {
    const nb = parseBoard(b);
    const nw = w.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (nb.length === 0 || nb.length > 4 || nb[0].length > 5 || nw.length === 0 || nw.length > 8) return;
    const width = nb[0].length;
    if (!nb.every((row) => row.length === width)) return;
    pb.restart();
    setBoard(nb);
    setWord(nw);
  };

  const pathSet = new Set(step.path.map(([r, c]) => `${r},${c}`));

  return (
    <div>
      <VizHeader
        backTo="/blog/word-search-79" backLabel="Bài giảng Word Search"
        badge="Backtracking · DFS" title="Word Search" accent="trực quan"
        sub="DFS 4 hướng khớp từng chữ, ô thăm đè # rồi rỡ. Đỏ = cụt (backtrack), amber = đường đang đi."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>BẢNG · ĐÃ KHỚP {step.k}/{word.length} "{word}"
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {board.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 6 }}>
              {row.map((ch, c) => {
                const onPath = pathSet.has(`${r},${c}`);
                const isCur = step.r === r && step.c === c;
                const dead = isCur && step.type === 'dead';
                return (
                  <div
                    key={c}
                    style={{
                      width: 46, height: 46,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 10,
                      border: `2px solid ${dead ? '#ff5f57' : onPath ? 'var(--accent)' : 'var(--border)'}`,
                      background: dead
                        ? 'rgba(255,95,87,.12)'
                        : onPath
                          ? 'rgba(255,181,71,.12)'
                          : 'rgba(0,0,0,.25)',
                      color: dead ? '#ff5f57' : onPath ? 'var(--accent)' : 'var(--fg)',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16,
                      boxShadow: dead
                        ? '0 0 12px rgba(255,95,87,.4)'
                        : onPath
                          ? '0 0 12px var(--accent-glow)'
                          : 'none',
                      transition: 'all .25s var(--ease)',
                    }}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="board (≤4×5, hàng cách ;):" value={bStr} onChange={setBStr} onEnter={() => build(bStr, wStr)} placeholder="A,B,C;S,F,C;A,D,E" maxWidth={280} />
        <InputField label="word (≤8 chữ):" value={wStr} onChange={setWStr} onEnter={() => build(bStr, wStr)} placeholder="ABCCED" maxWidth={140} />
        <button className="btn" onClick={() => build(bStr, wStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · ABCCED → true', value: 'A,B,C;S,F,C;A,D,E|ABCCED' },
          { label: 'Sai · ABCB → false', value: 'A,B,C,E;S,F,C,S;A,D,E,E|ABCB' },
          { label: 'Nhỏ · AA → true', value: 'A,A|AA' },
        ]}
        onPick={(v) => {
          const [b, w] = v.split('|');
          setBStr(b);
          setWStr(w);
          build(b, w);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m·n·4^L)" />
    </div>
  );
};
