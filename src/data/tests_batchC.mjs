// Batch C — tests cho 13 bài cây/Trie.
export const TESTS = {
  'max-depth-104': {
    tests: [
      {
        expect: 3,
        js: 'maxDepth(T([3,9,20,null,null,15,7]))',
        py: 'max_depth(T([3, 9, 20, None, None, 15, 7]))',
        java: 'new Solution().maxDepth(T(3,9,20,null,null,15,7))',
        cpp: 'Solution().maxDepth(T({3,9,20,std::nullopt,std::nullopt,15,7}))',
        cs: 'new Sol().MaxDepth(H.T(new int?[]{3,9,20,null,null,15,7}))',
      },
      {
        expect: 0,
        js: 'maxDepth(T([]))',
        py: 'max_depth(T([]))',
        java: 'new Solution().maxDepth(T())',
        cpp: 'Solution().maxDepth(T({}))',
        cs: 'new Sol().MaxDepth(H.T(new int?[]{}))',
      },
      {
        expect: 1,
        js: 'maxDepth(T([1]))',
        py: 'max_depth(T([1]))',
        java: 'new Solution().maxDepth(T(1))',
        cpp: 'Solution().maxDepth(T({1}))',
        cs: 'new Sol().MaxDepth(H.T(new int?[]{1}))',
      },
    ],
  },
  'same-tree-100': {
    tests: [
      {
        expect: true,
        js: 'isSameTree(T([1,2,3]),T([1,2,3]))',
        py: 'is_same_tree(T([1, 2, 3]), T([1, 2, 3]))',
        java: 'new Solution().isSameTree(T(1,2,3),T(1,2,3))',
        cpp: 'Solution().isSameTree(T({1,2,3}),T({1,2,3}))',
        cs: 'new Sol().IsSameTree(H.T(new int?[]{1,2,3}),H.T(new int?[]{1,2,3}))',
      },
      {
        expect: false,
        js: 'isSameTree(T([1,2]),T([1,null,2]))',
        py: 'is_same_tree(T([1, 2]), T([1, None, 2]))',
        java: 'new Solution().isSameTree(T(1,2),T(1,null,2))',
        cpp: 'Solution().isSameTree(T({1,2}),T({1,std::nullopt,2}))',
        cs: 'new Sol().IsSameTree(H.T(new int?[]{1,2}),H.T(new int?[]{1,null,2}))',
      },
    ],
  },
  'invert-tree-226': {
    tests: [
      {
        expect: [4, 7, 2, 9, 6, 3, 1],
        js: 'TA(invertTree(T([4,2,7,1,3,6,9])))',
        py: 'TA(invert_tree(T([4, 2, 7, 1, 3, 6, 9])))',
        java: 'TA(new Solution().invertTree(T(4,2,7,1,3,6,9)))',
        cpp: 'Solution().invertTree(T({4,2,7,1,3,6,9}))',
        cs: 'H.TA(new Sol().InvertTree(H.T(new int?[]{4,2,7,1,3,6,9})))',
      },
      {
        expect: [],
        js: 'TA(invertTree(T([])))',
        py: 'TA(invert_tree(T([])))',
        java: 'TA(new Solution().invertTree(T()))',
        cpp: 'Solution().invertTree(T({}))',
        cs: 'H.TA(new Sol().InvertTree(H.T(new int?[]{})))',
      },
    ],
  },
  'max-path-sum-124': {
    tests: [
      {
        expect: 6,
        js: 'maxPathSum(T([1,2,3]))',
        py: 'max_path_sum(T([1, 2, 3]))',
        java: 'new Solution().maxPathSum(T(1,2,3))',
        cpp: 'Solution().maxPathSum(T({1,2,3}))',
        cs: 'new Sol().MaxPathSum(H.T(new int?[]{1,2,3}))',
      },
      {
        expect: 42,
        js: 'maxPathSum(T([-10,9,20,null,null,15,7]))',
        py: 'max_path_sum(T([-10, 9, 20, None, None, 15, 7]))',
        java: 'new Solution().maxPathSum(T(-10,9,20,null,null,15,7))',
        cpp: 'Solution().maxPathSum(T({-10,9,20,std::nullopt,std::nullopt,15,7}))',
        cs: 'new Sol().MaxPathSum(H.T(new int?[]{-10,9,20,null,null,15,7}))',
      },
      {
        expect: -3,
        js: 'maxPathSum(T([-3]))',
        py: 'max_path_sum(T([-3]))',
        java: 'new Solution().maxPathSum(T(-3))',
        cpp: 'Solution().maxPathSum(T({-3}))',
        cs: 'new Sol().MaxPathSum(H.T(new int?[]{-3}))',
      },
    ],
  },
  'level-order-102': {
    tests: [
      {
        expect: [[3], [9, 20], [15, 7]],
        js: 'levelOrder(T([3,9,20,null,null,15,7]))',
        py: 'level_order(T([3, 9, 20, None, None, 15, 7]))',
        java: 'new Solution().levelOrder(T(3,9,20,null,null,15,7))',
        cpp: 'Solution().levelOrder(T({3,9,20,std::nullopt,std::nullopt,15,7}))',
        cs: 'new Sol().LevelOrder(H.T(new int?[]{3,9,20,null,null,15,7}))',
      },
      {
        expect: [],
        js: 'levelOrder(T([]))',
        py: 'level_order(T([]))',
        java: 'new Solution().levelOrder(T())',
        cpp: 'Solution().levelOrder(T({}))',
        cs: 'new Sol().LevelOrder(H.T(new int?[]{}))',
      },
    ],
  },
  'serialize-tree-297': {
    tests: [
      {
        // round-trip consistency (format serialize khác nhau giữa các lang nên so chuỗi sau 2 lần serialize)
        expect: true,
        js: 'serialize(deserialize(serialize(T([1,2,3,null,null,4,5]))))===serialize(T([1,2,3,null,null,4,5]))',
        py: 'serialize(deserialize(serialize(T([1, 2, 3, None, None, 4, 5])))) == serialize(T([1, 2, 3, None, None, 4, 5]))',
        java: 'new Solution().serialize(new Solution().deserialize(new Solution().serialize(T(1,2,3,null,null,4,5)))).equals(new Solution().serialize(T(1,2,3,null,null,4,5)))',
        cpp: 'Solution().serialize(Solution().deserialize(Solution().serialize(T({1,2,3,std::nullopt,std::nullopt,4,5})))) == Solution().serialize(T({1,2,3,std::nullopt,std::nullopt,4,5}))',
        cs: 'new Sol().Serialize(new Sol().Deserialize(new Sol().Serialize(H.T(new int?[]{1,2,3,null,null,4,5}))))==new Sol().Serialize(H.T(new int?[]{1,2,3,null,null,4,5}))',
      },
      {
        expect: true,
        js: 'serialize(deserialize(serialize(T([]))))===serialize(T([]))',
        py: 'serialize(deserialize(serialize(T([])))) == serialize(T([]))',
        java: 'new Solution().serialize(new Solution().deserialize(new Solution().serialize(T()))).equals(new Solution().serialize(T()))',
        cpp: 'Solution().serialize(Solution().deserialize(Solution().serialize(T({})))) == Solution().serialize(T({}))',
        cs: 'new Sol().Serialize(new Sol().Deserialize(new Sol().Serialize(H.T(new int?[]{}))))==new Sol().Serialize(H.T(new int?[]{}))',
      },
    ],
  },
  'subtree-572': {
    tests: [
      {
        expect: true,
        js: 'isSubtree(T([3,4,5,1,2]),T([4,1,2]))',
        py: 'is_subtree(T([3, 4, 5, 1, 2]), T([4, 1, 2]))',
        java: 'new Solution().isSubtree(T(3,4,5,1,2),T(4,1,2))',
        cpp: 'Solution().isSubtree(T({3,4,5,1,2}),T({4,1,2}))',
        cs: 'new Sol().IsSubtree(H.T(new int?[]{3,4,5,1,2}),H.T(new int?[]{4,1,2}))',
      },
      {
        expect: false,
        js: 'isSubtree(T([3,4,5,1,2,null,null,null,null,0]),T([4,1,2]))',
        py: 'is_subtree(T([3, 4, 5, 1, 2, None, None, None, None, 0]), T([4, 1, 2]))',
        java: 'new Solution().isSubtree(T(3,4,5,1,2,null,null,null,null,0),T(4,1,2))',
        cpp: 'Solution().isSubtree(T({3,4,5,1,2,std::nullopt,std::nullopt,std::nullopt,std::nullopt,0}),T({4,1,2}))',
        cs: 'new Sol().IsSubtree(H.T(new int?[]{3,4,5,1,2,null,null,null,null,0}),H.T(new int?[]{4,1,2}))',
      },
    ],
  },
  'construct-tree-105': {
    tests: [
      {
        // so sánh TA qua equality bool để né H.canon(List<object> có null) của harness C#
        expect: true,
        js: 'JSON.stringify(TA(buildTree([3,9,20,15,7],[9,3,15,20,7])))===JSON.stringify([3,9,20,null,null,15,7])',
        py: 'TA(build_tree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])) == [3, 9, 20, None, None, 15, 7]',
        java: 'TA(new Solution().buildTree(new int[]{3,9,20,15,7},new int[]{9,3,15,20,7})).equals(java.util.Arrays.asList(3,9,20,null,null,15,7))',
        cpp: { stmts: ['vector<int> pre = {3,9,20,15,7}; vector<int> ino = {9,3,15,20,7};'], ret: 'canon(Solution().buildTree(pre,ino)) == string("[3,9,20,null,null,15,7]")' },
        cs: 'H.TA(new Sol().BuildTree(new int[]{3,9,20,15,7},new int[]{9,3,15,20,7})).SequenceEqual(new List<object>{3,9,20,null,null,15,7})',
      },
      {
        expect: true,
        js: 'JSON.stringify(TA(buildTree([-1],[-1])))===JSON.stringify([-1])',
        py: 'TA(build_tree([-1], [-1])) == [-1]',
        java: 'TA(new Solution().buildTree(new int[]{-1},new int[]{-1})).equals(java.util.Arrays.asList(-1))',
        cpp: { stmts: ['vector<int> pre = {-1}; vector<int> ino = {-1};'], ret: 'canon(Solution().buildTree(pre,ino)) == string("[-1]")' },
        cs: 'H.TA(new Sol().BuildTree(new int[]{-1},new int[]{-1})).SequenceEqual(new List<object>{-1})',
      },
    ],
  },
  'kth-smallest-230': {
    tests: [
      {
        expect: 1,
        js: 'kthSmallest(T([3,1,4,null,2]),1)',
        py: 'kth_smallest(T([3, 1, 4, None, 2]), 1)',
        java: 'new Solution().kthSmallest(T(3,1,4,null,2),1)',
        cpp: 'Solution().kthSmallest(T({3,1,4,std::nullopt,2}),1)',
        cs: 'new Sol().KthSmallest(H.T(new int?[]{3,1,4,null,2}),1)',
      },
      {
        expect: 3,
        js: 'kthSmallest(T([3,1,4,null,2]),3)',
        py: 'kth_smallest(T([3, 1, 4, None, 2]), 3)',
        java: 'new Solution().kthSmallest(T(3,1,4,null,2),3)',
        cpp: 'Solution().kthSmallest(T({3,1,4,std::nullopt,2}),3)',
        cs: 'new Sol().KthSmallest(H.T(new int?[]{3,1,4,null,2}),3)',
      },
    ],
  },
  'lowest-common-ancestor-235': {
    tests: [
      {
        expect: 6,
        js: { stmts: ['const r=T([6,2,8,0,4,7,9,null,null,3,5]);'], ret: 'lowestCommonAncestor(r,r.left,r.right).val' },
        py: { stmts: ['r=T([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])'], ret: 'lowest_common_ancestor(r, r.left, r.right).val' },
        java: { stmts: ['TreeNode r = T(6,2,8,0,4,7,9,null,null,3,5);'], ret: 'new Solution().lowestCommonAncestor(r,r.left,r.right).val' },
        cpp: { stmts: ['TreeNode* r = T({6,2,8,0,4,7,9,std::nullopt,std::nullopt,3,5});'], ret: 'Solution().lowestCommonAncestor(r,r->left,r->right)->val' },
        cs: { stmts: ['var r = H.T(new int?[]{6,2,8,0,4,7,9,null,null,3,5});'], ret: 'new Sol().LowestCommonAncestor(r,r.left,r.right).val' },
      },
      {
        expect: 2,
        js: { stmts: ['const r=T([6,2,8,0,4,7,9,null,null,3,5]);'], ret: 'lowestCommonAncestor(r,r.left,r.left.right).val' },
        py: { stmts: ['r=T([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])'], ret: 'lowest_common_ancestor(r, r.left, r.left.right).val' },
        java: { stmts: ['TreeNode r = T(6,2,8,0,4,7,9,null,null,3,5);'], ret: 'new Solution().lowestCommonAncestor(r,r.left,r.left.right).val' },
        cpp: { stmts: ['TreeNode* r = T({6,2,8,0,4,7,9,std::nullopt,std::nullopt,3,5});'], ret: 'Solution().lowestCommonAncestor(r,r->left,r->left->right)->val' },
        cs: { stmts: ['var r = H.T(new int?[]{6,2,8,0,4,7,9,null,null,3,5});'], ret: 'new Sol().LowestCommonAncestor(r,r.left,r.left.right).val' },
      },
    ],
  },
  'implement-trie-208': {
    tests: [
      {
        expect: true,
        js: { stmts: ['const t=new Trie(); t.insert("apple");'], ret: 't.search("apple")' },
        py: { stmts: ['t=Trie()', 't.insert("apple")'], ret: 't.search("apple")' },
        java: { stmts: ['Trie t = new Trie(); t.insert("apple");'], ret: 't.search("apple")' },
        cpp: { stmts: ['Trie t; t.insert("apple");'], ret: 't.search("apple")' },
        cs: { stmts: ['var t = new Trie(); t.Insert("apple");'], ret: 't.Search("apple")' },
      },
      {
        expect: false,
        js: { stmts: ['const t=new Trie(); t.insert("apple");'], ret: 't.search("app")' },
        py: { stmts: ['t=Trie()', 't.insert("apple")'], ret: 't.search("app")' },
        java: { stmts: ['Trie t = new Trie(); t.insert("apple");'], ret: 't.search("app")' },
        cpp: { stmts: ['Trie t; t.insert("apple");'], ret: 't.search("app")' },
        cs: { stmts: ['var t = new Trie(); t.Insert("apple");'], ret: 't.Search("app")' },
      },
      {
        expect: true,
        js: { stmts: ['const t=new Trie(); t.insert("apple");'], ret: 't.startsWith("app")' },
        py: { stmts: ['t=Trie()', 't.insert("apple")'], ret: 't.starts_with("app")' },
        java: { stmts: ['Trie t = new Trie(); t.insert("apple");'], ret: 't.startsWith("app")' },
        cpp: { stmts: ['Trie t; t.insert("apple");'], ret: 't.startsWith("app")' },
        cs: { stmts: ['var t = new Trie(); t.Insert("apple");'], ret: 't.StartsWith("app")' },
      },
    ],
  },
  'add-search-words-211': {
    tests: [
      {
        expect: true,
        js: { stmts: ['const w=new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("bad")' },
        py: { stmts: ['w=WordDictionary()', 'w.add_word("bad")', 'w.add_word("dad")', 'w.add_word("mad")'], ret: 'w.search("bad")' },
        java: { stmts: ['WordDictionary w = new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("bad")' },
        cpp: { stmts: ['WordDictionary w; w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("bad")' },
        cs: { stmts: ['var w = new WordDictionary(); w.AddWord("bad"); w.AddWord("dad"); w.AddWord("mad");'], ret: 'w.Search("bad")' },
      },
      {
        expect: false,
        js: { stmts: ['const w=new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("pad")' },
        py: { stmts: ['w=WordDictionary()', 'w.add_word("bad")', 'w.add_word("dad")', 'w.add_word("mad")'], ret: 'w.search("pad")' },
        java: { stmts: ['WordDictionary w = new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("pad")' },
        cpp: { stmts: ['WordDictionary w; w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search("pad")' },
        cs: { stmts: ['var w = new WordDictionary(); w.AddWord("bad"); w.AddWord("dad"); w.AddWord("mad");'], ret: 'w.Search("pad")' },
      },
      {
        expect: true,
        js: { stmts: ['const w=new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search(".ad")' },
        py: { stmts: ['w=WordDictionary()', 'w.add_word("bad")', 'w.add_word("dad")', 'w.add_word("mad")'], ret: 'w.search(".ad")' },
        java: { stmts: ['WordDictionary w = new WordDictionary(); w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search(".ad")' },
        cpp: { stmts: ['WordDictionary w; w.addWord("bad"); w.addWord("dad"); w.addWord("mad");'], ret: 'w.search(".ad")' },
        cs: { stmts: ['var w = new WordDictionary(); w.AddWord("bad"); w.AddWord("dad"); w.AddWord("mad");'], ret: 'w.Search(".ad")' },
      },
    ],
  },
  'word-search-ii-212': {
    tests: [
      {
        expect: ['eat', 'oath'], norm: 'sortDeep',
        js: 'findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],["oath","pea","eat","rain"])',
        py: 'find_words([["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"])',
        java: 'new Solution().findWords(new char[][]{{"o".charAt(0),"a".charAt(0),"a".charAt(0),"n".charAt(0)},{"e".charAt(0),"t".charAt(0),"a".charAt(0),"e".charAt(0)},{"i".charAt(0),"h".charAt(0),"k".charAt(0),"r".charAt(0)},{"i".charAt(0),"f".charAt(0),"l".charAt(0),"v".charAt(0)}},new String[]{"oath","pea","eat","rain"})',
        cpp: { stmts: ['vector<vector<char>> b = {{\'o\',\'a\',\'a\',\'n\'},{\'e\',\'t\',\'a\',\'e\'},{\'i\',\'h\',\'k\',\'r\'},{\'i\',\'f\',\'l\',\'v\'}}; vector<string> w = {"oath","pea","eat","rain"};'], ret: 'Solution().findWords(b,w)' },
        cs: 'new Sol().FindWords(new char[][]{new char[]{\'o\',\'a\',\'a\',\'n\'},new char[]{\'e\',\'t\',\'a\',\'e\'},new char[]{\'i\',\'h\',\'k\',\'r\'},new char[]{\'i\',\'f\',\'l\',\'v\'}},new string[]{"oath","pea","eat","rain"})',
      },
      {
        expect: ['a'], norm: 'sortDeep',
        js: 'findWords([["a"]],["a","b"])',
        py: 'find_words([["a"]], ["a", "b"])',
        java: 'new Solution().findWords(new char[][]{{"a".charAt(0)}},new String[]{"a","b"})',
        cpp: { stmts: ['vector<vector<char>> b = {{\'a\'}}; vector<string> w = {"a","b"};'], ret: 'Solution().findWords(b,w)' },
        cs: 'new Sol().FindWords(new char[][]{new char[]{\'a\'}},new string[]{"a","b"})',
      },
    ],
  },
};
