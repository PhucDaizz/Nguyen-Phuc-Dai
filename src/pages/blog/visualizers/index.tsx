import { Link, useParams } from 'react-router-dom';
import { TwoSumVisualizer } from './TwoSumVisualizer';
import { StockVisualizer } from './StockVisualizer';
import { DuplicateVisualizer } from './DuplicateVisualizer';
import { ProductVisualizer } from './ProductVisualizer';
import { AnagramVisualizer } from './AnagramVisualizer';
import { GroupVisualizer } from './GroupVisualizer';
import { CodecVisualizer } from './CodecVisualizer';
import { PalindromeVisualizer } from './PalindromeVisualizer';
import { ContainerVisualizer } from './ContainerVisualizer';
import { ThreeSumVisualizer } from './ThreeSumVisualizer';
import { ParenthesesVisualizer } from './ParenthesesVisualizer';
import { RotatedMinVisualizer } from './RotatedMinVisualizer';
import { RotatedSearchVisualizer } from './RotatedSearchVisualizer';
import { SubstringVisualizer } from './SubstringVisualizer';
import { ReplacementVisualizer } from './ReplacementVisualizer';
import { MinWindowVisualizer } from './MinWindowVisualizer';
import { ReverseVisualizer } from './ReverseVisualizer';
import { CycleVisualizer } from './CycleVisualizer';
import { MergeTwoVisualizer } from './MergeTwoVisualizer';
import { MergeKVisualizer } from './MergeKVisualizer';
import { RemoveNthVisualizer } from './RemoveNthVisualizer';
import { ReorderVisualizer } from './ReorderVisualizer';
import { MaxDepthVisualizer } from './MaxDepthVisualizer';
import { SameTreeVisualizer } from './SameTreeVisualizer';
import { InvertVisualizer } from './InvertVisualizer';
import { MaxPathVisualizer } from './MaxPathVisualizer';
import { LevelOrderVisualizer } from './LevelOrderVisualizer';
import { SerializeVisualizer } from './SerializeVisualizer';
import { SubtreeVisualizer } from './SubtreeVisualizer';
import { ConstructVisualizer } from './ConstructVisualizer';
import { KthSmallestVisualizer } from './KthSmallestVisualizer';
import { LcaVisualizer } from './LcaVisualizer';
import { TrieVisualizer } from './TrieVisualizer';
import { WildcardVisualizer } from './WildcardVisualizer';
import { WordSearch2Visualizer } from './WordSearch2Visualizer';
import { TopKVisualizer } from './TopKVisualizer';
import { MedianVisualizer } from './MedianVisualizer';
import { CombinationVisualizer } from './CombinationVisualizer';
import { WordSearchVisualizer } from './WordSearchVisualizer';

// Registry: slug bài giảng → visualizer tương ứng.
// Thêm bài mới: import component + thêm 1 dòng vào map.
const VISUALIZERS: Record<string, () => React.JSX.Element> = {
  'two-sum-1': TwoSumVisualizer,
  'best-time-stock-121': StockVisualizer,
  'contains-duplicate-217': DuplicateVisualizer,
  'product-except-self-238': ProductVisualizer,
  'valid-anagram-242': AnagramVisualizer,
  'group-anagrams-49': GroupVisualizer,
  'encode-decode-strings-271': CodecVisualizer,
  'valid-palindrome-125': PalindromeVisualizer,
  'container-most-water-11': ContainerVisualizer,
  'three-sum-15': ThreeSumVisualizer,
  'valid-parentheses-20': ParenthesesVisualizer,
  'find-min-rotated-153': RotatedMinVisualizer,
  'search-rotated-33': RotatedSearchVisualizer,
  'longest-substring-3': SubstringVisualizer,
  'char-replacement-424': ReplacementVisualizer,
  'min-window-76': MinWindowVisualizer,
  'reverse-linked-list-206': ReverseVisualizer,
  'linked-list-cycle-141': CycleVisualizer,
  'merge-two-lists-21': MergeTwoVisualizer,
  'merge-k-lists-23': MergeKVisualizer,
  'remove-nth-19': RemoveNthVisualizer,
  'reorder-list-143': ReorderVisualizer,
  'max-depth-104': MaxDepthVisualizer,
  'same-tree-100': SameTreeVisualizer,
  'invert-tree-226': InvertVisualizer,
  'max-path-sum-124': MaxPathVisualizer,
  'level-order-102': LevelOrderVisualizer,
  'serialize-tree-297': SerializeVisualizer,
  'subtree-572': SubtreeVisualizer,
  'construct-tree-105': ConstructVisualizer,
  'kth-smallest-230': KthSmallestVisualizer,
  'lowest-common-ancestor-235': LcaVisualizer,
  'implement-trie-208': TrieVisualizer,
  'add-search-words-211': WildcardVisualizer,
  'word-search-ii-212': WordSearch2Visualizer,
  'top-k-frequent-347': TopKVisualizer,
  'find-median-295': MedianVisualizer,
  'combination-sum-39': CombinationVisualizer,
  'word-search-79': WordSearchVisualizer,
};

export const hasVisualizer = (slug: string) => slug in VISUALIZERS;

export const VisualizerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const Viz = slug ? VISUALIZERS[slug] : undefined;

  if (!Viz) {
    return (
      <div className="dsa-narrow">
        <div className="badge">Visualizer</div>
        <h1>Chưa có <span className="accent">mô phỏng</span></h1>
        <p>Bài “{slug}” chưa có visualizer. Quay lại bài giảng hoặc danh sách Blind75.</p>
        <div className="btn-row">
          {slug && (
            <Link to={`/blog/${slug}`} className="btn primary">← Về bài giảng</Link>
          )}
          <Link to="/blog/blind75" className="btn">Sơ đồ cây →</Link>
        </div>
      </div>
    );
  }

  return <Viz />;
};
