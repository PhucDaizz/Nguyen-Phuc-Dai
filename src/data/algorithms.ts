export interface AlgorithmPost {
  slug: string;
  title: string;
  summary: string;
  category: 'Sorting' | 'Searching' | 'Graph' | 'Dynamic Programming' | 'Data Structure' | 'Big-O';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readMinutes: number;
  date: string;
  tags: string[];
  complexity: { time: string; space: string };
  content: string[];
  code?: { language: string; snippet: string };
}

export const ALGORITHM_POSTS: AlgorithmPost[] = [
  {
    slug: 'big-o-notation-co-ban',
    title: 'Big-O Notation: Nền tảng phân tích thuật toán',
    summary: 'Hiểu O(1), O(log n), O(n), O(n log n), O(n²) và cách ước lượng độ phức tạp khi phỏng vấn.',
    category: 'Big-O',
    difficulty: 'Beginner',
    readMinutes: 8,
    date: '2026-09-18',
    tags: ['Big-O', 'Complexity', 'Interview'],
    complexity: { time: 'O(1) → O(n²)', space: 'O(1)' },
    content: [
      'Big-O mô tả độ tăng trưởng của thời gian chạy khi input n tăng lên. Ta chỉ quan tâm term tăng nhanh nhất, bỏ hằng số.',
      'Ví dụ: vòng lặp lồng nhau 2 tầng duyệt mảng n phần tử là O(n²). Binary search chia đôi mỗi bước là O(log n).',
      'Quy tắc thực hành: đếm vòng lặp, đệ quy (Master Theorem), và thao tác tốn kém nhất (sort, hash, I/O).',
    ],
    code: {
      language: 'typescript',
      snippet: `// O(n): duyệt 1 lần\nfunction sum(arr: number[]): number {\n  let s = 0;\n  for (const x of arr) s += x;\n  return s;\n}\n\n// O(n^2): cặp đôi\nfunction hasDuplicate(arr: number[]): boolean {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = i + 1; j < arr.length; j++)\n      if (arr[i] === arr[j]) return true;\n  return false;\n}`,
    },
  },
  {
    slug: 'sorting-quick-sort-vs-merge-sort',
    title: 'Quick Sort vs Merge Sort: Khi nào dùng cái nào?',
    summary: 'So sánh chiến lược divide-and-conquer, độ ổn định, bộ nhớ và case xấu nhất.',
    category: 'Sorting',
    difficulty: 'Intermediate',
    readMinutes: 12,
    date: '2026-09-18',
    tags: ['Sorting', 'QuickSort', 'MergeSort'],
    complexity: { time: 'O(n log n) avg', space: 'O(log n) / O(n)' },
    content: [
      'Merge Sort luôn O(n log n), ổn định (stable), nhưng tốn O(n) bộ nhớ phụ. Phù hợp linked-list và sort cần ổn định.',
      'Quick Sort trung bình O(n log n), in-place O(log n) stack, nhanh thực tế nhờ cache-locality. Worst-case O(n²) nếu pivot tệ — khắc phục bằng random pivot / 3-way.',
      'Trong JS, Array.prototype.sort dùng TimSort biến thể ( lai Merge + Insertion).',
    ],
    code: {
      language: 'typescript',
      snippet: `function quickSort(a: number[], l = 0, r = a.length - 1): void {\n  if (l >= r) return;\n  const p = partition(a, l, r);\n  quickSort(a, l, p - 1);\n  quickSort(a, p + 1, r);\n}\nfunction partition(a: number[], l: number, r: number): number {\n  const pivot = a[r];\n  let i = l;\n  for (let j = l; j < r; j++)\n    if (a[j] < pivot) [a[i], a[j]] = [a[j], a[i]], i++;\n  [a[i], a[r]] = [a[r], a[i]];\n  return i;\n}`,
    },
  },
  {
    slug: 'binary-search-template',
    title: 'Binary Search: Template “không bao giờ sai”',
    summary: 'Một template lower-bound duy nhất để giải mọi bài search trên mảng sorted và answer-space.',
    category: 'Searching',
    difficulty: 'Beginner',
    readMinutes: 10,
    date: '2026-09-18',
    tags: ['BinarySearch', 'Template'],
    complexity: { time: 'O(log n)', space: 'O(1)' },
    content: [
      'Tư duy: tìm biên trái nhất thỏa mãn predicate P(x) đơn điệu (false...false true...true).',
      'Template [l, r): while (l < r) { m = (l+r)>>1; if (P(m)) r = m; else l = m+1; } — không bao giờ loop vô hạn.',
      'Mở rộng: search answer (Koko eating bananas, ship packages), rotated array, peak element.',
    ],
    code: {
      language: 'typescript',
      snippet: `function lowerBound(a: number[], target: number): number {\n  let l = 0, r = a.length;\n  while (l < r) {\n    const m = (l + r) >> 1;\n    if (a[m] >= target) r = m;\n    else l = m + 1;\n  }\n  return l;\n}`,
    },
  },
  {
    slug: 'graph-bfs-dfs-shortest-path',
    title: 'Graph: BFS, DFS và đường đi ngắn nhất',
    summary: 'Khi nào dùng BFS vs DFS, Dijkstra vs Bellman-Ford, và cách lưu đồ thị.',
    category: 'Graph',
    difficulty: 'Intermediate',
    readMinutes: 14,
    date: '2026-09-18',
    tags: ['Graph', 'BFS', 'DFS', 'Dijkstra'],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    content: [
      'BFS (queue) cho shortest path trên unweighted graph. DFS (stack/recursion) cho topological sort, connected components, cycle detection.',
      'Cạnh có trọng số không âm → Dijkstra O((V+E) log V). Cạnh âm → Bellman-Ford O(VE), phát hiện chu trình âm.',
      'Lưu đồ thị: adjacency list cho sparse graph (hầu hết interview), matrix cho dense / Floyd-Warshall.',
    ],
    code: {
      language: 'typescript',
      snippet: `function bfs(n: number, adj: number[][], s: number): number[] {\n  const dist = Array(n).fill(-1);\n  const q: number[] = [s];\n  dist[s] = 0;\n  while (q.length) {\n    const u = q.shift()!;\n    for (const v of adj[u])\n      if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }\n  }\n  return dist;\n}`,
    },
  },
  {
    slug: 'dynamic-programming-nhap-mon',
    title: 'Dynamic Programming: Từ Fibonacci tới Knapsack',
    summary: 'Nhận diện bài DP qua overlapping subproblems + optimal substructure, memo vs tabulation.',
    category: 'Dynamic Programming',
    difficulty: 'Advanced',
    readMinutes: 15,
    date: '2026-09-18',
    tags: ['DP', 'Memoization', 'Knapsack'],
    complexity: { time: 'O(n·W)', space: 'O(W)' },
    content: [
      'Hỏi 2 câu: bài toán có chia thành subproblem trùng lặp không? Nghiệm tối ưu có ghép từ nghiệm subproblem không?',
      'Lộ trình: recursion → memo (top-down) → tabulation (bottom-up) → tối ưu không gian (rolling array).',
      'Patterns: 0/1 Knapsack, LIS, LCS, Coin Change, House Robber, DP trên grid.',
    ],
    code: {
      language: 'typescript',
      snippet: `// 0/1 Knapsack — O(n*W) time, O(W) space\nfunction knapsack(w: number[], v: number[], W: number): number {\n  const dp = Array(W + 1).fill(0);\n  for (let i = 0; i < w.length; i++)\n    for (let c = W; c >= w[i]; c--)\n      dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);\n  return dp[W];\n}`,
    },
  },
];

export const getPostBySlug = (slug: string) =>
  ALGORITHM_POSTS.find((p) => p.slug === slug);
