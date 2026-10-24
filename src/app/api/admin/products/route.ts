import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { products } from "@/db/schema";
import { LEGACY_WOOCOMMERCE_CATALOG } from "@/db/seed-data";
import { isAdminAuthenticated } from "@/lib/auth";
import { sanitizeText, slugifyInput } from "@/lib/validation";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.id));

  const existingSlugs = new Set(allProducts.map((p) => p.slug));
  const importableLegacy = LEGACY_WOOCOMMERCE_CATALOG.filter(
    (item) => !existingSlugs.has(item.slug)
  );

  return NextResponse.json({
    ok: true,
    products: allProducts,
    importableLegacyCount: importableLegacy.length,
    importableLegacy,
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }
  await ensureSeeded();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Support 1-click import of extra authentic Damascus Flowers WooCommerce products
  if (body.action === "import_legacy") {
    const targetSlug = typeof body.slug === "string" ? body.slug : null;
    const candidates = targetSlug
      ? LEGACY_WOOCOMMERCE_CATALOG.filter((p) => p.slug === targetSlug)
      : LEGACY_WOOCOMMERCE_CATALOG;

    let imported = 0;
    for (const item of candidates) {
      const inserted = await db
        .insert(products)
        .values(item)
        .onConflictDoNothing({ target: products.slug })
        .returning({ id: products.id });
      if (inserted.length > 0) imported += 1;
    }

    return NextResponse.json({ ok: true, imported });
  }

  const nameAr = sanitizeText(body.nameAr, 160);
  if (nameAr.length < 2) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال اسم المنتج بالعربية." },
      { status: 400 }
    );
  }

  const rawSlug = sanitizeText(body.slug, 140) || nameAr;
  const baseSlug = slugifyInput(rawSlug);
  const [collision] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, baseSlug))
    .limit(1);
  const finalSlug = collision ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const priceOnRequest = Boolean(body.priceOnRequest);
  const numericPrice = Number.parseFloat(String(body.priceJod ?? "0"));
  if (!priceOnRequest && (!Number.isFinite(numericPrice) || numericPrice < 0)) {
    return NextResponse.json(
      { ok: false, error: "يرجى إدخال سعر صحيح بالدينار الأردني." },
      { status: 400 }
    );
  }

  const rawImages = Array.isArray(body.images) ? body.images : [];
  const cleanImages = rawImages
    .map((im) => {
      if (typeof im === "string") {
        return { url: sanitizeText(im, 400), alt: nameAr };
      }
      if (im && typeof im === "object") {
        const rec = im as Record<string, unknown>;
        return {
          url: sanitizeText(rec.url, 400),
          alt: sanitizeText(rec.alt, 200) || nameAr,
        };
      }
      return null;
    })
    .filter((im): im is { url: string; alt: string } => Boolean(im && im.url));

  const compareRaw = body.compareAtPriceJod;
  const compareNum =
    compareRaw === null || compareRaw === "" || compareRaw === undefined
      ? null
      : Number.parseFloat(String(compareRaw));
  const compareAtPriceJod =
    compareNum !== null && Number.isFinite(compareNum) && compareNum > numericPrice
      ? compareNum.toFixed(2)
      : null;

  const stockRaw = body.stockQuantity;
  const stockQuantity =
    stockRaw === null || stockRaw === "" || stockRaw === undefined
      ? null
      : Math.max(0, Math.floor(Number(stockRaw) || 0));

  const [created] = await db
    .insert(products)
    .values({
      slug: finalSlug,
      legacySlugs: [],
      nameAr,
      subtitleAr: sanitizeText(body.subtitleAr, 240),
      descriptionAr:
        sanitizeText(body.descriptionAr, 2000) ||
        `تنسيق راقٍ من ${nameAr} بتوقيع أزهار دمشق.`,
      careTipsAr: sanitizeText(body.careTipsAr, 1000),
      priceJod: (priceOnRequest ? 0 : numericPrice).toFixed(2),
      compareAtPriceJod: priceOnRequest ? null : compareAtPriceJod,
      badgeTextAr: sanitizeText(body.badgeTextAr, 40),
      isAddon: Boolean(body.isAddon),
      priceOnRequest,
      categorySlug: sanitizeText(body.categorySlug, 80) || "flower-bouquets",
      secondaryCategories: Array.isArray(body.secondaryCategories)
        ? body.secondaryCategories
            .map((s) => sanitizeText(s, 80))
            .filter(Boolean)
        : [],
      images:
        cleanImages.length > 0
          ? cleanImages
          : [{ url: "/images/brand/logo-8016.png", alt: nameAr }],
      stockQuantity,
      inStock: body.inStock !== false,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 50,
    })
    .returning();

  return NextResponse.json({ ok: true, product: created });
}
