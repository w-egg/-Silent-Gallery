import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { Adapter, AdapterUser } from 'next-auth/adapters';
import { nanoid } from 'nanoid';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import { users } from '@/packages/db';
import { eq } from 'drizzle-orm';

type DatabaseType = BetterSQLite3Database | VercelPgDatabase;

/**
 * Silent Gallery用のカスタム認証アダプター
 * ユーザー作成時に自動的にhandleを生成する
 */
export function createSilentGalleryAdapter(db: DatabaseType): Adapter {
  const baseAdapter = DrizzleAdapter(db);

  return {
    ...baseAdapter,
    async createUser(user) {
      console.log('🔍 createUser called with:', user);

      // ランダムなhandleを生成
      const adjectives = ['quiet', 'silent', 'peaceful', 'calm', 'gentle', 'soft', 'still'];
      const nouns = ['wanderer', 'dreamer', 'observer', 'soul', 'spirit', 'light', 'shadow'];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const number = Math.floor(Math.random() * 10000);
      const handle = `${adjective}-${noun}-${number}`;

      console.log('🎯 Generated handle:', handle);

      const userId = user.id || nanoid();
      const now = new Date();

      // 直接データベースにユーザーを挿入
      const newUser = {
        id: userId,
        name: user.name || null,
        email: user.email,
        emailVerified: user.emailVerified || null,
        image: user.image || null,
        handle,
        createdAt: now,
        nextPostAt: null,
      };

      console.log('📦 Inserting user:', newUser);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db as any).insert(users).values(newUser);

      // ユーザーを取得して返す
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdUser = await (db as any)
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((rows: any[]) => rows[0]);

      console.log('✅ User created:', createdUser);

      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
        image: createdUser.image,
      } as AdapterUser;
    },
  };
}
