import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  categories,
  contactMessages,
  orderItems,
  orders,
  products,
  storeSettings,
} from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();

  const [cats, prods, ords, items, settingsRows, msgs] = await Promise.all([
    db.select().from(categories),
    db.select().from(products),
    db.select().from(orders),
    db.select().from(orderItems),
    db.select().from(storeSettings).where(eq(storeSettings.id, 1)),
    db.select().from(contactMessages),
  ]);

  const payload = {
    meta: {
      store: "Damascus Flowers | أزهار دمشق",
      version: "1.0",
      exportedAt: new Date().toISOString(),
    },
    data: {
      categories: cats,
      products: prods,
      orders: ords,
      orderItems: items,
      storeSettings: settingsRows.map((s) => ({
        ...s,
        adminPasswordHash: "",
      })),
      contactMessages: msgs,
    },
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="damascus-flowers-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    },
  });
}
