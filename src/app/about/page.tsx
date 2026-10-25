import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Flower2, Gift, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { getPublicStoreSettings } from "@/lib/store-queries";
import { buildWhatsAppUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "تعرف على متجر أزهار دمشق (Damascus Flowers) في الأردن — شغف بتنسيق الزهور الطبيعية الفاخرة وبوكسات الهدايا الراقية لكل مناسبة.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const settings = await getPublicStoreSettings();
  const storeNameAr = settings?.storeNameAr || "أزهار دمشق";
  const storeNameEn = settings?.storeNameEn || "Damascus Flowers";
  const whatsappNumber = settings?.whatsappNumber || "+962795831917";

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أود الاستفسار عن تنسيق خاص لمناسبة قادمة.`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* Brand Story Header */}
      <section className="rounded-[2rem] bg-[#FFFDFB] border border-[#EAE0D3] p-8 sm:p-12 text-center space-y-6 shadow-xs">
        <img
          src="/images/brand/damascus-flowers-logo-trim.png"
          alt={`${storeNameAr} | ${storeNameEn}`}
          className="w-36 sm:w-44 h-auto mx-auto object-contain"
        />

        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F]">
            من نحن — {storeNameAr}
          </h1>
          <p className="text-base sm:text-lg text-[#5C4332] leading-relaxed">
            في <strong>{storeNameAr} (Damascus Flowers)</strong> في الأردن، نؤمن بأن
            كل باقة ورد هي رسالة شعور صادقة تستحق أن تُنسَّق بأعلى درجات الرقي
            والإتقان، من لحظة انتقاء الزهور الطبيعية الطازجة وحتى وصولها بأبهى صورة
            إلى من تحبون.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
          <Flower2 className="w-7 h-7 text-[#C47D8A]" />
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">
            زهور طبيعية منتقاة بعناية
          </h2>
          <p className="text-sm text-[#695244] leading-relaxed">
            نختار ورود الجوري الفاخرة وأغصان البيبي روز والزهور الموسمية بعناية،
            وننسّق كل باقة وصندوق يدويًا بتناغم لوني هادئ يعكس هوية الدار.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
          <Gift className="w-7 h-7 text-[#B8965A]" />
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">
            تغليف فاخر وبوكسات مميزة
          </h2>
          <p className="text-sm text-[#695244] leading-relaxed">
            نوفر خيارات التغليف الكلاسيكي الأنيق وتغليف VIP الفاخر للمناسبات الخاصة،
            بالإضافة إلى صناديق الأكريليك والهدايا والدببة الناعمة.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
          <ShieldCheck className="w-7 h-7 text-[#B8965A]" />
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">
            خصوصية تامة وسهولة في الطلب
          </h2>
          <p className="text-sm text-[#695244] leading-relaxed">
            يدعم متجرنا الطلب السريع من الهاتف خلال ثوانٍ، مع إمكانية اختيار الطلب
            السري للمفاجآت، ووضوح تام في الأسعار بالدينار الأردني.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
          <Heart className="w-7 h-7 text-[#C47D8A]" />
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">
            رفيق مناسباتكم السعيدة
          </h2>
          <p className="text-sm text-[#695244] leading-relaxed">
            سواء كانت المناسبة تهنئة بالسلامة، قدوم مولود جديد، ذكرى سنوية، أو لفتة
            محبة عفوية، نحرص على أن تصل هديتك بأجمل حضور.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="px-8 py-4 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs font-bold text-sm sm:text-base hover:bg-[#523A2B] transition"
        >
          تصفح تشكيلة الزهور والهدايا
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-2xl bg-[#1F8E4D] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2 hover:bg-[#197840] transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span>تواصل معنا عبر واتساب</span>
        </a>
      </div>
    </div>
  );
}
