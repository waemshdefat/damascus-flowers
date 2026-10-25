"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";
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
    <footer className="bg-[#F3ECE2] text-[#3D2B1F] border-t border-[#E6DDD0] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column with Original Damascus Flowers Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/brand/damascus-flowers-logo-trim.png"
                alt={`${storeNameAr} | ${storeNameEn}`}
                width={156}
                height={132}
                className="w-36 h-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#695244] leading-relaxed">
              متجر <strong className="text-[#3D2B1F]">{storeNameAr}</strong> للزهور الطبيعية
              وصناديق الهدايا الفاخرة — نصمّم كل باقة بعناية فائقة لتعبّر عن أرقى
              المشاعر في كل مناسبة.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base font-bold text-[#3D2B1F] mb-4">تصنيفات المتجر</h3>
            <ul className="space-y-2.5 text-sm text-[#5C4332]">
              <li>
                <Link
                  href="/category/flower-bouquets"
                  className="hover:text-[#3D2B1F] transition"
                >
                  باقات الورد الطبيعي
                </Link>
              </li>
              <li>
                <Link
                  href="/category/flower-boxes"
                  className="hover:text-[#3D2B1F] transition"
                >
                  بوكسات الورد والهدايا
                </Link>
              </li>
              <li>
                <Link
                  href="/category/occasion-gifts"
                  className="hover:text-[#3D2B1F] transition"
                >
                  هدايا المناسبات
                </Link>
              </li>
              <li>
                <Link
                  href="/category/teddy-bears-gifts"
                  className="hover:text-[#3D2B1F] transition"
                >
                  الدببة والهدايا الإضافية
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-[#3D2B1F] mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-[#5C4332]">
              <li>
                <Link href="/shop" className="hover:text-[#3D2B1F] transition">
                  تصفح جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#3D2B1F] transition">
                  سلة المشتريات
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#3D2B1F] transition">
                  إتمام الطلب السريع
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D2B1F] transition">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#3D2B1F] transition">
                  التواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#3D2B1F] mb-4">التواصل والطلبات</h3>
            <div className="flex items-center gap-2.5 text-sm text-[#5C4332]">
              <MapPin className="w-4 h-4 text-[#B8965A] shrink-0" />
              <span>{countryAr} — العملة: الدينار الأردني (د.أ. / JOD)</span>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-[#5C4332] hover:text-[#3D2B1F] transition"
            >
              <Phone className="w-4 h-4 text-[#B8965A] shrink-0" />
              <span>واتساب وهاتف الطلبات:</span>
              <span dir="ltr" className="font-semibold text-[#3D2B1F]">
                {phoneDisplay}
              </span>
            </a>
            <p className="text-xs text-[#7D6352] leading-relaxed">{workingHoursAr}</p>
            {emailAddress && (
              <p className="text-xs text-[#5C4332]" dir="ltr">
                {emailAddress}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFDFB] hover:bg-[#F5E1E4] text-xs font-medium text-[#3D2B1F] transition border border-[#D8C7B4]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#3D2B1F]" />
                  <span dir="ltr">@dmscs.flowers</span>
                </a>
              )}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EFF9F2] hover:bg-[#DDF2E3] text-xs font-medium text-[#175933] border border-[#BFE5CA] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب مباشر</span>
              </a>
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFDFB] hover:bg-[#F5E1E4] text-xs font-medium text-[#3D2B1F] transition border border-[#D8C7B4]"
                >
                  <span>Facebook</span>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFDFB] hover:bg-[#F5E1E4] text-xs font-medium text-[#3D2B1F] transition border border-[#D8C7B4]"
                >
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E6DDD0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D6352]">
          <p>
            © {new Date().getFullYear()} {storeNameAr} | {storeNameEn}. جميع الحقوق
            محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <span>الدفع عند الاستلام متاح</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
