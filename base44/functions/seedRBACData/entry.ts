import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Seed data inline (no local imports allowed)
const SYSTEM_ROLES = [
  { roleKey: "guest", displayName: "Non-Logged-In User", module: "shared", color: "#9CA3AF", icon: "👤", description: "Non-authenticated visitor.", isSystem: true, isActive: true, sortOrder: 1 },
  { roleKey: "common_user", displayName: "Common User", module: "kemedar", color: "#6B7280", icon: "👤", description: "Registered user.", isSystem: true, isActive: true, sortOrder: 2 },
  { roleKey: "agent", displayName: "Real Estate Agent", module: "kemedar", color: "#3B82F6", icon: "🤝", description: "Licensed agent.", isSystem: true, isActive: true, sortOrder: 3 },
  { roleKey: "agency", displayName: "Real Estate Agency", module: "kemedar", color: "#8B5CF6", icon: "🏢", description: "Agency.", isSystem: true, isActive: true, sortOrder: 4 },
  { roleKey: "developer", displayName: "Real Estate Developer", module: "kemedar", color: "#1F2937", icon: "🏗", description: "Developer.", isSystem: true, isActive: true, sortOrder: 5 },
  { roleKey: "franchise_owner_area", displayName: "Franchise Owner (Area)", module: "kemedar", color: "#FF6B00", icon: "🗺", description: "Franchise owner managing an area.", isSystem: true, isActive: true, sortOrder: 6 },
  { roleKey: "franchise_owner_country", displayName: "Franchise Owner (Country)", module: "kemedar", color: "#D4A017", icon: "🌍", description: "Country-level franchise owner.", isSystem: true, isActive: true, sortOrder: 7 },
  { roleKey: "professional", displayName: "Professional/Handyman", module: "kemework", color: "#2D6A4F", icon: "🔧", description: "Service professional.", isSystem: true, isActive: true, sortOrder: 8 },
  { roleKey: "customer_kemework", displayName: "Customer (Kemework)", module: "kemework", color: "#059669", icon: "👤", description: "Kemework customer.", isSystem: true, isActive: true, sortOrder: 9 },
  { roleKey: "finishing_company", displayName: "Finishing Company", module: "kemework", color: "#92400E", icon: "🏢", description: "Finishing company.", isSystem: true, isActive: true, sortOrder: 10 },
  { roleKey: "product_seller", displayName: "Product Seller", module: "kemetro", color: "#0077B6", icon: "🏪", description: "Kemetro seller.", isSystem: true, isActive: true, sortOrder: 11 },
  { roleKey: "product_buyer", displayName: "Product Buyer", module: "kemetro", color: "#0EA5E9", icon: "🛒", description: "Kemetro buyer.", isSystem: true, isActive: true, sortOrder: 12 },
  { roleKey: "shipper", displayName: "Shipper/Courier", module: "kemetro", color: "#0369A1", icon: "🚚", description: "Shipper.", isSystem: true, isActive: true, sortOrder: 13 },
  { roleKey: "admin", displayName: "Administrator", module: "admin", color: "#EF4444", icon: "🔑", description: "Platform administrator.", isSystem: true, isActive: true, sortOrder: 14 },
  { roleKey: "super_admin", displayName: "Super Admin", module: "admin", color: "#7C2D12", icon: "👑", description: "Super administrator.", isSystem: true, isActive: true, sortOrder: 15 },
];

const PERMISSION_ACTIONS = [
  { actionKey: "view", displayName: "View / Read", category: "read", isDestructive: false, sortOrder: 1 },
  { actionKey: "create", displayName: "Create / Add New", category: "write", isDestructive: false, sortOrder: 2 },
  { actionKey: "edit", displayName: "Edit / Update", category: "write", isDestructive: false, sortOrder: 3 },
  { actionKey: "delete", displayName: "Delete / Remove", category: "write", isDestructive: true, sortOrder: 4 },
  { actionKey: "submit", displayName: "Submit / Send", category: "write", isDestructive: false, sortOrder: 5 },
  { actionKey: "publish", displayName: "Publish / Make Live", category: "write", isDestructive: false, sortOrder: 6 },
  { actionKey: "approve", displayName: "Approve", category: "moderation", isDestructive: false, sortOrder: 7 },
  { actionKey: "reject", displayName: "Reject / Decline", category: "moderation", isDestructive: false, sortOrder: 8 },
  { actionKey: "verify", displayName: "Verify / Certify", category: "moderation", isDestructive: false, sortOrder: 9 },
  { actionKey: "feature", displayName: "Mark as Featured", category: "moderation", isDestructive: false, sortOrder: 10 },
  { actionKey: "export", displayName: "Export Data", category: "admin", isDestructive: false, sortOrder: 11 },
  { actionKey: "import", displayName: "Import Data", category: "admin", isDestructive: false, sortOrder: 12 },
  { actionKey: "bid", displayName: "Submit Bid / Offer", category: "write", isDestructive: false, sortOrder: 13 },
  { actionKey: "assign", displayName: "Assign to User/Role", category: "admin", isDestructive: false, sortOrder: 14 },
  { actionKey: "accredit", displayName: "Accredit User", category: "moderation", isDestructive: false, sortOrder: 15 },
  { actionKey: "message", displayName: "Send Message", category: "communication", isDestructive: false, sortOrder: 16 },
  { actionKey: "purchase", displayName: "Purchase / Order", category: "financial", isDestructive: false, sortOrder: 17 },
  { actionKey: "refund", displayName: "Request Refund", category: "financial", isDestructive: false, sortOrder: 18 },
  { actionKey: "withdraw", displayName: "Withdraw Funds", category: "financial", isDestructive: false, sortOrder: 19 },
  { actionKey: "upload_media", displayName: "Upload Photos/Files", category: "write", isDestructive: false, sortOrder: 20 },
  { actionKey: "access_dashboard", displayName: "Access Dashboard", category: "read", isDestructive: false, sortOrder: 21 },
  { actionKey: "manage", displayName: "Full Management Access", category: "admin", isDestructive: false, sortOrder: 22 },
  { actionKey: "bulk_action", displayName: "Bulk Actions", category: "admin", isDestructive: true, sortOrder: 23 },
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const results = { roles: 0, actions: 0, resources: 0, permissions: 0 };

  // Seed roles
  const existingRoles = await base44.asServiceRole.entities.SystemRole.list('sortOrder', 20);
  for (const role of SYSTEM_ROLES) {
    const exists = existingRoles.find(r => r.roleKey === role.roleKey);
    if (!exists) {
      await base44.asServiceRole.entities.SystemRole.create(role);
      results.roles++;
    }
  }

  // Seed actions
  const existingActions = await base44.asServiceRole.entities.PermissionAction.list('sortOrder', 30);
  for (const action of PERMISSION_ACTIONS) {
    const exists = existingActions.find(a => a.actionKey === action.actionKey);
    if (!exists) {
      await base44.asServiceRole.entities.PermissionAction.create(action);
      results.actions++;
    }
  }

  return Response.json({
    success: true,
    message: 'RBAC seed completed',
    created: results,
    note: 'Resources and permissions can be seeded via the Admin UI at /admin/permissions'
  });
});