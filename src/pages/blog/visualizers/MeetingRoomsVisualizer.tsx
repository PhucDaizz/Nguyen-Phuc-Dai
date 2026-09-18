import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  CodePanel, ThinProgress, IntervalBars,
} from './shared';

interface Step {
  type: 'init' | 'check' | 'done';
  i: number | null; // cặp đang so (với i-1)
  clash: boolean;
  ok: boolean | null;
  message: string; codeLine: number;
}

const parseIntervals = (str: string): [number, number][] => {
  const out: [number, number][] = [];
  str.split(';').map((s) => s.trim()).filter(Boolean).forEach((p) => {
    const [a, b] = p.split(',').map((x) => Number(x.trim()));
    if (!Number.isNaN(a) && !Number.isNaN(b) && a <= b) out.push([a, b]);
  });
  return out;
};

const CSHARP_LINES = [
  'public bool CanAttendMeetings(int[][] intervals) {',
  '    Array.Sort(intervals, (a, b) => a[0] - b[0]);',
  '    for (int i = 1; i < intervals.Length; i++)',
  '        if (intervals[i][0] < intervals[i-1][1]) return false;',
  '    return true;',
  '}',
];

const CSHARP_LINES_2 = [
  'public int MinMeetingRooms(int[][] intervals) {',
  '    var ev = new List<(int t, int d)>();',
  '    foreach (var (s, e) in intervals.Select(p => (p[0], p[1]))) {',
  '        ev.Add((s, 1));',
  '        ev.Add((e, -1));',
  '    }',
  '    ev.Sort((a, b) => a.t != b.t ? a.t - b.t : a.d - b.d);',
  '    int cur = 0, best = 0;',
  '    foreach (var (_, d) in ev) {',
  '        cur += d;',
  '        best = Math.Max(best, cur);',
  '    }',
  '    return best;',
  '}',
];

interface Cfg {
  mode: 'one' | 'many';
  slug: string;
  backLabel: string;
  badge: string;
  title: string;
  sub: string;
  presets: { label: string; value: string }[];
  lines: string[];
  stats: string;
}

const generateOne = (input: [number, number][]): Step[] => {
  const trace: Step[] = [];
  const a = [...input].sort((x, y) => x[0] - y[0]);
  trace.push({
    type: 'init', i: null, clash: false, ok: null,
    message: `Sort theo start → [${a.map(([s, e]) => `[${s},${e}]`).join(', ') || '∅'}]. So từng cặp kề.`,
    codeLine: 1,
  });
  for (let i = 1; i < a.length; i++) {
    if (a[i][0] < a[i - 1][1]) {
      trace.push({
        type: 'check', i, clash: true, ok: false,
        message: `[${a[i]}] bắt đầu ${a[i][0]} < kết thúc ${a[i - 1][1]} của họp trước → <strong>giao nhau</strong> → false.`,
        codeLine: 3,
      });
      trace.push({
        type: 'done', i, clash: true, ok: false,
        message: 'Hoàn tất → <strong>false</strong> (cần hơn 1 phòng).',
        codeLine: 3,
      });
      return trace;
    }
    trace.push({
      type: 'check', i, clash: false, ok: null,
      message: `[${a[i]}] bắt đầu ${a[i][0]} ≥ ${a[i - 1][1]} → ổn, đi tiếp.`,
      codeLine: 3,
    });
  }
  trace.push({
    type: 'done', i: null, clash: false, ok: true,
    message: 'Không cặp nào giao → 1 phòng đủ → <strong>true</strong>.',
    codeLine: 4,
  });
  return trace;
};

const generateMany = (input: [number, number][]): (Step & { cur: number; best: number; evIdx: number; events: [number, number][] })[] => {
  type S = Step & { cur: number; best: number; evIdx: number; events: [number, number][] };
  const trace: S[] = [];
  const ev: [number, number][] = [];
  for (const [s, e] of input) {
    ev.push([s, 1]);
    ev.push([e, -1]);
  }
  ev.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
  const snapEv = (): [number, number][] => ev.map((x) => [...x] as [number, number]);
  trace.push({
    type: 'init', i: null, clash: false, ok: null, cur: 0, best: 0, evIdx: -1, events: snapEv(),
    message: `Sự kiện: bắt đầu +1, kết thúc −1. Cùng giờ thì <strong>kết thúc trước</strong> (họp nối đuôi vẫn 1 phòng).`,
    codeLine: 6,
  });
  let cur = 0;
  let best = 0;
  ev.forEach(([t, d], k) => {
    cur += d;
    if (cur > best) best = cur;
    trace.push({
      type: 'check', i: k, clash: false, ok: null, cur, best, evIdx: k, events: snapEv(),
      message: `t = <strong>${t}</strong> (${d === 1 ? 'bắt đầu +1' : 'kết thúc −1'}) → đang họp ${cur}, đỉnh ${best}.`,
      codeLine: 8,
    });
  });
  trace.push({
    type: 'done', i: null, clash: false, ok: null, cur, best, evIdx: ev.length, events: snapEv(),
    message: `Hoàn tất. Cần ít nhất <strong>${best}</strong> phòng.`,
    codeLine: 11,
  });
  return trace;
};

const MeetingRooms = ({ cfg }: { cfg: Cfg }) => {
  const [str, setStr] = useState(cfg.presets[0].value);
  const [a, setA] = useState<[number, number][]>(parseIntervals(cfg.presets[0].value));
  const trace = useMemo(
    () => (cfg.mode === 'one' ? generateOne(a) : generateMany(a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a, cfg.mode],
  );
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)] as Step & {
    cur?: number; best?: number; evIdx?: number; events?: [number, number][];
  };

  const build = (v: string) => {
    const na = parseIntervals(v);
    if (na.length > 6) return;
    pb.restart();
    setA(na);
  };

  const sorted = [...a].sort((x, y) => x[0] - y[0]);
  const items = sorted.map(([s, e], i) => {
    const isCur =
      cfg.mode === 'one'
        ? step.i === i || (step.i !== null && step.i - 1 === i && step.type === 'check')
        : false;
    const bad = isCur && step.clash;
    return {
      s, e,
      label: `[${s},${e}]`,
      state: (bad ? 'bad' : isCur ? 'cur' : undefined) as 'cur' | 'bad' | undefined,
    };
  });

  return (
    <div>
      <VizHeader
        backTo={`/blog/${cfg.slug}`} backLabel={cfg.backLabel}
        badge={cfg.badge} title={cfg.title} accent="trực quan"
        sub={cfg.sub}
      />
      <div className={cfg.mode === 'many' ? 'grid-2' : ''} style={cfg.mode === 'many' ? { gridTemplateColumns: '1fr 380px', alignItems: 'start' } : undefined}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title"><span className="dot"></span>{cfg.mode === 'one' ? 'ĐÃ SORT START · SO CẶP KỀ' : 'SỰ KIỆN SWEEP (GIỜ · ±)'}</div>
          {cfg.mode === 'one' || a.length === 0 ? (
            <IntervalBars items={items} max={Math.max(1, ...a.flat())} />
          ) : (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {(step.events ?? []).map(([t, d], k) => (
                <span
                  key={k}
                  className="mono"
                  style={{
                    fontSize: 12,
                    padding: '5px 9px',
                    borderRadius: 8,
                    border: `2px solid ${step.evIdx === k ? 'var(--accent)' : 'var(--border)'}`,
                    background: step.evIdx !== undefined && k < step.evIdx ? 'rgba(255,255,255,.04)' : step.evIdx === k ? 'rgba(255,181,71,.12)' : 'transparent',
                    color: step.evIdx === k ? 'var(--accent)' : d === 1 ? 'var(--teal)' : 'var(--muted)',
                    fontWeight: step.evIdx === k ? 700 : 400,
                  }}
                >
                  {t}{d === 1 ? '▲' : '▼'}
                </span>
              ))}
            </div>
          )}
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        {cfg.mode === 'many' && (
          <div className="card teal" style={{ margin: 0 }}>
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
              ĐANG HỌP / ĐỈNH
            </div>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', margin: 0 }}>
              {step.cur ?? 0} / {step.best ?? 0}
            </p>
          </div>
        )}
      </div>
      {cfg.mode === 'one' && step.ok !== null && (
        <div className="card teal" style={{ marginTop: 14 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            RESULT
          </div>
          <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.ok ? 'var(--teal)' : '#ff5f57', margin: 0 }}>
            {step.ok ? 'true' : 'false'}
          </p>
        </div>
      )}
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="intervals (≤6 đoạn):" value={str} onChange={setStr} onEnter={() => build(str)} placeholder="0,30;5,10;15,20" maxWidth={280} />
        <button className="btn" onClick={() => build(str)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={cfg.presets}
        onPick={(v) => { setStr(v); build(v); }}
      />
      <CodePanel lines={cfg.lines} active={step.codeLine} stats={cfg.stats} />
    </div>
  );
};

export const MeetingRoomsVisualizer = () => (
  <MeetingRooms
    cfg={{
      mode: 'one',
      slug: 'meeting-rooms-252',
      backLabel: 'Bài giảng Meeting Rooms',
      badge: 'Sort + Scan · O(n log n)',
      title: 'Meeting Rooms',
      sub: 'Sort start, so cặp kề: sau bắt đầu < trước kết thúc là giao → false ngay.',
      presets: [
        { label: 'Giao · false', value: '0,30;5,10;15,20' },
        { label: 'Ổn · true', value: '7,10;2,4' },
        { label: 'Nối đuôi · true', value: '0,5;5,10' },
      ],
      lines: CSHARP_LINES,
      stats: 'O(n log n)',
    }}
  />
);

export const MeetingRooms2Visualizer = () => (
  <MeetingRooms
    cfg={{
      mode: 'many',
      slug: 'meeting-rooms-ii-253',
      backLabel: 'Bài giảng Meeting Rooms II',
      badge: 'Sweep Line · O(n log n)',
      title: 'Meeting Rooms II',
      sub: 'Sự kiện ▲ bắt đầu (+1) / ▼ kết thúc (−1), cùng giờ kết thúc trước. Đỉnh đồng thời = số phòng.',
      presets: [
        { label: 'LeetCode · 2 phòng', value: '0,30;5,10;15,20' },
        { label: 'Rời nhau · 1 phòng', value: '7,10;2,4' },
        { label: 'Chồng 3 · 3 phòng', value: '1,5;2,6;4,8' },
      ],
      lines: CSHARP_LINES_2,
      stats: 'O(n log n)',
    }}
  />
);
