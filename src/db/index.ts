import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// During `next build` (page data collection) DATABASE_URL may be absent on hosts like Vercel
// until the env var is configured. We must NOT throw at import time — only when a query runs.
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://build:build@127.0.0.1:1/build_placeholder";

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set — using a placeholder. Queries will fail until it is configured."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const needsSsl =
  /sslmode=require/i.test(databaseUrl) ||
  (!/localhost|127\.0\.0\.1|@db:/i.test(databaseUrl) &&
    /neon\.tech|supabase|render\.com|railway/i.test(databaseUrl));

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    connectionTimeoutMillis: 8000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
