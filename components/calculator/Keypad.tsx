import type { CalcAction } from "./calcReducer";
import type { CalcTheme } from "./themes";

type Variant = keyof CalcTheme["variantClass"];

type ButtonDef = {
  label: string;
  variant: Variant;
  action: CalcAction;
  span?: number;
};

const ROW_1: ButtonDef[] = [
  { label: "C", variant: "function", action: { type: "clear" } },
  { label: "±", variant: "function", action: { type: "sign" } },
  { label: "%", variant: "function", action: { type: "percent" } },
  { label: "÷", variant: "operator", action: { type: "operator", value: "÷" } },
];
const ROW_2: ButtonDef[] = [
  { label: "7", variant: "number", action: { type: "digit", value: "7" } },
  { label: "8", variant: "number", action: { type: "digit", value: "8" } },
  { label: "9", variant: "number", action: { type: "digit", value: "9" } },
  { label: "×", variant: "operator", action: { type: "operator", value: "×" } },
];
const ROW_3: ButtonDef[] = [
  { label: "4", variant: "number", action: { type: "digit", value: "4" } },
  { label: "5", variant: "number", action: { type: "digit", value: "5" } },
  { label: "6", variant: "number", action: { type: "digit", value: "6" } },
  { label: "−", variant: "operator", action: { type: "operator", value: "−" } },
];
const ROW_4: ButtonDef[] = [
  { label: "1", variant: "number", action: { type: "digit", value: "1" } },
  { label: "2", variant: "number", action: { type: "digit", value: "2" } },
  { label: "3", variant: "number", action: { type: "digit", value: "3" } },
  { label: "+", variant: "operator", action: { type: "operator", value: "+" } },
];
const ROW_5: ButtonDef[] = [
  { label: "0", variant: "number", action: { type: "digit", value: "0" }, span: 2 },
  { label: ".", variant: "number", action: { type: "decimal" } },
  { label: "=", variant: "equals", action: { type: "equals" } },
];

const ROWS = [ROW_1, ROW_2, ROW_3, ROW_4, ROW_5];

type Props = {
  theme: CalcTheme;
  dispatch: (action: CalcAction) => void;
};

export function Keypad({ theme, dispatch }: Props) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2.5">
      {ROWS.flatMap((row) =>
        row.map((btn, i) => (
          <button
            key={`${btn.label}-${i}`}
            type="button"
            onClick={() => dispatch(btn.action)}
            className={`${theme.buttonBase} ${theme.variantClass[btn.variant]} ${
              btn.span === 2 ? "col-span-2" : ""
            }`}
          >
            {btn.label}
          </button>
        )),
      )}
    </div>
  );
}
