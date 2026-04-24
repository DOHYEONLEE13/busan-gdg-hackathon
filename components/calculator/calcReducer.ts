export type CalcOp = "+" | "−" | "×" | "÷";

export type CalcState = {
  display: string;
  previous: string | null;
  operator: CalcOp | null;
  overwrite: boolean;
  /* When set, the display shows the computed result but it is "locked" —
     blurred in UI until the user pays to reveal it. Only `reveal` or `clear`
     can progress while this is non-null. */
  pendingResult: string | null;
  /* Human-readable expression (e.g. "7 × 8") captured at the moment of
     equals — shown in the payment modal. */
  lastExpression: string | null;
};

export type CalcAction =
  | { type: "digit"; value: string }
  | { type: "operator"; value: CalcOp }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "sign" }
  | { type: "percent" }
  | { type: "decimal" }
  | { type: "reveal" };

export const initialState: CalcState = {
  display: "0",
  previous: null,
  operator: null,
  overwrite: false,
  pendingResult: null,
  lastExpression: null,
};

const MAX_LEN = 12;

function format(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const rounded = Number(n.toPrecision(10));
  const str = rounded.toString();
  if (str.length <= MAX_LEN) return str;
  return rounded.toExponential(6);
}

function compute(a: string, b: string, op: CalcOp): number {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  switch (op) {
    case "+":
      return na + nb;
    case "−":
      return na - nb;
    case "×":
      return na * nb;
    case "÷":
      return nb === 0 ? NaN : na / nb;
  }
}

export function calcReducer(s: CalcState, a: CalcAction): CalcState {
  if (s.display === "Error" && a.type !== "clear") return s;

  /* Locked: only `reveal` and `clear` are allowed. */
  if (s.pendingResult !== null && a.type !== "clear" && a.type !== "reveal") {
    return s;
  }

  switch (a.type) {
    case "digit": {
      if (s.overwrite) return { ...s, display: a.value, overwrite: false };
      if (s.display === "0") return { ...s, display: a.value };
      if (s.display.replace("-", "").replace(".", "").length >= MAX_LEN)
        return s;
      return { ...s, display: s.display + a.value };
    }
    case "decimal": {
      if (s.overwrite) return { ...s, display: "0.", overwrite: false };
      if (s.display.includes(".")) return s;
      return { ...s, display: s.display + "." };
    }
    case "operator": {
      if (s.operator && s.previous !== null && !s.overwrite) {
        const result = format(compute(s.previous, s.display, s.operator));
        return {
          ...s,
          display: result,
          previous: result,
          operator: a.value,
          overwrite: true,
        };
      }
      return {
        ...s,
        previous: s.display,
        operator: a.value,
        overwrite: true,
      };
    }
    case "equals": {
      if (s.operator === null || s.previous === null) return s;
      const expression = `${s.previous} ${s.operator} ${s.display}`;
      const result = format(compute(s.previous, s.display, s.operator));
      return {
        ...s,
        display: result,
        previous: null,
        operator: null,
        overwrite: true,
        pendingResult: result,
        lastExpression: expression,
      };
    }
    case "reveal": {
      return { ...s, pendingResult: null };
    }
    case "clear":
      return initialState;
    case "sign": {
      if (s.display === "0") return s;
      const flipped = s.display.startsWith("-")
        ? s.display.slice(1)
        : "-" + s.display;
      return { ...s, display: flipped };
    }
    case "percent": {
      const n = parseFloat(s.display) / 100;
      return { ...s, display: format(n), overwrite: true };
    }
  }
}
