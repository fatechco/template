import { useState } from 'react';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/header/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';
import AISearchInput from '@/components/ai-search/AISearchInput';
import AIProcessingAnimation from '@/components/ai-search/AIProcessingAnimation';
import AIRequirementsCard from '@/components/ai-search/AIRequirementsCard';
import AIPropertyCard from '@/components/ai-search/AIPropertyCard';
import AIMatchModal from '@/components/ai-search/AIMatchModal';
import AIRefineChat from '@/components/ai-search/AIRefineChat';
import AISaveSearchCard from '@/components/ai-search/AISaveSearchCard';

const SORT_OPTIONS = [
  { label: 'Best Match', value: 'match' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

function sortResults(results, sort) {
  const arr = [...results];
  if (sort === 'price_asc') arr.sort((a, b) => (a.price_amount || 0) - (b.price_amount || 0));
  else if (sort === 'price_desc') arr.sort((a, b) => (b.price_amount || 0) - (a.price_amount || 0));
  else if (sort === 'newest') arr.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  else arr.sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0));
  return arr;
}

export default function AIPropertySearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [insights, setInsights] = useState({});
  const [originalQuery, setOriginalQuery] = useState('');
  const [sort, setSort] = useState('match');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [refinementLoading, setRefinementLoading] = useState(false);
  const [streamingCriteria, setStreamingCriteria] = useState(null);

  const doSearch = async (query, language, refinement = null) => {
    setLoading(true);
    setStreamingCriteria(null);
    if (!refinement) {
      setResults(null);
      setCriteria(null);
      setInsights({});
      setOriginalQuery(query);
    }

    const res = await base44.functions.invoke('processAIPropertySearch', {
      userQuery: query,
      language,
      refinement
    });

    setLoading(false);
    setRefinementLoading(false);

    if (res.data?.success) {
      setCriteria(res.data.criteria);
      setStreamingCriteria(res.data.criteria);
      setResults(res.data.results || []);
      setInsights(res.data.insights || {});
    }
  };

  const handleSearch = (query, language) => doSearch(query, language);
  const handleRefine = (refinement) => {
    setRefinementLoading(true);
    doSearch(originalQuery, 'en', refinement);
  };

  const sorted = results ? sortResults(results, sort) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] to-white flex flex-col">
      <SiteHeader />

      {/* Hero Input Section */}
      <section className="pt-10 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            ✨ AI-Powered Property Search
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
            Describe your perfect property
          </h1>
          <p className="text-gray-500 text-base mb-8">and let AI find it for you</p>

          <AISearchInput onSearch={handleSearch} loading={loading} />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 pb-12">
        {/* Processing Animation */}
        {loading && (
          <div className="max-w-2xl mx-auto mb-8">
            <AIProcessingAnimation criteria={streamingCriteria} />
          </div>
        )}

        {/* Results Section */}
        {!loading && results !== null && (
          <div className="space-y-6">
            {/* Requirements Card */}
            {criteria && (
              <AIRequirementsCard criteria={criteria} onEdit={() => {
                setResults(null);
                setCriteria(null);
              }} />
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xl font-black text-gray-900">
                  {sorted.length} Properties Found For You
                </p>
                <p className="text-sm text-gray-400">Sorted by AI match score</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none appearance-none pr-8 bg-white cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* View */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* No results */}
            {sorted.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <p className="text-5xl mb-3">🏠</p>
                <p className="font-bold text-gray-700 text-lg">No properties found matching your criteria</p>
                <p className="text-gray-400 text-sm mt-1">Try broadening your search or using the refine chat below</p>
              </div>
            )}

            {/* Property Grid/List */}
            {sorted.length > 0 && (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {sorted.map(p => (
                  <AIPropertyCard
                    key={p.id}
                    property={p}
                    insight={insights[p.id]}
                    onViewAnalysis={(prop, ins) => setSelectedProperty({ property: prop, insight: ins })}
                  />
                ))}
              </div>
            )}

            {/* Refine Chat */}
            <AIRefineChat
              originalQuery={originalQuery}
              onRefine={handleRefine}
              loading={refinementLoading}
              resultCount={sorted.length}
            />

            {/* Save Search */}
            <AISaveSearchCard query={originalQuery} criteria={criteria} />
          </div>
        )}

        {/* Empty state — no search yet */}
        {!loading && results === null && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-lg font-bold text-gray-500">Describe what you're looking for above</p>
            <p className="text-sm mt-1">The more detail you give, the better the matches</p>
          </div>
        )}
      </div>

      <SiteFooter />

      {/* Match Analysis Modal */}
      {selectedProperty && (
        <AIMatchModal
          property={selectedProperty.property}
          insight={selectedProperty.insight}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}