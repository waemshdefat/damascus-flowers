import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { sanitizeText } from "@/lib/validation";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.nameAr === "string") {
    const nameAr = sanitizeText(body.nameAr, 160);
    if (nameAr.length < 2) {
      return NextResponse.json({ ok: false, error: "اسم المنتج قصير جدًا." }, { status: 400 });
    }
    updates.nameAr = nameAr;
  }
  if (typeof body.subtitleAr === "string") {
    updates.subtitleAr = sanitizeText(body.subtitleAr, 240);
  }
  if (typeof body.descriptionAr === "string") {
    updates.descriptionAr = sanitizeText(body.descriptionAr, 2000);
  }
  if (typeof body.careTipsAr === "string") {
    updates.careTipsAr = sanitizeText(body.careTipsAr, 1000);
  }
  if (typeof body.priceOnRequest === "boolean") {
    updates.priceOnRequest = body.priceOnRequest;
  }
  if (body.priceJod !== undefined) {
    const p = Number.parseFloat(String(body.priceJod));
    if (Number.isFinite(p) && p >= 0) {
      updates.priceJod = p.toFixed(2);
    }
  }
  if ("compareAtPriceJod" in body) {
    const raw = body.compareAtPriceJod;
    if (raw === null || raw === "" || raw === undefined) {
      updates.compareAtPriceJod = null;
    } else {
      const c = Number.parseFloat(String(raw));
      updates.compareAtPriceJod = Number.isFinite(c) && c > 0 ? c.toFixed(2) : null;
    }
  }
  if (typeof body.badgeTextAr === "string") {
    updates.badgeTextAr = sanitizeText(body.badgeTextAr, 40);
  }
  if (typeof body.isAddon === "boolean") updates.isAddon = body.isAddon;
  if (typeof body.categorySlug === "string" && body.categorySlug.trim()) {
    updates.categorySlug = sanitizeText(body.categorySlug, 80);
  }
  if (Array.isArray(body.secondaryCategories)) {
    updates.secondaryCategories = body.secondaryCategories
      .map((s) => sanitizeText(s, 80))
      .filter(Boolean);
  }
  if (Array.isArray(body.images)) {
    const cleanImages = body.images
      .map((im) => {
        if (typeof im === "string") return { url: sanitizeText(im, 400), alt: "" };
        if (im && typeof im === "object") {
          const rec = im as Record<string, unknown>;
          return {
            url: sanitizeText(rec.url, 400),
            alt: sanitizeText(rec.alt, 200),
          };
        }
        return null;
      })
      .filter((im): im is { url: string; alt: string } => Boolean(im && im.url));
    if (cleanImages.length > 0) {
      updates.images = cleanImages;
    }
  }
  if ("stockQuantity" in body) {
    if (body.stockQuantity === null || body.stockQuantity === "") {
      updates.stockQuantity = null;
    } else {
      updates.stockQuantity = Math.max(0, Math.floor(Number(body.stockQuantity) || 0));
    }
  }
  if (typeof body.inStock === "boolean") updates.inStock = body.inStock;
  if (typeof body.isFeatured === "boolean") updates.isFeatured = body.isFeatured;
  if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
  if (body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))) {
    updates.sortOrder = Number(body.sortOrder);
  }

  const [updated] = await db
    .update(products)
    .set(updates)
    .where(eq(products.id, productId))
    .returning();

  if (!updated) {
    return NextResponse.json({ ok: false, error: "المنتج غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
  }

  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json({ ok: true });
}
