import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

type SidebarLink = {
  href: Route;
  label: string;
};

type SidebarProps = {
  title: string;
  subtitle: string;
  currentPath: string;
  links: ReadonlyArray<SidebarLink>;
};

export function Sidebar({ title, subtitle, currentPath, links }: SidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col bg-graphite-900 p-5 text-white shadow-glow lg:rounded-r-[36px] lg:p-6">
      <div className="mb-8">
        <div className="flex justify-center py-2">
          <Image
            src="https://amto.sr/wp-content/uploads/2021/12/Logo-Amto.png"
            alt="AMTO logo"
            width={220}
            height={90}
            unoptimized
            className="h-auto w-[160px] lg:w-[210px]"
          />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = currentPath === link.href || currentPath.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-brand-500 text-white shadow-glow"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Centrale cockpit voor lessen, opdrachten, klassen en voortgang binnen AMTO.
      </div>
    </aside>
  );
}
