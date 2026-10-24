import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Tajawal, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AddedToCartPrompt } from "@/components/added-to-cart-prompt";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { getPublicStoreSettings } from "@/lib/store-queries";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://damascusflowers.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "أزهار دمشق | Damascus Flowers — باقات الورد الطبيعي والهدايا الفاخرة في الأردن",
    template: "%s | أزهار دمشق — Damascus Flowers",
  },
  description:
    "متجر أزهار دمشق (Damascus Flowers) لبيع وتنسيق باقات الورد الطبيعي، الجوري الأحمر، البيبي روز، وبوكسات الهدايا الفاخرة في الأردن بأسعار واضحة بالدينار الأردني وطلب سهل عبر الموقع أو واتساب.",
  keywords: [
    "أزهار دمشق",
    "Damascus Flowers",
    "باقات ورد في الأردن",
    "متجر زهور الأردن",
    "بوكسات ورد وهدايا",
    "باقة بيبي روز",
    "باقة جوري أحمر 100 وردة",
    "هدايا مناسبات الأردن",
  ],
  openGraph: {
    type: "website",
    locale: "ar_JO",
    url: siteUrl,
    siteName: "أزهار دمشق | Damascus Flowers",
    title: "أزهار دمشق | Damascus Flowers — متجر الزهور والهدايا الفاخرة",
    description:
      "باقات ورد طبيعي، بوكسات هدايا راقية، وتغليف VIP فاخر من أزهار دمشق في الأردن.",
    images: [
      {
        url: "/images/hero/damascus-flowers-hero.jpg",
        width: 1200,
        height: 630,
        alt: "أزهار دمشق | Damascus Flowers",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "أزهار دمشق | Damascus Flowers",
  category: "shopping",
  // Add your Google Search Console verification token here after creating the property:
  // verification: { google: "PASTE_TOKEN_HERE" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let settings: Awaited<ReturnType<typeof getPublicStoreSettings>> | null = null;
  try {
    settings = await getPublicStoreSettings();
  } catch {
    settings = null;
  }

  const storeNameAr = settings?.storeNameAr || "أزهار دمشق";
  const storeNameEn = settings?.storeNameEn || "Damascus Flowers";
  const whatsappNumber = settings?.whatsappNumber || "+962795831917";
  const phoneDisplay = settings?.phoneDisplay || "+962 79 583 1917";
  const instagramUrl =
    settings?.instagramUrl || "https://www.instagram.com/dmscs.flowers/";
  const announcementBarAr =
    settings?.announcementBarAr ||
    "تنسيق باقات الورد الطبيعي وبوكسات الهدايا الفاخرة بعناية فائقة في الأردن";

  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cormorant.variable}`}>
      <body
        style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3D2B1F] antialiased selection:bg-[#F5E1E4] selection:text-[#3D2B1F]"
      >
        <CartProvider>
          <SiteHeader
            storeNameAr={storeNameAr}
            storeNameEn={storeNameEn}
            whatsappNumber={whatsappNumber}
            phoneDisplay={phoneDisplay}
            instagramUrl={instagramUrl}
            announcementBarAr={announcementBarAr}
          />
          <CartDrawer />
          <AddedToCartPrompt />
          <main className="flex-1">{children}</main>
          <SiteFooter
            storeNameAr={storeNameAr}
            storeNameEn={storeNameEn}
            countryAr={settings?.countryAr || "الأردن"}
            whatsappNumber={whatsappNumber}
            phoneDisplay={phoneDisplay}
            instagramUrl={instagramUrl}
            facebookUrl={settings?.facebookUrl}
            tiktokUrl={settings?.tiktokUrl}
            emailAddress={settings?.emailAddress}
            workingHoursAr={
              settings?.workingHoursAr ||
              "يوميًا لخدمة طلباتكم وتنسيق الهدايا عبر الموقع وواتساب"
            }
          />
          <FloatingWhatsApp
            whatsappNumber={whatsappNumber}
            storeNameAr={storeNameAr}
          />
        </CartProvider>
      </body>
    </html>
  );
}
