// Seed script専用のDB接続（server-onlyを使わない）
const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL?.includes('vercel');

let db: ReturnType<typeof import('drizzle-orm/better-sqlite3').drizzle> | ReturnType<typeof import('drizzle-orm/vercel-postgres').drizzle>;
let schema: typeof import('./schema.sqlite') | typeof import('./schema');

if (isDevelopment) {
  // ローカル開発環境ではSQLiteを使用
  const Database = require('better-sqlite3');
  const { drizzle: drizzleSqlite } = require('drizzle-orm/better-sqlite3');
  schema = require('./schema.sqlite');
  const sqlite = new Database('local.db');
  db = drizzleSqlite(sqlite, { schema });
} else {
  // 本番環境ではVercel Postgresを使用
  const { drizzle: drizzlePostgres } = require('drizzle-orm/vercel-postgres');
  const { sql } = require('@vercel/postgres');
  schema = require('./schema');
  db = drizzlePostgres(sql, { schema });
}

export { db };
export const { users, posts, reactions } = schema;
export type { User, NewUser, Post, NewPost, Reaction, NewReaction } from './schema';
