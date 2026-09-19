import { useMemo, useState } from 'react';
import {
  usePlayback, VizHeader, StepBar, ControlsCard, InputField, PresetsRow,
  ThinProgress, TreeSvg, type TreeNodeState,
} from './shared';
import { getSolutions, CONSTRUCT_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

interface Step {
  type: 'init' | 'pick' | 'done';
  rootVal: number | null;
  preIdx: number | null; // vị trí trong preorder đang lấy
  inL: number | null;
  inR: number | null;
  built: number; // số node đã dựng
  tree: (number | null)[]; // cây dựng tới step này (level-order)
  curSlot: number | null; // slot node vừa tạo trong tree
  message: string; codeLine: number;
}

interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
}

const toArr = (root: TNode | null): (number | null)[] => {
  if (!root) return [];
  const out: (number | null)[] = [];
  const q: (TNode | null)[] = [root];
  while (q.length > 0) {
    const n = q.shift()!;
    if (!n) {
      out.push(null);
      continue;
    }
    out.push(n.val);
    q.push(n.left, n.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
};

// slot hiện tại của 1 object trong cây
const locate = (root: TNode | null, target: TNode): number | null => {
  if (!root) return null;
  const q: { n: TNode; i: number }[] = [{ n: root, i: 0 }];
  while (q.length > 0) {
    const { n, i } = q.shift()!;
    if (n === target) return i;
    if (n.left) q.push({ n: n.left, i: 2 * i + 1 });
    if (n.right) q.push({ n: n.right, i: 2 * i + 2 });
  }
  return null;
};

const parseNums = (str: string): number[] =>
  str.split(',').map((s) => s.trim()).filter((s) => s !== '').map(Number)
    .filter((n) => !Number.isNaN(n));

const generateTrace = (pre: number[], ino: number[]): Step[] => {
  const trace: Step[] = [];
  trace.push({
    type: 'init', rootVal: null, preIdx: null, inL: null, inR: null, built: 0,
    tree: [], curSlot: null,
    message: `Đầu preorder là root, vị trí root trong inorder cắt trái/phải. preorder=[${pre.join(', ') || '∅'}], inorder=[${ino.join(', ') || '∅'}].`,
    codeLine: 1,
  });
  const pos = new Map<number, number>();
  ino.forEach((v, i) => {
    if (!pos.has(v)) pos.set(v, i);
  });
  let pi = 0;
  let built = 0;
  let rootRef: TNode | null = null;
  const build = (l: number, r: number): TNode | null => {
    if (l > r) return null;
    if (pi >= pre.length) return null;
    const v = pre[pi];
    const k = pos.get(v);
    if (k === undefined || k < l || k > r) return null;
    pi++;
    built++;
    const node: TNode = { val: v, left: null, right: null };
    if (!rootRef) rootRef = node;
    node.left = build(l, k - 1);
    node.right = build(k + 1, r);
    // snapshot SAU khi gắn xong 2 con? Không — snapshot ngay khi tạo để thấy cây mọc dần.
    // Vì đệ quy gắn con sau, snapshot ở đây thiếu con → chụp ở cuối mỗi lần pick root:
    return node;
  };
  // Dựng cây thật + ghi trace preorder: tách 2 pass —
  // pass 1 dựng object, pass 2 đi preorder ghi snapshot.
  rootRef = build(0, ino.length - 1);
  // pass 2: duyệt preorder trên cây đã dựng, snapshot tích lũy node đã "tạo".
  // pick thứ j chính là node preorder thứ j (đếm bằng counter, không tìm theo value).
  const preorderNodes: TNode[] = [];
  const walk = (n: TNode | null): void => {
    if (!n) return;
    preorderNodes.push(n);
    walk(n.left);
    walk(n.right);
  };
  walk(rootRef);
  // snapshot cây chỉ gồm các node đã tạo (theo đúng thứ tự preorder-pick)
  const shown = new Set<TNode>();
  const snapArr = (): (number | null)[] => {
    if (!rootRef || !shown.has(rootRef)) return [];
    const mask = (n: TNode | null): TNode | null => {
      if (!n || !shown.has(n)) return null;
      return { val: n.val, left: mask(n.left), right: mask(n.right) };
    };
    return toArr(mask(rootRef));
  };
  pi = 0;
  let pickNo = 0;
  const emit = (l: number, r: number): void => {
    if (l > r || pi >= pre.length) return;
    const v = pre[pi];
    const k = pos.get(v);
    if (k === undefined || k < l || k > r) return;
    pi++;
    const node = preorderNodes[pickNo];
    pickNo++;
    if (node) shown.add(node);
    built = shown.size;
    const arr = snapArr();
    trace.push({
      type: 'pick', rootVal: v, preIdx: pi - 1, inL: l, inR: r, built,
      tree: arr, curSlot: node ? locate(rootRef, node) : null,
      message: `preorder[<strong>${pi - 1}</strong>] = <strong>${v}</strong> làm root của inorder[<strong>${l}..${r}</strong>] → trái [${l}..${k - 1}], phải [${k + 1}..${r}]. Cây mọc thêm node <strong>${v}</strong>.`,
      codeLine: 7,
    });
    emit(l, k - 1);
    emit(k + 1, r);
  };
  emit(0, ino.length - 1);
  const finalArr = snapArr();
  trace.push({
    type: 'done', rootVal: null, preIdx: null, inL: null, inR: null, built,
    tree: finalArr, curSlot: null,
    message: `Hoàn tất. Dựng được <strong>${built}/${pre.length}</strong> node${built === pre.length ? ' — cây đầy đủ như hình.' : ' (input không khớp nhau).'}.`,
    codeLine: 12,
  });
  return trace;
};
// ===================== SOLUTIONS đa ngôn ngữ (C# mặc định, khớp dòng với trace) =====================
const SOLUTIONS_CONSTRUCT = getSolutions('construct-tree-105');

export const ConstructVisualizer = () => {
  const [preStr, setPreStr] = useState('3,9,20,15,7');
  const [inStr, setInStr] = useState('9,3,15,20,7');
  const [pre, setPre] = useState<number[]>([3, 9, 20, 15, 7]);
  const [ino, setIno] = useState<number[]>([9, 3, 15, 20, 7]);
  const trace = useMemo(() => generateTrace(pre, ino), [pre, ino]);
  const pb = usePlayback(trace.length);
  const step = trace[Math.min(pb.stepIdx, trace.length - 1)];

  const build = (a: string, b: string) => {
    const pa = parseNums(a);
    const pb2 = parseNums(b);
    if (pa.length === 0 || pa.length !== pb2.length || pa.length > 7) return;
    pb.restart();
    setPre(pa);
    setIno(pb2);
  };

  // Panel cây: node đã dựng teal mờ, node vừa tạo amber
  const treeStates: Record<number, TreeNodeState> = {};
  step.tree.forEach((v, i) => {
    if (v !== null) treeStates[i] = 'done';
  });
  if (step.curSlot !== null && step.tree[step.curSlot] !== null) {
    treeStates[step.curSlot] = 'cur';
  }

  return (
    <div>
      <VizHeader
        backTo="/blog/construct-tree-105" backLabel="Bài giảng Construct Tree"
        badge="Divide & Conquer · O(n)" title="Construct Tree" accent="trực quan"
        sub="preorder cho root, inorder cho ranh giới trái/phải. Ô amber là root vừa lấy, khung teal là đoạn inorder đang xử lý."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot"></span>CÂY ĐANG DỰNG ({step.built}/{pre.length})
          </div>
          <TreeSvg values={step.tree} states={treeStates} />
          <ThinProgress idx={pb.stepIdx} total={trace.length} />
        </div>
        <div className="card teal" style={{ margin: 0 }}>
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }}></span>
            NODE VỪA TẠO
          </div>
          <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
            {step.rootVal === null ? '—' : step.rootVal}
          </p>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0' }}>
            {step.type === 'pick'
              ? `root của inorder[${step.inL}..${step.inR}]`
              : 'chưa tạo / đã xong'}
          </p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-title"><span className="dot"></span>PREORDER (ĐÃ DỰNG {step.built}/{pre.length})</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {pre.map((v, i) => {
            const used = i < step.built;
            const isCur = step.preIdx === i;
            return (
              <div
                key={i}
                style={{
                  minWidth: 44, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                  border: `2px solid ${isCur ? 'var(--accent)' : used ? 'rgba(45,212,191,.5)' : 'var(--border)'}`,
                  background: isCur ? 'var(--accent)' : used ? 'rgba(45,212,191,.08)' : 'rgba(0,0,0,.25)',
                  color: isCur ? 'var(--bg)' : used ? 'var(--teal)' : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                  boxShadow: isCur ? '0 0 12px var(--accent-glow)' : 'none',
                }}
              >
                {v}
                <div style={{ fontSize: 9, fontWeight: 400, color: isCur ? 'var(--bg)' : 'var(--muted)' }}>[{i}]</div>
              </div>
            );
          })}
        </div>
        <div className="card-title" style={{ marginTop: 14 }}><span className="dot"></span>INORDER (ĐOẠN ĐANG XỬ LÝ TEAL)</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ino.map((v, i) => {
            const inRange = step.inL !== null && step.inR !== null && i >= step.inL && i <= step.inR;
            const isRoot = step.rootVal === v && inRange;
            return (
              <div
                key={i}
                style={{
                  minWidth: 44, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                  border: `2px solid ${isRoot ? 'var(--accent)' : inRange ? 'rgba(45,212,191,.6)' : 'var(--border)'}`,
                  background: isRoot ? 'var(--accent)' : inRange ? 'rgba(45,212,191,.08)' : 'rgba(0,0,0,.25)',
                  color: isRoot ? 'var(--bg)' : inRange ? 'var(--teal)' : 'var(--fg)',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                }}
              >
                {v}
                <div style={{ fontSize: 9, fontWeight: 400, color: isRoot ? 'var(--bg)' : 'var(--muted)' }}>[{i}]</div>
              </div>
            );
          })}
        </div>
        <ThinProgress idx={pb.stepIdx} total={trace.length} />
      </div>
      <StepBar idx={pb.stepIdx} total={trace.length} message={step.message} />
      <ControlsCard pb={pb} total={trace.length}>
        <InputField label="preorder:" value={preStr} onChange={setPreStr} onEnter={() => build(preStr, inStr)} placeholder="3,9,20,15,7" maxWidth={200} />
        <InputField label="inorder:" value={inStr} onChange={setInStr} onEnter={() => build(preStr, inStr)} placeholder="9,3,15,20,7" maxWidth={200} />
        <button className="btn" onClick={() => build(preStr, inStr)}>Build</button>
      </ControlsCard>
      <PresetsRow
        items={[
          { label: 'LeetCode · 5 node', value: '3,9,20,15,7|9,3,15,20,7' },
          { label: 'Nhỏ · [1,2]/[2,1]', value: '1,2|2,1' },
          { label: 'Lệch phải · [1,2,3]/[1,2,3]', value: '1,2,3|1,2,3' },
        ]}
        onPick={(v) => {
          const [a, b] = v.split('|');
          setPreStr(a);
          setInStr(b);
          build(a, b);
        }}
      />
      {/* 6. CODE PANEL đa ngôn ngữ (highlight dòng trace trên tab C#) */}
      <div style={{ marginTop: 14 }}>
        <SolutionTabs
          solutions={SOLUTIONS_CONSTRUCT}
          defaultLang="csharp"
          getHighlight={(lang) => [CONSTRUCT_LINE_MAP[lang][step.type]]}
          meta="O(n) · O(n)"
        />
      </div>
    </div>
  );
};
