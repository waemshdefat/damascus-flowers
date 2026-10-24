import React from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Flower2, Gift, ShieldCheck } from "lucide-react";
import { ProductDetailInteractive } from "@/components/product-detail-actions";
import { ProductCard } from "@/components/product-card";
import {
  getActiveCategories,
  getActiveProducts,
  getProductBySlugOrLegacy,
  getPublicStoreSettings,
} from "@/lib/store-queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlugOrLegacy(slug);
  if (!product) {
    return { title: "منتج غير موجود" };
  }
  return {
    title: product.nameAr,
    description: product.descriptionAr,
    openGraph: {
      title: `${product.nameAr} | أزهار دمشق`,
      description: product.descriptionAr,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, matchedLegacy } = await getProductBySlugOrLegacy(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  // Automatic 308/301 permanent redirect when visited via legacy WooCommerce slug
  if (matchedLegacy) {
    permanentRedirect(`/product/${product.slug}`);
  }

  const [settings, categories, allProducts] = await Promise.all([
    getPublicStoreSettings(),
    getActiveCategories(),
    getActiveProducts(),
  ]);

  const whatsappNumber = settings?.whatsappNumber || "+962795831917";
  const category = categories.find((c) => c.slug === product.categorySlug);
  const related = allProducts
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://damascusflowers.com";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameAr,
    description: product.descriptionAr,
    image: product.images.map((im) =>
      im.url.startsWith("http") ? im.url : `${siteUrl}${im.url}`
    ),
    brand: {
      "@type": "Brand",
      name: "أزهار دمشق | Damascus Flowers",
    },
    ...(product.priceOnRequest
      ? {}
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "JOD",
            price: Number.parseFloat(product.priceJod).toFixed(2),
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${siteUrl}/product/${product.slug}`,
          },
        }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs sm:text-sm text-[#8A7262] flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-[#3D2B1F]">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#3D2B1F]">
          المتجر
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-[#3D2B1F]"
            >
              {category.nameAr}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-bold text-[#3D2B1F]">{product.nameAr}</span>
      </nav>

      {/* Main Gallery & Buy Box */}
      <ProductDetailInteractive product={product} whatsappNumber={whatsappNumber} />

      {/* Description, Gifting Features & Care Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-4">
          <h2 className="text-xl font-extrabold text-[#3D2B1F]">تفاصيل التنسيق</h2>
          <p className="text-sm sm:text-base text-[#5C4332] leading-relaxed">
            {product.descriptionAr}
          </p>
          {product.careTipsAr && (
            <div className="pt-4 border-t border-[#F1E9DF] space-y-2">
              <h3 className="text-sm font-bold text-[#3D2B1F] flex items-center gap-2">
                <Flower2 className="w-4 h-4 text-[#C47D8A]" />
                <span>نصائح العناية بالزهور الطبيعية</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7D6352] leading-relaxed">
                {product.careTipsAr}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#F5ECE2] border border-[#E5D7C6] space-y-4">
          <h2 className="text-lg font-extrabold text-[#3D2B1F]">
            مزايا الطلب من أزهار دمشق
          </h2>
          <ul className="space-y-3 text-sm text-[#5C4332]">
            <li className="flex items-start gap-2.5">
              <Gift className="w-4 h-4 text-[#B8965A] shrink-0 mt-1" />
              <span>
                إمكانية اختيار <strong>تغليف كلاسيكي أنيق</strong> أو{" "}
                <strong>تغليف VIP فاخر</strong> مع بطاقة إهداء مخصصة عند إتمام الطلب.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B8965A] shrink-0 mt-1" />
              <span>
                دعم <strong>الطلب السري</strong> لإرسال الهدايا المفاجئة دون ذكر اسم
                المرسل للمستلم.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-extrabold text-[#3D2B1F]">
            قد يعجبك أيضًا من نفس القسم
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                whatsappNumber={whatsappNumber}
                product={{
                  id: item.id,
                  slug: item.slug,
                  nameAr: item.nameAr,
                  subtitleAr: item.subtitleAr,
                  priceJod: item.priceJod,
                  compareAtPriceJod: item.compareAtPriceJod,
                  badgeTextAr: item.badgeTextAr,
                  priceOnRequest: item.priceOnRequest,
                  categoryLabelAr: category?.nameAr,
                  images: item.images,
                  inStock: item.inStock,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
