import CpShell from '@/components/dashboard/shells/CpShell';
import {
  LayoutDashboard, User, FileText, DollarSign, HelpCircle,
  CreditCard, ClipboardList, Star, Shield, Briefcase, BarChart3, Award, Users, Gem, Bell, Settings, MessageCircle, ShoppingCart, Palette, Plus
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard Home', icon: LayoutDashboard, to: '/cp/pro' },
  { label: 'My Profile', icon: User, to: '/cp/pro/profile' },
  {
    label: 'Services & Tasks', icon: Briefcase, children: [
      { label: 'All Services', icon: Briefcase, to: '/cp/pro/services' },
      { label: 'Search Tasks', icon: FileText, to: '/cp/pro/search-tasks' },
      { label: 'Tasks in my Category', icon: FileText, to: '/cp/pro/tasks-in-category' },
    ]
  },
  { label: 'My Orders', icon: ClipboardList, to: '/cp/pro/orders' },
  { label: 'My Bids', icon: FileText, to: '/cp/pro/bids' },
  { label: 'Portfolio', icon: Star, to: '/cp/pro/portfolio' },
  { label: 'My Customers', icon: Users, to: '/cp/pro/customers' },
  { label: 'Earnings', icon: DollarSign, to: '/cp/pro/earnings' },
  { label: 'Accreditation', icon: Shield, to: '/cp/pro/accreditation' },
  { label: 'Be Accredited', icon: Award, to: '/kemework/preferred-professional-program' },
  { label: 'Preferred Professional Program', icon: Award, to: '/kemework/preferred-professional-program' },
  { label: 'Subscription & Billing', icon: Gem, to: '/cp/pro/subscription' },
  { label: 'Invoices', icon: FileText, to: '/cp/pro/invoices' },
  { label: 'My Cart', icon: ShoppingCart, to: '/m/kemetro/cart' },

  {
    label: '🎨 KemeKits', icon: Palette, children: [
      { label: 'My Kits', icon: Palette, to: '/kemework/pro/kemekits' },
      { label: '+ Create New Kit', icon: Plus, to: '/kemework/pro/kemekits/create' },
    ]
  },
  {
    label: '🤖 AI & Smart Tools', icon: Star, children: [
      { heading: 'BUILD & MATERIALS' },
      { label: 'Kemetro Build™ — BOQ', icon: Briefcase, to: '/cp/pro/build' },
      { label: 'Finish™ — Projects', icon: ClipboardList, to: '/cp/pro/finish/new' },
      { heading: 'MY PROFILE' },
      { label: 'Kemedar Score', icon: Star, to: '/cp/pro/score' },
    ]
  },
  {
    label: '🗂 Tools & Communications', icon: MessageCircle, children: [
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages', icon: MessageCircle, to: '/cp/pro/messages' },
      { label: 'Notifications', icon: Bell, to: '/cp/pro/notifications' },
      { heading: 'ACCOUNT' },
      { label: 'My Profile', icon: User, to: '/cp/pro/profile' },
      { label: 'Subscription & Billing', icon: Gem, to: '/cp/pro/subscription' },
      { label: 'Settings', icon: Settings, to: '/cp/pro/settings' },
    ]
  },
  {
    label: '❓ Help', icon: HelpCircle, children: [
      { label: 'Support Tickets', icon: Bell, to: '/cp/pro/tickets' },
      { label: 'Help Center & FAQ', icon: FileText, to: '/cp/pro/knowledge' },
      { label: 'Contact Us', icon: MessageCircle, to: '/cp/pro/contact-kemedar' },
    ]
  },
];

export default function ProfessionalShell() {
  return (
    <CpShell
      menuItems={MENU}
      badgeLabel="Professional"
      badgeColor="bg-amber-600"
      profileTo="/cp/pro/profile"
    />
  );
}