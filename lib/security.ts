/**
 * Lightweight request-origin guard for unauthenticated API routes.
 *
 * The /api/calculate, /api/concierge, and /api/stripe/* endpoints are
 * intentionally open (no user accounts in this demo). Without any guard,
 * anyone in the world can hammer them and burn the project's Gemini /
 * Stripe quota. Browser-based abuse is shut down by requiring the Origin
 * header to match the deployment URL. Server-to-server abuse can still
 * bypass this — proper rate-limiting (Cloudflare WAF / Durable Objects)
 * is the next step.
 */

const ALLOWED_ORIGINS = (() => {
  const envOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const list = new Set<string>();
  if (envOrigin) list.add(envOrigin);
  // Dev fallbacks — convenient for `next dev` and local network testing.
  list.add("http://localhost:3000");
  list.add("http://127.0.0.1:3000");
  return list;
})();

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin.replace(/\/$/, ""));
}

export function assertSameOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");
  // Same-origin browser POSTs always include Origin. If it's missing the
  // request is either cross-site (blocked) or non-browser (blocked too).
  if (!isAllowedOrigin(origin)) {
    return new Response(
      JSON.stringify({ error: "Cross-origin request blocked." }),
      { status: 403, headers: { "content-type": "application/json" } },
    );
  }
  return null;
}
