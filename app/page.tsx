'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = useMemo(
    () => [
      {
        title: '今を残さず、今を感じる。',
        body: 'Silent Gallery は、1日1枚の無言の写真をそっと置く場所。写真は7日で流れ、反応も静かに消えます。評価や通知はありません。あるのは、光と静けさだけ。',
      },
      {
        title: '1日1枚・7日で流れる',
        body: '数ではなく質感を大切にする制限設計。TOPには7日以内の写真のみが並び、出会いの新鮮さを守ります。',
      },
      {
        title: '無言のリアクション',
        body: '🌙 🪶 💧 🔥 🌿 などの抽象的な反応で余韻だけを残す体験。数値ではなく、淡い"光"として写真に滲みます。',
      },
      {
        title: '静かなアーカイブ',
        body: '7日を過ぎた写真はTOPからは消え、あなたの個人ページに静かに積もっていきます。',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1]">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />
          <span className="tracking-wide font-semibold">Silent Gallery</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm opacity-80">
          <a href="/gallery" className="hover:opacity-100 transition-opacity">
            Gallery
          </a>
          <a href="#about" className="hover:opacity-100 transition-opacity">
            Concept
          </a>
          <a href="#features" className="hover:opacity-100 transition-opacity">
            Features
          </a>
          <a href="#how" className="hover:opacity-100 transition-opacity">
            How it works
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-light leading-tight">
              今を残さず、
              <br />
              <span className="font-semibold">今を感じる。</span>
            </h1>
            <p className="mt-6 text-base/7 md:text-lg/8 text-white/80" id="about">
              ことばのない世界を、少しだけ覗いてみませんか。1日1枚の写真をそっと置く場所。写真は7日で流れ、反応も静かに消えます。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-white text-[#0f1220] text-sm font-medium shadow hover:shadow-lg transition-shadow"
              >
                ギャラリーを見る <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/20 text-sm hover:bg-white/5"
              >
                機能を見る
              </a>
            </div>
          </div>

          {/* Visual: floating cards */}
          <div className="relative h-[380px] md:h-[440px]">
            <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_60%)]" />
            <FloatingCard
              delay={0}
              rotate={-2}
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
            />
            <FloatingCard
              delay={0.3}
              rotate={3}
              src="https://images.unsplash.com/photo-1508614999368-9260051291ea?q=80&w=800&auto=format&fit=crop"
              className="left-14 top-24"
            />
            <FloatingCard
              delay={0.6}
              rotate={-1}
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop"
              className="right-4 top-36"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-white/10" />
      </div>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-white/80 leading-7">{f.body}</p>
          </motion.div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
        <ol className="mt-6 grid md:grid-cols-3 gap-6 text-white/85">
          {[
            {
              step: '1',
              title: '今日の1枚を置く',
              body: '写真を1枚だけ選んで"置く"。テキストやタグはありません。',
            },
            {
              step: '2',
              title: '漂って、現れる',
              body: '投稿はすぐ出ません。0〜3時間の"Drift"後にそっと現れます。TOPには7日以内の写真だけが並びます。',
            },
            {
              step: '3',
              title: '光だけが残る',
              body: '閲覧者は抽象リアクションで余韻を置きます。反応も7日で消え、写真は個人ページに静かに積もります。',
            },
          ].map((s) => (
            <li
              key={s.step}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2"
            >
              <div className="text-sm opacity-70">Step {s.step}</div>
              <div className="text-lg font-medium">{s.title}</div>
              <p className="opacity-90 leading-7">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-sm opacity-70 leading-7">
          ※ 7日を過ぎた写真はTOPからは見えなくなりますが、投稿者の個人ページでのみ閲覧できます。
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-white">Silent Gallery</div>
            <div className="opacity-70">語らない写真、触れる静けさ。</div>
          </div>
          <div className="opacity-60">© {new Date().getFullYear()} Silent Gallery Project</div>
        </div>
      </footer>
    </div>
  );
}

function FloatingCard({
  src,
  rotate = 0,
  delay = 0,
  className = '',
}: {
  src: string;
  rotate?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={
        'absolute inset-x-0 top-10 mx-auto h-48 w-72 md:h-64 md:w-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl ' +
        className
      }
      style={{ rotate }}
    >
      <img src={src} alt="quiet-sample" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </motion.div>
  );
}
