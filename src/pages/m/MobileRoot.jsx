import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isMobileSession, toMobilePath } from "@/lib/mobile-detect";

/**
 * MobileRoot — placed at the app root level.
 * If the session is mobile, redirects all non-/m routes to /m equivalents.
 */
export default function MobileRoot({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onMobile = isMobileSession();
    const isAlreadyMobile = location.pathname.startsWith("/m");

    if (onMobile && !isAlreadyMobile) {
      const target = toMobilePath(location.pathname);
      navigate(target, { replace: true });
    }
  }, []); // Run once on mount

  return children;
}