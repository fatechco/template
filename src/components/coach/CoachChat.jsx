import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const SUGGESTED_QUESTIONS = {
  first_time_buyer: ["What documents do I need to buy?", "What is a title deed?", "How much are registration fees?", "Should I use a mortgage?"],
  property_seller: ["How do I price my property?", "How long does it take to sell?", "Do I need an agent?"],
  investor: ["What's the average rental yield in Cairo?", "Is off-plan risky?", "Where should I invest in Egypt?"],
  default: ["Where do I start?", "How long does the process take?", "What are the hidden costs?"]
};

export default function CoachChat({ profile, currentStep }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `sess_${Date.now()}`);
  const bottomRef = useRef(null);

  const suggestions = SUGGESTED_QUESTIONS[profile?.journeyType] || SUGGESTED_QUESTIONS.default;

  useEffect(() => {
    if (profile?.id) loadMessages();
  }, [profile?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadMessages = async () => {
    const msgs = await base44.entities.CoachMessage.filter({ coachProfileId: profile.id }, '-created_date', 20);
    setMessages(msgs.reverse());
    if (msgs.length === 0) {
      setMessages([{
        id: 'welcome', direction: 'coach', messageType: 'chat',
        content: profile.preferredLanguage === 'ar'
          ? `مرحباً! أنا مدربك الشخصي في كيميدار. أنا هنا لأساعدك في رحلتك العقارية خطوة بخطوة. ما الذي تريد معرفته اليوم؟`
          : `Hi! I'm your Kemedar Coach™. I'm here to guide you through your ${profile.journeyType?.replace(/_/g, ' ')} journey step by step. What would you like to know today?`,
        created_date: new Date().toISOString()
      }]);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: `tmp_${Date.now()}`, direction: 'user', content: text, created_date: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const res = await base44.functions.invoke('generateCoachResponse', {
      coachProfileId: profile.id, userMessage: text, sessionId
    });
    setLoading(false);
    const coachMsg = {
      id: `coach_${Date.now()}`, direction: 'coach', messageType: 'answer',
      content: res.data?.responseText || "I'm here to help! Let me know what you need.",
      attachedContent: res.data?.platformFeatureSuggested ? {
        featureName: res.data.platformFeatureSuggested,
        featureUrl: res.data.platformFeatureUrl,
        suggestion: res.data.nextStepSuggestion
      } : null,
      created_date: new Date().toISOString()
    };
    setMessages(prev => [...prev, coachMsg]);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center text-xl flex-shrink-0">🎓</div>
        <div>
          <p className="font-black text-gray-900 text-sm">Kemedar Coach™</p>
          <p className="text-xs text-gray-400">Your Personal Property Guide</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.direction === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.direction === 'coach' && (
              <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🎓</div>
            )}
            <div className={`max-w-[75%] ${msg.direction === 'user' ? '' : 'space-y-2'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.direction === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
              {msg.attachedContent?.featureName && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs font-black text-blue-700 mb-1">🔗 Relevant Feature:</p>
                  <p className="text-xs text-blue-600 mb-2">{msg.attachedContent.suggestion}</p>
                  {msg.attachedContent.featureUrl && (
                    <Link to={msg.attachedContent.featureUrl}
                      className="text-xs bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-600 inline-block">
                      Open {msg.attachedContent.featureName} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">🎓</div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 font-semibold px-3 py-1.5 rounded-full transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"/>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl disabled:opacity-40 transition-colors">
            <Send size={18}/>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">Responds in English & Arabic • Powered by Kemedar AI</p>
      </div>
    </div>
  );
}