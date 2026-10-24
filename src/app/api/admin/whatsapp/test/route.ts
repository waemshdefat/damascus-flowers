import { NextResponse } from "next/server";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendWhatsAppCloudNotification } from "@/lib/whatsapp";
import { eq } from "drizzle-orm";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }

  const [settings] = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1);

  const result = await sendWhatsAppCloudNotification({
    recipientWhatsappNumber: settings?.whatsappNumber || "+962795831917",
    messageBody:
      "🌸 رسالة اختبار من لوحة إدارة متجر أزهار دمشق (Damascus Flowers) — تم التحقق من ربط إشعارات الطلبات بنجاح.",
    phoneNumberId: settings?.whatsappPhoneNumberId,
    templateName: settings?.whatsappTemplateName,
    useTemplateOnly: true,
  });

  return NextResponse.json({
    ok: result.status === "sent",
    result,
  });
}
