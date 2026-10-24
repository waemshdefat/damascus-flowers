import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeeded } from "@/db/seed";
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
    const ddl: string[] = [
      `CREATE TABLE IF NOT EXISTS categories (
        id serial PRIMARY KEY, slug text NOT NULL UNIQUE, name_ar text NOT NULL, name_en text NOT NULL,
        description_ar text NOT NULL, hero_image text NOT NULL, sort_order integer NOT NULL DEFAULT 0,
        is_active boolean NOT NULL DEFAULT true, created_at timestamp DEFAULT now() NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS products (
        id serial PRIMARY KEY, slug text NOT NULL UNIQUE, legacy_slugs jsonb NOT NULL DEFAULT '[]',
        name_ar text NOT NULL, subtitle_ar text NOT NULL DEFAULT '', description_ar text NOT NULL,
        care_tips_ar text NOT NULL DEFAULT '', price_jod numeric(10,2) NOT NULL DEFAULT 0,
        compare_at_price_jod numeric(10,2), badge_text_ar text NOT NULL DEFAULT '', is_addon boolean NOT NULL DEFAULT false,
        price_on_request boolean NOT NULL DEFAULT false, category_slug text NOT NULL,
        secondary_categories jsonb NOT NULL DEFAULT '[]', images jsonb NOT NULL DEFAULT '[]',
        stock_quantity integer, in_stock boolean NOT NULL DEFAULT true, is_featured boolean NOT NULL DEFAULT false,
        is_active boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 100,
        created_at timestamp DEFAULT now() NOT NULL, updated_at timestamp DEFAULT now() NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS orders (
        id serial PRIMARY KEY, order_number text NOT NULL UNIQUE, customer_name text NOT NULL, customer_phone text NOT NULL,
        recipient_name text NOT NULL, recipient_phone text NOT NULL DEFAULT '', delivery_area text NOT NULL,
        delivery_address text NOT NULL, delivery_date text NOT NULL, delivery_time_slot text NOT NULL,
        order_type text NOT NULL DEFAULT 'normal', packaging_type text NOT NULL DEFAULT 'classic',
        payment_method text NOT NULL DEFAULT 'cod', notes text NOT NULL DEFAULT '',
        subtotal_jod numeric(10,2) NOT NULL, packaging_fee_jod numeric(10,2) NOT NULL DEFAULT 0,
        delivery_fee_jod numeric(10,2), has_price_on_request_items boolean NOT NULL DEFAULT false,
        total_jod numeric(10,2) NOT NULL, status text NOT NULL DEFAULT 'new',
        whatsapp_notification_status text NOT NULL DEFAULT 'not_configured',
        whatsapp_notification_detail text NOT NULL DEFAULT '',
        created_at timestamp DEFAULT now() NOT NULL, updated_at timestamp DEFAULT now() NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS order_items (
        id serial PRIMARY KEY, order_id integer NOT NULL, product_id integer NOT NULL, product_slug text NOT NULL,
        product_name_ar text NOT NULL, product_image text NOT NULL, unit_price_jod numeric(10,2) NOT NULL,
        price_on_request boolean NOT NULL DEFAULT false, quantity integer NOT NULL, line_total_jod numeric(10,2) NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS store_settings (
        id integer PRIMARY KEY DEFAULT 1, store_name_ar text NOT NULL DEFAULT 'أزهار دمشق',
        store_name_en text NOT NULL DEFAULT 'Damascus Flowers', country_ar text NOT NULL DEFAULT 'الأردن',
        currency_code text NOT NULL DEFAULT 'JOD', currency_symbol_ar text NOT NULL DEFAULT 'د.أ.',
        whatsapp_number text NOT NULL DEFAULT '+962795831917', phone_display text NOT NULL DEFAULT '+962 79 583 1917',
        instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/dmscs.flowers/',
        facebook_url text NOT NULL DEFAULT '', tiktok_url text NOT NULL DEFAULT '', email_address text NOT NULL DEFAULT '',
        working_hours_ar text NOT NULL DEFAULT '', announcement_bar_ar text NOT NULL DEFAULT '',
        vip_packaging_fee_jod numeric(10,2) NOT NULL DEFAULT 0, delivery_zones jsonb NOT NULL DEFAULT '[]',
        payment_methods jsonb NOT NULL DEFAULT '[]', whatsapp_auto_notify_enabled boolean NOT NULL DEFAULT false,
        whatsapp_phone_number_id text NOT NULL DEFAULT '', whatsapp_template_name text NOT NULL DEFAULT 'hello_world',
        admin_password_hash text NOT NULL DEFAULT '', updated_at timestamp DEFAULT now() NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id serial PRIMARY KEY, name text NOT NULL, phone text NOT NULL, subject text NOT NULL DEFAULT '',
        message text NOT NULL, is_read boolean NOT NULL DEFAULT false, created_at timestamp DEFAULT now() NOT NULL)`,
    ];
    for (const statement of ddl) {
      await db.execute(sql.raw(statement));
    }
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
