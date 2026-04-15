"use client";
// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';

export default function KemetroBuyerDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      title: 'KEMETRO',
      items: [
        { icon: '🏪', label: 'Browse Products', path: '/m/find/product' },
        { icon: '🔍', label: 'Find Products', path: '/m/find/product' },
        { icon: '❤️', label: 'My Wishlist', path: '/m/dashboard/wishlist' },
        { icon: '🛒', label: 'My Cart', path: '/m/dashboard/cart', badge: '3' },
        {
          icon: '📦',
          label: 'My Orders',
          submenu: [
            { label: 'All Orders', path: '/m/dashboard/kemetro-orders' },
            { label: 'Pending', path: '/m/dashboard/kemetro-orders?status=pending' },
            { label: 'In Transit', path: '/m/dashboard/kemetro-orders?status=shipped' },
            { label: 'Delivered', path: '/m/dashboard/kemetro-orders?status=delivered' },
            { label: 'Returns', path: '/m/dashboard/kemetro-orders?status=returned' },
          ],
        },
        { icon: '⭐', label: 'My Reviews', path: '/m/dashboard/my-reviews' },
        { icon: '📋', label: 'My RFQs', path: '/m/dashboard/rfqs' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: '👤', label: 'My Profile', path: '/m/account' },
        { icon: '📍', label: 'Delivery Addresses', path: '/m/dashboard/addresses' },
        { icon: '💳', label: 'Payment Methods', path: '/m/dashboard/payments' },
        { icon: '🔔', label: 'Notification Settings', path: '/m/settings' },
      ],
    },
  ];

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.label ? null : item.label);
    } else {
      router.push(item.path);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <span className="font-black text-orange-600 text-lg">K</span>
          <button onClick={onClose} className="p-1">
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="py-4">
          {menuItems.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-black text-gray-500 uppercase px-4 py-2 tracking-wide">{section.title}</p>
              {section.items.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                    {item.badge && <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                    {item.submenu && <ChevronRight size={16} className="text-gray-400" />}
                  </button>

                  {/* Submenu */}
                  {item.submenu && expandedMenu === item.label && (
                    <div className="bg-gray-50">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.label}
                          onClick={() => {
                            router.push(subitem.path);
                            onClose();
                          }}
                          className="w-full px-8 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                        >
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}