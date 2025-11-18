# 生成系マルチモーダル設計ツール仕様（AI 指示用）

このファイルは、AI がコード生成・修正・設計支援を行うための「仕様原本」である。  
ここに書かれている内容を変更・拡張するときは、必ずユーザーからの明示指示を前提とすること。

---

## 1. ツールの目的

- Narrative（物語構造）
- Geometry（構図・カメラ・キャラ配置）
- Prompt（画像生成プロンプト）

を、単一の JSON / AST で統合する「生成系マルチモーダル設計ツール」を構築する。

このツールは次を実現する。

- 物語イベント（NarrativeGraph のノード）を選択すると、そのイベントに対応した構図プリセットから Geometry が生成される。
- Canvas 上でキャラクターやカメラ位置を編集すると、Geometry から Prompt（画像生成用テキスト）が自動更新される。
- Character / World の設定を変えると、生成される Prompt の内容（外見・雰囲気・背景）が変化する。

実装上の前提:

- 言語: JavaScript（ES5〜ES2020 程度、ビルド不要想定）
- UI: ブラウザ（HTML + Canvas）
- 実行: `index.html` をダブルクリックで開くだけで動作する構成
- データ保存形式: 単一 JSON (`Project`) を `project-data.js` 内に埋め込む

---

## 2. 全体アーキテクチャ

### 2.1 層構造

1. IR 層（データモデル）
   - `Project` / `Scene` / `NarrativeGraph` / `GeometryComposition` / `ImagePromptSpec` / `Character` / `WorldDefinition`
   - すべて JSON シリアライズ可能なオブジェクト構造で定義する。

2. Logic 層（純関数）
   - Narrative → Geometry: `updateGeometryFromNarrative(scene, project)`
   - CanvasState ⇔ Geometry: `canvasStateToGeometry`, `geometryToCanvasState`
   - Geometry + Characters + World → Prompt: `updatePromptFromScene(scene, project)`

3. UI 層
   - 左: Scene / Narrative 情報
   - 中央: Canvas（`GeometryBoard`）
   - 右: Prompt インスペクタ（タグと raw プロンプト表示）

4. Storage / Adapter 層
   - `project-data.js` に `window.defaultProject` として埋め込む。
   - 将来的に JSON ファイルとして入出力する余地を残す。

---

## 3. IR（中間表現）仕様

### 3.1 型表記について

- 以下の記述は TypeScript 風だが、実装は素の JS オブジェクトでよい。
- ここで定義されたフィールド名・構造は、AI がコードを書く際の参照元とする。

### 3.2 共通型

```typescript
type ID = string;

interface Vec2 { x: number; y: number; }
interface Vec3 { x: number; y: number; z: number; }
```

### 3.3 Project

```typescript
interface Project {
  id: ID;
  name: string;
  version: string;          // 例: "0.1.0"
  characters: Character[];
  world: WorldDefinition | null;
  scenes: Scene[];
}
```

### 3.4 Scene

```typescript
interface Scene {
  id: ID;
  name: string;
  narrativeGraph: NarrativeGraph;
  focusNodeId: ID | null;      // 現在構図生成対象となるノード
  geometry: GeometryComposition;
  prompt: ImagePromptSpec;
}
```

### 3.5 NarrativeGraph

```typescript
interface NarrativeGraph {
  nodes: NarrativeNode[];
  edges: NarrativeEdge[];
}

type NarrativeNodeType = "Event" | "Decision" | "Condition" | "Outcome";

type CompositionPreset =
  | "face_off"        // 対峙構図
  | "rush_towards"    // カメラに向かって突進
  | "overhead_crowd"  // 群衆俯瞰
  | "hero_walkaway"   // 背中を見せて歩き去る
  | "none";

interface NarrativeNode {
  id: ID;
  type: NarrativeNodeType;
  label: string;
  description?: string;
  tags?: string[];
  compositionPreset?: CompositionPreset;
  payload?: any;
}

type NarrativeRelation =
  | "cause"
  | "time"
  | "branch"
  | "merge";

interface NarrativeEdge {
  id: ID;
  from: ID;
  to: ID;
  relation: NarrativeRelation;
}
```

### 3.6 GeometryComposition

```typescript
interface GeometryComposition {
  camera: CameraSpec;
  objects: GeometryObject[];
  guides: GuideLine[];
}

type CameraProjection = "orthographic" | "perspective";

interface CameraSpec {
  id: ID;
  projection: CameraProjection;
  eye: Vec3;       // 視点
  target: Vec3;    // 注視点
  up: Vec3;        // 上方向
  fovDeg?: number; // 透視時のみ使用
}
```

#### GeometryObject

```typescript
type GeometryObjectType = "character" | "prop" | "background" | "effect";

interface PoseHint {
  facing: "camera" | "left" | "right" | "back" | "up" | "down";
  action?: string;      // "draw_sword", "rush_forward", "ready_to_attack" 等
}

interface GeometryObject {
  id: ID;
  type: GeometryObjectType;
  refId?: ID;           // Character.id 等
  label: string;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  layer: number;        // 0 = 背景、数値が大きいほど手前
  poseHint?: PoseHint;
}
```

#### GuideLine

```typescript
type GuideLineType = "horizon" | "vanishingLine" | "diagonal" | "custom";

interface GuideLine {
  id: ID;
  type: GuideLineType;
  p1: Vec2;         // 画面空間（0〜1 の正規化座標など）
  p2: Vec2;
  meta?: any;
}
```

### 3.7 ImagePromptSpec

```typescript
interface ImagePromptSpec {
  id: ID;
  language: "en" | "ja";
  mainSubject: string;
  styleTags: string[];
  compositionTags: string[];
  environmentTags: string[];
  actionTags: string[];
  cameraTags: string[];
  extraNegativeTags: string[];
  rawPrompt?: string;   // 最終プロンプト文字列（キャッシュ）
}
```

### 3.8 Character / WorldDefinition

```typescript
interface CharacterVisualSpec {
  gender?: string;          // "female" 等
  ageApprox?: string;       // "late teens" 等
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  build?: string;
  clothingTags?: string[];
  accessoryTags?: string[];
}

interface Character {
  id: ID;
  name: string;
  role: string;             // "protagonist", "antagonist" 等
  visual: CharacterVisualSpec;
  ability?: any;            // AbilitySpec を後で定義してもよい
  narrativeTags?: string[];
}

interface WorldDefinition {
  id: ID;
  name: string;
  genreTags: string[];            // "urban fantasy", "isekai" 等
  techLevel?: string;             // "modern" 等
  magicSystem?: string;
  visualAtmosphereTags?: string[];// "night city", "neon lights" 等
}
```

---

## 実装状況

現在、以下のファイルが実装済み：

- ✅ index.html - メインUI
- ✅ project-data.js - サンプルデータ
- ✅ geometry-adapter.js - 変換ロジック
- ✅ prompt-core.js - プロンプト生成
- ✅ narrative-geometry.js - 構図プリセット
- ✅ geometry-board.js - Canvas管理
- ✅ main.js - アプリケーション統合

すべての仕様に準拠した実装が完了しています。
