import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import QRGeneratorWidget from './QRGeneratorWidget';

const TARGET_TYPES = [
  { type: 'property', label: 'Property', icon: '🏠', desc: 'Scan to view listing' },
  { type: 'project', label: 'Project', icon: '🏗️', desc: 'Scan to view project' },
  { type: 'product', label: 'Product', icon: '📦', desc: 'Scan to view product' },
  { type: 'store', label: 'Store', icon: '🏪', desc: 'Scan to view store' },
  { type: 'service', label: 'Service', icon: '🔧', desc: 'Scan to view service' },
  { type: 'agent_profile', label: 'Profile', icon: '👤', desc: 'Scan to view my profile' },
];

export default function QRTargetSelector({ onClose }) {
  const [step, setStep] = useState('type'); // 'type' | 'target' | 'widget'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const loadItems = async (type) => {
    setLoading(true);
    try {
      if (type === 'property') {
        const res = await base44.entities.Property.filter({}, '-created_date', 50);
        setItems(res.map(p => ({ id: p.id, label: p.title })));
      } else if (type === 'project') {
        const res = await base44.entities.Project.filter({}, '-created_date', 50);
        setItems(res.map(p => ({ id: p.id, label: p.title || p.name })));
      } else if (type === 'product') {
        const res = await base44.entities.KemetroProduct.filter({}, '-created_date', 50);
        setItems(res.map(p => ({ id: p.id, label: p.name })));
      } else if (type === 'store') {
        const res = await base44.entities.KemetroStore.filter({}, '-created_date', 10);
        setItems(res.map(s => ({ id: s.id, label: s.storeName || s.name })));
      } else if (type === 'service') {
        const res = await base44.entities.KemeworkService.filter({}, '-created_date', 50);
        setItems(res.map(s => ({ id: s.id, label: s.title })));
      } else if (type === 'agent_profile') {
        // Use current user
        if (user) setItems([{ id: user.id, label: user.full_name }]);
      }
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = (t) => {
    setSelectedType(t);
    if (t.type === 'agent_profile' && user) {
      setSelectedTarget({ id: user.id, label: user.full_name });
      setStep('widget');
    } else {
      loadItems(t.type);
      setStep('target');
    }
  };

  const handleSelectTarget = (item) => {
    setSelectedTarget(item);
    setStep('widget');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[680px] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-[#FF6B00] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white font-black text-lg">
              {step === 'type' ? 'What would you like a QR for?' : step === 'target' ? `Select your ${selectedType?.label}` : ''}
            </p>
            {step !== 'widget' && (
              <p className="text-white/80 text-sm mt-0.5">Choose a target to generate a QR code for</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold leading-none">✕</button>
        </div>

        {/* Step: Type */}
        {step === 'type' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {TARGET_TYPES.map(t => (
                <button key={t.type} onClick={() => handleSelectType(t)}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-gray-100 hover:border-[#FF6B00] hover:bg-orange-50 transition-all group">
                  <span className="text-4xl">{t.icon}</span>
                  <p className="font-black text-gray-900 text-sm group-hover:text-[#FF6B00]">{t.label}</p>
                  <p className="text-xs text-gray-400 text-center">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Target */}
        {step === 'target' && (
          <div className="p-6">
            <button onClick={() => setStep('type')} className="text-sm text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">
              ← Back
            </button>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">{selectedType?.icon}</p>
                <p className="text-sm">No {selectedType?.label?.toLowerCase()}s found.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <button key={item.id} onClick={() => handleSelectTarget(item)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#FF6B00] hover:bg-orange-50 transition-all flex items-center gap-3">
                    <span className="text-xl">{selectedType?.icon}</span>
                    <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Widget */}
        {step === 'widget' && selectedType && selectedTarget && (
          <div>
            <QRGeneratorWidget
              targetType={selectedType.type}
              targetId={selectedTarget.id}
              targetTitle={selectedTarget.label}
              mode="full"
            />
          </div>
        )}
      </div>
    </div>
  );
}