// ─── PERMISSION CHECK UTILITIES ──────────────────────────────────────────────
import { base44 } from '@/api/base44Client';

const CACHE_KEY = 'kemedar_permissions_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let _permissionsCache = null;
let _cacheFetchedAt = null;

// Get all permissions from DB (cached)
async function loadPermissions() {
  const now = Date.now();
  if (_permissionsCache && _cacheFetchedAt && (now - _cacheFetchedAt) < CACHE_TTL) {
    return _permissionsCache;
  }
  try {
    const perms = await base44.entities.RolePermission.list('-created_date', 1000);
    _permissionsCache = perms;
    _cacheFetchedAt = now;
    return perms;
  } catch {
    return _permissionsCache || [];
  }
}

export function clearPermissionCache() {
  _permissionsCache = null;
  _cacheFetchedAt = null;
}

// Map Base44 user role to SystemRole roleKey
export function getUserRoleKey(user) {
  if (!user) return 'guest';
  const role = user.role || 'user';
  // Map base44 roles to system roles
  const roleMap = {
    'admin': 'admin',
    'user': 'common_user',
  };
  // Check custom role data
  if (user.data?.roleKey) return user.data.roleKey;
  return roleMap[role] || 'common_user';
}

// Main permission check function
export async function checkPermission(resourceKey, actionKey, user = null, resourceOwnerId = null) {
  const roleKey = getUserRoleKey(user);
  
  try {
    const allPerms = await loadPermissions();
    
    // Find matching permission
    const perm = allPerms.find(p =>
      p.roleKey === roleKey &&
      p.resourceKey === resourceKey &&
      p.actionKey === actionKey
    );

    if (!perm) {
      // No explicit permission = check parent role inheritance
      return {
        allowed: false,
        permissionLevel: 'deny',
        guestBehavior: roleKey === 'guest' ? 'redirect_login' : null,
        conditions: null,
        reason: 'No permission defined'
      };
    }

    const { permissionLevel, guestBehavior, conditions } = perm;

    // Check conditions
    if (permissionLevel === 'allow' || permissionLevel === 'allow_own_only' || permissionLevel === 'allow_area_only') {
      // Check ownResourceOnly
      if (conditions?.ownResourceOnly && user && resourceOwnerId) {
        if (resourceOwnerId !== user.email && resourceOwnerId !== user.id) {
          return { allowed: false, permissionLevel: 'deny', guestBehavior: null, conditions, reason: 'Not your resource' };
        }
      }
      // Check subscription
      if (conditions?.requiresSubscription) {
        // TODO: Check user subscription level
      }
      // Check verification
      if (conditions?.requiresVerification && user && !user.data?.isVerified) {
        return { allowed: false, permissionLevel: 'deny', guestBehavior: null, conditions, reason: 'Requires verification' };
      }
    }

    return {
      allowed: permissionLevel !== 'deny',
      permissionLevel,
      guestBehavior: guestBehavior || null,
      conditions: conditions || null,
      reason: permissionLevel === 'deny' ? 'Permission denied' : 'Allowed'
    };

  } catch {
    // Default to deny on error
    return { allowed: false, permissionLevel: 'deny', guestBehavior: null, conditions: null, reason: 'Error checking permission' };
  }
}

// Sync version using pre-loaded permissions map
export function checkPermissionSync(resourceKey, actionKey, roleKey, permissionsMap) {
  const key = `${roleKey}::${resourceKey}::${actionKey}`;
  const perm = permissionsMap?.[key];
  if (!perm) return { allowed: false, permissionLevel: 'deny', guestBehavior: null };
  return {
    allowed: perm.permissionLevel !== 'deny',
    permissionLevel: perm.permissionLevel,
    guestBehavior: perm.guestBehavior || null,
    conditions: perm.conditions || null,
  };
}

// Build a fast lookup map from permissions array
export function buildPermissionsMap(permissions) {
  const map = {};
  for (const p of permissions) {
    const key = `${p.roleKey}::${p.resourceKey}::${p.actionKey}`;
    map[key] = p;
  }
  return map;
}

// GUEST BEHAVIOR LABELS
export const GUEST_BEHAVIOR_LABELS = {
  redirect_login: { label: 'Redirect to Login', icon: '🔄', color: 'bg-blue-100 text-blue-700' },
  show_preview: { label: 'Show Preview (Blur)', icon: '👁', color: 'bg-gray-100 text-gray-700' },
  allow_form_fill: { label: 'Allow Form Fill', icon: '📝', color: 'bg-yellow-100 text-yellow-700' },
  show_teaser: { label: 'Show Teaser', icon: '🔮', color: 'bg-purple-100 text-purple-700' },
  full_block: { label: 'Full Block (Hidden)', icon: '🚫', color: 'bg-red-100 text-red-700' },
};

// PERMISSION LEVEL DISPLAY
export const PERMISSION_LEVEL_DISPLAY = {
  allow: { label: 'Allow', icon: '✅', color: 'text-green-600 bg-green-50' },
  deny: { label: 'Deny', icon: '❌', color: 'text-red-600 bg-red-50' },
  allow_own_only: { label: 'Own Only', icon: '👤', color: 'text-blue-600 bg-blue-50' },
  allow_area_only: { label: 'Area Only', icon: '🗺', color: 'text-orange-600 bg-orange-50' },
  guest_preview: { label: 'Preview', icon: '👁', color: 'text-gray-600 bg-gray-50' },
};

// Cycle permission level on click
export function cyclePermissionLevel(current, isGuest = false) {
  if (isGuest) {
    const cycle = ['allow', 'deny', 'guest_preview'];
    const idx = cycle.indexOf(current);
    return cycle[(idx + 1) % cycle.length];
  }
  const cycle = ['allow', 'deny', 'allow_own_only', 'allow_area_only'];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

// MODULE COLORS
export const MODULE_COLORS = {
  kemedar: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', hex: '#FF6B00' },
  kemework: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', hex: '#2D6A4F' },
  kemetro: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', hex: '#0077B6' },
  shared: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', hex: '#6B7280' },
  admin: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', hex: '#EF4444' },
};

// RESOURCE TYPE COLORS
export const RESOURCE_TYPE_COLORS = {
  entity: 'bg-violet-100 text-violet-700',
  page: 'bg-sky-100 text-sky-700',
  feature: 'bg-emerald-100 text-emerald-700',
  form: 'bg-amber-100 text-amber-700',
  dashboard_section: 'bg-indigo-100 text-indigo-700',
  api: 'bg-gray-100 text-gray-700',
  widget: 'bg-pink-100 text-pink-700',
  menu_item: 'bg-orange-100 text-orange-700',
};

// ACTION CATEGORY COLORS
export const ACTION_CATEGORY_COLORS = {
  read: 'bg-blue-100 text-blue-700',
  write: 'bg-green-100 text-green-700',
  admin: 'bg-red-100 text-red-700',
  financial: 'bg-yellow-100 text-yellow-700',
  communication: 'bg-purple-100 text-purple-700',
  moderation: 'bg-orange-100 text-orange-700',
};