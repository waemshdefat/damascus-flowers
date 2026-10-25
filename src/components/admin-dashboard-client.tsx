"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Edit3,
  ExternalLink,
  LogOut,
  MessageCircle,
  Package,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Trash2,
  Truck,
  Upload,
} from "lucide-react";
import { buildWhatsAppUrl, formatJod, ORDER_STATUS_LABELS } from "@/lib/format";
import type {
  DeliveryZoneConfig,
  PaymentMethodConfig,
  ProductImage,
} from "@/db/schema";

interface AdminCategory {
  slug: string;
  nameAr: string;
}

interface AdminProduct {
  id: number;
  slug: string;
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  careTipsAr: string;
  priceJod: string;
  compareAtPriceJod: string | null;
  badgeTextAr: string;
  isAddon: boolean;
  priceOnRequest: boolean;
  categorySlug: string;
  secondaryCategories: string[];
  images: ProductImage[];
  stockQuantity: number | null;
  inStock: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface AdminOrderItem {
  id: number;
  productNameAr: string;
  productImage: string;
  unitPriceJod: string;
  priceOnRequest: boolean;
  quantity: number;
  lineTotalJod: string;
}

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  orderType: string;
  packagingType: string;
  paymentMethod: string;
  notes: string;
  subtotalJod: string;
  packagingFeeJod: string;
  deliveryFeeJod: string | null;
  hasPriceOnRequestItems: boolean;
  totalJod: string;
  status: string;
  whatsappNotificationStatus: string;
  whatsappNotificationDetail: string;
  createdAt: string;
  items: AdminOrderItem[];
}

interface AdminMessage {
  id: number;
  name: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface AdminSettings {
  storeNameAr: string;
  storeNameEn: string;
  whatsappNumber: string;
  phoneDisplay: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  emailAddress: string;
  workingHoursAr: string;
  announcementBarAr: string;
  vipPackagingFeeJod: string;
  deliveryZones: DeliveryZoneConfig[];
  paymentMethods: PaymentMethodConfig[];
  whatsappAutoNotifyEnabled: boolean;
  whatsappPhoneNumberId: string;
  whatsappTemplateName: string;
}

export function AdminDashboardClient({
  initialAuthenticated,
  categories,
}: {
  initialAuthenticated: boolean;
  categories: AdminCategory[];
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "orders" | "products" | "delivery" | "settings"
  >("orders");

  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [messagesList, setMessagesList] = useState<AdminMessage[]>([]);
  const [productsList, setProductsList] = useState<AdminProduct[]>([]);
  const [importableCount, setImportableCount] = useState(0);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [cloudEnvConfigured, setCloudEnvConfigured] = useState(false);

  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState("");

  // Product Editor Modal/Panel state
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(
    null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [waTestResult, setWaTestResult] = useState<string>("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const loadAllAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [ordRes, prodRes, setRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
        fetch("/api/admin/settings"),
      ]);

      if (ordRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      const [ordJson, prodJson, setJson] = await Promise.all([
        ordRes.json(),
        prodRes.json(),
        setRes.json(),
      ]);

      if (ordJson.ok) {
        setOrdersList(ordJson.orders || []);
        setMessagesList(ordJson.messages || []);
      }
      if (prodJson.ok) {
        setProductsList(prodJson.products || []);
        setImportableCount(prodJson.importableLegacyCount || 0);
      }
      if (setJson.ok) {
        setSettings(setJson.settings || null);
        setCloudEnvConfigured(Boolean(setJson.cloudApiEnvConfigured));
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadAllAdminData();
    }
  }, [authenticated, loadAllAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAuthError(data.error || "تعذّر تسجيل الدخول.");
      } else {
        setPasswordInput("");
        setAuthenticated(true);
      }
    } catch {
      setAuthError("حدث خطأ في الاتصال.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    setAuthenticated(false);
  };

  const handleOrderStatusChange = async (orderId: number, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.ok) {
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      notify("تم تحديث حالة الطلب بنجاح.");
    }
  };

  const handleOrderDeliveryFeeSave = async (orderId: number, rawValue: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryFeeJod: rawValue }),
    });
    const data = await res.json();
    if (data.ok && data.order) {
      setOrdersList((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                deliveryFeeJod: data.order.deliveryFeeJod,
                totalJod: data.order.totalJod,
              }
            : o
        )
      );
      notify("تم تحديث تكلفة التوصيل وإجمالي الطلب.");
    }
  };

  const handleUploadProductPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingProduct) return;
    setUploadingImage(true);
    try {
      const uploaded: ProductImage[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.ok && data.url) {
          uploaded.push({ url: data.url, alt: editingProduct.nameAr || "أزهار دمشق" });
        } else {
          notify(data.error || `تعذّر رفع الصورة ${file.name}.`);
        }
      }
      if (uploaded.length > 0) {
        setEditingProduct((prev) =>
          prev ? { ...prev, images: [...(prev.images || []), ...uploaded] } : prev
        );
        notify(`تم رفع ${uploaded.length} صورة وتحسين جودتها بنجاح.`);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const isExisting = Boolean(editingProduct.id);
    const url = isExisting
      ? `/api/admin/products/${editingProduct.id}`
      : "/api/admin/products";
    const method = isExisting ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct),
    });
    const data = await res.json();
    if (data.ok) {
      setEditingProduct(null);
      await loadAllAdminData();
      notify(isExisting ? "تم حفظ تعديلات المنتج." : "تمت إضافة المنتج الجديد.");
    } else {
      notify(data.error || "تحقق من بيانات المنتج.");
    }
  };

  const handleDeleteProduct = async (productId: number, nameAr: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج «${nameAr}»؟`)) return;
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) {
      setProductsList((prev) => prev.filter((p) => p.id !== productId));
      notify("تم حذف المنتج.");
    }
  };

  const handleImportLegacyCatalog = async () => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import_legacy" }),
    });
    const data = await res.json();
    if (data.ok) {
      await loadAllAdminData();
      notify(`تم استيراد ${data.imported} منتج إضافي من كتالوج الموقع الحالي بصوره الأصلية.`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const payload = {
      ...settings,
      ...(newAdminPassword.trim() ? { newAdminPassword: newAdminPassword.trim() } : {}),
    };
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      setNewAdminPassword("");
      setSettings(data.settings);
      notify("تم حفظ إعدادات المتجر بنجاح.");
    } else {
      notify(data.error || "تعذّر حفظ الإعدادات.");
    }
  };

  const handleTestWhatsAppCloud = async () => {
    setWaTestResult("جاري الاتصال بـ Meta WhatsApp Cloud API...");
    const res = await fetch("/api/admin/whatsapp/test", { method: "POST" });
    const data = await res.json();
    setWaTestResult(data.result?.detail || "اكتمل الفحص.");
  };

  // Secure Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[2rem] bg-[#FFFDFB] border border-[#E6DDD0] p-8 shadow-md space-y-6">
          <div className="text-center space-y-3">
            <img
              src="/images/brand/damascus-flowers-logo-trim.png"
              alt="Damascus Flowers"
              className="w-28 h-auto mx-auto object-contain"
            />
            <h1 className="text-2xl font-extrabold text-[#3D2B1F]">
              لوحة إدارة أزهار دمشق
            </h1>
            <p className="text-xs text-[#7D6352]">
              أدخل كلمة مرور الإدارة الآمنة للوصول إلى الطلبات والمنتجات والإعدادات.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3D2B1F]">
                كلمة المرور الإدارية
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm text-[#3D2B1F]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-4 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs font-bold text-sm transition cursor-pointer"
            >
              {loggingIn ? "جاري التحقق..." : "دخول آمن إلى لوحة التحكم"}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-bold text-[#695244] hover:text-[#3D2B1F]"
            >
              ← العودة إلى واجهة المتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders =
    statusFilter === "all"
      ? ordersList
      : ordersList.filter((o) => o.status === statusFilter);

  const newOrdersCount = ordersList.filter((o) => o.status === "new").length;
  const totalRevenueJod = ordersList
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number.parseFloat(o.totalJod) || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-[#F3ECE2] text-[#3D2B1F] border-b border-[#E6DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base sm:text-lg">
              إدارة أزهار دمشق
            </span>
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-[#FFFDFB] border border-[#D8C7B4] text-[#965866]">
              Damascus Flowers Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadAllAdminData}
              className="p-2 rounded-xl bg-[#FFFDFB] border border-[#D8C7B4] hover:bg-[#F5E1E4] text-xs inline-flex items-center gap-1.5 cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-[#FFFDFB] border border-[#D8C7B4] hover:bg-[#F5E1E4] text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>معاينة المتجر</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-5 py-3.5 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3]">
            <p className="text-xs text-[#7D6352]">طلبات جديدة بانتظار التأكيد</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] mt-1">
              {newOrdersCount}
            </p>
          </div>
          <div className="p-5 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3]">
            <p className="text-xs text-[#7D6352]">إجمالي الطلبات المسجلة</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] mt-1">
              {ordersList.length}
            </p>
          </div>
          <div className="p-5 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3]">
            <p className="text-xs text-[#7D6352]">إجمالي قيمة الطلبات</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] mt-1">
              {formatJod(totalRevenueJod)}
            </p>
          </div>
          <div className="p-5 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3]">
            <p className="text-xs text-[#7D6352]">المنتجات النشطة في المتجر</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3D2B1F] mt-1">
              {productsList.filter((p) => p.isActive).length}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#FFFDFB] p-2 rounded-2xl border border-[#EAE0D3]">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                : "text-[#5C4332] hover:bg-[#F3ECE2]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات والعملاء ({ordersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer ${
              activeTab === "products"
                ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                : "text-[#5C4332] hover:bg-[#F3ECE2]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والأسعار والمخزون ({productsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("delivery")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer ${
              activeTab === "delivery"
                ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                : "text-[#5C4332] hover:bg-[#F3ECE2]"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>مناطق التوصيل وطرق الدفع</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                : "text-[#5C4332] hover:bg-[#F3ECE2]"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>التواصل، واتساب، والنسخ الاحتياطي</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                    : "bg-[#FFFDFB] border border-[#E6DDD0] text-[#5C4332]"
                }`}
              >
                الكل ({ordersList.length})
              </button>
              {Object.entries(ORDER_STATUS_LABELS).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    statusFilter === key
                      ? "bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs"
                      : "bg-[#FFFDFB] border border-[#E6DDD0] text-[#5C4332]"
                  }`}
                >
                  {cfg.label} ({ordersList.filter((o) => o.status === key).length})
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] text-sm text-[#7D6352]">
                لا توجد طلبات ضمن هذا التصنيف حاليًا.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const st = ORDER_STATUS_LABELS[ord.status] || {
                    label: ord.status,
                    colorClass: "bg-gray-100 text-gray-800",
                  };
                  const customerWa = buildWhatsAppUrl(
                    ord.customerPhone,
                    `مرحبًا ${ord.customerName} 🌸 نتواصل معك من متجر *أزهار دمشق* بخصوص طلبك رقم #${ord.orderNumber}.`
                  );

                  return (
                    <div
                      key={ord.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F1E9DF]">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            dir="ltr"
                            className="text-base font-extrabold text-[#3D2B1F]"
                          >
                            #{ord.orderNumber}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${st.colorClass}`}
                          >
                            {st.label}
                          </span>
                          {ord.orderType === "secret" && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                              🔒 طلب سري — لا يُذكر اسم المرسل للمستلم
                            </span>
                          )}
                          {ord.packagingType === "vip" && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              ✨ تغليف VIP فاخر
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-[#695244]">
                            الحالة:
                          </label>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleOrderStatusChange(ord.id, e.target.value)
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-xs font-bold text-[#3D2B1F]"
                          >
                            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
                        {/* Customer Info */}
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-[#3D2B1F]">
                            بيانات العميل (المُرسِل)
                          </p>
                          <p>الاسم: {ord.customerName}</p>
                          <p>
                            الهاتف:{" "}
                            <span dir="ltr" className="font-bold">
                              {ord.customerPhone}
                            </span>
                          </p>
                          <p>الدفع: {ord.paymentMethod === "cod" ? "الدفع عند الاستلام" : ord.paymentMethod}</p>
                          <a
                            href={customerWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8E4D] hover:underline pt-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>مراسلة العميل عبر واتساب</span>
                          </a>
                        </div>

                        {/* Recipient & Delivery */}
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-[#3D2B1F]">
                            المستلم وعنوان التوصيل
                          </p>
                          <p>المستلم: {ord.recipientName}</p>
                          {ord.recipientPhone && (
                            <p>
                              هاتف المستلم:{" "}
                              <span dir="ltr" className="font-bold">
                                {ord.recipientPhone}
                              </span>
                            </p>
                          )}
                          <p>المنطقة: {ord.deliveryArea}</p>
                          <p>العنوان: {ord.deliveryAddress}</p>
                          <p>
                            الموعد: <strong>{ord.deliveryDate}</strong> —{" "}
                            {ord.deliveryTimeSlot}
                          </p>
                        </div>

                        {/* Items & Financials */}
                        <div className="space-y-2">
                          <p className="font-extrabold text-[#3D2B1F]">
                            المنتجات والفاتورة
                          </p>
                          <ul className="space-y-1 text-[#5C4332]">
                            {ord.items.map((it) => (
                              <li key={it.id}>
                                • {it.productNameAr} × {it.quantity} (
                                {it.priceOnRequest
                                  ? "حسب الاختيار"
                                  : formatJod(it.lineTotalJod)}
                                )
                              </li>
                            ))}
                          </ul>

                          <div className="pt-2 border-t border-[#F1E9DF] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span>المنتجات:</span>
                              <strong>{formatJod(ord.subtotalJod)}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span>رسوم التوصيل (د.أ.):</span>
                              <input
                                type="number"
                                min={0}
                                step="0.5"
                                defaultValue={ord.deliveryFeeJod ?? ""}
                                placeholder="تحديد"
                                onBlur={(e) =>
                                  handleOrderDeliveryFeeSave(ord.id, e.target.value)
                                }
                                className="w-24 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DFD2C0] text-xs font-bold text-left"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm font-extrabold text-[#3D2B1F]">
                              <span>الإجمالي:</span>
                              <span>{formatJod(ord.totalJod)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {ord.notes && (
                        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D6] text-xs text-[#4A3527]">
                          <strong>ملاحظات / نص البطاقة:</strong> {ord.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setEditingProduct({
                    nameAr: "",
                    subtitleAr: "",
                    descriptionAr: "",
                    careTipsAr: "",
                    priceJod: "35.00",
                    compareAtPriceJod: null,
                    badgeTextAr: "",
                    isAddon: false,
                    priceOnRequest: false,
                    categorySlug: categories[0]?.slug || "flower-bouquets",
                    secondaryCategories: [],
                    images: [],
                    stockQuantity: 15,
                    inStock: true,
                    isFeatured: false,
                    isActive: true,
                    sortOrder: 20,
                  })
                }
                className="px-5 py-3 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>

              {importableCount > 0 && (
                <button
                  type="button"
                  onClick={handleImportLegacyCatalog}
                  className="px-5 py-3 rounded-2xl bg-[#F5E1E4] hover:bg-[#ECCFD4] text-[#3D2B1F] border border-[#E4C2C8] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    استيراد بقية منتجات الموقع الحالي ({importableCount} منتج جاهز بصوره
                    الأصلية)
                  </span>
                </button>
              )}
            </div>

            {/* Product Editor Form */}
            {editingProduct && (
              <form
                onSubmit={handleSaveProduct}
                className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border-2 border-[#3D2B1F] space-y-5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[#3D2B1F]">
                    {editingProduct.id
                      ? `تعديل المنتج: ${editingProduct.nameAr}`
                      : "إضافة منتج جديد إلى المتجر"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="text-xs font-bold text-[#7D6352] hover:text-[#3D2B1F] cursor-pointer"
                  >
                    إلغاء ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold">اسم المنتج بالعربي *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameAr || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, nameAr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">السعر بالدينار الأردني (JOD)</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      disabled={Boolean(editingProduct.priceOnRequest)}
                      value={editingProduct.priceJod ?? "0"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          priceJod: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">
                      السعر قبل الخصم (اختياري — لعرض شارة OFFER)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      disabled={Boolean(editingProduct.priceOnRequest)}
                      value={editingProduct.compareAtPriceJod ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          compareAtPriceJod: e.target.value === "" ? null : e.target.value,
                        })
                      }
                      placeholder="مثال: 45 (والسعر الحالي 35 = خصم 22%)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">
                      نص الشارة على الصورة (اختياري — يُحسب الخصم تلقائيًا إن تُرك فارغًا)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.badgeTextAr || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, badgeTextAr: e.target.value })
                      }
                      placeholder="OFFER / عرض خاص / الأكثر طلبًا"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">التصنيف الرئيسي</label>
                    <select
                      value={editingProduct.categorySlug || "flower-bouquets"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          categorySlug: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">
                      كمية المخزون (اتركه فارغًا للتجهيز المفتوح حسب الطلب)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.stockQuantity ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stockQuantity:
                            e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold">وصف مختصر تحت العنوان</label>
                    <input
                      type="text"
                      value={editingProduct.subtitleAr || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          subtitleAr: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">الوصف الكامل للمنتج</label>
                  <textarea
                    rows={3}
                    value={editingProduct.descriptionAr || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        descriptionAr: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                  />
                </div>

                {/* Image Management (Direct Upload + URL) */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#3D2B1F]">
                      صور المنتج
                    </span>
                    <label className="px-4 py-2 rounded-xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingImage
                          ? "جاري المعالجة..."
                          : "رفع صورة أو عدة صور من الجهاز"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUploadProductPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="/images/products/... أو https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        setEditingProduct({
                          ...editingProduct,
                          images: [
                            ...(editingProduct.images || []),
                            {
                              url: newImageUrl.trim(),
                              alt: editingProduct.nameAr || "أزهار دمشق",
                            },
                          ],
                        });
                        setNewImageUrl("");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#F5E1E4] text-xs font-bold cursor-pointer"
                    >
                      إضافة الرابط
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {(editingProduct.images || []).map((img, i) => (
                      <div
                        key={`${img.url}-${i}`}
                        className="relative w-20 h-24 rounded-xl overflow-hidden bg-white border border-[#DFD2C0]"
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              images: (editingProduct.images || []).filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-rose-800 text-white text-[10px] font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock !== false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          inStock: e.target.checked,
                        })
                      }
                    />
                    <span>متوفر للطلب حاليًا</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isActive !== false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <span>ظاهر في واجهة المتجر</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.priceOnRequest)}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          priceOnRequest: e.target.checked,
                        })
                      }
                    />
                    <span>السعر يُحدَّد عند الطلب</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isAddon)}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isAddon: e.target.checked,
                        })
                      }
                    />
                    <span>منتج إضافي مقترح عند إتمام الطلب (شوكولاتة / دبدوب)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات المنتج</span>
                </button>
              </form>
            )}

            {/* Products Table/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] flex gap-4 items-center"
                >
                  <img
                    src={prod.images[0]?.url || "/images/brand/logo-8016.png"}
                    alt={prod.nameAr}
                    className="w-20 h-24 rounded-2xl object-cover bg-white border border-[#F0E8DC] shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-extrabold text-sm text-[#3D2B1F] truncate">
                      {prod.nameAr}
                    </p>
                    <p className="text-xs font-bold text-[#965866] flex items-center gap-1.5 flex-wrap">
                      {prod.compareAtPriceJod && !prod.priceOnRequest && (
                        <span className="line-through text-[#9A8474]">
                          {formatJod(prod.compareAtPriceJod)}
                        </span>
                      )}
                      <span>
                        {prod.priceOnRequest
                          ? "يُحدَّد عند الطلب"
                          : formatJod(prod.priceJod)}
                      </span>
                      {prod.compareAtPriceJod && !prod.priceOnRequest && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FBE9EB] text-[#B8232F] text-[10px]">
                          عرض
                        </span>
                      )}
                      {prod.isAddon && (
                        <span className="px-1.5 py-0.5 rounded bg-[#F3ECE2] text-[#5C4332] text-[10px]">
                          إضافي
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#7D6352]">
                      المخزون:{" "}
                      {prod.stockQuantity === null
                        ? "مفتوح حسب الطلب"
                        : `${prod.stockQuantity} قطعة`}{" "}
                      • {prod.isActive ? "ظاهر" : "مخفي"}
                    </p>
                    <div className="pt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(prod)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE6DA] border border-[#DFD2C0] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.nameAr)}
                        className="p-1.5 rounded-xl text-rose-700 hover:bg-rose-50 cursor-pointer"
                        aria-label={`حذف ${prod.nameAr}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY ZONES & PAYMENT METHODS */}
        {activeTab === "delivery" && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-[#3D2B1F]">
                    مناطق التوصيل وتكلفتها بالدينار الأردني
                  </h2>
                  <p className="text-xs text-[#7D6352]">
                    حاليًا لا يُعرض أي سعر توصيل للزبون، بل عبارة «تُحدَّد تكلفة التوصيل حسب الحي
                    والمنطقة». إذا كتبت سعرًا لأي محافظة هنا، سيظهر تلقائيًا للزبون ويُضاف
                    للإجمالي؛ واتركه فارغًا لإبقاء العبارة كما هي.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      deliveryZones: [
                        ...settings.deliveryZones,
                        {
                          id: `zone-${Date.now()}`,
                          nameAr: "منطقة جديدة",
                          feeJod: null,
                          noteAr: "",
                          enabled: true,
                        },
                      ],
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#F5E1E4] text-xs font-bold text-[#3D2B1F] cursor-pointer"
                >
                  + إضافة منطقة توصيل
                </button>
              </div>

              <div className="space-y-3">
                {settings.deliveryZones.map((zone, idx) => (
                  <div
                    key={zone.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0] items-center"
                  >
                    <input
                      type="text"
                      value={zone.nameAr}
                      onChange={(e) => {
                        const copy = [...settings.deliveryZones];
                        copy[idx] = { ...zone, nameAr: e.target.value };
                        setSettings({ ...settings, deliveryZones: copy });
                      }}
                      placeholder="اسم المنطقة"
                      className="md:col-span-5 px-3 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs sm:text-sm font-bold"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.5"
                      value={zone.feeJod ?? ""}
                      onChange={(e) => {
                        const copy = [...settings.deliveryZones];
                        copy[idx] = {
                          ...zone,
                          feeJod:
                            e.target.value === "" ? null : Number(e.target.value),
                        };
                        setSettings({ ...settings, deliveryZones: copy });
                      }}
                      placeholder="السعر د.أ. (فارغ = حسب الحي والمنطقة)"
                      className="md:col-span-3 px-3 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs sm:text-sm"
                    />
                    <input
                      type="text"
                      value={zone.noteAr}
                      onChange={(e) => {
                        const copy = [...settings.deliveryZones];
                        copy[idx] = { ...zone, noteAr: e.target.value };
                        setSettings({ ...settings, deliveryZones: copy });
                      }}
                      placeholder="ملاحظة التوصيل"
                      className="md:col-span-3 px-3 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          deliveryZones: settings.deliveryZones.filter(
                            (_, i) => i !== idx
                          ),
                        })
                      }
                      className="md:col-span-1 text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-5">
              <h2 className="text-lg font-extrabold text-[#3D2B1F]">
                طرق الدفع ورسوم تغليف VIP الفاخر
              </h2>

              <div className="max-w-xs space-y-1">
                <label className="block text-xs font-bold">
                  رسوم إضافية لتغليف VIP الفاخر (د.أ.)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={settings.vipPackagingFeeJod}
                  onChange={(e) =>
                    setSettings({ ...settings, vipPackagingFeeJod: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm font-bold"
                />
              </div>

              <div className="space-y-3">
                {settings.paymentMethods.map((pm, idx) => (
                  <div
                    key={pm.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0]"
                  >
                    <label className="inline-flex items-center gap-2.5 text-sm font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pm.enabled}
                        onChange={(e) => {
                          const copy = [...settings.paymentMethods];
                          copy[idx] = { ...pm, enabled: e.target.checked };
                          setSettings({ ...settings, paymentMethods: copy });
                        }}
                      />
                      <span>{pm.nameAr}</span>
                    </label>
                    <input
                      type="text"
                      value={pm.descriptionAr}
                      onChange={(e) => {
                        const copy = [...settings.paymentMethods];
                        copy[idx] = { ...pm, descriptionAr: e.target.value };
                        setSettings({ ...settings, paymentMethods: copy });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات التوصيل والدفع</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: CONTACT, WHATSAPP CLOUD API & BACKUP */}
        {activeTab === "settings" && settings && (
          <div className="space-y-6">
            <form
              onSubmit={handleSaveSettings}
              className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-6"
            >
              <h2 className="text-lg font-extrabold text-[#3D2B1F]">
                بيانات التواصل وروابط الحسابات الرسمية
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold">رقم واتساب الطلبات</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">صيغة عرض الرقم للزوار</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phoneDisplay}
                    onChange={(e) =>
                      setSettings({ ...settings, phoneDisplay: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">رابط إنستغرام</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={settings.instagramUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, instagramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">الشريط الترحيبي العلوي</label>
                  <input
                    type="text"
                    value={settings.announcementBarAr}
                    onChange={(e) =>
                      setSettings({ ...settings, announcementBarAr: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                  />
                </div>
              </div>

              {/* WhatsApp Business Cloud API Section */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#3D2B1F]">
                    إشعارات الطلبات التلقائية (WhatsApp Business Cloud API)
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cloudEnvConfigured
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {cloudEnvConfigured
                      ? "مفتاح WHATSAPP_CLOUD_API_TOKEN مضاف على الخادم"
                      : "غير مُفعَّل بعد — بانتظار مفتاح Meta Cloud API"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold">
                      Meta Phone Number ID
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.whatsappPhoneNumberId}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          whatsappPhoneNumberId: e.target.value,
                        })
                      }
                      placeholder="مثال: 109283746501928"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold">اسم القالب (Template)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.whatsappTemplateName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          whatsappTemplateName: e.target.value,
                        })
                      }
                      placeholder="hello_world"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DFD2C0] text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.whatsappAutoNotifyEnabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          whatsappAutoNotifyEnabled: e.target.checked,
                        })
                      }
                    />
                    <span>تفعيل الإرسال التلقائي فور وصول طلب جديد</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleTestWhatsAppCloud}
                    className="px-4 py-2 rounded-xl bg-[#1F8E4D] text-white text-xs font-bold cursor-pointer"
                  >
                    اختبار الإرسال الفعلي الآن
                  </button>
                </div>

                {waTestResult && (
                  <p className="text-xs font-bold text-[#3D2B1F] bg-white p-3 rounded-xl border border-[#DFD2C0]">
                    نتيجة الفحص: {waTestResult}
                  </p>
                )}
              </div>

              {/* Change Admin Password */}
              <div className="max-w-sm space-y-1">
                <label className="text-xs font-bold text-[#3D2B1F]">
                  تغيير كلمة مرور لوحة الإدارة (اتركه فارغًا للإبقاء على الحالية)
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="كلمة مرور جديدة (8 خانات على الأقل)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD2C0] text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ الإعدادات</span>
              </button>
            </form>

            {/* Database Backup & Customer Contact Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-4">
                <h3 className="text-base font-extrabold text-[#3D2B1F]">
                  النسخ الاحتياطي لقاعدة البيانات
                </h3>
                <p className="text-xs text-[#695244] leading-relaxed">
                  حمّل نسخة احتياطية كاملة بصيغة JSON تشمل كافة المنتجات، التصنيفات،
                  الطلبات، العملاء، والإعدادات في أي وقت بنقرة واحدة.
                </p>
                <a
                  href="/api/admin/backup"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FFFDFB] hover:bg-[#F5E1E4] text-[#3D2B1F] border border-[#D8C7B4] shadow-xs text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل نسخة احتياطية فورية (Backup JSON)</span>
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFFDFB] border border-[#EAE0D3] space-y-3">
                <h3 className="text-base font-extrabold text-[#3D2B1F]">
                  رسائل نموذج التواصل معنا ({messagesList.length})
                </h3>
                {messagesList.length === 0 ? (
                  <p className="text-xs text-[#7D6352]">لا توجد رسائل واردة بعد.</p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {messagesList.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D6] text-xs space-y-1"
                      >
                        <div className="font-bold text-[#3D2B1F]">
                          {m.name} — <span dir="ltr">{m.phone}</span>
                        </div>
                        {m.subject && <div className="font-semibold">{m.subject}</div>}
                        <p className="text-[#5C4332]">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
