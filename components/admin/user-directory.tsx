"use client";

import { useState } from "react";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Profile } from "@/types/database";

type UserDirectoryProps = {
  users: Profile[];
  deleteUserAction: (formData: FormData) => Promise<void>;
};

function UserListSection({
  title,
  users,
  badgeVariant,
  deleteUserAction
}: {
  title: string;
  users: Profile[];
  badgeVariant: "success" | "warning" | "info";
  deleteUserAction?: (formData: FormData) => Promise<void>;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <StatusBadge variant={badgeVariant}>{users.length}</StatusBadge>
      </div>
      <div className="mt-4 space-y-3">
        {users.length ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{user.full_name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge variant={badgeVariant}>{user.role}</StatusBadge>
                {deleteUserAction ? (
                  <DeleteResourceForm
                    action={deleteUserAction}
                    id={user.id}
                    label={user.full_name}
                    resourceName={user.role === "teacher" ? "docent" : "student"}
                  />
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <EmptyState title={`Geen ${title.toLowerCase()}`} description="Er zijn geen resultaten voor deze selectie." />
        )}
      </div>
    </section>
  );
}

export function UserDirectory({ users, deleteUserAction }: UserDirectoryProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      user.full_name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery) ||
      user.role.toLowerCase().includes(normalizedQuery)
    );
  });

  const teachers = filteredUsers.filter((user) => user.role === "teacher");
  const students = filteredUsers.filter((user) => user.role === "student");
  const admins = filteredUsers.filter((user) => user.role === "admin");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Gebruikerslijst</h3>
            <p className="mt-1 text-sm text-slate-600">
              Zoek op naam, e-mail of rol en bekijk studenten en docenten apart.
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Zoek gebruiker..."
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <UserListSection
          title="Docenten"
          users={teachers}
          badgeVariant="warning"
          deleteUserAction={deleteUserAction}
        />
        <UserListSection
          title="Studenten"
          users={students}
          badgeVariant="success"
          deleteUserAction={deleteUserAction}
        />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-panel">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-950">Admins</h3>
          <StatusBadge variant="info">{admins.length}</StatusBadge>
        </div>
        <div className="mt-4 space-y-3">
          {admins.length ? (
            admins.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{user.full_name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <StatusBadge variant="info">{user.role}</StatusBadge>
              </div>
            ))
          ) : (
            <EmptyState title="Geen admins" description="Er zijn geen adminaccounts die passen bij deze zoekopdracht." />
          )}
        </div>
      </section>
    </div>
  );
}
