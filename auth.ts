import NextAuth from 'next-auth';
import { db } from '@/packages/db';
import authConfig from './auth.config';
import { createSilentGalleryAdapter } from './lib/auth-adapter';

const isDevelopment = process.env.NODE_ENV === 'development';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createSilentGalleryAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
  pages: {
    signIn: '/auth/signin',
    newUser: '/profile', // サインイン成功後、新規ユーザーは/profileにリダイレクト
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.handle = user.handle;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.handle = token.handle as string;
      }
      return session;
    },
    async signIn() {
      // サインイン成功時の処理
      return true;
    },
    async redirect({ url, baseUrl }) {
      // サインイン後のリダイレクト先を/profileに設定
      // ログアウト時は/へ
      if (url.startsWith('/auth/signout') || url.includes('signout')) {
        return baseUrl;
      }
      // サインイン成功後は/profileにリダイレクト
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return `${baseUrl}/profile`;
      }
      return url;
    },
  },
  // 開発環境でのイベントログ
  ...(isDevelopment && {
    events: {
      async createUser(message) {
        console.log('✅ ユーザー作成:', message.user.email);
      },
    },
  }),
});
