import { Routes, Route, Navigate } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import DashboardShell from '@/components/dashboard/DashboardShell';
import AdminShell from '@/components/admin/AdminShell';
import Home from '@/pages/Home';
import SearchProperties from '@/pages/SearchProperties';
import SearchProjects from '@/pages/SearchProjects';
import PropertyDetails from '@/pages/PropertyDetails';
import ProjectDetails from '@/pages/ProjectDetails';
import FindAgents from '@/pages/FindAgents';
import FindAgencies from '@/pages/FindAgencies';
import FindDevelopers from '@/pages/FindDevelopers';
import FindFranchiseOwners from '@/pages/FindFranchiseOwners';
import AgentProfile from '@/pages/AgentProfile';
import AgencyProfile from '@/pages/AgencyProfile';
import DeveloperProfile from '@/pages/DeveloperProfile';
import FranchiseOwnerProfile from '@/pages/FranchiseOwnerProfile';
import CreateProperty from '@/pages/CreateProperty';
import CreateBuyRequest from '@/pages/CreateBuyRequest';
import CreateProject from '@/pages/CreateProject';
import Advertise from '@/pages/Advertise';
import Careers from '@/pages/Careers';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import FranchiseOwnerArea from '@/pages/FranchiseOwnerArea';
import UserBenefitsHub from '@/pages/UserBenefitsHub';
import KemetroHome from '@/pages/KemetroHome';
import KemetroSearchResults from '@/pages/KemetroSearchResults';
import KemetroProductDetail from '@/pages/KemetroProductDetail';
import KemetroSellerRegister from '@/pages/KemetroSellerRegister';
import KemetroSellerDashboard from '@/pages/KemetroSellerDashboard';
import KemetroCart from '@/pages/KemetroCart';
import KemetroCheckout from '@/pages/KemetroCheckout';
import KemetroOrderSuccess from '@/pages/KemetroOrderSuccess';
import KemetroOrders from '@/pages/KemetroOrders';
import KemetroOrderDetail from '@/pages/KemetroOrderDetail';
import KemetroStoreProfile from '@/pages/KemetroStoreProfile';
import KemetroAdminDashboard from '@/pages/KemetroAdminDashboard';
import KemetroSellerBenefits from '@/pages/KemetroSellerBenefits';
import KemetroBuyerBenefits from '@/pages/KemetroBuyerBenefits';
import KemetroFees from '@/pages/KemetroFees';
import KemetroStoreCoordinator from '@/pages/KemetroStoreCoordinator';
import KemetroHowItWorks from '@/pages/KemetroHowItWorks';
import KemetroAbout from '@/pages/KemetroAbout';
import KemetroExport from '@/pages/KemetroExport';
import KemetroKemecoin from '@/pages/KemetroKemecoin';
import KemetroShipperRegister from '@/pages/KemetroShipperRegister';
import KemetroShipperDashboard from '@/pages/KemetroShipperDashboard';
import KemetroTrackShipment from '@/pages/KemetroTrackShipment';
import Dashboard from '@/pages/Dashboard';
import MyProperties from '@/pages/dashboard/MyProperties';
import Favorites from '@/pages/dashboard/Favorites';
import CompareProperties from '@/pages/dashboard/CompareProperties';
import MyBuyRequests from '@/pages/dashboard/MyBuyRequests';
import SearchBuyRequests from '@/pages/dashboard/SearchBuyRequests';
import BuyerOrganizer from '@/pages/dashboard/BuyerOrganizer';
import SellerOrganizer from '@/pages/dashboard/SellerOrganizer';
import DashboardProfile from '@/pages/dashboard/DashboardProfile';
import Subscription from '@/pages/dashboard/Subscription';
import DashboardNotifications from '@/pages/dashboard/Notifications';
import BusinessProfile from '@/pages/dashboard/BusinessProfile';
import PerformanceStats from '@/pages/dashboard/PerformanceStats';
import Clients from '@/pages/dashboard/Clients';
import Appointments from '@/pages/dashboard/Appointments';
import ManageMyAgents from '@/pages/dashboard/ManageMyAgents';
import MyProjects from '@/pages/dashboard/MyProjects';
import ProjectSales from '@/pages/dashboard/ProjectSales';
import AreaUsers from '@/pages/dashboard/AreaUsers';
import AreaProperties from '@/pages/dashboard/AreaProperties';
import KemeworkDashboard from '@/pages/dashboard/KemeworkDashboard';
import FindHandyman from '@/pages/dashboard/FindHandyman';
import KemetroSellers from '@/pages/dashboard/KemetroSellers';
import FranchiseWallet from '@/pages/dashboard/FranchiseWallet';
import FranchiseLeads from '@/pages/dashboard/FranchiseLeads';
import FranchiseMessages from '@/pages/dashboard/FranchiseMessages';
import FranchiseBizSetup from '@/pages/dashboard/FranchiseBizSetup';
import FranchiseTickets from '@/pages/dashboard/FranchiseTickets';
import FranchiseContactKemedar from '@/pages/dashboard/FranchiseContactKemedar';
import FranchiseKnowledgeBase from '@/pages/dashboard/FranchiseKnowledgeBase';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminPendingUsers from '@/pages/admin/AdminPendingUsers';
import AdminPendingVerification from '@/pages/admin/AdminPendingVerification';
import AdminImportedUsers from '@/pages/admin/AdminImportedUsers';
import AdminUsersCRM from '@/pages/admin/AdminUsersCRM';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminContactCRM from '@/pages/admin/AdminContactCRM';
import AdminBuyRequests from '@/pages/admin/AdminBuyRequests';
import AdminPlaceholder from '@/pages/admin/AdminPlaceholder';
import AdminFeatured from '@/pages/admin/AdminFeatured';
import AdminMedia from '@/pages/admin/AdminMedia';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminImport from '@/pages/admin/AdminImport';
import AdminScraping from '@/pages/admin/AdminScraping';
import AdminLocations from '@/pages/admin/AdminLocations';
import AdminPropertyCategories from '@/pages/admin/AdminPropertyCategories';
import AdminAmenities from '@/pages/admin/AdminAmenities';
import AdminDistanceFields from '@/pages/admin/AdminDistanceFields';
import AdminTags from '@/pages/admin/AdminTags';
import AdminCache from '@/pages/admin/AdminCache';
import AdminReports from '@/pages/admin/AdminReports';
import AdminRoles from '@/pages/admin/AdminRoles';
import FranchiseOwnerDashboardHome from '@/pages/FranchiseOwnerDashboardHome';
import FranchiseOwnerAreaDashboard from '@/pages/dashboard/FranchiseOwnerAreaDashboard';
import FranchiseDashboardMobile from '@/pages/m/kemedar/franchise/FranchiseDashboardMobile';
import FranchiseAreaUsers from '@/pages/dashboard/FranchiseAreaUsers';
import FranchiseAreaUsersMobile from '@/pages/m/kemedar/franchise/FranchiseAreaUsersMobile';
import FranchiseAreaProperties from '@/pages/dashboard/FranchiseAreaProperties';
import FranchiseAreaPropertiesMobile from '@/pages/m/kemedar/franchise/FranchiseAreaPropertiesMobile';
import FranchiseAreaProjects from '@/pages/dashboard/FranchiseAreaProjects';
import FranchiseAreaProjectsMobile from '@/pages/m/kemedar/franchise/FranchiseAreaProjectsMobile';
import FranchiseOwnerKemeworkTasks from '@/pages/dashboard/FranchiseOwnerKemeworkTasks';
import FranchiseOwnerAccreditHandyman from '@/pages/dashboard/FranchiseOwnerAccreditHandyman';
import FranchiseOwnerAccreditedHandymen from '@/pages/dashboard/FranchiseOwnerAccreditedHandymen';
import FranchiseOwnerKemeworkTasksMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerKemeworkTasksMobile';
import FranchiseOwnerKemetroSellers from '@/pages/dashboard/FranchiseOwnerKemetroSellers';
import FranchiseOwnerKemetroSellersMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerKemetroSellersMobile';
import FranchiseOwnerOrders from '@/pages/dashboard/FranchiseOwnerOrders';
import FranchiseOwnerOrdersMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerOrdersMobile';
import FranchiseOwnerFiles from '@/pages/dashboard/FranchiseOwnerFiles';
import FranchiseOwnerFilesMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerFilesMobile';
import FranchiseOwnerEmail from '@/pages/dashboard/FranchiseOwnerEmail';
import FranchiseOwnerEmailMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerEmailMobile';
import FranchiseOwnerBulkComms from '@/pages/dashboard/FranchiseOwnerBulkComms';
import FranchiseOwnerBulkCommsMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerBulkCommsMobile';
import FranchiseOwnerBizSetup from '@/pages/dashboard/FranchiseOwnerBizSetup';
import FranchiseOwnerBizLeads from '@/pages/dashboard/FranchiseOwnerBizLeads';
import FranchiseOwnerBizCustomers from '@/pages/dashboard/FranchiseOwnerBizCustomers';
import FranchiseOwnerBizSales from '@/pages/dashboard/FranchiseOwnerBizSales';
import FranchiseOwnerBizEmployees from '@/pages/dashboard/FranchiseOwnerBizEmployees';
import FranchiseOwnerBizTasks from '@/pages/dashboard/FranchiseOwnerBizTasks';
import FranchiseOwnerBizReports from '@/pages/dashboard/FranchiseOwnerBizReports';
import BizHomeMobile from '@/pages/m/kemedar/franchise/biz/BizHomeMobile';
import BizLeadsMobile from '@/pages/m/kemedar/franchise/biz/BizLeadsMobile';
import BizTasksMobile from '@/pages/m/kemedar/franchise/biz/BizTasksMobile';
import BizInvoicesMobile from '@/pages/m/kemedar/franchise/biz/BizInvoicesMobile';
import FranchiseOwnerSupport from '@/pages/dashboard/FranchiseOwnerSupport';
import FranchiseOwnerContactKemedar from '@/pages/dashboard/FranchiseOwnerContactKemedar';
import FranchiseOwnerKnowledge from '@/pages/dashboard/FranchiseOwnerKnowledge';
import FranchiseOwnerKnowledgeArticle from '@/pages/dashboard/FranchiseOwnerKnowledgeArticle';
import FranchiseOwnerAreaBuyRequests from '@/pages/FranchiseOwnerAreaBuyRequests';
import FranchiseOwnerSupportMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerSupportMobile';
import FranchiseOwnerContactKemedarMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerContactKemedarMobile';
import FranchiseOwnerKnowledgeMobile from '@/pages/m/kemedar/franchise/FranchiseOwnerKnowledgeMobile';
import FranchiseOwnerWallet from '@/pages/FranchiseOwnerWallet';
import KemetroBuyerDashboard from '@/pages/m/KemetroBuyerDashboard';
import KemetroOrdersPage from '@/pages/m/KemetroOrdersPage';
import KemetroWishlistPage from '@/pages/m/KemetroWishlistPage';
import KemetroSellerMobileDashboard from '@/pages/m/KemetroSellerDashboard';
import ProfilePage from '@/pages/m/ProfilePage';
import MessagesPage from '@/pages/m/MessagesPage';
import MessagesDetailPage from '@/pages/m/MessagesDetailPage';
import NotificationsPage from '@/pages/m/NotificationsPage';
import NotificationsDetailPage from '@/pages/m/NotificationsDetailPage';
import TicketsDetailPage from '@/pages/m/TicketsDetailPage';
import KnowledgeArticleDetailPage from '@/pages/m/KnowledgeArticleDetailPage';
import KnowledgeBasePage from '@/pages/m/dashboard/KnowledgeBasePage';
import NotificationDetailPage from '@/pages/dashboard/NotificationDetailPage';
import MessageDetailPage from '@/pages/dashboard/MessageDetailPage';
import TicketDetailPage from '@/pages/dashboard/TicketDetailPage';
import ArticleDetailPage from '@/pages/dashboard/ArticleDetailPage';
import SubscriptionPage from '@/pages/m/SubscriptionPage';
import TicketsPage from '@/pages/m/TicketsPage';
import KemeworkCustomerDashboard from '@/pages/m/KemeworkCustomerDashboard';
import KemeworkProfessionalDashboard from '@/pages/m/KemeworkProfessionalDashboard';
import KemeworkFinishingCompanyDashboard from '@/pages/m/KemeworkFinishingCompanyDashboard';
import KemeworkTasksPage from '@/pages/m/KemeworkTasksPage';
import KemeworkShell from '@/components/kemework/KemeworkShell';
import KemeworkHomePage from '@/pages/kemework/KemeworkHome';
import KemeworkHowItWorksPage from '@/pages/kemework/KemeworkHowItWorks';
import KemeworkPreferredProgramPage from '@/pages/kemework/KemeworkPreferredProgram';
import KemeworkFindProfessionalsPage from '@/pages/kemework/KemeworkFindProfessionals';
import KemeworkBrowseTasksPage from '@/pages/kemework/KemeworkBrowseTasks';
import KemeworkBrowseServicesPage from '@/pages/kemework/KemeworkBrowseServices';
import KemeworkTaskDetailPage from '@/pages/kemework/KemeworkTaskDetail';
import KemeworkServiceDetailPage from '@/pages/kemework/KemeworkServiceDetail';
import KemeworkFreelancerProfilePage from '@/pages/kemework/KemeworkFreelancerProfile';
import KemeworkClientProfilePage from '@/pages/kemework/KemeworkClientProfile';
import KemeworkPostTaskPage from '@/pages/kemework/KemeworkPostTask';
import KemeworkAddServicePage from '@/pages/kemework/KemeworkAddService';
import KemeworkCustomerDashboardPage from '@/pages/m/KemeworkCustomerDashboard';
import KemeworkMyTasksPage from '@/pages/dashboard/kemework/MyTasksPage';
import KemeworkMyOrdersPage from '@/pages/dashboard/kemework/MyOrdersPage';
import KemeworkBookmarksDesktop from '@/pages/dashboard/kemework/KemeworkBookmarksDesktop';
import ProDashboardDesktop from '@/pages/dashboard/pro/ProDashboardDesktop';
import MyBidsPage from '@/pages/dashboard/pro/MyBidsPage';
import MyServicesPage from '@/pages/dashboard/pro/MyServicesPage';
import ProOrdersPage from '@/pages/dashboard/pro/ProOrdersPage';
import ProEarningsPage from '@/pages/dashboard/pro/ProEarningsPage';
import ProPortfolioPage from '@/pages/dashboard/pro/ProPortfolioPage';
import ProAccreditationPage from '@/pages/dashboard/pro/ProAccreditationPage';
import ProInvoicesPage from '@/pages/dashboard/pro/ProInvoicesPage';
import ProCustomersPage from '@/pages/dashboard/pro/ProCustomersPage';
import ProSubscriptionPage from '@/pages/dashboard/pro/ProSubscriptionPage';
import KemeworkMobileHome from '@/pages/m/kemework/KemeworkMobileHome';
import KemeworkBrowseTasksMobile from '@/pages/m/kemework/KemeworkBrowseTasksMobile';
import KemeworkMobileFindProfessionals from '@/pages/m/kemework/KemeworkMobileFindProfessionals';
import KemeworkMobileBrowseServices from '@/pages/m/kemework/KemeworkMobileBrowseServices';
import KemetroCartPage from '@/pages/m/kemetro/KemetroCartPage';
import KemetroMobileHome from '@/pages/m/kemetro/KemetroMobileHome';
import KemetroMobileSearch from '@/pages/m/kemetro/KemetroMobileSearch';
import KemetroShipperMobileDashboard from '@/pages/m/kemetro/shipper/KemetroShipperMobileDashboard';
import MobileShellV2 from '@/components/mobile-v2/MobileShellV2';
import FindPropertyPage from '@/pages/m/FindPropertyPage';
import MobileSearchFiltersPage from '@/pages/m/MobileSearchFiltersPage';
import FindProjectPage from '@/pages/m/FindProjectPage';
import FindProductPage from '@/pages/m/FindProductPage';
import FindServicePage from '@/pages/m/FindServicePage';
import FindBuyRequestPage from '@/pages/m/FindBuyRequestPage';
import FindRFQPage from '@/pages/m/FindRFQPage';
import FindAgentPage from '@/pages/m/FindAgentPage';
import FindDeveloperPage from '@/pages/m/FindDeveloperPage';
import FindFranchisePage from '@/pages/m/FindFranchisePage';
import FindProfessionalPage from '@/pages/m/FindProfessionalPage';
import PropertyDetailPage from '@/pages/m/PropertyDetailPage';
import ProjectDetailPage from '@/pages/m/ProjectDetailPage';
import ProductDetailPage from '@/pages/m/ProductDetailPage';
import ServiceDetailPage from '@/pages/m/ServiceDetailPage';
import BuyRequestDetailPage from '@/pages/m/BuyRequestDetailPage';
import RFQDetailPage from '@/pages/m/RFQDetailPage';
import AddPropertyPage from '@/pages/m/AddPropertyPage';
import AddProjectPage from '@/pages/m/AddProjectPage';
import AddBuyRequestPage from '@/pages/m/AddBuyRequestPage';
import AddBuyRequestNewPage from '@/pages/m/AddBuyRequestNewPage';
import AddRFQPage from '@/pages/m/AddRFQPage';
import AddProductPage from '@/pages/m/AddProductPage';
import AddServicePage from '@/pages/m/AddServicePage';
import AddTaskPage from '@/pages/m/AddTaskPage';
import MobileHomePage from '@/pages/m/MobileHomePage';
import MobileFindPage from '@/pages/m/MobileFindPage';
import MobileAddPage from '@/pages/m/MobileAddPage';
import MobileBuyPage from '@/pages/m/MobileBuyPage';
import MobileAccountPage from '@/pages/m/MobileAccountPage';
import MobileSettingsPage from '@/pages/m/MobileSettingsPage';
import AccountGuest from '@/pages/m/AccountGuest';
import DashboardHome from '@/pages/m/DashboardHome';
import MyPropertiesPage from '@/pages/m/MyPropertiesPage';
import BuyerOrganizerPage from '@/pages/m/BuyerOrganizerPage';
import SellerOrganizerPage from '@/pages/m/SellerOrganizerPage';
import AgentDashboardHome from '@/pages/m/AgentDashboardHome';
import AgentBusinessProfile from '@/pages/m/AgentBusinessProfile';
import AgentClientsPage from '@/pages/m/AgentClientsPage';
import AgentAppointmentsPage from '@/pages/m/AgentAppointmentsPage';
import AgentAnalyticsPage from '@/pages/m/AgentAnalyticsPage';
import AgencyDashboardHome from '@/pages/m/AgencyDashboardHome';
import AgencyMyAgentsPage from '@/pages/m/AgencyMyAgentsPage';
import DeveloperDashboardHome from '@/pages/m/DeveloperDashboardHome';
import DeveloperMyProjectsPage from '@/pages/m/DeveloperMyProjectsPage';
import ProfilePageMobile from '@/pages/m/ProfilePage';
import KemedarOrdersPage from '@/pages/m/dashboard/KemedarOrdersPage';
import KnowledgeArticleDetail from '@/pages/m/dashboard/KnowledgeArticleDetail';
import KnowledgeSearchResults from '@/pages/m/dashboard/KnowledgeSearchResults';
import ContactKemedarPage from '@/pages/m/dashboard/ContactKemedarPage';
import PaymentMethodsPage from '@/pages/m/dashboard/PaymentMethodsPage';
import InvoicesPage from '@/pages/m/dashboard/InvoicesPage';
import KemetroRFQPage, { KemetroRFQDetailPage } from '@/pages/m/kemetro/KemetroRFQPage';
import KemetroOrdersPageV2, { KemetroOrderDetailPageV2 } from '@/pages/m/kemetro/KemetroOrdersPageV2';
import KemeworkOrdersPage from '@/pages/m/dashboard/kemework/KemeworkOrdersPage';
import KemeworkOrderDetailPage from '@/pages/m/dashboard/kemework/KemeworkOrderDetailPage';
import KemeworkBookmarksPage from '@/pages/m/dashboard/kemework/KemeworkBookmarksPage';
import FavoritesPage from '@/pages/m/dashboard/FavoritesPage';
import ComparePropertiesPage from '@/pages/m/dashboard/ComparePropertiesPage';
import MyBuyRequestsPage from '@/pages/m/dashboard/MyBuyRequestsPage';
import SearchBuyRequestsPage from '@/pages/m/dashboard/SearchBuyRequestsPage';
import KemeworkMobileFind from '@/pages/m/kemework/KemeworkMobileFind';
import KemeworkMobilePostTask from '@/pages/m/kemework/KemeworkMobilePostTask';
import KemeworkMobileTaskDetail from '@/pages/m/kemework/KemeworkMobileTaskDetail';
import KemeworkMobileServiceDetail from '@/pages/m/kemework/KemeworkMobileServiceDetail';
import KemeworkMobileFreelancerProfile from '@/pages/m/kemework/KemeworkMobileFreelancerProfile';
import KemeworkPreferredProgramMobile from '@/pages/m/kemework/KemeworkPreferredProgramMobile';
import SellerMobileShell from '@/pages/m/seller/SellerMobileShell';
import KemedarOrdersDesktop from '@/pages/dashboard/orders/KemedarOrdersDesktop';
import KemetroOrdersDesktop from '@/pages/dashboard/orders/KemetroOrdersDesktop';
import KemetroRFQsDesktop from '@/pages/dashboard/orders/KemetroRFQsDesktop';
import KemeworkOrdersDesktop from '@/pages/dashboard/orders/KemeworkOrdersDesktop';
import InvoicesDesktop from '@/pages/dashboard/orders/InvoicesDesktop';
import PaymentMethodsDesktop from '@/pages/dashboard/orders/PaymentMethodsDesktop';
import PremiumServices from '@/pages/dashboard/PremiumServices';
import AreaSubscriptions from '@/pages/dashboard/AreaSubscriptions';
import FranchisePaidServices from '@/pages/dashboard/FranchisePaidServices';
import FranchiseCommissions from '@/pages/dashboard/FranchiseCommissions';
import UserPremiumServices from '@/pages/dashboard/UserPremiumServices';
import MyServiceOrders from '@/pages/dashboard/MyServiceOrders';
import SettingsDesktop from '@/pages/dashboard/SettingsDesktop';
import KnowledgeBaseDesktop from '@/pages/dashboard/KnowledgeBaseDesktop';
import ContactKemedarDesktop from '@/pages/dashboard/ContactKemedarDesktop';
import ContactKemedarMobilePage from '@/pages/m/dashboard/ContactKemedarMobilePage';
import TicketsDesktop from '@/pages/dashboard/TicketsDesktop';
import AdminKemeworkRoutes from '@/components/admin/AdminKemeworkRoutes';
import AdminModuleControl from '@/pages/admin/modules/AdminModuleControl';
import ComingSoon from '@/pages/ComingSoon';
import Sitemap from '@/pages/Sitemap';
import FranchiseOwnerShell from '@/components/franchise/FranchiseOwnerShell';
import KemetroSellerShell from '@/components/kemetro/seller/KemetroSellerShell';
import StoreOverviewDesktop from '@/pages/dashboard/kemetro-seller/StoreOverviewDesktop';
import ProductsDesktop from '@/pages/dashboard/kemetro-seller/ProductsDesktop';
import OrdersDesktop from '@/pages/dashboard/kemetro-seller/OrdersDesktop';
import AnalyticsDesktop from '@/pages/dashboard/kemetro-seller/AnalyticsDesktop';
import PromotionsDesktop from '@/pages/dashboard/kemetro-seller/PromotionsDesktop';
import EarningsDesktop from '@/pages/dashboard/kemetro-seller/EarningsDesktop';
import ReviewsDesktop from '@/pages/dashboard/kemetro-seller/ReviewsDesktop';
import ShipmentsDesktop from '@/pages/dashboard/kemetro-seller/ShipmentsDesktop';
import AddProductDesktop from '@/pages/dashboard/kemetro-seller/AddProductDesktop';
import ShippingSettingsDesktop from '@/pages/dashboard/kemetro-seller/ShippingSettingsDesktop';
import CouponsDesktop from '@/pages/dashboard/kemetro-seller/CouponsDesktop';
import StoreSettingsDesktop from '@/pages/dashboard/kemetro-seller/StoreSettingsDesktop';
import SupportDesktop from '@/pages/dashboard/kemetro-seller/SupportDesktop';
import EditStoreDesktop from '@/pages/dashboard/kemetro-seller/EditStoreDesktop';
import EditProductDesktop from '@/pages/dashboard/kemetro-seller/EditProductDesktop';
import EditProductMobile from '@/pages/m/seller/EditProductMobile';
import CommonUserShell from '@/components/dashboard/shells/CommonUserShell';
import UserSettingsPage from '@/pages/m/cp/user/UserSettingsPage';
import MobileAgentShell from '@/components/dashboard/shells/MobileAgentShell';
import MobileAgencyShell from '@/components/dashboard/shells/MobileAgencyShell';
import MobileDeveloperShell from '@/components/dashboard/shells/MobileDeveloperShell';
import MobileProfessionalShell from '@/components/dashboard/shells/MobileProfessionalShell';
import MobileCompanyShell from '@/components/dashboard/shells/MobileCompanyShell';
import MobileFranchiseShell from '@/components/dashboard/shells/MobileFranchiseShell';
import ProMobileDashboard from '@/pages/m/cp/pro/ProMobileDashboard';
import CompanyMobileHome from '@/pages/m/cp/company/CompanyHome';
import FranchiseCPMobileDashboard from '@/pages/m/cp/franchise/FranchiseCPMobileDashboard';
import FranchiseCPAreaUsers from '@/pages/m/cp/franchise/FranchiseCPAreaUsers';
import FranchiseCPAreaProperties from '@/pages/m/cp/franchise/FranchiseCPAreaProperties';
import FranchiseCPAreaProjects from '@/pages/m/cp/franchise/FranchiseCPAreaProjects';
import FranchiseCPKemeworkTasks from '@/pages/m/cp/franchise/FranchiseCPKemeworkTasks';
import FranchiseCPKemetroSellers from '@/pages/m/cp/franchise/FranchiseCPKemetroSellers';
import FranchiseCPOrders from '@/pages/m/cp/franchise/FranchiseCPOrders';
import FranchiseCPSupport from '@/pages/m/cp/franchise/FranchiseCPSupport';
import FranchiseCPEmail from '@/pages/m/cp/franchise/FranchiseCPEmail';
import FranchiseCPBulkComms from '@/pages/m/cp/franchise/FranchiseCPBulkComms';
import FranchiseCPFiles from '@/pages/m/cp/franchise/FranchiseCPFiles';
import FranchiseCPWallet from '@/pages/m/cp/franchise/FranchiseCPWallet';
import ProOrdersPageMobile from '@/pages/m/cp/pro/ProOrdersPageMobile';
import MyBidsPageMobile from '@/pages/m/cp/pro/MyBidsPageMobile';
import AgentSettingsPage from '@/pages/m/cp/agent/AgentSettingsPage';
import AgencySettingsPage from '@/pages/m/cp/agency/AgencySettingsPage';
import DeveloperSettingsPage from '@/pages/m/cp/developer/DeveloperSettingsPage';
import DeveloperFavoritesPage from '@/pages/m/cp/developer/DeveloperFavoritesPage';
import DeveloperMyProjectsMobilePage from '@/pages/m/cp/developer/DeveloperMyProjectsPage';
import AgentMyProjectsPage from '@/pages/m/cp/agent/AgentMyProjectsPage';
import AgentBuyerOrganizer from '@/pages/cp/agent/AgentBuyerOrganizer';
import AgentSellerOrganizer from '@/pages/cp/agent/AgentSellerOrganizer';
import AgentKemeworkOrdersPage from '@/pages/m/cp/agent/AgentKemeworkOrdersPage';
import MobileCommonUserShell from '@/components/dashboard/shells/MobileCommonUserShell';
import CommonUserHome from '@/pages/cp/CommonUserHome';
import AgentHome from '@/pages/cp/AgentHome';
import AgencyHome from '@/pages/cp/AgencyHome';
import DeveloperHome from '@/pages/cp/DeveloperHome';
import CompanyHome from '@/pages/cp/CompanyHome';
import AgentShell from '@/components/dashboard/shells/AgentShell';
import AgencyShell from '@/components/dashboard/shells/AgencyShell';
import ProfessionalShell from '@/components/dashboard/shells/ProfessionalShell';
import DeveloperShell from '@/components/dashboard/shells/DeveloperShell';
import FinishingCompanyShell from '@/components/dashboard/shells/FinishingCompanyShell';
import FranchiseOwnerPaymentMethods from '@/pages/dashboard/FranchiseOwnerPaymentMethods';
import FranchiseOwnerWithdrawals from '@/pages/dashboard/FranchiseOwnerWithdrawals';
import FranchiseOwnerDeposits from '@/pages/dashboard/FranchiseOwnerDeposits';
import FranchiseOwnerBizProposals from '@/pages/dashboard/FranchiseOwnerBizProposals';
import FranchiseOwnerBizEstimates from '@/pages/dashboard/FranchiseOwnerBizEstimates';
import FranchiseOwnerBizCreditNotes from '@/pages/dashboard/FranchiseOwnerBizCreditNotes';
import FranchiseOwnerBizItems from '@/pages/dashboard/FranchiseOwnerBizItems';
import FranchiseOwnerBizContracts from '@/pages/dashboard/FranchiseOwnerBizContracts';
import FranchiseOwnerBizExpenses from '@/pages/dashboard/FranchiseOwnerBizExpenses';
import FranchiseOwnerBizProjects from '@/pages/dashboard/FranchiseOwnerBizProjects';
import CompanyTeamMembers from '@/pages/dashboard/company/CompanyTeamMembers';
import CompanyInvoicesPage from '@/pages/dashboard/company/CompanyInvoicesPage';
import CompanySubscriptionPage from '@/pages/dashboard/company/CompanySubscriptionPage';
import CompanyCustomersPage from '@/pages/dashboard/company/CompanyCustomersPage';
import CompanyBusinessProfile from '@/pages/dashboard/company/CompanyBusinessProfile';
import CompanyPerformance from '@/pages/dashboard/company/CompanyPerformance';
import ProMessagesPage from '@/pages/dashboard/pro/ProMessagesPage';
import ProNotificationsPage from '@/pages/dashboard/pro/ProNotificationsPage';
import ProSettingsPage from '@/pages/dashboard/pro/ProSettingsPage';
import ProSearchTasksPage from '@/pages/dashboard/pro/ProSearchTasksPage';
import ProTasksInCategoryPage from '@/pages/dashboard/pro/ProTasksInCategoryPage';
import ProProfilePage from '@/pages/dashboard/pro/ProProfilePage';
import CompanyMessagesPage from '@/pages/dashboard/company/CompanyMessagesPage';
import CompanyNotificationsPage from '@/pages/dashboard/company/CompanyNotificationsPage';
import CompanySettingsPage from '@/pages/dashboard/company/CompanySettingsPage';
import CompanySearchTasksPage from '@/pages/dashboard/company/CompanySearchTasksPage';
import CompanyTasksInCategoryPage from '@/pages/dashboard/company/CompanyTasksInCategoryPage';
import CompanyPerformanceMobile from '@/pages/m/cp/company/CompanyPerformanceMobile';
import RegisterPage from '@/pages/m/RegisterPage';
import LoginPage from '@/pages/m/LoginPage';
import ShippingSettingsPage from '@/pages/m/dashboard/ShippingSettingsPage';
import SellerPromotionsPage from '@/pages/m/dashboard/SellerPromotionsPage';
import SellerEditStoreMobile from '@/pages/m/seller/SellerEditStoreMobile';
import SellerPromotionsAddPage from '@/pages/m/dashboard/SellerPromotionsAddPage';
import SellerPromotionsDetailPage from '@/pages/m/dashboard/SellerPromotionsDetailPage';
import SellerPromotionsEditPage from '@/pages/m/dashboard/SellerPromotionsEditPage';
import SellerCouponsCreatePage from '@/pages/m/dashboard/SellerCouponsCreatePage';
import SellerCouponsPage from '@/pages/m/dashboard/SellerCouponsPage';
import SellerCouponsEditPage from '@/pages/m/dashboard/SellerCouponsEditPage';
import SellerProductPreviewPage from '@/pages/m/seller/SellerProductPreviewPage';
import ValuationWizard from '@/pages/kemedar/ValuationWizard';
import ValuationReport from '@/pages/kemedar/ValuationReport';
import ValuationsDashboard from '@/pages/dashboard/ValuationsDashboard';
import MobileValuationWizard from '@/pages/m/kemedar/MobileValuationWizard';
import MobileValuationsDashboard from '@/pages/m/dashboard/MobileValuationsDashboard';
import AdminMarketData from '@/pages/admin/kemedar/AdminMarketData';
import ImportedPropertiesPage from '@/pages/admin/kemedar/properties/ImportedPropertiesPage';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminPermissions from '@/pages/admin/permissions/AdminPermissions';
import PermissionAuditLog from '@/pages/admin/permissions/PermissionAuditLog';
import AdminEnvSettings from '@/pages/admin/AdminEnvSettings';
import AdvisorOverview from '@/pages/admin/kemedar/advisor/AdvisorOverview';
import AdvisorProfiles from '@/pages/admin/kemedar/advisor/AdvisorProfiles';
import AdvisorMatches from '@/pages/admin/kemedar/advisor/AdvisorMatches';
import AdvisorNotifications from '@/pages/admin/kemedar/advisor/AdvisorNotifications';
import AdvisorAnalytics from '@/pages/admin/kemedar/advisor/AdvisorAnalytics';
import AdvisorSettings from '@/pages/admin/kemedar/advisor/AdvisorSettings';
import SubscriptionPlans from '@/pages/admin/subscriptions/SubscriptionPlans';
import PaidServices from '@/pages/admin/subscriptions/PaidServices';
import Subscribers from '@/pages/admin/subscriptions/Subscribers';
import ServiceOrders from '@/pages/admin/subscriptions/ServiceOrders';
import Invoices from '@/pages/admin/subscriptions/Invoices';
import Commissions from '@/pages/admin/subscriptions/Commissions';
import RevenueAnalytics from '@/pages/admin/subscriptions/RevenueAnalytics';
import SubscriptionSettings from '@/pages/admin/subscriptions/SubscriptionSettings';
import PredictDashboard from '@/pages/admin/kemedar/predict/PredictDashboard';
import PredictSignals from '@/pages/admin/kemedar/predict/PredictSignals';
import PredictPredictions from '@/pages/admin/kemedar/predict/PredictPredictions';
import PredictAccuracy from '@/pages/admin/kemedar/predict/PredictAccuracy';
import PredictSettings from '@/pages/admin/kemedar/predict/PredictSettings';
import KemedarPredict from '@/pages/kemedar/KemedarPredict';
import KemedarPredictMobile from '@/pages/m/kemedar/KemedarPredictMobile';
import VisionReport from '@/pages/kemedar/VisionReport';
import NegotiateDealRoom from '@/pages/kemedar/NegotiateDealRoom';
import NegotiationsDashboard from '@/pages/dashboard/NegotiationsDashboard';
import NegotiateOverview from '@/pages/admin/kemedar/negotiate/NegotiateOverview';
import NegotiateSettings from '@/pages/admin/kemedar/negotiate/NegotiateSettings';
import VisionOverview from '@/pages/admin/kemedar/vision/VisionOverview';
import VisionReports from '@/pages/admin/kemedar/vision/VisionReports';
import VisionFlaggedIssues from '@/pages/admin/kemedar/vision/VisionFlaggedIssues';
import VisionStagingJobs from '@/pages/admin/kemedar/vision/VisionStagingJobs';
import VisionSettings from '@/pages/admin/kemedar/vision/VisionSettings';
import CRMDashboard from '@/pages/admin/crm/CRMDashboard';
import CRMContacts from '@/pages/admin/crm/CRMContacts';
import CRMNewContact from '@/pages/admin/crm/CRMNewContact';
import CRMContactDetail from '@/pages/admin/crm/CRMContactDetail';
import CRMAccounts from '@/pages/admin/crm/CRMAccounts';
import CRMAccountDetail from '@/pages/admin/crm/CRMAccountDetail';
import CRMActivationQueue from '@/pages/admin/crm/CRMActivationQueue';
import CRMInbox from '@/pages/admin/crm/CRMInbox';
import CRMCalls from '@/pages/admin/crm/CRMCalls';
import CRMCallDetail from '@/pages/admin/crm/CRMCallDetail';
import CRMTasks from '@/pages/admin/crm/CRMTasks';
import CRMPipelines from '@/pages/admin/crm/CRMPipelines';
import CRMOpportunityDetail from '@/pages/admin/crm/CRMOpportunityDetail';
import CRMTemplates from '@/pages/admin/crm/CRMTemplates';
import CRMAutomations from '@/pages/admin/crm/CRMAutomations';
import CRMAIAgents from '@/pages/admin/crm/CRMAIAgents';
import CRMApprovals from '@/pages/admin/crm/CRMApprovals';
import CRMReports from '@/pages/admin/crm/CRMReports';
import CRMIntegrations from '@/pages/admin/crm/CRMIntegrations';
import CRMSettings from '@/pages/admin/crm/CRMSettings';
import AdminTranslations from '@/pages/admin/translations/AdminTranslations';
import AIPropertySearch from '@/pages/kemedar/AIPropertySearch';
import MobileAIPropertySearch from '@/pages/m/kemedar/MobileAIPropertySearch';
import AIPropertySubmission from '@/pages/kemedar/AIPropertySubmission';
import MobileAIPropertySubmission from '@/pages/m/kemedar/MobileAIPropertySubmission';
import AdvisorLanding from '@/pages/kemedar/AdvisorLanding';
import AdvisorSurvey from '@/pages/kemedar/AdvisorSurvey';
import AdvisorReportPage from '@/pages/dashboard/AdvisorReportPage';
import MyFinishingEstimates from '@/pages/dashboard/MyFinishingEstimates';
import FinishingRatesManager from '@/pages/admin/kemedar/FinishingRatesManager';
import FinishingAnalytics from '@/pages/admin/kemedar/FinishingAnalytics';
import LifeScore from '@/pages/kemedar/LifeScore';
import LifeScoreDetail from '@/pages/kemedar/LifeScoreDetail';
import LifeScoreMobile from '@/pages/m/kemedar/LifeScoreMobile';
import LifeScoreOverview from '@/pages/admin/kemedar/life-score/LifeScoreOverview';
import LifeScoreAllScores from '@/pages/admin/kemedar/life-score/LifeScoreAllScores';
import LifeScoreDataManagement from '@/pages/admin/kemedar/life-score/LifeScoreDataManagement';
import LifeScoreReviewsAdmin from '@/pages/admin/kemedar/life-score/LifeScoreReviewsAdmin';
import LifeScoreSettings from '@/pages/admin/kemedar/life-score/LifeScoreSettings';
import TwinDashboard from '@/pages/kemedar/TwinDashboard';
import LiveTourViewer from '@/pages/kemedar/LiveTourViewer';
import VirtualTourViewer from '@/pages/kemedar/VirtualTourViewer';
import VerificationTour from '@/pages/kemedar/VerificationTour';
import MatchSetup from '@/pages/kemedar/MatchSetup';
import KemedarMatch from '@/pages/kemedar/KemedarMatch';
import SellerMatchHub from '@/pages/kemedar/SellerMatchHub';
import MatchHistory from '@/pages/kemedar/MatchHistory';
import AdminMatchOverview from '@/pages/admin/kemedar/match/AdminMatchOverview';
import EscrowSetupWizard from '@/pages/kemedar/EscrowSetupWizard';
import EscrowDealRoom from '@/pages/kemedar/EscrowDealRoom';
import EscrowDisputeRoom from '@/pages/kemedar/EscrowDisputeRoom';
import EscrowWalletDashboard from '@/pages/dashboard/EscrowWalletDashboard';
import KYCDashboard from '@/pages/dashboard/KYCDashboard';
import AdminEscrowOverview from '@/pages/admin/kemedar/escrow/AdminEscrowOverview';
import AdminEscrowDeals from '@/pages/admin/kemedar/escrow/AdminEscrowDeals';
import AdminEscrowDisputes from '@/pages/admin/kemedar/escrow/AdminEscrowDisputes';
import AdminEscrowAccounts from '@/pages/admin/kemedar/escrow/AdminEscrowAccounts';
import AdminEscrowSettings from '@/pages/admin/kemedar/escrow/AdminEscrowSettings';
import TwinOverview from '@/pages/admin/kemedar/twin/TwinOverview';
import FinishLanding from '@/pages/kemedar/finish/FinishLanding';
import FinishWizard from '@/pages/kemedar/finish/FinishWizard';
import FinishBOQPage from '@/pages/kemedar/finish/FinishBOQPage';
import FinishProjectDashboard from '@/pages/kemedar/finish/FinishProjectDashboard';
import FinishAdminOverview from '@/pages/admin/kemedar/finish/FinishAdminOverview';
import KemetroBuild from '@/pages/kemetro/KemetroBuild';
import KemetroBuildWizard from '@/pages/kemetro/KemetroBuildWizard';
import KemetroBuildBOQ from '@/pages/kemetro/KemetroBuildBOQ';
import KemetroBuildMyProjects from '@/pages/kemetro/KemetroBuildMyProjects';
import KemetroBuildGroupBuy from '@/pages/kemetro/KemetroBuildGroupBuy';
import KemetroFlash from '@/pages/kemetro/KemetroFlash';
import KemetroFlashDealDetail from '@/pages/kemetro/KemetroFlashDealDetail';
import KemetroFlashCompoundDetail from '@/pages/kemetro/KemetroFlashCompoundDetail';
import KemetroFlashSellerCreate from '@/pages/kemetro/KemetroFlashSellerCreate';
import KemetroFlashSellerDashboard from '@/pages/kemetro/KemetroFlashSellerDashboard';
import AdminFlashOverview from '@/pages/admin/kemetro/flash/AdminFlashOverview';
import AdminSurplusRoutes from '@/components/admin/AdminSurplusRoutes';
import AdminKemeKitsRoutes from '@/components/admin/AdminKemeKitsRoutes';
import CommunityDiscovery from '@/pages/kemedar/CommunityDiscovery';
import CommunityHome from '@/pages/kemedar/CommunityHome';
import CommunityJoin from '@/pages/kemedar/CommunityJoin';
import CommunityCreate from '@/pages/kemedar/CommunityCreate';
import CommunityIntelligence from '@/pages/kemedar/CommunityIntelligence';
import CommunityDaily from '@/pages/kemedar/CommunityDaily';
import AdminCommunityOverview from '@/pages/admin/kemedar/community/AdminCommunityOverview';
import ExpatLanding from '@/pages/kemedar/ExpatLanding';
import ExpatSetup from '@/pages/kemedar/ExpatSetup';
import ExpatDashboard from '@/pages/kemedar/ExpatDashboard';
import ExpatLegal from '@/pages/kemedar/ExpatLegal';
import ExpatManagement from '@/pages/kemedar/ExpatManagement';
import ExpatCommunity from '@/pages/kemedar/ExpatCommunity';
import AdminExpatOverview from '@/pages/admin/kemedar/expat/AdminExpatOverview';
import MyScore from '@/pages/dashboard/MyScore';
import ScorePublicView from '@/pages/ScorePublicView';
import AdminScoreOverview from '@/pages/admin/kemedar/score/AdminScoreOverview';
import ScoreArchitecture from '@/pages/admin/kemedar/score/ScoreArchitecture';
import KemedarCoach from '@/pages/kemedar/KemedarCoach';
import KemedarCoachMobile from '@/pages/m/kemedar/KemedarCoachMobile';
import AdminCoachOverview from '@/pages/admin/kemedar/coach/AdminCoachOverview';
import KemedarLive from '@/pages/kemedar/KemedarLive';
import LiveEventDetail from '@/pages/kemedar/LiveEventDetail';
import LiveEventWatch from '@/pages/kemedar/LiveEventWatch';
import LiveCreateEvent from '@/pages/kemedar/LiveCreateEvent';
import KemedarLiveMobile from '@/pages/m/kemedar/KemedarLiveMobile';
import AdminLiveOverview from '@/pages/admin/kemedar/live/AdminLiveOverview';
import AdminDNAOverview from '@/pages/admin/kemedar/dna/AdminDNAOverview';
import MyDNA from '@/pages/dashboard/MyDNA';
import MobileDNAPage from '@/pages/m/dashboard/MobileDNAPage';
import TwinCitiesHub from '@/pages/kemedar/TwinCitiesHub';
import TwinCitiesCompare from '@/pages/kemedar/TwinCitiesCompare';
import TwinCitiesRelocate from '@/pages/kemedar/TwinCitiesRelocate';
import TwinCitiesMobile from '@/pages/m/kemedar/TwinCitiesMobile';
import TwinCitiesAdmin from '@/pages/admin/kemedar/TwinCitiesAdmin';
import PricingPage from '@/pages/kemedar/PricingPage';
import CheckoutPage from '@/pages/kemedar/CheckoutPage';
import SubscriptionDashboard from '@/pages/dashboard/SubscriptionDashboard';
import MonetizationOverview from '@/pages/admin/kemedar/monetization/MonetizationOverview';
import PricingMobilePage from '@/pages/m/PricingMobilePage';
import PredictLanding from '@/pages/kemedar/PredictLanding';
import VisionLanding from '@/pages/kemedar/VisionLanding';
import NegotiateLanding from '@/pages/kemedar/NegotiateLanding';
import LifeScoreLanding from '@/pages/kemedar/LifeScoreLanding';
import TwinLanding from '@/pages/kemedar/TwinLanding';
import MatchLanding from '@/pages/kemedar/MatchLanding';
import EscrowLanding from '@/pages/kemedar/EscrowLanding';
import FinishLandingPage from '@/pages/kemedar/FinishLandingPage';
import CommunityLanding from '@/pages/kemedar/CommunityLanding';
import CoachLanding from '@/pages/kemedar/CoachLanding';
import LiveLanding from '@/pages/kemedar/LiveLanding';
import ScoreLanding from '@/pages/kemedar/ScoreLanding';
import ExpatLandingPage from '@/pages/kemedar/ExpatLandingPage';
import Rent2OwnLanding from '@/pages/kemedar/Rent2OwnLanding';
import DNALanding from '@/pages/kemedar/DNALanding';
import TwinCitiesLanding from '@/pages/kemedar/TwinCitiesLanding';
import FlashLanding from '@/pages/kemetro/FlashLanding';
import BuildLanding from '@/pages/kemetro/BuildLanding';
import SellerVerificationWizard from '@/pages/SellerVerificationWizard';
import PublicVerifyCertificate from '@/pages/PublicVerifyCertificate';
import SmartContractDeal from '@/pages/SmartContractDeal';
import FOInspections from '@/pages/fo/FOInspections';
import VerifyProDashboard from '@/pages/admin/kemedar/verify-pro/VerifyProDashboard';
import VerifyProTokens from '@/pages/admin/kemedar/verify-pro/VerifyProTokens';
import VerifyProDocuments from '@/pages/admin/kemedar/verify-pro/VerifyProDocuments';
import VerifyProInspections from '@/pages/admin/kemedar/verify-pro/VerifyProInspections';
import VerifyProFraud from '@/pages/admin/kemedar/verify-pro/VerifyProFraud';
import VerifyProCertificates from '@/pages/admin/kemedar/verify-pro/VerifyProCertificates';
import VerifyProSettings from '@/pages/admin/kemedar/verify-pro/VerifyProSettings';
import KemeFrac from '@/pages/KemeFrac';
import KemeFracDetail from '@/pages/KemeFracDetail';
import KemeFracKYC from '@/pages/KemeFracKYC';
import KemeFracPortfolio from '@/pages/KemeFracPortfolio';
import KemeFracAdminDashboard from '@/pages/admin/kemedar/kemefrac/KemeFracAdminDashboard';
import KemeFracOfferings from '@/pages/admin/kemedar/kemefrac/KemeFracOfferings';
import KemeFracTokenize from '@/pages/admin/kemedar/kemefrac/KemeFracTokenize';
import KemeFracInvestors from '@/pages/admin/kemedar/kemefrac/KemeFracInvestors';
import KemeFracKYCReview from '@/pages/admin/kemedar/kemefrac/KemeFracKYCReview';
import KemeFracYieldManager from '@/pages/admin/kemedar/kemefrac/KemeFracYieldManager';
import KemeFracSettings from '@/pages/admin/kemedar/kemefrac/KemeFracSettings';
import ConciergeHub from '@/pages/dashboard/ConciergeHub';
import ConciergeMobileHub from '@/pages/m/dashboard/ConciergeMobileHub';
import ConciergeAnalytics from '@/pages/admin/kemedar/concierge/ConciergeAnalytics';
import ConciergeTemplates from '@/pages/admin/kemedar/concierge/ConciergeTemplates';
import ConciergeSettings from '@/pages/admin/kemedar/concierge/ConciergeSettings';
import STLAnalytics from '@/pages/admin/kemetro/shop-the-look/STLAnalytics';
import STLImages from '@/pages/admin/kemetro/shop-the-look/STLImages';
import STLManualTag from '@/pages/admin/kemetro/shop-the-look/STLManualTag';
import STLSponsorships from '@/pages/admin/kemetro/shop-the-look/STLSponsorships';
import STLSettings from '@/pages/admin/kemetro/shop-the-look/STLSettings';
import SwapHub from '@/pages/dashboard/swap/SwapHub';
import SurplusListingWizard from '@/pages/kemetro/surplus/SurplusListingWizard';
import KemeKitsMyKits from '@/pages/kemework/pro/KemeKitsMyKits';
import KemeKitCreatorStudio from '@/pages/kemework/pro/KemeKitCreatorStudio';
import KemeKitsHub from '@/pages/kemetro/KemeKitsHub';
import KemeKitsMobileHub from '@/pages/m/kemetro/KemeKitsMobileHub';
import KemeKitDetail from '@/pages/kemetro/KemeKitDetail';
import KemeKitsMyCalculations from '@/pages/kemetro/KemeKitsMyCalculations';
import SurplusMarketHub from '@/pages/kemetro/surplus/SurplusMarketHub';
import SurplusItemDetail from '@/pages/kemetro/surplus/SurplusItemDetail';
import SurplusReservationScreen from '@/pages/kemetro/surplus/SurplusReservationScreen';
import SurplusQRScanner from '@/pages/kemetro/surplus/SurplusQRScanner';
import SurplusMyListings from '@/pages/kemetro/surplus/SurplusMyListings';
import SurplusMyReservations from '@/pages/kemetro/surplus/SurplusMyReservations';
import SwapNegotiationRoom from '@/pages/dashboard/swap/SwapNegotiationRoom';
import MobileSwapPage from '@/pages/m/swap/MobileSwapPage';
import AuctionHub from '@/pages/kemedar/AuctionHub';import AuctionDetail from '@/pages/kemedar/AuctionDetail';import HowAuctionsWork from '@/pages/kemedar/HowAuctionsWork';import AuctionsDashboard from '@/pages/dashboard/AuctionsDashboard';import WinnerPaymentFlow from '@/pages/kemedar/WinnerPaymentFlow';import SellerAuctionMonitor from '@/pages/kemedar/SellerAuctionMonitor';import AuctionTransfer from '@/pages/kemedar/AuctionTransfer';import AdminAuctionsRoutes from '@/components/admin/AdminAuctionsRoutes';
export default function AppRoutes() {
  return (
    <Routes>
      {/* Kemework Routes */}
      <Route path="/kemework" element={<KemeworkShell />}>
        <Route index element={<KemeworkHomePage />} />
        <Route path="find-professionals" element={<KemeworkFindProfessionalsPage />} />
        <Route path="find-marketer" element={<KemeworkHomePage />} />
        <Route path="service-companies" element={<KemeworkHomePage />} />
        <Route path="tasks" element={<KemeworkBrowseTasksPage />} />
        <Route path="services" element={<KemeworkBrowseServicesPage />} />
        <Route path="how-it-works" element={<KemeworkHowItWorksPage />} />
        <Route path="preferred-professional-program" element={<KemeworkPreferredProgramPage />} />
        <Route path="accreditation" element={<KemeworkPreferredProgramPage />} />
        <Route path="task/:slug" element={<KemeworkTaskDetailPage />} />
        <Route path="service/:slug" element={<KemeworkServiceDetailPage />} />
        <Route path="freelancer/:username" element={<KemeworkFreelancerProfilePage />} />
        <Route path="client/:username" element={<KemeworkClientProfilePage />} />
        <Route path="category/:slug" element={<KemeworkHomePage />} />
        <Route path="search" element={<KemeworkHomePage />} />
        <Route path="categories" element={<KemeworkHomePage />} />
        <Route path="post-task" element={<KemeworkPostTaskPage />} />
        <Route path="pro/kemekits" element={<KemeKitsMyKits />} />
        <Route path="pro/kemekits/create" element={<KemeKitCreatorStudio />} />
        <Route path="pro/kemekits/:templateId/edit" element={<KemeKitCreatorStudio />} />
        <Route path="add-service" element={<KemeworkAddServicePage />} />
        <Route path="post-service" element={<KemeworkAddServicePage />} />
        <Route path="register" element={<KemeworkHomePage />} />
        <Route path="pro-benefits" element={<KemeworkHomePage />} />
        <Route path="plans" element={<KemeworkHomePage />} />
        <Route path="profile/:username" element={<KemeworkFreelancerProfilePage />} />
        <Route path="profile" element={<KemeworkHomePage />} />
        <Route path="following" element={<KemeworkHomePage />} />
        <Route path="my-packages" element={<KemeworkHomePage />} />
        <Route path="settings" element={<KemeworkHomePage />} />
        <Route path="history" element={<KemeworkHomePage />} />
        <Route path="orders" element={<KemeworkHomePage />} />
        <Route path="messages" element={<KemeworkHomePage />} />
        <Route path="notifications" element={<KemeworkHomePage />} />
        <Route path="support" element={<KemeworkHomePage />} />
        <Route path="about" element={<KemeworkHomePage />} />
        <Route path="contact" element={<KemeworkHomePage />} />
        <Route path="privacy" element={<KemeworkHomePage />} />
        <Route path="terms" element={<KemeworkHomePage />} />
        <Route path="cookies" element={<KemeworkHomePage />} />
        <Route path="careers" element={<KemeworkHomePage />} />
        <Route path="blog" element={<KemeworkHomePage />} />
        <Route path="*" element={<KemeworkHomePage />} />
      </Route>

      <Route path="/kemefrac" element={<KemeFrac />} />
      <Route path="/kemefrac/kyc" element={<KemeFracKYC />} />
      <Route path="/kemefrac/portfolio" element={<KemeFracPortfolio />} />
      <Route path="/kemefrac/:offeringSlug" element={<KemeFracDetail />} />
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />

      <Route path="/dashboard" element={<DashboardShell />}>
        <Route index element={<Dashboard />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="compare" element={<CompareProperties />} />
        <Route path="my-buy-requests" element={<MyBuyRequests />} />
        <Route path="search-requests" element={<SearchBuyRequests />} />
        <Route path="buyer-organizer" element={<BuyerOrganizer />} />
        <Route path="seller-organizer" element={<SellerOrganizer />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="my-agents" element={<ManageMyAgents />} />
        <Route path="agency-analytics" element={<PerformanceStats />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="project-sales" element={<ProjectSales />} />
        <Route path="area-users" element={<AreaUsers />} />
        <Route path="area-properties" element={<AreaProperties />} />
        <Route path="area-projects" element={<AreaProperties />} />
        <Route path="area-buy-requests" element={<AreaUsers />} />
        <Route path="kemework" element={<KemeworkDashboard />} />
        <Route path="find-handyman" element={<FindHandyman />} />
        <Route path="handymen-list" element={<FindHandyman />} />
        <Route path="kemedar-tasks" element={<KemeworkDashboard />} />
        <Route path="kemetro-sellers" element={<KemetroSellers />} />
        <Route path="area-products" element={<KemetroSellers />} />
        <Route path="verify-seller" element={<KemetroSellers />} />
        <Route path="area-subscriptions" element={<AreaSubscriptions />} />
        <Route path="promote-ads" element={<PerformanceStats />} />
        <Route path="paid-services" element={<FranchisePaidServices />} />
        <Route path="kemecoins" element={<FranchiseWallet />} />
        <Route path="commissions" element={<FranchiseCommissions />} />
        <Route path="orders/new" element={<FranchiseWallet />} />
        <Route path="orders/progress" element={<FranchiseWallet />} />
        <Route path="orders/completed" element={<FranchiseWallet />} />
        <Route path="invoices" element={<InvoicesDesktop />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="premium-services" element={<UserPremiumServices />} />
        <Route path="my-service-orders" element={<MyServiceOrders />} />
        <Route path="settings" element={<SettingsDesktop />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="kemedar-orders" element={<KemedarOrdersDesktop />} />
        <Route path="kemetro-orders" element={<KemetroOrdersDesktop />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="withdrawals" element={<FranchiseWallet />} />
        <Route path="deposits" element={<FranchiseWallet />} />
        <Route path="files" element={<FranchiseBizSetup />} />
        <Route path="email" element={<FranchiseMessages />} />
        <Route path="messages" element={<FranchiseMessages />} />
        <Route path="bulk-comms" element={<FranchiseMessages />} />
        <Route path="biz-setup" element={<FranchiseBizSetup />} />
        <Route path="leads" element={<FranchiseLeads />} />
        <Route path="customers" element={<Clients />} />
        <Route path="sales" element={<PerformanceStats />} />
        <Route path="expenses" element={<PerformanceStats />} />
        <Route path="contracts" element={<PerformanceStats />} />
        <Route path="employees" element={<ManageMyAgents />} />
        <Route path="biz-projects" element={<MyProjects />} />
        <Route path="biz-tasks" element={<BuyerOrganizer />} />
        <Route path="biz-reports" element={<PerformanceStats />} />
        <Route path="valuations" element={<ValuationsDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MyDNA />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="kyc" element={<KYCDashboard />} />
        <Route path="advisor-report" element={<AdvisorReportPage />} />
        <Route path="estimates" element={<MyFinishingEstimates />} />
        <Route path="concierge/:journeyId" element={<ConciergeHub />} />
        <Route path="swap" element={<SwapHub />} />
        <Route path="swap/matches" element={<SwapHub />} />
        <Route path="swap/negotiations" element={<SwapHub />} />
        <Route path="swap/intent" element={<SwapHub />} />
        <Route path="swap/negotiation/:matchId" element={<SwapNegotiationRoom />} />
        <Route path="auctions" element={<AuctionsDashboard />} />
        <Route path="*" element={<Dashboard />} />
      </Route>

      <Route path="/Dashboard" element={<DashboardShell />}>
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="/search-properties" element={<SearchProperties />} />
      <Route path="/kemedar/search-properties" element={<SearchProperties />} />
      <Route path="/kemedar/search-projects" element={<SearchProjects />} />
      <Route path="/search-projects" element={<SearchProjects />} />
      <Route path="/kemedar/franchise" element={<FranchiseOwnerShell />}>
        <Route path="dashboard" element={<FranchiseOwnerAreaDashboard />} />
        <Route path="area-overview" element={<FranchiseOwnerDashboardHome />} />
        <Route path="area-users" element={<FranchiseAreaUsers />} />
        <Route path="area-properties" element={<FranchiseAreaProperties />} />
        <Route path="area-projects" element={<FranchiseAreaProjects />} />
        <Route path="kemework-tasks" element={<FranchiseOwnerKemeworkTasks />} />
        <Route path="accredit-handyman" element={<FranchiseOwnerAccreditHandyman />} />
        <Route path="accredited-handymen" element={<FranchiseOwnerAccreditedHandymen />} />
        <Route path="kemetro-sellers" element={<FranchiseOwnerKemetroSellers />} />
        <Route path="orders" element={<FranchiseOwnerOrders />} />
        <Route path="files" element={<FranchiseOwnerFiles />} />
        <Route path="email" element={<FranchiseOwnerEmail />} />
        <Route path="bulk-comms" element={<FranchiseOwnerBulkComms />} />
        <Route path="biz/setup" element={<FranchiseOwnerBizSetup />} />
        <Route path="biz/leads" element={<FranchiseOwnerBizLeads />} />
        <Route path="biz/customers" element={<FranchiseOwnerBizCustomers />} />
        <Route path="biz/sales" element={<FranchiseOwnerBizSales />} />
        <Route path="biz/expenses" element={<FranchiseOwnerBizExpenses />} />
        <Route path="biz/proposals" element={<FranchiseOwnerBizProposals />} />
        <Route path="biz/estimates" element={<FranchiseOwnerBizEstimates />} />
        <Route path="biz/credit-notes" element={<FranchiseOwnerBizCreditNotes />} />
        <Route path="biz/items" element={<FranchiseOwnerBizItems />} />
        <Route path="biz/contracts" element={<FranchiseOwnerBizContracts />} />
        <Route path="biz/projects" element={<FranchiseOwnerBizProjects />} />
        <Route path="biz/employees" element={<FranchiseOwnerBizEmployees />} />
        <Route path="biz/tasks" element={<FranchiseOwnerBizTasks />} />
        <Route path="biz/reports" element={<FranchiseOwnerBizReports />} />
        <Route path="support" element={<FranchiseOwnerSupport />} />
        <Route path="contact-kemedar" element={<FranchiseOwnerContactKemedar />} />
        <Route path="knowledge" element={<FranchiseOwnerKnowledge />} />
        <Route path="knowledge/:slug" element={<FranchiseOwnerKnowledgeArticle />} />
        <Route path="area-buy-requests" element={<FranchiseOwnerAreaBuyRequests />} />
        <Route path="handymen" element={<FindHandyman />} />
        <Route path="revenue" element={<FranchiseOwnerWallet />} />
        <Route path="payment-methods" element={<FranchiseOwnerPaymentMethods />} />
        <Route path="withdrawals" element={<FranchiseOwnerWithdrawals />} />
        <Route path="deposits" element={<FranchiseOwnerDeposits />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MyDNA />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="live" element={<KemedarLive />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="flash" element={<KemetroFlash />} />
        <Route path="community" element={<CommunityDiscovery />} />
        <Route path="life-score" element={<LifeScore />} />
        <Route path="expat" element={<ExpatDashboard />} />
      </Route>
      <Route path="/SearchProjects" element={<SearchProjects />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/project-details/:id" element={<ProjectDetails />} />
      <Route path="/find-profile/real-estate-agents" element={<FindAgents />} />
      <Route path="/find-profile/agency" element={<FindAgencies />} />
      <Route path="/find-profile/developer" element={<FindDevelopers />} />
      <Route path="/find-profile/franchise-owner" element={<FindFranchiseOwners />} />
      <Route path="/agent-profile/:id" element={<AgentProfile />} />
      <Route path="/agency-profile/:id" element={<AgencyProfile />} />
      <Route path="/developer-profile/:id" element={<DeveloperProfile />} />
      <Route path="/franchise-owner-profile/:id" element={<FranchiseOwnerProfile />} />
      <Route path="/create/property" element={<CreateProperty />} />
      <Route path="/create/buy-request" element={<CreateBuyRequest />} />
      <Route path="/create/project" element={<CreateProject />} />
      <Route path="/kemedar/add/property" element={<CreateProperty />} />
      <Route path="/kemedar/add/property/ai" element={<AIPropertySubmission />} />
      <Route path="/kemedar/add/buy-request" element={<CreateBuyRequest />} />
      <Route path="/kemedar/add/project" element={<CreateProject />} />
      <Route path="/kemedar/valuation" element={<ValuationWizard />} />
      <Route path="/kemedar/ai-search" element={<AIPropertySearch />} />
      <Route path="/kemedar/advisor" element={<AdvisorLanding />} />
      <Route path="/kemedar/advisor/survey" element={<AdvisorSurvey />} />
      <Route path="/kemedar/predict" element={<KemedarPredict />} />
      <Route path="/kemedar/property/:id/vision" element={<VisionReport />} />
      <Route path="/kemedar/negotiate/:sessionId" element={<NegotiateDealRoom />} />
      <Route path="/kemedar/advisor/report/:shareToken" element={<AdvisorReportPage />} />
      <Route path="/kemedar/life-score" element={<LifeScore />} />
      <Route path="/kemedar/life-score/:citySlug/:districtSlug" element={<LifeScoreDetail />} />
      <Route path="/kemedar/twin/:propertyId" element={<TwinDashboard />} />
      <Route path="/kemedar/tour/:tourId" element={<VirtualTourViewer />} />
      <Route path="/kemedar/live/:sessionId" element={<LiveTourViewer />} />
      <Route path="/kemedar/verify/:sessionId" element={<VerificationTour />} />
      <Route path="/kemedar/match/setup" element={<MatchSetup />} />
      <Route path="/kemedar/escrow/new" element={<EscrowSetupWizard />} />
      <Route path="/kemedar/escrow/:dealId" element={<EscrowDealRoom />} />
      <Route path="/kemedar/escrow/:dealId/dispute" element={<EscrowDisputeRoom />} />
      <Route path="/kemedar/escrow/:dealId/dispute/:disputeId" element={<EscrowDisputeRoom />} />
      <Route path="/kemedar/match" element={<KemedarMatch />} />
      <Route path="/kemedar/match/seller" element={<SellerMatchHub />} />
      <Route path="/kemedar/match/history" element={<MatchHistory />} />
      <Route path="/kemedar/community" element={<CommunityDiscovery />} />
      <Route path="/kemedar/community/how-it-works" element={<CommunityIntelligence />} />
      <Route path="/kemedar/community/create" element={<CommunityCreate />} />
      <Route path="/kemedar/community/:communityId" element={<CommunityHome />} />
      <Route path="/kemedar/community/:communityId/daily" element={<CommunityDaily />} />
      <Route path="/kemedar/community/:communityId/join" element={<CommunityJoin />} />
      <Route path="/score/:shareToken" element={<ScorePublicView />} />
      <Route path="/kemedar/coach" element={<KemedarCoach />} />
      <Route path="/kemedar/live" element={<KemedarLive />} />
      <Route path="/kemedar/live/event/:eventId" element={<LiveEventDetail />} />
      <Route path="/kemedar/live/watch/:eventId" element={<LiveEventWatch />} />
      <Route path="/kemedar/live/create" element={<LiveCreateEvent />} />
      <Route path="/kemedar/twin-cities" element={<TwinCitiesHub />} />
      <Route path="/kemedar/twin-cities/compare" element={<TwinCitiesCompare />} />
      <Route path="/kemedar/twin-cities/relocate" element={<TwinCitiesRelocate />} />
      <Route path="/kemedar/pricing" element={<PricingPage />} />
      <Route path="/kemedar/predict/landing" element={<PredictLanding />} />
      <Route path="/kemedar/vision/landing" element={<VisionLanding />} />
      <Route path="/kemedar/negotiate/landing" element={<NegotiateLanding />} />
      <Route path="/kemedar/life-score/landing" element={<LifeScoreLanding />} />
      <Route path="/kemedar/twin/landing" element={<TwinLanding />} />
      <Route path="/kemedar/match/landing" element={<MatchLanding />} />
      <Route path="/kemedar/escrow/landing" element={<EscrowLanding />} />
      <Route path="/kemedar/finish/landing" element={<FinishLandingPage />} />
      <Route path="/auctions" element={<AuctionHub />} />
      <Route path="/auctions/how-it-works" element={<HowAuctionsWork />} />
      <Route path="/auctions/:auctionCode" element={<AuctionDetail />} />
      <Route path="/auctions/:auctionCode/payment" element={<WinnerPaymentFlow />} /><Route path="/auctions/:auctionCode/manage" element={<SellerAuctionMonitor />} /><Route path="/auctions/:auctionCode/transfer" element={<AuctionTransfer />} />
      <Route path="/m/auctions" element={<AuctionHub />} />
      <Route path="/kemedar/community/landing" element={<CommunityLanding />} />
      <Route path="/kemedar/coach/landing" element={<CoachLanding />} />
      <Route path="/kemedar/live/landing" element={<LiveLanding />} />
      <Route path="/kemedar/score/landing" element={<ScoreLanding />} />
      <Route path="/kemedar/expat/landing" element={<ExpatLandingPage />} />
      <Route path="/kemedar/rent2own/landing" element={<Rent2OwnLanding />} />
      <Route path="/kemedar/dna/landing" element={<DNALanding />} />
      <Route path="/kemedar/twin-cities/landing" element={<TwinCitiesLanding />} />
      <Route path="/kemetro/flash/landing" element={<FlashLanding />} />
      <Route path="/kemetro/build/landing" element={<BuildLanding />} />
      <Route path="/fo/verify-inspections" element={<FOInspections />} />
      <Route path="/verify/my-property/:propertyId" element={<SellerVerificationWizard />} />
      <Route path="/verify/:tokenId" element={<PublicVerifyCertificate />} />
      <Route path="/deal/:contractId" element={<SmartContractDeal />} />
      <Route path="/kemedar/checkout/:planCode" element={<CheckoutPage />} />
      <Route path="/kemework/pricing" element={<PricingPage />} />
      <Route path="/kemetro/pricing" element={<PricingPage />} />
      <Route path="/kemedar/expat" element={<ExpatLanding />} />
      <Route path="/kemedar/expat/setup" element={<ExpatSetup />} />
      <Route path="/kemedar/expat/dashboard" element={<ExpatDashboard />} />
      <Route path="/kemedar/expat/legal" element={<ExpatLegal />} />
      <Route path="/kemedar/expat/management" element={<ExpatManagement />} />
      <Route path="/kemedar/expat/community" element={<ExpatCommunity />} />
      <Route path="/kemedar/expat/uae" element={<ExpatLanding />} />
      <Route path="/kemedar/expat/ksa" element={<ExpatLanding />} />
      <Route path="/kemedar/expat/uk" element={<ExpatLanding />} />
      <Route path="/kemedar/expat/usa" element={<ExpatLanding />} />
      <Route path="/kemedar/finish" element={<FinishLanding />} />
      <Route path="/kemedar/finish/new" element={<FinishWizard />} />
      <Route path="/kemedar/finish/:projectId" element={<FinishProjectDashboard />} />
      <Route path="/kemedar/finish/:projectId/boq" element={<FinishBOQPage />} />
      <Route path="/kemedar/valuation/report/:id" element={<ValuationReport />} />
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/user-benefits" element={<UserBenefitsHub />} />
      <Route path="/user-benefits/franchise-owner-area" element={<FranchiseOwnerArea />} />
      <Route path="/sitemap" element={<Sitemap />} />

      <Route path="/kemetro" element={<KemetroHome />} />
      <Route path="/kemetro/home" element={<Navigate to="/m/kemetro" replace />} />
      <Route path="/kemetro/category/:slug" element={<KemetroSearchResults />} />
      <Route path="/kemetro/search" element={<KemetroSearchResults />} />
      <Route path="/kemetro/product/:slug" element={<KemetroProductDetail />} />
      <Route path="/kemetro/seller/register" element={<KemetroSellerRegister />} />
      <Route path="/kemetro/seller" element={<KemetroSellerShell />}>
        <Route index element={<StoreOverviewDesktop />} />
        <Route path="dashboard" element={<StoreOverviewDesktop />} />
        <Route path="store-overview" element={<StoreOverviewDesktop />} />
        <Route path="products" element={<ProductsDesktop />} />
        <Route path="products/:id/edit" element={<EditProductDesktop />} />
        <Route path="add-product" element={<AddProductDesktop />} />
        <Route path="orders" element={<OrdersDesktop />} />
        <Route path="shipments" element={<ShipmentsDesktop />} />
        <Route path="analytics" element={<AnalyticsDesktop />} />
        <Route path="earnings" element={<EarningsDesktop />} />
        <Route path="reviews" element={<ReviewsDesktop />} />
        <Route path="settings" element={<StoreSettingsDesktop />} />
        <Route path="shipping" element={<ShippingSettingsDesktop />} />
        <Route path="coupons" element={<CouponsDesktop />} />
        <Route path="promotions" element={<PromotionsDesktop />} />
        <Route path="edit-store" element={<EditStoreDesktop />} />
        <Route path="subscription" element={<KemetroSellerMobileDashboard />} />
        <Route path="support" element={<SupportDesktop />} />
        <Route path="support/:ticketId" element={<SupportDesktop />} />
      </Route>

      <Route path="/kemetro/cart" element={<KemetroCart />} />
      <Route path="/kemetro/checkout" element={<KemetroCheckout />} />
      <Route path="/kemetro/order-success" element={<KemetroOrderSuccess />} />
      <Route path="/kemetro/orders" element={<KemetroOrders />} />
      <Route path="/kemetro/order/:orderId" element={<KemetroOrderDetail />} />
      <Route path="/kemetro/store/:slug" element={<KemetroStoreProfile />} />
      <Route path="/kemetro/admin" element={<KemetroAdminDashboard />} />
      <Route path="/kemetro/seller-benefits" element={<KemetroSellerBenefits />} />
      <Route path="/kemetro/buyer-benefits" element={<KemetroBuyerBenefits />} />
      <Route path="/kemetro/fees" element={<KemetroFees />} />
      <Route path="/kemetro/store-coordinator" element={<KemetroStoreCoordinator />} />
      <Route path="/kemetro/how-it-works" element={<KemetroHowItWorks />} />
      <Route path="/kemetro/about" element={<KemetroAbout />} />
      <Route path="/kemetro/export" element={<KemetroExport />} />
      <Route path="/kemetro/kemecoin" element={<KemetroKemecoin />} />
      <Route path="/kemetro/shipper/register" element={<KemetroShipperRegister />} />
      <Route path="/kemetro/flash" element={<KemetroFlash />} />
      <Route path="/kemetro/flash/deal/:dealId" element={<KemetroFlashDealDetail />} />
      <Route path="/kemetro/flash/compound/:dealId" element={<KemetroFlashCompoundDetail />} />
      <Route path="/kemetro/seller/flash" element={<KemetroFlashSellerDashboard />} />
      <Route path="/kemetro/seller/flash/create" element={<KemetroFlashSellerCreate />} />
      <Route path="/kemetro/kemekits" element={<KemeKitsHub />} />
      <Route path="/kemetro/kemekits/:slug" element={<KemeKitDetail />} />
      <Route path="/kemetro/kemekits/my-calculations" element={<KemeKitsMyCalculations />} />
      <Route path="/kemetro/surplus" element={<SurplusMarketHub />} />
      <Route path="/kemetro/surplus/add" element={<SurplusListingWizard />} />
      <Route path="/kemetro/surplus/my-listings" element={<SurplusMyListings />} />
      <Route path="/kemetro/surplus/my-reservations" element={<SurplusMyReservations />} />
      <Route path="/kemetro/surplus/reservation/:itemId" element={<SurplusReservationScreen />} />
      <Route path="/kemetro/surplus/scan/:itemId" element={<SurplusQRScanner />} />
      <Route path="/kemetro/surplus/:itemId" element={<SurplusItemDetail />} />
      <Route path="/kemetro/build" element={<KemetroBuild />} />
      <Route path="/kemetro/build/new" element={<KemetroBuildWizard />} />
      <Route path="/kemetro/build/my-projects" element={<KemetroBuildMyProjects />} />
      <Route path="/kemetro/build/:projectId/boq" element={<KemetroBuildBOQ />} />
      <Route path="/kemetro/build/:projectId/group-buy" element={<KemetroBuildGroupBuy />} />
      <Route path="/kemetro/shipper/dashboard" element={<KemetroShipperDashboard />} />
      <Route path="/kemetro/track/:shipmentNumber" element={<KemetroTrackShipment />} />
      <Route path="/kemetro/track" element={<KemetroTrackShipment />} />

      <Route path="/KemetroSellerBenefits" element={<KemetroSellerBenefits />} />
      <Route path="/KemetroBuyerBenefits" element={<KemetroBuyerBenefits />} />
      <Route path="/KemetroFees" element={<KemetroFees />} />
      <Route path="/KemetroStoreCoordinator" element={<KemetroStoreCoordinator />} />
      <Route path="/KemetroHowItWorks" element={<KemetroHowItWorks />} />
      <Route path="/KemetroAbout" element={<KemetroAbout />} />
      <Route path="/KemetroExport" element={<KemetroExport />} />
      <Route path="/KemetroKemecoin" element={<KemetroKemecoin />} />
      <Route path="/KemetroShipperRegister" element={<KemetroShipperRegister />} />
      <Route path="/SearchProperties" element={<SearchProperties />} />
      <Route path="/PropertyDetails" element={<PropertyDetails />} />
      <Route path="/FindAgents" element={<FindAgents />} />
      <Route path="/FindAgencies" element={<FindAgencies />} />
      <Route path="/FindDevelopers" element={<FindDevelopers />} />
      <Route path="/FindFranchiseOwners" element={<FindFranchiseOwners />} />
      <Route path="/AgentProfile" element={<AgentProfile />} />
      <Route path="/AgentProfile/:id" element={<AgentProfile />} />
      <Route path="/AgencyProfile" element={<AgencyProfile />} />
      <Route path="/AgencyProfile/:id" element={<AgencyProfile />} />
      <Route path="/DeveloperProfile" element={<DeveloperProfile />} />
      <Route path="/DeveloperProfile/:id" element={<DeveloperProfile />} />
      <Route path="/FranchiseOwnerProfile" element={<FranchiseOwnerProfile />} />
      <Route path="/FranchiseOwnerProfile/:id" element={<FranchiseOwnerProfile />} />
      <Route path="/CreateProperty" element={<CreateProperty />} />
      <Route path="/CreateBuyRequest" element={<CreateBuyRequest />} />
      <Route path="/CreateProject" element={<CreateProject />} />
      <Route path="/Advertise" element={<Advertise />} />
      <Route path="/Careers" element={<Careers />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/About" element={<About />} />
      <Route path="/FranchiseOwnerArea" element={<FranchiseOwnerArea />} />
      <Route path="/KemetroHome" element={<KemetroHome />} />
      <Route path="/KemetroSearchResults" element={<KemetroSearchResults />} />
      <Route path="/KemetroProductDetail" element={<KemetroProductDetail />} />
      <Route path="/KemetroSellerRegister" element={<KemetroSellerRegister />} />
      <Route path="/KemetroSellerDashboard" element={<KemetroSellerDashboard />} />
      <Route path="/KemetroCart" element={<KemetroCart />} />
      <Route path="/KemetroCheckout" element={<KemetroCheckout />} />
      <Route path="/KemetroOrderSuccess" element={<KemetroOrderSuccess />} />
      <Route path="/KemetroOrders" element={<KemetroOrders />} />
      <Route path="/KemetroOrderDetail" element={<KemetroOrderDetail />} />
      <Route path="/KemetroStoreProfile" element={<KemetroStoreProfile />} />
      <Route path="/KemetroAdminDashboard" element={<KemetroAdminDashboard />} />
      <Route path="/KemetroShipperDashboard" element={<KemetroShipperDashboard />} />
      <Route path="/KemetroTrackShipment" element={<KemetroTrackShipment />} />
      <Route path="/KemetroTrackShipment/:shipmentNumber" element={<KemetroTrackShipment />} />
      <Route path="/KemetroStoreProfile/:slug" element={<KemetroStoreProfile />} />
      <Route path="/KemetroOrderDetail/:orderId" element={<KemetroOrderDetail />} />
      <Route path="/KemetroProductDetail/:slug" element={<KemetroProductDetail />} />

      <Route path="/BusinessProfile" element={<DashboardShell />}><Route index element={<BusinessProfile />} /></Route>
      <Route path="/PerformanceStats" element={<DashboardShell />}><Route index element={<PerformanceStats />} /></Route>
      <Route path="/Clients" element={<DashboardShell />}><Route index element={<Clients />} /></Route>
      <Route path="/Appointments" element={<DashboardShell />}><Route index element={<Appointments />} /></Route>
      <Route path="/ManageMyAgents" element={<DashboardShell />}><Route index element={<ManageMyAgents />} /></Route>
      <Route path="/MyProjects" element={<DashboardShell />}><Route index element={<MyProjects />} /></Route>
      <Route path="/ProjectSales" element={<DashboardShell />}><Route index element={<ProjectSales />} /></Route>
      <Route path="/MyProperties" element={<DashboardShell />}><Route index element={<MyProperties />} /></Route>
      <Route path="/Favorites" element={<DashboardShell />}><Route index element={<Favorites />} /></Route>
      <Route path="/CompareProperties" element={<DashboardShell />}><Route index element={<CompareProperties />} /></Route>
      <Route path="/MyBuyRequests" element={<DashboardShell />}><Route index element={<MyBuyRequests />} /></Route>
      <Route path="/SearchBuyRequests" element={<DashboardShell />}><Route index element={<SearchBuyRequests />} /></Route>
      <Route path="/BuyerOrganizer" element={<DashboardShell />}><Route index element={<BuyerOrganizer />} /></Route>
      <Route path="/SellerOrganizer" element={<DashboardShell />}><Route index element={<SellerOrganizer />} /></Route>
      <Route path="/DashboardProfile" element={<DashboardShell />}><Route index element={<DashboardProfile />} /></Route>
      <Route path="/Subscription" element={<DashboardShell />}><Route index element={<Subscription />} /></Route>
      <Route path="/Notifications" element={<DashboardShell />}><Route index element={<DashboardNotifications />} /></Route>

      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/pending" element={<AdminPendingUsers />} />
        <Route path="users/pending-verification" element={<AdminPendingVerification />} />
        <Route path="users/imported" element={<AdminImportedUsers />} />
        <Route path="users/verified" element={<AdminUsers filterStatus="Verified" />} />
        <Route path="users/crm" element={<AdminUsersCRM />} />
        <Route path="users/agents" element={<AdminUsers />} />
        <Route path="users/agencies" element={<AdminUsers />} />
        <Route path="users/developers" element={<AdminUsers />} />
        <Route path="users/franchise-owners" element={<AdminUsers />} />
        <Route path="users/common" element={<AdminUsers />} />
        <Route path="users/admins" element={<AdminUsers />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/crm" element={<AdminContactCRM />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/pending" element={<AdminProjects />} />
        <Route path="projects/featured" element={<AdminProjects />} />
        <Route path="projects/imported" element={<AdminProjects />} />
        <Route path="projects/franchise" element={<AdminProjects />} />
        <Route path="buy-requests" element={<AdminBuyRequests />} />
        <Route path="property-categories" element={<AdminPropertyCategories />} />
        <Route path="property-purposes" element={<AdminPropertyCategories />} />
        <Route path="suitable-for" element={<AdminPropertyCategories />} />
        <Route path="amenities" element={<AdminAmenities />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="distance-fields" element={<AdminDistanceFields />} />
        <Route path="featured/properties" element={<AdminFeatured />} />
        <Route path="featured/projects" element={<AdminFeatured />} />
        <Route path="featured/agents" element={<AdminFeatured />} />
        <Route path="featured/developers" element={<AdminFeatured />} />
        <Route path="featured/agencies" element={<AdminFeatured />} />
        <Route path="recent/properties" element={<AdminPlaceholder />} />
        <Route path="recent/projects" element={<AdminPlaceholder />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="import" element={<AdminImport />} />
        <Route path="scraping" element={<AdminScraping />} />
        <Route path="locations" element={<AdminLocations />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="cache" element={<AdminCache />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="kemework" element={<AdminKemeworkRoutes page="overview" />} />
        <Route path="kemework/snap-fix" element={<AdminKemeworkRoutes page="analytics" />} />
        <Route path="kemework/snap-fix/sessions" element={<AdminKemeworkRoutes page="sessions" />} />
        <Route path="kemework/snap-fix/safety" element={<AdminKemeworkRoutes page="safety" />} />
        <Route path="kemework/snap-fix/settings" element={<AdminKemeworkRoutes page="settings" />} />
        <Route path="kemework/professionals" element={<AdminKemeworkRoutes page="professionals" />} />
        <Route path="kemework/services/pending" element={<AdminKemeworkRoutes page="services_pending" />} />
        <Route path="kemework/services" element={<AdminKemeworkRoutes page="services_pending" />} />
        <Route path="kemework/accreditation" element={<AdminKemeworkRoutes page="accreditation" />} />
        <Route path="kemework/orders" element={<AdminKemeworkRoutes page="orders" />} />
        <Route path="kemework/categories" element={<AdminKemeworkRoutes page="categories" />} />
        <Route path="kemework/plans" element={<AdminKemeworkRoutes page="plans" />} />
        <Route path="kemework/tasks" element={<AdminKemeworkRoutes page="overview" />} />
        <Route path="kemework/revenue" element={<AdminKemeworkRoutes page="overview" />} />
        <Route path="kemework/reviews" element={<AdminKemeworkRoutes page="overview" />} />
        <Route path="modules" element={<AdminModuleControl />} />
        <Route path="modules/:module" element={<AdminModuleControl />} />
        <Route path="kemedar/properties/imported" element={<ImportedPropertiesPage />} />
        <Route path="kemedar/advisor" element={<AdvisorOverview />} />
        <Route path="kemedar/advisor/profiles" element={<AdvisorProfiles />} />
        <Route path="kemedar/advisor/matches" element={<AdvisorMatches />} />
        <Route path="kemedar/advisor/notifications" element={<AdvisorNotifications />} />
        <Route path="kemedar/advisor/analytics" element={<AdvisorAnalytics />} />
        <Route path="kemedar/advisor/settings" element={<AdvisorSettings />} />
        <Route path="kemedar/market-data" element={<AdminMarketData />} />
        <Route path="kemedar/valuations" element={<AdminMarketData />} />
        <Route path="kemedar/finishing-rates" element={<FinishingRatesManager />} />
        <Route path="kemedar/finishing-analytics" element={<FinishingAnalytics />} />
        <Route path="kemedar/match" element={<AdminMatchOverview />} />
        <Route path="kemedar/match/swipes" element={<AdminMatchOverview />} />
        <Route path="kemedar/match/matches" element={<AdminMatchOverview />} />
        <Route path="kemedar/match/config" element={<AdminMatchOverview />} />
        <Route path="kemedar/match/settings" element={<AdminMatchOverview />} />
        <Route path="kemedar/escrow" element={<AdminEscrowOverview />} />
        <Route path="kemedar/escrow/deals" element={<AdminEscrowDeals />} />
        <Route path="kemedar/escrow/disputes" element={<AdminEscrowDisputes />} />
        <Route path="kemedar/escrow/accounts" element={<AdminEscrowAccounts />} />
        <Route path="kemedar/escrow/settings" element={<AdminEscrowSettings />} />
        <Route path="kemedar/community" element={<AdminCommunityOverview />} />
        <Route path="kemedar/community/all" element={<AdminCommunityOverview />} />
        <Route path="kemedar/community/moderation" element={<AdminCommunityOverview />} />
        <Route path="kemedar/community/requests" element={<AdminCommunityOverview />} />
        <Route path="kemedar/community/settings" element={<AdminCommunityOverview />} />
        <Route path="kemedar/score" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/users" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/events" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/badges" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/violations" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/settings" element={<AdminScoreOverview />} />
        <Route path="kemedar/score/architecture" element={<ScoreArchitecture />} />
        <Route path="kemedar/coach" element={<AdminCoachOverview />} />
        <Route path="kemedar/coach/profiles" element={<AdminCoachOverview />} />
        <Route path="kemedar/coach/content" element={<AdminCoachOverview />} />
        <Route path="kemedar/coach/nudges" element={<AdminCoachOverview />} />
        <Route path="kemedar/coach/settings" element={<AdminCoachOverview />} />
        <Route path="kemedar/live" element={<AdminLiveOverview />} />
        <Route path="kemedar/live/events" element={<AdminLiveOverview />} />
        <Route path="kemedar/live/approval" element={<AdminLiveOverview />} />
        <Route path="kemedar/live/hosts" element={<AdminLiveOverview />} />
        <Route path="kemedar/live/settings" element={<AdminLiveOverview />} />
        <Route path="kemedar/dna" element={<AdminDNAOverview />} />
        <Route path="kemedar/dna/users" element={<AdminDNAOverview />} />
        <Route path="kemedar/dna/rules" element={<AdminDNAOverview />} />
        <Route path="kemedar/dna/signals" element={<AdminDNAOverview />} />
        <Route path="kemedar/dna/settings" element={<AdminDNAOverview />} />
        <Route path="kemedar/twin-cities" element={<TwinCitiesAdmin />} />
        <Route path="kemedar/twin-cities/:marketId" element={<TwinCitiesAdmin />} />
        <Route path="kemedar/monetization" element={<MonetizationOverview />} />
        <Route path="kemedar/monetization/plans" element={<MonetizationOverview />} />
        <Route path="kemedar/monetization/subscribers" element={<MonetizationOverview />} />
        <Route path="kemedar/monetization/revenue" element={<MonetizationOverview />} />
        <Route path="kemedar/monetization/promos" element={<MonetizationOverview />} />
        <Route path="kemedar/monetization/settings" element={<MonetizationOverview />} />
        <Route path="kemedar/expat" element={<AdminExpatOverview />} />
        <Route path="kemedar/expat/profiles" element={<AdminExpatOverview />} />
        <Route path="kemedar/expat/management" element={<AdminExpatOverview />} />
        <Route path="kemedar/expat/legal" element={<AdminExpatOverview />} />
        <Route path="kemedar/expat/rates" element={<AdminExpatOverview />} />
        <Route path="kemedar/expat/settings" element={<AdminExpatOverview />} />
        <Route path="kemedar/finish" element={<FinishAdminOverview />} />
        <Route path="kemedar/finish/projects" element={<FinishAdminOverview />} />
        <Route path="kemedar/finish/boq" element={<FinishAdminOverview />} />
        <Route path="kemedar/finish/quality" element={<FinishAdminOverview />} />
        <Route path="kemedar/finish/settings" element={<FinishAdminOverview />} />
        <Route path="kemetro/flash" element={<AdminFlashOverview />} />
        <Route path="kemetro/flash/deals" element={<AdminFlashOverview />} />
        <Route path="kemetro/flash/compounds" element={<AdminFlashOverview />} />
        <Route path="kemetro/flash/signals" element={<AdminFlashOverview />} />
        <Route path="kemetro/flash/settings" element={<AdminFlashOverview />} />
        <Route path="kemetro/kemekits" element={<AdminKemeKitsRoutes page="analytics" />} />
        <Route path="kemetro/kemekits/all" element={<AdminKemeKitsRoutes page="all" />} />
        <Route path="kemetro/kemekits/pending" element={<AdminKemeKitsRoutes page="pending" />} />
        <Route path="kemetro/kemekits/designers" element={<AdminKemeKitsRoutes page="designers" />} />
        <Route path="kemetro/kemekits/settings" element={<AdminKemeKitsRoutes page="settings" />} />
        <Route path="kemetro/surplus" element={<AdminSurplusRoutes page="dashboard" />} />
        <Route path="kemetro/surplus/listings" element={<AdminSurplusRoutes page="listings" />} />
        <Route path="kemetro/surplus/transactions" element={<AdminSurplusRoutes page="transactions" />} />
        <Route path="kemetro/surplus/shipments" element={<AdminSurplusRoutes page="shipments" />} />
        <Route path="kemetro/surplus/eco-leaders" element={<AdminSurplusRoutes page="eco-leaders" />} />
        <Route path="kemetro/surplus/settings" element={<AdminSurplusRoutes page="settings" />} />
        <Route path="kemetro/build" element={<ComingSoon />} />
        <Route path="kemetro/build/projects" element={<ComingSoon />} />
        <Route path="kemetro/build/group-buys" element={<ComingSoon />} />
        <Route path="kemetro/build/settings" element={<ComingSoon />} />
        <Route path="kemedar/twin" element={<TwinOverview />} />
        <Route path="kemedar/twin/tours" element={<TwinOverview />} />
        <Route path="kemedar/twin/sessions" element={<TwinOverview />} />
        <Route path="kemedar/twin/recordings" element={<TwinOverview />} />
        <Route path="kemedar/twin/settings" element={<TwinOverview />} />
        <Route path="kemedar/life-score" element={<LifeScoreOverview />} />
        <Route path="kemedar/life-score/all" element={<LifeScoreAllScores />} />
        <Route path="kemedar/life-score/data" element={<LifeScoreDataManagement />} />
        <Route path="kemedar/life-score/reviews" element={<LifeScoreReviewsAdmin />} />
        <Route path="kemedar/life-score/settings" element={<LifeScoreSettings />} />
        <Route path="permissions" element={<AdminPermissions />} />
        <Route path="permissions/audit" element={<PermissionAuditLog />} />
        <Route path="env-settings" element={<AdminEnvSettings />} />
        <Route path="subscriptions/plans" element={<SubscriptionPlans />} />
        <Route path="subscriptions/services" element={<PaidServices />} />
        <Route path="subscriptions/subscribers" element={<Subscribers />} />
        <Route path="subscriptions/orders" element={<ServiceOrders />} />
        <Route path="subscriptions/invoices" element={<Invoices />} />
        <Route path="subscriptions/commissions" element={<Commissions />} />
        <Route path="subscriptions/analytics" element={<RevenueAnalytics />} />
        <Route path="subscriptions/settings" element={<SubscriptionSettings />} />
        <Route path="kemedar/predict" element={<PredictDashboard />} />
        <Route path="kemedar/predict/signals" element={<PredictSignals />} />
        <Route path="kemedar/predict/predictions" element={<PredictPredictions />} />
        <Route path="kemedar/predict/accuracy" element={<PredictAccuracy />} />
        <Route path="kemedar/predict/settings" element={<PredictSettings />} />
        <Route path="kemedar/negotiate" element={<NegotiateOverview />} />
        <Route path="kemedar/negotiate/settings" element={<NegotiateSettings />} />
        <Route path="kemedar/vision" element={<VisionOverview />} />
        <Route path="kemedar/vision/reports" element={<VisionReports />} />
        <Route path="kemedar/vision/issues" element={<VisionFlaggedIssues />} />
        <Route path="kemedar/vision/staging" element={<VisionStagingJobs />} />
        <Route path="kemedar/vision/settings" element={<VisionSettings />} />
        <Route path="crm" element={<CRMDashboard />} />
        <Route path="crm/contacts" element={<CRMContacts />} />
        <Route path="crm/contacts/new" element={<CRMNewContact />} />
        <Route path="crm/contacts/:id" element={<CRMContactDetail />} />
        <Route path="crm/accounts" element={<CRMAccounts />} />
        <Route path="crm/accounts/:id" element={<CRMAccountDetail />} />
        <Route path="crm/queues/activation" element={<CRMActivationQueue />} />
        <Route path="crm/inbox" element={<CRMInbox />} />
        <Route path="crm/calls" element={<CRMCalls />} />
        <Route path="crm/calls/:id" element={<CRMCallDetail />} />
        <Route path="crm/tasks" element={<CRMTasks />} />
        <Route path="crm/pipelines" element={<CRMPipelines />} />
        <Route path="crm/opportunities/:id" element={<CRMOpportunityDetail />} />
        <Route path="crm/templates" element={<CRMTemplates />} />
        <Route path="crm/automations" element={<CRMAutomations />} />
        <Route path="crm/ai-agents" element={<CRMAIAgents />} />
        <Route path="crm/approvals" element={<CRMApprovals />} />
        <Route path="crm/reports" element={<CRMReports />} />
        <Route path="crm/integrations" element={<CRMIntegrations />} />
        <Route path="crm/settings" element={<CRMSettings />} />
        <Route path="kemedar/kemefrac" element={<KemeFracAdminDashboard />} />
        <Route path="kemedar/kemefrac/offerings" element={<KemeFracOfferings />} />
        <Route path="kemedar/kemefrac/tokenize" element={<KemeFracTokenize />} />
        <Route path="kemedar/kemefrac/investors" element={<KemeFracInvestors />} />
        <Route path="kemedar/kemefrac/kyc" element={<KemeFracKYCReview />} />
        <Route path="kemedar/kemefrac/yield" element={<KemeFracYieldManager />} />
        <Route path="kemedar/kemefrac/settings" element={<KemeFracSettings />} />
        <Route path="kemedar/auctions" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/all" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/pending" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/live" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/transfers" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/deposits" element={<AdminAuctionsRoutes />} /><Route path="kemedar/auctions/settings" element={<AdminAuctionsRoutes />} />
        <Route path="kemedar/verify-pro" element={<VerifyProDashboard />} />
        <Route path="kemedar/verify-pro/tokens" element={<VerifyProTokens />} />
        <Route path="kemedar/verify-pro/documents" element={<VerifyProDocuments />} />
        <Route path="kemedar/verify-pro/inspections" element={<VerifyProInspections />} />
        <Route path="kemedar/verify-pro/fraud" element={<VerifyProFraud />} />
        <Route path="kemedar/verify-pro/certificates" element={<VerifyProCertificates />} />
        <Route path="kemedar/verify-pro/settings" element={<VerifyProSettings />} />
        <Route path="kemedar/concierge" element={<ConciergeAnalytics />} />
        <Route path="kemedar/concierge/templates" element={<ConciergeTemplates />} />
        <Route path="kemedar/concierge/settings" element={<ConciergeSettings />} />
        <Route path="kemetro/shop-the-look" element={<STLAnalytics />} />
        <Route path="kemetro/shop-the-look/images" element={<STLImages />} />
        <Route path="kemetro/shop-the-look/tag" element={<STLManualTag />} />
        <Route path="kemetro/shop-the-look/sponsorships" element={<STLSponsorships />} />
        <Route path="kemetro/shop-the-look/settings" element={<STLSettings />} />
        <Route path="translations" element={<AdminTranslations />} />
        <Route path="kemedar/crm" element={<Navigate to="/admin/crm/contacts" replace />} />
        <Route path="kemedar/crm/pending" element={<Navigate to="/admin/crm/queues/activation" replace />} />
        <Route path="*" element={<AdminDashboard />} />
      </Route>

      <Route path="/coming-soon/:module" element={<ComingSoon />} />

      <Route path="/m" element={<MobileShellV2 />}>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="dashboard/franchise" element={<FranchiseOwnerDashboardHome />} />
        <Route path="kemedar/franchise/dashboard" element={<FranchiseDashboardMobile />} />
        <Route path="kemedar/franchise/area-properties" element={<FranchiseAreaPropertiesMobile />} />
        <Route path="kemedar/franchise/area-projects" element={<FranchiseAreaProjectsMobile />} />
        <Route path="kemedar/franchise/kemework-tasks" element={<FranchiseOwnerKemeworkTasksMobile />} />
        <Route path="kemedar/franchise/kemetro-sellers" element={<FranchiseOwnerKemetroSellersMobile />} />
        <Route path="kemedar/franchise/orders" element={<FranchiseOwnerOrdersMobile />} />
        <Route path="kemedar/franchise/files" element={<FranchiseOwnerFilesMobile />} />
        <Route path="kemedar/franchise/email" element={<FranchiseOwnerEmailMobile />} />
        <Route path="kemedar/franchise/bulk-comms" element={<FranchiseOwnerBulkCommsMobile />} />
        <Route path="kemedar/franchise/biz" element={<BizHomeMobile />} />
        <Route path="kemedar/franchise/biz/leads" element={<BizLeadsMobile />} />
        <Route path="kemedar/franchise/biz/tasks" element={<BizTasksMobile />} />
        <Route path="kemedar/franchise/biz/invoices" element={<BizInvoicesMobile />} />
        <Route path="kemedar/franchise/support" element={<FranchiseOwnerSupportMobile />} />
        <Route path="kemedar/franchise/contact-kemedar" element={<FranchiseOwnerContactKemedarMobile />} />
        <Route path="kemedar/franchise/knowledge" element={<FranchiseOwnerKnowledgeMobile />} />
        <Route path="dashboard/area-overview" element={<FranchiseOwnerDashboardHome />} />
        <Route path="dashboard/area-users" element={<FranchiseAreaUsersMobile />} />
        <Route path="kemedar/franchise/area-users" element={<FranchiseAreaUsersMobile />} />
        <Route path="dashboard/area-properties" element={<FranchiseAreaPropertiesMobile />} />
        <Route path="dashboard/area-projects" element={<FranchiseAreaPropertiesMobile />} />
        <Route path="dashboard/area-buy-requests" element={<FranchiseAreaUsersMobile />} />
        <Route path="dashboard/kemework-tasks" element={<FranchiseOwnerKemeworkTasksMobile />} />
        <Route path="dashboard/kemework-sellers" element={<FranchiseOwnerWallet />} />
        <Route path="dashboard/kemework-products" element={<FranchiseOwnerWallet />} />
        <Route path="dashboard/wallet" element={<FranchiseOwnerWallet />} />
        <Route path="dashboard/favorites" element={<FavoritesPage />} />
        <Route path="dashboard/compare" element={<ComparePropertiesPage />} />
        <Route path="dashboard/my-buy-requests" element={<MyBuyRequestsPage />} />
        <Route path="dashboard/search-requests" element={<SearchBuyRequestsPage />} />
        <Route path="dashboard/kemedar-orders" element={<KemedarOrdersPage />} />
        <Route path="dashboard/knowledge" element={<KnowledgeBasePage />} />
        <Route path="dashboard/knowledge/search" element={<KnowledgeSearchResults />} />
        <Route path="dashboard/knowledge/:articleSlug" element={<KnowledgeArticleDetail />} />
        <Route path="dashboard/contact-kemedar" element={<ContactKemedarPage />} />
        <Route path="dashboard/payment-methods" element={<PaymentMethodsPage />} />
        <Route path="dashboard/invoices" element={<InvoicesPage />} />
        <Route path="dashboard/kemetro-buyer" element={<KemetroBuyerDashboard />} />
        <Route path="dashboard/wishlist" element={<KemetroWishlistPage />} />
        <Route path="dashboard/profile" element={<ProfilePage />} />
        <Route path="dashboard/messages" element={<MessagesPage />} />
        <Route path="messages/:id" element={<MessagesDetailPage />} />
        <Route path="dashboard/notifications" element={<NotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationsDetailPage />} />
        <Route path="dashboard/subscription" element={<SubscriptionPage />} />
        <Route path="dashboard/tickets" element={<TicketsPage />} />
        <Route path="dashboard/tickets/:ticketId" element={<TicketsPage />} />
        <Route path="dashboard/kemework/orders" element={<KemeworkOrdersPage />} />
        <Route path="dashboard/kemework/orders/:id" element={<KemeworkOrderDetailPage />} />
        <Route path="dashboard/kemework/my-tasks" element={<KemeworkTasksPage />} />
        <Route path="dashboard/bookmarks" element={<KemeworkBookmarksPage />} />
        <Route path="dashboard/kemework/bookmarks" element={<KemeworkBookmarksPage />} />
        <Route path="dashboard/kemework-customer" element={<KemeworkCustomerDashboard />} />
        <Route path="dashboard/pro-dashboard" element={<KemeworkProfessionalDashboard />} />
        <Route path="dashboard/company-dashboard" element={<KemeworkFinishingCompanyDashboard />} />
        <Route path="dashboard/kemework-tasks" element={<KemeworkTasksPage />} />
        <Route path="dashboard/seller-dashboard" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-products" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-orders" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-earnings" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-analytics" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-reviews" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-shipments" element={<SellerMobileShell />} />
        <Route path="dashboard/shipping-settings" element={<ShippingSettingsPage />} />
        <Route path="dashboard/seller-promotions" element={<SellerPromotionsPage />} />
        <Route path="dashboard/seller-promotions/add" element={<SellerPromotionsAddPage />} />
        <Route path="dashboard/seller-promotions/:id" element={<SellerPromotionsDetailPage />} />
        <Route path="dashboard/seller-promotions/:id/edit" element={<SellerPromotionsEditPage />} />
        <Route path="dashboard/seller-coupons" element={<SellerCouponsPage />} />
        <Route path="dashboard/seller-coupons/create" element={<SellerCouponsCreatePage />} />
        <Route path="dashboard/seller-coupons/:id/edit" element={<SellerCouponsEditPage />} />
        <Route path="dashboard/seller-products/:id/preview" element={<SellerProductPreviewPage />} />
        <Route path="dashboard/seller-edit-store" element={<SellerEditStoreMobile />} />
        <Route path="dashboard/seller-store-settings" element={<SellerMobileShell />} />
        <Route path="dashboard/seller-products/:id/edit" element={<EditProductMobile />} />
        <Route path="kemework" element={<KemeworkMobileHome />} />
        <Route path="kemework/find" element={<KemeworkMobileFind />} />
        <Route path="kemework/find-professionals" element={<KemeworkMobileFindProfessionals />} />
        <Route path="kemework/browse-services" element={<KemeworkMobileBrowseServices />} />
        <Route path="kemework/tasks" element={<KemeworkBrowseTasksMobile />} />
        <Route path="kemework/post-task" element={<KemeworkMobilePostTask />} />
        <Route path="kemework/task/:slug" element={<KemeworkMobileTaskDetail />} />
        <Route path="kemework/service/:slug" element={<KemeworkMobileServiceDetail />} />
        <Route path="kemework/freelancer/:username" element={<KemeworkMobileFreelancerProfile />} />
        <Route path="kemework/be-accredited" element={<KemeworkPreferredProgramMobile />} />
        <Route path="kemedar/valuation" element={<MobileValuationWizard />} />
        <Route path="kemedar/advisor" element={<AdvisorLanding />} />
        <Route path="kemedar/advisor/survey" element={<AdvisorSurvey />} />
        <Route path="dashboard/advisor-report" element={<AdvisorReportPage />} />
        <Route path="kemedar/ai-search" element={<MobileAIPropertySearch />} />
        <Route path="kemedar/predict" element={<KemedarPredictMobile />} />
        <Route path="kemedar/add/property/ai" element={<MobileAIPropertySubmission />} />
        <Route path="kemedar/life-score" element={<LifeScoreMobile />} />
        <Route path="kemedar/coach" element={<KemedarCoachMobile />} />
        <Route path="kemedar/live" element={<KemedarLiveMobile />} />
        <Route path="dashboard/my-dna" element={<MobileDNAPage />} />
        <Route path="kemedar/pricing" element={<PricingMobilePage />} />
        <Route path="dashboard/subscription" element={<SubscriptionDashboard />} />
        <Route path="kemedar/twin-cities" element={<TwinCitiesMobile />} />
        <Route path="kemedar/twin-cities/compare" element={<TwinCitiesCompare />} />
        <Route path="kemedar/twin-cities/relocate" element={<TwinCitiesRelocate />} />
        <Route path="kemedar/live/event/:eventId" element={<LiveEventDetail />} />
        <Route path="kemedar/live/watch/:eventId" element={<LiveEventWatch />} />
        <Route path="dashboard/valuations" element={<MobileValuationsDashboard />} />
        <Route path="home" element={<MobileHomePage />} />
        <Route path="find" element={<MobileFindPage />} />
        <Route path="find/property" element={<FindPropertyPage />} />
        <Route path="find/filters" element={<MobileSearchFiltersPage />} />
        <Route path="find/project" element={<FindProjectPage />} />
        <Route path="find/product" element={<FindProductPage />} />
        <Route path="find/service" element={<FindServicePage />} />
        <Route path="find/buy-request" element={<FindBuyRequestPage />} />
        <Route path="find/rfq" element={<FindRFQPage />} />
        <Route path="find/agent" element={<FindAgentPage />} />
        <Route path="find/developer" element={<FindDeveloperPage />} />
        <Route path="find/franchise-owner" element={<FindFranchisePage />} />
        <Route path="find/professional" element={<FindProfessionalPage />} />
        <Route path="add" element={<MobileAddPage />} />
        <Route path="add/property" element={<AddPropertyPage />} />
        <Route path="add/project" element={<AddProjectPage />} />
        <Route path="add/buy-request" element={<AddBuyRequestPage />} />
        <Route path="add/request" element={<AddBuyRequestNewPage />} />
        <Route path="add/rfq" element={<AddRFQPage />} />
        <Route path="add/product" element={<AddProductPage />} />
        <Route path="add/service" element={<AddServicePage />} />
        <Route path="add/task" element={<AddTaskPage />} />
        <Route path="buy" element={<MobileBuyPage />} />
        <Route path="account" element={<MobileAccountPage />} />
        <Route path="account/guest" element={<AccountGuest />} />
        <Route path="settings" element={<MobileSettingsPage />} />
        <Route path="dashboard/my-properties" element={<MyPropertiesPage />} />
        <Route path="dashboard/buyer-organizer" element={<BuyerOrganizerPage />} />
        <Route path="dashboard/seller-organizer" element={<SellerOrganizerPage />} />
        <Route path="property/:slug" element={<PropertyDetailPage />} />
        <Route path="project/:slug" element={<ProjectDetailPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="service/:slug" element={<ServiceDetailPage />} />
        <Route path="buy-request/:id" element={<BuyRequestDetailPage />} />
        <Route path="rfq/:id" element={<RFQDetailPage />} />
        <Route path="profile/:username" element={<ProfilePageMobile />} />
        <Route path="kemedar/agent/dashboard" element={<AgentDashboardHome />} />
        <Route path="kemedar/agent/clients" element={<AgentClientsPage />} />
        <Route path="kemedar/agent/appointments" element={<AgentAppointmentsPage />} />
        <Route path="kemedar/agent/analytics" element={<AgentAnalyticsPage />} />
        <Route path="kemedar/agent/business-profile" element={<AgentBusinessProfile />} />
        <Route path="kemedar/agency/dashboard" element={<AgencyDashboardHome />} />
        <Route path="kemedar/agency/my-agents" element={<AgencyMyAgentsPage />} />
        <Route path="kemedar/developer/dashboard" element={<DeveloperDashboardHome />} />
        <Route path="kemedar/developer/projects" element={<DeveloperMyProjectsPage />} />
        <Route path="kemedar/property/:slug" element={<PropertyDetailPage />} />
        <Route path="kemedar/project/:slug" element={<ProjectDetailPage />} />
        <Route path="kemedar/buy-request/:id" element={<BuyRequestDetailPage />} />
        <Route path="kemetro/product/:slug" element={<ProductDetailPage />} />
        <Route path="kemetro/rfq/:id" element={<RFQDetailPage />} />
        <Route path="kemetro" element={<KemetroMobileHome />} />
        <Route path="kemetro/home" element={<KemetroMobileHome />} />
        <Route path="kemetro/search" element={<KemetroMobileSearch />} />
        <Route path="kemetro/cart" element={<KemetroCartPage />} />
        <Route path="kemetro/flash" element={<KemetroFlash />} />
        <Route path="kemetro/flash/deal/:dealId" element={<KemetroFlashDealDetail />} />
        <Route path="kemetro/flash/compound/:dealId" element={<KemetroFlashCompoundDetail />} />
        <Route path="kemetro/seller/flash/create" element={<KemetroFlashSellerCreate />} />
        <Route path="kemetro/kemekits" element={<KemeKitsMobileHub />} />
        <Route path="kemetro/surplus" element={<SurplusMarketHub />} />
        <Route path="kemetro/surplus/my-reservations" element={<SurplusMyReservations />} />
        <Route path="kemetro/surplus/reservation/:itemId" element={<SurplusReservationScreen />} />
        <Route path="kemetro/surplus/:itemId" element={<SurplusItemDetail />} />
        <Route path="kemetro/build" element={<KemetroBuild />} />
        <Route path="kemetro/build/new" element={<KemetroBuildWizard />} />
        <Route path="kemetro/build/my-projects" element={<KemetroBuildMyProjects />} />
        <Route path="kemetro/build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="kemetro/build/:projectId/group-buy" element={<KemetroBuildGroupBuy />} />
        <Route path="kemetro/checkout" element={<KemetroCartPage />} />
        <Route path="kemetro/shipper/dashboard" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/active" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/requests" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/completed" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/earnings" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/payout" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/setup" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/documents" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/shipper/reviews" element={<KemetroShipperMobileDashboard />} />
        <Route path="kemetro/buyer/orders" element={<KemetroOrdersPageV2 />} />
        <Route path="kemetro/buyer/orders/:id" element={<KemetroOrderDetailPageV2 />} />
        <Route path="kemetro/buyer/rfqs" element={<KemetroRFQPage />} />
        <Route path="kemetro/buyer/rfqs/:id" element={<KemetroRFQDetailPage />} />
        <Route path="dashboard/kemetro-orders" element={<KemetroOrdersPageV2 />} />
        <Route path="dashboard/kemetro-orders/:id" element={<KemetroOrderDetailPageV2 />} />
        <Route path="dashboard/rfqs" element={<KemetroRFQPage />} />
        <Route path="dashboard/rfq/:id" element={<KemetroRFQDetailPage />} />
        <Route path="dashboard/cart" element={<KemetroCartPage />} />
        <Route path="dashboard/concierge/:journeyId" element={<ConciergeMobileHub />} />
        <Route path="swap" element={<MobileSwapPage />} />
        <Route path="dashboard/auctions" element={<AuctionsDashboard />} />
      </Route>

      <Route path="/cp/user" element={<CommonUserShell />}>
        <Route index element={<CommonUserHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="compare" element={<CompareProperties />} />
        <Route path="my-buy-requests" element={<MyBuyRequests />} />
        <Route path="search-requests" element={<SearchBuyRequests />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="notifications/:id" element={<NotificationDetailPage />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="messages" element={<FranchiseMessages />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="buyer-organizer" element={<BuyerOrganizer />} />
        <Route path="seller-organizer" element={<SellerOrganizer />} />
        <Route path="kemedar-orders" element={<KemedarOrdersDesktop />} />
        <Route path="kemetro-orders" element={<KemetroOrdersDesktop />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
        <Route path="invoices" element={<InvoicesDesktop />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="settings" element={<SettingsDesktop />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="kyc" element={<KYCDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MyDNA />} />
        <Route path="valuations" element={<ValuationsDashboard />} />
        <Route path="advisor-report" element={<AdvisorReportPage />} />
        <Route path="*" element={<CommonUserHome />} />
      </Route>

      <Route path="/m/cp/user" element={<MobileCommonUserShell />}>
         <Route index element={<CommonUserHome />} />
         <Route path="profile" element={<DashboardProfile />} />
         <Route path="my-properties" element={<MyPropertiesPage />} />
         <Route path="favorites" element={<Favorites />} />
         <Route path="compare" element={<CompareProperties />} />
         <Route path="my-buy-requests" element={<MyBuyRequestsPage />} />
         <Route path="buyer-organizer" element={<BuyerOrganizerPage />} />
         <Route path="seller-organizer" element={<SellerOrganizerPage />} />
         <Route path="subscription" element={<Subscription />} />
         <Route path="notifications" element={<NotificationsPage />} />
         <Route path="notifications/:id" element={<NotificationsDetailPage />} />
         <Route path="tickets" element={<TicketsPage />} />
         <Route path="tickets/:id" element={<TicketsDetailPage />} />
         <Route path="knowledge" element={<KnowledgeBasePage />} />
         <Route path="knowledge/:articleSlug" element={<KnowledgeArticleDetailPage />} />
         <Route path="messages" element={<MessagesPage />} />
         <Route path="wallet" element={<FranchiseWallet />} />
         <Route path="kemedar-orders" element={<KemedarOrdersPage />} />
         <Route path="kemetro-orders" element={<KemetroOrdersPageV2 />} />
         <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
         <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
         <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
         <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
         <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
         <Route path="invoices" element={<InvoicesPage />} />
         <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
         <Route path="settings" element={<SettingsDesktop />} />
         <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
         <Route path="negotiations" element={<NegotiationsDashboard />} />
         <Route path="escrow" element={<EscrowWalletDashboard />} />
         <Route path="kyc" element={<KYCDashboard />} />
         <Route path="score" element={<MyScore />} />
         <Route path="my-dna" element={<MobileDNAPage />} />
         <Route path="valuations" element={<MobileValuationsDashboard />} />
         <Route path="advisor-report" element={<AdvisorReportPage />} />
         <Route path="*" element={<CommonUserHome />} />
      </Route>

      <Route path="/m/cp/agent" element={<MobileAgentShell />}>
        <Route index element={<AgentHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-properties" element={<MyPropertiesPage />} />
        <Route path="my-buy-requests" element={<MyBuyRequestsPage />} />
        <Route path="buyer-organizer" element={<BuyerOrganizerPage />} />
        <Route path="seller-organizer" element={<SellerOrganizerPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="kemedar-orders" element={<KemedarOrdersPage />} />
        <Route path="kemetro-orders" element={<KemetroOrdersPageV2 />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersPage />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationsDetailPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketsDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:articleSlug" element={<KnowledgeArticleDetailPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
        <Route path="settings" element={<AgentSettingsPage />} />
        <Route path="my-projects" element={<AgentMyProjectsPage />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MobileDNAPage />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="live" element={<KemedarLiveMobile />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="*" element={<AgentHome />} />
      </Route>

      <Route path="/m/cp/agency" element={<MobileAgencyShell />}>
        <Route index element={<AgencyHome />} />
        <Route path="find/property" element={<FindPropertyPage />} />
        <Route path="find/filters" element={<MobileSearchFiltersPage />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-agents" element={<ManageMyAgents />} />
        <Route path="my-properties" element={<MyPropertiesPage />} />
        <Route path="my-buy-requests" element={<MyBuyRequestsPage />} />
        <Route path="buyer-organizer" element={<BuyerOrganizerPage />} />
        <Route path="seller-organizer" element={<SellerOrganizerPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="kemedar-orders" element={<KemedarOrdersPage />} />
        <Route path="kemetro-orders" element={<KemetroOrdersPageV2 />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersPage />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationsDetailPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketsDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:articleSlug" element={<KnowledgeArticleDetailPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
        <Route path="settings" element={<AgencySettingsPage />} />
        <Route path="*" element={<AgencyHome />} />
      </Route>

      <Route path="/m/cp/pro" element={<MobileProfessionalShell />}>
        <Route index element={<ProMobileDashboard />} />
        <Route path="profile" element={<ProProfilePage />} />
        <Route path="services" element={<MyServicesPage />} />
        <Route path="orders" element={<ProOrdersPageMobile />} />
        <Route path="bids" element={<MyBidsPageMobile />} />
        <Route path="portfolio" element={<ProPortfolioPage />} />
        <Route path="customers" element={<ProCustomersPage />} />
        <Route path="earnings" element={<ProEarningsPage />} />
        <Route path="accreditation" element={<ProAccreditationPage />} />
        <Route path="subscription" element={<ProSubscriptionPage />} />
        <Route path="invoices" element={<ProInvoicesPage />} />
        <Route path="search-tasks" element={<ProSearchTasksPage />} />
        <Route path="messages" element={<ProMessagesPage />} />
        <Route path="notifications" element={<ProNotificationsPage />} />
        <Route path="settings" element={<ProSettingsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:id" element={<KnowledgeArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="score" element={<MyScore />} />
        <Route path="*" element={<ProDashboardDesktop />} />
      </Route>

      <Route path="/m/cp/company" element={<MobileCompanyShell />}>
        <Route index element={<CompanyMobileHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<CompanyBusinessProfile />} />
        <Route path="performance" element={<CompanyPerformanceMobile />} />
        <Route path="clients" element={<CompanyCustomersPage />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="services" element={<MyServicesPage />} />
        <Route path="orders" element={<ProOrdersPageMobile />} />
        <Route path="bids" element={<MyBidsPageMobile />} />
        <Route path="team" element={<CompanyTeamMembers />} />
        <Route path="customers" element={<CompanyCustomersPage />} />
        <Route path="portfolio" element={<ProPortfolioPage />} />
        <Route path="earnings" element={<ProEarningsPage />} />
        <Route path="invoices" element={<CompanyInvoicesPage />} />
        <Route path="subscription" element={<CompanySubscriptionPage />} />
        <Route path="search-tasks" element={<CompanySearchTasksPage />} />
        <Route path="tasks-in-category" element={<CompanyTasksInCategoryPage />} />
        <Route path="messages" element={<CompanyMessagesPage />} />
        <Route path="notifications" element={<CompanyNotificationsPage />} />
        <Route path="settings" element={<CompanySettingsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:id" element={<KnowledgeArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="*" element={<CompanyMobileHome />} />
      </Route>

      <Route path="/m/cp/franchise" element={<MobileFranchiseShell />}>
        <Route index element={<FranchiseCPMobileDashboard />} />
        <Route path="area-overview" element={<FranchiseOwnerDashboardHome />} />
        <Route path="area-users" element={<FranchiseCPAreaUsers />} />
        <Route path="area-properties" element={<FranchiseCPAreaProperties />} />
        <Route path="area-projects" element={<FranchiseCPAreaProjects />} />
        <Route path="kemework-tasks" element={<FranchiseCPKemeworkTasks />} />
        <Route path="kemetro-sellers" element={<FranchiseCPKemetroSellers />} />
        <Route path="orders" element={<FranchiseCPOrders />} />
        <Route path="support" element={<FranchiseCPSupport />} />
        <Route path="email" element={<FranchiseCPEmail />} />
        <Route path="bulk-comms" element={<FranchiseCPBulkComms />} />
        <Route path="files" element={<FranchiseCPFiles />} />
        <Route path="wallet" element={<FranchiseCPWallet />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MobileDNAPage />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="live" element={<KemedarLiveMobile />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="flash" element={<KemetroFlash />} />
        <Route path="community" element={<CommunityDiscovery />} />
        <Route path="life-score" element={<LifeScoreMobile />} />
        <Route path="expat" element={<ExpatDashboard />} />
        <Route path="*" element={<FranchiseCPMobileDashboard />} />
      </Route>

      <Route path="/m/cp/developer" element={<MobileDeveloperShell />}>
        <Route index element={<DeveloperHome />} />
        <Route path="find/property" element={<FindPropertyPage />} />
        <Route path="find/filters" element={<MobileSearchFiltersPage />} />
        <Route path="favorites" element={<DeveloperFavoritesPage />} />
        <Route path="compare" element={<ComparePropertiesPage />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-properties" element={<MyPropertiesPage />} />
        <Route path="my-projects" element={<DeveloperMyProjectsMobilePage />} />
        <Route path="project-sales" element={<ProjectSales />} />
        <Route path="my-buy-requests" element={<MyBuyRequestsPage />} />
        <Route path="buyer-organizer" element={<BuyerOrganizerPage />} />
        <Route path="seller-organizer" element={<SellerOrganizerPage />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="kemedar-orders" element={<KemedarOrdersPage />} />
        <Route path="kemetro-orders" element={<KemetroOrdersPageV2 />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersPage />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationsDetailPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketsDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
        <Route path="knowledge/:articleSlug" element={<KnowledgeArticleDetailPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarMobilePage />} />
        <Route path="settings" element={<DeveloperSettingsPage />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MobileDNAPage />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="live" element={<KemedarLiveMobile />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="*" element={<DeveloperHome />} />
      </Route>

      <Route path="/cp/agent" element={<AgentShell />}>
        <Route index element={<AgentHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="my-buy-requests" element={<MyBuyRequests />} />
        <Route path="buyer-organizer" element={<AgentBuyerOrganizer />} />
        <Route path="seller-organizer" element={<AgentSellerOrganizer />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="invoices" element={<InvoicesDesktop />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="kemetro-orders" element={<KemetroOrdersDesktop />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="premium-services" element={<PremiumServices />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="kemedar-orders" element={<KemedarOrdersDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
        <Route path="messages" element={<FranchiseMessages />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="notifications/:id" element={<NotificationDetailPage />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<SettingsDesktop />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MyDNA />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="*" element={<AgentHome />} />
      </Route>

      <Route path="/cp/agency" element={<AgencyShell />}>
        <Route index element={<AgencyHome />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-agents" element={<ManageMyAgents />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="my-buy-requests" element={<MyBuyRequests />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="invoices" element={<InvoicesDesktop />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="kemetro-orders" element={<KemetroOrdersDesktop />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="premium-services" element={<PremiumServices />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="kemedar-orders" element={<KemedarOrdersDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
        <Route path="messages" element={<FranchiseMessages />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="notifications/:id" element={<NotificationDetailPage />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<SettingsDesktop />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="*" element={<AgencyHome />} />
      </Route>

      <Route path="/cp/pro" element={<ProfessionalShell />}>
         <Route index element={<ProDashboardDesktop />} />
         <Route path="profile" element={<ProProfilePage />} />
         <Route path="services" element={<MyServicesPage />} />
         <Route path="orders" element={<ProOrdersPage />} />
         <Route path="bids" element={<MyBidsPage />} />
         <Route path="portfolio" element={<ProPortfolioPage />} />
         <Route path="earnings" element={<ProEarningsPage />} />
         <Route path="accreditation" element={<ProAccreditationPage />} />
         <Route path="subscription" element={<ProSubscriptionPage />} />
         <Route path="invoices" element={<ProInvoicesPage />} />
         <Route path="customers" element={<ProCustomersPage />} />
         <Route path="search-tasks" element={<ProSearchTasksPage />} />
         <Route path="tasks-in-category" element={<ProTasksInCategoryPage />} />
         <Route path="messages" element={<ProMessagesPage />} />
         <Route path="notifications" element={<ProNotificationsPage />} />
         <Route path="settings" element={<ProSettingsPage />} />
         <Route path="tickets" element={<TicketsDesktop />} />
         <Route path="tickets/:id" element={<TicketDetailPage />} />
         <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
         <Route path="knowledge/:id" element={<ArticleDetailPage />} />
         <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
         <Route path="build" element={<KemetroBuild />} />
         <Route path="build/new" element={<KemetroBuildWizard />} />
         <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
         <Route path="score" element={<MyScore />} />
         <Route path="*" element={<ProDashboardDesktop />} />
       </Route>

      <Route path="/cp/developer" element={<DeveloperShell />}>
        <Route index element={<DeveloperHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="project-sales" element={<ProjectSales />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="my-buy-requests" element={<MyBuyRequests />} />
        <Route path="buyer-organizer" element={<BuyerOrganizer />} />
        <Route path="seller-organizer" element={<SellerOrganizer />} />
        <Route path="performance" element={<PerformanceStats />} />
        <Route path="invoices" element={<InvoicesDesktop />} />
        <Route path="wallet" element={<FranchiseWallet />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="kemework/my-tasks" element={<KemeworkMyTasksPage />} />
        <Route path="kemework/orders" element={<KemeworkMyOrdersPage />} />
        <Route path="kemework/bookmarks" element={<KemeworkBookmarksDesktop />} />
        <Route path="kemetro-orders" element={<KemetroOrdersDesktop />} />
        <Route path="kemetro-rfqs" element={<KemetroRFQsDesktop />} />
        <Route path="premium-services" element={<PremiumServices />} />
        <Route path="payment-methods" element={<PaymentMethodsDesktop />} />
        <Route path="kemedar-orders" element={<KemedarOrdersDesktop />} />
        <Route path="kemework-orders" element={<KemeworkOrdersDesktop />} />
        <Route path="messages" element={<FranchiseMessages />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="notifications/:id" element={<NotificationDetailPage />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="settings" element={<SettingsDesktop />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="negotiations" element={<NegotiationsDashboard />} />
        <Route path="escrow" element={<EscrowWalletDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="my-dna" element={<MyDNA />} />
        <Route path="vision" element={<VisionReport />} />
        <Route path="live" element={<KemedarLive />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="*" element={<DeveloperHome />} />
      </Route>

      <Route path="/cp/company" element={<FinishingCompanyShell />}>
         <Route index element={<CompanyHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="business-profile" element={<CompanyBusinessProfile />} />
        <Route path="performance" element={<CompanyPerformance />} />
        <Route path="clients" element={<Clients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="services" element={<MyServicesPage />} />
        <Route path="orders" element={<ProOrdersPage />} />
        <Route path="bids" element={<MyBidsPage />} />
        <Route path="team" element={<CompanyTeamMembers />} />
        <Route path="customers" element={<CompanyCustomersPage />} />
        <Route path="portfolio" element={<ProPortfolioPage />} />
        <Route path="earnings" element={<ProEarningsPage />} />
        <Route path="invoices" element={<CompanyInvoicesPage />} />
        <Route path="subscription" element={<CompanySubscriptionPage />} />
        <Route path="search-tasks" element={<CompanySearchTasksPage />} />
        <Route path="tasks-in-category" element={<CompanyTasksInCategoryPage />} />
        <Route path="messages" element={<CompanyMessagesPage />} />
        <Route path="notifications" element={<CompanyNotificationsPage />} />
        <Route path="settings" element={<CompanySettingsPage />} />
        <Route path="tickets" element={<TicketsDesktop />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBaseDesktop />} />
        <Route path="knowledge/:id" element={<ArticleDetailPage />} />
        <Route path="contact-kemedar" element={<ContactKemedarDesktop />} />
        <Route path="build" element={<KemetroBuild />} />
        <Route path="build/new" element={<KemetroBuildWizard />} />
        <Route path="build/:projectId/boq" element={<KemetroBuildBOQ />} />
        <Route path="finish/new" element={<FinishWizard />} />
        <Route path="finish/:projectId" element={<FinishProjectDashboard />} />
        <Route path="score" element={<MyScore />} />
        <Route path="*" element={<CompanyHome />} />
      </Route>

      <Route path="/m/register" element={<RegisterPage />} />
      <Route path="/m/login" element={<LoginPage />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}