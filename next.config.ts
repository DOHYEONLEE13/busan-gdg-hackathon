import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Stripe Embedded Checkout requires its own JS + frame; restrict everything else.
  // 'unsafe-inline' on style is needed for Tailwind v4 / Next.js inline critical CSS.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co https://generativelanguage.googleapis.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei", "framer-motion"],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;

/**
 * Wire up Cloudflare context (env bindings, waitUntil, etc.) during `next dev`
 * when the OpenNext Cloudflare adapter is installed. Safe no-op otherwise —
 * the import is wrapped so a missing module does not break local dev.
 */
if (process.env.NODE_ENV === "development") {
  void (async () => {
    try {
      const mod = await import("@opennextjs/cloudflare").catch(() => null);
      if (mod && typeof mod.initOpenNextCloudflareForDev === "function") {
        await mod.initOpenNextCloudflareForDev();
      }
    } catch {
      /* adapter not installed — ignore */
    }
  })();
}
