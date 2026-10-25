"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { buildWhatsAppUrl, formatJod } from "@/lib/format";
import type { ProductImage } from "@/db/schema";

export function ProductDetailInteractive({
  product,
  whatsappNumber,
}: {
  product: {
    id: number;
    slug: string;
    nameAr: string;
    priceJod: string;
    compareAtPriceJod?: string | null;
    badgeTextAr?: string;
    priceOnRequest: boolean;
    images: ProductImage[];
    inStock: boolean;
  };
  whatsappNumber: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const gallery =
    product.images.length > 0
      ? product.images
      : [{ url: "/images/brand/logo-8016.png", alt: product.nameAr }];
  const currentImg = gallery[selectedIdx] || gallery[0];
  const priceNumber = Number.parseFloat(product.priceJod) || 0;
  const compareNumber = product.compareAtPriceJod
    ? Number.parseFloat(product.compareAtPriceJod) || 0
    : 0;
  const hasOffer = !product.priceOnRequest && compareNumber > priceNumber && priceNumber > 0;
  const discountPct = hasOffer ? Math.round(((compareNumber - priceNumber) / compareNumber) * 100) : 0;
  const badgeLabel = product.badgeTextAr?.trim() || (hasOffer ? `خصم ${discountPct}%` : "");

  const waDirectUrl = buildWhatsAppUrl(
    whatsappNumber,
    [
      `مرحبًا *أزهار دمشق | Damascus Flowers* 🌸`,
      `أرغب بطلب المنتج التالي:`,
      `• المنتج: *${product.nameAr}*`,
      `• الكمية: ${quantity}`,
      `• السعر: ${
        product.priceOnRequest
          ? "يُحدَّد حسب الاختيار"
          : `${formatJod(priceNumber * quantity)} (${formatJod(priceNumber)} للقطعة)`
      }`,
      ``,
      `يرجى تزويدي بتفاصيل التوصيل المتاحة لتأكيد الطلب.`,
    ].join("\n")
  );

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      priceJod: priceNumber,
      priceOnRequest: product.priceOnRequest,
      image: gallery[0].url,
    }, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        nameAr: product.nameAr,
        priceJod: priceNumber,
        priceOnRequest: product.priceOnRequest,
        image: gallery[0].url,
      },
      quantity,
      false
    );
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Studio Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-white border border-[#EAE0D3] shadow-xs">
          {badgeLabel && (
            <span className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-sm font-extrabold bg-[#FBE9EB] text-[#B8232F] border border-[#E8B4BB] shadow-xs">
              {badgeLabel}
            </span>
          )}
          <img
            src={currentImg.url}
            alt={currentImg.alt || product.nameAr}
            className="w-full h-full object-cover"
          />
        </div>

        {gallery.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-20 h-24 rounded-2xl overflow-hidden bg-white border-2 transition shrink-0 cursor-pointer ${
                  idx === selectedIdx
                    ? "border-[#3D2B1F] shadow-sm"
                    : "border-[#EAE0D3] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${product.nameAr} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Controls Slot rendered via children or inline */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-6 shadow-2xs">
          <div className="space-y-2 pb-5 border-b border-[#F1E9DF]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] leading-snug">
              {product.nameAr}
            </h1>
            <div className="flex flex-wrap items-baseline gap-3 pt-2">
              {hasOffer && (
                <span className="text-base sm:text-lg text-[#9A8474] line-through decoration-[#B8232F]/70">
                  {formatJod(compareNumber)}
                </span>
              )}
              <span className={`text-2xl sm:text-3xl font-extrabold ${hasOffer ? "text-[#B8232F]" : "text-[#3D2B1F]"}`}>
                {product.priceOnRequest
                  ? "السعر يُحدَّد عند الطلب"
                  : formatJod(priceNumber)}
              </span>
              {hasOffer && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FBE9EB] text-[#B8232F] text-xs font-bold">
                  وفّر {formatJod(compareNumber - priceNumber)}
                </span>
              )}
              {!product.priceOnRequest && (
                <span className="text-xs font-medium text-[#7D6352]">
                  شامل التنسيق والتغليف الأساسي
                </span>
              )}
            </div>
          </div>

          {/* Quantity Picker */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-[#3D2B1F]">الكمية المطلوبة:</span>
            <div className="inline-flex items-center rounded-full border border-[#D8CBB8] bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="إنقاص الكمية"
                className="p-2.5 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-r-full cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 text-base font-extrabold text-[#3D2B1F]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                aria-label="زيادة الكمية"
                className="p-2.5 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-l-full cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAdd}
                className="py-4 px-5 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs disabled:bg-[#C9BBAE] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>تمت الإضافة للسلة</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleBuyNow}
                className="py-4 px-5 rounded-2xl bg-[#F5E1E4] hover:bg-[#ECCFD4] disabled:opacity-50 text-[#3D2B1F] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition border border-[#E4C2C8] cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>اطلب الآن مباشرة</span>
              </button>
            </div>

            <a
              href={waDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#EFF9F2] hover:bg-[#DDF2E3] text-[#175933] border border-[#BFE5CA] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition shadow-xs"
            >
              <MessageCircle className="w-5 h-5" />
              <span>أرسل طلب هذا المنتج عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
