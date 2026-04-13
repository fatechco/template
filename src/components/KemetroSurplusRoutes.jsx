import { Route } from 'react-router-dom';
import SurplusMarketHub from '@/pages/kemetro/surplus/SurplusMarketHub';
import SurplusListingWizard from '@/pages/kemetro/surplus/SurplusListingWizard';
import SurplusItemDetail from '@/pages/kemetro/surplus/SurplusItemDetail';

export function KemetroSurplusRoutes() {
  return (
    <>
      <Route path="/kemetro/surplus" element={<SurplusMarketHub />} />
      <Route path="/kemetro/surplus/add" element={<SurplusListingWizard />} />
      <Route path="/kemetro/surplus/:itemId" element={<SurplusItemDetail />} />
      <Route path="/m/kemetro/surplus" element={<SurplusMarketHub />} />
      <Route path="/m/kemetro/surplus/:itemId" element={<SurplusItemDetail />} />
    </>
  );
}