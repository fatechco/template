import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function VerifyProCertificates() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [sendingReminders, setSendingReminders] = useState(false);

  useEffect(() => {
    base44.entities.PropertyToken.filter({ certificateIssued: true }, "-certificateIssuedAt", 200).then(data => {
      setTokens(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400 * 1000);

  const byTab = {
    active: tokens.filter(t => t.verificationStatus === "verified" && new Date(t.certificateExpiresAt) > now),
    expiring: tokens.filter(t => {
      const exp = new Date(t.certificateExpiresAt);
      return exp > now && exp <= in30;
    }),
    expired: tokens.filter(t => t.certificateExpiresAt && new Date(t.certificateExpiresAt) <= now),
    revoked: tokens.filter(t => t.verificationStatus === "suspended"),
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    setTimeout(() => setSendingReminders(false), 2000);
  };

  const handleRevoke = async (token) => {
    await base44.entities.PropertyToken.update(token.id, {
      verificationStatus: "suspended",
      certificateIssued: false,
    }).catch(() => {});
    const data = await base44.entities.PropertyToken.filter({ certificateIssued: true }, "-certificateIssuedAt", 200).catch(() => []);
    setTokens(data);
  };

  const currentList = byTab[tab] || [];

  const STATUS_COLORS = {
    active: "bg-green-100 text-green-700",
    expiring: "bg-amber-100 text-amber-700",
    expired: "bg-red-100 text-red-600",
    revoked: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">🏅 Certificates</h1>

      {byTab.expiring.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-black text-amber-800">{byTab.expiring.length} certificates expiring in the next 30 days</p>
          </div>
          <button onClick={handleSendReminders} disabled={sendingReminders}
            className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
            {sendingReminders ? "Sending..." : "📧 Send All Renewal Reminders"}
          </button>
        </div>
      )}

      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
        {Object.entries({ active: "Active", expiring: "Expiring Soon", expired: "Expired", revoked: "Revoked" }).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === k ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}>
            {v} ({byTab[k]?.length || 0})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading certificates...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Token ID", "Property", "Issued", "Expires", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentList.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No certificates in this category</td></tr>
                ) : currentList.map(token => {
                  const expired = token.certificateExpiresAt && new Date(token.certificateExpiresAt) <= now;
                  const expiringSoon = !expired && token.certificateExpiresAt && new Date(token.certificateExpiresAt) <= in30;
                  return (
                    <tr key={token.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{token.tokenId}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[100px]">{token.propertyId?.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {token.certificateIssuedAt ? new Date(token.certificateIssuedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={expired ? "text-red-600 font-bold" : expiringSoon ? "text-amber-600 font-bold" : "text-gray-600"}>
                          {token.certificateExpiresAt ? new Date(token.certificateExpiresAt).toLocaleDateString() : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[tab]}`}>
                          {tab}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <a href={token.certificatePdfUrl || "#"} target="_blank" rel="noreferrer"
                            className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-lg">📥 PDF</a>
                          {tab !== "revoked" && (
                            <button onClick={() => handleRevoke(token)}
                              className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2 py-1 rounded-lg">
                              🔴 Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}