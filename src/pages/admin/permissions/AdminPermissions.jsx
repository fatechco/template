import { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, AlertTriangle, GitCompare, RefreshCw } from 'lucide-react';
import RoleListPanel from './RoleListPanel';
import PermissionTablePanel from './PermissionTablePanel';
import PermissionSummaryPanel from './PermissionSummaryPanel';
import CompareRolesModal from './CompareRolesModal';
import { SYSTEM_ROLES, PERMISSION_ACTIONS, PERMISSION_RESOURCES, DEFAULT_PERMISSIONS } from '@/lib/rbac/seedData';
import { MODULE_COLORS } from '@/lib/rbac/permissionUtils';

export default function AdminPermissions() {
  const [roles, setRoles] = useState([]);
  const [actions, setActions] = useState([]);
  const [resources, setResources] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState('guest');
  const [showCompare, setShowCompare] = useState(false);
  const [activeModule, setActiveModule] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [recentChanges, setRecentChanges] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [r, a, res, perms] = await Promise.all([
        base44.entities.SystemRole.list('sortOrder', 50),
        base44.entities.PermissionAction.list('sortOrder', 50),
        base44.entities.PermissionResource.list('sortOrder', 200),
        base44.entities.RolePermission.list('-created_date', 2000),
      ]);
      setRoles(r);
      setActions(a);
      setResources(res);
      setPermissions(perms);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  // Seed all data from seedData.js
  async function handleSeedAll() {
    setSeeding(true);
    try {
      // Seed roles
      for (const role of SYSTEM_ROLES) {
        const exists = roles.find(r => r.roleKey === role.roleKey);
        if (!exists) {
          await base44.entities.SystemRole.create({ ...role, isSystem: true });
        }
      }
      // Seed actions
      for (const action of PERMISSION_ACTIONS) {
        const exists = actions.find(a => a.actionKey === action.actionKey);
        if (!exists) {
          await base44.entities.PermissionAction.create(action);
        }
      }
      // Seed resources
      for (const res of PERMISSION_RESOURCES) {
        const exists = resources.find(r => r.resourceKey === res.resourceKey);
        if (!exists) {
          await base44.entities.PermissionResource.create(res);
        }
      }

      // Reload to get IDs
      const [freshRoles, freshActions, freshResources] = await Promise.all([
        base44.entities.SystemRole.list('sortOrder', 50),
        base44.entities.PermissionAction.list('sortOrder', 50),
        base44.entities.PermissionResource.list('sortOrder', 200),
      ]);

      // Seed permissions
      for (const [rk, resk, ak, level, guestBehavior, conditions] of DEFAULT_PERMISSIONS) {
        const existsPerm = permissions.find(p => p.roleKey === rk && p.resourceKey === resk && p.actionKey === ak);
        if (!existsPerm) {
          const role = freshRoles.find(r => r.roleKey === rk);
          const res = freshResources.find(r => r.resourceKey === resk);
          const action = freshActions.find(a => a.actionKey === ak);
          if (role && res && action) {
            await base44.entities.RolePermission.create({
              roleId: role.id,
              resourceId: res.id,
              actionId: action.id,
              roleKey: rk,
              resourceKey: resk,
              actionKey: ak,
              permissionLevel: level,
              guestBehavior: guestBehavior || null,
              conditions: conditions || null,
            });
          }
        }
      }

      await loadAll();
      alert('✅ Seed complete! All roles, actions, resources and permissions have been created.');
    } catch (err) {
      alert('Error seeding: ' + err.message);
    } finally {
      setSeeding(false);
    }
  }

  const selectedRole = roles.find(r => r.roleKey === selectedRoleKey) || SYSTEM_ROLES.find(r => r.roleKey === selectedRoleKey);

  // Build permissions map for selected role
  const rolePermissions = useMemo(() => {
    const map = {};
    for (const p of permissions) {
      if (p.roleKey === selectedRoleKey) {
        map[`${p.resourceKey}::${p.actionKey}`] = p;
      }
    }
    return map;
  }, [permissions, selectedRoleKey]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      if (activeModule !== 'all' && r.module !== activeModule) return false;
      if (activeType !== 'all' && r.resourceType !== activeType) return false;
      if (search && !r.displayName.toLowerCase().includes(search.toLowerCase()) && !r.resourceKey.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [resources, activeModule, activeType, search]);

  async function handlePermissionChange(resourceKey, actionKey, newLevel, guestBehavior) {
    const existing = permissions.find(p =>
      p.roleKey === selectedRoleKey &&
      p.resourceKey === resourceKey &&
      p.actionKey === actionKey
    );

    const role = roles.find(r => r.roleKey === selectedRoleKey);
    const resource = resources.find(r => r.resourceKey === resourceKey);
    const action = actions.find(a => a.actionKey === actionKey);

    const data = {
      roleId: role?.id,
      resourceId: resource?.id,
      actionId: action?.id,
      roleKey: selectedRoleKey,
      resourceKey,
      actionKey,
      permissionLevel: newLevel,
      guestBehavior: guestBehavior || null,
    };

    let updated;
    if (existing) {
      updated = await base44.entities.RolePermission.update(existing.id, data);
    } else {
      updated = await base44.entities.RolePermission.create(data);
    }

    setPermissions(prev => {
      const idx = prev.findIndex(p => p.roleKey === selectedRoleKey && p.resourceKey === resourceKey && p.actionKey === actionKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });

    // Log recent change
    setRecentChanges(prev => [{
      resourceKey,
      actionKey,
      oldValue: existing?.permissionLevel || 'not set',
      newValue: newLevel,
      timestamp: new Date(),
    }, ...prev.slice(0, 4)]);

    // Log to audit
    try {
      const user = await base44.auth.me();
      await base44.entities.PermissionAuditLog.create({
        changedBy: user?.id,
        changedByEmail: user?.email,
        roleKey: selectedRoleKey,
        resourceKey,
        actionKey,
        oldValue: existing?.permissionLevel || 'not_set',
        newValue: newLevel,
        permissionId: existing?.id || updated?.id,
      });
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading permissions...</p>
        </div>
      </div>
    );
  }

  const needsSeeding = roles.length === 0 || actions.length === 0 || resources.length === 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-orange-500" />
            <h1 className="text-xl font-black text-gray-900">Permissions Management</h1>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">Control what each user role can see and do across all modules</p>
        </div>
        <div className="flex items-center gap-2">
          {needsSeeding && (
            <button
              onClick={handleSeedAll}
              disabled={seeding}
              className="flex items-center gap-2 bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-orange-600 disabled:opacity-60"
            >
              {seeding ? <RefreshCw size={13} className="animate-spin" /> : '🌱'}
              {seeding ? 'Seeding...' : 'Seed All Data'}
            </button>
          )}
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"
          >
            <GitCompare size={13} /> Compare Roles
          </button>
          <button
            onClick={loadAll}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2 mb-4 flex-shrink-0">
        <AlertTriangle size={16} className="text-orange-500 flex-shrink-0" />
        <p className="text-xs text-orange-700 font-medium">
          <strong>⚠️ Changes take effect immediately</strong> for all users with that role. Test changes in a dev environment before applying to production.
        </p>
      </div>

      {/* Three-panel layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Role List */}
        <div className="w-[220px] flex-shrink-0">
          <RoleListPanel
            roles={roles.length > 0 ? roles : SYSTEM_ROLES}
            selectedRoleKey={selectedRoleKey}
            onSelect={setSelectedRoleKey}
            permissions={permissions}
          />
        </div>

        {/* Center: Permission Table */}
        <div className="flex-1 min-w-0">
          <PermissionTablePanel
            role={selectedRole}
            resources={filteredResources}
            allResources={resources}
            actions={actions}
            rolePermissions={rolePermissions}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            activeType={activeType}
            setActiveType={setActiveType}
            search={search}
            setSearch={setSearch}
            bulkMode={bulkMode}
            setBulkMode={setBulkMode}
            onPermissionChange={handlePermissionChange}
            isGuest={selectedRoleKey === 'guest'}
          />
        </div>

        {/* Right: Summary */}
        <div className="w-[250px] flex-shrink-0">
          <PermissionSummaryPanel
            role={selectedRole}
            roles={roles.length > 0 ? roles : SYSTEM_ROLES}
            permissions={permissions}
            selectedRoleKey={selectedRoleKey}
            recentChanges={recentChanges}
            onBulkAllow={async () => {
              for (const res of filteredResources) {
                for (const ak of (res.availableActions || [])) {
                  await handlePermissionChange(res.resourceKey, ak, 'allow', null);
                }
              }
            }}
            onBulkDeny={async () => {
              for (const res of filteredResources) {
                for (const ak of (res.availableActions || [])) {
                  await handlePermissionChange(res.resourceKey, ak, 'deny', null);
                }
              }
            }}
            onReset={loadAll}
          />
        </div>
      </div>

      {showCompare && (
        <CompareRolesModal
          roles={roles.length > 0 ? roles : SYSTEM_ROLES}
          resources={resources}
          actions={actions}
          permissions={permissions}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}