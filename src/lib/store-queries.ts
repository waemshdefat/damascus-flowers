import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { categories, products, storeSettings } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getPublicStoreSettings() {
  await ensureSeeded();
  const [row] = await db
    .select({
      storeNameAr: storeSettings.storeNameAr,
      storeNameEn: storeSettings.storeNameEn,
      countryAr: storeSettings.countryAr,
      currencyCode: storeSettings.currencyCode,
      currencySymbolAr: storeSettings.currencySymbolAr,
      whatsappNumber: storeSettings.whatsappNumber,
      phoneDisplay: storeSettings.phoneDisplay,
      instagramUrl: storeSettings.instagramUrl,
      facebookUrl: storeSettings.facebookUrl,
      tiktokUrl: storeSettings.tiktokUrl,
      emailAddress: storeSettings.emailAddress,
      workingHoursAr: storeSettings.workingHoursAr,
      announcementBarAr: storeSettings.announcementBarAr,
      vipPackagingFeeJod: storeSettings.vipPackagingFeeJod,
      deliveryZones: storeSettings.deliveryZones,
      paymentMethods: storeSettings.paymentMethods,
    })
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1);

  return row;
}

export async function getActiveCategories() {
  await ensureSeeded();
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.id));
}

export async function getActiveProducts() {
  await ensureSeeded();
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder), asc(products.id));
}

export async function getProductBySlugOrLegacy(rawSlug: string) {
  await ensureSeeded();
  const decoded = decodeURIComponent(rawSlug).trim();

  const [exact] = await db
    .select()
    .from(products)
    .where(eq(products.slug, decoded))
    .limit(1);

  if (exact) {
    return { product: exact, matchedLegacy: false };
  }

  const all = await db.select().from(products);
  const legacyMatch = all.find(
    (p) =>
      p.slug.toLowerCase() === decoded.toLowerCase() ||
      (Array.isArray(p.legacySlugs) &&
        p.legacySlugs.some(
          (ls) => ls === decoded || ls.toLowerCase() === decoded.toLowerCase()
        ))
  );

  if (legacyMatch) {
    return { product: legacyMatch, matchedLegacy: true };
  }

  return { product: null, matchedLegacy: false };
}
