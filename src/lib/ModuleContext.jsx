import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const ModuleContext = createContext(null);

const DEFAULT_MODULES = [
  { moduleName: 'kemedar', displayName: 'Kemedar®', icon: '🏠', color: '#FF6B00', isGloballyActive: true, order: 1 },
  { moduleName: 'kemework', displayName: 'Kemework®', icon: '🔧', color: '#2D6A4F', isGloballyActive: false, order: 2 },
  { moduleName: 'kemetro', displayName: 'Kemetro®', icon: '🛒', color: '#0077B6', isGloballyActive: false, order: 3 },
];

export function ModuleProvider({ children }) {
  const [moduleConfigs, setModuleConfigs] = useState(DEFAULT_MODULES);
  const [featureRegistry, setFeatureRegistry] = useState([]);
  const [userActiveModules, setUserActiveModules] = useState(() => {
    try {
      const saved = localStorage.getItem('kemedar_user_modules');
      return saved ? JSON.parse(saved) : ['kemedar', 'kemework', 'kemetro'];
    } catch { return ['kemedar', 'kemework', 'kemetro']; }
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const loadModules = useCallback(async () => {
    try {
      const [configs, features] = await Promise.all([
        base44.entities.ModuleConfig.list('order', 10),
        base44.entities.FeatureRegistry.list('sortOrder', 200),
      ]);
      if (Array.isArray(configs) && configs.length > 0) setModuleConfigs(configs);
      if (Array.isArray(features) && features.length > 0) setFeatureRegistry(features);
    } catch (e) {
      // fallback to defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
    // Poll for changes every 5 minutes
    const interval = setInterval(loadModules, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadModules]);

  // Save user module prefs to localStorage
  useEffect(() => {
    localStorage.setItem('kemedar_user_modules', JSON.stringify(userActiveModules));
  }, [userActiveModules]);

  const activeGlobalModules = moduleConfigs
    .filter(m => m.isGloballyActive)
    .map(m => m.moduleName);

  const isModuleActive = useCallback((moduleName) => {
    return activeGlobalModules.includes(moduleName) && userActiveModules.includes(moduleName);
  }, [activeGlobalModules, userActiveModules]);

  const isFeatureVisible = useCallback((featureKey) => {
    const feature = featureRegistry.find(f => f.featureKey === featureKey);
    if (!feature) return true; // unknown features default visible
    if (feature.isActive === false) return false;
    return feature.modules.some(m => isModuleActive(m));
  }, [featureRegistry, isModuleActive]);

  const toggleUserModule = useCallback((moduleName, value) => {
    setUserActiveModules(prev => {
      if (value === undefined) {
        return prev.includes(moduleName) ? prev.filter(m => m !== moduleName) : [...prev, moduleName];
      }
      return value ? [...new Set([...prev, moduleName])] : prev.filter(m => m !== moduleName);
    });
  }, []);

  const refreshModules = useCallback(async () => {
    setLoading(true);
    await loadModules();
    setLastRefresh(Date.now());
  }, [loadModules]);

  return (
    <ModuleContext.Provider value={{
      moduleConfigs,
      featureRegistry,
      activeGlobalModules,
      userActiveModules,
      isModuleActive,
      isFeatureVisible,
      toggleUserModule,
      refreshModules,
      loading,
      lastRefresh,
    }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModules must be used within ModuleProvider');
  return ctx;
}

// Alias for backward compatibility
export const useModule = useModules;