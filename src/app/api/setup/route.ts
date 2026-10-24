import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
import { ensureSchema } from "@/db/ensure-schema";
import { categories, products, storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-time browser-based setup for serverless hosting (no terminal needed):
 *   GET /api/setup?key=SETUP_KEY
 * 1) Creates all tables if missing   2) Restores the shipped catalog backup (30 products, categories, settings)
 * Safe to call again: it upserts by slug and never deletes data. Disabled when SETUP_KEY is not configured.
 */
export async function GET(request: Request) {
  const expected = process.env.SETUP_KEY;
  const given = new URL(request.url).searchParams.get("key") || "";
  if (!expected || given.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  try {
    // 1) Create tables (idempotent DDL mirroring src/db/schema.ts)
    await ensureSchema();
    log.push("tables ready");

    // 2) Seed defaults if empty
    await ensureSeeded();
    log.push("defaults seeded");

    // 3) Restore shipped catalog backup (upsert by slug)
    const file = path.join(process.cwd(), "backups", "damascus-flowers-catalog-export.json");
    let restored = 0;
    try {
      const raw = JSON.parse(await fs.readFile(file, "utf-8"));
      const data = raw.data ?? raw;
      for (const c of data.categories ?? []) {
        const { id: _i, createdAt: _c, ...rest } = c;
        await db.insert(categories).values(rest).onConflictDoUpdate({ target: categories.slug, set: rest });
      }
      for (const p of data.products ?? []) {
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = p;
        await db.insert(products).values(rest).onConflictDoUpdate({ target: products.slug, set: { ...rest, updatedAt: new Date() } });
        restored++;
      }
      const s = (data.storeSettings ?? [])[0];
      if (s) {
        const { id: _i, updatedAt: _u, adminPasswordHash: _h, ...rest } = s;
        await db.update(storeSettings).set(rest).where(eq(storeSettings.id, 1));
      }
      log.push(`catalog restored: ${restored} products`);
    } catch (e) {
      log.push(`catalog backup not found or failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    const [{ count }] = (await db.execute(sql`SELECT count(*)::int AS count FROM products`)).rows as Array<{ count: number }>;
    return NextResponse.json({ ok: true, log, productsInDatabase: count,
      next: "Open /admin and sign in with ADMIN_PASSWORD, then change it. You may now remove SETUP_KEY from the environment." });
  } catch (err) {
    return NextResponse.json({ ok: false, log, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
