// @ts-nocheck
import CpShell from '@/components/dashboard/shells/CpShell';
import {
  LayoutDashboard, Home, Search, User, FileText, DollarSign,
  MessageCircle, HelpCircle, CreditCard, ClipboardList,
  BarChart3, Users, Calendar, UserSquare, Briefcase,
  MapPin, HardHat, Plus, Star, Bookmark,
  ShoppingCart, Bell, Settings, GitCompare, KanbanSquare
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/cp/developer' },
  {
    label: 'My Business', icon: Briefcase, children: [
      { label: 'Business Profile', icon: UserSquare, to: '/cp/developer/business-profile' },
      { label: 'Performance Stats', icon: BarChart3, to: '/cp/developer/performance' },
    ]
  },
  {
    label: '🏙 Kemedar', icon: MapPin, children: [
      { heading: 'PROJECTS' },
      { label: 'My Projects', icon: HardHat, to: '/cp/developer/my-projects' },
      { label: 'Project Sales', icon: DollarSign, to: '/cp/developer/project-sales' },
      { label: 'Add New Project', icon: Plus, to: '/create/project' },
      { heading: 'PROPERTIES' },
      { label: 'Find Property', icon: Search, to: '/search-properties' },
      { label: 'My Properties', icon: Home, to: '/cp/developer/my-properties' },
      { label: 'Add New Property', icon: Plus, to: '/create/property' },
      { heading: 'REQUESTS' },
      { label: 'Add Buy Request', icon: FileText, to: '/create/buy-request' },
      { label: 'My Buy Requests', icon: ClipboardList, to: '/cp/developer/my-buy-requests' },
      { heading: 'ORGANIZERS' },
      { label: 'Buyer Organizer', icon: KanbanSquare, to: '/cp/developer/buyer-organizer' },
      { label: 'Seller Organizer', icon: KanbanSquare, to: '/cp/developer/seller-organizer' },
    ]
  },
  {
    label: '🔧 Kemework', icon: HardHat, children: [
      { heading: 'MY TASKS' },
      { label: 'Post a Task', icon: Plus, to: '/kemework/post-task' },
      { label: 'My Tasks', icon: FileText, to: '/cp/developer/kemework/my-tasks' },
      { label: 'My Task Orders', icon: ClipboardList, to: '/cp/developer/kemework/orders' },
      { heading: 'FIND & BROWSE' },
      { label: 'Find Professionals', icon: Users, to: '/kemework/find-professionals' },
      { label: 'Browse Services', icon: Star, to: '/kemework/services' },
      { heading: 'SAVED' },
      { label: 'Bookmarked Pros & Services', icon: Bookmark, to: '/cp/developer/kemework/bookmarks' },
    ]
  },
  {
    label: '🛒 Kemetro', icon: ShoppingCart, children: [
      { heading: 'SHOPPING' },
      { label: 'Browse Products', icon: Search, to: '/kemetro/search' },
      { label: 'My Cart', icon: ShoppingCart, to: '/m/kemetro/cart' },
      { heading: 'MY ORDERS' },
      { label: 'All Orders', icon: ClipboardList, to: '/cp/developer/kemetro-orders' },
      { heading: 'REQUESTS' },
      { label: 'My RFQs', icon: FileText, to: '/cp/developer/kemetro-rfqs' },
    ]
  },
  { label: '💎 Premium Services', icon: CreditCard, to: '/cp/developer/premium-services' },
  {
    label: '🤖 AI & Smart Tools', icon: Star, children: [
      { heading: 'PROPERTY AI' },
      { label: 'Vision™ — Photo Analysis', icon: Search, to: '/cp/developer/vision' },
      { label: 'Negotiate™ — Deal Coach', icon: MessageCircle, to: '/cp/developer/negotiations' },
      { label: 'Escrow™', icon: CreditCard, to: '/cp/developer/escrow' },
      { label: 'Kemedar Score', icon: Star, to: '/cp/developer/score' },
      { label: 'My DNA Profile', icon: UserSquare, to: '/cp/developer/my-dna' },
      { heading: 'BUILD & FINISH' },
      { label: 'Live™ — Virtual Tours', icon: Calendar, to: '/cp/developer/live' },
      { label: 'Kemetro Build™ — BOQ', icon: HardHat, to: '/cp/developer/build' },
      { label: 'Finish™ — Renovation', icon: Briefcase, to: '/cp/developer/finish/new' },
    ]
  },
  {
    label: '💰 Money & Orders', icon: DollarSign, children: [
      { heading: 'PAYMENTS' },
      { label: 'Wallet', icon: CreditCard, to: '/cp/developer/wallet' },
      { label: 'Invoices', icon: FileText, to: '/cp/developer/invoices' },
      { label: 'Payment Methods', icon: CreditCard, to: '/cp/developer/payment-methods' },
      { heading: 'ORDERS' },
      { label: 'Kemedar Orders', icon: ClipboardList, to: '/cp/developer/kemedar-orders' },
      { label: 'Kemetro Orders', icon: ShoppingCart, to: '/cp/developer/kemetro-orders' },
      { label: 'Kemework Orders', icon: ClipboardList, to: '/cp/developer/kemework-orders' },
    ]
  },
  {
    label: '🗂 Tools & Communications', icon: MessageCircle, children: [
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages', icon: MessageCircle, to: '/cp/developer/messages' },
      { label: 'Notifications', icon: Bell, to: '/cp/developer/notifications' },
      { heading: 'ACCOUNT' },
      { label: 'My Profile', icon: User, to: '/cp/developer/profile' },
      { label: 'Subscription & Billing', icon: CreditCard, to: '/cp/developer/subscription' },
      { label: 'Settings', icon: Settings, to: '/cp/developer/settings' },
    ]
  },
  {
    label: '❓ Help', icon: HelpCircle, children: [
      { label: 'Support Tickets', icon: Bell, to: '/cp/developer/tickets' },
      { label: 'Help Center & FAQ', icon: FileText, to: '/cp/developer/knowledge' },
      { label: 'Contact Us', icon: MessageCircle, to: '/cp/developer/contact-kemedar' },
    ]
  },
];

export default function DeveloperShell() {
  return (
    <CpShell
      menuItems={MENU}
      badgeLabel="Developer"
      badgeColor="bg-rose-600"
      profileTo="/cp/developer/profile"
    />
  );
}