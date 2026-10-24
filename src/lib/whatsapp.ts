import { cleanWhatsappDigits } from "./format";

export interface CloudApiResult {
  status: "not_configured" | "sent" | "failed";
  detail: string;
}

export async function sendWhatsAppCloudNotification(params: {
  recipientWhatsappNumber: string;
  messageBody: string;
  phoneNumberId?: string;
  templateName?: string;
  useTemplateOnly?: boolean;
}): Promise<CloudApiResult> {
  const accessToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId =
    params.phoneNumberId?.trim() || process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() || "";

  if (!accessToken || !phoneNumberId) {
    return {
      status: "not_configured",
      detail:
        "الإشعار التلقائي عبر WhatsApp Cloud API غير مُفعَّل بعد (يتطلب إضافة WHATSAPP_CLOUD_API_TOKEN و WHATSAPP_PHONE_NUMBER_ID من Meta Business).",
    };
  }

  const to = cleanWhatsappDigits(params.recipientWhatsappNumber);
  const endpoint = `https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`;

  const payload = params.useTemplateOnly
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: params.templateName || process.env.WHATSAPP_TEMPLATE_NAME || "hello_world",
          language: { code: params.templateName === "hello_world" ? "en_US" : "ar" },
        },
      }
    : {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        preview_url: false,
        text: { body: params.messageBody.slice(0, 3900) },
      };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    if (!res.ok) {
      return {
        status: "failed",
        detail:
          data?.error?.message ||
          `تعذّر إرسال إشعار Cloud API (رمز الاستجابة ${res.status}).`,
      };
    }

    const msgId = data?.messages?.[0]?.id || "ok";
    return {
      status: "sent",
      detail: `تم إرسال إشعار واتساب التلقائي بنجاح عبر Cloud API (${msgId}).`,
    };
  } catch (err) {
    return {
      status: "failed",
      detail: err instanceof Error ? err.message : "خطأ في الاتصال بخدمة Meta Cloud API.",
    };
  }
}
