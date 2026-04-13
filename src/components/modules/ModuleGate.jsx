import { useModules } from '@/lib/ModuleContext';

/**
 * ModuleGate — Conditionally renders children based on module/feature visibility.
 * 
 * Usage:
 *   <ModuleGate module="kemework">...</ModuleGate>
 *   <ModuleGate feature="home_kemework_banner">...</ModuleGate>
 *   <ModuleGate modules={["kemedar","kemework"]} requireAll>...</ModuleGate>
 * 
 * Props:
 *   module       — single module name to check (string)
 *   modules      — array of module names; any being active = visible (unless requireAll)
 *   requireAll   — if true, ALL listed modules must be active
 *   feature      — feature key to check via isFeatureVisible()
 *   fallback     — what to render when not visible (default: null)
 */
export default function ModuleGate({ module, modules, requireAll = false, feature, fallback = null, children }) {
  const { isModuleActive, isFeatureVisible } = useModules();

  if (feature) {
    return isFeatureVisible(feature) ? children : fallback;
  }

  const moduleList = modules || (module ? [module] : []);

  if (moduleList.length === 0) return children;

  const isVisible = requireAll
    ? moduleList.every(m => isModuleActive(m))
    : moduleList.some(m => isModuleActive(m));

  return isVisible ? children : fallback;
}