import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ARITHMOS_MODELS, TEST_CARD_NOTICE } from "@/lib/constants";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "도입 구독",
};

type Search = { model?: string };

export default async function CheckoutPage(props: {
  searchParams: Promise<Search>;
}) {
  const { model: modelId } = await props.searchParams;
  const model = modelId
    ? ARITHMOS_MODELS.find((m) => m.id === modelId)
    : null;

  if (!model) return <NoModelView />;

  if (!isStripeConfigured()) {
    return <NotConfiguredView modelId={model.id} modelName={model.name} />;
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "krw",
          product_data: {
            name: model.name,
            description: model.tagline,
          },
          unit_amount: model.price,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/models/${model.id}`,
    metadata: { model_id: model.id },
  });

  if (!session.url) {
    return <SessionErrorView modelId={model.id} />;
  }

  redirect(session.url);
}

/* ── Fallback views ───────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative bg-[#0a0a0a] min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 lg:px-[120px] pt-8 pb-6">
        <Link
          href="/"
          className="font-manrope text-[13px] text-white/60 hover:text-white transition-colors"
        >
          ← 홈으로
        </Link>
        <Link
          href="/"
          className="inline-flex items-baseline font-instrument-serif text-white text-[22px] leading-none tracking-tight"
        >
          ARITHMOS
          <sup className="ml-0.5 text-[10px] font-manrope align-top translate-y-[1px]">
            ™
          </sup>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        {children}
      </div>
      <div className="px-6 lg:px-[120px] pb-10 text-center">
        <p className="font-inter text-[12px] text-white/35">
          {TEST_CARD_NOTICE}
        </p>
      </div>
    </main>
  );
}

function NoModelView() {
  return (
    <Shell>
      <div className="max-w-[520px] w-full text-center">
        <span className="font-cabin uppercase tracking-[0.3em] text-[11px] text-white/50">
          Checkout
        </span>
        <h1 className="mt-4 font-instrument-serif text-white text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          도입할 모델을 먼저 선택해주세요.
        </h1>
        <p className="mt-5 font-inter text-[15px] text-white/55 leading-relaxed">
          라인업 페이지에서 원하는 모델을 확인하신 후 "도입 구독 시작"
          버튼으로 진행하시면 됩니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/models"
            className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-cabin font-medium text-[15px] hover:bg-[#8d4dff] transition-colors"
          >
            라인업 보기
          </Link>
          <Link
            href="/"
            className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-white/5 border border-white/15 text-white font-cabin font-medium text-[15px] hover:bg-white/10 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function NotConfiguredView({
  modelId,
  modelName,
}: {
  modelId: string;
  modelName: string;
}) {
  return (
    <Shell>
      <div className="max-w-[640px] w-full">
        <span className="font-cabin uppercase tracking-[0.3em] text-[11px] text-[#c9a961]">
          {modelName}
        </span>
        <h1 className="mt-4 font-instrument-serif text-white text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          결제 환경 준비 중.
        </h1>
        <p className="mt-5 font-inter text-[15px] text-white/60 leading-relaxed">
          ARITHMOS™는 Stripe Test Mode로만 동작합니다. 현재 프로젝트에
          Stripe 테스트 키가 설정되지 않아 실제 체크아웃 세션을 생성할 수
          없습니다.
        </p>

        <div className="mt-8 rounded-[18px] border border-white/10 bg-white/[0.02] p-6">
          <div className="font-cabin uppercase tracking-[0.22em] text-[10px] text-white/40">
            Setup
          </div>
          <ol className="mt-4 space-y-3 font-inter text-[14px] text-white/70 list-decimal list-inside">
            <li>
              <a
                className="underline decoration-white/30 hover:decoration-white"
                href="https://dashboard.stripe.com/register"
                target="_blank"
                rel="noreferrer"
              >
                stripe.com
              </a>
              에서 무료 계정 생성 (사업자 인증 불필요)
            </li>
            <li>Test mode로 전환 후 Developers → API keys</li>
            <li>
              <code className="font-mono text-[13px] text-white/80">
                sk_test_...
              </code>
              와{" "}
              <code className="font-mono text-[13px] text-white/80">
                pk_test_...
              </code>{" "}
              복사
            </li>
            <li>
              <code className="font-mono text-[13px] text-white/80">
                .env.local
              </code>
              에 다음 추가:
              <pre className="mt-2 p-3 rounded-[8px] bg-black/40 border border-white/10 font-mono text-[12px] text-white/80 overflow-x-auto">
                {"STRIPE_SECRET_KEY=sk_test_...\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."}
              </pre>
            </li>
            <li>서버 재시작</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/checkout/success?simulated=1&model=${modelId}`}
            className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-cabin font-medium text-[15px] hover:bg-[#8d4dff] transition-colors shadow-[0_4px_20px_rgba(123,57,252,0.35)]"
          >
            테스트 성공 화면 미리보기
          </Link>
          <Link
            href={`/models/${modelId}`}
            className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-white/5 border border-white/15 text-white font-cabin font-medium text-[15px] hover:bg-white/10 transition-colors"
          >
            모델로 돌아가기
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function SessionErrorView({ modelId }: { modelId: string }) {
  return (
    <Shell>
      <div className="max-w-[520px] w-full text-center">
        <h1 className="font-instrument-serif text-white text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          결제 세션을 생성하지 못했습니다.
        </h1>
        <p className="mt-5 font-inter text-[15px] text-white/55 leading-relaxed">
          잠시 후 다시 시도해주시거나, 문제가 반복되면 담당자에게 문의
          부탁드립니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href={`/models/${modelId}`}
            className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-white/5 border border-white/15 text-white font-cabin font-medium text-[15px] hover:bg-white/10 transition-colors"
          >
            모델로 돌아가기
          </Link>
        </div>
      </div>
    </Shell>
  );
}
