import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { orderItems, orders, products, storeSettings } from "@/db/schema";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/format";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateOrderPayload } from "@/lib/validation";
import { sendWhatsAppCloudNotification } from "@/lib/whatsapp";
import { eq, inArray, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`order:${ip}`, 15, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: "تم إرسال عدة طلبات خلال وقت قصير. يرجى المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    await ensureSeeded();

    const rawBody = await request.json().catch(() => null);
    const parsed = validateOrderPayload(rawBody);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    const input = parsed.data;

    const [settings] = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.id, 1))
      .limit(1);

    const uniqueIds = Array.from(new Set(input.items.map((i) => i.productId)));
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, uniqueIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Aggregate duplicate product rows safely
    const aggregated = new Map<number, number>();
    for (const item of input.items) {
      aggregated.set(item.productId, (aggregated.get(item.productId) ?? 0) + item.quantity);
    }

    let subtotal = 0;
    let hasPriceOnRequestItems = false;

    const lineRecords: Array<{
      productId: number;
      productSlug: string;
      productNameAr: string;
      productImage: string;
      unitPriceJod: string;
      priceOnRequest: boolean;
      quantity: number;
      lineTotalJod: string;
    }> = [];

    for (const [productId, quantity] of aggregated.entries()) {
      const prod = productMap.get(productId);
      if (!prod || !prod.isActive) {
        return NextResponse.json(
          { ok: false, error: "أحد المنتجات المختارة غير متوفر حاليًا في المتجر." },
          { status: 400 }
        );
      }
      if (!prod.inStock || (prod.stockQuantity !== null && prod.stockQuantity < quantity)) {
        return NextResponse.json(
          {
            ok: false,
            error: `الكمية المطلوبة من «${prod.nameAr}» غير متوفرة حاليًا في المخزون.`,
          },
          { status: 400 }
        );
      }

      const unitPrice = prod.priceOnRequest ? 0 : Number.parseFloat(prod.priceJod);
      if (prod.priceOnRequest) {
        hasPriceOnRequestItems = true;
      }
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      lineRecords.push({
        productId: prod.id,
        productSlug: prod.slug,
        productNameAr: prod.nameAr,
        productImage: prod.images[0]?.url || "/images/brand/logo-8016.png",
        unitPriceJod: unitPrice.toFixed(2),
        priceOnRequest: prod.priceOnRequest,
        quantity,
        lineTotalJod: lineTotal.toFixed(2),
      });
    }

    const zones = settings?.deliveryZones || [];
    const matchedZone = zones.find((z) => z.id === input.deliveryZoneId);
    const deliveryAreaName =
      matchedZone?.nameAr || input.deliveryAreaCustom || "الأردن";
    const deliveryFee: number | null =
      matchedZone && typeof matchedZone.feeJod === "number" ? matchedZone.feeJod : null;

    const vipFee =
      input.packagingType === "vip"
        ? Number.parseFloat(settings?.vipPackagingFeeJod || "0") || 0
        : 0;

    const total = subtotal + vipFee + (deliveryFee ?? 0);

    const paymentMethods = settings?.paymentMethods || [];
    const selectedPayment = paymentMethods.find((pm) => pm.id === input.paymentMethod);
    const paymentLabel =
      selectedPayment?.nameAr ||
      (input.paymentMethod === "cod" ? "الدفع عند الاستلام" : input.paymentMethod);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const orderNumber = `DF-${dateStamp}-${randomSuffix}`;

    const createdOrder = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          recipientName: input.recipientName,
          recipientPhone: input.recipientPhone,
          deliveryArea: deliveryAreaName,
          deliveryAddress: input.deliveryAddress,
          deliveryDate: input.deliveryDate,
          deliveryTimeSlot: input.deliveryTimeSlot,
          orderType: input.orderType,
          packagingType: input.packagingType,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
          subtotalJod: subtotal.toFixed(2),
          packagingFeeJod: vipFee.toFixed(2),
          deliveryFeeJod: deliveryFee !== null ? deliveryFee.toFixed(2) : null,
          hasPriceOnRequestItems,
          totalJod: total.toFixed(2),
          status: "new",
        })
        .returning();

      await tx.insert(orderItems).values(
        lineRecords.map((lr) => ({
          orderId: inserted.id,
          ...lr,
        }))
      );

      for (const lr of lineRecords) {
        const prod = productMap.get(lr.productId);
        if (prod && prod.stockQuantity !== null) {
          const nextStock = Math.max(0, prod.stockQuantity - lr.quantity);
          await tx
            .update(products)
            .set({
              stockQuantity: nextStock,
              inStock: nextStock > 0,
              updatedAt: new Date(),
            })
            .where(eq(products.id, lr.productId));
        }
      }

      return inserted;
    });

    const whatsappNumber = settings?.whatsappNumber || "+962795831917";
    const whatsappMessage = buildOrderWhatsAppMessage({
      orderNumber: createdOrder.orderNumber,
      customerName: createdOrder.customerName,
      customerPhone: createdOrder.customerPhone,
      recipientName: createdOrder.recipientName,
      recipientPhone: createdOrder.recipientPhone,
      deliveryArea: createdOrder.deliveryArea,
      deliveryAddress: createdOrder.deliveryAddress,
      deliveryDate: createdOrder.deliveryDate,
      deliveryTimeSlot: createdOrder.deliveryTimeSlot,
      orderType: createdOrder.orderType,
      packagingType: createdOrder.packagingType,
      paymentMethodLabel: paymentLabel,
      notes: createdOrder.notes,
      items: lineRecords.map((lr) => ({
        nameAr: lr.productNameAr,
        quantity: lr.quantity,
        unitPriceJod: lr.unitPriceJod,
        lineTotalJod: lr.lineTotalJod,
        priceOnRequest: lr.priceOnRequest,
      })),
      subtotalJod: createdOrder.subtotalJod,
      packagingFeeJod: createdOrder.packagingFeeJod,
      deliveryFeeJod: createdOrder.deliveryFeeJod,
      hasPriceOnRequestItems: createdOrder.hasPriceOnRequestItems,
      totalJod: createdOrder.totalJod,
    });

    const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

    // Attempt automatic server-side WhatsApp Business Cloud API dispatch if enabled
    let cloudResult = {
      status: "not_configured" as "not_configured" | "sent" | "failed",
      detail: "لم يتم تفعيل الربط التلقائي لـ WhatsApp Cloud API بعد.",
    };

    if (settings?.whatsappAutoNotifyEnabled || process.env.WHATSAPP_CLOUD_API_TOKEN) {
      cloudResult = await sendWhatsAppCloudNotification({
        recipientWhatsappNumber: whatsappNumber,
        messageBody: whatsappMessage,
        phoneNumberId: settings?.whatsappPhoneNumberId,
        templateName: settings?.whatsappTemplateName,
      });

      await db
        .update(orders)
        .set({
          whatsappNotificationStatus: cloudResult.status,
          whatsappNotificationDetail: sql`${cloudResult.detail}`,
        })
        .where(eq(orders.id, createdOrder.id));
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        subtotalJod: createdOrder.subtotalJod,
        packagingFeeJod: createdOrder.packagingFeeJod,
        deliveryFeeJod: createdOrder.deliveryFeeJod,
        hasPriceOnRequestItems: createdOrder.hasPriceOnRequestItems,
        totalJod: createdOrder.totalJod,
        deliveryArea: createdOrder.deliveryArea,
        deliveryDate: createdOrder.deliveryDate,
        deliveryTimeSlot: createdOrder.deliveryTimeSlot,
        paymentMethodLabel: paymentLabel,
      },
      whatsappUrl,
      whatsappMessage,
      cloudNotification: cloudResult,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ غير متوقع أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
