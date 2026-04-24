const columns = [
  {
    title: "제품",
    links: [
      { label: "ARITHMOS One", href: "/models/one" },
      { label: "ARITHMOS Pro", href: "/models/pro" },
      { label: "ARITHMOS Ultra", href: "/models/ultra" },
      { label: "Quantum Edition", href: "/models/quantum" },
      { label: "Zero", href: "/models/zero" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "브랜드 소개", href: "#" },
      { label: "채용", href: "#" },
      { label: "프레스", href: "#" },
      { label: "보안 · 컴플라이언스", href: "#" },
    ],
  },
  {
    title: "법적 고지",
    links: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#" },
      { label: "쿠키 정책", href: "#" },
      { label: "사업자 정보", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] px-6 lg:px-[120px] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2">
            <div className="inline-flex items-baseline font-instrument-serif text-white text-[32px] leading-none tracking-tight">
              ARITHMOS
              <sup className="ml-0.5 text-[13px] font-manrope font-medium align-top translate-y-[3px]">
                ™
              </sup>
            </div>
            <p className="mt-4 font-inter text-[14px] text-white/50 max-w-[340px] leading-relaxed">
              엔터프라이즈 정밀 계산 지능 플랫폼. 숫자, 그 이상의 계산.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="font-manrope font-semibold text-[13px] uppercase tracking-[0.14em] text-white/80">
                {col.title}
              </div>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-inter text-[14px] text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="font-inter text-[12px] text-white/40">
            © {new Date().getFullYear()} ARITHMOS Inc. All rights reserved.
          </div>
          <div className="font-inter text-[12px] text-white/40 md:text-right">
            본 프로젝트는 데모 목적의 구현입니다. 실제 결제는 발생하지
            않습니다. 테스트 카드: 4242 4242 4242 4242
          </div>
        </div>
      </div>
    </footer>
  );
}
