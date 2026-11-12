# Tic-Tac-Toe Game

このプロジェクトは三目並べ（Tic-Tac-Toe）ゲームの実装です。React 公式サイトの Learn React チュートリアルをベースにし、追加の改善を加えたバージョンです。

## 技術スタック

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Playwright** (E2Eテスト)
- **pnpm** (パッケージマネージャー)

## 機能

- ✅ 基本的な三目並べゲーム
- ✅ X と O の交互プレイ
- ✅ 既に埋まったマスへの上書き防止
- ✅ 横・縦・斜めの勝利パターン検出
- ✅ 勝利時のハイライト表示
- ✅ ゲーム終了後のプレイ防止
- ✅ 引き分け判定
- ✅ ゲーム履歴の保存と過去の手に戻る機能（Time Travel）
- ✅ 各手の位置情報表示（行・列）
- ✅ 履歴の昇順・降順切り替え

## セットアップ

### 前提条件

- Node.js `>=24`

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/Nakayama-Yuki/tic-tac-toe.git
cd tic-tac-toe

# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
# プロダクションビルド
pnpm build

# ビルド結果の起動
pnpm start
```

## テスト

### E2Eテスト（Playwright）

```bash
# ブラウザと必要なライブラリを準備
pnpm exec playwright install --with-deps

# 全テストの実行（ヘッドレスモード）
pnpm test

# ヘッド付きモードでの実行
pnpm test:headed

# UI モードでの実行
pnpm test:ui

# デバッグモード
pnpm test:debug

# テストレポートの表示
pnpm test:report
```

`playwright.config.ts` の `webServer` が `pnpm dev` を起動します。ローカルでは既存サーバーを再利用できます。

### テストカバレッジ

- ゲーム操作・履歴・勝利判定などを検証
- PC向け Chromium / Firefox / WebKit と Mobile Chrome / Mobile Safari の計5プロジェクトで実行
- 各フェーズの詳細なシナリオテスト

## プロジェクト構成

```
tic-tac-toe/
├── src/
│   ├── app/
│   │   ├── page.tsx              # メインゲームロジック・状態管理
│   │   ├── layout.tsx            # ルートレイアウト
│   │   └── globals.css           # グローバルスタイル
│   ├── components/
│   │   ├── Board.tsx             # ゲームボードコンポーネント
│   │   └── Square.tsx            # マス目コンポーネント
│   └── utils/
│       └── calculateWinner.tsx   # 勝者判定ロジック
├── tests/
│   └── game.spec.ts              # E2Eテスト
├── AGENTS.md                     # AI エージェント向け開発ルール
├── playwright.config.ts          # Playwright 設定
├── tsconfig.json                 # TypeScript 設定
├── next.config.ts               # Next.js 設定
└── package.json                  # 依存関係・スクリプト
```

## アーキテクチャ

### コンポーネント階層

```
Game (src/app/page.tsx)
  ├── 状態管理（history, currentMove, isAscending）
  └── Board (src/components/Board.tsx)
        ├── ゲームボード描画
        ├── 勝敗判定
        └── Square (src/components/Square.tsx)
              └── 個別マス目
```

### データフロー

1. `Game` コンポーネントが全状態を管理
2. `Board` へ props 経由で状態を渡す
3. `onPlay` コールバックで状態を更新
4. 勝者判定は `calculateWinner` ユーティリティで実行

### 状態管理

```typescript
interface Move {
  squares: (string | null)[];
  location: { row: number; col: number } | null;
}

const [history, setHistory] = useState<Move[]>([...]);
const [currentMove, setCurrentMove] = useState(0);
const [isAscending, setIsAscending] = useState(true);
```

## コーディング規約

- **TypeScript**: strict モード有効
- **コンポーネント**: PascalCase（例: `Board.tsx`）
- **Hooks**: camelCase（例: `useGame.ts`）
- **パスエイリアス**: `@/*` → `./src/*`
- **クライアントコンポーネント**: `"use client"` ディレクティブを使用
- **スタイリング**: Tailwind CSS クラスを使用

## 参考資料

- [React 公式チュートリアル](https://react.dev/learn/tutorial-tic-tac-toe)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Playwright ドキュメント](https://playwright.dev/)

## 開発ルール

開発時の指示は [AGENTS.md](AGENTS.md) を参照してください。依存バージョンと実行可能なスクリプトは [package.json](package.json) を正とします。

## 型チェック

```bash
pnpm typecheck
```

`next typegen` でルート型と `next-env.d.ts` を生成し、`tsc --noEmit` で型を検証します。CI でもビルド前に同じコマンドを実行します。
