export interface GrindStep {
  heading: string;
  body: string;
}

export interface GrindProblem {
  slug: string;
  no: number;
  title: string;
  viTitle: string;
  pattern: string;
  week: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  space: string;
  summary: string;
  rule: string;
  checklist: string[];
  filename: string;
  code: string;
  highlightLines: number[];
  dryRun: { input: string; trace: string[]; output: string };
  pitfalls: string[];
}

export const GRIND_WEEKS = [
  { week: 1, focus: 'Array + Hash Map + Two Pointers', goal: 'Nhận diện O(n) bằng map và 2 đầu' },
  { week: 2, focus: 'Sliding Window + Stack', goal: 'Cửa sổ trượt và LIFO cho Valid Parentheses' },
  { week: 3, focus: 'Linked List + Binary Search', goal: 'Slow/fast pointer và biên lower-bound' },
  { week: 4, focus: 'Tree + BFS/DFS', goal: 'Duyệt cây và đồ thị O(V+E)' },
  { week: 5, focus: 'Heap + Interval', goal: 'Top-K và merge đoạn giao nhau' },
  { week: 6, focus: 'DP cơ bản', goal: 'Memo → tabulation → rolling array' },
  { week: 7, focus: 'Graph nâng cao', goal: 'Dijkstra, topo-sort, union-find' },
  { week: 8, focus: 'Mock + ôn tập', goal: 'Làm lại bài sai, đo 30 phút/bài' },
];

export const GRIND_PROBLEMS: GrindProblem[] = [
  {
    slug: 'two-sum-1',
    no: 1,
    title: 'Two Sum',
    viTitle: 'Tìm 2 số cộng bằng target',
    pattern: 'Hash Map',
    week: 1,
    difficulty: 'Easy',
    time: 'O(n)',
    space: 'O(n)',
    summary: 'Bài mở màn Grind75: duyệt 1 lần, lưu số đã thấy vào map, hỏi “phần bù còn thiếu” thay vì tìm cặp.',
    rule: 'Khi cần “cặp (i, j)” với tổng/hiệu cố định → nghĩ Hash Map trước, Two Pointers sau.',
    checklist: [
      'target - nums[i] đã xuất hiện chưa?',
      'Lưu value → index, không lưu index → value',
      'Mỗi phần tử chỉ dùng 1 lần',
      'Return ngay khi tìm thấy, không cần sort',
    ],
    filename: 'two-sum.ts',
    code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [2,7,11,15], target = 9',
      trace: ['i=0: need=7, seen={} → lưu 2→0', 'i=1: need=2, seen có 2→0 → return [0,1]'],
      output: '[0, 1]',
    },
    pitfalls: ['Sort rồi two-pointers sẽ mất index gốc', '2 vòng lặp O(n²) là quá chậm'],
  },
  {
    slug: 'valid-parentheses-20',
    no: 20,
    title: 'Valid Parentheses',
    viTitle: 'Ngoặc đúng hay sai?',
    pattern: 'Stack',
    week: 2,
    difficulty: 'Easy',
    time: 'O(n)',
    space: 'O(n)',
    summary: 'Mở ngoặc thì push, đóng ngoặc thì pop và đối chiếu. Stack rỗng cuối cùng mới đúng.',
    rule: 'Bài “mở / đóng”, “gần nhất”, “lồng nhau” → Stack (LIFO) là đáp án 90% case.',
    checklist: [
      'Map đóng → mở: ) → (, ] → [, } → {',
      'Gặp đóng mà stack rỗng → false ngay',
      'Pop rồi so sánh, sai → false ngay',
      'Cuối cùng stack phải rỗng',
    ],
    filename: 'valid-parentheses.ts',
    code: `function isValid(s: string): boolean {
  const st: string[] = [];
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}`,
    highlightLines: [6],
    dryRun: {
      input: 's = "()[]{}"',
      trace: ['( → push', ') → pop ( khớp', '[ → push', '] → pop [ khớp', '{ → push', '} → pop { khớp → rỗng → true'],
      output: 'true',
    },
    pitfalls: ['Quên check stack rỗng khi gặp ngoặc đóng', 'Dùng counter thay stack sẽ sai với “([)]”'],
  },
  {
    slug: 'best-time-stock-121',
    no: 121,
    title: 'Best Time to Buy and Sell Stock',
    viTitle: 'Mua thấp bán cao 1 lần',
    pattern: 'Sliding Window (biến thể)',
    week: 2,
    difficulty: 'Easy',
    time: 'O(n)',
    space: 'O(1)',
    summary: 'Giữ giá thấp nhất từng thấy, mỗi ngày tính lời nếu bán hôm nay. Không cần 2 vòng lặp.',
    rule: 'Tối ưu 1 giao dịch → track min-so-far + max-profit-so-far trong 1 pass.',
    checklist: [
      'minPrice = giá đầu tiên',
      'profit = max(profit, price - minPrice)',
      'minPrice = min(minPrice, price)',
      'Không bán khống: profit tối thiểu là 0',
    ],
    filename: 'max-profit.ts',
    code: `function maxProfit(prices: number[]): number {
  let min = prices[0], best = 0;
  for (const p of prices) {
    best = Math.max(best, p - min);
    min = Math.min(min, p);
  }
  return best;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'prices = [7,1,5,3,6,4]',
      trace: ['min=7,best=0', 'p=1 → best=0, min=1', 'p=5 → best=4', 'p=3 → best=4', 'p=6 → best=5', 'p=4 → best=5'],
      output: '5 (mua 1 bán 6)',
    },
    pitfalls: ['Brute force i<j là O(n²)', 'Nhầm cho phép nhiều giao dịch (đó là bài 122)'],
  },
  {
    slug: 'binary-search-704',
    no: 704,
    title: 'Binary Search',
    viTitle: 'Template không bao giờ sai',
    pattern: 'Binary Search',
    week: 3,
    difficulty: 'Easy',
    time: 'O(log n)',
    space: 'O(1)',
    summary: 'Template lower-bound [l, r): hỏi predicate đơn điệu, thu hẹp một nửa mỗi bước.',
    rule: 'Mảng sorted hoặc “answer-space đơn điệu” → Binary Search, viết template [l, r) để khỏi off-by-one.',
    checklist: [
      'Điều kiện sort tăng dần?',
      'Viết vòng while (l < r), m = (l+r)>>1',
      'Đúng → r = m, sai → l = m+1',
      'Return l và verify nums[l] === target',
    ],
    filename: 'binary-search.ts',
    code: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] >= target) r = m;
    else l = m + 1;
  }
  return nums[l] === target ? l : -1;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [-1,0,3,5,9,12], target = 9',
      trace: ['[0,6) m=3 (5) < 9 → [4,6)', 'm=5 (12) ≥ 9 → [4,5)', 'm=4 (9) ≥ 9 → [4,4) dừng → l=4'],
      output: '4',
    },
    pitfalls: ['Dùng (l+r)/2 tràn số ở ngôn ngữ khác (JS an toàn hơn)', 'Quên verify sau vòng lặp'],
  },
  {
    slug: 'lowest-common-ancestor-235',
    no: 235,
    title: 'Lowest Common Ancestor of a BST',
    viTitle: 'Tổ tiên chung thấp nhất trong BST',
    pattern: 'BST',
    week: 4,
    difficulty: 'Medium',
    time: 'O(h)',
    space: 'O(1)',
    summary: 'Tận dụng tính chất BST: cả 2 cùng nhỏ → sang trái, cùng lớn → sang phải, rẽ nhánh → đây là LCA.',
    rule: 'BST + tìm kiếm theo giá trị → so sánh và đi 1 nhánh, không cần duyệt cả cây.',
    checklist: [
      'p.val và q.val đều < root.val → sang trái',
      'Đều > root.val → sang phải',
      'Ngược lại (rẽ nhánh hoặc trùng) → return root',
      'Không cần đệ quy cả 2 nhánh',
    ],
    filename: 'lca-bst.ts',
    code: `function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) {
  let cur: TreeNode | null = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'root=[6,2,8,0,4,7,9], p=2, q=8',
      trace: ['cur=6: 2<6 nhưng 8>6 → rẽ nhánh → return 6'],
      output: 'node 6',
    },
    pitfalls: ['Nhầm với LCA cây nhị phân thường (bài 236 cần đệ quy)', 'Quên case p hoặc q chính là ancestor'],
  },
  {
    slug: 'climbing-stairs-70',
    no: 70,
    title: 'Climbing Stairs',
    viTitle: 'Bài DP vỡ lòng: Fibonacci trá hình',
    pattern: 'Dynamic Programming',
    week: 6,
    difficulty: 'Easy',
    time: 'O(n)',
    space: 'O(1)',
    summary: 'Đến bậc n chỉ từ n-1 hoặc n-2 → dp[n] = dp[n-1] + dp[n-2]. Rolling 2 biến là đủ.',
    rule: 'Đếm số cách với bước 1/2 → Fibonacci. Hỏi min/max cách → DP với rolling array.',
    checklist: [
      'Base: dp[1]=1, dp[2]=2',
      'Công thức: dp[i] = dp[i-1] + dp[i-2]',
      'Chỉ cần 2 biến a, b (rolling)',
      'n=1 là edge case hay quên',
    ],
    filename: 'climb-stairs.ts',
    code: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 5',
      trace: ['a=1,b=2', 'i=3 → a=2,b=3', 'i=4 → a=3,b=5', 'i=5 → a=5,b=8'],
      output: '8',
    },
    pitfalls: ['Đệ quy không memo → O(2^n) timeout', 'Mảng dp O(n) vẫn đúng nhưng phí bộ nhớ'],
  },
];

export const getGrindBySlug = (slug: string) => GRIND_PROBLEMS.find((p) => p.slug === slug);
