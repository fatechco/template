"use client";
// @ts-nocheck
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function QRPreview({ qrCode, generating, error }) {
  const [copied, setCopied] = useState(false);
  const [pdfFormat, setPdfFormat] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    if (!qrCode?.trackingUrl) return;
    navigator.clipboard.writeText(qrCode.trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!qrCode?.trackingUrl) return;
    const text = encodeURIComponent(`Scan this QR to view ${qrCode.targetTitle || 'listing'}: ${qrCode.trackingUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    if (!qrCode?.trackingUrl) return;
    const subject = encodeURIComponent(`QR Code: ${qrCode.targetTitle || 'Listing'}`);
    const body = encodeURIComponent(`Scan this QR to view ${qrCode.targetTitle || 'listing'}: ${qrCode.trackingUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleDownload = async (format, pageSize = 'A4') => {
    if (!qrCode?.id || downloading) return;
    setDownloading(true);
    try {
      const res = await apiClient.post('/api/v1/ai/downloadQRCode', {
        qrCodeId: qrCode.id,
        format,
        pageSize,
      });
      const data = res.data;
      if (data.downloadUrl) {
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = data.filename || `qr-code.${format}`;
        a.target = '_blank';
        a.click();
      }
      if (format === 'pdf') setPdfFormat(null);
    } catch (e) {
      alert('Download failed: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="p-6 bg-[#F8FAFC] flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>
      {/* Preview */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Live Preview</p>
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center shadow-sm">
          {generating ? (
            <div className="w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse" />
          ) : error ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-red-300 rounded-xl text-red-500 text-xs text-center p-4">
              {error}
            </div>
          ) : qrCode?.qrImagePngUrl ? (
            <img
              src={qrCode.qrImagePngUrl}
              alt="QR Code Preview"
              className="w-[200px] h-[200px] object-contain rounded-xl"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-xl text-gray-400 text-xs text-center p-4">
              Click "Regenerate Preview" to generate your QR code
            </div>
          )}
        </div>

        {qrCode && (
          <p className="text-[11px] text-gray-400 text-center mt-2">
            📊 {qrCode.totalScans || 0} total scans ·{' '}
            👁️ {qrCode.uniqueScans || 0} unique ·{' '}
            🕐 Last: {timeAgo(qrCode.lastScannedAt)}
          </p>
        )}
      </div>

      {/* Download */}
      {qrCode && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Download As</p>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => handleDownload('png')}
              disabled={downloading}
              className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:border-orange-300 hover:text-[#FF6B00] transition-all disabled:opacity-50"
            >
              📥 PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              disabled={downloading}
              className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:border-orange-300 hover:text-[#FF6B00] transition-all disabled:opacity-50"
            >
              📐 SVG
            </button>
            <button
              onClick={() => setPdfFormat(f => f === 'open' ? null : 'open')}
              disabled={downloading}
              className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all disabled:opacity-50 ${pdfFormat === 'open' ? 'border-[#FF6B00] text-[#FF6B00] bg-orange-50' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'}`}
            >
              🖨️ PDF
            </button>
          </div>
          {pdfFormat === 'open' && (
            <div className="flex flex-col gap-1.5 mt-1">
              {[['A4', 'A4 Page'], ['business_card', 'Business Card'], ['flyer', 'A5 Flyer']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => handleDownload('pdf', val)}
                  disabled={downloading}
                  className="w-full py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share */}
      {qrCode && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Share</p>
          <div className="space-y-2">
            <button
              onClick={handleCopy}
              className="w-full py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:border-orange-300 transition-all text-left px-3"
            >
              {copied ? '✓ Copied!' : '📋 Copy Tracking URL'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition-all text-left px-3"
            >
              💬 Share on WhatsApp
            </button>
            <button
              onClick={handleEmail}
              className="w-full py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all text-left px-3"
            >
              📧 Share by Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}