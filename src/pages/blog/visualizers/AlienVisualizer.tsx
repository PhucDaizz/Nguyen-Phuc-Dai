import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GraphSvg, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'edge' | 'badorder' | 'pop' | 'done';
  order: string[];
  queue: string[];
  indeg: [string, number][];
  cur: string | null;
  bad: boolean;
  message: string; codeLine: number;
}

const generateTrace = (words: string[]): Step[] => {
  const trace: Step[] = [];
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) {
    for (const c of w) {
      if (!adj.has(c)) adj.set(c, new Set());
      if (!indeg.has(c)) indeg.set(c, 0);
    }
  }
  trace.push({
    type: 'init', order: [], queue: [], indeg: [...indeg.entries()], cur: null, bad: false,
    message: `Mọi chữ đều là node (${indeg.size} chữ). So <strong>cặp từ kề nhau</strong>, chữ đầu tiên khác nhau → cạnh có hướng.`,
    codeLine: 1,
  });
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) {
      trace.push({
        type: 'badorder', order: [], queue: [], indeg: [...indeg.entries()], cur: null, bad: true,
        message: `"${a}" dài hơn mà đứng trước tiền tố "${b}" của nó → vô lý → return <strong>""</strong>.`,
        codeLine: 11,
      });
      trace.push({
        type: 'done', order: [], queue: [], indeg: [...indeg.entries()], cur: null, bad: true,
        message: 'Hoàn tất → <strong>""</strong>.',
        codeLine: 11,
      });
      return trace;
    }
    const m = Math.min(a.length, b.length);
    let k = 0;
    while (k < m && a[k] === b[k]) k++;
    if (k < m && !adj.get(a[k])!.has(b[k])) {
      adj.get(a[k])!.add(b[k]);
      indeg.set(b[k], indeg.get(b[k])! + 1);
      trace.push({
        type: 'edge', order: [], queue: [], indeg: [...indeg.entries()], cur: a[k], bad: false,
        message: `"${a}" vs "${b}": khác đầu tiên ở '${a[k]}' vs '${b[k]}' → cạnh <strong>${a[k]}→${b[k]}</strong>.`,
        codeLine: 16,
      });
    }
  }
  const queue: string[] = [];
  indeg.forEach((d, c) => {
    if (d === 0) queue.push(c);
  });
  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    trace.push({
      type: 'pop', order: [...order], queue: [...queue], indeg: [...indeg.entries()], cur: u, bad: false,
      message: `Lấy '<strong>${u}</strong>' (bậc vào 0) → thứ tự: ${order.join('')}. Trừ bậc các chữ sau nó.`,
      codeLine: 26,
    });
    for (const v of adj.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  const ok = order.length === indeg.size;
  trace.push({
    type: 'done', order: [...order], queue: [], indeg: [...indeg.entries()], cur: null, bad: !ok,
    message: ok
      ? `Đủ ${order.length}/${indeg.size} chữ → thứ tự: "<strong>${order.join('')}</strong>".`
      : `Chỉ ra được ${order.length}/${indeg.size} chữ → có chu trình → <strong>""</strong>.`,
    codeLine: 30,
  });
  return trace;
};

const CSHARP_LINES = [
  'public string AlienOrder(string[] words) {',
  '    var adj = new Dictionary<char, HashSet<char>>();',
  '    var indeg = new Dictionary<char, int>();',
  '    foreach (var w in words)',
  '        foreach (char c in w) {',
  '            adj.TryAdd(c, new());',
  '            indeg.TryAdd(c, 0);',
  '        }',
  '    for (int i = 0; i < words.Length - 1; i++) {',
  '        string a = words[i], b = words[i+1];',
  '        if (a.Length > b.Length && a.StartsWith(b)) return "";',
  '        int m = Math.Min(a.Length, b.Length);',
  '        for (int k = 0; k < m; k++)',
  '            if (a[k] != b[k]) {',
  '                if (adj[a[k]].Add(b[k]))',
  '                    indeg[b[k]]++;',
  '                break;',
  '            }',
  '    }',
  '    var q = new Queue<char>(indeg.Where(p => p.Value == 0).Select(p => p.Key));',
  '    var res = new System.Text.StringBuilder();',
  '    while (q.Count > 0) {',
  '        char u = q.Dequeue();',
  '        res.Append(u);',
  '        foreach (char v in adj[u])',
  '            if (--indeg[v] == 0) q.Enqueue(v);',
  '    }',
  '    return res.Length == indeg.Count ? res.ToString() : "";',
  '}',
];

export const AlienVisualizer = () => {
  const [str, setStr] = useState('wrt,wrf,er,ett,rftt');
  const [words, setWords] = useState<string[]>(['wrt', 'wrf', 'er', 'ett', 'rftt']);
  const trace = useMemo(() => generateTrace(words), [words]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (v: string) => {
    const nw = v.split(',').map((s) => s.trim().toLowerCase().replace(/[^a-z]/g, '')).filter((s) => s !== '');
    if (nw.length === 0 || nw.length > 6) return;
    pb.restart();
    setWords(nw);
  };

  // đồ thị chữ: node = chữ đã thấy, edges suy từ indeg? — dựng lại cạnh từ trace không có.
  // Đơn giản: hiện thứ tự topo + bậc vào từng chữ.
  const chars = step.indeg.map(([c]) => c);
  const states: Record<number, TreeNodeState> = {};
  chars.forEach((c, i) => {
    if (step.order.includes(c)) states[i] = 'done';
  });
  if (step.cur !== null) {
    const i = chars.indexOf(step.cur);
    if (i >= 0) states[i] = 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/alien-dict-269" backLabel="Bài giảng Alien Dictionary"
        badge="Topo Sort · Premium" title="Alien Dictionary" accent="trực quan"
        sub="Cạnh từ cặp từ kề nhau, rồi Kahn: bậc vào 0 thì lấy. Hết queue mà thiếu chữ là có chu trình."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>TỪ ĐÃ CHO</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {words.map((w, i) => (
              <span key={i} className="mono" style={{ fontSize: 13, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(0,0,0,.25)' }}>
                {w}
              </span>
            ))}
          </div>
          <div className="card-title"><span className="dot"></span>BẢNG CHỮ (XANH = ĐÃ XẾP)</div>
          <GraphSvg n={Math.max(chars.length, 1)} edges={[]} states={states} labels={chars.length > 0 ? chars : ['∅']} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>BẬC VÀO</div>
            <p className="mono" style={{ fontSize: 12, margin: 0, color: 'var(--muted)', lineHeight: 2 }}>
              {step.indeg.length === 0 ? '—' : step.indeg.map(([c, d]) => `${c}:${d}`).join('  ')}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '6px 0 0' }}>
              queue: [{step.queue.join(', ') || '∅'}]
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              THỨ TỰ ({step.order.length})
            </div>
            <p className="mono" style={{ fontSize: 20, fontWeight: 700, color: step.bad ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
              {step.order.join('') || '—'}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="words (phẩy, ≤6 từ):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="wrt,wrf,er,ett,rftt" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · wertf', value: 'wrt,wrf,er,ett,rftt' },
          { label: 'Vô nghiệm tiền tố', value: 'abc,ab' },
          { label: 'Nhỏ · ba,bc', value: 'ba,bc' },
        ]}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(C)" />
    </div>
  );
};
