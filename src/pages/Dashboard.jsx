import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home, Eye, MessageCircle, DollarSign, Users, FileText, TrendingUp, BarChart3, Star } from "lucide-react";

// Role → canonical CP shell path
const ROLE_CP_PATH = {
  super_user: "/admin",
  user: "/cp/user",
  product_buyer: "/cp/user",
  customer_kemework: "/cp/user",
  kemework_customer: "/cp/user",
  agent: "/cp/agent",
  agency: "/cp/agency",
  developer: "/cp/developer",
  franchise_owner: "/kemedar/franchise/dashboard",
  franchise_owner_area: "/kemedar/franchise/dashboard",
  franchise_owner_country: "/kemedar/franchise/dashboard",
  product_seller: "/kemetro/seller/dashboard",
  kemetro_seller: "/kemetro/seller/dashboard",
  kemework_professional: "/cp/pro",
  kemework_company: "/cp/company",
  admin: "/admin",
};

const ROLE_WELCOME = {
  admin: "Welcome back, Admin",
  agent: "Welcome back, Agent",
  agency: "Welcome back",
  developer: "Welcome back, Developer",
  franchise_owner: "Welcome back, Franchise Owner",
  product_seller: "Welcome back, Seller",
  user: "Welcome back",
};

const ROLE_STATS = {
  agent: [
    { label: "Active Listings", value: "12", icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Total Views", value: "1,840", icon: Eye, color: "bg-purple-50 text-purple-600" },
    { label: "New Inquiries", value: "8", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
    { label: "This Month Revenue", value: "$3,200", icon: DollarSign, color: "bg-green-50 text-green-600" },
  ],
  agency: [
    { label: "Total Properties", value: "47", icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Active Agents", value: "6", icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Inquiries", value: "23", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
    { label: "Monthly Revenue", value: "$12,500", icon: DollarSign, color: "bg-green-50 text-green-600" },
  ],
  developer: [
    { label: "Active Projects", value: "5", icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Total Units", value: "240", icon: FileText, color: "bg-purple-50 text-purple-600" },
    { label: "Inquiries", value: "34", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
    { label: "Revenue", value: "$48,000", icon: DollarSign, color: "bg-green-50 text-green-600" },
  ],
  franchise_owner: [
    { label: "Territory Agents", value: "14", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Listings", value: "89", icon: Home, color: "bg-purple-50 text-purple-600" },
    { label: "Transactions", value: "11", icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
    { label: "Commission", value: "$9,800", icon: DollarSign, color: "bg-green-50 text-green-600" },
  ],
  admin: [
    { label: "Total Users", value: "2,341", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Properties", value: "5,820", icon: Home, color: "bg-purple-50 text-purple-600" },
    { label: "This Month Revenue", value: "$84,200", icon: DollarSign, color: "bg-green-50 text-green-600" },
    { label: "Active Sessions", value: "174", icon: BarChart3, color: "bg-orange-50 text-orange-600" },
  ],
  user: [
    { label: "Saved Properties", value: "5", icon: Star, color: "bg-blue-50 text-blue-600" },
    { label: "Buy Requests", value: "2", icon: FileText, color: "bg-purple-50 text-purple-600" },
    { label: "Messages", value: "3", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
    { label: "Properties Viewed", value: "28", icon: Eye, color: "bg-green-50 text-green-600" },
  ],
};

const QUICK_ACTIONS = {
  agent: [
    { label: "Add New Listing", to: "/create/property", icon: Home },
    { label: "View Inquiries", to: "/dashboard/buy-requests", icon: MessageCircle },
    { label: "Check Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  ],
  agency: [
    { label: "Add Property", to: "/create/property", icon: Home },
    { label: "Manage Agents", to: "/dashboard/agents", icon: Users },
    { label: "View Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  ],
  developer: [
    { label: "Add Project", to: "/create/project", icon: Home },
    { label: "Add Property", to: "/create/property", icon: FileText },
    { label: "View Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  ],
  franchise_owner: [
    { label: "View Territory", to: "/dashboard/territory", icon: Users },
    { label: "Manage Agents", to: "/dashboard/agents", icon: Users },
    { label: "Revenue Report", to: "/dashboard/earnings", icon: DollarSign },
  ],
  admin: [
    { label: "Manage Users", to: "/dashboard/users", icon: Users },
    { label: "Kemetro Admin", to: "/kemetro/admin", icon: Home },
    { label: "View Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  ],
  user: [
    { label: "Browse Properties", to: "/search-properties", icon: Home },
    { label: "Post Buy Request", to: "/create/buy-request", icon: FileText },
    { label: "Find an Agent", to: "/find-profile/real-estate-agents", icon: Users },
  ],
};

export default function Dashboard() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "user";

  useEffect(() => {
    // Wait for auth to fully load before redirecting
    if (isLoadingAuth || !user) return;
    const path = ROLE_CP_PATH[role];
    if (path) {
      navigate(path, { replace: true });
    }
  }, [role, navigate, isLoadingAuth, user]);

  // Render nothing while redirecting
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}