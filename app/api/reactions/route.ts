import { NextRequest, NextResponse } from 'next/server';
import { db, reactions, posts } from '@/packages/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // 投稿のすべてのリアクションを取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any)
      .select()
      .from(reactions)
      .where(eq(reactions.postId, postId));

    // リアクションの種類ごとに集計
    const reactionCounts: Record<string, number> = {};
    const userReactions: Record<string, string> = {}; // userId -> kind

    result.forEach((reaction: { kind: string; userId: string | null }) => {
      reactionCounts[reaction.kind] = (reactionCounts[reaction.kind] || 0) + 1;
      if (reaction.userId) {
        userReactions[reaction.userId] = reaction.kind;
      }
    });

    return NextResponse.json({
      postId,
      reactionCounts,
      userReactions,
      total: result.length,
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, kind } = body;

    if (!postId || !kind) {
      return NextResponse.json(
        { error: 'postId and kind are required' },
        { status: 400 }
      );
    }

    // リアクションの種類を検証
    const validKinds = ['moon', 'feather', 'water', 'fire', 'leaf'];
    if (!validKinds.includes(kind)) {
      return NextResponse.json({ error: 'Invalid reaction kind' }, { status: 400 });
    }

    // 投稿が存在し、まだ期限切れでないことを確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postResult = await (db as any)
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    const post = postResult[0];
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const now = new Date();
    if (post.expireAt && post.expireAt < now) {
      return NextResponse.json({ error: 'Post has expired' }, { status: 400 });
    }

    // 既に同じユーザーが同じ投稿にリアクションしているか確認
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingReaction = await (db as any)
      .select()
      .from(reactions)
      .where(and(eq(reactions.postId, postId), eq(reactions.userId, session.user.id)))
      .limit(1);

    if (existingReaction.length > 0) {
      // 既存のリアクションを更新
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db as any)
        .update(reactions)
        .set({ kind, createdAt: now })
        .where(
          and(eq(reactions.postId, postId), eq(reactions.userId, session.user.id))
        );

      return NextResponse.json({
        message: 'Reaction updated successfully',
        reaction: { postId, userId: session.user.id, kind },
      });
    }

    // 新しいリアクションを作成
    const newReaction = {
      id: nanoid(),
      postId,
      userId: session.user.id,
      kind,
      createdAt: now,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any).insert(reactions).values(newReaction);

    return NextResponse.json({
      message: 'Reaction created successfully',
      reaction: newReaction,
    });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // リアクションを削除
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any)
      .delete(reactions)
      .where(and(eq(reactions.postId, postId), eq(reactions.userId, session.user.id)));

    return NextResponse.json({ message: 'Reaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json({ error: 'Failed to delete reaction' }, { status: 500 });
  }
}
