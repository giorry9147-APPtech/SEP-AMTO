const requiredSupabaseEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

export function isSupabaseConfigured() {
  return getMissingSupabaseEnvVars().length === 0;
}

export function getMissingSupabaseEnvVars() {
  return requiredSupabaseEnvVars.filter((key) => !process.env[key]);
}

export function getSupabaseConfigError() {
  const missing = getMissingSupabaseEnvVars();

  if (!missing.length) {
    return null;
  }

  return `Supabase is niet geconfigureerd. Ontbrekende environment variables: ${missing.join(", ")}.`;
}
