import { NextRequest, NextResponse } from 'next/server';
import { db, posts, users } from '@/packages/db';
import { desc, and, lte, gt, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { nanoid } from 'nanoid';

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageKey } = body;

    if (!imageKey) {
      return NextResponse.json({ error: 'imageKey is required' }, { status: 400 });
    }

    // ユーザーの次回投稿可能時間をチェック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userResult = await (db as any)
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    if (user.nextPostAt && user.nextPostAt > now) {
      return NextResponse.json(
        {
          error: 'You can only post once per day',
          nextPostAt: user.nextPostAt,
        },
        { status: 429 }
      );
    }

    // Drift Publishing: 0-3時間のランダム遅延
    const driftHours = Math.random() * 3;
    const publishAt = new Date(now.getTime() + driftHours * 60 * 60 * 1000);
    const expireAt = new Date(publishAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7日後

    // 投稿を作成
    const newPost = {
      id: nanoid(),
      authorId: session.user.id,
      imageKey,
      publishAt,
      expireAt,
      visible: true,
      createdAt: now,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any).insert(posts).values(newPost);

    // 次回投稿可能時間を24時間後に更新
    const nextPostAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any)
      .update(users)
      .set({ nextPostAt })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      post: newPost,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
