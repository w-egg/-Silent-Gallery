import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  email: text('email').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  nextPostAt: integer('next_post_at', { mode: 'timestamp' }),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').references(() => users.id).notNull(),
  imageKey: text('image_key').notNull(),
  publishAt: integer('publish_at', { mode: 'timestamp' }).notNull(),
  expireAt: integer('expire_at', { mode: 'timestamp' }).notNull(),
  visible: integer('visible', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  publishAtIdx: index('posts_publish_at_idx').on(table.publishAt),
  authorPublishIdx: index('posts_author_publish_idx').on(table.authorId, table.publishAt),
}));

export const reactions = sqliteTable('reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id).notNull(),
  userId: text('user_id').references(() => users.id),
  kind: text('kind').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  postCreatedIdx: index('reactions_post_created_idx').on(table.postId, table.createdAt),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;
