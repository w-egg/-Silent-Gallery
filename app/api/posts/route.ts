import { NextRequest, NextResponse } from 'next/server';
import { db, posts } from '@/packages/db';
import { desc, and, lte, gt, eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope') || 'top';
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const cursor = searchParams.get('cursor');

    const now = new Date();

    let query;

    if (scope === 'top') {
      // 7日以内の写真のみ取得
      const conditions = [
        lte(posts.publishAt, now),
        gt(posts.expireAt, now),
        eq(posts.visible, true),
      ];

      if (cursor) {
        // カーソルベースのページネーション
        const cursorDate = new Date(cursor);
        conditions.push(lte(posts.publishAt, cursorDate));
      }

      query = (db as any)
        .select()
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.publishAt))
        .limit(limit);
    } else if (scope === 'user' && userId) {
      // ユーザーの全投稿を取得
      const conditions = [eq(posts.authorId, userId), eq(posts.visible, true)];

      if (cursor) {
        const cursorDate = new Date(cursor);
        conditions.push(lte(posts.publishAt, cursorDate));
      }

      query = (db as any)
        .select()
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.publishAt))
        .limit(limit);
    } else {
      return NextResponse.json(
        { error: 'Invalid scope or missing userId' },
        { status: 400 }
      );
    }

    const result = await query;

    return NextResponse.json({
      posts: result,
      nextCursor: result.length === limit ? result[result.length - 1].publishAt : null,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
