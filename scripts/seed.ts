import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { nanoid } from 'nanoid';
import * as schema from '../packages/db/schema.sqlite';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create a test user
    const userId = nanoid();
    await db.insert(schema.users).values({
      id: userId,
      handle: 'quiet-wanderer-1234',
      email: 'test@example.com',
      createdAt: new Date(),
      nextPostAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    });

    console.log('✓ Created test user');

    // Create sample posts (7 posts across the last 5 days)
    const now = new Date();
    const samplePosts = [
      { daysAgo: 0, hoursAgo: 2 },
      { daysAgo: 1, hoursAgo: 5 },
      { daysAgo: 2, hoursAgo: 3 },
      { daysAgo: 3, hoursAgo: 8 },
      { daysAgo: 4, hoursAgo: 1 },
      { daysAgo: 5, hoursAgo: 6 },
      { daysAgo: 6, hoursAgo: 4 },
    ];

    for (const { daysAgo, hoursAgo } of samplePosts) {
      const publishAt = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000
      );
      const expireAt = new Date(publishAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(schema.posts).values({
        id: nanoid(),
        authorId: userId,
        imageKey: `sample-${nanoid()}`,
        publishAt,
        expireAt,
        visible: true,
        createdAt: new Date(publishAt.getTime() - 2 * 60 * 60 * 1000), // 2 hours before publish
      });
    }

    console.log(`✓ Created ${samplePosts.length} sample posts`);
    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

seed();
