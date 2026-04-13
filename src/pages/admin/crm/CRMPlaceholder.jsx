// Reusable placeholder for CRM pages not yet fully implemented
export default function CRMPlaceholder({ title, description, icon = "💼", comingSoon }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
          {icon}
        </div>
        <h2 className="text-lg font-black text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 max-w-md">
          {comingSoon || `This page is part of the Kemedar CRM module and will be fully implemented in the next phase. The data schema and routes are already wired.`}
        </p>
        <div className="mt-6 flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 bg-violet-500 rounded-full" />
          <span className="text-xs font-bold text-violet-700">CRM Admin Module — Phase 2</span>
        </div>
      </div>
    </div>
  );
}