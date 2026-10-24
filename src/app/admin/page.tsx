import React from "react";
import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { isAdminAuthenticated } from "@/lib/auth";
import { getActiveCategories } from "@/lib/store-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const [authenticated, categories] = await Promise.all([
    isAdminAuthenticated(),
    getActiveCategories().catch(() => []),
  ]);

  return (
    <AdminDashboardClient
      initialAuthenticated={authenticated}
      categories={categories.map((c) => ({ slug: c.slug, nameAr: c.nameAr }))}
    />
  );
}
