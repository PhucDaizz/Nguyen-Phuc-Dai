import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, type TreeNodeState,
} from './shared';
import { getSolutions, WILDCARD_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';
import { TrieSvg, newTrie, type TrieObj } from './TrieView';

interface Step {
  type: 'visit' | 'branch' | 'result';
  path: string; // prefix trie đã đi
  pos: number; // vị trí trong pattern
  result: boolean | null;
  tried: number; // số nhánh đã thử
  message: string; codeLine: number;
}

const buildTrie = (words: string[]): TrieObj => {
  const root = newTrie();
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) continue;
    let n = root;
    for (const c of clean) {
      if (!n.kids[c]) n.kids[c] = { ch: c, end: false, word: null, kids: {} };
      n = n.kids[c];
    }
    n.end = true;
  }
  return root;
};

const generateTrace = (root: TrieObj, pattern: string): Step[] => {
  const trace: Step[] = [];
  const pat = pattern.toLowerCase();
  let tried = 0;

  trace.push({
    type: 'visit', path: '', pos: 0, result: null, tried: 0,
    message: `Search "<strong>${pattern || '(rỗng)'}</strong>": chữ thường đi 1 nhánh, "." thử <strong>mọi nhánh</strong> (DFS).`,
    codeLine: 3,
  });

  let found = false;

  const dfs = (node: TrieObj | null, path: string, k: number): boolean => {
    if (!node) return false;
    if (k === pat.length) {
      const ok = node.end;
      tried++;
      trace.push({
        type: 'result', path, pos: k, result: ok, tried,
        message: ok
          ? `Hết pattern tại "<strong>${path || 'root'}</strong>" + end = true → nhánh này <strong>ĐÚNG</strong>.`
          : `Hết pattern tại "<strong>${path || 'root'}</strong>" nhưng end = false (chỉ là prefix) → nhánh này sai.`,
        codeLine: 5,
      });
      return ok;
    }
    const c = pat[k];
    if (c === '.') {
      const keys = Object.keys(node.kids).sort();
      if (keys.length === 0) {
        tried++;
        trace.push({
          type: 'result', path, pos: k, result: false, tried,
          message: `"." tại "<strong>${path || 'root'}</strong>" mà không còn nhánh con → nhánh này sai.`,
          codeLine: 8,
        });
        return false;
      }
      trace.push({
        type: 'branch', path, pos: k, result: null, tried,
        message: `"." tại "<strong>${path || 'root'}</strong>": thử lần lượt <strong>${keys.length} nhánh</strong> (${keys.join(', ')}).`,
        codeLine: 8,
      });
      for (const key of keys) {
        tried++;
        trace.push({
          type: 'visit', path: path + key, pos: k + 1, result: null, tried,
          message: `Thử nhánh '<strong>${key}</strong>' cho "." (lần thử ${tried}).`,
          codeLine: 9,
        });
        if (dfs(node.kids[key], path + key, k + 1)) return true;
      }
      return false;
    }
    const next = node.kids[c] ?? null;
    if (!next) {
      tried++;
      trace.push({
        type: 'result', path, pos: k, result: false, tried,
        message: `Chữ '<strong>${c}</strong>' không có nhánh từ "<strong>${path || 'root'}</strong>" → nhánh này sai.`,
        codeLine: 12,
      });
      return false;
    }
    trace.push({
      type: 'visit', path: path + c, pos: k + 1, result: null, tried,
      message: `Chữ '<strong>${c}</strong>' có nhánh → đi tiếp.`,
      codeLine: 12,
    });
    return dfs(next, path + c, k + 1);
  };

  found = dfs(root, '', 0);
  trace.push({
    type: 'result', path: '', pos: pat.length, result: found, tried,
    message: found
      ? `Hoàn tất. Có ít nhất 1 nhánh đúng sau ${tried} lần thử → <strong>true</strong>.`
      : `Hoàn tất. Thử hết ${tried} nhánh, không nhánh nào đúng → <strong>false</strong>.`,
    codeLine: 5,
  });
  return trace;
};

// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_WILDCARD = getSolutions('add-search-words-211');

const DEFAULT_WORDS = ['bad', 'dad', 'mad'];

export const WildcardVisualizer = () => {
  const [wStr, setWStr] = useState('bad,dad,mad');
  const [pStr, setPStr] = useState('b.d');
  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [pattern, setPattern] = useState('b.d');
  const root = useMemo(() => buildTrie(words), [words]);
  const trace = useMemo(() => generateTrace(root, pattern), [root, pattern]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (w: string, p: string) => {
    pb.restart();
    setWords(w.split(',').map((s) => s.trim()).filter((s) => s !== ''));
    setPattern(p);
  };

  const states: Record<string, TreeNodeState> = {};
  if (step.path !== '') {
    states[step.path] = step.result === false ? 'bad' : step.result === true ? 'add' : 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/add-search-words-211" backLabel="Bài giảng Add/Search Words"
        badge="Trie + DFS · Wildcard" title="Wildcard Search" accent="trực quan"
        sub='"." thử mọi nhánh con bằng DFS — nhánh nào đi hết pattern + end thì đúng. Chấm teal = end-of-word.'
      />
      <div className="card">
        <div className="card-title">
          <span className="dot"></span>TRIE [{words.join(', ') || '∅'}] · PATTERN = "{pattern}" · ĐÃ THỬ {step.tried}
        </div>
        <TrieSvg root={root} states={states} />
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <div className="card teal" style={{ marginTop: 14 }}>
        <div className="card-title">
          <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
          RESULT
        </div>
        <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: step.result === false ? '#ff5f57' : 'var(--teal)', margin: 0 }}>
          {step.result === null ? '?' : step.result ? 'true' : 'false'}
        </p>
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="words (phẩy):" value={wStr} onChange={setWStr} onEnter={() => build(wStr, pStr)} placeholder="bad,dad,mad" maxWidth={200} />
        <InputField label="pattern (. = bất kỳ):" value={pStr} onChange={setPStr} onEnter={() => build(wStr, pStr)} placeholder="b.d" maxWidth={140} />
        <button className="btn" onClick={() => build(wStr, pStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'Khớp · b.d → true', value: 'bad,dad,mad|b.d' },
          { label: 'Nhiều . · b.. → true', value: 'bad,dad,mad|b..' },
          { label: 'Sai · pad → false', value: 'bad,dad,mad|pad' },
          { label: '. đơn · .ad → true', value: 'bad,dad,mad|.ad' },
        ]}
        onPick={(v) => {
          const [w, p] = v.split('|');
          setWStr(w);
          setPStr(p);
          build(w, p);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_WILDCARD}
          defaultLang="csharp"
          getHighlight={(lang) => [WILDCARD_LINE_MAP[lang][step.type]]}
          meta="O(26^m)"
        />
      </div>
    </div>
  );
};
