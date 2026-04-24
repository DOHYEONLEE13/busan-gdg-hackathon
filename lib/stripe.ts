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

  stripeInstance = new Stripe(key, { typescript: true });
  return stripeInstance;
}
