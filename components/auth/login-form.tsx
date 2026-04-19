"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  disabled?: boolean;
  configurationError?: string | null;
};

export function LoginForm({ disabled = false, configurationError }: LoginFormProps) {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestedNextPath = params.get("next");
  const nextPath =
    requestedNextPath && requestedNextPath.startsWith("/") ? requestedNextPath : "/dashboard";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createClient();

    if (!supabase) {
      setError("Supabase omgevingsvariabelen ontbreken.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = nextPath;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">E-mailadres</label>
        <input
          suppressHydrationWarning
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-300"
          type="email"
          disabled={disabled}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Wachtwoord</label>
        <input
          suppressHydrationWarning
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-300"
          type="password"
          disabled={disabled}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        suppressHydrationWarning
        type="submit"
        disabled={loading || disabled}
        className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Bezig met inloggen..." : "Inloggen"}
      </button>
      {configurationError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {configurationError}
        </div>
      ) : null}
    </form>
  );
}
