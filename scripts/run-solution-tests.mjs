// Harness chạy TEST solutions 6 ngôn ngữ.
// Chạy: node scripts/run-solution-tests.mjs [--batch A] [--lang js] [--slug two-sum-1]
// Test cases: src/data/tests_batch*.mjs  →  export const TESTS = { slug: { tests: [...] } }
// Mỗi test: { expect, norm?, tol?, js, ts?, py, java, cpp, cs }
//   - mỗi ngôn ngữ: string (1 biểu thức) hoặc { stmts: [...], ret: '...' }
//   - ts mặc định = js. norm 'sortDeep': sắp sâu trước khi so. tol: sai số số thực.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const BATCH = opt('--batch');
const LANGF = opt('--lang');
const SLUGF = opt('--slug');

const LANGS = ['ts', 'js', 'py', 'java', 'cpp', 'cs'].filter((l) => !LANGF || l === LANGF);
// key trong SOLUTIONS khác tên runner (python/csharp)
const CODEKEY = { ts: 'ts', js: 'js', py: 'python', java: 'java', cpp: 'cpp', cs: 'csharp' };
let pass = 0, fail = 0;
const failures = [];
const okLine = (m) => console.log('  ok ' + m);
const failLine = (m) => { fail++; failures.push(m); console.log('  FAIL ' + m); };

// ---------- load SOLUTIONS (compile TS sang CJS temp) ----------
const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'sol-test-'));
{
  const { execSync } = await import('node:child_process');
  execSync(`npx tsc src/data/solutions.ts --outDir "${tmpBase}" --module commonjs --target es2020 --skipLibCheck --declaration false --sourceMap false`, { cwd: ROOT, stdio: 'pipe' });
}
const solMod = await import(pathToFileURL(path.join(tmpBase, 'solutions.js')).href);
const SOLUTIONS = solMod.SOLUTIONS ?? solMod.default?.SOLUTIONS;

// ---------- load TESTS ----------
const TESTS = {};
for (const f of fs.readdirSync(path.join(ROOT, 'src/data'))) {
  const m = f.match(/^tests_batch([A-Z])\.mjs$/);
  if (!m) continue;
  if (BATCH && m[1] !== BATCH) continue;
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/data', f)).href);
  Object.assign(TESTS, mod.TESTS);
}

// ---------- helpers ----------
const run = (cmd, a, input, timeout = 90000) => {
  try {
    const out = execFileSync(cmd, a, { input, timeout, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: (e.stdout ?? '') + '\n' + (e.stderr ?? e.message) };
  }
};
const parseResults = (out) =>
  out.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('RESULT:')).map((l) => l.slice(7).trim());

const sortDeep = (v) => {
  if (Array.isArray(v)) {
    const a = v.map(sortDeep);
    a.sort((x, y) => {
      const sx = JSON.stringify(x), sy = JSON.stringify(y);
      const nx = typeof x === 'number', ny = typeof y === 'number';
      if (nx && ny) return x - y;
      return sx < sy ? -1 : sx > sy ? 1 : 0;
    });
    return a;
  }
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = sortDeep(v[k]);
    return o;
  }
  return v;
};
const eqTol = (a, b, tol) => {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) <= (tol ?? 0);
  }
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => eqTol(x, b[i], tol));
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => eqTol(a[k], b[k], tol));
  }
  return a === b;
};

// ---------- preludes ----------
const JS_PRELUDE = `
class ListNode{constructor(val=0,next=null){this.val=val;this.next=next;}}
class TreeNode{constructor(val=0,left=null,right=null){this.val=val;this.left=left;this.right=right;}}
class Node{constructor(val=0,neighbors=[]){this.val=val;this.neighbors=neighbors===undefined?[]:neighbors;}}
class GraphNode{constructor(val=0,neighbors=[]){this.val=val;this.neighbors=neighbors===undefined?[]:neighbors;}}
const L=a=>{const d=new ListNode();let c=d;for(const v of a){c.next=new ListNode(v);c=c.next;}return d.next;};
const A=h=>{const r=[];while(h){r.push(h.val);h=h.next;}return r;};
const T=a=>{if(!a.length||a[0]==null)return null;const r=new TreeNode(a[0]);const q=[r];let i=1;while(q.length&&i<a.length){const n=q.shift();if(i<a.length&&a[i]!=null){n.left=new TreeNode(a[i]);q.push(n.left);}i++;if(i<a.length&&a[i]!=null){n.right=new TreeNode(a[i]);q.push(n.right);}i++;}return r;};
const TA=t=>{if(!t)return[];const r=[];const q=[t];while(q.length){const n=q.shift();if(n){r.push(n.val);q.push(n.left);q.push(n.right);}else r.push(null);}while(r.length&&r[r.length-1]==null)r.pop();return r;};
const G=a=>{const ns=a.map((_,i)=>new GraphNode(i+1,[]));ns.forEach((n,i)=>{n.neighbors=a[i].map(j=>ns[j-1]);});return ns.length?ns[0]:null;};
const GA=s=>{if(!s)return[];const seen=new Map();const q=[s];seen.set(s,0);const adj=[];while(q.length){const n=q.shift();const id=seen.get(n);adj[id]=[];for(const nb of n.neighbors){if(!seen.has(nb)){seen.set(nb,seen.size);q.push(nb);}adj[id].push(nb.val);}adj[id].sort((x,y)=>x-y);}return adj;};
`;
// TS_PRELUDE: bản có type của JS_PRELUDE (tsc bắt khai báo fields; --lib es2020 để né DOM Node)
const TS_PRELUDE = `
class ListNode{val:number;next:ListNode|null;constructor(val=0,next:any=null){this.val=val;this.next=next;}}
class TreeNode{val:number;left:TreeNode|null;right:TreeNode|null;constructor(val=0,left:any=null,right:any=null){this.val=val;this.left=left;this.right=right;}}
class NNode{val:number;neighbors:NNode[];constructor(val=0,neighbors:NNode[]=[]){this.val=val;this.neighbors=neighbors;}}
class GraphNode{val:number;neighbors:GraphNode[];constructor(val=0,neighbors:GraphNode[]=[]){this.val=val;this.neighbors=neighbors;}}
const L=(a:number[]):ListNode|null=>{const d=new ListNode();let c:ListNode=d;for(const v of a){c.next=new ListNode(v);c=c.next;}return d.next;};
const A=(h:ListNode|null):number[]=>{const r:number[]=[];while(h){r.push(h.val);h=h.next;}return r;};
const T=(a:any[]):TreeNode|null=>{if(!a.length||a[0]==null)return null;const r=new TreeNode(a[0]);const q:TreeNode[]=[r];let i=1;while(q.length&&i<a.length){const n=q.shift()!;if(i<a.length&&a[i]!=null){n.left=new TreeNode(a[i]);q.push(n.left);}i++;if(i<a.length&&a[i]!=null){n.right=new TreeNode(a[i]);q.push(n.right);}i++;}return r;};
const TA=(t:TreeNode|null):any[]=>{if(!t)return[];const r:any[]=[];const q:any[]=[t];while(q.length){const n=q.shift();if(n){r.push(n.val);q.push(n.left);q.push(n.right);}else r.push(null);}while(r.length&&r[r.length-1]==null)r.pop();return r;};
const G=(a:number[][]):GraphNode|null=>{const ns=a.map((_,i)=>new GraphNode(i+1,[]));ns.forEach((n,i)=>{n.neighbors=a[i].map(j=>ns[j-1]);});return ns.length?ns[0]:null;};
const GA=(s:GraphNode|null):number[][]=>{if(!s)return[];const seen=new Map<GraphNode,number>();const q:GraphNode[]=[s];seen.set(s,0);const adj:number[][]=[[]];while(q.length){const n=q.shift()!;const id=seen.get(n)!;const row:number[]=[];for(const nb of n.neighbors){if(!seen.has(nb)){seen.set(nb,seen.size);q.push(nb);adj.push([]);}row.push(nb.val);}row.sort((x,y)=>x-y);adj[id]=row;}return adj;};
`;
const PY_PRELUDE = `
import heapq, math, collections, functools, itertools, json
from typing import Optional, List, Dict, Set
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val; self.neighbors = neighbors if neighbors is not None else []
class GraphNode:
    def __init__(self, val=0, neighbors=None):
        self.val = val; self.neighbors = neighbors if neighbors is not None else []
def L(a):
    d = ListNode(); c = d
    for v in a: c.next = ListNode(v); c = c.next
    return d.next
def A(h):
    r = []
    while h: r.append(h.val); h = h.next
    return r
def T(a):
    if not a or a[0] is None: return None
    r = TreeNode(a[0]); q = [r]; i = 1
    while q and i < len(a):
        n = q.pop(0)
        if i < len(a) and a[i] is not None: n.left = TreeNode(a[i]); q.append(n.left)
        i += 1
        if i < len(a) and a[i] is not None: n.right = TreeNode(a[i]); q.append(n.right)
        i += 1
    return r
def TA(t):
    if not t: return []
    r = []; q = [t]
    while q:
        n = q.pop(0)
        if n: r.append(n.val); q.append(n.left); q.append(n.right)
        else: r.append(None)
    while r and r[-1] is None: r.pop()
    return r
def G(a):
    ns = [GraphNode(i + 1, []) for i in range(len(a))]
    for i, n in enumerate(ns): n.neighbors = [ns[j - 1] for j in a[i]]
    return ns[0] if ns else None
def GA(s):
    if not s: return []
    seen = {id(s): 0}; q = [s]; adj = []
    while q:
        n = q.pop(0); i = seen[id(n)]; adj.append([])
        for nb in n.neighbors:
            if id(nb) not in seen: seen[id(nb)] = len(seen); q.append(nb)
            adj[i].append(nb.val)
        adj[i].sort()
    return adj
`;
const JAVA_PRELUDE = `
import java.util.*;
class ListNode{int val;ListNode next;ListNode(){this(0);}ListNode(int v){val=v;}ListNode(int v,ListNode n){val=v;next=n;}}
class TreeNode{int val;TreeNode left;TreeNode right;TreeNode(int v){val=v;}TreeNode(int v,TreeNode l,TreeNode r){val=v;left=l;right=r;}}
class Node{int val;List<Node> neighbors;Node(){this(0);}Node(int v){val=v;neighbors=new ArrayList<>();}Node(int v,List<Node> nb){val=v;neighbors=nb;}}
`;
const JAVA_HELPERS = `
static ListNode L(int... a){ListNode d=new ListNode();ListNode c=d;for(int v:a){c.next=new ListNode(v);c=c.next;}return d.next;}
static List<Integer> A(ListNode h){List<Integer> r=new ArrayList<>();while(h!=null){r.add(h.val);h=h.next;}return r;}
static TreeNode T(Integer... a){if(a.length==0||a[0]==null)return null;TreeNode r=new TreeNode(a[0]);Queue<TreeNode> q=new LinkedList<>();q.add(r);int i=1;while(!q.isEmpty()&&i<a.length){TreeNode n=q.poll();if(i<a.length&&a[i]!=null){n.left=new TreeNode(a[i]);q.add(n.left);}i++;if(i<a.length&&a[i]!=null){n.right=new TreeNode(a[i]);q.add(n.right);}i++;}return r;}
static List<Object> TA(TreeNode t){List<Object> r=new ArrayList<>();if(t==null)return r;Queue<TreeNode> q=new LinkedList<>();q.add(t);while(!q.isEmpty()){TreeNode n=q.poll();if(n!=null){r.add(n.val);q.add(n.left);q.add(n.right);}else r.add(null);}while(!r.isEmpty()&&r.get(r.size()-1)==null)r.remove(r.size()-1);return r;}
static Node G(int[][] a){List<Node> ns=new ArrayList<>();for(int i=0;i<a.length;i++)ns.add(new Node(i+1));for(int i=0;i<a.length;i++){for(int j:a[i])ns.get(i).neighbors.add(ns.get(j-1));}return ns.isEmpty()?null:ns.get(0);}
static List<List<Integer>> GA(Node s){List<List<Integer>> adj=new ArrayList<>();if(s==null)return adj;Map<Node,Integer> seen=new IdentityHashMap<>();Queue<Node> q=new LinkedList<>();seen.put(s,0);q.add(s);adj.add(new ArrayList<>());while(!q.isEmpty()){Node n=q.poll();int id=seen.get(n);List<Integer> row=new ArrayList<>();for(Node nb:n.neighbors){if(!seen.containsKey(nb)){seen.put(nb,seen.size());q.add(nb);adj.add(new ArrayList<>());}row.add(nb.val);}Collections.sort(row);adj.set(id,row);}return adj;}
static String quote(String s){return "\\""+s.replace("\\\\","\\\\\\\\").replace("\\"","\\\\\\"").replace("\\n","\\\\n")+"\\"";}
static String canon(Object o){
 if(o==null)return "null";
 if(o instanceof String s)return quote(s);
 if(o instanceof Character c)return quote(String.valueOf(c));
 if(o instanceof Boolean||o instanceof Number)return o.toString();
 if(o instanceof int[] a){StringJoiner j=new StringJoiner(",","[","]");for(int v:a)j.add(canon(v));return j.toString();}
 if(o instanceof long[] a){StringJoiner j=new StringJoiner(",","[","]");for(long v:a)j.add(canon(v));return j.toString();}
 if(o instanceof double[] a){StringJoiner j=new StringJoiner(",","[","]");for(double v:a)j.add(canon(v));return j.toString();}
 if(o instanceof boolean[] a){StringJoiner j=new StringJoiner(",","[","]");for(boolean v:a)j.add(canon(v));return j.toString();}
 if(o instanceof char[] a){StringJoiner j=new StringJoiner(",","[","]");for(char v:a)j.add(canon(v));return j.toString();}
 if(o instanceof Object[] a){StringJoiner j=new StringJoiner(",","[","]");for(Object v:a)j.add(canon(v));return j.toString();}
 if(o instanceof List l){StringJoiner j=new StringJoiner(",","[","]");for(Object v:l)j.add(canon(v));return j.toString();}
 if(o instanceof TreeNode t)return canon(TA(t));
 if(o instanceof ListNode h)return canon(A(h));
 return quote(o.toString());
}
`;
const CPP_PRELUDE = `
#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int v=0,ListNode*n=nullptr):val(v),next(n){}};
struct TreeNode{int val;TreeNode*left;TreeNode*right;TreeNode(int v=0,TreeNode*l=nullptr,TreeNode*r=nullptr):val(v),left(l),right(r){}};
struct Node{int val;vector<Node*>neighbors;Node(int v=0):val(v){}};
ListNode* L(std::vector<int> a){ListNode d;ListNode*c=&d;for(int v:a){c->next=new ListNode(v);c=c->next;}return d.next;}
std::vector<int> A(ListNode*h){std::vector<int> r;while(h){r.push_back(h->val);h=h->next;}return r;}
TreeNode* T(std::vector<std::optional<int>> a){if(a.empty()||!a[0])return nullptr;TreeNode*r=new TreeNode(*a[0]);std::queue<TreeNode*>q;q.push(r);size_t i=1;while(!q.empty()&&i<a.size()){TreeNode*n=q.front();q.pop();if(i<a.size()&&a[i]){n->left=new TreeNode(*a[i]);q.push(n->left);}i++;if(i<a.size()&&a[i]){n->right=new TreeNode(*a[i]);q.push(n->right);}i++;}return r;}
std::string canon(std::string s){std::string o="\\"";for(char c:s){if(c=='\\\\'||c=='\\"')o+='\\\\';o+=c;}return o+"\\"";}
std::string canon(const char*s){return canon(std::string(s));}
std::string canon(char c){return canon(std::string(1,c));}
std::string canon(bool b){return b?"true":"false";}
std::string canon(int v){return std::to_string(v);}
std::string canon(long v){return std::to_string(v);}
std::string canon(long long v){return std::to_string(v);}
std::string canon(double d){std::ostringstream o;o<<std::setprecision(17)<<d;return o.str();}
template<typename T> std::string canon(const std::vector<T>& v){std::string o="[";for(size_t i=0;i<v.size();i++){if(i)o+=",";o+=canon(v[i]);}return o+"]";}
std::string canon(TreeNode*t){if(!t)return "[]";std::vector<std::string> r;std::queue<TreeNode*>q;q.push(t);while(!q.empty()){TreeNode*n=q.front();q.pop();if(n){r.push_back(std::to_string(n->val));q.push(n->left);q.push(n->right);}else r.push_back("null");}while(!r.empty()&&r.back()=="null")r.pop_back();std::string o="[";for(size_t i=0;i<r.size();i++){if(i)o+=",";o+=r[i];}return o+"]";}
std::string canon(ListNode*h){return canon(A(h));}
Node* G(std::vector<std::vector<int>> a){std::vector<Node*>ns;for(size_t i=0;i<a.size();i++)ns.push_back(new Node(i+1));for(size_t i=0;i<a.size();i++)for(int j:a[i])ns[i]->neighbors.push_back(ns[j-1]);return ns.empty()?nullptr:ns[0];}
std::string GAc(Node*s){if(!s)return "[]";std::map<Node*,int> seen;std::queue<Node*>q;seen[s]=0;q.push(s);std::vector<std::vector<int>> adj(1);while(!q.empty()){Node*n=q.front();q.pop();int id=seen[n];for(Node*nb:n->neighbors){if(!seen.count(nb)){seen[nb]=seen.size();q.push(nb);adj.push_back({});}adj[id].push_back(nb->val);}std::sort(adj[id].begin(),adj[id].end());}return canon(adj);}
`;
const CS_PRELUDE = `
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
public class ListNode{public int val;public ListNode next;public ListNode(int v=0,ListNode n=null){val=v;next=n;}}
public class TreeNode{public int val;public TreeNode left;public TreeNode right;public TreeNode(int v=0,TreeNode l=null,TreeNode r=null){val=v;left=l;right=r;}}
public class Node{public int val;public IList<Node> neighbors;public Node(int v=0){val=v;neighbors=new List<Node>();}}
public static class H{
 public static ListNode L(int[] a){var d=new ListNode();var c=d;foreach(var v in a){c.next=new ListNode(v);c=c.next;}return d.next;}
 public static List<int> A(ListNode h){var r=new List<int>();while(h!=null){r.Add(h.val);h=h.next;}return r;}
 public static TreeNode T(int?[] a){if(a.Length==0||a[0]==null)return null;var r=new TreeNode(a[0].Value);var q=new Queue<TreeNode>();q.Enqueue(r);int i=1;while(q.Count>0&&i<a.Length){var n=q.Dequeue();if(i<a.Length&&a[i]!=null){n.left=new TreeNode(a[i].Value);q.Enqueue(n.left);}i++;if(i<a.Length&&a[i]!=null){n.right=new TreeNode(a[i].Value);q.Enqueue(n.right);}i++;}return r;}
 public static List<object> TA(TreeNode t){var r=new List<object>();if(t==null)return r;var q=new Queue<TreeNode>();q.Enqueue(t);while(q.Count>0){var n=q.Dequeue();if(n!=null){r.Add(n.val);q.Enqueue(n.left);q.Enqueue(n.right);}else r.Add(null);}while(r.Count>0&&r[r.Count-1]==null)r.RemoveAt(r.Count-1);return r;}
 public static Node G(int[][] a){var ns=a.Select((_,i)=>new Node(i+1)).ToList();for(int i=0;i<a.Length;i++)foreach(var j in a[i])ns[i].neighbors.Add(ns[j-1]);return ns.Count==0?null:ns[0];}
 public static List<List<int>> GA(Node s){var adj=new List<List<int>>();if(s==null)return adj;var seen=new Dictionary<Node,int>();var q=new Queue<Node>();seen[s]=0;q.Enqueue(s);adj.Add(new List<int>());while(q.Count>0){var n=q.Dequeue();int id=seen[n];var row=new List<int>();foreach(var nb in n.neighbors){if(!seen.ContainsKey(nb)){seen[nb]=seen.Count;q.Enqueue(nb);adj.Add(new List<int>());}row.Add(nb.val);}row.Sort();adj[id]=row;}return adj;}
 public static string quote(string s)=>"\\""+s.Replace("\\\\","\\\\\\\\").Replace("\\"","\\\\\\"")+"\\"";
 public static string canon(string s)=>quote(s);
 public static string canon(char c)=>quote(c.ToString());
 public static string canon(bool b)=>b?"true":"false";
 public static string canon(int v)=>v.ToString();
 public static string canon(long v)=>v.ToString();
 public static string canon(double v)=>v.ToString("R");
 public static string canon(int[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(long[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(double[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(bool[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(char[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(string[] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(int[][] a)=>"["+string.Join(",",a.Select(canon))+"]";
 public static string canon(char[][] a)=>"["+string.Join(",",a.Select(r=>canon(new string(r))))+"]";
 public static string canon<T>(IList<T> l)=>"["+string.Join(",",l.Select(x=>x==null?"null":canon((dynamic)x)))+"]";
 public static string canon(TreeNode t)=>canon(TA(t));
 public static string canon(ListNode h)=>canon(A(h));
}
`;

// Nếu snippet TỰ định nghĩa class Node TOP-LEVEL (clone-graph java/cpp...) → bỏ Node của prelude.
// Class Node LỒNG NHAU (VD private class Node trong Trie C#) không tính.
const TOP_NODE_RE = /^(public\s+)?(class|struct)\s+Node\s*[{]/m;
const stripNode = (pre, code, kind) => {
  if (!TOP_NODE_RE.test(code)) return pre;
  if (kind === 'js' || kind === 'java' || kind === 'cs' || kind === 'cpp') {
    return stripFn(pre, kind === 'cpp' ? 'struct Node' : 'class Node');
  }
  return pre;
};
// xóa 1 function/method khỏi source (cân bằng ngoặc), từ marker tới } đóng tương ứng
const stripFn = (src, marker) => {
  const i = src.indexOf(marker);
  if (i < 0) return src;
  const open = src.indexOf('{', i);
  let d = 0;
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') d++;
    else if (src[j] === '}') {
      d--;
      if (d === 0) return (src.slice(0, i) + src.slice(j + 1)).replace(/[ \t]*\n(\s*\n)?/, '\n');
    }
  }
  return src;
};
// test có dùng builder graph G/GA không (không → khỏi emit, tránh treo Node)
const usesGraph = (tests, lang, pick) =>
  tests.some((t) => {
    const v = typeof t[lang] === 'string' ? { stmts: [], ret: t[lang] } : t[lang] ?? { stmts: [], ret: '' };
    const all = [...(v.stmts ?? []), v.ret ?? ''].join('\n');
    return lang === 'cs' ? /H\.GA?\(/.test(all) : /\bGA?\(/.test(all);
  });

// ---------- builders per language ----------
const asStmts = (v) => (typeof v === 'string' ? { stmts: [], ret: v } : v);

function buildJS(code, tests) {
  // mỗi test bọc block riêng (tránh const trùng tên giữa các tests)
  const lines = tests.map((t) => {
    const v = asStmts(t.js ?? t.ts);
    return `{\n${[...v.stmts, `console.log("RESULT:"+JSON.stringify(${v.ret}));`].join('\n')}\n}`;
  });
  return `${stripNode(JS_PRELUDE, code, 'js')}\n${code}\n${lines.join('\n')}\n`;
}
function buildTS(code, tests) {
  const lines = tests.map((t) => {
    const v = asStmts(t.ts ?? t.js);
    return `{\n${[...v.stmts, `console.log("RESULT:"+JSON.stringify(${v.ret}));`].join('\n')}\n}`;
  });
  return `${TS_PRELUDE}\n${code}\n${lines.join('\n')}\n`;
}
const pyArg = (a) => JSON.stringify(a).replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None');
function buildPY(code, tests) {
  const lines = tests.map((t) => {
    const v = asStmts(t.py);
    return [...v.stmts, `print("RESULT:"+json.dumps(${v.ret}, default=lambda o: sorted(o) if isinstance(o,set) else list(o) if isinstance(o,(tuple,)) else str(o)))`].join('\n');
  });
  return `${PY_PRELUDE}\n${code}\n${lines.join('\n')}\n`;
}
function buildJAVA(code, tests) {
  const lines = tests.map((t) => {
    const v = asStmts(t.java);
    return `{\n${[...v.stmts.map((s) => (s.trim().endsWith(';') ? s : s + ';')), `System.out.println("RESULT:"+canon(${v.ret}));`].join('\n')}\n}`;
  });
  let helpers = JAVA_HELPERS;
  if (!usesGraph(tests, 'java')) {
    helpers = helpers.split('\n').filter((l) => !l.startsWith('static Node G(') && !l.startsWith('static List<List<Integer>> GA(')).join('\n');
  }
  return `${stripNode(JAVA_PRELUDE, code, 'java')}\n${code}\npublic class Main{\n${helpers}\npublic static void main(String[] argv){\n${lines.join('\n')}\n}}\n`;
}
// CPP: tách HEAD (includes+structs+canon, trước snippet) và TAIL (builders, sau snippet)
// vì C++ cần khai báo trước khi dùng: builders G/GAc phải thấy Node của snippet (nếu có)
const CPP_TAIL_MARK = 'ListNode* L(std::vector<int> a)';
function buildCPP(code, tests) {
  const lines = tests.map((t) => {
    const v = asStmts(t.cpp);
    // ret bắt đầu bằng RAW: → expr đã là JSON text (VD GAc(...)), in trực tiếp khỏi canon
    const out = v.ret.startsWith('RAW:')
      ? `std::cout<<"RESULT:"<<(${v.ret.slice(4)})<<"\\n";`
      : `std::cout<<"RESULT:"<<canon(${v.ret})<<"\\n";`;
    return `{\n${[...v.stmts.map((s) => (s.trim().endsWith(';') ? s : s + ';')), out].join('\n')}\n}`;
  });
  const headEnd = CPP_PRELUDE.indexOf(CPP_TAIL_MARK);
  let head = CPP_PRELUDE.slice(0, headEnd);
  let tail = CPP_PRELUDE.slice(headEnd);
  // snippet tự định nghĩa Node → bỏ Node của prelude (ở HEAD), builders (TAIL) dùng Node của snippet
  if (TOP_NODE_RE.test(code)) {
    head = stripNode(head, code, 'cpp');
  }
  if (!usesGraph(tests, 'cpp')) {
    tail = tail.split('\n').filter((l) => !l.startsWith('Node* G(') && !l.startsWith('std::string GAc(')).join('\n');
  }
  return `${head}\n${code}\n${tail}\nint main(){\n${lines.join('\n')}\nreturn 0;}\n`;
}
function buildCS(code, tests) {
  const lines = tests.map((t) => {
    const v = asStmts(t.cs);
    return `{\n${[...v.stmts.map((s) => (s.trim().endsWith(';') ? s : s + ';')), `System.Console.WriteLine("RESULT:"+H.canon(${v.ret}));`].join('\n')}\n}`;
  });
  const body = /class\s+\w+/.test(code) ? code : `public class Sol{\n${code}\n}`;
  let pre = stripNode(CS_PRELUDE, code, 'cs');
  if (!usesGraph(tests, 'cs')) {
    pre = stripFn(pre, 'public static Node G(');
    pre = stripFn(pre, 'public static List<List<int>> GA(');
  }
  return `${pre}\n${body}\npublic class Program{\npublic static void Main(){\n${lines.join('\n')}\n}}\n`;
}

// ---------- runners ----------
const runners = {
  js: (src, dir) => { const f = path.join(dir, 't.mjs'); fs.writeFileSync(f, src); return run('node', [f]); },
  ts: (src, dir) => {
    // tsc thật (strip-types không chịu parameter properties, enums...)
    const f = path.join(dir, 't.ts');
    fs.writeFileSync(f, src);
    const tscJs = path.join(ROOT, 'node_modules', 'typescript', 'lib', 'tsc.js');
    const c = run(process.execPath, [tscJs, f, '--outDir', dir, '--module', 'commonjs', '--target', 'es2020', '--lib', 'es2020', '--strict', 'false', '--skipLibCheck']);
    if (!c.ok) return { ok: false, out: 'COMPILE:\n' + c.out };
    return run('node', [path.join(dir, 't.js')]);
  },
  py: (src, dir) => { const f = path.join(dir, 't.py'); fs.writeFileSync(f, src); return run('python', [f]); },
  java: (src, dir) => {
    const f = path.join(dir, 'Main.java'); fs.writeFileSync(f, src);
    const c = run('javac', ['-nowarn', f]);
    if (!c.ok) return { ok: false, out: 'COMPILE:\n' + c.out };
    return run('java', ['-cp', dir, 'Main']);
  },
  cpp: (src, dir) => {
    const f = path.join(dir, 't.cpp'); fs.writeFileSync(f, src);
    const exe = path.join(dir, 't.exe');
    const c = run('g++', ['-std=c++17', '-O1', '-o', exe, f]);
    if (!c.ok) return { ok: false, out: 'COMPILE:\n' + c.out };
    return run(exe, []);
  },
  cs: (src, dir) => {
    // project dùng chung trong tmpBase (restore 1 lần, mỗi test chỉ build增量)
    const proj = path.join(tmpBase, 'csproj');
    if (!fs.existsSync(proj)) {
      fs.mkdirSync(proj, { recursive: true });
      fs.writeFileSync(path.join(proj, 't.csproj'), `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>disable</Nullable>
    <ImplicitUsings>disable</ImplicitUsings>
    <AssemblyName>t</AssemblyName>
  </PropertyGroup>
</Project>
`);
    }
    fs.writeFileSync(path.join(proj, 'Program.cs'), src);
    const c = run('dotnet', ['build', proj, '-v', 'q', '--nologo', '-clp:ErrorsOnly'], undefined, 180000);
    if (!c.ok) return { ok: false, out: 'COMPILE:\n' + c.out };
    return run('dotnet', [path.join(proj, 'bin', 'Debug', 'net10.0', 't.dll')], undefined, 90000);
  },
};
const builders = { js: buildJS, ts: buildTS, py: buildPY, java: buildJAVA, cpp: buildCPP, cs: buildCS };

// ---------- main ----------
for (const [slug, spec] of Object.entries(TESTS)) {
  if (SLUGF && slug !== SLUGF) continue;
  const entry = SOLUTIONS[slug];
  if (!entry) { failLine(`${slug}: thiếu SOLUTIONS entry`); continue; }
  console.log(`\n## ${slug}`);
  for (const lang of LANGS) {
    const code = entry[CODEKEY[lang]];
    if (!code) { failLine(`${slug}[${lang}]: thiếu code`); continue; }
    const usable = spec.tests.filter((t) => t[lang] ?? (lang === 'ts' ? t.js : undefined));
    if (!usable.length) { console.log(`  -- ${slug}[${lang}]: no tests`); continue; }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't-'));
    const src = builders[lang](code, usable);
    const r = runners[lang](src, dir);
    if (!r.ok) { failLine(`${slug}[${lang}]: RUN ERROR\n${String(r.out).split('\n').slice(0, 12).join('\n')}`); continue; }
    const got = parseResults(r.out);
    if (got.length !== usable.length) {
      failLine(`${slug}[${lang}]: got ${got.length}/${usable.length} RESULT lines\n${String(r.out).split('\n').slice(0, 10).join('\n')}`);
      continue;
    }
    usable.forEach((t, i) => {
      let actual;
      try { actual = JSON.parse(got[i]); }
      catch { failLine(`${slug}[${lang}]#${i}: RESULT không phải JSON: ${got[i].slice(0, 120)}`); return; }
      const exp = t.norm === 'sortDeep' ? sortDeep(t.expect) : t.expect;
      const act = t.norm === 'sortDeep' ? sortDeep(actual) : actual;
      if (eqTol(act, exp, t.tol)) { pass++; }
      else failLine(`${slug}[${lang}]#${i}: expect ${JSON.stringify(exp).slice(0, 160)} got ${JSON.stringify(act).slice(0, 160)}`);
    });
    if (!failures.some((f) => f.startsWith(`${slug}[${lang}]`))) okLine(`${slug}[${lang}]: ${usable.length} tests pass`);
  }
}
console.log(`\n==== pass=${pass} fail=${fail} ====`);
process.exit(fail === 0 ? 0 : 1);
