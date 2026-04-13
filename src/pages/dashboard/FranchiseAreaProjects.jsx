import { useState } from 'react';
import { Search, Filter, RotateCcw, Download, Eye, Edit, Check, AlertCircle, Trash2, MapPin } from 'lucide-react';

const PROJECTS_DATA = [
  { id: 1, name: "Marassi North Coast", developer: "Emaar Misr", city: "North Coast", units: 3500, delivery: "2026", status: "active", verified: true, addedDate: "2025-02-01", image: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=400&q=80", description: "World-class integrated resort community with 6.5km beachfront" },
  { id: 2, name: "Midtown Condo", developer: "Diar Misr", city: "New Cairo", units: 200, delivery: "2025", status: "active", verified: true, addedDate: "2025-02-15", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", description: "Modern residential complex with premium amenities" },
  { id: 3, name: "Sodic West", developer: "SODIC", city: "6th October", units: 1200, delivery: "2027", status: "pending", verified: false, addedDate: "2025-03-10", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80", description: "Large-scale mixed-use development" },
  { id: 4, name: "Palm Hills October", developer: "Palm Hills", city: "6th October", units: 800, delivery: "2026", status: "active", verified: true, addedDate: "2025-01-20", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80", description: "Gated community with retail and residential units" },
];

const STATUS_TABS = ["All", "Active", "Pending Verification", "Recent", "My Projects"];

export default function FranchiseAreaProjects() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingProject, setVerifyingProject] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyChecklist, setVerifyChecklist] = useState({
    location: false, license: false, units: false, delivery: false, payment: false, permits: false, onSite: false, signage: false,
  });
  const [verifyNotes, setVerifyNotes] = useState("");

  const filteredProjects = PROJECTS_DATA.filter(p => {
    const tabMatch = activeTab === "All" || 
                    (activeTab === "Active" && p.status === "active") ||
                    (activeTab === "Pending Verification" && p.status === "pending") ||
                    (activeTab === "Recent" && p.addedDate > "2025-02-15");
    const searchMatch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.developer.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const statCards = [
    { label: "Total Projects", value: PROJECTS_DATA.length, color: "text-orange-600" },
    { label: "Pending Verification", value: PROJECTS_DATA.filter(p => p.status === "pending").length, color: "text-red-600" },
    { label: "Active", value: PROJECTS_DATA.filter(p => p.status === "active").length, color: "text-green-600" },
    { label: "Units Total", value: PROJECTS_DATA.reduce((sum, p) => sum + p.units, 0).toLocaleString(), color: "text-teal-600" },
  ];

  const handleSelectProject = (id) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedProjects(selectedProjects.length === filteredProjects.length ? [] : filteredProjects.map(p => p.id));
  };

  const startVerify = (project) => {
    setVerifyingProject(project);
    setShowVerifyModal(true);
    setVerifyStep(1);
    setVerifyChecklist({ location: false, license: false, units: false, delivery: false, payment: false, permits: false, onSite: false, signage: false });
    setVerifyNotes("");
  };

  const completeVerify = () => {
    console.log("Project verified:", verifyingProject, verifyNotes);
    setShowVerifyModal(false);
    setVerifyingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"}  My Area {">"} Projects</p>
        <h1 className="text-3xl font-black text-gray-900">Projects in My Area</h1>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all border-b-2 ${
              activeTab === tab
                ? "bg-orange-50 text-orange-600 border-orange-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {tab} ({filteredProjects.length})
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by project name, developer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold">
            <Filter size={14} className="inline mr-1" /> Filter
          </button>
          <button onClick={() => setSearchQuery("")}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
          >
            <RotateCcw size={14} className="inline mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <p className="font-bold text-gray-900 text-sm">{selectedProjects.length} projects selected</p>
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">✅ Verify Selected</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">📤 Export</button>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onChange={handleSelectAll} className="rounded w-4 h-4" /></th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Project Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Developer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Units</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Delivery</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map(proj => (
                <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedProjects.includes(proj.id)} onChange={() => handleSelectProject(proj.id)} className="rounded w-4 h-4" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProject(proj)}>
                      <img src={proj.image} alt={proj.name} className="w-10 h-10 rounded object-cover" />
                      <p className="font-bold text-gray-900">{proj.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{proj.developer}</td>
                  <td className="px-4 py-3 text-gray-600">{proj.city}</td>
                  <td className="px-4 py-3 font-bold">{proj.units.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{proj.delivery}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${
                      proj.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {proj.status === "active" ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {proj.verified ? <Check size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-yellow-500" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedProject(proj)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button onClick={() => startVerify(proj)} className="p-1.5 hover:bg-gray-100 rounded text-purple-600"><Check size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail Panel */}
      {selectedProject && (
        <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Project Details</h2>
            <button onClick={() => setSelectedProject(null)} className="text-gray-400 text-2xl">×</button>
          </div>

          {/* Cover Image */}
          <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-48 object-cover" />

          {/* Title + Developer */}
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedProject.name}</h3>
            <p className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">{selectedProject.developer}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs font-bold px-2 py-1 rounded ${selectedProject.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {selectedProject.status === "active" ? "Active" : "Pending"}
              </span>
              {selectedProject.verified && <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">✓ Verified</span>}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 flex px-5">
            {["Details", "Units", "Developer", "Verify"].map(tab => (
              <button key={tab} className={`flex-1 py-3 font-bold text-xs border-b-2 ${tab === "Details" ? "text-orange-600 border-orange-600" : "text-gray-600 border-transparent"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Details Tab Content */}
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">About</p>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Total Units</p>
                <p className="font-black text-orange-600">{selectedProject.units.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Delivery</p>
                <p className="font-bold text-gray-900">{selectedProject.delivery}</p>
              </div>
            </div>

            {!selectedProject.verified && (
              <button onClick={() => startVerify(selectedProject)} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 mt-4">
                ✅ Verify Project
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Step {verifyStep} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(verifyStep / 4) * 100}%` }} />
              </div>
            </div>

            {verifyStep === 1 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Review Project Details</h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Name:</span><span className="font-bold text-gray-900">{verifyingProject.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Developer:</span><span className="font-bold text-gray-900">{verifyingProject.developer}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">City:</span><span className="font-bold text-gray-900">{verifyingProject.city}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Units:</span><span className="font-black text-orange-600">{verifyingProject.units.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Delivery:</span><span className="font-bold text-gray-900">{verifyingProject.delivery}</span></div>
                </div>
                <p className="font-bold text-gray-900 mb-4">Is the information accurate?</p>
                <div className="flex gap-3">
                  <button onClick={() => setVerifyStep(2)} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">Yes ✓</button>
                  <button className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">No — Request Edit</button>
                </div>
              </div>
            )}

            {verifyStep === 2 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Project Verification Checklist</h2>
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
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setVerifyStep(3)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Continue to Photos</button>
              </div>
            )}

            {verifyStep === 3 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Verification Photos & Notes</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <p className="text-sm text-gray-600">📸 Upload verification photos (min 3)</p>
                  <button className="mt-3 bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-lg">Choose Files</button>
                </div>
                <textarea placeholder="Verification notes..." value={verifyNotes} onChange={e => setVerifyNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-400 resize-none h-24"
                />
                <button onClick={() => setVerifyStep(4)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Review & Approve</button>
              </div>
            )}

            {verifyStep === 4 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Approve Verification</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800">All checklist items completed. Ready to approve verification.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">❌ Reject</button>
                  <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">✅ Grant Verification</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}