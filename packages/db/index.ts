import 'server-only';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { VercelPgDatabase } from 'drizzle-orm/vercel-postgres';

const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL?.includes('vercel');

type DatabaseType = BetterSQLite3Database | VercelPgDatabase;

let db: DatabaseType;
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
export const { users, accounts, sessions, verificationTokens, posts, reactions } = schema;
export type { User, NewUser, Post, NewPost, Reaction, NewReaction } from './schema';
