/**
 * Restore products / categories / store settings from a Damascus Flowers backup JSON
 * (exported from /admin → "تنزيل نسخة احتياطية" or /api/admin/backup).
 * Usage (on the server):  docker compose exec -T app node node_modules/tsx/dist/cli.mjs scripts/restore-backup.ts backups/damascus-flowers-catalog-export.json
 * Usage (locally):        npx tsx --env-file=.env scripts/restore-backup.ts backups/damascus-flowers-backup.json
 */
import fs from "node:fs";
import { db } from "../src/db";
import { categories, products, storeSettings, orders, orderItems } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const file = process.argv[2];
  const raw = file ? fs.readFileSync(file, "utf-8") : fs.readFileSync(0, "utf-8");
  const backup = JSON.parse(raw);
  const data = backup.data ?? backup;

  for (const c of data.categories ?? []) {
    const { id, createdAt, ...rest } = c;
    await db.insert(categories).values(rest).onConflictDoUpdate({ target: categories.slug, set: rest });
  }
  for (const p of data.products ?? []) {
    const { id, createdAt, updatedAt, ...rest } = p;
    await db.insert(products).values(rest).onConflictDoUpdate({ target: products.slug, set: { ...rest, updatedAt: new Date() } });
  }
  const s = (data.storeSettings ?? [])[0];
  if (s) {
    const { id, updatedAt, adminPasswordHash, ...rest } = s;
    const existing = await db.select({ id: storeSettings.id }).from(storeSettings).where(eq(storeSettings.id, 1));
    if (existing.length) await db.update(storeSettings).set(rest).where(eq(storeSettings.id, 1));
    else await db.insert(storeSettings).values({ id: 1, ...rest });
  }
  // Orders are optional (historical)
  for (const o of data.orders ?? []) {
    const { id, ...rest } = o;
    const [ins] = await db.insert(orders).values(rest).onConflictDoNothing({ target: orders.orderNumber }).returning({ id: orders.id });
    if (ins) {
      for (const it of (data.orderItems ?? []).filter((x: { orderId: number }) => x.orderId === id)) {
        const { id: _i, orderId: _o, ...r } = it;
        await db.insert(orderItems).values({ ...r, orderId: ins.id });
      }
    }
  }
  console.log("Restore complete:", (data.categories ?? []).length, "categories,", (data.products ?? []).length, "products");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
