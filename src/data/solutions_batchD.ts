// Batch D — solutions đa ngôn ngữ + trace line map cho 12 bài heap/graphs.
// Quy ước như solutions.ts (mẫu two-sum-1 + TWOSUM_LINE_MAP).
// File này sẽ được gộp vào solutions.ts sau; visualizer import map từ '../../../data/solutions'.

import type { LineMap, SolutionLang } from './solutions';

export const BATCHD_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'top-k-frequent-347': {
    ts: `function topKFrequent(nums: number[], k: number): number[] {
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
    csharp: `public int[] TopKFrequent(int[] nums, int k) {
    var freq = new Dictionary<int, int>();
    foreach (int x in nums) freq[x] = freq.GetValueOrDefault(x) + 1;
    var bucket = new List<int>[nums.Length + 1];
    for (int i = 0; i < bucket.Length; i++) bucket[i] = new();
    foreach (var (val, c) in freq) bucket[c].Add(val);
    var res = new List<int>();
    for (int f = nums.Length; f >= 1 && res.Count < k; f--)
        res.AddRange(bucket[f]);
    return res.ToArray();
}`,
    python: `def top_k_frequent(nums, k):
    freq = {}
    for x in nums:
        freq[x] = freq.get(x, 0) + 1
    bucket = [[] for _ in range(len(nums) + 1)]
    for val, count in freq.items():
        bucket[count].append(val)
    res = []
    for f in range(len(nums), 0, -1):
        if len(res) >= k:
            break
        res.extend(bucket[f])
    return res`,
    java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        List<Integer>[] bucket = new List[nums.length + 1];
        for (int i = 0; i < bucket.length; i++) bucket[i] = new ArrayList<>();
        for (var e : freq.entrySet()) bucket[e.getValue()].add(e.getKey());
        List<Integer> res = new ArrayList<>();
        for (int f = nums.length; f >= 1 && res.size() < k; f--)
            res.addAll(bucket[f]);
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}`,
    cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int x : nums) freq[x]++;
        vector<vector<int>> bucket(nums.size() + 1);
        for (auto& [val, c] : freq) bucket[c].push_back(val);
        vector<int> res;
        for (int f = (int)nums.size(); f >= 1 && (int)res.size() < k; f--)
            res.insert(res.end(), bucket[f].begin(), bucket[f].end());
        return res;
    }
};`,
    js: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
  const bucket = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) bucket[count].push(val);
  const res = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    res.push(...bucket[f]);
  }
  return res;
}`,
  },
  'find-median-295': {
    ts: `class Heap {
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
    csharp: `public class MedianFinder {
    private readonly PriorityQueue<int, int> lo; // max-heap: priority = -val
    private readonly PriorityQueue<int, int> hi; // min-heap
    public MedianFinder() {
        lo = new PriorityQueue<int, int>();
        hi = new PriorityQueue<int, int>();
    }
    public void AddNum(int x) {
        lo.Enqueue(x, -x);
        hi.Enqueue(lo.Peek(), lo.Dequeue());
        if (lo.Count < hi.Count)
            lo.Enqueue(hi.Peek(), -hi.Dequeue());
    }
    public double FindMedian() {
        if (lo.Count > hi.Count) return lo.Peek();
        return (lo.Peek() + hi.Peek()) / 2.0;
    }
}`,
    python: `import heapq


class MedianFinder:
    def __init__(self):
        self.lo = []
        self.hi = []

    def add_num(self, x):
        heapq.heappush(self.lo, -x)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.lo) < len(self.hi):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def find_median(self):
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2`,
    java: `class MedianFinder {
    private PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> hi = new PriorityQueue<>();

    public void addNum(int x) {
        lo.offer(x);
        hi.offer(lo.poll());
        if (lo.size() < hi.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();
        return (lo.peek() + hi.peek()) / 2.0;
    }
}`,
    cpp: `class MedianFinder {
public:
    priority_queue<int> lo;
    priority_queue<int, vector<int>, greater<int>> hi;

    void addNum(int x) {
        lo.push(x);
        hi.push(lo.top()); lo.pop();
        if (lo.size() < hi.size()) { lo.push(hi.top()); hi.pop(); }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};`,
    js: `class Heap {
  constructor(less) { this.a = []; this.less = less; }
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[i], a[p])) { const t = a[i]; a[i] = a[p]; a[p] = t; i = p; }
      else break;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        const t = a[i]; a[i] = a[m]; a[m] = t;
        i = m;
      }
    }
    return top;
  }
}

class MedianFinder {
  constructor() {
    this.lo = new Heap((x, y) => x > y);
    this.hi = new Heap((x, y) => x < y);
  }
  addNum(x) {
    this.lo.push(x);
    this.hi.push(this.lo.pop());
    if (this.lo.size < this.hi.size) this.lo.push(this.hi.pop());
  }
  findMedian() {
    if (this.lo.size > this.hi.size) return this.lo.top;
    return (this.lo.top + this.hi.top) / 2;
  }
}`,
  },
  'combination-sum-39': {
    ts: `function combinationSum(candidates: number[], target: number): number[][] {
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
    csharp: `public IList<IList<int>> CombinationSum(int[] candidates, int target) {
    var res = new List<IList<int>>();
    void Dfs(int i, List<int> cur, int sum) {
        if (sum == target) { res.Add(new List<int>(cur)); return; }
        if (sum > target || i >= candidates.Length) return;
        cur.Add(candidates[i]);
        Dfs(i, cur, sum + candidates[i]);
        cur.RemoveAt(cur.Count - 1);
        Dfs(i + 1, cur, sum);
    }
    Dfs(0, new List<int>(), 0);
    return res;
}`,
    python: `def combination_sum(candidates, target):
    res = []
    def dfs(i, cur, sum):
        if sum == target:
            res.append(list(cur))
            return
        if sum > target or i >= len(candidates):
            return
        cur.append(candidates[i])
        dfs(i, cur, sum + candidates[i])
        cur.pop()
        dfs(i + 1, cur, sum)
    dfs(0, [], 0)
    return res`,
    java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(0, new ArrayList<>(), 0, candidates, target, res);
        return res;
    }
    private void dfs(int i, List<Integer> cur, int sum, int[] candidates, int target, List<List<Integer>> res) {
        if (sum == target) {
            res.add(new ArrayList<>(cur));
            return;
        }
        if (sum > target || i >= candidates.length) return;
        cur.add(candidates[i]);
        dfs(i, cur, sum + candidates[i], candidates, target, res);
        cur.remove(cur.size() - 1);
        dfs(i + 1, cur, sum, candidates, target, res);
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> res;
        vector<int> cur;
        dfs(0, cur, 0, candidates, target, res);
        return res;
    }
    void dfs(int i, vector<int>& cur, int sum, vector<int>& candidates, int target, vector<vector<int>>& res) {
        if (sum == target) {
            res.push_back(cur);
            return;
        }
        if (sum > target || i == (int)candidates.size()) return;
        cur.push_back(candidates[i]);
        dfs(i, cur, sum + candidates[i], candidates, target, res);
        cur.pop_back();
        dfs(i + 1, cur, sum, candidates, target, res);
    }
};`,
    js: `function combinationSum(candidates, target) {
  const res = [];
  const dfs = (i, cur, sum) => {
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
  },
  'word-search-79': {
    ts: `function exist(board: string[][], word: string): boolean {
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
    csharp: `public bool Exist(char[][] board, string word) {
    int R = board.Length, C = board[0].Length;
    bool Dfs(int r, int c, int k) {
        if (k == word.Length) return true;
        if (r < 0 || c < 0 || r >= R || c >= C) return false;
        if (board[r][c] != word[k]) return false;
        char tmp = board[r][c];
        board[r][c] = '#';
        bool found = Dfs(r+1,c,k+1) || Dfs(r-1,c,k+1)
                   || Dfs(r,c+1,k+1) || Dfs(r,c-1,k+1);
        board[r][c] = tmp;
        return found;
    }
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++)
            if (board[r][c] == word[0] && Dfs(r, c, 0)) return true;
    return false;
}`,
    python: `def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or c < 0 or r >= R or c >= C:
            return False
        if board[r][c] != word[k]:
            return False
        tmp = board[r][c]
        board[r][c] = '#'
        found = (dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1)
                 or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1))
        board[r][c] = tmp
        return found
    for r in range(R):
        for c in range(C):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    return False`,
    java: `class Solution {
    public boolean exist(char[][] board, String word) {
        int R = board.length, C = board[0].length;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (board[r][c] == word.charAt(0) && dfs(board, word, r, c, 0)) return true;
        return false;
    }
    private boolean dfs(char[][] board, String word, int r, int c, int k) {
        if (k == word.length()) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(k)) return false;
        char tmp = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
                || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
        board[r][c] = tmp;
        return found;
    }
}`,
    cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string& word) {
        int R = board.size(), C = board[0].size();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (board[r][c] == word[0] && dfs(board, word, r, c, 0)) return true;
        return false;
    }
    bool dfs(vector<vector<char>>& board, string& word, int r, int c, int k) {
        if (k == (int)word.size()) return true;
        if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return false;
        if (board[r][c] != word[k]) return false;
        char tmp = board[r][c];
        board[r][c] = '#';
        bool found = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
                || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
        board[r][c] = tmp;
        return found;
    }
};`,
    js: `function exist(board, word) {
  const R = board.length, C = board[0].length;
  const dfs = (r, c, k) => {
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
  },
  'clone-graph-133': {
    ts: `function cloneGraph(node: GraphNode | null): GraphNode | null {
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
    csharp: `public Node CloneGraph(Node node) {
    var seen = new Dictionary<Node, Node>();
    Node Dfs(Node n) {
        if (seen.ContainsKey(n)) return seen[n];
        var copy = new Node(n.val);
        seen[n] = copy;
        foreach (var nb in n.neighbors)
            copy.neighbors.Add(Dfs(nb));
        return copy;
    }
    return node == null ? null : Dfs(node);
}`,
    python: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def clone_graph(node):
    seen = {}
    def dfs(n):
        if n in seen:
            return seen[n]
        copy = Node(n.val)
        seen[n] = copy
        for nb in n.neighbors:
            copy.neighbors.append(dfs(nb))
        return copy
    return None if node is None else dfs(node)`,
    java: `class Node {
    public int val;
    public List<Node> neighbors = new ArrayList<>();
    public Node(int val) { this.val = val; }
}


class Solution {
    public Node cloneGraph(Node node) {
        Map<Node, Node> seen = new HashMap<>();
        return node == null ? null : dfs(node, seen);
    }
    private Node dfs(Node n, Map<Node, Node> seen) {
        if (seen.containsKey(n)) return seen.get(n);
        Node copy = new Node(n.val);
        seen.put(n, copy);
        for (Node nb : n.neighbors) copy.neighbors.add(dfs(nb, seen));
        return copy;
    }
}`,
    cpp: `struct Node {
    int val;
    vector<Node*> neighbors;
    Node(int v) : val(v) {}
};


class Solution {
public:
    Node* cloneGraph(Node* node) {
        unordered_map<Node*, Node*> seen;
        return node == nullptr ? nullptr : dfs(node, seen);
    }
    Node* dfs(Node* n, unordered_map<Node*, Node*>& seen) {
        if (seen.count(n)) return seen[n];
        Node* copy = new Node(n->val);
        seen[n] = copy;
        for (Node* nb : n->neighbors) copy->neighbors.push_back(dfs(nb, seen));
        return copy;
    }
};`,
    js: `function cloneGraph(node) {
  const seen = new Map();
  const dfs = (n) => {
    if (seen.has(n)) return seen.get(n);
    const copy = { val: n.val, neighbors: [] };
    seen.set(n, copy);
    for (const nb of n.neighbors) {
      copy.neighbors.push(dfs(nb));
    }
    return copy;
  };
  return node === null ? null : dfs(node);
}`,
  },
  'course-schedule-207': {
    ts: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
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
    csharp: `public bool CanFinish(int n, int[][] pre) {
    var adj = new List<int>[n];
    for (int i = 0; i < n; i++) adj[i] = new();
    var indeg = new int[n];
    foreach (var (a, b) in pre.Select(p => (p[0], p[1]))) {
        adj[b].Add(a);
        indeg[a]++;
    }
    var q = new Queue<int>();
    for (int i = 0; i < n; i++)
        if (indeg[i] == 0) q.Enqueue(i);
    int taken = 0;
    while (q.Count > 0) {
        int u = q.Dequeue();
        taken++;
        foreach (int v in adj[u])
            if (--indeg[v] == 0) q.Enqueue(v);
    }
    return taken == n;
}`,
    python: `def can_finish(num_courses, prerequisites):
    adj = [[] for _ in range(num_courses)]
    indeg = [0] * num_courses
    for a, b in prerequisites:
        adj[b].append(a)
        indeg[a] += 1
    queue = [i for i in range(num_courses) if indeg[i] == 0]
    taken = 0
    while queue:
        u = queue.pop(0)
        taken += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)
    return taken == num_courses`,
    java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<Integer>[] adj = new List[numCourses];
        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            adj[p[1]].add(p[0]);
            indeg[p[0]]++;
        }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++)
            if (indeg[i] == 0) q.offer(i);
        int taken = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            taken++;
            for (int v : adj[u])
                if (--indeg[v] == 0) q.offer(v);
        }
        return taken == numCourses;
    }
}`,
    cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indeg(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indeg[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++)
            if (indeg[i] == 0) q.push(i);
        int taken = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            taken++;
            for (int v : adj[u])
                if (--indeg[v] == 0) q.push(v);
        }
        return taken == numCourses;
    }
};`,
    js: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let taken = 0;
  while (queue.length > 0) {
    const u = queue.shift();
    taken++;
    for (const v of adj[u]) {
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  return taken === numCourses;
}`,
  },
  'pacific-atlantic-417': {
    ts: `function pacificAtlantic(heights: number[][]): number[][] {
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
    csharp: `public IList<IList<int>> PacificAtlantic(int[][] h) {
    int R = h.Length, C = h[0].Length;
    var pac = new HashSet<string>();
    var atl = new HashSet<string>();
    void Dfs(int r, int c, HashSet<string> seen, int prev) {
        if (r < 0 || c < 0 || r >= R || c >= C) return;
        string k = r + "," + c;
        if (seen.Contains(k) || h[r][c] < prev) return;
        seen.Add(k);
        Dfs(r+1, c, seen, h[r][c]);
        Dfs(r-1, c, seen, h[r][c]);
        Dfs(r, c+1, seen, h[r][c]);
        Dfs(r, c-1, seen, h[r][c]);
    }
    for (int c = 0; c < C; c++) {
        Dfs(0, c, pac, h[0][c]);
        Dfs(R-1, c, atl, h[R-1][c]);
    }
    for (int r = 0; r < R; r++) {
        Dfs(r, 0, pac, h[r][0]);
        Dfs(r, C-1, atl, h[r][C-1]);
    }
    var res = new List<IList<int>>();
    foreach (var k in pac)
        if (atl.Contains(k)) {
            var p = k.Split(",");
            res.Add(new List<int> { int.Parse(p[0]), int.Parse(p[1]) });
        }
    return res;
}`,
    python: `def pacific_atlantic(heights):
    R, C = len(heights), len(heights[0])
    pac, atl = set(), set()
    def dfs(r, c, seen, prev):
        if r < 0 or c < 0 or r >= R or c >= C:
            return
        key = (r, c)
        if key in seen or heights[r][c] < prev:
            return
        seen.add(key)
        dfs(r + 1, c, seen, heights[r][c])
        dfs(r - 1, c, seen, heights[r][c])
        dfs(r, c + 1, seen, heights[r][c])
        dfs(r, c - 1, seen, heights[r][c])
    for c in range(C):
        dfs(0, c, pac, heights[0][c])
        dfs(R - 1, c, atl, heights[R - 1][c])
    for r in range(R):
        dfs(r, 0, pac, heights[r][0])
        dfs(r, C - 1, atl, heights[r][C - 1])
    return [[r, c] for r, c in pac if (r, c) in atl]`,
    java: `class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int R = heights.length, C = heights[0].length;
        Set<String> pac = new HashSet<>(), atl = new HashSet<>();
        for (int c = 0; c < C; c++) {
            dfs(heights, 0, c, pac, heights[0][c]);
            dfs(heights, R - 1, c, atl, heights[R - 1][c]);
        }
        for (int r = 0; r < R; r++) {
            dfs(heights, r, 0, pac, heights[r][0]);
            dfs(heights, r, C - 1, atl, heights[r][C - 1]);
        }
        List<List<Integer>> res = new ArrayList<>();
        for (String k : pac)
            if (atl.contains(k)) {
                String[] p = k.split(",");
                res.add(List.of(Integer.parseInt(p[0]), Integer.parseInt(p[1])));
            }
        return res;
    }
    private void dfs(int[][] h, int r, int c, Set<String> seen, int prev) {
        if (r < 0 || c < 0 || r >= h.length || c >= h[0].length) return;
        String k = r + "," + c;
        if (seen.contains(k) || h[r][c] < prev) return;
        seen.add(k);
        dfs(h, r + 1, c, seen, h[r][c]);
        dfs(h, r - 1, c, seen, h[r][c]);
        dfs(h, r, c + 1, seen, h[r][c]);
        dfs(h, r, c - 1, seen, h[r][c]);
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int R = heights.size(), C = heights[0].size();
        set<pair<int,int>> pac, atl;
        for (int c = 0; c < C; c++) {
            dfs(heights, 0, c, pac, heights[0][c]);
            dfs(heights, R - 1, c, atl, heights[R - 1][c]);
        }
        for (int r = 0; r < R; r++) {
            dfs(heights, r, 0, pac, heights[r][0]);
            dfs(heights, r, C - 1, atl, heights[r][C - 1]);
        }
        vector<vector<int>> res;
        for (auto& k : pac)
            if (atl.count(k)) res.push_back({k.first, k.second});
        return res;
    }
    void dfs(vector<vector<int>>& h, int r, int c, set<pair<int,int>>& seen, int prev) {
        if (r < 0 || c < 0 || r >= (int)h.size() || c >= (int)h[0].size()) return;
        if (seen.count({r, c}) || h[r][c] < prev) return;
        seen.insert({r, c});
        dfs(h, r + 1, c, seen, h[r][c]);
        dfs(h, r - 1, c, seen, h[r][c]);
        dfs(h, r, c + 1, seen, h[r][c]);
        dfs(h, r, c - 1, seen, h[r][c]);
    }
};`,
    js: `function pacificAtlantic(heights) {
  const R = heights.length, C = heights[0].length;
  const pac = new Set();
  const atl = new Set();
  const dfs = (r, c, seen, prev) => {
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
  const res = [];
  pac.forEach((key) => {
    if (atl.has(key)) {
      const [r, c] = key.split(',').map(Number);
      res.push([r, c]);
    }
  });
  return res;
}`,
  },
  'number-of-islands-200': {
    ts: `function numIslands(grid: string[][]): number {
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
    csharp: `public int NumIslands(char[][] grid) {
    int R = grid.Length, C = grid[0].Length;
    int count = 0;
    void Sink(int r, int c) {
        if (r < 0 || c < 0 || r >= R || c >= C) return;
        if (grid[r][c] != '1') return;
        grid[r][c] = '0';
        Sink(r+1, c);
        Sink(r-1, c);
        Sink(r, c+1);
        Sink(r, c-1);
    }
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++)
            if (grid[r][c] == '1') {
                count++;
                Sink(r, c);
            }
    return count;
}`,
    python: `def num_islands(grid):
    R, C = len(grid), len(grid[0])
    count = 0
    def sink(r, c):
        if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count`,
    java: `class Solution {
    public int numIslands(char[][] grid) {
        int R = grid.length, C = grid[0].length;
        int count = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
        return count;
    }
    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
        if (grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}`,
    cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int R = grid.size(), C = grid[0].size();
        int count = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
        return count;
    }
    void sink(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= (int)grid.size() || c >= (int)grid[0].size()) return;
        if (grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
};`,
    js: `function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  let count = 0;
  const sink = (r, c) => {
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
  },
  'longest-consecutive-128': {
    ts: `function longestConsecutive(nums: number[]): number {
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
    csharp: `public int LongestConsecutive(int[] nums) {
    var set = new HashSet<int>(nums);
    int best = 0;
    foreach (int x in set) {
        if (set.Contains(x - 1)) continue;
        int cur = x, len = 1;
        while (set.Contains(cur + 1)) { cur++; len++; }
        best = Math.Max(best, len);
    }
    return best;
}`,
    python: `def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:
            continue
        cur, length = x, 1
        while cur + 1 in s:
            cur += 1
            length += 1
        best = max(best, length)
    return best`,
    java: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) {
            if (s.contains(x - 1)) continue;
            int cur = x, len = 1;
            while (s.contains(cur + 1)) { cur++; len++; }
            best = Math.max(best, len);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int best = 0;
        for (int x : s) {
            if (s.count(x - 1)) continue;
            int cur = x, len = 1;
            while (s.count(cur + 1)) { cur++; len++; }
            best = max(best, len);
        }
        return best;
    }
};`,
    js: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let cur = x;
    let len = 1;
    while (set.has(cur + 1)) {
      cur++;
      len++;
    }
    best = Math.max(best, len);
  }
  return best;
}`,
  },
  'alien-dict-269': {
    ts: `function alienOrder(words: string[]): string {
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
    csharp: `public string AlienOrder(string[] words) {
    var adj = new Dictionary<char, HashSet<char>>();
    var indeg = new Dictionary<char, int>();
    foreach (var w in words)
        foreach (char c in w) {
            adj.TryAdd(c, new());
            indeg.TryAdd(c, 0);
        }
    for (int i = 0; i < words.Length - 1; i++) {
        string a = words[i], b = words[i+1];
        if (a.Length > b.Length && a.StartsWith(b)) return "";
        int m = Math.Min(a.Length, b.Length);
        for (int k = 0; k < m; k++)
            if (a[k] != b[k]) {
                if (adj[a[k]].Add(b[k]))
                    indeg[b[k]]++;
                break;
            }
    }
    var q = new Queue<char>(indeg.Where(p => p.Value == 0).Select(p => p.Key));
    var res = new System.Text.StringBuilder();
    while (q.Count > 0) {
        char u = q.Dequeue();
        res.Append(u);
        foreach (char v in adj[u])
            if (--indeg[v] == 0) q.Enqueue(v);
    }
    return res.Length == indeg.Count ? res.ToString() : "";
}`,
    python: `def alien_order(words):
    adj = {}
    indeg = {}
    for w in words:
        for c in w:
            adj.setdefault(c, set())
            indeg.setdefault(c, 0)
    for i in range(len(words) - 1):
        a, b = words[i], words[i + 1]
        if len(a) > len(b) and a.startswith(b):
            return ''
        m = min(len(a), len(b))
        for k in range(m):
            if a[k] != b[k]:
                if b[k] not in adj[a[k]]:
                    adj[a[k]].add(b[k])
                    indeg[b[k]] += 1
                break
    queue = [c for c, d in indeg.items() if d == 0]
    res = []
    while queue:
        u = queue.pop(0)
        res.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)
    return ''.join(res) if len(res) == len(indeg) else ''`,
    java: `class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> indeg = new HashMap<>();
        for (String w : words)
            for (char c : w.toCharArray()) {
                adj.putIfAbsent(c, new HashSet<>());
                indeg.putIfAbsent(c, 0);
            }
        for (int i = 0; i < words.length - 1; i++) {
            String a = words[i], b = words[i + 1];
            if (a.length() > b.length() && a.startsWith(b)) return "";
            int m = Math.min(a.length(), b.length());
            for (int k = 0; k < m; k++)
                if (a.charAt(k) != b.charAt(k)) {
                    if (adj.get(a.charAt(k)).add(b.charAt(k)))
                        indeg.put(b.charAt(k), indeg.get(b.charAt(k)) + 1);
                    break;
                }
        }
        Queue<Character> q = new ArrayDeque<>();
        for (var e : indeg.entrySet()) if (e.getValue() == 0) q.offer(e.getKey());
        StringBuilder res = new StringBuilder();
        while (!q.isEmpty()) {
            char u = q.poll();
            res.append(u);
            for (char v : adj.get(u))
                if (indeg.merge(v, -1, Integer::sum) == 0) q.offer(v);
        }
        return res.length() == indeg.size() ? res.toString() : "";
    }
}`,
    cpp: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        map<char, set<char>> adj;
        map<char, int> indeg;
        for (auto& w : words)
            for (char c : w) {
                adj.try_emplace(c);
                indeg.try_emplace(c, 0);
            }
        for (int i = 0; i + 1 < (int)words.size(); i++) {
            string& a = words[i];
            string& b = words[i + 1];
            if (a.size() > b.size() && a.compare(0, b.size(), b) == 0) return "";
            int m = min(a.size(), b.size());
            for (int k = 0; k < m; k++)
                if (a[k] != b[k]) {
                    if (adj[a[k]].insert(b[k]).second) indeg[b[k]]++;
                    break;
                }
        }
        queue<char> q;
        for (auto& [c, d] : indeg) if (d == 0) q.push(c);
        string res;
        while (!q.empty()) {
            char u = q.front(); q.pop();
            res.push_back(u);
            for (char v : adj[u])
                if (--indeg[v] == 0) q.push(v);
        }
        return (int)res.size() == (int)indeg.size() ? res : "";
    }
};`,
    js: `function alienOrder(words) {
  const adj = new Map();
  const indeg = new Map();
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
        if (!adj.get(a[k]).has(b[k])) {
          adj.get(a[k]).add(b[k]);
          indeg.set(b[k], indeg.get(b[k]) + 1);
        }
        break;
      }
    }
  }
  const queue = [];
  indeg.forEach((d, c) => { if (d === 0) queue.push(c); });
  const res = [];
  while (queue.length > 0) {
    const u = queue.shift();
    res.push(u);
    for (const v of adj.get(u)) {
      indeg.set(v, indeg.get(v) - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  return res.length === indeg.size ? res.join('') : '';
}`,
  },
  'valid-tree-261': {
    ts: `function validTree(n: number, edges: number[][]): boolean {
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
    csharp: `public bool ValidTree(int n, int[][] edges) {
    if (edges.Length != n - 1) return false;
    var parent = Enumerable.Range(0, n).ToArray();
    int Find(int x) => parent[x] == x ? x : (parent[x] = Find(parent[x]));
    foreach (var (a, b) in edges.Select(e => (e[0], e[1]))) {
        if (Find(a) == Find(b)) return false;
        parent[Find(a)] = Find(b);
    }
    return true;
}`,
    python: `def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for a, b in edges:
        if find(a) == find(b):
            return False
        parent[find(a)] = find(b)
    return True`,
    java: `class Solution {
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) {
            if (find(parent, e[0]) == find(parent, e[1])) return false;
            parent[find(parent, e[0])] = find(parent, e[1]);
        }
        return true;
    }
    private int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }
}`,
    cpp: `class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        function<int(int)> find = [&](int x) {
            return parent[x] == x ? x : parent[x] = find(parent[x]);
        };
        for (auto& e : edges) {
            if (find(e[0]) == find(e[1])) return false;
            parent[find(e[0])] = find(e[1]);
        }
        return true;
    }
};`,
    js: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    if (find(a) === find(b)) return false;
    parent[find(a)] = find(b);
  }
  return true;
}`,
  },
  'connected-components-323': {
    ts: `function countComponents(n: number, edges: number[][]): number {
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
    csharp: `public int CountComponents(int n, int[][] edges) {
    var parent = Enumerable.Range(0, n).ToArray();
    int Find(int x) => parent[x] == x ? x : (parent[x] = Find(parent[x]));
    foreach (var (a, b) in edges.Select(e => (e[0], e[1])))
        parent[Find(a)] = Find(b);
    return new HashSet<int>(Enumerable.Range(0, n).Select(Find)).Count;
}`,
    python: `def count_components(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for a, b in edges:
        parent[find(a)] = find(b)
    return len(set(find(i) for i in range(n)))`,
    java: `class Solution {
    public int countComponents(int n, int[][] edges) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges)
            parent[find(parent, e[0])] = find(parent, e[1]);
        Set<Integer> roots = new HashSet<>();
        for (int i = 0; i < n; i++) roots.add(find(parent, i));
        return roots.size();
    }
    private int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }
}`,
    cpp: `class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        function<int(int)> find = [&](int x) {
            return parent[x] == x ? x : parent[x] = find(parent[x]);
        };
        for (auto& e : edges)
            parent[find(e[0])] = find(e[1]);
        set<int> roots;
        for (int i = 0; i < n; i++) roots.insert(find(i));
        return roots.size();
    }
};`,
    js: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    parent[find(a)] = find(b);
  }
  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}`,
  },
};

export const TOPK_LINE_MAP: LineMap<'init' | 'count' | 'bucket' | 'take' | 'done'> = {
  csharp: { init: 1, count: 2, bucket: 4, take: 7, done: 7 },
  ts: { init: 1, count: 2, bucket: 4, take: 7, done: 9 },
  python: { init: 1, count: 2, bucket: 5, take: 11, done: 12 },
  java: { init: 2, count: 3, bucket: 6, take: 9, done: 10 },
  cpp: { init: 3, count: 4, bucket: 6, take: 9, done: 10 },
  js: { init: 1, count: 2, bucket: 4, take: 7, done: 9 },
};

export const MEDIAN_LINE_MAP: LineMap<'init' | 'add' | 'median' | 'done'> = {
  csharp: { init: 7, add: 8, median: 14, done: 14 },
  ts: { init: 40, add: 41, median: 47, done: 47 },
  python: { init: 8, add: 9, median: 15, done: 15 },
  java: { init: 4, add: 5, median: 11, done: 11 },
  cpp: { init: 5, add: 6, median: 12, done: 12 },
  js: { init: 40, add: 41, median: 46, done: 46 },
};

export const COMBO_LINE_MAP: LineMap<'init' | 'take' | 'skip' | 'save' | 'cut' | 'done'> = {
  csharp: { init: 2, take: 6, skip: 8, save: 3, cut: 4, done: 11 },
  ts: { init: 2, take: 9, skip: 11, save: 4, cut: 7, done: 14 },
  python: { init: 2, take: 9, skip: 11, save: 4, cut: 6, done: 13 },
  java: { init: 6, take: 13, skip: 15, save: 8, cut: 11, done: 4 },
  cpp: { init: 8, take: 15, skip: 17, save: 10, cut: 13, done: 6 },
  js: { init: 2, take: 9, skip: 11, save: 4, cut: 7, done: 14 },
};

export const WORDSEARCH_LINE_MAP: LineMap<'start' | 'visit' | 'dead' | 'found' | 'done'> = {
  csharp: { start: 15, visit: 7, dead: 4, found: 3, done: 15 },
  ts: { start: 20, visit: 8, dead: 5, found: 4, done: 22 },
  python: { start: 17, visit: 10, dead: 5, found: 3, done: 19 },
  java: { start: 5, visit: 13, dead: 10, found: 9, done: 6 },
  cpp: { start: 6, visit: 14, dead: 11, found: 10, done: 7 },
  js: { start: 18, visit: 7, dead: 4, found: 3, done: 20 },
};

export const CLONE_LINE_MAP: LineMap<'init' | 'create' | 'edge' | 'done'> = {
  csharp: { init: 1, create: 5, edge: 7, done: 10 },
  ts: { init: 1, create: 5, edge: 7, done: 11 },
  python: { init: 7, create: 12, edge: 14, done: 16 },
  java: { init: 9, create: 15, edge: 16, done: 10 },
  cpp: { init: 10, create: 16, edge: 17, done: 11 },
  js: { init: 1, create: 5, edge: 7, done: 11 },
};

export const SCHEDULE_LINE_MAP: LineMap<'init' | 'pop' | 'done'> = {
  csharp: { init: 1, pop: 13, done: 18 },
  ts: { init: 1, pop: 13, done: 19 },
  python: { init: 1, pop: 9, done: 15 },
  java: { init: 2, pop: 14, done: 19 },
  cpp: { init: 3, pop: 14, done: 19 },
  js: { init: 1, pop: 13, done: 19 },
};

export const PACIFIC_LINE_MAP: LineMap<'init' | 'wave' | 'done'> = {
  csharp: { init: 2, wave: 16, done: 23 },
  ts: { init: 2, wave: 18, done: 26 },
  python: { init: 2, wave: 16, done: 20 },
  java: { init: 3, wave: 6, done: 13 },
  cpp: { init: 4, wave: 7, done: 14 },
  js: { init: 2, wave: 16, done: 23 },
};

export const ISLANDS_LINE_MAP: LineMap<'init' | 'sink' | 'island' | 'done'> = {
  csharp: { init: 13, sink: 6, island: 16, done: 18 },
  ts: { init: 13, sink: 6, island: 17, done: 21 },
  python: { init: 11, sink: 6, island: 15, done: 16 },
  java: { init: 4, sink: 15, island: 8, done: 10 },
  cpp: { init: 5, sink: 16, island: 9, done: 11 },
  js: { init: 11, sink: 5, island: 15, done: 19 },
};

export const CONSEC_LINE_MAP: LineMap<'init' | 'skip' | 'run' | 'done'> = {
  csharp: { init: 1, skip: 4, done: 9, run: 6 },
  ts: { init: 1, skip: 4, run: 7, done: 14 },
  python: { init: 1, skip: 4, run: 7, done: 11 },
  java: { init: 2, skip: 6, run: 8, done: 11 },
  cpp: { init: 3, skip: 6, run: 8, done: 11 },
  js: { init: 1, skip: 4, run: 7, done: 13 },
};

export const ALIEN_LINE_MAP: LineMap<'init' | 'edge' | 'badorder' | 'pop' | 'done'> = {
  csharp: { init: 1, edge: 14, badorder: 10, pop: 22, done: 27 },
  ts: { init: 1, edge: 16, badorder: 11, pop: 27, done: 34 },
  python: { init: 1, edge: 15, badorder: 9, pop: 21, done: 27 },
  java: { init: 2, edge: 15, badorder: 11, pop: 24, done: 29 },
  cpp: { init: 3, edge: 17, badorder: 13, pop: 25, done: 30 },
  js: { init: 1, edge: 16, badorder: 11, pop: 27, done: 34 },
};

export const VALIDTREE_LINE_MAP: LineMap<'init' | 'union' | 'cycle' | 'done'> = {
  csharp: { init: 1, union: 6, cycle: 5, done: 8 },
  ts: { init: 1, union: 9, cycle: 8, done: 11 },
  python: { init: 1, union: 12, cycle: 11, done: 13 },
  java: { init: 2, union: 7, cycle: 6, done: 9 },
  cpp: { init: 3, union: 11, cycle: 10, done: 13 },
  js: { init: 1, union: 9, cycle: 8, done: 11 },
};

export const COMPONENTS_LINE_MAP: LineMap<'init' | 'union' | 'cycle' | 'done'> = {
  csharp: { init: 1, union: 4, cycle: 4, done: 5 },
  ts: { init: 1, union: 7, cycle: 7, done: 9 },
  python: { init: 1, union: 8, cycle: 8, done: 9 },
  java: { init: 2, union: 5, cycle: 5, done: 8 },
  cpp: { init: 3, union: 9, cycle: 9, done: 12 },
  js: { init: 1, union: 7, cycle: 7, done: 9 },
};
