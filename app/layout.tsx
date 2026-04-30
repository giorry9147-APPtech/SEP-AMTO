import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMTO Lesportaal",
  description: "Lesportaal voor AMTO."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
