import { CheckCircle, XCircle } from "lucide-react";

const mockData = [
  { id: 1, title: "Modern Villa Cairo", price: 850000, city: "Cairo", bedrooms: 4, bathrooms: 3 },
  { id: 2, title: "Luxury Apartment Giza", price: 2500, city: "Giza", bedrooms: 3, bathrooms: 2 },
  { id: 3, title: "Downtown Office", price: 5000, city: "Cairo", bedrooms: 0, bathrooms: 1 },
  { id: 4, title: "Villa New Cairo", price: 950000, city: "Cairo", bedrooms: 5, bathrooms: 4 },
  { id: 5, title: "Townhouse Heliopolis", price: 750000, city: "Cairo", bedrooms: 3, bathrooms: 2 },
];

export default function DataPreview() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">Scraped Data Preview</h3>
      <p className="text-xs text-gray-600">Showing first 10 records</p>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-gray-700">Title</th>
                <th className="px-3 py-2 text-left font-bold text-gray-700">Price</th>
                <th className="px-3 py-2 text-left font-bold text-gray-700">City</th>
                <th className="px-3 py-2 text-left font-bold text-gray-700">Beds</th>
                <th className="px-3 py-2 text-left font-bold text-gray-700">Baths</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900 font-bold">{item.title}</td>
                  <td className="px-3 py-2 text-gray-700">{item.price.toLocaleString()}</td>
                  <td className="px-3 py-2 text-gray-700">{item.city}</td>
                  <td className="px-3 py-2 text-gray-700">{item.bedrooms}</td>
                  <td className="px-3 py-2 text-gray-700">{item.bathrooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
          <CheckCircle size={16} /> Confirm Import
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50">
          <XCircle size={16} /> Discard
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center">Processing 5 records from Aqarmap Egypt</p>
    </div>
  );
}