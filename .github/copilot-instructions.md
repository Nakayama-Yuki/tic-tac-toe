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

## コーディング規約

### TypeScript
- コンポーネントpropsは`interface`で定義（例: `BoardProps`, `SquareProps`）
- 盤面状態は`(string | null)[]`型の長さ9の配列で表現
- パスエイリアス`@/*`は`./src/*`にマッピング

### コンポーネントパターン
- クライアントコンポーネントには`"use client"`ディレクティブを追加
- UIコンポーネントは`src/components/`に配置
- ユーティリティ関数は`src/utils/`に配置
- default exportを使用

### スタイリング
- グローバルCSSは`src/app/globals.css`に定義
- 勝利ハイライトは`.highlight`クラスで黄色背景を適用
- CSSクラスの条件付与: `className={\`square ${isWinningSquare ? "highlight" : ""}\`}`

## 開発コマンド

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # プロダクションビルド
pnpm lint     # ESLintチェック
```

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
