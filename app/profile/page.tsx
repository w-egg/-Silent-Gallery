import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db, users, posts } from '@/packages/db';
import { eq, desc } from 'drizzle-orm';
import ProfileClient from './profile-client';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // ユーザー情報を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userResult = await (db as any)
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    redirect('/auth/signin');
  }

  // ユーザーの投稿を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userPosts = await (db as any)
    .select()
    .from(posts)
    .where(eq(posts.authorId, session.user.id))
    .orderBy(desc(posts.publishAt))
    .limit(20);

  return (
    <ProfileClient
      user={{
        id: user.id,
        handle: user.handle,
        email: user.email,
        name: user.name,
        image: user.image,
        nextPostAt: user.nextPostAt,
      }}
      posts={userPosts}
    />
  );
}
