import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import VerifyCertHero from "@/components/verify/public/VerifyCertHero";
import VerifyCertPropertyDetails from "@/components/verify/public/VerifyCertPropertyDetails";
import VerifyChainSection from "@/components/verify/public/VerifyChainSection";
import VerifyCertQRShare from "@/components/verify/public/VerifyCertQRShare";

export default function PublicVerifyCertificate() {
  const { tokenId } = useParams();
  const [token, setToken] = useState(null);
  const [property, setProperty] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tokens = await base44.entities.PropertyToken.filter({ tokenId });
      const tok = tokens?.[0];
      setToken(tok);
      if (tok?.propertyId) {
        const [props, recs] = await Promise.all([
          base44.entities.Property.filter({ id: tok.propertyId }),
          base44.entities.VerificationRecord.filter({ tokenId: tok.id }, "recordNumber", 200),
        ]);
        setProperty(props?.[0]);
        setRecords(recs || []);
      }
      setLoading(false);
    };
    load();
  }, [tokenId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20">
          <p className="text-5xl">🔍</p>
          <p className="font-black text-gray-800 text-xl">Certificate Not Found</p>
          <p className="text-gray-500 text-sm">Token ID: {tokenId}</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <VerifyCertHero token={token} />
      <VerifyCertPropertyDetails token={token} property={property} />
      <VerifyChainSection token={token} records={records} />
      <VerifyCertQRShare token={token} />

      {/* Legal footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-6 px-4">
        <p className="max-w-3xl mx-auto text-xs text-gray-500 text-center leading-relaxed">
          This certificate is issued by Kemedar® Property Technology and confirms completion of the Kemedar Verify Pro™ verification process.
          It does not constitute a legal title transfer or government registration document.
          Always verify independently before any transaction.
          Certificate ID: <span className="font-mono font-bold">{token.tokenId}</span>
          {token.certificateExpiresAt && ` — Valid until: ${new Date(token.certificateExpiresAt).toLocaleDateString()}`}
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}