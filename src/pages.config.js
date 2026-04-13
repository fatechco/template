/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import Advertise from './pages/Advertise';
import AgencyProfile from './pages/AgencyProfile';
import AgentProfile from './pages/AgentProfile';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import CreateBuyRequest from './pages/CreateBuyRequest';
import CreateProject from './pages/CreateProject';
import CreateProperty from './pages/CreateProperty';
import Dashboard from './pages/Dashboard';
import DeveloperProfile from './pages/DeveloperProfile';
import FindAgencies from './pages/FindAgencies';
import FindAgents from './pages/FindAgents';
import FindDevelopers from './pages/FindDevelopers';
import FindFranchiseOwners from './pages/FindFranchiseOwners';
import FranchiseOwnerArea from './pages/FranchiseOwnerArea';
import FranchiseOwnerProfile from './pages/FranchiseOwnerProfile';
import Home from './pages/Home';
import KemetroAbout from './pages/KemetroAbout';
import KemetroAdminDashboard from './pages/KemetroAdminDashboard';
import KemetroBuyerBenefits from './pages/KemetroBuyerBenefits';
import KemetroCart from './pages/KemetroCart';
import KemetroCheckout from './pages/KemetroCheckout';
import KemetroExport from './pages/KemetroExport';
import KemetroFees from './pages/KemetroFees';
import KemetroHome from './pages/KemetroHome';
import KemetroHowItWorks from './pages/KemetroHowItWorks';
import KemetroKemecoin from './pages/KemetroKemecoin';
import KemetroOrderDetail from './pages/KemetroOrderDetail';
import KemetroOrderSuccess from './pages/KemetroOrderSuccess';
import KemetroOrders from './pages/KemetroOrders';
import KemetroProductDetail from './pages/KemetroProductDetail';
import KemetroSearchResults from './pages/KemetroSearchResults';
import KemetroSellerBenefits from './pages/KemetroSellerBenefits';
import KemetroSellerDashboard from './pages/KemetroSellerDashboard';
import KemetroSellerRegister from './pages/KemetroSellerRegister';
import KemetroShipperDashboard from './pages/KemetroShipperDashboard';
import KemetroShipperRegister from './pages/KemetroShipperRegister';
import KemetroStoreCoordinator from './pages/KemetroStoreCoordinator';
import KemetroStoreProfile from './pages/KemetroStoreProfile';
import KemetroTrackShipment from './pages/KemetroTrackShipment';
import PropertyDetails from './pages/PropertyDetails';
import SearchProjects from './pages/SearchProjects';
import SearchProperties from './pages/SearchProperties';
import Terms from './pages/Terms';
import AdminAmenities from './pages/AdminAmenities';
import AdminBuyRequests from './pages/AdminBuyRequests';
import AdminCache from './pages/AdminCache';
import AdminContactCRM from './pages/AdminContactCRM';
import AdminDashboard from './pages/AdminDashboard';
import AdminFeatured from './pages/AdminFeatured';
import AdminImport from './pages/AdminImport';
import AdminLocations from './pages/AdminLocations';
import AdminMedia from './pages/AdminMedia';
import AdminNotifications from './pages/AdminNotifications';
import AdminPendingUsers from './pages/AdminPendingUsers';
import AdminPlaceholder from './pages/AdminPlaceholder';
import AdminProperties from './pages/AdminProperties';
import AdminPropertyCategories from './pages/AdminPropertyCategories';
import AdminReports from './pages/AdminReports';
import AdminRoles from './pages/AdminRoles';
import AdminTags from './pages/AdminTags';
import AdminUsers from './pages/AdminUsers';
import Appointments from './pages/Appointments';
import AreaProperties from './pages/AreaProperties';
import AreaUsers from './pages/AreaUsers';
import BusinessProfile from './pages/BusinessProfile';
import BuyerOrganizer from './pages/BuyerOrganizer';
import Clients from './pages/Clients';
import CompareProperties from './pages/CompareProperties';
import DashboardProfile from './pages/DashboardProfile';
import Favorites from './pages/Favorites';
import FindHandyman from './pages/FindHandyman';
import FranchiseBizSetup from './pages/FranchiseBizSetup';
import FranchiseContactKemedar from './pages/FranchiseContactKemedar';
import FranchiseDashboard from './pages/FranchiseDashboard';
import FranchiseKnowledgeBase from './pages/FranchiseKnowledgeBase';
import FranchiseLeads from './pages/FranchiseLeads';
import FranchiseMessages from './pages/FranchiseMessages';
import FranchiseTickets from './pages/FranchiseTickets';
import FranchiseWallet from './pages/FranchiseWallet';
import KemetroSellers from './pages/KemetroSellers';
import KemeworkDashboard from './pages/KemeworkDashboard';
import ManageMyAgents from './pages/ManageMyAgents';
import MyBuyRequests from './pages/MyBuyRequests';
import MyProjects from './pages/MyProjects';
import MyProperties from './pages/MyProperties';
import Notifications from './pages/Notifications';
import PerformanceStats from './pages/PerformanceStats';
import ProjectSales from './pages/ProjectSales';
import SearchBuyRequests from './pages/SearchBuyRequests';
import SellerOrganizer from './pages/SellerOrganizer';
import Subscription from './pages/Subscription';
import AddBuyRequestNewPage from './pages/AddBuyRequestNewPage';
import AddBuyRequestPage from './pages/AddBuyRequestPage';
import AddProductPage from './pages/AddProductPage';
import AddProjectPage from './pages/AddProjectPage';
import AddPropertyPage from './pages/AddPropertyPage';
import AddRFQPage from './pages/AddRFQPage';
import AddServicePage from './pages/AddServicePage';
import AddTaskPage from './pages/AddTaskPage';
import BuyRequestDetailPage from './pages/BuyRequestDetailPage';
import BuyerOrganizerPage from './pages/BuyerOrganizerPage';
import DashboardHome from './pages/DashboardHome';
import FindAgentPage from './pages/FindAgentPage';
import FindBuyRequestPage from './pages/FindBuyRequestPage';
import FindDeveloperPage from './pages/FindDeveloperPage';
import FindFranchisePage from './pages/FindFranchisePage';
import FindProductPage from './pages/FindProductPage';
import FindProfessionalPage from './pages/FindProfessionalPage';
import FindProjectPage from './pages/FindProjectPage';
import FindPropertyPage from './pages/FindPropertyPage';
import FindRFQPage from './pages/FindRFQPage';
import FindServicePage from './pages/FindServicePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import MobileAccountPage from './pages/MobileAccountPage';
import MobileAddPage from './pages/MobileAddPage';
import MobileBuyPage from './pages/MobileBuyPage';
import MobileFindPage from './pages/MobileFindPage';
import MobileHomePage from './pages/MobileHomePage';
import MobileRoot from './pages/MobileRoot';
import MobileSettingsPage from './pages/MobileSettingsPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import RFQDetailPage from './pages/RFQDetailPage';
import RegisterPage from './pages/RegisterPage';
import SellerOrganizerPage from './pages/SellerOrganizerPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AgentDashboardHome from './pages/AgentDashboardHome';
import AgentBusinessProfile from './pages/AgentBusinessProfile';
import AgentClientsPage from './pages/AgentClientsPage';
import AgentAppointmentsPage from './pages/AgentAppointmentsPage';
import AgentAnalyticsPage from './pages/AgentAnalyticsPage';
import AgencyDashboardHome from './pages/AgencyDashboardHome';
import AgencyMyAgentsPage from './pages/AgencyMyAgentsPage';
import DeveloperDashboardHome from './pages/DeveloperDashboardHome';
import DeveloperMyProjectsPage from './pages/DeveloperMyProjectsPage';
import MobileAccount from './pages/MobileAccount';
import MobileAddBuyRequest from './pages/MobileAddBuyRequest';
import MobileAddProject from './pages/MobileAddProject';
import MobileAddProperty from './pages/MobileAddProperty';
import MobileBuy from './pages/MobileBuy';
import MobileFind from './pages/MobileFind';
import MobileKemedarHome from './pages/MobileKemedarHome';
import MobileNotifications from './pages/MobileNotifications';
import MobilePlaceholder from './pages/MobilePlaceholder';
import MobileSettings from './pages/MobileSettings';
import FranchiseOwnerDashboardHome from './pages/FranchiseOwnerDashboardHome';
import FranchiseOwnerAreaUsers from './pages/FranchiseOwnerAreaUsers';


export const PAGES = {
    "About": About,
    "Advertise": Advertise,
    "AgencyProfile": AgencyProfile,
    "AgentProfile": AgentProfile,
    "Careers": Careers,
    "Contact": Contact,
    "CreateBuyRequest": CreateBuyRequest,
    "CreateProject": CreateProject,
    "CreateProperty": CreateProperty,
    "Dashboard": Dashboard,
    "DeveloperProfile": DeveloperProfile,
    "FindAgencies": FindAgencies,
    "FindAgents": FindAgents,
    "FindDevelopers": FindDevelopers,
    "FindFranchiseOwners": FindFranchiseOwners,
    "FranchiseOwnerArea": FranchiseOwnerArea,
    "FranchiseOwnerProfile": FranchiseOwnerProfile,
    "Home": Home,
    "KemetroAbout": KemetroAbout,
    "KemetroAdminDashboard": KemetroAdminDashboard,
    "KemetroBuyerBenefits": KemetroBuyerBenefits,
    "KemetroCart": KemetroCart,
    "KemetroCheckout": KemetroCheckout,
    "KemetroExport": KemetroExport,
    "KemetroFees": KemetroFees,
    "KemetroHome": KemetroHome,
    "KemetroHowItWorks": KemetroHowItWorks,
    "KemetroKemecoin": KemetroKemecoin,
    "KemetroOrderDetail": KemetroOrderDetail,
    "KemetroOrderSuccess": KemetroOrderSuccess,
    "KemetroOrders": KemetroOrders,
    "KemetroProductDetail": KemetroProductDetail,
    "KemetroSearchResults": KemetroSearchResults,
    "KemetroSellerBenefits": KemetroSellerBenefits,
    "KemetroSellerDashboard": KemetroSellerDashboard,
    "KemetroSellerRegister": KemetroSellerRegister,
    "KemetroShipperDashboard": KemetroShipperDashboard,
    "KemetroShipperRegister": KemetroShipperRegister,
    "KemetroStoreCoordinator": KemetroStoreCoordinator,
    "KemetroStoreProfile": KemetroStoreProfile,
    "KemetroTrackShipment": KemetroTrackShipment,
    "PropertyDetails": PropertyDetails,
    "SearchProjects": SearchProjects,
    "SearchProperties": SearchProperties,
    "Terms": Terms,
    "AdminAmenities": AdminAmenities,
    "AdminBuyRequests": AdminBuyRequests,
    "AdminCache": AdminCache,
    "AdminContactCRM": AdminContactCRM,
    "AdminDashboard": AdminDashboard,
    "AdminFeatured": AdminFeatured,
    "AdminImport": AdminImport,
    "AdminLocations": AdminLocations,
    "AdminMedia": AdminMedia,
    "AdminNotifications": AdminNotifications,
    "AdminPendingUsers": AdminPendingUsers,
    "AdminPlaceholder": AdminPlaceholder,
    "AdminProperties": AdminProperties,
    "AdminPropertyCategories": AdminPropertyCategories,
    "AdminReports": AdminReports,
    "AdminRoles": AdminRoles,
    "AdminTags": AdminTags,
    "AdminUsers": AdminUsers,
    "Appointments": Appointments,
    "AreaProperties": AreaProperties,
    "AreaUsers": AreaUsers,
    "BusinessProfile": BusinessProfile,
    "BuyerOrganizer": BuyerOrganizer,
    "Clients": Clients,
    "CompareProperties": CompareProperties,
    "DashboardProfile": DashboardProfile,
    "Favorites": Favorites,
    "FindHandyman": FindHandyman,
    "FranchiseBizSetup": FranchiseBizSetup,
    "FranchiseContactKemedar": FranchiseContactKemedar,
    "FranchiseDashboard": FranchiseDashboard,
    "FranchiseKnowledgeBase": FranchiseKnowledgeBase,
    "FranchiseLeads": FranchiseLeads,
    "FranchiseMessages": FranchiseMessages,
    "FranchiseTickets": FranchiseTickets,
    "FranchiseWallet": FranchiseWallet,
    "KemetroSellers": KemetroSellers,
    "KemeworkDashboard": KemeworkDashboard,
    "ManageMyAgents": ManageMyAgents,
    "MyBuyRequests": MyBuyRequests,
    "MyProjects": MyProjects,
    "MyProperties": MyProperties,
    "Notifications": Notifications,
    "PerformanceStats": PerformanceStats,
    "ProjectSales": ProjectSales,
    "SearchBuyRequests": SearchBuyRequests,
    "SellerOrganizer": SellerOrganizer,
    "Subscription": Subscription,
    "AddBuyRequestNewPage": AddBuyRequestNewPage,
    "AddBuyRequestPage": AddBuyRequestPage,
    "AddProductPage": AddProductPage,
    "AddProjectPage": AddProjectPage,
    "AddPropertyPage": AddPropertyPage,
    "AddRFQPage": AddRFQPage,
    "AddServicePage": AddServicePage,
    "AddTaskPage": AddTaskPage,
    "BuyRequestDetailPage": BuyRequestDetailPage,
    "BuyerOrganizerPage": BuyerOrganizerPage,
    "DashboardHome": DashboardHome,
    "FindAgentPage": FindAgentPage,
    "FindBuyRequestPage": FindBuyRequestPage,
    "FindDeveloperPage": FindDeveloperPage,
    "FindFranchisePage": FindFranchisePage,
    "FindProductPage": FindProductPage,
    "FindProfessionalPage": FindProfessionalPage,
    "FindProjectPage": FindProjectPage,
    "FindPropertyPage": FindPropertyPage,
    "FindRFQPage": FindRFQPage,
    "FindServicePage": FindServicePage,
    "ForgotPasswordPage": ForgotPasswordPage,
    "LoginPage": LoginPage,
    "MobileAccountPage": MobileAccountPage,
    "MobileAddPage": MobileAddPage,
    "MobileBuyPage": MobileBuyPage,
    "MobileFindPage": MobileFindPage,
    "MobileHomePage": MobileHomePage,
    "MobileRoot": MobileRoot,
    "MobileSettingsPage": MobileSettingsPage,
    "MyPropertiesPage": MyPropertiesPage,
    "ProductDetailPage": ProductDetailPage,
    "ProfilePage": ProfilePage,
    "ProjectDetailPage": ProjectDetailPage,
    "PropertyDetailPage": PropertyDetailPage,
    "RFQDetailPage": RFQDetailPage,
    "RegisterPage": RegisterPage,
    "SellerOrganizerPage": SellerOrganizerPage,
    "ServiceDetailPage": ServiceDetailPage,
    "AgentDashboardHome": AgentDashboardHome,
    "AgentBusinessProfile": AgentBusinessProfile,
    "AgentClientsPage": AgentClientsPage,
    "AgentAppointmentsPage": AgentAppointmentsPage,
    "AgentAnalyticsPage": AgentAnalyticsPage,
    "AgencyDashboardHome": AgencyDashboardHome,
    "AgencyMyAgentsPage": AgencyMyAgentsPage,
    "DeveloperDashboardHome": DeveloperDashboardHome,
    "DeveloperMyProjectsPage": DeveloperMyProjectsPage,
    "MobileAccount": MobileAccount,
    "MobileAddBuyRequest": MobileAddBuyRequest,
    "MobileAddProject": MobileAddProject,
    "MobileAddProperty": MobileAddProperty,
    "MobileBuy": MobileBuy,
    "MobileFind": MobileFind,
    "MobileKemedarHome": MobileKemedarHome,
    "MobileNotifications": MobileNotifications,
    "MobilePlaceholder": MobilePlaceholder,
    "MobileSettings": MobileSettings,
    "FranchiseOwnerDashboardHome": FranchiseOwnerDashboardHome,
    "FranchiseOwnerAreaUsers": FranchiseOwnerAreaUsers,
}

export const pagesConfig = {
    mainPage: "About",
    Pages: PAGES,
};