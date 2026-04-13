import { useState } from 'react';
import { ChevronLeft, Search, Settings, Plus, Eye, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROJECTS_DATA = [
  { id: 1, name: "Marassi North Coast", developer: "Emaar Misr", city: "North Coast", units: 3500, delivery: "2026", verified: true, image: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=200&q=70" },
  { id: 2, name: "Midtown Condo", developer: "Diar Misr", city: "New Cairo", units: 200, delivery: "2025", verified: true, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=70" },
  { id: 3, name: "Sodic West", developer: "SODIC", city: "6th October", units: 1200, delivery: "2027", verified: false, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=70" },
  { id: 4, name: "Palm Hills October", developer: "Palm Hills", city: "6th October", units: 800, delivery: "2026", verified: true, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=70" },
];

export default function FranchiseAreaProjectsMobile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingProject, setVerifyingProject] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyChecklist, setVerifyChecklist] = useState({
    location: false, license: false, units: false, delivery: false, payment: false, permits: false, onSite: false, signage: false,
  });

  const filteredProjects = PROJECTS_DATA.filter(p => {
    const tabMatch = selectedTab === "All" || 
                    (selectedTab === "Pending" && !p.verified) ||
                    (selectedTab === "Active" && p.verified);
    const searchMatch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const startVerify = (project) => {
    setVerifyingProject(project);
    setShowVerifyModal(true);
    setVerifyStep(1);
    setVerifyChecklist({ location: false, license: false, units: false, delivery: false, payment: false, permits: false, onSite: false, signage: false });
  };

  const completeVerify = () => {
    console.log("Project verified:", verifyingProject);
    setShowVerifyModal(false);
    setVerifyingProject(null);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Area Projects</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Plus size={22} className="text-gray-900" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Pending ⚠️", "Active", "Recent", "Mine"].map(tab => (
          <button key={tab} onClick={() => setSelectedTab(tab.replace(" ⚠️", ""))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedTab === tab.replace(" ⚠️", "")
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="sticky top-28 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Cover Image */}
            <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
              <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
              <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                proj.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {proj.verified ? "✓ Verified" : "⚠️ Pending"}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <p className="font-bold text-gray-900">{proj.name}</p>
              <p className="text-xs text-gray-500">{proj.developer}</p>
              <div className="flex justify-between text-xs text-gray-600">
                <span>📍 {proj.city}</span>
                <span>🏠 {proj.units.toLocaleString()} units</span>
                <span>📅 {proj.delivery}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs">
                <Eye size={14} /> View
              </button>
              {!proj.verified && (
                <button onClick={() => startVerify(proj)} className="flex-1 flex items-center justify-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2 rounded-lg text-xs">
                  <Check size={14} /> Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verify Modal */}
      {showVerifyModal && verifyingProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {/* Progress */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Step {verifyStep} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(verifyStep / 4) * 100}%` }} />
              </div>
            </div>

            {verifyStep === 1 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Review Project</h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Name:</span><span className="font-bold text-gray-900">{verifyingProject.name}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Developer:</span><span className="font-bold text-gray-900">{verifyingProject.developer}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Units:</span><span className="font-bold text-gray-900">{verifyingProject.units.toLocaleString()}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setVerifyStep(2)} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">Yes ✓</button>
                  <button className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg">No</button>
                </div>
              </div>
            )}

            {verifyStep === 2 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Verification Checklist</h2>
                <div className="space-y-2 mb-6">
                  {[
                    { key: "location", label: "Project location confirmed" },
                    { key: "license", label: "Developer license verified" },
                    { key: "units", label: "Unit count matches" },
                    { key: "delivery", label: "Delivery date confirmed" },
                    { key: "payment", label: "Payment plan accurate" },
                    { key: "permits", label: "Legal permits available" },
                    { key: "onSite", label: "On-site photos uploaded" },
                    { key: "signage", label: "VERIFIED signage added" },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                      <span className="text-xs text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setVerifyStep(3)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg">Continue</button>
              </div>
            )}

            {verifyStep === 3 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Upload Photos</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <p className="text-xs text-gray-600">📸 Upload verification photos (min 3)</p>
                  <button className="mt-3 bg-orange-100 text-orange-700 font-bold text-xs px-3 py-1.5 rounded-lg">Choose Files</button>
                </div>
                <textarea placeholder="Notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-xs focus:outline-none resize-none h-20" />
                <button onClick={() => setVerifyStep(4)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg">Review</button>
              </div>
            )}

            {verifyStep === 4 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Approve</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-xs text-green-800">Ready to approve verification?</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg">❌ Reject</button>
                  <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">✅ Verify</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg hover:bg-orange-700">
        ➕
      </button>
    </div>
  );
}