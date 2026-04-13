import { Route } from 'react-router-dom';
import SwapDashboard from '@/pages/admin/kemedar/swap/SwapDashboard';
import SwapPool from '@/pages/admin/kemedar/swap/SwapPool';
import SwapMatches from '@/pages/admin/kemedar/swap/SwapMatches';
import SwapNegotiationsAdmin from '@/pages/admin/kemedar/swap/SwapNegotiations';
import SwapSettings from '@/pages/admin/kemedar/swap/SwapSettings';

export default function SwapAdminRoutes() {
  return (
    <>
      <Route path="kemedar/swaps" element={<SwapDashboard />} />
      <Route path="kemedar/swaps/pool" element={<SwapPool />} />
      <Route path="kemedar/swaps/matches" element={<SwapMatches />} />
      <Route path="kemedar/swaps/negotiations" element={<SwapNegotiationsAdmin />} />
      <Route path="kemedar/swaps/settings" element={<SwapSettings />} />
    </>
  );
}