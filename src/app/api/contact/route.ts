import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { contactMessages, storeSettings } from "@/db/schema";
import { buildWhatsAppUrl } from "@/lib/format";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidPhone, sanitizeText } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`contact:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "يرجى الانتظار قليلًا قبل إرسال رسالة جديدة." },
        { status: 429 }
      );
    }

    await ensureSeeded();
    const raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = sanitizeText(raw.name, 120);
    const phone = sanitizeText(raw.phone, 30);
    const subject = sanitizeText(raw.subject, 160);
    const message = sanitizeText(raw.message, 1500);

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "يرجى كتابة الاسم." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "يرجى إدخال رقم هاتف صحيح للتواصل." },
        { status: 400 }
      );
    }
    if (message.length < 5) {
      return NextResponse.json(
        { ok: false, error: "يرجى كتابة تفاصيل الاستفسار أو الرسالة." },
        { status: 400 }
      );
    }

    await db.insert(contactMessages).values({
      name,
      phone,
      subject,
      message,
    });

    const [settings] = await db
      .select({ whatsappNumber: storeSettings.whatsappNumber })
      .from(storeSettings)
      .where(eq(storeSettings.id, 1))
      .limit(1);

    const waText = [
      `مرحبًا *أزهار دمشق* 🌸`,
      `الاسم: ${name}`,
      `الهاتف: ${phone}`,
      ...(subject ? [`الموضوع: ${subject}`] : []),
      `الرسالة: ${message}`,
    ].join("\n");

    return NextResponse.json({
      ok: true,
      whatsappUrl: buildWhatsAppUrl(settings?.whatsappNumber || "+962795831917", waText),
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json(
      { ok: false, error: "تعذّر إرسال الرسالة حاليًا. يرجى المحاولة لاحقًا." },
      { status: 500 }
    );
  }
}
