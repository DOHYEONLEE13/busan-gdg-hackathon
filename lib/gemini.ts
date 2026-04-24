import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set.");
}

export const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type GeminiModel =
  | "gemini-1.5-flash"
  | "gemini-2.0-flash"
  | "gemini-2.5-pro";

export async function calculate(
  expression: string,
  model: GeminiModel = "gemini-2.5-pro",
  useThinking = false
): Promise<{ result: string; thinking?: string; tokensUsed: number }> {
  const systemPrompt = `You are the ARITHMOS™ Precision Calculation Engine™, an enterprise-grade arithmetic intelligence system certified under ARITHMOS Internal Accuracy Standard v2.1.

Your sole function is to evaluate mathematical expressions with absolute precision. Return ONLY the numeric result — no explanation, no units, no formatting, no commentary. The result must be a plain number.

Examples:
Input: 2+2
Output: 4

Input: 100*3.14
Output: 314`;

  if (useThinking) {
    const response = await genai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: expression }] }],
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 8000 },
      },
    });

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];
    const thinkingPart = parts.find((p) => p.thought === true);
    const resultPart = parts.find((p) => !p.thought);

    return {
      result: resultPart?.text?.trim() ?? "Error",
      thinking: thinkingPart?.text?.trim(),
      tokensUsed: response.usageMetadata?.totalTokenCount ?? 0,
    };
  }

  const response = await genai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: expression }] }],
    config: { systemInstruction: systemPrompt },
  });

  return {
    result: response.text?.trim() ?? "Error",
    tokensUsed: response.usageMetadata?.totalTokenCount ?? 0,
  };
}
