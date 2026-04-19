import type { Route } from "next";
import type { ReactNode } from "react";
import type { Profile } from "@/types/database";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

type AppShellProps = {
  profile: Profile;
  currentPath: string;
  title: string;
  description: string;
  navTitle: string;
  navSubtitle: string;
  links: ReadonlyArray<{ href: Route; label: string }>;
  demoMode?: boolean;
  children: ReactNode;
};

export function AppShell({
  profile,
  currentPath,
  title,
  description,
  navTitle,
  navSubtitle,
  links,
  demoMode,
  children
}: AppShellProps) {
  return (
    <main className="min-h-screen w-full bg-sand-50">
      <div className="grid min-h-screen w-full lg:grid-cols-[320px_minmax(0,1fr)]">
        <Sidebar title={navTitle} subtitle={navSubtitle} currentPath={currentPath} links={links} />
        <div className="space-y-6 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <Topbar profile={profile} title={title} description={description} demoMode={demoMode} />
          {children}
        </div>
      </div>
    </main>
  );
}
