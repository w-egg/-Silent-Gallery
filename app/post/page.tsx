import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db, users } from '@/packages/db';
import { eq } from 'drizzle-orm';
import PostClient from './post-client';

export default async function PostPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // ユーザー情報を取得して投稿可能かチェック
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

  const canPost = !user.nextPostAt || new Date(user.nextPostAt) <= new Date();
  const nextPostAt = user.nextPostAt;

  return <PostClient canPost={canPost} nextPostAt={nextPostAt} />;
}
