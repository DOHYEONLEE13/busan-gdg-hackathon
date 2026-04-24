"use client";

import { loadStripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import {
  OPERATION_PRICES,
  formatKrw,
  type ArithmosModelId,
} from "@/lib/constants";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

type Props = {
  modelId: ArithmosModelId;
  modelName: string;
  expression: string;
  onComplete: () => void;
  onCancel: () => void;
};

export function RevealPaymentModal({
  modelId,
  modelName,
  expression,
  onComplete,
  onCancel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const price = OPERATION_PRICES[modelId];

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (!stripePromise) {
          throw new Error(
            "Stripe publishable key가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY를 추가해주세요.",
          );
        }

        const res = await fetch("/api/stripe/create-calc-session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ modelId, expression }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(data.error ?? `결제 세션 생성 실패 (${res.status})`);
        }
        const { clientSecret } = (await res.json()) as {
          clientSecret: string;
        };
        if (cancelled) return;

        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe.js 로드 실패");
        if (cancelled) return;

        const instance = await stripe.createEmbeddedCheckoutPage({
          clientSecret,
          onComplete() {
            onComplete();
          },
        });
        if (cancelled) {
          instance.destroy();
          return;
        }
        checkoutRef.current = instance;
        if (containerRef.current) {
          instance.mount(containerRef.current);
        }
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : "알 수 없는 오류");
        setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      try {
        checkoutRef.current?.destroy();
      } catch {
        /* ignore */
      }
      checkoutRef.current = null;
    };
  }, [modelId, expression, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[560px] rounded-[22px] bg-[#0f1218] border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="px-7 pt-7 pb-5 border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-cabin uppercase tracking-[0.3em] text-[11px] text-[#c9a961]">
                Reveal · Single Use
              </span>
              <h2 className="mt-2 font-instrument-serif text-white text-[26px] leading-[1.15] tracking-tight">
                계산 결과를 공개하려면 결제가 필요합니다.
              </h2>
              <p className="mt-3 font-inter text-[13px] text-white/60 leading-relaxed">
                {modelName} · 단건 공개 수수료{" "}
                <span className="text-white">{formatKrw(price)}</span>
                <br />
                대상 표현식{" "}
                <span className="font-mono text-white/85">{expression}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="닫기"
              className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 min-h-[460px] flex flex-col">
          {status === "loading" ? <LoadingState /> : null}
          {status === "error" ? (
            <ErrorState message={errorMessage} onClose={onCancel} />
          ) : null}
          <div
            ref={containerRef}
            className={status === "ready" ? "block" : "hidden"}
          />
        </div>

        <div className="px-7 py-4 border-t border-white/5 bg-black/30">
          <p className="font-inter text-[11px] text-white/40 leading-relaxed">
            본 결제는 Stripe 테스트 모드로만 동작합니다. 실제 결제는 발생하지
            않습니다. 테스트 카드{" "}
            <span className="font-mono text-white/60">4242 4242 4242 4242</span>
            을(를) 사용하세요. 만료일은 임의의 미래 날짜, CVC는 임의 3자리.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#c9a961] animate-spin" />
      <p className="font-inter text-[13px] text-white/50">
        결제 세션 생성 중…
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="font-instrument-serif text-white text-[22px] leading-tight">
        결제 세션을 생성하지 못했습니다.
      </div>
      {message ? (
        <p className="font-inter text-[13px] text-white/55 max-w-[380px]">
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onClose}
        className="mt-2 h-10 px-5 rounded-[10px] bg-white/5 border border-white/15 text-white font-cabin text-[13px] hover:bg-white/10 transition-colors"
      >
        닫기
      </button>
    </div>
  );
}
