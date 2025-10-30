import { NextResponse } from 'next/server';
import { db, posts } from '@/packages/db';
import { and, lte, gt, eq, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const now = new Date();

    // 7日以内の写真からランダムに1枚取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any)
      .select()
      .from(posts)
      .where(
        and(
          lte(posts.publishAt, now),
          gt(posts.expireAt, now),
          eq(posts.visible, true)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ post: null });
    }

    return NextResponse.json({ post: result[0] });
  } catch (error) {
    console.error('Error fetching random post:', error);
    return NextResponse.json({ error: 'Failed to fetch random post' }, { status: 500 });
  }
}
