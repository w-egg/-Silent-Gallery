import { pgTable, text, timestamp, boolean, index, primaryKey, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  handle: text('handle').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  nextPostAt: timestamp('next_post_at'),
});

export const accounts = pgTable(
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

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

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
