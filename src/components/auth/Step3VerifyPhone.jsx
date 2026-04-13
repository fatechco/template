import { useState } from "react";

export default function Step3VerifyPhone({ form, update }) {
  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const handleOtpChange = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    update({ otp: digits });
  };

  const handleResend = () => {
    setCountdown(60);
    setShowResend(false);
    // Simulate countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="flex justify-center pt-6">
        <div className="text-6xl">📱</div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900">Enter verification code</h2>
        <p className="text-gray-500 text-sm mt-2">
          Sent to <span className="font-semibold text-gray-900">{form.countryCode} {form.phone}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div>
        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="000000"
          value={form.otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          className="w-full text-center text-4xl font-black tracking-widest bg-gray-100 rounded-xl px-4 py-5 outline-none focus:bg-gray-50 text-gray-900"
        />
        <p className="text-xs text-gray-400 mt-3">Auto-advances when complete</p>
      </div>

      {/* Resend Timer */}
      <div className="pt-2">
        {!showResend ? (
          <p className="text-gray-500 text-sm">Resend code in {countdown}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-orange-600 font-semibold text-sm hover:text-orange-700"
          >
            Resend Code
          </button>
        )}
      </div>

      {/* Change Phone */}
      <button
        type="button"
        onClick={() => {}}
        className="text-gray-500 text-sm underline hover:text-gray-700"
      >
        Wrong phone number?
      </button>
    </div>
  );
}