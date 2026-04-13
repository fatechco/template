import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(1); // 1: email, 2: otp, 3: password
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const isEmail = input.includes("@");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Placeholder for actual implementation
      console.log("Send reset code to:", input);
      setScreen(2);
      setCountdown(60);
      // Simulated countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      console.log("Verify OTP:", otp);
      setScreen(3);
    } catch (err) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Reset password");
      navigate("/m/login");
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/m/login")} className="p-1 -ml-1 text-gray-900">
          <ChevronLeft size={22} />
        </button>
        <h1 className="flex-1 font-black text-gray-900 text-lg">Reset Password</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-sm">
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-6">
              {error}
            </div>
          )}

          {/* SCREEN 1: Enter Email/Phone */}
          {screen === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Enter your email or phone</h2>
                <p className="text-gray-500 text-sm">We'll send you a code to reset your password</p>
              </div>

              <div className="relative flex items-center bg-gray-100 rounded-xl px-4 h-13">
                {isEmail ? (
                  <Mail size={18} className="text-gray-400" />
                ) : (
                  <Phone size={18} className="text-gray-400" />
                )}
                <input
                  type="text"
                  placeholder="Phone number or email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !input}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {/* SCREEN 2: Enter OTP */}
          {screen === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Enter verification code</h2>
                <p className="text-gray-500 text-sm">Sent to {input}</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl font-black tracking-widest bg-gray-100 rounded-xl px-4 py-4 outline-none text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">Resend code in {countdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setScreen(1)}
                    className="text-orange-600 font-semibold text-sm hover:text-orange-700"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* SCREEN 3: New Password */}
          {screen === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Create new password</h2>
                <p className="text-gray-500 text-sm">Make it strong and unique</p>
              </div>

              <div className="space-y-4">
                <div className="relative flex items-center bg-gray-100 rounded-xl px-4 h-13">
                  <span className="text-lg">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative flex items-center bg-gray-100 rounded-xl px-4 h-13">
                  <span className="text-lg">🔒</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}