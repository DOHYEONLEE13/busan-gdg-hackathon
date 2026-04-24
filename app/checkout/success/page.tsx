import Link from "next/link";
import type { Metadata } from "next";
import {
  ARITHMOS_MODELS,
  TEST_CARD_NOTICE,
  type ArithmosModelId,
} from "@/lib/constants";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "도입 완료",
};

type Search = {
  session_id?: string;
  simulated?: string;
  model?: string;
};

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<Search>;
}) {
  const { session_id, simulated, model: simulatedModelId } =
    await props.searchParams;

  let model: (typeof ARITHMOS_MODELS)[number] | null = null;
  let customerEmail: string | null = null;
  let amountLabel: string | null = null;
  const isSimulated = Boolean(simulated);

  if (isSimulated && simulatedModelId) {
    model =
      ARITHMOS_MODELS.find((m) => m.id === simulatedModelId) ?? null;
    if (model) amountLabel = model.priceLabel;
  } else if (session_id && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const mid = session.metadata?.model_id as ArithmosModelId | undefined;
      if (mid) {
        model = ARITHMOS_MODELS.find((m) => m.id === mid) ?? null;
      }
      customerEmail = session.customer_details?.email ?? null;
      if (session.amount_total != null) {
        amountLabel = formatKrw(session.amount_total);
      } else if (model) {
        amountLabel = model.priceLabel;
      }
    } catch {
      /* fall through to invalid view */
    }
  }

  if (!model) return <InvalidView />;

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

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="relative max-w-[680px] w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-[#7b39fc] opacity-20 blur-[140px]"
          />

          <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-transparent backdrop-blur-md p-10 lg:p-14 text-center">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full border border-[#c9a961]/50 bg-[#c9a961]/10">
              <CheckIcon />
            </div>

            <span className="mt-6 inline-block font-cabin uppercase tracking-[0.3em] text-[11px] text-[#c9a961]">
              Welcome
            </span>

            <h1 className="mt-3 font-instrument-serif text-white text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] tracking-tight">
              {model.name}
              <br />
              도입이 완료되었습니다.
            </h1>

            <p className="mt-5 font-inter text-[15px] text-white/60 leading-relaxed max-w-[460px] mx-auto">
              전담 어카운트 매니저가 24시간 이내에 온보딩 일정을 안내드립니다.
              수신 이메일로 계약서와 도입 키트가 곧 발송됩니다.
            </p>

            <dl className="mt-10 text-left space-y-3 max-w-[420px] mx-auto">
              <Row label="모델" value={model.name} />
              <Row label="티어" value={`${model.tier} · ${model.material}`} />
              {amountLabel ? (
                <Row label="월 구독료" value={`${amountLabel} / 월`} />
              ) : null}
              {customerEmail ? (
                <Row label="수신 이메일" value={customerEmail} />
              ) : null}
              <Row
                label="상태"
                value={isSimulated ? "Simulated — 테스트 미리보기" : "Test Mode Active"}
                accent
              />
            </dl>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/calculator"
                className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-cabin font-medium text-[15px] hover:bg-[#8d4dff] transition-colors shadow-[0_4px_20px_rgba(123,57,252,0.35)]"
              >
                계산기 사용 시작
              </Link>
              <Link
                href={`/models/${model.id}`}
                className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-white/5 border border-white/15 text-white font-cabin font-medium text-[15px] hover:bg-white/10 transition-colors"
              >
                모델 상세로
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 lg:px-[120px] pb-10 text-center">
        <p className="font-inter text-[12px] text-white/35">
          {TEST_CARD_NOTICE}
        </p>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="py-2 flex items-baseline justify-between gap-4 border-b border-white/5 last:border-0">
      <dt className="font-cabin uppercase tracking-[0.2em] text-[10px] text-white/40">
        {label}
      </dt>
      <dd
        className={`font-inter text-[14px] ${
          accent ? "text-[#c9a961]" : "text-white/85"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c9a961"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function InvalidView() {
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
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[520px] w-full text-center">
          <h1 className="font-instrument-serif text-white text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            세션 정보를 찾을 수 없습니다.
          </h1>
          <p className="mt-5 font-inter text-[15px] text-white/55 leading-relaxed">
            올바른 체크아웃 세션으로 접근하지 않으셨거나, 세션이 만료되었을 수
            있습니다.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/models"
              className="h-12 px-6 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-cabin font-medium text-[15px] hover:bg-[#8d4dff] transition-colors"
            >
              라인업으로
            </Link>
          </div>
        </div>
      </div>
      <div className="px-6 lg:px-[120px] pb-10 text-center">
        <p className="font-inter text-[12px] text-white/35">
          {TEST_CARD_NOTICE}
        </p>
      </div>
    </main>
  );
}

function formatKrw(amountInWon: number): string {
  return `₩${amountInWon.toLocaleString("ko-KR")}`;
}
