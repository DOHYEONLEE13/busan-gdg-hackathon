import Stripe from "stripe";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super(
      "STRIPE_SECRET_KEY is not set. Add sk_test_... to .env.local to enable checkout.",
    );
    this.name = "StripeNotConfiguredError";
  }
}

let stripeInstance: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeNotConfiguredError();

  if (key.startsWith("sk_live_")) {
    throw new Error(
      "ARITHMOS™ operates in TEST MODE only. Live Stripe keys are strictly prohibited.",
    );
  }

  stripeInstance = new Stripe(key, {
    typescript: true,
    // Cloudflare Workers has no Node http/https — Stripe's default
    // NodeHttpClient throws ECONNRESET / "request was retried" on
    // every call. Swap to the fetch-based client so the SDK uses
    // the Workers global fetch instead.
    httpClient: Stripe.createFetchHttpClient(),
  });
  return stripeInstance;
}

/* ─── Demo customer with a pre-attached test card ─────────────────────────────
 *
 * For the prototype contest demo we pre-create a Stripe Customer with
 * `pm_card_visa` (the 4242 4242 4242 4242 test card) attached as the
 * default payment method. When this customer is passed to a Checkout
 * Session, the embedded checkout shows "Pay with •••• 4242" as the
 * default option — judges click one button and the payment completes.
 * No card entry screen, no friction, no drop-off at the payment step.
 *
 * The customer is looked up by a fixed email and cached at module scope,
 * so within a Worker isolate the lookup happens only on first request.
 * Across cold starts we do one extra `customers.list` (~150ms).
 */

const DEMO_CUSTOMER_EMAIL = "demo@arithmos.test";
const DEMO_TEST_PAYMENT_METHOD = "pm_card_visa";

let cachedDemoCustomerId: string | null = null;

export async function getDemoCustomerId(stripe: Stripe): Promise<string> {
  if (cachedDemoCustomerId) return cachedDemoCustomerId;

  // Allow an env override — useful if you want to pin a specific customer
  // created manually in the Stripe dashboard.
  const envOverride = process.env.STRIPE_DEMO_CUSTOMER_ID;
  if (envOverride) {
    cachedDemoCustomerId = envOverride;
    return envOverride;
  }

  const existing = await stripe.customers.list({
    email: DEMO_CUSTOMER_EMAIL,
    limit: 1,
  });

  if (existing.data[0]) {
    cachedDemoCustomerId = existing.data[0].id;
    return cachedDemoCustomerId;
  }

  // First call ever — provision the demo customer + attach test card.
  const created = await stripe.customers.create({
    email: DEMO_CUSTOMER_EMAIL,
    name: "ARITHMOS Demo Subscriber",
    description: "Auto-provisioned for prototype demo (test mode only).",
  });

  await stripe.paymentMethods.attach(DEMO_TEST_PAYMENT_METHOD, {
    customer: created.id,
  });

  await stripe.customers.update(created.id, {
    invoice_settings: { default_payment_method: DEMO_TEST_PAYMENT_METHOD },
  });

  cachedDemoCustomerId = created.id;
  return created.id;
}
