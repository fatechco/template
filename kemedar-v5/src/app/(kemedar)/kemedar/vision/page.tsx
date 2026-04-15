"use client";

import { useState } from "react";
import { Eye, Upload, Loader2, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function VisionPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!imageUrl.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post<any>("/api/v1/ai/vision", { imageUrl });
      setAnalysis(res);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Eye className="w-12 h-12 text-violet-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">AI Vision</h1>
        <p className="text-slate-500 mt-2">Upload a property photo for AI-powered analysis and insights</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-slate-400 mb-4">
          <Upload className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">Drag and drop a property image or paste a URL below</p>
        </div>
        <div className="flex gap-3">
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1 px-4 py-3 border rounded-lg text-sm" />
          <button onClick={handleAnalyze} disabled={loading || !imageUrl.trim()} className="bg-violet-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-violet-700 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Analyze
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-bold">AI Analysis Results</h3>
          {analysis.propertyType && (
            <div className="flex justify-between text-sm"><span className="text-slate-500">Property Type</span><span className="font-medium">{analysis.propertyType}</span></div>
          )}
          {analysis.estimatedCondition && (
            <div className="flex justify-between text-sm"><span className="text-slate-500">Condition</span><span className="font-medium">{analysis.estimatedCondition}</span></div>
          )}
          {analysis.features?.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Detected Features</div>
              <div className="flex flex-wrap gap-2">
                {analysis.features.map((f: string, i: number) => (
                  <span key={i} className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.description && (
            <div><div className="text-sm font-medium mb-1">Description</div><p className="text-sm text-slate-600">{analysis.description}</p></div>
          )}
        </div>
      )}
    </div>
  );
}
