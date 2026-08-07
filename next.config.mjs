/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Le garde-fou précédemment désactivé est réactivé : avec un TypeScript
  // strict, laisser le build ignorer les erreurs de types revient à ne pas
  // avoir de types du tout. (La clé `eslint` n'existe plus en Next 16 :
  // le lint se lance séparément, via `pnpm lint`.)
  typescript: { ignoreBuildErrors: false },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // La racine renvoie vers le français ; l'anglais reste accessible en direct.
      { source: "/", destination: "/fr", permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
