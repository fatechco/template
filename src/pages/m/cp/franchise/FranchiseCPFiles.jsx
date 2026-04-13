import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Menu, FileText } from "lucide-react";
import FranchiseOwnerDrawer from "@/components/dashboard/FranchiseOwnerDrawer";

export default function FranchiseCPFiles() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50 pb-24 max-w-[480px] mx-auto">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Files & Documents</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <FileText size={22} className="text-gray-900" />
        </button>
      </div>
      <FranchiseOwnerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-black text-gray-900 mb-2">Files & Documents</p>
          <p className="text-sm text-gray-500">Manage your business documents</p>
        </div>
      </div>
    </div>
  );
}