"use client";
import { Calculator, Package } from "lucide-react";
import Link from "next/link";
export default function KemeKitsPage() {
  return (<div className="container mx-auto max-w-7xl py-8 px-4">
    <div className="text-center mb-8"><Package className="w-12 h-12 text-blue-600 mx-auto mb-3"/><h1 className="text-3xl font-bold">KemeKits</h1><p className="text-slate-500 mt-2 max-w-xl mx-auto">Pre-designed room material packages with everything you need to finish a room</p></div>
    <div className="grid md:grid-cols-3 gap-4">{["Living Room","Bedroom","Kitchen","Bathroom","Balcony","Full Apartment"].map(room=>(<div key={room} className="bg-white border rounded-xl p-6 hover:shadow-md transition text-center cursor-pointer"><div className="text-3xl mb-3">{{"Living Room":"🛋️","Bedroom":"🛏️","Kitchen":"🍳","Bathroom":"🚿","Balcony":"🌿","Full Apartment":"🏠"}[room]}</div><h3 className="font-bold">{room} Kit</h3><p className="text-sm text-slate-500 mt-1">Complete material package</p><Link href={`/kemetro/kemekits/${room.toLowerCase().replace(/ /g,"-")}`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">View Kit →</Link></div>))}</div>
    <div className="mt-8 text-center"><Link href="/kemetro/build" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-blue-700"><Calculator className="w-5 h-5"/>Custom BOQ Calculator</Link></div>
  </div>);
}
