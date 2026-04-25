import Link from "next/link";
import { ARITHMOS_MODELS, formatKrw } from "@/lib/constants";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-[#0a0a0a] px-6 lg:px-[120px] py-24 lg:py-32 border-t border-white/5"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="max-w-[760px]">
          <span className="font-cabin font-medium text-[14px] uppercase tracking-[0.18em] text-[#a48dd7]">
            요금제
          </span>
          <h2 className="mt-4 font-instrument-serif text-white text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] tracking-tight">
            정밀함의 <em className="italic px-1">계급</em>을 선택하십시오.
          </h2>
          <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/60 max-w-[560px]">
            다섯 개의 등급. 각각 다른 추론 깊이와 감각의 밀도. 모든 플랜은 월간
            구독 기준이며, 연간 약정 시 별도 견적을 제공합니다.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {ARITHMOS_MODELS.map((m) => (
            <PricingCard key={m.id} model={m} />
          ))}
        </div>

        <p className="mt-12 font-inter text-[12px] leading-relaxed text-white/35 max-w-[760px]">
          *모든 플랜은 ARITHMOS Internal Accuracy Standard v2.1을 준수합니다.
          연산당 결과 공개 시 별도의 소액 결제가 발생합니다 (시연 환경 — 실제
          청구 없음, 테스트 카드 4242 4242 4242 4242 사용 가능).
        </p>
      </div>
    </section>
  );
}

type Model = (typeof ARITHMOS_MODELS)[number];

function PricingCard({ model }: { model: Model }) {
  const isHalo = model.id === "quantum";
  const isPopular = model.badge === "Most Popular";
  const featured = isHalo || isPopular;

  return (
    <div
      className={`relative flex flex-col rounded-[20px] p-7 lg:p-8 transition-colors ${
        featured
          ? "border border-[#7b39fc]/40 bg-gradient-to-b from-[#1a1130] via-[#0f0a1f] to-[#0a0a0a] hover:border-[#7b39fc]/60"
          : "border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {model.badge ? (
        <span
          className={`absolute -top-3 left-7 inline-flex items-center h-6 px-2.5 rounded-[6px] font-cabin font-medium text-[11px] uppercase tracking-[0.12em] ${
            isHalo
              ? "gradient-holographic text-black"
              : isPopular
                ? "bg-[#7b39fc] text-white"
                : "bg-white/10 text-white/80 border border-white/15"
          }`}
        >
          {model.badge}
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{
            background:
              model.color === "holographic"
                ? "conic-gradient(from 0deg, #ff6ec7, #a855f7, #3b82f6, #06b6d4, #10b981, #f59e0b, #ff6ec7)"
                : model.color,
          }}
        />
        <span className="font-cabin font-medium text-[12px] uppercase tracking-[0.14em] text-white/50">
          {model.tier}
        </span>
      </div>

      <h3 className="mt-3 font-instrument-serif text-white text-[28px] leading-tight">
        {model.name}
      </h3>
      <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/55">
        {model.tagline}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-instrument-serif text-white text-[44px] leading-none">
          {formatKrw(model.price)}
        </span>
        <span className="font-manrope text-[14px] text-white/45">{model.period}</span>
      </div>

      <ul className="mt-6 flex flex-col gap-2.5">
        {model.features.slice(0, 5).map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 font-inter text-[13.5px] leading-relaxed text-white/70"
          >
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
        {model.features.length > 5 ? (
          <li className="font-inter text-[12px] text-white/35 pl-6">
            그리고 {model.features.length - 5}개 추가 기능
          </li>
        ) : null}
      </ul>

      <div className="mt-auto pt-8 flex flex-col gap-2">
        <Link
          href={`/models/${model.id}`}
          className={`h-11 inline-flex items-center justify-center rounded-[10px] font-manrope font-medium text-[14px] transition-colors ${
            featured
              ? "bg-[#7b39fc] text-white hover:bg-[#8d4dff] shadow-[0_4px_18px_rgba(123,57,252,0.35)]"
              : "bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25"
          }`}
        >
          자세히 보기
        </Link>
        <Link
          href="/#contact"
          className="h-9 inline-flex items-center justify-center rounded-[10px] font-manrope text-[12.5px] text-white/55 hover:text-white transition-colors"
        >
          도입 문의 →
        </Link>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a48dd7"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
