import CpShell from '@/components/dashboard/shells/CpShell';
import {
  LayoutDashboard, Home, Search, User, FileText, DollarSign,
  MessageCircle, HelpCircle, CreditCard, ClipboardList,
  BarChart3, Users, Calendar, UserSquare, Briefcase,
  MapPin, HardHat, Plus, Star, Bookmark,
  ShoppingCart, Bell, Settings, LineChart
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/cp/agency' },
  {
    label: 'My Business', icon: Briefcase, children: [
      { label: 'Business Profile', icon: UserSquare, to: '/cp/agency/business-profile' },
      { label: 'Manage Agents', icon: Users, to: '/cp/agency/my-agents' },
      { label: 'Performance Stats', icon: BarChart3, to: '/cp/agency/performance' },
      { label: 'Agency Analytics', icon: LineChart, to: '/cp/agency/performance' },
      { label: 'Clients', icon: Users, to: '/cp/agency/clients' },
      { label: 'Appointments', icon: Calendar, to: '/cp/agency/appointments' },
    ]
  },
  {
    label: '🏙 Kemedar', icon: MapPin, children: [
      { heading: 'PROPERTIES' },
      { label: 'Find Property', icon: Search, to: '/search-properties' },
      { label: 'My Properties', icon: Home, to: '/cp/agency/my-properties' },
      { label: 'Add New Property', icon: Plus, to: '/create/property' },
      { heading: 'REQUESTS' },
      { label: 'Add Buy Request', icon: FileText, to: '/create/buy-request' },
      { label: 'My Buy Requests', icon: ClipboardList, to: '/cp/agency/my-buy-requests' },
    ]
  },
  {
    label: '🔧 Kemework', icon: HardHat, children: [
      { heading: 'MY TASKS' },
      { label: 'Post a Task', icon: Plus, to: '/kemework/post-task' },
      { label: 'My Tasks', icon: FileText, to: '/cp/agency/kemework/my-tasks' },
      { label: 'My Task Orders', icon: ClipboardList, to: '/cp/agency/kemework/orders' },
      { heading: 'FIND & BROWSE' },
      { label: 'Find Professionals', icon: Users, to: '/kemework/find-professionals' },
      { label: 'Browse Services', icon: Star, to: '/kemework/services' },
      { heading: 'SAVED' },
      { label: 'Bookmarked Pros & Services', icon: Bookmark, to: '/cp/agency/kemework/bookmarks' },
    ]
  },
  {
    label: '🛒 Kemetro', icon: ShoppingCart, children: [
      { heading: 'SHOPPING' },
      { label: 'Browse Products', icon: Search, to: '/kemetro/search' },
      { label: 'My Cart', icon: ShoppingCart, to: '/m/kemetro/cart' },
      { heading: 'MY ORDERS' },
      { label: 'All Orders', icon: ClipboardList, to: '/cp/agency/kemetro-orders' },
      { heading: 'REQUESTS' },
      { label: 'My RFQs', icon: FileText, to: '/cp/agency/kemetro-rfqs' },
    ]
  },
  { label: '💎 Premium Services', icon: CreditCard, to: '/cp/agency/premium-services' },
  {
    label: '🤖 AI & Smart Tools', icon: Star, children: [
      { heading: 'PROPERTY AI' },
      { label: 'Vision™ — Photo Analysis', icon: Search, to: '/cp/agency/vision' },
      { label: 'Negotiate™ — Deal Coach', icon: MessageCircle, to: '/cp/agency/negotiations' },
      { label: 'Escrow™', icon: CreditCard, to: '/cp/agency/escrow' },
      { heading: 'MY PROFILE' },
      { label: 'Kemedar Score', icon: Star, to: '/cp/agency/score' },
      { label: 'My DNA Profile', icon: UserSquare, to: '/cp/agency/my-dna' },
    ]
  },
  {
    label: '💰 Money & Orders', icon: DollarSign, children: [
      { heading: 'PAYMENTS' },
      { label: 'Wallet', icon: CreditCard, to: '/cp/agency/wallet' },
      { label: 'Invoices', icon: FileText, to: '/cp/agency/invoices' },
      { label: 'Payment Methods', icon: CreditCard, to: '/cp/agency/payment-methods' },
      { heading: 'ORDERS' },
      { label: 'Kemedar Orders', icon: ClipboardList, to: '/cp/agency/kemedar-orders' },
      { label: 'Kemetro Orders', icon: ShoppingCart, to: '/cp/agency/kemetro-orders' },
      { label: 'Kemework Orders', icon: ClipboardList, to: '/cp/agency/kemework-orders' },
    ]
  },
  {
    label: '🗂 Tools & Communications', icon: MessageCircle, children: [
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages', icon: MessageCircle, to: '/cp/agency/messages' },
      { label: 'Notifications', icon: Bell, to: '/cp/agency/notifications' },
      { heading: 'ACCOUNT' },
      { label: 'Subscription & Billing', icon: CreditCard, to: '/cp/agency/subscription' },
      { label: 'Settings', icon: Settings, to: '/cp/agency/settings' },
    ]
  },
  {
    label: '❓ Help', icon: HelpCircle, children: [
      { label: 'Support Tickets', icon: Bell, to: '/cp/agency/tickets' },
      { label: 'Help Center & FAQ', icon: FileText, to: '/cp/agency/knowledge' },
      { label: 'Contact Us', icon: MessageCircle, to: '/cp/agency/contact-kemedar' },
    ]
  },
];

export default function AgencyShell() {
  return (
    <CpShell
      menuItems={MENU}
      badgeLabel="Agency"
      badgeColor="bg-cyan-600"
      profileTo="/cp/agency/business-profile"
    />
  );
}