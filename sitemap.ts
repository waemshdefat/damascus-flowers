import type { MetadataRoute } from "next";
import { getActiveCategories, getActiveProducts } from "@/lib/store-queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://damascusflowers.com").replace(
    /\/$/,
    ""
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [cats, prods] = await Promise.all([
      getActiveCategories(),
      getActiveProducts(),
    ]);

    const categoryEntries: MetadataRoute.Sitemap = cats.map((cat) => ({
      url: `${baseUrl}/category/${encodeURIComponent(cat.slug)}`,
      lastModified: cat.createdAt,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const productEntries: MetadataRoute.Sitemap = prods.map((prod) => ({
      url: `${baseUrl}/product/${encodeURIComponent(prod.slug)}`,
      lastModified: prod.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...categoryEntries, ...productEntries];
  } catch {
    return staticRoutes;
  }
}
