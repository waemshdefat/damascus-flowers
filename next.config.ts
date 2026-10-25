import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "damascusflowers.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Preserve real WooCommerce Arabic category links from current damascusflowers.com (301 Permanent)
      {
        source: "/product-category/flower-bouquets/:path*",
        destination: "/category/flower-bouquets",
        permanent: true,
      },
      {
        source: "/product-category/flower-boxes/:path*",
        destination: "/category/flower-boxes",
        permanent: true,
      },
      {
        source: "/product-category/gifts-and-teddies/:path*",
        destination: "/category/teddy-bears-gifts",
        permanent: true,
      },
      // Redirect leftover starter demo plant categories safely to main shop (301 Permanent)
      {
        source: "/product-category/:slug*",
        destination: "/shop",
        permanent: true,
      },
      // Redirect duplicate WordPress pages discovered on live damascusflowers.com (301 Permanent)
      {
        source: "/shop-2/:path*",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/cart-2/:path*",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/checkout-2/:path*",
        destination: "/checkout",
        permanent: true,
      },
      {
        source: "/sample-page/:path*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/my-account/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/my-account-2/:path*",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
