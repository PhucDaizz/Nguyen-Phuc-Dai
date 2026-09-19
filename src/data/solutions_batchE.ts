// Batch E — solutions đa ngôn ngữ cho 12 bài DP.
// Quy ước theo .opencode/skills/dsa-html-style/references/multilang-solutions.md:
// - ts: COPY Y NGUYÊN guide.code trong guides.ts
// - csharp: COPY Y NGUYÊN panel CSHARP_LINES trong visualizer
// - python/java/cpp/js: dịch CÙNG thuật toán (cùng vai trò biến, cùng thứ tự xử lý)
// File này sẽ được gộp vào src/data/solutions.ts (import map từ đó trong visualizer).

import type { LineMap, SolutionLang } from './solutions';

export const BATCHE_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'house-robber-198': {
    ts: `function rob(nums: number[]): number {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    csharp: `public int Rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    foreach (int x in nums) {
        int cur = Math.Max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
    python: `def rob(nums):
    prev2 = 0
    prev1 = 0
    for x in nums:
        cur = max(prev1, prev2 + x)
        prev2 = prev1
        prev1 = cur
    return prev1`,
    java: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};`,
    js: `function rob(nums) {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
  },
  'house-robber-ii-213': {
    ts: `function rob2(nums: number[]): number {
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
    csharp: `public int Rob2(int[] nums) {
    if (nums.Length == 1) return nums[0];
    int RobRange(int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int cur = Math.Max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    return Math.Max(RobRange(0, nums.Length - 2), RobRange(1, nums.Length - 1));
}`,
    python: `def rob2(nums):
    if len(nums) == 1:
        return nums[0]
    def rob_range(l, r):
        prev2 = 0
        prev1 = 0
        for i in range(l, r + 1):
            cur = max(prev1, prev2 + nums[i])
            prev2 = prev1
            prev1 = cur
        return prev1
    return max(rob_range(0, len(nums) - 2), rob_range(1, len(nums) - 1))`,
    java: `class Solution {
    public int rob2(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
    }
    private int robRange(int[] nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    cpp: `class Solution {
public:
    int rob2(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        return max(robRange(nums, 0, (int)nums.size() - 2), robRange(nums, 1, (int)nums.size() - 1));
    }
private:
    int robRange(vector<int>& nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int cur = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};`,
    js: `function rob2(nums) {
  if (nums.length === 1) return nums[0];
  const robRange = (l, r) => {
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
  },
  'decode-ways-91': {
    ts: `function numDecodings(s: string): number {
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
    csharp: `public int NumDecodings(string s) {
    int prev2 = 1;
    int prev1 = s[0] == '0' ? 0 : 1;
    for (int i = 2; i <= s.Length; i++) {
        int cur = 0;
        if (s[i-1] != '0') cur += prev1;
        int two = int.Parse(s.Substring(i-2, 2));
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
    python: `def num_decodings(s):
    prev2 = 1
    prev1 = 0 if s[0] == '0' else 1
    for i in range(2, len(s) + 1):
        cur = 0
        if s[i - 1] != '0':
            cur += prev1
        two = int(s[i - 2:i])
        if 10 <= two <= 26:
            cur += prev2
        prev2 = prev1
        prev1 = cur
    return prev1`,
    java: `class Solution {
    public int numDecodings(String s) {
        int prev2 = 1;
        int prev1 = s.charAt(0) == '0' ? 0 : 1;
        for (int i = 2; i <= s.length(); i++) {
            int cur = 0;
            if (s.charAt(i - 1) != '0') cur += prev1;
            int two = Integer.parseInt(s.substring(i - 2, i));
            if (two >= 10 && two <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    cpp: `class Solution {
public:
    int numDecodings(string s) {
        int prev2 = 1;
        int prev1 = s[0] == '0' ? 0 : 1;
        for (int i = 2; i <= (int)s.size(); i++) {
            int cur = 0;
            if (s[i - 1] != '0') cur += prev1;
            int two = stoi(s.substr(i - 2, 2));
            if (two >= 10 && two <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};`,
    js: `function numDecodings(s) {
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
  },
  'coin-change-322': {
    ts: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x - c >= 0) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    csharp: `public int CoinChange(int[] coins, int amount) {
    const int INF = int.MaxValue / 2;
    var dp = new int[amount + 1];
    Array.Fill(dp, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        foreach (int c in coins)
            if (x - c >= 0) dp[x] = Math.Min(dp[x], dp[x - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
    python: `def coin_change(coins, amount):
    INF = 10 ** 9
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for x in range(1, amount + 1):
        for c in coins:
            if x - c >= 0:
                dp[x] = min(dp[x], dp[x - c] + 1)
    return -1 if dp[amount] >= INF else dp[amount]`,
    java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        final int INF = Integer.MAX_VALUE / 2;
        int[] dp = new int[amount + 1];
        java.util.Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int x = 1; x <= amount; x++)
            for (int c : coins)
                if (x - c >= 0) dp[x] = Math.min(dp[x], dp[x - c] + 1);
        return dp[amount] >= INF ? -1 : dp[amount];
    }
}`,
    cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        const int INF = INT_MAX / 2;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int x = 1; x <= amount; x++)
            for (int c : coins)
                if (x - c >= 0) dp[x] = min(dp[x], dp[x - c] + 1);
        return dp[amount] >= INF ? -1 : dp[amount];
    }
};`,
    js: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x - c >= 0) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  },
  'lis-300': {
    ts: `function lengthOfLIS(nums: number[]): number {
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
    csharp: `public int LengthOfLIS(int[] nums) {
    if (nums.Length == 0) return 0;
    var dp = new int[nums.Length];
    Array.Fill(dp, 1);
    int best = 1;
    for (int i = 0; i < nums.Length; i++) {
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) dp[i] = Math.Max(dp[i], dp[j] + 1);
        best = Math.Max(best, dp[i]);
    }
    return best;
}`,
    python: `def length_of_lis(nums):
    if len(nums) == 0:
        return 0
    dp = [1] * len(nums)
    best = 1
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        best = max(best, dp[i])
    return best`,
    java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        int[] dp = new int[nums.length];
        java.util.Arrays.fill(dp, 1);
        int best = 1;
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < i; j++)
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        if (nums.empty()) return 0;
        vector<int> dp(nums.size(), 1);
        int best = 1;
        for (int i = 0; i < (int)nums.size(); i++) {
            for (int j = 0; j < i; j++)
                if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
            best = max(best, dp[i]);
        }
        return best;
    }
};`,
    js: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
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
  },
  'jump-game-55': {
    ts: `function canJump(nums: number[]): boolean {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) goal = i;
  }
  return goal === 0;
}`,
    csharp: `public bool CanJump(int[] nums) {
    int goal = nums.Length - 1;
    for (int i = nums.Length - 1; i >= 0; i--) {
        if (i + nums[i] >= goal) goal = i;
    }
    return goal == 0;
}`,
    python: `def can_jump(nums):
    goal = len(nums) - 1
    for i in range(len(nums) - 1, -1, -1):
        if i + nums[i] >= goal:
            goal = i
    return goal == 0`,
    java: `class Solution {
    public boolean canJump(int[] nums) {
        int goal = nums.length - 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (i + nums[i] >= goal) goal = i;
        }
        return goal == 0;
    }
}`,
    cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int goal = (int)nums.size() - 1;
        for (int i = (int)nums.size() - 1; i >= 0; i--) {
            if (i + nums[i] >= goal) goal = i;
        }
        return goal == 0;
    }
};`,
    js: `function canJump(nums) {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) goal = i;
  }
  return goal === 0;
}`,
  },
  'word-break-139': {
    ts: `function wordBreak(s: string, wordDict: string[]): boolean {
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
    csharp: `public bool WordBreak(string s, IList<string> dict) {
    var set = new HashSet<string>(dict);
    var dp = new bool[s.Length + 1];
    dp[0] = true;
    for (int i = 1; i <= s.Length; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && set.Contains(s.Substring(j, i - j))) {
                dp[i] = true;
                break;
            }
    return dp[s.Length];
}`,
    python: `def word_break(s, word_dict):
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
    java: `class Solution {
    public boolean wordBreak(String s, java.util.List<String> wordDict) {
        java.util.Set<String> set = new java.util.HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
        return dp[s.length()];
    }
}`,
    cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> set(wordDict.begin(), wordDict.end());
        vector<char> dp(s.size() + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= (int)s.size(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && set.count(s.substr(j, i - j))) {
                    dp[i] = 1;
                    break;
                }
        return dp[s.size()];
    }
};`,
    js: `function wordBreak(s, wordDict) {
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
  },
  'climbing-stairs-70': {
    ts: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    csharp: `public int ClimbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`,
    python: `def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for i in range(3, n + 1):
        a, b = b, a + b
    return b`,
    java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`,
    js: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
  },
  'unique-paths-62': {
    ts: `function uniquePaths(m: number, n: number): number {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    csharp: `public int UniquePaths(int m, int n) {
    var dp = new int[n];
    Array.Fill(dp, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}`,
    python: `def unique_paths(m, n):
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]`,
    java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        java.util.Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];
        return dp[n - 1];
    }
}`,
    cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];
        return dp[n - 1];
    }
};`,
    js: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
  },
  'lcs-1143': {
    ts: `function longestCommonSubsequence(a: string, b: string): number {
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
    csharp: `public int LongestCommonSubsequence(string a, string b) {
    int m = a.Length, n = b.Length;
    var dp = new int[m+1, n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i,j] = a[i-1] == b[j-1]
                ? dp[i-1,j-1] + 1
                : Math.Max(dp[i-1,j], dp[i,j-1]);
    return dp[m,n];
}`,
    python: `def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    prev = [0] * (n + 1)
    cur = [0] * (n + 1)
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cur[j] = prev[j - 1] + 1 if a[i - 1] == b[j - 1] else max(prev[j], cur[j - 1])
        prev, cur = cur, prev
    return prev[n]`,
    java: `class Solution {
    public int longestCommonSubsequence(String a, String b) {
        int m = a.length(), n = b.length();
        int[] prev = new int[n + 1];
        int[] cur = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++)
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] tmp = prev; prev = cur; cur = tmp;
        }
        return prev[n];
    }
}`,
    cpp: `class Solution {
public:
    int longestCommonSubsequence(string a, string b) {
        int m = a.size(), n = b.size();
        vector<int> prev(n + 1, 0), cur(n + 1, 0);
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++)
                cur[j] = a[i - 1] == b[j - 1] ? prev[j - 1] + 1 : max(prev[j], cur[j - 1]);
            swap(prev, cur);
        }
        return prev[n];
    }
};`,
    js: `function longestCommonSubsequence(a, b) {
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
  },
  'max-subarray-53': {
    ts: `function maxSubArray(nums: number[]): number {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    csharp: `public int MaxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.Length; i++) {
        cur = Math.Max(nums[i], cur + nums[i]);
        best = Math.Max(best, cur);
    }
    return best;
}`,
    python: `def max_sub_array(nums):
    cur = nums[0]
    best = nums[0]
    for i in range(1, len(nums)):
        cur = max(nums[i], cur + nums[i])
        best = max(best, cur)
    return best`,
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            cur = max(nums[i], cur + nums[i]);
            best = max(best, cur);
        }
        return best;
    }
};`,
    js: `function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
  },
  'max-product-152': {
    ts: `function maxProduct(nums: number[]): number {
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
    csharp: `public int MaxProduct(int[] nums) {
    int curMax = nums[0], curMin = nums[0], best = nums[0];
    for (int i = 1; i < nums.Length; i++) {
        int x = nums[i];
        int[] c = { x, curMax * x, curMin * x };
        curMax = c.Max();
        curMin = c.Min();
        best = Math.Max(best, curMax);
    }
    return best;
}`,
    python: `def max_product(nums):
    cur_max = nums[0]
    cur_min = nums[0]
    best = nums[0]
    for i in range(1, len(nums)):
        x = nums[i]
        cands = [x, cur_max * x, cur_min * x]
        cur_max = max(cands)
        cur_min = min(cands)
        best = max(best, cur_max)
    return best`,
    java: `class Solution {
    public int maxProduct(int[] nums) {
        int curMax = nums[0], curMin = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            int[] c = { x, curMax * x, curMin * x };
            curMax = java.util.Arrays.stream(c).max().getAsInt();
            curMin = java.util.Arrays.stream(c).min().getAsInt();
            best = Math.max(best, curMax);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int curMax = nums[0], curMin = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            int x = nums[i];
            int cands[3] = { x, curMax * x, curMin * x };
            curMax = max({cands[0], cands[1], cands[2]});
            curMin = min({cands[0], cands[1], cands[2]});
            best = max(best, curMax);
        }
        return best;
    }
};`,
    js: `function maxProduct(nums) {
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
  },
};

// ===================== LINE MAPS (Batch E) =====================
// csharp = copy y nguyên codeLine cũ của visualizer; các ngôn ngữ khác đếm 0-based.

export const ROBBER_LINE_MAP: LineMap<'init' | 'house' | 'done'> = {
  csharp: { init: 1, house: 3, done: 7 },
  ts: { init: 1, house: 4, done: 8 },
  python: { init: 1, house: 4, done: 7 },
  java: { init: 2, house: 4, done: 8 },
  cpp: { init: 3, house: 5, done: 9 },
  js: { init: 1, house: 4, done: 8 },
};

export const ROBBER2_LINE_MAP: LineMap<'init' | 'house' | 'runEnd' | 'done'> = {
  csharp: { init: 1, house: 5, runEnd: 11, done: 11 },
  ts: { init: 1, house: 5, runEnd: 11, done: 11 },
  python: { init: 1, house: 7, runEnd: 11, done: 11 },
  java: { init: 2, house: 8, runEnd: 3, done: 3 },
  cpp: { init: 3, house: 10, runEnd: 4, done: 4 },
  js: { init: 1, house: 5, runEnd: 11, done: 11 },
};

export const DECODE_LINE_MAP: LineMap<'init' | 'visit' | 'one' | 'two' | 'roll' | 'done'> = {
  csharp: { init: 1, visit: 4, one: 5, two: 7, roll: 8, done: 11 },
  ts: { init: 1, visit: 4, one: 5, two: 7, roll: 8, done: 11 },
  python: { init: 1, visit: 4, one: 5, two: 8, roll: 10, done: 12 },
  java: { init: 2, visit: 5, one: 6, two: 8, roll: 9, done: 12 },
  cpp: { init: 3, visit: 6, one: 7, two: 9, roll: 10, done: 13 },
  js: { init: 1, visit: 4, one: 5, two: 7, roll: 8, done: 11 },
};

export const COIN_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 2, calc: 5, done: 8 },
  ts: { init: 1, calc: 3, done: 8 },
  python: { init: 2, calc: 4, done: 8 },
  java: { init: 3, calc: 6, done: 9 },
  cpp: { init: 4, calc: 6, done: 9 },
  js: { init: 1, calc: 3, done: 8 },
};

export const LIS_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 2, calc: 7, done: 10 },
  ts: { init: 1, calc: 5, done: 9 },
  python: { init: 3, calc: 7, done: 10 },
  java: { init: 3, calc: 8, done: 11 },
  cpp: { init: 4, calc: 8, done: 11 },
  js: { init: 1, calc: 6, done: 10 },
};

export const JUMP_LINE_MAP: LineMap<'init' | 'jump' | 'done'> = {
  csharp: { init: 1, jump: 3, done: 5 },
  ts: { init: 1, jump: 3, done: 5 },
  python: { init: 1, jump: 3, done: 5 },
  java: { init: 2, jump: 4, done: 6 },
  cpp: { init: 3, jump: 5, done: 7 },
  js: { init: 1, jump: 3, done: 5 },
};

export const WORDBREAK_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 2, calc: 6, done: 10 },
  ts: { init: 2, calc: 6, done: 12 },
  python: { init: 2, calc: 6, done: 9 },
  java: { init: 3, calc: 7, done: 11 },
  cpp: { init: 4, calc: 8, done: 12 },
  js: { init: 2, calc: 6, done: 12 },
};

export const STAIRS_LINE_MAP: LineMap<'init' | 'step' | 'done'> = {
  csharp: { init: 2, step: 4, done: 8 },
  ts: { init: 2, step: 3, done: 4 },
  python: { init: 3, step: 5, done: 6 },
  java: { init: 3, step: 5, done: 9 },
  cpp: { init: 4, step: 6, done: 10 },
  js: { init: 2, step: 3, done: 4 },
};

export const UNIQUEPATHS_LINE_MAP: LineMap<'init' | 'cell' | 'done'> = {
  csharp: { init: 1, cell: 5, done: 6 },
  ts: { init: 1, cell: 4, done: 7 },
  python: { init: 1, cell: 4, done: 5 },
  java: { init: 2, cell: 6, done: 7 },
  cpp: { init: 3, cell: 6, done: 7 },
  js: { init: 1, cell: 4, done: 7 },
};

export const LCS_LINE_MAP: LineMap<'init' | 'cell' | 'done'> = {
  csharp: { init: 2, cell: 6, done: 8 },
  ts: { init: 2, cell: 6, done: 10 },
  python: { init: 2, cell: 6, done: 8 },
  java: { init: 3, cell: 7, done: 10 },
  cpp: { init: 4, cell: 7, done: 10 },
  js: { init: 2, cell: 6, done: 10 },
};

export const MAXSUBARRAY_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 1, calc: 4, done: 6 },
  ts: { init: 1, calc: 4, done: 7 },
  python: { init: 1, calc: 4, done: 6 },
  java: { init: 2, calc: 4, done: 7 },
  cpp: { init: 3, calc: 5, done: 8 },
  js: { init: 1, calc: 4, done: 7 },
};

export const MAXPRODUCT_LINE_MAP: LineMap<'init' | 'calc' | 'done'> = {
  csharp: { init: 1, calc: 7, done: 9 },
  ts: { init: 1, calc: 9, done: 11 },
  python: { init: 1, calc: 9, done: 10 },
  java: { init: 2, calc: 8, done: 10 },
  cpp: { init: 3, calc: 9, done: 11 },
  js: { init: 1, calc: 9, done: 11 },
};
