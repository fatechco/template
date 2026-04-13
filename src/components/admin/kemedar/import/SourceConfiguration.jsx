import { Plus, Save, Play } from "lucide-react";
import { useState } from "react";

const KNOWN_SOURCES = [
  { id: "aqarmap", label: "Aqarmap", url: "aqarmap.com" },
  { id: "olx", label: "OLX", url: "olx.com" },
  { id: "property-finder", label: "Property Finder", url: "propertyfinder.ae" },
  { id: "dubizzle", label: "Dubizzle", url: "dubizzle.com" },
  { id: "bayut", label: "Bayut", url: "bayut.com" },
  { id: "sahel", label: "Sahel", url: "sahel.com" },
  { id: "custom", label: "Custom", url: "" },
];

const PROPERTY_FIELDS = [
  "id", "title", "description", "size", "size_unit", "price", "currency", "price_unit",
  "purpose", "type", "furnished", "bathroom", "bedroom", "view_360", "amenities",
  "province", "city", "district", "area", "street", "latitude", "longitude",
  "publish_date", "video_url", "user_name", "phone", "whatsapp", "total_properties",
  "path", "gallery", "project_id", "country_code", "url", "lang", "rent_unit", "email", "address"
];

const USER_FIELDS = [
  "ID", "name", "path", "avatar", "phone", "whatsapp", "position", "biography",
  "country_code", "country_name", "linkedin", "broker_license_no", "verification_status",
  "total_properties", "years_of_experience", "work_area", "languages", "company_id",
  "company_name", "source", "email", "address"
];

export default function SourceConfiguration({ onStartScrape }) {
  const [sourceName, setSourceName] = useState("");
  const [selectedSource, setSelectedSource] = useState("aqarmap");
  const [customUrl, setCustomUrl] = useState("");
  const [scrapeType, setScrapeType] = useState("properties");
  const [scrapeLink, setScrapeLink] = useState("");
  const [fieldMappings, setFieldMappings] = useState([]);

  const sourceFields = scrapeType === "properties" ? PROPERTY_FIELDS : USER_FIELDS;

  const handleStartScrape = () => {
    onStartScrape({
      sourceName,
      selectedSource: selectedSource === "custom" ? customUrl : selectedSource,
      scrapeType,
      scrapeLink,
      fieldMappings
    });
  };

  return (
    <div className="space-y-6">
      {/* Source Name */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <label className="text-xs text-gray-600 uppercase font-bold">Source Name</label>
        <input
          type="text"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          placeholder="e.g. Aqarmap Egypt, OLX Egypt"
          className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Source Website */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
        <label className="text-xs text-gray-600 uppercase font-bold">Source Website</label>
        <div className="flex gap-2 flex-wrap">
          {KNOWN_SOURCES.slice(0, -1).map(source => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSource === source.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {source.label}
            </button>
          ))}
          <button
            onClick={() => setSelectedSource("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSource === "custom"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Custom
          </button>
        </div>
        {selectedSource === "custom" && (
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          />
        )}
      </div>

      {/* What to Scrape */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
        <label className="text-xs text-gray-600 uppercase font-bold">What to Scrape</label>
        {[
          { value: "users", label: "Users (Agents/Developers)" },
          { value: "properties", label: "Properties" },
          { value: "projects", label: "Projects" },
          { value: "all", label: "All (Users + Properties)" },
        ].map(option => (
          <label key={option.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded">
            <input
              type="radio"
              name="scrapeType"
              value={option.value}
              checked={scrapeType === option.value}
              onChange={(e) => setScrapeType(e.target.value)}
            />
            <span className="text-sm font-bold text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Link to Scrape */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <label className="text-xs text-gray-600 uppercase font-bold">Link to Scrape</label>
        <input
          type="url"
          value={scrapeLink}
          onChange={(e) => setScrapeLink(e.target.value)}
          placeholder="Paste the listing/search page URL"
          className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Field Mapping */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Map Source Fields to Kemedar Fields</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sourceFields.slice(0, 5).map(field => (
            <div key={field} className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-bold w-32">{field}</span>
              <select className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
                <option>Select mapping...</option>
                <option selected>{field}</option>
              </select>
            </div>
          ))}
        </div>
        <button className="text-xs text-orange-600 font-bold mt-3 hover:underline">+ Add Custom Field Mapping</button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          <Save size={16} /> Save Source Template
        </button>
        <button
          onClick={handleStartScrape}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700"
        >
          <Play size={16} /> Start Scraping
        </button>
      </div>
    </div>
  );
}