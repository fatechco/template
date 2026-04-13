import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFormShell from "@/components/add-forms/AddFormShell";
import SuccessScreen from "@/components/add-forms/SuccessScreen";
import ProductStep1 from "@/components/add-product/ProductStep1";
import ProductStep2 from "@/components/add-product/ProductStep2";
import ProductStep3 from "@/components/add-product/ProductStep3";
import ProductStep4 from "@/components/add-product/ProductStep4";

const STEPS = [
  { id: 1, label: "Product Info" },
  { id: 2, label: "Photos & Media" },
  { id: 3, label: "Pricing & Inventory" },
  { id: 4, label: "Shipping & Publish" },
];

const INITIAL = {
  name_en: "",
  name_ar: "",
  category: "",
  subcategory: "",
  brand: "",
  sku: "",
  origin_country: "",
  short_description: "",
  full_description: "",
  main_photo_url: "",
  gallery_urls: [],
  brochure_url: "",
  video_link: "",
  price: "",
  price_unit: "per_piece",
  has_sale: false,
  sale_price: "",
  currency_id: "USD",
  min_order_qty: 1,
  stock_qty: "",
  low_stock_alert: "",
  weight: "",
  weight_unit: "kg",
  dim_l: "",
  dim_w: "",
  dim_h: "",
  shipping_zones: [],
  free_shipping: true,
  shipping_cost: "",
};

export default function AddProductPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [done, setDone] = useState(false);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    if (step === 1) return !!(form.name_en && form.category);
    if (step === 2) return !!form.main_photo_url;
    if (step === 3) return !!form.price;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length && canProceed()) { setStep(step + 1); window.scrollTo(0, 0); }
  };
  const handlePrev = () => {
    if (step > 1) { setStep(step - 1); window.scrollTo(0, 0); }
    else navigate(-1);
  };

  if (done) {
    return (
      <SuccessScreen
        title="Product Submitted!"
        subtitle="Your product has been submitted for review and will be live shortly"
        actionLabel="View My Store"
        actionPath="/m/account"
      />
    );
  }

  const StepMap = { 1: ProductStep1, 2: ProductStep2, 3: ProductStep3, 4: ProductStep4 };
  const StepComp = StepMap[step];

  return (
    <AddFormShell
      title="Add Product"
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      onSubmit={() => setDone(true)}
      submitLabel="✅ Publish Product"
    >
      <StepComp form={form} update={update} />
    </AddFormShell>
  );
}