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
