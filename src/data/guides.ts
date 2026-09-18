// Bài hướng dẫn chi tiết (tiếng Việt, tự viết) cho từng bài Blind75 đã có.
// Key = slug dùng trong route /blog/:slug. Metadata chung (số bài, category,
// link LeetCode...) lấy từ blind75.ts qua `blindNo`.

export interface Guide {
  slug: string;
  blindNo: number;
  time: string;
  space: string;
  rule: string;
  checklist: string[];
  filename: string;
  code: string;
  highlightLines: number[];
  dryRun: { input: string; trace: string[]; output: string };
  pitfalls: string[];
  // Dùng khi bài guide không thuộc Blind75 (vd: template Binary Search 704)
  fallbackMeta?: { title: string; viTitle: string; summary: string; pattern: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard' };
}

export const GUIDES: Record<string, Guide> = {
  'find-min-rotated-153': {
    slug: 'find-min-rotated-153',
    blindNo: 153,
    time: 'O(log n)',
    space: 'O(1)',
    rule: 'Mảng xoay: so nums[mid] với nums[right] — mid lớn hơn right thì min nằm nửa phải.',
    checklist: [
      'Mảng đã sort rồi xoay, các số phân biệt',
      'nums[mid] > nums[right] → min ở phải: l = mid + 1',
      'Ngược lại → min ở trái (kể cả mid): r = mid',
      'Vòng [l, r), hết lặp return nums[l]',
    ],
    filename: 'find-min-rotated.ts',
    code: `function findMin(nums: number[]): number {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (nums[m] > nums[r]) l = m + 1;
    else r = m;
  }
  return nums[l];
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [3,4,5,1,2]',
      trace: ['[0,4]: m=2 (5) > nums[4]=2 → l=3', '[3,4]: m=3 (1) ≤ nums[4]=2 → r=3', 'l=r=3 → return nums[3]=1'],
      output: '1',
    },
    pitfalls: ['So với nums[left] thay vì nums[right] sẽ sai hướng', 'Dùng r = m − 1 có thể loại mất đáp án (min có thể chính là mid)'],
  },
  'search-rotated-33': {
    slug: 'search-rotated-33',
    blindNo: 33,
    time: 'O(log n)',
    space: 'O(1)',
    rule: 'Mảng xoay luôn có 1 nửa sorted — target nằm trong nửa sorted thì tìm ở đó.',
    checklist: [
      'So nums[l] ≤ nums[m]: nửa trái sorted',
      'Target trong [nums[l], nums[m]) → r = m − 1, không thì l = m + 1',
      'Nửa phải sorted thì xét (nums[m], nums[r]] tương tự',
      'Hết vòng → return −1',
    ],
    filename: 'search-rotated.ts',
    code: `function search(nums: number[], target: number): number {
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
    highlightLines: [6],
    dryRun: {
      input: 'nums = [4,5,6,7,0,1,2], target = 0',
      trace: ['[0,6]: m=3 (7). Trái [4..7] sorted, 0 không trong → l=4', '[4,6]: m=5 (1). Trái [0,1] sorted? nums[4]=0 ≤ 1 đúng, 0 trong [0,1) → r=4', '[4,4]: m=4 (0) = target → return 4'],
      output: '4',
    },
    pitfalls: ['Quên số phân biệt là giả thiết cốt lõi (có trùng cần xử lý khác)', 'Nhầm biên < và ≤ ở 2 nhánh đối xứng'],
  },
  'longest-substring-3': {
    slug: 'longest-substring-3',
    blindNo: 3,
    time: 'O(n)',
    space: 'O(min(n, charset))',
    rule: 'Cửa sổ không trùng: mở phải, gặp trùng thì co trái tới khi hết trùng.',
    checklist: [
      'Set lưu ký tự trong cửa sổ [l, r]',
      's[r] đã có → xóa s[l], l++ tới khi hết trùng',
      'Add s[r], best = max(best, r − l + 1)',
      'Mỗi ký tự vào/ra đúng 1 lần → O(n)',
    ],
    filename: 'longest-substring.ts',
    code: `function lengthOfLongestSubstring(s: string): number {
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
    highlightLines: [5],
    dryRun: {
      input: 's = "abcabcbb"',
      trace: ['r=0..2: {a,b,c}, best=3', 'r=3 (a trùng): xóa a, l=1 → {b,c,a}, dài 3', 'r=4 (b trùng): xóa b, l=2 → dài 3', 'r=5,6,7 (c,b,b): co tiếp, best giữ 3'],
      output: '3',
    },
    pitfalls: ['Reset cả cửa sổ khi gặp trùng (mất O(n²)) thay vì co trái dần', 'Quên +1 khi tính độ dài (r − l + 1)'],
  },
  'char-replacement-424': {
    slug: 'char-replacement-424',
    blindNo: 424,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Cửa sổ hợp lệ khi số ký tự phải đổi = dài − tần suất max ≤ k.',
    checklist: [
      'Đếm tần suất 26 chữ hoa trong cửa sổ, track maxFreq',
      'dài − maxFreq > k → co trái (giảm đếm, l++)',
      'best = max(best, dài cửa sổ)',
      'maxFreq không cần giảm khi co (chỉ cần giá trị max từng thấy)',
    ],
    filename: 'char-replacement.ts',
    code: `function characterReplacement(s: string, k: number): number {
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
    highlightLines: [6],
    dryRun: {
      input: 's = "ABAB", k = 2',
      trace: ['r=0 (A): maxFreq=1, dài 1−1=0 ≤ 2, best=1', 'r=1 (B): maxFreq=1, 2−1=1 ≤ 2, best=2', 'r=2 (A): maxFreq=2, 3−2=1 ≤ 2, best=3', 'r=3 (B): maxFreq=2, 4−2=2 ≤ 2, best=4'],
      output: '4',
    },
    pitfalls: ['Tưởng phải giảm maxFreq khi co trái (không cần — best chỉ tăng)', 'Thử mọi vị trí đổi brute force O(n²·alphabet)'],
  },
  'min-window-76': {
    slug: 'min-window-76',
    blindNo: 76,
    time: 'O(m + n)',
    space: 'O(charset)',
    rule: 'Mở phải tới khi đủ chữ (have = need), rồi co trái tối thiểu, track have/need.',
    checklist: [
      'need = đếm chữ của t, have = số loại chữ đã đủ',
      'Mở r: chữ đủ quota → have++',
      'have = need → co l, cập nhật best, chữ tụt quota → have−−',
      'Không bao giờ đủ → return ""',
    ],
    filename: 'min-window.ts',
    code: `function minWindow(s: string, t: string): string {
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
    highlightLines: [11],
    dryRun: {
      input: 's = "ADOBECODEBANC", t = "ABC"',
      trace: ['Mở r tới 5 ("ADOBEC"): đủ A,B,C → have=3', 'Co l: 0→5, best="ADOBEC"(6); l=5 mất A → have=2', 'Mở tiếp tới r=10 ("...BANC"): đủ lại → co l=6..9, best="BANC"(4)', 'Hết s → best="BANC"'],
      output: '"BANC"',
    },
    pitfalls: ['So have với t.length thay vì số loại chữ phân biệt', 'Quên cập nhật best trước khi co trái'],
  },
  'reverse-linked-list-206': {
    slug: 'reverse-linked-list-206',
    blindNo: 206,
    time: 'O(n)',
    space: 'O(1)',
    rule: '3 con trỏ: lưu next trước, lật mũi tên về prev, bước cả 2 tới.',
    checklist: [
      'prev = null, curr = head',
      'next = curr.next (giữ kẻo mất list)',
      'curr.next = prev (lật mũi tên)',
      'prev = curr, curr = next; hết thì return prev',
    ],
    filename: 'reverse-linked-list.ts',
    code: `function reverseList(head: ListNode | null): ListNode | null {
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
    highlightLines: [6],
    dryRun: {
      input: 'head = [1,2,3,4,5]',
      trace: ['curr=1: next=2, 1→null, prev=1', 'curr=2: next=3, 2→1, prev=2', 'curr=3: 3→2, prev=3', 'curr=4: 4→3, prev=4', 'curr=5: 5→4, prev=5, curr=null → return 5'],
      output: '[5,4,3,2,1]',
    },
    pitfalls: ['Quên lưu next trước khi lật → mất nửa sau list', 'Return head cũ thay vì prev'],
  },
  'linked-list-cycle-141': {
    slug: 'linked-list-cycle-141',
    blindNo: 141,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Rùa (1 bước) + thỏ (2 bước): gặp nhau là có vòng, thỏ tới null là không.',
    checklist: [
      'slow = fast = head',
      'Lặp khi fast và fast.next còn sống',
      'slow += 1, fast += 2; bằng nhau → true',
      'Thoát lặp (thỏ null) → false',
    ],
    filename: 'linked-list-cycle.ts',
    code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'head = [3,2,0,-4], pos = 1 (đuôi nối về index 1)',
      trace: ['slow=3, fast=3', 'slow=2, fast=0', 'slow=0, fast=2', 'slow=-4, fast=-4 → bằng nhau → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check fast null mà quên fast.next null → crash', 'Dùng set nhớ node tốn O(n) bộ nhớ (vẫn đúng nhưng không tối ưu)'],
  },
  'merge-two-lists-21': {
    slug: 'merge-two-lists-21',
    blindNo: 21,
    time: 'O(n + m)',
    space: 'O(1)',
    rule: 'Dummy head + 2 con trỏ: nhỏ hơn thì nối, hết 1 list thì nối nốt list còn lại.',
    checklist: [
      'dummy = node giả, cur = dummy',
      'Cả 2 còn sống: nhỏ hơn → cur.next, tiến con trỏ đó',
      'cur tiến theo sau mỗi lần nối',
      'Nối nốt phần còn lại, return dummy.next',
    ],
    filename: 'merge-two-lists.ts',
    code: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
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
    highlightLines: [5],
    dryRun: {
      input: 'l1 = [1,2,4], l2 = [1,3,4]',
      trace: ['1 vs 1: nối l1(1)', '2 vs 1: nối l2(1)', '2 vs 3: nối l1(2)', '4 vs 3: nối l2(3)', '4 vs 4: nối l1(4)', 'l1 hết → nối nốt [4]'],
      output: '[1,1,2,3,4,4]',
    },
    pitfalls: ['Quên dummy phải xử lý head riêng rất rối', 'Quên nối phần còn lại sau vòng lặp'],
  },
  'merge-k-lists-23': {
    slug: 'merge-k-lists-23',
    blindNo: 23,
    time: 'O(N log k)',
    space: 'O(k)',
    rule: 'Min-heap K head: pop nhỏ nhất, push next của nó — mỗi node vào/ra heap 1 lần.',
    checklist: [
      'Push head của mọi list không rỗng vào heap (key = val)',
      'Pop min → nối vào kết quả, push next của nó (nếu có)',
      'Lặp tới khi heap rỗng',
      'k = 1 thì chính là list đó; tất cả rỗng → null',
    ],
    filename: 'merge-k-lists.ts',
    code: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
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
    highlightLines: [9],
    dryRun: {
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      trace: ['heap = [1,1,2] (3 head)', 'pop 1 (list 1) → push 4; pop 1 (list 2) → push 3', 'pop 2 → push 6; pop 3 → push 4; pop 4,4,5,6 → hết'],
      output: '[1,1,2,3,4,4,5,6]',
    },
    pitfalls: ['Trộn từng cặp tuần tự O(k·N) thay vì heap O(N log k)', 'Quên bỏ qua list rỗng khi push ban đầu'],
  },
  'remove-nth-19': {
    slug: 'remove-nth-19',
    blindNo: 19,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Fast đi trước n+1 bước (từ dummy), rồi cả 2 cùng đi — slow dừng ngay trước node cần xóa.',
    checklist: [
      'dummy trước head để xóa được cả head',
      'fast đi trước n + 1 bước',
      'Cả 2 cùng đi tới khi fast null → slow trước node cần xóa',
      'slow.next = slow.next.next; return dummy.next',
    ],
    filename: 'remove-nth.ts',
    code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
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
    highlightLines: [10],
    dryRun: {
      input: 'head = [1,2,3,4,5], n = 2',
      trace: ['dummy→1→2→3→4→5; fast đi 3 bước tới 2', 'Cùng đi: fast 2→3→4→5→null, slow dummy→1→2→3', 'slow=3: bỏ 4 → 3→5'],
      output: '[1,2,3,5]',
    },
    pitfalls: ['Không dùng dummy → xóa head phải code riêng', 'Đi trước n bước thay vì n+1 → slow dừng đúng node cần xóa, không xóa được'],
  },
  'reorder-list-143': {
    slug: 'reorder-list-143',
    blindNo: 143,
    time: 'O(n)',
    space: 'O(1)',
    rule: '3 bước: chia đôi (slow/fast) → đảo nửa sau → đan xen 2 nửa.',
    checklist: [
      'Slow/fast tìm giữa: fast hết thì slow ở giữa',
      'Cắt đôi (slow.next = null), đảo nửa sau',
      'Đan xen: first→second→first.next...',
      'List lẻ thì node giữa thừa ra ở cuối là đúng',
    ],
    filename: 'reorder-list.ts',
    code: `function reorderList(head: ListNode | null): void {
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
    highlightLines: [20],
    dryRun: {
      input: 'head = [1,2,3,4]',
      trace: ['Giữa: slow=2 (fast hết) → nửa sau [3,4]', 'Đảo nửa sau → [4,3]', 'Đan: 1→4→2→3'],
      output: '[1,4,2,3]',
    },
    pitfalls: ['Quên cắt slow.next = null → vòng lặp vô hạn khi đan', 'Đan sai thứ tự lưu next (mất node)'],
  },
  'valid-palindrome-125': {
    slug: 'valid-palindrome-125',
    blindNo: 125,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Đối xứng → 2 đầu chụm vào; ký tự lạ bỏ qua ngay tại chỗ, không cần chuỗi mới.',
    checklist: [
      'Lowercase + chỉ giữ a-z, 0-9 (regex hoặc check tay)',
      'left = 0, right = cuối; khác nhau → false ngay',
      'Bằng nhau → left++, right−−',
      'Gặp nhau/vượt nhau → true',
    ],
    filename: 'valid-palindrome.ts',
    code: `function isPalindrome(s: string): boolean {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`,
    highlightLines: [5],
    dryRun: {
      input: 's = "A man, a plan, a canal: Panama"',
      trace: ['Làm sạch → "amanaplanacanalpanama" (21 chữ)', 'l=0/a vs r=20/a khớp → vào trong', '... khớp hết tới giữa ...', 'l vượt r → true'],
      output: 'true',
    },
    pitfalls: ['Quên lowercase ("A" vs "a") hoặc quên bỏ dấu câu/khoảng trắng', 'So cả chuỗi đảo ngược tốn O(n) bộ nhớ — 2 pointers O(1) tốt hơn'],
  },
  'container-most-water-11': {
    slug: 'container-most-water-11',
    blindNo: 11,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Diện tích bị chặn bởi cột thấp → dời cột thấp, giữ cột cao (cột cao còn cơ hội với cột khác).',
    checklist: [
      'left = 0, right = cuối; area = min(h[l],h[r]) × (r−l)',
      'Giữ max từng bước',
      'h[l] < h[r] → l++, ngược lại → r−− (bằng nhau dời bên nào cũng được)',
      'Gặp nhau thì dừng',
    ],
    filename: 'container-most-water.ts',
    code: `function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'height = [1,8,6,2,5,4,8,3,7]',
      trace: ['l=0(1),r=8(7): area=1×8=8, dời l (1<7)', 'l=1(8),r=8(7): area=7×7=49 ← best, dời r (7<8)', 'l=1(8),r=7(3): area=3×6=18, dời r', '... tiếp tục chụm vào, không vượt 49 ...'],
      output: '49',
    },
    pitfalls: ['Brute force mọi cặp O(n²)', 'Dời cột cao thay vì cột thấp sẽ bỏ lỡ đáp án tối ưu'],
  },
  'three-sum-15': {
    slug: 'three-sum-15',
    blindNo: 15,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Sort trước → cố định 1 số, 2 số còn lại two-pointers; trùng thì skip để khỏi trùng bộ ba.',
    checklist: [
      'Sort tăng dần trước',
      'Vòng ngoài cố định i; nums[i] trùng nums[i−1] → skip',
      'l = i+1, r = cuối: tổng = 0 → lưu, skip trùng 2 đầu rồi chụm vào',
      'Tổng < 0 → l++, tổng > 0 → r−−',
    ],
    filename: 'three-sum.ts',
    code: `function threeSum(nums: number[]): number[][] {
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
    highlightLines: [10],
    dryRun: {
      input: 'nums = [-1,0,1,2,-1,-4] → sort [-4,-1,-1,0,1,2]',
      trace: ['i=0 (−4): l=1,r=5, tổng nhỏ nhất −4−1+2<0 → không có, i++', 'i=1 (−1): l=2(−1),r=5(2): −1−1+2=0 → lưu [−1,−1,2]; skip trùng; l=3(0),r=4(1): −1+0+1=0 → lưu [−1,0,1]', 'i=2 (−1) trùng i=1 → skip; i=3 (0): tổng min >0 → hết'],
      output: '[[-1,-1,2],[-1,0,1]]',
    },
    pitfalls: ['Quên skip trùng ở cả 3 vị trí → đáp án lặp', 'Không sort mà dùng hash 3 vòng thì khó khử trùng và chậm hơn'],
  },
  'group-anagrams-49': {
    slug: 'group-anagrams-49',
    blindNo: 49,
    time: 'O(n·k log k)',
    space: 'O(n·k)',
    rule: 'Anagram chung nhau 1 “dấu vân tay” → sort chữ cái làm key, cùng key vào 1 nhóm.',
    checklist: [
      'Key = chuỗi đã sort (eat/tea/ate → aet)',
      'Map key → danh sách từ, gặp từ mới thì push vào nhóm của key nó',
      'Muốn O(n·k) thì key = tuple đếm 26 chữ thay vì sort',
      'Return các values của map, thứ tự nhóm nào cũng được',
    ],
    filename: 'group-anagrams.ts',
    code: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const w of strs) {
    const key = w.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(w);
  }
  return [...map.values()];
}`,
    highlightLines: [4],
    dryRun: {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      trace: ['eat → key aet → nhóm {aet:[eat]}', 'tea → key aet → {aet:[eat,tea]}', 'tan → key ant → {ant:[tan]}', 'ate → key aet → {aet:[eat,tea,ate]}', 'nat → key ant → {ant:[tan,nat]}', 'bat → key abt → {abt:[bat]}'],
      output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
    },
    pitfalls: ['So từng cặp chuỗi với nhau là O(n²·k)', 'Dùng chính chuỗi chưa sort làm key thì mỗi từ 1 nhóm'],
  },
  'encode-decode-strings-271': {
    slug: 'encode-decode-strings-271',
    blindNo: 271,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Chuỗi chứa ký tự bất kỳ → đừng dùng separator, dùng tiền tố độ dài: “len#str”.',
    checklist: [
      'Encode: mỗi chuỗi thành len + "#" + chuỗi, nối lại',
      'Decode: đọc số tới "#" → đó là len, cắt đúng len ký tự tiếp theo',
      'Nhảy pointer qua đoạn vừa cắt, lặp tới hết',
      'Chuỗi rỗng "" encode thành "0#" vẫn decode đúng',
    ],
    filename: 'encode-decode-strings.ts',
    code: `function encode(strs: string[]): string {
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
    highlightLines: [11],
    dryRun: {
      input: '["leet","code"]',
      trace: ['Encode: "leet" → "4#leet", "code" → "4#code" → "4#leet4#code"', 'Decode: i=0, đọc tới # → len=4, cắt "leet", i=6', 'i=6, đọc tới # → len=4, cắt "code", i=12 → hết'],
      output: '["leet","code"]',
    },
    pitfalls: ['Nối bằng dấu phẩy rồi split(",") sẽ vỡ khi chuỗi chứa dấu phẩy', 'Quên case chuỗi rỗng: "0#" phải decode ra [""]'],
  },
  'product-except-self-238': {
    slug: 'product-except-self-238',
    blindNo: 238,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Không được chia → đi 2 pass: trái→phải tích prefix, phải→trái nhân suffix, đáp án tái dùng làm bộ nhớ.',
    checklist: [
      'answer[0] = 1 rồi answer[i] = answer[i-1] × nums[i-1] (tích mọi số bên trái)',
      'suffix = 1 rồi duyệt ngược: answer[i] ×= suffix; suffix ×= nums[i]',
      'Không dùng mảng prefix/suffix riêng — output chính là bộ nhớ phụ',
      'Case có số 0 vẫn đúng tự nhiên, không cần if riêng',
    ],
    filename: 'product-except-self.ts',
    code: `function productExceptSelf(nums: number[]): number[] {
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
    highlightLines: [9],
    dryRun: {
      input: 'nums = [1,2,3,4]',
      trace: ['prefix: answer = [1,1,2,6]', 'suffix=1: i=3 → answer[3]=6×1=6, suffix=4', 'i=2 → answer[2]=2×4=8, suffix=12', 'i=1 → answer[1]=1×12=12, suffix=24', 'i=0 → answer[0]=1×24=24'],
      output: '[24,12,8,6]',
    },
    pitfalls: ['Dùng phép chia sẽ sai ngay khi có số 0', 'Tạo 2 mảng prefix/suffix riêng tốn O(n) bộ nhớ phụ'],
  },
  'valid-anagram-242': {
    slug: 'valid-anagram-242',
    blindNo: 242,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'So hoán vị → đếm tần suất: cộng cho chuỗi 1, trừ cho chuỗi 2, âm là sai.',
    checklist: [
      'Dài khác nhau → false ngay, khỏi đếm',
      'Mảng đếm 26 chữ (a-z thường), +1 cho từng chữ của s',
      '−1 cho từng chữ của t, ô nào âm → false ngay',
      'Hết vòng mà không âm → true',
    ],
    filename: 'valid-anagram.ts',
    code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (const c of s) count[c.charCodeAt(0) - 97]++;
  for (const c of t) {
    if (--count[c.charCodeAt(0) - 97] < 0) return false;
  }
  return true;
}`,
    highlightLines: [6],
    dryRun: {
      input: 's = "anagram", t = "nagaram"',
      trace: ['Dài bằng nhau (7=7)', 'Đếm s: a×3, n×1, g×1, r×1, m×1', 'Trừ t: n−1, a−1, g−1, a−1, r−1, a−1, m−1 → mọi ô về 0'],
      output: 'true',
    },
    pitfalls: ['Sort 2 chuỗi O(n log n) vẫn đúng nhưng chậm hơn đếm', 'Quên check dài khác nhau trước, hoặc dùng map chữ chung chung thay vì mảng 26'],
  },
  'contains-duplicate-217': {
    slug: 'contains-duplicate-217',
    blindNo: 217,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Hỏi “đã thấy số này chưa” với mỗi phần tử → Hash Set cho đáp án O(n).',
    checklist: [
      'Gặp số đã có trong set → return true ngay',
      'Chưa có → add vào set, đi tiếp',
      'Hết mảng mà chưa true → return false',
      'Set chỉ lưu value, không cần index (khác Two Sum)',
    ],
    filename: 'contains-duplicate.ts',
    code: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [1,2,3,1]',
      trace: ['x=1: chưa có → add {1}', 'x=2: chưa có → add {1,2}', 'x=3: chưa có → add {1,2,3}', 'x=1: đã có → return true'],
      output: 'true',
    },
    pitfalls: ['2 vòng lặp so từng cặp là O(n²), timeout', 'Sort trước tuy được nhưng tốn O(n log n) và sửa mảng gốc'],
  },
  'two-sum-1': {
    slug: 'two-sum-1',
    blindNo: 1,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Khi cần “cặp (i, j)” với tổng/hiệu cố định → nghĩ Hash Map trước, Two Pointers sau.',
    checklist: [
      'target - nums[i] đã xuất hiện chưa?',
      'Lưu value → index, không lưu index → value',
      'Mỗi phần tử chỉ dùng 1 lần',
      'Return ngay khi tìm thấy, không cần sort',
    ],
    filename: 'two-sum.ts',
    code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [2,7,11,15], target = 9',
      trace: ['i=0: need=7, seen={} → lưu 2→0', 'i=1: need=2, seen có 2→0 → return [0,1]'],
      output: '[0, 1]',
    },
    pitfalls: ['Sort rồi two-pointers sẽ mất index gốc', '2 vòng lặp O(n²) là quá chậm'],
  },
  'valid-parentheses-20': {
    slug: 'valid-parentheses-20',
    blindNo: 20,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Bài “mở / đóng”, “gần nhất”, “lồng nhau” → Stack (LIFO) là đáp án 90% case.',
    checklist: [
      'Map đóng → mở: ) → (, ] → [, } → {',
      'Gặp đóng mà stack rỗng → false ngay',
      'Pop rồi so sánh, sai → false ngay',
      'Cuối cùng stack phải rỗng',
    ],
    filename: 'valid-parentheses.ts',
    code: `function isValid(s: string): boolean {
  const st: string[] = [];
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}`,
    highlightLines: [6],
    dryRun: {
      input: 's = "()[]{}"',
      trace: ['( → push', ') → pop ( khớp', '[ → push', '] → pop [ khớp', '{ → push', '} → pop { khớp → rỗng → true'],
      output: 'true',
    },
    pitfalls: ['Quên check stack rỗng khi gặp ngoặc đóng', 'Dùng counter thay stack sẽ sai với “([)]”'],
  },
  'best-time-stock-121': {
    slug: 'best-time-stock-121',
    blindNo: 121,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Tối ưu 1 giao dịch → track min-so-far + max-profit-so-far trong 1 pass.',
    checklist: [
      'minPrice = giá đầu tiên',
      'profit = max(profit, price - minPrice)',
      'minPrice = min(minPrice, price)',
      'Không bán khống: profit tối thiểu là 0',
    ],
    filename: 'max-profit.ts',
    code: `function maxProfit(prices: number[]): number {
  let min = prices[0], best = 0;
  for (const p of prices) {
    best = Math.max(best, p - min);
    min = Math.min(min, p);
  }
  return best;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'prices = [7,1,5,3,6,4]',
      trace: ['min=7,best=0', 'p=1 → best=0, min=1', 'p=5 → best=4', 'p=3 → best=4', 'p=6 → best=5', 'p=4 → best=5'],
      output: '5 (mua 1 bán 6)',
    },
    pitfalls: ['Brute force i<j là O(n²)', 'Nhầm cho phép nhiều giao dịch (đó là bài 122)'],
  },
  'binary-search-704': {
    slug: 'binary-search-704',
    blindNo: 704,
    time: 'O(log n)',
    space: 'O(1)',
    fallbackMeta: {
      title: 'Binary Search',
      viTitle: 'Template không bao giờ sai',
      summary: 'Template lower-bound [l, r): hỏi predicate đơn điệu, thu hẹp một nửa mỗi bước. Nền tảng cho mọi bài search trong Blind75.',
      pattern: 'Binary Search',
      category: 'Binary',
      difficulty: 'Easy',
    },
    rule: 'Mảng sorted hoặc “answer-space đơn điệu” → Binary Search, viết template [l, r) để khỏi off-by-one.',
    checklist: [
      'Điều kiện sort tăng dần?',
      'Viết vòng while (l < r), m = (l+r)>>1',
      'Đúng → r = m, sai → l = m+1',
      'Return l và verify nums[l] === target',
    ],
    filename: 'binary-search.ts',
    code: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] >= target) r = m;
    else l = m + 1;
  }
  return nums[l] === target ? l : -1;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [-1,0,3,5,9,12], target = 9',
      trace: ['[0,6) m=3 (5) < 9 → [4,6)', 'm=5 (12) ≥ 9 → [4,5)', 'm=4 (9) ≥ 9 → [4,4) dừng → l=4'],
      output: '4',
    },
    pitfalls: ['Dùng (l+r)/2 tràn số ở ngôn ngữ khác (JS an toàn hơn)', 'Quên verify sau vòng lặp'],
  },
  'lowest-common-ancestor-235': {
    slug: 'lowest-common-ancestor-235',
    blindNo: 235,
    time: 'O(h)',
    space: 'O(1)',
    rule: 'BST + tìm kiếm theo giá trị → so sánh và đi 1 nhánh, không cần duyệt cả cây.',
    checklist: [
      'p.val và q.val đều < root.val → sang trái',
      'Đều > root.val → sang phải',
      'Ngược lại (rẽ nhánh hoặc trùng) → return root',
      'Không cần đệ quy cả 2 nhánh',
    ],
    filename: 'lca-bst.ts',
    code: `function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) {
  let cur: TreeNode | null = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'root=[6,2,8,0,4,7,9], p=2, q=8',
      trace: ['cur=6: 2<6 nhưng 8>6 → rẽ nhánh → return 6'],
      output: 'node 6',
    },
    pitfalls: ['Nhầm với LCA cây nhị phân thường (bài 236 cần đệ quy)', 'Quên case p hoặc q chính là ancestor'],
  },
  'climbing-stairs-70': {
    slug: 'climbing-stairs-70',
    blindNo: 70,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Đếm số cách với bước 1/2 → Fibonacci. Hỏi min/max cách → DP với rolling array.',
    checklist: [
      'Base: dp[1]=1, dp[2]=2',
      'Công thức: dp[i] = dp[i-1] + dp[i-2]',
      'Chỉ cần 2 biến a, b (rolling)',
      'n=1 là edge case hay quên',
    ],
    filename: 'climb-stairs.ts',
    code: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 5',
      trace: ['a=1,b=2', 'i=3 → a=2,b=3', 'i=4 → a=3,b=5', 'i=5 → a=5,b=8'],
      output: '8',
    },
    pitfalls: ['Đệ quy không memo → O(2^n) timeout', 'Mảng dp O(n) vẫn đúng nhưng phí bộ nhớ'],
  },
};

export const getGuide = (slug: string): Guide | undefined => GUIDES[slug];
export const guideCount = Object.keys(GUIDES).length;
