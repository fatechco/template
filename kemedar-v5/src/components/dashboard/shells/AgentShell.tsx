// @ts-nocheck
import CpShell from '@/components/dashboard/shells/CpShell';
import {
  LayoutDashboard, Home, Search, Heart, User, FileText, DollarSign,
  MessageCircle, HelpCircle, CreditCard, ClipboardList, ScanSearch,
  GitCompare, BarChart3, Users, Calendar, UserSquare, Briefcase,
  MapPin, HardHat, KanbanSquare, Plus, Star, Bookmark,
  ShoppingCart, Bell, Settings
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/cp/agent' },
  {
    label: 'My Business', icon: Briefcase, children: [
      { label: 'Business Profile', icon: UserSquare, to: '/cp/agent/business-profile' },
      { label: 'Performance Stats', icon: BarChart3, to: '/cp/agent/performance' },
      { label: 'Clients', icon: Users, to: '/cp/agent/clients' },
      { label: 'Appointments', icon: Calendar, to: '/cp/agent/appointments' },
    ]
  },
  {
    label: '🏙 Kemedar', icon: MapPin, children: [
      { heading: 'PROPERTIES' },
      { label: 'Find Property', icon: Search, to: '/search-properties' },
      { label: 'Browse Properties', icon: Home, to: '/search-properties' },
      { label: 'My Properties', icon: Home, to: '/cp/agent/my-properties' },
      { label: 'Add New Property', icon: Plus, to: '/create/property' },
      { label: 'My Favorites', icon: Heart, to: '/cp/agent/favorites' },
      { label: 'Compare Properties', icon: GitCompare, to: '/cp/agent/compare' },
      { heading: 'REQUESTS' },
      { label: 'Add Buy Request', icon: FileText, to: '/create/buy-request' },
      { label: 'My Buy Requests', icon: ClipboardList, to: '/cp/agent/my-buy-requests' },
      { label: 'Search Buy Requests', icon: ScanSearch, to: '/cp/agent/search-requests' },
      { heading: 'PROJECTS' },
      { label: 'Find Project', icon: Search, to: '/search-projects' },
      { label: 'Add Project', icon: Plus, to: '/create/project' },
      { label: 'My Projects', icon: Briefcase, to: '/cp/agent/my-projects' },
      { heading: 'ORGANIZERS' },
      { label: 'Buyer Organizer', icon: KanbanSquare, to: '/cp/agent/buyer-organizer' },
      { label: 'Seller Organizer', icon: KanbanSquare, to: '/cp/agent/seller-organizer' },
    ]
  },
  {
    label: '🔧 Kemework', icon: HardHat, children: [
      { heading: 'MY TASKS' },
      { label: 'Post a Task', icon: Plus, to: '/kemework/post-task' },
      { label: 'My Tasks', icon: FileText, to: '/cp/agent/kemework/my-tasks' },
      { label: 'My Task Orders', icon: ClipboardList, to: '/cp/agent/kemework/orders' },
      { heading: 'FIND & BROWSE' },
      { label: 'Find Professionals', icon: Users, to: '/kemework/find-professionals' },
      { label: 'Browse Services', icon: Star, to: '/kemework/services' },
      { heading: 'SAVED' },
      { label: 'Bookmarked Pros & Services', icon: Bookmark, to: '/cp/agent/kemework/bookmarks' },
    ]
  },
  {
    label: '🛒 Kemetro', icon: ShoppingCart, children: [
      { heading: 'SHOPPING' },
      { label: 'Browse Products', icon: Search, to: '/kemetro/search' },
      { label: 'My Cart', icon: ShoppingCart, to: '/m/kemetro/cart' },
      { heading: 'MY ORDERS' },
      { label: 'All Orders', icon: ClipboardList, to: '/cp/agent/kemetro-orders' },
      { heading: 'REQUESTS' },
      { label: 'My RFQs', icon: FileText, to: '/cp/agent/kemetro-rfqs' },
    ]
  },
  { label: '💎 Premium Services', icon: CreditCard, to: '/cp/agent/premium-services' },
  {
    label: '🤖 AI & Smart Tools', icon: Star, children: [
      { heading: 'PROPERTY AI' },
      { label: 'Vision™ — Photo Analysis', icon: Search, to: '/cp/agent/vision' },
      { label: 'Negotiate™ — Deal Coach', icon: MessageCircle, to: '/cp/agent/negotiations' },
      { label: 'Escrow™', icon: CreditCard, to: '/cp/agent/escrow' },
      { label: 'Finish™ — Renovation', icon: HardHat, to: '/cp/agent/finish/new' },
      { heading: 'MY PROFILE' },
      { label: 'Kemedar Score', icon: Star, to: '/cp/agent/score' },
      { label: 'My DNA Profile', icon: User, to: '/cp/agent/my-dna' },
    ]
  },
  {
    label: '💰 Money & Orders', icon: DollarSign, children: [
      { heading: 'PAYMENTS' },
      { label: 'Wallet', icon: CreditCard, to: '/cp/agent/wallet' },
      { label: 'Invoices', icon: FileText, to: '/cp/agent/invoices' },
      { label: 'Payment Methods', icon: CreditCard, to: '/cp/agent/payment-methods' },
      { heading: 'ORDERS' },
      { label: 'Kemedar Orders', icon: ClipboardList, to: '/cp/agent/kemedar-orders' },
      { label: 'Kemetro Orders', icon: ShoppingCart, to: '/cp/agent/kemetro-orders' },
      { label: 'Kemework Orders', icon: ClipboardList, to: '/cp/agent/kemework-orders' },
    ]
  },
  {
    label: '🗂 Tools & Communications', icon: MessageCircle, children: [
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages', icon: MessageCircle, to: '/cp/agent/messages' },
      { label: 'Notifications', icon: Bell, to: '/cp/agent/notifications' },
      { heading: 'ACCOUNT' },
      { label: 'My Profile', icon: User, to: '/cp/agent/profile' },
      { label: 'Subscription & Billing', icon: CreditCard, to: '/cp/agent/subscription' },
      { label: 'Settings', icon: Settings, to: '/cp/agent/settings' },
    ]
  },
  {
    label: '❓ Help', icon: HelpCircle, children: [
      { label: 'Support Tickets', icon: Bell, to: '/cp/agent/tickets' },
      { label: 'Help Center & FAQ', icon: FileText, to: '/cp/agent/knowledge' },
      { label: 'Contact Us', icon: MessageCircle, to: '/cp/agent/contact-kemedar' },
    ]
  },
];

export default function AgentShell() {
  return (
    <CpShell
      menuItems={MENU}
      badgeLabel="Agent"
      badgeColor="bg-orange-500"
      profileTo="/cp/agent/profile"
    />
  );
}