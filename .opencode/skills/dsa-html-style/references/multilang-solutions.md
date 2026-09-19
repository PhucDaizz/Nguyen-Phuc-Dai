# Multi-language solutions (SolutionTabs)

Trang chi tiết (`/blog/:slug`) và trang visualize (`/blog/:slug/visualize`) dùng chung
component `SolutionTabs` (`src/pages/blog/SolutionTabs.tsx`) — tab 6 ngôn ngữ:
TypeScript · C# · Python · Java · C++ · JavaScript.

## Thêm bài mới — 2 chỗ duy nhất

### 1. `src/data/solutions.ts` — entry code 6 ngôn ngữ

```ts
'<slug>': {
  ts: `...`,      // COPY Y NGUYÊN guide.code trong guides.ts (giữ highlightLines đúng)
  csharp: `...`,  // COPY Y NGUYÊN code C# trong panel visualizer (giữ codeLine đúng)
  python: `...`,  // def / cùng thuật toán, cùng vai trò biến
  java: `...`,    // class Solution { ... }
  cpp: `...`,     // class Solution { ... };
  js: `...`,      // function ... (bản không types của TS)
},
```

- KHÔNG fences ``` trong code. Backtick / `${` bên trong phải escape (dùng String.raw hoặc né cú pháp đó).
- Trang chi tiết TỰ ĐỘNG hiện tab (không sửa `BlogDetailPage.tsx`).

### 2. `src/data/solutions.ts` — line map (chỉ bài CÓ visualizer)

```ts
export const <NAME>_LINE_MAP: LineMap<'tag1' | 'tag2' | ...> = {
  csharp: { ... },  // soát từng bước với panel HIỆN TẠI (codeLine cũ có thể đã stale!)
  ts: { ... },      // dòng tương ứng trong bản TS (0-based)
  python: { ... },
  java: { ... },
  cpp: { ... },
  js: { ... },
};
```

- Union tag PHẢI KHỚP `Step['type']` trong visualizer — tsc sẽ báo nếu thiếu.
- Đếm dòng 0-based, dòng trống cũng tính. Kiểm tra: index < số dòng của code ngôn ngữ đó.
- QUAN TRỌNG: map phải trỏ ĐÚNG DÒNG NGỮ NGHĨA của từng bước (đọc code + message của trace để xác định),
  KHÔNG copy mù `codeLine` cũ — nhiều trace viết trước, panel sửa sau nên `codeLine` đã stale
  (trỏ vào `}` hoặc sai dòng). Verify bằng `node scripts/audit-linemaps.mjs`: 0 dòng STALE.
  Trường hợp 1 type có nhiều codeLine (nhiều nhánh): chọn nhánh của preset mặc định.
  Trường hợp `done` 2 đường found/miss: ưu tiên đường của preset mặc định.

### 3. Visualizer — thay panel code cũ bằng SolutionTabs

```tsx
import { getSolutions, <NAME>_LINE_MAP } from '../../../data/solutions';
import { SolutionTabs } from '../SolutionTabs';

const SOLUTIONS_X = getSolutions('<slug>');
// ...
<div style={{ marginTop: 14 }}>
  <SolutionTabs
    solutions={SOLUTIONS_X}
    defaultLang="csharp"
    getHighlight={(lang) => [<NAME>_LINE_MAP[lang][step.type]]}
    meta="O(n) · O(n)"
  />
</div>
```

- XÓA const `*_LINES` cũ. Giữ nguyên trace engine, step.type, message.
- Tên biến step chứa step hiện tại có thể khác (`step`, `s`, `cur`) — đọc file trước khi sửa.
- Bài KHÔNG có visualizer (vd `binary-search-704`): chỉ làm bước 1, không có line map.
