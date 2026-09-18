import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, TreeSvg, parseTreeList, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'emit' | 'decode' | 'done';
  phase: 'encode' | 'decode';
  tokens: string[];
  pos: number | null; // token/pos đang xử lý
  built: (number | null)[]; // cây dựng lại tới step này (level-order)
  message: string; codeLine: number;
}

interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
}

const toObj = (arr: (number | null)[]): TNode | null => {
  if (arr.length === 0 || arr[0] === null) return null;
  const nodes = arr.map((v) => (v === null ? null : { val: v, left: null, right: null } as TNode));
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length) nodes[i]!.left = nodes[l];
    if (r < nodes.length) nodes[i]!.right = nodes[r];
  }
  return nodes[0];
};

// preorder emit (kèm index node gốc để highlight)
const preorderIdx = (root: TNode | null): { tok: string; idx: number | null }[] => {
  const out: { tok: string; idx: number | null }[] = [];
  const walk = (n: TNode | null, idx: number) => {
    if (!n) {
      out.push({ tok: '#', idx: null });
      return;
    }
    out.push({ tok: String(n.val), idx });
    walk(n.left, 2 * idx + 1);
    walk(n.right, 2 * idx + 2);
  };
  walk(root, 0);
  return out;
};

// dựng cây từ tokens, trả về level-order array sau mỗi token tiêu thụ
const decodeSteps = (tokens: string[]): (number | null)[][] => {
  const snaps: (number | null)[][] = [];
  // rebuild từng bước: tiêu thụ token dần, snapshot mảng tới max index đã biết
  const all: (number | null)[] = [];
  const ensure = (i: number) => {
    while (all.length <= i) all.push(null);
  };
  let ti = 0;
  const walk = (idx: number): void => {
    const tok = tokens[ti++];
    ensure(idx);
    if (tok === '#') {
      all[idx] = null;
    } else {
      all[idx] = Number(tok);
    }
    snaps.push([...all]);
    if (tok !== '#') {
      walk(2 * idx + 1);
      walk(2 * idx + 2);
    }
  };
  if (tokens.length > 0) walk(0);
  // cắt null đuôi cho gọn hiển thị
  return snaps.map((s) => {
    const t = [...s];
    while (t.length > 0 && t[t.length - 1] === null) t.pop();
    return t;
  });
};

const generateTrace = (arr: (number | null)[]): Step[] => {
  const trace: Step[] = [];
  const root = toObj(arr);
  trace.push({
    type: 'init', phase: 'encode', tokens: [], pos: null, built: [],
    message: 'Phase 1 — <strong>encode</strong>: preorder, null → "#". Phase 2 — <strong>decode</strong> đọc lại đúng thứ tự.',
    codeLine: 0,
  });
  if (!root) {
    trace.push({
      type: 'emit', phase: 'encode', tokens: ['#'], pos: null, built: [],
      message: 'Cây rỗng → encode ra "<strong>#</strong>".',
      codeLine: 3,
    });
    trace.push({
      type: 'done', phase: 'decode', tokens: ['#'], pos: null, built: [],
      message: 'Decode "#" → <strong>null</strong>. Round-trip khớp.',
      codeLine: 13,
    });
    return trace;
  }
  const seq = preorderIdx(root);
  const tokens: string[] = [];
  seq.forEach((s) => {
    tokens.push(s.tok);
    trace.push({
      type: 'emit', phase: 'encode', tokens: [...tokens], pos: s.idx, built: [],
      message: s.tok === '#'
        ? `Gặp null → emit "<strong>#</strong>". Chuỗi: ${tokens.join(',')}.`
        : `Thăm <strong>${s.tok}</strong> (preorder) → emit. Chuỗi: ${tokens.join(',')}.`,
      codeLine: s.tok === '#' ? 3 : 4,
    });
  });

  const snaps = decodeSteps(tokens);
  snaps.forEach((built, k) => {
    trace.push({
      type: 'decode', phase: 'decode', tokens: [...tokens], pos: k, built,
      message: `Đọc token <strong>[${k}] = "${tokens[k]}"</strong>${tokens[k] === '#' ? ' → null' : ` → node ${tokens[k]}`} → cây dựng lại dần.`,
      codeLine: 13,
    });
  });

  trace.push({
    type: 'done', phase: 'decode', tokens: [...tokens], pos: null,
    built: snaps.length > 0 ? snaps[snaps.length - 1] : [],
    message: `Hoàn tất. Decode ra cây giống hệt gốc → round-trip <strong>OK</strong>.`,
    codeLine: 18,
  });
  return trace;
};

const CSHARP_LINES = [
  'public string Serialize(TreeNode root) {',
  '    var sb = new StringBuilder();',
  '    void Pre(TreeNode n) {',
  "        if (n == null) { sb.Append(\"#, \"); return; }",
  '        sb.Append(n.val).Append(",");',
  '        Pre(n.left);',
  '        Pre(n.right);',
  '    }',
  '    Pre(root);',
  '    return sb.ToString();',
  '}',
  'public TreeNode Deserialize(string data) {',
  '    var toks = new Queue<string>(data.Split(","));',
  '    TreeNode Build() {',
  '        var t = toks.Dequeue();',
  '        if (t == "#") return null;',
  '        var n = new TreeNode(int.Parse(t));',
  '        n.left = Build();',
  '        n.right = Build();',
  '        return n;',
  '    }',
  '    return Build();',
  '}',
];

export const SerializeVisualizer = () => {
  const [str, setStr] = useState('1,2,3,null,null,4,5');
  const [arr, setArr] = useState<(number | null)[]>([1, 2, 3, null, null, 4, 5]);
  const trace = useMemo(() => generateTrace(arr), [arr]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    pb.restart();
    setArr(parseTreeList(v));
  };

  const states: Record<number, TreeNodeState> = {};
  if (step.phase === 'encode' && step.pos !== null) states[step.pos] = 'cur';

  return (
    <div>
      <VizHeader
        backTo="/blog/serialize-tree-297" backLabel="Bài giảng Serialize Tree"
        badge="Preorder + # · Hard" title="Serialize Tree" accent="trực quan"
        sub="Encode: preorder + # cho null. Decode: đọc token đúng thứ tự preorder là dựng lại được cây."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>
            {step.phase === 'encode' ? 'CÂY GỐC (PREORDER)' : 'CÂY DỰNG LẠI'}
          </div>
          <TreeSvg values={step.phase === 'encode' ? arr : step.built} states={step.phase === 'encode' ? states : undefined} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>TOKENS ({step.tokens.length})</div>
            {step.tokens.length === 0 ? (
              <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>chưa emit</p>
            ) : (
              <p className="mono" style={{ fontSize: 12.5, margin: 0, wordBreak: 'break-all', lineHeight: 2 }}>
                {step.tokens.map((tk, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 6px',
                      borderRadius: 6,
                      marginRight: 4,
                      background: step.phase === 'decode' && step.pos === i ? 'var(--accent)' : tk === '#' ? 'rgba(255,181,71,.1)' : 'rgba(45,212,191,.1)',
                      color: step.phase === 'decode' && step.pos === i ? 'var(--bg)' : tk === '#' ? 'var(--accent)' : 'var(--teal)',
                      fontWeight: step.phase === 'decode' && step.pos === i ? 700 : 400,
                    }}
                  >
                    {tk}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              PHASE
            </div>
            <p className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.phase === 'encode' ? '1/2 · ENCODE' : '2/2 · DECODE'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="tree (level-order):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="1,2,3,null,null,4,5" maxWidth={300} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · [1,2,3,null,null,4,5]', value: '1,2,3,null,null,4,5' },
          { label: 'Lệch · [1,null,2,null,3]', value: '1,null,2,null,3' },
          { label: '1 node', value: '1' },
          { label: 'Rỗng', value: '' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(n) · O(n)" />
    </div>
  );
};
