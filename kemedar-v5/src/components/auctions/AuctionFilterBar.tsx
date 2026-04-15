// @ts-nocheck
import { ChevronDown } from "lucide-react";

export default function AuctionFilterBar({
  cityFilter,
  setCityFilter,
  categoryFilter,
  setCategoryFilter,
  budgetFilter,
  setBudgetFilter,
  sortFilter,
  setSortFilter,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-wrap gap-4 items-center">
      {/* City Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">City:</label>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Cities</option>
          <option value="cairo">Cairo</option>
          <option value="giza">Giza</option>
          <option value="6oct">6th October</option>
          <option value="nc">New Cairo</option>
          <option value="az">Alex</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">Category:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Categories</option>
          <option value="apt">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
        </select>
      </div>

      {/* Budget Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">Budget:</label>
        <select
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Any</option>
          <option value="under_1m">Under 1M</option>
          <option value="1m_3m">1M–3M</option>
          <option value="3m_5m">3M–5M</option>
          <option value="5m_10m">5M–10M</option>
          <option value="10m_plus">10M+</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm font-bold text-gray-700">Sort:</label>
        <select
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="ending_soonest">Ending Soonest</option>
          <option value="newest">Newest</option>
          <option value="highest_bid">Highest Current Bid</option>
          <option value="most_bidders">Most Bidders</option>
        </select>
      </div>
    </div>
  );
}