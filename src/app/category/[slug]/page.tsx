import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import {
  getActiveCategories,
  getActiveProducts,
  getPublicStoreSettings,
} from "@/lib/store-queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find((c) => c.slug === decodeURIComponent(slug));
  if (!cat) {
    return { title: "قسم غير موجود" };
  }
  return {
    title: cat.nameAr,
    description: cat.descriptionAr,
    alternates: {
      canonical: `/category/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const [settings, categories, products] = await Promise.all([
    getPublicStoreSettings(),
    getActiveCategories(),
    getActiveProducts(),
  ]);

  const currentCategory = categories.find((c) => c.slug === decodedSlug);
  if (!currentCategory) {
    notFound();
  }

  const categoryProducts = products.filter(
    (p) =>
      p.categorySlug === currentCategory.slug ||
      (Array.isArray(p.secondaryCategories) &&
        p.secondaryCategories.includes(currentCategory.slug))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Breadcrumb & Category Banner */}
      <div className="rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] p-6 sm:p-10 space-y-4">
        <nav className="text-xs text-[#8A7262] flex items-center gap-2">
          <Link href="/" className="hover:text-[#3D2B1F]">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#3D2B1F]">
            المتجر
          </Link>
          <span>/</span>
          <span className="font-bold text-[#3D2B1F]">{currentCategory.nameAr}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
          {currentCategory.nameAr}
        </h1>
        <p className="text-sm sm:text-base text-[#695244] max-w-2xl leading-relaxed">
          {currentCategory.descriptionAr}
        </p>

        {/* Quick Category Switcher */}
        <div className="pt-2 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                cat.slug === currentCategory.slug
                  ? "bg-[#3D2B1F] text-[#FAF7F2]"
                  : "bg-[#FAF7F2] text-[#5C4332] hover:bg-[#F3ECE2] border border-[#E6DDD0]"
              }`}
            >
              {cat.nameAr}
            </Link>
          ))}
        </div>
      </div>

      {/* Category Products */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {categoryProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            whatsappNumber={settings?.whatsappNumber || "+962795831917"}
            product={{
              id: prod.id,
              slug: prod.slug,
              nameAr: prod.nameAr,
              subtitleAr: prod.subtitleAr,
              priceJod: prod.priceJod,
                compareAtPriceJod: prod.compareAtPriceJod,
                badgeTextAr: prod.badgeTextAr,
              priceOnRequest: prod.priceOnRequest,
              categoryLabelAr: currentCategory.nameAr,
              images: prod.images,
              inStock: prod.inStock,
            }}
          />
        ))}
      </div>
    </div>
  );
}
