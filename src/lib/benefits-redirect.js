import { isMobileSession, toMobilePath } from './mobile-detect';

export const getBenefitsPath = (benefitType) => {
  const basePath = `/user-benefits/${benefitType}`;
  if (isMobileSession()) {
    return toMobilePath(basePath);
  }
  return basePath;
};

export const mapDesktopToMobileBenefitsPath = (desktopPath) => {
  if (desktopPath.startsWith('/user-benefits/')) {
    return desktopPath.replace('/user-benefits/', '/m/benefits/');
  }
  return desktopPath;
};

export const mapMobileToDesktopBenefitsPath = (mobilePath) => {
  if (mobilePath.startsWith('/m/benefits/')) {
    return mobilePath.replace('/m/benefits/', '/user-benefits/');
  }
  return mobilePath;
};