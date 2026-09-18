// Bài hướng dẫn chi tiết (tiếng Việt, tự viết) cho từng bài Blind75 đã có.
// Key = slug dùng trong route /blog/:slug. Metadata chung (số bài, category,
// link LeetCode...) lấy từ blind75.ts qua `blindNo`.

export interface Guide {
  slug: string;
  blindNo: number;
  time: string;
  space: string;
  rule: string;
  checklist: string[];
  filename: string;
  code: string;
  highlightLines: number[];
  dryRun: { input: string; trace: string[]; output: string };
  pitfalls: string[];
  // Dùng khi bài guide không thuộc Blind75 (vd: template Binary Search 704)
  fallbackMeta?: { title: string; viTitle: string; summary: string; pattern: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard' };
}

export const GUIDES: Record<string, Guide> = {
  'insert-interval-57': {
    slug: 'insert-interval-57',
    blindNo: 57,
    time: 'O(n)',
    space: 'O(n)',
    rule: '3 vùng: hết trước → giữ, giao nhau → gộp vào new, bắt đầu sau → chèn new rồi giữ.',
    checklist: [
      'interval.end < new.start → giữ nguyên',
      'interval.start ≤ new.end → gộp (min start, max end)',
      'Lần đầu gặp interval.start > new.end → chèn new rồi giữ nốt phần còn lại',
      'Hết vòng mà chưa chèn → push new ở cuối',
    ],
    filename: 'insert-interval.ts',
    code: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const res: number[][] = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i++]);
  }
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval = [
      Math.min(newInterval[0], intervals[i][0]),
      Math.max(newInterval[1], intervals[i][1]),
    ];
    i++;
  }
  res.push(newInterval);
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      trace: ['[1,3]: end 3 ≥ 2 → không giữ, gộp → new = [1,5]', '[6,9]: start 6 > 5 → chèn [1,5], giữ [6,9]'],
      output: '[[1,5],[6,9]]',
    },
    pitfalls: ['Gộp xong quên đẩy new vào trước khi giữ phần sau', 'So sánh sai chiều (end < start là hết trước, start > end là sau)'],
  },
  'merge-intervals-56': {
    slug: 'merge-intervals-56',
    blindNo: 56,
    time: 'O(n log n)',
    space: 'O(n)',
    rule: 'Sort theo start rồi quét: giao thì kéo end, không thì chốt đoạn cũ.',
    checklist: [
      'Sort theo start tăng dần (bắt buộc)',
      'start ≤ lastEnd → lastEnd = max(lastEnd, end)',
      'start > lastEnd → push đoạn cũ, bắt đầu đoạn mới',
      'Push đoạn cuối cùng sau vòng lặp',
    ],
    filename: 'merge-intervals.ts',
    code: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const res: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    const last = res[res.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else res.push([s, e]);
  }
  return res;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
      trace: ['[2,6]: 2 ≤ 3 → [1,6]', '[8,10]: 8 > 6 → chốt [1,6], mới [8,10]', '[15,18]: chốt [8,10], mới [15,18]', 'Push nốt [15,18]'],
      output: '[[1,6],[8,10],[15,18]]',
    },
    pitfalls: ['Quên sort trước (input chưa chắc đã sort)', 'Quên push đoạn cuối sau vòng lặp'],
  },
  'non-overlapping-435': {
    slug: 'non-overlapping-435',
    blindNo: 435,
    time: 'O(n log n)',
    space: 'O(1)',
    rule: 'Sort theo END rồi tham lam giữ đoạn kết thúc sớm nhất — chừa chỗ cho đoạn sau.',
    checklist: [
      'Sort theo end (không phải start!)',
      'Giữ đoạn đầu, end = end của nó',
      'Đoạn sau start < end → xóa (đếm+1)',
      'start ≥ end → giữ, cập nhật end',
    ],
    filename: 'non-overlapping.ts',
    code: `function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'intervals = [[1,2],[2,3],[3,4],[1,3]] → sort end: [1,2],[2,3],[1,3],[3,4]',
      trace: ['[1,2]: giữ, end=2', '[2,3]: 2≥2 giữ, end=3', '[1,3]: 1<3 xóa (1)', '[3,4]: 3≥3 giữ'],
      output: '1',
    },
    pitfalls: ['Sort theo start rồi tham lam (sai — vd [1,100],[2,3],[3,4] cần giữ 2 đoạn sau)', 'Nhầm điều kiện chạm nhau: start = end là KHÔNG giao (được giữ)'],
  },
  'meeting-rooms-252': {
    slug: 'meeting-rooms-252',
    blindNo: 252,
    time: 'O(n log n)',
    space: 'O(1)',
    rule: 'Sort theo start, chỉ cần 1 cặp giao nhau là false.',
    checklist: [
      'Sort theo start',
      'So từng cặp kề: sau.start < trước.end → false',
      'Chạm nhau (start = end) vẫn OK',
      'Hết vòng → true',
    ],
    filename: 'meeting-rooms.ts',
    code: `function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    highlightLines: [3],
    dryRun: {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      trace: ['[5,10] vs [0,30]: 5 < 30 → false ngay'],
      output: 'false',
    },
    pitfalls: ['Dùng ≤ thay vì < (họp nối đuôi nhau vẫn 1 phòng được)', 'Quên sort (so cặp kề của mảng chưa sort là sai)'],
  },
  'meeting-rooms-ii-253': {
    slug: 'meeting-rooms-ii-253',
    blindNo: 253,
    time: 'O(n log n)',
    space: 'O(n)',
    rule: 'Sweep line: +1 khi bắt đầu, −1 khi kết thúc (kết thúc trước nếu cùng giờ) — đỉnh là đáp án.',
    checklist: [
      'Tách sự kiện (time, +1 start / −1 end)',
      'Sort theo time, end (−1) trước start (+1) khi cùng giờ',
      'Quét cộng dồn, giữ max',
      'Cách khác: min-heap end, pop hết hạn trước khi push',
    ],
    filename: 'meeting-rooms-ii.ts',
    code: `function minMeetingRooms(intervals: number[][]): number {
  const events: [number, number][] = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);
    events.push([e, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0;
  for (const [, d] of events) {
    cur += d;
    best = Math.max(best, cur);
  }
  return best;
}`,
    highlightLines: [8],
    dryRun: {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      trace: ['0:+1 → 1 (best 1)', '5:+1 → 2 (best 2)', '10:−1 → 1', '15:+1 → 2', '20:−1 → 1', '30:−1 → 0'],
      output: '2',
    },
    pitfalls: ['Cùng giờ mà start trước end (vd họp A hết 10, B bắt đầu 10 vẫn 1 phòng — phải end trước)', 'Đếm số lần giao thay vì đỉnh đồng thời'],
  },
  'max-subarray-53': {
    slug: 'max-subarray-53',
    blindNo: 53,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Kadane: ở mỗi số, hoặc cộng tiếp hoặc bắt đầu lại — lấy max, giữ best.',
    checklist: [
      'cur = max(x, cur + x)',
      'best = max(best, cur)',
      'Khởi tạo best = −∞ (mảng toàn âm vẫn đúng)',
      'Muốn cả vị trí thì track thêm start/end',
    ],
    filename: 'max-subarray.ts',
    code: `function maxSubArray(nums: number[]): number {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
      trace: ['cur: −2,1,1,4,3,5,6,1,5 → best lên dần tới 6 ([4,−1,2,1])'],
      output: '6',
    },
    pitfalls: ['Khởi tạo best = 0 (sai khi toàn âm)', 'Reset cur = 0 thay vì = x (mất đoạn âm đầu dãy con tối ưu)'],
  },
  'alien-dict-269': {
    slug: 'alien-dict-269',
    blindNo: 269,
    time: 'O(C)',
    space: 'O(1)',
    rule: 'Cặp từ kề nhau đầu tiên khác chữ → cạnh có hướng; topo-sort ra thứ tự (premium).',
    checklist: [
      'Mọi chữ đều là node (kể cả đứng một mình)',
      'Cặp kề: tìm chữ đầu tiên khác nhau → cạnh u→v',
      'Tiền tố dài hơn đứng trước từ ngắn (["abc","ab"]) → vô nghiệm ""',
      'Kahn: hết queue mà chưa đủ chữ → có chu trình → ""',
    ],
    filename: 'alien-dict.ts',
    code: `function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) {
    for (const c of w) {
      if (!adj.has(c)) adj.set(c, new Set());
      if (!indeg.has(c)) indeg.set(c, 0);
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';
    const m = Math.min(a.length, b.length);
    for (let k = 0; k < m; k++) {
      if (a[k] !== b[k]) {
        if (!adj.get(a[k])!.has(b[k])) {
          adj.get(a[k])!.add(b[k]);
          indeg.set(b[k], indeg.get(b[k])! + 1);
        }
        break;
      }
    }
  }
  const queue: string[] = [];
  indeg.forEach((d, c) => { if (d === 0) queue.push(c); });
  const res: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    res.push(u);
    for (const v of adj.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  return res.length === indeg.size ? res.join('') : '';
}`,
    highlightLines: [18],
    dryRun: {
      input: 'words = ["wrt","wrf","er","ett","rftt"]',
      trace: ['wrt/wrf → t→f; wrf/er → w→e; er/ett → r→t; ett/rftt → e→r', 'Kahn: w(0) → e → r → t → f'],
      output: '"wertf"',
    },
    pitfalls: ['So mọi cặp từ (thừa — chỉ cần cặp kề)', 'Thêm cạnh trùng làm indeg tăng oan (phải check đã có cạnh chưa)'],
  },
  'valid-tree-261': {
    slug: 'valid-tree-261',
    blindNo: 261,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Cây ⟺ cạnh = n−1 VÀ liên thông (union-find: gặp cạnh nối 2 node cùng root là có vòng) (premium).',
    checklist: [
      'edges.length ≠ n−1 → false ngay',
      'Union từng cạnh; 2 đầu cùng root → có vòng → false',
      'Hết cạnh mà không vòng + đủ n−1 cạnh → true',
      'n = 1, edges = [] → true',
    ],
    filename: 'valid-tree.ts',
    code: `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    if (find(a) === find(b)) return false;
    parent[find(a)] = find(b);
  }
  return true;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]',
      trace: ['4 cạnh = 5−1 ✓', 'Union hết, không cặp nào cùng root → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check n−1 cạnh mà bỏ liên thông (2 cụm rời vẫn đủ cạnh? không — nhưng check cả 2 cho chắc)', 'DFS quên visited → treo vòng'],
  },
  'connected-components-323': {
    slug: 'connected-components-323',
    blindNo: 323,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Union từng cạnh, đếm số root khác nhau (premium).',
    checklist: [
      'Union-find với path compression',
      'Union hết edges',
      'Đếm distinct root',
      'Node lẻ (không cạnh) tự là 1 cụm',
    ],
    filename: 'connected-components.ts',
    code: `function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    parent[find(a)] = find(b);
  }
  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      trace: ['Union: {0,1,2}, {3,4} → root 0→...→ 2 cụm'],
      output: '2',
    },
    pitfalls: ['DFS/BFS cũng được nhưng union-find ngắn hơn', 'Quên path compression vẫn đúng nhưng chậm'],
  },
  'unique-paths-62': {
    slug: 'unique-paths-62',
    blindNo: 62,
    time: 'O(m·n)',
    space: 'O(n)',
    rule: 'Ô = trên + trái; hàng đầu/cột đầu = 1; rolling 1 hàng là đủ.',
    checklist: [
      'dp[j] = dp[j] (trên, giữ) + dp[j−1] (trái, mới)',
      'Khởi tạo hàng đầu toàn 1',
      'Duyệt hàng 2..m, cột 2..n',
      'Đáp án dp[n−1] (muốn O(1)? công thức tổ hợp C(m+n−2, m−1))',
    ],
    filename: 'unique-paths.ts',
    code: `function uniquePaths(m: number, n: number): number {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    highlightLines: [4],
    dryRun: {
      input: 'm = 3, n = 7',
      trace: ['Hàng 0: [1,1,1,1,1,1,1]', 'Hàng 1: [1,2,3,4,5,6,7]', 'Hàng 2: [1,3,6,10,15,21,28]'],
      output: '28',
    },
    pitfalls: ['Duyệt cột trước hàng (dp[j−1] chưa phải trái hiện tại)', 'Tràn số ở m,n lớn mà không dùng BigInt (hiếm khi bị hỏi)'],
  },
  'lcs-1143': {
    slug: 'lcs-1143',
    blindNo: 1143,
    time: 'O(m·n)',
    space: 'O(min(m,n))',
    rule: 'Khớp thì +1 đường chéo, lệch thì max(trên, trái).',
    checklist: [
      'dp[i][j] = LCS của tiền tố i, j',
      'a[i−1] = b[j−1] → dp[i−1][j−1] + 1',
      'Khác → max(dp[i−1][j], dp[i][j−1])',
      'Tối ưu 2 hàng (rolling) vì chỉ cần hàng trước',
    ],
    filename: 'lcs.ts',
    code: `function longestCommonSubsequence(a: string, b: string): number {
  const m = a.length, n = b.length;
  let prev = new Array(n + 1).fill(0);
  let cur = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}`,
    highlightLines: [7],
    dryRun: {
      input: 'text1 = "abcde", text2 = "ace"',
      trace: ['a=a → 1; b× → max; c=c → 2; d×; e=e → 3'],
      output: '3 ("ace")',
    },
    pitfalls: ['Nhầm với Longest Common Substring (liên tục — khác bài, khác công thức)', 'Swap 2 hàng mà quên reset hàng cur cũ'],
  },
  'sum-two-integers-371': {
    slug: 'sum-two-integers-371',
    blindNo: 371,
    time: 'O(1)',
    space: 'O(1)',
    rule: 'XOR = cộng không nhớ, AND<<1 = phần nhớ; lặp tới khi nhớ = 0.',
    checklist: [
      'sum = a ^ b (cộng không nhớ)',
      'carry = (a & b) << 1 (phần nhớ)',
      'a = sum, b = carry, lặp tới b = 0',
      'Âm vẫn đúng (bù 2, 32 bước là xong)',
    ],
    filename: 'sum-two-integers.ts',
    code: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
    highlightLines: [2],
    dryRun: {
      input: 'a = 1, b = 2 (01 + 10)',
      trace: ['XOR = 11 (3), carry = (01&10)<<1 = 0 → b = 0 → dừng'],
      output: '3',
    },
    pitfalls: ['Dùng đệ quy không base (treo khi carry không bao giờ 0 ở ngôn ngữ không tràn? JS 32-bit nên ổn)', 'Quên đây là mô phỏng mạch cộng full-adder'],
  },
  'number-of-1-bits-191': {
    slug: 'number-of-1-bits-191',
    blindNo: 191,
    time: 'O(k)',
    space: 'O(1)',
    rule: 'n & (n−1) gạt bit 1 thấp nhất — đếm tới khi n = 0 (k = số bit 1).',
    checklist: [
      'n & (n−1) xóa bit 1 cuối cùng',
      'Đếm mỗi lần xóa',
      'Nhanh hơn duyệt 32 bit khi ít bit 1',
      'JS: dùng >>> 0 để chắc unsigned 32-bit',
    ],
    filename: 'number-of-1-bits.ts',
    code: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
    highlightLines: [3],
    dryRun: {
      input: 'n = 11 (1011)',
      trace: ['1011 & 1010 = 1010 (mất bit cuối), count=1', '1010 & 1001 = 1000, count=2', '1000 & 0111 = 0, count=3 → dừng'],
      output: '3',
    },
    pitfalls: ['Dịch >> số âm lan bit dấu (dùng >>> hoặc & trick)', 'Đếm cả bit 0 (duyệt 32 lần vẫn đúng nhưng chậm hơn)'],
  },
  'counting-bits-338': {
    slug: 'counting-bits-338',
    blindNo: 338,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'dp[i] = dp[i>>1] + (i&1): bỏ bit cuối rồi cộng lại.',
    checklist: [
      'i>>1 = i bỏ bit cuối (đã tính rồi)',
      'i&1 = bit cuối (0/1)',
      'dp[0] = 0, chạy 1..n',
      'Bonus follow-up: one pass + O(n)',
    ],
    filename: 'counting-bits.ts',
    code: `function countBits(n: number): number[] {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 5',
      trace: ['dp[1] = dp[0]+1 = 1', 'dp[2] = dp[1]+0 = 1', 'dp[3] = dp[1]+1 = 2', 'dp[4] = dp[2]+0 = 1', 'dp[5] = dp[2]+1 = 2'],
      output: '[0,1,1,2,1,2]',
    },
    pitfalls: ['Đếm lại từng số bằng vòng lặp bit (O(n log n)) thay vì tái dùng', 'Nhầm i>>1 với i/2 làm tròn sai ở số lẻ? (>>1 là floor, đúng)'],
  },
  'missing-number-268': {
    slug: 'missing-number-268',
    blindNo: 268,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'XOR hết index lẫn value: cặp nào đủ đôi tự triệt, dư lại số thiếu.',
    checklist: [
      'xor = n (hoặc 0 rồi xor thêm n)',
      'xor ^= i ^ nums[i] mọi i',
      'Số đủ đôi triệt nhau, còn số thiếu',
      'Cách khác: tổng Gauss n(n+1)/2 − sum (coi chừng tràn ở ngôn ngữ khác)',
    ],
    filename: 'missing-number.ts',
    code: `function missingNumber(nums: number[]): number {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [3,0,1]',
      trace: ['xor = 3', 'i=0: 3^0^3 = 0', 'i=1: 0^1^0 = 1', 'i=2: 1^2^1 = 2'],
      output: '2',
    },
    pitfalls: ['Quên xor với n (thiếu 1 vế)', 'Sort rồi tìm chỗ gãy O(n log n) — vẫn đúng nhưng không O(1) space'],
  },
  'reverse-bits-190': {
    slug: 'reverse-bits-190',
    blindNo: 190,
    time: 'O(1)',
    space: 'O(1)',
    rule: '32 vòng: lấy bit cuối (n&1) đẩy vào kết quả (<<1), dịch n sang phải.',
    checklist: [
      'res = (res << 1) | (n & 1)',
      'n >>>= 1 (unsigned!)',
      'Đúng 32 vòng (kể cả số 0 đầu)',
      'JS: >>> 0 ở cuối để ra unsigned',
    ],
    filename: 'reverse-bits.ts',
    code: `function reverseBits(n: number): number {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 43261596',
      trace: ['32 vòng bóc từng bit cuối đắp sang trái res', 'res = 964176192'],
      output: '964176192',
    },
    pitfalls: ['Dùng >> thay vì >>> (số âm lan bit 1)', 'Quên >>> 0 cuối → JS trả số âm'],
  },
  'rotate-image-48': {
    slug: 'rotate-image-48',
    blindNo: 48,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Xoay 90° = chuyển vị (i↔j) rồi lật ngang từng hàng.',
    checklist: [
      'Transpose: swap m[i][j] ↔ m[j][i] với j > i',
      'Reverse mỗi hàng',
      'In-place, không ma trận phụ',
      'Xoay trái = transpose + lật dọc (đổi thứ tự 2 bước)',
    ],
    filename: 'rotate-image.ts',
    code: `function rotate(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
}`,
    highlightLines: [4],
    dryRun: {
      input: '[[1,2,3],[4,5,6],[7,8,9]]',
      trace: ['Transpose: [[1,4,7],[2,5,8],[3,6,9]]', 'Lật ngang: [[7,4,1],[8,5,2],[9,6,3]]'],
      output: '[[7,4,1],[8,5,2],[9,6,3]]',
    },
    pitfalls: ['Transpose cả ma trận (swap 2 lần = về cũ) — chỉ swap j > i', 'Tạo ma trận mới (mất O(n²) space, đề bắt in-place)'],
  },
  'spiral-matrix-54': {
    slug: 'spiral-matrix-54',
    blindNo: 54,
    time: 'O(m·n)',
    space: 'O(1)',
    rule: '4 biên top/bottom/left/right: đi hết 1 vòng thì co biên, check biên sau mỗi cạnh.',
    checklist: [
      'Đi: trên (trái→phải), phải (trên→dưới), dưới (phải→trái), trái (dưới→trên)',
      'Sau mỗi cạnh: co biên tương ứng',
      'Check top ≤ bottom, left ≤ right trước mỗi cạnh (ma trận dẹt)',
      'Hết biên thì dừng',
    ],
    filename: 'spiral-matrix.ts',
    code: `function spiralOrder(matrix: number[][]): number[] {
  const res: number[] = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}`,
    highlightLines: [6],
    dryRun: {
      input: '[[1,2,3],[4,5,6],[7,8,9]]',
      trace: ['Trên: 1,2,3 → top=1', 'Phải: 6,9 → right=1', 'Dưới: 8,7 → bottom=1', 'Trái: 4 → left=1', 'Giữa: 5'],
      output: '[1,2,3,6,9,8,7,4,5]',
    },
    pitfalls: ['Quên check biên giữa chừng (ma trận 1 hàng/dup góc)', 'Co biên sai thứ tự (đi cạnh nào co biên đó ngay)'],
  },
  'set-zeroes-73': {
    slug: 'set-zeroes-73',
    blindNo: 73,
    time: 'O(m·n)',
    space: 'O(1)',
    rule: 'Dùng hàng 0 + cột 0 làm cờ (2 biến riêng cho cờ của chính chúng).',
    checklist: [
      'Quét ghi nhớ: hàng 0 / cột 0 có số 0 không (2 cờ)',
      'Ô (i,j) = 0 → đánh dấu row0[j] = col0[i] = 0',
      'Zero theo cờ (bỏ hàng 0, cột 0)',
      'Xử lý hàng 0, cột 0 theo 2 cờ',
    ],
    filename: 'set-zeroes.ts',
    code: `function setZeroes(matrix: number[][]): void {
  const R = matrix.length, C = matrix[0].length;
  let firstRowZero = false;
  let firstColZero = false;
  for (let c = 0; c < C; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 0; r < R; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstRowZero) for (let c = 0; c < C; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < R; r++) matrix[r][0] = 0;
}`,
    highlightLines: [9],
    dryRun: {
      input: '[[1,1,1],[1,0,1],[1,1,1]]',
      trace: ['Hàng 0, cột 0 không có 0 (cờ false)', 'Ô (1,1)=0 → đánh dấu row0[1], col0[1]', 'Zero theo cờ: hàng 1 + cột 1', '2 cờ false → xong'],
      output: '[[1,0,1],[0,0,0],[1,0,1]]',
    },
    pitfalls: ['Dùng hàng 0/cột 0 làm cờ mà không giữ 2 cờ riêng (mất thông tin gốc)', 'Set O(m+n) vẫn đúng nhưng đề bonus O(1)'],
  },
  'max-product-152': {
    slug: 'max-product-152',
    blindNo: 152,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Track đồng thời max và min (âm × âm thành dương, đảo vai trò).',
    checklist: [
      'curMax, curMin khởi tạo nums[0], best = nums[0]',
      'tmpMax = max(x, curMax×x, curMin×x)',
      'curMin = min(x, curMax×x, curMin×x) (dùng curMax cũ!)',
      'best = max(best, tmpMax)',
    ],
    filename: 'max-product.ts',
    code: `function maxProduct(nums: number[]): number {
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const candidates = [x, curMax * x, curMin * x];
    curMax = Math.max(...candidates);
    curMin = Math.min(...candidates);
    best = Math.max(best, curMax);
  }
  return best;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'nums = [2,3,-2,4]',
      trace: ['x=3: max=6, min=3, best=6', 'x=−2: max=−2, min=−12 (3×−2 đảo vai!), best=6', 'x=4: max=4, min=−48, best=6'],
      output: '6',
    },
    pitfalls: ['Chỉ track max (số âm lật dấu làm sai — vd [−2,3,−4] đáp án 24)', 'Cập nhật curMin sau khi curMax đã đổi (phải dùng giá trị cũ cả 2)'],
  },
  'clone-graph-133': {
    slug: 'clone-graph-133',
    blindNo: 133,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Map old→new + DFS: tạo bản sao trước khi đi sâu để vòng lặp không treo.',
    checklist: [
      'Map node gốc → node clone',
      'Gặp node đã có trong map → return clone cũ (xử lý vòng)',
      'Tạo clone rỗng trước, rồi mới clone từng neighbor',
      'Return clone của node vào',
    ],
    filename: 'clone-graph.ts',
    code: `function cloneGraph(node: GraphNode | null): GraphNode | null {
  const seen = new Map<GraphNode, GraphNode>();
  const dfs = (n: GraphNode): GraphNode => {
    if (seen.has(n)) return seen.get(n)!;
    const copy = new GraphNode(n.val);
    seen.set(n, copy);
    for (const nb of n.neighbors) {
      copy.neighbors.push(dfs(nb));
    }
    return copy;
  };
  return node === null ? null : dfs(node);
}`,
    highlightLines: [5],
    dryRun: {
      input: 'adjList = [[2,4],[1,3],[2,4],[1,3]] (1-indexed)',
      trace: ['Clone 1 → neighbor 2: clone 2 → neighbor 1 (đã có!) → dùng lại', '2 → neighbor 3: clone 3 → neighbor 4: clone 4 → neighbor 1,3 (đã có)', 'Mọi cạnh nối đúng bản sao'],
      output: 'đồ thị clone cùng cấu trúc',
    },
    pitfalls: ['Clone neighbor trước khi cho vào map → vòng lặp vô hạn', 'Copy reference thay vì deep copy (sửa clone ảnh hưởng gốc)'],
  },
  'course-schedule-207': {
    slug: 'course-schedule-207',
    blindNo: 207,
    time: 'O(V + E)',
    space: 'O(V + E)',
    rule: 'Môn học = topo-sort: vào 0 hết được thì không chu trình (Kahn).',
    checklist: [
      'Dựng adjacency + bậc vào (indegree) mỗi môn',
      'Queue các môn bậc vào = 0',
      'Pop → trừ bậc vào các môn kề, về 0 thì push',
      'Đếm = numCourses → true, không thì có chu trình',
    ],
    filename: 'course-schedule.ts',
    code: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let taken = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    taken++;
    for (const v of adj[u]) {
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  return taken === numCourses;
}`,
    highlightLines: [16],
    dryRun: {
      input: 'numCourses = 2, prerequisites = [[1,0]]',
      trace: ['indeg = [0,1], queue = [0]', 'Pop 0 → indeg[1] = 0 → push 1, taken = 1', 'Pop 1 → taken = 2 = numCourses → true'],
      output: 'true',
    },
    pitfalls: ['Nhầm chiều cạnh [a,b] (b trước a) → đồ thị ngược', 'DFS 3 màu cũng được nhưng Kahn dễ code ít lỗi hơn'],
  },
  'pacific-atlantic-417': {
    slug: 'pacific-atlantic-417',
    blindNo: 417,
    time: 'O(m·n)',
    space: 'O(m·n)',
    rule: 'Đi ngược từ 2 bờ vào trong (thấp → cao), ô nào cả 2 phía tới được thì lấy.',
    checklist: [
      'DFS/BFS từ hàng trên + cột trái (Pacific), từ hàng dưới + cột phải (Atlantic)',
      'Đi ngược: chỉ sang ô cao hơn hoặc bằng (nước chảy xuống)',
      '2 set visited riêng, giao nhau là đáp án',
      'Mỗi ô thăm tối đa 1 lần mỗi phía → O(m·n)',
    ],
    filename: 'pacific-atlantic.ts',
    code: `function pacificAtlantic(heights: number[][]): number[][] {
  const R = heights.length, C = heights[0].length;
  const pac = new Set<string>();
  const atl = new Set<string>();

  const dfs = (r: number, c: number, seen: Set<string>, prev: number): void => {
    if (r < 0 || c < 0 || r >= R || c >= C) return;
    const key = r + ',' + c;
    if (seen.has(key) || heights[r][c] < prev) return;
    seen.add(key);
    dfs(r + 1, c, seen, heights[r][c]);
    dfs(r - 1, c, seen, heights[r][c]);
    dfs(r, c + 1, seen, heights[r][c]);
    dfs(r, c - 1, seen, heights[r][c]);
  };

  for (let c = 0; c < C; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(R - 1, c, atl, heights[R - 1][c]);
  }
  for (let r = 0; r < R; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, C - 1, atl, heights[r][C - 1]);
  }

  const res: number[][] = [];
  pac.forEach((key) => {
    if (atl.has(key)) {
      const [r, c] = key.split(',').map(Number);
      res.push([r, c]);
    }
  });
  return res;
}`,
    highlightLines: [9],
    dryRun: {
      input: 'heights 5×5 (ví dụ LeetCode)',
      trace: ['Pacific loang từ trên+trái vào trong (đi lên cao)', 'Atlantic loang từ dưới+phải vào trong', 'Giao nhau 7 ô: [0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]'],
      output: '7 ô',
    },
    pitfalls: ['DFS xuôi từ mỗi ô ra biển (O((mn)²)) thay vì ngược từ biển vào', 'So sánh sai chiều cao (đi ngược phải cho phép lên cao, không phải xuống thấp)'],
  },
  'number-of-islands-200': {
    slug: 'number-of-islands-200',
    blindNo: 200,
    time: 'O(m·n)',
    space: 'O(m·n)',
    rule: 'Gặp đất chưa thăm thì +1 và flood-fill chìm cả đảo (đánh dấu đã thăm).',
    checklist: [
      'Duyệt mọi ô, gặp "1" → count++, flood-fill',
      'Flood-fill: ra biên/nước/đã thăm thì dừng',
      'Đánh dấu bằng cách chìm thành "0" (khỏi set riêng)',
      'Chỉ 4 hướng (không chéo)',
    ],
    filename: 'number-of-islands.ts',
    code: `function numIslands(grid: string[][]): number {
  const R = grid.length, C = grid[0].length;
  let count = 0;

  const sink = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === '1') {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
    highlightLines: [16],
    dryRun: {
      input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
      trace: ['(0,0) đất → count=1, chìm cả cụm (0,0),(0,1),(1,0)', '(2,2) đất → count=2, chìm', 'Hết → 2'],
      output: '2',
    },
    pitfalls: ['Quên đánh dấu đã thăm → đếm 1 đảo nhiều lần / treo', 'Tính cả đường chéo là 1 đảo (sai — chỉ 4 hướng)'],
  },
  'longest-consecutive-128': {
    slug: 'longest-consecutive-128',
    blindNo: 128,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Chỉ đếm từ “đầu dãy” (thiếu x−1) → mỗi số thăm đúng 1 lần, O(n).',
    checklist: [
      'Bỏ hết vào HashSet (O(1) lookup, khử trùng)',
      'x là đầu dãy ⟺ không có x−1',
      'Từ đầu dãy đếm lên x+1, x+2... tới đứt',
      'Giữ max, sort là O(n log n) — không đạt',
    ],
    filename: 'longest-consecutive.ts',
    code: `function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (!set.has(x - 1)) {
      let cur = x;
      let len = 1;
      while (set.has(cur + 1)) {
        cur++;
        len++;
      }
      best = Math.max(best, len);
    }
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [100,4,200,1,3,2]',
      trace: ['100: thiếu 99 → đầu dãy, đếm 100 → dài 1', '4: thiếu 3 → bỏ qua (không phải đầu)', '200: dài 1', '1: thiếu 0 → đầu dãy, đếm 1,2,3,4 → dài 4 ← best'],
      output: '4',
    },
    pitfalls: ['Đếm từ mọi số (mỗi dãy bị đếm lại nhiều lần → O(n²) worst-case)', 'Sort trước O(n log n) — đề bắt O(n)'],
  },
  'house-robber-198': {
    slug: 'house-robber-198',
    blindNo: 198,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Nhà i: max(trộm tới i−1, trộm tới i−2 + nhà i). Chỉ cần 2 biến lăn.',
    checklist: [
      'prev2 = 0 (tới i−2), prev1 = 0 (tới i−1)',
      'cur = max(prev1, prev2 + nums[i])',
      'Lăn: prev2 = prev1, prev1 = cur',
      'Mảng rỗng → 0',
    ],
    filename: 'house-robber.ts',
    code: `function rob(nums: number[]): number {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [2,7,9,3,1]',
      trace: ['x=2: max(0,2)=2 → (0,2)', 'x=7: max(2,7)=7 → (2,7)', 'x=9: max(7,11)=11 → (7,11)', 'x=3: max(11,10)=11 → (11,11)', 'x=1: max(11,12)=12'],
      output: '12',
    },
    pitfalls: ['Tham lam lấy nhà lớn (vd [2,1,1,2]: tham được 3, đúng là 4)', 'Mảng dp O(n) vẫn đúng nhưng phí — rolling O(1) đủ'],
  },
  'house-robber-ii-213': {
    slug: 'house-robber-ii-213',
    blindNo: 213,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Vòng tròn: đầu và cuối kề nhau → chạy robber thường 2 lần (bỏ đầu / bỏ cuối), lấy max.',
    checklist: [
      '1 nhà → trộm luôn',
      'Case A: trộm [0..n−2] (bỏ nhà cuối)',
      'Case B: trộm [1..n−1] (bỏ nhà đầu)',
      'Đáp án = max(A, B)',
    ],
    filename: 'house-robber-ii.ts',
    code: `function rob2(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const robRange = (l: number, r: number): number => {
    let prev2 = 0, prev1 = 0;
    for (let i = l; i <= r; i++) {
      const cur = Math.max(prev1, prev2 + nums[i]);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  };
  return Math.max(robRange(0, nums.length - 2), robRange(1, nums.length - 1));
}`,
    highlightLines: [12],
    dryRun: {
      input: 'nums = [2,3,2]',
      trace: ['Bỏ cuối [2,3]: max = 3', 'Bỏ đầu [3,2]: max = 3', 'max(3,3) = 3 (không thể 2+2 vì kề vòng tròn)'],
      output: '3',
    },
    pitfalls: ['Chạy robber thẳng cả vòng (trộm cả đầu + cuối kề nhau)', 'Quên case 1 nhà (range rỗng)'],
  },
  'decode-ways-91': {
    slug: 'decode-ways-91',
    blindNo: 91,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Như leo thang: 1 chữ số (1–9) hoặc 2 chữ số (10–26); số 0 không đứng một mình.',
    checklist: [
      'dp[i] = cách giải s[:i]',
      's[i−1] ≠ 0 → + dp[i−1]',
      's[i−2:i] trong 10..26 → + dp[i−2]',
      'Rolling 2 biến là đủ',
    ],
    filename: 'decode-ways.ts',
    code: `function numDecodings(s: string): number {
  let prev2 = 1;
  let prev1 = s[0] === '0' ? 0 : 1;
  for (let i = 2; i <= s.length; i++) {
    let cur = 0;
    if (s[i - 1] !== '0') cur += prev1;
    const two = Number(s.slice(i - 2, i));
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    highlightLines: [7],
    dryRun: {
      input: 's = "226"',
      trace: ['i=1 ("2"): 1 cách', 'i=2 ("22"): 1 chữ (2) + 2 chữ (22) = 2', 'i=3 ("226"): 1 chữ (6→+2) + 2 chữ (26→+1) = 3'],
      output: '3 ("BBF","BZ","VF")',
    },
    pitfalls: ['Cho "0" đứng một mình (0 không map chữ nào)', 'Nhận 2 chữ số 01–09 (số 0 đầu là sai)'],
  },
  'coin-change-322': {
    slug: 'coin-change-322',
    blindNo: 322,
    time: 'O(amount·n)',
    space: 'O(amount)',
    rule: 'dp[x] = 1 + min(dp[x−c]) mọi mệnh giá; duyệt amount tăng dần (dùng lại xu thoải mái).',
    checklist: [
      'dp[0] = 0, còn lại = ∞',
      'x từ 1..amount: thử mọi xu c ≤ x',
      'dp[x] = min(dp[x], dp[x−c] + 1)',
      'dp[amount] vẫn ∞ → return −1',
    ],
    filename: 'coin-change.ts',
    code: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x - c >= 0) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    highlightLines: [6],
    dryRun: {
      input: 'coins = [1,2,5], amount = 11',
      trace: ['dp[1..4] = 1,2,1,2 (dùng 1,2)', 'dp[5] = 1 (xu 5)', 'dp[6..10] = 2,2,3,3,2', 'dp[11] = dp[6]+1 = 3 (5+5+1)'],
      output: '3',
    },
    pitfalls: ['Tham lam lấy xu lớn trước ([1,3,4] đổi 6: tham 4+1+1=3 xu, đúng là 3+3=2 xu)', 'Quên −1 khi không đổi được'],
  },
  'lis-300': {
    slug: 'lis-300',
    blindNo: 300,
    time: 'O(n²)',
    space: 'O(n)',
    rule: 'dp[i] = 1 + max(dp[j]) với mọi j < i mà nums[j] < nums[i]. Muốn O(n log n): patience + binary search.',
    checklist: [
      'dp[i] khởi tạo 1 (một mình nó)',
      'j < i và nums[j] < nums[i] → dp[i] = max(dp[i], dp[j]+1)',
      'Đáp án = max toàn bộ dp (không phải dp cuối)',
      'Bản O(n log n): duy trì tails + binary search vị trí thay',
    ],
    filename: 'lis.ts',
    code: `function lengthOfLIS(nums: number[]): number {
  const dp = new Array(nums.length).fill(1);
  let best = 1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return nums.length === 0 ? 0 : best;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'nums = [10,9,2,5,3,7,101,18]',
      trace: ['dp[2]=1 (số 2)', 'dp[3]=2 (2→5)', 'dp[4]=2 (2→3)', 'dp[5]=3 (2→3→7)', 'dp[6]=4 (…→101)', 'dp[7]=4'],
      output: '4',
    },
    pitfalls: ['Return dp cuối (dãy dài nhất chưa chắc kết thúc ở cuối)', 'Dùng ≤ thay vì < (phải tăng chặt — strictly)'],
  },
  'jump-game-55': {
    slug: 'jump-game-55',
    blindNo: 55,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Tham lam từ phải sang trái: goal lùi dần về index tới được nó, tới 0 là thắng.',
    checklist: [
      'goal = index cuối',
      'i từ cuối về đầu: i + nums[i] ≥ goal → goal = i',
      'goal = 0 → true',
      'DP O(n²) cũng đúng nhưng phí',
    ],
    filename: 'jump-game.ts',
    code: `function canJump(nums: number[]): boolean {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) goal = i;
  }
  return goal === 0;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [2,3,1,1,4]',
      trace: ['goal=4; i=4: 4+4≥4 → goal=4', 'i=3: 3+1≥4 → goal=3', 'i=2: 2+1≥3 → goal=2', 'i=1: 1+3≥2 → goal=1', 'i=0: 0+2≥1 → goal=0 → true'],
      output: 'true',
    },
    pitfalls: ['Tham lam xuôi (luôn nhảy xa nhất) sai — vd [3,2,1,0,4]', 'DP từ trái sang mà không cắt tỉa → O(n²) timeout ở test lớn'],
  },
  'word-break-139': {
    slug: 'word-break-139',
    blindNo: 139,
    time: 'O(n²)',
    space: 'O(n)',
    rule: 'dp[i] = có j < i sao cho dp[j] đúng và s[j:i] trong dict.',
    checklist: [
      'dp[0] = true (chuỗi rỗng)',
      'i từ 1..n, j từ 0..i−1',
      'dp[j] && dict.has(s[j:i]) → dp[i] = true, break',
      'Từ điển dùng Set để O(1)',
    ],
    filename: 'word-break.ts',
    code: `function wordBreak(s: string, wordDict: string[]): boolean {
  const dict = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    highlightLines: [7],
    dryRun: {
      input: 's = "leetcode", dict = ["leet","code"]',
      trace: ['dp[4] = true (s[0:4]="leet" ✓)', 'dp[8]: j=4, dp[4] ✓ và s[4:8]="code" ✓ → true'],
      output: 'true',
    },
    pitfalls: ['Tham lam cắt từ dài nhất trước ("aaaaaaa" + ["aaaa","aa"] cần backtrack)', 'Quên từ được dùng lại nhiều lần'],
  },
  'longest-palindrome-5': {
    slug: 'longest-palindrome-5',
    blindNo: 5,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Mỗi vị trí bung 2 phía: tâm lẻ (i,i) + tâm chẵn (i,i+1), giữ chuỗi dài nhất.',
    checklist: [
      'Tâm lẻ: l = i, r = i; tâm chẵn: l = i, r = i+1',
      'Bung khi s[l] = s[r], hết thì dừng',
      'Dài hơn best thì giữ (lưu l, len)',
      'Chuỗi rỗng/1 chữ → return luôn',
    ],
    filename: 'longest-palindrome.ts',
    code: `function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;
  const expand = (l: number, r: number): void => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        start = l;
        maxLen = r - l + 1;
      }
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}`,
    highlightLines: [5],
    dryRun: {
      input: 's = "babad"',
      trace: ['Tâm 1 (a): bung "bab" dài 3 ← best', 'Tâm 1-2 (a,b): khác ngay', 'Tâm 2 (b): bung "aba" dài 3 (không hơn)', 'Còn lại ngắn hơn'],
      output: '"bab" (hoặc "aba" đều đúng)',
    },
    pitfalls: ['Chỉ xét tâm lẻ (mất đáp án chẵn như "abba")', 'DP bảng O(n²) bộ nhớ vẫn đúng nhưng phí hơn expand O(1)'],
  },
  'palindromic-substrings-647': {
    slug: 'palindromic-substrings-647',
    blindNo: 647,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Giống bài 5 nhưng đếm thay vì giữ chuỗi: mỗi lần bung khớp là +1.',
    checklist: [
      '2 tâm như bài 5 (lẻ + chẵn)',
      'Mỗi vòng bung khớp → count++',
      'Vị trí khác nhau tính riêng ("aaa" có 3 chữ "a" đơn)',
      'Return count',
    ],
    filename: 'palindromic-substrings.ts',
    code: `function countSubstrings(s: string): number {
  let count = 0;
  const expand = (l: number, r: number): void => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
    highlightLines: [4],
    dryRun: {
      input: 's = "aaa"',
      trace: ['Tâm 0: "a" → 1', 'Tâm 1: "a","aaa" → +2 = 3', 'Tâm 2: "a" → 4', 'Tâm chẵn 0-1: "aa" → 5; 1-2: "aa" → 6'],
      output: '6',
    },
    pitfalls: ['Đếm chuỗi phân biệt thay vì theo vị trí ("aaa" có 6, không phải 3)', 'Bỏ tâm chẵn (mất "aa")'],
  },
  'implement-trie-208': {
    slug: 'implement-trie-208',
    blindNo: 208,
    time: 'O(m)',
    space: 'O(m·n)',
    rule: 'Trie = cây theo ký tự: đi theo từng chữ, cờ end đánh dấu hết từ.',
    checklist: [
      'Mỗi node: map con (26 ô hoặc dict) + cờ isEnd',
      'Insert: thiếu nhánh thì tạo, cuối set end = true',
      'Search: đi hết mà end = true mới đúng (app ≠ apple)',
      'StartsWith: đi hết prefix là đủ, khỏi cần end',
    ],
    filename: 'implement-trie.ts',
    code: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }

  private walk(s: string): TrieNode | null {
    let node: TrieNode | null = this.root;
    for (const c of s) {
      node = node?.children.get(c) ?? null;
      if (node === null) return null;
    }
    return node;
  }
}`,
    highlightLines: [11],
    dryRun: {
      input: 'insert("apple"); search("apple"); search("app"); startsWith("app")',
      trace: ['insert: root→a→p→p→l→e, end(e)=true', 'search apple: đi hết, end=true → true', 'search app: đi hết nhưng end=false → false', 'startsWith app: đi hết → true'],
      output: 'true, false, true',
    },
    pitfalls: ['Search quên check isEnd ("app" thành true oan)', 'StartsWith đòi end = true (sai — prefix không cần hết từ)'],
  },
  'add-search-words-211': {
    slug: 'add-search-words-211',
    blindNo: 211,
    time: 'O(26^m)',
    space: 'O(m·n)',
    rule: 'Trie thường + DFS: gặp "." thì thử cả 26 nhánh, hết chuỗi mà end thì đúng.',
    checklist: [
      'addWord như Trie thường',
      'Chữ thường: đi đúng 1 nhánh, cụt → false',
      '"." → DFS thử mọi nhánh con ở vị trí đó',
      'Base: hết chuỗi → return node.isEnd',
    ],
    filename: 'add-search-words.ts',
    code: `function searchWord(root: TrieNode, word: string, i: number): boolean {
  let node: TrieNode | null = root;
  const dfs = (n: TrieNode | null, k: number): boolean => {
    if (n === null) return false;
    if (k === word.length) return n.isEnd;
    const c = word[k];
    if (c === '.') {
      for (const child of n.children.values()) {
        if (dfs(child, k + 1)) return true;
      }
      return false;
    }
    return dfs(n.children.get(c) ?? null, k + 1);
  };
  return dfs(node, i);
}`,
    highlightLines: [8],
    dryRun: {
      input: 'add bad/dad/mad; search("b.d")',
      trace: ['b → nhánh b', '. → thử b-a-d...: a khớp', 'd khớp, hết chuỗi, end=true → true'],
      output: 'true',
    },
    pitfalls: ['Wu.“.” mà chỉ thử 1 nhánh (phải thử hết)', 'Quên base hết chuỗi vẫn phải check isEnd'],
  },
  'word-search-ii-212': {
    slug: 'word-search-ii-212',
    blindNo: 212,
    time: 'O(m·n·4·3^(L−1))',
    space: 'O(k·L)',
    rule: 'Ném hết từ vào Trie rồi DFS 1 lần: prefix không có trong Trie thì cắt nhánh.',
    checklist: [
      'Build Trie cả list từ (+ lưu word ở node end)',
      'DFS từ mọi ô, đi theo Trie (không có nhánh → cắt)',
      'Tới node end → thu từ, xóa end để khỏi trùng',
      'Backtrack visited sau mỗi lần thử (đánh dấu/rỡ)',
    ],
    filename: 'word-search-ii.ts',
    code: `function findWords(board: string[][], words: string[]): string[] {
  const root = buildTrie(words);
  const res: string[] = [];
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, node: TrieNode): void => {
    if (r < 0 || c < 0 || r >= R || c >= C) return;
    const ch = board[r][c];
    if (ch === '#' || !node.children.has(ch)) return;
    const next = node.children.get(ch)!;
    if (next.word !== null) {
      res.push(next.word);
      next.word = null; // chống trùng
    }
    board[r][c] = '#';
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;
  };

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) dfs(r, c, root);
  return res;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'board 4×4 (oath/pea/eat/rain), words = ["oath","pea","eat","rain"]',
      trace: ['DFS từ o(0,0): o→a→t→h khớp Trie → thu "oath"', 'Từ e(1,0)... nhánh "pea": p không kề → cắt', 'Từ e(2,3)... à e(1,3)→a→t: "eat" → thu', '"rain" không đi được → bỏ'],
      output: '["oath","eat"] (thứ tự có thể khác)',
    },
    pitfalls: ['DFS từng từ riêng (O(k·m·n·4^L)) thay vì 1 Trie chung', 'Quên xóa end sau khi thu → trùng từ; quên rỡ visited → sai'],
  },
  'top-k-frequent-347': {
    slug: 'top-k-frequent-347',
    blindNo: 347,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Đếm tần suất rồi bucket theo tần suất (index = số lần xuất hiện), quét ngược lấy K.',
    checklist: [
      'Map value → count',
      'Bucket[f] = list số xuất hiện đúng f lần (f tối đa = n)',
      'Quét bucket từ n về 1, gom tới khi đủ K',
      'Muốn 1 dòng? Min-heap size K (O(n log k))',
    ],
    filename: 'top-k-frequent.ts',
    code: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
  const bucket: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) bucket[count].push(val);
  const res: number[] = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    res.push(...bucket[f]);
  }
  return res;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [1,1,1,2,2,3], k = 2',
      trace: ['freq: 1×3, 2×2, 3×1', 'bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]', 'Quét ngược: lấy 1, rồi 2 → đủ K'],
      output: '[1,2]',
    },
    pitfalls: ['Sort theo tần suất O(n log n) vẫn đúng nhưng chưa tối ưu', 'Bucket size n+1 (tần suất tối đa = n) — quên +1 là tràn'],
  },
  'find-median-295': {
    slug: 'find-median-295',
    blindNo: 295,
    time: 'O(log n)',
    space: 'O(n)',
    rule: '2 heap: max-heap nửa dưới + min-heap nửa trên, size chênh ≤ 1.',
    checklist: [
      'Số mới vào max-heap (nửa dưới) trước',
      'Đẩy max của dưới sang trên để giữ mọi số dưới ≤ mọi số trên',
      'Dưới ít hơn trên → chuyển 1 số về cho cân',
      'Median: dưới nhiều hơn → đỉnh dưới; bằng nhau → trung bình 2 đỉnh',
    ],
    filename: 'find-median.ts',
    code: `class Heap {
  a: number[] = [];
  constructor(private less: (x: number, y: number) => boolean) {}
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
  push(v: number): void {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[i], a[p])) { [a[i], a[p]] = [a[p], a[i]]; i = p; }
      else break;
    }
  }
  pop(): number {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}

class MedianFinder {
  lo = new Heap((x, y) => x > y); // max-heap nửa dưới
  hi = new Heap((x, y) => x < y); // min-heap nửa trên

  addNum(x: number): void {
    this.lo.push(x);
    this.hi.push(this.lo.pop());
    if (this.lo.size < this.hi.size) this.lo.push(this.hi.pop());
  }

  findMedian(): number {
    if (this.lo.size > this.hi.size) return this.lo.top;
    return (this.lo.top + this.hi.top) / 2;
  }
}`,
    highlightLines: [43],
    dryRun: {
      input: 'add 1, add 2, median, add 3, median',
      trace: ['add 1: lo=[1], hi=[] → median 1', 'add 2: lo=[1], hi=[2] → median (1+2)/2=1.5', 'add 3: lo=[2,1], hi=[3] → median 2'],
      output: '1.5, 2',
    },
    pitfalls: ['Để size chênh > 1 (median sai)', 'Đẩy số mới thẳng vào heap trên mà không qua heap dưới (vỡ bất biến dưới ≤ trên)'],
  },
  'combination-sum-39': {
    slug: 'combination-sum-39',
    blindNo: 39,
    time: 'O(n^(t/m))',
    space: 'O(t/m)',
    rule: 'Backtracking chọn/bỏ: mỗi vị trí hoặc lấy tiếp (giữ index) hoặc bỏ qua (index+1).',
    checklist: [
      'sum = target → lưu bản sao, return',
      'sum > target hoặc hết mảng → cắt nhánh',
      'Nhánh lấy: push candidate[i], dfs(i) — được dùng lại',
      'Nhánh bỏ: pop, dfs(i+1)',
    ],
    filename: 'combination-sum.ts',
    code: `function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = [];
  const dfs = (i: number, cur: number[], sum: number): void => {
    if (sum === target) {
      res.push([...cur]);
      return;
    }
    if (sum > target || i >= candidates.length) return;
    cur.push(candidates[i]);
    dfs(i, cur, sum + candidates[i]);
    cur.pop();
    dfs(i + 1, cur, sum);
  };
  dfs(0, [], 0);
  return res;
}`,
    highlightLines: [11],
    dryRun: {
      input: 'candidates = [2,3,6,7], target = 7',
      trace: ['Lấy 2,2,2 (sum 6) → lấy nữa 8>7 cắt, bỏ → [2,2,3] ✓', 'Bỏ 3... lấy 6? 2+6=8 cắt', 'Bỏ 2 đầu: 3... 3+3+... 7? 3+... cắt; 6... 6<7, +... cắt', 'Bỏ hết tới 7 → [7] ✓'],
      output: '[[2,2,3],[7]]',
    },
    pitfalls: ['Nhánh lấy mà dfs(i+1) thì mất tổ hợp dùng lại (thành Combination Sum II)', 'Lưu cur trực tiếp (reference) thay vì copy → kết quả rỗng/sai'],
  },
  'word-search-79': {
    slug: 'word-search-79',
    blindNo: 79,
    time: 'O(m·n·4^L)',
    space: 'O(L)',
    rule: 'Thử mọi ô làm điểm bắt đầu, DFS 4 hướng khớp từng chữ, backtrack visited.',
    checklist: [
      'Ô khớp chữ đầu → DFS sâu dần theo word[k]',
      'Đánh dấu đã thăm (đè "#" rồi rỡ lại sau)',
      'Hết chữ (k = len) → true',
      '4 hướng đều sai → false, rỡ dấu rồi về',
    ],
    filename: 'word-search.ts',
    code: `function exist(board: string[][], word: string): boolean {
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, k: number): boolean => {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C) return false;
    if (board[r][c] !== word[k]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    const found =
      dfs(r + 1, c, k + 1) ||
      dfs(r - 1, c, k + 1) ||
      dfs(r, c + 1, k + 1) ||
      dfs(r, c - 1, k + 1);
    board[r][c] = tmp;
    return found;
  };

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (board[r][c] === word[0] && dfs(r, c, 0)) return true;
    }
  return false;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'board 3×4 (ABCCED...), word = "ABCCED"',
      trace: ['(0,0) A khớp → (0,1) B khớp → (0,2) C khớp', '(1,2) C khớp → (2,2) E khớp → (2,1) D khớp, hết chữ → true'],
      output: 'true',
    },
    pitfalls: ['Quên rỡ dấu visited sau khi thử (ô bị khóa vĩnh viễn)', 'Không cắt sớm khi chữ hiện tại đã lệch (duyệt thừa)'],
  },
  'max-depth-104': {
    slug: 'max-depth-104',
    blindNo: 104,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Chiều cao = 1 + max(trái, phải); null thì 0. Đệ quy 1 dòng là đủ.',
    checklist: [
      'Base: node null → depth 0',
      'Đệ quy cả 2 nhánh, lấy max',
      'Cộng 1 cho node hiện tại',
      'Space O(h) do stack đệ quy (cây lệch = O(n))',
    ],
    filename: 'max-depth.ts',
    code: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    highlightLines: [3],
    dryRun: {
      input: 'root = [3,9,20,null,null,15,7]',
      trace: ['depth(9) = 1, depth(15) = depth(7) = 1', 'depth(20) = 1 + max(1,1) = 2', 'depth(3) = 1 + max(1,2) = 3'],
      output: '3',
    },
    pitfalls: ['Quên +1 ở mỗi tầng', 'Nhầm với số node (đường dài nhất theo cạnh thì trừ 1)'],
  },
  'same-tree-100': {
    slug: 'same-tree-100',
    blindNo: 100,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'So song song: cùng null → true, 1 null hoặc khác giá trị → false, rồi so 2 nhánh.',
    checklist: [
      'Cả 2 null → true (lá gặp nhau)',
      '1 null hoặc val khác → false ngay',
      'Đệ quy trái VÀ phải (&&)',
      'Thứ tự check null trước khi đọc .val',
    ],
    filename: 'same-tree.ts',
    code: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    highlightLines: [3],
    dryRun: {
      input: 'p = [1,2,3], q = [1,2,3]',
      trace: ['1 = 1 → so trái (2 vs 2) và phải (3 vs 3)', '2 = 2, 2 lá null khớp → true', '3 = 3 tương tự → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ so giá trị mà bỏ cấu trúc (vd [1,2] vs [1,null,2])', 'Dùng || thay vì && ở 2 nhánh'],
  },
  'invert-tree-226': {
    slug: 'invert-tree-226',
    blindNo: 226,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Gương cây = swap trái/phải mọi node, đệ quy xuống tiếp.',
    checklist: [
      'Null → return null',
      'Swap: temp = left, left = right, right = temp',
      'Đệ quy invert cả 2 nhánh đã swap',
      'Return root',
    ],
    filename: 'invert-tree.ts',
    code: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);
  return root;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [4,2,7,1,3,6,9]',
      trace: ['Swap ở 4: trái ↔ phải → [4,7,2,...]', 'Đệ quy nhánh 7: [7,9,6]', 'Đệ quy nhánh 2: [2,3,1]'],
      output: '[4,7,2,9,6,3,1]',
    },
    pitfalls: ['Gán left = right rồi right = left mà không qua temp (mất nhánh)', 'Quên return root ở cuối'],
  },
  'max-path-sum-124': {
    slug: 'max-path-sum-124',
    blindNo: 124,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Mỗi node: trả lên gain tốt nhất 1 nhánh, cập nhật max toàn cục bằng cả 2 nhánh.',
    checklist: [
      'Gain âm thì bỏ (max(0, gain)) — đường rỗng tốt hơn đường lỗ',
      'max = max(max, val + left + right) tại mỗi node',
      'Return val + max(left, right) cho cha (chỉ 1 nhánh)',
      'Khởi tạo max = −∞ vì toàn cây có thể âm',
    ],
    filename: 'max-path-sum.ts',
    code: `function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;
  const gain = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = Math.max(0, gain(node.left));
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'root = [-10,9,20,null,null,15,7]',
      trace: ['gain(9) = 9, best = 9', 'gain(15) = 15, gain(7) = 7', 'gain(20) = 20+15+7 → best = 42, return 20+15=35', 'gain(−10): best = max(42, −10+9+35=34) = 42'],
      output: '42',
    },
    pitfalls: ['Return cả 2 nhánh cho cha (đường đi sẽ rẽ nhánh, sai định nghĩa)', 'Khởi tạo best = 0 sẽ sai khi mọi số âm'],
  },
  'level-order-102': {
    slug: 'level-order-102',
    blindNo: 102,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'BFS + chốt levelSize đầu mỗi tầng: xử lý đúng số node của tầng đó.',
    checklist: [
      'Queue bắt đầu [root], result = []',
      'levelSize = queue.length (chốt trước khi lặp)',
      'Shift đúng levelSize node, push con vào queue',
      'Push cả level vào result',
    ],
    filename: 'level-order.ts',
    code: `function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const queue: TreeNode[] = [root];
  const result: number[][] = [];
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'root = [3,9,20,null,null,15,7]',
      trace: ['Tầng 0: size=1, lấy 3, queue=[9,20]', 'Tầng 1: size=2, lấy 9,20, queue=[15,7]', 'Tầng 2: size=2, lấy 15,7, queue rỗng'],
      output: '[[3],[9,20],[15,7]]',
    },
    pitfalls: ['Dùng queue.length trực tiếp trong for (queue phình ra, lặp lố sang tầng sau)', 'Quên check root null'],
  },
  'serialize-tree-297': {
    slug: 'serialize-tree-297',
    blindNo: 297,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Preorder + dấu # cho null: thứ tự duyệt chính là “bản đồ” dựng lại cây.',
    checklist: [
      'Serialize: preorder, null → "#"',
      'Deserialize: đọc token theo đúng thứ tự preorder',
      '"#" → return null (tiêu 1 token)',
      'Số → tạo node, đệ quy trái rồi phải',
    ],
    filename: 'serialize-tree.ts',
    code: `function serialize(root: TreeNode | null): string {
  const out: string[] = [];
  const pre = (node: TreeNode | null): void => {
    if (node === null) { out.push('#'); return; }
    out.push(String(node.val));
    pre(node.left);
    pre(node.right);
  };
  pre(root);
  return out.join(',');
}

function deserialize(data: string): TreeNode | null {
  const tokens = data.split(',');
  let i = 0;
  const build = (): TreeNode | null => {
    if (tokens[i] === '#') { i++; return null; }
    const node = new TreeNode(Number(tokens[i++]));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [1,2,3,null,null,4,5]',
      trace: ['preorder: 1, 2, #, #, 3, 4, #, #, 5, #, #', 'decode: 1 → trái 2 (lá) → phải 3 → trái 4 → phải 5', 'Cây dựng lại giống hệt gốc'],
      output: '"1,2,#,#,3,4,#,#,5,#,#"',
    },
    pitfalls: ['Quên dấu # cho null → decode mơ hồ (nhiều cây cùng preorder)', 'Dùng index chung mà quên tăng khi gặp #'],
  },
  'subtree-572': {
    slug: 'subtree-572',
    blindNo: 572,
    time: 'O(m·n)',
    space: 'O(h)',
    rule: 'Mỗi node của cây lớn thử sameTree với cây con; sai thì đi tiếp 2 nhánh.',
    checklist: [
      'subRoot null → true (cây rỗng là con của mọi cây)',
      'root null mà subRoot còn → false',
      'sameTree(root, subRoot) đúng → true',
      'Sai → đệ quy trái HOẶC phải (||)',
    ],
    filename: 'subtree.ts',
    code: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (subRoot === null) return true;
  if (root === null) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [3,4,5,1,2], subRoot = [4,1,2]',
      trace: ['3 vs 4: khác gốc → đi trái', '4 vs 4: trái 1=1, phải 2=2 → sameTree true → return true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check từ root lớn mà không duyệt xuống (bỏ sót vị trí khớp)', 'Nhầm && với || ở 2 nhánh đệ quy'],
  },
  'construct-tree-105': {
    slug: 'construct-tree-105',
    blindNo: 105,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Đầu preorder là root; vị trí root trong inorder cắt trái/phải — map index để O(1).',
    checklist: [
      'Map value → index trong inorder',
      'preorder[pi++] là root hiện tại',
      'Trái = đoạn [l, k−1], phải = [k+1, r] (k = index root)',
      'Đệ quy trái trước rồi phải (đúng thứ tự preorder)',
    ],
    filename: 'construct-tree.ts',
    code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));
  let pi = 0;
  const build = (l: number, r: number): TreeNode | null => {
    if (l > r) return null;
    const root = new TreeNode(preorder[pi++]);
    const k = pos.get(root.val)!;
    root.left = build(l, k - 1);
    root.right = build(k + 1, r);
    return root;
  };
  return build(0, inorder.length - 1);
}`,
    highlightLines: [8],
    dryRun: {
      input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      trace: ['root = 3, k=1: trái [9], phải [15,20,7]', 'Trái: root = 9 (lá)', 'Phải: root = 20, k=3: trái [15], phải [7]'],
      output: '[3,9,20,null,null,15,7]',
    },
    pitfalls: ['Tìm index bằng indexOf mỗi lần → O(n²)', 'Đệ quy phải trước trái (sai thứ tự preorder)'],
  },
  'kth-smallest-230': {
    slug: 'kth-smallest-230',
    blindNo: 230,
    time: 'O(h + k)',
    space: 'O(h)',
    rule: 'Inorder BST ra dãy tăng → đếm tới K là đáp án, dừng sớm khỏi duyệt hết.',
    checklist: [
      'Inorder: trái → node → phải',
      'Mỗi node thăm: count++, count = k → return val',
      'Dừng sớm (không duyệt nốt cây)',
      'Muốn O(1) thêm? Morris traversal (nâng cao)',
    ],
    filename: 'kth-smallest.ts',
    code: `function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let answer = -1;
  const inorder = (node: TreeNode | null): void => {
    if (node === null || answer !== -1) return;
    inorder(node.left);
    count++;
    if (count === k) { answer = node.val; return; }
    inorder(node.right);
  };
  inorder(root);
  return answer;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'root = [3,1,4,null,2], k = 1',
      trace: ['Inorder: 1 → 2 → 3 → 4', 'count=1 tại node 1 = k → answer = 1, dừng'],
      output: '1',
    },
    pitfalls: ['Duyệt preorder/postorder (không có thứ tự tăng)', 'Không dừng sớm vẫn đúng nhưng phí'],
  },
  'find-min-rotated-153': {
    slug: 'find-min-rotated-153',
    blindNo: 153,
    time: 'O(log n)',
    space: 'O(1)',
    rule: 'Mảng xoay: so nums[mid] với nums[right] — mid lớn hơn right thì min nằm nửa phải.',
    checklist: [
      'Mảng đã sort rồi xoay, các số phân biệt',
      'nums[mid] > nums[right] → min ở phải: l = mid + 1',
      'Ngược lại → min ở trái (kể cả mid): r = mid',
      'Vòng [l, r), hết lặp return nums[l]',
    ],
    filename: 'find-min-rotated.ts',
    code: `function findMin(nums: number[]): number {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] > nums[r]) l = m + 1;
    else r = m;
  }
  return nums[l];
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [3,4,5,1,2]',
      trace: ['[0,4]: m=2 (5) > nums[4]=2 → l=3', '[3,4]: m=3 (1) ≤ nums[4]=2 → r=3', 'l=r=3 → return nums[3]=1'],
      output: '1',
    },
    pitfalls: ['So với nums[left] thay vì nums[right] sẽ sai hướng', 'Dùng r = m − 1 có thể loại mất đáp án (min có thể chính là mid)'],
  },
  'search-rotated-33': {
    slug: 'search-rotated-33',
    blindNo: 33,
    time: 'O(log n)',
    space: 'O(1)',
    rule: 'Mảng xoay luôn có 1 nửa sorted — target nằm trong nửa sorted thì tìm ở đó.',
    checklist: [
      'So nums[l] ≤ nums[m]: nửa trái sorted',
      'Target trong [nums[l], nums[m]) → r = m − 1, không thì l = m + 1',
      'Nửa phải sorted thì xét (nums[m], nums[r]] tương tự',
      'Hết vòng → return −1',
    ],
    filename: 'search-rotated.ts',
    code: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] === target) return m;
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) r = m - 1;
      else l = m + 1;
    } else {
      if (nums[m] < target && target <= nums[r]) l = m + 1;
      else r = m - 1;
    }
  }
  return -1;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'nums = [4,5,6,7,0,1,2], target = 0',
      trace: ['[0,6]: m=3 (7). Trái [4..7] sorted, 0 không trong → l=4', '[4,6]: m=5 (1). Trái [0,1] sorted? nums[4]=0 ≤ 1 đúng, 0 trong [0,1) → r=4', '[4,4]: m=4 (0) = target → return 4'],
      output: '4',
    },
    pitfalls: ['Quên số phân biệt là giả thiết cốt lõi (có trùng cần xử lý khác)', 'Nhầm biên < và ≤ ở 2 nhánh đối xứng'],
  },
  'longest-substring-3': {
    slug: 'longest-substring-3',
    blindNo: 3,
    time: 'O(n)',
    space: 'O(min(n, charset))',
    rule: 'Cửa sổ không trùng: mở phải, gặp trùng thì co trái tới khi hết trùng.',
    checklist: [
      'Set lưu ký tự trong cửa sổ [l, r]',
      's[r] đã có → xóa s[l], l++ tới khi hết trùng',
      'Add s[r], best = max(best, r − l + 1)',
      'Mỗi ký tự vào/ra đúng 1 lần → O(n)',
    ],
    filename: 'longest-substring.ts',
    code: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 's = "abcabcbb"',
      trace: ['r=0..2: {a,b,c}, best=3', 'r=3 (a trùng): xóa a, l=1 → {b,c,a}, dài 3', 'r=4 (b trùng): xóa b, l=2 → dài 3', 'r=5,6,7 (c,b,b): co tiếp, best giữ 3'],
      output: '3',
    },
    pitfalls: ['Reset cả cửa sổ khi gặp trùng (mất O(n²)) thay vì co trái dần', 'Quên +1 khi tính độ dài (r − l + 1)'],
  },
  'char-replacement-424': {
    slug: 'char-replacement-424',
    blindNo: 424,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Cửa sổ hợp lệ khi số ký tự phải đổi = dài − tần suất max ≤ k.',
    checklist: [
      'Đếm tần suất 26 chữ hoa trong cửa sổ, track maxFreq',
      'dài − maxFreq > k → co trái (giảm đếm, l++)',
      'best = max(best, dài cửa sổ)',
      'maxFreq không cần giảm khi co (chỉ cần giá trị max từng thấy)',
    ],
    filename: 'char-replacement.ts',
    code: `function characterReplacement(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let l = 0, maxFreq = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(r) - 65]);
    while (r - l + 1 - maxFreq > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    highlightLines: [6],
    dryRun: {
      input: 's = "ABAB", k = 2',
      trace: ['r=0 (A): maxFreq=1, dài 1−1=0 ≤ 2, best=1', 'r=1 (B): maxFreq=1, 2−1=1 ≤ 2, best=2', 'r=2 (A): maxFreq=2, 3−2=1 ≤ 2, best=3', 'r=3 (B): maxFreq=2, 4−2=2 ≤ 2, best=4'],
      output: '4',
    },
    pitfalls: ['Tưởng phải giảm maxFreq khi co trái (không cần — best chỉ tăng)', 'Thử mọi vị trí đổi brute force O(n²·alphabet)'],
  },
  'min-window-76': {
    slug: 'min-window-76',
    blindNo: 76,
    time: 'O(m + n)',
    space: 'O(charset)',
    rule: 'Mở phải tới khi đủ chữ (have = need), rồi co trái tối thiểu, track have/need.',
    checklist: [
      'need = đếm chữ của t, have = số loại chữ đã đủ',
      'Mở r: chữ đủ quota → have++',
      'have = need → co l, cập nhật best, chữ tụt quota → have−−',
      'Không bao giờ đủ → return ""',
    ],
    filename: 'min-window.ts',
    code: `function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const win = new Map<string, number>();
  let have = 0, l = 0, best = '';
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    win.set(c, (win.get(c) ?? 0) + 1);
    if (need.has(c) && win.get(c) === need.get(c)) have++;
    while (have === need.size) {
      if (best === '' || r - l + 1 < best.length) best = s.slice(l, r + 1);
      const d = s[l];
      win.set(d, win.get(d)! - 1);
      if (need.has(d) && win.get(d)! < need.get(d)!) have--;
      l++;
    }
  }
  return best;
}`,
    highlightLines: [11],
    dryRun: {
      input: 's = "ADOBECODEBANC", t = "ABC"',
      trace: ['Mở r tới 5 ("ADOBEC"): đủ A,B,C → have=3', 'Co l: 0→5, best="ADOBEC"(6); l=5 mất A → have=2', 'Mở tiếp tới r=10 ("...BANC"): đủ lại → co l=6..9, best="BANC"(4)', 'Hết s → best="BANC"'],
      output: '"BANC"',
    },
    pitfalls: ['So have với t.length thay vì số loại chữ phân biệt', 'Quên cập nhật best trước khi co trái'],
  },
  'reverse-linked-list-206': {
    slug: 'reverse-linked-list-206',
    blindNo: 206,
    time: 'O(n)',
    space: 'O(1)',
    rule: '3 con trỏ: lưu next trước, lật mũi tên về prev, bước cả 2 tới.',
    checklist: [
      'prev = null, curr = head',
      'next = curr.next (giữ kẻo mất list)',
      'curr.next = prev (lật mũi tên)',
      'prev = curr, curr = next; hết thì return prev',
    ],
    filename: 'reverse-linked-list.ts',
    code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'head = [1,2,3,4,5]',
      trace: ['curr=1: next=2, 1→null, prev=1', 'curr=2: next=3, 2→1, prev=2', 'curr=3: 3→2, prev=3', 'curr=4: 4→3, prev=4', 'curr=5: 5→4, prev=5, curr=null → return 5'],
      output: '[5,4,3,2,1]',
    },
    pitfalls: ['Quên lưu next trước khi lật → mất nửa sau list', 'Return head cũ thay vì prev'],
  },
  'linked-list-cycle-141': {
    slug: 'linked-list-cycle-141',
    blindNo: 141,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Rùa (1 bước) + thỏ (2 bước): gặp nhau là có vòng, thỏ tới null là không.',
    checklist: [
      'slow = fast = head',
      'Lặp khi fast và fast.next còn sống',
      'slow += 1, fast += 2; bằng nhau → true',
      'Thoát lặp (thỏ null) → false',
    ],
    filename: 'linked-list-cycle.ts',
    code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'head = [3,2,0,-4], pos = 1 (đuôi nối về index 1)',
      trace: ['slow=3, fast=3', 'slow=2, fast=0', 'slow=0, fast=2', 'slow=-4, fast=-4 → bằng nhau → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check fast null mà quên fast.next null → crash', 'Dùng set nhớ node tốn O(n) bộ nhớ (vẫn đúng nhưng không tối ưu)'],
  },
  'merge-two-lists-21': {
    slug: 'merge-two-lists-21',
    blindNo: 21,
    time: 'O(n + m)',
    space: 'O(1)',
    rule: 'Dummy head + 2 con trỏ: nhỏ hơn thì nối, hết 1 list thì nối nốt list còn lại.',
    checklist: [
      'dummy = node giả, cur = dummy',
      'Cả 2 còn sống: nhỏ hơn → cur.next, tiến con trỏ đó',
      'cur tiến theo sau mỗi lần nối',
      'Nối nốt phần còn lại, return dummy.next',
    ],
    filename: 'merge-two-lists.ts',
    code: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 ?? l2;
  return dummy.next;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'l1 = [1,2,4], l2 = [1,3,4]',
      trace: ['1 vs 1: nối l1(1)', '2 vs 1: nối l2(1)', '2 vs 3: nối l1(2)', '4 vs 3: nối l2(3)', '4 vs 4: nối l1(4)', 'l1 hết → nối nốt [4]'],
      output: '[1,1,2,3,4,4]',
    },
    pitfalls: ['Quên dummy phải xử lý head riêng rất rối', 'Quên nối phần còn lại sau vòng lặp'],
  },
  'merge-k-lists-23': {
    slug: 'merge-k-lists-23',
    blindNo: 23,
    time: 'O(N log k)',
    space: 'O(k)',
    rule: 'Min-heap K head: pop nhỏ nhất, push next của nó — mỗi node vào/ra heap 1 lần.',
    checklist: [
      'Push head của mọi list không rỗng vào heap (key = val)',
      'Pop min → nối vào kết quả, push next của nó (nếu có)',
      'Lặp tới khi heap rỗng',
      'k = 1 thì chính là list đó; tất cả rỗng → null',
    ],
    filename: 'merge-k-lists.ts',
    code: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap: ListNode[] = [];
  const push = (n: ListNode) => { heap.push(n); heap.sort((a, b) => a.val - b.val); };
  for (const node of lists) if (node !== null) push(node);
  const dummy = new ListNode();
  let cur = dummy;
  while (heap.length > 0) {
    heap.sort((a, b) => a.val - b.val);
    const node = heap.shift()!;
    cur.next = node;
    cur = cur.next;
    if (node.next !== null) push(node.next);
  }
  return dummy.next;
}`,
    highlightLines: [9],
    dryRun: {
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      trace: ['heap = [1,1,2] (3 head)', 'pop 1 (list 1) → push 4; pop 1 (list 2) → push 3', 'pop 2 → push 6; pop 3 → push 4; pop 4,4,5,6 → hết'],
      output: '[1,1,2,3,4,4,5,6]',
    },
    pitfalls: ['Trộn từng cặp tuần tự O(k·N) thay vì heap O(N log k)', 'Quên bỏ qua list rỗng khi push ban đầu'],
  },
  'remove-nth-19': {
    slug: 'remove-nth-19',
    blindNo: 19,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Fast đi trước n+1 bước (từ dummy), rồi cả 2 cùng đi — slow dừng ngay trước node cần xóa.',
    checklist: [
      'dummy trước head để xóa được cả head',
      'fast đi trước n + 1 bước',
      'Cả 2 cùng đi tới khi fast null → slow trước node cần xóa',
      'slow.next = slow.next.next; return dummy.next',
    ],
    filename: 'remove-nth.ts',
    code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next;
  return dummy.next;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'head = [1,2,3,4,5], n = 2',
      trace: ['dummy→1→2→3→4→5; fast đi 3 bước tới 2', 'Cùng đi: fast 2→3→4→5→null, slow dummy→1→2→3', 'slow=3: bỏ 4 → 3→5'],
      output: '[1,2,3,5]',
    },
    pitfalls: ['Không dùng dummy → xóa head phải code riêng', 'Đi trước n bước thay vì n+1 → slow dừng đúng node cần xóa, không xóa được'],
  },
  'reorder-list-143': {
    slug: 'reorder-list-143',
    blindNo: 143,
    time: 'O(n)',
    space: 'O(1)',
    rule: '3 bước: chia đôi (slow/fast) → đảo nửa sau → đan xen 2 nửa.',
    checklist: [
      'Slow/fast tìm giữa: fast hết thì slow ở giữa',
      'Cắt đôi (slow.next = null), đảo nửa sau',
      'Đan xen: first→second→first.next...',
      'List lẻ thì node giữa thừa ra ở cuối là đúng',
    ],
    filename: 'reorder-list.ts',
    code: `function reorderList(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  let prev: ListNode | null = null;
  let curr = slow!.next;
  slow!.next = null;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let first: ListNode | null = head;
  let second: ListNode | null = prev;
  while (second !== null) {
    const t1 = first!.next;
    const t2 = second.next;
    first!.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
}`,
    highlightLines: [20],
    dryRun: {
      input: 'head = [1,2,3,4]',
      trace: ['Giữa: slow=2 (fast hết) → nửa sau [3,4]', 'Đảo nửa sau → [4,3]', 'Đan: 1→4→2→3'],
      output: '[1,4,2,3]',
    },
    pitfalls: ['Quên cắt slow.next = null → vòng lặp vô hạn khi đan', 'Đan sai thứ tự lưu next (mất node)'],
  },
  'valid-palindrome-125': {
    slug: 'valid-palindrome-125',
    blindNo: 125,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Đối xứng → 2 đầu chụm vào; ký tự lạ bỏ qua ngay tại chỗ, không cần chuỗi mới.',
    checklist: [
      'Lowercase + chỉ giữ a-z, 0-9 (regex hoặc check tay)',
      'left = 0, right = cuối; khác nhau → false ngay',
      'Bằng nhau → left++, right−−',
      'Gặp nhau/vượt nhau → true',
    ],
    filename: 'valid-palindrome.ts',
    code: `function isPalindrome(s: string): boolean {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`,
    highlightLines: [5],
    dryRun: {
      input: 's = "A man, a plan, a canal: Panama"',
      trace: ['Làm sạch → "amanaplanacanalpanama" (21 chữ)', 'l=0/a vs r=20/a khớp → vào trong', '... khớp hết tới giữa ...', 'l vượt r → true'],
      output: 'true',
    },
    pitfalls: ['Quên lowercase ("A" vs "a") hoặc quên bỏ dấu câu/khoảng trắng', 'So cả chuỗi đảo ngược tốn O(n) bộ nhớ — 2 pointers O(1) tốt hơn'],
  },
  'container-most-water-11': {
    slug: 'container-most-water-11',
    blindNo: 11,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Diện tích bị chặn bởi cột thấp → dời cột thấp, giữ cột cao (cột cao còn cơ hội với cột khác).',
    checklist: [
      'left = 0, right = cuối; area = min(h[l],h[r]) × (r−l)',
      'Giữ max từng bước',
      'h[l] < h[r] → l++, ngược lại → r−− (bằng nhau dời bên nào cũng được)',
      'Gặp nhau thì dừng',
    ],
    filename: 'container-most-water.ts',
    code: `function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'height = [1,8,6,2,5,4,8,3,7]',
      trace: ['l=0(1),r=8(7): area=1×8=8, dời l (1<7)', 'l=1(8),r=8(7): area=7×7=49 ← best, dời r (7<8)', 'l=1(8),r=7(3): area=3×6=18, dời r', '... tiếp tục chụm vào, không vượt 49 ...'],
      output: '49',
    },
    pitfalls: ['Brute force mọi cặp O(n²)', 'Dời cột cao thay vì cột thấp sẽ bỏ lỡ đáp án tối ưu'],
  },
  'three-sum-15': {
    slug: 'three-sum-15',
    blindNo: 15,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Sort trước → cố định 1 số, 2 số còn lại two-pointers; trùng thì skip để khỏi trùng bộ ba.',
    checklist: [
      'Sort tăng dần trước',
      'Vòng ngoài cố định i; nums[i] trùng nums[i−1] → skip',
      'l = i+1, r = cuối: tổng = 0 → lưu, skip trùng 2 đầu rồi chụm vào',
      'Tổng < 0 → l++, tổng > 0 → r−−',
    ],
    filename: 'three-sum.ts',
    code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'nums = [-1,0,1,2,-1,-4] → sort [-4,-1,-1,0,1,2]',
      trace: ['i=0 (−4): l=1,r=5, tổng nhỏ nhất −4−1+2<0 → không có, i++', 'i=1 (−1): l=2(−1),r=5(2): −1−1+2=0 → lưu [−1,−1,2]; skip trùng; l=3(0),r=4(1): −1+0+1=0 → lưu [−1,0,1]', 'i=2 (−1) trùng i=1 → skip; i=3 (0): tổng min >0 → hết'],
      output: '[[-1,-1,2],[-1,0,1]]',
    },
    pitfalls: ['Quên skip trùng ở cả 3 vị trí → đáp án lặp', 'Không sort mà dùng hash 3 vòng thì khó khử trùng và chậm hơn'],
  },
  'group-anagrams-49': {
    slug: 'group-anagrams-49',
    blindNo: 49,
    time: 'O(n·k log k)',
    space: 'O(n·k)',
    rule: 'Anagram chung nhau 1 “dấu vân tay” → sort chữ cái làm key, cùng key vào 1 nhóm.',
    checklist: [
      'Key = chuỗi đã sort (eat/tea/ate → aet)',
      'Map key → danh sách từ, gặp từ mới thì push vào nhóm của key nó',
      'Muốn O(n·k) thì key = tuple đếm 26 chữ thay vì sort',
      'Return các values của map, thứ tự nhóm nào cũng được',
    ],
    filename: 'group-anagrams.ts',
    code: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const w of strs) {
    const key = w.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(w);
  }
  return [...map.values()];
}`,
    highlightLines: [4],
    dryRun: {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      trace: ['eat → key aet → nhóm {aet:[eat]}', 'tea → key aet → {aet:[eat,tea]}', 'tan → key ant → {ant:[tan]}', 'ate → key aet → {aet:[eat,tea,ate]}', 'nat → key ant → {ant:[tan,nat]}', 'bat → key abt → {abt:[bat]}'],
      output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
    },
    pitfalls: ['So từng cặp chuỗi với nhau là O(n²·k)', 'Dùng chính chuỗi chưa sort làm key thì mỗi từ 1 nhóm'],
  },
  'encode-decode-strings-271': {
    slug: 'encode-decode-strings-271',
    blindNo: 271,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Chuỗi chứa ký tự bất kỳ → đừng dùng separator, dùng tiền tố độ dài: “len#str”.',
    checklist: [
      'Encode: mỗi chuỗi thành len + "#" + chuỗi, nối lại',
      'Decode: đọc số tới "#" → đó là len, cắt đúng len ký tự tiếp theo',
      'Nhảy pointer qua đoạn vừa cắt, lặp tới hết',
      'Chuỗi rỗng "" encode thành "0#" vẫn decode đúng',
    ],
    filename: 'encode-decode-strings.ts',
    code: `function encode(strs: string[]): string {
  return strs.map(s => s.length + '#' + s).join('');
}

function decode(s: string): string[] {
  const res: string[] = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== '#') j++;
    const len = Number(s.slice(i, j));
    res.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return res;
}`,
    highlightLines: [11],
    dryRun: {
      input: '["leet","code"]',
      trace: ['Encode: "leet" → "4#leet", "code" → "4#code" → "4#leet4#code"', 'Decode: i=0, đọc tới # → len=4, cắt "leet", i=6', 'i=6, đọc tới # → len=4, cắt "code", i=12 → hết'],
      output: '["leet","code"]',
    },
    pitfalls: ['Nối bằng dấu phẩy rồi split(",") sẽ vỡ khi chuỗi chứa dấu phẩy', 'Quên case chuỗi rỗng: "0#" phải decode ra [""]'],
  },
  'product-except-self-238': {
    slug: 'product-except-self-238',
    blindNo: 238,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Không được chia → đi 2 pass: trái→phải tích prefix, phải→trái nhân suffix, đáp án tái dùng làm bộ nhớ.',
    checklist: [
      'answer[0] = 1 rồi answer[i] = answer[i-1] × nums[i-1] (tích mọi số bên trái)',
      'suffix = 1 rồi duyệt ngược: answer[i] ×= suffix; suffix ×= nums[i]',
      'Không dùng mảng prefix/suffix riêng — output chính là bộ nhớ phụ',
      'Case có số 0 vẫn đúng tự nhiên, không cần if riêng',
    ],
    filename: 'product-except-self.ts',
    code: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array(n);
  answer[0] = 1;
  for (let i = 1; i < n; i++)
    answer[i] = answer[i - 1] * nums[i - 1];
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
}`,
    highlightLines: [9],
    dryRun: {
      input: 'nums = [1,2,3,4]',
      trace: ['prefix: answer = [1,1,2,6]', 'suffix=1: i=3 → answer[3]=6×1=6, suffix=4', 'i=2 → answer[2]=2×4=8, suffix=12', 'i=1 → answer[1]=1×12=12, suffix=24', 'i=0 → answer[0]=1×24=24'],
      output: '[24,12,8,6]',
    },
    pitfalls: ['Dùng phép chia sẽ sai ngay khi có số 0', 'Tạo 2 mảng prefix/suffix riêng tốn O(n) bộ nhớ phụ'],
  },
  'valid-anagram-242': {
    slug: 'valid-anagram-242',
    blindNo: 242,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'So hoán vị → đếm tần suất: cộng cho chuỗi 1, trừ cho chuỗi 2, âm là sai.',
    checklist: [
      'Dài khác nhau → false ngay, khỏi đếm',
      'Mảng đếm 26 chữ (a-z thường), +1 cho từng chữ của s',
      '−1 cho từng chữ của t, ô nào âm → false ngay',
      'Hết vòng mà không âm → true',
    ],
    filename: 'valid-anagram.ts',
    code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (const c of s) count[c.charCodeAt(0) - 97]++;
  for (const c of t) {
    if (--count[c.charCodeAt(0) - 97] < 0) return false;
  }
  return true;
}`,
    highlightLines: [6],
    dryRun: {
      input: 's = "anagram", t = "nagaram"',
      trace: ['Dài bằng nhau (7=7)', 'Đếm s: a×3, n×1, g×1, r×1, m×1', 'Trừ t: n−1, a−1, g−1, a−1, r−1, a−1, m−1 → mọi ô về 0'],
      output: 'true',
    },
    pitfalls: ['Sort 2 chuỗi O(n log n) vẫn đúng nhưng chậm hơn đếm', 'Quên check dài khác nhau trước, hoặc dùng map chữ chung chung thay vì mảng 26'],
  },
  'contains-duplicate-217': {
    slug: 'contains-duplicate-217',
    blindNo: 217,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Hỏi “đã thấy số này chưa” với mỗi phần tử → Hash Set cho đáp án O(n).',
    checklist: [
      'Gặp số đã có trong set → return true ngay',
      'Chưa có → add vào set, đi tiếp',
      'Hết mảng mà chưa true → return false',
      'Set chỉ lưu value, không cần index (khác Two Sum)',
    ],
    filename: 'contains-duplicate.ts',
    code: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [1,2,3,1]',
      trace: ['x=1: chưa có → add {1}', 'x=2: chưa có → add {1,2}', 'x=3: chưa có → add {1,2,3}', 'x=1: đã có → return true'],
      output: 'true',
    },
    pitfalls: ['2 vòng lặp so từng cặp là O(n²), timeout', 'Sort trước tuy được nhưng tốn O(n log n) và sửa mảng gốc'],
  },
  'two-sum-1': {
    slug: 'two-sum-1',
    blindNo: 1,
    time: 'O(n)',
    space: 'O(n)',
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
  'valid-parentheses-20': {
    slug: 'valid-parentheses-20',
    blindNo: 20,
    time: 'O(n)',
    space: 'O(n)',
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
  'best-time-stock-121': {
    slug: 'best-time-stock-121',
    blindNo: 121,
    time: 'O(n)',
    space: 'O(1)',
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
  'binary-search-704': {
    slug: 'binary-search-704',
    blindNo: 704,
    time: 'O(log n)',
    space: 'O(1)',
    fallbackMeta: {
      title: 'Binary Search',
      viTitle: 'Template không bao giờ sai',
      summary: 'Template lower-bound [l, r): hỏi predicate đơn điệu, thu hẹp một nửa mỗi bước. Nền tảng cho mọi bài search trong Blind75.',
      pattern: 'Binary Search',
      category: 'Binary',
      difficulty: 'Easy',
    },
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
  'lowest-common-ancestor-235': {
    slug: 'lowest-common-ancestor-235',
    blindNo: 235,
    time: 'O(h)',
    space: 'O(1)',
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
  'climbing-stairs-70': {
    slug: 'climbing-stairs-70',
    blindNo: 70,
    time: 'O(n)',
    space: 'O(1)',
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
};

export const getGuide = (slug: string): Guide | undefined => GUIDES[slug];
export const guideCount = Object.keys(GUIDES).length;
