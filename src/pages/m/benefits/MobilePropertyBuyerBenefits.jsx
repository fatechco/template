import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobilePropertyBuyerBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Property Buyer"
      icon="🔍"
      title="Find Your Ideal Property"
      heroColor="from-blue-600 to-blue-700"
      stats={['110+ Filters', 'Free Access', '1M+ Properties']}
      intro="Search with over 110 precise criteria through hundreds of thousands of properties. Post buying requests and get offers from motivated sellers."
      advantages={[
        { title: 'Advanced Search', description: 'Over 110 precise filters to find your perfect property' },
        { title: 'Direct Contact', description: 'Connect with owners, agents and developers' },
        { title: 'Large Database', description: 'One of the largest real estate databases globally' },
        { title: 'Post Requests', description: 'Submit requirements and receive tailored offers' },
        { title: 'Price Alerts', description: 'Save favorites and get notified when prices drop' },
        { title: 'Comparison Tool', description: 'Compare multiple properties side-by-side' },
      ]}
      benefits={[
        { icon: '🔍', title: '110+ Search Filters', description: 'Find properties matching your exact criteria' },
        { icon: '👥', title: 'Direct Seller Contact', description: 'Connect via chat, WhatsApp or phone' },
        { icon: '📋', title: 'Post Buying Requests', description: 'Submit requirements and get offers from sellers' },
        { icon: '⭐', title: 'Property Comparison', description: 'Compare features, location and price side-by-side' },
        { icon: '🔔', title: 'Price Alerts', description: 'Get notified when prices drop on saved properties' },
        { icon: '✅', title: 'Verified Listings', description: 'Identify verified properties with official documentation' },
      ]}
      howItWorks={[
        { title: 'Search Carefully', description: 'Use 110+ filters and create a shortlist of favorites' },
        { title: 'Communicate', description: 'Engage with sellers through chat or phone calls' },
        { title: 'Verify Info', description: 'Use legal advisors or Kemedar verification services' },
        { title: 'Secure Purchase', description: 'Finalize with professional legal assistance' },
      ]}
      ctaText="Start Searching Free →"
    />
  );
}