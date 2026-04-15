"use client";
// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';

export default function KemetroSellerDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      title: 'MY STORE',
      items: [
        { icon: '📊', label: 'Store Dashboard', path: '/m/dashboard/seller-dashboard' },
        {
          icon: '📦',
          label: 'My Products',
          submenu: [
            { label: 'All Products', path: '/m/dashboard/seller-products' },
            { label: 'Add Product', path: '/m/dashboard/seller-products/add' },
            { label: 'Pending Approval', path: '/m/dashboard/seller-products?status=pending' },
            { label: 'Out of Stock', path: '/m/dashboard/seller-products?status=out_of_stock' },
          ],
        },
        {
          icon: '🛍',
          label: 'Orders',
          submenu: [
            { label: 'New Orders', path: '/m/dashboard/seller-orders?status=new' },
            { label: 'In Progress', path: '/m/dashboard/seller-orders?status=progress' },
            { label: 'Completed', path: '/m/dashboard/seller-orders?status=delivered' },
            { label: 'Cancelled', path: '/m/dashboard/seller-orders?status=cancelled' },
          ],
        },
        { icon: '💰', label: 'Earnings', path: '/m/dashboard/seller-earnings' },
        { icon: '🧾', label: 'Invoices', path: '/m/dashboard/seller-invoices' },
        { icon: '⭐', label: 'Reviews', path: '/m/dashboard/seller-reviews' },
        { icon: '📢', label: 'Promotions', path: '/m/dashboard/seller-promotions' },
        { icon: '🚚', label: 'Shipping Settings', path: '/m/dashboard/seller-shipping' },
        { icon: '🎫', label: 'Coupons', path: '/m/dashboard/seller-coupons' },
        { icon: '📊', label: 'Analytics', path: '/m/dashboard/seller-analytics' },
        { icon: '💳', label: 'Subscription & Plan', path: '/m/dashboard/seller-subscription' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { icon: '👤', label: 'My Profile', path: '/m/account' },
        { icon: '🏪', label: 'Store Settings', path: '/m/dashboard/seller-settings' },
        { icon: '🔔', label: 'Notifications', path: '/m/settings' },
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
          <span className="font-black text-blue-600 text-lg">K</span>
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
                    className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
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