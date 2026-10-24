import { db } from "./index";
import { categories, products, storeSettings } from "./schema";
import {
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_PAYMENT_METHODS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from "./seed-data";
import { count } from "drizzle-orm";
import { ensureSchema } from "./ensure-schema";

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }
  seedPromise = runSeed().catch((err) => {
    seedPromise = null;
    throw err;
  });
  return seedPromise;
}

async function runSeed(): Promise<void> {
  await ensureSchema();
  const [{ value: catCount }] = await db.select({ value: count() }).from(categories);
  if (catCount === 0) {
    await db
      .insert(categories)
      .values(INITIAL_CATEGORIES)
      .onConflictDoNothing({ target: categories.slug });
  }

  const [{ value: prodCount }] = await db.select({ value: count() }).from(products);
  if (prodCount === 0) {
    await db
      .insert(products)
      .values(INITIAL_PRODUCTS)
      .onConflictDoNothing({ target: products.slug });
  }

  const [{ value: settingsCount }] = await db.select({ value: count() }).from(storeSettings);
  if (settingsCount === 0) {
    await db
      .insert(storeSettings)
      .values({
        id: 1,
        storeNameAr: "أزهار دمشق",
        storeNameEn: "Damascus Flowers",
        countryAr: "الأردن",
        currencyCode: "JOD",
        currencySymbolAr: "د.أ.",
        whatsappNumber: "+962795831917",
        phoneDisplay: "+962 79 583 1917",
        instagramUrl: "https://www.instagram.com/dmscs.flowers/",
        vipPackagingFeeJod: "3.00",
        deliveryZones: DEFAULT_DELIVERY_ZONES,
        paymentMethods: DEFAULT_PAYMENT_METHODS,
      })
      .onConflictDoNothing({ target: storeSettings.id });
  }
}
