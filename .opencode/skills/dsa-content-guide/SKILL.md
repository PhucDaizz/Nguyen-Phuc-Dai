---
name: dsa-content-guide
description: >
  Content standard for writing/improving concise DSA & LeetCode tutorial notes
  (a series of ~74 problems). Triggers whenever the user asks to write, edit,
  review, or improve a DSA/LeetCode problem explanation, pattern hint, dry-run,
  or the whole series. Enforces: pattern recognition explained (not just named),
  WHY before code, brute-force → optimization reasoning, per-topic-type
  explanation requirements, strict length discipline (Easy 500–800 words,
  Medium 700–1200), Vietnamese prose with English technical terms kept, and a
  mandatory self-check quality gate. This is a concise learning-note style,
  NOT a textbook — never pad content.
---

# DSA Content Guide

Content standard for a series of ~74 DSA/LeetCode tutorial notes. The reader
must finish each note able to answer three questions:

1. **"Nhìn bài này, tôi nhận ra pattern gì?"**
2. **"Tại sao solution này hoạt động?"**
3. **"Gặp bài tương tự, tôi có thể tự nghĩ ra nó không?"**

## When to apply

- Writing a new problem note, or editing/reviewing an existing one.
- Auditing the whole series for consistency.
- **Do NOT pad**: if a note already answers a question well, leave it alone —
  only fill what is missing.

## Golden rules (never break)

1. **Ngắn + rõ + giải thích đúng chỗ.** If an idea fits in 2–3 sentences, never
   stretch it into a paragraph. Don't repeat what code or dry-run already shows.
2. **Pattern phải được giải thích, không chỉ được gọi tên.** Never write just
   "Dùng Hash Map" — explain *why* that structure appears in this problem.
3. **WHY trước code.** Natural-language algorithm idea before the code block,
   as numbered steps. Reader must understand the solution before seeing it.
4. **Giữ nguyên format/UI hiện có.** Fill content inside existing sections;
   never redesign structure unilaterally.
5. **Ưu tiên tính nhất quán giữa 74 bài.** Same sections, same voice, same depth
   for the same difficulty.
6. **Code chỉ sửa khi sai** (bug hoặc complexity không khớp mô tả). Không refactor
   để "đẹp hơn". Sau khi sửa, explanation và dry-run phải vẫn khớp code.

## Workflow per note

1. **Đọc bài hiện tại**, đối chiếu quality checklist (dưới) để tìm phần thiếu.
2. **Xác định pattern + topic type** (Array/HashMap, Two Pointers, Sliding
   Window, Stack, Binary Search, Linked List, Tree, Heap, Graph, DP) → tra yêu
   cầu giải thích riêng của type đó trong
   [references/content-standards.md](references/content-standards.md).
3. **Viết/sửa theo structure chuẩn** (12 section, xem reference).
4. **Dry-run** phải trace logic quan trọng nhất (invariant), không liệt kê biến.
5. **Complexity** phải kèm 1 câu giải thích ngắn, không chỉ ghi O(...).
6. **Tự chấm quality checklist** trước khi hoàn thành.

## Structure chuẩn (tóm tắt)

Problem (EN) → Pattern/Insight → Brute force → Optimized (nếu có) → Recognition
Checklist → Ý tưởng (trước code) → Code decisions quan trọng → Code → Dry-run →
Complexity (+giải thích) → Pitfalls (2–4 cái đáng nhớ) → Pattern Memory (1 câu
takeaway) → Cùng nhánh (theo pattern, không chỉ cùng category).

Checklist không ép đủ 4 câu — chỉ dùng câu hỏi phù hợp bài đó và hướng tới tư duy,
không phải chi tiết implementation.

## Độ dài

- Easy: **500–800 từ**. Medium/khó: **700–1.200 từ**.
- Đơn giản và đã rõ ở 400–500 từ → **không kéo dài**.
- Thứ tự ưu tiên nội dung: **Pattern explanation > Solution reasoning > Code >
  Dry-run > Pitfalls**.

## Ngôn ngữ

- Tiếng Việt cho phần hướng dẫn; giữ nguyên thuật ngữ English khi tự nhiên:
  Hash Map, Two Pointers, Sliding Window, Stack, Queue, Binary Search, DFS, BFS,
  Heap, Dynamic Programming, Time/Space Complexity.
- Giọng văn: trực tiếp, thực tế, cho ngườI đang học DSA — không hàn lâm, không
  motivational sáo rỗng.

## Resources

- [references/content-standards.md](references/content-standards.md) — full spec:
  chi tiết 12 section, yêu cầu giải thích theo từng loại bài, nguyên tắc độ dài,
  quality checklist đầy đủ, ví dụ mẫu (Two Sum).
- [assets/article-template.md](assets/article-template.md) — template điền sẵn
  section headers để bắt đầu một bài mới đúng chuẩn.
