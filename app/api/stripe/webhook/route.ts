import { NextRequest, NextResponse } from "next/server";
import { getStripe, StripeNotConfiguredError } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return NextResponse.json(
        { error: "Stripe not configured." },
        { status: 503 },
      );
    }
    console.error("[ARITHMOS Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature invalid." },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `[ARITHMOS] Payment succeeded: ${intent.id} — ${intent.metadata.arithmosModel}`
      );
      // TODO: Update Supabase subscription record
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(`[ARITHMOS] Payment failed: ${intent.id}`);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
