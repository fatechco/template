import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileHandymanBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Professional/Handyman"
      icon="🔧"
      title="Connect with Clients & Earn"
      heroColor="from-teal-600 to-teal-700"
      stats={['Free Profile', 'Direct Clients', 'Certified Status']}
      intro="Join Kemework and connect with thousands of clients seeking your skills. Electricians, plumbers, painters, carpenters and all professionals are welcome."
      advantages={[
        { title: 'Free Registration', description: 'Create a professional profile at no cost' },
        { title: 'Direct Clients', description: 'Bid on tasks posted by homeowners near you' },
        { title: 'Flexible Work', description: 'Choose tasks that fit your schedule' },
        { title: 'Certified Status', description: 'Become officially Kemedar Certified' },
        { title: 'Direct Payments', description: 'Receive payments directly from clients' },
        { title: 'Rating System', description: 'Build reputation through client reviews' },
      ]}
      benefits={[
        { icon: '📱', title: 'Digital Profile', description: 'Professional page as your business card' },
        { icon: '📋', title: 'Task Bidding', description: 'Bid on jobs posted by homeowners' },
        { icon: '💬', title: 'Direct Contact', description: 'Communicate directly with clients' },
        { icon: '🏅', title: 'Get Certified', description: 'Become Kemedar Certified Professional' },
        { icon: '⭐', title: 'Build Reputation', description: 'Get rated by satisfied customers' },
        { icon: '💰', title: 'Direct Earnings', description: 'Keep full payment from clients' },
      ]}
      plans={[
        {
          name: 'Free',
          price: '$0',
          features: ['1 service', 'Basic profile', 'Get discovered'],
          buttonText: 'Get Started',
        },
        {
          name: 'Starter',
          price: '$20/mo',
          features: ['5 services', 'Premium profile', 'Priority support'],
          buttonText: 'Subscribe',
        },
        {
          name: 'Professional',
          price: '$50/mo',
          features: ['25 services', 'Full features', 'Certification path'],
          buttonText: 'Subscribe',
        },
      ]}
      paidServices={[
        {
          icon: '✅',
          title: 'Professional Verification',
          description: 'Identity check, background check, work history verified',
          price: 'Custom',
          buttonText: 'Learn More →',
        },
        {
          icon: '🪪',
          title: 'Certification Program',
          description: 'Official Kemedar Certified status and ID card',
          price: 'Custom',
          buttonText: 'Apply Now →',
        },
      ]}
      howItWorks={[
        { title: 'Create Profile', description: 'Register and set up your professional profile' },
        { title: 'Add Services', description: 'Specify the services and trades you offer' },
        { title: 'Get Discovered', description: 'Clients find you through search and recommendations' },
        { title: 'Bid on Tasks', description: 'Submit bids on tasks that match your expertise' },
      ]}
      ctaText="Register Your Profile →"
    />
  );
}