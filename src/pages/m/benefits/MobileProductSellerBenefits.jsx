import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileProductSellerBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Product Seller (Store)"
      icon="🏪"
      title="Multiply Your Sales"
      heroColor="from-blue-600 to-blue-700"
      stats={['$0 to Start', '2.5M+ Buyers', '30+ Countries']}
      intro="Create your digital store in minutes and reach thousands of daily visitors. Only pay a small fee after your first $12,000 in sales."
      advantages={[
        { title: 'Free Registration', description: 'No upfront fees to list products' },
        { title: 'Large Audience', description: '2.5M+ potential buyers visiting daily' },
        { title: 'Easy Setup', description: 'Create store in under 20 minutes' },
        { title: 'Secure Payments', description: 'All modern payment methods supported' },
        { title: 'Shipping Tools', description: 'Integrated logistics partners with tracking' },
        { title: 'Export Ready', description: 'Ship to 30+ countries easily' },
      ]}
      benefits={[
        { icon: '🏪', title: 'Digital E-Store', description: 'Professional store design in minutes' },
        { icon: '📊', title: 'Control Panel', description: 'Monitor sales, orders and inventory' },
        { icon: '🚚', title: 'Shipping Partners', description: 'Diverse logistics with live tracking' },
        { icon: '💳', title: 'Secure Payments', description: 'Multiple payment methods supported' },
        { icon: '🌐', title: 'Global Reach', description: 'Export to 30+ countries' },
        { icon: '📱', title: 'Mobile Responsive', description: 'Works perfectly on all devices' },
      ]}
      plans={[
        {
          name: 'Free',
          price: '$0',
          features: ['5 products', 'Basic store', 'Email support'],
          buttonText: 'Get Started',
        },
        {
          name: 'Basic',
          price: '$30/mo',
          features: ['25 products', 'Marketing tools', 'Priority support'],
          buttonText: 'Subscribe',
        },
        {
          name: 'Professional',
          price: '$80/mo',
          features: ['100 products', 'All features', 'VIP support'],
          buttonText: 'Subscribe',
        },
      ]}
      paidServices={[
        {
          icon: '✅',
          title: 'Company Verification',
          description: 'Official verification badge builds trust with buyers',
          price: 'Custom',
          buttonText: 'Learn More →',
        },
      ]}
      howItWorks={[
        { title: 'Create Store', description: 'Register and set up your digital store' },
        { title: 'Add Products', description: 'Upload photos, descriptions and prices' },
        { title: 'Start Selling', description: 'Begin receiving orders immediately' },
        { title: 'Manage & Grow', description: 'Use analytics and tools to expand' },
      ]}
      ctaText="Open Your Store Free →"
    />
  );
}