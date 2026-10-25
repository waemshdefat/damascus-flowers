"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Gift,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatJod, TIME_SLOT_OPTIONS } from "@/lib/format";
import type { DeliveryZoneConfig, PaymentMethodConfig } from "@/db/schema";

interface CatalogQuickOption {
  id: number;
  slug: string;
  nameAr: string;
  priceJod: string;
  priceOnRequest: boolean;
  image: string;
  inStock: boolean;
}

interface SubmittedOrderResult {
  order: {
    orderNumber: string;
    subtotalJod: string;
    packagingFeeJod: string;
    deliveryFeeJod: string | null;
    hasPriceOnRequestItems: boolean;
    totalJod: string;
    deliveryArea: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    paymentMethodLabel: string;
  };
  whatsappUrl: string;
  whatsappMessage: string;
  cloudNotification: {
    status: "not_configured" | "sent" | "failed";
    detail: string;
  };
}

export function CheckoutClient({
  catalogProducts,
  addonProducts = [],
  deliveryZones,
  paymentMethods,
  vipPackagingFeeJod,
}: {
  catalogProducts: CatalogQuickOption[];
  addonProducts?: CatalogQuickOption[];
  deliveryZones: DeliveryZoneConfig[];
  paymentMethods: PaymentMethodConfig[];
  vipPackagingFeeJod: number;
}) {
  const {
    items,
    subtotalJod,
    hasPriceOnRequest,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const enabledZones = useMemo(
    () => deliveryZones.filter((z) => z.enabled !== false),
    [deliveryZones]
  );
  const enabledPayments = useMemo(() => {
    const active = paymentMethods.filter((p) => p.enabled);
    return active.length > 0
      ? active
      : [
          {
            id: "cod",
            nameAr: "الدفع عند الاستلام",
            descriptionAr: "الدفع نقدًا عند استلام الطلب.",
            enabled: true,
          },
        ];
  }, [paymentMethods]);

  const [quickProductId, setQuickProductId] = useState<string>(
    catalogProducts[0] ? String(catalogProducts[0].id) : ""
  );
  const [quickQty, setQuickQty] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState(enabledZones[0]?.id || "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(todayIso);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(TIME_SLOT_OPTIONS[0]);
  const [orderType, setOrderType] = useState<"normal" | "secret">("normal");
  const [packagingType, setPackagingType] = useState<"classic" | "vip">("classic");
  const [paymentMethod, setPaymentMethod] = useState(enabledPayments[0]?.id || "cod");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedResult, setSubmittedResult] = useState<SubmittedOrderResult | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const currentZone = useMemo(
    () => enabledZones.find((z) => z.id === deliveryZoneId) || null,
    [enabledZones, deliveryZoneId]
  );

  const packagingFee = packagingType === "vip" ? vipPackagingFeeJod : 0;
  const deliveryFee =
    currentZone && typeof currentZone.feeJod === "number" ? currentZone.feeJod : null;
  const grandTotal = subtotalJod + packagingFee + (deliveryFee ?? 0);

  const handleQuickAddProduct = () => {
    const prod = catalogProducts.find((p) => String(p.id) === quickProductId);
    if (!prod) return;
    addItem(
      {
        productId: prod.id,
        slug: prod.slug,
        nameAr: prod.nameAr,
        priceJod: Number.parseFloat(prod.priceJod) || 0,
        priceOnRequest: prod.priceOnRequest,
        image: prod.image,
      },
      quickQty,
      false
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("يرجى اختيار منتج واحد على الأقل لإتمام الطلب.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          recipientName,
          recipientPhone,
          deliveryZoneId,
          deliveryAddress,
          deliveryDate,
          deliveryTimeSlot,
          orderType,
          packagingType,
          paymentMethod,
          notes,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setErrorMsg(data.error || "تعذّر إرسال الطلب، يرجى التحقق من البيانات.");
        setSubmitting(false);
        return;
      }

      clearCart();
      setSubmittedResult(data as SubmittedOrderResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg("حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="max-w-3xl mx-auto rounded-[2rem] bg-[#FFFDFB] border-2 border-[#D4B982] p-6 sm:p-10 shadow-md space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800">
              تم حفظ طلبك بنجاح في نظام إدارة طلبات أزهار دمشق
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
              شكرًا لثقتك بأزهار دمشق!
            </h2>
            <p className="text-sm text-[#695244]">
              رقم الطلب المرجعي:{" "}
              <strong dir="ltr" className="text-[#3D2B1F] text-base">
                #{submittedResult.order.orderNumber}
              </strong>
            </p>
          </div>
        </div>

        {/* Prominent WhatsApp Dispatch CTA */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#EFF9F2] border border-[#BFE5CA] space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-[#175933]">
              أرسل تفاصيل طلبك الجاهزة إلى واتساب المتجر (+962795831917)
            </h3>
            <p className="text-xs sm:text-sm text-[#2A5C3F]">
              تم تجهيز رسالة الطلب الكاملة (بالمنتجات والكميات والأسعار والعنوان
              وموعد التوصيل والإجمالي) لإرسالها فورًا عبر واتساب لتسريع التأكيد.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={submittedResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-60 py-4 px-6 rounded-2xl bg-[#EFF9F2] hover:bg-[#DDF2E3] text-[#175933] border border-[#BFE5CA] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>إرسال تفاصيل الطلب عبر واتساب الآن</span>
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(submittedResult.whatsappMessage);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="py-4 px-5 rounded-2xl bg-white border border-[#BFE5CA] text-[#175933] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "تم نسخ الملخص!" : "نسخ نص الطلب"}</span>
            </button>
          </div>

          {submittedResult.cloudNotification.status === "sent" && (
            <p className="text-xs font-semibold text-emerald-800">
              ✓ {submittedResult.cloudNotification.detail}
            </p>
          )}
        </div>

        {/* Message Preview */}
        <details className="rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0] p-4">
          <summary className="text-xs sm:text-sm font-bold text-[#3D2B1F] cursor-pointer">
            معاينة تفاصيل الطلب المرسلة والمحفوظة
          </summary>
          <pre className="mt-3 whitespace-pre-wrap text-xs sm:text-sm text-[#4A3527] font-sans leading-relaxed">
            {submittedResult.whatsappMessage}
          </pre>
        </details>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-[#FFFDFB] text-[#3D2B1F] border border-[#D8C7B4] text-sm font-bold hover:bg-[#F5E1E4] transition"
          >
            متابعة التسوق
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-[#D8CBB8] text-[#3D2B1F] text-sm font-bold hover:bg-[#F3ECE2] transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* Form Fields Column */}
      <div className="lg:col-span-7 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {/* Section 1: Product & Quantity Selector (Works seamlessly even if arriving directly!) */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#3D2B1F]">
            1. اختيار المنتجات والكمية
          </h2>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <select
              value={quickProductId}
              onChange={(e) => setQuickProductId(e.target.value)}
              aria-label="اختر منتجًا لإضافته إلى الطلب"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm font-medium text-[#3D2B1F]"
            >
              {catalogProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} —{" "}
                  {p.priceOnRequest
                    ? "يُحدَّد عند الطلب"
                    : formatJod(Number.parseFloat(p.priceJod))}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={quickQty}
                onChange={(e) =>
                  setQuickQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))
                }
                aria-label="الكمية"
                className="w-20 px-3 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-center text-sm font-bold text-[#3D2B1F]"
              />
              <button
                type="button"
                onClick={handleQuickAddProduct}
                className="px-4 py-3 rounded-2xl bg-[#F5E1E4] hover:bg-[#ECCFD4] text-[#3D2B1F] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة للطلب</span>
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-xs sm:text-sm text-[#8A7262] bg-[#FAF7F2] p-4 rounded-2xl border border-dashed border-[#DFD2C0]">
              لم تختر منتجًا بعد — اختر باقتك من القائمة أعلاه واضغط «إضافة للطلب»، أو{" "}
              <Link href="/shop" className="underline font-bold text-[#3D2B1F]">
                تصفح صور المتجر
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-2.5 pt-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D6]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.nameAr}
                      className="w-12 h-14 rounded-xl object-cover bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#3D2B1F] truncate">
                        {item.nameAr}
                      </p>
                      <p className="text-xs text-[#7D6352]">
                        {item.priceOnRequest
                          ? "يُحدَّد عند الطلب"
                          : formatJod(item.priceJod)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 rounded-full bg-white border border-[#DFD2C0] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 rounded-full bg-white border border-[#DFD2C0] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-[#9A8474] hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add-on Suggestions: chocolate, teddy bears, etc. (managed from /admin via "منتج إضافي") */}
        {addonProducts.length > 0 && (
          <section className="p-6 sm:p-7 rounded-3xl bg-[#FFF8F3] border border-[#F0DCCB] space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#3D2B1F] flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#B8965A]" />
                  <span>أضف لمسة إضافية لهديتك</span>
                </h2>
                <p className="text-xs text-[#7D6352] mt-1">
                  اقتراحات تُرفق مع الباقة أو البوكس — اضغط «إضافة» لضمّها إلى طلبك.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addonProducts.map((addon) => {
                const inCart = items.find((i) => i.productId === addon.id);
                const price = Number.parseFloat(addon.priceJod) || 0;
                return (
                  <div
                    key={addon.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#EFE2D4]"
                  >
                    <img
                      src={addon.image}
                      alt={addon.nameAr}
                      className="w-16 h-16 rounded-xl object-cover bg-[#FAF7F2] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#3D2B1F] truncate">{addon.nameAr}</p>
                      <p className="text-xs text-[#965866] font-semibold mt-0.5">
                        {addon.priceOnRequest ? "السعر يُحدَّد عند التأكيد" : formatJod(price)}
                      </p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(addon.id, inCart.quantity - 1)}
                          className="p-1.5 rounded-full bg-[#FAF7F2] border border-[#DFD2C0] cursor-pointer"
                          aria-label="تقليل"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{inCart.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(addon.id, inCart.quantity + 1)}
                          className="p-1.5 rounded-full bg-[#FAF7F2] border border-[#DFD2C0] cursor-pointer"
                          aria-label="زيادة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            {
                              productId: addon.id,
                              slug: addon.slug,
                              nameAr: addon.nameAr,
                              priceJod: price,
                              priceOnRequest: addon.priceOnRequest,
                              image: addon.image,
                            },
                            1,
                            false
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-xs font-bold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 2: Sender & Recipient Details */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#3D2B1F]">
            2. بيانات العميل ومستلم الهدية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                اسم العميل (المُرسِل) *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                رقم هاتف العميل (واتساب / اتصال) *
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="079XXXXXXX"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F] text-right"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                اسم مستلم الهدية *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="اسم الشخص المستلم (أو اكتب: نفس العميل)"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                رقم هاتف المستلم (عند الحاجة — اختياري)
              </label>
              <input
                type="tel"
                dir="ltr"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="اختياري لتسهيل التنسيق عند التسليم"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F] text-right"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Delivery Address & Schedule */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#3D2B1F]">
            3. عنوان وموعد التوصيل
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                منطقة التوصيل *
              </label>
              <select
                value={deliveryZoneId}
                onChange={(e) => setDeliveryZoneId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm font-medium text-[#3D2B1F]"
              >
                {enabledZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.nameAr} —{" "}
                    {typeof zone.feeJod === "number"
                      ? zone.feeJod === 0
                        ? "توصيل مجاني"
                        : `رسوم التوصيل: ${formatJod(zone.feeJod)}`
                      : "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة"}
                  </option>
                ))}
              </select>
              {currentZone?.noteAr && (
                <p className="text-xs text-[#7D6352]">{currentZone.noteAr}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                عنوان التوصيل التفصيلي *
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="اسم الحي، الشارع، رقم البناية أو معلم قريب..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                  تاريخ التوصيل المطلوب *
                </label>
                <input
                  type="date"
                  required
                  min={todayIso}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
                  وقت التوصيل المفضل *
                </label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
                >
                  {TIME_SLOT_OPTIONS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Order Privacy Type, Packaging, Notes & Payment */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#3D2B1F]">
            4. خيارات التغليف، الخصوصية، وطريقة الدفع
          </h2>

          {/* Order Type: Normal vs Secret */}
          <div className="space-y-2">
            <span className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
              نوع الطلب (الخصوصية)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType("normal")}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  orderType === "normal"
                    ? "bg-[#F5E1E4]/65 border-[#3D2B1F]"
                    : "bg-[#FAF7F2] border-[#DFD2C0]"
                }`}
              >
                <div className="font-bold text-sm text-[#3D2B1F]">طلب عادي</div>
                <p className="text-xs text-[#695244] mt-1">
                  يُرفق اسم المرسل بشكل اعتيادي عند التسليم أو على البطاقة.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("secret")}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  orderType === "secret"
                    ? "bg-[#F5E1E4]/65 border-[#3D2B1F]"
                    : "bg-[#FAF7F2] border-[#DFD2C0]"
                }`}
              >
                <div className="font-bold text-sm text-[#3D2B1F] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#965866]" />
                  <span>طلب سري</span>
                </div>
                <p className="text-xs text-[#695244] mt-1">
                  توصيل الهدية بسرية تامة دون الإفصاح عن هوية المُرسل للمستلم.
                </p>
              </button>
            </div>
          </div>

          {/* Packaging: Classic vs VIP */}
          <div className="space-y-2">
            <span className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
              مستوى التغليف
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPackagingType("classic")}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  packagingType === "classic"
                    ? "bg-[#F5E1E4]/65 border-[#3D2B1F]"
                    : "bg-[#FAF7F2] border-[#DFD2C0]"
                }`}
              >
                <div className="font-bold text-sm text-[#3D2B1F]">
                  تغليف عادي أنيق
                </div>
                <p className="text-xs text-[#695244] mt-1">
                  تغليف أزهار دمشق المتقن المشمول مع الباقة أو البوكس.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPackagingType("vip")}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  packagingType === "vip"
                    ? "bg-[#F5E1E4]/65 border-[#B8965A]"
                    : "bg-[#FAF7F2] border-[#DFD2C0]"
                }`}
              >
                <div className="font-bold text-sm text-[#3D2B1F] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#B8965A]" />
                  <span>
                    تغليف VIP فاخر
                    {vipPackagingFeeJod > 0 ? ` (+${formatJod(vipPackagingFeeJod)})` : ""}
                  </span>
                </div>
                <p className="text-xs text-[#695244] mt-1">
                  تشطيب فاخر للمناسبات المميزة وشريط إهداء راقٍ وبطاقة فاخرة.
                </p>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <span className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
              طريقة الدفع
            </span>
            <div className="space-y-2.5">
              {enabledPayments.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === pm.id
                      ? "bg-[#FAF5EE] border-[#3D2B1F]"
                      : "bg-[#FAF7F2] border-[#DFD2C0]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                    className="mt-1 accent-[#3D2B1F]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#3D2B1F]">
                      {pm.nameAr}
                    </div>
                    {pm.descriptionAr && (
                      <p className="text-xs text-[#695244] mt-0.5">
                        {pm.descriptionAr}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes & Card Message */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-[#3D2B1F]">
              ملاحظات خاصة بالطلب أو نص بطاقة الإهداء (اختياري)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب عبارة البطاقة المرفقة مع الباقة، أو أي ملاحظات خاصة بالتنسيق أو التوصيل..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
            />
          </div>
        </section>
      </div>

      {/* Sticky Invoice Summary & Submit Column */}
      <aside className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5 shadow-xs lg:sticky lg:top-24">
        <h2 className="text-xl font-extrabold text-[#3D2B1F]">ملخص الطلب والفاتورة</h2>

        <div className="space-y-3 text-sm border-y border-[#F1E9DF] py-4">
          <div className="flex items-center justify-between">
            <span className="text-[#695244]">تكلفة المنتجات</span>
            <span className="font-bold text-[#3D2B1F]">{formatJod(subtotalJod)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#695244]">نوع الطلب / التغليف</span>
            <span className="font-semibold text-[#3D2B1F]">
              {orderType === "secret" ? "سري" : "عادي"} •{" "}
              {packagingType === "vip"
                ? packagingFee > 0
                  ? `VIP (+${formatJod(packagingFee)})`
                  : "VIP فاخر"
                : "عادي"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#695244]">تكلفة التوصيل</span>
            <span className="font-semibold text-[#3D2B1F] text-left">
              {deliveryFee === null
                ? "تُحدَّد حسب الحي والمنطقة"
                : deliveryFee === 0
                  ? "مجانًا"
                  : formatJod(deliveryFee)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold text-[#3D2B1F]">
              {deliveryFee === null ? "إجمالي المنتجات" : "الإجمالي الكلي"}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
              {formatJod(grandTotal)}
              {hasPriceOnRequest ? " +" : ""}
            </span>
          </div>
          {deliveryFee === null && (
            <p className="text-xs text-[#7D6352]">
              تُحدَّد تكلفة التوصيل حسب الحي والمنطقة، ويتم إبلاغكم بها عند تأكيد الطلب دون
              أي رسوم مخفية.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="w-full py-4 px-6 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs disabled:bg-[#C9BBAE] font-extrabold text-base transition shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          {submitting
            ? "جاري تسجيل الطلب..."
            : "تأكيد وتسجيل الطلب (+ تجهيز رسالة واتساب)"}
        </button>

        <p className="text-xs text-center text-[#7D6352] leading-relaxed">
          يُحفظ طلبك فورًا في نظام إدارة طلبات المتجر، ثم يمكنك بنقرة واحدة إرسال
          ملخص الطلب الكامل إلى واتساب المتجر{" "}
          <span dir="ltr" className="font-bold text-[#3D2B1F]">
            +962795831917
          </span>
          .
        </p>
      </aside>
    </form>
  );
}
