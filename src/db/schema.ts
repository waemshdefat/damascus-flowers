import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface DeliveryZoneConfig {
  id: string;
  nameAr: string;
  feeJod: number | null; // null means determined upon confirmation without inventing unapproved fees
  noteAr: string;
  enabled: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  nameAr: string;
  descriptionAr: string;
  enabled: boolean;
}

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  heroImage: text("hero_image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  legacySlugs: jsonb("legacy_slugs").$type<string[]>().notNull().default([]),
  nameAr: text("name_ar").notNull(),
  subtitleAr: text("subtitle_ar").notNull().default(""),
  descriptionAr: text("description_ar").notNull(),
  careTipsAr: text("care_tips_ar").notNull().default(""),
  priceJod: numeric("price_jod", { precision: 10, scale: 2 }).notNull().default("0.00"),
  compareAtPriceJod: numeric("compare_at_price_jod", { precision: 10, scale: 2 }), // original price before discount (null = no offer)
  badgeTextAr: text("badge_text_ar").notNull().default(""), // optional custom badge e.g. "OFFER" / "الأكثر طلبًا"
  isAddon: boolean("is_addon").notNull().default(false), // suggested add-on at checkout (chocolate, teddy...)
  priceOnRequest: boolean("price_on_request").notNull().default(false),
  categorySlug: text("category_slug").notNull(),
  secondaryCategories: jsonb("secondary_categories").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<ProductImage[]>().notNull().default([]),
  stockQuantity: integer("stock_quantity"), // null = fresh made-to-order unlimited stock
  inStock: boolean("in_stock").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull().default(""),
  deliveryArea: text("delivery_area").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  deliveryTimeSlot: text("delivery_time_slot").notNull(),
  orderType: text("order_type").notNull().default("normal"), // "normal" | "secret"
  packagingType: text("packaging_type").notNull().default("classic"), // "classic" | "vip"
  paymentMethod: text("payment_method").notNull().default("cod"),
  notes: text("notes").notNull().default(""),
  subtotalJod: numeric("subtotal_jod", { precision: 10, scale: 2 }).notNull(),
  packagingFeeJod: numeric("packaging_fee_jod", { precision: 10, scale: 2 }).notNull().default("0.00"),
  deliveryFeeJod: numeric("delivery_fee_jod", { precision: 10, scale: 2 }), // null when fee determined per zone on confirmation
  hasPriceOnRequestItems: boolean("has_price_on_request_items").notNull().default(false),
  totalJod: numeric("total_jod", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("new"), // new | confirmed | preparing | out_for_delivery | delivered | cancelled
  whatsappNotificationStatus: text("whatsapp_notification_status")
    .notNull()
    .default("not_configured"),
  whatsappNotificationDetail: text("whatsapp_notification_detail").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productSlug: text("product_slug").notNull(),
  productNameAr: text("product_name_ar").notNull(),
  productImage: text("product_image").notNull(),
  unitPriceJod: numeric("unit_price_jod", { precision: 10, scale: 2 }).notNull(),
  priceOnRequest: boolean("price_on_request").notNull().default(false),
  quantity: integer("quantity").notNull(),
  lineTotalJod: numeric("line_total_jod", { precision: 10, scale: 2 }).notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  storeNameAr: text("store_name_ar").notNull().default("أزهار دمشق"),
  storeNameEn: text("store_name_en").notNull().default("Damascus Flowers"),
  countryAr: text("country_ar").notNull().default("الأردن"),
  currencyCode: text("currency_code").notNull().default("JOD"),
  currencySymbolAr: text("currency_symbol_ar").notNull().default("د.أ."),
  whatsappNumber: text("whatsapp_number").notNull().default("+962795831917"),
  phoneDisplay: text("phone_display").notNull().default("+962 79 583 1917"),
  instagramUrl: text("instagram_url")
    .notNull()
    .default("https://www.instagram.com/dmscs.flowers/"),
  facebookUrl: text("facebook_url").notNull().default(""),
  tiktokUrl: text("tiktok_url").notNull().default(""),
  emailAddress: text("email_address").notNull().default(""),
  workingHoursAr: text("working_hours_ar")
    .notNull()
    .default("يوميًا لخدمة طلباتكم وتنسيق الهدايا عبر الموقع وواتساب"),
  announcementBarAr: text("announcement_bar_ar")
    .notNull()
    .default("تنسيق باقات الورد الطبيعي وبوكسات الهدايا الفاخرة بعناية فائقة في الأردن — اطلب الآن عبر الموقع أو واتساب"),
  vipPackagingFeeJod: numeric("vip_packaging_fee_jod", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  deliveryZones: jsonb("delivery_zones").$type<DeliveryZoneConfig[]>().notNull().default([]),
  paymentMethods: jsonb("payment_methods").$type<PaymentMethodConfig[]>().notNull().default([]),
  whatsappAutoNotifyEnabled: boolean("whatsapp_auto_notify_enabled").notNull().default(false),
  whatsappPhoneNumberId: text("whatsapp_phone_number_id").notNull().default(""),
  whatsappTemplateName: text("whatsapp_template_name").notNull().default("hello_world"),
  adminPasswordHash: text("admin_password_hash").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
