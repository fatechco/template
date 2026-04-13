import { useState } from "react";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";

const STEPS = [
  { id: 1, title: "Complete your franchise profile", desc: "Add your business information, license number, and profile photo.", done: true, to: "/dashboard/business-profile" },
  { id: 2, title: "Add your coverage area", desc: "Define the cities and districts you are responsible for.", done: true, to: "/dashboard/area-properties" },
  { id: 3, title: "Add first employee", desc: "Invite a team member and assign their first task.", done: false, to: "/dashboard/employees" },
  { id: 4, title: "Setup payment method", desc: "Add a bank account or XeedWallet to receive your commissions.", done: false, to: "/dashboard/payment-methods" },
  { id: 5, title: "Upload company documents", desc: "Upload your commercial license and official documentation.", done: false, to: "/dashboard/files" },
  { id: 6, title: "Connect your social pages", desc: "Link your Facebook, Instagram, and LinkedIn business pages.", done: false, to: "/dashboard/profile" },
  { id: 7, title: "Send first bulk message", desc: "Welcome the users in your area with an introductory message.", done: false, to: "/dashboard/bulk-comms" },
  { id: 8, title: "Complete knowledge base training", desc: "Read and complete the Franchise Owner onboarding guide.", done: false, to: "/dashboard/knowledge" },
];

export default function FranchiseBizSetup() {
  const [steps, setSteps] = useState(STEPS);
  const completed = steps.filter(s => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  const toggle = id => setSteps(s => s.map(step => step.id === id ? { ...step, done: !step.done } : step));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚙️ Setup My System</h1>
        <p className="text-gray-500 text-sm mt-0.5">Complete your onboarding to get the most out of your franchise area</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-800">Onboarding Progress</p>
          <span className="text-lg font-black text-orange-500">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-gray-500">{completed} of {steps.length} steps completed</p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.id} className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 transition-all ${step.done ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}>
            <button onClick={() => toggle(step.id)} className="flex-shrink-0 mt-0.5">
              {step.done
                ? <CheckCircle size={22} className="text-green-500" />
                : <Circle size={22} className="text-gray-300" />}
            </button>
            <div className="flex-1">
              <p className={`font-bold text-sm ${step.done ? "line-through text-gray-400" : "text-gray-900"}`}>{step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
            </div>
            {!step.done && (
              <a href={step.to} className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex-shrink-0 transition-colors">
                Complete <ChevronRight size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}