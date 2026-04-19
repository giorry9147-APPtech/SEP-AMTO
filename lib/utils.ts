export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "Nog niet gepland";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}
