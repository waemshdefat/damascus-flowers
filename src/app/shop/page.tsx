import React from "react";
import type { Metadata } from "next";
import { ShopFilterClient } from "@/components/shop-filter-client";
import {
  getActiveCategories,
  getActiveProducts,
  getPublicStoreSettings,
} from "@/lib/store-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متجر الباقات والهدايا",
  description:
    "تصفح جميع باقات الورد الطبيعي وبوكسات الهدايا الفاخرة والدببة الإضافية في متجر أزهار دمشق (Damascus Flowers) بأسعار واضحة بالدينار الأردني.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const [settings, categories, products] = await Promise.all([
    getPublicStoreSettings(),
    getActiveCategories(),
    getActiveProducts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#965866]">
          متجر أزهار دمشق | Damascus Flowers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
          كتالوج الزهور والهدايا الفاخرة
        </h1>
        <p className="text-sm sm:text-base text-[#695244] max-w-2xl">
          جميع الأسعار معروضة بوضوح بالدينار الأردني (د.أ.)، مع إمكانية الإضافة
          المباشرة للسلة أو إتمام الطلب عبر واتساب.
        </p>
      </div>

      <ShopFilterClient
        categories={categories.map((c) => ({
          slug: c.slug,
          nameAr: c.nameAr,
          descriptionAr: c.descriptionAr,
          heroImage: c.heroImage,
        }))}
        products={products.filter((p) => !p.isAddon)}
        initialCategory={sp.category || "all"}
        whatsappNumber={settings?.whatsappNumber || "+962795831917"}
      />
    </div>
  );
}
