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
  // --- Mở rộng theo dsa-content-guide (optional, render khi có) ---
  insight?: string; // Pattern/Insight: TẠI SAO pattern này xuất hiện
  bruteForce?: string; // brute force là gì → vấn đề → tối ưu ra sao
  idea?: string[]; // ý tưởng từng bước TRƯỚC code
  decisions?: string[]; // code decisions "quyết định → lý do"
  complexityWhy?: { time: string; space: string }; // complexity kèm giải thích
  takeaway?: string; // Pattern Memory 1 câu
  relatedSlugs?: string[]; // bài cùng pattern (ưu tiên hơn cùng category)
}

export const GUIDES: Record<string, Guide> = {
  'insert-interval-57': {
    slug: 'insert-interval-57',
    blindNo: 57,
    time: 'O(n)',
    space: 'O(n)',
    rule: '3 vùng: hết trước → giữ, giao nhau → gộp vào new, bắt đầu sau → chèn new rồi giữ.',
    insight: 'Danh sách đã sort và không giao nhau nên vị trí của đoạn mới chỉ có ba khả năng: nằm hẳn trước (giữ nguyên), giao nhau (gộp), nằm hẳn sau (chèn rồi giữ nốt). Vì đã sort, ba vùng này xuất hiện theo đúng thứ tự đó trong một lần quét: giữ hết vùng trước, gộp hết vùng giao, chèn một lần rồi giữ nốt vùng sau. Không cần sort lại, không cần hai pass.',
    bruteForce: 'Thêm vào rồi sort lại và merge như bài 56 — O(n log n). Vấn đề là phí tính đã-sort của input. Tối ưu: một pass O(n) tận dụng thứ tự sẵn có.',
    checklist: ['Input đã có tính chất gì dùng được (sort sẵn, không giao)?', 'Một phần tử so với đoạn mới rơi vào mấy vùng (trước / giao / sau)?', 'Ba vùng có xuất hiện theo thứ tự trong một lần quét không?'],
    idea: ['Bước 1: giữ nguyên mọi đoạn kết thúc trước khi đoạn mới bắt đầu.', 'Bước 2: với mọi đoạn giao nhau, mở rộng đoạn mới bằng min start và max end.', 'Bước 3: chèn đoạn mới đã gộp xong.', 'Bước 4: giữ nốt phần còn lại.'],
    decisions: ['So bằng end < newStart cho vùng trước và start ≤ newEnd cho vùng giao — chạm nhau tính là giao (đề merge), sai chiều là mất đoạn.', 'Chèn đúng một lần sau vòng gộp — chèn trong vòng lặp là trùng hoặc sai thứ tự.', 'Ghi đè newInterval thay vì track riêng — đoạn gộp luôn là một đoạn duy nhất nên một biến là đủ.'],
    complexityWhy: { time: 'O(n): mỗi đoạn xét đúng một lần trong ba vòng nối tiếp.', space: 'O(n): mảng kết quả (không tính output thì O(1) phụ).' },
    takeaway: 'Khi chèn vào dãy đã sort không giao: một pass ba vùng — giữ trước, gộp giao, chèn rồi giữ sau.',
    relatedSlugs: ['merge-intervals-56', 'non-overlapping-435'],
    filename: 'insert-interval.ts',
    code: `function insert(intervals: number[][], newInterval: number[]): number[][] {
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
    highlightLines: [7],
    dryRun: {
      input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      trace: ['[1,3]: end 3 ≥ 2 → không giữ, gộp → new = [1,5]', '[6,9]: start 6 > 5 → chèn [1,5], giữ [6,9]'],
      output: '[[1,5],[6,9]]',
    },
    pitfalls: ['Gộp xong quên đẩy new vào trước khi giữ phần sau', 'So sánh sai chiều (end < start là hết trước, start > end là sau)'],
  },
  'merge-intervals-56': {
    slug: 'merge-intervals-56',
    blindNo: 56,
    time: 'O(n log n)',
    space: 'O(n)',
    rule: 'Sort theo start rồi quét: giao thì kéo end, không thì chốt đoạn cũ.',
    insight: 'Hai đoạn giao nhau thì thứ tự xuất hiện trong input là ngẫu nhiên nên không gộp trực tiếp được. Sort theo start biến bài toán thành tuyến tính: mọi đoạn có thể gộp với đoạn hiện tại đều nằm kề ngay sau nó (vì start đã tăng dần). Chỉ cần giữ “đoạn đang gộp” và quyết định kéo dài hay chốt — mỗi đoạn xử lý đúng một lần.',
    bruteForce: 'Brute force: lặp đi lặp lại việc tìm cặp giao nhau để gộp → O(n²) vòng. Vấn đề là thiếu thứ tự. Tối ưu: sort một lần rồi quét — O(n log n).',
    checklist: ['Sort theo gì để đoạn gộp được nằm kề nhau? (theo start)', 'Khi nào kéo dài đoạn hiện tại, khi nào chốt nó? (s <= lastEnd thì kéo bằng max, ngược lại chốt)', 'Sau vòng lặp còn việc gì? (push/chốt đoạn cuối)'],
    idea: ['Bước 1: sort theo start.', 'Bước 2: giữ res với đoạn đầu; với mỗi [s,e]: nếu s <= last.end thì last.end = max(last.end, e), ngược lại push đoạn mới.', 'Bước 3: return res.'],
    decisions: ['Kéo end bằng max(last.end, e) thay vì gán e → đoạn sau có thể nằm gọn trong đoạn trước (vd [1,10],[2,3]).', 'Khởi tạo res = [intervals[0]] → khỏi nhánh rỗng trong vòng lặp (input đảm bảo non-empty).'],
    complexityWhy: { time: 'O(n log n): sort là phần nặng nhất, quét gộp O(n).', space: 'O(n): mảng kết quả (không tính sort tại chỗ).' },
    takeaway: 'Gộp/sắp xếp các đoạn giao nhau → nghĩ sort theo start rồi quét kéo end.',
    relatedSlugs: ['non-overlapping-435', 'meeting-rooms-252'],
    filename: 'merge-intervals.ts',
    code: `function merge(intervals: number[][]): number[][] {
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
    highlightLines: [7],
    dryRun: {
      input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
      trace: ['[2,6]: 2 ≤ 3 → [1,6]', '[8,10]: 8 > 6 → chốt [1,6], mới [8,10]', '[15,18]: chốt [8,10], mới [15,18]', 'Push nốt [15,18]'],
      output: '[[1,6],[8,10],[15,18]]',
    },
    pitfalls: ['Quên sort trước (input chưa chắc đã sort)', 'Quên push đoạn cuối sau vòng lặp'],
  },
  'non-overlapping-435': {
    slug: 'non-overlapping-435',
    blindNo: 435,
    time: 'O(n log n)',
    space: 'O(1)',
    rule: 'Sort theo END rồi tham lam giữ đoạn kết thúc sớm nhất — chừa chỗ cho đoạn sau.',
    insight: 'Muốn giữ lại nhiều đoạn nhất thì mỗi lần giữ nên chọn đoạn kết thúc sớm nhất — nó “chiếm” ít đường thời gian nhất, chừa chỗ cho nhiều đoạn sau nhất. Sort theo end (không phải start) rồi tham lam: đoạn nào bắt đầu trước khi đoạn đã giữ kết thúc thì buộc phải xóa. Lựa chọn tham này luôn an toàn vì đổi đoạn giữ thành đoạn kết thúc sớm hơn không bao giờ làm tệ đi.',
    bruteForce: 'Brute force/DP: thử mọi tập con không giao → O(2^n) hoặc DP O(n²). Vấn đề là xét lại cùng xung đột nhiều lần. Tối ưu: sort theo end + greedy một pass — O(n log n).',
    checklist: ['Muốn giữ được nhiều đoạn thì mỗi lần nên giữ đoạn nào? (kết thúc sớm nhất → sort theo end)', 'Đoạn nào thì buộc phải xóa? (start < end của đoạn đã giữ)', 'Chạm nhau (start == end) có tính giao không? (không — được giữ)'],
    idea: ['Bước 1: sort theo end.', 'Bước 2: giữ đoạn đầu (end = end của nó).', 'Bước 3: đoạn sau có start >= end thì giữ + cập nhật end, ngược lại đếm xóa.'],
    decisions: ['Sort theo end thay vì start → sort theo start rồi tham lam là sai (vd [1,100],[2,3],[3,4]: giữ [1,100] chỉ được 1, giữ 2 đoạn sau được 2).', 'Điều kiện giữ là >= (không phải >) → chạm nhau không tính giao.'],
    complexityWhy: { time: 'O(n log n): sort là phần nặng, quét O(n).', space: 'O(1) phụ (sort tại chỗ).' },
    takeaway: 'Giữ nhiều đoạn không giao nhất / xóa ít nhất → nghĩ sort theo end rồi tham lam.',
    relatedSlugs: ['merge-intervals-56', 'meeting-rooms-ii-253'],
    filename: 'non-overlapping.ts',
    code: `function eraseOverlapIntervals(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'intervals = [[1,2],[2,3],[3,4],[1,3]] → sort end: [1,2],[2,3],[1,3],[3,4]',
      trace: ['[1,2]: giữ, end=2', '[2,3]: 2≥2 giữ, end=3', '[1,3]: 1<3 xóa (1)', '[3,4]: 3≥3 giữ'],
      output: '1',
    },
    pitfalls: ['Sort theo start rồi tham lam (sai — vd [1,100],[2,3],[3,4] cần giữ 2 đoạn sau)', 'Nhầm điều kiện chạm nhau: start = end là KHÔNG giao (được giữ)'],
  },
  'meeting-rooms-252': {
    slug: 'meeting-rooms-252',
    blindNo: 252,
    time: 'O(n log n)',
    space: 'O(1)',
    rule: 'Sort theo start, chỉ cần 1 cặp giao nhau là false.',
    insight: 'Hai cuộc họp giao nhau thì dù có xếp kiểu gì chúng cũng không chung phòng được — nên chỉ cần phát hiện một cặp giao nhau là kết luận false. Sau khi sort theo start, nếu có giao nhau thì cặp kề trong thứ tự sort chắc chắn giao nhau (cuộc bắt đầu muộn nhất trong nhóm vẫn bắt đầu trước khi cuộc trước đó kết thúc). Vì vậy chỉ cần so cặp kề, khỏi so mọi cặp.',
    bruteForce: 'Brute force: so mọi cặp O(n²). Vấn đề là so thừa — thứ tự thời gian chưa được khai thác. Tối ưu: sort rồi chỉ so cặp kề — O(n log n).',
    checklist: ['Sort theo gì để cặp giao nhau (nếu có) hiện ra ở vị trí kề? (theo start)', 'Điều kiện giao nhau là gì, và chạm nhau (start == end) có tính không? (sau.start < trước.end; chạm nhau vẫn OK)'],
    idea: ['Bước 1: sort theo start.', 'Bước 2: duyệt cặp kề; nếu sau.start < trước.end → return false.', 'Bước 3: hết vòng → true.'],
    decisions: ['So sánh < chặt thay vì <= → họp nối đuôi (hết 10, bắt đầu 10) vẫn chung 1 phòng được.', 'Chỉ so cặp kề sau sort → đủ vì tính chất bắc cầu của thứ tự start, không cần O(n²).'],
    complexityWhy: { time: 'O(n log n): sort chiếm phần lớn, quét cặp kề O(n).', space: 'O(1) phụ (sort tại chỗ, tùy implementation).' },
    takeaway: 'Hỏi “có giao nhau không” trên các đoạn → nghĩ sort theo start rồi quét cặp kề.',
    relatedSlugs: ['meeting-rooms-ii-253', 'merge-intervals-56'],
    filename: 'meeting-rooms.ts',
    code: `function canAttendMeetings(intervals: number[][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    highlightLines: [3],
    dryRun: {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      trace: ['[5,10] vs [0,30]: 5 < 30 → false ngay'],
      output: 'false',
    },
    pitfalls: ['Dùng ≤ thay vì < (họp nối đuôi nhau vẫn 1 phòng được)', 'Quên sort (so cặp kề của mảng chưa sort là sai)'],
  },
  'meeting-rooms-ii-253': {
    slug: 'meeting-rooms-ii-253',
    blindNo: 253,
    time: 'O(n log n)',
    space: 'O(n)',
    rule: 'Sweep line: +1 khi bắt đầu, −1 khi kết thúc (kết thúc trước nếu cùng giờ) — đỉnh là đáp án.',
    insight: 'Số phòng cần thiết tại mỗi thời điểm = số cuộc đang diễn ra đồng thời; đáp án là đỉnh đồng thời cao nhất trong ngày. Mỗi cuộc họp chỉ góp +1 (bắt đầu) và −1 (kết thúc) nên toàn bộ bài toán thành quét các sự kiện theo thời gian và giữ max. Điểm mấu chốt là cuộc kết thúc lúc 10 và cuộc bắt đầu lúc 10 không giao nhau — nên sự kiện −1 phải xử lý trước +1 khi cùng giờ.',
    bruteForce: 'Brute force: với mỗi cuộc, đếm số cuộc giao với nó → O(n²) mà còn có thể đếm sai (giao từng đôi không đồng nghĩa giao đồng thời). Vấn đề là thiếu góc nhìn “đồng thời”. Tối ưu: sweep line cộng dồn — O(n log n).',
    checklist: ['Bài này cần “đỉnh đồng thời” hay chỉ “có/không giao”? (đỉnh đồng thời → sweep)', 'Cùng giờ thì kết thúc hay bắt đầu xử lý trước? (kết thúc trước — nối đuôi không tốn thêm phòng)', 'Ngoài sweep còn cách nào? (min-heap các end, pop hết hạn trước khi push)'],
    idea: ['Bước 1: tách mỗi cuộc thành sự kiện (start,+1) và (end,−1).', 'Bước 2: sort theo giờ, cùng giờ thì −1 trước +1.', 'Bước 3: quét cộng dồn cur, giữ best = max; return best.'],
    decisions: ['Tie-break end (−1) trước start (+1) khi cùng giờ → sort comparator a[1]−b[1] sau giờ; sai thứ tự này là overcount phòng.', 'Track max trong lúc quét thay vì đếm giao từng đôi → đỉnh đồng thời mới là đáp án, không phải tổng số cặp giao.'],
    complexityWhy: { time: 'O(n log n): sort 2n sự kiện; quét O(n).', space: 'O(n): mảng 2n sự kiện.' },
    takeaway: 'Hỏi “cần bao nhiêu tài nguyên đồng thời” → nghĩ sweep line +1/−1 và lấy đỉnh.',
    relatedSlugs: ['meeting-rooms-252', 'non-overlapping-435'],
    filename: 'meeting-rooms-ii.ts',
    code: `function minMeetingRooms(intervals: number[][]): number {
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
    highlightLines: [8],
    dryRun: {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      trace: ['0:+1 → 1 (best 1)', '5:+1 → 2 (best 2)', '10:−1 → 1', '15:+1 → 2', '20:−1 → 1', '30:−1 → 0'],
      output: '2',
    },
    pitfalls: ['Cùng giờ mà start trước end (vd họp A hết 10, B bắt đầu 10 vẫn 1 phòng — phải end trước)', 'Đếm số lần giao thay vì đỉnh đồng thời'],
  },
  'max-subarray-53': {
    slug: 'max-subarray-53',
    blindNo: 53,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Kadane: ở mỗi số, hoặc cộng tiếp hoặc bắt đầu lại — lấy max, giữ best.',
    insight: 'Subarray tối ưu kết thúc tại i chỉ có hai khả năng: nối vào đoạn tốt nhất kết thúc ở i−1, hoặc bỏ hết bắt đầu mới từ nums[i]. Không có khả năng thứ ba vì subarray kết thúc tại i bắt buộc chứa nums[i]. Quyết định này là cục bộ (chỉ cần cur của i−1) nên một pass là đủ — đó chính là Kadane, và reuse này đưa O(n²) về O(n).',
    bruteForce: 'Brute force: liệt kê mọi subarray (i,j) → O(n²) (hoặc O(n³) nếu cộng lại từ đầu). Vấn đề là đoạn chung bị cộng đi cộng lại. Tối ưu: cur[i] tái dùng cur[i−1] — O(n).',
    checklist: ['Subarray kết thúc tại i bắt buộc chứa gì? (nums[i] → chỉ 2 lựa chọn: nối tiếp hay bắt đầu mới)', 'Cần nhớ bao nhiêu quá khứ để quyết định tại i? (chỉ cur trước đó)', 'best khởi tạo bao nhiêu để mảng toàn âm vẫn đúng? (-Infinity/nums[0], không phải 0)'],
    idea: ['Bước 1: cur = best = nums[0].', 'Bước 2: với mỗi x: cur = max(x, cur + x) (bắt đầu mới hay nối tiếp).', 'Bước 3: best = max(best, cur); return best.'],
    decisions: ['Khởi tạo bằng nums[0] thay vì 0 → mảng toàn âm trả đúng số âm lớn nhất.', 'Giữ best riêng ngoài cur → cur là “tốt nhất kết thúc tại i”, best là “tốt nhất toàn mảng”, hai thứ khác nhau.'],
    complexityWhy: { time: 'O(n): một pass, O(1) mỗi phần tử.', space: 'O(1): hai biến cur/best.' },
    takeaway: 'Dãy con liên tiếp tối ưu → nghĩ Kadane: tại mỗi số chỉ hỏi “nối tiếp hay bắt đầu mới”.',
    relatedSlugs: ['max-product-152', 'jump-game-55'],
    filename: 'max-subarray.ts',
    code: `function maxSubArray(nums: number[]): number {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
      trace: ['cur: −2,1,1,4,3,5,6,1,5 → best lên dần tới 6 ([4,−1,2,1])'],
      output: '6',
    },
    pitfalls: ['Khởi tạo best = 0 (sai khi toàn âm)', 'Reset cur = 0 thay vì = x (mất đoạn âm đầu dãy con tối ưu)'],
  },
  'alien-dict-269': {
    slug: 'alien-dict-269',
    blindNo: 269,
    time: 'O(C)',
    space: 'O(1)',
    rule: 'Cặp từ kề nhau đầu tiên khác chữ → cạnh có hướng; topo-sort ra thứ tự (premium).',
    insight: 'Đề cho các từ đã sắp xếp theo thứ tự bảng chữ cái lạ và yêu cầu suy ra thứ tự đó. Thứ tự sắp xếp của hai từ kề nhau thực chất do đúng một cặp chữ quyết định: chữ đầu tiên khác nhau. Mỗi cặp như vậy là một ràng buộc trước-sau giữa hai chữ cái, tức một cạnh có hướng. Nhiều ràng buộc trước-sau cần xếp thành một thứ tự hợp lệ — đó chính là topological sort, và vô nghiệm khi các ràng buộc mâu thuẫn nhau thành chu trình.',
    bruteForce: 'Brute force: thử mọi hoán vị của tối đa 26 chữ cái — không khả thi. Vấn đề là số hoán vị bùng nổ, trong khi ràng buộc thực tế rất thưa. Tối ưu: chỉ dựng cạnh từ cặp từ kề nhau rồi chạy Kahn, O(C) với C là tổng độ dài các từ.',
    checklist: ['Ràng buộc trước-sau ở đây nằm ở đâu trong input (cặp chữ đầu tiên khác nhau của hai từ kề nhau)?', 'Mọi ký tự có được đưa vào đồ thị không, kể cả ký tự không tham gia cạnh nào?', 'Trường hợp nào thì chắc chắn vô nghiệm (tiền tố dài đứng trước từ ngắn, hoặc có chu trình)?'],
    idea: ['Bước 1: mọi ký tự xuất hiện đều là một node, khởi tạo bậc vào bằng 0.', 'Bước 2: với mỗi cặp từ kề nhau, tìm vị trí đầu tiên khác chữ và thêm cạnh u → v; nếu từ dài đứng trước tiền tố của nó thì return rỗng ngay.', 'Bước 3: chỉ thêm cạnh khi chưa có để khỏi tăng bậc vào oan.', 'Bước 4: chạy Kahn — lấy node bậc 0, trừ bậc các node kề, lặp tới khi hết queue.', 'Bước 5: số chữ lấy ra bằng số node thì nối thành đáp án, không thì return rỗng.'],
    decisions: ['Chỉ so cặp từ kề nhau thay vì mọi cặp — thứ tự đã sắp xếp nên cặp kề chứa đủ thông tin, cặp xa là suy ra được.', 'Check cạnh trùng trước khi tăng indeg — không thì một cạnh bị đếm hai lần và Kahn kẹt oan.', 'Return rỗng sớm ở case tiền tố — đây là ràng buộc mà đồ thị cạnh không biểu diễn được.'],
    complexityWhy: { time: 'O(C): mỗi ký tự của mỗi từ được xét hằng số lần khi dựng cạnh và chạy Kahn.', space: 'Đồ thị tối đa 26 node nên O(1) theo alphabet, cộng input.' },
    takeaway: 'Khi cần suy thứ tự từ các ràng buộc trước-sau: dựng cạnh có hướng rồi topological sort.',
    relatedSlugs: ['course-schedule-207', 'valid-tree-261'],
    filename: 'alien-dict.ts',
    code: `function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) {
    for (const c of w) {
      if (!adj.has(c)) adj.set(c, new Set());
      if (!indeg.has(c)) indeg.set(c, 0);
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';
    const m = Math.min(a.length, b.length);
    for (let k = 0; k < m; k++) {
      if (a[k] !== b[k]) {
        if (!adj.get(a[k])!.has(b[k])) {
          adj.get(a[k])!.add(b[k]);
          indeg.set(b[k], indeg.get(b[k])! + 1);
        }
        break;
      }
    }
  }
  const queue: string[] = [];
  indeg.forEach((d, c) => { if (d === 0) queue.push(c); });
  const res: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    res.push(u);
    for (const v of adj.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) queue.push(v);
    }
  }
  return res.length === indeg.size ? res.join('') : '';
}`,
    highlightLines: [18],
    dryRun: {
      input: 'words = ["wrt","wrf","er","ett","rftt"]',
      trace: ['wrt/wrf → t→f; wrf/er → w→e; er/ett → r→t; ett/rftt → e→r', 'Kahn: w(0) → e → r → t → f'],
      output: '"wertf"',
    },
    pitfalls: ['So mọi cặp từ (thừa — chỉ cần cặp kề)', 'Thêm cạnh trùng làm indeg tăng oan (phải check đã có cạnh chưa)'],
  },
  'valid-tree-261': {
    slug: 'valid-tree-261',
    blindNo: 261,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Cây ⟺ cạnh = n−1 VÀ liên thông (union-find: gặp cạnh nối 2 node cùng root là có vòng) (premium).',
    insight: 'Đồ thị vô hướng n node là cây khi và chỉ khi có đúng n−1 cạnh VÀ liên thông — hai điều kiện này kéo theo không có vòng (đủ cạnh + liên thông thì vòng nào cũng thừa cạnh). Union-Find kiểm tra cả hai trong một pass: cạnh nối hai node đã cùng root nghĩa là tạo vòng → false ngay; đi hết mà không vòng + đủ n−1 cạnh thì liên thông tự đúng.',
    bruteForce: 'DFS/BFS từ một node: thăm hết n node (liên thông) + đếm cạnh = n−1 (không vòng) — cũng O(V+E) nhưng code dài hơn. Union-Find gọn hơn: một vòng union kèm phát hiện vòng tại chỗ.',
    checklist: ['Cây cần mấy điều kiện — thiếu \'liên thông\" hay \'không vòng\" thì gãy ở đâu?', 'Cạnh nối hai node cùng tập (cùng root) nghĩa là gì?', 'Ca biên n = 1, edges = [] thì sao?'],
    idea: ['edges.length !== n−1 → false ngay.', 'Union từng cạnh với path compression: hai đầu đã cùng root → false (có vòng).', 'Hết cạnh mà không vòng → true.'],
    decisions: ['Check số cạnh TRƯỚC mọi thứ: vừa rẻ (O(1)) vừa loại ngay cả ca thiếu cạnh lẫn thừa cạnh.', 'Find có path compression để mỗi union/find gần như O(1) — không có nó thì chuỗi union xấu nhất thành O(n) mỗi lần.', 'Union bằng gán parent[rootA] = rootB sau khi find cả hai — find lại sau gán cũ dễ dính root stale.'],
    complexityWhy: { time: 'O(V + E·α(n)) ≈ O(V + E): mỗi cạnh một cặp find gần như hằng số.', space: 'O(V): mảng parent cho n node.' },
    takeaway: '\'Đồ thị có phải cây\" → check n−1 cạnh trước, rồi union-find bắt vòng.',
    relatedSlugs: ['connected-components-323', 'course-schedule-207'],
    filename: 'valid-tree.ts',
    code: `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    if (find(a) === find(b)) return false;
    parent[find(a)] = find(b);
  }
  return true;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]',
      trace: ['4 cạnh = 5−1 ✓', 'Union hết, không cặp nào cùng root → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check edges.length = n−1 mà không phát hiện vòng (đủ cạnh nhưng một cụm thành vòng, cụm khác rời vẫn qua ải nếu thiếu check union)', 'DFS quên visited → treo vòng'],
  },
  'connected-components-323': {
    slug: 'connected-components-323',
    blindNo: 323,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Union từng cạnh, đếm số root khác nhau (premium).',
    insight: 'Thành phần liên thông là nhóm node tới được nhau qua các cạnh — quan hệ tương đương: gom hai đầu mỗi cạnh vào cùng một nhóm, cuối cùng mỗi nhóm là một cụm. Union-Find sinh ra cho đúng việc này: union gộp nhóm, find cho biết nhóm hiện tại. Đếm số nhóm khác nhau cuối cùng chính là đáp án, node lẻ không có cạnh nào tự thành một cụm.',
    bruteForce: 'BFS/DFS từ mỗi node chưa thăm cũng đúng với cùng O(V + E). Vấn đề không phải complexity mà là code: union-find chỉ cần hai hàm ngắn và đếm root, không cần dựng adjacency list. Chọn union-find vì gọn và ít lỗi.',
    checklist: ['Node/edge đại diện cho gì, và quan hệ cần gom là gì?', 'Mình cần liệt kê cụm hay chỉ đếm số cụm (đếm thì union-find đủ)?', 'Node lẻ không có cạnh nào có được tính không?'],
    idea: ['Bước 1: mỗi node tự làm cha của chính nó.', 'Bước 2: với mỗi cạnh, union hai đầu (gắn root này dưới root kia).', 'Bước 3: find lại từng node để path compression chốt root cuối.', 'Bước 4: đếm số root phân biệt, đó là đáp án.'],
    decisions: ['Find có path compression — mỗi find gần như O(1), không thì cây cha cao dần và chậm.', 'Đếm bằng Set các find(i) cuối thay vì đếm trong lúc union — node lẻ tự có root riêng, khỏi xử lý riêng.', 'Không cần check vòng như bài valid tree — ở đây vòng lặp là bình thường, cứ union.'],
    complexityWhy: { time: 'O(V + E · α(V)): mỗi cạnh một union gần như hằng số.', space: 'O(V): mảng parent.' },
    takeaway: 'Khi chỉ cần đếm nhóm liên thông vô hướng: union hết cạnh, đếm root phân biệt.',
    relatedSlugs: ['valid-tree-261', 'number-of-islands-200'],
    filename: 'connected-components.ts',
    code: `function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  for (const [a, b] of edges) {
    parent[find(a)] = find(b);
  }
  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}`,
    highlightLines: [10],
    dryRun: {
      input: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      trace: ['Union: {0,1,2}, {3,4} → root 0→...→ 2 cụm'],
      output: '2',
    },
    pitfalls: ['DFS/BFS cũng được nhưng union-find ngắn hơn', 'Quên path compression vẫn đúng nhưng chậm'],
  },
  'unique-paths-62': {
    slug: 'unique-paths-62',
    blindNo: 62,
    time: 'O(m·n)',
    space: 'O(n)',
    rule: 'Ô = trên + trái; hàng đầu/cột đầu = 1; rolling 1 hàng là đủ.',
    insight: 'Robot chỉ đi xuống hoặc phải nên ô (i, j) chỉ tới được từ ô trên hoặc ô trái: số đường tới (i, j) = đường tới ô trên + đường tới ô trái. Hàng đầu và cột đầu mỗi ô chỉ có đúng một đường (đi thẳng). Quan hệ truy hồi chỉ cần hàng ngay trước nên nén bảng 2D thành một hàng rolling: dp[j] cũ (chưa cập nhật) là \'ô trên\', dp[j−1] mới là \'ô trái\'.',
    bruteForce: 'DFS thử mọi đường đi thì exponential — bùng nổ nhanh. Memo đệ quy O(mn) time nhưng tốn O(mn) space. Tối ưu: DP bottom-up lấp bảng theo thứ tự hàng-cột rồi nén còn một hàng.',
    checklist: ['State ô (i, j) phụ thuộc những ô nào — vì sao chỉ hai ô đó?', 'Base case hàng đầu/cột đầu bằng mấy?', 'Để tính hàng hiện tại cần giữ lại gì từ quá khứ — vì sao một hàng là đủ?'],
    idea: ['Khởi tạo dp toàn 1 (hàng đầu: mỗi ô một đường).', 'Với mỗi hàng tiếp theo, mỗi cột j ≥ 1: dp[j] += dp[j−1] (trên cũ + trái mới).', 'Hết m hàng thì dp[n−1] là đáp án.'],
    decisions: ['Khởi tạo toàn 1 thay vì vòng riêng cho hàng đầu — hàng đầu mỗi ô đúng một đường nên giá trị khởi tạo đã là đáp án hàng 0.', 'Duyệt hàng ngoài, cột trong (cột từ 1): dp[j−1] phải là giá trị MỚI của hàng hiện tại (ô trái) nên thứ tự duyệt quyết định tính đúng.', 'Giữ đáp án ở dp[n−1] cuối cùng — cột cuối của hàng cuối chính là đích.'],
    complexityWhy: { time: 'O(m·n): mỗi ô tính một lần bằng một phép cộng.', space: 'O(n): một hàng rolling thay cho cả bảng m×n.' },
    takeaway: 'Đếm đường trên lưới chỉ đi xuống/phải → dp[ô] = trên + trái, nén còn một hàng rolling.',
    relatedSlugs: ['climbing-stairs-70', 'coin-change-322'],
    filename: 'unique-paths.ts',
    code: `function uniquePaths(m: number, n: number): number {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    highlightLines: [4],
    dryRun: {
      input: 'm = 3, n = 7',
      trace: ['Hàng 0: [1,1,1,1,1,1,1]', 'Hàng 1: [1,2,3,4,5,6,7]', 'Hàng 2: [1,3,6,10,15,21,28]'],
      output: '28',
    },
    pitfalls: ['Duyệt cột trước hàng (dp[j−1] chưa phải trái hiện tại)', 'Tràn số ở m,n lớn mà không dùng BigInt (hiếm khi bị hỏi)'],
  },
  'lcs-1143': {
    slug: 'lcs-1143',
    blindNo: 1143,
    time: 'O(m·n)',
    space: 'O(min(m,n))',
    rule: 'Khớp thì +1 đường chéo, lệch thì max(trên, trái).',
    insight: 'Hai chuỗi so theo từng tiền tố: đáp án của cặp tiền tố dài hơn luôn xây từ đáp án của cặp tiền tố ngắn hơn. Nếu ký tự cuối khớp nhau, chúng đi chung một cặp trong LCS nên đáp án = đường chéo + 1; nếu lệch, cặp cuối không thể cùng thuộc LCS nên đáp án = max của hai cách bỏ một ký tự. Vì bài toán con gối nhau (cùng cặp i,j được hỏi nhiều lần), bảng DP cho phép reuse thay vì đệ quy mũ.',
    bruteForce: 'Brute force: thử mọi subsequence của chuỗi ngắn (2^m khả năng) → O(2^m). Vấn đề là cùng cặp tiền tố (i,j) được tính đi tính lại. Tối ưu: bảng dp[i][j] mỗi ô tính một lần — O(m·n).',
    checklist: ['State cho cặp tiền tố (i,j) nên là gì?', 'Ký tự cuối khớp vs lệch thì đáp án kế thừa từ ô nào?', 'Ô hiện tại chỉ cần hàng nào của bảng? (hàng trước → rolling)'],
    idea: ['Bước 1: dp[i][j] = LCS của a[:i] và b[:j]; hàng/cột 0 bằng 0 (base case).', 'Bước 2: nếu a[i-1] == b[j-1] thì dp = đường chéo + 1, ngược lại dp = max(ô trên, ô trái).', 'Bước 3: chỉ cần 2 hàng rolling (prev/cur), swap sau mỗi hàng; đáp án là ô cuối.'],
    decisions: ['Rolling 2 hàng thay vì bảng full → vì ô (i,j) chỉ đọc hàng i-1 và hàng hiện tại; space còn O(min(m,n)).', 'Đặt hàng 0/cột 0 = 0 làm base case → tiền tố rỗng không có LCS, khỏi if riêng trong vòng lặp.'],
    complexityWhy: { time: 'O(m·n): mỗi cặp (i,j) tính đúng một lần, O(1) mỗi ô.', space: 'O(min(m,n)): 2 hàng rolling theo chiều chuỗi ngắn hơn.' },
    takeaway: 'So khớp hai dãy theo tiền tố, đáp án xây từ cặp ngắn hơn → nghĩ DP 2D với transition khớp +1 / lệch max.',
    relatedSlugs: ['lis-300', 'word-break-139'],
    filename: 'lcs.ts',
    code: `function longestCommonSubsequence(a: string, b: string): number {
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
    highlightLines: [7],
    dryRun: {
      input: 'text1 = "abcde", text2 = "ace"',
      trace: ['a=a → 1; b× → max; c=c → 2; d×; e=e → 3'],
      output: '3 ("ace")',
    },
    pitfalls: ['Nhầm với Longest Common Substring (liên tục — khác bài, khác công thức)', 'Swap 2 hàng mà quên reset hàng cur cũ'],
  },
  'sum-two-integers-371': {
    slug: 'sum-two-integers-371',
    blindNo: 371,
    time: 'O(1)',
    space: 'O(1)',
    rule: 'XOR = cộng không nhớ, AND<<1 = phần nhớ; lặp tới khi nhớ = 0.',
    insight: 'Phép cộng nhị phân tách được thành hai phần độc lập: XOR cho tổng không nhớ (1+1 cho 0 \'nhớ 1\'), AND dịch trái một bit cho đúng cái phần nhớ đó. Cộng hai phần này lại — còn nhớ thì lặp tiếp; mỗi vòng đẩy nhớ sang trái một nấc nên sau tối đa khoảng 32 vòng là nhớ \'tràn\" hết. Cấm +/− mà vẫn cộng được chính là nhờ mô phỏng lại mạch cộng full-adder bằng hai phép bit.',
    bruteForce: 'Vòng lặp cộng/trừ 1 từng đơn vị thì O(n) với số lớn và xử lý số âm rối rắm — không dùng được. Không có brute force \'đúng\" nào khác vì đề cấm toán tử; con đường duy nhất là tách tổng và nhớ bằng bit op.',
    checklist: ['Tổng không nhớ của hai bit tính bằng phép gì (XOR)?', 'Phần nhớ nằm ở đâu và đẩy đi đâu (AND rồi << 1)?', 'Khi nào thì lặp xong (carry = 0)?'],
    idea: ['Lặp chừng nào b (phần nhớ) còn khác 0.', 'Mỗi vòng: carry = (a & b) << 1; a = a ^ b; b = carry.', 'Hết lặp thì a là tổng.'],
    decisions: ['Tính carry TRƯỚC khi ghi đè a: a mới là XOR, carry phải dùng a cũ — đổi thứ tự là mất phần nhớ.', 'Gán a = sum, b = carry rồi lặp — mỗi vòng số bit nhớ dịch trái thêm một nấc nên chắc chắn hội tụ.', 'Dựa vào số học 32-bit của JS (toán tử bit ép về 32-bit, bù 2 cho số âm) nên số âm vẫn đúng sau tối đa 32 vòng.'],
    complexityWhy: { time: 'O(1): mỗi vòng đẩy nhớ sang trái một bit, tối đa ~32 vòng cho số 32-bit.', space: 'O(1): chỉ biến carry.' },
    takeaway: 'Cộng mà cấm +/− → XOR là tổng không nhớ, AND<<1 là phần nhớ, lặp tới khi nhớ hết.',
    relatedSlugs: ['number-of-1-bits-191', 'missing-number-268'],
    filename: 'sum-two-integers.ts',
    code: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
    highlightLines: [2],
    dryRun: {
      input: 'a = 1, b = 2 (01 + 10)',
      trace: ['XOR = 11 (3), carry = (01&10)<<1 = 0 → b = 0 → dừng'],
      output: '3',
    },
    pitfalls: ['Tính carry SAU khi đã ghi đè a (phải tính carry từ a, b cũ trước) — sai thứ tự vòng lặp không hội tụ', 'Quên đây là mô phỏng mạch cộng full-adder'],
  },
  'number-of-1-bits-191': {
    slug: 'number-of-1-bits-191',
    blindNo: 191,
    time: 'O(k)',
    space: 'O(1)',
    rule: 'n & (n−1) gạt bit 1 thấp nhất — đếm tới khi n = 0 (k = số bit 1).',
    insight: 'n & (n−1) luôn gạt đúng bit 1 thấp nhất (trừ 1 mượn đúng tới bit 1 đầu tiên, AND lại xóa nó). Nên số lần gạt tới khi n = 0 chính bằng số bit 1 — vòng lặp chạy đúng k lần (k = số bit 1) thay vì đủ 32 lần như cách duyệt từng bit. Đây là trick bit kinh điển cho “đếm/kiểm tra bit 1”.',
    bruteForce: 'Brute force: duyệt đủ 32 bit, check từng bit → O(32) = O(1) nhưng luôn 32 vòng. Vấn đề là làm việc thừa khi ít bit 1. Tối ưu: n & (n−1) chỉ lặp đúng k lần.',
    checklist: ['Phép nào xóa đúng một bit 1 mỗi lần? (n & (n−1) gạt bit 1 thấp nhất)', 'Vòng lặp chạy bao nhiêu lần? (đúng k = số bit 1)', 'JS có bẫy gì với số âm/dịch bit? (dùng >>> để đảm bảo unsigned 32-bit)'],
    idea: ['Bước 1: count = 0.', 'Bước 2: trong khi n != 0: n &= n − 1; count++.', 'Bước 3: return count.'],
    decisions: ['Dùng trick n & (n−1) thay vì check n & 1 + dịch → số vòng lặp tỉ lệ với số bit 1, nhanh khi số thưa bit 1.', 'Điều kiện dừng n != 0 (không phải đủ 32 vòng) → chính là nguồn gốc của O(k).'],
    complexityWhy: { time: 'O(k): mỗi vòng xóa đúng một bit 1 (k = số bit 1).', space: 'O(1).' },
    takeaway: 'Đếm bit 1 → nghĩ n & (n−1) gạt bit thấp nhất, lặp tới khi bằng 0.',
    relatedSlugs: ['missing-number-268', 'counting-bits-338'],
    filename: 'number-of-1-bits.ts',
    code: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
    highlightLines: [3],
    dryRun: {
      input: 'n = 11 (1011)',
      trace: ['1011 & 1010 = 1010 (mất bit cuối), count=1', '1010 & 1001 = 1000, count=2', '1000 & 0111 = 0, count=3 → dừng'],
      output: '3',
    },
    pitfalls: ['Dịch >> số âm lan bit dấu (dùng >>> hoặc & trick)', 'Đếm cả bit 0 (duyệt 32 lần vẫn đúng nhưng chậm hơn)'],
  },
  'counting-bits-338': {
    slug: 'counting-bits-338',
    blindNo: 338,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'dp[i] = dp[i>>1] + (i&1): bỏ bit cuối rồi cộng lại.',
    insight: 'Số i và số i >> 1 (bỏ bit cuối) chỉ khác nhau đúng một bit: bit cuối của i. Vậy số bit 1 của i bằng số bit 1 của i >> 1 cộng thêm 0 hoặc 1 tùy bit cuối. Mà i >> 1 < i nên đã tính rồi — mỗi dp[i] suy ra từ quá khứ trong O(1). Đây là DP tái dùng thuần túy: đáp án lớn xây từ đáp án nhỏ hơn đã biết.',
    bruteForce: 'Đếm bit từng số độc lập bằng vòng lặp — O(n log n). Vấn đề là các số chia sẻ prefix bit mà ta tính đi tính lại. Tối ưu: mỗi số kế thừa kết quả của nửa nó, một pass O(n).',
    checklist: ['State là gì (số bit 1 của i)?', 'Bỏ đi một phần nhỏ của i thì còn lại state nào đã tính (i >> 1)?', 'Phần bỏ đi đóng góp bao nhiêu (bit cuối i & 1)?'],
    idea: ['Bước 1: dp[0] = 0, mảng size n + 1.', 'Bước 2: với i từ 1 tới n, dp[i] = dp[i >> 1] + (i & 1).', 'Bước 3: trả về cả mảng.'],
    decisions: ['Dùng i >> 1 thay vì i / 2 — dịch bit là floor division cho số nguyên, vừa đúng vừa nhanh.', 'Lặp xuôi từ 1 lên n — dp[i >> 1] luôn xong trước vì nửa số nhỏ hơn số gốc.', 'Trả mảng thay vì đếm lẻ — đề yêu cầu mọi i từ 0 tới n trong một pass.'],
    complexityWhy: { time: 'O(n): mỗi i một phép cộng và hai phép bit O(1).', space: 'O(n): mảng đáp án (đề bắt trả về nên không tính là phụ).' },
    takeaway: 'Khi đáp án của i suy ra từ một nửa đã tính của nó: dp[i] = dp[i >> 1] + bit cuối.',
    relatedSlugs: ['number-of-1-bits-191', 'climbing-stairs-70'],
    filename: 'counting-bits.ts',
    code: `function countBits(n: number): number[] {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 5',
      trace: ['dp[1] = dp[0]+1 = 1', 'dp[2] = dp[1]+0 = 1', 'dp[3] = dp[1]+1 = 2', 'dp[4] = dp[2]+0 = 1', 'dp[5] = dp[2]+1 = 2'],
      output: '[0,1,1,2,1,2]',
    },
    pitfalls: ['Đếm lại từng số bằng vòng lặp bit (O(n log n)) thay vì tái dùng', 'Nhầm i>>1 với i/2 làm tròn sai ở số lẻ? (>>1 là floor, đúng)'],
  },
  'missing-number-268': {
    slug: 'missing-number-268',
    blindNo: 268,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'XOR hết index lẫn value: cặp nào đủ đôi tự triệt, dư lại số thiếu.',
    insight: 'Mảng chứa n số phân biệt trong [0,n] tức là đầy đủ 0..n trừ đúng một số. XOR có tính triệt tiêu (a ^ a = 0) nên XOR hết cả “tập đủ” (0..n) với “tập thiếu” (nums) thì mọi số xuất hiện 2 lần tự triệt, còn lại đúng số thiếu. Không cần sort, không cần cộng trừ lo tràn số.',
    bruteForce: 'Brute force: sort O(n log n) rồi tìm chỗ gãy; hoặc tổng Gauss n(n+1)/2 − sum → O(n) nhưng có thể tràn số ở ngôn ngữ khác. XOR cũng O(n) mà an toàn tràn và O(1) space.',
    checklist: ['Tập đầy đủ 0..n so với nums khác nhau ở điểm nào? (đúng một số — XOR triệt tiêu phần chung)', 'XOR với index i và nums[i] cùng lúc thì số nào xuất hiện 2 lần? (mọi số trừ số thiếu + n)', 'Có cần sort không? (không — XOR không quan tâm thứ tự)'],
    idea: ['Bước 1: xor = n (phần tử “đủ” không gắn với index nào).', 'Bước 2: với mỗi i: xor ^= i ^ nums[i].', 'Bước 3: return xor — số duy nhất xuất hiện lẻ lần.'],
    decisions: ['Khởi tạo xor = n thay vì 0 → n không xuất hiện dưới dạng index nên phải xor riêng một lần.', 'Chọn XOR thay vì tổng Gauss → tránh tràn số, vẫn O(n)/O(1).'],
    complexityWhy: { time: 'O(n): một pass.', space: 'O(1): một biến xor.' },
    takeaway: 'Tìm phần tử lẻ/thiếu trong tập đủ mà triệt tiêu được → nghĩ XOR.',
    relatedSlugs: ['number-of-1-bits-191', 'contains-duplicate-217'],
    filename: 'missing-number.ts',
    code: `function missingNumber(nums: number[]): number {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [3,0,1]',
      trace: ['xor = 3', 'i=0: 3^0^3 = 0', 'i=1: 0^1^0 = 1', 'i=2: 1^2^1 = 2'],
      output: '2',
    },
    pitfalls: ['Quên xor với n (thiếu 1 vế)', 'Sort rồi tìm chỗ gãy O(n log n) — vẫn đúng nhưng không O(1) space'],
  },
  'reverse-bits-190': {
    slug: 'reverse-bits-190',
    blindNo: 190,
    time: 'O(1)',
    space: 'O(1)',
    rule: '32 vòng: lấy bit cuối (n&1) đẩy vào kết quả (<<1), dịch n sang phải.',
    insight: 'Đảo bit không có gì để \'tìm kiếm\" — bit ở vị trí i từ phải phải sang vị trí i từ trái, tức là mô phỏng trực tiếp vị trí đối xứng. Mỗi vòng bóc bit cuối của n (n & 1) rồi đắp vào bên phải kết quả sau khi đã dịch kết quả sang trái (res << 1): đọc từ phải, xây từ trái. Đúng 32 vòng là hết số 32-bit, kể cả các số 0 đầu.',
    bruteForce: 'Bài này vốn đã O(32) nên không có brute force riêng đáng nói. Cách \'chuỗi\': chuyển sang chuỗi nhị phân 32 ký tự rồi đảo — đúng nhưng tốn O(32) space và chậm hơn bit op. Dùng bit op trực tiếp là gọn nhất.',
    checklist: ['Bit bóc ra từ n đi vào vị trí nào của kết quả (đọc phải, đắp trái)?', 'Dịch phải n bằng toán tử có dấu hay không dấu — khác nhau khi nào?', 'Kết quả cuối trong JS là signed hay unsigned, ép kiểu ra sao?'],
    idea: ['Lặp đúng 32 vòng.', 'Mỗi vòng: res = (res << 1) | (n & 1) — dồn kết quả sang trái rồi đắp bit cuối của n vào.', 'Dịch n sang phải một bit (unsigned), tiếp tục.'],
    decisions: ['Dùng n >>>= 1 thay vì >>= 1: dịch có dấu lan bit 1 khi n ở dạng signed âm, làm sai 32 vòng.', 'Return res >>> 0 để ép kết quả sang unsigned — JS mặc định << cho ra số signed có thể âm.', 'Lặp đúng 32 vòng kể cả khi n đã về 0 sớm, vì các số 0 đầu cũng phải \'đảo\" thành số 0 cuối.'],
    complexityWhy: { time: 'O(1): đúng 32 vòng lặp, hằng số không phụ thuộc input.', space: 'O(1): chỉ hai biến số.' },
    takeaway: 'Đảo hoặc đọc từng bit → mẫu (res << 1) | (n & 1) kèm dịch phải unsigned, nhớ ép unsigned ở cuối trong JS.',
    relatedSlugs: ['number-of-1-bits-191', 'counting-bits-338'],
    filename: 'reverse-bits.ts',
    code: `function reverseBits(n: number): number {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'n = 43261596',
      trace: ['32 vòng bóc từng bit cuối đắp sang trái res', 'res = 964176192'],
      output: '964176192',
    },
    pitfalls: ['Dùng >> thay vì >>> (số âm lan bit 1)', 'Quên >>> 0 cuối → JS trả số âm'],
  },
  'rotate-image-48': {
    slug: 'rotate-image-48',
    blindNo: 48,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Xoay 90° = chuyển vị (i↔j) rồi lật ngang từng hàng.',
    insight: 'Công thức xoay trực tiếp (i, j) → (j, n−1−i) khó thực hiện tại chỗ vì mỗi ô cần \'đỗ tạm\" ở đâu đó. Tách phép xoay thành hai phép đối xứng dễ code tại chỗ: transpose (đổi i↔j) rồi lật ngang mỗi hàng. Hai phép đều là hoán đổi trong ma trận nên tổng vẫn O(1) space — đây là cách biến công thức khó thành hai bước dễ.',
    bruteForce: 'Tạo ma trận mới với answer[j][n−1−i] = m[i][j] → O(n²) time đúng nhưng O(n²) space, vi phạm \'in-place\'. Tối ưu: transpose + reflect, mỗi phép chỉ swap trong ma trận gốc.',
    checklist: ['Phép xoay 90° tách được thành hai phép đối xứng nào?', 'Transpose swap cặp nào để không swap hai lần về như cũ?', 'Lật ngang hay lật dọc cho chiều clockwise — đổi thứ tự thì ra chiều nào?'],
    idea: ['Transpose: swap m[i][j] ↔ m[j][i] với j > i.', 'Lật ngang từng hàng (reverse mỗi row).', 'Xong — ma trận đã xoay 90° clockwise tại chỗ.'],
    decisions: ['Chỉ swap với j > i: swap cả ma trận nghĩa là mỗi cặp bị swap hai lần = về như cũ, lại còn tự swap đường chéo vô ích.', 'Transpose trước, reverse hàng sau — thứ tự này cho clockwise; làm ngược (reverse rồi transpose) ra counter-clockwise.', 'Dùng row.reverse() tại chỗ thay vì tạo hàng mới để giữ đúng O(1) space.'],
    complexityWhy: { time: 'O(n²): thăm mỗi cặp ô hai lần (transpose + reverse), hằng số lần trên n² ô.', space: 'O(1): chỉ swap trong ma trận gốc.' },
    takeaway: 'Xoay ma trận vuông tại chỗ → transpose (chỉ nửa trên chéo) + reverse từng hàng; nhớ chiều nào lật nấy.',
    relatedSlugs: ['spiral-matrix-54', 'set-zeroes-73'],
    filename: 'rotate-image.ts',
    code: `function rotate(matrix: number[][]): void {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (const row of matrix) row.reverse();
}`,
    highlightLines: [4],
    dryRun: {
      input: '[[1,2,3],[4,5,6],[7,8,9]]',
      trace: ['Transpose: [[1,4,7],[2,5,8],[3,6,9]]', 'Lật ngang: [[7,4,1],[8,5,2],[9,6,3]]'],
      output: '[[7,4,1],[8,5,2],[9,6,3]]',
    },
    pitfalls: ['Transpose cả ma trận (swap 2 lần = về cũ) — chỉ swap j > i', 'Tạo ma trận mới (mất O(n²) space, đề bắt in-place)'],
  },
  'spiral-matrix-54': {
    slug: 'spiral-matrix-54',
    blindNo: 54,
    time: 'O(m·n)',
    space: 'O(1)',
    rule: '4 biên top/bottom/left/right: đi hết 1 vòng thì co biên, check biên sau mỗi cạnh.',
    insight: 'Xoắn ốc thực chất là \'đi thẳng tới biên rồi rẽ\': bốn biên top/bottom/left/right định nghĩa đường chạy của vòng hiện tại, đi hết một cạnh thì co biên đó lại một nấc. Ma trận dẹt (một hàng hoặc một cột) sẽ đi trùng góc nếu cứ đi đủ bốn cạnh — nên phải kiểm tra biên còn hợp lệ trước cạnh thứ ba và thứ tư. Bốn biên + co dần chính là invariant của cả bài.',
    bruteForce: 'Ma trận visited O(mn) space để không đi lại ô cũ → đúng nhưng thừa bộ nhớ. Tối ưu: bốn biên co dần mô tả chính xác vùng chưa thăm với O(1) phụ.',
    checklist: ['Cái gì định nghĩa \'vòng hiện tại\" — và đi hết một cạnh thì nó thay đổi ra sao?', 'Đi cạnh nào thì co biên nào, co ngay hay đợi hết vòng?', 'Vì sao phải check biên giữa chừng — ma trận nào thì đi trùng góc?'],
    idea: ['Đặt bốn biên top/bottom/left/right quanh toàn ma trận.', 'Đi trên (trái→phải) rồi top++, đi phải (trên→dưới) rồi right−−.', 'Nếu còn hàng: đi dưới (phải→trái) rồi bottom−−; nếu còn cột: đi trái (dưới→trên) rồi left++.', 'Lặp tới khi biên giao nhau.'],
    decisions: ['Co biên NGAY sau cạnh vừa đi (không đợi hết vòng) — biên lúc nào cũng phản ánh đúng vùng chưa thăm cho cạnh kế tiếp.', 'Hai if top ≤ bottom và left ≤ right giữa chừng là bắt buộc: ma trận một hàng/cột sẽ push trùng góc nếu thiếu.', 'Điều kiện while dùng && cả hai cặp biên — một cặp giao nhau là hết ô.'],
    complexityWhy: { time: 'O(m·n): mỗi ô được push đúng một lần.', space: 'O(1) phụ: bốn biến biên (mảng output không tính).' },
    takeaway: 'Duyệt xoắn ốc → bốn biên + co ngay sau mỗi cạnh + check biên giữa chừng cho ma trận dẹt.',
    relatedSlugs: ['rotate-image-48', 'set-zeroes-73'],
    filename: 'spiral-matrix.ts',
    code: `function spiralOrder(matrix: number[][]): number[] {
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
    highlightLines: [6],
    dryRun: {
      input: '[[1,2,3],[4,5,6],[7,8,9]]',
      trace: ['Trên: 1,2,3 → top=1', 'Phải: 6,9 → right=1', 'Dưới: 8,7 → bottom=1', 'Trái: 4 → left=1', 'Giữa: 5'],
      output: '[1,2,3,6,9,8,7,4,5]',
    },
    pitfalls: ['Quên check biên giữa chừng (ma trận 1 hàng/dup góc)', 'Co biên sai thứ tự (đi cạnh nào co biên đó ngay)'],
  },
  'set-zeroes-73': {
    slug: 'set-zeroes-73',
    blindNo: 73,
    time: 'O(m·n)',
    space: 'O(1)',
    rule: 'Dùng hàng 0 + cột 0 làm cờ (2 biến riêng cho cờ của chính chúng).',
    insight: 'Zero cả hàng và cột nghĩa là thông tin \'hàng i / cột j có số 0\" có thể nén vào chính ma trận: mượn hàng 0 và cột 0 làm cờ đánh dấu. Chỉ có hàng 0 và cột 0 bị xung đột vai trò (vừa là cờ vừa là dữ liệu gốc) nên cần hai biến riêng giữ trạng thái ban đầu của chúng — toàn bộ \'O(1) space\" của bài này nằm ở việc xử lý đúng hai dòng biên đó.',
    bruteForce: 'Mảng phụ O(m+n) (hoặc nguyên ma trận copy O(mn)) đánh dấu hàng/cột cần zero → đúng nhưng thừa bộ nhớ, rớt bonus O(1). Tối ưu: mượn chính hàng 0/cột 0 làm cờ, chỉ tốn hai biến cho biên.',
    checklist: ['Cờ \'hàng/cột này có số 0\" đặt ở đâu để khỏi tốn bộ nhớ phụ?', 'Ô nào bị xung đột giữa vai trò cờ và dữ liệu gốc?', 'Thứ tự nào tránh ghi đè cờ trước khi dùng xong (đánh dấu → zero lòng → xử lý biên)?'],
    idea: ['Quét hàng 0 và cột 0, ghi nhớ chúng có số 0 không vào hai cờ riêng.', 'Ô (i, j) = 0 (với i, j ≥ 1) thì đánh dấu matrix[i][0] = matrix[0][j] = 0.', 'Zero lòng ma trận (bỏ hàng 0, cột 0) theo cờ.', 'Cuối cùng zero hàng 0 / cột 0 theo hai cờ riêng.'],
    decisions: ['Hai cờ firstRowZero/firstColZero là bắt buộc: dùng hàng 0/cột 0 làm cờ mà không giữ lại trạng thái gốc của chúng là mất thông tin.', 'Vòng đánh dấu và vòng zero lòng đều bắt đầu từ index 1 — chạm vào biên sớm là phá cờ khi chưa dùng xong.', 'Xử lý biên sau cùng để cờ còn nguyên trong suốt quá trình zero lòng.'],
    complexityWhy: { time: 'O(m·n): vài pass quét toàn ma trận, mỗi ô O(1).', space: 'O(1): chỉ hai biến cờ, ma trận tự làm bộ nhớ đánh dấu.' },
    takeaway: 'Cần đánh dấu cả hàng/cột mà chỉ có O(1) space → mượn hàng 0 + cột 0 làm cờ, giữ biến riêng cho chính chúng.',
    relatedSlugs: ['spiral-matrix-54', 'rotate-image-48'],
    filename: 'set-zeroes.ts',
    code: `function setZeroes(matrix: number[][]): void {
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
    highlightLines: [9],
    dryRun: {
      input: '[[1,1,1],[1,0,1],[1,1,1]]',
      trace: ['Hàng 0, cột 0 không có 0 (cờ false)', 'Ô (1,1)=0 → đánh dấu row0[1], col0[1]', 'Zero theo cờ: hàng 1 + cột 1', '2 cờ false → xong'],
      output: '[[1,0,1],[0,0,0],[1,0,1]]',
    },
    pitfalls: ['Dùng hàng 0/cột 0 làm cờ mà không giữ 2 cờ riêng (mất thông tin gốc)', 'Set O(m+n) vẫn đúng nhưng đề bonus O(1)'],
  },
  'max-product-152': {
    slug: 'max-product-152',
    blindNo: 152,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Track đồng thời max và min (âm × âm thành dương, đảo vai trò).',
    insight: 'Tích khác tổng ở chỗ số âm lật dấu: min hiện tại nhân với số âm có thể thành max mới. Nên chỉ track max là thiếu state — phải giữ đồng thời max và min của subarray kết thúc tại i, cả hai đều có thể là “nguyên liệu” cho đáp án. Mỗi vị trí chỉ có 3 ứng viên: bắt đầu mới từ x, nối max cũ, nối min cũ.',
    bruteForce: 'Brute force: liệt kê mọi subarray O(n²) rồi nhân → O(n²). Vấn đề là nhân lại từ đầu mỗi subarray. Tối ưu: tái dùng max/min của vị trí trước — O(n), O(1).',
    checklist: ['Vì sao chỉ track max là sai? (âm × âm thành dương — min cũ có thể thành max mới)', 'Subarray kết thúc tại i có mấy khả năng? (bắt đầu mới / nối max cũ / nối min cũ)', 'Cập nhật max trước có ảnh hưởng min không? (có — phải tính từ giá trị cũ)'],
    idea: ['Bước 1: curMax = curMin = best = nums[0].', 'Bước 2: với mỗi x, tính 3 ứng viên x, curMax*x, curMin*x (từ giá trị cũ).', 'Bước 3: curMax = max, curMin = min, best = max(best, curMax).'],
    decisions: ['Giữ cả min song song với max → state đủ để xử lý lật dấu của số âm.', 'Tính candidates từ curMax/curMin cũ (code dùng mảng candidates trước khi gán) → cập nhật max trước rồi mới tính min từ max mới sẽ sai.'],
    complexityWhy: { time: 'O(n): một pass, O(1) mỗi phần tử.', space: 'O(1): ba biến số.' },
    takeaway: 'Tích/đại lượng bị lật dấu bởi số âm → nghĩ track song song max và min.',
    relatedSlugs: ['max-subarray-53', 'house-robber-198'],
    filename: 'max-product.ts',
    code: `function maxProduct(nums: number[]): number {
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
    highlightLines: [7],
    dryRun: {
      input: 'nums = [2,3,-2,4]',
      trace: ['x=3: max=6, min=3, best=6', 'x=−2: max=−2, min=−12 (3×−2 đảo vai!), best=6', 'x=4: max=4, min=−48, best=6'],
      output: '6',
    },
    pitfalls: ['Chỉ track max (số âm lật dấu làm sai — vd [−2,3,−4] đáp án 24)', 'Cập nhật curMin sau khi curMax đã đổi (phải dùng giá trị cũ cả 2)'],
  },
  'clone-graph-133': {
    slug: 'clone-graph-133',
    blindNo: 133,
    time: 'O(V + E)',
    space: 'O(V)',
    rule: 'Map old→new + DFS: tạo bản sao trước khi đi sâu để vòng lặp không treo.',
    insight: 'Clone đồ thị nghĩa là tạo node mới cho mọi node cũ và nối lại đúng quan hệ kề. Khó ở chỗ đồ thị có vòng: clone hàng xóm của A cần B, mà clone B lại cần A — đệ quy ngây thơ treo vô hạn. Lối ra là ghi nhận ánh xạ old → new ngay khi tạo node, trước khi đi sâu. Lần sau gặp lại node cũ thì dùng ngay bản sao đã có, vòng lặp tự khép lại.',
    bruteForce: 'Không có brute force rẻ hơn ở đây — mọi node và mọi cạnh đều phải thăm ít nhất một lần, lower bound đã là O(V + E). Vấn đề duy nhất là xử lý vòng lặp và tránh clone trùng. Map old → new giải quyết cả hai.',
    checklist: ['Node/edge trong bài đại diện cho gì, và visited (ở đây là map) dùng để làm gì?', 'Đệ quy của mình dừng ở đâu khi gặp vòng?', 'Thứ tự tạo node và ghi map có quan trọng không (tạo trước hay sau khi duyệt hàng xóm)?'],
    idea: ['Bước 1: node vào là null thì trả null.', 'Bước 2: DFS — gặp node đã có trong map thì trả ngay bản sao cũ.', 'Bước 3: chưa có thì tạo node mới rỗng và ghi vào map trước.', 'Bước 4: duyệt từng neighbor, clone đệ quy rồi nối vào bản sao.', 'Bước 5: trả về bản sao của node vào.'],
    decisions: ['Ghi map trước khi duyệt neighbor — thứ tự này là thứ phá vòng lặp, đảo lại là treo.', 'Trả bản sao cũ khi gặp lại thay vì tạo mới — vừa chống treo vừa đảm bảo các cạnh chung trỏ cùng một node.', 'Dùng Map với key là reference node — so sánh identity, không phụ thuộc val trùng nhau.'],
    complexityWhy: { time: 'O(V + E): mỗi node tạo một lần, mỗi cạnh duyệt hai chiều một lần.', space: 'O(V): map clone cộng stack đệ quy sâu nhất V.' },
    takeaway: 'Khi clone cấu trúc có vòng: map old → new, ghi trước khi đi sâu, gặp lại thì dùng cũ.',
    relatedSlugs: ['number-of-islands-200', 'course-schedule-207'],
    filename: 'clone-graph.ts',
    code: `function cloneGraph(node: GraphNode | null): GraphNode | null {
  const seen = new Map<GraphNode, GraphNode>();
  const dfs = (n: GraphNode): GraphNode => {
    if (seen.has(n)) return seen.get(n)!;
    const copy = new GraphNode(n.val);
    seen.set(n, copy);
    for (const nb of n.neighbors) {
      copy.neighbors.push(dfs(nb));
    }
    return copy;
  };
  return node === null ? null : dfs(node);
}`,
    highlightLines: [5],
    dryRun: {
      input: 'adjList = [[2,4],[1,3],[2,4],[1,3]] (1-indexed)',
      trace: ['Clone 1 → neighbor 2: clone 2 → neighbor 1 (đã có!) → dùng lại', '2 → neighbor 3: clone 3 → neighbor 4: clone 4 → neighbor 1,3 (đã có)', 'Mọi cạnh nối đúng bản sao'],
      output: 'đồ thị clone cùng cấu trúc',
    },
    pitfalls: ['Clone neighbor trước khi cho vào map → vòng lặp vô hạn', 'Copy reference thay vì deep copy (sửa clone ảnh hưởng gốc)'],
  },
  'course-schedule-207': {
    slug: 'course-schedule-207',
    blindNo: 207,
    time: 'O(V + E)',
    space: 'O(V + E)',
    rule: 'Môn học = topo-sort: vào 0 hết được thì không chu trình (Kahn).',
    insight: 'Cặp [a, b] nghĩa là phải học b trước a — một ràng buộc thứ tự, tức cạnh có hướng b → a. Học hết được khi và chỉ khi các ràng buộc này không mâu thuẫn vòng tròn. Môn nào không còn ai chặn (bậc vào bằng 0) thì học được, học xong nó lại gỡ chặn cho môn sau. Quá trình này chính là Kahn: hết queue mà chưa học đủ thì còn chu trình.',
    bruteForce: 'Thử mọi thứ tự học — O(n!). Vấn đề là bùng nổ tổ hợp trong khi ràng buộc rất thưa. Tối ưu: chỉ lan theo cạnh kề, mỗi cạnh xử lý một lần.',
    checklist: ['Node/edge đại diện cho gì, và chiều cạnh là gì ([a,b] là b → a)?', 'Bậc vào của một node có nghĩa là gì (số môn còn chặn nó)?', 'Điều kiện dừng và kết luận là gì (học đủ n môn thì không chu trình)?'],
    idea: ['Bước 1: dựng adjacency và bậc vào từ prerequisites.', 'Bước 2: cho mọi môn bậc 0 vào queue.', 'Bước 3: pop một môn, đếm đã học, trừ bậc các môn kề, về 0 thì push.', 'Bước 4: hết queue — số môn đã học bằng numCourses thì true, không thì false.'],
    decisions: ['Chiều cạnh là b → a (học b trước) — đảo chiều là bậc vào sai hết, test đơn vẫn qua mà test vòng thì hỏng.', 'Dùng Kahn thay vì DFS ba màu — không đệ quy nên khỏi lo stack sâu, code cũng ít nhánh hơn.', 'So taken với numCourses thay vì check queue rỗng — queue rỗng là bình thường, thiếu môn mới là có chu trình.'],
    complexityWhy: { time: 'O(V + E): mỗi môn vào queue một lần, mỗi cạnh trừ bậc một lần.', space: 'O(V + E): adjacency cộng queue.' },
    takeaway: 'Khi hỏi một tập ràng buộc trước-sau có khả thi không: Kahn, học hết thì không chu trình.',
    relatedSlugs: ['alien-dict-269', 'valid-tree-261'],
    filename: 'course-schedule.ts',
    code: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    indeg[a]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let taken = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    taken++;
    for (const v of adj[u]) {
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  return taken === numCourses;
}`,
    highlightLines: [16],
    dryRun: {
      input: 'numCourses = 2, prerequisites = [[1,0]]',
      trace: ['indeg = [0,1], queue = [0]', 'Pop 0 → indeg[1] = 0 → push 1, taken = 1', 'Pop 1 → taken = 2 = numCourses → true'],
      output: 'true',
    },
    pitfalls: ['Nhầm chiều cạnh [a,b] (b trước a) → đồ thị ngược', 'DFS 3 màu cũng được nhưng Kahn dễ code ít lỗi hơn'],
  },
  'pacific-atlantic-417': {
    slug: 'pacific-atlantic-417',
    blindNo: 417,
    time: 'O(m·n)',
    space: 'O(m·n)',
    rule: 'Đi ngược từ 2 bờ vào trong (thấp → cao), ô nào cả 2 phía tới được thì lấy.',
    insight: 'Nước chảy từ cao xuống thấp, nhưng nếu DFS xuôi từ mỗi ô ra biển thì phải làm lại cho cả m·n ô → O((mn)²). Đảo chiều: đi ngược từ biển vào đất (chỉ sang ô cao hơn hoặc bằng) thì mỗi bờ loang một lần, mỗi ô thăm tối đa một lần mỗi phía. Ô nào cả hai phía loang tới được thì nước từ đó chảy ra được cả hai đại dương — giao hai tập visited là đáp án.',
    bruteForce: 'Brute force: từ mỗi ô DFS xuôi ra cả hai biển → O(mn) ô × O(mn) mỗi lần = O((mn)²). Vấn đề là loang trùng lặp. Tối ưu: đảo ngược hướng đi, loang 2 lần từ bờ — O(mn).',
    checklist: ['Vì sao đi xuôi từ mỗi ô ra biển lại đắt? (làm lại vùng chung nhiều lần)', 'Đi ngược thì điều kiện độ cao đảo thế nào? (sang ô cao hơn hoặc bằng — ngược với chảy xuôi)', 'Ô nào thỏa cả hai đại dương? (giao của 2 tập visited)'],
    idea: ['Bước 1: DFS/BFS từ hàng trên + cột trái (Pacific) và hàng dưới + cột phải (Atlantic), đi ngược sang ô >= chiều cao hiện tại.', 'Bước 2: lưu 2 tập visited riêng.', 'Bước 3: ô thuộc cả hai tập là đáp án.'],
    decisions: ['Đi ngược từ bờ thay vì xuôi từ từng ô → mỗi ô thăm tối đa 1 lần mỗi phía, từ O((mn)²) về O(mn).', 'Hai Set visited riêng (không chung) → chung một set sẽ lẫn “tới được một biển” với “tới được cả hai”.'],
    complexityWhy: { time: 'O(m·n): mỗi ô thăm tối đa một lần mỗi phía.', space: 'O(m·n): hai tập visited + stack đệ quy.' },
    takeaway: 'Nhiều nguồn đích trên grid mà đi xuôi bị lặp → nghĩ đảo chiều: loang ngược từ đích rồi giao nhau.',
    relatedSlugs: ['number-of-islands-200', 'course-schedule-207'],
    filename: 'pacific-atlantic.ts',
    code: `function pacificAtlantic(heights: number[][]): number[][] {
  const R = heights.length, C = heights[0].length;
  const pac = new Set<string>();
  const atl = new Set<string>();

  const dfs = (r: number, c: number, seen: Set<string>, prev: number): void => {
    if (r < 0 || c < 0 || r >= R || c >= C) return;
    const key = r + ',' + c;
    if (seen.has(key) || heights[r][c] < prev) return;
    seen.add(key);
    dfs(r + 1, c, seen, heights[r][c]);
    dfs(r - 1, c, seen, heights[r][c]);
    dfs(r, c + 1, seen, heights[r][c]);
    dfs(r, c - 1, seen, heights[r][c]);
  };

  for (let c = 0; c < C; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(R - 1, c, atl, heights[R - 1][c]);
  }
  for (let r = 0; r < R; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, C - 1, atl, heights[r][C - 1]);
  }

  const res: number[][] = [];
  pac.forEach((key) => {
    if (atl.has(key)) {
      const [r, c] = key.split(',').map(Number);
      res.push([r, c]);
    }
  });
  return res;
}`,
    highlightLines: [9],
    dryRun: {
      input: 'heights 5×5 (ví dụ LeetCode)',
      trace: ['Pacific loang từ trên+trái vào trong (đi lên cao)', 'Atlantic loang từ dưới+phải vào trong', 'Giao nhau 7 ô: [0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]'],
      output: '7 ô',
    },
    pitfalls: ['DFS xuôi từ mỗi ô ra biển (O((mn)²)) thay vì ngược từ biển vào', 'So sánh sai chiều cao (đi ngược phải cho phép lên cao, không phải xuống thấp)'],
  },
  'number-of-islands-200': {
    slug: 'number-of-islands-200',
    blindNo: 200,
    time: 'O(m·n)',
    space: 'O(m·n)',
    rule: 'Gặp đất chưa thăm thì +1 và flood-fill chìm cả đảo (đánh dấu đã thăm).',
    insight: 'Một đảo là một vùng đất liên thông (4 hướng) — đứng ở một ô đất mà loang hết vùng reachable thì cả đảo bị “chìm” đúng một lần. Duyệt mọi ô: gặp đất chưa chìm nghĩa là phát hiện đảo mới (+1) rồi flood-fill chìm cả cụm để không đếm lại. Đánh dấu bằng cách ghi đè “1” → “0” nên khỏi Set visited riêng.',
    checklist: ['Gặp ô “1” có nghĩa là gì? (đảo mới — vì đảo cũ đã bị chìm hết)', 'Flood-fill dừng khi nào? (ra biên / gặp nước / đã chìm)', 'Liên thông tính mấy hướng? (4 — không chéo)'],
    idea: ['Bước 1: duyệt mọi ô; gặp “1” thì count++ rồi sink(r,c).', 'Bước 2: sink: ô không phải “1” thì dừng; ngược lại ghi “0” rồi sink 4 hướng.', 'Bước 3: return count.'],
    decisions: ['Chìm đảo bằng cách ghi đè grid (thay vì Set visited) → O(1) bộ nhớ phụ, vì đề cho phép sửa grid.', 'Đệ quy 4 hướng (không chéo) → đúng định nghĩa đảo của đề; thêm chéo là sai.'],
    complexityWhy: { time: 'O(m·n): mỗi ô bị chìm/thăm tối đa một lần.', space: 'O(m·n) worst-case stack đệ quy (đảo phủ cả grid; trung bình O(độ sâu vùng)).' },
    takeaway: 'Đếm vùng liên thông trên grid → nghĩ gặp đất mới +1 rồi flood-fill chìm cả vùng.',
    relatedSlugs: ['pacific-atlantic-417', 'clone-graph-133'],
    filename: 'number-of-islands.ts',
    code: `function numIslands(grid: string[][]): number {
  const R = grid.length, C = grid[0].length;
  let count = 0;

  const sink = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === '1') {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
    highlightLines: [16],
    dryRun: {
      input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
      trace: ['(0,0) đất → count=1, chìm cả cụm (0,0),(0,1),(1,0)', '(2,2) đất → count=2, chìm', 'Hết → 2'],
      output: '2',
    },
    pitfalls: ['Quên đánh dấu đã thăm → đếm 1 đảo nhiều lần / treo', 'Tính cả đường chéo là 1 đảo (sai — chỉ 4 hướng)'],
  },
  'longest-consecutive-128': {
    slug: 'longest-consecutive-128',
    blindNo: 128,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Chỉ đếm từ “đầu dãy” (thiếu x−1) → mỗi số thăm đúng 1 lần, O(n).',
    insight: 'Sort rồi quét là O(n log n) — đề bắt O(n) nên phải tránh sort. Hash Set cho lookup O(1) “x+1 có tồn tại không”, nhưng nếu đếm từ mọi số thì mỗi dãy bị đếm lại nhiều lần (worst-case O(n²)). Mẹo là chỉ đếm từ “đầu dãy” (số thiếu x−1): mỗi số thuộc đúng một dãy nên chỉ bị thăm khi đếm từ đầu dãy của nó — tổng cộng mỗi số thăm đúng một lần.',
    bruteForce: 'Brute force: sort O(n log n) rồi quét một pass; hoặc đếm dãy từ mọi số → worst-case O(n²) (vd 1..n mỗi số đếm lại cả dãy). Vấn đề là công việc lặp lại. Tối ưu: chỉ đếm từ đầu dãy, mỗi số thăm một lần — O(n).',
    checklist: ['Constraint O(n) loại bỏ công cụ nào? (sort)', 'Làm sao mỗi số chỉ được thăm một lần? (chỉ đếm từ đầu dãy: thiếu x−1)', 'Cần lookup tồn tại O(1) → cấu trúc nào? (Hash Set, đồng thời khử trùng)'],
    idea: ['Bước 1: bỏ hết số vào Set.', 'Bước 2: với mỗi x, nếu Set có x−1 thì bỏ qua (không phải đầu dãy).', 'Bước 3: ngược lại đếm lên x+1, x+2... tới đứt, cập nhật best.'],
    decisions: ['Duyệt trên Set thay vì mảng gốc → số trùng không gây đếm thừa và vòng while không lặp vô ích.', 'Điều kiện “thiếu x−1” thay vì đếm mọi x → đây chính là điểm đưa complexity từ O(n²) về O(n).'],
    complexityWhy: { time: 'O(n): mỗi số bị while thăm tối đa một lần (chỉ khi thuộc dãy đang đếm từ đầu).', space: 'O(n): Set chứa n số.' },
    takeaway: 'Tìm dãy liên tiếp trong mảng chưa sort với O(n) → nghĩ Hash Set + chỉ đếm từ đầu dãy.',
    relatedSlugs: ['contains-duplicate-217', 'top-k-frequent-347'],
    filename: 'longest-consecutive.ts',
    code: `function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (!set.has(x - 1)) {
      let cur = x;
      let len = 1;
      while (set.has(cur + 1)) {
        cur++;
        len++;
      }
      best = Math.max(best, len);
    }
  }
  return best;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [100,4,200,1,3,2]',
      trace: ['100: thiếu 99 → đầu dãy, đếm 100 → dài 1', '4: thiếu 3 → bỏ qua (không phải đầu)', '200: dài 1', '1: thiếu 0 → đầu dãy, đếm 1,2,3,4 → dài 4 ← best'],
      output: '4',
    },
    pitfalls: ['Đếm từ mọi số (mỗi dãy bị đếm lại nhiều lần → O(n²) worst-case)', 'Sort trước O(n log n) — đề bắt O(n)'],
  },
  'house-robber-198': {
    slug: 'house-robber-198',
    blindNo: 198,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Nhà i: max(trộm tới i−1, trộm tới i−2 + nhà i). Chỉ cần 2 biến lăn.',
    insight: 'Đứng ở nhà i, chỉ có hai phương án: bỏ qua nó (kết quả bằng tốt nhất tới i − 1) hoặc trộm nó (cộng tiền nhà i với tốt nhất tới i − 2, vì i − 1 kề nên cấm). Đáp án là max hai phương án. Mỗi vị trí chỉ cần hai giá trị trước đó nên hai biến lăn là đủ, không cần mảng.',
    bruteForce: 'Thử mọi tập nhà không kề — O(2^n). Vấn đề là các hậu tố chồng nhau tính đi tính lại. Tối ưu: duyệt xuôi, mỗi nhà quyết định một lần từ hai kết quả trước.',
    checklist: ['State là gì (số tiền nhiều nhất tới nhà i)?', 'Tại nhà i có mấy lựa chọn, mỗi lựa chọn cộng với state nào (bỏ: i − 1, trộm: i − 2 + tiền)?', 'Cần giữ bao nhiêu quá khứ (hai giá trị)?'],
    idea: ['Bước 1: prev2 = 0 (tới i − 2), prev1 = 0 (tới i − 1).', 'Bước 2: với mỗi nhà x, cur = max(prev1, prev2 + x).', 'Bước 3: lăn prev2 = prev1, prev1 = cur.', 'Bước 4: hết mảng trả prev1.'],
    decisions: ['Khởi tạo cả hai bằng 0 thay vì nums[0] — mảng rỗng trả 0 tự nhiên, khỏi if riêng.', 'Rolling hai biến thay vì mảng dp — công thức chỉ nhìn hai bước trước.', 'Không tham lam lấy nhà lớn — ví dụ [2,1,1,2]: tham được 3, đáp án đúng là 4.'],
    complexityWhy: { time: 'O(n): một lần duyệt, mỗi nhà một phép max.', space: 'O(1): hai biến lăn.' },
    takeaway: 'Khi mỗi vị trí chọn lấy hay bỏ với ràng buộc kề: dp[i] = max(dp[i−1], dp[i−2] + x).',
    relatedSlugs: ['house-robber-ii-213', 'climbing-stairs-70'],
    filename: 'house-robber.ts',
    code: `function rob(nums: number[]): number {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [2,7,9,3,1]',
      trace: ['x=2: max(0,2)=2 → (0,2)', 'x=7: max(2,7)=7 → (2,7)', 'x=9: max(7,11)=11 → (7,11)', 'x=3: max(11,10)=11 → (11,11)', 'x=1: max(11,12)=12'],
      output: '12',
    },
    pitfalls: ['Tham lam lấy nhà lớn (vd [2,1,1,2]: tham được 3, đúng là 4)', 'Mảng dp O(n) vẫn đúng nhưng phí — rolling O(1) đủ'],
  },
  'house-robber-ii-213': {
    slug: 'house-robber-ii-213',
    blindNo: 213,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Vòng tròn: đầu và cuối kề nhau → chạy robber thường 2 lần (bỏ đầu / bỏ cuối), lấy max.',
    insight: 'Vòng tròn chỉ thêm đúng một ràng buộc so với bản thường: nhà đầu và nhà cuối kề nhau nên không thể trộm cả hai. Mọi phương án hợp lệ đều rơi vào một trong hai nhóm: không trộm nhà cuối, hoặc không trộm nhà đầu. Mỗi nhóm là một đoạn thẳng — tức bài House Robber thường. Chạy hai lần, lấy max.',
    bruteForce: 'Thử mọi tập không kề trên vòng tròn — O(2^n), lại còn phải check cặp đầu-cuối. Vấn đề là ràng buộc vòng làm công thức thẳng sai. Tối ưu: chẻ vòng thành hai đoạn thẳng, tái dùng solution bài 198.',
    checklist: ['Ràng buộc mới so với bản thẳng là gì (đầu-cuối kề nhau)?', 'Chẻ vòng thành mấy case thẳng để bao hết đáp án (bỏ đầu / bỏ cuối)?', 'Case biên nào sập (một nhà thì hai case trùng nhau)?'],
    idea: ['Bước 1: một nhà thì trả luôn.', 'Bước 2: chạy robber thẳng trên [0..n−2] (bỏ nhà cuối).', 'Bước 3: chạy robber thẳng trên [1..n−1] (bỏ nhà đầu).', 'Bước 4: trả max hai kết quả.'],
    decisions: ['Chặn một nhà riêng — không thì range [0..−1] rỗng cho kết quả sai.', 'Viết robRange(l, r) tái dùng thay vì copy code — hai case chỉ khác biên.', 'Không cố một công thức vòng duy nhất — chẻ case giữ code thẳng và đúng, giá chỉ gấp đôi time.'],
    complexityWhy: { time: 'O(n): hai lần quét thẳng, mỗi lần O(n).', space: 'O(1): mỗi lần quét hai biến lăn.' },
    takeaway: 'Khi vòng tròn thêm ràng buộc đầu-cuối: chẻ thành hai bài thẳng (bỏ đầu / bỏ cuối), lấy max.',
    relatedSlugs: ['house-robber-198', 'jump-game-55'],
    filename: 'house-robber-ii.ts',
    code: `function rob2(nums: number[]): number {
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
    highlightLines: [12],
    dryRun: {
      input: 'nums = [2,3,2]',
      trace: ['Bỏ cuối [2,3]: max = 3', 'Bỏ đầu [3,2]: max = 3', 'max(3,3) = 3 (không thể 2+2 vì kề vòng tròn)'],
      output: '3',
    },
    pitfalls: ['Chạy robber thẳng cả vòng (trộm cả đầu + cuối kề nhau)', 'Quên case 1 nhà (range rỗng)'],
  },
  'decode-ways-91': {
    slug: 'decode-ways-91',
    blindNo: 91,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Như leo thang: 1 chữ số (1–9) hoặc 2 chữ số (10–26); số 0 không đứng một mình.',
    insight: 'Ký tự cuối của chuỗi mã hóa chỉ có hai nguồn gốc: một chữ số đơn (1–9) đứng một mình, hoặc một cặp (10–26) đi cùng nhau. Mọi cách giải mã đều kết thúc bằng đúng một trong hai dạng này, nên số cách của tiền tố dài i bằng tổng số cách của hai tiền tố ngắn hơn — y hệt leo cầu thang, chỉ khác là có những bước bị cấm (số 0 đơn, cặp ngoài 10–26).',
    bruteForce: 'Đệ quy thử mọi cách cắt — O(2^n). Vấn đề là cùng một hậu tố được giải đi giải lại. Tối ưu: duyệt xuôi, mỗi vị trí tính một lần từ hai vị trí trước.',
    checklist: ['State là gì (số cách giải tiền tố dài i)?', 'Ký tự cuối có mấy nguồn gốc hợp lệ (một chữ số 1–9, hai chữ số 10–26)?', 'Ký tự nào không bao giờ đứng một mình (số 0)?', 'Có cần giữ cả bảng không (chỉ cần hai giá trị trước)?'],
    idea: ['Bước 1: prev2 = 1 (chuỗi rỗng một cách), prev1 theo ký tự đầu (0 thì không cách nào).', 'Bước 2: với i từ 2 tới n, cur = 0.', 'Bước 3: chữ số cuối khác 0 thì cộng prev1.', 'Bước 4: hai chữ số cuối trong 10–26 thì cộng prev2; lăn prev2, prev1 rồi đi tiếp.'],
    decisions: ['Check hai chữ số bằng khoảng 10–26 trên số nguyên — tự loại 01–09 vì số 0 đầu, khỏi regex.', 'Xử lý s[0] == 0 riêng ngay đầu — cả bài sụp đổ từ ký tự đầu tiên sai.', 'Rolling hai biến thay vì mảng — công thức chỉ nhìn hai state trước.'],
    complexityWhy: { time: 'O(n): một lần duyệt, mỗi vị trí vài phép so sánh.', space: 'O(1): hai biến lăn.' },
    takeaway: 'Khi ký tự cuối có hai nguồn gốc hợp lệ: cộng dồn hai state trước như leo thang, trừ bước bị cấm.',
    relatedSlugs: ['climbing-stairs-70', 'house-robber-198'],
    filename: 'decode-ways.ts',
    code: `function numDecodings(s: string): number {
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
    highlightLines: [7],
    dryRun: {
      input: 's = "226"',
      trace: ['i=1 ("2"): 1 cách', 'i=2 ("22"): 1 chữ (2) + 2 chữ (22) = 2', 'i=3 ("226"): 1 chữ (6→+2) + 2 chữ (26→+1) = 3'],
      output: '3 ("BBF","BZ","VF")',
    },
    pitfalls: ['Cho "0" đứng một mình (0 không map chữ nào)', 'Nhận 2 chữ số 01–09 (số 0 đầu là sai)'],
  },
  'coin-change-322': {
    slug: 'coin-change-322',
    blindNo: 322,
    time: 'O(amount·n)',
    space: 'O(amount)',
    rule: 'dp[x] = 1 + min(dp[x−c]) mọi mệnh giá; duyệt amount tăng dần (dùng lại xu thoải mái).',
    insight: 'Muốn đổi số tiền x, đồng xu cuối cùng phải là một mệnh giá c nào đó — sau khi bớt c ra, phần còn lại x − c phải được đổi tối ưu. Mọi đáp án tối ưu đều có dạng này, nên dp[x] = 1 + min dp[x − c]. Vì đồng xu dùng lại thoải mái, duyệt x tăng dần đảm bảo khi tính dp[x] thì mọi dp[x − c] đã xong. Đó là unbounded knapsack dạng một chiều.',
    bruteForce: 'Thử mọi tổ hợp xu (đệ quy/backtracking) — số nhánh bùng nổ theo amount. Vấn đề là cùng một số tiền dư được giải đi giải lại. Tối ưu: mỗi số tiền từ 1 tới amount chỉ tính một lần và tái dùng.',
    checklist: ['State là gì (số xu ít nhất cho số tiền x)?', 'Đồng xu cuối cùng có mấy khả năng, mỗi khả năng dẫn về state nào?', 'Thứ tự duyệt nào đảm bảo state con xong trước (ở đây: x tăng dần vì dùng lại xu)?', 'Giá trị nào đánh dấu không đổi được?'],
    idea: ['Bước 1: dp[0] = 0, còn lại là vô cùng.', 'Bước 2: với x từ 1 tới amount, thử mọi mệnh giá c ≤ x.', 'Bước 3: dp[x] = min(dp[x], dp[x − c] + 1).', 'Bước 4: dp[amount] vẫn vô cùng thì trả −1, ngược lại trả giá trị đó.'],
    decisions: ['Khởi tạo vô cùng thay vì −1 — min() hoạt động tự nhiên, chỉ chuyển thành −1 ở cuối.', 'Duyệt x ngoài, duyệt xu trong — thứ tự này cho phép dùng lại xu không giới hạn; đảo lại thành mỗi xu một lần là bài khác.', 'Không tham lam lấy xu lớn trước — ví dụ [1,3,4] đổi 6: tham được 3 xu, đáp án đúng là 2.'],
    complexityWhy: { time: 'O(amount · n): mỗi số tiền thử mọi mệnh giá.', space: 'O(amount): mảng dp một chiều.' },
    takeaway: 'Khi vật dùng lại không giới hạn và cần tối ưu: dp[x] từ mọi dp[x − c], duyệt x tăng dần.',
    relatedSlugs: ['combination-sum-39', 'word-break-139'],
    filename: 'coin-change.ts',
    code: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x - c >= 0) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    highlightLines: [6],
    dryRun: {
      input: 'coins = [1,2,5], amount = 11',
      trace: ['dp[1..4] = 1,2,1,2 (dùng 1,2)', 'dp[5] = 1 (xu 5)', 'dp[6..10] = 2,2,3,3,2', 'dp[11] = dp[6]+1 = 3 (5+5+1)'],
      output: '3',
    },
    pitfalls: ['Tham lam lấy xu lớn trước ([1,3,4] đổi 6: tham 4+1+1=3 xu, đúng là 3+3=2 xu)', 'Quên −1 khi không đổi được'],
  },
  'lis-300': {
    slug: 'lis-300',
    blindNo: 300,
    time: 'O(n²)',
    space: 'O(n)',
    rule: 'dp[i] = 1 + max(dp[j]) với mọi j < i mà nums[j] < nums[i]. Muốn O(n log n): patience + binary search.',
    insight: 'Dãy con tăng dài nhất kết thúc tại i luôn bằng một dãy tốt nhất kết thúc ở j < i (với nums[j] < nums[i]) nối thêm nums[i]. Tức đáp án của i tái sử dụng đáp án của mọi vị trí trước đó — đó là optimal substructure, và cùng một j được hỏi lại bởi nhiều i nên cache vào dp thay vì đệ quy mũ. Vì dãy dài nhất toàn mảng chưa chắc kết thúc ở cuối, đáp án là max toàn bộ dp.',
    bruteForce: 'Brute force: thử mọi subsequence (2^n) hoặc đệ quy không memo → O(2^n). Vấn đề là cùng vị trí j được tính lại cho nhiều i khác nhau. Tối ưu: dp[i] lưu sẵn, mỗi i chỉ quét j < i — O(n²).',
    checklist: ['State dp[i] nên gắn với vị trí nào? (dãy tốt nhất kết thúc tại i)', 'Muốn mở rộng qua nums[i] thì vị trí trước phải thỏa gì? (j < i và nums[j] < nums[i])', 'Đáp án nằm ở dp cuối hay max toàn bộ? (max toàn bộ)'],
    idea: ['Bước 1: dp[i] = 1 cho mọi i (base case: một mình nó).', 'Bước 2: với mỗi i, quét j < i; nếu nums[j] < nums[i] thì dp[i] = max(dp[i], dp[j] + 1) — transition nối thêm.', 'Bước 3: đáp án = max toàn bộ dp (mảng rỗng → 0).'],
    decisions: ['Khởi tạo dp = 1 thay vì 0 → vì dãy một phần tử luôn dài 1, transition +1 mới đúng.', 'So sánh < chặt (không phải <=) → đề yêu cầu strictly increasing.'],
    complexityWhy: { time: 'O(n²): mỗi cặp (j,i) xét một lần.', space: 'O(n): mảng dp.' },
    takeaway: 'Dãy con tối ưu kết thúc tại i xây từ vị trí trước đó → nghĩ dp[i] = 1 + max(dp[j]) với điều kiện nối được.',
    relatedSlugs: ['lcs-1143', 'coin-change-322'],
    filename: 'lis.ts',
    code: `function lengthOfLIS(nums: number[]): number {
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
    highlightLines: [6],
    dryRun: {
      input: 'nums = [10,9,2,5,3,7,101,18]',
      trace: ['dp[2]=1 (số 2)', 'dp[3]=2 (2→5)', 'dp[4]=2 (2→3)', 'dp[5]=3 (2→3→7)', 'dp[6]=4 (…→101)', 'dp[7]=4'],
      output: '4',
    },
    pitfalls: ['Return dp cuối (dãy dài nhất chưa chắc kết thúc ở cuối)', 'Dùng ≤ thay vì < (phải tăng chặt — strictly)'],
  },
  'jump-game-55': {
    slug: 'jump-game-55',
    blindNo: 55,
    time: 'O(n)',
    space: 'O(1)',
    rule: 'Tham lam từ phải sang trái: goal lùi dần về index tới được nó, tới 0 là thắng.',
    insight: 'Bài hỏi “tới được đích không”, không hỏi đường đi cụ thể — nên thay vì liệt kê mọi cách nhảy (DP O(n²)), chỉ cần biết vùng nào đã “chạm tới được”. Đứng ở i mà nhảy tới goal thì goal lùi về i; lặp từ phải sang trái, goal càng lùi càng dễ chạm. Tới được index 0 nghĩa là tồn tại chuỗi nhảy nối tiếp nhau về đích. Đó là lý do Greedy ngược hoạt động: ta chỉ lan truyền “khả năng tới đích” thay vì thử mọi đường.',
    bruteForce: 'Brute force/DP: từ mỗi i thử mọi bước nhảy 1..nums[i] → O(n²). Vấn đề là ta xét lại cùng một vùng đích nhiều lần. Tối ưu: nén cả vùng thành một mốc goal duy nhất và chỉ hỏi “i có chạm goal không” — O(n).',
    checklist: ['Mình có cần đường đi cụ thể hay chỉ cần biết “tới được hay không”?', 'Nếu đứng ở i mà chạm được mốc đã tới đích, mốc đó có lùi về i được không?', 'Duyệt xuôi hay ngược thì mốc lan truyền gọn hơn?'],
    idea: ['Bước 1: đặt goal = index cuối (đích cần chạm).', 'Bước 2: duyệt i từ cuối về đầu; nếu i + nums[i] >= goal thì gán goal = i.', 'Bước 3: hết vòng, goal == 0 nghĩa là có chuỗi nhảy nối tiếp từ đầu tới đích → return true.'],
    decisions: ['Duyệt ngược thay vì xuôi → mỗi i chỉ cần so với một mốc goal duy nhất, không cần nhớ cả vùng đã phủ.', 'Điều kiện i + nums[i] >= goal (không phải ==) → nhảy dư qua goal vẫn tính là chạm được.'],
    complexityWhy: { time: 'O(n): một vòng duyệt ngược, mỗi i một phép so sánh.', space: 'O(1): chỉ biến goal.' },
    takeaway: 'Chỉ cần biết “tới được hay không” trên mảng nhảy → nghĩ Greedy lan mốc goal từ phải sang trái.',
    relatedSlugs: ['max-subarray-53', 'house-robber-198'],
    filename: 'jump-game.ts',
    code: `function canJump(nums: number[]): boolean {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) goal = i;
  }
  return goal === 0;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'nums = [2,3,1,1,4]',
      trace: ['goal=4; i=4: 4+4≥4 → goal=4', 'i=3: 3+1≥4 → goal=3', 'i=2: 2+1≥3 → goal=2', 'i=1: 1+3≥2 → goal=1', 'i=0: 0+2≥1 → goal=0 → true'],
      output: 'true',
    },
    pitfalls: ['Tham lam xuôi (luôn nhảy xa nhất) sai — vd [3,2,1,0,4]', 'DP từ trái sang mà không cắt tỉa → O(n²) timeout ở test lớn'],
  },
  'word-break-139': {
    slug: 'word-break-139',
    blindNo: 139,
    time: 'O(n²)',
    space: 'O(n)',
    rule: 'dp[i] = có j < i sao cho dp[j] đúng và s[j:i] trong dict.',
    insight: 'Tiền tố s[0:i] tách được khi và chỉ khi tồn tại điểm cắt j mà tiền tố s[0:j] đã tách được VÀ đoạn s[j:i] là một từ trong dict. Quá khứ (dp[j] đúng) được tái dùng cho mọi i > j — đó chính là DP: state dp[i] \'tiền tố dài i tách được\', transition \'thử mọi điểm cắt j < i\'. Từ được dùng lại nhiều lần nên không có chuyện \'hết từ\', chỉ cần dict tra cứu nhanh.',
    bruteForce: 'Backtracking thử mọi cách cắt → exponential, bùng nổ với từ ngắn lặp lại (như \'aaaaaaa\" với \'aaaa\'/\"aa\': tham lam cắt dài nhất trước là kẹt). Tối ưu: DP bottom-up ghi nhớ tiền tố nào tách được, dict dùng Set để lookup O(1).',
    checklist: ['State dp[i] nghĩa là gì — cả chuỗi hay tiền tố dài i?', 'Transition thử cái gì — mọi điểm cắt j hay chỉ vài điểm?', 'Từ điển tra cứu sao cho nhanh — Set hay duyệt mảng?'],
    idea: ['dp[0] = true (tiền tố rỗng coi như tách được — base case).', 'Với mỗi i từ 1..n, thử mọi j < i: dp[j] đúng và s[j:i] trong dict thì dp[i] = true, break.', 'Return dp[n].'],
    decisions: ['dp[0] = true là base bắt buộc: từ đầu tiên (j = 0) cần \'tiền tố trước nó tách được\" để transition chạy.', 'Break ngay khi dp[i] = true: chỉ cần biết tách ĐƯỢC, không cần cách cắt tối ưu — tiết kiệm hết phần còn lại của vòng j.', 'Dict dùng Set thay vì includes trên mảng: lookup O(1) thay vì O(dict) nhân thêm vào vòng j đã O(n).'],
    complexityWhy: { time: 'O(n²): mỗi cặp (j, i) xét một lần (bỏ qua chi phí slice chuỗi con).', space: 'O(n): mảng dp cộng Set từ điển.' },
    takeaway: 'Cắt chuỗi theo từ điển, từ dùng lại được → DP trên tiền tố + thử mọi điểm cắt.',
    relatedSlugs: ['decode-ways-91', 'coin-change-322'],
    filename: 'word-break.ts',
    code: `function wordBreak(s: string, wordDict: string[]): boolean {
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
    highlightLines: [7],
    dryRun: {
      input: 's = "leetcode", dict = ["leet","code"]',
      trace: ['dp[4] = true (s[0:4]="leet" ✓)', 'dp[8]: j=4, dp[4] ✓ và s[4:8]="code" ✓ → true'],
      output: 'true',
    },
    pitfalls: ['Tham lam cắt từ dài nhất trước ("aaaaaaa" + ["aaaa","aa"] cần backtrack)', 'Quên từ được dùng lại nhiều lần'],
  },
  'longest-palindrome-5': {
    slug: 'longest-palindrome-5',
    blindNo: 5,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Mỗi vị trí bung 2 phía: tâm lẻ (i,i) + tâm chẵn (i,i+1), giữ chuỗi dài nhất.',
    insight: 'Palindrome có tính đối xứng quanh tâm: nếu s[l..r] đối xứng thì bỏ hai đầu vẫn đối xứng. Thay vì liệt kê mọi substring O(n²) rồi check từng cái, ta làm ngược — cố định tâm rồi bung ra hai phía tới khi lệch. Mỗi palindrome dài đều bị “bắt” đúng một lần khi bung từ tâm của nó, nên không sót đáp án mà chỉ tốn O(1) bộ nhớ.',
    bruteForce: 'Brute force: liệt kê mọi substring O(n²) × check palindrome O(n) → O(n³). Vấn đề là check lại từ đầu mỗi substring. Tối ưu: bung từ tâm, mỗi tâm bung tối đa O(n) — O(n²) time, O(1) space.',
    checklist: ['Palindrome được xác định bởi gì? (tâm + bán kính bung)', 'Tâm có mấy loại? (lẻ i,i và chẵn i,i+1 — thiếu chẵn là mất “abba”)', 'Mình cần giữ chuỗi hay chỉ độ dài/vị trí? (giữ start + maxLen rồi slice một lần)'],
    idea: ['Bước 1: với mỗi i, bung tâm lẻ (i,i) và tâm chẵn (i,i+1): khi s[l]==s[r] thì cập nhật best rồi l--, r++.', 'Bước 2: dừng bung khi lệch hoặc ra biên.', 'Bước 3: return s.slice(start, start + maxLen).'],
    decisions: ['Bung cả hai loại tâm → đáp án chẵn (“abba”) chỉ lộ ra từ tâm chẵn.', 'Lưu start + maxLen thay vì cắt chuỗi mỗi lần → tránh tạo O(n) chuỗi tạm trong lúc bung.'],
    complexityWhy: { time: 'O(n²): 2n tâm, mỗi tâm bung tối đa O(n).', space: 'O(1): chỉ vài biến số (không tính output).' },
    takeaway: 'Tìm chuỗi đối xứng dài nhất/đếm chuỗi đối xứng → nghĩ bung từ tâm (cả lẻ lẫn chẵn).',
    relatedSlugs: ['palindromic-substrings-647', 'longest-substring-3'],
    filename: 'longest-palindrome.ts',
    code: `function longestPalindrome(s: string): string {
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
    highlightLines: [5],
    dryRun: {
      input: 's = "babad"',
      trace: ['Tâm 1 (a): bung "bab" dài 3 ← best', 'Tâm 1-2 (a,b): khác ngay', 'Tâm 2 (b): bung "aba" dài 3 (không hơn)', 'Còn lại ngắn hơn'],
      output: '"bab" (hoặc "aba" đều đúng)',
    },
    pitfalls: ['Chỉ xét tâm lẻ (mất đáp án chẵn như "abba")', 'DP bảng O(n²) bộ nhớ vẫn đúng nhưng phí hơn expand O(1)'],
  },
  'palindromic-substrings-647': {
    slug: 'palindromic-substrings-647',
    blindNo: 647,
    time: 'O(n²)',
    space: 'O(1)',
    rule: 'Giống bài 5 nhưng đếm thay vì giữ chuỗi: mỗi lần bung khớp là +1.',
    insight: 'Mỗi substring đối xứng có đúng một tâm: hoặc là một ký tự giữa (tâm lẻ như \'aba\'), hoặc là kẽ giữa hai ký tự (tâm chẵn như \'abba\'). Thay vì sinh mọi substring rồi kiểm tra từng cái, ta duyệt mọi tâm (2n−1 tâm) và bung ra hai phía — mỗi lần bung mà hai đầu còn khớp là phát hiện thêm một palindrome mới. Tâm cố định toàn bộ cấu trúc, nên việc bung không bao giờ làm lại từ đầu như cách kiểm tra độc lập.',
    bruteForce: 'Sinh mọi substring O(n²) rồi check đối xứng O(n) mỗi cái → O(n³) time. Vấn đề là các substring lồng nhau chung một tâm bị kiểm tra lại từ đầu mỗi lần. Tối ưu: bung từ tâm, mỗi cặp so sánh phục vụ luôn cho tâm đó — còn O(n²) time, O(1) space.',
    checklist: ['Tâm của palindrome nằm ở đâu — một ký tự hay kẽ giữa hai ký tự?', 'Từ một tâm, khi nào thì bung tiếp và khi nào dừng?', 'Mỗi lần bung còn khớp nghĩa là gì — đếm hay giữ chuỗi?'],
    idea: ['Với mỗi index i, coi i là tâm lẻ và kẽ (i, i+1) là tâm chẵn.', 'Từ mỗi tâm, bung l và r ra hai phía chừng nào s[l] === s[r].', 'Mỗi lần bung còn khớp thì count++ (vị trí khác nhau tính riêng).', 'Hết mọi tâm thì count là đáp án.'],
    decisions: ['Gọi expand(i, i) và expand(i, i+1) cho mọi i — bao hết cả hai loại tâm, không sót \'aa\'.', 'count++ nằm bên trong vòng while thay vì đo độ dài sau — vì mỗi bước bung khớp tương ứng đúng một palindrome.', 'Không lưu chuỗi con nào nên chỉ cần biến đếm, đạt O(1) space.'],
    complexityWhy: { time: 'O(n²): có ~2n tâm, mỗi tâm bung tối đa O(n) bước.', space: 'O(1): chỉ biến đếm và hai con trỏ bung, không lưu substring nào.' },
    takeaway: 'Cần liệt kê hoặc đếm mọi palindrome → nghĩ bung từ tâm, luôn làm cả tâm lẻ lẫn tâm chẵn.',
    relatedSlugs: ['longest-palindrome-5', 'valid-palindrome-125'],
    filename: 'palindromic-substrings.ts',
    code: `function countSubstrings(s: string): number {
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
    highlightLines: [4],
    dryRun: {
      input: 's = "aaa"',
      trace: ['Tâm 0: "a" → 1', 'Tâm 1: "a","aaa" → +2 = 3', 'Tâm 2: "a" → 4', 'Tâm chẵn 0-1: "aa" → 5; 1-2: "aa" → 6'],
      output: '6',
    },
    pitfalls: ['Đếm chuỗi phân biệt thay vì theo vị trí ("aaa" có 6, không phải 3)', 'Bỏ tâm chẵn (mất "aa")'],
  },
  'implement-trie-208': {
    slug: 'implement-trie-208',
    blindNo: 208,
    time: 'O(m)',
    space: 'O(m·n)',
    rule: 'Trie = cây theo ký tự: đi theo từng chữ, cờ end đánh dấu hết từ.',
    insight: 'Từ điển có chung prefix (apple, app, application) — lưu riêng từng từ thì prefix lặp lại vô số lần. Trie gộp các prefix chung thành một đường đi duy nhất trên cây theo ký tự: đi hết từ mà tồn tại đường đi nghĩa là prefix có mặt. Thêm cờ isEnd ở cuối để phân biệt từ hoàn chỉnh với prefix dở dang (app khác apple). Ba thao tác đều là đi theo từng chữ nên O(m).',
    bruteForce: 'Lưu list từ rồi search bằng quét tuyến tính — O(N · m) mỗi lần hỏi. Vấn đề là quét lại cả từ điển dù prefix đầu đã loại đa số. Tối ưu: đi theo cây prefix, cụt nhánh là dừng ngay.',
    checklist: ['Cấu trúc cần biểu diễn là gì (tập prefix chung)?', 'Khi nào đi tiếp, khi nào dừng (cụt nhánh là không có)?', 'Phân biệt từ hoàn chỉnh với prefix bằng gì (cờ isEnd)?'],
    idea: ['Bước 1: mỗi node có map con theo ký tự và cờ isEnd.', 'Bước 2: insert — đi theo từng chữ, thiếu nhánh thì tạo, cuối từ set end.', 'Bước 3: search — đi hết từ, đúng khi tới được node và end là true.', 'Bước 4: startsWith — đi hết prefix là đủ, khỏi cần end.'],
    decisions: ['Tách walk() chung cho search và startsWith — hai hàm chỉ khác bước check cuối, đi chung khỏi trùng code.', 'Children dùng Map thay vì mảng 26 — tổng quát cho mọi charset, chỉ tạo nhánh thật sự dùng.', 'Search check cả node null lẫn isEnd — thiếu một trong hai là sai một chiều (cụt nhánh hoặc prefix dở).'],
    complexityWhy: { time: 'O(m): mỗi thao tác đi đúng một ký tự một bước (m là độ dài từ).', space: 'O(tổng độ dài các từ): mỗi ký tự mới một node trong tệ nhất.' },
    takeaway: 'Khi nhiều thao tác trên tập prefix chung: Trie — đi theo chữ, cờ end phân biệt từ với prefix.',
    relatedSlugs: ['add-search-words-211', 'word-search-ii-212'],
    filename: 'implement-trie.ts',
    code: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }

  private walk(s: string): TrieNode | null {
    let node: TrieNode | null = this.root;
    for (const c of s) {
      node = node?.children.get(c) ?? null;
      if (node === null) return null;
    }
    return node;
  }
}`,
    highlightLines: [11],
    dryRun: {
      input: 'insert("apple"); search("apple"); search("app"); startsWith("app")',
      trace: ['insert: root→a→p→p→l→e, end(e)=true', 'search apple: đi hết, end=true → true', 'search app: đi hết nhưng end=false → false', 'startsWith app: đi hết → true'],
      output: 'true, false, true',
    },
    pitfalls: ['Search quên check isEnd ("app" thành true oan)', 'StartsWith đòi end = true (sai — prefix không cần hết từ)'],
  },
  'add-search-words-211': {
    slug: 'add-search-words-211',
    blindNo: 211,
    time: 'O(26^m)',
    space: 'O(m·n)',
    rule: 'Trie thường + DFS: gặp "." thì thử cả 26 nhánh, hết chuỗi mà end thì đúng.',
    insight: 'Trie thường chỉ đi được đúng một nhánh cho mỗi ký tự, nhưng dấu chấm trong search lại khớp với bất kỳ chữ nào — nghĩa là tại vị trí đó ta không biết phải đi nhánh nào. Khi một quyết định có nhiều khả năng mà không có thông tin để chọn, cách duy nhất là thử hết và quay lui khi sai. Đó chính là lý do DFS + backtracking xuất hiện trên nền Trie: Trie cắt bớt nhánh vô nghĩa sớm, DFS lo phần thử các nhánh còn lại.',
    bruteForce: 'Brute force: với mỗi từ trong từ điển, so từng ký tự với pattern, chấm khớp mọi chữ — O(N · L) mỗi search. Vấn đề là ta quét lại toàn bộ từ điển dù đa số từ khác nhau ngay từ chữ đầu. Tối ưu: gom từ điển vào Trie một lần, search chỉ đi theo các prefix tồn tại, gặp chấm mới rẽ nhánh.',
    checklist: ['Mình cần khớp chính xác từng chữ, hay có ký tự đại diện khớp nhiều chữ?', 'Tập từ điển có dùng lại cho nhiều lần search không (đáng build cấu trúc chung)?', 'Khi gặp ký tự đại diện, mình thử các khả năng bằng cách nào và quay lui ra sao?'],
    idea: ['Bước 1: addWord như Trie thường — thiếu nhánh thì tạo, cuối từ đánh dấu isEnd.', 'Bước 2: search bằng DFS đệ quy theo vị trí k trong pattern từ node hiện tại.', 'Bước 3: ký tự thường thì đi đúng một nhánh con, cụt nhánh là false.', 'Bước 4: gặp chấm thì thử mọi nhánh con ở vị trí đó, nhánh nào true là true.', 'Bước 5: hết chuỗi (k = length) thì trả về node.isEnd.'],
    decisions: ['Hết chuỗi vẫn phải check isEnd — vì prefix của từ dài hơn không tính là khớp.', 'Duyệt children.values() khi gặp chấm thay vì 26 chữ cái — chỉ thử nhánh thật sự tồn tại, Trie tự cắt nhánh chết.', 'DFS trả về boolean thay vì trả node — search chỉ cần biết có/không, không cần vị trí.'],
    complexityWhy: { time: 'addWord O(m); search xấu nhất O(26^m) khi pattern toàn chấm (m = độ dài từ).', space: 'Trie lưu tối đa tổng độ dài các từ cộng dồn, cộng stack đệ quy O(m).' },
    takeaway: 'Khi search có ký tự đại diện trên tập từ điển cố định: Trie + DFS thử mọi nhánh.',
    relatedSlugs: ['implement-trie-208', 'word-search-ii-212'],
    filename: 'add-search-words.ts',
    code: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

class WordDictionary {
  root = new TrieNode();

  addWord(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const dfs = (n: TrieNode | null, k: number): boolean => {
      if (n === null) return false;
      if (k === word.length) return n.isEnd;
      const c = word[k];
      if (c === '.') {
        for (const child of n.children.values()) {
          if (dfs(child, k + 1)) return true;
        }
        return false;
      }
      return dfs(n.children.get(c) ?? null, k + 1);
    };
    return dfs(this.root, 0);
  }
}`,
    highlightLines: [23],
    dryRun: {
      input: 'add bad/dad/mad; search("b.d")',
      trace: ['b → nhánh b', '. → thử b-a-d...: a khớp', 'd khớp, hết chuỗi, end=true → true'],
      output: 'true',
    },
    pitfalls: ['Gặp “.” mà chỉ thử 1 nhánh (phải thử hết mọi nhánh con)', 'Quên base hết chuỗi vẫn phải check isEnd'],
  },
  'word-search-ii-212': {
    slug: 'word-search-ii-212',
    blindNo: 212,
    time: 'O(m·n·4·3^(L−1))',
    space: 'O(k·L)',
    rule: 'Ném hết từ vào Trie rồi DFS 1 lần: prefix không có trong Trie thì cắt nhánh.',
    insight: 'Gọi lại word-search cho từng từ thì các từ chia sẻ prefix (oath/oat...) bắt cùng nhánh lưới bị duyệt đi duyệt lại — lãng phí nhân với số từ k. Gom mọi từ vào một Trie rồi DFS một lần: mỗi đường đi trên lưới đồng thời là một đường đi trong Trie, prefix không tồn tại trong Trie thì cả nhánh lưới bị cắt ngay. Một đường đi có thể thu từ cho nhiều từ cùng lúc — đó là toàn bộ lợi ích.',
    bruteForce: 'DFS từng từ riêng: O(k·m·n·4^L) — đúng nhưng k lên tới 3·10⁴ là chết. Vấn đề là công sức trên các prefix chung bị lặp lại k lần. Tối ưu: một Trie chung + một DFS, prefix vắng mặt là cắt nhánh.',
    checklist: ['Vì sao gom từ vào Trie — chia sẻ cái gì, cắt được cái gì?', 'Khi nào thì thu một từ — tới node end nghĩa là gì?', 'Chống thu trùng và rỡ visited xử lý ra sao?'],
    idea: ['Build Trie từ mọi từ, node end lưu nguyên từ đó.', 'DFS từ mọi ô men theo Trie: ký tự không có nhánh con thì cắt (return).', 'Tới node end (word khác null) thì thu từ rồi set null để khỏi trùng; khóa/rỡ ô như word-search.'],
    decisions: ['Node end lưu cả word (thay vì boolean): thu từ O(1) không cần ráp lại đường đi, xong set null để cùng từ không bị thu hai lần.', 'Cắt nhánh bằng \'!node.children.has(ch)\' ngay đầu DFS: đây chính là \'prefix không tồn tại\" — nguồn gốc mọi tiết kiệm so với brute force.', 'DFS nhận node Trie hiện tại làm tham số (thay vì index chữ): state \'đang ở node nào\" tự chứa prefix đã khớp, khỏi truyền thêm k.'],
    complexityWhy: { time: 'O(m·n·4·3^(L−1)): ô đầu 4 hướng, các bước sau không quay lại ô vừa tới nên còn 3.', space: 'O(k·L): Trie chứa mọi từ cộng stack đệ quy O(L).' },
    takeaway: 'Nhiều từ trên cùng một lưới → một Trie chung + một DFS; prefix vắng mặt trong Trie là cắt nhánh.',
    relatedSlugs: ['word-search-79', 'implement-trie-208'],
    filename: 'word-search-ii.ts',
    code: `class WsTrieNode {
  children = new Map<string, WsTrieNode>();
  word: string | null = null;
}

function buildWsTrie(words: string[]): WsTrieNode {
  const root = new WsTrieNode();
  for (const w of words) {
    let n = root;
    for (const c of w) {
      if (!n.children.has(c)) n.children.set(c, new WsTrieNode());
      n = n.children.get(c)!;
    }
    n.word = w;
  }
  return root;
}

function findWords(board: string[][], words: string[]): string[] {
  const root = buildWsTrie(words);
  const res: string[] = [];
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, node: WsTrieNode): void => {
    if (r < 0 || c < 0 || r >= R || c >= C) return;
    const ch = board[r][c];
    if (ch === '#' || !node.children.has(ch)) return;
    const next = node.children.get(ch)!;
    if (next.word !== null) {
      res.push(next.word);
      next.word = null; // chống trùng
    }
    board[r][c] = '#';
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;
  };

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) dfs(r, c, root);
  return res;
}`,
    highlightLines: [27],
    dryRun: {
      input: 'board 4×4 (oath/pea/eat/rain), words = ["oath","pea","eat","rain"]',
      trace: ['DFS từ o(0,0): o→a→t→h khớp Trie → thu "oath"', 'Từ e(1,0)... nhánh "pea": p không kề → cắt', 'Từ e(2,3)... à e(1,3)→a→t: "eat" → thu', '"rain" không đi được → bỏ'],
      output: '["oath","eat"] (thứ tự có thể khác)',
    },
    pitfalls: ['DFS từng từ riêng (O(k·m·n·4^L)) thay vì 1 Trie chung', 'Quên xóa end sau khi thu → trùng từ; quên rỡ visited → sai'],
  },
  'top-k-frequent-347': {
    slug: 'top-k-frequent-347',
    blindNo: 347,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Đếm tần suất rồi bucket theo tần suất (index = số lần xuất hiện), quét ngược lấy K.',
    insight: 'Tần suất của một phần tử luôn nằm trong [1, n] — miền giá trị hữu hạn và nhỏ. Sort theo tần suất O(n log n) là phí vì không tận dụng bound này. Đảo ngược quan hệ đếm: bucket[f] chứa các số xuất hiện đúng f lần (index chính là tần suất), rồi quét f từ n về 1 và dừng khi gom đủ K. Đếm một pass, gom một pass — không có log factor nào.',
    bruteForce: 'Đếm xong sort theo tần suất O(n log n) — đúng nhưng chưa tối ưu, rớt bonus đề bài. Min-heap giữ K phần tử O(n log K) gọn code hơn sort nhưng vẫn có log. Bucket sort theo tần suất đạt O(n) vì tần suất bị chặn bởi n.',
    checklist: ['Tần suất tối đa là bao nhiêu — tận dụng được bound nào của nó?', 'Đảo \'số → tần suất\" thành \'tần suất → danh sách số\" bằng cấu trúc gì?', 'Quét từ đâu tới và dừng khi nào (đủ K)?'],
    idea: ['Đếm tần suất mỗi số bằng map (một pass).', 'Đổ vào bucket: số xuất hiện f lần thì vào bucket[f] (bucket dài n+1).', 'Quét f từ n về 1, gom bucket[f] vào kết quả tới khi đủ K.'],
    decisions: ['Bucket dài n+1 vì tần suất tối đa là n (cả mảng cùng một số) — quên +1 là tràn index đúng ca biên đó.', 'Quét NGƯỢC từ n về 1: cần frequent nhất trước, quét xuôi rồi sort lại là tự phá O(n).', 'Vòng quét dừng theo res.length < k vì một bucket có thể chứa nhiều số — dừng theo số bucket là sai khi K nằm giữa bucket.'],
    complexityWhy: { time: 'O(n): đếm một pass, đổ bucket một pass, quét bucket một pass.', space: 'O(n): map tần suất cộng mảng bucket chứa đúng n phần tử phân tán.' },
    takeaway: 'Top-K theo tần suất mà cần tốt hơn O(n log n) → bucket theo tần suất, index chính là count.',
    relatedSlugs: ['group-anagrams-49', 'find-median-295'],
    filename: 'top-k-frequent.ts',
    code: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
  const bucket: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) bucket[count].push(val);
  const res: number[] = [];
  for (let f = nums.length; f >= 1 && res.length < k; f--) {
    res.push(...bucket[f]);
  }
  return res;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'nums = [1,1,1,2,2,3], k = 2',
      trace: ['freq: 1×3, 2×2, 3×1', 'bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]', 'Quét ngược: lấy 1, rồi 2 → đủ K'],
      output: '[1,2]',
    },
    pitfalls: ['Sort theo tần suất O(n log n) vẫn đúng nhưng chưa tối ưu', 'Bucket size n+1 (tần suất tối đa = n) — quên +1 là tràn'],
  },
  'find-median-295': {
    slug: 'find-median-295',
    blindNo: 295,
    time: 'O(log n)',
    space: 'O(n)',
    rule: '2 heap: max-heap nửa dưới + min-heap nửa trên, size chênh ≤ 1.',
    insight: 'Trung vị là ranh giới chia dữ liệu thành hai nửa: nửa dưới và nửa trên. Ta không cần toàn bộ thứ tự, chỉ cần biết đỉnh của mỗi nửa (max của dưới, min của trên) và hai nửa lệch nhau tối đa một phần tử. Hai heap làm đúng việc này: max-heap giữ nửa dưới, min-heap giữ nửa trên, mỗi lần thêm số mới thì cân bằng lại. Mọi bất biến giữ được thì median đọc ra trong O(1).',
    bruteForce: 'Lưu mảng rồi sort mỗi lần hỏi — O(n log n) cho mỗi findMedian. Vấn đề là sort lại toàn bộ chỉ để lấy một hoặc hai phần tử giữa. Tối ưu: duy trì hai heap dần dần, mỗi add chỉ O(log n).',
    checklist: ['Mình cần min hay max ở mỗi nửa (dưới cần max, trên cần min)?', 'Bất biến giữa hai heap là gì (mọi số dưới ≤ mọi số trên, size chênh ≤ 1)?', 'Sau mỗi lần thêm, thứ tự cân bằng nào khôi phục bất biến?'],
    idea: ['Bước 1: số mới luôn vào max-heap nửa dưới trước.', 'Bước 2: đẩy đỉnh của dưới sang trên — đảm bảo mọi số dưới ≤ mọi số trên.', 'Bước 3: nếu dưới ít hơn trên thì chuyển một số về cho cân (dưới giữ nhiều hơn hoặc bằng).', 'Bước 4: hỏi median — dưới đông hơn thì đỉnh dưới, bằng nhau thì trung bình hai đỉnh.'],
    decisions: ['Đẩy qua heap dưới trước thay vì vào thẳng heap trên — bước trung gian này là thứ ép bất biến thứ tự, bỏ là vỡ.', 'Cho nửa dưới giữ phần dư khi lẻ — quy ước cố định để findMedian không cần đếm.', 'Hai heap generic bằng comparator thay vì hai class — một code heap dùng cho cả max và min.'],
    complexityWhy: { time: 'O(log n): mỗi addNum ba thao tác heap, findMedian O(1).', space: 'O(n): hai heap chứa toàn bộ số đã thêm.' },
    takeaway: 'Khi cần trung vị dòng dữ liệu: max-heap nửa dưới + min-heap nửa trên, cân size chênh ≤ 1.',
    relatedSlugs: ['top-k-frequent-347', 'merge-k-lists-23'],
    filename: 'find-median.ts',
    code: `class Heap {
  a: number[] = [];
  constructor(private less: (x: number, y: number) => boolean) {}
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
  push(v: number): void {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[i], a[p])) { [a[i], a[p]] = [a[p], a[i]]; i = p; }
      else break;
    }
  }
  pop(): number {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}

class MedianFinder {
  lo = new Heap((x, y) => x > y); // max-heap nửa dưới
  hi = new Heap((x, y) => x < y); // min-heap nửa trên

  addNum(x: number): void {
    this.lo.push(x);
    this.hi.push(this.lo.pop());
    if (this.lo.size < this.hi.size) this.lo.push(this.hi.pop());
  }

  findMedian(): number {
    if (this.lo.size > this.hi.size) return this.lo.top;
    return (this.lo.top + this.hi.top) / 2;
  }
}`,
    highlightLines: [43],
    dryRun: {
      input: 'add 1, add 2, median, add 3, median',
      trace: ['add 1: lo=[1], hi=[] → median 1', 'add 2: lo=[1], hi=[2] → median (1+2)/2=1.5', 'add 3: lo=[2,1], hi=[3] → median 2'],
      output: '1.5, 2',
    },
    pitfalls: ['Để size chênh > 1 (median sai)', 'Đẩy số mới thẳng vào heap trên mà không qua heap dưới (vỡ bất biến dưới ≤ trên)'],
  },
  'combination-sum-39': {
    slug: 'combination-sum-39',
    blindNo: 39,
    time: 'O(n^(t/m))',
    space: 'O(t/m)',
    rule: 'Backtracking chọn/bỏ: mỗi vị trí hoặc lấy tiếp (giữ index) hoặc bỏ qua (index+1).',
    insight: 'Mỗi ứng viên đứng trước hai lựa chọn: lấy thêm một lần nữa (vì được dùng lại) hoặc bỏ qua luôn. Hai lựa chọn này phủ hết mọi tổ hợp và không giao nhau — lấy tiếp thì index giữ nguyên, bỏ qua thì index tăng. Cây quyết định nhị phân này chính là backtracking chọn/bỏ; nhánh nào vượt target thì cả cây con của nó đều vượt nên cắt được.',
    bruteForce: 'Đây vốn đã là bài liệt kê nên không có shortcut đa thức — mọi tổ hợp đều phải sinh ra. Vấn đề là sinh trùng và sinh nhánh chết. Cắt nhánh khi vượt target và phân biệt lấy (giữ index) với bỏ (tăng index) giữ mỗi tổ hợp sinh đúng một lần.',
    checklist: ['Tại mỗi vị trí mình có mấy lựa chọn, và mỗi lựa chọn thay đổi state ra sao?', 'Điều kiện cắt nhánh là gì (ở đây: tổng vượt target)?', 'Làm sao tránh sinh trùng (lấy thì giữ index, bỏ thì tăng index)?'],
    idea: ['Bước 1: DFS(i, cur, sum) với i là ứng viên đang xét.', 'Bước 2: sum bằng target thì lưu bản sao của cur, return.', 'Bước 3: sum vượt target hoặc hết mảng thì cắt nhánh.', 'Bước 4: nhánh lấy — push candidate[i], DFS(i) giữ nguyên index.', 'Bước 5: nhánh bỏ — pop ra, DFS(i + 1).'],
    decisions: ['Nhánh lấy gọi DFS(i) chứ không phải i + 1 — đây là điểm duy nhất phân biệt với bài mỗi số dùng một lần.', 'Lưu [...cur] thay vì cur — cur còn bị pop/push tiếp, giữ reference là hỏng kết quả.', 'Cắt nhánh ngay khi sum > target — vì mọi số dương, đi sâu thêm chỉ vượt xa hơn.'],
    complexityWhy: { time: 'O(n^(t/m)): cây quyết định với t là target, m là mệnh giá nhỏ nhất.', space: 'O(t/m): stack đệ quy sâu bằng số phần tử nhiều nhất trong một tổ hợp.' },
    takeaway: 'Khi mỗi phần tử có hai lựa chọn lấy-nữa/bỏ-qua: backtracking nhị phân, cắt khi vượt giới hạn.',
    relatedSlugs: ['coin-change-322', 'word-search-79'],
    filename: 'combination-sum.ts',
    code: `function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = [];
  const dfs = (i: number, cur: number[], sum: number): void => {
    if (sum === target) {
      res.push([...cur]);
      return;
    }
    if (sum > target || i >= candidates.length) return;
    cur.push(candidates[i]);
    dfs(i, cur, sum + candidates[i]);
    cur.pop();
    dfs(i + 1, cur, sum);
  };
  dfs(0, [], 0);
  return res;
}`,
    highlightLines: [11],
    dryRun: {
      input: 'candidates = [2,3,6,7], target = 7',
      trace: ['Lấy 2,2,2 (sum 6) → lấy nữa 8>7 cắt, bỏ → [2,2,3] ✓', 'Bỏ 3... lấy 6? 2+6=8 cắt', 'Bỏ 2 đầu: 3... 3+3+... 7? 3+... cắt; 6... 6<7, +... cắt', 'Bỏ hết tới 7 → [7] ✓'],
      output: '[[2,2,3],[7]]',
    },
    pitfalls: ['Nhánh lấy mà dfs(i+1) thì mất tổ hợp dùng lại (thành Combination Sum II)', 'Lưu cur trực tiếp (reference) thay vì copy → kết quả rỗng/sai'],
  },
  'word-search-79': {
    slug: 'word-search-79',
    blindNo: 79,
    time: 'O(m·n·4^L)',
    space: 'O(L)',
    rule: 'Thử mọi ô làm điểm bắt đầu, DFS 4 hướng khớp từng chữ, backtrack visited.',
    insight: 'Mỗi ô đều có thể là điểm bắt đầu nên vòng ngoài thử mọi ô khớp chữ đầu; từ đó DFS 4 hướng khớp từng ký tự word[k] — \'đã khớp tới chữ thứ k\" theo độ sâu đệ quy chính là invariant. Ô đã dùng trong đường hiện tại phải khóa tạm (đè \'#\') để không quay lại chính nó, thử xong bốn hướng thì rỡ (backtrack) để đường khác còn dùng được ô đó. Quên rỡ là khóa ô vĩnh viễn — bug kinh điển.',
    bruteForce: 'Không có cách tốt hơn tổng quát: xấu nhất phải thử gần như mọi đường dài L từ mọi ô → O(m·n·4^L). Tối ưu thực tế duy nhất là cắt sớm: ký tự hiện tại lệch thì dừng nhánh ngay, khỏi đi sâu vô ích.',
    checklist: ['State của một lời gọi DFS gồm những gì — vị trí và \'đã khớp tới chữ thứ mấy\'?', 'Khi nào khóa ô, khi nào rỡ — rỡ ở đâu trong code?', 'Khi nào return true/false — hết chữ, lệch chữ, hay hết hướng?'],
    idea: ['Thử mọi ô khớp word[0] làm điểm bắt đầu DFS.', 'DFS(r, c, k): hết chữ (k = len) → true; ngoài biên hoặc lệch chữ → false.', 'Khớp thì khóa ô (\'#\'), thử cả bốn hướng với k+1, rỡ khóa rồi trả kết quả OR.'],
    decisions: ['Check k === len ĐẦU TIÊN, trước cả check biên: đường khớp đủ chữ là thắng ngay, thứ tự này tránh lỗi biên ở bước cuối.', 'Đánh dấu bằng cách đè \'#\" trực tiếp lên board rồi gán lại tmp — khỏi Set visited O(L) phụ, board tự làm visited.', 'Rỡ (board[r][c] = tmp) TRƯỚC khi return found: return trước rỡ là khóa ô vĩnh viễn với mọi đường thử sau.'],
    complexityWhy: { time: 'O(m·n·4^L): mọi ô làm gốc, mỗi bước tối đa 4 hướng sâu L.', space: 'O(L): stack đệ quy sâu bằng độ dài từ (board mutate tại chỗ).' },
    takeaway: 'Tìm từ trên lưới, mỗi ô dùng một lần → DFS khớp từng chữ + khóa ô tạm thời và rỡ sau (backtrack).',
    relatedSlugs: ['word-search-ii-212', 'number-of-islands-200'],
    filename: 'word-search.ts',
    code: `function exist(board: string[][], word: string): boolean {
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, k: number): boolean => {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C) return false;
    if (board[r][c] !== word[k]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    const found =
      dfs(r + 1, c, k + 1) ||
      dfs(r - 1, c, k + 1) ||
      dfs(r, c + 1, k + 1) ||
      dfs(r, c - 1, k + 1);
    board[r][c] = tmp;
    return found;
  };

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (board[r][c] === word[0] && dfs(r, c, 0)) return true;
    }
  return false;
}`,
    highlightLines: [5],
    dryRun: {
      input: 'board 3×4 (ABCCED...), word = "ABCCED"',
      trace: ['(0,0) A khớp → (0,1) B khớp → (0,2) C khớp', '(1,2) C khớp → (2,2) E khớp → (2,1) D khớp, hết chữ → true'],
      output: 'true',
    },
    pitfalls: ['Quên rỡ dấu visited sau khi thử (ô bị khóa vĩnh viễn)', 'Không cắt sớm khi chữ hiện tại đã lệch (duyệt thừa)'],
  },
  'max-depth-104': {
    slug: 'max-depth-104',
    blindNo: 104,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Chiều cao = 1 + max(trái, phải); null thì 0. Đệ quy 1 dòng là đủ.',
    insight: 'Chiều cao của cây được định nghĩa đệ quy: cao của node = 1 + cao nhất trong hai con. Vì hai nhánh độc lập nhau, đáp án của node cha tái sử dụng trực tiếp đáp án hai con — không cần nhớ gì thêm ngoài giá trị trả về. Base case null = 0 neo toàn bộ đệ quy.',
    checklist: ['State của mỗi node là gì? (chiều cao cây con gốc tại node đó)', 'Base case nào neo đệ quy? (null → 0)', 'Kết hợp hai nhánh con thế nào? (1 + max)'],
    idea: ['Bước 1: null → return 0.', 'Bước 2: đệ quy tính depth trái và phải.', 'Bước 3: return 1 + max(trái, phải).'],
    decisions: ['Đệ quy trực tiếp thay vì BFS đếm tầng → code 1 dòng logic, space O(h) thay vì O(n) queue ở cây đầy.', 'Cộng 1 sau max (không phải trước) → mỗi tầng chỉ tính một lần, lá = 1.'],
    complexityWhy: { time: 'O(n): thăm mỗi node đúng một lần.', space: 'O(h): stack đệ quy sâu bằng chiều cao (cây lệch O(n)).' },
    takeaway: 'Hỏi chiều cao/cấu trúc đệ quy của cây → nghĩ đáp án cha = 1 + max(hai con), neo bằng null.',
    relatedSlugs: ['level-order-102', 'max-path-sum-124'],
    filename: 'max-depth.ts',
    code: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    highlightLines: [3],
    dryRun: {
      input: 'root = [3,9,20,null,null,15,7]',
      trace: ['depth(9) = 1, depth(15) = depth(7) = 1', 'depth(20) = 1 + max(1,1) = 2', 'depth(3) = 1 + max(1,2) = 3'],
      output: '3',
    },
    pitfalls: ['Quên +1 ở mỗi tầng', 'Nhầm với số node (đường dài nhất theo cạnh thì trừ 1)'],
  },
  'same-tree-100': {
    slug: 'same-tree-100',
    blindNo: 100,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'So song song: cùng null → true, 1 null hoặc khác giá trị → false, rồi so 2 nhánh.',
    insight: '\'Giống nhau\" nghĩa là giá trị bằng nhau VÀ cấu trúc bằng nhau — đệ quy diễn đạt đúng định nghĩa đó: hai gốc khớp nhau thì cặp cây con trái phải cùng khớp nhau, và ngược lại. Base case null quyết định trước: cùng null là khớp (hai lá gặp nhau), một null là lệch cấu trúc, khỏi cần so gì thêm.',
    bruteForce: 'Không có brute force đáng nói — đệ quy này đã tối ưu. Serialize hai cây thành chuỗi rồi so cũng O(n) time nhưng tốn O(n) space vô ích và code dài hơn.',
    checklist: ['Hai node được coi là khớp khi nào — giá trị, cấu trúc, hay cả hai?', 'Base case null có mấy trường hợp và mỗi trường hợp trả gì?', 'Hai nhánh dưới nối bằng AND hay OR — sai một nhánh thì sao?'],
    idea: ['Cả hai null → true; một null hoặc val khác nhau → false.', 'Cả hai khớp gốc thì return sameTree(trái-trái) && sameTree(phải-phải).'],
    decisions: ['Check null TRƯỚC khi đọc .val — thứ tự này vừa đúng logic vừa tránh crash null.', 'Nối hai nhánh bằng && vì chỉ cần một nhánh lệch là cả cây lệch (ngược với bài tìm ở \'đâu đó\" dùng ||).', 'So val ở node hiện tại thay vì đẩy xuống con — mỗi cặp node chịu trách nhiệm đúng một lần so giá trị.'],
    complexityWhy: { time: 'O(n): mỗi cặp node tương ứng được thăm đúng một lần, dừng sớm khi lệch.', space: 'O(h): stack đệ quy sâu bằng chiều cao cây (xấu nhất O(n) với cây lược).' },
    takeaway: 'So sánh hai cây → đệ quy song song, xử lý base case null trước, && khi cần \'mọi nhánh đều khớp\'.',
    relatedSlugs: ['subtree-572', 'invert-tree-226'],
    filename: 'same-tree.ts',
    code: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    highlightLines: [3],
    dryRun: {
      input: 'p = [1,2,3], q = [1,2,3]',
      trace: ['1 = 1 → so trái (2 vs 2) và phải (3 vs 3)', '2 = 2, 2 lá null khớp → true', '3 = 3 tương tự → true'],
      output: 'true',
    },
    pitfalls: ['Chỉ so giá trị mà bỏ cấu trúc (vd [1,2] vs [1,null,2])', 'Dùng || thay vì && ở 2 nhánh'],
  },
  'invert-tree-226': {
    slug: 'invert-tree-226',
    blindNo: 226,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Gương cây = swap trái/phải mọi node, đệ quy xuống tiếp.',
    insight: 'Lật gương cây nghĩa là mọi node đều đổi chỗ trái-phải. Quan sát mấu chốt: sau khi đổi ở node hiện tại, hai cây con vẫn là hai cây cần lật gương độc lập — bài toán con giống hệt bài toán cha. Đệ quy tới lá (null thì dừng), đổi tại chỗ trên đường về. Không cần cây mới vì đổi con trỏ là đủ.',
    bruteForce: 'Không có cách rẻ hơn — mọi node đều phải đổi nên lower bound là O(n). Vấn đề duy nhất là đổi đúng thứ tự con trỏ. Đệ quy một hàm là solution tối ưu luôn.',
    checklist: ['State của mỗi node là gì, và bài toán con có giống bài toán cha không?', 'Khi nào đi xuống, khi nào quay lại (null là base)?', 'Thứ tự đổi con trỏ có quan trọng không (phải qua biến tạm)?'],
    idea: ['Bước 1: null thì return null.', 'Bước 2: giữ nhánh trái vào biến tạm.', 'Bước 3: gán trái bằng kết quả invert của phải, phải bằng invert của biến tạm.', 'Bước 4: return root.'],
    decisions: ['Đệ quy ngay trong lúc gán (invertTree(root.right)) — vừa đổi vừa đi sâu trong một câu, khỏi hai pass.', 'Giữ tmp cho nhánh trái gốc — gán trái trước là mất reference nhánh cũ nếu không qua tạm.', 'Đổi tại chỗ thay vì tạo node mới — đề chỉ cần mirror cấu trúc, O(1) phụ ngoài stack.'],
    complexityWhy: { time: 'O(n): mỗi node thăm và đổi đúng một lần.', space: 'O(h): stack đệ quy sâu bằng chiều cao (lệch thì O(n)).' },
    takeaway: 'Khi mọi node cần cùng một phép biến đổi độc lập: đệ quy đổi tại chỗ, null là base.',
    relatedSlugs: ['max-depth-104', 'same-tree-100'],
    filename: 'invert-tree.ts',
    code: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);
  return root;
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [4,2,7,1,3,6,9]',
      trace: ['Swap ở 4: trái ↔ phải → [4,7,2,...]', 'Đệ quy nhánh 7: [7,9,6]', 'Đệ quy nhánh 2: [2,3,1]'],
      output: '[4,7,2,9,6,3,1]',
    },
    pitfalls: ['Gán left = right rồi right = left mà không qua temp (mất nhánh)', 'Quên return root ở cuối'],
  },
  'max-path-sum-124': {
    slug: 'max-path-sum-124',
    blindNo: 124,
    time: 'O(n)',
    space: 'O(h)',
    rule: 'Mỗi node: trả lên gain tốt nhất 1 nhánh, cập nhật max toàn cục bằng cả 2 nhánh.',
    insight: 'Đường đi bất kỳ trong cây luôn có một node cao nhất (đỉnh của đường). Tại mỗi node, đường tốt nhất “đi qua nó” = val + nhánh trái tốt nhất + nhánh phải tốt nhất; nhưng thứ cha của nó dùng được chỉ là một nhánh (đường đi không được rẽ hai lần). Nên mỗi node làm hai việc khác nhau: cập nhật đáp án toàn cục bằng cả hai nhánh, trả về cho cha chỉ một nhánh tốt nhất — và nhánh âm thì bỏ (max với 0).',
    bruteForce: 'Brute force: liệt kê mọi cặp node rồi tính tổng đường nối → O(n²). Vấn đề là tính lại các đoạn chung. Tối ưu: một DFS vừa trả gain một nhánh vừa cập nhật best toàn cục — O(n).',
    checklist: ['Đường đi qua node hiện tại gồm mấy phần? (val + trái + phải)', 'Thứ trả về cho cha khác gì thứ dùng để cập nhật đáp án? (trả 1 nhánh, cập nhật cả 2)', 'Nhánh âm xử lý sao? (bỏ, max với 0 — trừ khi mọi số âm thì best neo ở -Infinity)'],
    idea: ['Bước 1: gain(node) = 0 nếu null; ngược lại l = max(0, gain(trái)), r = max(0, gain(phải)).', 'Bước 2: best = max(best, val + l + r) tại mỗi node.', 'Bước 3: trả về val + max(l, r) cho cha; đáp án là best.'],
    decisions: ['Neo best = -Infinity thay vì 0 → cây toàn âm vẫn trả đúng số âm lớn nhất.', 'Cắt nhánh âm bằng max(0, gain) → đường rỗng (không lấy nhánh) tốt hơn đường lỗ.'],
    complexityWhy: { time: 'O(n): mỗi node thăm một lần, O(1) công việc mỗi node.', space: 'O(h): stack đệ quy.' },
    takeaway: 'Đường tối ưu trong cây (không nhất thiết qua root) → nghĩ DFS trả 1 nhánh + biến toàn cục chốt 2 nhánh.',
    relatedSlugs: ['max-depth-104', 'house-robber-198'],
    filename: 'max-path-sum.ts',
    code: `function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;
  const gain = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = Math.max(0, gain(node.left));
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'root = [-10,9,20,null,null,15,7]',
      trace: ['gain(9) = 9, best = 9', 'gain(15) = 15, gain(7) = 7', 'gain(20) = 20+15+7 → best = 42, return 20+15=35', 'gain(−10): best = max(42, −10+9+35=34) = 42'],
      output: '42',
    },
    pitfalls: ['Return cả 2 nhánh cho cha (đường đi sẽ rẽ nhánh, sai định nghĩa)', 'Khởi tạo best = 0 sẽ sai khi mọi số âm'],
  },
  'level-order-102': {
    slug: 'level-order-102',
    blindNo: 102,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'BFS + chốt levelSize đầu mỗi tầng: xử lý đúng số node của tầng đó.',
    insight: 'Đề yêu cầu gom node theo từng tầng, mà DFS tự nhiên đi sâu chứ không đi ngang. Queue (FIFO) xử lý node đúng thứ tự “vào trước ra trước” nên node tầng trên luôn ra trước tầng dưới. Chốt size = queue.length đầu mỗi vòng cho biết chính xác tầng hiện tại có bao nhiêu node — đó là invariant tách tầng, vì node con mới push thuộc tầng sau.',
    checklist: ['Mình cần gom theo tầng (ngang) hay đi sâu? (ngang → BFS/Queue)', 'Làm sao biết node nào thuộc tầng nào khi queue phình ra liên tục? (chốt size đầu vòng)'],
    idea: ['Bước 1: queue = [root]; nếu root null return [] ngay.', 'Bước 2: mỗi vòng, chốt size = queue.length rồi shift đúng size node, gom val vào level.', 'Bước 3: push con trái/phải (nếu có) vào queue; hết vòng push level vào result.'],
    decisions: ['Chốt size trước vòng lặp → vì trong lúc shift ta push thêm con, đọc queue.length trực tiếp sẽ lố sang tầng sau.', 'Check root null ngay đầu → cây rỗng trả [] chứ không phải [[]].'],
    complexityWhy: { time: 'O(n): mỗi node vào/ra queue đúng một lần.', space: 'O(n): queue chứa tối đa một tầng (worst-case tầng cuối ~n/2).' },
    takeaway: 'Cần xử lý theo tầng từ trên xuống → nghĩ BFS với chốt size đầu mỗi vòng.',
    relatedSlugs: ['max-depth-104', 'number-of-islands-200'],
    filename: 'level-order.ts',
    code: `function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const queue: TreeNode[] = [root];
  const result: number[][] = [];
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    highlightLines: [6],
    dryRun: {
      input: 'root = [3,9,20,null,null,15,7]',
      trace: ['Tầng 0: size=1, lấy 3, queue=[9,20]', 'Tầng 1: size=2, lấy 9,20, queue=[15,7]', 'Tầng 2: size=2, lấy 15,7, queue rỗng'],
      output: '[[3],[9,20],[15,7]]',
    },
    pitfalls: ['Dùng queue.length trực tiếp trong for (queue phình ra, lặp lố sang tầng sau)', 'Quên check root null'],
  },
  'serialize-tree-297': {
    slug: 'serialize-tree-297',
    blindNo: 297,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Preorder + dấu # cho null: thứ tự duyệt chính là “bản đồ” dựng lại cây.',
    insight: 'Preorder đơn thuần mơ hồ: nhiều cây khác nhau cho cùng một dãy giá trị. Thêm marker \'#\" cho null thì mỗi cây cho đúng một chuỗi và mỗi chuỗi dựng lại đúng một cây — vì marker giữ lại \'hình dáng\" (đâu là lá, đâu là nhánh thiếu). Thứ tự duyệt chính là bản đồ: deserialize chỉ việc đọc token đúng thứ tự preorder, gặp số thì tạo node rồi dựng trái/phải, gặp \'#\" thì trả null.',
    bruteForce: 'Không có brute force — đây là bài thiết kế encoding khả nghịch, vấn đề là \'mã hóa sao cho giải mã duy nhất\" chứ không phải tối ưu complexity. Level-order kèm trim null cũng được nhưng preorder + \'#\" code ngắn và tự nhiên với đệ quy hơn.',
    checklist: ['Làm sao phân biệt \'không có node\" với \'chưa đọc tới\" — thiếu gì thì decode mơ hồ?', 'Deserialize tiêu thụ token theo thứ tự nào?', 'Index đọc tới đâu được giữ ở đâu khi hàm build gọi lồng nhau?'],
    idea: ['Serialize: duyệt preorder, node null thì push \'#\', node thường thì push giá trị rồi duyệt trái, phải.', 'Join bằng dấu phẩy thành chuỗi.', 'Deserialize: giữ index i chung, đọc token theo đúng thứ tự preorder — \'#\" thì i++ và trả null, số thì tạo node rồi dựng trái rồi phải.'],
    decisions: ['Bắt buộc có marker \'#\" cho null: không có nó thì decode mơ hồ (nhiều cây cùng một preorder).', 'Index i là biến chung (closure) chứ không phải tham số — vì các lời gọi build lồng nhau tiêu thụ token tuần tự, truyền index theo nhánh sẽ mất vị trí.', 'Join/split bằng dấu phẩy và Number() khi parse để giá trị nhiều chữ số không bị lẫn (nối \'12\" khác \'1\', \'2\').'],
    complexityWhy: { time: 'O(n): mỗi node được thăm đúng một lần ở cả hai chiều.', space: 'O(n): chuỗi token cộng stack đệ quy O(h).' },
    takeaway: 'Serialize cây → preorder + marker null; deserialize đọc lại đúng thứ tự đó với index dùng chung.',
    relatedSlugs: ['construct-tree-105', 'level-order-102'],
    filename: 'serialize-tree.ts',
    code: `function serialize(root: TreeNode | null): string {
  const out: string[] = [];
  const pre = (node: TreeNode | null): void => {
    if (node === null) { out.push('#'); return; }
    out.push(String(node.val));
    pre(node.left);
    pre(node.right);
  };
  pre(root);
  return out.join(',');
}

function deserialize(data: string): TreeNode | null {
  const tokens = data.split(',');
  let i = 0;
  const build = (): TreeNode | null => {
    if (tokens[i] === '#') { i++; return null; }
    const node = new TreeNode(Number(tokens[i++]));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [1,2,3,null,null,4,5]',
      trace: ['preorder: 1, 2, #, #, 3, 4, #, #, 5, #, #', 'decode: 1 → trái 2 (lá) → phải 3 → trái 4 → phải 5', 'Cây dựng lại giống hệt gốc'],
      output: '"1,2,#,#,3,4,#,#,5,#,#"',
    },
    pitfalls: ['Quên dấu # cho null → decode mơ hồ (nhiều cây cùng preorder)', 'Dùng index chung mà quên tăng khi gặp #'],
  },
  'subtree-572': {
    slug: 'subtree-572',
    blindNo: 572,
    time: 'O(m·n)',
    space: 'O(h)',
    rule: 'Mỗi node của cây lớn thử sameTree với cây con; sai thì đi tiếp 2 nhánh.',
    insight: 'subRoot khớp ở \'đâu đó\" trong root mà vị trí thì không biết — nên phải thử mọi node làm ứng viên gốc rồi dùng sameTree kiểm tra khớp. Đây là mẫu \'thử mọi vị trí + kiểm tra khớp\" quen thuộc của string matching (root là text, subRoot là pattern, sameTree là so khớp tại một vị trí). Hai nhánh dưới nối bằng OR vì chỉ cần một vị trí khớp là đủ — ngược hẳn với sameTree đòi mọi nhánh đều khớp.',
    bruteForce: 'Chính solution này đã là \'brute force\" theo nghĩa thử mọi vị trí — và trong trường hợp xấu nhất (cây lược + pattern gần khớp) không có cách nào tốt hơn O(m·n). Serialize hai cây rồi dùng KMP đạt O(m+n) nhưng code dài, phỏng vấn hiếm khi đòi.',
    checklist: ['Vị trí khớp nằm ở đâu — node nào cũng có thể là ứng viên?', 'Kiểm tra khớp tại một vị trí bằng gì?', 'Hai nhánh dưới nối bằng AND hay OR — cần mấy vị trí khớp?'],
    idea: ['subRoot null → true; root null (mà subRoot còn) → false.', 'sameTree(root, subRoot) đúng → true ngay.', 'Sai thì return đệ quy trái HOẶC phải.'],
    decisions: ['Check subRoot null trước tiên: cây rỗng là con của mọi cây theo quy ước, đồng thời làm base case cho đệ quy.', 'Nối hai nhánh bằng || — chỉ cần MỘT vị trí khớp (ngược với sameTree dùng && vì cần MỌI nhánh khớp).', 'Gọi sameTree ở node hiện tại trước khi đi xuống: thứ tự này cho phép dừng sớm ngay khi khớp ở gốc.'],
    complexityWhy: { time: 'O(m·n) xấu nhất: thử sameTree O(n) tại mỗi node trong m node của cây lớn.', space: 'O(h): stack đệ quy sâu bằng chiều cao cây.' },
    takeaway: '\'Có phải cây con ở đâu đó\" → mọi node đều thử sameTree, nối các ứng viên bằng OR.',
    relatedSlugs: ['same-tree-100', 'lowest-common-ancestor-235'],
    filename: 'subtree.ts',
    code: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (subRoot === null) return true;
  if (root === null) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  if (p === null || q === null || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    highlightLines: [4],
    dryRun: {
      input: 'root = [3,4,5,1,2], subRoot = [4,1,2]',
      trace: ['3 vs 4: khác gốc → đi trái', '4 vs 4: trái 1=1, phải 2=2 → sameTree true → return true'],
      output: 'true',
    },
    pitfalls: ['Chỉ check từ root lớn mà không duyệt xuống (bỏ sót vị trí khớp)', 'Nhầm && với || ở 2 nhánh đệ quy'],
  },
  'construct-tree-105': {
    slug: 'construct-tree-105',
    blindNo: 105,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Đầu preorder là root; vị trí root trong inorder cắt trái/phải — map index để O(1).',
    insight: 'Preorder cho biết ai là root (phần tử đầu), inorder cho biết ai nằm trái/phải root (vị trí tương đối). Hai thông tin này bổ sung nhau đúng một cách: lấy đầu preorder làm root, tìm nó trong inorder để cắt mảng thành hai đoạn, rồi đệ quy mỗi đoạn với thứ tự preorder tương ứng. Map value → index biến bước tìm kiếm thành O(1), cả thuật toán thành O(n).',
    bruteForce: 'Mỗi lần tìm root trong inorder bằng indexOf tuyến tính — O(n²). Vấn đề là cùng một tìm kiếm lặp lại ở mọi tầng đệ quy. Tối ưu: build map một lần, mọi lần tra sau đó là O(1).',
    checklist: ['Mỗi traversal cho mình thông tin gì (preorder: ai trước, inorder: ai trái/phải)?', 'Làm sao cắt bài toán thành hai nửa độc lập (vị trí root trong inorder)?', 'Thứ tự đệ quy có quan trọng không (trái trước vì preorder liệt kê trái trước)?'],
    idea: ['Bước 1: build map value → index trong inorder.', 'Bước 2: con trỏ pi = 0, hàm build(l, r) xử lý đoạn inorder [l, r].', 'Bước 3: đoạn rỗng (l > r) trả null.', 'Bước 4: lấy preorder[pi++] làm root, tra map được k.', 'Bước 5: đệ quy trái [l, k − 1] rồi phải [k + 1, r], gắn vào root và trả về.'],
    decisions: ['Dùng con trỏ pi toàn cục tăng dần thay vì cắt mảng preorder — cắt mảng tốn O(n) mỗi lần và dễ lệch.', 'Đệ quy trái trước phải sau — preorder liệt kê cả cây trái trước cây phải, đảo thứ tự là gắn nhầm.', 'Giả thiết giá trị phân biệt là cốt lõi — trùng nhau thì map index mơ hồ, bài toán không xác định.'],
    complexityWhy: { time: 'O(n): mỗi node tạo đúng một lần, mỗi lần tra map O(1).', space: 'O(n): map index cộng stack đệ quy sâu nhất n.' },
    takeaway: 'Khi dựng cây từ hai traversal: đầu preorder là root, vị trí trong inorder cắt trái/phải.',
    relatedSlugs: ['serialize-tree-297', 'invert-tree-226'],
    filename: 'construct-tree.ts',
    code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));
  let pi = 0;
  const build = (l: number, r: number): TreeNode | null => {
    if (l > r) return null;
    const root = new TreeNode(preorder[pi++]);
    const k = pos.get(root.val)!;
    root.left = build(l, k - 1);
    root.right = build(k + 1, r);
    return root;
  };
  return build(0, inorder.length - 1);
}`,
    highlightLines: [8],
    dryRun: {
      input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      trace: ['root = 3, k=1: trái [9], phải [15,20,7]', 'Trái: root = 9 (lá)', 'Phải: root = 20, k=3: trái [15], phải [7]'],
      output: '[3,9,20,null,null,15,7]',
    },
    pitfalls: ['Tìm index bằng indexOf mỗi lần → O(n²)', 'Đệ quy phải trước trái (sai thứ tự preorder)'],
  },
  'kth-smallest-230': {
    slug: 'kth-smallest-230',
    blindNo: 230,
    time: 'O(h + k)',
    space: 'O(h)',
    rule: 'Inorder BST ra dãy tăng → đếm tới K là đáp án, dừng sớm khỏi duyệt hết.',
    insight: 'BST có tính chất mọi node trái < node < mọi node phải, nên duyệt inorder cho ra dãy tăng dần mà không cần sort. Phần tử thứ K trong dãy đó chính là đáp án. Vì chỉ cần phần tử thứ K, ta đếm trong lúc duyệt và dừng sớm — không cần duyệt hết cây hay lưu cả mảng.',
    bruteForce: 'Brute force: inorder hết cây vào mảng rồi lấy [k-1] → O(n) time và O(n) space. Vấn đề là tốn mảng và duyệt cả nhánh phải dù đã đủ K. Tối ưu: đếm trực tiếp trong lúc duyệt, dừng khi count == k — space còn O(h).',
    checklist: ['Tính chất nào của BST cho ra thứ tự sẵn có? (trái < node < phải)', 'Mình cần cả dãy sắp xếp hay chỉ phần tử thứ K? (chỉ thứ K → dừng sớm)', 'Duyệt theo thứ tự nào thì gặp node theo đúng thứ tăng dần?'],
    idea: ['Bước 1: duyệt inorder: trái → node → phải.', 'Bước 2: mỗi node thăm được thì count++; nếu count == k thì ghi answer và dừng.', 'Bước 3: return answer (k luôn hợp lệ theo đề).'],
    decisions: ['Đếm trong lúc duyệt thay vì gom mảng → tiết kiệm O(n) space, còn O(h) stack đệ quy.', 'Cờ answer để cắt nhánh (return sớm khi đã tìm thấy) → không duyệt nốt nhánh phải vô ích.'],
    complexityWhy: { time: 'O(h + k): xuống tới lá (h) rồi thăm đúng k node nhỏ nhất theo inorder.', space: 'O(h): stack đệ quy sâu bằng chiều cao cây.' },
    takeaway: 'Cần thứ tự tăng dần trong BST → nghĩ inorder, và chỉ cần thứ K thì đếm tới K rồi dừng.',
    relatedSlugs: ['lowest-common-ancestor-235', 'binary-search-704'],
    filename: 'kth-smallest.ts',
    code: `function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let answer = -1;
  const inorder = (node: TreeNode | null): void => {
    if (node === null || answer !== -1) return;
    inorder(node.left);
    count++;
    if (count === k) { answer = node.val; return; }
    inorder(node.right);
  };
  inorder(root);
  return answer;
}`,
    highlightLines: [7],
    dryRun: {
      input: 'root = [3,1,4,null,2], k = 1',
      trace: ['Inorder: 1 → 2 → 3 → 4', 'count=1 tại node 1 = k → answer = 1, dừng'],
      output: '1',
    },
    pitfalls: ['Duyệt preorder/postorder (không có thứ tự tăng)', 'Không dừng sớm vẫn đúng nhưng phí'],
  },
  'find-min-rotated-153': {
    slug: 'find-min-rotated-153',
    blindNo: 153,
    time: 'O(log n)',
    space: 'O(1)',
    rule: 'Mảng xoay: so nums[mid] với nums[right] — mid lớn hơn right thì min nằm nửa phải.',
    insight: 'Mảng xoay vẫn gồm hai đoạn tăng dần ghép lại, điểm gãy chính là min. So nums[mid] với nums[right]: nếu mid lớn hơn right thì đoạn [mid..right] chứa điểm gãy, min nằm nửa phải; ngược lại nửa phải đã nguyên vẹn tăng dần nên min nằm nửa trái kể cả mid. Mỗi bước loại một nửa — Binary Search trên tính chất xoay chứ không phải trên giá trị target.',
    bruteForce: 'Quét tuyến tính O(n) vẫn đúng. Vấn đề là đề yêu cầu O(log n) và mảng có cấu trúc xoay để khai thác. Tối ưu: mỗi lần so sánh loại một nửa nhờ tính chất hai đoạn tăng.',
    checklist: ['Search space là gì (đoạn còn chứa min)?', 'Điều kiện nào loại được một nửa (so mid với right, không phải left)?', 'Biên cập nhật ra sao để không loại mất đáp án (r = mid, không phải mid − 1)?'],
    idea: ['Bước 1: l = 0, r = cuối.', 'Bước 2: m ở giữa; nếu nums[m] > nums[r] thì min ở phải, l = m + 1.', 'Bước 3: ngược lại min ở trái kể cả m, r = m.', 'Bước 4: lặp tới l == r, trả nums[l].'],
    decisions: ['So với nums[right] chứ không phải nums[left] — nửa phải cho kết luận chắc chắn, nửa trái thì không (ví dụ mảng chưa xoay).', 'Nhánh trái dùng r = m thay vì m − 1 — min có thể chính là mid, trừ 1 là mất đáp án.', 'Vòng while (l < r) thay vì ≤ — kết hợp với r = m thì ≤ sẽ treo khi l + 1 == r.'],
    complexityWhy: { time: 'O(log n): mỗi bước search space còn một nửa.', space: 'O(1): ba biến l, r, m.' },
    takeaway: 'Khi mảng xoay không trùng: so mid với right để biết nửa nào chứa điểm gãy.',
    relatedSlugs: ['search-rotated-33', 'binary-search-704'],
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
    insight: 'Mảng xoay với phần tử phân biệt có một tính chất cứu cả bài: mọi đoạn [l, r] luôn có ít nhất một nửa sorted. Nửa sorted cho phép kiểm tra \'target có nằm trong khoảng này không\" chỉ bằng so sánh biên O(1) — nếu có thì giữ nửa đó, không thì bỏ nó. Mỗi bước loại đúng một nửa nên vẫn O(log n) như binary search thường, chỉ khác câu hỏi loại trừ.',
    bruteForce: 'Linear scan O(n) — đúng nhưng phí giả thiết \'gần như sorted\'. Tìm điểm xoay trước (một binary search) rồi search thường (thêm một binary search) cũng O(log n) nhưng hai pass. Tối ưu: một vòng duy nhất, mỗi bước hỏi \'nửa nào sorted, target có trong đó không\'.',
    checklist: ['Search space hiện tại là đoạn nào — thu hẹp ra sao mỗi bước?', 'Điều kiện gì chứng tỏ nửa trái sorted (nums[l] ≤ nums[m])?', 'Biết target có/không trong nửa sorted rồi thì bỏ nửa nào?'],
    idea: ['Lấy m giữa [l, r]; nums[m] === target thì return m.', 'Nếu nums[l] ≤ nums[m] (trái sorted): target trong [nums[l], nums[m]) thì r = m−1, không thì l = m+1.', 'Ngược lại (phải sorted): target trong (nums[m], nums[r]] thì l = m+1, không thì r = m−1.', 'Hết vòng thì return −1.'],
    decisions: ['So nums[l] ≤ nums[m] bằng ≤ chứ không phải <: đoạn một phần tử (l == m) vẫn phải được coi là \'sorted\' để logic đúng ở biên.', 'Cặp biên [l, m) và (m, r] đối xứng nhau bằng < và ≤ — lệch một dấu là mất đáp án ở biên hoặc lặp vô hạn.', 'Check bằng nhau trước mọi phân nhánh để vừa return sớm vừa loại m khỏi đoạn tiếp theo.'],
    complexityWhy: { time: 'O(log n): mỗi vòng loại đúng một nửa search space.', space: 'O(1): chỉ ba index l, m, r.' },
    takeaway: 'Mảng xoay + số phân biệt → ít nhất một nửa luôn sorted; target trong nửa sorted thì giữ, không thì bỏ.',
    relatedSlugs: ['find-min-rotated-153', 'binary-search-704'],
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
    insight: 'Đề hỏi substring dài nhất “không lặp” — tính chất này có tính đơn điệu: nếu cửa sổ [l,r] đã có trùng thì mọi cửa sổ mở rộng thêm từ nó cũng trùng. Nghĩa là đầu trái l chỉ tiến chứ không bao giờ lùi, mỗi ký tự vào/ra đúng một lần. Gặp trùng không cần vứt cả cửa sổ, chỉ co trái tới khi hết trùng — đó là invariant của Sliding Window ở đây.',
    bruteForce: 'Brute force: liệt kê mọi substring O(n²) × check trùng O(n) → O(n³) (hoặc O(n²) với set). Vấn đề là mỗi substring check lại từ đầu. Tối ưu: cửa sổ trượt, l không bao giờ lùi — O(n).',
    checklist: ['Cửa sổ [l,r] đại diện cho gì? (substring không trùng dài nhất kết thúc tại r)', 'Gặp trùng thì mở rộng tiếp hay co trái? (co trái tới khi hết trùng)', 'Invariant nào đảm bảo mỗi ký tự chỉ xử lý 2 lần? (l chỉ tiến)'],
    idea: ['Bước 1: Set giữ ký tự trong cửa sổ [l,r]; l = 0, best = 0.', 'Bước 2: với mỗi r, trong khi s[r] đã có trong Set thì xóa s[l], l++.', 'Bước 3: add s[r], best = max(best, r − l + 1).'],
    decisions: ['Co trái dần bằng while thay vì reset cả cửa sổ → giữ được phần không trùng còn lại, tổng vẫn O(n).', 'Cập nhật best sau khi add (không phải trong while) → best đo cửa sổ hợp lệ, không đo lúc đang trùng.'],
    complexityWhy: { time: 'O(n): mỗi ký tự add một lần, delete một lần (l chỉ tiến).', space: 'O(min(n, charset)): Set chứa cửa sổ hiện tại.' },
    takeaway: 'Substring tối ưu với điều kiện “không trùng / đủ chữ” → nghĩ Sliding Window mà đầu trái chỉ tiến.',
    relatedSlugs: ['min-window-76', 'char-replacement-424'],
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
    insight: 'Muốn biến cả cửa sổ thành một chữ cái duy nhất, số lần đổi cần thiết bằng độ dài cửa sổ trừ đi số lần xuất hiện của chữ cái nhiều nhất trong đó — vì giữ lại chữ đang nhiều nhất luôn tốn ít lần đổi nhất. Vậy một cửa sổ hợp lệ khi và chỉ khi window − maxFreq ≤ k. Điều kiện này chỉ phụ thuộc độ dài và tần suất max, nên Sliding Window cổ điển áp dụng được: mở phải, vi phạm thì co trái.',
    bruteForce: 'Brute force thử mọi cửa sổ [l, r] và đếm tần suất — O(n² · alphabet). Vấn đề là mỗi cửa sổ đếm lại từ đầu. Tối ưu: trượt cửa sổ, tần suất cập nhật dần, mỗi đầu mút di chuyển đúng một lần.',
    checklist: ['Cửa sổ của mình đại diện cho gì, và điều kiện để nó hợp lệ là gì?', 'Khi mở rộng thì cái gì tăng, khi vi phạm thì co bên nào?', 'Invariant của cửa sổ là gì (ở đây: luôn hợp lệ sau khi co)?'],
    idea: ['Bước 1: mảng đếm 26 chữ, con trỏ trái l = 0, maxFreq = 0, best = 0.', 'Bước 2: mở phải r, tăng đếm chữ mới và cập nhật maxFreq.', 'Bước 3: nếu độ dài trừ maxFreq vượt k thì co trái tới khi hợp lệ lại.', 'Bước 4: cập nhật best bằng độ dài cửa sổ hiện tại.'],
    decisions: ['Không giảm maxFreq khi co trái — maxFreq cũ chỉ làm điều kiện chặt hơn mức cần, best không bao giờ sai vì ta chỉ cần cửa sổ dài kỷ lục.', 'Đếm bằng mảng 26 số thay vì Map — alphabet cố định nên O(1) thật sự và nhanh.', 'Co bằng while chứ không phải if — một bước mở phải có thể cần co nhiều bước.'],
    complexityWhy: { time: 'O(n): mỗi con trỏ l, r chỉ tiến, mỗi ký tự vào/ra cửa sổ đúng một lần.', space: 'O(1): mảng đếm 26 số, không phụ thuộc n.' },
    takeaway: 'Khi chi phí biến cửa sổ thành đồng nhất = dài − maxFreq: Sliding Window với điều kiện đó.',
    relatedSlugs: ['longest-substring-3', 'min-window-76'],
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
    insight: 'Cửa sổ “chứa đủ chữ của t” cũng có tính đơn điệu: một khi [l,r] đã đủ thì mở rộng r thêm vẫn đủ — nên với mỗi r ta chỉ cần l nhỏ nhất còn đủ. Mở phải tới khi đủ (have == need), rồi co trái để tối thiểu hóa, mỗi ký tự vào/ra một lần. Đếm have theo “số loại chữ đã đủ quota” (không phải tổng số ký tự) để check O(1).',
    bruteForce: 'Brute force: liệt kê mọi substring O(n²) × check chứa đủ O(n) → O(n³). Vấn đề là check lại từ đầu. Tối ưu: Sliding Window hai đầu chỉ tiến — O(m + n).',
    checklist: ['Cửa sổ đại diện cho gì, khi nào mở phải khi nào co trái? (mở tới khi đủ, co để tối thiểu)', '“Đủ” nên đếm theo gì để check O(1)? (số loại chữ đủ quota: have vs need.size)', 'Co trái thì cập nhật best lúc nào? (trước khi l trượt làm mất đủ)'],
    idea: ['Bước 1: need = tần suất chữ của t; win rỗng, have = 0.', 'Bước 2: mở r; khi win[c] chạm quota need[c] thì have++.', 'Bước 3: khi have == need.size thì cập nhật best rồi co l (tụt quota thì have--), lặp tới khi không đủ.'],
    decisions: ['have so với need.size (số loại phân biệt) thay vì t.length → chữ lặp (vd “AABC”) được xử lý đúng qua quota từng loại.', 'Ghi best trước khi co trái → best đo cửa sổ còn đủ, co xong mới là cửa sổ thiếu.'],
    complexityWhy: { time: 'O(m + n): mỗi ký tự s vào/ra cửa sổ một lần (l, r chỉ tiến).', space: 'O(charset): hai map tần suất.' },
    takeaway: 'Cửa sổ nhỏ nhất thỏa điều kiện đếm → nghĩ mở phải tới khi đủ, co trái để tối thiểu, track have/need.',
    relatedSlugs: ['longest-substring-3', 'char-replacement-424'],
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
    insight: 'Mỗi node chỉ biết next của nó, nên lật mũi tên curr.next = prev sẽ xóa mất đường tới phần còn lại — trừ khi đã lưu next trước đó. Đó là toàn bộ bài toán. Xem prev là \'đoạn đã đảo xong\" và curr là \'đoạn còn lại\': mỗi vòng chuyển đúng một node từ curr sang prev, tới khi curr null thì prev là head mới.',
    bruteForce: 'Đệ quy cũng O(n) time nhưng tốn O(n) stack space; copy value sang mảng rồi ghi ngược tốn O(n) space. Vấn đề là đề muốn O(1). Tối ưu: ba con trỏ lặp tại chỗ, mỗi node thăm đúng một lần.',
    checklist: ['Ghi đè curr.next thì thông tin nào mất vĩnh viễn — lưu nó ở đâu trước?', 'Sau vòng cuối, ai mới là head của list đã đảo?', 'Thứ tự ba dòng trong vòng lặp có đổi chỗ được không?'],
    idea: ['Khởi tạo prev = null, curr = head.', 'Mỗi vòng: lưu next = curr.next, lật curr.next = prev, bước prev = curr và curr = next.', 'Khi curr null thì return prev.'],
    decisions: ['Lưu next ĐẦU TIÊN trong vòng lặp — mọi thứ sau đó ghi đè pointer, không lưu trước là mất nửa sau list.', 'Return prev chứ không phải head hay curr: head giờ là đuôi (trỏ null), curr đã null, chỉ prev là head mới.', 'Thứ tự ba dòng là cố định: lưu → lật → bước; đảo lật lên trước lưu là bug kinh điển.'],
    complexityWhy: { time: 'O(n): mỗi node được thăm và lật đúng một lần.', space: 'O(1): ba con trỏ, không phụ thuộc độ dài list.' },
    takeaway: 'Đảo linked list tại chỗ → mẫu prev/curr/next \'lưu → lật → bước\', return prev.',
    relatedSlugs: ['reorder-list-143', 'merge-two-lists-21'],
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
    insight: 'List không vòng thì đi mãi cũng tới null; list có vòng thì đi mãi không bao giờ tới null — nhưng duyệt thường không phân biệt được “đang đi vòng” hay “list rất dài”. Hai pointer tốc độ khác nhau giải quyết đúng điểm này: trong vòng kín, thỏ (2 bước) mỗi vòng rút ngắn khoảng cách với rùa (1 bước) đúng 1 nên chắc chắn gặp nhau. Gặp nhau = có vòng; thỏ tới null = không vòng.',
    bruteForce: 'Brute force: Hash Set nhớ mọi node đã thăm, gặp lại là có vòng → O(n) time, O(n) space. Vấn đề là tốn bộ nhớ cho thông tin “đã thăm”. Tối ưu: slow/fast chỉ dùng 2 pointer — O(1) space vì khoảng cách tương đối tự mã hóa vòng lặp.',
    checklist: ['Làm sao phân biệt “list dài” với “đi vòng mãi”? (hai tốc độ khác nhau)', 'Điều kiện dừng của thỏ là gì? (fast hoặc fast.next null → không vòng)'],
    idea: ['Bước 1: slow = fast = head.', 'Bước 2: lặp khi fast và fast.next còn sống: slow đi 1, fast đi 2.', 'Bước 3: slow == fast → true; thoát lặp (thỏ null) → false.'],
    decisions: ['Điều kiện lặp check cả fast và fast.next → vì fast nhảy 2 bước, chỉ check fast sẽ crash khi fast.next là null.', 'So sánh slow == fast sau khi bước (không phải trước) → lúc đầu cả hai cùng head nên check trước luôn true oan.'],
    complexityWhy: { time: 'O(n): không vòng đi hết list; có vòng thì thỏ đuổi kịp rùa trong tối đa ~n bước.', space: 'O(1): chỉ hai pointer.' },
    takeaway: 'Hỏi “có vòng không” mà muốn O(1) bộ nhớ → nghĩ rùa-thỏ, khoảng cách co dần trong vòng kín.',
    relatedSlugs: ['reverse-linked-list-206', 'remove-nth-19'],
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
    insight: 'Cả hai list đã sort nên phần tử nhỏ nhất còn lại toàn cục luôn là một trong hai head. Nối head nhỏ hơn vào kết quả rồi tiến head đó — bất biến “kết quả luôn sort + hai phần còn lại vẫn sort” được giữ mỗi bước. Khi một list hết, phần còn lại đã sort sẵn nên nối thẳng, khỏi so tiếp.',
    checklist: ['Phần tử tiếp theo của kết quả nằm ở đâu? (một trong hai head — vì cả hai đã sort)', 'Làm sao tránh code riêng cho node đầu? (dummy head)', 'Một list hết trước thì làm gì? (nối nốt phần còn lại)'],
    idea: ['Bước 1: dummy = node giả, cur = dummy.', 'Bước 2: khi cả hai còn sống: head nào nhỏ hơn (<=) thì cur.next = head đó, tiến head đó và cur.', 'Bước 3: nối nốt phần còn lại (l1 ?? l2); return dummy.next.'],
    decisions: ['Dùng dummy head → cur.next luôn hợp lệ, return dummy.next là head thật (kể cả khi một list rỗng).', 'So sánh <= (lấy l1 khi bằng) → ổn định, không ảnh hưởng tính đúng vì giá trị bằng nhau.'],
    complexityWhy: { time: 'O(n + m): mỗi node thăm đúng một lần.', space: 'O(1): nối lại node cũ, chỉ thêm dummy.' },
    takeaway: 'Trộn 2 dãy đã sort → nghĩ 2 pointer so head, nhỏ hơn thì nối + dummy head gọn code.',
    relatedSlugs: ['merge-k-lists-23', 'reverse-linked-list-206'],
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
    insight: 'Mỗi list đã sort nên ứng viên nhỏ nhất toàn cục luôn nằm trong K head hiện tại — không cần nhìn sâu hơn. Min-heap giữ đúng K ứng viên này: pop ra nhỏ nhất, nối vào kết quả, push next của nó vào. Mỗi node vào/ra heap đúng một lần nên tổng là O(N log K) thay vì O(K·N) của cách trộn từng cặp.',
    bruteForce: 'Brute force: trộn từng list một vào kết quả (K−1 lần merge) → O(K·N). Hoặc gom hết rồi sort → O(N log N). Vấn đề là không khai thác “mỗi list đã sort”. Tối ưu: heap K head — O(N log K).',
    checklist: ['Vì mỗi list đã sort, ứng viên nhỏ nhất tiếp theo nằm ở đâu? (trong K head)', 'Cần min hay max? (min — nối từ nhỏ tới lớn)', 'Sau khi pop thì push gì tiếp? (next của node vừa pop)'],
    idea: ['Bước 1: push head của mọi list không rỗng vào min-heap.', 'Bước 2: pop min → nối vào kết quả (qua dummy/cur).', 'Bước 3: push next của node vừa pop (nếu có); lặp tới khi heap rỗng.'],
    decisions: ['Heap chỉ chứa tối đa K node (các head) → mỗi thao tác O(log K), tổng O(N log K).', 'Dùng dummy head → khỏi code riêng cho node đầu tiên của kết quả.'],
    complexityWhy: { time: 'O(N log K): N node, mỗi node một lần push + một lần pop O(log K).', space: 'O(K): heap chứa tối đa K head (lưu ý code mẫu dùng sort mảng thay heap thật — vẫn đúng nhưng push O(k log k)).' },
    takeaway: 'Trộn K dãy đã sort → nghĩ min-heap K head, pop nhỏ nhất rồi push next.',
    relatedSlugs: ['merge-two-lists-21', 'top-k-frequent-347'],
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
    insight: 'Xóa node thứ n từ cuối trong một pass nghĩa là phải xác định vị trí mà chưa được biết độ dài list. Khoảng cách cố định giữa hai pointer biến \'từ cuối\" thành \'đi cùng nhau\': fast đi trước n+1 bước thì khi fast chạm null, slow đứng ngay trước node cần xóa. Dummy node cắm trước head để xóa head cũng là một ca xóa \'giữa\" bình thường, khỏi if riêng.',
    bruteForce: 'Hai pass: đếm độ dài L rồi đi lại tới vị trí L−n để xóa → O(n) time nhưng vi phạm yêu cầu one-pass. Vấn đề là pass đầu chỉ để biết \'đích\" nằm ở đâu. Tối ưu: gap cố định giữa fast/slow mã hóa khoảng cách tới cuối ngay trong lúc đi.',
    checklist: ['Làm sao biết \'thứ n từ cuối\" ở đâu khi còn chưa đi tới cuối list?', 'Gap bao nhiêu để slow dừng TRƯỚC node cần xóa chứ không phải đúng node đó?', 'Ai sẽ trỏ vào head mới nếu node bị xóa chính là head?'],
    idea: ['Cắm dummy trước head, cả fast và slow xuất phát từ dummy.', 'Cho fast đi trước n+1 bước.', 'Cho cả hai cùng đi từng bước tới khi fast null — lúc này slow đứng ngay trước node cần xóa.', 'Nối slow.next = slow.next.next, return dummy.next.'],
    decisions: ['Dùng dummy vì không có nó thì xóa head phải code nhánh riêng — dummy biến mọi ca xóa thành xóa giữa.', 'Đi trước n+1 bước chứ không phải n: cần node PHÍA TRƯỚC để nối bỏ, dừng đúng node cần xóa thì không xóa được trong list đơn.', 'Return dummy.next thay vì head vì head có thể đã bị xóa.'],
    complexityWhy: { time: 'O(n): fast đi hết list một lần, slow đi theo — tổng một pass.', space: 'O(1): chỉ hai pointer và một dummy node.' },
    takeaway: '\'Thứ K từ cuối, một pass\" → fast đi trước K bước (K+1 nếu cần node phía trước để nối), luôn cắm dummy.',
    relatedSlugs: ['reverse-linked-list-206', 'linked-list-cycle-141'],
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
    insight: 'Thứ tự L0→Ln→L1→Ln−1 chính là đan xen nửa đầu (giữ nguyên thứ tự) với nửa sau (đảo ngược). Bài toán tách thành ba bài nhỏ đã biết cách giải: slow/fast tìm điểm giữa, đảo linked list cho nửa sau, rồi merge xen kẽ từng node một. Mỗi bước đều O(n) time và O(1) space nên ghép lại vẫn đạt yêu cầu in-place.',
    bruteForce: 'Copy value vào mảng rồi ghi lại theo thứ tự mới → O(n) space, lại còn vi phạm \'không đổi value node\'. Dùng stack chứa nửa sau cũng O(n) space. Vấn đề là đề bắt O(1). Tối ưu: thao tác pointer tại chỗ bằng ba bước chia–đảo–đan.',
    checklist: ['Nửa sau cần thứ tự gì trước khi đan (đảo ngược)?', 'Điểm cắt hai nửa nằm ở đâu và cắt bằng cách nào?', 'Khi đan xen, thứ tự lưu next phải ra sao để không mất node?'],
    idea: ['Dùng slow/fast tìm giữa: fast hết thì slow ở cuối nửa đầu.', 'Cắt slow.next = null, đảo nửa sau thành list riêng.', 'Đan xen: lần lượt lấy một node nửa đầu, một node nửa sau, nối tiếp tới khi hết nửa sau.'],
    decisions: ['Cắt slow.next = null TRƯỚC khi đảo — không cắt thì lúc đan first và second vẫn dính nhau thành vòng lặp vô hạn.', 'Lưu t1 = first.next và t2 = second.next trước khi nối lại — ghi đè next mà chưa lưu là mất nửa còn lại.', 'Vòng đan chạy theo second (nửa sau ngắn hơn hoặc bằng) nên list lẻ thừa một node ở nửa đầu vẫn đúng tự nhiên.'],
    complexityWhy: { time: 'O(n): tìm giữa + đảo + đan, mỗi bước duyệt tối đa n node một lần.', space: 'O(1): chỉ vài con trỏ, không mảng/stack phụ.' },
    takeaway: 'Reorder hoặc đan xen linked list tại chỗ → chia đôi bằng slow/fast, đảo nửa sau, merge xen kẽ.',
    relatedSlugs: ['reverse-linked-list-206', 'merge-two-lists-21'],
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
    space: 'O(n)',
    rule: 'Đối xứng → 2 đầu chụm vào; ký tự lạ bỏ qua ngay tại chỗ, không cần chuỗi mới.',
    insight: 'Đối xứng nghĩa là ký tự đầu phải khớp ký tự cuối, rồi bài toán thu về chuỗi con bên trong — two-pointers hội tụ là hiện thân trực tiếp của định nghĩa đó, mỗi bước \'gọt\" một cặp ngoài cùng. Ký tự lạ và chữ hoa là nhiễu: chuẩn hóa trước (lowercase + lọc alphanumeric) để vòng so sánh chỉ còn một nhiệm vụ duy nhất là khớp từng cặp.',
    bruteForce: 'Đảo cả chuỗi rồi so với bản gốc O(n) space — đúng nhưng tốn bản copy. Two-pointers bỏ qua ký tự lạ tại chỗ thì O(1) space nhưng code dài hơn. Code hiện tại chọn gọn dễ đọc: làm sạch một lần rồi chụm hai đầu vào.',
    checklist: ['Hai pointer đại diện cho gì — cặp đối xứng ngoài cùng còn lại?', 'Ký tự nào được bỏ qua và xử lý ở đâu (trước hay trong vòng lặp)?', 'Khi nào dừng và kết luận true — gặp nhau hay vượt nhau?'],
    idea: ['Lowercase toàn chuỗi, lọc chỉ giữ a–z, 0–9.', 'Đặt l = 0, r = cuối; chừng nào l < r mà s[l] !== s[r] thì false.', 'Khớp thì l++, r−−; hết vòng thì true.'],
    decisions: ['Chuẩn hóa (lowercase + regex lọc) TRƯỚC vòng while để vòng so sánh sạch — không lẫn lộn \'bỏ qua\" và \'so sánh\" trong một chỗ.', 'Điều kiện l < r: gặp nhau (lẻ) hay vượt nhau (chẵn) đều nghĩa là mọi cặp đã khớp — dừng đúng lúc, không so thừa giữa với chính nó.', 'Return false ngay cặp lệch đầu tiên: một cặp sai là cả chuỗi sai, khỏi quét tiếp.'],
    complexityWhy: { time: 'O(n): làm sạch một pass cộng quét chụm một pass.', space: 'O(n): chuỗi làm sạch tạo một bản copy (muốn O(1) thật phải skip ký tự lạ tại chỗ bằng 2 pointers).' },
    takeaway: 'Kiểm tra đối xứng → hai đầu chụm vào, chuẩn hóa nhiễu trước khi so.',
    relatedSlugs: ['container-most-water-11', 'longest-palindrome-5'],
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
    insight: 'Diện tích do hai thứ quyết định: khoảng cách và cột thấp hơn. Với cặp biên hiện tại, cột thấp là bottleneck — mọi cặp giữ cột thấp mà thu hẹp khoảng cách đều cho diện tích nhỏ hơn hoặc bằng hiện tại, nên không cặp nào trong số đó là đáp án. Chỉ có dời cột thấp mới mở ra khả năng tốt hơn; cột cao phải giữ vì nó còn có thể ghép với cột khác. Mỗi bước loại đúng một biên vô vọng.',
    bruteForce: 'Brute force thử mọi cặp — O(n²). Vấn đề là đa số cặp bị chặn bởi cùng một cột thấp mà ta tính đi tính lại. Tối ưu: hai biên chụm vào, mỗi bước loại một cột không thể là đáp án.',
    checklist: ['Hai pointer đại diện cho gì (hai biên của bình)?', 'Cái gì là bottleneck của đáp án hiện tại (cột thấp hơn)?', 'Vì sao dời bottleneck không bỏ mất đáp án (mọi cặp giữ nó mà hẹp hơn đều tệ hơn)?'],
    idea: ['Bước 1: l = 0, r = cuối, best = 0.', 'Bước 2: tính diện tích min(h[l], h[r]) × (r − l), cập nhật best.', 'Bước 3: cột nào thấp hơn thì dời vào trong, bằng nhau dời bên nào cũng được.', 'Bước 4: lặp tới khi gặp nhau, trả best.'],
    decisions: ['Luôn dời cột thấp, giữ cột cao — dời cột cao là loại đúng biên còn tiềm năng.', 'Tính diện tích trước khi dời — cặp hiện tại là cặp rộng nhất còn chứa biên sắp loại, phải xét nó.', 'Không cần xử lý bằng nhau riêng — hai cột bằng thì bên nào cũng là bottleneck, dời bên nào cũng đúng.'],
    complexityWhy: { time: 'O(n): mỗi bước một biên tiến, tổng cộng n − 1 bước.', space: 'O(1): ba biến l, r, best.' },
    takeaway: 'Khi đáp án bị chặn bởi phía yếu hơn: giữ phía mạnh, dời phía yếu, mỗi bước loại một ứng viên.',
    relatedSlugs: ['valid-palindrome-125', 'three-sum-15'],
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
    insight: 'a+b+c = 0 tương đương cố định a rồi tìm cặp (b, c) có tổng −a — bài toán con chính là Two Sum. Sort trước phục vụ hai việc cùng lúc: hai số còn lại dùng two-pointers hội tụ được trong O(n) (mảng sorted thì tổng nhỏ chụm trái vào, tổng lớn chụm phải lại), và các số trùng dồn thành cụm để skip khử bộ ba lặp dễ dàng. Cố định một số để hạ bậc bài toán chính là ý tưởng trung tâm.',
    bruteForce: 'Ba vòng lặp O(n³) kèm Set khử trùng — chậm và tốn. Dùng hash Two Sum cho mỗi i thì O(n²) time nhưng khử bộ ba trùng vẫn rối. Tối ưu: sort một lần rồi mỗi i chỉ cần two-pointers O(n), skip trùng gọn trên mảng đã sort.',
    checklist: ['Cố định cái gì để đưa bài ba số về bài toán hai số quen thuộc?', 'Hai pointer còn lại đại diện cho gì, khi nào chụm trái/phải?', 'Trùng lặp bị loại ở mấy chỗ — thiếu chỗ nào thì lọt đáp án lặp?'],
    idea: ['Sort tăng dần.', 'Vòng ngoài cố định i; nums[i] trùng nums[i−1] thì skip.', 'Đặt l = i+1, r = cuối: tổng ba số = 0 thì lưu rồi skip trùng cả hai đầu mới chụm vào; tổng < 0 thì l++, tổng > 0 thì r−−.'],
    decisions: ['Skip trùng ở vòng ngoài (nums[i]) VÀ cả hai đầu l, r khi đã lưu — thiếu bất kỳ chỗ nào cũng sinh bộ ba lặp.', 'Khi sum = 0 thì skip trùng xong mới l++/r−−: chụm ngay mà chưa skip là bỏ sót việc loại trùng, skip mà không chụm là lặp vô hạn.', 'Sort tại chỗ để phần phụ còn O(1) — đề không tính mảng output vào space.'],
    complexityWhy: { time: 'O(n²): sort O(n log n) cộng n lần two-pointers O(n) — phần n² lấn át.', space: 'O(1) phụ: two-pointers tại chỗ trên mảng đã sort (không tính output).' },
    takeaway: 'Tìm bộ k số tổng cố định → sort + cố định k−2 số + two-pointers cho hai số còn lại, skip trùng ở mọi vị trí.',
    relatedSlugs: ['two-sum-1', 'container-most-water-11'],
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
    insight: 'Hai từ là anagram khi chúng có đúng cùng đa tập ký tự — thứ tự khác nhau nhưng thành phần giống nhau. Sắp xếp các chữ cái của một từ cho ra dạng chuẩn tắc: mọi anagram của nhau cùng cho một key, hai từ không phải anagram cho key khác nhau. Gom theo key là xong; key chính là dấu vân tay của nhóm.',
    bruteForce: 'So từng cặp chuỗi xem có phải anagram không — O(n² · k). Vấn đề là so sánh lại từ đầu cho mỗi cặp. Tối ưu: tính key một lần cho mỗi từ rồi gom bằng map, mỗi từ xử lý một lần.',
    checklist: ['Dấu hiệu nào gom các phần tử thành một nhóm (cùng đa tập ký tự)?', 'Dạng chuẩn tắc nào biến dấu hiệu đó thành key so được (sort chữ cái)?', 'Key tính một lần cho mỗi phần tử rồi tra map O(1)?'],
    idea: ['Bước 1: tạo map key → danh sách từ.', 'Bước 2: với mỗi từ, sort các chữ cái thành key.', 'Bước 3: key chưa có thì tạo nhóm mới, push từ vào nhóm của nó.', 'Bước 4: trả về các values của map.'],
    decisions: ['Key bằng chuỗi đã sort thay vì so trực tiếp — biến quan hệ tương đương thành lookup map.', 'Không sắp xếp thứ tự nhóm hay thứ tự từ trong nhóm — đề cho phép any order, sort thêm là phí.', 'Muốn O(n·k) thì key bằng tuple đếm 26 chữ — sort key tốn k log k nhưng code ngắn, tradeoff rõ ràng.'],
    complexityWhy: { time: 'O(n · k log k): mỗi từ sort k chữ cái.', space: 'O(n · k): map lưu toàn bộ từ cộng key.' },
    takeaway: 'Khi cần gom các thứ tương đương nhau: đưa về dạng chuẩn tắc làm key, gom bằng map.',
    relatedSlugs: ['valid-anagram-242', 'top-k-frequent-347'],
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
    insight: 'Bài toán khó ở chỗ nội dung chuỗi chứa ký tự bất kỳ — bất kỳ dấu phân cách nào ta chọn (phẩy, xuống dòng) đều có thể xuất hiện trong dữ liệu và gây mơ hồ. Lối ra là đừng phân cách bằng nội dung, hãy phân cách bằng độ dài: ghi len#str. Số len cho biết chính xác phải cắt bao nhiêu ký tự tiếp theo, nên nội dung bên trong là gì cũng mặc kệ.',
    bruteForce: 'Nối bằng separator rồi split — sai chứ không chỉ chậm: chuỗi chứa separator là vỡ. Vấn đề là separator không tự mô tả được ranh giới. Tối ưu: tiền tố độ dài tự mô tả, decode không cần đoán.',
    checklist: ['Nội dung có thể chứa ký tự gì (mọi ký tự — nên separator thuần túy là mơ hồ)?', 'Thông tin nào giúp cắt đúng mà không cần đoán (độ dài ghi trước)?', 'Edge case nào dễ quên (chuỗi rỗng vẫn phải round-trip được)?'],
    idea: ['Bước 1: encode — mỗi chuỗi thành len + # + nội dung, nối hết lại.', 'Bước 2: decode — đọc số tới dấu #, đó là len.', 'Bước 3: cắt đúng len ký tự sau # làm một phần tử.', 'Bước 4: nhảy pointer qua đoạn vừa cắt, lặp tới hết.'],
    decisions: ['Dùng len# thay vì separator — nội dung chứa # hay số cũng vô hại vì len quyết định điểm cắt.', 'Đọc len bằng cách quét tới # thay vì split — split vỡ ngay khi nội dung chứa ký tự đặc biệt.', 'Chuỗi rỗng encode thành 0# — decode cắt 0 ký tự và vẫn tiến pointer, không treo.'],
    complexityWhy: { time: 'O(n): mỗi ký tự của input được đọc/ghi hằng số lần (n là tổng độ dài).', space: 'O(n): chuỗi nối và mảng kết quả.' },
    takeaway: 'Khi dữ liệu chứa ký tự bất kỳ: đừng phân cách bằng nội dung, hãy tiền tố độ dài.',
    relatedSlugs: ['serialize-tree-297', 'group-anagrams-49'],
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
    insight: 'answer[i] gồm hai phần độc lập: tích mọi số bên trái i nhân với tích mọi số bên phải i. Phép chia bị cấm — và chia cũng gãy ngay khi có số 0 — nên hai phía này phải được tiền tính. Pass trái→phải ghi tích prefix vào output, pass phải→trái nhân nốt tích suffix: chính mảng output đóng vai trò bộ nhớ trung gian nên không cần mảng phụ.',
    bruteForce: 'Với mỗi i, nhân lại n−1 số còn lại → O(n²) time. Vấn đề là các đoạn tích lặp đi lặp lại bị tính lại từ đầu cho mỗi i. Tối ưu: tiền tính prefix một pass và suffix một pass, mỗi query thành O(1).',
    checklist: ['answer[i] được tạo thành từ những phần nào (trái và phải)?', 'Vì sao phép chia không dùng được ở đây — chỉ vì đề cấm hay còn lý do khác (số 0)?', 'Tiền tính xong ghi vào đâu để khỏi tốn mảng phụ?'],
    idea: ['Đặt answer[0] = 1, rồi pass trái→phải: answer[i] = answer[i−1] × nums[i−1] (tích mọi số bên trái).', 'Đặt suffix = 1, rồi pass phải→trái: answer[i] ×= suffix, sau đó suffix ×= nums[i].', 'Return answer — lúc này mỗi ô đã là trái × phải.'],
    decisions: ['answer[0] = 1 làm base để công thức truy hồi đúng ngay từ i = 1 (không cần if riêng cho biên).', 'Nhân suffix vào answer trước rồi mới cập nhật suffix bằng nums[i] — suffix tại bước i phải là tích Strictly bên phải i.', 'Không tạo mảng prefix/suffix riêng vì đề không tính output vào space — đó là cách đạt O(1) phụ.'],
    complexityWhy: { time: 'O(n): đúng hai pass tuyến tính, mỗi phần tử xử lý O(1).', space: 'O(1) phụ: chỉ biến suffix ngoài mảng output (output không tính vào space theo quy ước đề).' },
    takeaway: 'Cần \'mọi thứ trừ chính nó\" mà bị cấm chia → prefix một pass + suffix một pass, tái dùng output làm bộ nhớ.',
    relatedSlugs: ['max-product-152', 'best-time-stock-121'],
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
    insight: 'Anagram nghĩa là cùng một multiset ký tự — tức bảng tần suất của hai chuỗi phải bằng nhau từng ô. Bảng chữ cái cố định 26 chữ thường nên mảng 26 số thay được Hash Map: cộng cho s, trừ cho t; ô nào âm nghĩa là t thừa đúng chữ đó → false ngay tại chỗ, khỏi cần so hai bảng sau cùng.',
    bruteForce: 'Sort hai chuỗi rồi so từng ký tự O(n log n) — đúng nhưng chậm hơn đếm O(n). Tối ưu: counting array một pass cộng, một pass trừ kèm early exit.',
    checklist: ['Anagram tương đương với điều kiện gì trên tần suất ký tự?', 'Bảng chữ có hữu hạn không — khi nào mảng cố định thay được map?', 'Khi nào kết luận sai sớm mà khỏi đếm tiếp (dài khác nhau, ô âm)?'],
    idea: ['Dài khác nhau → false ngay.', 'Mảng đếm 26 ô: +1 cho mỗi chữ của s.', 'Duyệt t: −1 từng ô, ô nào âm → false ngay; hết vòng thì true.'],
    decisions: ['Check độ dài trước mọi thứ: dài khác nhau thì không thể anagram, đếm tiếp chỉ tốn công.', 'Mảng 26 + charCode − 97 thay vì map chữ chung: nhanh hơn và đúng bản chất \'alphabet cố định\" của đề.', 'Trừ và check âm TRONG CÙNG vòng duyệt t — gộp early exit vào một pass thay vì đếm xong mới so hai bảng.'],
    complexityWhy: { time: 'O(n): hai pass tuyến tính, mỗi ký tự O(1).', space: 'O(1): mảng 26 số, hằng số không phụ thuộc độ dài chuỗi.' },
    takeaway: 'So hoán vị trên alphabet cố định → mảng đếm: cộng một bên, trừ một bên, âm là sai.',
    relatedSlugs: ['group-anagrams-49', 'contains-duplicate-217'],
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
    insight: 'Câu hỏi của bài là tồn tại: có số nào xuất hiện ít nhất hai lần không. Với mỗi phần tử, ta chỉ cần biết nó đã xuất hiện trước đó chưa — không cần biết ở đâu, xuất hiện mấy lần, hay thứ tự ra sao. Tra cứu tồn tại thuần túy chính là sở trường của Hash Set: add khi gặp lần đầu, true ngay khi gặp lại.',
    bruteForce: 'Brute force so mọi cặp — O(n²). Vấn đề là mỗi cặp so sánh độc lập, không tái dùng thông tin đã thấy. Tối ưu: một lần quét với set, câu hỏi tồn tại trả lời trong O(1).',
    checklist: ['Với phần tử hiện tại, mình cần biết thông tin gì (đã thấy chưa)?', 'Có cần giữ index hay thứ tự không (không — nên Set đủ, khỏi Map)?', 'Khi nào dừng sớm được (ngay lần trùng đầu)?'],
    idea: ['Bước 1: tạo set rỗng.', 'Bước 2: với mỗi số, nếu đã có trong set thì return true ngay.', 'Bước 3: chưa có thì add vào, đi tiếp.', 'Bước 4: hết mảng thì return false.'],
    decisions: ['Dùng Set thay vì Map — đề không hỏi index nên lưu thêm là thừa.', 'Return true sớm thay vì đếm hết — bài hỏi tồn tại, gặp một là đủ.', 'Không sort trước — sort tốn O(n log n) và sửa mảng gốc, set đạt O(n) mà không đụng input.'],
    complexityWhy: { time: 'O(n): một lần duyệt, mỗi lookup/add set trung bình O(1).', space: 'O(n): xấu nhất lưu hết n số phân biệt.' },
    takeaway: 'Khi chỉ cần biết đã thấy hay chưa, không cần vị trí: Hash Set một pass.',
    relatedSlugs: ['two-sum-1', 'group-anagrams-49'],
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
    insight: 'Với mỗi nums[i], câu hỏi thực chất là: có số x nào đã thấy sao cho nums[i] + x = target không — tức x = target − nums[i] (gọi là phần bù, need). Ta không cần biết phần bù ở đâu trong mảng, chỉ cần biết nó đã xuất hiện chưa. "Đã xuất hiện chưa" chính là lookup — và Hash Map cho lookup trung bình O(1). Đó là lý do Hash Map xuất hiện ở đây, chứ không phải vì "bài array thì dùng map".',
    bruteForce: 'Brute force thử mọi cặp (i, j): O(n²) time, O(1) space. Vấn đề là với mỗi phần tử, ta quét lại toàn bộ phần còn lại chỉ để trả lời một câu hỏi tồn tại. Tối ưu: trả lời câu hỏi đó bằng map trong 1 pass — O(n) time đổi lấy O(n) space.',
    checklist: [
      'Với phần tử hiện tại, mình còn "thiếu" thông tin gì? (phần bù target − x)',
      'Thông tin đó có tra cứu nhanh được không? (cần biết tồn tại → Hash Map)',
      'Đề hỏi giá trị hay index? (index → lưu value → index)',
      'Một phần tử có được dùng 2 lần không? (không → check trước, lưu sau)',
    ],
    idea: [
      'Bắt đầu với map rỗng seen = {}.',
      'Với mỗi nums[i], tính need = target − nums[i] (phần bù còn thiếu).',
      'Nếu need đã có trong seen → trả về [seen[need], i] ngay.',
      'Chưa có → lưu seen[nums[i]] = i rồi đi tiếp.',
    ],
    decisions: [
      'Check trước, lưu sau — một phần tử không tự ghép với chính nó (vd nums = [3,3], target = 6 vẫn đúng).',
      'Lưu value → index (không phải ngược lại) vì đề yêu cầu trả về index.',
      'Return ngay khi thấy vì đề đảm bảo đúng 1 đáp án.',
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
      trace: ['i = 0: nums[0] = 2, need = 7. seen = {} → chưa có 7 → lưu 2 → 0', 'i = 1: nums[1] = 7, need = 2. seen có 2 → 0 → return [0, 1]'],
      output: '[0, 1]',
    },
    complexityWhy: {
      time: 'một vòng duyệt, mỗi lookup/add map trung bình O(1).',
      space: 'map chứa tối đa n phần tử (trường hợp xấu nhất duyệt hết mới thấy).',
    },
    pitfalls: ['Quên check trước, lưu sau → phần tử tự ghép với chính nó (vd target = 2·x)', 'Trả về giá trị thay vì index (đề hỏi index)', 'Sort + two-pointers làm mất index gốc'],
    takeaway: 'cần tìm cặp có tổng/hiệu cố định + phải giữ index → nghĩ Hash Map trước tiên.',
    relatedSlugs: ['contains-duplicate-217', 'three-sum-15'],
  },
  'valid-parentheses-20': {
    slug: 'valid-parentheses-20',
    blindNo: 20,
    time: 'O(n)',
    space: 'O(n)',
    rule: 'Bài “mở / đóng”, “gần nhất”, “lồng nhau” → Stack (LIFO) là đáp án 90% case.',
    insight: 'Ngoặc đóng phải khớp với ngoặc mở GẦN NHẤT chưa được đóng — \'gần nhất chưa xử lý\" chính là LIFO, tức Stack. Counter chỉ đếm số lượng nên gãy với \'([)]\" (đủ số nhưng sai thứ tự lồng); stack giữ cả LOẠI ngoặc của từng cái đang mở nên bắt được cả sai loại lẫn sai thứ tự. Mở thì push, đóng thì pop đối chiếu — hết chuỗi mà stack rỗng là đúng.',
    bruteForce: 'Thay thế cặp \'()\', \'[]\', \'{}\" lặp tới khi không thay được nữa → O(n²) xấu nhất với chuỗi lồng sâu. Tối ưu: một pass với stack, mỗi ký tự xử lý đúng một lần.',
    checklist: ['Ngoặc đóng phải khớp với cái gì — đỉnh stack nói lên điều gì?', 'Gặp ngoặc đóng mà stack rỗng nghĩa là gì?', 'Cuối chuỗi stack phải ra sao — thừa ngoặc mở có sai không?'],
    idea: ['Map ngoặc đóng → ngoặc mở tương ứng.', 'Gặp mở thì push; gặp đóng thì pop ra so — lệch thì false ngay.', 'Hết chuỗi: stack rỗng thì true.'],
    decisions: ['Map đóng→mở (thay vì mở→đóng) để so sánh một dòng pop() !== pair[c] — hướng map theo phía cần tra cứu.', 'st.pop() trên stack rỗng ra undefined cũng !== pair[c] → false: gộp luôn check \'đóng thừa\" vào một biểu thức, khỏi if rỗng riêng.', 'Check rỗng cuối cùng là bắt buộc: \'((({{[[[\" mở toàn đúng mà không đóng cái nào vẫn phải false.'],
    complexityWhy: { time: 'O(n): mỗi ký tự push hoặc pop đúng một lần.', space: 'O(n): xấu nhất toàn ngoặc mở, stack chứa cả n ký tự.' },
    takeaway: 'Mở/đóng lồng nhau, \'gần nhất\" → Stack; counter không bắt được thứ tự sai như \'([)]\'.',
    relatedSlugs: ['valid-palindrome-125', 'encode-decode-strings-271'],
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
    insight: 'Lợi nhuận của việc bán ở ngày i chỉ phụ thuộc một thứ: giá mua thấp nhất trong các ngày trước i. Ta không cần nhớ toàn bộ quá khứ, cũng không cần biết ngày mua cụ thể là ngày nào — chỉ cần giá trị thấp nhất từng thấy. Mỗi ngày mới đến, hoặc nó lập đáy mới, hoặc nó cho một ứng viên lợi nhuận. Quét một lần và giữ hai con số là đủ.',
    bruteForce: 'Brute force thử mọi cặp mua trước bán sau (i < j) — O(n²). Vấn đề là với mỗi ngày bán, ta quét lại toàn bộ quá khứ chỉ để tìm giá thấp nhất, trong khi giá thấp nhất có thể duy trì dần dần. Tối ưu: giữ min-so-far khi quét, mỗi ngày tính lời trong O(1).',
    checklist: ['Với mỗi vị trí, đáp án tốt nhất chỉ phụ thuộc vào thông tin gì của quá khứ?', 'Thông tin đó có cập nhật dần trong một lần quét được không?'],
    idea: ['Bước 1: khởi tạo min là giá đầu tiên, best là 0.', 'Bước 2: với mỗi giá p, tính lời nếu bán hôm nay là p − min và cập nhật best.', 'Bước 3: cập nhật min nếu p thấp hơn.', 'Bước 4: hết mảng trả về best (mặc định 0 nghĩa là không giao dịch).'],
    decisions: ['Tính best trước rồi mới cập nhật min — cùng một ngày không thể vừa mua vừa bán.', 'Khởi tạo best = 0 thay vì âm vô cùng — đề cho phép không giao dịch, lãi tối thiểu là 0.', 'Dùng for-of một pass thay vì hai vòng min/max riêng — vừa ngắn vừa đúng thứ tự thời gian.'],
    complexityWhy: { time: 'O(n): một lần duyệt, mỗi ngày hai phép max/min O(1).', space: 'O(1): chỉ hai biến min và best.' },
    takeaway: 'Khi đáp án tại mỗi vị trí chỉ phụ thuộc cực trị của quá khứ: quét một lần, giữ min/max-so-far.',
    relatedSlugs: ['max-subarray-53', 'max-product-152'],
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
    insight: 'Mảng đã sắp xếp có một tính chất đặc biệt: so sánh với phần tử giữa cho phép kết luận về cả một nửa mảng. Nếu giữa đã lớn hơn hoặc bằng target thì đáp án (nếu có) nằm bên trái; ngược lại nằm bên phải. Mỗi bước loại bỏ một nửa search space — đó là toàn bộ bản chất của Binary Search. Template nửa khoảng [l, r) tồn tại để khỏi phải nhớ ba kiểu biên khác nhau và không bao giờ off-by-one.',
    bruteForce: 'Brute force quét tuyến tính O(n). Vấn đề là nó bỏ phí tính chất đã sắp xếp — mỗi lần so sánh chỉ loại được một phần tử. Tối ưu: mỗi lần so sánh loại một nửa, còn O(log n).',
    checklist: ['Input (hoặc không gian đáp án) có tính đơn điệu để loại một nửa sau mỗi lần hỏi không?', 'Search space của mình là gì, và predicate giữ nó thu hẹp là gì?', 'Biên l/r có nghĩa là gì, và vòng lặp dừng khi nào?'],
    idea: ['Bước 1: đặt search space [l, r) bao toàn bộ mảng.', 'Bước 2: lấy giữa m; nếu nums[m] >= target thì đáp án nằm nửa trái kể cả m, đặt r = m.', 'Bước 3: ngược lại đáp án nằm hẳn bên phải, đặt l = m + 1.', 'Bước 4: lặp tới khi l == r, rồi verify nums[l] có bằng target không.'],
    decisions: ['Dùng nửa khoảng [l, r) với điều kiện nums[m] >= target — hai nhánh cập nhật đối xứng, không có trường hợp m − 1 hay m + 1 lẫn lộn.', 'Verify sau vòng lặp thay vì return trong lặp — vòng lặp chỉ tìm lower-bound, bằng hay không phải kiểm tra riêng.', 'Tính m bằng (l + r) >> 1 — với template này l + r không bao giờ tràn khỏi ý nghĩa vì r ≤ n.'],
    complexityWhy: { time: 'O(log n): mỗi bước search space còn một nửa.', space: 'O(1): chỉ ba biến l, r, m.' },
    takeaway: 'Khi search space đơn điệu: template [l, r), đúng thì r = m, sai thì l = m + 1, verify cuối.',
    relatedSlugs: ['find-min-rotated-153', 'search-rotated-33'],
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
    insight: 'BST có thứ tự: mọi node trái < root < mọi node phải. Nếu p và q cùng nhỏ hơn root, LCA chắc chắn nằm bên trái (đi phải là vô ích); cùng lớn hơn thì nằm bên phải. Chỉ khi chúng rẽ hai nhánh (hoặc một đứa chính là root) thì root là tổ tiên chung sâu nhất — vì đi sâu hơn sẽ bỏ rơi một đứa. Thứ tự BST cho phép loại bỏ nửa cây mỗi bước, khỏi cần duyệt cả cây.',
    checklist: ['Thứ tự BST cho phép loại bỏ nửa nào? (cùng nhỏ → bỏ phải, cùng lớn → bỏ trái)', 'Khi nào thì dừng và trả về node hiện tại? (rẽ nhánh hoặc trùng)'],
    idea: ['Bước 1: từ root, nếu p.val và q.val đều < cur.val thì sang trái.', 'Bước 2: nếu đều > cur.val thì sang phải.', 'Bước 3: còn lại (rẽ nhánh hoặc trùng cur) → return cur.'],
    decisions: ['Dùng vòng lặp thay vì đệ quy → đi một đường duy nhất, space O(1), khỏi stack.', 'Điều kiện else bao cả case trùng → p hoặc q chính là ancestor thì trả về chính nó, đúng định nghĩa LCA.'],
    complexityWhy: { time: 'O(h): mỗi bước xuống một tầng (cây lệch worst-case O(n)).', space: 'O(1): chỉ con trỏ cur.' },
    takeaway: 'LCA trong BST (khác cây thường) → nghĩ đi theo giá trị, rẽ nhánh là đáp án.',
    relatedSlugs: ['kth-smallest-230', 'binary-search-704'],
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
    insight: 'Muốn tới bậc n, bước cuối cùng chỉ có hai khả năng: từ n − 1 nhảy 1, hoặc từ n − 2 nhảy 2. Mọi cách lên n đều rơi vào đúng một trong hai nhóm này, không giao nhau và không sót. Vậy số cách lên n bằng tổng số cách lên n − 1 và n − 2 — công thức Fibonacci hiện ra từ cấu trúc bài toán chứ không phải đoán. Mỗi dp[i] chỉ cần hai giá trị trước đó nên hai biến lăn là đủ.',
    bruteForce: 'Đệ quy thử mọi dãy bước 1/2 — cây quyết định nhị phân nên O(2^n). Vấn đề là các nhánh tính lại cùng một dp[i] vô số lần. Tối ưu: tính dp tăng dần, mỗi giá trị tính đúng một lần.',
    checklist: ['State của mình là gì (ở đây: số cách lên bậc i)?', 'Bước cuối cùng có mấy khả năng, mỗi khả năng dẫn về state nhỏ hơn nào?', 'Base case là gì, và có cần giữ toàn bộ bảng không?'],
    idea: ['Bước 1: base n ≤ 2 thì trả về n luôn.', 'Bước 2: đặt a = dp[1] = 1, b = dp[2] = 2.', 'Bước 3: với i từ 3 tới n, tính tiếp c = a + b rồi lăn (a, b) = (b, c).', 'Bước 4: trả về b.'],
    decisions: ['Xử lý n ≤ 2 riêng — vòng lặp bắt đầu từ 3 nên hai base này phải chặn trước.', 'Rolling hai biến thay vì mảng dp — công thức chỉ nhìn hai giá trị trước, giữ mảng là phí O(n) bộ nhớ.', 'Lặp xuôi từ 3 lên n — đảm bảo a, b đã xong trước khi dùng, không cần memo hay đệ quy.'],
    complexityWhy: { time: 'O(n): một vòng từ 3 tới n, mỗi bước O(1).', space: 'O(1): chỉ hai biến a, b.' },
    takeaway: 'Khi state i chỉ phụ thuộc vài state ngay trước: lặp xuôi + rolling, khỏi mảng DP.',
    relatedSlugs: ['house-robber-198', 'decode-ways-91'],
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
