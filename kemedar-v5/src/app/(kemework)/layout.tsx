"use client";

import KemeworkHeader from "@/components/kemework/header/KemeworkHeader";
import KemeworkFooter from "@/components/kemework/footer/KemeworkFooter";

export default function KemeworkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KemeworkHeader />
      <main className="min-h-screen">{children}</main>
      <KemeworkFooter />
    </>
  );
}
