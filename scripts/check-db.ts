import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../packages/db/schema.sqlite';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });

console.log('\n=== ユーザー情報 ===');
const users = db.select().from(schema.users).all();
console.log('ユーザー数:', users.length);
users.forEach((user) => {
  console.log({
    id: user.id,
    email: user.email,
    handle: user.handle,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
});

console.log('\n=== 認証トークン ===');
const tokens = db.select().from(schema.verificationTokens).all();
console.log('トークン数:', tokens.length);
tokens.forEach((token) => {
  console.log({
    identifier: token.identifier,
    expires: token.expires,
  });
});

console.log('\n=== アカウント連携 ===');
const accounts = db.select().from(schema.accounts).all();
console.log('アカウント数:', accounts.length);
accounts.forEach((account) => {
  console.log({
    userId: account.userId,
    provider: account.provider,
    type: account.type,
  });
});

sqlite.close();
