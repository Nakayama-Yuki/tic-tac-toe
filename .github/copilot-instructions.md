# Copilot Instructions

## プロジェクト概要

React公式チュートリアルベースの三目並べ（Tic-Tac-Toe）ゲーム。Next.js App Router + TypeScript + Tailwind CSS構成。

## アーキテクチャ

### コンポーネント階層

```
Game (src/app/page.tsx) - 状態管理・履歴管理
  └── Board (src/components/Board.tsx) - ゲームボード・勝敗判定
        └── Square (src/components/Square.tsx) - 個別マス目
```

### データフロー

- `Game`が全状態を管理（`history`, `currentMove`）
- `Board`へprops経由で状態を渡し、`onPlay`コールバックで更新
- 勝者判定は`calculateWinner`ユーティリティで行い、勝利ラインのインデックス配列を返す

### 状態管理パターン

```typescript
// Game コンポーネントの状態構造
interface Move {
  squares: (string | null)[];
  location: { row: number; col: number } | null;
}
const [history, setHistory] = useState<Move[]>([...]);
const [currentMove, setCurrentMove] = useState(0);
const [isAscending, setIsAscending] = useState(true);
```

## コーディング規約

### TypeScript

- コンポーネントpropsは`interface`で定義（例: `BoardProps`, `SquareProps`）
- 盤面状態は`(string | null)[]`型の長さ9の配列で表現
- パスエイリアス`@/*`は`./src/*`にマッピング（tsconfig.json で設定済み）

### コンポーネントパターン

- クライアントコンポーネントには`"use client"`ディレクティブを追加
- UIコンポーネントは`src/components/`に配置
- ユーティリティ関数は`src/utils/`に配置
- default exportを使用

### スタイリング

- グローバルCSSは`src/app/globals.css`に定義
- 勝利ハイライトは`.highlight`クラスで黄色背景を適用
- CSSクラスの条件付与: `className={\`square ${isWinningSquare ? "highlight" : ""}\`}`

## 開発ワークフロー

### 開発コマンド

```bash
pnpm dev           # 開発サーバー起動 (localhost:3000)
pnpm build         # プロダクションビルド
pnpm lint          # ESLintチェック
pnpm test          # Playwright テスト実行
pnpm test:headed   # ヘッド付きモードでテスト
pnpm test:ui       # Playwright UI モード
pnpm test:debug    # デバッグモード
pnpm test:report   # テストレポート表示
```

### テスト実行時の注意点

- テスト実行前に開発サーバー（`pnpm dev`）を起動すること
- テストは`tests/game.spec.ts`に定義
- Playwrightは chromium, firefox, webkit の3ブラウザで並行実行
- ローカルでは2ワーカー、CIでは1ワーカーで実行

## 重要な実装パターン

### 盤面インデックス計算

3x3グリッドを1次元配列で管理: `index = row * 3 + col`

```
[0, 1, 2]
[3, 4, 5]
[6, 7, 8]
```

### 履歴機能（Time Travel）

- 各手番を`{ squares, location }`オブジェクトとして履歴に保存
- `jumpTo`で過去の状態に戻る際、履歴は保持したまま`currentMove`を変更
- 過去の手に戻ってから新しい手を打つと、それ以降の履歴は破棄される（`history.slice(0, currentMove + 1)`）

### 勝利判定

`calculateWinner` 関数は以下を返す:

```typescript
// 勝利時: { winner: "X" | "O", winningSquares: [a, b, c] }
// 未決着: null
```

8パターンの勝利ライン（横3、縦3、斜め2）を判定

### ソート機能

履歴の昇順/降順切り替えは`moves.slice().reverse()`で実装（元配列を変更しない）

## キーファイル

- `src/app/page.tsx`: メインゲームロジック、状態管理、履歴管理
- `src/components/Board.tsx`: 3x3グリッド描画、クリックハンドラ、勝敗表示
- `src/components/Square.tsx`: 個別マス目コンポーネント
- `src/utils/calculateWinner.tsx`: 勝者判定ロジック（8パターンの勝利ライン）
- `src/app/globals.css`: ゲームボードのスタイル定義
- `tests/game.spec.ts`: E2Eテスト（Phase 2-5の機能テスト）
