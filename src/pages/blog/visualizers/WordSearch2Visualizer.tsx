import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress,
} from './shared';
import { getSolutions, WORDSEARCH2_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import { newTrie, type TrieObj } from './TrieView';

interface Step {
  type: 'start' | 'visit' | 'prune' | 'found' | 'done';
  r: number | null;
  c: number | null;
  path: string; // prefix trie đã đi
  found: string[];
  visitedCount: number;
  message: string; codeLine: number;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

const generateTrace = (board: string[][], words: string[]): Step[] => {
  const trace: Step[] = [];
  const R = board.length;
  const C = board[0]?.length ?? 0;

  // Build trie (+ lưu word ở node end)
  const root: TrieObj = newTrie();
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) continue;
    let n = root;
    for (const ch of clean) {
      if (!n.kids[ch]) n.kids[ch] = { ch, end: false, word: null, kids: {} };
      n = n.kids[ch];
    }
    n.end = true;
    n.word = clean;
  }

  trace.push({
    type: 'start', r: null, c: null, path: '', found: [], visitedCount: 0,
    message: `Ném ${words.length} từ vào Trie rồi DFS từ <strong>mọi ô</strong>. Prefix không có trong Trie → cắt nhánh ngay.`,
    codeLine: 7,
  });
  if (R === 0 || C === 0) {
    trace.push({
      type: 'done', r: null, c: null, path: '', found: [], visitedCount: 0,
      message: 'Bảng rỗng.',
      codeLine: 7,
    });
    return trace;
  }

  const found: string[] = [];
  const snapFound = () => [...found];
  const vis = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  let visitedCount = 0;
  const MAX_STEPS = 400;
  let steps = 0;
  let stopped = false;

  const dfs = (r: number, c: number, node: TrieObj, path: string): void => {
    if (stopped || steps > MAX_STEPS) return;
    if (r < 0 || c < 0 || r >= R || c >= C || vis[r][c]) return;
    const ch = board[r][c];
    const next = node.kids[ch];
    if (!next) {
      steps++;
      if (steps <= MAX_STEPS) {
        trace.push({
          type: 'prune', r, c, path, found: snapFound(), visitedCount,
          message: `Ô (${r},${c})='${ch}': prefix "${path + ch}" <strong>không có</strong> trong Trie → cắt nhánh.`,
          codeLine: 11,
        });
      }
      return;
    }
    vis[r][c] = true;
    visitedCount++;
    steps++;
    const np = path + ch;
    if (next.word !== null) {
      found.push(next.word);
      trace.push({
        type: 'found', r, c, path: np, found: snapFound(), visitedCount,
        message: `Tới "<strong>${np}</strong>" là end-of-word → thu "<strong>${next.word}</strong>" (${found.length} từ).`,
        codeLine: 13,
      });
      next.word = null; // chống trùng
    } else if (steps <= MAX_STEPS) {
      trace.push({
        type: 'visit', r, c, path: np, found: snapFound(), visitedCount,
        message: `Ô (${r},${c})='${ch}': prefix "<strong>${np}</strong>" còn trong Trie → đi sâu 4 hướng.`,
        codeLine: 11,
      });
    }
    for (const [dr, dc] of DIRS) {
      dfs(r + dr, c + dc, next, np);
      if (stopped || steps > MAX_STEPS) break;
    }
    vis[r][c] = false;
  };

  for (let r = 0; r < R && !stopped; r++) {
    for (let c = 0; c < C && !stopped; c++) {
      if (steps > MAX_STEPS) {
        stopped = true;
        break;
      }
      dfs(r, c, root, '');
    }
  }

  trace.push({
    type: 'done', r: null, c: null, path: '', found: snapFound(), visitedCount,
    message: found.length === 0
      ? `Hoàn tất. Không tìm được từ nào → <strong>[]</strong>.`
      : `Hoàn tất. Tìm được <strong>${found.length}</strong> từ: [${found.map((w) => `"${w}"`).join(', ')}].`,
    codeLine: 21,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_WORDSEARCH2 = getSolutions('word-search-ii-212');

const parseBoard = (str: string): string[][] =>
  str
    .split(';')
    .map((row) =>
      row
        .split(',')
        .map((s) => s.trim().toLowerCase().slice(0, 1))
        .filter((s) => /^[a-z]$/.test(s)),
    )
    .filter((row) => row.length > 0);

export const WordSearch2Visualizer = () => {
  const [bStr, setBStr] = useState('o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v');
  const [wStr, setWStr] = useState('oath,pea,eat,rain');
  const [board, setBoard] = useState<string[][]>([
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ]);
  const [words, setWords] = useState<string[]>(['oath', 'pea', 'eat', 'rain']);
  const trace = useMemo(() => generateTrace(board, words), [board, words]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (b: string, w: string) => {
    const nb = parseBoard(b);
    const nw = w.split(',').map((s) => s.trim()).filter((s) => s !== '');
    if (nb.length === 0 || nb.length > 4 || nb[0].length > 5 || nw.length === 0 || nw.length > 6) return;
    // bảng phải chữ nhật
    const width = nb[0].length;
    if (!nb.every((row) => row.length === width)) return;
    pb.restart();
    setBoard(nb);
    setWords(nw);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/word-search-ii-212" backLabel="Bài giảng Word Search II"
        badge="Trie + Backtracking · Hard" title="Word Search II" accent="trực quan"
        sub="DFS từ mọi ô men theo Trie: prefix cụt thì cắt, tới end thì thu từ. Đỏ = cắt nhánh, teal = thu từ."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>BẢNG · PREFIX = "{step.path || '∅'}" · ĐÃ THĂM {step.visitedCount} Ô
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex', gap: 6 }}>
                {row.map((ch, c) => {
                  const isCur = step.r === r && step.c === c;
                  const bad = isCur && step.type === 'prune';
                  const good = isCur && step.type === 'found';
                  return (
                    <div
                      key={c}
                      style={{
                        width: 44, height: 44,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 10,
                        border: `2px solid ${bad ? '#ff5f57' : good ? 'var(--teal)' : isCur ? 'var(--accent)' : 'var(--border)'}`,
                        background: bad
                          ? 'rgba(255,95,87,.12)'
                          : good
                            ? 'rgba(45,212,191,.15)'
                            : isCur
                              ? 'rgba(255,181,71,.12)'
                              : 'rgba(0,0,0,.25)',
                        color: bad ? '#ff5f57' : good ? 'var(--teal)' : isCur ? 'var(--accent)' : 'var(--fg)',
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16,
                        boxShadow: bad
                          ? '0 0 12px rgba(255,95,87,.4)'
                          : good
                            ? '0 0 12px var(--teal-glow)'
                            : isCur
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
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            TÌM ĐƯỢC ({step.found.length}/{words.length})
          </div>
          {step.found.length === 0 ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>chưa có</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {step.found.map((w) => (
                <p key={w} className="mono" style={{ fontSize: 14, margin: 0, color: 'var(--teal)' }}>"{w}" ✓</p>
              ))}
            </div>
          )}
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="board (hàng cách nhau ; — ≤4×5):" value={bStr} onChange={setBStr} onEnter={() => build(bStr, wStr)} placeholder="o,a,a,n;e,t,a,e;..." maxWidth={300} />
        <InputField label="words (≤6):" value={wStr} onChange={setWStr} onEnter={() => build(bStr, wStr)} placeholder="oath,pea,eat,rain" maxWidth={220} />
        <button className="btn" onClick={() => build(bStr, wStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · oath,eat', value: 'o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v|oath,pea,eat,rain' },
          { label: 'Nhỏ · ab/abc', value: 'a,b;c,d|ab,abc,ad' },
          { label: '1 ô · a', value: 'a|a,b' },
        ]}
        onPick={(v) => {
          const [b, w] = v.split('|');
          setBStr(b);
          setWStr(w);
          build(b, w);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_WORDSEARCH2}
          defaultLang="csharp"
          getHighlight={(lang) => [WORDSEARCH2_LINE_MAP[lang][step.type]]}
          meta="Trie + DFS"
        />
      </div>
    </div>
  );
};
