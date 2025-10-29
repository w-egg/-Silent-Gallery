'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/packages/db';

type ReactionKind = 'moon' | 'feather' | 'water' | 'fire' | 'leaf';

const REACTION_ICONS = {
  moon: '🌙',
  feather: '🪶',
  water: '💧',
  fire: '🔥',
  leaf: '🌿',
} as const;

// ダミー写真のUnsplash ID（静かで美しい写真）
const DUMMY_PHOTOS = [
  'photo-1500530855697-b586d89ba3ee', // 山と湖
  'photo-1506905925346-21bda4d32df4', // 山の風景
  'photo-1470071459604-3b5ec3a7fe05', // 霧の森
  'photo-1501594907352-04cda38ebc29', // 湖と山
  'photo-1508614999368-9260051291ea', // 紫の空
  'photo-1501785888041-af3ef285b470', // 山の夕日
  'photo-1472214103451-9374bd1c798e', // 海の夕暮れ
  'photo-1426604966848-d7adac402bff', // 森の小道
  'photo-1511593358241-7eea1f3c84e5', // 星空
  'photo-1419242902214-272b3f66ee7a', // 雪山
];

export default function GalleryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?scope=top&limit=50');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPost = posts[currentIndex];
  const isAtEnd = currentIndex === posts.length - 1;
  const isAtStart = currentIndex === 0;

  const goToNext = () => {
    if (!isAtEnd) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (!isAtStart) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60">静けさを待っています...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <p className="text-xl mb-4">今週の写真はまだありません。</p>
            <p className="text-white/60 text-sm">
              最初の一枚が漂い始めるのを、静かに待ちましょう。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1220] text-[#e9ecf1]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Progress indicator */}
        <div className="mb-8 text-center">
          <p className="text-sm text-white/50">
            {currentIndex + 1} / {posts.length}
          </p>
        </div>

        {/* Image viewer */}
        <div className="relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {currentPost && (
              <motion.div
                key={currentPost.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Image container */}
                <div className="relative w-full max-w-3xl aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8">
                  <img
                    src={`https://images.unsplash.com/${DUMMY_PHOTOS[currentIndex % DUMMY_PHOTOS.length]}?q=80&w=1200&auto=format&fit=crop`}
                    alt="静寂の写真"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // フォールバック: エラーの場合はプレースホルダー
                      e.currentTarget.src = `https://placehold.co/1200x1200/0f1220/e9ecf1?text=Silent+Gallery`;
                    }}
                  />
                </div>

                {/* Reactions */}
                <ReactionButtons postId={currentPost.id} expireAt={currentPost.expireAt} />

                {/* Post info */}
                <div className="mt-6 text-center text-sm text-white/40">
                  <p>
                    {new Date(currentPost.publishAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            disabled={isAtStart}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="前の写真"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            disabled={isAtEnd}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="次の写真"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* End message */}
        {isAtEnd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <p className="text-xl mb-2">今週の静寂はここまで。</p>
            <p className="text-white/60">おやすみ 🌙</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between border-b border-white/10">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />
        <span className="tracking-wide font-semibold">Silent Gallery</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm opacity-80">
        <Link href="/" className="hover:opacity-100 transition-opacity">
          Home
        </Link>
        <Link href="/gallery" className="hover:opacity-100 transition-opacity">
          Gallery
        </Link>
      </nav>
    </header>
  );
}

function ReactionButtons({ postId, expireAt }: { postId: string; expireAt: Date | null }) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionKind | null>(null);
  const isExpired = expireAt ? new Date(expireAt) < new Date() : false;

  const handleReaction = async (kind: ReactionKind) => {
    if (isExpired) return;

    setSelectedReaction(kind);
    // TODO: API実装後にリアクションを送信
    console.log('Reaction:', kind, 'for post:', postId);
  };

  return (
    <div className="flex items-center gap-4">
      {(Object.keys(REACTION_ICONS) as ReactionKind[]).map((kind) => (
        <button
          key={kind}
          onClick={() => handleReaction(kind)}
          disabled={isExpired}
          className={`
            text-3xl p-3 rounded-full border transition-all
            ${selectedReaction === kind ? 'bg-white/20 border-white/40 scale-110' : 'bg-white/5 border-white/10'}
            ${isExpired ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110'}
          `}
          aria-label={`${kind} reaction`}
        >
          {REACTION_ICONS[kind]}
        </button>
      ))}
    </div>
  );
}
