"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface ModuleInfo {
  id: string;
  name: string;
  isEnabled: boolean;
  config?: Record<string, any>;
}

const DEFAULT_MODULES: ModuleInfo[] = [
  { id: "kemedar", name: "Kemedar", isEnabled: true },
  { id: "kemetro", name: "Kemetro", isEnabled: true },
  { id: "kemework", name: "Kemework", isEnabled: true },
];

interface ModuleContextType {
  modules: ModuleInfo[];
  isModuleEnabled: (moduleId: string) => boolean;
  isModuleActive: (moduleId: string) => boolean;
  isFeatureEnabled: (featureKey: string) => boolean;
  toggleModule: (moduleId: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<ModuleInfo[]>(DEFAULT_MODULES);
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("kemedar-modules");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setModules((prev) => prev.map((m) => ({ ...m, isEnabled: parsed[m.id] ?? m.isEnabled })));
      } catch {}
    }
  }, []);

  const isModuleEnabled = useCallback((moduleId: string) => {
    return modules.find((m) => m.id === moduleId)?.isEnabled ?? false;
  }, [modules]);

  const isFeatureEnabled = useCallback((featureKey: string) => {
    return features[featureKey] ?? true;
  }, [features]);

  const toggleModule = useCallback((moduleId: string) => {
    setModules((prev) => {
      const updated = prev.map((m) => m.id === moduleId ? { ...m, isEnabled: !m.isEnabled } : m);
      const map: Record<string, boolean> = {};
      updated.forEach((m) => { map[m.id] = m.isEnabled; });
      localStorage.setItem("kemedar-modules", JSON.stringify(map));
      return updated;
    });
  }, []);

  return (
    <ModuleContext.Provider value={{ modules, isModuleEnabled, isModuleActive: isModuleEnabled, isFeatureEnabled, toggleModule }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) throw new Error("useModules must be used within ModuleProvider");
  return context;
}
