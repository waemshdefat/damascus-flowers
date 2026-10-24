export function sanitizeText(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function slugifyInput(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || `item-${Date.now()}`;
}

export interface ValidatedOrderInput {
  customerName: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryZoneId: string;
  deliveryAreaCustom: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  orderType: "normal" | "secret";
  packagingType: "classic" | "vip";
  paymentMethod: string;
  notes: string;
  items: Array<{ productId: number; quantity: number }>;
}

export function validateOrderPayload(
  body: unknown
): { ok: true; data: ValidatedOrderInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "بيانات الطلب غير صالحة." };
  }
  const b = body as Record<string, unknown>;

  const customerName = sanitizeText(b.customerName, 120);
  if (customerName.length < 2) {
    return { ok: false, error: "يرجى إدخال اسم العميل بشكل صحيح." };
  }

  const customerPhone = sanitizeText(b.customerPhone, 30);
  if (!isValidPhone(customerPhone)) {
    return { ok: false, error: "يرجى إدخال رقم هاتف عميل صحيح (8 أرقام على الأقل)." };
  }

  const recipientName = sanitizeText(b.recipientName, 120);
  if (recipientName.length < 2) {
    return { ok: false, error: "يرجى إدخال اسم مستلم الهدية." };
  }

  const recipientPhone = sanitizeText(b.recipientPhone, 30);
  if (recipientPhone && !isValidPhone(recipientPhone)) {
    return { ok: false, error: "رقم هاتف المستلم المُدخل غير صالح." };
  }

  const deliveryZoneId = sanitizeText(b.deliveryZoneId, 80);
  const deliveryAreaCustom = sanitizeText(b.deliveryAreaCustom, 120);
  if (!deliveryZoneId && !deliveryAreaCustom) {
    return { ok: false, error: "يرجى اختيار منطقة التوصيل." };
  }

  const deliveryAddress = sanitizeText(b.deliveryAddress, 400);
  if (deliveryAddress.length < 4) {
    return { ok: false, error: "يرجى كتابة عنوان التوصيل التفصيلي (الحي / الشارع / معلم قريب)." };
  }

  const deliveryDate = sanitizeText(b.deliveryDate, 30);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return { ok: false, error: "يرجى تحديد تاريخ التوصيل المطلوب." };
  }

  const deliveryTimeSlot = sanitizeText(b.deliveryTimeSlot, 100);
  if (!deliveryTimeSlot) {
    return { ok: false, error: "يرجى اختيار وقت التوصيل المفضل." };
  }

  const orderType = b.orderType === "secret" ? "secret" : "normal";
  const packagingType = b.packagingType === "vip" ? "vip" : "classic";
  const paymentMethod = sanitizeText(b.paymentMethod, 50) || "cod";
  const notes = sanitizeText(b.notes, 1000);

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { ok: false, error: "سلة المشتريات فارغة — يرجى اختيار منتج واحد على الأقل." };
  }
  if (b.items.length > 30) {
    return { ok: false, error: "عدد العناصر يتجاوز الحد المسموح به في الطلب الواحد." };
  }

  const normalizedItems: Array<{ productId: number; quantity: number }> = [];
  for (const rawItem of b.items) {
    if (!rawItem || typeof rawItem !== "object") continue;
    const rec = rawItem as Record<string, unknown>;
    const productId = Number(rec.productId);
    const quantity = Number(rec.quantity);
    if (!Number.isInteger(productId) || productId <= 0) {
      return { ok: false, error: "أحد المنتجات المختارة غير صالح." };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return { ok: false, error: "يرجى التأكد من أن كمية كل منتج بين 1 و50." };
    }
    normalizedItems.push({ productId, quantity });
  }

  if (normalizedItems.length === 0) {
    return { ok: false, error: "لم يتم العثور على منتجات صالحة في الطلب." };
  }

  return {
    ok: true,
    data: {
      customerName,
      customerPhone,
      recipientName,
      recipientPhone,
      deliveryZoneId,
      deliveryAreaCustom,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      orderType,
      packagingType,
      paymentMethod,
      notes,
      items: normalizedItems,
    },
  };
}
