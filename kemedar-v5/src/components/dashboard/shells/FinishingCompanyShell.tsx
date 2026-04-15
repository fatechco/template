// @ts-nocheck
import CpShell from '@/components/dashboard/shells/CpShell';
import {
  LayoutDashboard, User, FileText, DollarSign, HelpCircle,
  CreditCard, ClipboardList, Star, Building2, Briefcase, Users, Gem, BarChart3, Calendar, Bell, Settings, MessageCircle, ShoppingCart
} from 'lucide-react';

const MENU = [
  { label: 'Dashboard Home', icon: LayoutDashboard, to: '/cp/company' },
  {
    label: 'My Business', icon: Briefcase, children: [
      { label: 'Business Profile', icon: User, to: '/cp/company/business-profile' },
      { label: 'Performance Stats', icon: BarChart3, to: '/cp/company/performance' },
      { label: 'Clients', icon: Users, to: '/cp/company/clients' },
      { label: 'Appointments', icon: Calendar, to: '/cp/company/appointments' },
    ]
  },
  {
    label: 'Services & Tasks', icon: Briefcase, children: [
      { label: 'All Services', icon: Briefcase, to: '/cp/company/services' },
      { label: 'Search Tasks', icon: FileText, to: '/cp/company/search-tasks' },
      { label: 'Tasks in my Category', icon: FileText, to: '/cp/company/tasks-in-category' },
    ]
  },
  { label: 'My Cart', icon: ShoppingCart, to: '/m/kemetro/cart' },
  { label: 'My Orders', icon: ClipboardList, to: '/cp/company/orders' },
  { label: 'My Bids', icon: FileText, to: '/cp/company/bids' },
  { label: 'Team Members', icon: Users, to: '/cp/company/team' },
  { label: 'My Customers', icon: Users, to: '/cp/company/customers' },
  { label: 'Portfolio', icon: Star, to: '/cp/company/portfolio' },
  { label: 'Earnings', icon: DollarSign, to: '/cp/company/earnings' },
  { label: 'My Invoices', icon: FileText, to: '/cp/company/invoices' },
  { label: 'Subscription & Billing', icon: Gem, to: '/cp/company/subscription' },

  {
    label: '🗂 Tools & Communications', icon: MessageCircle, children: [
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages', icon: MessageCircle, to: '/cp/company/messages' },
      { label: 'Notifications', icon: Bell, to: '/cp/company/notifications' },
      { heading: 'ACCOUNT' },
      { label: 'My Profile', icon: User, to: '/cp/company/profile' },
      { label: 'Subscription & Billing', icon: Gem, to: '/cp/company/subscription' },
      { label: 'Settings', icon: Settings, to: '/cp/company/settings' },
    ]
  },
  {
    label: '❓ Help', icon: HelpCircle, children: [
      { label: 'Support Tickets', icon: Bell, to: '/cp/company/tickets' },
      { label: 'Help Center & FAQ', icon: FileText, to: '/cp/company/knowledge' },
      { label: 'Contact Us', icon: MessageCircle, to: '/cp/company/contact-kemedar' },
    ]
  },
];

export default function FinishingCompanyShell() {
  return (
    <CpShell
      menuItems={MENU}
      badgeLabel="Finishing Company"
      badgeColor="bg-pink-600"
      profileTo="/cp/company/business-profile"
    />
  );
}