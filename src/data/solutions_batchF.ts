import type { LineMap, SolutionLang } from './solutions';

export const BATCHF_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'insert-interval-57': {
    ts: `function insert(intervals: number[][], newInterval: number[]): number[][] {
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
    csharp: `public int[][] Insert(int[][] intervals, int[] nw) {
    var res = new List<int[]>();
    int i = 0;
    while (i < intervals.Length && intervals[i][1] < nw[0])
        res.Add(intervals[i++]);
    while (i < intervals.Length && intervals[i][0] <= nw[1]) {
        nw = new[] { Math.Min(nw[0], intervals[i][0]),
                     Math.Max(nw[1], intervals[i][1]) };
        i++;
    }
    res.Add(nw);
    while (i < intervals.Length) res.Add(intervals[i++]);
    return res.ToArray();
}`,
    python: `def insert(intervals, nw):
    res = []
    i = 0
    while i < len(intervals) and intervals[i][1] < nw[0]:
        res.append(intervals[i]); i += 1
    while i < len(intervals) and intervals[i][0] <= nw[1]:
        nw = [min(nw[0], intervals[i][0]), max(nw[1], intervals[i][1])]
        i += 1
    res.append(nw)
    while i < len(intervals): res.append(intervals[i]); i += 1
    return res`,
    java: `class Solution {
    public int[][] insert(int[][] intervals, int[] nw) {
        List<int[]> res = new ArrayList<>();
        int i = 0;
        while (i < intervals.length && intervals[i][1] < nw[0]) res.add(intervals[i++]);
        while (i < intervals.length && intervals[i][0] <= nw[1]) {
            nw = new int[]{Math.min(nw[0], intervals[i][0]), Math.max(nw[1], intervals[i][1])};
            i++;
        }
        res.add(nw);
        while (i < intervals.length) res.add(intervals[i++]);
        return res.toArray(new int[0][]);
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int> nw) {
        vector<vector<int>> res;
        int i = 0;
        while (i < (int)intervals.size() && intervals[i][1] < nw[0]) res.push_back(intervals[i++]);
        while (i < (int)intervals.size() && intervals[i][0] <= nw[1]) {
            nw = {min(nw[0], intervals[i][0]), max(nw[1], intervals[i][1])};
            i++;
        }
        res.push_back(nw);
        while (i < (int)intervals.size()) res.push_back(intervals[i++]);
        return res;
    }
};`,
    js: `function insert(intervals, newInterval) {
  const res = [];
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
  },
  'merge-intervals-56': {
    ts: `function merge(intervals: number[][]): number[][] {
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
    csharp: `public int[][] Merge(int[][] intervals) {
    Array.Sort(intervals, (a, b) => a[0] - b[0]);
    var res = new List<int[]> { intervals[0] };
    for (int i = 1; i < intervals.Length; i++) {
        int s = intervals[i][0], e = intervals[i][1];
        var last = res[^1];
        if (s <= last[1]) last[1] = Math.Max(last[1], e);
        else res.Add(new[] { s, e });
    }
    return res.ToArray();
}`,
    python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for s, e in intervals[1:]:
        last = res[-1]
        if s <= last[1]: last[1] = max(last[1], e)
        else: res.append([s, e])
    return res`,
    java: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> res = new ArrayList<>();
        res.add(intervals[0]);
        for (int i = 1; i < intervals.length; i++) {
            int s = intervals[i][0], e = intervals[i][1];
            int[] last = res.get(res.size() - 1);
            if (s <= last[1]) last[1] = Math.max(last[1], e);
            else res.add(new int[]{s, e});
        }
        return res.toArray(new int[0][]);
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res = {intervals[0]};
        for (int i = 1; i < (int)intervals.size(); i++) {
            int s = intervals[i][0], e = intervals[i][1];
            auto& last = res.back();
            if (s <= last[1]) last[1] = max(last[1], e);
            else res.push_back({s, e});
        }
        return res;
    }
};`,
    js: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    const last = res[res.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else res.push([s, e]);
  }
  return res;
}`,
  },
  'non-overlapping-435': {
    ts: `function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}`,
    csharp: `public int EraseOverlapIntervals(int[][] intervals) {
    Array.Sort(intervals, (a, b) => a[1] - b[1]);
    int removed = 0;
    int end = int.MinValue;
    foreach (var (s, e) in intervals.Select(p => (p[0], p[1]))) {
        if (s >= end) end = e;
        else removed++;
    }
    return removed;
}`,
    python: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    removed = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end: end = e
        else: removed += 1
    return removed`,
    java: `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
        int removed = 0;
        int end = Integer.MIN_VALUE;
        for (int[] p : intervals) {
            if (p[0] >= end) end = p[1];
            else removed++;
        }
        return removed;
    }
}`,
    cpp: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
        int removed = 0;
        int end = INT_MIN;
        for (auto& p : intervals) {
            if (p[0] >= end) end = p[1];
            else removed++;
        }
        return removed;
    }
};`,
    js: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}`,
  },
  'meeting-rooms-252': {
    ts: `function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    csharp: `public bool CanAttendMeetings(int[][] intervals) {
    Array.Sort(intervals, (a, b) => a[0] - b[0]);
    for (int i = 1; i < intervals.Length; i++)
        if (intervals[i][0] < intervals[i-1][1]) return false;
    return true;
}`,
    python: `def can_attend_meetings(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]: return False
    return True`,
    java: `class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        for (int i = 1; i < intervals.length; i++)
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        return true;
    }
}`,
    cpp: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        for (int i = 1; i < (int)intervals.size(); i++)
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        return true;
    }
};`,
    js: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
  },
  'meeting-rooms-ii-253': {
    ts: `function minMeetingRooms(intervals: number[][]): number {
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
    csharp: `public int MinMeetingRooms(int[][] intervals) {
    var ev = new List<(int t, int d)>();
    foreach (var (s, e) in intervals.Select(p => (p[0], p[1]))) {
        ev.Add((s, 1));
        ev.Add((e, -1));
    }
    ev.Sort((a, b) => a.t != b.t ? a.t - b.t : a.d - b.d);
    int cur = 0, best = 0;
    foreach (var (_, d) in ev) {
        cur += d;
        best = Math.Max(best, cur);
    }
    return best;
}`,
    python: `def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort(key=lambda x: (x[0], x[1]))
    cur = best = 0
    for _, d in events:
        cur += d
        best = max(best, cur)
    return best`,
    java: `class Solution {
    public int minMeetingRooms(int[][] intervals) {
        List<int[]> events = new ArrayList<>();
        for (int[] p : intervals) {
            events.add(new int[]{p[0], 1});
            events.add(new int[]{p[1], -1});
        }
        events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        int cur = 0, best = 0;
        for (int[] e : events) {
            cur += e[1];
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        vector<pair<int,int>> ev;
        for (auto& p : intervals) {
            ev.emplace_back(p[0], 1);
            ev.emplace_back(p[1], -1);
        }
        sort(ev.begin(), ev.end());
        int cur = 0, best = 0;
        for (auto& [t, d] : ev) {
            cur += d;
            best = max(best, cur);
        }
        return best;
    }
};`,
    js: `function minMeetingRooms(intervals) {
  const events = [];
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
  },
  'sum-two-integers-371': {
    ts: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
    csharp: `public int GetSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
    python: `def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX = 0x7FFFFFFF
    a &= MASK; b &= MASK
    while b != 0:
        carry = ((a & b) << 1) & MASK
        a = (a ^ b) & MASK
        b = carry
    return a if a <= MAX else ~(a ^ MASK)`,
    java: `class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
}`,
    cpp: `class Solution {
public:
    int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
};`,
    js: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
  },
  'number-of-1-bits-191': {
    ts: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
    csharp: `public int HammingWeight(uint n) {
    int count = 0;
    while (n != 0) {
        n &= n - 1;
        count++;
    }
    return count;
}`,
    python: `def hamming_weight(n):
    n &= 0xFFFFFFFF
    count = 0
    while n != 0:
        n &= n - 1
        count += 1
    return count`,
    java: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        return count;
    }
}`,
    cpp: `class Solution {
public:
    int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        return count;
    }
};`,
    js: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
  },
  'counting-bits-338': {
    ts: `function countBits(n: number): number[] {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
    csharp: `public int[] CountBits(int n) {
    var dp = new int[n + 1];
    for (int i = 1; i <= n; i++)
        dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}`,
    python: `def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
    java: `class Solution {
    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++)
            dp[i] = dp[i >> 1] + (i & 1);
        return dp;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= n; i++)
            dp[i] = dp[i >> 1] + (i & 1);
        return dp;
    }
};`,
    js: `function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
  },
  'missing-number-268': {
    ts: `function missingNumber(nums: number[]): number {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
    csharp: `public int MissingNumber(int[] nums) {
    int xor = nums.Length;
    for (int i = 0; i < nums.Length; i++)
        xor ^= i ^ nums[i];
    return xor;
}`,
    python: `def missing_number(nums):
    xor = len(nums)
    for i, v in enumerate(nums):
        xor ^= i ^ v
    return xor`,
    java: `class Solution {
    public int missingNumber(int[] nums) {
        int xor = nums.length;
        for (int i = 0; i < nums.length; i++)
            xor ^= i ^ nums[i];
        return xor;
    }
}`,
    cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int xr = nums.size();
        for (int i = 0; i < (int)nums.size(); i++)
            xr ^= i ^ nums[i];
        return xr;
    }
};`,
    js: `function missingNumber(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
  },
  'reverse-bits-190': {
    ts: `function reverseBits(n: number): number {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}`,
    csharp: `public uint ReverseBits(uint n) {
    uint res = 0;
    for (int i = 0; i < 32; i++) {
        res = (res << 1) | (n & 1);
        n >>= 1;
    }
    return res;
}`,
    python: `def reverse_bits(n):
    res = 0
    for _ in range(32):
        res = (res << 1) | (n & 1)
        n >>= 1
    return res`,
    java: `class Solution {
    public int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>>= 1;
        }
        return res;
    }
}`,
    cpp: `class Solution {
public:
    int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>= 1;
        }
        return res;
    }
};`,
    js: `function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}`,
  },
  'rotate-image-48': {
    ts: `function rotate(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
}`,
    csharp: `public void Rotate(int[][] m) {
    int n = m.Length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            (m[i][j], m[j][i]) = (m[j][i], m[i][j]);
    foreach (var row in m)
        Array.Reverse(row);
}`,
    python: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()`,
    java: `class Solution {
    public void rotate(int[][] m) {
        int n = m.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
            }
        for (int[] row : m) reverse(row);
    }
    private void reverse(int[] r) { int a = 0, b = r.length - 1; while (a < b) { int t = r[a]; r[a++] = r[b]; r[b--] = t; } }
}`,
    cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& m) {
        int n = m.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(m[i][j], m[j][i]);
        for (auto& row : m) reverse(row.begin(), row.end());
    }
};`,
    js: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
}`,
  },
  'spiral-matrix-54': {
    ts: `function spiralOrder(matrix: number[][]): number[] {
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
    csharp: `public IList<int> SpiralOrder(int[][] m) {
    var res = new List<int>();
    int top = 0, bot = m.Length - 1;
    int left = 0, right = m[0].Length - 1;
    while (top <= bot && left <= right) {
        for (int c = left; c <= right; c++) res.Add(m[top][c]);
        top++;
        for (int r = top; r <= bot; r++) res.Add(m[r][right]);
        right--;
        if (top <= bot) {
            for (int c = right; c >= left; c--) res.Add(m[bot][c]);
            bot--;
        }
        if (left <= right) {
            for (int r = bot; r >= top; r--) res.Add(m[r][left]);
            left++;
        }
    }
    return res;
}`,
    python: `def spiral_order(matrix):
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1): res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1): res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1): res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1): res.append(matrix[r][left])
            left += 1
    return res`,
    java: `class Solution {
    public List<Integer> spiralOrder(int[][] m) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bot = m.length - 1;
        int left = 0, right = m[0].length - 1;
        while (top <= bot && left <= right) {
            for (int c = left; c <= right; c++) res.add(m[top][c]);
            top++;
            for (int r = top; r <= bot; r++) res.add(m[r][right]);
            right--;
            if (top <= bot) {
                for (int c = right; c >= left; c--) res.add(m[bot][c]);
                bot--;
            }
            if (left <= right) {
                for (int r = bot; r >= top; r--) res.add(m[r][left]);
                left++;
            }
        }
        return res;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& m) {
        vector<int> res;
        int top = 0, bot = (int)m.size() - 1;
        int left = 0, right = (int)m[0].size() - 1;
        while (top <= bot && left <= right) {
            for (int c = left; c <= right; c++) res.push_back(m[top][c]);
            top++;
            for (int r = top; r <= bot; r++) res.push_back(m[r][right]);
            right--;
            if (top <= bot) {
                for (int c = right; c >= left; c--) res.push_back(m[bot][c]);
                bot--;
            }
            if (left <= right) {
                for (int r = bot; r >= top; r--) res.push_back(m[r][left]);
                left++;
            }
        }
        return res;
    }
};`,
    js: `function spiralOrder(matrix) {
  const res = [];
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
  },
  'set-zeroes-73': {
    ts: `function setZeroes(matrix: number[][]): void {
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
    csharp: `public void SetZeroes(int[][] m) {
    int R = m.Length, C = m[0].Length;
    bool fr = false, fc = false;
    for (int c = 0; c < C; c++) if (m[0][c] == 0) fr = true;
    for (int r = 0; r < R; r++) if (m[r][0] == 0) fc = true;
    for (int r = 1; r < R; r++)
        for (int c = 1; c < C; c++)
            if (m[r][c] == 0) {
                m[r][0] = 0;
                m[0][c] = 0;
            }
    for (int r = 1; r < R; r++)
        for (int c = 1; c < C; c++)
            if (m[r][0] == 0 || m[0][c] == 0) m[r][c] = 0;
    if (fr) for (int c = 0; c < C; c++) m[0][c] = 0;
    if (fc) for (int r = 0; r < R; r++) m[r][0] = 0;
}`,
    python: `def set_zeroes(matrix):
    R, C = len(matrix), len(matrix[0])
    fr = any(matrix[0][c] == 0 for c in range(C))
    fc = any(matrix[r][0] == 0 for r in range(R))
    for r in range(1, R):
        for c in range(1, C):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0
    for r in range(1, R):
        for c in range(1, C):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if fr:
        for c in range(C): matrix[0][c] = 0
    if fc:
        for r in range(R): matrix[r][0] = 0`,
    java: `class Solution {
    public void setZeroes(int[][] m) {
        int R = m.length, C = m[0].length;
        boolean fr = false, fc = false;
        for (int c = 0; c < C; c++) if (m[0][c] == 0) fr = true;
        for (int r = 0; r < R; r++) if (m[r][0] == 0) fc = true;
        for (int r = 1; r < R; r++)
            for (int c = 1; c < C; c++)
                if (m[r][c] == 0) {
                    m[r][0] = 0;
                    m[0][c] = 0;
                }
        for (int r = 1; r < R; r++)
            for (int c = 1; c < C; c++)
                if (m[r][0] == 0 || m[0][c] == 0) m[r][c] = 0;
        if (fr) for (int c = 0; c < C; c++) m[0][c] = 0;
        if (fc) for (int r = 0; r < R; r++) m[r][0] = 0;
    }
}`,
    cpp: `class Solution {
public:
    void setZeroes(vector<vector<int>>& m) {
        int R = m.size(), C = m[0].size();
        bool fr = false, fc = false;
        for (int c = 0; c < C; c++) if (m[0][c] == 0) fr = true;
        for (int r = 0; r < R; r++) if (m[r][0] == 0) fc = true;
        for (int r = 1; r < R; r++)
            for (int c = 1; c < C; c++)
                if (m[r][c] == 0) {
                    m[r][0] = 0;
                    m[0][c] = 0;
                }
        for (int r = 1; r < R; r++)
            for (int c = 1; c < C; c++)
                if (m[r][0] == 0 || m[0][c] == 0) m[r][c] = 0;
        if (fr) for (int c = 0; c < C; c++) m[0][c] = 0;
        if (fc) for (int r = 0; r < R; r++) m[r][0] = 0;
    }
};`,
    js: `function setZeroes(matrix) {
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
  },
  'binary-search-704': {
    ts: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] >= target) r = m;
    else l = m + 1;
  }
  return nums[l] === target ? l : -1;
}`,
    csharp: `public int Search(int[] nums, int target) {
    int l = 0, r = nums.Length;
    while (l < r) {
        int m = (l + r) >> 1;
        if (nums[m] >= target) r = m;
        else l = m + 1;
    }
    return (l < nums.Length && nums[l] == target) ? l : -1;
}`,
    python: `def search(nums, target):
    l, r = 0, len(nums)
    while l < r:
        m = (l + r) >> 1
        if nums[m] >= target: r = m
        else: l = m + 1
    return l if l < len(nums) and nums[l] == target else -1`,
    java: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length;
        while (l < r) {
            int m = (l + r) >> 1;
            if (nums[m] >= target) r = m;
            else l = m + 1;
        }
        return (l < nums.length && nums[l] == target) ? l : -1;
    }
}`,
    cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size();
        while (l < r) {
            int m = (l + r) >> 1;
            if (nums[m] >= target) r = m;
            else l = m + 1;
        }
        return (l < (int)nums.size() && nums[l] == target) ? l : -1;
    }
};`,
    js: `function search(nums, target) {
  let l = 0, r = nums.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] >= target) r = m;
    else l = m + 1;
  }
  return nums[l] === target ? l : -1;
}`,
  },
};

export const BINARYSEARCH_LINE_MAP: LineMap<'init' | 'visit' | 'narrow' | 'done'> = {
  csharp: { init: 1, visit: 3, narrow: 4, done: 7 },
  ts: { init: 1, visit: 3, narrow: 4, done: 7 },
  python: { init: 1, visit: 3, narrow: 4, done: 6 },
  java: { init: 2, visit: 4, narrow: 5, done: 8 },
  cpp: { init: 3, visit: 5, narrow: 6, done: 9 },
  js: { init: 1, visit: 3, narrow: 4, done: 7 },
};

export const INSERT_LINE_MAP: LineMap<'init' | 'keep' | 'merge' | 'insert' | 'done'> = {
  csharp: { init: 1, keep: 4, merge: 6, insert: 10, done: 12 },
  ts: { init: 1, keep: 4, merge: 7, insert: 13, done: 15 },
  python: { init: 1, keep: 4, merge: 6, insert: 8, done: 10 },
  java: { init: 2, keep: 4, merge: 6, insert: 9, done: 11 },
  cpp: { init: 3, keep: 5, merge: 7, insert: 10, done: 12 },
  js: { init: 1, keep: 4, merge: 7, insert: 13, done: 15 },
};

export const MERGE_LINE_MAP: LineMap<'init' | 'merge' | 'push' | 'done'> = {
  csharp: { init: 1, merge: 6, push: 7, done: 9 },
  ts: { init: 1, merge: 6, push: 7, done: 9 },
  python: { init: 1, merge: 5, push: 6, done: 7 },
  java: { init: 2, merge: 8, push: 9, done: 11 },
  cpp: { init: 3, merge: 8, push: 9, done: 11 },
  js: { init: 1, merge: 6, push: 7, done: 9 },
};

export const NONOVERLAP_LINE_MAP: LineMap<'init' | 'keep' | 'remove' | 'done'> = {
  csharp: { init: 1, keep: 5, remove: 6, done: 8 },
  ts: { init: 1, keep: 5, remove: 6, done: 8 },
  python: { init: 1, keep: 5, remove: 6, done: 7 },
  java: { init: 2, keep: 6, remove: 7, done: 9 },
  cpp: { init: 3, keep: 7, remove: 8, done: 10 },
  js: { init: 1, keep: 5, remove: 6, done: 8 },
};

export const MEETING_LINE_MAP: LineMap<'init' | 'check' | 'done'> = {
  csharp: { init: 1, check: 3, done: 4 },
  ts: { init: 1, check: 3, done: 5 },
  python: { init: 1, check: 3, done: 4 },
  java: { init: 2, check: 4, done: 5 },
  cpp: { init: 3, check: 5, done: 6 },
  js: { init: 1, check: 3, done: 5 },
};

export const MEETING2_LINE_MAP: LineMap<'init' | 'check' | 'done'> = {
  csharp: { init: 6, check: 8, done: 12 },
  ts: { init: 6, check: 9, done: 12 },
  python: { init: 5, check: 8, done: 10 },
  java: { init: 7, check: 10, done: 13 },
  cpp: { init: 8, check: 11, done: 14 },
  js: { init: 6, check: 9, done: 12 },
};

export const BITADD_LINE_MAP: LineMap<'init' | 'iter' | 'done'> = {
  csharp: { init: 1, iter: 2, done: 6 },
  ts: { init: 1, iter: 2, done: 6 },
  python: { init: 1, iter: 2, done: 8 },
  java: { init: 2, iter: 3, done: 7 },
  cpp: { init: 3, iter: 4, done: 8 },
  js: { init: 1, iter: 2, done: 6 },
};

export const HAMMING_LINE_MAP: LineMap<'init' | 'strip' | 'done'> = {
  csharp: { init: 2, strip: 3, done: 6 },
  ts: { init: 2, strip: 3, done: 6 },
  python: { init: 2, strip: 3, done: 6 },
  java: { init: 3, strip: 4, done: 7 },
  cpp: { init: 4, strip: 5, done: 8 },
  js: { init: 2, strip: 3, done: 6 },
};

export const COUNTING_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 1, calc: 3, done: 4 },
  ts: { init: 1, calc: 3, done: 5 },
  python: { init: 1, calc: 3, done: 4 },
  java: { init: 2, calc: 4, done: 5 },
  cpp: { init: 3, calc: 5, done: 6 },
  js: { init: 1, calc: 3, done: 5 },
};

export const MISSING_LINE_MAP: LineMap<'init' | 'xor' | 'done'> = {
  csharp: { init: 1, xor: 3, done: 4 },
  ts: { init: 1, xor: 3, done: 5 },
  python: { init: 1, xor: 3, done: 4 },
  java: { init: 2, xor: 4, done: 5 },
  cpp: { init: 3, xor: 5, done: 6 },
  js: { init: 1, xor: 3, done: 5 },
};

export const REVERSEBITS_LINE_MAP: LineMap<'init' | 'bit' | 'done'> = {
  csharp: { init: 2, bit: 3, done: 6 },
  ts: { init: 2, bit: 3, done: 6 },
  python: { init: 2, bit: 3, done: 5 },
  java: { init: 3, bit: 4, done: 7 },
  cpp: { init: 4, bit: 5, done: 8 },
  js: { init: 2, bit: 3, done: 6 },
};

export const ROTATE_LINE_MAP: LineMap<'init' | 'swap' | 'flip' | 'done'> = {
  csharp: { init: 1, swap: 4, flip: 6, done: 6 },
  ts: { init: 1, swap: 4, flip: 7, done: 7 },
  python: { init: 1, swap: 4, flip: 6, done: 6 },
  java: { init: 2, swap: 5, flip: 7, done: 7 },
  cpp: { init: 3, swap: 6, flip: 7, done: 7 },
  js: { init: 1, swap: 4, flip: 7, done: 7 },
};

export const SPIRAL_LINE_MAP: LineMap<'init' | 'go' | 'done'> = {
  csharp: { init: 4, go: 6, done: 18 },
  ts: { init: 4, go: 5, done: 18 },
  python: { init: 4, go: 5, done: 15 },
  java: { init: 5, go: 6, done: 19 },
  cpp: { init: 6, go: 7, done: 20 },
  js: { init: 4, go: 5, done: 18 },
};

export const ZEROES_LINE_MAP: LineMap<'init' | 'flag' | 'mark' | 'zero' | 'edge' | 'done'> = {
  csharp: { init: 1, flag: 3, mark: 8, zero: 13, edge: 14, done: 15 },
  ts: { init: 1, flag: 4, mark: 9, zero: 16, edge: 19, done: 20 },
  python: { init: 1, flag: 2, mark: 7, zero: 12, edge: 14, done: 16 },
  java: { init: 2, flag: 4, mark: 9, zero: 14, edge: 15, done: 16 },
  cpp: { init: 3, flag: 5, mark: 10, zero: 15, edge: 16, done: 17 },
  js: { init: 1, flag: 4, mark: 9, zero: 16, edge: 19, done: 20 },
};
