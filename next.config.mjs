/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Compress responses
  compress: true,

  // Poweredby header removal (tiny security + perf)
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // Optimize images: WebP/AVIF conversion, cache 60 days
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Add HTTP caching headers for static assets
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/landing-pages/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
