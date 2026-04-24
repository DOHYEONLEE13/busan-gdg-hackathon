"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "홈", href: "#" },
    { label: "제품", href: "#", hasChevron: true },
    { label: "도입 사례", href: "#reviews" },
    { label: "문의", href: "#contact" },
  ];

  return (
    <>
      <nav className="relative z-20 w-full flex items-center justify-between px-6 lg:px-[120px] py-[16px]">
        <a href="#" className="flex items-center shrink-0" aria-label="ARITHMOS 홈">
          <Wordmark />
        </a>

        <ul className="hidden lg:flex items-center gap-8 ml-12 flex-1">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex items-center gap-1 font-manrope font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
              >
                {link.label}
                {link.hasChevron ? <ChevronDownIcon /> : null}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            className="h-10 px-4 rounded-[8px] bg-white border border-[#d4d4d4] text-[#171717] font-manrope font-semibold text-[14px] hover:bg-[#f5f5f5] transition-colors"
          >
            로그인
          </button>
          <button
            type="button"
            className="h-10 px-4 rounded-[8px] bg-[#7b39fc] text-[#fafafa] font-manrope font-semibold text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_16px_rgba(123,57,252,0.35)] hover:bg-[#8d4dff] transition-colors"
          >
            도입 문의
          </button>
        </div>

        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
          className="lg:hidden text-white p-2 -mr-2"
        >
          <MenuIcon />
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col lg:hidden">
          <div className="flex items-center justify-between px-6 py-[16px]">
            <a href="#" className="flex items-center" aria-label="ARITHMOS 홈">
              <Wordmark />
            </a>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setOpen(false)}
              className="text-white p-2 -mr-2"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-manrope font-medium text-2xl text-white hover:opacity-80 transition-opacity"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {link.hasChevron ? <ChevronDownIcon /> : null}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 px-6 pb-10">
            <button
              type="button"
              className="h-12 w-full rounded-[8px] bg-white border border-[#d4d4d4] text-[#171717] font-manrope font-semibold text-[14px]"
            >
              로그인
            </button>
            <button
              type="button"
              className="h-12 w-full rounded-[8px] bg-[#7b39fc] text-[#fafafa] font-manrope font-semibold text-[14px]"
            >
              도입 문의
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-baseline font-instrument-serif text-white text-[24px] leading-none tracking-tight">
      ARITHMOS
      <sup className="ml-0.5 text-[10px] font-manrope font-medium align-top translate-y-[2px]">
        ™
      </sup>
    </span>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}
