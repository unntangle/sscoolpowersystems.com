import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "h-11 w-full rounded-md border border-neutral-300 bg-white px-4 text-base text-neutral-900 transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus-visible:border-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 aria-invalid:border-danger-600 sm:text-sm";

/** Plain input. Use <Field> for label, hint and error wiring. text-base on mobile avoids iOS zoom. */
export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(inputClasses, className)} {...props} />;
}

type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

export interface FieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  /** Render prop so the control gets matching id / aria attributes. */
  children: (control: FieldControlProps) => React.ReactNode;
}

/** Label + control + hint + error, with ids wired for screen readers. */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = React.useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-800">
        {label}
        {required ? (
          <span className="text-danger-600" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
      })}
      {hint ? (
        <p id={hintId} className="text-xs text-neutral-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
