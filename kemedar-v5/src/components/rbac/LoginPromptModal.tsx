"use client";
// @ts-nocheck
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { X } from 'lucide-react';

// ─── Context Message Map ──────────────────────────────────────────────────────
const CONTEXT_MESSAGES = {
  add_property_form_submit: {
    emoji: '🏠',
    title: 'Almost There!',
    message: 'Sign in to publish your property listing for free',
    gradient: 'from-orange-400 to-orange-600',
  },
  property_detail_page_message: {
    emoji: '💬',
    title: 'Want to Contact the Owner?',
    message: "Create a free account to send messages and get the seller's phone number instantly",
    gradient: 'from-blue-400 to-blue-600',
  },
  message_owner: {
    emoji: '💬',
    title: 'Want to Contact the Owner?',
    message: "Sign in to see phone number, WhatsApp and send messages",
    gradient: 'from-blue-400 to-blue-600',
  },
  property_favorites_create: {
    emoji: '❤️',
    title: 'Save This Property',
    message: 'Sign in to save properties and get notified on price changes',
    gradient: 'from-red-400 to-red-600',
  },
  save_favorite: {
    emoji: '❤️',
    title: 'Save This Property',
    message: 'Sign in to save properties and get notified on price changes',
    gradient: 'from-red-400 to-red-600',
  },
  kemetro_checkout_purchase: {
    emoji: '🛒',
    title: 'Ready to Order?',
    message: 'Sign in to complete your purchase securely',
    gradient: 'from-blue-400 to-blue-600',
  },
  cart_checkout: {
    emoji: '🛒',
    title: 'Ready to Order?',
    message: 'Sign in to complete your purchase securely',
    gradient: 'from-blue-400 to-blue-600',
  },
  task_bidding_create: {
    emoji: '💼',
    title: 'Ready to Bid?',
    message: 'Sign in to submit your offer and start earning on Kemework',
    gradient: 'from-teal-400 to-teal-600',
  },
  bid_task: {
    emoji: '💼',
    title: 'Ready to Bid?',
    message: 'Sign in to submit your offer and start earning on Kemework',
    gradient: 'from-teal-400 to-teal-600',
  },
  post_task_form_submit: {
    emoji: '✅',
    title: 'Task Ready to Post!',
    message: 'Create your free account to publish your task and receive bids',
    gradient: 'from-teal-400 to-teal-600',
  },
  post_task_submit: {
    emoji: '✅',
    title: 'Task Ready to Post!',
    message: 'Create your free account to publish your task and receive bids',
    gradient: 'from-teal-400 to-teal-600',
  },
  property_valuation_tool_create: {
    emoji: '📊',
    title: 'See Your Full Valuation',
    message: 'Sign in to get your complete AI-powered property valuation report',
    gradient: 'from-purple-400 to-purple-600',
  },
  valuation_full: {
    emoji: '📊',
    title: 'See Your Full Valuation',
    message: 'Sign in to get your complete AI-powered property valuation report',
    gradient: 'from-purple-400 to-purple-600',
  },
  service_order_purchase: {
    emoji: '🔧',
    title: 'Order This Service',
    message: 'Sign in to place your service order and connect with the professional',
    gradient: 'from-teal-400 to-teal-600',
  },
  main_dashboard_access_dashboard: {
    emoji: '📊',
    title: 'Access Your Dashboard',
    message: 'Sign in to view your personalized dashboard',
    gradient: 'from-gray-500 to-gray-700',
  },
};

const DEFAULT_CONTEXT = {
  emoji: '🔑',
  title: 'Sign In to Continue',
  message: 'Create your free account to unlock all Kemedar features',
  gradient: 'from-orange-400 to-orange-600',
};

// ─── Main LoginPromptModal ────────────────────────────────────────────────────
export default function LoginPromptModal({ context, formData, onClose, onSuccess }) {
  const [tab, setTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const ctx = CONTEXT_MESSAGES[context] || DEFAULT_CONTEXT;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      router.push("/login");
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      router.push("/login");
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    router.push("/login");
  };

  // Form data preview for allow_form_fill context
  const showFormPreview = formData && Object.keys(formData).some(k => formData[k]);
  const formPreviewLines = showFormPreview ? [
    formData.title && `📋 ${formData.title}`,
    formData.price_amount && `💰 ${formData.currency || 'EGP'} ${Number(formData.price_amount).toLocaleString()}`,
    formData.city_name && `📍 ${formData.city_name}`,
    formData.category && `🏠 ${formData.category}`,
  ].filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-[420px] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors">
          <X size={16} />
        </button>

        {/* Top gradient section */}
        <div className={`bg-gradient-to-br ${ctx.gradient} px-6 pt-8 pb-6 text-white text-center`}>
          <div className="text-5xl mb-3">{ctx.emoji}</div>
          <h2 className="text-xl font-black mb-1">{ctx.title}</h2>
          <p className="text-sm opacity-90 leading-relaxed">{ctx.message}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Form data preview */}
          {formPreviewLines.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
              {formPreviewLines.map((line, i) => (
                <p key={i} className="text-xs text-gray-600 font-medium">{line}</p>
              ))}
              <p className="text-xs text-gray-400 mt-1">🔒 Your data is saved</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            {[['signin', 'Sign In'], ['register', 'Register']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3">
              <input
                type="email"
                placeholder="Email or Phone"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Signing in...' : '🔑 Sign In'}
              </button>
              <p className="text-center text-xs text-orange-500 font-semibold cursor-pointer hover:underline">
                Forgot password?
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <input
                type="email"
                placeholder="Email or Phone"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Creating account...' : '✨ Create Free Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-2"
          >
            <span className="text-base">🇬</span> Continue with Google
          </button>

          <p className="text-center text-[10px] text-gray-400 mt-3">
            By continuing you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span>
          </p>
        </div>

        {/* Footer note for form fill */}
        {formPreviewLines.length > 0 && (
          <div className="px-6 pb-4 text-center">
            <p className="text-[11px] text-gray-400">
              Your data is saved — pick up right where you left off after signing in
            </p>
          </div>
        )}
      </div>
    </div>
  );
}