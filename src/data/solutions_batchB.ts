// Batch B: solutions đa ngôn ngữ + line map cho 11 bài (Binary Search / Sliding Window / Linked List).
// Quy ước theo .opencode/skills/dsa-html-style/references/multilang-solutions.md:
// - `ts`: COPY Y NGUYÊN guide.code trong guides.ts.
// - `csharp`: COPY Y NGUYÊN panel CSHARP_LINES của visualizer (nối bằng \n).
// - python/java/cpp/js: cùng thuật toán, cùng vai trò biến, cùng thứ tự xử lý.
// - LineMap csharp = copy y nguyên codeLine cũ theo từng Step['type'].
// File này sẽ được gộp vào src/data/solutions.ts sau; visualizer import từ '../../../data/solutions'.

import type { LineMap, SolutionLang } from './solutions';

export const BATCHB_SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'find-min-rotated-153': {
    ts: `function findMin(nums: number[]): number {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] > nums[r]) l = m + 1;
    else r = m;
  }
  return nums[l];
}`,
    csharp: `public int FindMin(int[] nums) {
    int l = 0, r = nums.Length - 1;
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] > nums[r]) l = m + 1;
        else r = m;
    }
    return nums[l];
}`,
    python: `def find_min(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        m = l + (r - l) // 2
        if nums[m] > nums[r]:
            l = m + 1
        else:
            r = m
    return nums[l]`,
    java: `class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) l = m + 1;
            else r = m;
        }
        return nums[l];
    }
}`,
    cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = (int)nums.size() - 1;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] > nums[r]) l = m + 1;
            else r = m;
        }
        return nums[l];
    }
};`,
    js: `function findMin(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] > nums[r]) l = m + 1;
    else r = m;
  }
  return nums[l];
}`,
  },
  'search-rotated-33': {
    ts: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] === target) return m;
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) r = m - 1;
      else l = m + 1;
    } else {
      if (nums[m] < target && target <= nums[r]) l = m + 1;
      else r = m - 1;
    }
  }
  return -1;
}`,
    csharp: `public int Search(int[] nums, int target) {
    int l = 0, r = nums.Length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[l] <= nums[m]) {
            if (nums[l] <= target && target < nums[m]) r = m - 1;
            else l = m + 1;
        } else {
            if (nums[m] < target && target <= nums[r]) l = m + 1;
            else r = m - 1;
        }
    }
    return -1;
}`,
    python: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        m = l + (r - l) // 2
        if nums[m] == target:
            return m
        if nums[l] <= nums[m]:
            if nums[l] <= target < nums[m]:
                r = m - 1
            else:
                l = m + 1
        else:
            if nums[m] < target <= nums[r]:
                l = m + 1
            else:
                r = m - 1
    return -1`,
    java: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else {
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
}`,
    cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = (int)nums.size() - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else {
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
};`,
    js: `function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] === target) return m;
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) r = m - 1;
      else l = m + 1;
    } else {
      if (nums[m] < target && target <= nums[r]) l = m + 1;
      else r = m - 1;
    }
  }
  return -1;
}`,
  },
  'longest-substring-3': {
    ts: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    csharp: `public int LengthOfLongestSubstring(string s) {
    var seen = new HashSet<char>();
    int l = 0, best = 0;
    for (int r = 0; r < s.Length; r++) {
        while (seen.Contains(s[r])) {
            seen.Remove(s[l]);
            l++;
        }
        seen.Add(s[r]);
        best = Math.Max(best, r - l + 1);
    }
    return best;
}`,
    python: `def length_of_longest_substring(s: str) -> int:
    seen: set[str] = set()
    l, best = 0, 0
    for r, ch in enumerate(s):
        while ch in seen:
            seen.discard(s[l])
            l += 1
        seen.add(ch)
        best = max(best, r - l + 1)
    return best`,
    java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> seen = new HashSet<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            while (seen.contains(s.charAt(r))) {
                seen.remove(s.charAt(l));
                l++;
            }
            seen.add(s.charAt(r));
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> seen;
        int l = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            while (seen.count(s[r])) {
                seen.erase(s[l]);
                l++;
            }
            seen.insert(s[r]);
            best = max(best, r - l + 1);
        }
        return best;
    }
};`,
    js: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
  },
  'char-replacement-424': {
    ts: `function characterReplacement(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let l = 0, maxFreq = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(r) - 65]);
    while (r - l + 1 - maxFreq > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
    csharp: `public int CharacterReplacement(string s, int k) {
    int[] count = new int[26];
    int l = 0, maxFreq = 0, best = 0;
    for (int r = 0; r < s.Length; r++) {
        maxFreq = Math.Max(maxFreq, ++count[s[r] - 'A']);
        while (r - l + 1 - maxFreq > k) {
            count[s[l] - 'A']--;
            l++;
        }
        best = Math.Max(best, r - l + 1);
    }
    return best;
}`,
    python: `def character_replacement(s: str, k: int) -> int:
    count = [0] * 26
    l = max_freq = best = 0
    for r, ch in enumerate(s):
        count[ord(ch) - 65] += 1
        max_freq = max(max_freq, count[ord(ch) - 65])
        while r - l + 1 - max_freq > k:
            count[ord(s[l]) - 65] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`,
    java: `class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int l = 0, maxFreq = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(r) - 'A']);
            while (r - l + 1 - maxFreq > k) {
                count[s.charAt(l) - 'A']--;
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> count(26, 0);
        int l = 0, maxFreq = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            maxFreq = max(maxFreq, ++count[s[r] - 'A']);
            while (r - l + 1 - maxFreq > k) {
                count[s[l] - 'A']--;
                l++;
            }
            best = max(best, r - l + 1);
        }
        return best;
    }
};`,
    js: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let l = 0, maxFreq = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(r) - 65]);
    while (r - l + 1 - maxFreq > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
  },
  'min-window-76': {
    ts: `function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const win = new Map<string, number>();
  let have = 0, l = 0, best = '';
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    win.set(c, (win.get(c) ?? 0) + 1);
    if (need.has(c) && win.get(c) === need.get(c)) have++;
    while (have === need.size) {
      if (best === '' || r - l + 1 < best.length) best = s.slice(l, r + 1);
      const d = s[l];
      win.set(d, win.get(d)! - 1);
      if (need.has(d) && win.get(d)! < need.get(d)!) have--;
      l++;
    }
  }
  return best;
}`,
    csharp: `public string MinWindow(string s, string t) {
    if (t.Length > s.Length) return "";
    var need = new Dictionary<char, int>();
    foreach (char c in t) need[c] = need.GetValueOrDefault(c) + 1;
    var win = new Dictionary<char, int>();
    int have = 0, l = 0;
    string best = "";
    for (int r = 0; r < s.Length; r++) {
        char c = s[r];
        win[c] = win.GetValueOrDefault(c) + 1;
        if (need.ContainsKey(c) && win[c] == need[c]) have++;
        while (have == need.Count) {
            if (best == "" || r - l + 1 < best.Length) best = s.Substring(l, r - l + 1);
            char d = s[l];
            win[d]--;
            if (need.ContainsKey(d) && win[d] < need[d]) have--;
            l++;
        }
    }
    return best;
}`,
    python: `def min_window(s: str, t: str) -> str:
    from collections import Counter
    need = Counter(t)
    win: dict[str, int] = {}
    have, l, best = 0, 0, ""
    for r, c in enumerate(s):
        win[c] = win.get(c, 0) + 1
        if c in need and win[c] == need[c]:
            have += 1
        while have == len(need):
            if best == "" or r - l + 1 < len(best):
                best = s[l:r + 1]
            d = s[l]
            win[d] -= 1
            if d in need and win[d] < need[d]:
                have -= 1
            l += 1
    return best`,
    java: `class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);
        Map<Character, Integer> win = new HashMap<>();
        int have = 0, l = 0;
        String best = "";
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            win.put(c, win.getOrDefault(c, 0) + 1);
            if (need.containsKey(c) && win.get(c).equals(need.get(c))) have++;
            while (have == need.size()) {
                if (best.equals("") || r - l + 1 < best.length()) best = s.substring(l, r + 1);
                char d = s.charAt(l);
                win.put(d, win.get(d) - 1);
                if (need.containsKey(d) && win.get(d) < need.get(d)) have--;
                l++;
            }
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> need;
        for (char c : t) need[c]++;
        unordered_map<char, int> win;
        int have = 0, l = 0;
        string best = "";
        for (int r = 0; r < (int)s.size(); r++) {
            char c = s[r];
            win[c]++;
            if (need.count(c) && win[c] == need[c]) have++;
            while (have == (int)need.size()) {
                if (best == "" || r - l + 1 < (int)best.size()) best = s.substr(l, r - l + 1);
                char d = s[l];
                win[d]--;
                if (need.count(d) && win[d] < need[d]) have--;
                l++;
            }
        }
        return best;
    }
};`,
    js: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const win = new Map();
  let have = 0, l = 0, best = '';
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    win.set(c, (win.get(c) ?? 0) + 1);
    if (need.has(c) && win.get(c) === need.get(c)) have++;
    while (have === need.size) {
      if (best === '' || r - l + 1 < best.length) best = s.slice(l, r + 1);
      const d = s[l];
      win.set(d, win.get(d) - 1);
      if (need.has(d) && win.get(d) < need.get(d)) have--;
      l++;
    }
  }
  return best;
}`,
  },
  'reverse-linked-list-206': {
    ts: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    csharp: `public ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    python: `def reverse_list(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
    cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr != nullptr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`,
    js: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
  },
  'linked-list-cycle-141': {
    ts: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    csharp: `public bool HasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    python: `def has_cycle(head) -> bool:
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    java: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
    cpp: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode* slow = head, * fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
    js: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
  },
  'merge-two-lists-21': {
    ts: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 ?? l2;
  return dummy.next;
}`,
    csharp: `public ListNode MergeTwoLists(ListNode l1, ListNode l2) {
    var dummy = new ListNode();
    var cur = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            cur.next = l1;
            l1 = l1.next;
        } else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = l1 ?? l2;
    return dummy.next;
}`,
    python: `def merge_two_lists(l1, l2):
    dummy = ListNode()
    cur = dummy
    while l1 is not None and l2 is not None:
        if l1.val <= l2.val:
            cur.next = l1
            l1 = l1.next
        else:
            cur.next = l2
            l2 = l2.next
        cur = cur.next
    cur.next = l1 if l1 is not None else l2
    return dummy.next`,
    java: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                cur.next = l1;
                l1 = l1.next;
            } else {
                cur.next = l2;
                l2 = l2.next;
            }
            cur = cur.next;
        }
        cur.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`,
    cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy;
        ListNode* cur = &dummy;
        while (l1 != nullptr && l2 != nullptr) {
            if (l1->val <= l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = (l1 != nullptr) ? l1 : l2;
        return dummy.next;
    }
};`,
    js: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode();
  let cur = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 ?? l2;
  return dummy.next;
}`,
  },
  'merge-k-lists-23': {
    ts: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap: ListNode[] = [];
  const push = (n: ListNode) => { heap.push(n); heap.sort((a, b) => a.val - b.val); };
  for (const node of lists) if (node !== null) push(node);
  const dummy = new ListNode();
  let cur = dummy;
  while (heap.length > 0) {
    heap.sort((a, b) => a.val - b.val);
    const node = heap.shift()!;
    cur.next = node;
    cur = cur.next;
    if (node.next !== null) push(node.next);
  }
  return dummy.next;
}`,
    csharp: `public ListNode MergeKLists(ListNode[] lists) {
    var heap = new PriorityQueue<ListNode, int>();
    foreach (var node in lists)
        if (node != null) heap.Enqueue(node, node.val);
    var dummy = new ListNode();
    var cur = dummy;
    while (heap.Count > 0) {
        var node = heap.Dequeue();
        cur.next = node;
        cur = cur.next;
        if (node.next != null) heap.Enqueue(node.next, node.next.val);
    }
    return dummy.next;
}`,
    python: `def merge_k_lists(lists):
    import heapq
    heap: list[tuple[int, int, object]] = []
    for i, node in enumerate(lists):
        if node is not None:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode()
    cur = dummy
    while heap:
        _, i, node = heapq.heappop(heap)
        cur.next = node
        cur = cur.next
        if node.next is not None:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    java: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) if (node != null) heap.offer(node);
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while (!heap.isEmpty()) {
            ListNode node = heap.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) heap.offer(node.next);
        }
        return dummy.next;
    }
}`,
    cpp: `class Solution {
public:
    struct Cmp {
        bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }
    };
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, Cmp> heap;
        for (auto node : lists) if (node) heap.push(node);
        ListNode dummy;
        ListNode* cur = &dummy;
        while (!heap.empty()) {
            ListNode* node = heap.top(); heap.pop();
            cur->next = node;
            cur = cur->next;
            if (node->next) heap.push(node->next);
        }
        return dummy.next;
    }
};`,
    js: `function mergeKLists(lists) {
  const heap = [];
  const push = (n) => { heap.push(n); heap.sort((a, b) => a.val - b.val); };
  for (const node of lists) if (node !== null) push(node);
  const dummy = new ListNode();
  let cur = dummy;
  while (heap.length > 0) {
    heap.sort((a, b) => a.val - b.val);
    const node = heap.shift();
    cur.next = node;
    cur = cur.next;
    if (node.next !== null) push(node.next);
  }
  return dummy.next;
}`,
  },
  'remove-nth-19': {
    ts: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next;
  return dummy.next;
}`,
    csharp: `public ListNode RemoveNthFromEnd(ListNode head, int n) {
    var dummy = new ListNode(0, head);
    var fast = dummy;
    var slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`,
    python: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast is not None:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
    java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
    cpp: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* fast = &dummy, * slow = &dummy;
        for (int i = 0; i <= n; i++) fast = fast->next;
        while (fast != nullptr) { fast = fast->next; slow = slow->next; }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,
    js: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
  },
  'reorder-list-143': {
    ts: `function reorderList(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  let prev: ListNode | null = null;
  let curr = slow!.next;
  slow!.next = null;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let first: ListNode | null = head;
  let second: ListNode | null = prev;
  while (second !== null) {
    const t1 = first!.next;
    const t2 = second.next;
    first!.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
}`,
    csharp: `public void ReorderList(ListNode head) {
    if (head == null || head.next == null) return;
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    ListNode prev = null, curr = slow.next;
    slow.next = null;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    ListNode first = head, second = prev;
    while (second != null) {
        ListNode t1 = first.next, t2 = second.next;
        first.next = second;
        second.next = t1;
        first = t1; second = t2;
    }
}`,
    python: `def reorder_list(head) -> None:
    if head is None or head.next is None:
        return
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    prev, curr = None, slow.next
    slow.next = None
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    first, second = head, prev
    while second is not None:
        t1, t2 = first.next, second.next
        first.next = second
        second.next = t1
        first, second = t1, t2`,
    java: `class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode t1 = first.next, t2 = second.next;
            first.next = second;
            second.next = t1;
            first = t1; second = t2;
        }
    }
}`,
    cpp: `class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        ListNode* slow = head, * fast = head;
        while (fast && fast->next) {
            slow = slow->next; fast = fast->next->next;
        }
        ListNode* prev = nullptr, * curr = slow->next;
        slow->next = nullptr;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        ListNode* first = head, * second = prev;
        while (second) {
            ListNode* t1 = first->next, * t2 = second->next;
            first->next = second;
            second->next = t1;
            first = t1; second = t2;
        }
    }
};`,
    js: `function reorderList(head) {
  if (head === null || head.next === null) return;
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  let curr = slow.next;
  slow.next = null;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let first = head;
  let second = prev;
  while (second !== null) {
    const t1 = first.next;
    const t2 = second.next;
    first.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
}`,
  },
};

// ===================== LINE MAPS (Batch B) =====================
// csharp = copy y nguyên codeLine cũ của visualizer theo từng Step['type'].
// Các ngôn ngữ khác: dòng 0-based tương ứng (dòng trống vẫn tính).

export const ROTMIN_LINE_MAP: LineMap<'init' | 'visit' | 'done'> = {
  // visit: nhánh if dùng dòng 4, nhánh else dùng dòng 5 — chọn 4 (ghi chú khi gộp).
  csharp: { init: 1, visit: 4, done: 7 },
  ts: { init: 1, visit: 4, done: 7 },
  python: { init: 1, visit: 4, done: 8 },
  java: { init: 2, visit: 5, done: 8 },
  cpp: { init: 3, visit: 6, done: 9 },
  js: { init: 1, visit: 4, done: 7 },
};

export const ROTSEARCH_LINE_MAP: LineMap<'init' | 'visit' | 'found' | 'done'> = {
  // visit có 4 codeLine (6/7/9/10 theo nhánh) — chọn 6; done đường found dùng 4, đường miss dùng 13 — chọn 13.
  csharp: { init: 1, visit: 5, found: 4, done: 13 },
  ts: { init: 1, visit: 5, found: 4, done: 13 },
  python: { init: 1, visit: 6, found: 5, done: 16 },
  java: { init: 2, visit: 6, found: 5, done: 14 },
  cpp: { init: 3, visit: 7, found: 6, done: 15 },
  js: { init: 1, visit: 5, found: 4, done: 13 },
};

export const SUBSTR_LINE_MAP: LineMap<'init' | 'expand' | 'shrink' | 'done'> = {
  csharp: { init: 1, expand: 9, shrink: 5, done: 11 },
  ts: { init: 1, expand: 8, shrink: 5, done: 11 },
  python: { init: 1, expand: 7, shrink: 5, done: 9 },
  java: { init: 2, expand: 9, shrink: 6, done: 12 },
  cpp: { init: 3, expand: 10, shrink: 7, done: 13 },
  js: { init: 1, expand: 8, shrink: 5, done: 11 },
};

export const REPLACE_LINE_MAP: LineMap<'init' | 'expand' | 'shrink' | 'done'> = {
  // done gốc trỏ dòng 9 (dòng best-update, không phải return) — giữ y nguyên.
  csharp: { init: 1, expand: 4, shrink: 5, done: 11 },
  ts: { init: 1, expand: 4, shrink: 6, done: 11 },
  python: { init: 1, expand: 5, shrink: 7, done: 10 },
  java: { init: 2, expand: 5, shrink: 7, done: 12 },
  cpp: { init: 3, expand: 6, shrink: 8, done: 13 },
  js: { init: 1, expand: 4, shrink: 6, done: 11 },
};

export const MINWIN_LINE_MAP: LineMap<'init' | 'expand' | 'shrink' | 'done'> = {
  // done đường early-exit (t > s) dùng dòng 1 như init — chọn 19 (return best).
  csharp: { init: 1, expand: 8, shrink: 11, done: 19 },
  ts: { init: 1, expand: 8, shrink: 10, done: 17 },
  python: { init: 2, expand: 5, shrink: 9, done: 17 },
  java: { init: 2, expand: 8, shrink: 11, done: 19 },
  cpp: { init: 3, expand: 9, shrink: 12, done: 20 },
  js: { init: 1, expand: 6, shrink: 9, done: 17 },
};

export const REVERSE_LINE_MAP: LineMap<'init' | 'visit' | 'flip' | 'done'> = {
  csharp: { init: 1, visit: 4, flip: 5, done: 9 },
  ts: { init: 1, visit: 4, flip: 5, done: 9 },
  python: { init: 1, visit: 4, flip: 5, done: 8 },
  java: { init: 2, visit: 5, flip: 6, done: 10 },
  cpp: { init: 3, visit: 6, flip: 7, done: 11 },
  js: { init: 1, visit: 4, flip: 5, done: 9 },
};

export const CYCLE_LINE_MAP: LineMap<'init' | 'move' | 'found' | 'done'> = {
  // found + done (đường tìm thấy) cùng dùng dòng 6 (đóng ngoặc if) — giữ y nguyên; done các đường còn lại dùng 7.
  csharp: { init: 1, move: 3, found: 5, done: 5 },
  ts: { init: 1, move: 3, found: 5, done: 5 },
  python: { init: 1, move: 3, found: 6, done: 6 },
  java: { init: 2, move: 4, found: 6, done: 6 },
  cpp: { init: 3, move: 5, found: 7, done: 7 },
  js: { init: 1, move: 3, found: 5, done: 5 },
};

export const MERGETWO_LINE_MAP: LineMap<'init' | 'take' | 'drain' | 'done'> = {
  // take nhánh else dùng dòng 8 — chọn 5; drain/done gốc lệch 1 (12/13 thay vì 13/14) — giữ y nguyên.
  csharp: { init: 1, take: 5, drain: 13, done: 14 },
  ts: { init: 1, take: 5, drain: 13, done: 14 },
  python: { init: 1, take: 5, drain: 11, done: 12 },
  java: { init: 2, take: 6, drain: 14, done: 15 },
  cpp: { init: 3, take: 7, drain: 15, done: 16 },
  js: { init: 1, take: 5, drain: 13, done: 14 },
};

export const MERGEK_LINE_MAP: LineMap<'init' | 'push' | 'sift' | 'pop' | 'done'> = {
  // push: init-phase dùng 3, main-loop dùng 10 — chọn 10; sift có 3/7/10 — chọn 7 (sift-down trong vòng pop chiếm đa số).
  csharp: { init: 1, push: 10, sift: 7, pop: 7, done: 12 },
  ts: { init: 1, push: 11, sift: 7, pop: 8, done: 13 },
  python: { init: 2, push: 13, sift: 9, pop: 9, done: 14 },
  java: { init: 2, push: 10, sift: 7, pop: 7, done: 12 },
  cpp: { init: 6, push: 14, sift: 11, pop: 11, done: 16 },
  js: { init: 1, push: 11, sift: 7, pop: 8, done: 13 },
};

export const REMOVENTH_LINE_MAP: LineMap<'init' | 'gap' | 'move' | 'remove' | 'done'> = {
  // Theo fixLine (hành vi thực tế), không phải codeLine thô trong generateTrace (1/5/6/10/11).
  csharp: { init: 1, gap: 4, move: 5, remove: 6, done: 7 },
  ts: { init: 1, gap: 4, move: 5, remove: 9, done: 10 },
  python: { init: 1, gap: 3, move: 5, remove: 8, done: 9 },
  java: { init: 2, gap: 4, move: 5, remove: 6, done: 7 },
  cpp: { init: 3, gap: 5, move: 6, remove: 7, done: 8 },
  js: { init: 1, gap: 4, move: 5, remove: 9, done: 10 },
};

export const REORDER_LINE_MAP: LineMap<'init' | 'middle' | 'split' | 'reverse' | 'merge' | 'done'> = {
  // middle/split/reverse/merge gốc trỏ dòng đóng/mở lân cận (5/9/12/20) — giữ y nguyên; done early (n<2) dùng 1 — chọn 20.
  csharp: { init: 1, middle: 4, split: 7, reverse: 10, merge: 17, done: 19 },
  ts: { init: 1, middle: 5, split: 10, reverse: 13, merge: 22, done: 25 },
  python: { init: 1, middle: 5, split: 8, reverse: 11, merge: 17, done: 19 },
  java: { init: 2, middle: 5, split: 8, reverse: 11, merge: 18, done: 20 },
  cpp: { init: 3, middle: 6, split: 9, reverse: 12, merge: 19, done: 21 },
  js: { init: 1, middle: 5, split: 10, reverse: 13, merge: 22, done: 25 },
};
