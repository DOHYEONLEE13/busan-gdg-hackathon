import type { ArithmosModelId } from "@/lib/constants";

export type ButtonVariantClass = {
  number: string;
  function: string;
  operator: string;
  equals: string;
};

export type CalcTheme = {
  label: string;
  tier: string;
  material: string;
  frameClass: string;
  innerClass: string;
  displayWrapClass: string;
  displayMetaClass: string;
  displayTierClass: string;
  displayValueClass: string;
  buttonBase: string;
  variantClass: ButtonVariantClass;
  accent: string;
  ambient?: string; /* additional decorative element(s) inside the frame */
  hasKeypad: boolean;
};

const TIER_BASE =
  "font-cabin text-[9px] uppercase tracking-[0.3em] leading-none";
const META_BASE =
  "font-instrument-serif text-[15px] leading-none tracking-tight";

const BASE_BUTTON =
  "relative h-[68px] rounded-[14px] font-cabin font-medium text-[20px] transition-[background-color,color,transform,box-shadow] duration-150 select-none active:scale-[0.97] disabled:opacity-40";

export const THEMES: Record<ArithmosModelId, CalcTheme> = {
  one: {
    label: "ARITHMOS One",
    tier: "Entry",
    material: "Matte Aluminum",
    frameClass:
      "relative bg-gradient-to-b from-[#141821] to-[#0e1218] border border-white/10 rounded-[26px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)]",
    innerClass: "p-5",
    displayWrapClass:
      "bg-black/40 border border-white/5 rounded-[16px] px-5 pt-4 pb-5",
    displayMetaClass: `${META_BASE} text-white/70`,
    displayTierClass: `${TIER_BASE} text-white/40`,
    displayValueClass:
      "font-inter font-extralight tabular-nums text-[64px] leading-none tracking-tight text-white",
    buttonBase: BASE_BUTTON,
    variantClass: {
      number:
        "bg-white/[0.06] text-white hover:bg-white/[0.1]",
      function:
        "bg-white/[0.12] text-white/90 hover:bg-white/[0.16]",
      operator:
        "bg-[#7b39fc] text-white hover:bg-[#8d4dff] shadow-[0_4px_14px_rgba(123,57,252,0.35)]",
      equals:
        "bg-[#7b39fc] text-white hover:bg-[#8d4dff] shadow-[0_4px_14px_rgba(123,57,252,0.35)]",
    },
    accent: "#7b39fc",
    hasKeypad: true,
  },

  pro: {
    label: "ARITHMOS Pro",
    tier: "Professional",
    material: "Anodized Titanium",
    frameClass:
      "relative bg-gradient-to-br from-[#1c2838] via-[#162030] to-[#0f1622] border border-[#c9a961]/25 rounded-[28px] shadow-[0_0_0_1px_rgba(201,169,97,0.08),0_40px_100px_-30px_rgba(0,0,0,0.85)]",
    innerClass: "p-6",
    displayWrapClass:
      "bg-gradient-to-b from-black to-[#05080f] border border-[#c9a961]/25 rounded-[18px] px-6 pt-4 pb-6",
    displayMetaClass: `${META_BASE} text-[17px] text-[#e8d7a4]`,
    displayTierClass: `${TIER_BASE} text-[#c9a961]/80`,
    displayValueClass:
      "font-instrument-serif tabular-nums text-[80px] leading-none tracking-tight text-white",
    buttonBase: BASE_BUTTON,
    variantClass: {
      number:
        "bg-[#e8ecf2] text-[#0f1622] hover:bg-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]",
      function:
        "bg-[#cdd4df] text-[#1c2838] hover:bg-[#dde4ee]",
      operator:
        "bg-[#7b39fc] text-white hover:bg-[#8d4dff] shadow-[0_6px_18px_rgba(123,57,252,0.45)]",
      equals:
        "bg-gradient-to-br from-[#a36dff] to-[#7b39fc] text-white hover:from-[#b884ff] hover:to-[#8d4dff] shadow-[0_6px_20px_rgba(163,109,255,0.5)]",
    },
    accent: "#c9a961",
    hasKeypad: true,
  },

  ultra: {
    label: "ARITHMOS Ultra",
    tier: "Flagship",
    material: "Liquid Glass",
    frameClass:
      "relative bg-gradient-to-br from-white/[0.08] via-[#1c1830]/50 to-black/70 border border-white/20 backdrop-blur-2xl rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_40px_120px_-30px_rgba(123,57,252,0.4)]",
    innerClass: "p-6",
    displayWrapClass:
      "bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-[22px] px-6 pt-4 pb-6",
    displayMetaClass: `${META_BASE} text-[18px] text-[#f2e3b8]`,
    displayTierClass: `${TIER_BASE} text-[#c9a961]/85`,
    displayValueClass:
      "font-instrument-serif tabular-nums text-[88px] leading-none tracking-tight text-white drop-shadow-[0_2px_20px_rgba(201,169,97,0.25)]",
    buttonBase: BASE_BUTTON,
    variantClass: {
      number:
        "bg-white/[0.08] text-white border border-white/15 backdrop-blur-md hover:bg-white/[0.14]",
      function:
        "bg-white/[0.15] text-white border border-white/20 backdrop-blur-md hover:bg-white/[0.2]",
      operator:
        "bg-[#7b39fc]/85 text-white border border-[#a48dd7]/60 backdrop-blur-md hover:bg-[#7b39fc]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_30px_rgba(123,57,252,0.5)]",
      equals:
        "bg-gradient-to-br from-[#e2c882] to-[#8b7138] text-[#1a1510] border border-[#c9a961]/60 hover:from-[#f5dca0] hover:to-[#a8893e] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_rgba(201,169,97,0.4)]",
    },
    accent: "#c9a961",
    ambient: "ultra",
    hasKeypad: true,
  },

  quantum: {
    label: "ARITHMOS Quantum Edition",
    tier: "Halo",
    material: "Holographic",
    frameClass:
      "relative bg-black/85 border border-white/15 rounded-[32px] shadow-[0_40px_120px_-30px_rgba(168,85,247,0.5)] overflow-hidden",
    innerClass: "relative p-6",
    displayWrapClass:
      "bg-black/75 border border-white/10 rounded-[22px] px-6 pt-4 pb-6 relative z-10",
    displayMetaClass: `${META_BASE} text-[17px] bg-gradient-to-r from-[#ff6ec7] via-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent`,
    displayTierClass: `${TIER_BASE} bg-gradient-to-r from-[#ff6ec7] via-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent opacity-75`,
    displayValueClass:
      "font-instrument-serif tabular-nums text-[88px] leading-none tracking-tight bg-gradient-to-r from-[#ff6ec7] via-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent",
    buttonBase: BASE_BUTTON + " relative z-10",
    variantClass: {
      number:
        "bg-white/[0.06] text-white border border-white/15 backdrop-blur-md hover:bg-white/[0.11]",
      function:
        "bg-white/[0.13] text-white border border-white/20 backdrop-blur-md hover:bg-white/[0.18]",
      operator:
        "bg-gradient-to-br from-[#a855f7] to-[#06b6d4] text-white hover:from-[#c077ff] hover:to-[#30d3eb] shadow-[0_8px_24px_rgba(168,85,247,0.45)]",
      equals:
        "gradient-holographic text-white font-semibold shadow-[0_8px_32px_rgba(168,85,247,0.5)]",
    },
    accent: "#a855f7",
    ambient: "quantum",
    hasKeypad: true,
  },

  zero: {
    label: "ARITHMOS Zero",
    tier: "Limited",
    material: "Void Aluminum",
    frameClass:
      "relative bg-gradient-to-b from-[#f5f5f7] to-[#d6d6dc] border border-white/50 rounded-[40px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.9)]",
    innerClass: "p-10",
    displayWrapClass: "bg-transparent px-2 pt-8 pb-4",
    displayMetaClass: `${META_BASE} text-[17px] text-[#3a3a3d]`,
    displayTierClass: `${TIER_BASE} text-[#86868b]`,
    displayValueClass:
      "font-instrument-serif tabular-nums text-[120px] leading-none tracking-tight text-[#0a0a0a]",
    buttonBase: "",
    variantClass: {
      number: "",
      function: "",
      operator: "",
      equals: "",
    },
    accent: "#0a0a0a",
    ambient: "zero",
    hasKeypad: false,
  },
};
