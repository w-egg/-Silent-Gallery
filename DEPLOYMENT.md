# Vercel デプロイメントガイド

このドキュメントでは、Silent GalleryをVercelにデプロイする手順を説明します。

## 前提条件

- Vercelアカウント
- GitHubリポジトリ
- Vercel Postgresデータベース
- Vercel Blobストレージ

## デプロイ手順

### 1. Vercel プロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. Framework Preset: **Next.js** を選択

### 2. 環境変数の設定

Vercel Dashboard > Settings > Environment Variables で以下を設定：

#### 必須の環境変数

```bash
# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<openssl rand -base64 32で生成>

# Database (Vercel Postgres)
POSTGRES_URL=<Vercel Postgresから取得>
POSTGRES_PRISMA_URL=<Vercel Postgresから取得>
POSTGRES_URL_NON_POOLING=<Vercel Postgresから取得>

# Vercel Blob
BLOB_READ_WRITE_TOKEN=<Vercel Blobから取得>
```

#### オプションの環境変数

```bash
# GitHub OAuth (使用する場合)
GITHUB_ID=<GitHub OAuth App ID>
GITHUB_SECRET=<GitHub OAuth App Secret>

# Email Provider (使用する場合)
RESEND_API_KEY=<Resend API Key>
```

### 3. Vercel Postgres のセットアップ

1. Vercel Dashboard > Storage > Create Database
2. **Postgres** を選択
3. データベース名を入力（例: `silent-gallery-db`）
4. リージョンを選択（推奨: `Tokyo (hnd1)`）
5. 作成後、環境変数が自動的に追加されます

#### データベーススキーマの適用

ローカルで以下を実行：

```bash
# 環境変数を設定（Vercelから取得した値）
export POSTGRES_URL="..."
export POSTGRES_PRISMA_URL="..."
export POSTGRES_URL_NON_POOLING="..."

# スキーマをプッシュ
npm run db:push
```

または、Vercelデプロイ後に以下のSQLを直接実行：

```sql
-- packages/db/schema.ts の内容に基づいて作成
-- Drizzle Studioまたはpsqlで実行
```

### 4. Vercel Blob のセットアップ

1. Vercel Dashboard > Storage > Create Store
2. **Blob** を選択
3. ストア名を入力（例: `silent-gallery-images`）
4. 作成後、`BLOB_READ_WRITE_TOKEN` が自動的に追加されます

### 5. GitHub OAuth のセットアップ（オプション）

1. [GitHub Developer Settings](https://github.com/settings/developers)
2. "New OAuth App" をクリック
3. 設定：
   - Application name: `Silent Gallery`
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
4. Client ID と Client Secret を環境変数に追加

### 6. Resend のセットアップ（オプション）

1. [Resend](https://resend.com/) でアカウント作成
2. API Key を生成
3. `RESEND_API_KEY` を環境変数に追加

### 7. デプロイ

```bash
# GitHubにプッシュすると自動的にデプロイ
git push origin main
```

または、Vercel CLIを使用：

```bash
npm install -g vercel
vercel --prod
```

## デプロイ後の確認

1. **データベース接続**: `/api/posts` にアクセスして動作確認
2. **画像アップロード**: 写真を投稿してVercel Blobに保存されることを確認
3. **認証**: サインイン/サインアウトの動作確認

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドを確認
npm run build
```

### データベース接続エラー

- 環境変数が正しく設定されているか確認
- Vercel Postgresがプロジェクトにリンクされているか確認
- データベーススキーマが適用されているか確認

### 画像アップロードエラー

- `BLOB_READ_WRITE_TOKEN` が設定されているか確認
- Vercel Blobストアがプロジェクトにリンクされているか確認

## 環境変数の管理

### 本番環境

```bash
vercel env add NEXTAUTH_SECRET production
```

### プレビュー環境

```bash
vercel env add NEXTAUTH_SECRET preview
```

### 開発環境

ローカル開発では `.env.local` を使用（Git管理外）

## パフォーマンス最適化

### Edge Runtime の活用

- GET系APIは既にEdge Runtimeを使用可能に設計済み
- 必要に応じて `export const runtime = 'edge'` を設定

### データベースクエリの最適化

- インデックスは既に設定済み
- 必要に応じてクエリプランを確認

### 画像最適化

- Next.js Image コンポーネントを使用
- WebP形式で自動変換済み

## モニタリング

- Vercel Analytics: デフォルトで有効
- Vercel Logs: エラーログを確認
- Vercel Speed Insights: パフォーマンス確認

## スケーリング

### 無料枠の制限

- Vercel Postgres: 256 MB storage
- Vercel Blob: 500 MB storage
- Function executions: 100 GB-hours/month

### Pro プランへのアップグレード

無料枠を超える場合は、Vercel Pro プランを検討してください。

## セキュリティ

- [ ] `NEXTAUTH_SECRET` は必ず変更
- [ ] HTTPS のみを使用
- [ ] 環境変数は絶対にコミットしない
- [ ] 定期的に依存関係を更新（Dependabot使用）

## サポート

問題が発生した場合：

1. [Vercel Documentation](https://vercel.com/docs)
2. [GitHub Issues](https://github.com/your-repo/silent-gallery/issues)
3. Vercel Support（Pro プラン以上）
