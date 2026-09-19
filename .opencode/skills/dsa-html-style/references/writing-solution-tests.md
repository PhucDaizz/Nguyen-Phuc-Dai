# Viết test cho solutions (tests_batch*.mjs)

File `src/data/tests_batchX.mjs` export `TESTS = { '<slug>': { tests: [...] } }`.
Mỗi test:

```js
{
  expect: <JSON>,            // giá trị kỳ vọng (JSON: number/string/bool/null/array/object)
  norm: 'sortDeep',          // optional: sắp xếp sâu trước khi so (kết quả không quan trọng thứ tự: 3sum, group, combo, pacific...)
  tol: 1e-9,                // optional: sai số cho số thực (median...)
  js: 'twoSum([2,7,11,15],9)',
  ts: '...',                 // optional, mặc định = js
  py: 'two_sum([2, 7, 11, 15], 9)',
  java: 'new Solution().twoSum(new int[]{2,7,11,15},9)',
  cpp: { stmts: ['vector<int> a = {2,7,11,15};'], ret: 'Solution().twoSum(a,9)' },
  cs: 'new Sol().TwoSum(new int[]{2,7,11,15},9)',
}
```

## Quy tắc từng ngôn ngữ (ĐỌC snippet trong solutions_batch*.ts trước khi viết!)

- **js/ts**: gọi trực tiếp `twoSum([...],9)`. Có sẵn: `L()` (array→linked list), `A()` (list→array),
  `T()` (array level-order→tree, `null` cho khuyết), `TA()` (tree→array), `G()`/`GA()` (graph).
  VD list: `A(mergeTwoLists(L([1,2,4]),L([1,3,4])))` → `[1,1,2,3,4,4]`.
  VD in-place: `((a)=>{rotate(a);return a;})([[1,2],[3,4]])`.
  VD class: `(()=>{const m=new MedianFinder();m.addNum(1);m.addNum(2);return m.findMedian();})()`.
- **graph** (clone-graph): js/ts/py `GA(cloneGraph(G([[2],[3],[1]])))` (G nhận adjacency 1-based, GA trả adjacency sorted);
  java `GA(new Solution().cloneGraph(G(new int[][]{{2},{3},{1}})))`; cpp `GAc(Solution().cloneGraph(G({{2},{3},{1}})))`;
  cs `H.GA(new Sol().CloneGraph(H.G(new int[][]{...})))`. expect = adjacency sorted, dùng `norm: 'sortDeep'`.
  Riêng cpp: `GAc` đã trả JSON text → thêm tiền tố `RAW:` (VD `cpp: 'RAW:GAc(...)'`) để harness khỏi bọc canon.
- **py**: như js (`two_sum`, `L/A/T/TA/G/GA` có sẵn, `None` thay `null`).
- **java**: snippet là `class Solution` (hoặc MedianFinder/Trie) — gọi `new Solution().twoSum(new int[]{...},9)`.
  Mảng 2D: `new int[][]{{1,2},{3,4}}`. String: `"abc"`. Có sẵn `L/A/T/TA/G/GA` (VD `A(MergeTwoLists...)`).
  Char 2D (word-search): `new char[][]{"abc".toCharArray(),...}` — nhưng snippet C#/Java nhận `char[][]`/`board`,
  nếu rắc rối thì dùng stmts: `{ stmts: ['char[][] b = {...};'], ret: '...' }`.
- **cpp**: snippet là `class Solution` — gọi `Solution().twoSum(a,9)`; tham số `vector&` KHÔNG nhận
  temporary → dùng `{ stmts: ['vector<int> a = {2,7,11,15};'], ret: 'Solution().twoSum(a,9)' }`.
  String: `string("abc")` hoặc `"abc"`. Có sẵn `L/A/T/TA/G/GA` (T nhận `vector<optional<int>>`, VD `T({1,2,null})` — viết `null`? KHÔNG, C++ dùng `std::nullopt`: `T({1,2,std::nullopt})`).
- **cs**: snippet KHÔNG có `class` → harness bọc trong `class Sol`, gọi `new Sol().TwoSum(...)`.
  Nếu snippet ĐÃ có class (MedianFinder/Trie...) → gọi trực tiếp `new MedianFinder()...`.
  Có sẵn `H.L/H.A/H.T/H.TA/H.G/H.GA` (VD `H.A(new Sol().MergeTwoLists(H.L(new int[]{1,2}),H.L(new int[]{3})))`).
  Mảng 2D: `new int[][]{new int[]{1,2}}`. Char 2D: `new char[][]{new char[]{'a','b'}}`.

## Chuẩn factual
- Mỗi bài 2-3 tests: ví dụ đề bài + 1 edge (rỗng/1 phần tử/không tìm thấy).
- `expect` viết theo OUTPUT THẬT của thuật toán đúng (đối chiếu LeetCode), không bịa.
- Bài void/in-place (rotate, setZeroes): expect = mảng SAU khi chạy.
- Chạy `node scripts/run-solution-tests.mjs --batch X` cho xanh trước khi báo xong.
- KHÔNG sửa harness. Nghi harness sai → báo lại. Solution dịch sai → SỬA solutions_batch*.ts luôn.
