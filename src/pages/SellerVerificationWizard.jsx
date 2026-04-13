import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import VerifyWizardHeader from "@/components/verify/VerifyWizardHeader";
import VerifyProgressBar from "@/components/verify/VerifyProgressBar";
import VerifyLevel1 from "@/components/verify/VerifyLevel1";
import VerifyLevel2 from "@/components/verify/VerifyLevel2";
import VerifyLevel3 from "@/components/verify/VerifyLevel3";
import VerifyLevel4 from "@/components/verify/VerifyLevel4";
import VerifyLevel5 from "@/components/verify/VerifyLevel5";

export default function SellerVerificationWizard() {
  const { propertyId } = useParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me();
      setUser(me);
      const props = await base44.entities.Property.filter({ id: propertyId });
      const prop = props?.[0];
      setProperty(prop);

      if (prop) {
        // Mint token if not yet done
        const res = await base44.functions.invoke("mintPropertyToken", {
          propertyId,
          sellerUserId: me.id,
        });
        setToken(res.data?.token);
      }
      setLoading(false);
    };
    init();
  }, [propertyId]);

  const refreshToken = async () => {
    const tokens = await base44.entities.PropertyToken.filter({ propertyId });
    if (tokens?.[0]) setToken(tokens[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentLevel = token?.verificationLevel || 1;
  const isCertIssued = token?.certificateIssued;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <VerifyWizardHeader property={property} token={token} />
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <VerifyProgressBar currentLevel={currentLevel} />
        <VerifyLevel1 token={token} />
        <VerifyLevel2
          token={token}
          user={user}
          currentLevel={currentLevel}
          onComplete={refreshToken}
        />
        <VerifyLevel3
          token={token}
          property={property}
          currentLevel={currentLevel}
          onComplete={refreshToken}
        />
        <VerifyLevel4
          token={token}
          property={property}
          currentLevel={currentLevel}
          onComplete={refreshToken}
        />
        <VerifyLevel5
          token={token}
          property={property}
          user={user}
          currentLevel={currentLevel}
          onComplete={refreshToken}
        />
      </div>
      <SiteFooter />
    </div>
  );
}