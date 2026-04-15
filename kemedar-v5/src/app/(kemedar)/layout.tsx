"use client";

import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";

export default function KemedarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50">{children}</main>
      <SuperFooter />
    </>
  );
}
