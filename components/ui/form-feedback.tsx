import { cn } from "@/lib/utils";
import type { FormActionState } from "@/lib/actions/form-state";

type FormFeedbackProps = {
  state: FormActionState;
};

const variants = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  idle: ""
};

export function FormFeedback({ state }: FormFeedbackProps) {
  if (!state.message || state.status === "idle") {
    return null;
  }

  return (
    <p className={cn("rounded-2xl border px-4 py-3 text-sm", variants[state.status])}>
      {state.message}
    </p>
  );
}
