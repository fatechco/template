import { useNavigate, useSearchParams } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const ARTICLES = [
  { slug: "how-to-add-property", title: "How to Add Your First Property Listing", category: "Getting Started", readMin: 3 },
  { slug: "subscription-plans", title: "Understanding Subscription Plans & Pricing", category: "Billing & Plans", readMin: 5 },
  { slug: "verify-account", title: "How to Verify Your Account Identity", category: "Account & Profile", readMin: 4 },
  { slug: "upload-documents", title: "Uploading Documents and Media Files", category: "Getting Started", readMin: 2 },
  { slug: "kemework-post-task", title: "How to Post a Task on Kemework", category: "Kemework Guide", readMin: 4 },
  { slug: "kemetro-order", title: "Placing Your First Kemetro Order", category: "Kemetro Guide", readMin: 3 },
  { slug: "boost-listing", title: "Boosting Your Listing with VERI & LIST Services", category: "Marketing Services", readMin: 6 },
  { slug: "contact-support", title: "How to Contact Kemedar Support", category: "Account & Profile", readMin: 2 },
];

export default function KnowledgeSearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const results = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  function highlight(text) {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase()
        ? <span key={i} className="text-orange-600 font-bold">{p}</span>
        : <span key={i}>{p}</span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title={`Search: "${query}"`} showBack />
      <div className="px-4 py-4">
        <p className="text-xs text-gray-500 mb-3">{results.length} results found</p>
        {results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-gray-700">No results found</p>
            <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
          </div>
        ) : results.map(a => (
          <button key={a.slug} onClick={() => navigate(`/m/dashboard/knowledge/${a.slug}`)}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left mb-3">
            <p className="text-[13px] font-black text-gray-900 mb-1">{highlight(a.title)}</p>
            <p className="text-[11px] text-orange-600 font-bold mb-1">{a.category}</p>
            <p className="text-[12px] text-gray-400 line-clamp-2">
              {highlight(`Find out everything you need to know about ${a.title.toLowerCase()} in this detailed guide.`)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}