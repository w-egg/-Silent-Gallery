'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn('resend', { email, redirect: false });
      setEmailSent(true);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    await signIn('github', { callbackUrl: '/gallery' });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />
            <h1 className="text-2xl font-light mb-2">メールを確認してください</h1>
            <p className="text-white/60 text-sm">
              {email} にサインインリンクを送信しました。
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/80 leading-relaxed">
              メールに記載されたリンクをクリックすると、自動的にサインインされます。
            </p>
            <p className="text-sm text-white/60 mt-4">
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              別のメールアドレスを試す
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />
          </Link>
          <h1 className="text-2xl font-light mb-2">Silent Galleryへようこそ</h1>
          <p className="text-white/60 text-sm">
            静寂の中で、写真と出会う場所。
          </p>
        </div>

        {/* Sign in form */}
        <div className="space-y-4">
          {/* GitHub Sign In */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white text-[#0f1220] font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5" />
            GitHubでサインイン
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="px-4 text-sm text-white/40">または</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Email Sign In */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-white/80 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full px-6 py-3 rounded-2xl border border-white/20 font-medium hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '送信中...' : 'メールでサインイン'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-white/40">
          <p>
            サインインすることで、
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
