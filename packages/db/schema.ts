import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  email: text('email').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  nextPostAt: timestamp('next_post_at'),
});

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').references(() => users.id).notNull(),
  imageKey: text('image_key').notNull(),
  publishAt: timestamp('publish_at').notNull(),
  expireAt: timestamp('expire_at').notNull(),
  visible: boolean('visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  publishAtIdx: index('posts_publish_at_idx').on(table.publishAt),
  authorPublishIdx: index('posts_author_publish_idx').on(table.authorId, table.publishAt),
}));

export const reactions = pgTable('reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id).notNull(),
  userId: text('user_id').references(() => users.id),
  kind: text('kind').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  postCreatedIdx: index('reactions_post_created_idx').on(table.postId, table.createdAt),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;
