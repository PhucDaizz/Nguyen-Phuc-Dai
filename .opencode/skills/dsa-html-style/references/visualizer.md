# Algorithm Visualizer Spec

Mẫu chuẩn cho **mô phỏng từng bài toán** (mỗi bài Blind75 sẽ có 1 visualizer).
Reference implementation đầy đủ: [assets/visualizer-reference.html](../assets/visualizer-reference.html)
(BFS Level Order Traversal — cây, queue, code highlight, presets).

## 1. Khi nào áp dụng

- User yêu cầu "mô phỏng", "visualize", "minh họa trực quan" một bài toán cụ thể.
- Luôn dùng kèm style trong [SKILL.md](../SKILL.md) + [design-tokens.md](design-tokens.md)
  (tokens, 3-layer background, card, badge, pill, code block — không phát minh style mới).

## 2. Ngôn ngữ code: C# only

- Mọi code solution trong visualizer viết bằng **C#** (class `Solution` + method
  đúng tên LeetCode, kiểu .NET: `IList<IList<int>>`, `Queue<TreeNode>`, ...).
- Syntax highlight dùng đúng palette skill: `kw` coral · `fn` amber · `var` teal ·
  `num` #c4b5fd · `str` #a3e635 · `com` muted italic.
- Không dùng JS/Python/Java cho solution (JS chỉ cho engine mô phỏng của page).

## 3. Bố cục page (thứ tự cố định)

1. **Header**: `badge` (pattern · tên tiếng Anh) → `h1` (tên bài + accent word) →
   `subtitle` tiếng Việt 1-2 câu → `stats` row (3 ô: metric đặc thù của bài,
   vd Tầng / Queue / Đã duyệt; stat-value mono, amber hoặc teal).
2. **main-grid** (`1fr 380px`, collapse 1 cột dưới 1024px):
   - **Visualization panel** (trái, `.card` + light-bar): SVG/canvas vẽ cấu trúc
     dữ liệu + `progress-bar` + `legend` (trạng thái node).
   - **State panel** (phải): các `.state-card` hiển thị **mọi thứ thuật toán đang
     lưu trữ** trong quá trình chạy. Map theo cấu trúc dữ liệu:
     - Queue (BFS) → card FIFO + front highlight
     - Stack (DFS/backtracking) → card LIFO + top highlight
     - Two Pointers/Sliding Window → card LEFT/RIGHT indices + window values
     - Heap → card min/max top + size
     - Hash Map/Set → card key→value rows
     - DP → card dp array/row hiện tại + ô đang tính
     - Result → card teal, append từng phần (tầng / phần tử mới `pop-in`)
3. **description-bar**: `step-indicator` (mono, gradient amber: `k / N`) + `step-message`
   tiếng Việt, tên biến bọc `<strong>` (render mono amber).
4. **controls** (bắt buộc đủ 6 nhóm):
   - `Play/Pause` (primary) · `Back` · `Step` (tiến 1 bước) · `Reset`
   - `speed` slider 200–2000ms + label mono (`900ms`); đổi tốc độ áp dụng ngay cả khi đang play
   - `input-group`: ô nhập ví dụ mới (đúng format input bài đó) + nút `Build` (Enter = Build)
5. **presets**: pills gợi ý sẵn — bắt buộc có: case cân bằng/cơ bản · case trong đề
   LeetCode · case biên (rỗng / 1 phần tử / lệch hẳn / đã sort / ngược sort).
6. **shortcuts**: `Space` Play/Pause · `→` Step · `←` Back · `R` Reset (không kích hoạt khi đang focus input).
7. **code-panel** C# + highlight dòng đang chạy theo từng step.

## 4. Trace engine (kiến trúc bắt buộc)

Không animate trực tiếp thuật toán — luôn tách 2 pha:

```
build(input) → generateTrace(root) → trace: Step[] → renderStep(i)
```

`Step` schema (mọi visualizer dùng chung field này, thêm field riêng của bài khi cần):

```ts
{
  type: string,          // 'init' | 'dequeue' | 'enqueue_left' | ... | 'done'
  current: id | null,    // node/index đang xử lý (màu amber, scale 1.18 + ringPulse)
  child: id | null,      // node/index vừa được thêm (pop-in teal + edge active)
  processed: id[],       // đã xong (teal mờ)
  queue: id[],           // hoặc stack/window/dp-state của bài (amber nhạt)
  result: any,           // kết quả tích lũy tới step này
  message: string,       // tiếng Việt, biến bọc <strong>
  codeLine: number       // index dòng C# đang chạy (0-based)
}
```

Trạng thái node (class CSS, đã có sẵn trong reference):
`idle` (chưa duyệt) · `in-queue` (amber nhạt + glow) · `current` (amber đặc + ring) ·
`child-enqueue` (teal + popIn) · `processed` (teal mờ) · edge `active` (teal + glow).

Controls semantics: hết trace → Play quay lại step 0 · Step/Back luôn `pause()` trước ·
`Reset` về step 0 · `Build` input mới → rebuild + trace mới từ step 0 · resize → re-layout
giữ nguyên `currentStep`.

## 5. Node/element visuals theo cấu trúc dữ liệu

- **Tree**: circle r=22, text mono 15px; layout inorder-x + depth-y; level guides
  dashed + label `L0..Ln` (active = amber khi đang duyệt tầng đó).
- **Array/String**: ô vuông/cell hàng ngang, index mono nhỏ dưới mỗi ô; window =
  khung amber bao các ô trong cửa sổ; pointer `l`/`r` mũi tên dưới cell.
- **Linked List**: node pill + mũi tên next; slow/fast = 2 màu (amber/teal).
- **Graph/Matrix**: cell grid + visited teal; frontier amber.
- **Interval**: thanh ngang trên trục số; merged = teal.
- Mọi số/DATA trong SVG: JetBrains Mono.

## 6. Checklist trước khi giao

- [ ] Đủ 7 khối theo §3, đúng thứ tự
- [ ] Code C# biên dịch được (mental check), highlight map đúng `codeLine`
- [ ] `trace` cover hết nhánh: cây rỗng / 1 node / case lệch (step `init` + `done` riêng cho rỗng)
- [ ] Presets ≥ 4 gồm 1 case LeetCode + 1 case biên
- [ ] Không hardcode hex ngoài `var(--...)`; animation ≤ 1s, có mục đích
- [ ] Responsive: `main-grid` collapse 1 cột, SVG `viewBox` + re-layout khi resize
