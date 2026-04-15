"use client";
// @ts-nocheck
import { useState } from "react";
import { MapPin, Upload, Eye, Pencil } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { mintPropertyToken } from "@/lib/verifyProMint";
import SmartModuleSuggestions from "./SmartModuleSuggestions";
import PostSubmitActions from "./PostSubmitActions";

const CATEGORY_LABELS = {
  apt: "Apartment", villa: "Villa", office: "Office", shop: "Shop", land: "Land",
  warehouse: "Warehouse", townhouse: "Townhouse", duplex: "Duplex", chalet: "Chalet",
  hotel: "Hotel Apt", clinic: "Clinic", building: "Building",
};

const PUBLISHER_LABELS = { owner: "Direct Owner", agent: "Agent / Broker", developer: "Developer" };

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 text-sm last:border-0">
      <span className="text-gray-500 font-medium flex-shrink-0">{label}</span>
      <span className="text-gray-900 font-bold text-right ml-4 max-w-[55%]">{String(value)}</span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="font-black text-gray-800 text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#FF6B00] rounded-full flex-shrink-0" />
        {icon && <span className="text-base">{icon}</span>}
        {title}
      </h4>
      {children}
    </div>
  );
}

function TagList({ items, color = "bg-orange-50 text-[#FF6B00]" }) {
  if (!items?.length) return <p className="text-xs text-gray-400 italic">None selected</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(a => <span key={a} className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{a}</span>)}
    </div>
  );
}

export default function Step7Preview({ form, updateForm, onNext, onBack, onGoToStep }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [propertyCode, setPropertyCode] = useState("");
  const [fracSubmitted, setFracSubmitted] = useState(false);
  const [swapSubmitted, setSwapSubmitted] = useState(false);
  const [auctionSubmitted, setAuctionSubmitted] = useState(false);
  const [auctionCode, setAuctionCode] = useState("");
  const [auctionDeposit, setAuctionDeposit] = useState(0);
  const [propertyId, setPropertyId] = useState(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const code = "KMD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const property = await apiClient.post("/api/v1/property", {
        title: form.title,
        title_ar: form.title_ar,
        description: form.description,
        description_ar: form.description_ar,
        category_id: form.category_id,
        purpose: form.purpose,
        country_id: form.country_id,
        province_id: form.province_id,
        city_id: form.city_id,
        district_id: form.district_id,
        area_id: form.area_id,
        address: form.address,
        latitude: parseFloat(form.latitude) || null,
        longitude: parseFloat(form.longitude) || null,
        direct_phone: form.direct_phone,
        featured_image: form.featured_image_url,
        image_gallery: form.image_gallery_urls,
        brochure_file: form.brochure_url,
        floor_plan_file: form.floor_plan_url,
        vr_video_link: form.vr_video_link,
        youtube_links: [form.youtube_link_1, form.youtube_link_2, form.youtube_link_3].filter(Boolean),
        price_amount: parseFloat(form.price_amount) || null,
        currency_id: form.currency_id,
        is_contact_for_price: form.is_contact_for_price,
        is_negotiable: form.is_negotiable === "yes",
        area_size: parseFloat(form.area_size) || null,
        beds: parseInt(form.beds) || null,
        baths: parseInt(form.baths) || null,
        floor_number: parseInt(form.floor_number) || null,
        total_floors: parseInt(form.total_floors) || null,
        year_built: parseInt(form.year_built) || null,
        tags: form.tags || [],
        amenity_ids: form.amenity_ids || [],
        scene_view_ids: form.scene_view_ids || [],
        frontage_ids: form.frontage_ids || [],
        distance_ids: form.distance_ids || [],
        publisher_type_id: form.publisher_type_id,
        is_featured: form.is_featured || false,
        interested_in_veri: form.interested_in_veri || false,
        interested_in_campaign: form.interested_in_campaign || false,
        isFracOffering: !!form.fracEnabled,
        property_code: code,
        is_active: true,
      });

      setPropertyCode(code);
      setPropertyId(property?.id || null);

      // Save distance records
      if (form.nearby_distances && property?.id) {
        const distEntries = Object.entries(form.nearby_distances).filter(([_, v]) => v.value > 0);
        for (const [fieldId, d] of distEntries) {
          await apiClient.post("/api/v1/propertydistance", {
            propertyId: property.id,
            distanceFieldId: fieldId,
            distanceValue: d.value,
            distanceUnit: d.unit || "km",
            transportMode: d.unit === "min" ? (d.transportMode || "driving") : null,
          }).catch(() => {});
        }
      }

      // Verify Pro — auto-mint PropertyToken + genesis VerificationRecord
      if (property?.id) {
        try {
          const user = await apiClient.get("/api/auth/session");
          await mintPropertyToken(property.id, user.id);
        } catch (_e) { /* non-blocking — property is saved regardless */ }
      }

      // KemedarBid™ Auction submission (if opted in)
      const auctionData = form.auctionData;
      if (auctionData?.enabled && property?.id) {
        try {
          const user = await apiClient.get("/api/auth/session");
          const auctionRes = await apiClient.post("/api/v1/ai/createAuction", {
            propertyId: property.id,
            sellerUserId: user.id,
            auctionType: auctionData.auctionType || "reserve",
            startingPriceEGP: parseFloat(auctionData.startingPriceEGP) || 0,
            reservePriceEGP: auctionData.auctionType === "reserve" ? (parseFloat(auctionData.reservePriceEGP) || null) : null,
            buyNowPriceEGP: auctionData.buyNowEnabled ? (parseFloat(auctionData.buyNowPriceEGP) || null) : null,
            minimumBidIncrementEGP: parseFloat(auctionData.minimumBidIncrementEGP) || 5000,
            registrationOpenAt: auctionData.registrationOpenAt ? new Date(auctionData.registrationOpenAt).toISOString() : null,
            registrationCloseAt: auctionData.registrationCloseAt ? new Date(auctionData.registrationCloseAt).toISOString() : null,
            auctionStartAt: auctionData.auctionStartAt ? new Date(auctionData.auctionStartAt).toISOString() : null,
            auctionEndAt: auctionData.auctionEndAt ? new Date(auctionData.auctionEndAt).toISOString() : null,
            extensionMinutes: auctionData.extensionMinutes || 5,
            requireBuyerProofOfFunds: auctionData.requireBuyerProofOfFunds || false,
            auctionDescription: auctionData.auctionDescription || "",
            auctionDescriptionAr: auctionData.auctionDescriptionAr || "",
          });
          if (auctionRes?.data?.auction) {
            setAuctionCode(auctionRes.data.auction.auctionCode || "");
            setAuctionDeposit(auctionRes.data.auction.sellerDepositEGP || 0);
          }
          setAuctionSubmitted(true);
        } catch (_e) { /* non-blocking */ }
      }

      // Kemedar Swap™ submission (if opted in)
      if (form.swapData?.enabled && property?.id) {
        try {
          const user = await apiClient.get("/api/auth/session");
          const intent = await apiClient.post("/api/v1/swapintent", {
            userId: user.id,
            offeredPropertyId: property.id,
            desiredCategories: form.swapData.desiredCategories || [],
            desiredCityIds: form.swapData.desiredCities || [],
            desiredMinBedrooms: form.swapData.desiredMinBedrooms || null,
            desiredMinAreaSqm: parseFloat(form.swapData.desiredMinAreaSqm) || null,
            desiredKeywords: form.swapData.desiredKeywords || "",
            swapDirection: form.swapData.swapDirection || "equal",
            cashGapAvailableEGP: form.swapData.swapDirection === "upgrade" ? parseFloat(form.swapData.cashGapAvailableEGP) || null : null,
            cashGapExpectedEGP: form.swapData.swapDirection === "downsize" ? parseFloat(form.swapData.cashGapExpectedEGP) || null : null,
            status: "draft",
          });
          // Publish after property is live
          await apiClient.post("/api/v1/ai/publishSwapIntent", { swapIntentId: intent.id });
          setSwapSubmitted(true);
        } catch (_e) { /* non-blocking — property is saved regardless */ }
      }

      // KemeFrac submission (if opted in)
      if (form.fracEnabled && form.fracOfferingType && property?.id) {
        await apiClient.post("/api/v1/ai/submitFracOffering", {
          propertyId: property.id,
          offeringType: form.fracOfferingType,
          offeringDescription: form.fracDescription || "",
          offeringDescriptionAr: form.fracDescriptionAr || "",
          expectedAnnualYieldPercent: form.fracYieldPercent || null,
          yieldFrequency: form.fracYieldFrequency || null,
          tokensForSale: 100, // default — admin sets final value
          minTokensPerBuyer: form.fracMinTokens || 1,
          maxTokensPerBuyer: form.fracMaxTokens || null,
          offeringStartDate: form.fracStartDate || null,
          offeringEndDate: form.fracEndDate || null,
        }).catch(() => {}); // non-blocking — property is saved regardless
        setFracSubmitted(true);
      }

      setSubmitted(true);
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PostSubmitActions
        propertyId={propertyId}
        form={form}
        propertyCode={propertyCode}
        auctionSubmitted={auctionSubmitted}
        fracSubmitted={fracSubmitted}
        swapSubmitted={swapSubmitted}
        auctionCode={auctionCode}
        auctionDeposit={auctionDeposit}
        onAddAnother={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center flex-shrink-0">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black">Step 7 — Preview & Submit</p>
          <p className="text-gray-400 text-xs">Review all details carefully before publishing your listing.</p>
        </div>
      </div>

      {/* Hero image */}
      {form.featured_image_url ? (
        <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={form.featured_image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5">
            <div className="flex-1">
              <h2 className="text-white font-black text-xl leading-tight">{form.title || "Untitled Property"}</h2>
              <p className="text-white/70 text-sm flex items-center gap-1 mt-1"><MapPin size={12} />{form.address || "Location not set"}</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-[#FF6B00] font-black text-xl">
                {form.is_contact_for_price ? "Contact for Price" : form.price_amount ? `${Number(form.price_amount).toLocaleString()} ${form.currency_id}` : "—"}
              </p>
              {form.purpose && <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block">{form.purpose}</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">No main image uploaded</p>
        </div>
      )}

      {/* Key facts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[
            { label: "Category", value: CATEGORY_LABELS[form.category_id] },
            { label: "Purpose", value: form.purpose },
            { label: "Beds", value: form.beds },
            { label: "Baths", value: form.baths },
            { label: "Area", value: form.area_size ? `${form.area_size} ${form.area_unit || "SqM"}` : null },
          ].filter(i => i.value).map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center bg-orange-50 rounded-xl p-3 text-center">
              <p className="font-black text-gray-900 text-sm">{String(value)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-col summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Section title="Location" icon="📍">
          <Row label="Address" value={form.address} />
          <Row label="Country" value={form.country_id} />
          <Row label="City" value={form.city_id} />
          <Row label="GPS" value={form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : null} />
          <Row label="Direct Phone" value={form.direct_phone} />
        </Section>

        <Section title="Price & Payment" icon="💰">
          <Row label="Price" value={form.is_contact_for_price ? "Contact for Price" : form.price_amount ? `${Number(form.price_amount).toLocaleString()} ${form.currency_id}` : null} />
          <Row label="Negotiable" value={form.is_negotiable} />
          <Row label="Area" value={form.area_size ? `${form.area_size} ${form.area_unit}` : null} />
          <Row label="Net Area" value={form.net_area ? `${form.net_area} ${form.net_area_unit || "SqM"}` : null} />
          <Row label="Dues/Taxes" value={form.dues_taxes ? `${form.dues_taxes} ${form.currency_id}/mo` : null} />
          {form.enable_installment && <Row label="Installment" value={`${form.installment_period || "—"} ${form.installment_unit || "months"}`} />}
          {form.enable_discount && <Row label="Discount" value={`${form.discount_value || 0}${form.discount_type === "percent" ? "%" : ` ${form.currency_id}`}`} />}
        </Section>

        <Section title="Property Features" icon="🏠">
          <Row label="Category" value={CATEGORY_LABELS[form.category_id]} />
          <Row label="Condition" value={form.condition} />
          <Row label="Finishing" value={form.finishing_status} />
          <Row label="Furnished" value={form.furnished_id} />
          <Row label="Bedrooms" value={form.beds} />
          <Row label="Bathrooms" value={form.baths} />
          <Row label="Receptions" value={form.receptions} />
          <Row label="Floor" value={form.floor_number} />
          <Row label="Total Floors" value={form.total_floors} />
          <Row label="Year Built" value={form.year_built} />
          <Row label="Delivery Date" value={form.delivery_date} />
          {form.is_last_floor && <Row label="Last Floor" value="Yes" />}
          {form.is_ground_floor && <Row label="Ground Floor" value="Yes" />}
        </Section>

        <Section title="Publisher" icon="👤">
          <Row label="Publisher Type" value={PUBLISHER_LABELS[form.publisher_type_id] || form.publisher_type_id} />
          <Row label="Video Meeting" value={form.pref_video_meeting ? "Yes" : null} />
          <Row label="In-Person Viewing" value={form.pref_in_person ? "Yes" : null} />
          <Row label="Key with Kemedar" value={form.pref_key_service ? "Yes" : null} />
          <Row label="No Agents" value={form.pref_no_agents ? "Yes" : null} />
        </Section>
      </div>

      {/* Amenities */}
      {(form.amenity_ids?.length > 0) && (
        <Section title="Amenities & Features" icon="✨">
          <TagList items={form.amenity_ids} />
        </Section>
      )}

      {/* Media */}
      <Section title="Media" icon="📸">
        <div className="flex flex-col gap-3">
          {form.featured_image_url && (
            <div>
              <p className="text-xs text-gray-400 mb-1 font-bold">Main Image</p>
              <img src={form.featured_image_url} className="h-16 w-24 object-cover rounded-lg border border-gray-100" alt="" />
            </div>
          )}
          {form.image_gallery_urls?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1 font-bold">Gallery ({form.image_gallery_urls.length} photos)</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {form.image_gallery_urls.map((url, i) => (
                  <img key={i} src={url} className="h-14 w-20 object-cover rounded-lg flex-shrink-0 border border-gray-100" alt="" />
                ))}
              </div>
            </div>
          )}
          {form.vr_video_link && <Row label="VR Tour" value={form.vr_video_link} />}
          {form.youtube_link_1 && <Row label="YouTube 1" value={form.youtube_link_1} />}
        </div>
      </Section>

      {/* Description preview */}
      {form.title && (
        <Section title="Title & Description" icon="📝">
          <p className="text-sm font-black text-gray-900 mb-2">{form.title}</p>
          {form.description && <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{form.description}</p>}
          {form.title_ar && <p className="text-sm font-black text-gray-700 mt-3 text-right" dir="rtl">{form.title_ar}</p>}
        </Section>
      )}

      {/* Services selected */}
      {(form.interested_in_veri || form.interested_in_campaign || form.interested_in_listing || form.pref_key_service) && (
        <Section title="Selected Paid Services" icon="⭐">
          <div className="flex flex-col gap-1">
            {form.interested_in_veri && <Row label="KEMEDAR VERI" value="Requested ($100)" />}
            {form.interested_in_campaign && <Row label="KEMEDAR Campaign" value="Requested" />}
            {form.interested_in_listing && <Row label="KEMEDAR Listing" value="Requested ($50)" />}
            {form.pref_key_service && <Row label="KEY WITH KEMEDAR" value="Requested" />}
          </div>
        </Section>
      )}

      {/* Smart Module Suggestions — purpose-aware */}
      <SmartModuleSuggestions form={form} updateForm={updateForm} />

      {/* Property QR Code */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" style={{ borderLeft: '3px solid #FF6B00' }}>
        <div className="flex items-start gap-3 mb-3">
          <div>
            <p className="font-black text-gray-900 text-base">📱 Property QR Code</p>
            <p className="text-gray-500 text-sm">Generate a scannable QR code to promote this property offline</p>
          </div>
        </div>
        <p className="text-gray-400 text-xs italic">Save and publish your property first to generate a QR code.</p>
      </div>

      {/* Action buttons */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-3">
        <button onClick={() => onGoToStep ? onGoToStep(1) : onBack()}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#1a1a2e] hover:text-[#1a1a2e] transition-colors">
          <Pencil size={14} /> Edit from Start
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-gray-400 transition-colors">
            ← Back
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#FF6B00] hover:bg-[#e55f00] disabled:opacity-60 text-white rounded-xl text-sm font-black transition-colors shadow-lg">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
              : (() => {
                  const hasAuction = form.auctionData?.enabled;
                  const hasFrac = form.fracEnabled;
                  const hasSwap = form.swapData?.enabled;
                  const extras = [hasAuction && "KemedarBid™", hasFrac && "KemeFrac™", hasSwap && "Swap™"].filter(Boolean);
                  return extras.length > 0
                    ? <><Upload size={15} /> Publish + {extras.join(" + ")}</>
                    : <><Upload size={15} /> Publish Listing</>;
                })()}
          </button>
        </div>
      </div>
    </div>
  );
}