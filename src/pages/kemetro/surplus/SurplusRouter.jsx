/**
 * SurplusRouter — thin wrapper used by AppRoutes to serve both
 * /kemetro/surplus (hub) and /kemetro/surplus/:itemId (detail)
 * from a single route pattern: /kemetro/surplus/:itemId?
 *
 * AppRoutes already has:
 *   <Route path="/kemetro/surplus/add" element={<SurplusListingWizard />} />
 * This file just exports both hub and detail for direct import.
 */
export { default as SurplusMarketHub } from './SurplusMarketHub';
export { default as SurplusItemDetail } from './SurplusItemDetail';