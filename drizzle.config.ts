import type { Config } from 'drizzle-kit';

const isDevelopment = process.env.NODE_ENV !== 'production' && !process.env.POSTGRES_URL?.includes('vercel');

const config: Config = isDevelopment
  ? {
      schema: './packages/db/schema.sqlite.ts',
      out: './drizzle',
      dialect: 'sqlite',
      dbCredentials: {
        url: 'local.db',
      },
    }
  : {
      schema: './packages/db/schema.ts',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.POSTGRES_URL || '',
      },
    };

export default config;
