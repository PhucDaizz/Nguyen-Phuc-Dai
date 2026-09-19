export const TESTS = {
  'top-k-frequent-347': {
    tests: [
      {
        expect: [1, 2], norm: 'sortDeep',
        js: 'topKFrequent([1,1,1,2,2,3],2)',
        py: 'top_k_frequent([1, 1, 1, 2, 2, 3], 2)',
        java: 'new Solution().topKFrequent(new int[]{1,1,1,2,2,3},2)',
        cpp: { stmts: ['vector<int> a = {1,1,1,2,2,3};'], ret: 'Solution().topKFrequent(a,2)' },
        cs: 'new Sol().TopKFrequent(new int[]{1,1,1,2,2,3},2)',
      },
      {
        expect: [1], norm: 'sortDeep',
        js: 'topKFrequent([1],1)',
        py: 'top_k_frequent([1], 1)',
        java: 'new Solution().topKFrequent(new int[]{1},1)',
        cpp: { stmts: ['vector<int> a = {1};'], ret: 'Solution().topKFrequent(a,1)' },
        cs: 'new Sol().TopKFrequent(new int[]{1},1)',
      },
    ],
  },
  'combination-sum-39': {
    tests: [
      {
        expect: [[2, 2, 3], [7]], norm: 'sortDeep',
        js: 'combinationSum([2,3,6,7],7)',
        py: 'combination_sum([2, 3, 6, 7], 7)',
        java: 'new Solution().combinationSum(new int[]{2,3,6,7},7)',
        cpp: { stmts: ['vector<int> a = {2,3,6,7};'], ret: 'Solution().combinationSum(a,7)' },
        cs: 'new Sol().CombinationSum(new int[]{2,3,6,7},7)',
      },
      {
        expect: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], norm: 'sortDeep',
        js: 'combinationSum([2,3,5],8)',
        py: 'combination_sum([2, 3, 5], 8)',
        java: 'new Solution().combinationSum(new int[]{2,3,5},8)',
        cpp: { stmts: ['vector<int> a = {2,3,5};'], ret: 'Solution().combinationSum(a,8)' },
        cs: 'new Sol().CombinationSum(new int[]{2,3,5},8)',
      },
    ],
  },
  'word-search-79': {
    tests: [
      {
        expect: true,
        js: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED")',
        py: 'exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED")',
        java: { stmts: ["char[][] b = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};"], ret: 'new Solution().exist(b,"ABCCED")' },
        cpp: { stmts: ["vector<vector<char>> b = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};", 'string w = "ABCCED";'], ret: 'Solution().exist(b,w)' },
        cs: 'new Sol().Exist(new char[][]{new char[]{\'A\',\'B\',\'C\',\'E\'},new char[]{\'S\',\'F\',\'C\',\'S\'},new char[]{\'A\',\'D\',\'E\',\'E\'}},"ABCCED")',
      },
      {
        expect: false,
        js: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCB")',
        py: 'exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB")',
        java: { stmts: ["char[][] b = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};"], ret: 'new Solution().exist(b,"ABCB")' },
        cpp: { stmts: ["vector<vector<char>> b = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};", 'string w = "ABCB";'], ret: 'Solution().exist(b,w)' },
        cs: 'new Sol().Exist(new char[][]{new char[]{\'A\',\'B\',\'C\',\'E\'},new char[]{\'S\',\'F\',\'C\',\'S\'},new char[]{\'A\',\'D\',\'E\',\'E\'}},"ABCB")',
      },
    ],
  },
  'clone-graph-133': {
    tests: [
      {
        expect: [[2, 4], [1, 3], [2, 4], [1, 3]], norm: 'sortDeep',
        js: 'GA(cloneGraph(G([[2,4],[1,3],[2,4],[1,3]])))',
        py: 'GA(clone_graph(G([[2, 4], [1, 3], [2, 4], [1, 3]])))',
        java: 'GA(new Solution().cloneGraph(G(new int[][]{{2,4},{1,3},{2,4},{1,3}})))',
        cpp: 'RAW:GAc(Solution().cloneGraph(G({{2,4},{1,3},{2,4},{1,3}})))',
        cs: 'H.GA(new Sol().CloneGraph(H.G(new int[][]{new int[]{2,4},new int[]{1,3},new int[]{2,4},new int[]{1,3}})))',
      },
      {
        expect: [[]], norm: 'sortDeep',
        js: 'GA(cloneGraph(G([[]])))',
        py: 'GA(clone_graph(G([[]])))',
        java: 'GA(new Solution().cloneGraph(G(new int[][]{{}})))',
        cpp: 'RAW:GAc(Solution().cloneGraph(G({{}})))',
        cs: 'H.GA(new Sol().CloneGraph(H.G(new int[][]{new int[]{} })))',
      },
    ],
  },
  'course-schedule-207': {
    tests: [
      {
        expect: true,
        js: 'canFinish(2,[[1,0]])',
        py: 'can_finish(2, [[1, 0]])',
        java: 'new Solution().canFinish(2,new int[][]{{1,0}})',
        cpp: { stmts: ['vector<vector<int>> p = {{1,0}};'], ret: 'Solution().canFinish(2,p)' },
        cs: 'new Sol().CanFinish(2,new int[][]{new int[]{1,0}})',
      },
      {
        expect: false,
        js: 'canFinish(2,[[1,0],[0,1]])',
        py: 'can_finish(2, [[1, 0], [0, 1]])',
        java: 'new Solution().canFinish(2,new int[][]{{1,0},{0,1}})',
        cpp: { stmts: ['vector<vector<int>> p = {{1,0},{0,1}};'], ret: 'Solution().canFinish(2,p)' },
        cs: 'new Sol().CanFinish(2,new int[][]{new int[]{1,0},new int[]{0,1}})',
      },
    ],
  },
  'pacific-atlantic-417': {
    tests: [
      {
        expect: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]], norm: 'sortDeep',
        js: 'pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]])',
        py: 'pacific_atlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]])',
        java: 'new Solution().pacificAtlantic(new int[][]{{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}})',
        cpp: { stmts: ['vector<vector<int>> h = {{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}};'], ret: 'Solution().pacificAtlantic(h)' },
        cs: 'new Sol().PacificAtlantic(new int[][]{new int[]{1,2,2,3,5},new int[]{3,2,3,4,4},new int[]{2,4,5,3,1},new int[]{6,7,1,4,5},new int[]{5,1,1,2,4}})',
      },
      {
        expect: [[0, 0]], norm: 'sortDeep',
        js: 'pacificAtlantic([[1]])',
        py: 'pacific_atlantic([[1]])',
        java: 'new Solution().pacificAtlantic(new int[][]{{1}})',
        cpp: { stmts: ['vector<vector<int>> h = {{1}};'], ret: 'Solution().pacificAtlantic(h)' },
        cs: 'new Sol().PacificAtlantic(new int[][]{new int[]{1}})',
      },
    ],
  },
  'number-of-islands-200': {
    tests: [
      {
        expect: 1,
        js: 'numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])',
        py: 'num_islands([["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]])',
        java: { stmts: ["char[][] g = {{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};"], ret: 'new Solution().numIslands(g)' },
        cpp: { stmts: ["vector<vector<char>> g = {{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};"], ret: 'Solution().numIslands(g)' },
        cs: "new Sol().NumIslands(new char[][]{new char[]{'1','1','1','1','0'},new char[]{'1','1','0','1','0'},new char[]{'1','1','0','0','0'},new char[]{'0','0','0','0','0'}})",
      },
      {
        expect: 3,
        js: 'numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])',
        py: 'num_islands([["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]])',
        java: { stmts: ["char[][] g = {{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}};"], ret: 'new Solution().numIslands(g)' },
        cpp: { stmts: ["vector<vector<char>> g = {{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}};"], ret: 'Solution().numIslands(g)' },
        cs: "new Sol().NumIslands(new char[][]{new char[]{'1','1','0','0','0'},new char[]{'1','1','0','0','0'},new char[]{'0','0','1','0','0'},new char[]{'0','0','0','1','1'}})",
      },
    ],
  },
  'longest-consecutive-128': {
    tests: [
      {
        expect: 4,
        js: 'longestConsecutive([100,4,200,1,3,2])',
        py: 'longest_consecutive([100, 4, 200, 1, 3, 2])',
        java: 'new Solution().longestConsecutive(new int[]{100,4,200,1,3,2})',
        cpp: { stmts: ['vector<int> a = {100,4,200,1,3,2};'], ret: 'Solution().longestConsecutive(a)' },
        cs: 'new Sol().LongestConsecutive(new int[]{100,4,200,1,3,2})',
      },
      {
        expect: 9,
        js: 'longestConsecutive([0,3,7,2,5,8,4,6,0,1])',
        py: 'longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])',
        java: 'new Solution().longestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1})',
        cpp: { stmts: ['vector<int> a = {0,3,7,2,5,8,4,6,0,1};'], ret: 'Solution().longestConsecutive(a)' },
        cs: 'new Sol().LongestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1})',
      },
      {
        expect: 0,
        js: 'longestConsecutive([])',
        py: 'longest_consecutive([])',
        java: 'new Solution().longestConsecutive(new int[]{})',
        cpp: { stmts: ['vector<int> a = {};'], ret: 'Solution().longestConsecutive(a)' },
        cs: 'new Sol().LongestConsecutive(new int[]{})',
      },
    ],
  },
  'alien-dict-269': {
    tests: [
      {
        expect: 'wertf',
        js: 'alienOrder(["wrt","wrf","er","ett","rftt"])',
        py: 'alien_order(["wrt", "wrf", "er", "ett", "rftt"])',
        java: 'new Solution().alienOrder(new String[]{"wrt","wrf","er","ett","rftt"})',
        cpp: { stmts: ['vector<string> w = {"wrt","wrf","er","ett","rftt"};'], ret: 'Solution().alienOrder(w)' },
        cs: 'new Sol().AlienOrder(new string[]{"wrt","wrf","er","ett","rftt"})',
      },
      {
        expect: '',
        js: 'alienOrder(["abc","ab"])',
        py: 'alien_order(["abc", "ab"])',
        java: 'new Solution().alienOrder(new String[]{"abc","ab"})',
        cpp: { stmts: ['vector<string> w = {"abc","ab"};'], ret: 'Solution().alienOrder(w)' },
        cs: 'new Sol().AlienOrder(new string[]{"abc","ab"})',
      },
    ],
  },
  'valid-tree-261': {
    tests: [
      {
        expect: true,
        js: 'validTree(5,[[0,1],[0,2],[0,3],[1,4]])',
        py: 'valid_tree(5, [[0, 1], [0, 2], [0, 3], [1, 4]])',
        java: 'new Solution().validTree(5,new int[][]{{0,1},{0,2},{0,3},{1,4}})',
        cpp: { stmts: ['vector<vector<int>> e = {{0,1},{0,2},{0,3},{1,4}};'], ret: 'Solution().validTree(5,e)' },
        cs: 'new Sol().ValidTree(5,new int[][]{new int[]{0,1},new int[]{0,2},new int[]{0,3},new int[]{1,4}})',
      },
      {
        expect: false,
        js: 'validTree(5,[[0,1],[1,2],[2,3],[1,3],[1,4]])',
        py: 'valid_tree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]])',
        java: 'new Solution().validTree(5,new int[][]{{0,1},{1,2},{2,3},{1,3},{1,4}})',
        cpp: { stmts: ['vector<vector<int>> e = {{0,1},{1,2},{2,3},{1,3},{1,4}};'], ret: 'Solution().validTree(5,e)' },
        cs: 'new Sol().ValidTree(5,new int[][]{new int[]{0,1},new int[]{1,2},new int[]{2,3},new int[]{1,3},new int[]{1,4}})',
      },
    ],
  },
  'connected-components-323': {
    tests: [
      {
        expect: 2,
        js: 'countComponents(5,[[0,1],[1,2],[3,4]])',
        py: 'count_components(5, [[0, 1], [1, 2], [3, 4]])',
        java: 'new Solution().countComponents(5,new int[][]{{0,1},{1,2},{3,4}})',
        cpp: { stmts: ['vector<vector<int>> e = {{0,1},{1,2},{3,4}};'], ret: 'Solution().countComponents(5,e)' },
        cs: 'new Sol().CountComponents(5,new int[][]{new int[]{0,1},new int[]{1,2},new int[]{3,4}})',
      },
      {
        expect: 1,
        js: 'countComponents(5,[[0,1],[1,2],[2,3],[3,4]])',
        py: 'count_components(5, [[0, 1], [1, 2], [2, 3], [3, 4]])',
        java: 'new Solution().countComponents(5,new int[][]{{0,1},{1,2},{2,3},{3,4}})',
        cpp: { stmts: ['vector<vector<int>> e = {{0,1},{1,2},{2,3},{3,4}};'], ret: 'Solution().countComponents(5,e)' },
        cs: 'new Sol().CountComponents(5,new int[][]{new int[]{0,1},new int[]{1,2},new int[]{2,3},new int[]{3,4}})',
      },
    ],
  },
};

