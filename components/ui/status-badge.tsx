import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "neutral";
};

const variants = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-brand-100 text-brand-700",
  neutral: "bg-slate-100 text-slate-700"
};

export function StatusBadge({ children, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", variants[variant])}>
      {children}
    </span>
  );
}
