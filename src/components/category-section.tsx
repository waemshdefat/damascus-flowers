import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product-card";

export function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: ProductCardData[];
  whatsappNumber: string;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}

export function CategorySection({
  slug,
  nameAr,
  descriptionAr,
  heroImage,
  products,
  whatsappNumber,
  showViewAll = true,
}: {
  slug: string;
  nameAr: string;
  descriptionAr: string;
  heroImage: string;
  products: ProductCardData[];
  whatsappNumber: string;
  showViewAll?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section id={`cat-${slug}`} className="space-y-4 sm:space-y-6 scroll-mt-28">
      {/* Elegant category banner: name + description over the category image */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EAE0D3] bg-[#3D2B1F]">
        <img
          src={heroImage}
          alt={nameAr}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#2A1C13]/85 via-[#2A1C13]/55 to-[#2A1C13]/20" />
        <div className="relative p-5 sm:p-8 min-h-[150px] sm:min-h-[190px] flex flex-col justify-end gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 text-[#3D2B1F] text-[11px] sm:text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8965A]" />
            {products.length} منتج
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#FAF7F2] leading-tight">
            {nameAr}
          </h2>
          <p className="text-xs sm:text-sm text-[#EADFD0] leading-relaxed line-clamp-2 max-w-2xl">
            {descriptionAr}
          </p>
          {showViewAll && (
            <Link
              href={`/category/${slug}`}
              className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F5E1E4] hover:text-white"
            >
              <span>عرض القسم كاملًا</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <ProductGrid products={products} whatsappNumber={whatsappNumber} />
    </section>
  );
}
