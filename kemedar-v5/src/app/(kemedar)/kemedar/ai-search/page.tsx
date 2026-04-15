"use client";

import { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post<any>("/api/v1/ai/search", { query });
      setResults(res);
    } catch {
      /* handled by api client */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">AI Property Search</h1>
        <p className="text-slate-500 mt-2">Describe what you are looking for in natural language</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. 3 bedroom apartment in New Cairo under 2 million EGP with garden..."
            className="flex-1 px-4 py-3 border rounded-lg text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Search
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-2">AI Interpretation</h3>
          <p className="text-slate-600 text-sm mb-4">{results.interpretation}</p>
          {results.suggestions?.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Suggestions:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600">
                {results.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
