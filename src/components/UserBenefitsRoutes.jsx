import { Route } from 'react-router-dom';
import PropertySellerBenefits from '@/pages/UserBenefits/PropertySellerBenefits';
import PropertyBuyerBenefits from '@/pages/UserBenefits/PropertyBuyerBenefits';
import RealEstateAgentBenefits from '@/pages/UserBenefits/RealEstateAgentBenefits';
import RealEstateDeveloperBenefits from '@/pages/UserBenefits/RealEstateDeveloperBenefits';
import InvestorBenefits from '@/pages/UserBenefits/InvestorBenefits';
import HandymanBenefits from '@/pages/UserBenefits/HandymanBenefits';
import ProductSellerBenefits from '@/pages/UserBenefits/ProductSellerBenefits';
import ProductBuyerBenefits from '@/pages/UserBenefits/ProductBuyerBenefits';
import FranchiseOwnerAreaBenefits from '@/pages/UserBenefits/FranchiseOwnerAreaBenefits';

export default function UserBenefitsRoutes() {
  return (
    <>
      <Route path="/user-benefits/property-seller" element={<PropertySellerBenefits />} />
      <Route path="/user-benefits/property-buyer" element={<PropertyBuyerBenefits />} />
      <Route path="/user-benefits/real-estate-agent" element={<RealEstateAgentBenefits />} />
      <Route path="/user-benefits/real-estate-developer" element={<RealEstateDeveloperBenefits />} />
      <Route path="/user-benefits/investor" element={<InvestorBenefits />} />
      <Route path="/user-benefits/handyman-or-technician" element={<HandymanBenefits />} />
      <Route path="/user-benefits/product-seller" element={<ProductSellerBenefits />} />
      <Route path="/user-benefits/product-buyer" element={<ProductBuyerBenefits />} />
      <Route path="/user-benefits/franchise-owner" element={<FranchiseOwnerAreaBenefits />} />
    </>
  );
}