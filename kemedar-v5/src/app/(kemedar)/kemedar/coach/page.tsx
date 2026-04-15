"use client";

import { useState } from "react";
import { useCoachResponse } from "@/hooks/use-coaching";
import { BookOpen, Send } from "lucide-react";

export default function CoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Welcome to KemedarCoach! I'm your AI real estate learning companion. Ask me anything about buying, selling, or investing in property in Egypt." },
  ]);
  const coachMutation = useCoachResponse();

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    try {
      const res = await coachMutation.mutateAsync({ questionText: q });
      setMessages((m) => [...m, { role: "bot", content: res.response }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", content: "Sorry, I couldn't process that. Please try again." }]);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-6">
        <BookOpen className="w-10 h-10 text-amber-600 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">KemedarCoach</h1>
        <p className="text-slate-500 text-sm">Your personal real estate learning companion</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ height: "60vh" }}>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about real estate..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={send}
              disabled={coachMutation.isPending}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
