import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Save } from "lucide-react";
import Step1Vision from "@/components/kemekits/creator/Step1Vision";
import Step2Materials from "@/components/kemekits/creator/Step2Materials";
import Step3Rules from "@/components/kemekits/creator/Step3Rules";
import Step4Publish from "@/components/kemekits/creator/Step4Publish";

const STEPS = [
  { label: "Vision", num: 1 },
  { label: "Materials", num: 2 },
  { label: "Rules", num: 3 },
  { label: "Publish", num: 4 },
];

const INIT_DATA = {
  title: "", titleAr: "", roomType: "", styleCategory: "", budgetTier: "",
  description: "", descriptionAr: "", heroImageUrl: null, gallery: [],
  baseLaborRatePerSqmEGP: 0, estimatedInstallDays: 1, requiredProfessionalSkill: "",
};

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
}

export default function KemeKitCreatorStudio() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!templateId;

  const [step, setStep] = useState(1);
  const [data, setData] = useState(INIT_DATA);
  const [items, setItems] = useState([]); // KemeKitItem-like objects (unsaved)
  const [user, setUser] = useState(null);
  const [commissionPercent, setCommissionPercent] = useState(3);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedTemplateId, setSavedTemplateId] = useState(templateId || null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Load commission from settings
      base44.entities.KemeKitSettings.list().then(s => {
        if (s[0]) setCommissionPercent(s[0].creatorCommissionPercent || 3);
      });
      // Load existing template if editing
      if (isEdit) {
        Promise.all([
          base44.entities.KemeKitTemplate.filter({ id: templateId }),
          base44.entities.KemeKitItem.filter({ templateId }, "displayOrder", 100)
        ]).then(([templates, kitItems]) => {
          if (templates[0]) {
            const t = templates[0];
            setData({
              title: t.title || "", titleAr: t.titleAr || "",
              roomType: t.roomType || "", styleCategory: t.styleCategory || "",
              budgetTier: t.budgetTier || "", description: t.description || "",
              descriptionAr: t.descriptionAr || "", heroImageUrl: t.heroImageUrl || null,
              gallery: t.gallery || [], baseLaborRatePerSqmEGP: t.baseLaborRatePerSqmEGP || 0,
              estimatedInstallDays: t.estimatedInstallDays || 1,
              requiredProfessionalSkill: t.requiredProfessionalSkill || "",
            });
          }
          setItems(kitItems.map(i => ({ ...i, id: i.id || `temp_${Date.now()}` })));
        }).finally(() => setLoading(false));
      }
    });
  }, [templateId]);

  const updateData = (patch) => setData(d => ({ ...d, ...patch }));

  const saveDraft = async () => {
    if (!user) return;
    setSaving(true);
    const slug = generateSlug(data.title || "kit");
    const templatePayload = {
      ...data,
      slug,
      creatorId: user.id,
      creatorName: user.full_name,
      commissionPercent,
      status: "draft",
    };
    let tid = savedTemplateId;
    if (tid) {
      await base44.entities.KemeKitTemplate.update(tid, templatePayload);
    } else {
      const created = await base44.entities.KemeKitTemplate.create(templatePayload);
      tid = created.id;
      setSavedTemplateId(tid);
    }
    // Upsert items
    for (const item of items) {
      const itemPayload = {
        templateId: tid,
        productId: item.productId,
        productName: item.productName,
        productImageUrl: item.productImageUrl,
        productPriceEGP: item.productPriceEGP,
        role: item.role,
        calculationRule: item.calculationRule,
        coveragePerUnit: item.coveragePerUnit,
        wasteMarginPercent: item.wasteMarginPercent ?? 10,
        fixedQuantity: item.fixedQuantity,
        parentItemId: item.parentItemId,
        ratioMultiplier: item.ratioMultiplier,
        isOptional: item.isOptional || false,
        displayOrder: item.displayOrder,
      };
      if (item.id && !String(item.id).startsWith("temp_")) {
        await base44.entities.KemeKitItem.update(item.id, itemPayload);
      } else {
        const created = await base44.entities.KemeKitItem.create(itemPayload);
        item.id = created.id;
      }
    }
    setSaving(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await saveDraft();
    if (savedTemplateId) {
      await base44.entities.KemeKitTemplate.update(savedTemplateId, { status: "pending_approval" });
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const canProceedStep1 = data.heroImageUrl && data.title && data.roomType && data.styleCategory && data.budgetTier && data.baseLaborRatePerSqmEGP > 0;
  const canProceedStep2 = items.length >= 3;
  const canProceedStep3 = items.every(i => i.calculationRule);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    const slug = generateSlug(data.title || "kit");
    const shareUrl = `${window.location.origin}/kemetro/kemekits/${slug}`;
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="max-w-md w-full mx-4 bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">KemeKit Submitted!</h2>
          <p className="text-gray-500 mb-1">Admin will review within 24 hours.</p>
          <p className="text-gray-400 text-sm mb-6">You'll be notified when it goes live.</p>
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-black text-blue-700 mb-2">🔗 Share with your followers while you wait:</p>
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-blue-200 mb-3 text-xs text-gray-600 truncate">
              {shareUrl}
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out my KemeKit! ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm py-2.5 rounded-xl w-full"
            >
              💬 Share on WhatsApp
            </a>
          </div>
          <Link to="/kemework/pro/kemekits" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-colors">
            ← My KemeKits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Commission Banner */}
      <div className="mx-4 mt-4 rounded-2xl p-4 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }}>
        <span className="text-3xl flex-shrink-0">💎</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm">Earn Kemecoins on every purchase</p>
          <p className="text-blue-200 text-xs mt-0.5">
            You earn {commissionPercent}% of all material sales generated by this kit — automatically, every time a homeowner adds it to cart.
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-yellow-300 font-black text-sm">{commissionPercent}% commission</p>
          <p className="text-blue-200 text-xs">Currently</p>
        </div>
      </div>

      {/* Sticky Wizard Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 mt-3">
        <Link to="/kemework/pro/kemekits" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-bold">
          <ArrowLeft size={16} /> My KemeKits
        </Link>
        <div className="flex-1 text-center">
          <span className="font-black text-gray-900 text-base">{isEdit ? "Edit KemeKit" : "Create New KemeKit"}</span>
        </div>
        <button
          onClick={saveDraft}
          disabled={saving}
          className="flex items-center gap-1.5 border border-gray-300 text-gray-700 font-bold text-sm px-3 py-2 rounded-xl hover:border-gray-400 transition-colors"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save Draft"}
        </button>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
          {STEPS.map((s, i) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone ? "bg-blue-600 text-white" : isActive ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"
                  }`}>
                    {isDone ? "✓" : s.num}
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${isActive ? "text-blue-600" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 h-1 mx-1 rounded-full mb-4 ${step > s.num ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {step === 1 && <Step1Vision data={data} onChange={updateData} />}
        {step === 2 && <Step2Materials items={items} onChange={setItems} />}
        {step === 3 && <Step3Rules items={items} onChange={setItems} />}
        {step === 4 && (
          <Step4Publish
            data={data}
            items={items}
            commissionPercent={commissionPercent}
            slug={generateSlug(data.title || "kit")}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="mt-6">
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                ((step === 1 && canProceedStep1) || (step === 2 && canProceedStep2) || (step === 3 && canProceedStep3))
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {step === 1 && "Next: Add Materials →"}
              {step === 2 && "Next: Set Calculation Rules →"}
              {step === 3 && "Next: Preview & Publish →"}
            </button>
            {step === 1 && !canProceedStep1 && (
              <p className="text-center text-xs text-gray-400 mt-2">Complete all required fields to continue</p>
            )}
            {step === 2 && !canProceedStep2 && (
              <p className="text-center text-xs text-gray-400 mt-2">Add at least 3 products to continue</p>
            )}
          </div>
        )}

        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="mt-3 w-full py-3 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}