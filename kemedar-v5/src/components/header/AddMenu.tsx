// @ts-nocheck
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddMenu() {
  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2">
      <Link
        href="/kemedar/add/property"
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
      >
        <Plus size={16} />
        <span className="font-medium">List Property</span>
      </Link>
      <Link
        href="/kemedar/add/project"
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
      >
        <Plus size={16} />
        <span className="font-medium">Add Project</span>
      </Link>
      <Link
        href="/kemedar/add/buy-request"
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
      >
        <Plus size={16} />
        <span className="font-medium">Add Request</span>
      </Link>
    </div>
  );
}