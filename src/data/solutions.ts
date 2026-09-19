// Solutions đa ngôn ngữ cho từng bài (mẫu: two-sum-1).
// Các bài khác sau này chỉ cần thêm entry keyed theo slug;
// trang chi tiết + visualizer tự render tab từ entry này.

export type SolutionLang = 'ts' | 'csharp' | 'python' | 'java' | 'cpp' | 'js';

export interface LangSolution {
  lang: SolutionLang;
  label: string;
  filename: string;
  code: string;
}

export const LANG_ORDER: SolutionLang[] = ['ts', 'csharp', 'python', 'java', 'cpp', 'js'];

export const LANG_META: Record<SolutionLang, { label: string; filename: string }> = {
  ts: { label: 'TypeScript', filename: 'solution.ts' },
  csharp: { label: 'C#', filename: 'Solution.cs' },
  python: { label: 'Python', filename: 'solution.py' },
  java: { label: 'Java', filename: 'Solution.java' },
  cpp: { label: 'C++', filename: 'solution.cpp' },
  js: { label: 'JavaScript', filename: 'solution.js' },
};

import { BATCHA_SOLUTIONS } from './solutions_batchA';
import { BATCHB_SOLUTIONS } from './solutions_batchB';
import { BATCHC_SOLUTIONS } from './solutions_batchC';
import { BATCHD_SOLUTIONS } from './solutions_batchD';
import { BATCHE_SOLUTIONS } from './solutions_batchE';
import { BATCHF_SOLUTIONS } from './solutions_batchF';

export const SOLUTIONS: Record<string, Partial<Record<SolutionLang, string>>> = {
  'two-sum-1': {
    ts: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    csharp: `public int[] TwoSum(int[] nums, int target) {
    var seen = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++) {
        int need = target - nums[i];
        if (seen.ContainsKey(need))
            return new int[] { seen[need], i };
        seen[nums[i]] = i;
    }
    return Array.Empty<int>();
}`,
    python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need))
                return new int[]{seen.get(need), i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int need = target - nums[i];
            if (seen.count(need)) return {seen[need], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    js: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
  },
  ...BATCHA_SOLUTIONS,
  ...BATCHB_SOLUTIONS,
  ...BATCHC_SOLUTIONS,
  ...BATCHD_SOLUTIONS,
  ...BATCHE_SOLUTIONS,
  ...BATCHF_SOLUTIONS,
};

/** Lấy danh sách solutions cho 1 slug, sắp xếp theo LANG_ORDER. */
export const getSolutions = (slug: string): LangSolution[] =>
  LANG_ORDER.flatMap((lang) => {
    const code = SOLUTIONS[slug]?.[lang];
    if (!code) return [];
    return [{ lang, label: LANG_META[lang].label, filename: LANG_META[lang].filename, code }];
  });

// ===================== TRACE LINE MAP (Two Sum mẫu) =====================
// Mỗi bước của trace engine map tới dòng code (0-based) tương ứng trong từng ngôn ngữ,
// để tab nào cũng highlight đúng dòng đang chạy — không riêng gì C#.
//
// Quy ước cho mọi bài (bắt buộc):
// - Helper `LineMap<Tag>`: tsc bắt buộc đủ mọi tag × đủ 6 ngôn ngữ.
// - Tên const: <NAME>_LINE_MAP (vd STOCK_LINE_MAP), đặt trong solutions_batch*.ts và re-export ở cuối file này.
// - Map `csharp` phải copy y nguyên các giá trị codeLine cũ của visualizer (giữ hành vi C# không đổi).
export type LineMap<Tag extends string> = Record<SolutionLang, Record<Tag, number>>;
export type TraceTag = 'init' | 'visit' | 'check' | 'found' | 'store' | 'done';

export const TWOSUM_LINE_MAP: LineMap<TraceTag> = {
  // Highlight đúng dòng ngữ nghĩa (trace cũ lệch do panel sửa sau)
  csharp: { init: 1, visit: 3, check: 4, found: 5, store: 6, done: 5 },
  ts: { init: 1, visit: 3, check: 4, found: 4, store: 5, done: 5 },
  python: { init: 1, visit: 3, check: 4, found: 5, store: 6, done: 5 },
  java: { init: 2, visit: 4, check: 5, found: 6, store: 7, done: 6 },
  cpp: { init: 3, visit: 5, check: 6, found: 6, store: 7, done: 6 },
  js: { init: 1, visit: 3, check: 4, found: 4, store: 5, done: 5 },
};

// Re-export line maps t? c�c batch files (visualizer import t? d�y).
export * from './solutions_batchA';
export * from './solutions_batchB';
export * from './solutions_batchC';
export * from './solutions_batchD';
export * from './solutions_batchE';
export * from './solutions_batchF';
