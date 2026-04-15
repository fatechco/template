// @ts-nocheck
import { MapPin, Calendar, DollarSign, Star } from "lucide-react";

const COMPLETED = [
  { id: "SHP-101", from: "Cairo", to: "Alexandria", date: "Mar 19", earnings: "$95", rating: 5, customer: "Ahmed Hassan" },
  { id: "SHP-102", from: "Giza", to: "Cairo", date: "Mar 18", earnings: "$65", rating: 5, customer: "Fatima Mohamed" },
  { id: "SHP-103", from: "Helwan", to: "Giza", date: "Mar 17", earnings: "$75", rating: 4, customer: "Omar Ali" },
  { id: "SHP-104", from: "6th October", to: "Giza", date: "Mar 16", earnings: "$85", rating: 5, customer: "Layla Hassan" },
  { id: "SHP-105", from: "Alexandria", to: "Cairo", date: "Mar 15", earnings: "$110", rating: 5, customer: "Khaled Ahmed" },
];

export default function ShipperMobileCompleted() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Completed Shipments</h1>
        <p className="text-gray-500 text-sm mt-1">{COMPLETED.length} deliveries completed</p>
      </div>

      <div className="space-y-3">
        {COMPLETED.map((ship) => (
          <div key={ship.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{ship.id}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={12} /> {ship.from} → {ship.to}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-sm">{ship.earnings}</p>
                <div className="flex items-center gap-0.5 justify-end mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < ship.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1"><Calendar size={12} /> {ship.date}</span>
              <span className="font-semibold text-gray-900">{ship.customer}</span>
            </div>

            <button className="w-full text-sm font-bold text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">
              View Receipt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}