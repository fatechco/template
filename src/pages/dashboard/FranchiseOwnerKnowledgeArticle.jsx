import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';

const ARTICLES = {
  "verify-properties": {
    title: "How to Verify Properties in Your Area",
    category: "Managing Properties",
    author: "Kemedar Team",
    date: "Mar 20, 2026",
    readTime: "5 min",
    content: `
# Property Verification Process

Property verification is a crucial part of maintaining quality on the Kemedar platform. As a Franchise Owner, you're responsible for verifying properties in your area.

## What is Property Verification?

Property verification involves confirming that:
- The property exists and matches the listing details
- The photos are accurate and current
- The pricing is reasonable for the area
- The owner has legal rights to list the property

## Step-by-Step Guide

### Step 1: Review the Property
Review all property details submitted in the system. Check:
- Property photos and videos
- Floor plans and documents
- Price and specifications
- Location and coordinates

### Step 2: Schedule a Site Visit
Contact the property owner and schedule a physical verification visit. Bring:
- Verification checklist
- Camera for photos/videos
- Measuring tape
- Your Kemedar ID

### Step 3: Complete the Inspection
During the visit, verify:
- Physical condition matches listing
- Room counts and sizes
- Amenities are present
- No hidden issues or damage

### Step 4: Document Findings
Take clear photos and notes. Update the property status in the system:
- ✅ Verified (publish immediately)
- ⚠️ Needs Updates (request corrections from owner)
- ❌ Reject (if major discrepancies found)

## Tips for Successful Verification

1. **Be Professional**: Always be courteous and professional with property owners
2. **Be Thorough**: Don't skip any items on the checklist
3. **Be Timely**: Aim to verify properties within 48 hours of request
4. **Be Documented**: Keep detailed notes of all verifications

## Common Issues

**Issue: Photos don't match the property**
- Request updated photos from owner
- Schedule a re-inspection

**Issue: Pricing seems incorrect**
- Compare with similar properties in area
- Contact owner to discuss and update if needed

**Issue: Property has structural damage**
- Document thoroughly
- Contact Kemedar support for guidance
    `
  },
  "franchise-duties": {
    title: "Franchise Owner Duties & Responsibilities",
    category: "Franchise Duties",
    author: "Kemedar Leadership",
    date: "Mar 19, 2026",
    readTime: "8 min",
    content: "Your responsibilities as a Franchise Owner include property verification, user management, financial reporting, and area development."
  },
};

export default function FranchiseOwnerKnowledgeArticle() {
  const { slug } = useParams();
  const article = ARTICLES[slug] || ARTICLES["verify-properties"];
  const [helpful, setHelpful] = useState(null);

  const headings = article.content.split('\n').filter(line => line.startsWith('#'));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm">
          <a href="/kemedar/franchise/knowledge" className="text-gray-600 hover:text-orange-600">Knowledge Base</a>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-orange-600 font-bold">{article.category}</span>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 font-bold">{article.title}</span>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 flex gap-8">
        {/* Left - Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">{article.category}</span>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>👤 {article.author}</span>
              <span>•</span>
              <span>📅 {article.date}</span>
              <span>•</span>
              <span>⏱ {article.readTime}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 py-8">
            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* Helpful */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <p className="font-bold text-gray-900 mb-3">Was this article helpful?</p>
              <div className="flex gap-3">
                <button onClick={() => setHelpful(true)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${helpful === true ? "bg-green-600 text-white" : "border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600"}`}>
                  <ThumbsUp size={16} /> Yes
                </button>
                <button onClick={() => setHelpful(false)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${helpful === false ? "bg-red-600 text-white" : "border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600"}`}>
                  <ThumbsDown size={16} /> No
                </button>
              </div>
              {helpful === false && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">Please help us improve</p>
                  <textarea placeholder="What could we improve?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:border-orange-400" />
                  <button className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700">Send Feedback →</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Sidebar */}
        <div className="w-80 flex-shrink-0">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 mb-6">
            <h3 className="font-black text-gray-900 mb-4">On This Page</h3>
            <div className="space-y-2">
              {headings.map((heading, i) => {
                const level = heading.match(/^#+/)[0].length;
                return (
                  <button key={i} className={`block text-left text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors ${level > 1 ? "ml-4" : ""}`}>
                    {heading.replace(/^#+\s/, "")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4">Related Articles</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <a key={i} href="#" className="block text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors">
                  <p>Related Article Title {i}</p>
                  <p className="text-xs text-gray-600 font-normal mt-1">5 min read</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}