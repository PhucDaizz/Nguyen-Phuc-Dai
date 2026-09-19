import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, ArrCell, parseNumList,
} from './shared';
import { getSolutions, COIN_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'calc' | 'done';
  x: number | null; // amount đang tính
  bestCoin: number | null;
  dp: (number | null)[]; // null = ∞
  message: string; codeLine: number;
}

const INF = 1e9;

const generateTrace = (coins: number[], amount: number): Step[] => {
  const trace: Step[] = [];
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  const show = () => dp.map((v) => (v >= INF ? null : v));
  trace.push({
    type: 'init', x: null, bestCoin: null, dp: show(),
    message: `dp[x] = ít xu nhất đổi x. dp[0] = 0, còn lại = ∞. Xu: [${coins.join(', ')}].`,
    codeLine: 2,
  });
  for (let x = 1; x <= amount; x++) {
    let best = INF;
    let bestCoin: number | null = null;
    for (const c of coins) {
      if (x - c >= 0 && dp[x - c] + 1 < best) {
        best = dp[x - c] + 1;
        bestCoin = c;
      }
    }
    dp[x] = best;
    trace.push({
      type: 'calc', x, bestCoin, dp: show(),
      message: bestCoin === null
        ? `dp[<strong>${x}</strong>]: không xu nào với tới → vẫn <strong>∞</strong>.`
        : `dp[<strong>${x}</strong>]: thử ${coins.filter((c) => x - c >= 0).map((c) => `${c}(dp[${x - c}]+1=${dp[x - c] >= INF ? '∞' : dp[x - c] + 1})`).join(', ')} → min = <strong>${best >= INF ? '∞' : best}</strong> (xu ${bestCoin}).`,
      codeLine: 5,
    });
  }
  trace.push({
    type: 'done', x: null, bestCoin: null, dp: show(),
    message: dp[amount] >= INF
      ? `dp[${amount}] = ∞ → không đổi được → return <strong>−1</strong>.`
      : `Hoàn tất. Ít nhất <strong>${dp[amount]}</strong> xu để đổi ${amount}.`,
    codeLine: 8,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_COIN = getSolutions('coin-change-322');

export const CoinVisualizer = () => {
  const [cStr, setCStr] = useState('1,2,5');
  const [aStr, setAStr] = useState('11');
  const [coins, setCoins] = useState<number[]>([1, 2, 5]);
  const [amount, setAmount] = useState(11);
  const trace = useMemo(() => generateTrace(coins, amount), [coins, amount]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const nc = [...new Set(parseNumList(a).filter((x) => x > 0))].sort((x, y) => x - y);
    const na = Number(b);
    if (nc.length === 0 || nc.length > 4 || Number.isNaN(na) || na < 1 || na > 20) return;
    pb.restart();
    setCoins(nc);
    setAmount(na);
  };

  return (
    <div>
      <VizHeader
        backTo="/blog/coin-change-322" backLabel="Bài giảng Coin Change"
        badge="Unbounded Knapsack · O(n)" title="Coin Change" accent="trực quan"
        sub="dp[x] = 1 + min(dp[x−c]) mọi mệnh giá. Ô amber là amount đang tính, teal là đáp án cuối."
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>XU: [{coins.join(', ')}] · BẢNG DP (∅ = ∞)
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {step.dp.map((v, x) => (
            <ArrCell
              key={x}
              v={v === null ? '∞' : v}
              sub={`dp[${x}]`}
              state={step.x === x ? 'cur' : x === amount && step.type === 'done' ? 'teal' : x < (step.x ?? 0) ? 'dim' : undefined}
            />
          ))}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="coins (≤4 mệnh giá):" value={cStr} onChange={setCStr} onEnter={() => build(cStr, aStr)} placeholder="1,2,5" maxWidth={160} />
        <InputField label="amount (≤20):" value={aStr} onChange={setAStr} onEnter={() => build(cStr, aStr)} placeholder="11" maxWidth={80} />
        <button className="btn" onClick={() => build(cStr, aStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 11 → 3', value: '1,2,5|11' },
          { label: 'Vô nghiệm · [2] t=3', value: '2|3' },
          { label: 'Tham lam sai · [1,3,4] t=6 → 2', value: '1,3,4|6' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setCStr(a);
          setAStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_COIN}
          defaultLang="csharp"
          getHighlight={(lang) => [COIN_LINE_MAP[lang][step.type]]}
          meta="O(amount·n)"
        />
      </div>
    </div>
  );
};
