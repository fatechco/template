"use client";
// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MobilePropertyStep2({ data, onChange }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
    setOpenDropdown(null);
  };

  // Mock countries/cities - replace with API
  const countries = [
    { id: "1", label: "Egypt" },
    { id: "2", label: "UAE" },
    { id: "3", label: "Saudi Arabia" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              const reader = new FileReader();
              reader.onload = (event) => {
                onChange({ ...data, featured_image_url: event.target.result });
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
        {data.featured_image_url && (
          <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-gray-200">
            <img src={data.featured_image_url} alt="Featured" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Gallery Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const urls = [];
              Array.from(e.target.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                  urls.push(event.target.result);
                  if (urls.length === e.target.files.length) {
                    onChange({ ...data, image_gallery_urls: urls });
                  }
                };
                reader.readAsDataURL(file);
              });
            }
          }}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
        {data.image_gallery_urls?.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {data.image_gallery_urls.map((url, idx) => (
              <img key={idx} src={url} alt={`Gallery ${idx}`} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">YouTube Links</label>
        <input
          type="url"
          value={data.youtube_link_1 || ""}
          onChange={(e) => onChange({ ...data, youtube_link_1: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] mb-2"
        />
        <input
          type="url"
          value={data.youtube_link_2 || ""}
          onChange={(e) => onChange({ ...data, youtube_link_2: e.target.value })}
          placeholder="YouTube link 2 (optional)"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] mb-2"
        />
        <input
          type="url"
          value={data.youtube_link_3 || ""}
          onChange={(e) => onChange({ ...data, youtube_link_3: e.target.value })}
          placeholder="YouTube link 3 (optional)"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Floor Plan</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onChange({ ...data, floor_plan_file: e.target.files[0] });
            }
          }}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Brochure</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onChange({ ...data, brochure_file: e.target.files[0] });
            }
          }}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">VR/360 Video Link</label>
        <input
          type="url"
          value={data.vr_video_link || ""}
          onChange={(e) => onChange({ ...data, vr_video_link: e.target.value })}
          placeholder="https://..."
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>
    </div>
  );
}