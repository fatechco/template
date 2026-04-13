import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart, Share2, Printer, AlertTriangle, MapPin,
  BedDouble, Bath, Maximize2, Home, ChevronRight,
  Play, FileText, Eye, Megaphone
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyDetailsTable from "@/components/property/PropertyDetailsTable";
import ContactBox from "@/components/property/ContactBox";
import SimilarProperties from "@/components/property/SimilarProperties";
import PropertyInvestmentWidget from "@/components/valuation/PropertyInvestmentWidget";
import NegotiateEntryCard from "@/components/negotiate/NegotiateEntryCard";
import FinishingSimulatorBanner from "@/components/finishing/FinishingSimulatorBanner";
import ShopTheLookSection from "@/components/shop-the-look/ShopTheLookSection";
import LifeScorePropertyWidget from "@/components/life-score/LifeScorePropertyWidget";
import KemedarTwinWidget from "@/components/twin/KemedarTwinWidget";
import FinishProjectBadge from "@/components/finish/FinishProjectBadge";
import VerifyProBadge from "@/components/verify/VerifyProBadge";
import VerifyProPanel from "@/components/verify/VerifyProPanel";
import AuctionBidSidebar from "@/components/auctions/AuctionBidSidebar";
import PropertyPredictSection from "@/components/predict/PropertyPredictSection";
import VoiceMessagePlayer from "@/components/property/VoiceMessagePlayer";
import NearbyDistancesDisplay from "@/components/distance/NearbyDistancesDisplay";

const PURPOSE_COLORS = {
  "For Sale": "bg-blue-600",
  "For Rent": "bg-green-600",
  "For Investment": "bg-purple-600",
  "For Daily Booking": "bg-pink-600",
  "In Auction": "bg-red-600",
};

const MOCK_AMENITIES = ["Gym", "Swimming Pool", "Parking", "Security 24/7", "Elevator", "Garden", "Balcony", "Central A/C", "Kids Area", "BBQ Area", "Mosque", "Mall Access"];

const MOCK_SIMILAR = Array.from({ length: 6 }, (_, i) => ({
  id: `sim-${i}`,
  title: ["Luxury Penthouse Downtown", "Modern Villa Sheikh Zayed", "Cozy Studio Maadi", "Family Apartment New Cairo", "Duplex 6th October", "Chalet North Coast"][i],
  purpose: ["For Sale", "For Rent", "For Sale", "For Rent", "For Sale", "For Daily Booking"][i],
  price_amount: [4500000, 250000, 85000, 1800000, 1200000, 750000][i],
  currency: "EGP",
  beds: [4, 5, 1, 3, 4, 3][i],
  baths: [3, 4, 1, 2, 3, 2][i],
  area_size: [320, 450, 55, 185, 240, 160][i],
  city_name: ["Downtown Cairo", "Sheikh Zayed", "Maadi", "New Cairo", "6th October", "North Coast"][i],
}));

const MOCK_PROPERTY = {
  id: "mock-1",
  title: "Luxury Apartment with Lake View | Premium Finishing | New Cairo",
  purpose: "For Sale",
  category_name: "Apartment",
  price_amount: 3500000,
  currency: "EGP",
  area_size: 185,
  beds: 3,
  baths: 2,
  floor_number: 8,
  total_floors: 15,
  year_built: 2021,
  is_featured: true,
  is_verified: true,
  property_code: "KMD-00123",
  address: "Building 12, 5th Settlement, New Cairo, Cairo, Egypt",
  city_name: "New Cairo",
  district_name: "5th Settlement",
  area_name: "El Rehab",
  latitude: 30.0444,
  longitude: 31.2357,
  publisher_name: "Ahmed Hassan",
  publisher_type: "Agent",
  direct_phone: "+20 100 123 4567",
  description: `A stunning 3-bedroom apartment in the heart of New Cairo, offering breathtaking lake views and premium finishes throughout.

This property features:
- Spacious open-plan living and dining area
- Fully equipped kitchen with high-end appliances
- Master bedroom with en-suite bathroom and walk-in closet
- Two additional bedrooms with built-in wardrobes
- Large balcony with panoramic views
- Private parking space
- 24/7 security and concierge service

The apartment is located in a prime location close to major malls, international schools, and business districts. Perfect for families and investors seeking premium real estate in New Cairo.`,
  amenity_ids: MOCK_AMENITIES,
  tags: ["lake-view", "new-cairo", "premium", "ready-to-move", "installment", "family", "5th-settlement"],
  nearby_distances_static: [
    { id: "d1", distanceValue: 1.2, distanceUnit: "km", field: { name: "Metro Station", nameAr: "محطة مترو", icon: "🚇", category: "transport" } },
    { id: "d2", distanceValue: 5, distanceUnit: "min", transportMode: "driving", field: { name: "Cairo Airport", nameAr: "مطار القاهرة", icon: "✈️", category: "transport" } },
    { id: "d3", distanceValue: 0.8, distanceUnit: "km", field: { name: "International School", nameAr: "مدرسة دولية", icon: "🎓", category: "education" } },
    { id: "d4", distanceValue: 2.1, distanceUnit: "km", field: { name: "City Stars Mall", nameAr: "سيتي ستارز", icon: "🛒", category: "shopping" } },
    { id: "d5", distanceValue: 1.5, distanceUnit: "km", field: { name: "Hospital", nameAr: "مستشفى", icon: "🏥", category: "health" } },
    { id: "d6", distanceValue: 0.3, distanceUnit: "km", field: { name: "Mosque", nameAr: "مسجد", icon: "🕌", category: "religion" } },
  ],
  vr_video_link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  floor_plan_file: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  image_gallery: [
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  ],
  youtube_links: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [similarProperties, setSimilarProperties] = useState(MOCK_SIMILAR);
  const [currentUser, setCurrentUser] = useState(null);
  const [auctionData, setAuctionData] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxShopMode, setLightboxShopMode] = useState(false);

  useEffect(() => { base44.auth.me().then(setCurrentUser).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    base44.entities.Property.filter({ id })
      .then((data) => {
        if (data && data.length > 0) {
          setProperty(data[0]);
          // Fetch similar
          base44.entities.Property.filter({ is_active: true }, "-created_date", 8)
            .then((sims) => setSimilarProperties(sims.length > 0 ? sims.filter(p => p.id !== data[0].id) : MOCK_SIMILAR))
            .catch(() => {});
        } else {
          setProperty(MOCK_PROPERTY);
        }
      })
      .catch(() => setProperty(MOCK_PROPERTY))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch auction data if property is an auction
  useEffect(() => {
    if (!property?.isAuction || !property?.id) return;
    base44.entities.PropertyAuction.filter({ propertyId: property.id }, "-created_date", 1)
      .then(data => { if (data?.[0]) setAuctionData(data[0]); })
      .catch(() => {});
  }, [property?.id, property?.isAuction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-[460px] bg-gray-200 rounded-2xl" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images = property.image_gallery?.length > 0 ? property.image_gallery : (property.featured_image ? [property.featured_image] : []);
  const pricePerSqm = property.price_amount && property.area_size
    ? Math.round(property.price_amount / property.area_size).toLocaleString()
    : null;
  const purposeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";
  const amenities = Array.isArray(property.amenity_ids) ? property.amenity_ids : MOCK_AMENITIES;
  const descText = property.description || "";
  const descShort = descText.length > 400;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1 transition-colors">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/search-properties" className="hover:text-[#FF6B00] transition-colors">Properties</Link>
          <ChevronRight size={12} />
          {property.category_name && (
            <>
              <span className="hover:text-[#FF6B00] cursor-pointer">{property.category_name}</span>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-gray-600 truncate max-w-xs">{property.title}</span>
        </nav>

        {/* Title + Meta */}
        <div className="mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl xl:text-3xl font-black text-gray-900 leading-tight mb-2">{property.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                <MapPin size={14} className="text-[#FF6B00]" />
                {[property.address, property.area_name, property.district_name, property.city_name].filter(Boolean).join(", ")}
              </p>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`${purposeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {property.purpose || "FOR SALE"}
                </span>
                {property.category_name && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{property.category_name}</span>
                )}
                {property.is_featured && (
                  <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-full">⭐ FEATURED</span>
                )}
                {property.is_verified && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">✓ VERIFIED</span>
                )}
                <VerifyProBadge level={property.verification_level} />
              </div>
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: Heart, label: "Save", action: () => setSaved(!saved), active: saved, activeClass: "text-red-500 border-red-300" },
                  { icon: Share2, label: "Share", action: () => { if (navigator.share) { navigator.share({ title: property.title, url: window.location.href }).catch(() => navigator.clipboard?.writeText(window.location.href)); } else { navigator.clipboard?.writeText(window.location.href); } } },
                  { icon: Printer, label: "Print", action: () => window.print() },
                  { icon: AlertTriangle, label: "Report", action: () => {} },
                ].map(({ icon: Icon, label, action, active, activeClass }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:border-[#FF6B00] hover:text-[#FF6B00] ${active ? activeClass : "border-gray-200 text-gray-600"}`}
                  >
                    <Icon size={13} className={active ? "fill-red-400" : ""} /> {label}
                  </button>
                ))}
                {/* Promote Button */}
                <Link
                  to="/m/buy"
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#FF6B00] text-[#FF6B00] bg-orange-50 hover:bg-[#FF6B00] hover:text-white transition-all"
                >
                  <Megaphone size={13} /> Promote
                </Link>
              </div>
            </div>
            {/* Price top-right */}
            <div className="text-right flex-shrink-0">
              <p className="text-3xl xl:text-4xl font-black text-[#FF6B00]">
                {property.is_contact_for_price ? "Contact for Price" : property.price_amount ? `${Number(property.price_amount).toLocaleString()} ${property.currency || "USD"}` : "Price on Request"}
              </p>
              {pricePerSqm && <p className="text-xs text-gray-400 mt-1">{pricePerSqm} {property.currency}/m²</p>}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-6">
          <PropertyGallery images={images} propertyId={property.id} />
        </div>

        {/* Kemedar Twin Widget */}
        <KemedarTwinWidget property={property} hasVirtualTour={false} />

        {/* Two-col layout */}
        <div className="flex gap-6 items-start">

          {/* LEFT 70% */}
          <div className="flex-[2.3] min-w-0 flex flex-col gap-5">

            {/* Key Facts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Key Facts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { icon: BedDouble, label: "Bedrooms", value: property.beds ?? "—" },
                  { icon: Bath, label: "Bathrooms", value: property.baths ?? "—" },
                  { icon: Maximize2, label: "Area", value: property.area_size ? `${property.area_size} m²` : "—" },
                  { icon: Home, label: "Floor", value: property.floor_number ?? "—" },
                  { icon: Eye, label: "Year Built", value: property.year_built ?? "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center bg-orange-50 rounded-xl p-3 text-center">
                    <Icon size={20} className="text-[#FF6B00] mb-1.5" />
                    <p className="font-black text-gray-900 text-base">{String(value)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Message */}
            {property.voice_recording_url && <VoiceMessagePlayer url={property.voice_recording_url} />}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> About This Property
              </h3>
              <div className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${!descExpanded && descShort ? "line-clamp-6" : ""}`}>
                {descText || "No description provided."}
              </div>
              {descShort && (
                <button onClick={() => setDescExpanded(!descExpanded)} className="text-[#FF6B00] text-sm font-bold mt-2 hover:underline">
                  {descExpanded ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>

            {/* Verify Pro Panel */}
            <VerifyProPanel property={property} user={currentUser} />

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Features & Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="w-5 h-5 bg-[#FF6B00]/10 rounded flex items-center justify-center text-[#FF6B00] font-bold text-xs">✓</span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {property.tags?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.tags.map(tag => (
                    <span key={tag} className="bg-orange-50 text-[#FF6B00] border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Distances */}
            <NearbyDistancesDisplay entityType="property" entityId={property.id} staticItems={property.nearby_distances_static} />

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Location
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                <MapPin size={13} className="text-[#FF6B00]" />
                {property.address || `${property.city_name || ""}, ${property.district_name || ""}`}
              </p>
              {property.latitude && property.longitude ? (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <iframe
                    title="Property Location"
                    width="100%"
                    height="280"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                    className="block"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">
                  Map not available
                </div>
              )}
            </div>

            {/* Media */}
            {(property.youtube_links?.length > 0 || property.vr_video_link || property.floor_plan_file) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Media
                </h3>
                {property.youtube_links?.[0] && (
                  <div className="rounded-xl overflow-hidden mb-4">
                    <iframe
                      width="100%"
                      height="280"
                      src={property.youtube_links[0].replace("watch?v=", "embed/")}
                      title="Property Video"
                      allowFullScreen
                      className="block"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {property.vr_video_link && (
                    <a href={property.vr_video_link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
                      <Play size={15} /> VR Virtual Tour
                    </a>
                  )}
                  {property.floor_plan_file && (
                    <a href={property.floor_plan_file} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
                      <FileText size={15} /> Floor Plan
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Predict™ Forecast */}
            <PropertyPredictSection property={property} />

            {/* Shop the Look section */}
            <ShopTheLookSection
              propertyId={property.id}
              images={images}
              onOpenLightbox={(idx, shopMode) => {
                setLightboxIndex(idx);
                setLightboxShopMode(shopMode);
              }}
            />

            {/* Details Table */}
            <PropertyDetailsTable property={property} />
          </div>

          {/* RIGHT 30% */}
          <div className="w-[320px] flex-shrink-0 sticky top-[90px] flex flex-col gap-4">
            {auctionData && <AuctionBidSidebar auction={auctionData} />}
            <LifeScorePropertyWidget
              districtId={property.district_id}
              areaId={property.area_id}
              cityId={property.city_id}
            />
            <FinishProjectBadge propertyId={property.id} />
            <FinishingSimulatorBanner property={property} />
            <NegotiateEntryCard property={property} />
            <ContactBox property={property} />
            <PropertyInvestmentWidget />

            {/* Franchise Owner Verification Card */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">K</div>
                <div>
                  <p className="font-black text-sm leading-tight">KEMEDAR VERI</p>
                  <p className="text-[10px] text-gray-300">Property Verification Service</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Get this property verified by a <span className="text-[#FF6B00] font-bold">Kemedar Franchise Owner</span> in your area. Verified properties sell faster and attract more serious buyers.
              </p>
              <div className="space-y-2 mb-4">
                {["On-site physical inspection", "Title deed verification", "Verified badge on listing", "Priority in search results"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-200">
                    <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[9px] flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="tel:+1234567890"
                className="block w-full text-center bg-[#FF6B00] hover:bg-orange-500 text-white font-bold text-sm py-2.5 rounded-xl transition-colors mb-2"
              >
                📞 Contact Franchise Owner
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
              >
                💬 WhatsApp
              </a>
              <p className="text-[10px] text-gray-400 text-center mt-3">Franchise owner covers your area</p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <SimilarProperties title="Similar Properties" properties={similarProperties} />
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}