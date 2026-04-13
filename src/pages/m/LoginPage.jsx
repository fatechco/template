import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmail = input.includes("@");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Placeholder for actual auth implementation
      // const result = await base44.auth.login({ email: input, password });
      console.log("Login attempt:", { input, isEmail });
      navigate("/m/home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#1a1a2e] flex flex-col relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M20 30 L50 10 L80 30 L50 50 Z%22 fill=%22white%22 opacity=%220.3%22/%3E%3C/svg%3E')",
        backgroundRepeat: "repeat"
      }} />

      {/* TOP SECTION - Logo */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-3">🏠</div>
        <h1 className="text-white font-black text-xl">Kemedar®</h1>
        <p className="text-gray-400 text-xs mt-1">Proptech Super App</p>
      </div>

      {/* BOTTOM SECTION - Login Form */}
      <div className="relative z-20 bg-white rounded-t-3xl px-6 py-8 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Phone/Email Input */}
          <div>
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
          </div>

          {/* Password Input */}
          <div>
            <div className="relative flex items-center bg-gray-100 rounded-xl px-4 h-13">
              <span className="text-lg">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 ml-3 bg-transparent text-sm placeholder-gray-400 outline-none text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/m/forgot-password")}
              className="text-orange-600 font-semibold text-sm hover:text-orange-700"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading || !input || !password}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-semibold">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            <span>🇬</span> Continue with Google
          </button>
          <button className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700">
            <span>f</span> Continue with Facebook
          </button>
          <button className="w-full bg-black text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-900">
            <span>🍎</span> Continue with Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/m/register")}
            className="text-orange-600 font-bold hover:text-orange-700"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}