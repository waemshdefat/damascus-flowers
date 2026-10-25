"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatJod } from "@/lib/format";

export function CartDrawer() {
  const {
    items,
    totalCount,
    subtotalJod,
    hasPriceOnRequest,
    drawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-[#3D2B1F]/15 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <aside
        aria-label="درج سلة المشتريات"
        className="fixed inset-y-0 left-0 w-full max-w-md bg-[#FAF7F2] shadow-2xl border-r border-[#E6DDD0] flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6DDD0] flex items-center justify-between bg-[#FFFDFB]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3D2B1F]" />
            <h2 className="text-lg font-bold text-[#3D2B1F]">
              سلة المشتريات ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="إغلاق السلة"
            className="p-2 rounded-full text-[#695244] hover:bg-[#F3ECE2] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5E1E4] text-[#3D2B1F] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-base font-medium text-[#4A3527]">
                سلة المشتريات فارغة حاليًا
              </p>
              <p className="text-sm text-[#7D6352]">
                اختر باقتك المفضلة من تشكيلة أزهار دمشق الفاخرة.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#FFFDFB] text-[#3D2B1F] border border-[#D8C7B4] text-sm font-medium hover:bg-[#F5E1E4] transition"
              >
                تصفح المتجر
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#EAE0D3]"
              >
                <Link
                  href={`/product/${item.slug}`}
                  onClick={closeDrawer}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-white border border-[#F0E8DC] shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-bold text-[#3D2B1F] hover:text-[#8C5864] line-clamp-2"
                    >
                      {item.nameAr}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`حذف ${item.nameAr}`}
                      className="p-1 text-[#9C8575] hover:text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center rounded-full border border-[#DFD3C3] bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="تقليل الكمية"
                        className="p-1.5 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-r-full cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#3D2B1F]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="زيادة الكمية"
                        className="p-1.5 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-l-full cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#3D2B1F]">
                      {item.priceOnRequest
                        ? "يُحدَّد عند الطلب"
                        : formatJod(item.priceJod * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 bg-[#FFFDFB] border-t border-[#E6DDD0] space-y-3.5">
            <div className="flex items-center justify-between text-base">
              <span className="text-[#695244] font-medium">مجموع المنتجات:</span>
              <span className="text-lg font-extrabold text-[#3D2B1F]">
                {formatJod(subtotalJod)}
                {hasPriceOnRequest ? " + إضافات حسب الاختيار" : ""}
              </span>
            </div>
            <p className="text-xs text-[#856D5D]">
              تُحدَّد تكلفة التوصيل حسب الحي والمنطقة، وتُختار المحافظة وتاريخ التوصيل وطريقة الدفع في صفحة إتمام الطلب.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="py-3 px-4 rounded-xl border border-[#D4C5B3] text-[#3D2B1F] text-sm font-bold text-center hover:bg-[#F3ECE2] transition"
              >
                عرض السلة
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="py-3 px-4 rounded-xl bg-[#FFFDFB] text-[#3D2B1F] border border-[#D8C7B4] text-sm font-bold text-center hover:bg-[#F5E1E4] transition shadow-sm"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
