"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatJod } from "@/lib/format";

export function AddedToCartPrompt() {
  const pathname = usePathname();
  const { addedPrompt, dismissAddedPrompt, totalCount, subtotalJod, openDrawer } = useCart();

  if (!addedPrompt || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#3D2B1F]/15 backdrop-blur-sm" onClick={dismissAddedPrompt} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-3xl bg-[#FFFDFB] border border-[#E6DDD0] shadow-2xl p-5 sm:p-6 space-y-5 animate-fade-up"
      >
        <button
          type="button"
          onClick={dismissAddedPrompt}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-1.5 rounded-full text-[#7D6352] hover:bg-[#F3ECE2] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-800">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <h2 className="text-base sm:text-lg font-extrabold">تمت إضافة المنتج إلى السلة</h2>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D6]">
          <img
            src={addedPrompt.image}
            alt={addedPrompt.nameAr}
            className="w-16 h-20 rounded-xl object-cover bg-white shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#3D2B1F] line-clamp-2">{addedPrompt.nameAr}</p>
            <p className="text-xs text-[#7D6352] mt-1">
              الكمية: {addedPrompt.quantity} •{" "}
              {addedPrompt.priceOnRequest
                ? "السعر يُحدَّد عند الطلب"
                : formatJod(addedPrompt.priceJod * addedPrompt.quantity)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#695244] px-1">
          <span>إجمالي السلة ({totalCount} قطعة)</span>
          <span className="font-extrabold text-[#3D2B1F] text-sm">{formatJod(subtotalJod)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={dismissAddedPrompt}
            className="py-3.5 px-4 rounded-2xl border border-[#D4C5B3] bg-white text-[#3D2B1F] text-sm font-bold hover:bg-[#F3ECE2] transition cursor-pointer"
          >
            متابعة التسوق
          </button>
          <Link
            href="/cart"
            onClick={() => {
              dismissAddedPrompt();
            }}
            className="py-3.5 px-4 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-sm font-bold text-center inline-flex items-center justify-center gap-2 transition shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>عرض السلة وإتمام الطلب</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            dismissAddedPrompt();
            openDrawer();
          }}
          className="w-full text-center text-xs font-bold text-[#965866] hover:underline cursor-pointer"
        >
          مراجعة سريعة للسلة دون مغادرة الصفحة
        </button>
      </div>
    </div>
  );
}
