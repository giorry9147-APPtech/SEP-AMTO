import { SignOutButton } from "@/components/auth/sign-out-button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Profile } from "@/types/database";

type TopbarProps = {
  profile: Profile;
  title: string;
  description: string;
};

export function Topbar({ profile, title, description }: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-panel md:flex-row md:items-start md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <StatusBadge variant="info">{profile.role}</StatusBadge>
          <span className="text-sm text-slate-500">{profile.email}</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ingelogd als</p>
          <p className="text-sm font-semibold text-slate-900">{profile.full_name}</p>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
