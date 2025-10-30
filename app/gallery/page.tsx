'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import type { Post } from '@/packages/db';
import { LogOut, User } from 'lucide-react';

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
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return (
    <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between border-b border-white/10">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-white/70 to-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]" />
        <span className="tracking-wide font-semibold">Silent Gallery</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
          Home
        </Link>
        <Link href="/gallery" className="opacity-80 hover:opacity-100 transition-opacity">
          Gallery
        </Link>
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/5 transition-all"
                  title="マイページ"
                >
                  <User className="h-4 w-4" />
                </Link>
                <Link
                  href="/post"
                  className="px-4 py-2 rounded-2xl bg-white text-[#0f1220] font-medium hover:shadow-lg transition-all"
                >
                  投稿する
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 hover:bg-white/5 transition-all"
                  title="ログアウト"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-2xl bg-white text-[#0f1220] font-medium hover:shadow-lg transition-all"
              >
                サインイン
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

interface ReactionData {
  reactionCounts: Record<string, number>;
  userReactions: Record<string, string>;
  total: number;
}

function ReactionButtons({ postId, expireAt }: { postId: string; expireAt: Date | null }) {
  const { data: session } = useSession();
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isExpired = expireAt ? new Date(expireAt) < new Date() : false;

  // リアクションデータを取得
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/reactions?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setReactionData(data);
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();
  }, [postId]);

  const userReaction = session?.user?.id && reactionData?.userReactions[session.user.id];

  const handleReaction = async (kind: ReactionKind) => {
    if (isExpired || isSubmitting || !session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          kind,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to submit reaction:', errorData.error);
        return;
      }

      // リアクションデータを再取得
      const reactionResponse = await fetch(`/api/reactions?postId=${postId}`);
      if (reactionResponse.ok) {
        const data = await reactionResponse.json();
        setReactionData(data);
      }
    } catch (error) {
      console.error('Error submitting reaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 各リアクションの「光の濃さ」を計算（0-1の範囲）
  const getReactionIntensity = (kind: ReactionKind): number => {
    if (!reactionData || reactionData.total === 0) return 0;
    const count = reactionData.reactionCounts[kind] || 0;
    // 最大10件を基準に濃さを計算（10件以上は100%）
    return Math.min(count / 10, 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {(Object.keys(REACTION_ICONS) as ReactionKind[]).map((kind) => {
          const intensity = getReactionIntensity(kind);
          const isSelected = userReaction === kind;
          const count = reactionData?.reactionCounts[kind] || 0;

          return (
            <button
              key={kind}
              onClick={() => handleReaction(kind)}
              disabled={isExpired || !session?.user?.id}
              className={`
                relative text-3xl p-3 rounded-full border transition-all
                ${isSelected ? 'bg-white/30 border-white/60 scale-110 shadow-lg' : 'bg-white/5 border-white/10'}
                ${isExpired || !session?.user?.id ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110'}
              `}
              style={{
                opacity: intensity > 0 ? 0.5 + intensity * 0.5 : undefined,
                boxShadow: intensity > 0 ? `0 0 ${10 + intensity * 20}px rgba(255,255,255,${intensity * 0.3})` : undefined,
              }}
              aria-label={`${kind} reaction`}
              title={count > 0 ? `${count}人が反応しています` : undefined}
            >
              {REACTION_ICONS[kind]}
              {/* 光の滲み効果 */}
              {intensity > 0 && (
                <div
                  className="absolute inset-0 rounded-full blur-md pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,${intensity * 0.4}) 0%, transparent 70%)`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 静かな反応の表示 */}
      {reactionData && reactionData.total > 0 && (
        <p className="text-center text-sm text-white/40">
          {reactionData.total}の静かな反応
        </p>
      )}

      {!session?.user?.id && (
        <p className="text-center text-xs text-white/30">
          サインインすると反応できます
        </p>
      )}
    </div>
  );
}
