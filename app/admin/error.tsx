"use client";

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-sand-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">
          Admin fout
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          Er ging iets mis in het beheercentrum
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white"
        >
          Opnieuw proberen
        </button>
      </div>
    </main>
  );
}
