import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMTO Lesportaal",
  description: "Demo lesportaal voor AMTO met Next.js en Supabase."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
