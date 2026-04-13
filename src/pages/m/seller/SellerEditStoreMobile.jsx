import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, CheckCircle, Upload, X, Image, ArrowLeft, Store } from "lucide-react";

export default function SellerEditStoreMobile({ onOpenDrawer }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [store, setStore] = useState({
    name: 'My Awesome Store',
    tagline: 'Your one-stop shop for everything',
    description: 'We offer high-quality products with fast shipping and excellent customer service.',
    logo: null,
    banner: null,
    gallery: [],
    phone: '+1234567890',
    email: 'store@example.com',
    website: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
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

  const handleSaveClick = () => {
    handleSave();
    setTimeout(() => navigate(-1), 1500);
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400';

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Edit Store</span>
        <button onClick={onOpenDrawer} className="p-1 -mr-1">
          <Store size={24} className="text-gray-900" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-[#0077B6] text-white"
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>

        {/* Logo & Banner */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Store Branding</h3>
          
          {/* Logo */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-600 block mb-2">Store Logo</label>
            <div className="flex items-center gap-3">
              {store.logo ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                  <button
                    onClick={() => set('logo', null)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0">
                  <Image size={28} className="text-gray-400" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-xs font-bold text-gray-700">
                <Upload size={14} />
                {store.logo ? 'Change Logo' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-2">Store Banner</label>
            {store.banner ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 mb-2">
                <img src={store.banner} alt="Banner" className="w-full h-32 object-cover" />
                <button
                  onClick={() => set('banner', null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 mb-2">
                <div className="text-center">
                  <Image size={32} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Upload banner</p>
                </div>
              </div>
            )}
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-xs font-bold text-gray-700">
              <Upload size={14} />
              {store.banner ? 'Change Banner' : 'Upload Banner'}
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Store Gallery</h3>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 rounded-lg cursor-pointer text-xs font-bold text-teal-700 mb-3">
            <Upload size={14} />
            Upload Photos
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
          </label>
          {store.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {store.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Store Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Store Name *</label>
              <input
                type="text"
                value={store.name}
                onChange={e => set('name', e.target.value)}
                className={inputClass}
                placeholder="Your store name"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Tagline</label>
              <input
                type="text"
                value={store.tagline}
                onChange={e => set('tagline', e.target.value)}
                className={inputClass}
                placeholder="Short catchy phrase"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Description *</label>
              <textarea
                value={store.description}
                onChange={e => set('description', e.target.value)}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Tell customers about your store"
                maxLength={500}
              />
              <p className="text-[9px] text-gray-400 mt-1">{store.description.length}/500</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={store.phone}
                onChange={e => set('phone', e.target.value)}
                className={inputClass}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Email Address</label>
              <input
                type="email"
                value={store.email}
                onChange={e => set('email', e.target.value)}
                className={inputClass}
                placeholder="store@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Website</label>
              <input
                type="url"
                value={store.website}
                onChange={e => set('website', e.target.value)}
                className={inputClass}
                placeholder="https://yourstore.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Address</label>
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
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Social Media</h3>
          <div className="space-y-3">
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
      </div>
    </div>
  );
}