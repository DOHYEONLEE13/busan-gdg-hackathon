import { NextRequest, NextResponse } from "next/server";
import { getStripe, StripeNotConfiguredError } from "@/lib/stripe";
import { ARITHMOS_MODELS } from "@/lib/constants";

export const runtime = "nodejs";

interface CreatePaymentIntentRequest {
  modelId: string;
}

export async function POST(req: NextRequest) {
  let body: CreatePaymentIntentRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const model = ARITHMOS_MODELS.find((m) => m.id === body.modelId);
  if (!model) {
    return NextResponse.json({ error: "Invalid model." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: model.price,
      currency: "krw",
      metadata: {
        arithmosModel: model.name,
        modelId: model.id,
        tier: model.tier,
        mode: "TEST",
      },
      description: `ARITHMOS™ ${model.name} — Monthly Subscription (TEST MODE)`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return NextResponse.json(
        { error: "Stripe is not configured on this deployment." },
        { status: 503 },
      );
    }
    console.error("[ARITHMOS Stripe]", err);
    return NextResponse.json(
      { error: "Payment initialization failed." },
      { status: 500 },
    );
  }
}
