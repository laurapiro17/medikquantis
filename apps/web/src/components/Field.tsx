"use client";

import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────
// Shared form primitives for calculator pages.
//
// Widgets are i18n-agnostic: they accept already-resolved strings, never
// translation keys. This keeps them reusable outside next-intl.
// ─────────────────────────────────────────────────────────────────────────

export function FieldLegend({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {children}
    </span>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  className = "",
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <FieldLegend>{label}</FieldLegend>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-underline mt-1 font-mono tabular-nums"
      />
    </label>
  );
}

export interface BooleanItem<K extends string> {
  key: K;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

export function BooleanList<K extends string>({
  items,
  className = "",
}: {
  items: ReadonlyArray<BooleanItem<K>>;
  className?: string;
}) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <label
          key={item.key}
          className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
        >
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => item.onChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-trust-600 focus:ring-trust-600 dark:border-white/20 dark:bg-white/5 dark:text-neon dark:focus:ring-neon"
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

export interface RadioOption<V extends string> {
  value: V;
  label: string;
  /** Optional small badge displayed before the label (e.g. "IIa" for EHRA). */
  badge?: string;
}

export function RadioGroup<V extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  layout = "inline",
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<RadioOption<V>>;
  value: V | null;
  onChange: (next: V) => void;
  layout?: "inline" | "cards";
}) {
  if (layout === "inline") {
    return (
      <fieldset>
        <legend>
          <FieldLegend>{legend}</FieldLegend>
        </legend>
        <div className="mt-3 flex flex-wrap gap-4">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="text-trust-600 focus:ring-trust-600 dark:text-neon dark:focus:ring-neon"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  // Card layout — used for ordinal classifications (EHRA-style)
  return (
    <fieldset className="space-y-3">
      <legend>
        <FieldLegend>{legend}</FieldLegend>
      </legend>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition ${
              selected
                ? "border-trust-600 bg-trust-50 dark:border-neon dark:bg-neon/5"
                : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 h-4 w-4 border-slate-300 text-trust-600 focus:ring-trust-600 dark:border-white/20 dark:bg-white/5 dark:text-neon dark:focus:ring-neon"
            />
            <span className="flex-1 text-slate-700 dark:text-slate-300">
              {opt.badge && (
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {opt.badge}
                </span>
              )}
              <span className={opt.badge ? "ml-2" : ""}>{opt.label}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function FormActions({
  submitLabel,
  resetLabel,
  onReset,
  canSubmit = true,
}: {
  submitLabel: string;
  resetLabel: string;
  onReset: () => void;
  canSubmit?: boolean;
}) {
  return (
    <div className="flex gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-md bg-trust-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-trust-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
      >
        {resetLabel}
      </button>
    </div>
  );
}
