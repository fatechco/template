import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import KemeKitCalculator from "@/components/kemekits/KemeKitCalculator";
import DesignerCard from "@/components/kemekits/DesignerCard";
import ProductPreview from "@/components/kemekits/ProductPreview";
import { ChevronRight } from "lucide-react";
import InstallationSynergyCard from "@/components/kemekits/InstallationSynergyCard";
import HeavyFreightCard from "@/components/kemekits/HeavyFreightCard";

const BUDGET_BADGES = {
  economy: { label: "💚 Economy", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  standard: { label: "💛 Standard", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  premium: { label: "🔵 Premium", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  luxury: { label: "💎 Luxury", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
};

const ROOM_LABELS = {
  bathroom: "🛁 Bathroom", kitchen: "🍳 Kitchen", living_room: "🛋️ Living Room",
  bedroom: "🛏 Bedroom", outdoor: "🌿 Outdoor", office: "🖥 Office", kids_room: "🧒 Kids Room",
};

export default function KemeKitDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [kit, setKit] = useState(null);
  const [items, setItems] = useState([]);
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [calcState, setCalcState] = useState({ totalCost: 0, totalWeightKg: 0, dimensions: { length: 3, width: 2, height: 2.8, doors: 1, windows: 1 } });

  useEffect(() => {
    Promise.all([
      base44.entities.KemeKitTemplate.filter({ slug }).then(r => r[0]),
      base44.auth.me().catch(() => null),
    ]).then(async ([k, user]) => {
      if (!k) return navigate("/kemetro/kemekits");
      setKit(k);
      setMainImage(k.heroImageUrl);
      const itemsData = await base44.entities.KemeKitItem.filter({ templateId: k.id }, "displayOrder", 100);
      setItems(itemsData);
      if (k.creatorId) {
        const des = await base44.entities.User.filter({ id: k.creatorId }).then(r => r[0]);
        setDesigner(des);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-gray-100" />;
  if (!kit) return null;

  const badge = BUDGET_BADGES[kit.budgetTier];
  const galleryImages = kit.gallery && kit.gallery.length > 0 ? kit.gallery : [kit.heroImageUrl];

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <KemetroHeader />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/kemetro" className="text-blue-600 hover:underline">Kemetro</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link to="/kemetro/kemekits" className="text-blue-600 hover:underline">KemeKits</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-600">{ROOM_LABELS[kit.roomType] || kit.roomType}</span>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-800 font-semibold line-clamp-1">{kit.title}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
          {/* LEFT COLUMN */}
          <div className="min-w-0">
            {/* Main Image */}
            <div className="mb-4 rounded-2xl overflow-hidden bg-gray-200 cursor-pointer group" style={{ height: 450 }}
              onClick={() => {
                setLightboxIndex(galleryImages.indexOf(mainImage));
                setShowLightbox(true);
              }}>
              <img src={mainImage} alt={kit.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-bold">🔍 View Gallery</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === img ? "border-blue-600 shadow-lg" : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Design Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`${badge.bg} ${badge.border} ${badge.text} text-xs font-bold px-3 py-1 rounded-full border`}>
                  {badge.label}
                </span>
                {kit.roomType && (
                  <span className="bg-blue-100 border border-blue-300 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {ROOM_LABELS[kit.roomType]}
                  </span>
                )}
                {kit.styleCategory && (
                  <span className="bg-purple-100 border border-purple-300 text-purple-700 text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {kit.styleCategory}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">{kit.title}</h1>
              <p className="text-gray-600 text-base leading-relaxed mb-4">{kit.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📐 {(kit.totalCalculationsRun || 0).toLocaleString()} calculations run</span>
                <span>💰 {(kit.totalCartsGenerated || 0).toLocaleString()} carts generated</span>
                {kit.isEditorsPick && <span className="text-yellow-600 font-bold">⭐ Editor's Pick</span>}
              </div>
            </div>

            {/* Designer Card */}
            {designer && <DesignerCard designer={designer} creatorName={kit.creatorName} />}

            {/* Products Preview */}
            {items.length > 0 && <ProductPreview items={items} kitTitle={kit.title} />}
          </div>

          {/* RIGHT COLUMN — Sticky Calculator + Synergy Cards */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-6 space-y-4">
              <KemeKitCalculator kit={kit} items={items} onCalcChange={setCalcState} user={currentUser} />
              <InstallationSynergyCard
                kit={kit}
                dimensions={calcState.dimensions}
                totalCost={calcState.totalCost}
                user={currentUser}
              />
              <HeavyFreightCard totalWeightKg={calcState.totalWeightKg} />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowLightbox(false)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={galleryImages[lightboxIndex]} alt="" className="max-w-full max-h-[90vh] object-contain" />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl"
            >
              ✕
            </button>
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            >
              ‹
            </button>
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <KemetroFooter />
    </div>
  );
}