# 開発環境での認証テスト方法

## メール認証（Magic Link）のテスト

開発環境では、実際にメールを送信する代わりに、サインインURLをコンソールに出力します。

### 手順

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **サインインページにアクセス**
   - http://localhost:3000/auth/signin にアクセス

3. **メールアドレスを入力してサインイン**
   - 任意のメールアドレスを入力（実在しなくてもOK）
   - 「メールでサインイン」ボタンをクリック

4. **コンソールで認証URLを確認**
   - ターミナルのコンソールに以下のような出力が表示されます：
   ```
   ================================================================================
   📧 メール認証リンク (開発環境)
   ================================================================================
   宛先: test@example.com
   認証URL: http://localhost:3000/api/auth/callback/resend?token=xxx&email=xxx

   このURLをブラウザで開いてサインインを完了してください。
   ================================================================================
   ```

   **注意**: `npm run dev`を実行しているターミナルウィンドウを確認してください。

5. **認証URLをブラウザで開く**
   - コンソールに表示されたURLをコピー
   - ブラウザのアドレスバーに貼り付けてアクセス
   - 自動的にサインインが完了し、ギャラリーページにリダイレクトされます

## GitHub認証のテスト

GitHub認証を使用する場合は、以下の設定が必要です：

1. **GitHubでOAuthアプリを作成**
   - https://github.com/settings/developers にアクセス
   - "New OAuth App" をクリック
   - Application name: Silent Gallery (Dev)
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github

2. **環境変数を設定**
   ```bash
   # .env.local
   GITHUB_ID=your_client_id
   GITHUB_SECRET=your_client_secret
   ```

3. **GitHubでサインイン**
   - サインインページで「GitHubでサインイン」ボタンをクリック
   - GitHubの認証画面で承認

## データベースの確認

開発環境ではSQLiteを使用しています。

```bash
# Drizzle Studio でデータベースを確認
npm run db:studio
```

ブラウザで https://local.drizzle.studio が開き、以下のテーブルを確認できます：
- `user` - ユーザー情報
- `account` - OAuth連携情報
- `session` - セッション情報
- `verificationToken` - メール認証トークン
- `posts` - 投稿
- `reactions` - リアクション

## トラブルシューティング

### エラー: no such table

データベーステーブルが作成されていない場合：
```bash
npm run db:push
```

### サインイン後にエラーが出る

1. セッションシークレットが設定されているか確認：
   ```bash
   # .env.local
   NEXTAUTH_SECRET=development-secret-key-please-change-in-production
   ```

2. データベースをリセット：
   ```bash
   rm local.db
   npm run db:push
   npm run db:seed
   ```
