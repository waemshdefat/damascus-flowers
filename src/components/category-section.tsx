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
      {/* Elegant light category banner: cream card, image on one side, brown text */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EAE0D3] bg-[#FFFDFB] shadow-xs flex flex-row items-stretch">
        <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center gap-2 min-w-0">
          <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#965866] text-[11px] sm:text-xs font-bold border border-[#E8C5CB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8965A]" />
            {products.length} منتج
          </span>
          <h2 className="text-lg sm:text-3xl font-extrabold text-[#3D2B1F] leading-tight">
            {nameAr}
          </h2>
          <p className="text-xs sm:text-sm text-[#695244] leading-relaxed line-clamp-3 max-w-2xl">
            {descriptionAr}
          </p>
          {showViewAll && (
            <Link
              href={`/category/${slug}`}
              className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-bold text-[#965866] hover:text-[#3D2B1F]"
            >
              <span>عرض القسم كاملًا</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <div className="w-28 sm:w-56 lg:w-72 shrink-0 bg-white border-r border-[#F1E9DF]">
          <img
            src={heroImage}
            alt={nameAr}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <ProductGrid products={products} whatsappNumber={whatsappNumber} />
    </section>
  );
}
