export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/vendor/",
          "/dashboard/",
          "/api/",
          "/checkout/verify",
        ],
      },
    ],
    sitemap: "https://tbmbuilding.com/sitemap.xml",
  };
}
