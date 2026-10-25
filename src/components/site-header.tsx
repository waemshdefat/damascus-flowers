"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { InstagramIcon } from "@/components/social-icons";
import { useCart } from "@/context/cart-context";
import { buildWhatsAppUrl } from "@/lib/format";

export interface PublicHeaderProps {
  storeNameAr: string;
  storeNameEn: string;
  whatsappNumber: string;
  phoneDisplay: string;
  instagramUrl: string;
  announcementBarAr: string;
}

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "جميع المنتجات" },
  { href: "/category/flower-bouquets", label: "باقات الورد" },
  { href: "/category/flower-boxes", label: "بوكسات الورد والهدايا" },
  { href: "/category/occasion-gifts", label: "هدايا المناسبات" },
  { href: "/category/teddy-bears-gifts", label: "الدببة والهدايا" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function SiteHeader({
  storeNameAr,
  storeNameEn,
  whatsappNumber,
  phoneDisplay,
  instagramUrl,
  announcementBarAr,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const { totalCount, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const quickWaUrl = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أرغب بالاستفسار وطلب باقة ورد / هدية من موقع Damascus Flowers.`
  );

  return (
    <>
      {/* Top Luxury Announcement Strip */}
      <div className="bg-[#F3ECE2] text-[#3D2B1F] text-xs sm:text-sm py-2 px-4 border-b border-[#E6DDD0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <p className="truncate font-normal tracking-wide">{announcementBarAr}</p>
          <a
            href={quickWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-[#965866] hover:text-[#3D2B1F] transition shrink-0 font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>واتساب الطلبات:</span>
            <span dir="ltr">{phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Mobile Hamburger + Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح القائمة"
              className="xl:hidden p-2.5 rounded-full text-[#3D2B1F] hover:bg-[#EFE6DA] transition"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <img
                src="/images/brand/damascus-flowers-emblem-trim.png"
                alt={`${storeNameAr} - ${storeNameEn}`}
                width={46}
                height={46}
                className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-[#3D2B1F] leading-tight">
                  {storeNameAr}
                </span>
                <span
                  dir="ltr"
                  className="font-brand-serif text-[11px] sm:text-xs tracking-[0.22em] text-[#7D6352] uppercase font-semibold"
                >
                  {storeNameEn}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden xl:flex items-center gap-6 text-[15px] font-medium text-[#4A3527]"
          >
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-1.5 transition relative ${
                    active
                      ? "text-[#3D2B1F] font-bold after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#B8965A]"
                      : "text-[#695244] hover:text-[#3D2B1F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="حساب أزهار دمشق على إنستغرام"
                className="p-2.5 rounded-full text-[#3D2B1F] hover:bg-[#F5E1E4] transition"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}

            <button
              type="button"
              onClick={openDrawer}
              aria-label="سلة المشتريات"
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFDFB] text-[#3D2B1F] border border-[#D8C7B4] hover:bg-[#F5E1E4] transition text-sm font-bold shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">السلة</span>
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#3D2B1F] text-[#FAF7F2] text-xs font-bold inline-flex items-center justify-center">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-[#261A12]/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#FAF7F2] shadow-2xl border-l border-[#E6DDD0] flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E6DDD0]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <img
                    src="/images/brand/damascus-flowers-emblem-trim.png"
                    alt={storeNameAr}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <div className="font-bold text-[#3D2B1F]">{storeNameAr}</div>
                    <div
                      dir="ltr"
                      className="font-brand-serif text-[11px] tracking-[0.2em] text-[#7D6352] uppercase"
                    >
                      {storeNameEn}
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="p-2 rounded-full text-[#3D2B1F] hover:bg-[#EFE6DA]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-base transition ${
                        active
                          ? "bg-[#F5E1E4] text-[#3D2B1F] font-bold"
                          : "text-[#4A3527] hover:bg-[#F1E9DF]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base text-[#4A3527] hover:bg-[#F1E9DF] flex items-center justify-between"
                >
                  <span>سلة المشتريات</span>
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#F5E1E4] text-[#3D2B1F] font-bold">
                    {totalCount}
                  </span>
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E6DDD0] space-y-3">
              <a
                href={quickWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>اطلب مباشرة عبر واتساب</span>
              </a>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-[#D8CBB8] text-[#3D2B1F] font-medium flex items-center justify-center gap-2 hover:bg-[#F3ECE2] transition text-sm"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>تابعنا على إنستغرام</span>
                </a>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
