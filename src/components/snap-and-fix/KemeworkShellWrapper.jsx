import { useEffect, useState } from "react";
import KemeworkHeader from "@/components/kemework/header/KemeworkHeader";
import KemeworkFooter from "@/components/kemework/footer/KemeworkFooter";

const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export default function KemeworkShellWrapper({ children }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => { setMobile(isMobile()); }, []);

  if (mobile) return <>{children}</>;
  return (
    <div className="flex flex-col min-h-screen">
      <KemeworkHeader />
      <main className="flex-1">{children}</main>
      <KemeworkFooter />
    </div>
  );
}