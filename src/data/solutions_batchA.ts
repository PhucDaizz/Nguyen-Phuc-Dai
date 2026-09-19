// Batch A — solutions đa ngôn ngữ + trace line map cho 12 bài.
// Quy ước như solutions.ts (mẫu two-sum-1 + TWOSUM_LINE_MAP).
// File này sẽ được gộp vào solutions.ts sau; visualizer import map từ '../../../data/solutions'.

import type { LineMap, SolutionLang } from './solutions';

export const BATCHA_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'best-time-stock-121': {
    ts: `function maxProfit(prices: number[]): number {
  let min = prices[0], best = 0;
  for (const p of prices) {
    best = Math.max(best, p - min);
    min = Math.min(min, p);
  }
  return best;
}`,
    csharp: `public int MaxProfit(int[] prices) {
    int min = prices[0];
    int best = 0;
    foreach (int p in prices) {
        best = Math.Max(best, p - min);
        min = Math.Min(min, p);
    }
    return best;
}`,
    python: `def max_profit(prices: list[int]) -> int:
    min_price = prices[0]
    best = 0
    for p in prices:
        best = max(best, p - min_price)
        min_price = min(min_price, p)
    return best`,
    java: `class Solution {
    public int maxProfit(int[] prices) {
        int min = prices[0];
        int best = 0;
        for (int p : prices) {
            best = Math.max(best, p - min);
            min = Math.min(min, p);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int mn = prices[0];
        int best = 0;
        for (int p : prices) {
            best = max(best, p - mn);
            mn = min(mn, p);
        }
        return best;
    }
};`,
    js: `function maxProfit(prices) {
  let min = prices[0], best = 0;
  for (const p of prices) {
    best = Math.max(best, p - min);
    min = Math.min(min, p);
  }
  return best;
}`,
  },
  'contains-duplicate-217': {
    ts: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
    csharp: `public bool ContainsDuplicate(int[] nums) {
    var seen = new HashSet<int>();
    foreach (int x in nums) {
        if (!seen.Add(x))
            return true;
    }
    return false;
}`,
    python: `def contains_duplicate(nums: list[int]) -> bool:
    seen: set[int] = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x))
                return true;
        }
        return false;
    }
}`,
    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int x : nums) {
            if (!seen.insert(x).second)
                return true;
        }
        return false;
    }
};`,
    js: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
  },
  'product-except-self-238': {
    ts: `function productExceptSelf(nums: number[]): number[] {
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
    csharp: `public int[] ProductExceptSelf(int[] nums) {
    int n = nums.Length;
    int[] answer = new int[n];
    answer[0] = 1;
    for (int i = 1; i < n; i++)
        answer[i] = answer[i - 1] * nums[i - 1];
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= suffix;
        suffix *= nums[i];
    }
    return answer;
}`,
    python: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n
    answer[0] = 1
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer`,
    java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        answer[0] = 1;
        for (int i = 1; i < n; i++)
            answer[i] = answer[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i];
        }
        return answer;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> answer(n);
        answer[0] = 1;
        for (int i = 1; i < n; i++)
            answer[i] = answer[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i];
        }
        return answer;
    }
};`,
    js: `function productExceptSelf(nums) {
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
  },
  'valid-anagram-242': {
    ts: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (const c of s) count[c.charCodeAt(0) - 97]++;
  for (const c of t) {
    if (--count[c.charCodeAt(0) - 97] < 0) return false;
  }
  return true;
}`,
    csharp: `public bool IsAnagram(string s, string t) {
    if (s.Length != t.Length) return false;
    int[] count = new int[26];
    foreach (char c in s) count[c - 'a']++;
    foreach (char c in t) {
        if (--count[c - 'a'] < 0) return false;
    }
    return true;
}`,
    python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c in s:
        count[ord(c) - 97] += 1
    for c in t:
        count[ord(c) - 97] -= 1
        if count[ord(c) - 97] < 0:
            return False
    return True`,
    java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        for (char c : t.toCharArray()) {
            if (--count[c - 'a'] < 0) return false;
        }
        return true;
    }
}`,
    cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        vector<int> count(26, 0);
        for (char c : s) count[c - 'a']++;
        for (char c : t) {
            if (--count[c - 'a'] < 0) return false;
        }
        return true;
    }
};`,
    js: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (const c of s) count[c.charCodeAt(0) - 97]++;
  for (const c of t) {
    if (--count[c.charCodeAt(0) - 97] < 0) return false;
  }
  return true;
}`,
  },
  'group-anagrams-49': {
    ts: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const w of strs) {
    const key = w.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(w);
  }
  return [...map.values()];
}`,
    csharp: `public IList<IList<string>> GroupAnagrams(string[] strs) {
    var map = new Dictionary<string, List<string>>();
    foreach (string w in strs) {
        char[] arr = w.ToCharArray();
        Array.Sort(arr);
        string key = new string(arr);
        if (!map.ContainsKey(key)) map[key] = new List<string>();
        map[key].Add(w);
    }
    return new List<IList<string>>(map.Values);
}`,
    python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups: dict[str, list[str]] = {}
    for w in strs:
        key = ''.join(sorted(w))
        if key not in groups:
            groups[key] = []
        groups[key].append(w)
    return list(groups.values())`,
    java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String w : strs) {
            char[] arr = w.toCharArray();
            Arrays.sort(arr);
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(map.values());
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> map;
        for (string w : strs) {
            string key = w;
            sort(key.begin(), key.end());
            map[key].push_back(w);
        }
        vector<vector<string>> res;
        for (auto& p : map) res.push_back(p.second);
        return res;
    }
};`,
    js: `function groupAnagrams(strs) {
  const map = new Map();
  for (const w of strs) {
    const key = w.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}`,
  },
  'encode-decode-strings-271': {
    ts: `function encode(strs: string[]): string {
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
    csharp: `public string Encode(IList<string> strs) {
    var sb = new System.Text.StringBuilder();
    foreach (string s in strs)
        sb.Append(s.Length).Append('#').Append(s);
    return sb.ToString();
}
public IList<string> Decode(string s) {
    var res = new List<string>();
    int i = 0;
    while (i < s.Length) {
        int j = i;
        while (s[j] != '#') j++;
        int len = int.Parse(s.Substring(i, j - i));
        res.Add(s.Substring(j + 1, len));
        i = j + 1 + len;
    }
    return res;
}`,
    python: `def encode(strs: list[str]) -> str:
    parts: list[str] = []
    for s in strs:
        parts.append(str(len(s)) + '#' + s)
    return ''.join(parts)

def decode(s: str) -> list[str]:
    res: list[str] = []
    i = 0
    while i < len(s):
        j = i
        while s[j] != '#':
            j += 1
        length = int(s[i:j])
        res.append(s[j + 1:j + 1 + length])
        i = j + 1 + length
    return res`,
    java: `class Solution {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs)
            sb.append(s.length()).append('#').append(s);
        return sb.toString();
    }
    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (s.charAt(j) != '#') j++;
            int len = Integer.parseInt(s.substring(i, j));
            res.add(s.substring(j + 1, j + 1 + len));
            i = j + 1 + len;
        }
        return res;
    }
}`,
    cpp: `class Solution {
public:
    string encode(vector<string>& strs) {
        string out;
        for (string& s : strs)
            out += to_string(s.size()) + '#' + s;
        return out;
    }
    vector<string> decode(string s) {
        vector<string> res;
        int i = 0;
        while (i < (int)s.size()) {
            int j = i;
            while (s[j] != '#') j++;
            int len = stoi(s.substr(i, j - i));
            res.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return res;
    }
};`,
    js: `function encode(strs) {
  let out = '';
  for (const s of strs)
    out += s.length + '#' + s;
  return out;
}

function decode(s) {
  const res = [];
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
  },
  'valid-palindrome-125': {
    ts: `function isPalindrome(s: string): boolean {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`,
    csharp: `public bool IsPalindrome(string s) {
    int l = 0, r = s.Length - 1;
    while (l < r) {
        while (l < r && !char.IsLetterOrDigit(s[l])) l++;
        while (l < r && !char.IsLetterOrDigit(s[r])) r--;
        if (char.ToLower(s[l]) != char.ToLower(s[r])) return false;
        l++; r--;
    }
    return true;
}`,
    python: `def is_palindrome(s: str) -> bool:
    s = ''.join(c for c in s.lower() if c.isalnum())
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True`,
    java: `class Solution {
    public boolean isPalindrome(String s) {
        s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++; r--;
        }
        return true;
    }
}`,
    cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        string t;
        for (char c : s) if (isalnum(c)) t += tolower(c);
        int l = 0, r = (int)t.size() - 1;
        while (l < r) {
            if (t[l] != t[r]) return false;
            l++; r--;
        }
        return true;
    }
};`,
    js: `function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`,
  },
  'container-most-water-11': {
    ts: `function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
    csharp: `public int MaxArea(int[] height) {
    int l = 0, r = height.Length - 1, best = 0;
    while (l < r) {
        best = Math.Max(best, Math.Min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++; else r--;
    }
    return best;
}`,
    python: `def max_area(height: list[int]) -> int:
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        best = max(best, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best`,
    java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++; else r--;
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, best = 0;
        while (l < r) {
            best = max(best, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++; else r--;
        }
        return best;
    }
};`,
    js: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
  },
  'three-sum-15': {
    ts: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}`,
    csharp: `public IList<IList<int>> ThreeSum(int[] nums) {
    Array.Sort(nums);
    var res = new List<IList<int>>();
    for (int i = 0; i < nums.Length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = nums.Length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.Add(new List<int> { nums[i], nums[l], nums[r] });
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            }
            else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`,
    python: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res: list[list[int]] = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                while l < r and nums[r] == nums[r - 1]:
                    r -= 1
                l += 1
                r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res`,
    java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                }
                else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = (int)nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                }
                else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
    js: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}`,
  },
  'valid-parentheses-20': {
    ts: `function isValid(s: string): boolean {
  const st: string[] = [];
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}`,
    csharp: `public bool IsValid(string s) {
    var st = new Stack<char>();
    var pair = new Dictionary<char, char> { [')'] = '(', [']'] = '[', ['}'] = '{' };
    foreach (char c in s) {
        if (c == '(' || c == '[' || c == '{') st.Push(c);
        else if (st.Count == 0 || st.Pop() != pair[c]) return false;
    }
    return st.Count == 0;
}`,
    python: `def is_valid(s: str) -> bool:
    st: list[str] = []
    pair = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c == '(' or c == '[' or c == '{':
            st.append(c)
        elif not st or st.pop() != pair.get(c):
            return False
    return len(st) == 0`,
    java: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        Map<Character, Character> pair = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else if (st.isEmpty() || st.pop() != pair.get(c)) return false;
        }
        return st.isEmpty();
    }
}`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        vector<char> st;
        unordered_map<char, char> pair = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') st.push_back(c);
            else if (st.empty() || st.back() != pair[c]) return false;
            else st.pop_back();
        }
        return st.empty();
    }
};`,
    js: `function isValid(s) {
  const st = [];
  const pair = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}`,
  },
  'longest-palindrome-5': {
    ts: `function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;
  const expand = (l: number, r: number): void => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        start = l;
        maxLen = r - l + 1;
      }
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}`,
    csharp: `public string LongestPalindrome(string s) {
    if (s.Length < 2) return s;
    int start = 0, maxLen = 1;
    void Expand(int l, int r) {
        while (l >= 0 && r < s.Length && s[l] == s[r]) {
            if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; }
            l--; r++;
        }
    }
    for (int i = 0; i < s.Length; i++) {
        Expand(i, i);
        Expand(i, i + 1);
    }
    return s.Substring(start, maxLen);
}`,
    python: `def longest_palindrome(s: str) -> str:
    if len(s) < 2:
        return s
    start, max_len = 0, 1
    def expand(l: int, r: int) -> None:
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                start = l
                max_len = r - l + 1
            l -= 1
            r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]`,
    java: `class Solution {
    private int start, maxLen;
    public String longestPalindrome(String s) {
        if (s.length() < 2) return s;
        start = 0; maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(start, start + maxLen);
    }
    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; }
            l--; r++;
        }
    }
}`,
    cpp: `class Solution {
public:
    string longestPalindrome(string s) {
        if (s.size() < 2) return s;
        int start = 0, maxLen = 1;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {
                if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; }
                l--; r++;
            }
        };
        for (int i = 0; i < (int)s.size(); i++) {
            expand(i, i);
            expand(i, i + 1);
        }
        return s.substr(start, maxLen);
    }
};`,
    js: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        start = l;
        maxLen = r - l + 1;
      }
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}`,
  },
  'palindromic-substrings-647': {
    ts: `function countSubstrings(s: string): number {
  let count = 0;
  const expand = (l: number, r: number): void => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
    csharp: `public int CountSubstrings(string s) {
    int count = 0;
    void Expand(int l, int r) {
        while (l >= 0 && r < s.Length && s[l] == s[r]) {
            count++;
            l--; r++;
        }
    }
    for (int i = 0; i < s.Length; i++) {
        Expand(i, i);
        Expand(i, i + 1);
    }
    return count;
}`,
    python: `def count_substrings(s: str) -> int:
    count = 0
    def expand(l: int, r: int) -> None:
        nonlocal count
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return count`,
    java: `class Solution {
    private int count;
    public int countSubstrings(String s) {
        count = 0;
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return count;
    }
    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            count++;
            l--; r++;
        }
    }
}`,
    cpp: `class Solution {
public:
    int countSubstrings(string s) {
        int count = 0;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {
                count++;
                l--; r++;
            }
        };
        for (int i = 0; i < (int)s.size(); i++) {
            expand(i, i);
            expand(i, i + 1);
        }
        return count;
    }
};`,
    js: `function countSubstrings(s) {
  let count = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
  },
};

// ===================== TRACE LINE MAPS (batch A) =====================
// csharp = copy y nguyên codeLine cũ của visualizer; các ngôn ngữ khác đếm 0-based.

export const STOCK_LINE_MAP: LineMap<'init' | 'visit' | 'newbest' | 'newmin' | 'done'> = {
  csharp: { init: 1, visit: 4, newbest: 4, newmin: 5, done: 7 },
  ts: { init: 1, visit: 3, newbest: 3, newmin: 4, done: 6 },
  python: { init: 1, visit: 4, newbest: 4, newmin: 5, done: 6 },
  java: { init: 2, visit: 5, newbest: 5, newmin: 6, done: 8 },
  cpp: { init: 3, visit: 6, newbest: 6, newmin: 7, done: 9 },
  js: { init: 1, visit: 3, newbest: 3, newmin: 4, done: 6 },
};

export const DUPLICATE_LINE_MAP: LineMap<'init' | 'visit' | 'found' | 'store' | 'done'> = {
  csharp: { init: 1, visit: 3, found: 4, store: 3, done: 4 },
  ts: { init: 1, visit: 3, found: 3, store: 4, done: 3 },
  python: { init: 1, visit: 3, found: 4, store: 5, done: 4 },
  java: { init: 2, visit: 4, found: 5, store: 4, done: 5 },
  cpp: { init: 3, visit: 5, found: 6, store: 5, done: 6 },
  js: { init: 1, visit: 3, found: 3, store: 4, done: 3 },
};

export const PRODUCT_LINE_MAP: LineMap<'init' | 'prefix' | 'suffix' | 'done'> = {
  csharp: { init: 3, prefix: 5, suffix: 8, done: 11 },
  ts: { init: 3, prefix: 5, suffix: 8, done: 11 },
  python: { init: 3, prefix: 5, suffix: 8, done: 10 },
  java: { init: 4, prefix: 6, suffix: 9, done: 12 },
  cpp: { init: 5, prefix: 7, suffix: 10, done: 13 },
  js: { init: 3, prefix: 5, suffix: 8, done: 11 },
};

export const ANAGRAM_LINE_MAP: LineMap<'init' | 'count' | 'check' | 'fail' | 'done'> = {
  csharp: { init: 2, count: 3, check: 5, fail: 5, done: 7 },
  ts: { init: 2, count: 3, check: 5, fail: 5, done: 7 },
  python: { init: 3, count: 5, check: 8, fail: 9, done: 10 },
  java: { init: 3, count: 4, check: 6, fail: 6, done: 8 },
  cpp: { init: 4, count: 5, check: 7, fail: 7, done: 9 },
  js: { init: 2, count: 3, check: 5, fail: 5, done: 7 },
};

export const GROUP_LINE_MAP: LineMap<'init' | 'visit' | 'group' | 'done'> = {
  csharp: { init: 1, visit: 5, group: 7, done: 9 },
  ts: { init: 1, visit: 3, group: 5, done: 7 },
  python: { init: 1, visit: 3, group: 6, done: 7 },
  java: { init: 2, visit: 6, group: 7, done: 9 },
  cpp: { init: 3, visit: 6, group: 7, done: 11 },
  js: { init: 1, visit: 3, group: 5, done: 7 },
};

export const CODEC_LINE_MAP: LineMap<'encode' | 'decode-scan' | 'decode-cut' | 'init-decode' | 'done'> = {
  csharp: { encode: 3, 'decode-scan': 11, 'decode-cut': 13, 'init-decode': 9, done: 16 },
  ts: { encode: 1, 'decode-scan': 9, 'decode-cut': 11, 'init-decode': 7, done: 14 },
  python: { encode: 3, 'decode-scan': 11, 'decode-cut': 14, 'init-decode': 9, done: 16 },
  java: { encode: 4, 'decode-scan': 12, 'decode-cut': 14, 'init-decode': 10, done: 17 },
  cpp: { encode: 5, 'decode-scan': 13, 'decode-cut': 15, 'init-decode': 11, done: 18 },
  js: { encode: 3, 'decode-scan': 12, 'decode-cut': 14, 'init-decode': 10, done: 17 },
};

export const PALINDROME_LINE_MAP: LineMap<'init' | 'compare' | 'done'> = {
  csharp: { init: 1, compare: 5, done: 8 },
  ts: { init: 1, compare: 4, done: 7 },
  python: { init: 1, compare: 4, done: 8 },
  java: { init: 2, compare: 5, done: 8 },
  cpp: { init: 3, compare: 7, done: 10 },
  js: { init: 1, compare: 4, done: 7 },
};

export const CONTAINER_LINE_MAP: LineMap<'init' | 'visit' | 'move' | 'done'> = {
  csharp: { init: 1, visit: 3, move: 4, done: 6 },
  ts: { init: 1, visit: 3, move: 4, done: 6 },
  python: { init: 1, visit: 3, move: 4, done: 8 },
  java: { init: 2, visit: 4, move: 5, done: 7 },
  cpp: { init: 3, visit: 5, move: 6, done: 8 },
  js: { init: 1, visit: 3, move: 4, done: 7 },
};

export const THREESUM_LINE_MAP: LineMap<'init' | 'outer' | 'skip' | 'inner' | 'found' | 'done'> = {
  csharp: { init: 1, outer: 5, skip: 4, inner: 14, found: 9, done: 18 },
  ts: { init: 1, outer: 5, skip: 4, inner: 13, found: 9, done: 17 },
  python: { init: 1, outer: 6, skip: 5, inner: 17, found: 10, done: 21 },
  java: { init: 2, outer: 6, skip: 5, inner: 15, found: 10, done: 19 },
  cpp: { init: 3, outer: 7, skip: 6, inner: 16, found: 11, done: 20 },
  js: { init: 1, outer: 5, skip: 4, inner: 13, found: 9, done: 17 },
};

export const PARENS_LINE_MAP: LineMap<'init' | 'push' | 'match' | 'mismatch' | 'invalid' | 'done'> = {
  csharp: { init: 1, push: 4, match: 5, mismatch: 5, invalid: 5, done: 7 },
  ts: { init: 1, push: 4, match: 5, mismatch: 5, invalid: 5, done: 7 },
  python: { init: 1, push: 5, match: 6, mismatch: 6, invalid: 6, done: 8 },
  java: { init: 2, push: 5, match: 6, mismatch: 6, invalid: 6, done: 8 },
  cpp: { init: 3, push: 6, match: 7, mismatch: 7, invalid: 7, done: 10 },
  js: { init: 1, push: 4, match: 5, mismatch: 5, invalid: 5, done: 7 },
};

export const LONGESTPAL_LINE_MAP: LineMap<'init' | 'center' | 'done'> = {
  csharp: { init: 2, center: 3, done: 13 },
  ts: { init: 2, center: 3, done: 17 },
  python: { init: 3, center: 4, done: 15 },
  java: { init: 4, center: 11, done: 9 },
  cpp: { init: 4, center: 5, done: 15 },
  js: { init: 2, center: 3, done: 17 },
};

export const COUNTPAL_LINE_MAP: LineMap<'init' | 'center' | 'done'> = {
  csharp: { init: 2, center: 3, done: 3 },
  ts: { init: 1, center: 2, done: 13 },
  python: { init: 1, center: 2, done: 11 },
  java: { init: 3, center: 10, done: 8 },
  cpp: { init: 3, center: 4, done: 14 },
  js: { init: 1, center: 2, done: 13 },
};
