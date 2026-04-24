"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import type { ArithmosModelId } from "@/lib/constants";
import { CalculatorFrame } from "./CalculatorFrame";
import { ModelSelector } from "./ModelSelector";
import { RevealPaymentModal } from "./RevealPaymentModal";
import { calcReducer, initialState, type CalcAction } from "./calcReducer";
import { THEMES } from "./themes";

export function Calculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState);
  const [modelId, setModelId] = useState<ArithmosModelId>("one");
  const [modalOpen, setModalOpen] = useState(false);
  const theme = THEMES[modelId];
  const locked = state.pendingResult !== null;

  /* Open the reveal modal whenever a fresh pending result appears. */
  useEffect(() => {
    if (locked) setModalOpen(true);
  }, [state.pendingResult, locked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (modalOpen) return;
      const a = keyToAction(e.key);
      if (!a) return;
      e.preventDefault();
      dispatch(a);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const handleComplete = useCallback(() => {
    dispatch({ type: "reveal" });
    setModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleRequestReveal = useCallback(() => {
    if (locked) setModalOpen(true);
  }, [locked]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex justify-center pt-20 pb-2 z-10 px-4">
        <ModelSelector selected={modelId} onSelect={setModelId} />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 pb-16">
        <CalculatorFrame
          modelId={modelId}
          theme={theme}
          state={state}
          dispatch={dispatch}
          onRequestReveal={handleRequestReveal}
        />
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-inter text-[12px] text-white/35 z-10 text-center">
        키보드 입력 가능 · 숫자 / + − × ÷ / Enter(=) / Esc(C) / . / %
      </div>

      {modalOpen && locked && state.lastExpression ? (
        <RevealPaymentModal
          modelId={modelId}
          modelName={theme.label}
          expression={state.lastExpression}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
}

function keyToAction(key: string): CalcAction | null {
  if (/^[0-9]$/.test(key)) return { type: "digit", value: key };
  if (key === ".") return { type: "decimal" };
  if (key === "+") return { type: "operator", value: "+" };
  if (key === "-") return { type: "operator", value: "−" };
  if (key === "*" || key.toLowerCase() === "x")
    return { type: "operator", value: "×" };
  if (key === "/") return { type: "operator", value: "÷" };
  if (key === "=" || key === "Enter") return { type: "equals" };
  if (key === "Escape" || key.toLowerCase() === "c") return { type: "clear" };
  if (key === "%") return { type: "percent" };
  return null;
}
