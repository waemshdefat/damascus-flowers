import React from "react";
import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { getActiveProducts, getPublicStoreSettings } from "@/lib/store-queries";
import { DEFAULT_DELIVERY_ZONES, DEFAULT_PAYMENT_METHODS } from "@/db/seed-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إتمام الطلب",
  description:
    "أكمل طلبك من متجر أزهار دمشق (Damascus Flowers) بسهولة من الهاتف أو الحاسوب مع خيار الدفع عند الاستلام وإرسال ملخص الطلب عبر واتساب.",
  alternates: {
    canonical: "/checkout",
  },
};

export default async function CheckoutPage() {
  const [settings, products] = await Promise.all([
    getPublicStoreSettings(),
    getActiveProducts(),
  ]);

  const addonOptions = products
    .filter((p) => p.inStock && p.isAddon)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      priceJod: p.priceJod,
      priceOnRequest: p.priceOnRequest,
      image: p.images[0]?.url || "/images/brand/logo-8016.png",
      inStock: p.inStock,
    }));

  const catalogOptions = products
    .filter((p) => p.inStock && !p.isAddon)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      priceJod: p.priceJod,
      priceOnRequest: p.priceOnRequest,
      image: p.images[0]?.url || "/images/brand/logo-8016.png",
      inStock: p.inStock,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#965866]">
          طلب سريع وآمن — أزهار دمشق
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
          إتمام الطلب وتفاصيل التوصيل
        </h1>
        <p className="text-sm sm:text-base text-[#695244] max-w-2xl">
          أدخل بيانات المستلم وموعد التوصيل المفضل، واختر نوع التغليف وطريقة الدفع
          المناسبة لك.
        </p>
      </div>

      <CheckoutClient
        catalogProducts={catalogOptions}
        addonProducts={addonOptions}
        deliveryZones={settings?.deliveryZones || DEFAULT_DELIVERY_ZONES}
        paymentMethods={settings?.paymentMethods || DEFAULT_PAYMENT_METHODS}
        vipPackagingFeeJod={Number.parseFloat(settings?.vipPackagingFeeJod || "0") || 0}
      />
    </div>
  );
}
