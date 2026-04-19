import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirectByRole } from "@/lib/auth/redirect-by-role";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login?reason=missing-supabase");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?reason=no-user");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/login?reason=no-profile");
  }

  redirectByRole(profile.role);
}
