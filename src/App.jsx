import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import RouteGuard from '@/components/RouteGuard';
import InstallPromptBanner from '@/components/pwa/InstallPromptBanner';
import IOSInstallModal from '@/components/pwa/iOSInstallModal';
import AppSplashScreen from '@/components/pwa/AppSplashScreen';
import OnboardingSlides from '@/components/pwa/OnboardingSlides';
import { getPWAInstallManager } from '@/lib/pwa-install-manager';
import { toast } from 'sonner';
import { isMobileSession, toMobilePath } from '@/lib/mobile-detect';
import NotificationPermissionSheet from '@/components/pwa/NotificationPermissionSheet';
import { getNotificationManager } from '@/lib/notification-manager';
import NetworkStatus from '@/components/responsive/NetworkStatus';
import UpdateBanner from '@/components/pwa/UpdateBanner';
import { getUpdateManager } from '@/lib/update-manager';
import { detectPlatform } from '@/lib/detect-platform';
import AppRoutes from '@/components/AppRoutes';
import { useResponsiveRedirect } from '@/hooks/useResponsiveRedirect';
import ThinkDar from '@/pages/ThinkDar';
import PropertySellerBenefits from '@/pages/UserBenefits/PropertySellerBenefits';
import PropertyBuyerBenefits from '@/pages/UserBenefits/PropertyBuyerBenefits';
import RealEstateAgentBenefits from '@/pages/UserBenefits/RealEstateAgentBenefits';
import RealEstateDeveloperBenefits from '@/pages/UserBenefits/RealEstateDeveloperBenefits';
import InvestorBenefits from '@/pages/UserBenefits/InvestorBenefits';
import HandymanBenefits from '@/pages/UserBenefits/HandymanBenefits';
import ProductSellerBenefits from '@/pages/UserBenefits/ProductSellerBenefits';
import ProductBuyerBenefits from '@/pages/UserBenefits/ProductBuyerBenefits';
import FranchiseOwnerAreaBenefits from '@/pages/UserBenefits/FranchiseOwnerAreaBenefits';
import AdminThinkDar from '@/pages/admin/thinkdar/AdminThinkDar';
import QRCodeManager from '@/pages/dashboard/QRCodeManager';
import QRRedirect from '@/pages/QRRedirect';
import QRNotFound from '@/pages/QRNotFound';
import AdminQRDashboard from '@/pages/admin/qr/AdminQRDashboard';
import AdminQRAll from '@/pages/admin/qr/AdminQRAll';
import AdminQRScans from '@/pages/admin/qr/AdminQRScans';
import AdminQRSettings from '@/pages/admin/qr/AdminQRSettings';
import TwinNew from '@/pages/kemedar/TwinNew';
import NegotiateLandingMobile from '@/pages/m/kemedar/NegotiateLandingMobile';
import FindAgencyPage from '@/pages/m/FindAgencyPage';
import MobileAgentProfilePage from '@/pages/m/MobileAgentProfilePage';
import MobileAgencyProfilePage from '@/pages/m/MobileAgencyProfilePage';
import MobileDeveloperProfilePage from '@/pages/m/MobileDeveloperProfilePage';
import MobileFranchiseOwnerProfilePage from '@/pages/m/MobileFranchiseOwnerProfilePage';
import MobileProfessionalProfilePage from '@/pages/m/MobileProfessionalProfilePage';
import KemeworkMobileFreelancerProfile from '@/pages/m/kemework/KemeworkMobileFreelancerProfile';
import KemedarMatchMobile from '@/pages/m/kemedar/KemedarMatchMobile';
import MatchSetupMobile from '@/pages/m/kemedar/MatchSetupMobile';
import KemeworkMobileHome from '@/pages/m/kemework/KemeworkMobileHome';
import KemeworkPreferredProMobile from '@/pages/m/kemework/KemeworkPreferredProMobile';
import MatchHistoryMobile from '@/pages/m/kemedar/MatchHistoryMobile';
import ScoreLandingMobile from '@/pages/m/kemedar/ScoreLandingMobile';
import DNALandingMobile from '@/pages/m/kemedar/DNALandingMobile';
import ExpatLandingMobile from '@/pages/m/kemedar/ExpatLandingMobile';
import ExpatSetupMobile from '@/pages/m/kemedar/expat/ExpatSetupMobile';
import VerifyProLandingMobile from '@/pages/m/kemedar/VerifyProLandingMobile';
import EscrowLandingMobile from '@/pages/m/kemedar/escrow/EscrowLandingMobile';
import VisionLandingMobile from '@/pages/m/kemedar/VisionLandingMobile';
import LifeScoreDetailMobile from '@/pages/m/kemedar/LifeScoreDetailMobile';
import EscrowSetupMobile from '@/pages/m/kemedar/escrow/EscrowSetupMobile';
import EscrowDealRoomMobile from '@/pages/m/kemedar/escrow/EscrowDealRoomMobile';
import EscrowWalletMobile from '@/pages/m/kemedar/escrow/EscrowWalletMobile';
import VerifyProMyPropertiesMobile from '@/pages/m/kemedar/VerifyProMyPropertiesMobile';
import SellerVerificationMobile from '@/pages/m/verify/SellerVerificationMobile';
import PublicCertificateMobile from '@/pages/m/verify/PublicCertificateMobile';
import ExpatDashboardMobile from '@/pages/m/kemedar/expat/ExpatDashboardMobile';
import ExpatLegalMobile from '@/pages/m/kemedar/expat/ExpatLegalMobile';
import ExpatManagementMobile from '@/pages/m/kemedar/expat/ExpatManagementMobile';
import ExpatCommunityMobile from '@/pages/m/kemedar/expat/ExpatCommunityMobile';
import FinishLandingMobile from '@/pages/m/kemedar/FinishLandingMobile';
import FinishWizardMobile from '@/pages/m/kemedar/FinishWizardMobile';
import SurplusMarketMobile from '@/pages/m/kemetro/SurplusMarketMobile';
import FlashDealsLandingMobile from '@/pages/m/kemetro/FlashDealsLandingMobile';
import BuildBOQLandingMobile from '@/pages/m/kemetro/BuildBOQLandingMobile';
import ShopTheLookLandingMobile from '@/pages/m/kemetro/ShopTheLookLandingMobile';
import AIPriceMatchLandingMobile from '@/pages/m/kemetro/AIPriceMatchLandingMobile';
import AIPriceMatchBrowse from '@/pages/m/kemetro/AIPriceMatchBrowse';
import ESGImpactLandingMobile from '@/pages/m/kemetro/ESGImpactLandingMobile';
import SurplusAddMobile from '@/pages/m/kemetro/SurplusAddMobile';
import ESGScoreMobile from '@/pages/m/kemetro/ESGScoreMobile';
import ThinkDarMobile from '@/pages/m/ThinkDarMobile';
import AuctionsMobile from '@/pages/m/kemedar/AuctionsMobile';
import HowAuctionsWorkMobile from '@/pages/m/kemedar/HowAuctionsWorkMobile';
import KemeFracMobile from '@/pages/m/kemedar/KemeFracMobile';
import KemeFracDetailMobile from '@/pages/m/kemedar/KemeFracDetailMobile';
import KemedarSwapMobile from '@/pages/m/kemedar/KemedarSwapMobile';
import CommunityDiscoveryMobile from '@/pages/m/kemedar/community/CommunityDiscoveryMobile';
import CommunityHomeMobile from '@/pages/m/kemedar/community/CommunityHomeMobile';
import CommunityJoinMobile from '@/pages/m/kemedar/community/CommunityJoinMobile';
import CommunityCreateMobile from '@/pages/m/kemedar/community/CommunityCreateMobile';
import CommunityDailyMobile from '@/pages/m/kemedar/community/CommunityDailyMobile';
import CommunityHowItWorksMobile from '@/pages/m/kemedar/community/CommunityHowItWorksMobile';
import Rent2OwnLandingMobile from '@/pages/m/kemedar/rent2own/Rent2OwnLandingMobile';
import Rent2OwnBrowseMobile from '@/pages/m/kemedar/rent2own/Rent2OwnBrowseMobile';
import Rent2OwnDetailMobile from '@/pages/m/kemedar/rent2own/Rent2OwnDetailMobile';
import Rent2OwnApplyMobile from '@/pages/m/kemedar/rent2own/Rent2OwnApplyMobile';
import Rent2OwnMyContractsMobile from '@/pages/m/kemedar/rent2own/Rent2OwnMyContractsMobile';
import Rent2OwnHowItWorksMobile from '@/pages/m/kemedar/rent2own/Rent2OwnHowItWorksMobile';
import TwinNewMobile from '@/pages/m/kemedar/twin/TwinNewMobile';
import TwinLandingMobile from '@/pages/m/kemedar/twin/TwinLandingMobile';
import TwinDashboardMobile from '@/pages/m/kemedar/twin/TwinDashboardMobile';
import SnapAndFix from '@/pages/m/kemework/SnapAndFix';
import ShopTheLookBrowse from '@/pages/m/kemetro/ShopTheLookBrowse';
import ShopTheLookDetail from '@/pages/m/kemetro/ShopTheLookDetail';
import { Toaster } from '@/components/ui/sonner';
import { ModuleProvider } from '@/lib/ModuleContext';
import { I18nProvider } from '@/lib/i18n';
import { CurrencyProvider } from '@/lib/CurrencyContext';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, recoveredSnapSession, setRecoveredSnapSession } = useAuth();
  const navigate = React.useRef(null);
  const location = useLocation();

  // Global responsive redirect: mobile ↔ desktop route sync
  useResponsiveRedirect();
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [notificationTrigger, setNotificationTrigger] = useState(null);
  const installManager = getPWAInstallManager();

  // Snap & Fix session recovery toast
  useEffect(() => {
    if (recoveredSnapSession) {
      toast.success(
        `✅ Your Snap & Fix diagnosis is saved! Tap to complete & post.`,
        {
          duration: 8000,
          action: {
            label: 'Complete & Post Task →',
            onClick: () => {
              window.location.href = `/kemework/snap/review/${recoveredSnapSession.id}`;
            },
          },
        }
      );
      setRecoveredSnapSession(null);
    }
  }, [recoveredSnapSession]);

  useEffect(() => {
    if (installManager.isStandalone) {
      setShowSplash(true);
      const updateManager = getUpdateManager();
      updateManager.trackInstall(detectPlatform());
    } else if (installManager.shouldShowOnboarding()) {
      setShowOnboarding(true);
    } else if (installManager.shouldShowIOSInstructions()) {
      setShowIOSModal(true);
    }
  }, [installManager]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  if (showSplash) return <AppSplashScreen onComplete={() => setShowSplash(false)} />;
  if (showOnboarding) return <OnboardingSlides onComplete={() => setShowOnboarding(false)} />;

  return (
    <>
      <NetworkStatus />
      <UpdateBanner />
      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
      {notificationTrigger && (
        <NotificationPermissionSheet trigger={notificationTrigger} onClose={() => setNotificationTrigger(null)} />
      )}
      <InstallPromptBanner />
      <RouteGuard>
        <Routes>
          <Route path="/thinkdar" element={<ThinkDar />} />
          <Route path="/admin/thinkdar" element={<AdminThinkDar />} />
          <Route path="/admin/thinkdar/keys" element={<AdminThinkDar />} />
          <Route path="/user-benefits/property-seller" element={<PropertySellerBenefits />} />
          <Route path="/user-benefits/property-buyer" element={<PropertyBuyerBenefits />} />
          <Route path="/user-benefits/real-estate-agent" element={<RealEstateAgentBenefits />} />
          <Route path="/user-benefits/real-estate-developer" element={<RealEstateDeveloperBenefits />} />
          <Route path="/user-benefits/investor" element={<InvestorBenefits />} />
          <Route path="/user-benefits/handyman-or-technician" element={<HandymanBenefits />} />
          <Route path="/user-benefits/product-seller" element={<ProductSellerBenefits />} />
          <Route path="/user-benefits/product-buyer" element={<ProductBuyerBenefits />} />
          <Route path="/user-benefits/franchise-owner" element={<FranchiseOwnerAreaBenefits />} />
          <Route path="/cp/user/qr-codes" element={<QRCodeManager />} />
          <Route path="/dashboard/qr-codes" element={<QRCodeManager />} />
          <Route path="/kemedar/twin/new" element={<TwinNew />} />
          <Route path="/qr/not-found" element={<QRNotFound />} />
          <Route path="/qr/:qrCodeUID" element={<QRRedirect />} />
          <Route path="/admin/qr-codes" element={<AdminQRDashboard />} />
          <Route path="/admin/qr-codes/all" element={<AdminQRAll />} />
          <Route path="/admin/qr-codes/scans" element={<AdminQRScans />} />
          <Route path="/admin/qr-codes/settings" element={<AdminQRSettings />} />
          <Route path="/m/find-profile/agency" element={<FindAgencyPage />} />
          <Route path="/m/agent-profile/:id" element={<MobileAgentProfilePage />} />
          <Route path="/m/agency-profile/:id" element={<MobileAgencyProfilePage />} />
          <Route path="/m/developer-profile/:id" element={<MobileDeveloperProfilePage />} />
          <Route path="/m/franchise-owner-profile/:id" element={<MobileFranchiseOwnerProfilePage />} />
          <Route path="/m/kemework/profile/:id" element={<KemeworkMobileFreelancerProfile />} />
          <Route path="/m/find/agency" element={<FindAgencyPage />} />
          <Route path="/m/kemedar/negotiate/landing" element={<NegotiateLandingMobile />} />
          <Route path="/m/kemedar/match" element={<KemedarMatchMobile />} />
          <Route path="/m/kemedar/match/setup" element={<MatchSetupMobile />} />
          <Route path="/m/kemedar/match/history" element={<MatchHistoryMobile />} />
          <Route path="/m/kemedar/score/landing" element={<ScoreLandingMobile />} />
          <Route path="/m/kemedar/dna/landing" element={<DNALandingMobile />} />
          <Route path="/m/kemedar/vision/landing" element={<VisionLandingMobile />} />
          <Route path="/m/kemedar/life-score/:citySlug/:districtSlug" element={<LifeScoreDetailMobile />} />
          <Route path="/m/kemework/home" element={<KemeworkMobileHome />} />
          <Route path="/m/kemework/preferred-pro" element={<KemeworkPreferredProMobile />} />
          <Route path="/m/kemework/snap" element={<SnapAndFix />} />
          <Route path="/m/kemetro/shop-the-look/browse" element={<ShopTheLookBrowse />} />
          <Route path="/m/kemetro/shop-the-look/:id" element={<ShopTheLookDetail />} />
          <Route path="/m/kemedar/escrow/landing" element={<EscrowLandingMobile />} />
          <Route path="/m/kemedar/escrow/new" element={<EscrowSetupMobile />} />
          <Route path="/m/kemedar/escrow/:dealId" element={<EscrowDealRoomMobile />} />
          <Route path="/m/kemedar/escrow/wallet" element={<EscrowWalletMobile />} />
          <Route path="/m/kemedar/verify-pro" element={<VerifyProLandingMobile />} />
          <Route path="/m/kemedar/verify-pro/my-properties" element={<VerifyProMyPropertiesMobile />} />
          <Route path="/m/verify/my-property/:propertyId" element={<SellerVerificationMobile />} />
          <Route path="/m/verify/:tokenId" element={<PublicCertificateMobile />} />
          <Route path="/m/kemedar/expat" element={<ExpatLandingMobile />} />
          <Route path="/m/kemedar/expat/setup" element={<ExpatSetupMobile />} />
          <Route path="/m/kemedar/expat/dashboard" element={<ExpatDashboardMobile />} />
          <Route path="/m/kemedar/expat/legal" element={<ExpatLegalMobile />} />
          <Route path="/m/kemedar/expat/management" element={<ExpatManagementMobile />} />
          <Route path="/m/kemedar/expat/community" element={<ExpatCommunityMobile />} />
          <Route path="/m/kemedar/finish/landing" element={<FinishLandingMobile />} />
          <Route path="/m/kemedar/finish/new" element={<FinishWizardMobile />} />
          <Route path="/m/kemetro/surplus" element={<SurplusMarketMobile />} />
          <Route path="/m/kemetro/flash/landing" element={<FlashDealsLandingMobile />} />
          <Route path="/m/kemetro/build/landing" element={<BuildBOQLandingMobile />} />
          <Route path="/m/kemetro/shop-the-look/landing" element={<ShopTheLookLandingMobile />} />
          <Route path="/m/kemetro/ai-price-match/landing" element={<AIPriceMatchLandingMobile />} />
          <Route path="/m/kemetro/ai-price-match/browse" element={<AIPriceMatchBrowse />} />
          <Route path="/m/kemetro/surplus/esg/landing" element={<ESGImpactLandingMobile />} />
          <Route path="/m/kemetro/surplus/add" element={<SurplusAddMobile />} />
          <Route path="/m/kemetro/surplus/esg/score" element={<ESGScoreMobile />} />
          <Route path="/m/thinkdar" element={<ThinkDarMobile />} />
          <Route path="/m/auctions" element={<AuctionsMobile />} />
          <Route path="/m/auctions/how-it-works" element={<HowAuctionsWorkMobile />} />
          <Route path="/m/kemefrac" element={<KemeFracMobile />} />
          <Route path="/m/kemefrac/:offeringSlug" element={<KemeFracDetailMobile />} />
          <Route path="/m/kemedar/swap" element={<KemedarSwapMobile />} />
          <Route path="/m/kemedar/community" element={<CommunityDiscoveryMobile />} />
          <Route path="/m/kemedar/community/create" element={<CommunityCreateMobile />} />
          <Route path="/m/kemedar/community/how-it-works" element={<CommunityHowItWorksMobile />} />
          <Route path="/m/kemedar/community/:communityId" element={<CommunityHomeMobile />} />
          <Route path="/m/kemedar/community/:communityId/join" element={<CommunityJoinMobile />} />
          <Route path="/m/kemedar/community/:communityId/daily" element={<CommunityDailyMobile />} />
          <Route path="/m/kemedar/rent2own/landing" element={<Rent2OwnLandingMobile />} />
          <Route path="/m/kemedar/rent2own/browse" element={<Rent2OwnBrowseMobile />} />
          <Route path="/m/kemedar/rent2own/how-it-works" element={<Rent2OwnHowItWorksMobile />} />
          <Route path="/m/kemedar/rent2own/my-contracts" element={<Rent2OwnMyContractsMobile />} />
          <Route path="/m/kemedar/rent2own/:listingId" element={<Rent2OwnDetailMobile />} />
          <Route path="/m/kemedar/rent2own/:listingId/apply" element={<Rent2OwnApplyMobile />} />
          <Route path="/m/kemedar/twin/new" element={<TwinNewMobile />} />
          <Route path="/m/kemedar/twin/landing" element={<TwinLandingMobile />} />
          <Route path="/m/kemedar/twin/dashboard" element={<TwinDashboardMobile />} />
          <Route path="*" element={<AppRoutes />} />
        </Routes>
      </RouteGuard>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthProvider>
          <ModuleProvider>
            <I18nProvider>
              <CurrencyProvider>
                <AuthenticatedApp />
                <Toaster />
              </CurrencyProvider>
            </I18nProvider>
          </ModuleProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;