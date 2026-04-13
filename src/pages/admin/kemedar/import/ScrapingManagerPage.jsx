import { useState } from "react";
import SourceConfiguration from "@/components/admin/kemedar/import/SourceConfiguration";
import ScrapeJobsPanel from "@/components/admin/kemedar/import/ScrapeJobsPanel";
import DataPreview from "@/components/admin/kemedar/import/DataPreview";

export default function ScrapingManagerPage() {
  const [scrapingStarted, setScrapingStarted] = useState(false);

  const handleStartScrape = (config) => {
    setScrapingStarted(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Scraping Manager</h1>
        <p className="text-sm text-gray-600 mt-1">Configure and manage web scraping operations</p>
      </div>

      {/* Three-Panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Panel 1: Source Configuration (35%) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Configure Scraping Source</h2>
            <SourceConfiguration onStartScrape={handleStartScrape} />
          </div>
        </div>

        {/* Panel 2: Active Jobs (35%) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <ScrapeJobsPanel />
          </div>
        </div>

        {/* Panel 3: Preview (30%) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <DataPreview />
          </div>
        </div>
      </div>
    </div>
  );
}