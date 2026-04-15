"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ThumbsUp, MessageCircle, Share2, MoreVertical, Pin, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const POST_TYPE_CONFIG = {
  announcement: { label: "📣 Announcement", bg: "bg-orange-50", border: "border-l-orange-500", badge: "bg-orange-100 text-orange-700" },
  general: { label: "💬 Post", bg: "bg-white", border: "border-l-transparent", badge: "bg-gray-100 text-gray-600" },
  question: { label: "❓ Question", bg: "bg-white", border: "border-l-blue-400", badge: "bg-blue-100 text-blue-700" },
  recommendation: { label: "⭐ Recommendation", bg: "bg-amber-50", border: "border-l-amber-400", badge: "bg-amber-100 text-amber-700" },
  alert: { label: "⚡ Alert", bg: "bg-red-50", border: "border-l-red-500", badge: "bg-red-100 text-red-700" },
  marketplace: { label: "🛍 Marketplace", bg: "bg-teal-50", border: "border-l-teal-500", badge: "bg-teal-100 text-teal-700" },
  poll: { label: "📊 Poll", bg: "bg-blue-50", border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700" },
  event: { label: "📅 Event", bg: "bg-purple-50", border: "border-l-purple-500", badge: "bg-purple-100 text-purple-700" },
  help_request: { label: "🔧 Help Needed", bg: "bg-white", border: "border-l-teal-400", badge: "bg-teal-100 text-teal-700" },
  complaint: { label: "📢 Complaint", bg: "bg-white", border: "border-l-gray-400", badge: "bg-gray-100 text-gray-600" },
  lost_found: { label: "🔍 Lost & Found", bg: "bg-white", border: "border-l-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
  appreciation: { label: "❤️ Appreciation", bg: "bg-pink-50", border: "border-l-pink-400", badge: "bg-pink-100 text-pink-700" },
};

const ALERT_ICONS = {
  water_cut: "💧", power_outage: "⚡", security_incident: "🔒",
  maintenance: "🔧", gas_cut: "🔥", internet_outage: "📶",
  flooding: "🌊", other_utility: "⚠️", noise_complaint: "📢", emergency: "🚨"
};

export default function PostCard({ post, currentUser, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [userReaction, setUserReaction] = useState(null);

  const cfg = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.general;
  const isLong = post.content?.length > 280;
  const displayContent = isLong && !expanded ? post.content.substring(0, 280) + "..." : post.content;

  const loadComments = async () => {
    if (showComments) { setShowComments(false); return; }
    const data = await apiClient.list("/api/v1/communitycomment", { postId: post.id });
    setComments(data.sort((a,b) => new Date(a.created_date) - new Date(b.created_date)));
    setShowComments(true);
  };

  const handleReact = async (type) => {
    if (!currentUser) return;
    const newReaction = userReaction === type ? null : type;
    setUserReaction(newReaction);
    const currentCount = post.reactions?.[type] || 0;
    await apiClient.put("/api/v1/communitypost/", post.id, {
      reactions: { ...post.reactions, [type]: Math.max(0, currentCount + (newReaction ? 1 : -1)) },
      reactionsCount: Math.max(0, (post.reactionsCount || 0) + (newReaction ? 1 : -1)),
    });
    if (onUpdate) onUpdate();
  };

  const handleComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    setPosting(true);
    await apiClient.post("/api/v1/communitycomment", {
      postId: post.id,
      communityId: post.communityId,
      authorId: currentUser.id,
      authorName: currentUser.full_name,
      content: commentText.trim(),
    });
    await apiClient.put("/api/v1/communitypost/", post.id, { commentsCount: (post.commentsCount || 0) + 1 });
    setCommentText("");
    setPosting(false);
    const data = await apiClient.list("/api/v1/communitycomment", { postId: post.id });
    setComments(data.sort((a,b) => new Date(a.created_date) - new Date(b.created_date)));
    if (onUpdate) onUpdate();
  };

  const handleConfirmAlert = async () => {
    if (!currentUser || post.alertConfirmingUserIds?.includes(currentUser.id)) return;
    await apiClient.put("/api/v1/communitypost/", post.id, {
      alertConfirmations: (post.alertConfirmations || 0) + 1,
      alertConfirmingUserIds: [...(post.alertConfirmingUserIds || []), currentUser.id],
    });
    if (onUpdate) onUpdate();
  };

  const handleVotePoll = async (optionId) => {
    if (!currentUser || post.pollVoterIds?.includes(currentUser.id)) return;
    const updatedOptions = (post.pollOptions || []).map(opt =>
      opt.optionId === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
    );
    await apiClient.put("/api/v1/communitypost/", post.id, {
      pollOptions: updatedOptions,
      totalPollVotes: (post.totalPollVotes || 0) + 1,
      pollVoterIds: [...(post.pollVoterIds || []), currentUser.id],
    });
    if (onUpdate) onUpdate();
  };

  const hasVoted = post.pollVoterIds?.includes(currentUser?.id);
  const totalPollVotes = post.totalPollVotes || 0;

  return (
    <div className={`${cfg.bg} border border-gray-100 border-l-4 ${cfg.border} rounded-2xl shadow-sm mb-3 overflow-hidden`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-sm flex-shrink-0">
            {post.isAnonymous ? "👤" : (post.authorName?.charAt(0) || "?")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">{post.isAnonymous ? "Anonymous Neighbor" : post.authorName}</span>
              {post.authorUnit && <span className="text-xs text-gray-400">Unit {post.authorUnit}</span>}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : "just now"}</p>
          </div>
          {post.isPinned && <Pin size={14} className="text-orange-500 flex-shrink-0" />}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.title && <h3 className="font-black text-gray-900 text-base mb-1">{post.title}</h3>}

        {/* Alert header */}
        {post.postType === "alert" && post.alertType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{ALERT_ICONS[post.alertType] || "⚠️"}</span>
            <div>
              <p className="font-black text-red-700 text-sm">{post.alertType?.replace(/_/g, " ").toUpperCase()}</p>
              {post.alertArea && <p className="text-xs text-gray-500">{post.alertArea}</p>}
            </div>
            <div className={`ml-auto text-[10px] font-black px-2 py-1 rounded-full ${post.alertResolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"}`}>
              {post.alertResolved ? "✅ RESOLVED" : "🔴 ONGOING"}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{displayContent}</p>
        {isLong && <button onClick={() => setExpanded(!expanded)} className="text-orange-500 text-xs font-bold mt-1 hover:underline">{expanded ? "Show less" : "Show more"}</button>}

        {/* Media */}
        {post.mediaUrls?.length > 0 && (
          <div className={`mt-3 grid gap-2 ${post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {post.mediaUrls.slice(0, 4).map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-full h-40 object-cover rounded-xl" />
                {i === 3 && post.mediaUrls.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white font-black text-xl">+{post.mediaUrls.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Poll */}
        {post.postType === "poll" && post.pollOptions?.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.pollOptions.map(opt => {
              const pct = totalPollVotes > 0 ? Math.round((opt.votes || 0) / totalPollVotes * 100) : 0;
              return (
                <button key={opt.optionId} onClick={() => !hasVoted && handleVotePoll(opt.optionId)}
                  className={`w-full text-left rounded-xl border-2 px-3 py-2.5 transition-all ${hasVoted ? "border-gray-200 cursor-default" : "border-gray-200 hover:border-blue-400"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{opt.optionText}</span>
                    {hasVoted && <span className="text-xs font-black text-blue-600">{pct}%</span>}
                  </div>
                  {hasVoted && <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} /></div>}
                </button>
              );
            })}
            <p className="text-xs text-gray-400">{totalPollVotes} votes{post.pollEndsAt ? ` • Ends ${new Date(post.pollEndsAt).toLocaleDateString()}` : ""}</p>
          </div>
        )}

        {/* Alert confirmation */}
        {post.postType === "alert" && !post.alertResolved && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-gray-600 mb-2">Can you confirm this alert?</p>
            <div className="flex gap-2">
              <button onClick={handleConfirmAlert} disabled={post.alertConfirmingUserIds?.includes(currentUser?.id)}
                className="flex-1 bg-red-500 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-red-600 disabled:opacity-60 transition-colors">
                ✅ Yes, I confirm
              </button>
            </div>
            {post.alertConfirmations > 0 && <p className="text-xs text-gray-500 mt-2">{post.alertConfirmations} neighbor{post.alertConfirmations !== 1 ? "s" : ""} confirmed this</p>}
          </div>
        )}

        {/* Kemework suggestion */}
        {post.suggestedKemeworkCategory && (
          <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-teal-700">🔧 Need help with this?</p>
              <p className="text-xs text-teal-600">Find a verified {post.suggestedKemeworkCategory} professional on Kemework</p>
            </div>
            <Link href={`/kemework/find-professionals?category=${post.suggestedKemeworkCategory}`} className="text-xs bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-teal-600 transition-colors">
              Find Pro →
            </Link>
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="px-4 pb-2 flex items-center gap-1 flex-wrap">
        {[["like","👍","Like"], ["helpful","💡","Helpful"], ["heart","❤️","Thanks"], ["important","⚠️","Important"]].map(([type, emoji, label]) => (
          <button key={type} onClick={() => handleReact(type)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${userReaction === type ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600"}`}>
            {emoji} {post.reactions?.[type] > 0 && post.reactions[type]}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4">
        <span className="text-xs text-gray-400">{post.reactionsCount || 0} reactions · {post.commentsCount || 0} comments · {post.viewCount || 0} views</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={loadComments} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold">
            <MessageCircle size={14} /> Comment
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600 flex-shrink-0">
                {c.authorName?.charAt(0) || "?"}
              </div>
              <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-gray-100">
                <p className="text-xs font-bold text-gray-900">{c.authorName} {c.authorUnit && <span className="text-gray-400 font-normal">· Unit {c.authorUnit}</span>}</p>
                <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                {currentUser.full_name?.charAt(0)}
              </div>
              <div className="flex-1 flex gap-2">
                <input value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..." onKeyDown={e => e.key === "Enter" && handleComment()}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white" />
                <button onClick={handleComment} disabled={!commentText.trim() || posting}
                  className="bg-orange-500 text-white font-bold px-3 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-60 transition-colors">
                  {posting ? "..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}