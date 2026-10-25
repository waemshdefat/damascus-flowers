"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { buildWhatsAppUrl, formatJod } from "@/lib/format";
import type { ProductImage } from "@/db/schema";

export interface ProductCardData {
  id: number;
  slug: string;
  nameAr: string;
  subtitleAr: string;
  priceJod: string;
  compareAtPriceJod?: string | null;
  badgeTextAr?: string;
  priceOnRequest: boolean;
  categoryLabelAr?: string;
  images: ProductImage[];
  inStock: boolean;
}

export function ProductCard({
  product,
  whatsappNumber = "+962795831917",
}: {
  product: ProductCardData;
  whatsappNumber?: string;
}) {
  const { addItem } = useCart();

  const primaryImg = product.images[0]?.url || "/images/brand/logo-8016.png";
  const secondaryImg = product.images[1]?.url;
  const imgAlt = product.images[0]?.alt || product.nameAr;
  const priceNumber = Number.parseFloat(product.priceJod) || 0;
  const compareNumber = product.compareAtPriceJod
    ? Number.parseFloat(product.compareAtPriceJod) || 0
    : 0;
  const hasOffer = !product.priceOnRequest && compareNumber > priceNumber && priceNumber > 0;
  const discountPct = hasOffer ? Math.round(((compareNumber - priceNumber) / compareNumber) * 100) : 0;
  const badgeLabel = product.badgeTextAr?.trim() || (hasOffer ? `خصم ${discountPct}%` : "");

  const waProductMsg = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا أزهار دمشق 🌸\nأود طلب / الاستفسار عن المنتج:\n• *${product.nameAr}*\n• السعر: ${
      product.priceOnRequest ? "يُحدَّد حسب الاختيار" : formatJod(priceNumber)
    }`
  );

  return (
    <article className="group rounded-2xl sm:rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] hover:border-[#D4B982] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Studio Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-4/5 bg-white overflow-hidden block"
      >
        <img
          src={primaryImg}
          alt={imgAlt}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            secondaryImg ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {secondaryImg && (
          <img
            src={secondaryImg}
            alt={product.images[1]?.alt || product.nameAr}
            loading="lazy"
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        )}

        {product.categoryLabelAr && (
          <span className="hidden sm:inline-block absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2]/92 text-[#5C4332] border border-[#E6DDD0] backdrop-blur-xs">
            {product.categoryLabelAr}
          </span>
        )}

        {badgeLabel && product.inStock && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-[#B8232F] text-white shadow-sm tracking-wide">
            {badgeLabel}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-rose-900/90 text-white">
            نفد حاليًا
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-lg font-bold text-[#3D2B1F] group-hover:text-[#965866] transition line-clamp-2 leading-snug">
              {product.nameAr}
            </h3>
          </Link>
          {product.subtitleAr && (
            <p className="hidden sm:block text-xs sm:text-sm text-[#7D6352] line-clamp-2 leading-relaxed">
              {product.subtitleAr}
            </p>
          )}
        </div>

        <div className="pt-2.5 sm:pt-3 border-t border-[#F1E9DF] space-y-2.5 sm:space-y-3">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="hidden sm:inline text-xs text-[#8A7262]">السعر</span>
            <span className="flex items-baseline gap-2">
              {hasOffer && (
                <span className="text-xs sm:text-sm text-[#9A8474] line-through decoration-[#B8232F]/70">
                  {formatJod(compareNumber)}
                </span>
              )}
              <span className={`text-base sm:text-xl font-extrabold ${hasOffer ? "text-[#B8232F]" : "text-[#3D2B1F]"}`}>
                {product.priceOnRequest
                  ? "يُحدَّد عند الطلب"
                  : formatJod(priceNumber)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() =>
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  nameAr: product.nameAr,
                  priceJod: priceNumber,
                  priceOnRequest: product.priceOnRequest,
                  image: primaryImg,
                })
              }
              className="flex-1 py-2.5 px-2.5 sm:px-3.5 rounded-xl bg-[#3D2B1F] hover:bg-[#523A2B] disabled:bg-[#C9BBAE] text-[#FAF7F2] text-[11px] sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{product.inStock ? "أضف للسلة" : "غير متوفر"}</span>
            </button>

            <a
              href={waProductMsg}
              target="_blank"
              rel="noopener noreferrer"
              title="اطلب هذا المنتج عبر واتساب"
              aria-label={`طلب ${product.nameAr} عبر واتساب`}
              className="p-2.5 rounded-xl bg-[#F5E1E4] hover:bg-[#ECCFD4] text-[#3D2B1F] transition shrink-0 hidden sm:inline-flex"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
