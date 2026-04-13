import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, Share2 } from "lucide-react";
import { useState } from "react";

const ARTICLES_DB = {
  1: {
    category: "Getting Started",
    icon: "🚀",
    title: "How to Create Your First Property Listing",
    excerpt: "Step-by-step guide to posting a property on Kemedar",
    views: 2400,
    content: `
## Introduction

Creating your first property listing on Kemedar is simple and straightforward. This guide will walk you through every step of the process.

## Getting Started

Before you begin, make sure you have:
- Clear photos of your property (at least 3)
- Property details (size, bedrooms, bathrooms)
- Location information
- Pricing information

## Step 1: Access the Listing Form

Log in to your Kemedar account and click "Add Property" from your dashboard or the main navigation menu.

## Step 2: Select Property Type

Choose the type of property you're listing:
- Residential (Apartment, Villa, House, etc.)
- Commercial (Office, Shop, Warehouse)
- Land
- Other

## Step 3: Add Basic Details

Fill in the essential information about your property:
- Property title (e.g., "Modern 2BR Apartment in New Cairo")
- Detailed description
- Number of bedrooms and bathrooms
- Property size in square meters

## Step 4: Set Your Price

Enter your asking price and select the currency. You can also mark the price as negotiable if desired.

## Step 5: Upload Photos

Upload at least 3 high-quality photos of your property. Make sure they're clear and well-lit. Photos are crucial for attracting interested buyers!

## Step 6: Add Location Details

- Select your country, province, city, and district
- Enter the full address
- Optionally pinpoint the location on the map

## Step 7: Review and Publish

Review all your information to ensure it's correct, then click "Publish" to make your listing live!

## Tips for Success

- Use descriptive language
- Take photos from different angles
- Update your listing regularly
- Respond quickly to inquiries
- Provide accurate information

Your listing is now live and visible to potential buyers and renters!
    `
  },
  2: {
    category: "Buying & Selling",
    icon: "💰",
    title: "Best Practices for Selling Property Fast",
    excerpt: "Tips and strategies to increase property visibility and sales",
    views: 3200,
    content: `
## Selling Your Property Successfully

Want to sell your property quickly? Follow these proven strategies to attract more buyers and close deals faster.

## Price Competitively

Research similar properties in your area to set a competitive price. Properties priced appropriately sell faster.

## Professional Photography

Invest in good quality photos. Blurry or poorly lit images reduce interest significantly.

## Detailed Description

Write a compelling description that highlights key features, amenities, and location benefits.

## Regular Updates

Keep your listing fresh by updating photos and information regularly. This keeps it visible to potential buyers.

## Quick Response

Answer inquiries quickly and thoroughly. Prompt responses significantly increase conversion rates.

## Premium Services

Consider using premium features like featured listings to increase visibility.

## Follow Up

Don't hesitate to follow up with interested buyers. Many sales are made through persistence.
    `
  }
};

export default function ArticleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [helpful, setHelpful] = useState(false);
  const article = ARTICLES_DB[parseInt(id)] || ARTICLES_DB[1];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate("/cp/user/knowledge")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Knowledge Base Article</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        {/* Article Header */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{article.icon}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{article.title}</h2>
          <p className="text-gray-500">{article.views} people found this helpful</p>
        </div>

        {/* Article Content */}
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 mb-8">
          {article.content.split('\n').map((line, idx) => {
            if (!line.trim()) return null;
            if (line.startsWith('## ')) {
              return <h2 key={idx} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- ')) {
              return <li key={idx} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
            }
            return <p key={idx} className="text-gray-700">{line}</p>;
          })}
        </div>

        {/* Helpful Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
          <p className="font-semibold text-gray-900 mb-4">Was this article helpful?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setHelpful(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                helpful
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300'
              }`}
            >
              <ThumbsUp size={16} />
              Yes, helpful
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${
                helpful === false
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-red-300'
              }`}
            >
              No, not helpful
            </button>
          </div>
        </div>

        {/* Share */}
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition">
          <Share2 size={16} />
          Share this article
        </button>
      </div>
    </div>
  );
}