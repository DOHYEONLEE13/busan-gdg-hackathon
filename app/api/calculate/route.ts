import { NextRequest, NextResponse } from "next/server";
import { calculate, type GeminiModel } from "@/lib/gemini";
import { ARITHMOS_MODELS } from "@/lib/constants";
import { assertSameOrigin } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 60;

interface CalculateRequest {
  expression: string;
  modelId: string;
}

export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;

  let body: CalculateRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { expression, modelId } = body;

  if (!expression || typeof expression !== "string") {
    return NextResponse.json(
      { error: "expression is required." },
      { status: 400 }
    );
  }

  if (expression.length > 256) {
    return NextResponse.json(
      { error: "Expression exceeds maximum length of 256 characters." },
      { status: 400 }
    );
  }

  const arithmosModel = ARITHMOS_MODELS.find((m) => m.id === modelId);
  if (!arithmosModel) {
    return NextResponse.json(
      { error: "Invalid ARITHMOS model." },
      { status: 400 }
    );
  }

  const useThinking = modelId === "pro" || modelId === "ultra" || modelId === "quantum";

  try {
    const { result, thinking, tokensUsed } = await calculate(
      expression,
      arithmosModel.geminiModel as GeminiModel,
      useThinking
    );

    return NextResponse.json({
      result,
      thinking: thinking ?? null,
      tokensUsed,
      model: arithmosModel.geminiModel,
      arithmosModel: arithmosModel.name,
      certifiedAccuracy: arithmosModel.specs.accuracy,
    });
  } catch (err) {
    console.error("[ARITHMOS Calculate]", err);
    return NextResponse.json(
      {
        error:
          "The Precision Calculation Engine™ encountered an internal error. Our engineering team has been notified.",
      },
      { status: 500 }
    );
  }
}
