import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { ORDER_STATUS_LABELS } from "@/lib/format";
import { sanitizeText } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }

  const { id } = await context.params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ ok: false, error: "معرّف الطلب غير صالح." }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ ok: false, error: "الطلب غير موجود." }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.status === "string" && body.status in ORDER_STATUS_LABELS) {
    updates.status = body.status;
  }

  if (typeof body.notes === "string") {
    updates.notes = sanitizeText(body.notes, 1000);
  }

  if ("deliveryFeeJod" in body) {
    const rawFee = body.deliveryFeeJod;
    const subtotal = Number.parseFloat(existing.subtotalJod) || 0;
    const pkgFee = Number.parseFloat(existing.packagingFeeJod) || 0;

    if (rawFee === null || rawFee === "") {
      updates.deliveryFeeJod = null;
      updates.totalJod = (subtotal + pkgFee).toFixed(2);
    } else {
      const feeNum = Math.max(0, Number.parseFloat(String(rawFee)) || 0);
      updates.deliveryFeeJod = feeNum.toFixed(2);
      updates.totalJod = (subtotal + pkgFee + feeNum).toFixed(2);
    }
  }

  const [updated] = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, orderId))
    .returning();

  return NextResponse.json({ ok: true, order: updated });
}
