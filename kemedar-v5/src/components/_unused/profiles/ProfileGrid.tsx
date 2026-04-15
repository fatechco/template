// @ts-nocheck
import AgentCard from "./AgentCard";
import AgencyCard from "./AgencyCard";
import DeveloperCard from "./DeveloperCard";
import FranchiseOwnerCard from "./FranchiseOwnerCard";

const CARD_MAP = {
  agent: AgentCard,
  agency: AgencyCard,
  developer: DeveloperCard,
  franchise: FranchiseOwnerCard,
};

export default function ProfileGrid({ type, items, loading }) {
  const Card = CARD_MAP[type];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse overflow-hidden">
            <div className="h-44 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="flex gap-2 mt-4">
                <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                <div className="flex-1 h-8 bg-orange-100 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-semibold">No results found</p>
        <p className="text-sm mt-1">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => <Card key={item.id || i} {...{ [type === "franchise" ? "owner" : type === "agency" ? "agency" : type === "developer" ? "developer" : "agent"]: item }} index={i} />)}
    </div>
  );
}