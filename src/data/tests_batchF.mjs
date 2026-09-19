export const TESTS = {
  'insert-interval-57': {
    tests: [
      {
        expect: [[1, 5], [6, 9]],
        js: 'insert([[1,3],[6,9]],[2,5])',
        py: 'insert([[1, 3], [6, 9]], [2, 5])',
        java: 'new Solution().insert(new int[][]{{1,3},{6,9}}, new int[]{2,5})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,3},{6,9}};', 'vector<int> b = {2,5};'], ret: 'Solution().insert(a,b)' },
        cs: 'new Sol().Insert(new int[][]{new int[]{1,3},new int[]{6,9}}, new int[]{2,5})',
      },
      {
        expect: [[1, 2], [3, 10], [12, 16]],
        js: 'insert([[1,2],[3,5],[6,7],[8,10],[12,16]],[4,8])',
        py: 'insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])',
        java: 'new Solution().insert(new int[][]{{1,2},{3,5},{6,7},{8,10},{12,16}}, new int[]{4,8})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,2},{3,5},{6,7},{8,10},{12,16}};', 'vector<int> b = {4,8};'], ret: 'Solution().insert(a,b)' },
        cs: 'new Sol().Insert(new int[][]{new int[]{1,2},new int[]{3,5},new int[]{6,7},new int[]{8,10},new int[]{12,16}}, new int[]{4,8})',
      },
      {
        expect: [[5, 7]],
        js: 'insert([],[5,7])',
        py: 'insert([], [5, 7])',
        java: 'new Solution().insert(new int[][]{}, new int[]{5,7})',
        cpp: { stmts: ['vector<vector<int>> a = {};', 'vector<int> b = {5,7};'], ret: 'Solution().insert(a,b)' },
        cs: 'new Sol().Insert(new int[][]{}, new int[]{5,7})',
      },
    ],
  },
  'merge-intervals-56': {
    tests: [
      {
        expect: [[1, 6], [8, 10], [15, 18]],
        js: 'merge([[1,3],[2,6],[8,10],[15,18]])',
        py: 'merge([[1, 3], [2, 6], [8, 10], [15, 18]])',
        java: 'new Solution().merge(new int[][]{{1,3},{2,6},{8,10},{15,18}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,3},{2,6},{8,10},{15,18}};'], ret: 'Solution().merge(a)' },
        cs: 'new Sol().Merge(new int[][]{new int[]{1,3},new int[]{2,6},new int[]{8,10},new int[]{15,18}})',
      },
      {
        expect: [[1, 5]],
        js: 'merge([[1,4],[4,5]])',
        py: 'merge([[1, 4], [4, 5]])',
        java: 'new Solution().merge(new int[][]{{1,4},{4,5}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,4},{4,5}};'], ret: 'Solution().merge(a)' },
        cs: 'new Sol().Merge(new int[][]{new int[]{1,4},new int[]{4,5}})',
      },
    ],
  },
  'non-overlapping-435': {
    tests: [
      {
        expect: 1,
        js: 'eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])',
        py: 'erase_overlap_intervals([[1, 2], [2, 3], [3, 4], [1, 3]])',
        java: 'new Solution().eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,2},{2,3},{3,4},{1,3}};'], ret: 'Solution().eraseOverlapIntervals(a)' },
        cs: 'new Sol().EraseOverlapIntervals(new int[][]{new int[]{1,2},new int[]{2,3},new int[]{3,4},new int[]{1,3}})',
      },
      {
        expect: 2,
        js: 'eraseOverlapIntervals([[1,2],[1,2],[1,2]])',
        py: 'erase_overlap_intervals([[1, 2], [1, 2], [1, 2]])',
        java: 'new Solution().eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,2},{1,2},{1,2}};'], ret: 'Solution().eraseOverlapIntervals(a)' },
        cs: 'new Sol().EraseOverlapIntervals(new int[][]{new int[]{1,2},new int[]{1,2},new int[]{1,2}})',
      },
    ],
  },
  'meeting-rooms-252': {
    tests: [
      {
        expect: false,
        js: 'canAttendMeetings([[0,30],[5,10],[15,20]])',
        py: 'can_attend_meetings([[0, 30], [5, 10], [15, 20]])',
        java: 'new Solution().canAttendMeetings(new int[][]{{0,30},{5,10},{15,20}})',
        cpp: { stmts: ['vector<vector<int>> a = {{0,30},{5,10},{15,20}};'], ret: 'Solution().canAttendMeetings(a)' },
        cs: 'new Sol().CanAttendMeetings(new int[][]{new int[]{0,30},new int[]{5,10},new int[]{15,20}})',
      },
      {
        expect: true,
        js: 'canAttendMeetings([[7,10],[2,4]])',
        py: 'can_attend_meetings([[7, 10], [2, 4]])',
        java: 'new Solution().canAttendMeetings(new int[][]{{7,10},{2,4}})',
        cpp: { stmts: ['vector<vector<int>> a = {{7,10},{2,4}};'], ret: 'Solution().canAttendMeetings(a)' },
        cs: 'new Sol().CanAttendMeetings(new int[][]{new int[]{7,10},new int[]{2,4}})',
      },
    ],
  },
  'meeting-rooms-ii-253': {
    tests: [
      {
        expect: 2,
        js: 'minMeetingRooms([[0,30],[5,10],[15,20]])',
        py: 'min_meeting_rooms([[0, 30], [5, 10], [15, 20]])',
        java: 'new Solution().minMeetingRooms(new int[][]{{0,30},{5,10},{15,20}})',
        cpp: { stmts: ['vector<vector<int>> a = {{0,30},{5,10},{15,20}};'], ret: 'Solution().minMeetingRooms(a)' },
        cs: 'new Sol().MinMeetingRooms(new int[][]{new int[]{0,30},new int[]{5,10},new int[]{15,20}})',
      },
      {
        expect: 1,
        js: 'minMeetingRooms([[7,10],[2,4]])',
        py: 'min_meeting_rooms([[7, 10], [2, 4]])',
        java: 'new Solution().minMeetingRooms(new int[][]{{7,10},{2,4}})',
        cpp: { stmts: ['vector<vector<int>> a = {{7,10},{2,4}};'], ret: 'Solution().minMeetingRooms(a)' },
        cs: 'new Sol().MinMeetingRooms(new int[][]{new int[]{7,10},new int[]{2,4}})',
      },
    ],
  },
  'sum-two-integers-371': {
    tests: [
      {
        expect: 3,
        js: 'getSum(1,2)',
        py: 'get_sum(1, 2)',
        java: 'new Solution().getSum(1,2)',
        cpp: 'Solution().getSum(1,2)',
        cs: 'new Sol().GetSum(1,2)',
      },
      {
        expect: 1,
        js: 'getSum(-2,3)',
        py: 'get_sum(-2, 3)',
        java: 'new Solution().getSum(-2,3)',
        cpp: 'Solution().getSum(-2,3)',
        cs: 'new Sol().GetSum(-2,3)',
      },
    ],
  },
  'number-of-1-bits-191': {
    tests: [
      {
        expect: 3,
        js: 'hammingWeight(11)',
        py: 'hamming_weight(11)',
        java: 'new Solution().hammingWeight(11)',
        cpp: 'Solution().hammingWeight(11)',
        cs: 'new Sol().HammingWeight(11)',
      },
      {
        expect: 1,
        js: 'hammingWeight(128)',
        py: 'hamming_weight(128)',
        java: 'new Solution().hammingWeight(128)',
        cpp: 'Solution().hammingWeight(128)',
        cs: 'new Sol().HammingWeight(128)',
      },
      {
        expect: 32,
        js: 'hammingWeight(-1)',
        py: 'hamming_weight(-1)',
        java: 'new Solution().hammingWeight(-1)',
        cpp: 'Solution().hammingWeight(-1)',
        cs: 'new Sol().HammingWeight(unchecked((uint)-1))',
      },
    ],
  },
  'counting-bits-338': {
    tests: [
      {
        expect: [0, 1, 1],
        js: 'countBits(2)',
        py: 'count_bits(2)',
        java: 'new Solution().countBits(2)',
        cpp: 'Solution().countBits(2)',
        cs: 'new Sol().CountBits(2)',
      },
      {
        expect: [0, 1, 1, 2, 1, 2],
        js: 'countBits(5)',
        py: 'count_bits(5)',
        java: 'new Solution().countBits(5)',
        cpp: 'Solution().countBits(5)',
        cs: 'new Sol().CountBits(5)',
      },
    ],
  },
  'missing-number-268': {
    tests: [
      {
        expect: 2,
        js: 'missingNumber([3,0,1])',
        py: 'missing_number([3, 0, 1])',
        java: 'new Solution().missingNumber(new int[]{3,0,1})',
        cpp: { stmts: ['vector<int> a = {3,0,1};'], ret: 'Solution().missingNumber(a)' },
        cs: 'new Sol().MissingNumber(new int[]{3,0,1})',
      },
      {
        expect: 2,
        js: 'missingNumber([0,1])',
        py: 'missing_number([0, 1])',
        java: 'new Solution().missingNumber(new int[]{0,1})',
        cpp: { stmts: ['vector<int> a = {0,1};'], ret: 'Solution().missingNumber(a)' },
        cs: 'new Sol().MissingNumber(new int[]{0,1})',
      },
      {
        expect: 8,
        js: 'missingNumber([9,6,4,2,3,5,7,0,1])',
        py: 'missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1])',
        java: 'new Solution().missingNumber(new int[]{9,6,4,2,3,5,7,0,1})',
        cpp: { stmts: ['vector<int> a = {9,6,4,2,3,5,7,0,1};'], ret: 'Solution().missingNumber(a)' },
        cs: 'new Sol().MissingNumber(new int[]{9,6,4,2,3,5,7,0,1})',
      },
    ],
  },
  'reverse-bits-190': {
    tests: [
      {
        expect: 964176192,
        js: 'reverseBits(43261596)',
        py: 'reverse_bits(43261596)',
        java: 'new Solution().reverseBits(43261596)',
        cpp: 'Solution().reverseBits(43261596)',
        cs: 'new Sol().ReverseBits(43261596)',
      },
      {
        expect: 0,
        js: 'reverseBits(0)',
        py: 'reverse_bits(0)',
        java: 'new Solution().reverseBits(0)',
        cpp: 'Solution().reverseBits(0)',
        cs: 'new Sol().ReverseBits(0)',
      },
    ],
  },
  'spiral-matrix-54': {
    tests: [
      {
        expect: [1, 2, 3, 6, 9, 8, 7, 4, 5],
        js: 'spiralOrder([[1,2,3],[4,5,6],[7,8,9]])',
        py: 'spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]])',
        java: 'new Solution().spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,2,3},{4,5,6},{7,8,9}};'], ret: 'Solution().spiralOrder(a)' },
        cs: 'new Sol().SpiralOrder(new int[][]{new int[]{1,2,3},new int[]{4,5,6},new int[]{7,8,9}})',
      },
      {
        expect: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
        js: 'spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]])',
        py: 'spiral_order([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])',
        java: 'new Solution().spiralOrder(new int[][]{{1,2,3,4},{5,6,7,8},{9,10,11,12}})',
        cpp: { stmts: ['vector<vector<int>> a = {{1,2,3,4},{5,6,7,8},{9,10,11,12}};'], ret: 'Solution().spiralOrder(a)' },
        cs: 'new Sol().SpiralOrder(new int[][]{new int[]{1,2,3,4},new int[]{5,6,7,8},new int[]{9,10,11,12}})',
      },
    ],
  },
  'binary-search-704': {
    tests: [
      {
        expect: 4,
        js: 'search([-1,0,3,5,9,12],9)',
        py: 'search([-1, 0, 3, 5, 9, 12], 9)',
        java: 'new Solution().search(new int[]{-1,0,3,5,9,12},9)',
        cpp: { stmts: ['vector<int> a = {-1,0,3,5,9,12};'], ret: 'Solution().search(a,9)' },
        cs: 'new Sol().Search(new int[]{-1,0,3,5,9,12},9)',
      },
      {
        expect: -1,
        js: 'search([-1,0,3,5,9,12],2)',
        py: 'search([-1, 0, 3, 5, 9, 12], 2)',
        java: 'new Solution().search(new int[]{-1,0,3,5,9,12},2)',
        cpp: { stmts: ['vector<int> a = {-1,0,3,5,9,12};'], ret: 'Solution().search(a,2)' },
        cs: 'new Sol().Search(new int[]{-1,0,3,5,9,12},2)',
      },
    ],
  },
};
