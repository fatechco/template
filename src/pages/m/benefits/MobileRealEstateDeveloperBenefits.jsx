import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileRealEstateDeveloperBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Real Estate Developer"
      icon="🏗"
      title="Successful Marketing Strategies"
      heroColor="from-slate-800 to-slate-900"
      stats={['Unlimited Listings', 'Project Sites', 'Campaign Tools']}
      intro="Unlimited properties and projects with dedicated project websites, verification services, built-in marketing campaigns, and international investor reach."
      advantages={[
        { title: 'Free Registration', description: 'Begin with a free account to explore' },
        { title: 'Unlimited Listings', description: 'No limits on properties or projects' },
        { title: 'Rich Media', description: '24+ photos, videos, brochures per property' },
        { title: 'Dedicated Sites', description: 'Company website with custom domain' },
        { title: 'Project Management', description: 'Unlimited projects with dedicated pages' },
        { title: 'Verification Included', description: 'KEMEDAR® Veri badge included in plans' },
      ]}
      benefits={[
        { icon: '🏢', title: 'Company Website', description: 'Professional site with custom domain' },
        { icon: '🏗', title: 'Project Sites', description: 'Dedicated pages for each development' },
        { icon: '📊', title: 'Dashboard', description: 'Monitor all projects and sales' },
        { icon: '📢', title: 'Campaign Tools', description: 'Built-in marketing and promotion' },
        { icon: '⚡', title: 'Up Service', description: 'Boost property and project visibility' },
        { icon: '🌍', title: 'Global Reach', description: 'Access international investor network' },
      ]}
      plans={[
        {
          name: 'Starter',
          price: '$300/mo',
          features: ['Unlimited properties', 'Campaign tools', 'Basic analytics'],
          buttonText: 'Subscribe',
        },
        {
          name: 'Business',
          price: '$500/mo',
          features: ['All features', 'Advanced analytics', 'Priority support'],
          buttonText: 'Subscribe',
        },
        {
          name: 'Professional',
          price: '$1,000/mo',
          features: ['Everything', 'VIP support', 'Custom features'],
          buttonText: 'Subscribe',
        },
      ]}
      paidServices={[
        {
          icon: '✅',
          title: 'Company Verification',
          description: 'Official certification increases buyer trust significantly',
          price: 'Custom',
          buttonText: 'Learn More →',
        },
      ]}
      howItWorks={[
        { title: 'Create Account', description: 'Register free and explore the platform' },
        { title: 'Add Projects', description: 'Upload project details, photos and documents' },
        { title: 'Create Sites', description: 'Generate dedicated project websites' },
        { title: 'Launch Campaigns', description: 'Use built-in tools to market to buyers' },
      ]}
      ctaText="Register as Developer →"
    />
  );
}