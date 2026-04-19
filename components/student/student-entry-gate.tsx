"use client";

import { useState } from "react";
import { getStudentProgramDescription } from "@/lib/student-access";
import type { StudentProgramOption } from "@/types/app";

const yearLevels = [1, 2, 3, 4] as const;

type StudentEntryGateProps = {
  programs: StudentProgramOption[];
  studentId: string;
};

export function StudentEntryGate({ programs, studentId }: StudentEntryGateProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(programs[0]?.id ?? null);
  const [accessCode, setAccessCode] = useState("");
  const [selectedYear, setSelectedYear] = useState<(typeof yearLevels)[number] | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);

  const activeProgram = programs.find((program) => program.id === selectedProgramId) ?? null;

  function handleProgramContinue() {
    if (!activeProgram) {
      setError("Kies eerst een studierichting.");
      return;
    }

    if (accessCode.trim().toUpperCase() !== activeProgram.code) {
      setError("De ingevoerde code hoort niet bij deze studierichting.");
      return;
    }

    setError(null);
    setStep(2);
  }

  return (
    <section className="space-y-6">
      {!programs.length ? (
        <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
          Er zijn nog geen studierichtingen beschikbaar. Voeg eerst een richting toe in het adminportaal.
        </div>
      ) : null}
      <div className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          Stap {step} van 2
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-950">
          {step === 1 ? "Kies je studierichting" : "Kies je leerjaar"}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {step === 1
            ? "Selecteer eerst je richting en vul de toegangscode in die bij deze studierichting hoort."
            : "Kies daarna het leerjaar waarin je de vakken en opdrachten wilt openen."}
        </p>
      </div>

      {step === 1 ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="grid gap-4 md:grid-cols-2">
            {programs.map((program) => {
              const active = program.id === selectedProgramId;

              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => {
                    setSelectedProgramId(program.id);
                    setError(null);
                  }}
                  className={`rounded-[28px] border p-5 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white shadow-glow"
                      : "border-slate-200 bg-white/90 text-slate-900 shadow-panel hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${active ? "text-white/80" : "text-brand-600"}`}>
                    {program.code}
                  </p>
                  <h4 className="mt-3 text-xl font-semibold">{program.name}</h4>
                  <p className={`mt-3 text-sm leading-6 ${active ? "text-white/85" : "text-slate-600"}`}>
                    {getStudentProgramDescription(program)}
                  </p>
                </button>
              );
            })}
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              Code invoeren
            </p>
            <h4 className="mt-3 text-2xl font-semibold text-slate-950">
              {activeProgram?.name ?? "Kies eerst een richting"}
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {activeProgram
                ? `Voer de code van ${activeProgram.name} in om door te gaan naar de leerjaren.`
                : "Klik eerst links op een richting en voer daarna de bijbehorende code in."}
            </p>
            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Toegangscode</label>
            <input
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              disabled={!activeProgram}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase disabled:bg-slate-100"
              placeholder={activeProgram ? `Code voor ${activeProgram.code}` : "Kies eerst een richting"}
            />
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Gebruik de code die door de admin aan deze richting is gekoppeld.
            </p>
            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            <button
              type="button"
              onClick={handleProgramContinue}
              disabled={!programs.length}
              className="mt-6 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Verder naar leerjaar
            </button>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {yearLevels.map((year) => {
              const active = year === selectedYear;

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    setSelectedYear(year);
                    setError(null);
                    document.cookie = `amto_program=; path=/; max-age=0; SameSite=Lax`;
                    document.cookie = `amto_student_id=${studentId}; path=/; max-age=2592000; SameSite=Lax`;
                    document.cookie = `amto_program_id=${activeProgram?.id ?? ""}; path=/; max-age=2592000; SameSite=Lax`;
                    document.cookie = `amto_program_code=${activeProgram?.code ?? ""}; path=/; max-age=2592000; SameSite=Lax`;
                    document.cookie = `amto_year=${year}; path=/; max-age=2592000; SameSite=Lax`;
                    window.location.href = "/student/portal";
                  }}
                  className={`rounded-[28px] border p-6 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white shadow-glow"
                      : "border-slate-200 bg-white/90 text-slate-900 shadow-panel hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${active ? "text-white/80" : "text-brand-600"}`}>
                    Leerjaar
                  </p>
                  <h4 className="mt-3 text-3xl font-semibold">{year}</h4>
                  <p className={`mt-3 text-sm ${active ? "text-white/85" : "text-slate-600"}`}>
                    Open de vakken en opdrachten van leerjaar {year}.
                  </p>
                </button>
              );
            })}
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              Jouw keuze
            </p>
            <h4 className="mt-3 text-2xl font-semibold text-slate-950">
              {activeProgram?.name ?? "Nog geen richting gekozen"}
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Kies het leerjaar dat je nu wilt openen. Daarna sturen we je naar het portaal met de vakken van die richting en klaslaag.
            </p>
            {selectedYear ? (
              <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
                Klaar om {activeProgram?.name} leerjaar {selectedYear} te openen.
              </p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
              >
                Vorige stap
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
