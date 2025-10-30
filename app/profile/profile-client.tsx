'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { LogOut, Plus, Clock } from 'lucide-react';

interface Post {
  id: string;
  imageKey: string;
  publishAt: Date;
  expireAt: Date;
  visible: boolean;
  createdAt: Date;
}

interface User {
  id: string;
  handle: string;
  email: string | null;
  name: string | null;
  image: string | null;
  nextPostAt: Date | null;
}

interface ProfileClientProps {
  user: User;
  posts: Post[];
}

export default function ProfileClient({ user, posts }: ProfileClientProps) {
  const canPost = !user.nextPostAt || new Date(user.nextPostAt) <= new Date();
  const timeUntilNextPost = user.nextPostAt
    ? Math.max(0, Math.ceil((new Date(user.nextPostAt).getTime() - Date.now()) / (1000 * 60 * 60)))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Silent Gallery
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/gallery" className="text-gray-700 hover:text-gray-900">
              ギャラリー
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-gray-700 hover:text-gray-900"
              aria-label="ログアウト"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || user.handle}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                  {user.handle.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">@{user.handle}</h1>
                {user.name && <p className="text-gray-600">{user.name}</p>}
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>

            {/* Post Button */}
            <div className="flex flex-col items-end gap-2">
              {canPost ? (
                <Link
                  href="/post"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  投稿する
                </Link>
              ) : (
                <div className="flex flex-col items-end">
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                    投稿する
                  </button>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    次の投稿まで約{timeUntilNextPost}時間
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                <p className="text-sm text-gray-600">投稿</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">投稿</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 mb-4">まだ投稿がありません</p>
              {canPost && (
                <Link
                  href="/post"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  最初の投稿をする
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={`/uploads/${post.imageKey}`}
                      alt="投稿画像"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">
                      公開: {new Date(post.publishAt).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-sm text-gray-500">
                      期限: {new Date(post.expireAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
