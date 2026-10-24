import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  storeSettings,
  type DeliveryZoneConfig,
  type PaymentMethodConfig,
} from "@/db/schema";
import { hashPassword, isAdminAuthenticated } from "@/lib/auth";
import { sanitizeText, slugifyInput } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();

  const [row] = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1);

  return NextResponse.json({
    ok: true,
    settings: row ? { ...row, adminPasswordHash: undefined } : null,
    cloudApiEnvConfigured: Boolean(process.env.WHATSAPP_CLOUD_API_TOKEN),
  });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.storeNameAr === "string" && body.storeNameAr.trim()) {
    updates.storeNameAr = sanitizeText(body.storeNameAr, 100);
  }
  if (typeof body.storeNameEn === "string" && body.storeNameEn.trim()) {
    updates.storeNameEn = sanitizeText(body.storeNameEn, 100);
  }
  if (typeof body.whatsappNumber === "string" && body.whatsappNumber.trim()) {
    updates.whatsappNumber = sanitizeText(body.whatsappNumber, 30);
  }
  if (typeof body.phoneDisplay === "string") {
    updates.phoneDisplay = sanitizeText(body.phoneDisplay, 40);
  }
  if (typeof body.instagramUrl === "string") {
    updates.instagramUrl = sanitizeText(body.instagramUrl, 250);
  }
  if (typeof body.facebookUrl === "string") {
    updates.facebookUrl = sanitizeText(body.facebookUrl, 250);
  }
  if (typeof body.tiktokUrl === "string") {
    updates.tiktokUrl = sanitizeText(body.tiktokUrl, 250);
  }
  if (typeof body.emailAddress === "string") {
    updates.emailAddress = sanitizeText(body.emailAddress, 120);
  }
  if (typeof body.workingHoursAr === "string") {
    updates.workingHoursAr = sanitizeText(body.workingHoursAr, 250);
  }
  if (typeof body.announcementBarAr === "string") {
    updates.announcementBarAr = sanitizeText(body.announcementBarAr, 300);
  }
  if (body.vipPackagingFeeJod !== undefined) {
    const fee = Math.max(0, Number.parseFloat(String(body.vipPackagingFeeJod)) || 0);
    updates.vipPackagingFeeJod = fee.toFixed(2);
  }
  if (typeof body.whatsappAutoNotifyEnabled === "boolean") {
    updates.whatsappAutoNotifyEnabled = body.whatsappAutoNotifyEnabled;
  }
  if (typeof body.whatsappPhoneNumberId === "string") {
    updates.whatsappPhoneNumberId = sanitizeText(body.whatsappPhoneNumberId, 80);
  }
  if (typeof body.whatsappTemplateName === "string") {
    updates.whatsappTemplateName = sanitizeText(body.whatsappTemplateName, 80);
  }

  if (Array.isArray(body.deliveryZones)) {
    const cleanZones: DeliveryZoneConfig[] = body.deliveryZones
      .map((z, idx) => {
        if (!z || typeof z !== "object") return null;
        const rec = z as Record<string, unknown>;
        const nameAr = sanitizeText(rec.nameAr, 120);
        if (!nameAr) return null;
        const rawFee = rec.feeJod;
        const feeJod =
          rawFee === null || rawFee === "" || rawFee === undefined
            ? null
            : Math.max(0, Number.parseFloat(String(rawFee)) || 0);
        return {
          id: sanitizeText(rec.id, 80) || `${slugifyInput(nameAr)}-${idx}`,
          nameAr,
          feeJod,
          noteAr: sanitizeText(rec.noteAr, 200),
          enabled: rec.enabled !== false,
        };
      })
      .filter((z): z is DeliveryZoneConfig => Boolean(z));
    updates.deliveryZones = cleanZones;
  }

  if (Array.isArray(body.paymentMethods)) {
    const cleanPayments: PaymentMethodConfig[] = body.paymentMethods
      .map((pm, idx) => {
        if (!pm || typeof pm !== "object") return null;
        const rec = pm as Record<string, unknown>;
        const nameAr = sanitizeText(rec.nameAr, 100);
        if (!nameAr) return null;
        return {
          id: sanitizeText(rec.id, 60) || `pm-${idx}`,
          nameAr,
          descriptionAr: sanitizeText(rec.descriptionAr, 240),
          enabled: Boolean(rec.enabled),
        };
      })
      .filter((pm): pm is PaymentMethodConfig => Boolean(pm));
    updates.paymentMethods = cleanPayments;
  }

  if (typeof body.newAdminPassword === "string" && body.newAdminPassword.trim()) {
    const pwd = body.newAdminPassword.trim();
    if (pwd.length < 8) {
      return NextResponse.json(
        { ok: false, error: "يجب أن تتكون كلمة المرور الجديدة من 8 خانات على الأقل." },
        { status: 400 }
      );
    }
    updates.adminPasswordHash = hashPassword(pwd);
  }

  const [updated] = await db
    .update(storeSettings)
    .set(updates)
    .where(eq(storeSettings.id, 1))
    .returning();

  return NextResponse.json({
    ok: true,
    settings: updated ? { ...updated, adminPasswordHash: undefined } : null,
  });
}
