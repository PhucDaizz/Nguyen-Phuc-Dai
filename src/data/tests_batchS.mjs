// Smoke tests mẫu (S = sample). Các batch A-F theo file riêng.
export const TESTS = {
  'two-sum-1': {
    tests: [
      {
        expect: [0, 1],
        js: 'twoSum([2,7,11,15],9)',
        py: 'two_sum([2, 7, 11, 15], 9)',
        java: 'new Solution().twoSum(new int[]{2,7,11,15},9)',
        cpp: { stmts: ['vector<int> a = {2,7,11,15};'], ret: 'Solution().twoSum(a,9)' },
        cs: 'new Sol().TwoSum(new int[]{2,7,11,15},9)',
      },
      {
        expect: [1, 2],
        js: 'twoSum([3,2,4],6)',
        py: 'two_sum([3, 2, 4], 6)',
        java: 'new Solution().twoSum(new int[]{3,2,4},6)',
        cpp: { stmts: ['vector<int> a = {3,2,4};'], ret: 'Solution().twoSum(a,6)' },
        cs: 'new Sol().TwoSum(new int[]{3,2,4},6)',
      },
    ],
  },
  'rotate-image-48': {
    tests: [
      {
        expect: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
        js: '((a)=>{rotate(a);return a;})([[1,2,3],[4,5,6],[7,8,9]])',
        py: '((lambda a: (rotate(a), a)[1])([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))',
        java: { stmts: ['int[][] a = {{1,2,3},{4,5,6},{7,8,9}}; new Solution().rotate(a);'], ret: 'a' },
        cpp: { stmts: ['vector<vector<int>> a = {{1,2,3},{4,5,6},{7,8,9}}; Solution().rotate(a);'], ret: 'a' },
        cs: { stmts: ['int[][] a = new int[][]{new int[]{1,2,3},new int[]{4,5,6},new int[]{7,8,9}}; new Sol().Rotate(a);'], ret: 'a' },
      },
    ],
  },
  'find-median-295': {
    tests: [
      {
        expect: 1.5, tol: 1e-9,
        js: '(()=>{const m=new MedianFinder();m.addNum(1);m.addNum(2);return m.findMedian();})()',
        py: '((lambda: (lambda m: (m.add_num(1), m.add_num(2), m.find_median())[2])(MedianFinder()))())',
        java: { stmts: ['MedianFinder m = new MedianFinder(); m.addNum(1); m.addNum(2);'], ret: 'm.findMedian()' },
        cpp: { stmts: ['MedianFinder m; m.addNum(1); m.addNum(2);'], ret: 'm.findMedian()' },
        cs: { stmts: ['var m = new MedianFinder(); m.AddNum(1); m.AddNum(2);'], ret: 'm.FindMedian()' },
      },
    ],
  },
  'merge-two-lists-21': {
    tests: [
      {
        expect: [1, 1, 2, 3, 4, 4],
        js: 'A(mergeTwoLists(L([1,2,4]),L([1,3,4])))',
        py: 'A(merge_two_lists(L([1, 2, 4]), L([1, 3, 4])))',
        java: 'A(new Solution().mergeTwoLists(L(1,2,4),L(1,3,4)))',
        cpp: 'A(Solution().mergeTwoLists(L({1,2,4}),L({1,3,4})))',
        cs: 'H.A(new Sol().MergeTwoLists(H.L(new int[]{1,2,4}),H.L(new int[]{1,3,4})))',
      },
    ],
  },
  'set-zeroes-73': {
    tests: [
      {
        expect: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
        js: '((a)=>{setZeroes(a);return a;})([[1,1,1],[1,0,1],[1,1,1]])',
        py: '((lambda a: (set_zeroes(a), a)[1])([[1, 1, 1], [1, 0, 1], [1, 1, 1]]))',
        java: { stmts: ['int[][] a = {{1,1,1},{1,0,1},{1,1,1}}; new Solution().setZeroes(a);'], ret: 'a' },
        cpp: { stmts: ['vector<vector<int>> a = {{1,1,1},{1,0,1},{1,1,1}}; Solution().setZeroes(a);'], ret: 'a' },
        cs: { stmts: ['int[][] a = new int[][]{new int[]{1,1,1},new int[]{1,0,1},new int[]{1,1,1}}; new Sol().SetZeroes(a);'], ret: 'a' },
      },
    ],
  },
};
