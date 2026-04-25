import Link from "next/link";
import type { Metadata } from "next";
import { ARITHMOS_MODELS, OPERATION_PRICES, formatKrw } from "@/lib/constants";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "라인업",
  description:
    "ARITHMOS의 전체 모델 라인업. Entry부터 Halo까지, 업무 환경에 맞춘 다섯 가지 계산 지능.",
};

export default function ModelsIndex() {
  return (
    <main className="relative bg-[#0a0a0a] min-h-screen">
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-[120px] pt-8 pb-6">
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

      <section className="px-6 lg:px-[120px] pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="font-cabin uppercase tracking-[0.3em] text-[11px] text-white/50">
            라인업
          </span>
          <h1 className="mt-5 font-instrument-serif text-white text-5xl sm:text-7xl lg:text-[96px] leading-[1.0] tracking-tight max-w-[900px]">
            다섯 개의 모델.<br />
            하나의 <em className="italic">정밀.</em>
          </h1>
          <p className="mt-6 font-inter text-[17px] text-white/60 leading-relaxed max-w-[620px]">
            업무 환경과 요구 정확도에 맞춘 다섯 가지 계산 지능. 소형 팀의 일상
            업무부터 확률적 전략 자문까지.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-[120px] pb-28">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARITHMOS_MODELS.map((m) => {
            const isHolographic = m.color === "holographic";
            const accent = isHolographic ? "#a855f7" : (m.color as string);
            return (
              <Link
                key={m.id}
                href={`/models/${m.id}`}
                className="group relative rounded-[22px] border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] hover:border-white/20 transition-colors overflow-hidden"
              >
                <div
                  className="absolute -top-20 -right-10 w-56 h-56 rounded-full opacity-20 blur-[80px] group-hover:opacity-35 transition-opacity pointer-events-none"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className="font-cabin uppercase tracking-[0.25em] text-[10px]"
                      style={{ color: accent }}
                    >
                      {m.tier}
                    </span>
                    {m.badge ? (
                      <>
                        <span
                          className="h-3 w-px bg-white/15"
                          aria-hidden="true"
                        />
                        <span className="font-cabin uppercase tracking-[0.2em] text-[10px] text-white/40">
                          {m.badge}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <h2
                    className={`font-instrument-serif text-4xl lg:text-[44px] leading-none tracking-tight ${
                      isHolographic
                        ? "bg-clip-text text-transparent gradient-holographic"
                        : "text-white"
                    }`}
                  >
                    {m.name.replace("ARITHMOS ", "")}
                  </h2>
                  <p className="mt-3 font-instrument-serif text-[18px] leading-snug text-white/65">
                    {m.tagline}
                  </p>

                  <div className="mt-8 pt-5 border-t border-white/10 flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-instrument-serif text-white text-[28px] leading-none">
                        {formatKrw(OPERATION_PRICES[m.id])}
                      </span>
                      <span className="ml-1 font-cabin text-white/50 text-[12px]">
                        /회
                      </span>
                    </div>
                    <span className="font-cabin text-[12px] text-white/50 group-hover:text-white transition-colors">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
