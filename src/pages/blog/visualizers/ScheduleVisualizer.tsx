import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, GraphSvg, type TreeNodeState,
} from './shared';

interface Step {
  type: 'init' | 'pop' | 'done';
  queue: number[];
  indeg: number[];
  taken: number;
  cur: number | null;
  freed: number[]; // môn vừa được giải phóng ở step này
  message: string; codeLine: number;
}

// prereqs "1-0,2-0" nghĩa là [1,0]: học 0 trước 1 (cạnh 0→1)
const parsePre = (str: string): [number, number][] => {
  const out: [number, number][] = [];
  str.split(',').map((s) => s.trim()).filter(Boolean).forEach((p) => {
    const [a, b] = p.split('-').map((x) => Number(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b)) out.push([a, b]);
  });
  return out;
};

const generateTrace = (n: number, pre: [number, number][]): Step[] => {
  const trace: Step[] = [];
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of pre) {
    if (a < 0 || a >= n || b < 0 || b >= n) continue;
    adj[b].push(a);
    indeg[a]++;
  }
  trace.push({
    type: 'init', queue: [], indeg: [...indeg], taken: 0, cur: null, freed: [],
    message: `Đồ thị có hướng: [a,b] = học <strong>b trước a</strong> (cạnh b→a). Bậc vào: [${indeg.join(', ')}].`,
    codeLine: 1,
  });
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  trace.push({
    type: 'init', queue: [...queue], indeg: [...indeg], taken: 0, cur: null, freed: [],
    message: `Môn bậc vào = 0 vào queue trước: [${queue.join(', ') || '∅'}].`,
    codeLine: 8,
  });
  let taken = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    taken++;
    const freed: number[] = [];
    for (const v of adj[u]) {
      indeg[v]--;
      if (indeg[v] === 0) {
        queue.push(v);
        freed.push(v);
      }
    }
    trace.push({
      type: 'pop', queue: [...queue], indeg: [...indeg], taken, cur: u, freed,
      message: `Học xong môn <strong>${u}</strong> (${taken}/${n})${freed.length > 0 ? ` → mở khóa [${freed.join(', ')}]` : ' → không mở thêm môn nào'}.`,
      codeLine: 13,
    });
  }
  trace.push({
    type: 'done', queue: [], indeg: [...indeg], taken, cur: null, freed: [],
    message: taken === n
      ? `Học hết ${n} môn → không chu trình → <strong>true</strong>.`
      : `Chỉ học được ${taken}/${n} môn, còn lại kẹt chu trình → <strong>false</strong>.`,
    codeLine: 18,
  });
  return trace;
};

const CSHARP_LINES = [
  'public bool CanFinish(int n, int[][] pre) {',
  '    var adj = new List<int>[n];',
  '    for (int i = 0; i < n; i++) adj[i] = new();',
  '    var indeg = new int[n];',
  '    foreach (var (a, b) in pre.Select(p => (p[0], p[1]))) {',
  '        adj[b].Add(a);',
  '        indeg[a]++;',
  '    }',
  '    var q = new Queue<int>();',
  '    for (int i = 0; i < n; i++)',
  '        if (indeg[i] == 0) q.Enqueue(i);',
  '    int taken = 0;',
  '    while (q.Count > 0) {',
  '        int u = q.Dequeue();',
  '        taken++;',
  '        foreach (int v in adj[u])',
  '            if (--indeg[v] == 0) q.Enqueue(v);',
  '    }',
  '    return taken == n;',
  '}',
];

export const ScheduleVisualizer = () => {
  const [nStr, setNStr] = useState('4');
  const [pStr, setPStr] = useState('1-0,2-0,3-1,3-2');
  const [n, setN] = useState(4);
  const [pre, setPre] = useState<[number, number][]>([[1, 0], [2, 0], [3, 1], [3, 2]]);
  const trace = useMemo(() => generateTrace(n, pre), [n, pre]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const nn = Number(a);
    const np = parsePre(b);
    if (Number.isNaN(nn) || nn < 1 || nn > 7) return;
    if (!np.every(([x, y]) => x >= 0 && x < nn && y >= 0 && y < nn)) return;
    pb.restart();
    setN(nn);
    setPre(np);
  };

  const edges: [number, number][] = pre
    .filter(([a, b]) => a >= 0 && a < n && b >= 0 && b < n)
    .map(([a, b]) => [b, a]);
  const states: Record<number, TreeNodeState> = {};
  // môn đã học: suy từ taken? — đơn giản: queue=seen, cur=cur, còn lại theo indeg
  step.queue.forEach((q) => {
    states[q] = 'seen';
  });
  if (step.cur !== null) states[step.cur] = 'cur';
  step.freed.forEach((f) => {
    states[f] = 'add';
  });

  return (
    <div>
      <VizHeader
        backTo="/blog/course-schedule-207" backLabel="Bài giảng Course Schedule"
        badge="Topo Sort (Kahn) · O(V+E)" title="Course Schedule" accent="trực quan"
        sub="Môn bậc vào = 0 thì học, học xong trừ bậc các môn kề. Học hết = không chu trình."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>ĐỒ THỊ MÔN HỌC · ĐÃ HỌC {step.taken}/{n}</div>
          <GraphSvg n={n} edges={edges} directed states={states} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-title"><span className="dot"></span>QUEUE (SẴN SÀNG HỌC)</div>
            <p className="mono" style={{ fontSize: 14, margin: 0, color: 'var(--accent)' }}>
              [{step.queue.join(', ') || '∅'}]
            </p>
            <div className="card-title" style={{ marginTop: 12 }}><span className="dot"></span>BẬC VÀO</div>
            <p className="mono" style={{ fontSize: 12, margin: 0, color: 'var(--muted)' }}>
              [{step.indeg.map((d, i) => `${i}:${d}`).join(' ')}]
            </p>
          </div>
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              RESULT
            </div>
            <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.type === 'done' ? (step.taken === n ? 'var(--teal)' : '#ff5f57') : 'var(--accent)', margin: 0 }}>
              {step.type === 'done' ? (step.taken === n ? 'true' : 'false') : `${step.taken}/${n}`}
            </p>
          </div>
        </div>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="số môn n (≤7):" value={nStr} onChange={setNStr} onEnter={() => build(nStr, pStr)} placeholder="4" maxWidth={80} />
        <InputField label="prereqs a-b (học b trước a):" value={pStr} onChange={setPStr} onEnter={() => build(nStr, pStr)} placeholder="1-0,2-0,3-1,3-2" maxWidth={240} />
        <button className="btn" onClick={() => build(nStr, pStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Được · 4 môn', value: '4|1-0,2-0,3-1,3-2' },
          { label: 'Chu trình · false', value: '2|1-0,0-1' },
          { label: 'Rời rạc · 3 môn', value: '3|' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setNStr(a);
          setPStr(b);
          build(a, b);
        }}
      />
      <CodePanel lines={CSHARP_LINES} active={step.codeLine} stats="O(V+E)" />
    </div>
  );
};
