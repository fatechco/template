import { useState } from "react";
import { X, Plus } from "lucide-react";

const DB_FIELDS = {
  Property: ["title", "description", "size", "price", "currency", "purpose", "type", "furnished", "bathroom", "bedroom", "province", "city", "district", "area", "address", "latitude", "longitude", "video_url", "phone", "whatsapp"],
  User: ["name", "email", "phone", "whatsapp", "avatar", "position", "biography", "linkedin", "verification_status", "work_area", "languages", "company_name"],
  Project: ["title", "description", "latitude", "longitude", "email", "phone", "developer_name", "website", "biography", "avatar", "gallery", "floorplan", "brochure"],
};

function FieldMappingRow({ sourceField, mapping, onUpdate, onRemove, dbFields, allSourceFields }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFields = dbFields.filter((field) =>
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Source Field (read-only) */}
      <div className="flex-1">
        <div className="text-xs font-bold text-gray-500 mb-1">Source Field</div>
        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
          {sourceField}
        </div>
      </div>

      {/* Arrow */}
      <div className="text-gray-400 font-bold">→</div>

      {/* DB Field Dropdown */}
      <div className="flex-1 relative">
        <div className="text-xs font-bold text-gray-500 mb-1">Map to Field</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-left text-gray-700 hover:border-blue-400 transition-colors flex items-center justify-between"
        >
          <span>{mapping || "Select field..."}</span>
          <span className="text-xs">▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 p-2">
              {filteredFields.length > 0 ? (
                filteredFields.map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      onUpdate(sourceField, field);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      mapping === field
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {field}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400 p-2">No fields found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(sourceField)}
        className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
        title="Remove mapping"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function FieldMappingSection({ scrapeType, selectedFields, onMappingChange }) {
  const [fieldMappings, setFieldMappings] = useState({});

  const dbFields = DB_FIELDS[scrapeType] || [];

  const handleUpdate = (sourceField, dbField) => {
    const updated = { ...fieldMappings, [sourceField]: dbField };
    setFieldMappings(updated);
    onMappingChange(updated);
  };

  const handleRemove = (sourceField) => {
    const updated = { ...fieldMappings };
    delete updated[sourceField];
    setFieldMappings(updated);
    onMappingChange(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Field Mapping</h3>
        <p className="text-xs text-gray-500 mt-1">
          Map source website fields to your database fields
        </p>
      </div>

      <div className="space-y-3">
        {selectedFields.length > 0 ? (
          selectedFields.map((field) => (
            <FieldMappingRow
              key={field}
              sourceField={field}
              mapping={fieldMappings[field] || ""}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              dbFields={dbFields}
              allSourceFields={selectedFields}
            />
          ))
        ) : (
          <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">
              Select fields above to create mappings
            </p>
          </div>
        )}
      </div>

      {selectedFields.length > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <span className="font-bold">{Object.keys(fieldMappings).length}</span> of{" "}
            <span className="font-bold">{selectedFields.length}</span> fields mapped
          </p>
        </div>
      )}
    </div>
  );
}