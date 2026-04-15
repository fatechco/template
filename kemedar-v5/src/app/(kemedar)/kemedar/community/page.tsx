"use client";

import { useCommunities } from "@/hooks/use-community";
import Link from "next/link";
import { Users, Shield } from "lucide-react";

export default function CommunityPage() {
  const { data, isLoading } = useCommunities();

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        <p className="text-slate-500 mt-2">Join your residential community for alerts, events, and local recommendations</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data || []).map((c: any) => (
            <Link
              key={c.id}
              href={`/kemedar/community/${c.id}`}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {c.logoUrl ? (
                  <img src={c.logoUrl} alt="" className="w-10 h-10 rounded-lg" />
                ) : (
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.type}</p>
                </div>
                {c.isVerified && <Shield className="w-4 h-4 text-green-600 ml-auto" />}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{c.description || "Join this community"}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span><Users className="w-3 h-3 inline mr-1" />{c.membersCount} members</span>
                <span>{c.postsCount} posts</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
