# クイックスタートガイド

## 📥 ステップ1: ファイルをダウンロード

以下の7つのファイルをすべて同じフォルダにダウンロードしてください：

1. index.html
2. project-data.js
3. geometry-adapter.js
4. prompt-core.js
5. narrative-geometry.js
6. geometry-board.js
7. main.js

## 📂 ステップ2: フォルダ構成を確認

```
multimodal-designer/
├── index.html              ← これをダブルクリック！
├── project-data.js
├── geometry-adapter.js
├── prompt-core.js
├── narrative-geometry.js
├── geometry-board.js
└── main.js
```

## 🚀 ステップ3: 起動

`index.html` をダブルクリックするだけ！
（またはブラウザにドラッグ&ドロップ）

## 🎮 ステップ4: 基本操作

### 初回起動時の画面

- **左パネル**: シーン「Rooftop showdown」の情報
- **中央**: 青い円（ヒーロー）と赤い円（敵）が表示されています
- **右パネル**: 自動生成されたプロンプトが表示されています

### やってみよう！

#### 1️⃣ キャラクターを動かす

```
1. 中央キャンバスの青い円をクリック
2. そのままドラッグして移動
3. 右パネルの「🔄 Update Prompt」をクリック
4. プロンプトが更新されます！
```

#### 2️⃣ カメラアングルを変える

```
左パネルの「Overhead」または「Eye Level」をクリック
→ カメラ視点が変わります
→ 自動的にプロンプトも更新されます
```

#### 3️⃣ 物語プリセットを試す

```
左パネルの「Apply Narrative Preset」をクリック
→ 「face_off」プリセットが適用され、対峙構図になります
```

## 📊 生成されるプロンプトの見方

右パネルの「Generated Prompt」欄に、以下のような英語プロンプトが表示されます：

```
a late teens female, with blue short hair, wearing school uniform,
holding a katana, drawing a sword, hero on the left, enemy on the right,
face-to-face confrontation, eye-level shot, medium shot, standard lens,
night city, neon lights, light rain, urban fantasy atmosphere
```

このプロンプトは：
- キャラクター情報（青髪の女子高生、刀所持）
- アクション（刀を抜く）
- 構図（左にヒーロー、右に敵、対峙）
- カメラ（目線の高さ、ミディアムショット）
- 環境（夜の街、ネオン、小雨）

がすべて自動的に組み合わされています！

## 🎯 次のステップ

### カスタマイズしてみる

`project-data.js` をテキストエディタで開いて：

1. **キャラクターの髪色を変える**
```javascript
"hairColor": "blue" → "hairColor": "red"
```

2. **世界観を変える**
```javascript
"visualAtmosphereTags": ["night city", "neon lights", "light rain"]
↓
"visualAtmosphereTags": ["sunset", "desert", "sandstorm"]
```

3. ファイルを保存して、ブラウザをリロード（F5）

## ❓ トラブルシューティング

### 画面が真っ白
- すべてのJSファイルが同じフォルダにあるか確認
- ブラウザのコンソール（F12）でエラーを確認

### キャラクターが動かない
- ブラウザをリロード（F5）
- 別のブラウザで試す（Chrome推奨）

### プロンプトが更新されない
- 「Update Prompt」ボタンをクリックしているか確認
- キャラクターを少し動かしてから再度クリック

## 🎓 さらに学ぶ

- `README_JP.md` - 詳しい使い方
- `SPEC.md` - 技術仕様書
- プロジェクトファイル内の設計ドキュメント

## 💡 Tips

- キャラクターの向きを示す線は、`rotation.y` の値で決まります
- カメラの高さ（eye.y）を変えると俯瞰/煽りが変わります
- プロンプトはコピー＆ペーストしてStable DiffusionやMidjourneyで使えます

---

楽しんでください！ 🎨
