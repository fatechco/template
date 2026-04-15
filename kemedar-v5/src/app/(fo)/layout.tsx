"use client";
import FranchiseOwnerShell from "@/components/franchise/FranchiseOwnerShell";

export default function FOLayout({ children }: { children: React.ReactNode }) {
  return <FranchiseOwnerShell>{children}</FranchiseOwnerShell>;
}
