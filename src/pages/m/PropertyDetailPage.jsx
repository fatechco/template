import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Heart, Phone, MessageCircle, Mail,
  ChevronDown, ChevronUp, MapPin, Bed, Bath, Maximize2,
  Building2, Share2, Printer, AlertTriangle, Megaphone,
  Calendar, Video, Play, FileText, ShieldCheck, Eye, Star, MapPinned
} from "lucide-react";
import MobilePropertyCard from "@/components/mobile-v2/MobilePropertyCard";
import NegotiateEntryCard from "@/components/negotiate/NegotiateEntryCard";
import FinishingSimulatorBanner from "@/components/finishing/FinishingSimulatorBanner";
import MobileHotspotDot from "@/components/shop-the-look/MobileHotspotDot";
import KemetroBottomSheet from "@/components/shop-the-look/KemetroBottomSheet";
import { base44 } from "@/api/base44Client";

function getSessionId() {
  let sid = sessionStorage.getItem("stl_session");
  if (!sid) { sid = Math.random().toString(36).slice(2); sessionStorage.setItem("stl_session", sid); }
  return sid;
}

const MOCK_PROPERTY = {
  id: "1",
  title: "Luxury Apartment with Lake View | Premium Finishing | New Cairo",
  price_amount: 3500000,
  currency: "EGP",
  purpose: "For Sale",
  category_name: "Apartment",
  is_featured: true,
  is_verified: true,
  property_code: "KMD-00123",
  city_name: "New Cairo",
  district_name: "5th Settlement",
  area_name: "El Rehab",
  address: "Building 12, 5th Settlement, New Cairo, Cairo, Egypt",
  beds: 3,
  baths: 2,
  area_size: 185,
  floor_number: 8,
  total_floors: 15,
  year_built: 2021,
  publisher_name: "Ahmed Hassan",
  publisher_type: "Agent",
  direct_phone: "+20 100 123 4567",
  description: `A stunning 3-bedroom apartment in the heart of New Cairo, offering breathtaking lake views and premium finishes throughout.\n\nThis property features:\n- Spacious open-plan living and dining area\n- Fully equipped kitchen with high-end appliances\n- Master bedroom with en-suite bathroom and walk-in closet\n- Two additional bedrooms with built-in wardrobes\n- Large balcony with panoramic views\n- Private parking space\n- 24/7 security and concierge service\n\nThe apartment is located in a prime location close to major malls, international schools, and business districts. Perfect for families and investors.`,
  amenities: ["Gym", "Swimming Pool", "Parking", "Security 24/7", "Elevator", "Garden", "Balcony", "Central A/C", "Kids Area", "BBQ Area", "Mosque", "Mall Access"],
  images: [
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  ],
  youtube_links: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
  latitude: 30.0444,
  longitude: 31.2357,
  details: [
    ["Category", "Apartment"],
    ["Purpose", "For Sale"],
    ["Status", "Ready"],
    ["Furnished", "Semi Furnished"],
    ["Year Built", "2021"],
    ["Floor", "8th of 15"],
    ["Total Area", "185 sqm"],
    ["Beds", "3"],
    ["Baths", "2"],
    ["Reference", "KMD-00123"],
    ["Publisher", "Agent"],
  ],
};

const SIMILAR = Array.from({ length: 4 }, (_, i) => ({
  id: String(i + 10),
  title: ["Modern Villa", "Studio Apartment", "Penthouse", "Duplex"][i],
  price: ["EGP 8M", "EGP 1.2M", "EGP 4.5M", "EGP 3M"][i],
  city: "Cairo",
  purpose: "For Sale",
  beds: [4, 1, 3, 3][i],
  baths: [3, 1, 2, 2][i],
  area: [350, 65, 220, 200][i],
  image: `https://images.unsplash.com/photo-${["1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1502672260266-1c1ef2d93688", "1493809842364-78817add7ffb"][i]}?w=400&q=80`,
}));

const PURPOSE_COLORS = {
  "For Sale": "bg-blue-600",
  "For Rent": "bg-green-600",
  "For Investment": "bg-purple-600",
  "For Daily Booking": "bg-pink-600",
};

function ImageGallery({ images, propertyId }) {
  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shopMode, setShopMode] = useState(false);
  const [shoppableMap, setShoppableMap] = useState({});
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const touchStartX = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (!images?.length) return;
    const load = async () => {
      const map = {};
      await Promise.all(images.map(async (imgUrl) => {
        try {
          const records = await base44.entities.AnalyzedPropertyImage.filter({
            imageUrl: imgUrl, isAnalyzed: true, isShoppable: true,
          });
          if (records?.length) {
            const hotspots = await base44.entities.ImageHotspot.filter(
              { imageId: records[0].id, isActive: true }, "sortOrder", 20
            );
            map[imgUrl] = { imageRecord: records[0], hotspots: hotspots || [] };
          }
        } catch { /* ignore */ }
      }));
      setShoppableMap(map);
    };
    load();
  }, [JSON.stringify(images)]);

  const currentImgUrl = images[current];
  const currentShoppable = shoppableMap[currentImgUrl];
  const currentHotspots = currentShoppable?.hotspots || [];
  const isCurrentShoppable = !!currentShoppable;

  const handleTouchStart = (e) => {
    if (shopMode) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (shopMode || touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && current < images.length - 1) { setCurrent(c => c + 1); setShopMode(false); }
    if (diff < -50 && current > 0) { setCurrent(c => c - 1); setShopMode(false); }
    touchStartX.current = null;
  };

  const handleHotspotTap = async (hotspot) => {
    setActiveHotspot(hotspot);
    setSheetOpen(true);
    try {
      await base44.functions.invoke("recordHotspotClick", {
        hotspotId: hotspot.id, userId: user?.id || null, sessionId,
      });
    } catch { /* ignore */ }
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setActiveHotspot(null);
    setShopMode(false);
  };

  return (
    <>
      <div
        className="relative bg-black overflow-hidden"
        style={{ height: 280 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[current]}
          alt=""
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: shopMode ? "brightness(0.82)" : "brightness(1)" }}
        />

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center z-10">
          <ArrowLeft size={20} color="white" />
        </button>

        {/* Counter */}
        <div className="absolute top-4 right-14 bg-black/50 rounded-full px-2.5 py-1 text-white text-xs font-bold z-10">
          {current + 1}/{images.length}
        </div>

        {/* Save */}
        <button onClick={() => setSaved(!saved)}
          className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center z-10">
          <Heart size={18} fill={saved ? "#EF4444" : "none"} color={saved ? "#EF4444" : "white"} />
        </button>

        {/* Hotspot dots */}
        {shopMode && currentHotspots.map((hotspot) => (
          <MobileHotspotDot
            key={hotspot.id}
            hotspot={hotspot}
            isActive={activeHotspot?.id === hotspot.id}
            onClick={handleHotspotTap}
          />
        ))}

        {/* Shop this Look badge / tap strip */}
        {isCurrentShoppable && (
          <button
            onClick={(e) => { e.stopPropagation(); setShopMode(m => !m); if (shopMode) { setSheetOpen(false); setActiveHotspot(null); } }}
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center z-10"
            style={{ height: 44, background: "transparent" }}
          >
            <div style={{
              background: "rgba(10,22,40,0.75)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20,
              padding: "6px 16px",
              color: "white",
              fontWeight: "700",
              fontSize: 13,
            }}>
              {shopMode ? "✕ Close Shop" : "✨ Shop this Look"}
            </div>
          </button>
        )}

        {/* Dot indicators (only when not in shop mode) */}
        {!shopMode && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <KemetroBottomSheet
        hotspot={activeHotspot}
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        userId={user?.id}
        sessionId={sessionId}
      />
    </>
  );
}



function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-4 mx-4 mb-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-orange-500 rounded-full" />
          <p className="font-black text-gray-900 text-base">{title}</p>
        </div>
      )}
      {children}
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = MOCK_PROPERTY;
  const [descExpanded, setDescExpanded] = useState(false);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const purposeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";
  const priceFormatted = property.price_amount
    ? `${Number(property.price_amount).toLocaleString()} ${property.currency}`
    : "Price on Request";
  const pricePerSqm = property.price_amount && property.area_size
    ? Math.round(property.price_amount / property.area_size).toLocaleString()
    : null;

  const SHORT = 250;
  const descText = property.description || "";
  const isLongDesc = descText.length > SHORT;
  const displayedDesc = descExpanded ? descText : descText.slice(0, SHORT) + (isLongDesc ? "..." : "");

  const displayedAmenities = amenitiesExpanded ? property.amenities : property.amenities.slice(0, 8);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href }).catch(() => {
        navigator.clipboard?.writeText(window.location.href);
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <ImageGallery images={property.images} propertyId={property.id} />

      <div className="pb-32">

        {/* Price & Title Card */}
        <SectionCard className="mt-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`${purposeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {property.purpose}
            </span>
            {property.category_name && (
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {property.category_name}
              </span>
            )}
            {property.is_featured && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">⭐ FEATURED</span>
            )}
            {property.is_verified && (
              <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ VERIFIED</span>
            )}
          </div>

          <p className="text-2xl font-black text-orange-600">{priceFormatted}</p>
          {pricePerSqm && (
            <p className="text-xs text-gray-400 mt-0.5">{pricePerSqm} {property.currency}/m²</p>
          )}
          <p className="text-base font-bold text-gray-900 mt-2 leading-snug">{property.title}</p>
          <div className="flex items-center gap-1 mt-1 mb-3">
            <MapPin size={12} className="text-orange-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">{[property.address, property.area_name, property.district_name, property.city_name].filter(Boolean).join(", ")}</span>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-4 gap-2 py-3 border-t border-gray-100">
            {[
              { icon: Bed, label: "Beds", value: property.beds },
              { icon: Bath, label: "Baths", value: property.baths },
              { icon: Maximize2, label: "Area", value: property.area_size ? `${property.area_size}m²` : "—" },
              { icon: Building2, label: "Floor", value: property.floor_number ?? "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center bg-orange-50 rounded-xl py-2.5 px-1 text-center">
                <Icon size={16} className="text-orange-500 mb-1" />
                <p className="font-black text-gray-900 text-sm">{value ?? "—"}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {[
              { icon: Share2, label: "Share", action: handleShare },
              { icon: Printer, label: "Print", action: () => window.print() },
              { icon: AlertTriangle, label: "Report", action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all">
                <Icon size={12} /> {label}
              </button>
            ))}
            <button
              onClick={() => navigate("/m/buy")}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-500 text-orange-500 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all">
              <Megaphone size={12} /> Promote
            </button>
          </div>
        </SectionCard>

        {/* Publisher Card */}
        <SectionCard title="Listed By">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              {property.publisher_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">{property.publisher_name}</p>
              <span className="inline-block bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {property.publisher_type?.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowPhone(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 font-bold py-2.5 rounded-xl text-sm mb-2 hover:bg-orange-500 hover:text-white transition-all">
            <Phone size={14} />
            {showPhone ? property.direct_phone : "Show Phone Number"}
          </button>
          <a href={`https://wa.me/${property.direct_phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm mb-2">
            <MessageCircle size={14} /> WhatsApp
          </a>
          <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm">
            <Mail size={14} /> Send Message
          </button>
        </SectionCard>

        {/* Finishing Simulator */}
        <div className="mx-4 mb-3">
          <FinishingSimulatorBanner property={property} variant="mobile" />
        </div>

        {/* Negotiate */}
        <div className="mx-4 mb-3">
          <NegotiateEntryCard property={property} variant="mobile" />
        </div>

        {/* Request a Viewing */}
        <SectionCard title="Request a Viewing">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm">
              <Calendar size={14} /> Schedule Visit
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold py-2.5 rounded-xl text-sm">
              <Video size={14} /> Video Meeting
            </button>
          </div>
        </SectionCard>

        {/* Description */}
        <SectionCard title="About This Property">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{displayedDesc}</p>
          {isLongDesc && (
            <button onClick={() => setDescExpanded(!descExpanded)}
              className="flex items-center gap-1 text-orange-500 text-sm font-bold mt-2">
              {descExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Read More</>}
            </button>
          )}
        </SectionCard>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <SectionCard title="Features & Amenities">
            <div className="grid grid-cols-2 gap-2">
              {displayedAmenities.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center text-orange-500 font-bold text-[10px] flex-shrink-0">✓</span>
                  <span className="text-xs">{a}</span>
                </div>
              ))}
            </div>
            {property.amenities.length > 8 && (
              <button onClick={() => setAmenitiesExpanded(!amenitiesExpanded)}
                className="text-orange-500 text-sm font-bold mt-3">
                {amenitiesExpanded ? "Show Less" : `See all ${property.amenities.length} features`}
              </button>
            )}
          </SectionCard>
        )}

        {/* Location */}
        <SectionCard title="Location">
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <MapPin size={13} className="text-orange-500" />
            {property.address || `${property.city_name}, ${property.district_name}`}
          </p>
          {property.latitude && property.longitude ? (
            <a href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full overflow-hidden rounded-xl" style={{ height: 180 }}>
              <iframe
                title="Property Location"
                width="100%"
                height="180"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                className="block pointer-events-none"
              />
            </a>
          ) : (
            <div className="bg-gray-100 rounded-xl h-36 flex items-center justify-center text-gray-400 text-sm">
              <MapPinned size={24} className="mr-2" /> Map not available
            </div>
          )}
        </SectionCard>

        {/* Media */}
        {(property.youtube_links?.length > 0 || property.vr_video_link || property.floor_plan_file) && (
          <SectionCard title="Media">
            {property.youtube_links?.[0] && (
              <div className="rounded-xl overflow-hidden mb-3">
                <iframe
                  width="100%"
                  height="200"
                  src={property.youtube_links[0].replace("watch?v=", "embed/")}
                  title="Property Video"
                  allowFullScreen
                  className="block"
                />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {property.vr_video_link && (
                <a href={property.vr_video_link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
                  <Play size={13} /> VR Tour
                </a>
              )}
              {property.floor_plan_file && (
                <a href={property.floor_plan_file} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-gray-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
                  <FileText size={13} /> Floor Plan
                </a>
              )}
            </div>
          </SectionCard>
        )}

        {/* Property Details Table */}
        <SectionCard title="Property Details">
          <div className="divide-y divide-gray-50">
            {property.details.map(([key, val], i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">{key}</span>
                <span className="text-sm font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Franchise Owner Verification Card */}
        <SectionCard>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded-full">KEMEDAR VERI</span>
          </div>
          <p className="font-black text-gray-900 text-sm mb-1">Get This Property Verified</p>
          <p className="text-xs text-gray-500 mb-3">Contact the Franchise Owner in your area to verify this listing and get the <span className="font-bold text-green-600">✓ VERIFIED</span> badge.</p>
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-500">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80"
                alt="Franchise Owner" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">Mohamed Karim</p>
              <span className="inline-block text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">Franchise Owner</span>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-orange-500" /> New Cairo Area
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="tel:+201001234567"
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs">
              <Phone size={13} /> Call
            </a>
            <a href="https://wa.me/201001234567" target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2.5 rounded-xl text-xs">
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </SectionCard>

        {/* Similar Properties */}
        <SectionCard title="Similar Properties">
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1">
            {SIMILAR.map((p) => (
              <div key={p.id} className="flex-shrink-0" style={{ width: "72%" }}>
                <MobilePropertyCard property={p} variant="vertical" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Floating Action Buttons — pinned inside the page container */}
      <div className="pointer-events-none sticky bottom-20 z-50 flex justify-end pr-4" style={{ marginTop: -152 }}>
        <div className="pointer-events-auto flex flex-col gap-3">
          <a
            href={`https://wa.me/${property.direct_phone?.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 4px 16px rgba(34,197,94,0.5)" }}
          >
            <MessageCircle size={24} color="white" />
          </a>
          <a
            href={`tel:${property.direct_phone}`}
            className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 4px 16px rgba(249,115,22,0.5)" }}
          >
            <Phone size={24} color="white" />
          </a>
        </div>
      </div>
    </div>
  );
}