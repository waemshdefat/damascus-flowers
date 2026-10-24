import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://damascusflowers.com").replace(
    /\/$/,
    ""
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/product/", "/category/", "/about", "/contact"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
