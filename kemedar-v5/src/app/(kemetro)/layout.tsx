"use client";

import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

export default function KemetroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KemetroHeader />
      <main className="min-h-screen">{children}</main>
      <KemetroFooter />
    </>
  );
}
