"use client";

import { use } from "react";
import { useProperty, usePropertyValuation } from "@/hooks/use-properties";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize, Eye, Heart, Share2, Phone, MessageSquare,
  Check, Shield, ChevronLeft, Calendar, TrendingUp, Star, Gavel, BarChart3,
  ArrowLeftRight, Home, Layers, Building, CalendarDays, Hash
} from "lucide-react";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: property, isLoading, error } = useProperty(id);
  const { formatPrice } = useCurrency();
  const valuationMutation = usePropertyValuation(id);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/3" />
          <div className="h-96 bg-slate-100 rounded-xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-slate-100 rounded w-2/3" />
              <div className="h-32 bg-slate-100 rounded" />
            </div>
            <div className="h-48 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-slate-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/search/properties" className="text-blue-600 hover:underline">Browse Properties</Link>
      </div>
    );
  }

  const p = property;

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/search/properties" className="hover:text-blue-600">Properties</Link>
        <span>/</span>
        <span className="text-slate-800 truncate max-w-xs">{p.title}</span>
      </div>

      {/* Gallery */}
      <div className="rounded-xl overflow-hidden mb-6">
        {p.featuredImage ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px]">
            <div className="md:col-span-2 md:row-span-2 relative">
              <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {p.purpose?.name && <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg font-medium">{p.purpose.name}</span>}
                {p.isVerified && <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-lg font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>}
              </div>
            </div>
            {(p.imageGallery || []).slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="hidden md:block relative">
                <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                {i === 3 && (p.imageGallery?.length || 0) > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                    +{(p.imageGallery?.length || 0) - 4} more
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-300 text-6xl rounded-xl">
            🏠
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
                <p className="flex items-center gap-1 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  {[p.city?.name, p.address].filter(Boolean).join(", ") || "Egypt"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-blue-50">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mt-3">
              {p.isContactForPrice ? "Contact for Price" : formatPrice(p.priceAmount)}
            </div>
            {p.isNegotiable && <span className="text-sm text-green-600 font-medium">Negotiable</span>}
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4">
            <div className="text-center">
              <Bed className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-lg font-bold">3</div>
              <div className="text-xs text-slate-500">Bedrooms</div>
            </div>
            <div className="text-center">
              <Bath className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-lg font-bold">2</div>
              <div className="text-xs text-slate-500">Bathrooms</div>
            </div>
            <div className="text-center">
              <Maximize className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-lg font-bold">150 m²</div>
              <div className="text-xs text-slate-500">Area</div>
            </div>
            <div className="text-center">
              <Eye className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-lg font-bold">{p.viewCount || 0}</div>
              <div className="text-xs text-slate-500">Views</div>
            </div>
          </div>

          {/* Description */}
          {p.description && (
            <div>
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>
          )}

          {/* Details Table */}
          <div>
            <h2 className="text-xl font-bold mb-3">Property Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-white border rounded-xl p-4">
              {[
                { icon: Home, label: "Category", value: p.category?.name },
                { icon: Layers, label: "Purpose", value: p.purpose?.name },
                { icon: Shield, label: "Status", value: p.status?.name },
                { icon: Building, label: "Furnished", value: p.furnished?.name },
                { icon: Hash, label: "Property Code", value: p.propertyCode },
                { icon: CalendarDays, label: "Listed", value: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "" },
                { icon: Check, label: "Verify Level", value: p.verificationLevel ? `Level ${p.verificationLevel}` : "Level 1" },
              ].filter(row => row.value).map((row) => (
                <div key={row.label} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                  <row.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{row.label}:</span>
                  <span className="text-sm font-medium ml-auto">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2">
            {p.isAuction && (
              <Link href={`/kemedar/auctions`} className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-200">
                <Gavel className="w-4 h-4" /> KemedarBid Auction
              </Link>
            )}
            {p.isFracOffering && (
              <Link href={`/kemefrac/${p.fracPropertyId}`} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-200">
                <BarChart3 className="w-4 h-4" /> KemeFrac Investment
              </Link>
            )}
            {p.isOpenToSwap && (
              <Link href="/kemedar/swap" className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-pink-200">
                <ArrowLeftRight className="w-4 h-4" /> Open for Swap
              </Link>
            )}
          </div>

          {/* Distances */}
          {p.distances && p.distances.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">Nearby</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {p.distances.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                    <span className="text-sm font-medium">{d.poiName}</span>
                    <span className="text-sm text-slate-500">{d.distanceKm ? `${d.distanceKm} km` : d.distanceText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Valuation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">AI Property Valuation</h3>
            </div>
            {p.valuations?.[0] ? (
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatPrice(p.valuations[0].valuationAmountEGP)}</div>
                {p.valuations[0].investmentGrade && <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">Grade: {p.valuations[0].investmentGrade}</span>}
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-3">Get an AI-powered valuation estimate for this property</p>
                <button
                  onClick={() => valuationMutation.mutate()}
                  disabled={valuationMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {valuationMutation.isPending ? "Calculating..." : "Calculate Valuation"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact Box */}
          <div className="bg-white border rounded-xl p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {p.user?.name?.[0] || "K"}
              </div>
              <div>
                <div className="font-semibold">{p.user?.name || "Kemedar"}</div>
                <div className="text-xs text-slate-500 capitalize">{p.user?.role?.replace(/_/g, " ") || "Owner"}</div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700">
                <Phone className="w-4 h-4" /> Show Phone Number
              </button>
              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </button>
              <button className="w-full border py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-50">
                <Calendar className="w-4 h-4" /> Schedule Visit
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <Link href={`/kemedar/negotiate?propertyId=${id}`} className="block text-sm text-blue-600 hover:underline">
                Start Negotiation
              </Link>
              <Link href="/kemedar/life-score" className="block text-sm text-blue-600 hover:underline">
                Check Life Score
              </Link>
              <Link href="/kemedar/finish" className="block text-sm text-blue-600 hover:underline">
                Finishing Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
