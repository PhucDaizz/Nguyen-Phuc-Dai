// Blind 75 — full list, nhóm theo category kiểu NeetCode.
// NOTE: `summary` là diễn giải ngắn bằng tiếng Việt do mình tự viết (không copy
// nguyên văn đề LeetCode). Link gốc LeetCode đính kèm mỗi bài để đọc đề đầy đủ.
// "Merge K Sorted Lists" xuất hiện ở cả Linked List và Heap (giống NeetCode) —
// progress key theo `no` nên tick 1 nơi là xong cả 2.

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface BlindProblem {
  no: number; // LeetCode number
  lcSlug: string; // slug trên leetcode.com/problems/<slug>/
  title: string;
  viTitle: string; // tên tiếng Việt ngắn gọn
  difficulty: Difficulty;
  category: string;
  pattern: string;
  tags: string[];
  summary: string; // diễn giải ý tưởng 1-2 câu (tự viết)
  premium?: boolean;
  guideSlug?: string; // slug bài hướng dẫn nội bộ (/blog/:guideSlug), nếu đã có
}

export const leetcodeUrl = (p: BlindProblem) =>
  `https://leetcode.com/problems/${p.lcSlug}/`;

export const BLIND75: BlindProblem[] = [
  // ---------- ARRAY (10) ----------
  { no: 1, lcSlug: 'two-sum', title: 'Two Sum', viTitle: 'Cặp số tổng bằng target', difficulty: 'Easy', category: 'Array', pattern: 'Hash Map', tags: ['Array', 'Hash Table'], summary: 'Lưu số đã thấy vào map, mỗi số chỉ hỏi “phần bù còn thiếu” — 1 pass O(n).', guideSlug: 'two-sum-1' },
  { no: 121, lcSlug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', viTitle: 'Mua thấp bán cao 1 lần', difficulty: 'Easy', category: 'Array', pattern: 'Greedy', tags: ['Array', 'DP'], summary: 'Giữ giá thấp nhất từng thấy, mỗi ngày tính lời nếu bán hôm nay.', guideSlug: 'best-time-stock-121' },
  { no: 217, lcSlug: 'contains-duplicate', title: 'Contains Duplicate', viTitle: 'Mảng có trùng không?', difficulty: 'Easy', category: 'Array', pattern: 'Hash Set', tags: ['Array', 'Hash Table', 'Sorting'], summary: 'Bỏ từng số vào set, gặp số đã có là return true.' },
  { no: 238, lcSlug: 'product-of-array-except-self', title: 'Product of Array Except Self', viTitle: 'Tích mọi phần tử trừ chính nó', difficulty: 'Medium', category: 'Array', pattern: 'Prefix / Suffix', tags: ['Array', 'Prefix Sum'], summary: 'Prefix pass rồi suffix pass, không dùng phép chia, O(1) bộ nhớ phụ.' },
  { no: 53, lcSlug: 'maximum-subarray', title: 'Maximum Subarray', viTitle: 'Dãy con tổng lớn nhất (Kadane)', difficulty: 'Medium', category: 'Array', pattern: 'Kadane', tags: ['Array', 'DP', 'Divide and Conquer'], summary: 'Kadane: cộng tiếp hay bắt đầu lại từ số hiện tại — cái nào lớn hơn lấy.' },
  { no: 152, lcSlug: 'maximum-product-subarray', title: 'Maximum Product Subarray', viTitle: 'Dãy con tích lớn nhất', difficulty: 'Medium', category: 'Array', pattern: 'DP (min/max)', tags: ['Array', 'DP'], summary: 'Track đồng thời max và min vì số âm nhân nhau lật dấu.' },
  { no: 153, lcSlug: 'find-minimum-in-rotated-sorted-array', title: 'Find Minimum in Rotated Sorted Array', viTitle: 'Min của mảng xoay', difficulty: 'Medium', category: 'Array', pattern: 'Binary Search', tags: ['Array', 'Binary Search'], summary: 'So nums[mid] với nums[right] để biết min nằm nửa nào.' },
  { no: 33, lcSlug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', viTitle: 'Tìm kiếm trong mảng xoay', difficulty: 'Medium', category: 'Array', pattern: 'Binary Search', tags: ['Array', 'Binary Search'], summary: 'Ít nhất một nửa luôn sorted — kiểm tra target có trong nửa sorted không.' },
  { no: 15, lcSlug: '3sum', title: '3Sum', viTitle: '3 số tổng bằng 0', difficulty: 'Medium', category: 'Array', pattern: 'Sort + Two Pointers', tags: ['Array', 'Two Pointers', 'Sorting'], summary: 'Sort rồi cố định 1 số, two-pointers cho 2 số còn lại, skip trùng.' },
  { no: 11, lcSlug: 'container-with-most-water', title: 'Container With Most Water', viTitle: 'Bình chứa nhiều nước nhất', difficulty: 'Medium', category: 'Array', pattern: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Greedy'], summary: '2 đầu chụm vào, luôn dời cột thấp hơn vì đó là bottleneck.' },

  // ---------- BINARY (5) ----------
  { no: 371, lcSlug: 'sum-of-two-integers', title: 'Sum of Two Integers', viTitle: 'Cộng không dùng +', difficulty: 'Medium', category: 'Binary', pattern: 'Bit Manipulation', tags: ['Math', 'Bit Manipulation'], summary: 'XOR là cộng không nhớ, AND<<1 là phần nhớ, lặp tới khi nhớ = 0.' },
  { no: 191, lcSlug: 'number-of-1-bits', title: 'Number of 1 Bits', viTitle: 'Đếm bit 1', difficulty: 'Easy', category: 'Binary', pattern: 'Bit Manipulation', tags: ['Bit Manipulation', 'Divide and Conquer'], summary: 'n & (n-1) gạt bit 1 thấp nhất, đếm tới khi n = 0.' },
  { no: 338, lcSlug: 'counting-bits', title: 'Counting Bits', viTitle: 'Đếm bit 1 từ 0→n', difficulty: 'Easy', category: 'Binary', pattern: 'DP + Bits', tags: ['DP', 'Bit Manipulation'], summary: 'dp[i] = dp[i>>1] + (i&1): bỏ bit cuối rồi cộng lại.' },
  { no: 268, lcSlug: 'missing-number', title: 'Missing Number', viTitle: 'Số còn thiếu 0→n', difficulty: 'Easy', category: 'Binary', pattern: 'XOR / Gauss', tags: ['Array', 'Math', 'Bit Manipulation'], summary: 'XOR hết index và value, phần dư chính là số thiếu.' },
  { no: 190, lcSlug: 'reverse-bits', title: 'Reverse Bits', viTitle: 'Đảo ngược 32 bit', difficulty: 'Easy', category: 'Binary', pattern: 'Bit Manipulation', tags: ['Bit Manipulation', 'Divide and Conquer'], summary: 'Dịch từng bit sang vị trí đối xứng, hoặc cache 8-bit cho nhanh.' },

  // ---------- DYNAMIC PROGRAMMING (11) ----------
  { no: 70, lcSlug: 'climbing-stairs', title: 'Climbing Stairs', viTitle: 'Leo cầu thang (Fibonacci trá hình)', difficulty: 'Easy', category: 'Dynamic Programming', pattern: 'Fibonacci DP', tags: ['Math', 'DP', 'Memoization'], summary: 'dp[n] = dp[n-1] + dp[n-2], rolling 2 biến là đủ.', guideSlug: 'climbing-stairs-70' },
  { no: 322, lcSlug: 'coin-change', title: 'Coin Change', viTitle: 'Ít xu nhất đổi được amount', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Unbounded Knapsack', tags: ['Array', 'DP', 'BFS'], summary: 'dp[x] = 1 + min(dp[x-c]) với mọi mệnh giá c, duyệt amount tăng dần.' },
  { no: 300, lcSlug: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', viTitle: 'Dãy con tăng dài nhất', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'LIS', tags: ['Array', 'Binary Search', 'DP'], summary: 'O(n²) DP cơ bản; muốn O(n log n) thì patience sorting + binary search.' },
  { no: 1143, lcSlug: 'longest-common-subsequence', title: 'Longest Common Subsequence', viTitle: 'Chuỗi con chung dài nhất', difficulty: 'Medium', category: 'Dynamic Programming', pattern: '2D DP', tags: ['String', 'DP'], summary: 'Khớp thì +1 đường chéo, lệch thì max(trên, trái) — bảng 2D.' },
  { no: 139, lcSlug: 'word-break', title: 'Word Break', viTitle: 'Cắt chuỗi thành từ điển', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'DP + Hash Set', tags: ['Hash Table', 'String', 'DP', 'Trie'], summary: 'dp[i] = có vị trí j < i sao cho dp[j] đúng và s[j:i] trong dict.' },
  { no: 39, lcSlug: 'combination-sum', title: 'Combination Sum', viTitle: 'Tổ hợp tổng bằng target', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Backtracking', tags: ['Array', 'Backtracking'], summary: 'DFS chọn/bỏ từng candidate (được dùng lại), cắt nhánh khi vượt target.' },
  { no: 198, lcSlug: 'house-robber', title: 'House Robber', viTitle: 'Trộm nhà không kề nhau', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Linear DP', tags: ['Array', 'DP'], summary: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]): trộm hay bỏ nhà i.' },
  { no: 213, lcSlug: 'house-robber-ii', title: 'House Robber II', viTitle: 'Trộm nhà vòng tròn', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Linear DP × 2', tags: ['Array', 'DP'], summary: 'Vòng tròn → chạy robber thường 2 lần: bỏ nhà đầu / bỏ nhà cuối.' },
  { no: 91, lcSlug: 'decode-ways', title: 'Decode Ways', viTitle: 'Đếm cách giải mã số→chữ', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Linear DP', tags: ['String', 'DP'], summary: '1 chữ số (1-9) hoặc 2 chữ số (10-26) — cộng dồn như climbing stairs.' },
  { no: 62, lcSlug: 'unique-paths', title: 'Unique Paths', viTitle: 'Số đường đi trên lưới', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Grid DP', tags: ['Math', 'DP', 'Combinatorics'], summary: 'Ô (i,j) = trên + trái; tối ưu còn 1 hàng rolling.' },
  { no: 55, lcSlug: 'jump-game', title: 'Jump Game', viTitle: 'Nhảy tới đích được không?', difficulty: 'Medium', category: 'Dynamic Programming', pattern: 'Greedy', tags: ['Array', 'DP', 'Greedy'], summary: 'Greedy từ phải sang trái: goal lùi dần, tới được index 0 là thắng.' },

  // ---------- GRAPH (8) ----------
  { no: 133, lcSlug: 'clone-graph', title: 'Clone Graph', viTitle: 'Sao chép đồ thị', difficulty: 'Medium', category: 'Graph', pattern: 'DFS/BFS + Map', tags: ['Hash Table', 'DFS', 'BFS', 'Graph'], summary: 'Map old→new, DFS tạo node mới rồi nối neighbor đệ quy.' },
  { no: 207, lcSlug: 'course-schedule', title: 'Course Schedule', viTitle: 'Học hết môn được không?', difficulty: 'Medium', category: 'Graph', pattern: 'Topo Sort / Cycle Detect', tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'], summary: 'Đồ thị có hướng có chu trình không? DFS 3 màu hoặc Kahn.' },
  { no: 417, lcSlug: 'pacific-atlantic-water-flow', title: 'Pacific Atlantic Water Flow', viTitle: 'Nước chảy ra 2 đại dương', difficulty: 'Medium', category: 'Graph', pattern: 'Multi-source BFS/DFS', tags: ['Array', 'DFS', 'BFS', 'Matrix'], summary: 'Đi ngược từ 2 bờ vào trong, ô nào cả 2 phía tới được thì lấy.' },
  { no: 200, lcSlug: 'number-of-islands', title: 'Number of Islands', viTitle: 'Đếm đảo', difficulty: 'Medium', category: 'Graph', pattern: 'Flood Fill', tags: ['Array', 'DFS', 'BFS', 'Matrix', 'Union Find'], summary: 'Gặp đất chưa thăm thì +1 và flood-fill cả đảo.' },
  { no: 128, lcSlug: 'longest-consecutive-sequence', title: 'Longest Consecutive Sequence', viTitle: 'Dãy liên tiếp dài nhất O(n)', difficulty: 'Medium', category: 'Graph', pattern: 'Hash Set', tags: ['Array', 'Hash Table', 'Union Find'], summary: 'Chỉ đếm từ “đầu dãy” (thiếu x-1), mỗi số thăm đúng 1 lần.' },
  { no: 269, lcSlug: 'alien-dictionary', title: 'Alien Dictionary', viTitle: 'Thứ tự bảng chữ cái người ngoài hành tinh', difficulty: 'Hard', category: 'Graph', pattern: 'Topo Sort', tags: ['Array', 'String', 'DFS', 'BFS', 'Graph', 'Topological Sort'], summary: 'Dựng cạnh từ cặp từ kề nhau đầu tiên khác chữ, rồi topo-sort.', premium: true },
  { no: 261, lcSlug: 'graph-valid-tree', title: 'Graph Valid Tree', viTitle: 'Đồ thị có phải cây?', difficulty: 'Medium', category: 'Graph', pattern: 'Union Find / DFS', tags: ['DFS', 'BFS', 'Graph', 'Union Find'], summary: 'Cây ⟺ cạnh = n-1 và liên thông hết (union-find hoặc DFS).', premium: true },
  { no: 323, lcSlug: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components', viTitle: 'Đếm thành phần liên thông', difficulty: 'Medium', category: 'Graph', pattern: 'Union Find', tags: ['DFS', 'BFS', 'Union Find', 'Graph'], summary: 'Union từng cạnh, đếm số root khác nhau.', premium: true },

  // ---------- INTERVAL (5) ----------
  { no: 57, lcSlug: 'insert-interval', title: 'Insert Interval', viTitle: 'Chèn đoạn mới', difficulty: 'Medium', category: 'Interval', pattern: 'Merge Intervals', tags: ['Array'], summary: 'Thêm đoạn trước (hết trước khi new bắt đầu), merge đoạn giao, thêm đoạn sau.' },
  { no: 56, lcSlug: 'merge-intervals', title: 'Merge Intervals', viTitle: 'Gộp đoạn giao nhau', difficulty: 'Medium', category: 'Interval', pattern: 'Sort + Merge', tags: ['Array', 'Sorting'], summary: 'Sort theo start, giao nhau thì kéo dài end.' },
  { no: 435, lcSlug: 'non-overlapping-intervals', title: 'Non-overlapping Intervals', viTitle: 'Xóa ít nhất để hết giao', difficulty: 'Medium', category: 'Interval', pattern: 'Greedy by End', tags: ['Array', 'DP', 'Greedy', 'Sorting'], summary: 'Sort theo end, giữ đoạn kết thúc sớm nhất — tham lam kinh điển.' },
  { no: 252, lcSlug: 'meeting-rooms', title: 'Meeting Rooms', viTitle: 'Họp hết trong 1 phòng?', difficulty: 'Easy', category: 'Interval', pattern: 'Sort + Scan', tags: ['Array', 'Sorting'], summary: 'Sort theo start, chỉ cần 1 cặp giao nhau là false.', premium: true },
  { no: 253, lcSlug: 'meeting-rooms-ii', title: 'Meeting Rooms II', viTitle: 'Cần ít nhất mấy phòng?', difficulty: 'Medium', category: 'Interval', pattern: 'Min-Heap / Sweep', tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap'], summary: 'Sweep line: +1 khi bắt đầu, -1 khi kết thúc, đỉnh cao nhất là đáp án.', premium: true },

  // ---------- LINKED LIST (6) ----------
  { no: 206, lcSlug: 'reverse-linked-list', title: 'Reverse Linked List', viTitle: 'Đảo linked list', difficulty: 'Easy', category: 'Linked List', pattern: 'In-place Reverse', tags: ['Linked List', 'Recursion'], summary: '3 con trỏ prev/curr/next, lật mũi tên từng node một.' },
  { no: 141, lcSlug: 'linked-list-cycle', title: 'Linked List Cycle', viTitle: 'List có vòng không?', difficulty: 'Easy', category: 'Linked List', pattern: 'Slow / Fast', tags: ['Hash Table', 'Linked List', 'Two Pointers'], summary: 'Rùa-thỏ: thỏ gặp rùa là có vòng, thỏ tới null là không.' },
  { no: 21, lcSlug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', viTitle: 'Trộn 2 list đã sort', difficulty: 'Easy', category: 'Linked List', pattern: 'Two Pointers', tags: ['Linked List', 'Recursion'], summary: 'Dummy head, node nào nhỏ hơn thì nối, hết thì nối phần còn lại.' },
  { no: 23, lcSlug: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', viTitle: 'Trộn K list đã sort', difficulty: 'Hard', category: 'Linked List', pattern: 'Min-Heap', tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'], summary: 'Min-heap K head, pop nhỏ nhất rồi push next — O(N log K).' },
  { no: 19, lcSlug: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List', viTitle: 'Xóa node thứ N từ cuối', difficulty: 'Medium', category: 'Linked List', pattern: 'Two Pointers Gap', tags: ['Linked List', 'Two Pointers'], summary: 'Fast đi trước N bước, rồi cả 2 cùng đi — slow dừng trước node cần xóa.' },
  { no: 143, lcSlug: 'reorder-list', title: 'Reorder List', viTitle: 'Sắp lại L0→Ln→L1→Ln-1', difficulty: 'Medium', category: 'Linked List', pattern: 'Split + Reverse + Merge', tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'], summary: 'Chia đôi (slow/fast) → đảo nửa sau → đan xen 2 nửa.' },

  // ---------- MATRIX (4) ----------
  { no: 73, lcSlug: 'set-matrix-zeroes', title: 'Set Matrix Zeroes', viTitle: 'Zero cả hàng/cột có số 0', difficulty: 'Medium', category: 'Matrix', pattern: 'In-place Markers', tags: ['Array', 'Hash Table', 'Matrix'], summary: 'Dùng hàng 0 + cột 0 làm cờ đánh dấu, O(1) bộ nhớ.' },
  { no: 54, lcSlug: 'spiral-matrix', title: 'Spiral Matrix', viTitle: 'Duyệt ma trận xoắn ốc', difficulty: 'Medium', category: 'Matrix', pattern: 'Boundary Shrink', tags: ['Array', 'Matrix', 'Simulation'], summary: '4 biên top/bottom/left/right, đi hết 1 vòng thì co biên lại.' },
  { no: 48, lcSlug: 'rotate-image', title: 'Rotate Image', viTitle: 'Xoay ma trận 90°', difficulty: 'Medium', category: 'Matrix', pattern: 'Transpose + Reflect', tags: ['Array', 'Math', 'Matrix'], summary: 'Chuyển vị rồi lật ngang từng hàng — inplace.' },
  { no: 79, lcSlug: 'word-search', title: 'Word Search', viTitle: 'Tìm từ trên bảng chữ', difficulty: 'Medium', category: 'Matrix', pattern: 'Backtracking', tags: ['Array', 'Backtracking', 'Matrix'], summary: 'DFS 4 hướng + đánh dấu đã thăm, sai thì backtrack.' },

  // ---------- STRING (10) ----------
  { no: 3, lcSlug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', viTitle: 'Chuỗi con dài nhất không lặp', difficulty: 'Medium', category: 'String', pattern: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], summary: 'Cửa sổ trượt + set/map: gặp trùng thì co trái tới khi hết trùng.' },
  { no: 424, lcSlug: 'longest-repeating-character-replacement', title: 'Longest Repeating Character Replacement', viTitle: 'Đổi K chữ để chuỗi đồng nhất dài nhất', difficulty: 'Medium', category: 'String', pattern: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], summary: 'Cửa sổ hợp lệ khi dài - tần suất max ≤ k.' },
  { no: 76, lcSlug: 'minimum-window-substring', title: 'Minimum Window Substring', viTitle: 'Cửa sổ nhỏ nhất chứa hết chữ của t', difficulty: 'Hard', category: 'String', pattern: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], summary: 'Mở rộng phải tới khi đủ chữ, co trái để tối thiểu, track have/need.' },
  { no: 242, lcSlug: 'valid-anagram', title: 'Valid Anagram', viTitle: '2 chuỗi có phải hoán vị?', difficulty: 'Easy', category: 'String', pattern: 'Frequency Count', tags: ['Hash Table', 'String', 'Sorting'], summary: 'Đếm tần suất 26 chữ, 2 bảng bằng nhau là anagram.' },
  { no: 49, lcSlug: 'group-anagrams', title: 'Group Anagrams', viTitle: 'Nhóm các anagram', difficulty: 'Medium', category: 'String', pattern: 'Hash Map (sorted key)', tags: ['Array', 'Hash Table', 'String', 'Sorting'], summary: 'Key = chuỗi đã sort (hoặc tuple 26 số), cùng key vào 1 nhóm.' },
  { no: 20, lcSlug: 'valid-parentheses', title: 'Valid Parentheses', viTitle: 'Ngoặc đúng hay sai?', difficulty: 'Easy', category: 'String', pattern: 'Stack', tags: ['String', 'Stack'], summary: 'Mở thì push, đóng thì pop đối chiếu, cuối stack phải rỗng.', guideSlug: 'valid-parentheses-20' },
  { no: 125, lcSlug: 'valid-palindrome', title: 'Valid Palindrome', viTitle: 'Chuỗi đối xứng?', difficulty: 'Easy', category: 'String', pattern: 'Two Pointers', tags: ['Two Pointers', 'String'], summary: 'Bỏ ký tự lạ, lowercase, 2 đầu chụm vào so sánh.' },
  { no: 5, lcSlug: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', viTitle: 'Chuỗi đối xứng dài nhất', difficulty: 'Medium', category: 'String', pattern: 'Expand Around Center', tags: ['String', 'DP'], summary: 'Mỗi vị trí bung ra 2 phía (tâm lẻ + tâm chẵn), giữ cái dài nhất.' },
  { no: 647, lcSlug: 'palindromic-substrings', title: 'Palindromic Substrings', viTitle: 'Đếm chuỗi con đối xứng', difficulty: 'Medium', category: 'String', pattern: 'Expand Around Center', tags: ['String', 'DP'], summary: 'Giống bài 5 nhưng đếm thay vì giữ chuỗi dài nhất.' },
  { no: 271, lcSlug: 'encode-and-decode-strings', title: 'Encode and Decode Strings', viTitle: 'Mã hóa danh sách chuỗi', difficulty: 'Medium', category: 'String', pattern: 'Length Prefix', tags: ['Array', 'String', 'Design'], summary: 'Tiền tố độ dài + #: “4#leet” — decode đọc số rồi cắt đúng bấy nhiêu.', premium: true },

  // ---------- TREE (13) ----------
  { no: 104, lcSlug: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', viTitle: 'Chiều cao cây', difficulty: 'Easy', category: 'Tree', pattern: 'DFS', tags: ['Tree', 'DFS', 'BFS'], summary: 'Đệ quy: 1 + max(trái, phải), null thì 0.' },
  { no: 100, lcSlug: 'same-tree', title: 'Same Tree', viTitle: '2 cây giống nhau?', difficulty: 'Easy', category: 'Tree', pattern: 'DFS', tags: ['Tree', 'DFS', 'BFS'], summary: 'Cùng null → true, 1 null → false, giá trị bằng + 2 nhánh cùng đúng.' },
  { no: 226, lcSlug: 'invert-binary-tree', title: 'Invert Binary Tree', viTitle: 'Lật gương cây', difficulty: 'Easy', category: 'Tree', pattern: 'DFS/BFS', tags: ['Tree', 'DFS', 'BFS'], summary: 'Swap trái/phải mọi node — đệ quy 3 dòng.' },
  { no: 124, lcSlug: 'binary-tree-maximum-path-sum', title: 'Binary Tree Maximum Path Sum', viTitle: 'Đường đi tổng lớn nhất', difficulty: 'Hard', category: 'Tree', pattern: 'DFS + Global Max', tags: ['Tree', 'DFS', 'DP'], summary: 'Mỗi node trả về gain tốt nhất 1 nhánh, cập nhật max toàn cục bằng cả 2 nhánh.' },
  { no: 102, lcSlug: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', viTitle: 'Duyệt theo tầng (BFS)', difficulty: 'Medium', category: 'Tree', pattern: 'BFS', tags: ['Tree', 'BFS'], summary: 'Queue, mỗi vòng xử lý đúng số node của tầng hiện tại.' },
  { no: 297, lcSlug: 'serialize-and-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree', viTitle: 'Biến cây thành chuỗi và ngược lại', difficulty: 'Hard', category: 'Tree', pattern: 'Preorder + Queue', tags: ['String', 'Tree', 'DFS', 'BFS', 'Design'], summary: 'Preorder với dấu # cho null, deserialize đọc lại theo đúng thứ tự.' },
  { no: 572, lcSlug: 'subtree-of-another-tree', title: 'Subtree of Another Tree', viTitle: 'Cây con của cây khác?', difficulty: 'Easy', category: 'Tree', pattern: 'DFS (Same Tree)', tags: ['Tree', 'DFS', 'String Matching'], summary: 'Mỗi node thử sameTree(root, subRoot), sai thì đệ quy 2 nhánh.' },
  { no: 105, lcSlug: 'construct-binary-tree-from-preorder-and-inorder-traversal', title: 'Construct Tree from Preorder and Inorder', viTitle: 'Dựng cây từ preorder + inorder', difficulty: 'Medium', category: 'Tree', pattern: 'Divide & Conquer', tags: ['Array', 'Hash Table', 'Tree', 'Divide and Conquer'], summary: 'Đầu preorder là root, cắt inorder thành trái/phải bằng map index.' },
  { no: 230, lcSlug: 'kth-smallest-element-in-a-bst', title: 'Kth Smallest Element in a BST', viTitle: 'Số nhỏ thứ K trong BST', difficulty: 'Medium', category: 'Tree', pattern: 'Inorder', tags: ['Tree', 'DFS', 'BST', 'Binary Search'], summary: 'Inorder BST ra dãy tăng — phần tử thứ K là đáp án.' },
  { no: 235, lcSlug: 'lowest-common-ancestor-of-a-binary-search-tree', title: 'Lowest Common Ancestor of a BST', viTitle: 'Tổ tiên chung trong BST', difficulty: 'Medium', category: 'Tree', pattern: 'BST Walk', tags: ['Tree', 'DFS', 'BST'], summary: 'Cùng nhỏ đi trái, cùng lớn đi phải, rẽ nhánh là LCA.', guideSlug: 'lowest-common-ancestor-235' },
  { no: 208, lcSlug: 'implement-trie-prefix-tree', title: 'Implement Trie (Prefix Tree)', viTitle: 'Cài đặt Trie', difficulty: 'Medium', category: 'Tree', pattern: 'Trie', tags: ['Hash Table', 'String', 'Design', 'Trie'], summary: 'Node con theo từng chữ + cờ kết thúc từ, insert/search O(m).' },
  { no: 211, lcSlug: 'design-add-and-search-words-data-structure', title: 'Design Add and Search Words Data Structure', viTitle: 'Trie tìm kiếm có dấu .', difficulty: 'Medium', category: 'Tree', pattern: 'Trie + DFS', tags: ['String', 'DFS', 'Design', 'Trie'], summary: 'Trie thường + DFS thử 26 nhánh khi gặp “.”.' },
  { no: 212, lcSlug: 'word-search-ii', title: 'Word Search II', viTitle: 'Tìm nhiều từ trên bảng', difficulty: 'Hard', category: 'Tree', pattern: 'Trie + Backtracking', tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'], summary: 'Ném hết từ vào Trie rồi DFS 1 lần, cắt nhánh khi prefix không tồn tại.' },

  // ---------- HEAP (3 — Merge K trùng với Linked List, giống NeetCode) ----------
  { no: 23, lcSlug: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', viTitle: 'Trộn K list đã sort', difficulty: 'Hard', category: 'Heap', pattern: 'Min-Heap', tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'], summary: 'Min-heap K head, pop nhỏ nhất rồi push next — O(N log K).' },
  { no: 347, lcSlug: 'top-k-frequent-elements', title: 'Top K Frequent Elements', viTitle: 'K phần tử xuất hiện nhiều nhất', difficulty: 'Medium', category: 'Heap', pattern: 'Heap / Bucket Sort', tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Heap', 'Bucket Sort', 'Counting', 'Quickselect'], summary: 'Đếm tần suất rồi bucket theo tần suất, hoặc min-heap size K.' },
  { no: 295, lcSlug: 'find-median-from-data-stream', title: 'Find Median from Data Stream', viTitle: 'Trung vị của dòng dữ liệu', difficulty: 'Hard', category: 'Heap', pattern: 'Two Heaps', tags: ['Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'], summary: 'Max-heap nửa dưới + min-heap nửa trên, cân bằng size chênh ≤ 1.' },
];

export const BLIND_CATEGORIES = [...new Set(BLIND75.map((p) => p.category))];

export const blindCount = BLIND75.length; // 75 entries hiển thị (74 bài unique)
