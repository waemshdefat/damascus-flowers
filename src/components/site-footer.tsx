"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/social-icons";
import { buildWhatsAppUrl } from "@/lib/format";

interface SiteFooterProps {
  storeNameAr: string;
  storeNameEn: string;
  countryAr: string;
  whatsappNumber: string;
  phoneDisplay: string;
  instagramUrl: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  emailAddress?: string;
  workingHoursAr: string;
}

export function SiteFooter({
  storeNameAr,
  storeNameEn,
  countryAr,
  whatsappNumber,
  phoneDisplay,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  emailAddress,
  workingHoursAr,
}: SiteFooterProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أود الاستفسار عن تنسيقات الزهور والهدايا المتوفرة.`
  );

  return (
    <footer className="bg-[#291C14] text-[#F4ECE1] border-t border-[#473326] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column with Original Damascus Flowers Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/brand/damascus-flowers-logo-light-trim.png"
                alt={`${storeNameAr} | ${storeNameEn}`}
                width={156}
                height={132}
                className="w-36 h-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#D9CBB9] leading-relaxed">
              متجر <strong className="text-white">{storeNameAr}</strong> للزهور الطبيعية
              وصناديق الهدايا الفاخرة — نصمّم كل باقة بعناية فائقة لتعبّر عن أرقى
              المشاعر في كل مناسبة.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-bold text-[#F5E1E4] mb-4">تصنيفات المتجر</h3>
            <ul className="space-y-2.5 text-sm text-[#DDD0C0]">
              <li>
                <Link
                  href="/category/flower-bouquets"
                  className="hover:text-white transition"
                >
                  باقات الورد الطبيعي
                </Link>
              </li>
              <li>
                <Link
                  href="/category/flower-boxes"
                  className="hover:text-white transition"
                >
                  بوكسات الورد والهدايا
                </Link>
              </li>
              <li>
                <Link
                  href="/category/occasion-gifts"
                  className="hover:text-white transition"
                >
                  هدايا المناسبات
                </Link>
              </li>
              <li>
                <Link
                  href="/category/teddy-bears-gifts"
                  className="hover:text-white transition"
                >
                  الدببة والهدايا الإضافية
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-[#F5E1E4] mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-[#DDD0C0]">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  تصفح جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">
                  سلة المشتريات
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition">
                  إتمام الطلب السريع
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  التواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#F5E1E4] mb-4">التواصل والطلبات</h3>
            <div className="flex items-center gap-2.5 text-sm text-[#DDD0C0]">
              <MapPin className="w-4 h-4 text-[#D4B982] shrink-0" />
              <span>{countryAr} — العملة: الدينار الأردني (د.أ. / JOD)</span>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-[#DDD0C0] hover:text-white transition"
            >
              <Phone className="w-4 h-4 text-[#D4B982] shrink-0" />
              <span>واتساب وهاتف الطلبات:</span>
              <span dir="ltr" className="font-semibold text-white">
                {phoneDisplay}
              </span>
            </a>
            <p className="text-xs text-[#C7B7A5] leading-relaxed">{workingHoursAr}</p>
            {emailAddress && (
              <p className="text-xs text-[#DDD0C0]" dir="ltr">
                {emailAddress}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3B291E] hover:bg-[#4E3729] text-xs font-medium text-white transition border border-[#5A4030]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#F5E1E4]" />
                  <span dir="ltr">@dmscs.flowers</span>
                </a>
              )}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E5631] hover:bg-[#256D3D] text-xs font-medium text-white transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب مباشر</span>
              </a>
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3B291E] hover:bg-[#4E3729] text-xs font-medium text-white transition"
                >
                  <span>Facebook</span>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3B291E] hover:bg-[#4E3729] text-xs font-medium text-white transition"
                >
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#432F22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9A896]">
          <p>
            © {new Date().getFullYear()} {storeNameAr} | {storeNameEn}. جميع الحقوق
            محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <span>الدفع عند الاستلام متاح</span>
            <span>•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#CBBBA9] hover:text-white transition"
            >
              <Lock className="w-3 h-3" />
              <span>لوحة الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
