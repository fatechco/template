"use client";
// @ts-nocheck
import { Outlet, useLocation } from "next/link";
import { useEffect, useState } from "react";
import KemeworkHeader from "./header/KemeworkHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import KemeworkMobileBottomNav from "./mobile/KemeworkMobileBottomNav";
import SnapAndFixPage from "@/pages/kemework/SnapAndFix";
import SnapAndFixReview from "@/pages/kemework/SnapAndFixReview";

// Detect mobile via screen width (SSR-safe)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function KemeworkShell() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Snap & Fix routes — render without Kemework shell chrome
  const isReviewRoute = pathname.includes("/snap/review");
  if (isReviewRoute) return <SnapAndFixReview />;

  const isSnapRoute = pathname.includes("/snap");
  if (isSnapRoute) return <SnapAndFixPage />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F5F0" }}>
      {isMobile ? (
        <>
          <div className="flex-1 pb-20">
            <Outlet />
          </div>
          <KemeworkMobileBottomNav />
        </>
      ) : (
        <>
          <KemeworkHeader />
          <div className="flex-1">
            <Outlet />
          </div>
          <SuperFooter />
        </>
      )}
    </div>
  );
}