# Tic-Tac-Toe Game

このプロジェクトは三目並べ（Tic-Tac-Toe）ゲームの実装です。React 公式サイトの Learn React チュートリアルをベースにし、追加の改善を加えたバージョンです。

## 技術スタック

- Next.js (App Router)
- React
- Tailwind CSS

## 機能

- 基本的な三目並べゲーム
- ゲーム履歴の保存と時間旅行（過去の手に戻れる機能）
- 勝者が決まった時のハイライト表示
- 引き分け判定
- 手番の表示

## プロジェクト構成

- `src/app/page.tsx`: ゲームのメインコンポーネントと主要ロジック
- `src/app/components/`: UI コンポーネント
  - `Board.tsx`: ゲームボード
  - `Square.tsx`: マス目のコンポーネント
- `src/app/utils/`: ユーティリティ関数
  - `calculateWinner.ts`: 勝者判定ロジック
- `src/app/globals.css`: グローバルスタイル設定
- `package.json`: プロジェクトの依存関係とスクリプト
