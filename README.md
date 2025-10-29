# Silent Gallery

> 今を残さず、今を感じる。/ 1日1枚・無言の写真が7日だけ漂う静寂SNS。

## 概要

Silent Galleryは、1日1枚の無言の写真をそっと置く場所です。写真は7日で流れ、反応も静かに消えます。評価や通知はありません。あるのは、光と静けさだけ。

## 技術スタック

- **Frontend/API**: Next.js 15 (App Router) + React 19
- **Database**:
  - 開発環境: SQLite (ローカルファイル)
  - 本番環境: Vercel Postgres (Neon)
- **Storage**: Vercel Blob
- **ORM**: Drizzle ORM
- **Auth**: NextAuth v5
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

ローカル開発用の環境変数ファイルはすでに`.env.local`として作成されています。
そのまま使用できますが、必要に応じて値を変更してください。

本番環境では以下の環境変数を設定する必要があります：
- `NEXTAUTH_URL`: アプリのURL
- `NEXTAUTH_SECRET`: NextAuthのシークレット（`openssl rand -base64 32`で生成）
- `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth設定
- `POSTGRES_URL`: Vercel Postgres接続URL
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob APIトークン

### 3. データベースのセットアップ

開発環境ではSQLiteを使用するため、データベースサーバーの起動は不要です。
スキーマをローカルデータベースにプッシュします：

```bash
npm run db:push
```

これにより`local.db`ファイルが作成され、テーブルが自動的に作成されます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

**注意**: 開発環境では自動的にSQLiteを使用します。本番環境（Vercel）では自動的にPostgreSQLに切り替わります。

## スクリプト

- `npm run dev` - 開発サーバーの起動（Turbopack使用）
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run lint` - ESLintの実行
- `npm run typecheck` - TypeScriptの型チェック
- `npm run db:generate` - Drizzleマイグレーションファイルの生成
- `npm run db:push` - スキーマをデータベースにプッシュ
- `npm run db:studio` - Drizzle Studioの起動

## プロジェクト構造

```
silent-gallery/
├── app/                        # Next.js App Router
│   ├── globals.css            # グローバルスタイル
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # ホームページ
│   └── landing.tsx            # ランディングページコンポーネント
├── packages/
│   └── db/                    # データベース関連
│       ├── schema.ts          # PostgreSQLスキーマ定義
│       ├── schema.sqlite.ts   # SQLiteスキーマ定義（開発用）
│       └── index.ts           # DB接続エクスポート
├── .env.local                 # ローカル環境変数
├── .env.example               # 環境変数テンプレート
├── drizzle.config.ts          # Drizzle Kit設定
├── next.config.ts             # Next.js設定
├── tailwind.config.ts         # Tailwind CSS設定
├── docker-compose.yml         # PostgreSQL用（オプション）
└── tsconfig.json              # TypeScript設定
```

## 仕様書

詳細な仕様は`silent-gallery_spec.md`を参照してください。

## ライセンス

© 2025 Silent Gallery Project
