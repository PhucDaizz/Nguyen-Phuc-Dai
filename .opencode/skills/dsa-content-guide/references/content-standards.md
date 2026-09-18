# DSA Content Standards — Full Spec

Authoritative reference for every note in the series. SKILL.md is the router;
this file is the contract.

---

## 1. Problem

- Giữ đề tiếng Anh nếu đang có; giải thích tiếng Việt chỉ cần ngắn.
- NgườI đọc phải nắm được: **Input là gì? Output là gì? Constraint quan trọng nào?**
- Không dịch toàn bộ đề nếu phần EN đã rõ.

## 2. Pattern / Insight — QUAN TRỌNG NHẤT

Mỗi bài phải trả lờI: **"Nhìn bài này, tôi phải nhận ra điều gì?"** — 1–3 câu.

Mẫu đúng (Two Sum):

> Với mỗi `nums[i]`, ta cần tìm một số `x` sao cho `nums[i] + x = target`.
> Vì vậy `x = target - nums[i]`. Thay vì thử mọi cặp, ta lưu các số đã gặp vào
> Hash Map và kiểm tra xem `need` đã xuất hiện chưa.

Mẫu sai:

> "Dùng Hash Map."

→ Phải giải thích **tại sao** cấu trúc/thuật toán đó xuất hiện trong bài toán.

## 3. Brute Force → Optimized

Nếu bài có brute force rõ ràng, giải thích gọn 3 bước (có thể gộp 3–5 dòng vào
Solution, không cần section riêng):

- **Brute force:** thử mọi cặp `(i, j)` → `O(n²)`.
- **Vấn đề:** với mỗi phần tử, ta đang tìm kiếm lại toàn bộ phần còn lại.
- **Optimization:** lưu thông tin đã biết vào Hash Map để biến việc tìm kiếm
  thành trung bình `O(1)`.

Không bắt buộc viết brute-force code, trừ khi nó giúp hiểu pattern rõ hơn.

## 4. Recognition Checklist

Giữ section checklist — giúp ngườI học tự kiểm tra. Nhưng:

- Hướng tới **tư duy**, không phảI chi tiết implementation.
- Ví dụ:

  > **CHECKLIST — HỎI 4 CÂU NÀY**
  > - Mình đang cần tìm quan hệ gì giữa các phần tử?
  > - Với phần tử hiện tại, mình còn "thiếu" thông tin gì?
  > - Thông tin đó có thể lưu để tra cứu nhanh không?
  > - Có cần giữ index/thứ tự hay có thể sort?

- **Không ép mọi bài đủ 4 câu** — chỉ dùng câu hỏi phù hợp.

## 5. Solution — giải thích TRƯỚC code

Ý tưởng bằng ngôn ngữ tự nhiên, format:

> **Bước 1:** ...
> **Bước 2:** ...
> **Bước 3:** ...

NgườI đọc hiểu solution **trước khi nhìn code**.

## 6. Code decisions đáng giải thích

Không giải thích từng dòng. Chỉ giải thích dòng/cặp dòng có tính quyết định,
vớI format "quyết định → lý do". Ví dụ:

> **Check trước, lưu sau.** Ta kiểm tra `need` trước khi lưu `nums[i]` — đảm bảo
> một phần tử không tự dùng chính nó.
>
> `seen` lưu `value → index` vì kết quả yêu cầu trả về index.

## 7. Code

- Giữ code hiện tại nếu đúng. Không refactor chỉ để đẹp hơn.
- Không đổi ngôn ngữ/framework/style nếu không có lý do.
- Chỉ sửa khi: có bug, hoặc complexity không khớp solution đã mô tả.
- Sau khi sửa: explanation + dry-run phải vẫn khớp.

## 8. Dry-run

- Phải thể hiện **logic quan trọng nhất** của thuật toán (invariant/pattern),
  không chỉ liệt kê biến.
- Ví dụ:

```text
i = 0
nums[i] = 2
need = 7
seen = {}

→ chưa có 7
→ lưu 2 → 0

i = 1
nums[i] = 7
need = 2
seen có 2 → 0

→ return [0, 1]
```

- Thuật toán phức tạp → ưu tiên trace các bước giúp hiểu invariant.
- Không cần trace toàn bộ input.

## 9. Complexity

Không ghi trần `TIME O(n) / SPACE O(n)`. Phải kèm giải thích cực ngắn:

> **Time O(n):** duyệt mảng một lần, mỗi lookup Hash Map trung bình `O(1)`.
> **Space O(n):** Hash Map có thể lưu tối đa `n` phần tử.

## 10. Pitfalls

- **2–4 lỗi/bẫy thực sự đáng nhớ** mỗi bài.
- Ưu tiên: sai logic · sai edge case · sai data structure · sai complexity ·
  mất index · duplicate · off-by-one · sort làm mất thông tin cần giữ · thứ tự
  xử lý sai · null/empty input (nếu relevant).
- Không thêm warning vô nghĩa chỉ để đủ số.

## 11. Pattern Memory

1 câu takeaway ở cuối Solution/Pattern:

> **Pattern cần nhớ:** Khi gặp `[đặc điểm bài toán]`, hãy nghĩ đến `[pattern/technique]`.

Ví dụ:

> **Pattern cần nhớ:** Khi cần tìm một cặp có tổng/hiệu cố định và cần giữ index,
> hãy nghĩ đến Hash Map.

## 12. Cùng nhánh (Related Problems)

- Giữ section này. Chọn bài liên quan **theo pattern**, không chỉ cùng category.
- Ưu tiên các bài cho thấy pattern được biến đổi ra sao. Ví dụ:
  Two Sum → Contains Duplicate → 3Sum → Two Sum II → 4Sum.

---

# YÊU CẦU THEO TỪNG LOẠI BÀI

Không áp dụng máy móc cùng một explanation cho 74 bài. Mỗi type bắt buộc giải
thích những câu hỏi riêng sau:

### Array / Hash Map
- lookup · frequency · complement · prefix/suffix · index · duplicate

### Two Pointers
- Hai pointer đại diện cho gì?
- Tại sao di chuyển left/right?
- Điều kiện nào đảm bảo việc di chuyển **không bỏ mất đáp án**?

### Sliding Window
- Window đại diện cho gì?
- Khi nào expand? Khi nào shrink?
- **Invariant của window là gì?**

### Stack
- Vì sao LIFO phù hợp?
- Stack đại diện cho trạng thái gì?
- Khi nào push/pop?

### Binary Search
- **Search space** là gì?
- Điều kiện nào cho phép **loại bỏ một nửa**?
- `left/right/mid` đại diện cho gì?
- Boundary update như thế nào?

### Linked List
- Pointer đang trỏ tới node nào?
- **Thứ tự thay đổi pointer có quan trọng không?**
- Có nguy cơ mất reference không?

### Tree / DFS / BFS
- State của mỗi node là gì?
- Khi nào đi xuống / quay lại?
- DFS hay BFS — chọn vì tính chất gì?

### Heap / Priority Queue
- Cần **min hay max**?
- Vì sao chỉ cần giữ **top K** / phần tử ưu tiên?
- Heap giảm complexity như thế nào?

### Graph
- Node/edge đại diện cho gì?
- `visited` dùng để làm gì?
- BFS / DFS / Dijkstra / Union Find — chọn vì lý do gì?

### Dynamic Programming (cần kỹ hơn)
Mỗi bài DP cố gắng chỉ ra đủ 5 điểm:
1. `state` là gì?
2. `transition` là gì?
3. `base case` là gì?
4. Tại sao có thể **reuse** kết quả trước đó?
5. Complexity.

Không cần chứng minh toán học dài.

---

# NGUYÊN TẮC ĐỘ DÀI & NGÔN NGỮ

- Thứ tự ưu tiên: **Pattern explanation > Solution reasoning > Code > Dry-run >
  Pitfalls**.
- Easy: 500–800 từ · Medium/khó: 700–1.200 từ · đã rõ ở 400–500 từ thì dừng.
- Tiếng Việt cho hướng dẫn; giữ thuật ngữ English: Hash Map, Two Pointers,
  Sliding Window, Stack, Queue, Binary Search, DFS, BFS, Heap, Dynamic
  Programming, Time/Space Complexity.
- Giọng văn: trực tiếp · dễ hiểu · thực tế · không hàn lâm · không sáo rỗng.
- Không thêm chữ chỉ để bài dài hơn.

---

# QUALITY CHECKLIST (tự chấm trước khi hoàn thành mỗi bài)

- [ ] Problem vẫn chính xác
- [ ] Example đúng
- [ ] Pattern được **giải thích**, không chỉ gọi tên
- [ ] Có "WHY" cho solution
- [ ] Nếu có brute force rõ ràng → đã giải thích tại sao tối ưu hơn
- [ ] Code đúng
- [ ] Explanation khớp code
- [ ] Dry-run khớp code
- [ ] Complexity chính xác **và có giải thích**
- [ ] Pitfalls có giá trị (2–4 cái thật)
- [ ] Có takeaway / Pattern Memory
- [ ] Không đoạn văn thừa, không lặp explanation
- [ ] Không thay đổi UI/structure ngoài phạm vi cần thiết
- [ ] Đủ để ngườI học tự áp dụng pattern cho bài mới

---

# VÍ DỤ MẪU HOÀN CHỈNH — TWO SUM

> **Pattern / Insight**
> Với mỗi `nums[i]`, ta cần tìm `x` sao cho `nums[i] + x = target` ⇔
> `x = target - nums[i]`. Thay vì thử mọi cặp `O(n²)`, lưu các số đã gặp vào
> Hash Map và kiểm tra `need` đã xuất hiện chưa — lookup trung bình `O(1)`.
>
> **Ý tưởng**
> Bước 1: khởi tạo `seen = {}`.
> Bước 2: với mỗi `nums[i]`, tính `need = target - nums[i]`.
> Bước 3: nếu `need ∈ seen` → trả về `[seen[need], i]`. Ngược lại lưu
> `seen[nums[i]] = i`.
>
> **Code decision:** check trước, lưu sau — một phần tử không tự dùng chính
> nó. `seen` lưu `value → index` vì đề yêu cầu trả về index.
>
> **Complexity** — Time `O(n)`: một vòng duyệt, mỗi lookup `O(1)` trung bình.
> Space `O(n)`: Hash Map lưu tối đa `n` phần tử.
>
> **Pitfalls** — dùng cùng phần tử hai lần (check trước lưu sau) · trả về giá
> trị thay vì index · quên trường hợp không có đáp án (tuỳ đề).
>
> **Pattern cần nhớ:** cần tìm cặp có tổng/hiệu cố định + giữ index → Hash Map.
>
> **Cùng nhánh:** Contains Duplicate → 3Sum → Two Sum II → 4Sum.
