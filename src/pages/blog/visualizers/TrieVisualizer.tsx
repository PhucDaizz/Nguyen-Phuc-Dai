import { useRef, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, type TreeNodeState,
} from './shared';
import { TrieSvg, newTrie, type TrieObj } from './TrieView';

interface Step {
  type: 'init' | 'walk' | 'create' | 'end' | 'result';
  op: 'insert' | 'search' | 'startsWith';
  word: string;
  pos: number | null; // vị trí ký tự đang xử lý
  path: string | null; // prefix đã đi
  result: boolean | null;
  message: string; codeLine: number;
}

const cloneTrie = (t: TrieObj): TrieObj => ({
  ch: t.ch,
  end: t.end,
  word: t.word,
  kids: Object.fromEntries(Object.entries(t.kids).map(([c, k]) => [c, cloneTrie(k)])),
});

const walk = (root: TrieObj, prefix: string): TrieObj | null => {
  let n: TrieObj | undefined = root;
  for (const c of prefix) {
    n = n?.kids[c];
    if (!n) return null;
  }
  return n ?? null;
};

// Sinh trace cho 1 thao tác trên trie hiện tại; trả về trie mới sau op.
const opTrace = (root: TrieObj, op: Step['op'], word: string): { steps: Step[]; next: TrieObj } => {
  const steps: Step[] = [];
  const next = cloneTrie(root);
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');

  if (op === 'insert') {
    steps.push({
      type: 'init', op, word: clean, pos: null, path: '', result: null,
      message: `Insert "<strong>${clean || '(rỗng)'}</strong>": thiếu nhánh thì tạo, cuối set end.`,
      codeLine: 7,
    });
    let n = next;
    let path = '';
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      if (!n.kids[c]) {
        n.kids[c] = { ch: c, end: false, word: null, kids: {} };
        steps.push({
          type: 'create', op, word: clean, pos: i, path: path + c, result: null,
          message: `Chữ '<strong>${c}</strong>' chưa có → <strong>tạo node mới</strong>.`,
          codeLine: 10,
        });
      } else {
        steps.push({
          type: 'walk', op, word: clean, pos: i, path: path + c, result: null,
          message: `Chữ '<strong>${c}</strong>' đã có → đi theo.`,
          codeLine: 11,
        });
      }
      n = n.kids[c];
      path += c;
    }
    n.end = true;
    steps.push({
      type: 'end', op, word: clean, pos: null, path, result: null,
      message: `Hết từ → set end(<strong>${path || 'root'}</strong>) = true.`,
      codeLine: 13,
    });
    return { steps, next };
  }

  // search / startsWith
  steps.push({
    type: 'init', op, word: clean, pos: null, path: '', result: null,
    message: `${op === 'search' ? 'Search' : 'StartsWith'} "<strong>${clean || '(rỗng)'}</strong>": đi theo từng chữ.`,
    codeLine: op === 'search' ? 15 : 19,
  });
  let path = '';
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    const at = walk(next, path);
    if (!at || !at.kids[c]) {
      steps.push({
        type: 'result', op, word: clean, pos: i, path, result: false,
        message: `Chữ '<strong>${c}</strong>' không có nhánh → <strong>false</strong>.`,
        codeLine: 23,
      });
      return { steps, next };
    }
    path += c;
    steps.push({
      type: 'walk', op, word: clean, pos: i, path, result: null,
      message: `Chữ '<strong>${c}</strong>' có nhánh → đi tiếp.`,
      codeLine: 24,
    });
  }
  const node = walk(next, path);
  const ok = op === 'search' ? !!node?.end : !!node;
  steps.push({
    type: 'result', op, word: clean, pos: null, path, result: ok,
    message:
      op === 'search'
        ? node?.end
          ? `Đi hết + end = true → <strong>true</strong> (đúng từ, không phải prefix).`
          : `Đi hết nhưng end = false → chỉ là prefix → <strong>false</strong>.`
        : `Đi hết prefix → <strong>true</strong> (không cần end).`,
    codeLine: op === 'search' ? 16 : 19,
  });
  return { steps, next };
};

const CSHARP_LINES = [
  'public class Trie {',
  '    private class Node {',
  '        public Dictionary<char, Node> Next = new();',
  '        public bool End;',
  '    }',
  '    private readonly Node root = new();',
  '    public void Insert(string word) {',
  '        var n = root;',
  '        foreach (char c in word) {',
  '            if (!n.Next.ContainsKey(c)) n.Next[c] = new Node();',
  '            n = n.Next[c];',
  '        }',
  '        n.End = true;',
  '    }',
  '    public bool Search(string word) {',
  '        var n = Walk(word);',
  '        return n != null && n.End;',
  '    }',
  '    public bool StartsWith(string prefix) {',
  '        return Walk(prefix) != null;',
  '    }',
  '    private Node Walk(string s) {',
  '        var n = root;',
  '        foreach (char c in s) {',
  '            if (!n.Next.TryGetValue(c, out n)) return null;',
  '        }',
  '        return n;',
  '    }',
  '}',
];

type Op = 'insert' | 'search' | 'startsWith';

export const TrieVisualizer = () => {
  const trieRef = useRef<TrieObj>(newTrie());
  const [snap, setSnap] = useState<TrieObj>(() => cloneTrie(trieRef.current));
  const [op, setOp] = useState<Op>('insert');
  const [wordStr, setWordStr] = useState('apple');
  const [trace, setTrace] = useState<Step[]>(() => [
    {
      type: 'init', op: 'insert', word: '', pos: null, path: '', result: null,
      message: 'Trie rỗng. Nhập từ + chọn thao tác rồi bấm <strong>Run</strong>. Gợi ý: insert vài từ trước.',
      codeLine: 6,
    },
  ]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const run = (useOp: Op, w: string) => {
    const { steps, next } = opTrace(trieRef.current, useOp, w);
    trieRef.current = next;
    setSnap(cloneTrie(next));
    pb.restart();
    setTrace(steps);
  };

  const resetTrie = () => {
    pb.restart();
    trieRef.current = newTrie();
    setSnap(newTrie());
    setTrace([
      {
        type: 'init', op: 'insert', word: '', pos: null, path: '', result: null,
        message: 'Đã xóa Trie. Nhập từ + Run để bắt đầu lại.',
        codeLine: 6,
      },
    ]);
  };

  // Trie hiển thị = snapshot SAU op (đơn giản, ổn định); highlight path step hiện tại
  const states: Record<string, TreeNodeState> = {};
  if (step.path !== null && step.path !== '') {
    states[step.path] =
      step.type === 'create' ? 'add' : step.result === false ? 'bad' : 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/implement-trie-208" backLabel="Bài giảng Implement Trie"
        badge="Trie · O(m)" title="Trie Operations" accent="trực quan"
        sub="Trie giữ nguyên giữa các thao tác: insert tạo nhánh (teal), search/startsWith đi theo (amber). Chấm teal = end-of-word."
      />
      <div className="card">
        <div className="card-title"><span className="dot"></span>TRIE HIỆN TẠI</div>
        <TrieSvg root={snap} states={states} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          {step.op.toUpperCase()} "{step.word}" · RESULT
        </div>
        <p className="mono" style={{ fontSize: 20, fontWeight: 700, color: step.result === false ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
          {step.result === null ? (step.op === 'insert' ? '…' : '?') : step.result ? 'true' : 'false'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          {(['insert', 'search', 'startsWith'] as Op[]).map((o) => (
            <button key={o} className={`btn ${op === o ? 'primary' : ''}`} onClick={() => setOp(o)}>
              {o}
            </button>
          ))}
        </div>
        <InputField label="word:" value={wordStr} onChange={setWordStr} onEnter={() => run(op, wordStr)} placeholder="apple" maxWidth={180} />
        <button className="btn primary" onClick={() => run(op, wordStr)}>Run</button>
        <button className="btn ghost" onClick={resetTrie}>Xóa Trie</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Seed: apple, app, ape', value: '__seed' },
          { label: 'search apple', value: 'search|apple' },
          { label: 'search app (chỉ prefix)', value: 'search|app' },
          { label: 'startsWith ap', value: 'startsWith|ap' },
        ]}
        onPick={(v) => {
          if (v === '__seed') {
            for (const w of ['apple', 'app', 'ape']) {
              const r = opTrace(trieRef.current, 'insert', w);
              trieRef.current = r.next;
            }
            setSnap(cloneTrie(trieRef.current));
            run('search', 'apple');
            return;
          }
          const [o, w] = v.split('|');
          setOp(o as Op);
          setWordStr(w);
          run(o as Op, w);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(m)" />
    </div>
  );
};
