"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/format";

export function FloatingWhatsApp({
  whatsappNumber,
  storeNameAr,
}: {
  whatsappNumber: string;
  storeNameAr: string;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const href = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أود الاستفسار أو طلب باقة زهور / هدية من متجر Damascus Flowers.`
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل واطلب عبر واتساب"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1F8E4D] hover:bg-[#197840] text-white shadow-lg shadow-black/15 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="text-xs sm:text-sm font-bold">واتساب الطلبات</span>
    </a>
  );
}
