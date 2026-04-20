import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSupabaseConfigError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const configurationError = getSupabaseConfigError();

  if (!configurationError) {
    const supabase = await createClient();

    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        redirect("/dashboard");
      }
    }
  }

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex items-center bg-graphite-900 px-8 py-12 text-white lg:px-12 xl:px-16">
          <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-10 flex w-full justify-center lg:justify-center">
              <Image
                src="https://amto.sr/wp-content/uploads/2021/12/Logo-Amto.png"
                alt="AMTO logo"
                width={420}
                height={170}
                priority
                unoptimized
                className="h-auto w-[280px] sm:w-[340px] lg:w-[420px]"
              />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Lesportaal voor Avond Middelbare Technische Opleidingen
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Log in als admin, docent of student en beheer klassen, vakken, lessen,
              opdrachten en inzendingen vanuit een krachtige portalomgeving.
            </p>
            <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
              {[
                "Bouwkunde",
                "Elektrotechniek",
                "Weg- en waterbouwkunde",
                "Werktuigbouwkunde"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-base"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex items-center bg-white px-8 py-12 lg:rounded-l-[44px] lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Inloggen
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-5xl">
              Welkom terug
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-slate-600">
              {configurationError ?? "Gebruik een account uit Supabase Auth om door te gaan."}
            </p>
            <div className="mt-10">
              <LoginForm
                disabled={Boolean(configurationError)}
                configurationError={configurationError}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
