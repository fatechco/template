import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileRealEstateAgentBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Real Estate Agent"
      icon="🤝"
      title="Grow Your Business"
      heroColor="from-teal-600 to-teal-700"
      stats={['1,000 Listings', 'CRM + ERP', 'Verified Badge']}
      intro="Maximize performance with comprehensive tools — list up to 1,000 properties, manage clients with integrated CRM, and get a dedicated company website."
      advantages={[
        { title: 'Free Registration', description: 'Start using basic features at no cost' },
        { title: 'Extensive Listings', description: 'Up to 1,000 properties in paid plans' },
        { title: 'Dedicated Website', description: 'Company website with custom domain' },
        { title: 'CRM & ERP', description: 'Full systems to manage operations and clients' },
        { title: 'Project Management', description: 'Add and manage up to 20 development projects' },
        { title: 'Verified Agent Badge', description: 'Build trust with certification badge' },
      ]}
      benefits={[
        { icon: '🌍', title: 'Global Exposure', description: 'Access millions of buyers from 30+ countries' },
        { icon: '✅', title: 'Verified Badge', description: 'Official agent certification builds client trust' },
        { icon: '📊', title: 'Agent Dashboard', description: 'Comprehensive control panel for all operations' },
        { icon: '👥', title: 'Client CRM', description: 'Track and manage all client relationships' },
        { icon: '📅', title: 'Appointments', description: 'Schedule and manage property viewings' },
        { icon: '📈', title: 'Analytics', description: 'Advanced performance tracking and ROI metrics' },
      ]}
      plans={[
        {
          name: 'Free',
          price: '$0',
          features: ['3 properties', 'Basic profile', 'Email support'],
          buttonText: 'Get Started',
        },
        {
          name: 'Starter',
          price: '$20/mo',
          features: ['30 properties', 'Dedicated page', 'Email support'],
          buttonText: 'Subscribe',
        },
        {
          name: 'Professional',
          price: '$200/mo',
          features: ['1,000 properties', 'Full ERP', 'Priority support'],
          buttonText: 'Subscribe',
        },
      ]}
      howItWorks={[
        { title: 'Register & Create Profile', description: 'Set up your agent account and professional profile' },
        { title: 'Get Verified', description: 'Upload credentials and licensing documents' },
        { title: 'List Properties', description: 'Add properties up to your plan limit' },
        { title: 'Grow Your Business', description: 'Use CRM, analytics and campaigns to expand' },
      ]}
      ctaText="Register as Agent →"
    />
  );
}