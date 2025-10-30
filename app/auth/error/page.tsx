'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

const errors: Record<string, string> = {
  Configuration: '認証設定にエラーがあります。',
  AccessDenied: 'アクセスが拒否されました。',
  Verification: '認証トークンが無効または期限切れです。',
  Default: '認証エラーが発生しました。',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error && error in errors ? errors[error] : errors.Default;

  return (
    <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-400/80" />
        </div>

        <h1 className="text-2xl font-light mb-4">サインインエラー</h1>

        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <p className="text-white/80">{errorMessage}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block px-6 py-3 rounded-2xl bg-white text-[#0f1220] font-medium hover:shadow-lg transition-all"
          >
            もう一度サインインする
          </Link>

          <Link
            href="/"
            className="block text-sm text-white/60 hover:text-white transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
