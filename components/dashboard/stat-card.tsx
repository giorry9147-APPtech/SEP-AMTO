import Link from "next/link";
import type { Route } from "next";
import type { DashboardStat } from "@/types/app";

type StatCardProps = DashboardStat & {
  actionHref?: Route;
  actionLabel?: string;
};

export function StatCard({ label, value, helper, actionHref, actionLabel = "Open" }: StatCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {actionHref ? (
          <Link
            href={actionHref}
            prefetch={false}
            aria-label={actionLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition hover:bg-brand-100"
          >
            +
          </Link>
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            +
          </span>
        )}
      </div>
      <p className="text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </article>
  );
}
