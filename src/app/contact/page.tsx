import React from "react";
import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactFormClient } from "@/components/contact-form-client";
import { InstagramIcon } from "@/components/social-icons";
import { getPublicStoreSettings } from "@/lib/store-queries";
import { buildWhatsAppUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "التواصل معنا",
  description:
    "تواصل مع متجر أزهار دمشق (Damascus Flowers) للطلبات والاستفسارات وتنسيق الهدايا عبر واتساب +962795831917 أو إنستغرام.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const settings = await getPublicStoreSettings();
  const storeNameAr = settings?.storeNameAr || "أزهار دمشق";
  const whatsappNumber = settings?.whatsappNumber || "+962795831917";
  const phoneDisplay = settings?.phoneDisplay || "+962 79 583 1917";
  const instagramUrl =
    settings?.instagramUrl || "https://www.instagram.com/dmscs.flowers/";

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أرغب بالاستفسار أو تقديم طلب زهور وهدية.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-2 max-w-2xl">
        <span className="text-xs font-bold text-[#965866]">خدمة العملاء والطلبات</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
          التواصل مع {storeNameAr}
        </h1>
        <p className="text-sm sm:text-base text-[#695244]">
          يسعدنا استقبال طلباتكم واستفساراتكم وتنسيق الهدايا الخاصة عبر واتساب أو
          نموذج المراسلة المباشر.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Direct Channels */}
        <div className="lg:col-span-5 space-y-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-3xl bg-[#EFF9F2] border border-[#BFE5CA] hover:shadow-sm transition space-y-2"
          >
            <div className="flex items-center gap-2.5 text-[#175933] font-extrabold text-base">
              <MessageCircle className="w-5 h-5" />
              <span>واتساب الطلبات السريع</span>
            </div>
            <p dir="ltr" className="text-xl font-extrabold text-[#175933] text-right">
              {phoneDisplay}
            </p>
            <p className="text-xs text-[#2A5C3F]">
              اضغط لفتح محادثة واتساب جاهزة مع خدمة العملاء وتأكيد الطلبات الفورية.
            </p>
          </a>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] hover:border-[#D4B982] transition space-y-2"
            >
              <div className="flex items-center gap-2.5 text-[#3D2B1F] font-extrabold text-base">
                <InstagramIcon className="w-5 h-5 text-[#965866]" />
                <span>حسابنا الرسمي على إنستغرام</span>
              </div>
              <p dir="ltr" className="text-base font-bold text-[#5C4332] text-right">
                instagram.com/dmscs.flowers
              </p>
              <p className="text-xs text-[#7D6352]">
                تابع أحدث الباقات والبوكسات المصوّرة يوميًا في متجرنا.
              </p>
            </a>
          )}

          <div className="p-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3 text-sm text-[#5C4332]">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#B8965A]" />
              <span>هاتف المتجر:</span>
              <a
                href={`tel:${whatsappNumber}`}
                dir="ltr"
                className="font-bold text-[#3D2B1F]"
              >
                {phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#B8965A]" />
              <span>الدولة: {settings?.countryAr || "الأردن"} (الدينار الأردني JOD)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#B8965A] shrink-0 mt-0.5" />
              <span>
                {settings?.workingHoursAr ||
                  "يوميًا لخدمة طلباتكم وتنسيق الهدايا عبر الموقع وواتساب"}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Message Form */}
        <div className="lg:col-span-7">
          <ContactFormClient />
        </div>
      </div>
    </div>
  );
}
