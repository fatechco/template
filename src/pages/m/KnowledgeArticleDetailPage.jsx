import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, ThumbsUp, Share2, MessageCircle } from "lucide-react";

const ARTICLES_DB = {
  "how-to-add-property": {
    title: "How to Add Your First Property Listing",
    category: "Getting Started",
    readMin: 3,
    updated: "Mar 20, 2026",
    views: 2340,
    helpful: 89,
    content: `
# Getting Started with Property Listings

Adding your first property listing to Kemedar is quick and straightforward. Follow these steps to get your property live.

## Step 1: Prepare Your Information

Before you start, gather the following details about your property:
- Property type (apartment, villa, etc.)
- Location details (address, city, district)
- Pricing information
- Property dimensions and features
- High-quality photos or videos

## Step 2: Access the Listing Form

1. Log in to your Kemedar account
2. Click on "Add Property" from your dashboard
3. Select the property type

## Step 3: Add Basic Details

Fill in the essential information:
- Property title and description
- Category (residential, commercial, etc.)
- Purpose (rent, sale, etc.)

## Step 4: Add Location

Select your property's location from the dropdown menus.

## Step 5: Upload Media

Upload at least 3 photos of your property. High-quality images help attract more buyers.

## Step 6: Set Pricing

Enter your property price and choose your currency.

## Step 7: Review & Publish

Review all details and click "Publish" to make your listing live!

## Tips for Better Results

- Use clear, well-lit photos
- Write a detailed description
- Update your property information regularly
- Respond quickly to inquiries

Need help? Contact our support team at support@kemedar.com
    `
  },
  "subscription-plans": {
    title: "Understanding Subscription Plans & Pricing",
    category: "Billing & Plans",
    readMin: 5,
    updated: "Mar 18, 2026",
    views: 1890,
    helpful: 76,
    content: `
# Kemedar Subscription Plans

Explore our flexible subscription options to find the perfect plan for your needs.

## Free Plan

- Up to 5 active listings
- Basic analytics
- Standard support
- No watermark on photos

## Professional Plan

- Up to 50 active listings
- Advanced analytics
- Priority support
- Featured listings (5 per month)

## Enterprise Plan

- Unlimited listings
- Full analytics suite
- Dedicated account manager
- Featured placement

## How to Upgrade

1. Go to your account settings
2. Click "Subscription"
3. Select your desired plan
4. Complete payment

All plans include access to our mobile app and 24/7 customer support.
    `
  },
  "verify-account": {
    title: "How to Verify Your Account Identity",
    category: "Account & Profile",
    readMin: 4,
    updated: "Mar 15, 2026",
    views: 3210,
    helpful: 92,
    content: `
# Account Verification Guide

Account verification helps build trust and unlock premium features on Kemedar.

## Why Verify Your Account?

- Increased credibility with buyers/renters
- Higher visibility in search results
- Access to premium features
- Priority support

## Verification Steps

### Step 1: Document Preparation

Prepare copies of:
- Government-issued ID
- Proof of address (utility bill, lease agreement)

### Step 2: Submit Documents

1. Navigate to Account Settings
2. Click "Verify Account"
3. Upload your documents

### Step 3: Verification Review

Our team reviews documents within 24-48 hours.

## Document Requirements

- Clear, readable images
- Valid government ID
- Recent proof of address
- All information must match

Verification is free and takes only a few minutes!
    `
  },
  "upload-documents": {
    title: "Uploading Documents and Media Files",
    category: "Getting Started",
    readMin: 2,
    updated: "Mar 12, 2026",
    views: 1540,
    helpful: 85,
    content: `
# Uploading Documents and Media Files

Learn how to upload images, PDFs, and other documents to your Kemedar account.

## Supported File Types

- Images: JPG, PNG, WEBP (max 10MB each)
- Documents: PDF (max 20MB)
- Videos: MP4 (max 100MB)

## How to Upload Property Photos

1. Go to your property listing
2. Click "Edit Listing"
3. Scroll to the Media section
4. Tap "Add Photos"
5. Select files from your device

## Tips for Best Results

- Use landscape orientation for property photos
- Ensure good lighting in all photos
- Upload at least 5 photos per listing
- Include photos of all rooms

## Uploading Verification Documents

For account verification, documents must be:
- Clear and fully visible
- Not expired
- Showing all four corners

Contact support if you have trouble uploading files.
    `
  },
  "kemework-post-task": {
    title: "How to Post a Task on Kemework",
    category: "Kemework Guide",
    readMin: 4,
    updated: "Mar 8, 2026",
    views: 2100,
    helpful: 88,
    content: `
# How to Post a Task on Kemework

Posting a task connects you with skilled professionals ready to help.

## What is a Task?

A task is a specific job you need done — from repairs to renovation, design to logistics.

## Steps to Post a Task

1. Open the Kemework section from your dashboard
2. Tap "Post a Task"
3. Select the task category
4. Describe your task in detail
5. Set your budget range
6. Choose your preferred timeline
7. Review and submit

## Writing a Good Task Description

Include:
- What exactly needs to be done
- Location or online preference
- Any special requirements
- Your preferred timeline

## Receiving Bids

Once posted, professionals will submit bids within hours. You can:
- Compare bids and profiles
- Chat with candidates
- Accept the best offer

Your task is live for 30 days by default.
    `
  },
  "kemetro-order": {
    title: "Placing Your First Kemetro Order",
    category: "Kemetro Guide",
    readMin: 3,
    updated: "Mar 5, 2026",
    views: 1780,
    helpful: 83,
    content: `
# Placing Your First Kemetro Order

Kemetro is Kemedar's marketplace for building materials, furniture, and supplies.

## Browse & Search

1. Go to the Kemetro section
2. Browse by category or search by name
3. Filter by price, location, and ratings

## Adding to Cart

- Tap a product to view details
- Select quantity
- Tap "Add to Cart"

## Checkout Process

1. Review your cart
2. Enter delivery address
3. Choose payment method
4. Confirm your order

## After Ordering

- Track your order in "My Orders"
- Receive SMS/email updates
- Contact seller through the order page if needed

## Returns & Issues

If you receive a damaged item, report it within 48 hours through the order detail page.
    `
  },
  "boost-listing": {
    title: "Boosting Your Listing with VERI & LIST Services",
    category: "Marketing Services",
    readMin: 6,
    updated: "Feb 28, 2026",
    views: 2950,
    helpful: 91,
    content: `
# Boost Your Listing with Kemedar Premium Services

Get more visibility and attract more buyers with our paid promotion tools.

## VERI — Verification Service

Get your property officially verified by our team:
- Physical inspection by a Kemedar agent
- Professional photography included
- "Verified" badge on your listing
- Higher ranking in search results

## LIST — Professional Listing

Our team creates a professional listing for you:
- Copywritten title and description
- Optimized keywords for search
- Professional photo editing

## UP — Boost Your Listing

Temporarily boost your listing to the top:
- Appears at the top of search for 7 or 30 days
- Higher click-through rate
- Great for time-sensitive listings

## CAMPAIGN — Social Media Campaign

Reach buyers outside Kemedar:
- Facebook and Instagram ads
- Targeted to property buyers in your area
- Performance report included

## How to Order

1. Go to your listing
2. Tap "Promote This Listing"
3. Select a service package
4. Complete payment

Contact your local representative for bulk pricing.
    `
  },
  "contact-support": {
    title: "How to Contact Kemedar Support",
    category: "Account & Profile",
    readMin: 2,
    updated: "Mar 20, 2026",
    views: 4200,
    helpful: 95,
    content: `
# How to Contact Kemedar Support

We're here to help! Here are all the ways to reach our team.

## In-App Support

1. Go to your dashboard
2. Tap "Contact Kemedar"
3. Choose your preferred contact method

## Support Channels

- **Live Chat**: Available 9am–9pm daily
- **Voice Chat**: Speak with a representative
- **Video Chat**: For complex issues
- **Tickets**: For non-urgent matters (response within 24h)
- **Email**: support@kemedar.com

## Your Extension Number

Every Kemedar user gets a personal extension number (EXT-XXXX) for direct dialing through our platform app.

## Creating a Support Ticket

1. Go to Help & Support
2. Tap "Create Ticket"
3. Choose category and priority
4. Describe your issue
5. Attach screenshots if needed

## Response Times

- Live chat: Immediate
- Tickets: Within 24 hours
- Email: Within 48 hours

We're always happy to help!
    `
  }
};

export default function KnowledgeArticleDetailPage() {
  const navigate = useNavigate();
  const { articleSlug } = useParams();
  const [helpful, setHelpful] = useState(false);
  
  const article = ARTICLES_DB[articleSlug] || ARTICLES_DB["how-to-add-property"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/m/cp/user/knowledge")} className="p-1">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="text-sm font-bold text-gray-500">Article</span>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition">
          <Search size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Article Content */}
      <div className="px-4 py-6">
        {/* Category & Meta */}
        <div className="mb-4">
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-gray-900 mb-3">{article.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span>📅 Updated {article.updated}</span>
          <span>👁 {article.views.toLocaleString()} views</span>
          <span>⏱ {article.readMin}m read</span>
        </div>

        {/* Article Body */}
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 mb-8">
          {article.content.split('\n').map((line, idx) => {
            if (!line.trim()) return null;
            if (line.startsWith('# ')) {
              return <h1 key={idx} className="text-xl font-black text-gray-900 mt-6 mb-3">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={idx} className="text-lg font-bold text-gray-900 mt-5 mb-2">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- ')) {
              return <li key={idx} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
            }
            return <p key={idx} className="text-gray-700">{line}</p>;
          })}
        </div>

        {/* Helpful Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 mb-6">
          <p className="text-sm font-bold text-gray-900">Was this article helpful?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${
                helpful
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp size={16} />
              Yes ({article.helpful}%)
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                helpful === false
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Related & Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition">
            <Share2 size={16} />
            Share
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition">
            <MessageCircle size={16} />
            Ask
          </button>
        </div>

        {/* Need More Help */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-700 mb-3">Still need help?</p>
          <button
            onClick={() => navigate("/m/cp/user/tickets")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg transition"
          >
            Create a Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
}