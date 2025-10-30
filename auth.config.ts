import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Resend from 'next-auth/providers/resend';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';

const isDevelopment = process.env.NODE_ENV === 'development';

// プロバイダーを動的に構築
const providers: Provider[] = [
  GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
];

if (isDevelopment) {
  // 開発環境では、カスタムメールプロバイダーでコンソール出力
  providers.push(
    Resend({
      id: 'resend',
      name: 'Email',
      from: 'noreply@silent-gallery.com',
      apiKey: 'dev', // ダミーキー（開発環境では使用しない）
      async sendVerificationRequest({ identifier: email, url }) {
        // 開発環境ではコンソールに出力
        console.log('\n' + '='.repeat(80));
        console.log('📧 メール認証リンク (開発環境)');
        console.log('='.repeat(80));
        console.log(`宛先: ${email}`);
        console.log(`認証URL: ${url}`);
        console.log('\nこのURLをブラウザで開いてサインインを完了してください。');
        console.log('='.repeat(80) + '\n');
      },
    })
  );
} else {
  // 本番環境ではResendを使用
  providers.push(
    Resend({
      from: process.env.EMAIL_FROM || 'noreply@silent-gallery.com',
    })
  );
}

export default {
  providers,
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  debug: isDevelopment,
} satisfies NextAuthConfig;
