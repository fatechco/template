import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h1 className="text-4xl font-bold">Careers at Kemedar</h1>
        <p className="text-slate-500 mt-3">Join us in revolutionizing real estate in Egypt and MENA</p>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">We&apos;re Growing!</h3>
        <p className="text-slate-500">Check back soon for open positions or send your CV to careers@kemedar.com</p>
      </div>
    </div>
  );
}
