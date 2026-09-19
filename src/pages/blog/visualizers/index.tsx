import { Link, useParams } from 'react-router-dom';
import { Seo } from '../../../components/Seo';
import { getGuide } from '../../../data/guides';
import { BLIND75 } from '../../../data/blind75';
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
import { CloneVisualizer } from './CloneVisualizer';
import { ScheduleVisualizer } from './ScheduleVisualizer';
import { PacificVisualizer } from './PacificVisualizer';
import { IslandsVisualizer } from './IslandsVisualizer';
import { ConsecutiveVisualizer } from './ConsecutiveVisualizer';
import { RobberVisualizer } from './RobberVisualizer';
import { Robber2Visualizer } from './Robber2Visualizer';
import { DecodeVisualizer } from './DecodeVisualizer';
import { CoinVisualizer } from './CoinVisualizer';
import { LisVisualizer } from './LisVisualizer';
import { JumpVisualizer } from './JumpVisualizer';
import { WordBreakVisualizer } from './WordBreakVisualizer';
import { LongestPalVisualizer, CountPalVisualizer } from './PalindromeExpand';
import { StairsVisualizer } from './StairsVisualizer';
import { InsertIntervalVisualizer } from './InsertIntervalVisualizer';
import { MergeIntervalsVisualizer } from './MergeIntervalsVisualizer';
import { NonOverlapVisualizer } from './NonOverlapVisualizer';
import { MeetingRoomsVisualizer, MeetingRooms2Visualizer } from './MeetingRoomsVisualizer';
import { MaxSubarrayVisualizer } from './MaxSubarrayVisualizer';
import { AlienVisualizer } from './AlienVisualizer';
import { ValidTreeVisualizer, ComponentsVisualizer } from './UnionFindVisualizer';
import { UniquePathsVisualizer } from './UniquePathsVisualizer';
import { LcsVisualizer } from './LcsVisualizer';
import { BitAddVisualizer } from './BitAddVisualizer';
import { HammingVisualizer } from './HammingVisualizer';
import { CountingBitsVisualizer } from './CountingBitsVisualizer';
import { MissingVisualizer } from './MissingVisualizer';
import { ReverseBitsVisualizer } from './ReverseBitsVisualizer';
import { RotateVisualizer } from './RotateVisualizer';
import { SpiralVisualizer } from './SpiralVisualizer';
import { ZeroesVisualizer } from './ZeroesVisualizer';
import { MaxProductVisualizer } from './MaxProductVisualizer';
import { BinarySearchVisualizer } from './BinarySearchVisualizer';

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
  'clone-graph-133': CloneVisualizer,
  'course-schedule-207': ScheduleVisualizer,
  'pacific-atlantic-417': PacificVisualizer,
  'number-of-islands-200': IslandsVisualizer,
  'longest-consecutive-128': ConsecutiveVisualizer,
  'house-robber-198': RobberVisualizer,
  'house-robber-ii-213': Robber2Visualizer,
  'decode-ways-91': DecodeVisualizer,
  'coin-change-322': CoinVisualizer,
  'lis-300': LisVisualizer,
  'jump-game-55': JumpVisualizer,
  'word-break-139': WordBreakVisualizer,
  'longest-palindrome-5': LongestPalVisualizer,
  'palindromic-substrings-647': CountPalVisualizer,
  'climbing-stairs-70': StairsVisualizer,
  'insert-interval-57': InsertIntervalVisualizer,
  'merge-intervals-56': MergeIntervalsVisualizer,
  'non-overlapping-435': NonOverlapVisualizer,
  'meeting-rooms-252': MeetingRoomsVisualizer,
  'meeting-rooms-ii-253': MeetingRooms2Visualizer,
  'max-subarray-53': MaxSubarrayVisualizer,
  'alien-dict-269': AlienVisualizer,
  'valid-tree-261': ValidTreeVisualizer,
  'connected-components-323': ComponentsVisualizer,
  'unique-paths-62': UniquePathsVisualizer,
  'lcs-1143': LcsVisualizer,
  'sum-two-integers-371': BitAddVisualizer,
  'number-of-1-bits-191': HammingVisualizer,
  'counting-bits-338': CountingBitsVisualizer,
  'missing-number-268': MissingVisualizer,
  'reverse-bits-190': ReverseBitsVisualizer,
  'rotate-image-48': RotateVisualizer,
  'spiral-matrix-54': SpiralVisualizer,
  'set-zeroes-73': ZeroesVisualizer,
  'max-product-152': MaxProductVisualizer,
  'binary-search-704': BinarySearchVisualizer,
};

export const hasVisualizer = (slug: string) => slug in VISUALIZERS;

export const VisualizerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const Viz = slug ? VISUALIZERS[slug] : undefined;

  if (!Viz) {
    return (
      <div className="dsa-narrow">
        <Seo
          title="Chưa có mô phỏng | Nguyễn Phúc Đại"
          description="Bài này chưa có visualizer. Xem bài giảng hoặc sơ đồ cây Blind75."
          path={`/blog/${slug}/visualize`}
        />
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

  const guide = slug ? getGuide(slug) : undefined;
  const blind = guide ? BLIND75.find((p) => p.no === guide.blindNo) : undefined;
  const vizTitle = blind
    ? `Mô phỏng ${blind.title} (${blind.viTitle}) | Nguyễn Phúc Đại`
    : 'Mô phỏng thuật toán | Nguyễn Phúc Đại';

  return (
    <>
      <Seo
        title={vizTitle}
        description={
          blind
            ? `Mô phỏng trực quan ${blind.title}: Play/Step từng bước, tự nhập ví dụ, code C#.`
            : 'Mô phỏng trực quan thuật toán từng bước.'
        }
        path={`/blog/${slug}/visualize`}
      />
      <Viz />
    </>
  );
};
