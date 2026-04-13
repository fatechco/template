import { useState } from 'react';
import { Save, CheckCircle, Upload, X, Image, MapPin, Phone, Mail, Globe } from 'lucide-react';
import QRGeneratorWidget from '@/components/qr/QRGeneratorWidget';

export default function EditStoreDesktop() {
  const [saved, setSaved] = useState(false);
  const [store, setStore] = useState({
    name: 'My Awesome Store',
    tagline: 'Your one-stop shop for everything',
    description: 'We offer high-quality products with fast shipping and excellent customer service. Our mission is to provide the best shopping experience.',
    logo: null,
    banner: null,
    gallery: [],
    phone: '+1234567890',
    email: 'store@example.com',
    website: 'https://mystore.com',
    address: '123 Main Street, City, Country',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
  });

  const set = (key, val) => setStore(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => set('logo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => set('banner', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        set('gallery', [...store.gallery, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    set('gallery', store.gallery.filter((_, i) => i !== index));
  };

  const setSocial = (platform, val) => set('socialLinks', { ...store.socialLinks, [platform]: val });
  const setHours = (day, val) => set('businessHours', { ...store.businessHours, [day]: val });

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400';
  const labelClass = 'text-sm font-bold text-gray-700 block mb-2';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Edit Store Profile</h1>
          <p className="text-gray-600">Customize your store's appearance and information</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Store Images */}
        <div className="col-span-2 space-y-6">
          {/* Logo & Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Store Branding</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Logo */}
              <div>
                <label className={labelClass}>Store Logo</label>
                <div className="flex items-center gap-4">
                  {store.logo ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                      <button
                        onClick={() => set('logo', null)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <Image size={32} className="text-gray-400" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-bold text-gray-700">
                    <Upload size={16} />
                    {store.logo ? 'Change Logo' : 'Upload Logo'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-500">Recommended: 500x500px, PNG or JPG</p>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className={labelClass}>Store Banner</label>
                {store.banner ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 mb-3">
                    <img src={store.banner} alt="Banner" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => set('banner', null)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 mb-3">
                    <div className="text-center">
                      <Image size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload your store banner</p>
                    </div>
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-bold text-gray-700">
                  <Upload size={16} />
                  {store.banner ? 'Change Banner' : 'Upload Banner'}
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-2">Recommended: 1920x400px, PNG or JPG</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Store Gallery</h2>
              <p className="text-xs text-gray-500 mt-0.5">Showcase your store with photos</p>
            </div>
            <div className="p-6">
              <label className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 rounded-lg cursor-pointer text-sm font-bold text-teal-700 mb-4">
                <Upload size={16} />
                Upload Photos
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              </label>
              {store.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {store.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Store Name *</label>
                <input
                  type="text"
                  value={store.name}
                  onChange={e => set('name', e.target.value)}
                  className={inputClass}
                  placeholder="Your store name"
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input
                  type="text"
                  value={store.tagline}
                  onChange={e => set('tagline', e.target.value)}
                  className={inputClass}
                  placeholder="A short catchy phrase"
                  maxLength={100}
                />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  value={store.description}
                  onChange={e => set('description', e.target.value)}
                  className={`${inputClass} h-32 resize-none`}
                  placeholder="Tell customers about your store"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1">{store.description.length}/1000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Hours */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Contact Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>
                  <Phone size={14} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={store.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={inputClass}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Mail size={14} className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={store.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputClass}
                  placeholder="store@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Globe size={14} className="inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={store.website}
                  onChange={e => set('website', e.target.value)}
                  className={inputClass}
                  placeholder="https://yourstore.com"
                />
              </div>
              <div>
                <label className={labelClass}>
                  <MapPin size={14} className="inline mr-1" />
                  Address
                </label>
                <textarea
                  value={store.address}
                  onChange={e => set('address', e.target.value)}
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="Full store address"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Social Media Links</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Facebook</label>
                <input
                  type="url"
                  value={store.socialLinks.facebook}
                  onChange={e => setSocial('facebook', e.target.value)}
                  className={inputClass}
                  placeholder="https://facebook.com/yourstore"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Instagram</label>
                <input
                  type="url"
                  value={store.socialLinks.instagram}
                  onChange={e => setSocial('instagram', e.target.value)}
                  className={inputClass}
                  placeholder="https://instagram.com/yourstore"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={store.socialLinks.twitter}
                  onChange={e => setSocial('twitter', e.target.value)}
                  className={inputClass}
                  placeholder="https://twitter.com/yourstore"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">Business Hours</h2>
            </div>
            <div className="p-6 space-y-3">
              {Object.entries(store.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 w-20 capitalize">{day.slice(0, 3)}</span>
                  <input
                    type="text"
                    value={hours}
                    onChange={e => setHours(day, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-teal-400"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store QR Code */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900 text-sm">📱 Store QR Code</h2>
          <p className="text-xs text-gray-500 mt-0.5">Share your store QR on packaging, invoices, and marketing materials to drive repeat customers.</p>
        </div>
        <div className="p-6">
          <QRGeneratorWidget targetType="store" targetId={store.name} targetTitle={store.name} mode="full" />
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}