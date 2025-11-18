# マルチモーダルシーン設計ツール - PoC

物語構造、シーン構図、画像生成プロンプトを単一のJSON/AST表現で接続するWebベースツールキット

## 🎯 このツールでできること

- 📖 **物語 → 構図**: ストーリーイベントを定義すると、自動的にシーン構図が生成される
- 🎨 **構図エディタ**: キャラクターやカメラ位置を視覚的に配置
- 🤖 **自動プロンプト生成**: シーン構図から詳細な画像生成プロンプトを自動生成
- 💾 **単一JSONフォーマット**: キャラクター、世界観、シーン、構図、プロンプトをすべて1ファイルで管理

## 🚀 クイックスタート

### 1. アプリケーションを開く

```
index.html をモダンブラウザ（Chrome, Firefox, Edge）で開くだけ
ビルドプロセスは不要です！
```

### 2. インターフェースを探索

- **左パネル**: シーン情報とカメラプリセット
- **中央キャンバス**: インタラクティブな構図エディタ（キャラクターをドラッグして移動）
- **右パネル**: 生成されたプロンプトとタグ

### 3. 試してみよう

- キャンバス上のキャラクター（円）をドラッグして移動
- カメラプリセットボタン（Overhead/Eye Level）で視点を変更
- 「🔄 Update Prompt」をクリックして現在のレイアウトに基づいてプロンプトを再生成

## 💡 動作原理

### データフロー

```
物語グラフ → 構図 → 画像プロンプト
     ↓         ↓          ↓
  イベント  カメラ＋オブジェクト  テキストプロンプト
                ↕
           Canvasエディタ
```

### コアコンポーネント

1. **IR（中間表現）**
   - `Project` → キャラクター、世界観、シーンを含む
   - `Scene` → 物語、構図、プロンプトを含む
   - `GeometryComposition` → カメラ + オブジェクト + ガイド

2. **ロジックモジュール**
   - `prompt-core.js` → 構図/キャラクター/世界観からタグを導出
   - `narrative-geometry.js` → 物語プリセットから構図を生成
   - `geometry-adapter.js` → Canvas状態とIR間の変換

3. **UI**
   - `geometry-board.js` → Canvas管理と可視化
   - `main.js` → アプリケーション統合

## 📂 ファイル構造

```
multimodal-designer/
├── index.html              # メインHTML（UIレイアウト）
├── project-data.js         # サンプルプロジェクトJSON
├── geometry-adapter.js     # Canvas ↔ Geometry 変換
├── prompt-core.js          # プロンプト生成ロジック
├── narrative-geometry.js   # 構図プリセット
├── geometry-board.js       # Canvas管理
├── main.js                 # アプリケーション初期化
├── SPEC.md                 # 技術仕様書
└── README.md               # このファイル
```

## 📝 出力例

デフォルトシーン（屋上での対決）で、システムは以下のようなプロンプトを生成します：

```
a late teens female, with blue short hair, wearing school uniform, 
holding a katana, drawing a sword, hero on the left, enemy on the right, 
face-to-face confrontation, eye-level shot, medium shot, standard lens, 
night city, neon lights, light rain, urban fantasy atmosphere
```

## 🎨 カスタマイズ

### プロジェクトデータの変更

`project-data.js` を編集して以下を変更できます：
- キャラクター（外見、役割、能力）
- 世界設定（雰囲気、ジャンル）
- シーン構図（位置、カメラアングル）

### 構図プリセットの追加

`narrative-geometry.js` に新しいプリセットを追加：

```javascript
function makeCustomGeometry(scene, project) {
  return {
    camera: { ... },
    objects: [ ... ],
    guides: []
  };
}
```

## 🎮 操作方法

### キャラクター移動
- キャンバス上のキャラクター（円）をクリック＆ドラッグ
- 選択中のキャラクターはオレンジ色にハイライト

### カメラ切り替え
- **Overhead**: 真上からの俯瞰視点
- **Eye Level**: 目線の高さからの視点

### プロンプト更新
- キャラクター配置を変更後、「Update Prompt」をクリック
- 構図タグとカメラタグが自動的に再計算されます

### 物語プリセット適用
- 「Apply Narrative Preset」をクリックして、選択中のイベントの構図プリセットを適用
- プリセット: face_off, rush_towards, overhead_crowd, hero_walkaway

## 🔧 技術詳細

- **依存関係なし**: Pure HTML5 Canvas + Vanilla JavaScript
- **ブラウザ互換性**: Canvas API対応のモダンブラウザ
- **データ形式**: JSONベースの中間表現
- **アーキテクチャ**: レイヤー構造（IR → Logic → UI）

## 🚀 今後の拡張予定

- [ ] 複数シーン対応
- [ ] 物語グラフの視覚エディタ
- [ ] より高度なカメラプロジェクション
- [ ] プロジェクトファイルのエクスポート/インポート
- [ ] Three.jsによる3Dプレビュー
- [ ] 構図ガイドオーバーレイ（三分割法、黄金比）
- [ ] キャラクターポーズのプリセット
- [ ] リアルタイムプレビュー

## 📖 仕様書

詳細な技術仕様は `SPEC.md` を参照してください。

## 🎓 コンセプト

物語構造、幾何学的構図、生成AI プロンプティングを組み合わせたマルチモーダル設計手法に基づいています。

## 📄 ライセンス

MIT

---

**開発ノート**: このツールは、映像制作やゲーム開発における「絵コンテ」「レイアウト」「プロンプトエンジニアリング」を統合的に扱うための実験的プロトタイプです。
