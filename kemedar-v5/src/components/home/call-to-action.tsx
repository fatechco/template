// @ts-nocheck
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to List Your Property?</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            Join thousands of property owners who trust Kemedar. List for free and reach millions of buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/create-property" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-50 transition">
              <Plus className="w-4 h-4" />
              List Property Free
            </Link>
            <Link href="/search/properties" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition">
              <Search className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
