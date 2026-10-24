import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Gift, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { CategorySection } from "@/components/category-section";
import { InstagramIcon } from "@/components/social-icons";
import {
  getActiveCategories,
  getActiveProducts,
  getPublicStoreSettings,
} from "@/lib/store-queries";
import { buildWhatsAppUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getPublicStoreSettings(),
    getActiveCategories(),
    getActiveProducts(),
  ]);

  const storeNameAr = settings?.storeNameAr || "أزهار دمشق";
  const storeNameEn = settings?.storeNameEn || "Damascus Flowers";
  const whatsappNumber = settings?.whatsappNumber || "+962795831917";
  const instagramUrl =
    settings?.instagramUrl || "https://www.instagram.com/dmscs.flowers/";

  const waHeroUrl = buildWhatsAppUrl(
    whatsappNumber,
    `مرحبًا ${storeNameAr} 🌸 أرغب بطلب باقة ورد / هدية من متجر Damascus Flowers.`
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://damascusflowers.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: `${storeNameAr} | ${storeNameEn}`,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo-8016.png`,
    image: `${siteUrl}/images/hero/damascus-flowers-hero.jpg`,
    telephone: whatsappNumber,
    priceRange: "JOD",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JO",
    },
    sameAs: instagramUrl ? [instagramUrl] : [],
  };

  return (
    <div className="space-y-20 sm:space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Luxury Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F6EFE6] via-[#FAF7F2] to-[#FAF7F2] border-b border-[#EAE0D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Editorial Copy + Original Brand Logo */}
            <div className="lg:col-span-6 space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFFDFB] border border-[#E5D7C6] shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#B8965A]" />
                <span className="text-xs sm:text-sm font-medium text-[#5C4332]">
                  زهور طبيعية فاخرة وهدايا راقية في الأردن
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="/images/brand/damascus-flowers-logo-trim.png"
                  alt={`${storeNameAr} - ${storeNameEn}`}
                  width={112}
                  height={96}
                  className="w-24 sm:w-28 h-auto object-contain shrink-0"
                />
                <div className="h-14 w-px bg-[#DFD2C0]" />
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3D2B1F] tracking-tight leading-tight">
                    {storeNameAr}
                  </h1>
                  <p
                    dir="ltr"
                    className="font-brand-serif text-sm sm:text-base tracking-[0.26em] text-[#7D6352] uppercase font-semibold mt-1"
                  >
                    {storeNameEn}
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#5C4332] leading-relaxed max-w-xl">
                نصنع من الورد الطبيعي لغةً للذوق الرفيع؛ من باقات الجوري الأحمر والبيبي
                روز الناعم إلى صناديق الهدايا الفاخرة وتنسيقات المناسبات الخاصة بتغليف
                كلاسيكي أو VIP فاخر.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/shop"
                  className="px-7 py-4 rounded-2xl bg-[#3D2B1F] hover:bg-[#523A2B] text-[#FAF7F2] text-sm sm:text-base font-bold inline-flex items-center gap-2.5 shadow-md shadow-[#3D2B1F]/15 transition"
                >
                  <span>تسوق الباقات والهدايا</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <a
                  href={waHeroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] text-sm sm:text-base font-bold inline-flex items-center gap-2.5 transition"
                >
                  <MessageCircle className="w-5 h-5 text-[#1F8E4D]" />
                  <span>اطلب عبر واتساب</span>
                </a>
              </div>

              {/* Trust Highlights */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#5C4332]">
                <div className="flex items-center gap-2 bg-[#FFFDFB]/80 px-3.5 py-2.5 rounded-xl border border-[#ECE2D6]">
                  <CheckCircle2 className="w-4 h-4 text-[#B8965A] shrink-0" />
                  <span>أسعار واضحة بالدينار الأردني</span>
                </div>
                <div className="flex items-center gap-2 bg-[#FFFDFB]/80 px-3.5 py-2.5 rounded-xl border border-[#ECE2D6]">
                  <Gift className="w-4 h-4 text-[#C47D8A] shrink-0" />
                  <span>تغليف عادي أو VIP فاخر</span>
                </div>
                <div className="flex items-center gap-2 bg-[#FFFDFB]/80 px-3.5 py-2.5 rounded-xl border border-[#ECE2D6]">
                  <ShieldCheck className="w-4 h-4 text-[#B8965A] shrink-0" />
                  <span>إمكانية الطلب السري والدفع عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* Large Editorial Floral Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-[#FFFDFB] bg-[#FFFDFB]">
                <img
                  src="/images/hero/damascus-flowers-hero.jpg"
                  alt="تنسيق زهور طبيعية فاخرة من متجر أزهار دمشق Damascus Flowers"
                  className="w-full aspect-4/3 sm:aspect-16/11 lg:aspect-4/4 object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 rounded-2xl bg-[#FFFDFB]/92 backdrop-blur-md p-4 sm:p-5 border border-[#E6DDD0] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#965866]">
                      لمسة دمشقية أصيلة
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#3D2B1F] mt-0.5">
                      ورود طبيعية طازجة تُنسّق يدويًا لكل طلب
                    </p>
                  </div>
                  <Link
                    href="/category/flower-boxes"
                    className="px-4 py-2 rounded-xl bg-[#F5E1E4] hover:bg-[#ECCFD4] text-[#3D2B1F] text-xs font-bold shrink-0 transition"
                  >
                    بوكسات الهدايا
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase (All 4 Required Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold tracking-wider text-[#965866] uppercase">
              الأقسام الرئيسية
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] mt-1">
              تسوق حسب التصنيف
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5C4332] hover:text-[#3D2B1F] transition"
          >
            <span>عرض المتجر الكامل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] hover:border-[#D4B982] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-square bg-white overflow-hidden relative">
                <img
                  src={cat.heroImage}
                  alt={cat.nameAr}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#FFFDFB] to-[#FAF5EE]">
                <div>
                  <h3 className="text-lg font-extrabold text-[#3D2B1F] group-hover:text-[#965866] transition">
                    {cat.nameAr}
                  </h3>
                  <p className="text-xs text-[#7D6352] mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.descriptionAr}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2B1F] mt-4">
                  <span>استكشف القسم</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products grouped by category — 2 columns on mobile, large real photos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-wider text-[#965866]">
            تشكيلة أزهار دمشق المعتمدة
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3D2B1F]">
            أجمل الباقات وبوكسات الهدايا
          </h2>
          <p className="text-sm sm:text-base text-[#695244]">
            اختر هديتك المفضلة وأضفها للسلة أو أرسل تفاصيل طلبك مباشرة عبر واتساب
            بخطوة واحدة سهلة من الهاتف.
          </p>
        </div>

        {categories.map((cat) => {
          const shown = new Set<number>();
          const catProducts = products
            .filter((p) => !p.isAddon && p.categorySlug === cat.slug && !shown.has(p.id))
            .map((prod) => {
              shown.add(prod.id);
              return {
                id: prod.id,
                slug: prod.slug,
                nameAr: prod.nameAr,
                subtitleAr: prod.subtitleAr,
                priceJod: prod.priceJod,
                compareAtPriceJod: prod.compareAtPriceJod,
                badgeTextAr: prod.badgeTextAr,
                priceOnRequest: prod.priceOnRequest,
                categoryLabelAr: cat.nameAr,
                images: prod.images,
                inStock: prod.inStock,
              };
            });
          return (
            <CategorySection
              key={cat.slug}
              slug={cat.slug}
              nameAr={cat.nameAr}
              descriptionAr={cat.descriptionAr}
              heroImage={cat.heroImage}
              products={catProducts}
              whatsappNumber={whatsappNumber}
            />
          );
        })}

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#3D2B1F] text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-[#FAF7F2] font-bold text-sm transition"
          >
            <span>تصفح المتجر والفلترة حسب القسم أو السعر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Luxury Experience & VIP Gifting Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[#F5E8EA] border border-[#E6CFD4] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FFFDFB] text-[#965866] text-xs font-bold border border-[#E8C5CB]">
              خدمة الإهداء المميزة من Damascus Flowers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F]">
              أرسل هديتك بأسلوب يليق بمشاعرك — مع خيار الطلب السري وتغليف VIP الفاخر
            </h2>
            <p className="text-sm sm:text-base text-[#5C4332] leading-relaxed">
              نوفر لك إمكانية إرسال الهدية مباشرة إلى المستلم مع بطاقة إهداء مخصصة،
              واختيار <strong>الطلب السري</strong> عند رغبتك بعدم الإفصاح عن اسم
              المرسل للمستلم، مع متابعة دقيقة وتأكيد فوري عبر لوحة الطلبات وواتساب.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/checkout"
              className="py-4 px-6 rounded-2xl bg-[#3D2B1F] hover:bg-[#523A2B] text-[#FAF7F2] font-bold text-center transition shadow-sm"
            >
              ابدأ تجهيز طلبك الآن
            </Link>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-2xl bg-[#FFFDFB] hover:bg-[#FAF7F2] text-[#3D2B1F] border border-[#DFC7CC] font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <InstagramIcon className="w-4 h-4 text-[#965866]" />
                <span>شاهد أحدث التنسيقات على إنستغرام</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
