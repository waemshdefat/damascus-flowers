export function formatJod(
  amount: string | number | null | undefined,
  symbol = "د.أ."
): string {
  if (amount === null || amount === undefined || amount === "") {
    return "يُحدَّد عند التأكيد";
  }
  const num = typeof amount === "number" ? amount : Number.parseFloat(amount);
  if (!Number.isFinite(num)) {
    return "يُحدَّد عند التأكيد";
  }
  const formatted = Number.isInteger(num)
    ? num.toString()
    : num % 1 === 0
      ? num.toFixed(0)
      : num.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted} ${symbol}`;
}

export function cleanWhatsappDigits(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("07") && digits.length === 10) return `962${digits.slice(1)}`;
  return digits || "962795831917";
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digits = cleanWhatsappDigits(whatsappNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export interface WhatsAppOrderSummaryInput {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone?: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  orderType: "normal" | "secret" | string;
  packagingType: "classic" | "vip" | string;
  paymentMethodLabel: string;
  notes?: string;
  items: Array<{
    nameAr: string;
    quantity: number;
    unitPriceJod: string | number;
    lineTotalJod: string | number;
    priceOnRequest?: boolean;
  }>;
  subtotalJod: string | number;
  packagingFeeJod?: string | number;
  deliveryFeeJod: string | number | null;
  hasPriceOnRequestItems?: boolean;
  totalJod: string | number;
}

export function buildOrderWhatsAppMessage(order: WhatsAppOrderSummaryInput): string {
  const lines: string[] = [
    `🌸 *طلب جديد — أزهار دمشق | Damascus Flowers*`,
    `رقم الطلب: *#${order.orderNumber}*`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 *بيانات المُرسِل (العميل):*`,
    `• الاسم: ${order.customerName}`,
    `• الهاتف: ${order.customerPhone}`,
    `• نوع الطلب: ${order.orderType === "secret" ? "🔒 طلب سري (دون الإفصاح عن هوية المرسل للمستلم)" : "عادي"}`,
    ``,
    `🎁 *بيانات المستلم والتوصيل:*`,
    `• اسم المستلم: ${order.recipientName}`,
    ...(order.recipientPhone ? [`• هاتف المستلم: ${order.recipientPhone}`] : []),
    `• المنطقة: ${order.deliveryArea}`,
    `• العنوان التفصيلي: ${order.deliveryAddress}`,
    `• تاريخ التوصيل المطلوب: ${order.deliveryDate}`,
    `• وقت التوصيل المفضل: ${order.deliveryTimeSlot}`,
    `• التغليف المختار: ${order.packagingType === "vip" ? "✨ تغليف VIP فاخر" : "تغليف كلاسيكي أنيق"}`,
    ``,
    `💐 *المنتجات المطلوبة:*`,
  ];

  for (const item of order.items) {
    if (item.priceOnRequest) {
      lines.push(`• ${item.nameAr} × ${item.quantity} — (السعر يُحدَّد حسب الاختيار)`);
    } else {
      lines.push(
        `• ${item.nameAr} × ${item.quantity} (${formatJod(item.unitPriceJod)} للقطعة) = *${formatJod(item.lineTotalJod)}*`
      );
    }
  }

  if (order.notes && order.notes.trim()) {
    lines.push(``, `📝 *ملاحظات الطلب / نص البطاقة:*`, order.notes.trim());
  }

  const pkgFee = Number(order.packagingFeeJod ?? 0);
  const delivText =
    order.deliveryFeeJod === null || order.deliveryFeeJod === undefined || order.deliveryFeeJod === ""
      ? "تُحدَّد حسب الحي والمنطقة عند التأكيد"
      : Number(order.deliveryFeeJod) === 0
        ? "مجانًا"
        : formatJod(order.deliveryFeeJod);

  lines.push(
    ``,
    `💳 *ملخص الفاتورة والدفع:*`,
    `• تكلفة المنتجات: ${formatJod(order.subtotalJod)}`,
    ...(pkgFee > 0 ? [`• رسوم تغليف VIP: ${formatJod(pkgFee)}`] : []),
    `• تكلفة التوصيل: ${delivText}`,
    `• طريقة الدفع: ${order.paymentMethodLabel}`,
    `• *الإجمالي${order.deliveryFeeJod === null || order.hasPriceOnRequestItems ? " المبدئي للمنتجات" : " النهائي"}: ${formatJod(order.totalJod)}*`
  );

  return lines.join("\n");
}

export const ORDER_STATUS_LABELS: Record<
  string,
  { label: string; colorClass: string }
> = {
  new: {
    label: "طلب جديد",
    colorClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  confirmed: {
    label: "تم التأكيد",
    colorClass: "bg-blue-100 text-blue-900 border-blue-300",
  },
  preparing: {
    label: "قيد التنسيق والتجهيز",
    colorClass: "bg-purple-100 text-purple-900 border-purple-300",
  },
  out_for_delivery: {
    label: "خرج للتوصيل",
    colorClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  delivered: {
    label: "تم التسليم",
    colorClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  cancelled: {
    label: "ملغي",
    colorClass: "bg-rose-100 text-rose-900 border-rose-300",
  },
};

export const TIME_SLOT_OPTIONS = [
  "صباحًا (10:00 ص – 1:00 م)",
  "ظهيرة وعصرًا (1:00 م – 5:00 م)",
  "مساءً (5:00 م – 9:00 م)",
  "في أقرب وقت متاح اليوم",
];
