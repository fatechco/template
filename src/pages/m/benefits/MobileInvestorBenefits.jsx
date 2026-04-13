import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileInvestorBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Real Estate Investor"
      icon="💰"
      title="Invest in Global Real Estate"
      heroColor="from-amber-600 to-amber-700"
      stats={['$15B+ Transactions', '120+ Countries', 'AI-Powered']}
      intro="The world's premier real estate investment platform. AI-driven insights, fractional ownership options, REITs and expert support for global wealth building."
      advantages={[
        { title: 'High Returns', description: 'Up to 12% annual returns on curated opportunities' },
        { title: 'Risk Mitigation', description: 'AI due diligence ensures secure investments' },
        { title: 'Global Portfolio', description: 'Diversify across international markets' },
        { title: 'Flexible Options', description: 'Direct purchases, REITs or fractional ownership' },
        { title: 'Expert Support', description: '24/7 real estate and financial experts' },
        { title: 'Performance Tracking', description: 'Real-time dashboards and metrics' },
      ]}
      benefits={[
        { icon: '🤖', title: 'AI Market Analysis', description: 'Identify high-potential investment opportunities' },
        { icon: '📊', title: 'Portfolio Management', description: 'Track all investments in one dashboard' },
        { icon: '🌍', title: 'Global Properties', description: 'Invest in 120+ countries from anywhere' },
        { icon: '💹', title: 'Fractional Ownership', description: 'Invest smaller amounts in premium properties' },
        { icon: '📈', title: 'REIT Access', description: 'Join investment trusts for diversification' },
        { icon: '👥', title: 'Investor Network', description: 'Connect with 100,000+ global investors' },
      ]}
      howItWorks={[
        { title: 'Create Account', description: 'Register and complete investor profile' },
        { title: 'Explore Opportunities', description: 'Browse verified properties and projects' },
        { title: 'Analyze Investments', description: 'Use AI tools to evaluate potential returns' },
        { title: 'Make Investment', description: 'Purchase directly or through investment vehicles' },
      ]}
      ctaText="Start Investing Now →"
    />
  );
}