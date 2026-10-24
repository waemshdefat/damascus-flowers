import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { categories, products, storeSettings } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/db/seed-data";

function logDbError(where: string, err: unknown) {
  console.error(`[store-queries] ${where} failed:`, err instanceof Error ? err.message : err);
}

export async function getPublicStoreSettings() {
  try {
    await ensureSeeded();
  } catch (err) {
    logDbError("getPublicStoreSettings/seed", err);
    return null;
  }
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
    .limit(1)
    .catch((err) => {
      logDbError("getPublicStoreSettings", err);
      return [] as never[];
    });

  return row ?? null;
}

export async function getActiveCategories() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder), asc(categories.id));
  } catch (err) {
    logDbError("getActiveCategories", err);
    return INITIAL_CATEGORIES.map((c, i) => ({ id: i + 1, isActive: true, createdAt: new Date(), ...c }));
  }
}

export async function getActiveProducts() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.sortOrder), asc(products.id));
  } catch (err) {
    logDbError("getActiveProducts", err);
    return INITIAL_PRODUCTS.map((p, i) => ({
      id: i + 1,
      compareAtPriceJod: p.compareAtPriceJod ?? null,
      badgeTextAr: p.badgeTextAr ?? "",
      isAddon: p.isAddon ?? false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...p,
    }));
  }
}

export async function getProductBySlugOrLegacy(rawSlug: string) {
  const decoded = decodeURIComponent(rawSlug).trim();
  try {
    await ensureSeeded();
  } catch (err) {
    logDbError("getProductBySlugOrLegacy/seed", err);
    const all = await getActiveProducts();
    const found = all.find((p) => p.slug === decoded || p.legacySlugs.includes(decoded));
    return { product: found ?? null, matchedLegacy: Boolean(found && found.slug !== decoded) };
  }

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
