import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobilePropertySellerBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Property Owner"
      icon="🏠"
      title="Get the Best Value for Your Property"
      heroColor="from-orange-600 to-orange-700"
      stats={['5 Free Listings', '90 Days Free', '30+ Countries']}
      intro="List your property to millions of global visitors. Upload 24 photos + videos per listing and connect directly with verified buyers."
      advantages={[
        { title: 'Global Reach', description: 'Expose your property to millions of visitors worldwide' },
        { title: 'Free Listing', description: 'List up to 5 properties for 90 days at no cost' },
        { title: 'Rich Media', description: 'Upload 24 images, videos, brochures and floor plans' },
        { title: 'Direct Contact', description: 'Communicate directly with buyers and agents' },
        { title: 'Seller Dashboard', description: 'Manage all properties and track inquiries' },
        { title: 'Market Insights', description: 'Real property valuations based on market data' },
      ]}
      benefits={[
        { icon: '⚡', title: 'List in 5 Minutes', description: 'Our simple 7-step form guides you through everything' },
        { icon: '📊', title: 'Seller Organizer', description: 'Track buyers from interest to closed deal' },
        { icon: '🔍', title: 'Buy Request Matching', description: 'Get matched with active buyers looking for your property' },
        { icon: '📱', title: 'Mobile App', description: 'Manage listings and respond to inquiries on the go' },
        { icon: '🔧', title: 'Handyman Access', description: 'Find verified professionals for finishing tasks' },
        { icon: '🛒', title: 'Kemetro Products', description: 'Buy building materials from thousands of suppliers' },
      ]}
      howItWorks={[
        { title: 'Create Account', description: 'Register free in 2 minutes — no credit card needed' },
        { title: 'Add Your Property', description: 'Complete our guided form in under 5 minutes' },
        { title: 'Get Contacted', description: 'Buyers contact you directly via phone, WhatsApp or chat' },
        { title: 'Close the Deal', description: 'Use our Kanban organizer to track and close deals' },
      ]}
      ctaText="List Your Property Free →"
    />
  );
}