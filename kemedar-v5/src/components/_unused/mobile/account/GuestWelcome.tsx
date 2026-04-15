// @ts-nocheck
import { apiClient } from "@/lib/api-client";

export default function GuestWelcome() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center px-4 pb-20">
      {/* Logo */}
      <div className="text-6xl mb-6">🏢</div>

      {/* Heading */}
      <h1 className="text-2xl font-black text-[#1F2937] text-center mb-2">Welcome to Kemedar</h1>
      <p className="text-sm text-[#6B7280] text-center mb-6 max-w-xs">
        Sign in to access your account, listings and messages
      </p>

      {/* Sign In Button */}
      <button
        onClick={() => router.push("/login")}
        className="w-full max-w-xs bg-[#FF6B00] text-white font-bold py-3.5 rounded-xl mb-3 active:opacity-90 transition-opacity"
      >
        Sign In
      </button>

      {/* Create Account Button */}
      <button
        onClick={() => router.push("/login")}
        className="w-full max-w-xs border-2 border-[#FF6B00] text-[#FF6B00] font-bold py-3.5 rounded-xl mb-5 active:bg-orange-50 transition-colors"
      >
        Create Account
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs mb-5">
        <div className="h-px bg-[#E5E7EB] flex-1" />
        <span className="text-xs text-[#9CA3AF] font-medium">Or continue as guest</span>
        <div className="h-px bg-[#E5E7EB] flex-1" />
      </div>

      {/* Browse Properties Button */}
      <button className="w-full max-w-xs border-2 border-[#D1D5DB] text-[#6B7280] font-bold py-3.5 rounded-xl active:bg-gray-100 transition-colors">
        Browse Properties
      </button>
    </div>
  );
}