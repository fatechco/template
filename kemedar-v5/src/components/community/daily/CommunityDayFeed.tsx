// @ts-nocheck
import Link from "next/link";
import PostCard from "@/components/community/PostCard";

export default function CommunityDayFeed({ posts, events, user, isMember, onOpenCreate, onUpdate }) {
  const questions = posts.filter(p => p.postType === "question").slice(0, 3);
  const recs = posts.filter(p => p.postType === "recommendation").slice(0, 2);
  const polls = posts.filter(p => p.postType === "poll" && !p.pollEndsAt || new Date(p.pollEndsAt) > new Date()).slice(0, 2);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Daytime greeting */}
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-5 text-white">
        <p className="text-2xl font-black mb-0.5">☀️ Good Afternoon!</p>
        <p className="text-blue-100 text-sm">Connect with neighbors, share advice, vote on polls</p>
      </div>

      {/* Quick actions for day */}
      {isMember && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-3">💬 What do you want to do?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "❓", label: "Ask for advice", sub: "Get help from neighbors", type: "question", color: "bg-blue-50 border-blue-200 text-blue-700" },
              { icon: "⭐", label: "Recommend someone", sub: "Share a great service", type: "recommendation", color: "bg-amber-50 border-amber-200 text-amber-700" },
              { icon: "📊", label: "Create a poll", sub: "Get community opinion", type: "poll", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
              { icon: "💬", label: "Start discussion", sub: "Share something cool", type: "general", color: "bg-orange-50 border-orange-200 text-orange-700" },
            ].map(a => (
              <button key={a.type} onClick={() => onOpenCreate(a.type)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left hover:shadow-sm transition-all ${a.color}`}>
                <span className="text-2xl">{a.icon}</span>
                <p className="font-black text-sm">{a.label}</p>
                <p className="text-[10px] opacity-70">{a.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Open questions */}
      {questions.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">❓ Questions from Neighbors</p>
          <p className="text-xs text-gray-500 mb-3">Help a neighbor out — share your knowledge</p>
          {questions.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* Polls to vote on */}
      {polls.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">📊 Vote on Active Polls</p>
          {polls.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">⭐ Neighbor Recommendations</p>
          {recs.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">📅 Upcoming Events</p>
          <div className="space-y-2">
            {upcomingEvents.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className="bg-purple-100 rounded-xl p-3 text-center min-w-14 flex-shrink-0">
                  <p className="text-xs font-black text-purple-700">{new Date(e.startsAt).toLocaleDateString("en-EG", { month: "short" }).toUpperCase()}</p>
                  <p className="text-2xl font-black text-purple-900">{new Date(e.startsAt).getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.location} · {new Date(e.startsAt).toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" })}</p>
                  {e.attendeeCount > 0 && <p className="text-xs text-purple-600 font-bold mt-0.5">👥 {e.attendeeCount} attending</p>}
                </div>
                <button className="text-xs bg-purple-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-purple-600 transition-colors flex-shrink-0">RSVP</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length === 0 && polls.length === 0 && recs.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-2">🌤️</p>
          <p className="font-bold">Quiet afternoon</p>
          {isMember && <button onClick={() => onOpenCreate("question")} className="mt-3 text-orange-500 font-bold text-sm">Ask your neighbors something →</button>}
        </div>
      )}
    </div>
  );
}