import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="h-12 w-12 mx-auto mb-6 rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />

        <h1 className="text-2xl font-light mb-4">メールを確認してください</h1>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <p className="text-white/80 mb-4">
            サインインリンクをメールで送信しました。
          </p>
          <p className="text-sm text-white/60">
            メールに記載されたリンクをクリックしてサインインを完了してください。
          </p>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-white/60 hover:text-white transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
