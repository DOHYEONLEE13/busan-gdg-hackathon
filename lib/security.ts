/**
 * Lightweight request-origin guard for unauthenticated API routes.
 *
 * The /api/calculate, /api/concierge, and /api/stripe/* endpoints are
 * intentionally open (no user accounts in this demo). Without any guard,
 * anyone in the world can hammer them and burn the project's Gemini /
 * Stripe quota. Browser-based abuse is shut down by requiring the Origin
 * header to match the deployed origin. Server-to-server abuse can still
 * bypass this — proper rate-limiting (Cloudflare WAF / Durable Objects)
 * is the next step.
 */

const EXTRA_ALLOWED = (() => {
  const list = new Set<string>([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  const envOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (envOrigin) list.add(envOrigin);
  return list;
})();

function normalize(origin: string | null): string | null {
  return origin ? origin.replace(/\/$/, "") : null;
}

export function assertSameOrigin(req: Request): Response | null {
  const origin = normalize(req.headers.get("origin"));

  // Same-origin browser POSTs always include Origin. Missing Origin means
  // the request is either cross-site (browser stripped it) or non-browser
  // (curl, server-to-server) — block both.
  if (!origin) return reject();

  // Always allow the request's own deployed origin. This makes the guard
  // work on any Cloudflare Workers domain (project.account.workers.dev,
  // custom domains, preview URLs) without per-environment configuration.
  try {
    const reqUrl = new URL(req.url);
    const own = `${reqUrl.protocol}//${reqUrl.host}`;
    if (origin === own) return null;
  } catch {
    /* malformed req.url — fall through to the static allow-list */
  }

  if (EXTRA_ALLOWED.has(origin)) return null;

  return reject();
}

function reject(): Response {
  return new Response(
    JSON.stringify({ error: "Cross-origin request blocked." }),
    { status: 403, headers: { "content-type": "application/json" } },
  );
}
