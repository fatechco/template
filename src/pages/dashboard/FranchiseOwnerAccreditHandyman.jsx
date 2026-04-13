import { useState } from 'react';
import { Search, Award, Check } from 'lucide-react';

const PROFESSIONALS_DATA = [
  { id: 1, name: "Hassan Ibrahim", specialization: "Plumbing", rating: 4.9, jobsDone: 87, phone: "+201234567890", avatar: "HI" },
  { id: 2, name: "Karim Ali", specialization: "Electrical", rating: 4.8, jobsDone: 65, phone: "+201234567891", avatar: "KA" },
  { id: 3, name: "Mohamed Ahmed", specialization: "Carpentry", rating: 4.7, jobsDone: 54, phone: "+201234567892", avatar: "MA" },
  { id: 4, name: "Omar Khalid", specialization: "Painting", rating: 4.9, jobsDone: 72, phone: "+201234567893", avatar: "OK" },
  { id: 5, name: "Ahmed Hassan", specialization: "HVAC", rating: 4.6, jobsDone: 43, phone: "+201234567894", avatar: "AH" },
];

export default function FranchiseOwnerAccreditHandyman() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccreditModal, setShowAccreditModal] = useState(false);
  const [selectingPro, setSelectingPro] = useState(null);
  const [accreditForm, setAccreditForm] = useState({
    interview: false,
    skillsTest: false,
    backgroundCheck: false,
    idVerified: false,
    drugTest: false,
    workVerified: false,
    interviewDate: "",
    notes: "",
  });

  const filteredProfessionals = PROFESSIONALS_DATA.filter(p =>
    searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone.includes(searchQuery)
  );

  const startAccredit = (pro) => {
    setSelectingPro(pro);
    setShowAccreditModal(true);
    setAccreditForm({
      interview: false,
      skillsTest: false,
      backgroundCheck: false,
      idVerified: false,
      drugTest: false,
      workVerified: false,
      interviewDate: "",
      notes: "",
    });
  };

  const completeAccredit = () => {
    console.log("Professional accredited:", selectingPro, accreditForm);
    setShowAccreditModal(false);
    setSelectingPro(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-yellow-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} Kemework {">"} Accredit</p>
        <h1 className="text-3xl font-black text-gray-900">Accredit Handyman of Choice</h1>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3">
          <Award size={32} />
          <div>
            <p className="font-black text-lg">🏅 Kemedar Handyman of Choice Program</p>
            <p className="text-sm text-yellow-100 mt-2">Accredit professionals who meet Kemedar's quality standards. Once accredited, they receive the official ID card and appear in your verified handymen list.</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Find by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredProfessionals.map(pro => (
          <div key={pro.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {pro.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{pro.name}</p>
              <p className="text-xs text-gray-500">{pro.specialization}</p>
              <div className="flex gap-4 mt-1 text-xs">
                <span className="text-gray-600">⭐ {pro.rating} ({pro.jobsDone} jobs)</span>
                <span className="text-gray-600">📱 {pro.phone}</span>
              </div>
            </div>

            {/* Action */}
            <button onClick={() => startAccredit(pro)} className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-bold text-xs hover:bg-yellow-200">
              Accredit →
            </button>
          </div>
        ))}
      </div>

      {/* Accredit Modal */}
      {showAccreditModal && selectingPro && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Accredit Professional</h2>
            <p className="text-sm text-gray-600 mb-6">{selectingPro.name} • {selectingPro.specialization}</p>

            {/* Checklist */}
            <div className="mb-6 space-y-2">
              <p className="text-sm font-bold text-gray-900 mb-3">Verification Checklist</p>
              {[
                { key: "interview", label: "In-person interview done" },
                { key: "skillsTest", label: "Skills tested and verified" },
                { key: "backgroundCheck", label: "Background check cleared" },
                { key: "idVerified", label: "ID verified" },
                { key: "drugTest", label: "Drug test cleared" },
                { key: "workVerified", label: "Previous work verified" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={accreditForm[item.key]} onChange={e => setAccreditForm({...accreditForm, [item.key]: e.target.checked})} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Interview Date */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-700 block mb-2">Interview Date</label>
              <input type="date" value={accreditForm.interviewDate} onChange={e => setAccreditForm({...accreditForm, interviewDate: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-700 block mb-2">Notes</label>
              <textarea placeholder="Accreditation notes..." value={accreditForm.notes} onChange={e => setAccreditForm({...accreditForm, notes: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none h-20"
              />
            </div>

            {/* ID Card Info */}
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <p className="text-xs font-bold text-gray-700">ID Card Number (auto-generated)</p>
              <p className="text-sm font-black text-yellow-600 mt-1">KH-{Math.random().toString().slice(2, 8).toUpperCase()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setShowAccreditModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">
                ❌ Reject
              </button>
              <button onClick={completeAccredit} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-2.5 rounded-lg hover:opacity-90">
                ✅ Grant Accreditation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}