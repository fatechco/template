import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import DealParties from "@/components/verify/deal/DealParties";
import DealConditionsTracker from "@/components/verify/deal/DealConditionsTracker";
import DealTimeline from "@/components/verify/deal/DealTimeline";
import DealTopBar from "@/components/verify/deal/DealTopBar";

export default function SmartContractDeal() {
  const { contractId } = useParams();
  const [user, setUser] = useState(null);
  const [deal, setDeal] = useState(null);
  const [token, setToken] = useState(null);
  const [property, setProperty] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDeal = async () => {
    const me = await base44.auth.me();
    setUser(me);
    // Use NegotiationSession as deal entity (already exists)
    const deals = await base44.entities.NegotiationSession.filter({ id: contractId });
    const d = deals?.[0];
    setDeal(d);
    if (d?.propertyId) {
      const [props, ptoks] = await Promise.all([
        base44.entities.Property.filter({ id: d.propertyId }),
        base44.entities.PropertyToken.filter({ propertyId: d.propertyId }),
      ]);
      setProperty(props?.[0]);
      const tok = ptoks?.[0];
      setToken(tok);
      if (tok?.id) {
        const recs = await base44.entities.VerificationRecord.filter({ tokenId: tok.id }, "recordedAt", 100);
        setRecords(recs || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => { loadDeal(); }, [contractId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20">
          <p className="text-5xl">🤝</p>
          <p className="font-black text-gray-800 text-xl">Deal Not Found</p>
          <p className="text-gray-500 text-sm">Contract ID: {contractId}</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const dealId = `KDL-${new Date(deal.created_date || Date.now()).toISOString().slice(0, 10).replace(/-/g, "")}-${deal.id?.slice(0, 6)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-5">
        <DealTopBar dealId={dealId} deal={deal} />
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <DealParties deal={deal} user={user} property={property} onRefresh={loadDeal} />
          </div>
          <div className="flex-1">
            <DealConditionsTracker deal={deal} token={token} property={property} user={user} onRefresh={loadDeal} />
          </div>
        </div>
        <DealTimeline records={records} deal={deal} />
      </div>
      <SiteFooter />
    </div>
  );
}