import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { EVENT_TYPE_META } from "@/lib/liveEventUtils";
import { Sparkles, Plus, Trash2, GripVertical } from "lucide-react";

const EVENT_TYPES = [
  { value: 'property_launch', icon: '🏗️', title: 'Property Launch', desc: 'Unveil a new project live' },
  { value: 'open_house', icon: '🏠', title: 'Open House', desc: 'Live property walkthrough' },
  { value: 'market_briefing', icon: '📊', title: 'Market Briefing', desc: 'Market conditions analysis' },
  { value: 'investment_seminar', icon: '💰', title: 'Investment Seminar', desc: 'ROI and investment content' },
  { value: 'developer_presentation', icon: '🤝', title: 'Developer Presentation', desc: 'Off-plan deep dive' },
  { value: 'educational_webinar', icon: '🎓', title: 'Educational Webinar', desc: 'How-to sessions' },
];

const STEPS = ['Event Type & Basics', 'Properties & Content', 'Schedule & Access', 'Interaction & Purchase', 'Review & Submit'];

export default function LiveCreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBrief, setAiBrief] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  const [form, setForm] = useState({
    eventType: '', title: '', titleAr: '', description: '', descriptionAr: '',
    language: 'bilingual', hostType: 'developer', organizationName: '',
    featuredPropertyIds: [], agenda: [],
    scheduledStartAt: '', estimatedDurationMinutes: 60,
    isPublic: true, requiresRegistration: true, maxViewers: null,
    chatEnabled: true, qAndAEnabled: true, pollsEnabled: true, reactionsEnabled: true, raiseHandEnabled: true, moderationRequired: false,
    purchaseEnabled: false, exclusivePricing: false, eventOnlyDiscount: 5,
    isRecorded: true, tags: [],
  });

  const update = (patch) => setForm(f => ({ ...f, ...patch }));

  const generateWithAI = async () => {
    if (!aiBrief.trim() || !form.eventType) return;
    setAiLoading(true);
    const res = await base44.functions.invoke('generateEventDescription', {
      briefDescription: aiBrief, eventType: form.eventType,
      hostName: form.organizationName || 'Host', organizationName: form.organizationName,
    });
    if (res.data) {
      update({
        title: res.data.titleEn || form.title,
        titleAr: res.data.titleAr || form.titleAr,
        description: res.data.descriptionEn || form.description,
        descriptionAr: res.data.descriptionAr || form.descriptionAr,
        agenda: res.data.agendaSuggestions || form.agenda,
        tags: res.data.tags || form.tags,
      });
      setShowAiPanel(false);
    }
    setAiLoading(false);
  };

  const addAgendaItem = () => update({ agenda: [...form.agenda, { topic: '', time: '', durationMinutes: 15 }] });
  const updateAgenda = (i, patch) => update({ agenda: form.agenda.map((a, idx) => idx === i ? { ...a, ...patch } : a) });
  const removeAgenda = (i) => update({ agenda: form.agenda.filter((_, idx) => idx !== i) });

  const handleSubmit = async () => {
    setSubmitting(true);
    const user = await base44.auth.me();
    const eventNumber = `KLE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const ev = await base44.entities.LiveEvent.create({
      ...form, eventNumber, hostId: user.id,
      streamStatus: 'scheduled', isApproved: false,
      totalRegistered: 0, totalAttended: 0, peakViewers: 0,
      aiSummaryStatus: 'not_started', recordingStatus: 'not_started',
    });
    navigate(`/kemedar/live/event/${ev.id}`);
  };

  const canNext = () => {
    if (step === 0) return !!form.eventType && !!form.title;
    if (step === 2) return !!form.scheduledStartAt;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">📺 Create Live Event</h1>
          <p className="text-gray-500 text-sm">Events are reviewed and approved within 4 hours</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-6">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

        {/* Step 0: Event Type */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-3">What kind of event?</h2>
              <div className="grid grid-cols-2 gap-3">
                {EVENT_TYPES.map(t => (
                  <button key={t.value} onClick={() => update({ eventType: t.value })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${form.eventType === t.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-300'}`}>
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <p className="font-black text-gray-900 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Your organization</label>
              <input value={form.organizationName} onChange={e => update({ organizationName: e.target.value })}
                placeholder="Company or developer name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-600">Event Title</label>
                {form.eventType && (
                  <button onClick={() => setShowAiPanel(!showAiPanel)} className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full hover:bg-purple-200 transition-colors">
                    <Sparkles size={11} /> ✨ Generate with AI
                  </button>
                )}
              </div>

              {showAiPanel && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-3">
                  <p className="text-xs font-bold text-purple-700 mb-2">Describe your event briefly:</p>
                  <textarea value={aiBrief} onChange={e => setAiBrief(e.target.value)} rows={3}
                    placeholder="e.g. Launching a new compound in 6th October City, 3 phases, apartments 60-180sqm, starting 1.2M EGP..."
                    className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 bg-white resize-none mb-2" />
                  <button onClick={generateWithAI} disabled={aiLoading || !aiBrief.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                    {aiLoading ? 'Generating...' : 'Generate →'}
                  </button>
                </div>
              )}

              <input value={form.title} onChange={e => update({ title: e.target.value })}
                placeholder="Event title in English"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 mb-2" />
              <input value={form.titleAr} onChange={e => update({ titleAr: e.target.value })}
                placeholder="عنوان الحدث بالعربية"
                dir="rtl"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Language</label>
              <div className="flex gap-2">
                {[{ v: 'arabic', l: '🇸🇦 Arabic' }, { v: 'english', l: '🇬🇧 English' }, { v: 'bilingual', l: '🇸🇦🇬🇧 Both' }].map(o => (
                  <button key={o.v} onClick={() => update({ language: o.v })}
                    className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-colors ${form.language === o.v ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Properties & Content */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Event Description</label>
              <textarea value={form.description} onChange={e => update({ description: e.target.value })} rows={5}
                placeholder="Describe what attendees will learn, see, and gain from this event..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-600">📋 Event Agenda</label>
                <button onClick={addAgendaItem} className="flex items-center gap-1 text-xs text-orange-600 font-bold hover:text-orange-700">
                  <Plus size={12} /> Add Item
                </button>
              </div>
              {form.agenda.length === 0 && (
                <div className="text-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-400 text-sm">
                  Add agenda items to help viewers prepare
                </div>
              )}
              {form.agenda.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={item.topic} onChange={e => updateAgenda(i, { topic: e.target.value })}
                    placeholder={`Topic ${i + 1}...`}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input value={item.time} onChange={e => updateAgenda(i, { time: e.target.value })}
                    placeholder="0:00-0:15"
                    className="w-24 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <button onClick={() => removeAgenda(i)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Event Date & Time</label>
                <input type="datetime-local" value={form.scheduledStartAt} onChange={e => update({ scheduledStartAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Duration (minutes)</label>
                <input type="number" value={form.estimatedDurationMinutes} onChange={e => update({ estimatedDurationMinutes: Number(e.target.value) })}
                  min={15} max={480}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-2">Who can attend</label>
              {[
                { v: true, label: '🌍 Public — anyone can register' },
                { v: false, label: '🔒 Private — invite only' },
              ].map(o => (
                <label key={String(o.v)} className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 cursor-pointer mb-1">
                  <input type="radio" name="isPublic" checked={form.isPublic === o.v} onChange={() => update({ isPublic: o.v })} className="text-orange-500" />
                  <span className="text-sm text-gray-700">{o.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Maximum viewers (optional)</label>
              <input type="number" value={form.maxViewers || ''} onChange={e => update({ maxViewers: e.target.value ? Number(e.target.value) : null })}
                placeholder="Leave empty for unlimited"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
        )}

        {/* Step 3: Interaction */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">Event Features</h2>
            {[
              { key: 'chatEnabled', label: '💬 Live Chat', desc: 'Viewers can message during stream' },
              { key: 'qAndAEnabled', label: '❓ Q&A with moderation', desc: 'Viewers submit questions for host' },
              { key: 'reactionsEnabled', label: '❤️ Viewer reactions', desc: 'Emoji reactions during stream' },
              { key: 'pollsEnabled', label: '📊 Polls', desc: 'Launch interactive polls' },
              { key: 'raiseHandEnabled', label: '🙋 Raise hand', desc: 'Viewers can request to speak' },
              { key: 'moderationRequired', label: '🛡️ Chat moderation', desc: 'AI reviews messages before showing' },
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.label}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
                <button onClick={() => update({ [f.key]: !form[f.key] })}
                  className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${form[f.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${form[f.key] ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-gray-900 text-sm">🏠 Enable Unit Reservation During Event</p>
                <button onClick={() => update({ purchaseEnabled: !form.purchaseEnabled })}
                  className={`w-11 h-6 rounded-full relative transition-colors ${form.purchaseEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${form.purchaseEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              {form.purchaseEnabled && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Event exclusive discount</span>
                    <button onClick={() => update({ exclusivePricing: !form.exclusivePricing })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${form.exclusivePricing ? 'bg-orange-500' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${form.exclusivePricing ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {form.exclusivePricing && (
                    <div className="flex items-center gap-2">
                      <input type="number" value={form.eventOnlyDiscount} onChange={e => update({ eventOnlyDiscount: Number(e.target.value) })}
                        min={1} max={30}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400" />
                      <span className="text-sm text-gray-600">% discount for event attendees</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{EVENT_TYPE_META[form.eventType]?.icon}</span>
                <div>
                  <p className="font-black text-gray-900">{form.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{form.eventType?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Date</p><p className="font-semibold">{form.scheduledStartAt ? new Date(form.scheduledStartAt).toLocaleDateString() : '—'}</p></div>
                <div><p className="text-xs text-gray-400">Duration</p><p className="font-semibold">{form.estimatedDurationMinutes} min</p></div>
                <div><p className="text-xs text-gray-400">Language</p><p className="font-semibold capitalize">{form.language}</p></div>
                <div><p className="text-xs text-gray-400">Access</p><p className="font-semibold">{form.isPublic ? 'Public' : 'Private'}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {form.chatEnabled && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">💬 Chat</span>}
                {form.qAndAEnabled && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">❓ Q&A</span>}
                {form.pollsEnabled && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">📊 Polls</span>}
                {form.purchaseEnabled && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🏠 Reservations</span>}
              </div>
            </div>

            <div className="space-y-2">
              {[
                'I agree to Live Event terms and conditions',
                'Event content and information is accurate',
                'I am authorized to sell or present the featured properties',
              ].map((t, i) => (
                <label key={i} className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 text-orange-500" required />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-700">📋 Events are reviewed and approved within 4 hours. You'll be notified when approved.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors">
              {submitting ? 'Submitting...' : '📺 Submit for Approval'}
            </button>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}