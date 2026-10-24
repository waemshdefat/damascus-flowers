"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatJod } from "@/lib/format";

export default function CartPage() {
  const {
    items,
    hydrated,
    totalCount,
    subtotalJod,
    hasPriceOnRequest,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
            سلة المشتريات
          </h1>
          <p className="text-sm text-[#7D6352] mt-1">
            راجع المنتجات المختارة وعدّل الكميات قبل الانتقال لإتمام الطلب.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 px-3.5 py-2 rounded-full bg-rose-50 border border-rose-200 transition cursor-pointer"
          >
            إفراغ السلة بالكامل
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="p-12 text-center rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] text-[#7D6352]">
          جاري تحميل السلة...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#F5E1E4] text-[#3D2B1F] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">
            لا توجد منتجات في سلة المشتريات حاليًا
          </h2>
          <p className="text-sm text-[#7D6352] max-w-md mx-auto">
            تصفح باقات الورد الطبيعي وبوكسات الهدايا الفاخرة من أزهار دمشق وأضف ما
            يناسب مناسبتك.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="px-7 py-3.5 rounded-2xl bg-[#3D2B1F] text-[#FAF7F2] font-bold text-sm hover:bg-[#523A2B] transition"
            >
              تصفح المتجر الآن
            </Link>
            <Link
              href="/checkout"
              className="px-7 py-3.5 rounded-2xl border border-[#D8CBB8] text-[#3D2B1F] font-bold text-sm hover:bg-[#F3ECE2] transition"
            >
              نموذج الطلب السريع
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="p-4 sm:p-5 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="w-24 h-28 rounded-2xl overflow-hidden bg-white border border-[#F0E8DC] shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 space-y-1.5">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-base sm:text-lg font-extrabold text-[#3D2B1F] hover:text-[#965866]"
                  >
                    {item.nameAr}
                  </Link>
                  <p className="text-xs sm:text-sm text-[#7D6352]">
                    سعر القطعة:{" "}
                    <strong>
                      {item.priceOnRequest
                        ? "يُحدَّد حسب الاختيار"
                        : formatJod(item.priceJod)}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1E9DF]">
                  <div className="inline-flex items-center rounded-full border border-[#D8CBB8] bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="تقليل الكمية"
                      className="p-2 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-r-full cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-extrabold text-[#3D2B1F]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="زيادة الكمية"
                      className="p-2 text-[#3D2B1F] hover:bg-[#EFE6DA] rounded-l-full cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-left min-w-24">
                    <div className="text-base font-extrabold text-[#3D2B1F]">
                      {item.priceOnRequest
                        ? "يُحدَّد عند الطلب"
                        : formatJod(item.priceJod * item.quantity)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`حذف ${item.nameAr}`}
                    className="p-2 text-[#9A8474] hover:text-rose-700 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5 shadow-xs sticky top-24">
            <h2 className="text-xl font-extrabold text-[#3D2B1F]">ملخص السلة</h2>

            <div className="space-y-3 text-sm border-y border-[#F1E9DF] py-4">
              <div className="flex items-center justify-between">
                <span className="text-[#695244]">عدد القطع المختارة</span>
                <span className="font-bold text-[#3D2B1F]">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#695244]">تكلفة المنتجات</span>
                <span className="font-bold text-[#3D2B1F]">
                  {formatJod(subtotalJod)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#695244]">تكلفة التوصيل</span>
                <span className="text-xs font-medium text-[#7D6352]">
                  تُحدَّد حسب الحي والمنطقة
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-base font-extrabold text-[#3D2B1F]">
                المجموع الفرعي
              </span>
              <span className="text-2xl font-extrabold text-[#3D2B1F]">
                {formatJod(subtotalJod)}
                {hasPriceOnRequest ? " +" : ""}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-[#3D2B1F] hover:bg-[#523A2B] text-[#FAF7F2] font-bold text-base flex items-center justify-center gap-2 transition shadow-sm"
            >
              <span>المتابعة لإتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="block text-center text-xs font-bold text-[#695244] hover:text-[#3D2B1F] transition"
            >
              إضافة المزيد من الباقات أو الهدايا
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
