import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import KemetroCheckoutProgress from "@/components/kemetro/checkout/KemetroCheckoutProgress";
import KemetroCheckoutStep1 from "@/components/kemetro/checkout/KemetroCheckoutStep1";
import KemetroCheckoutStep2 from "@/components/kemetro/checkout/KemetroCheckoutStep2";
import KemetroCheckoutStep3 from "@/components/kemetro/checkout/KemetroCheckoutStep3";

export default function KemetroCheckout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handlePlaceOrder = () => {
    const orderNumber = "ORD-" + Date.now();
    navigate("/kemetro/order-success", { state: { orderNumber } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <KemetroCheckoutProgress currentStep={currentStep} />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8">
          {currentStep === 1 && (
            <KemetroCheckoutStep1 onAddressSelect={setAddress} onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <KemetroCheckoutStep2 onPaymentSelect={setPaymentMethod} onNext={() => setCurrentStep(3)} />
          )}
          {currentStep === 3 && (
            <KemetroCheckoutStep3 address={address} paymentMethod={paymentMethod} onPlaceOrder={handlePlaceOrder} />
          )}
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}