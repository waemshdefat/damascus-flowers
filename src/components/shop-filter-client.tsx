"use client";

import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CategorySection, ProductGrid } from "@/components/category-section";
import type { ProductImage } from "@/db/schema";

interface ShopCategoryItem {
  slug: string;
  nameAr: string;
  descriptionAr?: string;
  heroImage?: string;
}

interface ShopProductItem {
  id: number;
  slug: string;
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  priceJod: string;
  compareAtPriceJod?: string | null;
  badgeTextAr?: string;
  priceOnRequest: boolean;
  categorySlug: string;
  secondaryCategories: string[];
  images: ProductImage[];
  inStock: boolean;
  isAddon?: boolean;
  sortOrder: number;
}

export function ShopFilterClient({
  categories,
  products,
  initialCategory = "all",
  whatsappNumber,
}: {
  categories: ShopCategoryItem[];
  products: ShopProductItem[];
  initialCategory?: string;
  whatsappNumber: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">(
    "featured"
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.slug, c.nameAr])),
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchCat =
        selectedCategory === "all" ||
        p.categorySlug === selectedCategory ||
        (Array.isArray(p.secondaryCategories) &&
          p.secondaryCategories.includes(selectedCategory));
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.subtitleAr.toLowerCase().includes(q) ||
        p.descriptionAr.toLowerCase().includes(q)
      );
    });

    if (sortBy === "price_asc") {
      return [...list].sort((a, b) => {
        if (a.priceOnRequest !== b.priceOnRequest) return a.priceOnRequest ? 1 : -1;
        return Number.parseFloat(a.priceJod) - Number.parseFloat(b.priceJod);
      });
    }
    if (sortBy === "price_desc") {
      return [...list].sort((a, b) => {
        if (a.priceOnRequest !== b.priceOnRequest) return a.priceOnRequest ? 1 : -1;
        return Number.parseFloat(b.priceJod) - Number.parseFloat(a.priceJod);
      });
    }
    return list;
  }, [products, selectedCategory, query, sortBy]);

  const toCard = (prod: ShopProductItem, categoryLabelAr?: string) => ({
    id: prod.id,
    slug: prod.slug,
    nameAr: prod.nameAr,
    subtitleAr: prod.subtitleAr,
    priceJod: prod.priceJod,
    compareAtPriceJod: prod.compareAtPriceJod,
    badgeTextAr: prod.badgeTextAr,
    priceOnRequest: prod.priceOnRequest,
    categoryLabelAr,
    images: prod.images,
    inStock: prod.inStock,
  });

  return (
    <div className="space-y-8">
      {/* Filter Controls Bar */}
      <div className="rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] p-4 sm:p-6 space-y-5 shadow-2xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8A7B0]"
                : "bg-[#FAF7F2] text-[#5C4332] hover:bg-[#F3ECE2] border border-[#E6DDD0]"
            }`}
          >
            جميع المنتجات ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                (Array.isArray(p.secondaryCategories) &&
                  p.secondaryCategories.includes(cat.slug))
            ).length;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                  active
                    ? "bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8A7B0]"
                    : "bg-[#FAF7F2] text-[#5C4332] hover:bg-[#F3ECE2] border border-[#E6DDD0]"
                }`}
              >
                {cat.nameAr} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Price Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#8A7262] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن باقة جوري، بيبي روز، بوكس لمسة الحياة..."
              className="w-full pr-11 pl-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E2D6C5] text-sm text-[#3D2B1F] placeholder:text-[#9A8474] focus:outline-none focus:border-[#3D2B1F]"
            />
          </div>

          <div className="md:col-span-4 relative flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8A7262] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price_asc" | "price_desc")
              }
              aria-label="ترتيب المنتجات"
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E2D6C5] text-sm font-medium text-[#3D2B1F] focus:outline-none focus:border-[#3D2B1F]"
            >
              <option value="featured">الترتيب: المختارات المميزة</option>
              <option value="price_asc">السعر: من الأقل إلى الأعلى</option>
              <option value="price_desc">السعر: من الأعلى إلى الأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
          <p className="text-lg font-bold text-[#3D2B1F]">
            لم نعثر على نتائج مطابقة لبحثك حاليًا
          </p>
          <p className="text-sm text-[#7D6352]">
            جرّب اختيار قسم آخر أو مسح كلمة البحث لعرض كافة الباقات والبوكسات.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setQuery("");
            }}
            className="px-6 py-2.5 rounded-full bg-[#3D2B1F] text-white text-sm font-bold cursor-pointer"
          >
            إظهار كافة المنتجات
          </button>
        </div>
      ) : selectedCategory === "all" && !query.trim() && sortBy === "featured" ? (
        <div className="space-y-12 sm:space-y-16">
          {categories.map((cat) => (
            <CategorySection
              key={cat.slug}
              slug={cat.slug}
              nameAr={cat.nameAr}
              descriptionAr={cat.descriptionAr || ""}
              heroImage={cat.heroImage || "/images/hero/damascus-flowers-hero.jpg"}
              whatsappNumber={whatsappNumber}
              showViewAll={false}
              products={filtered
                .filter((p) => p.categorySlug === cat.slug)
                .map((prod) => toCard(prod, cat.nameAr))}
            />
          ))}
        </div>
      ) : (
        <ProductGrid
          whatsappNumber={whatsappNumber}
          products={filtered.map((prod) => toCard(prod, categoryMap.get(prod.categorySlug)))}
        />
      )}
    </div>
  );
}
