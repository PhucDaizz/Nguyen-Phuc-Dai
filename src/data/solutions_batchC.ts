// Batch C — solutions đa ngôn ngữ + trace line map cho 13 bài cây/Trie.
// Quy ước như solutions.ts (mẫu two-sum-1 + TWOSUM_LINE_MAP).
// File này sẽ được gộp vào solutions.ts sau; visualizer import map từ '../../../data/solutions'.

import type { LineMap, SolutionLang } from './solutions';

export const BATCHC_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'max-depth-104': {
    ts: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    csharp: `public int MaxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right));
}`,
    python: `def max_depth(root):
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    java: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == nullptr) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
    js: `function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  },
  'same-tree-100': {
    ts: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    csharp: `public bool IsSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null || p.val != q.val) return false;
    return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
}`,
    python: `def is_same_tree(p, q):
    if p is None and q is None:
        return True
    if p is None or q is None or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
    java: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
    cpp: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (p == nullptr && q == nullptr) return true;
        if (p == nullptr || q == nullptr || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};`,
    js: `function isSameTree(p, q) {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
  },
  'invert-tree-226': {
    ts: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);
  return root;
}`,
    csharp: `public TreeNode InvertTree(TreeNode root) {
    if (root == null) return null;
    (root.left, root.right) = (root.right, root.left);
    InvertTree(root.left);
    InvertTree(root.right);
    return root;
}`,
    python: `def invert_tree(root):
    if root is None:
        return None
    tmp = root.left
    root.left = invert_tree(root.right)
    root.right = invert_tree(tmp)
    return root`,
    java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode tmp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(tmp);
        return root;
    }
}`,
    cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root == nullptr) return nullptr;
        TreeNode* tmp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(tmp);
        return root;
    }
};`,
    js: `function invertTree(root) {
  if (root === null) return null;
  const tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);
  return root;
}`,
  },
  'max-path-sum-124': {
    ts: `function maxPathSum(root: TreeNode | null): number {
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
    csharp: `int best = int.MinValue;
public int MaxPathSum(TreeNode root) { Dfs(root); return best; }
int Dfs(TreeNode node) {
    if (node == null) return 0;
    int l = Math.Max(0, Dfs(node.left));
    int r = Math.Max(0, Dfs(node.right));
    best = Math.Max(best, node.val + l + r);
    return node.val + Math.Max(l, r);
}`,
    python: `def max_path_sum(root):
    best = float('-inf')
    def gain(node):
        nonlocal best
        if node is None:
            return 0
        l = max(0, gain(node.left))
        r = max(0, gain(node.right))
        best = max(best, node.val + l + r)
        return node.val + max(l, r)
    gain(root)
    return best`,
    java: `class Solution {
    int best = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) {
        dfs(root);
        return best;
    }
    int dfs(TreeNode node) {
        if (node == null) return 0;
        int l = Math.max(0, dfs(node.left));
        int r = Math.max(0, dfs(node.right));
        best = Math.max(best, node.val + l + r);
        return node.val + Math.max(l, r);
    }
}`,
    cpp: `class Solution {
public:
    int best = INT_MIN;
    int dfs(TreeNode* node) {
        if (node == nullptr) return 0;
        int l = max(0, dfs(node->left));
        int r = max(0, dfs(node->right));
        best = max(best, node->val + l + r);
        return node->val + max(l, r);
    }
    int maxPathSum(TreeNode* root) {
        dfs(root);
        return best;
    }
};`,
    js: `function maxPathSum(root) {
  let best = -Infinity;
  const gain = (node) => {
    if (node === null) return 0;
    const l = Math.max(0, gain(node.left));
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`,
  },
  'level-order-102': {
    ts: `function levelOrder(root: TreeNode | null): number[][] {
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
    csharp: `public IList<IList<int>> LevelOrder(TreeNode root) {
    var res = new List<IList<int>>();
    if (root == null) return res;
    var q = new Queue<TreeNode>();
    q.Enqueue(root);
    while (q.Count > 0) {
        int size = q.Count;
        var level = new List<int>();
        for (int i = 0; i < size; i++) {
            var node = q.Dequeue();
            level.Add(node.val);
            if (node.left != null) q.Enqueue(node.left);
            if (node.right != null) q.Enqueue(node.right);
        }
        res.Add(level);
    }
    return res;
}`,
    python: `def level_order(root):
    if root is None:
        return []
    queue = [root]
    result = []
    while queue:
        size = len(queue)
        level = []
        for _ in range(size):
            node = queue.pop(0)
            level.append(node.val)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        result.append(level)
    return result`,
    java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (root == nullptr) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left != nullptr) q.push(node->left);
                if (node->right != nullptr) q.push(node->right);
            }
            res.push_back(level);
        }
        return res;
    }
};`,
    js: `function levelOrder(root) {
  if (root === null) return [];
  const queue = [root];
  const result = [];
  while (queue.length > 0) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
  },
  'serialize-tree-297': {
    ts: `function serialize(root: TreeNode | null): string {
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
    csharp: `public string Serialize(TreeNode root) {
    string Pre(TreeNode n) {
        if (n == null) return "#,";
        return n.val + "," + Pre(n.left) + Pre(n.right);
    }
    return Pre(root);
}
public TreeNode Deserialize(string data) {
    var toks = new Queue<string>(data.Split(","));
    TreeNode Build() {
        var t = toks.Dequeue();
        if (t == "#") return null;
        var n = new TreeNode(int.Parse(t));
        n.left = Build();
        n.right = Build();
        return n;
    }
    return Build();
}`,
    python: `def serialize(root):
    out = []
    def pre(node):
        if node is None:
            out.append('#')
            return
        out.append(str(node.val))
        pre(node.left)
        pre(node.right)
    pre(root)
    return ','.join(out)

def deserialize(data):
    tokens = data.split(',')
    i = 0
    def build():
        nonlocal i
        if tokens[i] == '#':
            i += 1
            return None
        node = TreeNode(int(tokens[i]))
        i += 1
        node.left = build()
        node.right = build()
        return node
    return build()`,
    java: `class Solution {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        pre(root, sb);
        return sb.toString();
    }
    void pre(TreeNode n, StringBuilder sb) {
        if (n == null) { sb.append("#,"); return; }
        sb.append(n.val).append(",");
        pre(n.left, sb);
        pre(n.right, sb);
    }
    public TreeNode deserialize(String data) {
        Queue<String> toks = new LinkedList<>(Arrays.asList(data.split(",")));
        return build(toks);
    }
    TreeNode build(Queue<String> toks) {
        String t = toks.poll();
        if (t.equals("#")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(t));
        n.left = build(toks);
        n.right = build(toks);
        return n;
    }
}`,
    cpp: `class Solution {
public:
    static queue<string> splitSer(const string& s) {
        queue<string> q;
        string cur;
        for (char c : s) {
            if (c == ',') { q.push(cur); cur.clear(); }
            else cur += c;
        }
        if (!cur.empty()) q.push(cur);
        return q;
    }
    string serialize(TreeNode* root) {
        string out;
        pre(root, out);
        return out;
    }
    void pre(TreeNode* n, string& out) {
        if (n == nullptr) { out += "#,"; return; }
        out += to_string(n->val) + ",";
        pre(n->left, out);
        pre(n->right, out);
    }
    TreeNode* deserialize(string data) {
        queue<string> toks = splitSer(data);
        return build(toks);
    }
    TreeNode* build(queue<string>& toks) {
        string t = toks.front(); toks.pop();
        if (t == "#") return nullptr;
        TreeNode* n = new TreeNode(stoi(t));
        n->left = build(toks);
        n->right = build(toks);
        return n;
    }
};`,
    js: `function serialize(root) {
  const out = [];
  const pre = (node) => {
    if (node === null) { out.push('#'); return; }
    out.push(String(node.val));
    pre(node.left);
    pre(node.right);
  };
  pre(root);
  return out.join(',');
}

function deserialize(data) {
  const tokens = data.split(',');
  let i = 0;
  const build = () => {
    if (tokens[i] === '#') { i++; return null; }
    const node = new TreeNode(Number(tokens[i++]));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}`,
  },
  'subtree-572': {
    ts: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
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
    csharp: `public bool IsSubtree(TreeNode root, TreeNode subRoot) {
    if (subRoot == null) return true;
    if (root == null) return false;
    if (IsSameTree(root, subRoot)) return true;
    return IsSubtree(root.left, subRoot) || IsSubtree(root.right, subRoot);
}
bool IsSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null || p.val != q.val) return false;
    return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
}`,
    python: `def is_subtree(root, sub_root):
    if sub_root is None:
        return True
    if root is None:
        return False
    if is_same_tree(root, sub_root):
        return True
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)

def is_same_tree(p, q):
    if p is None and q is None:
        return True
    if p is None or q is None or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
    java: `class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;
        if (root == null) return false;
        if (isSameTree(root, subRoot)) return true;
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }
    boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
    cpp: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (subRoot == nullptr) return true;
        if (root == nullptr) return false;
        if (isSameTree(root, subRoot)) return true;
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (p == nullptr && q == nullptr) return true;
        if (p == nullptr || q == nullptr || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};`,
    js: `function isSubtree(root, subRoot) {
  if (subRoot === null) return true;
  if (root === null) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p, q) {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
  },
  'construct-tree-105': {
    ts: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
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
    csharp: `public TreeNode BuildTree(int[] preorder, int[] inorder) {
    var pos = new Dictionary<int, int>();
    for (int i = 0; i < inorder.Length; i++) pos[inorder[i]] = i;
    int pi = 0;
    TreeNode Build(int l, int r) {
        if (l > r) return null;
        var root = new TreeNode(preorder[pi++]);
        int k = pos[root.val];
        root.left = Build(l, k - 1);
        root.right = Build(k + 1, r);
        return root;
    }
    return Build(0, inorder.Length - 1);
}`,
    python: `def build_tree(preorder, inorder):
    pos = {}
    for i, v in enumerate(inorder):
        pos[v] = i
    pi = 0
    def build(l, r):
        nonlocal pi
        if l > r:
            return None
        root = TreeNode(preorder[pi])
        pi += 1
        k = pos[root.val]
        root.left = build(l, k - 1)
        root.right = build(k + 1, r)
        return root
    return build(0, len(inorder) - 1)`,
    java: `class Solution {
    Map<Integer, Integer> pos = new HashMap<>();
    int pi = 0;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    TreeNode build(int[] preorder, int l, int r) {
        if (l > r) return null;
        TreeNode root = new TreeNode(preorder[pi++]);
        int k = pos.get(root.val);
        root.left = build(preorder, l, k - 1);
        root.right = build(preorder, k + 1, r);
        return root;
    }
}`,
    cpp: `class Solution {
public:
    unordered_map<int, int> pos;
    int pi = 0;
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < (int)inorder.size(); i++) pos[inorder[i]] = i;
        return build(preorder, 0, (int)inorder.size() - 1);
    }
    TreeNode* build(vector<int>& preorder, int l, int r) {
        if (l > r) return nullptr;
        TreeNode* root = new TreeNode(preorder[pi++]);
        int k = pos[root->val];
        root->left = build(preorder, l, k - 1);
        root->right = build(preorder, k + 1, r);
        return root;
    }
};`,
    js: `function buildTree(preorder, inorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));
  let pi = 0;
  const build = (l, r) => {
    if (l > r) return null;
    const root = new TreeNode(preorder[pi++]);
    const k = pos.get(root.val);
    root.left = build(l, k - 1);
    root.right = build(k + 1, r);
    return root;
  };
  return build(0, inorder.length - 1);
}`,
  },
  'kth-smallest-230': {
    ts: `function kthSmallest(root: TreeNode | null, k: number): number {
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
    csharp: `public int KthSmallest(TreeNode root, int k) {
    int count = 0, answer = -1;
    void Inorder(TreeNode node) {
        if (node == null || answer != -1) return;
        Inorder(node.left);
        if (++count == k) { answer = node.val; return; }
        Inorder(node.right);
    }
    Inorder(root);
    return answer;
}`,
    python: `def kth_smallest(root, k):
    count = 0
    answer = -1
    def inorder(node):
        nonlocal count, answer
        if node is None or answer != -1:
            return
        inorder(node.left)
        count += 1
        if count == k:
            answer = node.val
            return
        inorder(node.right)
    inorder(root)
    return answer`,
    java: `class Solution {
    int count = 0, answer = -1, K;
    public int kthSmallest(TreeNode root, int k) {
        K = k;
        inorder(root);
        return answer;
    }
    void inorder(TreeNode node) {
        if (node == null || answer != -1) return;
        inorder(node.left);
        if (++count == K) { answer = node.val; return; }
        inorder(node.right);
    }
}`,
    cpp: `class Solution {
public:
    int count = 0, answer = -1, K;
    void inorder(TreeNode* node) {
        if (node == nullptr || answer != -1) return;
        inorder(node->left);
        if (++count == K) { answer = node->val; return; }
        inorder(node->right);
    }
    int kthSmallest(TreeNode* root, int k) {
        K = k;
        inorder(root);
        return answer;
    }
};`,
    js: `function kthSmallest(root, k) {
  let count = 0;
  let answer = -1;
  const inorder = (node) => {
    if (node === null || answer !== -1) return;
    inorder(node.left);
    count++;
    if (count === k) { answer = node.val; return; }
    inorder(node.right);
  };
  inorder(root);
  return answer;
}`,
  },
  'lowest-common-ancestor-235': {
    ts: `function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) {
  let cur: TreeNode | null = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
    csharp: `public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    var cur = root;
    while (cur != null) {
        if (p.val < cur.val && q.val < cur.val) cur = cur.left;
        else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
        else return cur;
    }
    return null;
}`,
    python: `def lowest_common_ancestor(root, p, q):
    cur = root
    while cur is not None:
        if p.val < cur.val and q.val < cur.val:
            cur = cur.left
        elif p.val > cur.val and q.val > cur.val:
            cur = cur.right
        else:
            return cur
    return None`,
    java: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p.val < cur.val && q.val < cur.val) cur = cur.left;
            else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
            else return cur;
        }
        return null;
    }
}`,
    cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* cur = root;
        while (cur != nullptr) {
            if (p->val < cur->val && q->val < cur->val) cur = cur->left;
            else if (p->val > cur->val && q->val > cur->val) cur = cur->right;
            else return cur;
        }
        return nullptr;
    }
};`,
    js: `function lowestCommonAncestor(root, p, q) {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
  },
  'implement-trie-208': {
    ts: `class TrieNode {
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
    csharp: `public class Trie {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public bool End;
    }
    private readonly Node root = new();
    public void Insert(string word) {
        var n = root;
        foreach (char c in word) {
            if (!n.Next.ContainsKey(c)) n.Next[c] = new Node();
            n = n.Next[c];
        }
        n.End = true;
    }
    public bool Search(string word) {
        var n = Walk(word);
        return n != null && n.End;
    }
    public bool StartsWith(string prefix) {
        return Walk(prefix) != null;
    }
    private Node Walk(string s) {
        var n = root;
        foreach (char c in s) {
            if (!n.Next.TryGetValue(c, out n)) return null;
        }
        return n;
    }
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end
    def starts_with(self, prefix):
        return self._walk(prefix) is not None
    def _walk(self, s):
        node = self.root
        for c in s:
            node = node.children.get(c)
            if node is None:
                return None
        return node`,
    java: `class Trie {
    static class Node {
        Map<Character, Node> next = new HashMap<>();
        boolean end;
    }
    Node root = new Node();
    public void insert(String word) {
        Node n = root;
        for (char c : word.toCharArray()) {
            n.next.putIfAbsent(c, new Node());
            n = n.next.get(c);
        }
        n.end = true;
    }
    public boolean search(String word) {
        Node n = walk(word);
        return n != null && n.end;
    }
    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }
    Node walk(String s) {
        Node n = root;
        for (char c : s.toCharArray()) {
            n = n.next.get(c);
            if (n == null) return null;
        }
        return n;
    }
}`,
    cpp: `class Trie {
public:
    struct Node {
        unordered_map<char, Node*> next;
        bool end = false;
    };
    Node* root = new Node();
    void insert(string word) {
        Node* n = root;
        for (char c : word) {
            if (!n->next.count(c)) n->next[c] = new Node();
            n = n->next[c];
        }
        n->end = true;
    }
    bool search(string word) {
        Node* n = walk(word);
        return n != nullptr && n->end;
    }
    bool startsWith(string prefix) {
        return walk(prefix) != nullptr;
    }
    Node* walk(string s) {
        Node* n = root;
        for (char c : s) {
            auto it = n->next.find(c);
            if (it == n->next.end()) return nullptr;
            n = it->second;
        }
        return n;
    }
};`,
    js: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c);
    }
    node.isEnd = true;
  }
  search(word) {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }
  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }
  walk(s) {
    let node = this.root;
    for (const c of s) {
      node = node?.children.get(c) ?? null;
      if (node === null) return null;
    }
    return node;
  }
}`,
  },
  'add-search-words-211': {
    ts: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class WordDictionary {
  root = new TrieNode();

  addWord(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
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
    return dfs(this.root, 0);
  }
}`,
    csharp: `public class WordDictionary {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public bool End;
    }
    private readonly Node root = new();
    public void AddWord(string word) {
        var n = root;
        foreach (char c in word) {
            if (!n.Next.ContainsKey(c)) n.Next[c] = new Node();
            n = n.Next[c];
        }
        n.End = true;
    }
    public bool Search(string word) {
        return Dfs(root, word, 0);
    }
    private bool Dfs(Node n, string w, int k) {
        if (n == null) return false;
        if (k == w.Length) return n.End;
        if (w[k] == '.') {
            foreach (var child in n.Next.Values)
                if (Dfs(child, w, k + 1)) return true;
            return false;
        }
        return Dfs(n.Next.GetValueOrDefault(w[k]), w, k + 1);
    }
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
    def add_word(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True
    def search(self, word):
        def dfs(n, k):
            if n is None:
                return False
            if k == len(word):
                return n.is_end
            c = word[k]
            if c == '.':
                for child in n.children.values():
                    if dfs(child, k + 1):
                        return True
                return False
            return dfs(n.children.get(c), k + 1)
        return dfs(self.root, 0)`,
    java: `class WordDictionary {
    static class Node {
        Map<Character, Node> next = new HashMap<>();
        boolean end;
    }
    Node root = new Node();
    public void addWord(String word) {
        Node n = root;
        for (char c : word.toCharArray()) {
            n.next.putIfAbsent(c, new Node());
            n = n.next.get(c);
        }
        n.end = true;
    }
    public boolean search(String word) {
        return dfs(root, word, 0);
    }
    boolean dfs(Node n, String w, int k) {
        if (n == null) return false;
        if (k == w.length()) return n.end;
        if (w.charAt(k) == '.') {
            for (Node child : n.next.values())
                if (dfs(child, w, k + 1)) return true;
            return false;
        }
        return dfs(n.next.get(w.charAt(k)), w, k + 1);
    }
}`,
    cpp: `class WordDictionary {
public:
    struct Node {
        unordered_map<char, Node*> next;
        bool end = false;
    };
    Node* root = new Node();
    void addWord(string word) {
        Node* n = root;
        for (char c : word) {
            if (!n->next.count(c)) n->next[c] = new Node();
            n = n->next[c];
        }
        n->end = true;
    }
    bool search(string word) {
        return dfs(root, word, 0);
    }
    bool dfs(Node* n, string w, int k) {
        if (n == nullptr) return false;
        if (k == (int)w.size()) return n->end;
        if (w[k] == '.') {
            for (auto& [c, child] : n->next)
                if (dfs(child, w, k + 1)) return true;
            return false;
        }
        auto it = n->next.find(w[k]);
        return dfs(it == n->next.end() ? nullptr : it->second, w, k + 1);
    }
};`,
    js: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode();
  }
  addWord(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c);
    }
    node.isEnd = true;
  }
  search(word) {
    const dfs = (n, k) => {
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
    return dfs(this.root, 0);
  }
}`,
  },
  'word-search-ii-212': {
    ts: `class WsTrieNode {
  children = new Map<string, WsTrieNode>();
  word: string | null = null;
}

function buildWsTrie(words: string[]): WsTrieNode {
  const root = new WsTrieNode();
  for (const w of words) {
    let n = root;
    for (const c of w) {
      if (!n.children.has(c)) n.children.set(c, new WsTrieNode());
      n = n.children.get(c)!;
    }
    n.word = w;
  }
  return root;
}

function findWords(board: string[][], words: string[]): string[] {
  const root = buildWsTrie(words);
  const res: string[] = [];
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, node: WsTrieNode): void => {
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
    csharp: `public class Sol {
    private class WsNode {
        public Dictionary<char, WsNode> Next = new();
        public string Word = null;
    }
    private static WsNode BuildWsTrie(string[] words) {
        var root = new WsNode();
        foreach (var w in words) {
            var n = root;
            foreach (char c in w) {
                if (!n.Next.ContainsKey(c)) n.Next[c] = new WsNode();
                n = n.Next[c];
            }
            n.Word = w;
        }
        return root;
    }
    public IList<string> FindWords(char[][] board, string[] words) {
    var root = BuildWsTrie(words);
    var res = new List<string>();
    int R = board.Length, C = board[0].Length;
    void Dfs(int r, int c, WsNode node) {
        if (r < 0 || c < 0 || r >= R || c >= C) return;
        char ch = board[r][c];
        if (ch == '#' || !node.Next.ContainsKey(ch)) return;
        var next = node.Next[ch];
        if (next.Word != null) {
            res.Add(next.Word);
            next.Word = null;
        }
        board[r][c] = '#';
        Dfs(r + 1, c, next);
        Dfs(r - 1, c, next);
        Dfs(r, c + 1, next);
        Dfs(r, c - 1, next);
        board[r][c] = ch;
    }
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) Dfs(r, c, root);
    return res;
    }
}`,
    python: `class _WsTrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

def _build_ws_trie(words):
    root = _WsTrieNode()
    for w in words:
        n = root
        for c in w:
            if c not in n.children:
                n.children[c] = _WsTrieNode()
            n = n.children[c]
        n.word = w
    return root

def find_words(board, words):
    root = _build_ws_trie(words)
    res = []
    R, C = len(board), len(board[0])
    def dfs(r, c, node):
        if r < 0 or c < 0 or r >= R or c >= C:
            return
        ch = board[r][c]
        if ch == '#' or ch not in node.children:
            return
        nxt = node.children[ch]
        if nxt.word is not None:
            res.append(nxt.word)
            nxt.word = None
        board[r][c] = '#'
        dfs(r + 1, c, nxt)
        dfs(r - 1, c, nxt)
        dfs(r, c + 1, nxt)
        dfs(r, c - 1, nxt)
        board[r][c] = ch
    for r in range(R):
        for c in range(C):
            dfs(r, c, root)
    return res`,
    java: `class Solution {
    static class Node {
        Map<Character, Node> next = new HashMap<>();
        String word = null;
    }
    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node n = root;
            for (char c : w.toCharArray()) {
                n.next.putIfAbsent(c, new Node());
                n = n.next.get(c);
            }
            n.word = w;
        }
        List<String> res = new ArrayList<>();
        int R = board.length, C = board[0].length;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) dfs(board, r, c, root, res);
        return res;
    }
    void dfs(char[][] board, int r, int c, Node node, List<String> res) {
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#' || !node.next.containsKey(ch)) return;
        Node next = node.next.get(ch);
        if (next.word != null) {
            res.add(next.word);
            next.word = null;
        }
        board[r][c] = '#';
        dfs(board, r + 1, c, next, res);
        dfs(board, r - 1, c, next, res);
        dfs(board, r, c + 1, next, res);
        dfs(board, r, c - 1, next, res);
        board[r][c] = ch;
    }
}`,
    cpp: `class Solution {
public:
    struct Node {
        unordered_map<char, Node*> next;
        string word = "";
    };
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        Node* root = new Node();
        for (string& w : words) {
            Node* n = root;
            for (char c : w) {
                if (!n->next.count(c)) n->next[c] = new Node();
                n = n->next[c];
            }
            n->word = w;
        }
        vector<string> res;
        int R = board.size(), C = board[0].size();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) dfs(board, r, c, root, res);
        return res;
    }
    void dfs(vector<vector<char>>& board, int r, int c, Node* node, vector<string>& res) {
        if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return;
        char ch = board[r][c];
        if (ch == '#' || !node->next.count(ch)) return;
        Node* next = node->next[ch];
        if (!next->word.empty()) {
            res.push_back(next->word);
            next->word = "";
        }
        board[r][c] = '#';
        dfs(board, r + 1, c, next, res);
        dfs(board, r - 1, c, next, res);
        dfs(board, r, c + 1, next, res);
        dfs(board, r, c - 1, next, res);
        board[r][c] = ch;
    }
};`,
    js: `class WsTrieNode {
  constructor() {
    this.children = new Map();
    this.word = null;
  }
}

function buildWsTrie(words) {
  const root = new WsTrieNode();
  for (const w of words) {
    let n = root;
    for (const c of w) {
      if (!n.children.has(c)) n.children.set(c, new WsTrieNode());
      n = n.children.get(c);
    }
    n.word = w;
  }
  return root;
}

function findWords(board, words) {
  const root = buildWsTrie(words);
  const res = [];
  const R = board.length, C = board[0].length;
  const dfs = (r, c, node) => {
    if (r < 0 || c < 0 || r >= R || c >= C) return;
    const ch = board[r][c];
    if (ch === '#' || !node.children.has(ch)) return;
    const next = node.children.get(ch);
    if (next.word !== null) {
      res.push(next.word);
      next.word = null;
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
  },
};

// ===================== BATCH C LINE MAPS =====================

export const MAXDEPTH_LINE_MAP: LineMap<'init' | 'visit' | 'done'> = {
  csharp: { init: 2, visit: 2, done: 2 },
  ts: { init: 2, visit: 2, done: 2 },
  python: { init: 3, visit: 3, done: 3 },
  java: { init: 3, visit: 3, done: 3 },
  cpp: { init: 4, visit: 4, done: 4 },
  js: { init: 2, visit: 2, done: 2 },
};

export const SAMETREE_LINE_MAP: LineMap<'init' | 'compare' | 'done'> = {
  csharp: { init: 1, compare: 2, done: 3 },
  ts: { init: 1, compare: 2, done: 3 },
  python: { init: 1, compare: 3, done: 5 },
  java: { init: 2, compare: 3, done: 4 },
  cpp: { init: 3, compare: 4, done: 5 },
  js: { init: 1, compare: 2, done: 3 },
};

export const INVERT_LINE_MAP: LineMap<'init' | 'swap' | 'done'> = {
  csharp: { init: 1, swap: 2, done: 5 },
  ts: { init: 1, swap: 3, done: 5 },
  python: { init: 2, swap: 4, done: 6 },
  java: { init: 2, swap: 4, done: 6 },
  cpp: { init: 3, swap: 5, done: 7 },
  js: { init: 1, swap: 3, done: 5 },
};

export const MAXPATH_LINE_MAP: LineMap<'init' | 'visit' | 'done'> = {
  csharp: { init: 1, visit: 6, done: 1 },
  ts: { init: 9, visit: 6, done: 10 },
  python: { init: 10, visit: 8, done: 11 },
  java: { init: 3, visit: 10, done: 4 },
  cpp: { init: 11, visit: 7, done: 12 },
  js: { init: 9, visit: 6, done: 10 },
};

export const LEVELORDER_LINE_MAP: LineMap<'init' | 'level' | 'visit' | 'levelEnd' | 'done'> = {
  csharp: { init: 4, level: 6, visit: 9, levelEnd: 14, done: 16 },
  ts: { init: 2, level: 5, visit: 8, levelEnd: 13, done: 15 },
  python: { init: 3, level: 6, visit: 9, levelEnd: 15, done: 16 },
  java: { init: 5, level: 7, visit: 10, levelEnd: 15, done: 17 },
  cpp: { init: 6, level: 8, visit: 11, levelEnd: 16, done: 18 },
  js: { init: 2, level: 5, visit: 8, levelEnd: 13, done: 15 },
};

export const SERIALIZE_LINE_MAP: LineMap<'init' | 'emit' | 'decode' | 'done'> = {
  csharp: { init: 0, emit: 3, decode: 12, done: 17 },
  ts: { init: 0, emit: 4, decode: 17, done: 22 },
  python: { init: 0, emit: 6, decode: 20, done: 25 },
  java: { init: 1, emit: 8, decode: 19, done: 14 },
  cpp: { init: 12, emit: 19, decode: 30, done: 25 },
  js: { init: 0, emit: 4, decode: 17, done: 22 },
};

export const SUBTREE_LINE_MAP: LineMap<'init' | 'cand' | 'pair' | 'found' | 'fail' | 'done'> = {
  csharp: { init: 1, cand: 3, pair: 3, found: 3, fail: 4, done: 3 },
  ts: { init: 1, cand: 3, pair: 3, found: 3, fail: 4, done: 3 },
  python: { init: 1, cand: 5, pair: 5, found: 5, fail: 7, done: 5 },
  java: { init: 2, cand: 4, pair: 4, found: 4, fail: 5, done: 4 },
  cpp: { init: 3, cand: 5, pair: 5, found: 5, fail: 6, done: 5 },
  js: { init: 1, cand: 3, pair: 3, found: 3, fail: 4, done: 3 },
};

export const CONSTRUCT_LINE_MAP: LineMap<'init' | 'pick' | 'done'> = {
  csharp: { init: 1, pick: 7, done: 12 },
  ts: { init: 1, pick: 7, done: 12 },
  python: { init: 1, pick: 11, done: 15 },
  java: { init: 4, pick: 10, done: 5 },
  cpp: { init: 5, pick: 11, done: 6 },
  js: { init: 1, pick: 7, done: 12 },
};

export const KTHSMALLEST_LINE_MAP: LineMap<'init' | 'visit' | 'found' | 'done'> = {
  csharp: { init: 8, visit: 5, found: 5, done: 9 },
  ts: { init: 10, visit: 6, found: 7, done: 11 },
  python: { init: 13, visit: 8, found: 10, done: 14 },
  java: { init: 4, visit: 10, found: 10, done: 5 },
  cpp: { init: 11, visit: 6, found: 6, done: 12 },
  js: { init: 10, visit: 6, found: 7, done: 11 },
};

export const LCA_LINE_MAP: LineMap<'init' | 'go' | 'found' | 'done'> = {
  csharp: { init: 1, go: 4, found: 5, done: 5 },
  ts: { init: 1, go: 3, found: 5, done: 5 },
  python: { init: 1, go: 4, found: 8, done: 8 },
  java: { init: 2, go: 4, found: 6, done: 6 },
  cpp: { init: 3, go: 5, found: 7, done: 7 },
  js: { init: 1, go: 3, found: 5, done: 5 },
};

export const TRIE_LINE_MAP: LineMap<'init' | 'walk' | 'create' | 'end' | 'result'> = {
  csharp: { init: 7, walk: 10, create: 9, end: 12, result: 16 },
  ts: { init: 9, walk: 12, create: 11, end: 14, result: 19 },
  python: { init: 9, walk: 13, create: 12, end: 14, result: 17 },
  java: { init: 7, walk: 10, create: 9, end: 12, result: 16 },
  cpp: { init: 8, walk: 11, create: 10, end: 13, result: 17 },
  js: { init: 12, walk: 15, create: 14, end: 17, result: 21 },
};

export const WILDCARD_LINE_MAP: LineMap<'visit' | 'branch' | 'result'> = {
  csharp: { visit: 25, branch: 21, result: 19 },
  ts: { visit: 28, branch: 23, result: 20 },
  python: { visit: 27, branch: 23, result: 20 },
  java: { visit: 25, branch: 21, result: 19 },
  cpp: { visit: 27, branch: 22, result: 20 },
  js: { visit: 30, branch: 25, result: 22 },
};

export const WORDSEARCH2_LINE_MAP: LineMap<'start' | 'visit' | 'prune' | 'found' | 'done'> = {
  csharp: { start: 7, visit: 11, prune: 11, found: 13, done: 21 },
  ts: { start: 1, visit: 8, prune: 8, found: 10, done: 22 },
  python: { start: 1, visit: 8, prune: 8, found: 11, done: 20 },
  java: { start: 6, visit: 24, prune: 24, found: 26, done: 17 },
  cpp: { start: 7, visit: 25, prune: 25, found: 27, done: 18 },
  js: { start: 1, visit: 7, prune: 7, found: 9, done: 20 },
};
