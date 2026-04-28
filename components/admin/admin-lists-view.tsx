"use client";

import { useState, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AdminListsData, ClassRosterItem, TeacherRosterItem, StudentEnrollmentItem } from "@/types/app";

type Tab = "klassen" | "docenten" | "studenten";

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
      placeholder={placeholder}
    />
  );
}

function ClassRosterView({ rosters }: { rosters: ClassRosterItem[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return rosters;
    return rosters.filter((cls) =>
      cls.name.toLowerCase().includes(q) ||
      cls.program_name.toLowerCase().includes(q) ||
      cls.program_code.toLowerCase().includes(q) ||
      cls.students.some((s) =>
        s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      )
    );
  }, [rosters, q]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Zoek op klasnaam, richting of studentnaam/e-mail.
          </p>
          <div className="w-full md:max-w-sm">
            <SearchInput value={query} onChange={setQuery} placeholder="Zoek klas of student..." />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Geen resultaten" description="Pas je zoekopdracht aan." />
      ) : (
        filtered.map((cls) => (
          <section key={cls.id} className="rounded-3xl border border-slate-200 bg-white/90 shadow-panel overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                <p className="text-sm text-slate-500">{cls.program_name} · Leerjaar {cls.year_level}</p>
              </div>
              <StatusBadge variant="info">{cls.students.length} student{cls.students.length !== 1 ? "en" : ""}</StatusBadge>
            </div>
            {cls.students.length === 0 ? (
              <div className="px-6 py-5">
                <p className="text-sm text-slate-400">Geen studenten ingeschreven.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cls.students.map((s) => (
                  <div key={s.id} className="flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <p className="font-medium text-slate-900">{s.full_name}</p>
                    <p className="text-sm text-slate-500">{s.email}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}

function TeacherRosterView({ rosters }: { rosters: TeacherRosterItem[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return rosters;
    return rosters.filter((t) =>
      t.teacher_name.toLowerCase().includes(q) ||
      t.teacher_email.toLowerCase().includes(q) ||
      t.assignments.some((a) =>
        a.subject_name.toLowerCase().includes(q) ||
        a.class_name.toLowerCase().includes(q) ||
        a.program_name.toLowerCase().includes(q)
      )
    );
  }, [rosters, q]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Zoek op docent, vak, klas of richting.
          </p>
          <div className="w-full md:max-w-sm">
            <SearchInput value={query} onChange={setQuery} placeholder="Zoek docent of vak..." />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Geen resultaten" description="Pas je zoekopdracht aan." />
      ) : (
        filtered.map((t) => (
          <section key={t.teacher_id} className="rounded-3xl border border-slate-200 bg-white/90 shadow-panel overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{t.teacher_name}</h3>
                <p className="text-sm text-slate-500">{t.teacher_email}</p>
              </div>
              <StatusBadge variant="warning">{t.assignments.length} vak{t.assignments.length !== 1 ? "ken" : ""}</StatusBadge>
            </div>
            {t.assignments.length === 0 ? (
              <div className="px-6 py-5">
                <p className="text-sm text-slate-400">Geen vakken toegewezen.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {t.assignments.map((a, i) => (
                  <div key={i} className="flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{a.subject_name}</p>
                      <p className="text-sm text-slate-500">{a.class_name} · {a.program_name}</p>
                    </div>
                    <StatusBadge variant="neutral">Leerjaar {a.year_level}</StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}

function StudentRosterView({ enrollments }: { enrollments: StudentEnrollmentItem[] }) {
  const [query, setQuery] = useState("");
  const [programCode, setProgramCode] = useState("all");
  const [yearLevel, setYearLevel] = useState(0);

  const programs = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ code: string; name: string }> = [];
    for (const e of enrollments) {
      if (!seen.has(e.program_code)) {
        seen.add(e.program_code);
        result.push({ code: e.program_code, name: e.program_name });
      }
    }
    return result.sort((a, b) => a.code.localeCompare(b.code));
  }, [enrollments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrollments.filter((e) => {
      if (programCode !== "all" && e.program_code !== programCode) return false;
      if (yearLevel !== 0 && e.year_level !== yearLevel) return false;
      if (!q) return true;
      return (
        e.student_name.toLowerCase().includes(q) ||
        e.student_email.toLowerCase().includes(q) ||
        e.class_name.toLowerCase().includes(q)
      );
    });
  }, [enrollments, query, programCode, yearLevel]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-panel">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              Filter op richting en leerjaar, of zoek op naam/e-mail.
            </p>
            <div className="w-full md:max-w-sm">
              <SearchInput value={query} onChange={setQuery} placeholder="Zoek student..." />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={programCode}
              onChange={(e) => setProgramCode(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"
            >
              <option value="all">Alle richtingen</option>
              {programs.map((p) => (
                <option key={p.code} value={p.code}>{p.code} — {p.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setYearLevel(lvl)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    yearLevel === lvl
                      ? "bg-brand-500 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {lvl === 0 ? "Alle jaren" : `Jaar ${lvl}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/90 shadow-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Studenten</h3>
          <StatusBadge variant="success">{filtered.length} resultaten</StatusBadge>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-8">
            <EmptyState title="Geen studenten gevonden" description="Pas filters of zoekopdracht aan." />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((e) => (
              <div key={e.student_id} className="flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{e.student_name}</p>
                  <p className="text-sm text-slate-500">{e.student_email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="info">{e.program_code}</StatusBadge>
                  <StatusBadge variant="neutral">{e.class_name}</StatusBadge>
                  <StatusBadge variant="neutral">Jaar {e.year_level}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminListsView({ data }: { data: AdminListsData }) {
  const [activeTab, setActiveTab] = useState<Tab>("klassen");

  const tabs: Array<{ id: Tab; label: string; count: number }> = [
    { id: "klassen", label: "Klassenlijst", count: data.classRosters.length },
    { id: "docenten", label: "Docentenlijst", count: data.teacherRosters.length },
    { id: "studenten", label: "Studentenlijst", count: data.studentEnrollments.length }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-panel">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-500 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "klassen" && <ClassRosterView rosters={data.classRosters} />}
      {activeTab === "docenten" && <TeacherRosterView rosters={data.teacherRosters} />}
      {activeTab === "studenten" && <StudentRosterView enrollments={data.studentEnrollments} />}
    </div>
  );
}
