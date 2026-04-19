"use client";

import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  demoMode?: boolean;
};

export function SignOutButton({ demoMode }: SignOutButtonProps) {
  async function handleSignOut() {
    if (demoMode) {
      window.location.href = "/login";
      return;
    }

    const supabase = createClient();

    if (!supabase) {
      window.location.href = "/login";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
    >
      Uitloggen
    </button>
  );
}
