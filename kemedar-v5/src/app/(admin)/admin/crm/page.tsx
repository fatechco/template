"use client";
import { useCRMContacts } from "@/hooks/use-crm";
import { Users, Search } from "lucide-react";
import { useState } from "react";

export default function AdminCRMPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCRMContacts({ search: search || undefined });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-sm text-slate-500 mt-1">Contact relationship management</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Contacts", value: data?.pagination?.total || 0 },
          { label: "New Leads", value: 0 },
          { label: "Qualified", value: 0 },
          { label: "Opportunities", value: 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-xl p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>CRM contacts, opportunities, pipelines, tasks, calls, messages, automation</p>
      </div>
    </div>
  );
}
