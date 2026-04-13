import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Share2, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
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

const ARTICLE_CONTENT = {
  "how-to-add-property": {
    title: "How to Add Your First Property Listing",
    category: "Getting Started",
    readMin: 3,
    updatedDate: "Mar 10, 2026",
    content: [
      { type: "heading", text: "Step-by-Step Guide" },
      { type: "paragraph", text: "Adding a property on Kemedar is simple and takes less than 5 minutes. Follow these steps to get your listing live." },
      { type: "steps", items: ["Tap the ➕ button at the bottom of the screen", "Select 'Property' from the listing types", "Fill in your property details: title, category, location", "Upload at least 3 high-quality photos", "Set your price and contact preferences", "Review and publish your listing"] },
      { type: "tip", text: "Properties with 5+ photos receive 3x more inquiries than listings with fewer images." },
      { type: "heading", text: "Required Information" },
      { type: "paragraph", text: "Make sure you have the following ready before starting:" },
      { type: "bullets", items: ["Property title (descriptive, 5+ words)", "Full address or area name", "Property category (Apartment, Villa, etc.)", "Price (sale or rent)", "At least 3 photos"] },
      { type: "warning", text: "Listings without photos may be automatically hidden from search results." },
    ],
    related: ["subscription-plans", "verify-account", "boost-listing"],
  },
};

const FEEDBACK_REASONS = ["Not enough detail", "Outdated info", "Wrong topic", "Other"];

function renderBlock(block, i) {
  switch (block.type) {
    case "heading":
      return <p key={i} className="text-[18px] font-black text-gray-900 mt-5 mb-2">{block.text}</p>;
    case "paragraph":
      return <p key={i} className="text-[15px] text-gray-700 leading-relaxed mb-3">{block.text}</p>;
    case "bullets":
      return (
        <ul key={i} className="mb-3 space-y-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[14px] text-gray-700">
              <span className="text-orange-400 mt-1">•</span>{item}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol key={i} className="mb-3 space-y-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[14px] text-gray-700">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{j + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <div key={i} className="border-l-4 border-orange-400 bg-orange-50 rounded-r-xl p-3 mb-3">
          <p className="text-[13px] font-bold text-orange-700">💡 Tip</p>
          <p className="text-[13px] text-orange-800 mt-0.5">{block.text}</p>
        </div>
      );
    case "warning":
      return (
        <div key={i} className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-3 mb-3">
          <p className="text-[13px] font-bold text-red-700">⚠️ Warning</p>
          <p className="text-[13px] text-red-800 mt-0.5">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function KnowledgeArticleDetail() {
  const { articleSlug } = useParams();
  const navigate = useNavigate();
  const [helpful, setHelpful] = useState(null);
  const [feedbackReason, setFeedbackReason] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const article = ARTICLE_CONTENT[articleSlug] || {
    title: "Article Not Found",
    category: "Help",
    readMin: 1,
    updatedDate: "—",
    content: [{ type: "paragraph", text: "This article could not be found." }],
    related: [],
  };

  const relatedArticles = (article.related || [])
    .map(slug => ARTICLES.find(a => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar
        title={article.title.length > 22 ? article.title.slice(0, 22) + "…" : article.title}
        showBack
        rightAction={<button><Share2 size={20} className="text-gray-700" /></button>}
      />

      <div className="px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          <p className="text-[20px] font-black text-gray-900 mb-3">{article.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">{article.category}</span>
            <span className="text-[11px] text-gray-400">{article.readMin} min read</span>
            <span className="text-[11px] text-gray-400">Updated {article.updatedDate}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          {article.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Helpful */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          {!helpful ? (
            <>
              <p className="font-black text-gray-900 text-sm mb-3">Was this article helpful?</p>
              <div className="flex gap-3">
                <button onClick={() => setHelpful("yes")} className="flex-1 flex items-center justify-center gap-2 border border-green-200 bg-green-50 text-green-700 font-bold py-2.5 rounded-xl text-sm">
                  <ThumbsUp size={16} /> Yes
                </button>
                <button onClick={() => setHelpful("no")} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm">
                  <ThumbsDown size={16} /> No
                </button>
              </div>
            </>
          ) : helpful === "yes" ? (
            <p className="text-center text-sm font-bold text-green-600">👍 Thanks for your feedback!</p>
          ) : submitted ? (
            <p className="text-center text-sm font-bold text-orange-600">Thank you! We'll use your feedback to improve.</p>
          ) : (
            <>
              <p className="font-black text-gray-900 text-sm mb-3">Sorry to hear that. Tell us why:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {FEEDBACK_REASONS.map(r => (
                  <button key={r} onClick={() => setFeedbackReason(r)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${feedbackReason === r ? "bg-orange-600 text-white border-orange-600" : "border-gray-200 text-gray-600"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                placeholder="Additional feedback (optional)..." rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400 mb-3" />
              <button onClick={() => setSubmitted(true)} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl text-sm">Submit</button>
            </>
          )}
        </div>

        {/* Related */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="font-black text-gray-900 text-sm mb-3">Related Articles</p>
            {relatedArticles.map((a, i) => (
              <button key={a.slug} onClick={() => navigate(`/m/dashboard/knowledge/${a.slug}`)}
                className={`w-full flex items-center gap-3 py-3 text-left ${i < relatedArticles.length - 1 ? "border-b border-gray-50" : ""}`}>
                <span className="text-xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{a.title}</p>
                  <p className="text-[11px] text-gray-400">{a.category} · {a.readMin} min read</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}