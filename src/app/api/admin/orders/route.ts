import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { contactMessages, orderItems, orders } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();

  const [allOrders, allItems, messages] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
  ]);

  const itemsByOrder = new Map<number, typeof allItems>();
  for (const item of allItems) {
    const arr = itemsByOrder.get(item.orderId) ?? [];
    arr.push(item);
    itemsByOrder.set(item.orderId, arr);
  }

  return NextResponse.json({
    ok: true,
    orders: allOrders.map((o) => ({
      ...o,
      items: itemsByOrder.get(o.id) ?? [],
    })),
    messages,
  });
}
