import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  handle: text('handle').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  nextPostAt: integer('next_post_at', { mode: 'timestamp' }),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

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
