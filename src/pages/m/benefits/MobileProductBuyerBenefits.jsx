import MobileBenefitPageTemplate from '@/components/mobile-benefits/MobileBenefitPageTemplate';

export default function MobileProductBuyerBenefits() {
  return (
    <MobileBenefitPageTemplate
      role="Product Buyer"
      icon="🛒"
      title="Shop All Home Products"
      heroColor="from-cyan-500 to-cyan-600"
      stats={['50K+ Products', '20+ Payments', '15+ Languages']}
      intro="Discover a vast array of construction, finishing and decorative products from trusted sellers across 30+ countries."
      advantages={[
        { title: 'Free Browsing', description: 'Search and compare products at no cost' },
        { title: 'Large Selection', description: '50,000+ products from verified sellers' },
        { title: 'Global Shipping', description: 'Products from 30+ countries' },
        { title: 'Multiple Payments', description: '20+ payment methods including installments' },
        { title: 'Easy Returns', description: 'Clear refund policy for peace of mind' },
        { title: 'Price Tracking', description: 'Save items and track price drops' },
      ]}
      benefits={[
        { icon: '🔍', title: 'Advanced Search', description: 'Find exactly what you need easily' },
        { icon: '⭐', title: 'Ratings & Reviews', description: 'See what other buyers think' },
        { icon: '💳', title: 'Secure Payments', description: 'Multiple payment options available' },
        { icon: '🚚', title: 'Fast Shipping', description: 'Track deliveries in real-time' },
        { icon: '❤️', title: 'Wishlist', description: 'Save items for later or share' },
        { icon: '🎁', title: 'Flash Deals', description: 'Exclusive limited-time offers' },
      ]}
      howItWorks={[
        { title: 'Browse Products', description: 'Explore 13 product categories' },
        { title: 'Compare Items', description: 'View details side-by-side' },
        { title: 'Add to Cart', description: 'Secure checkout with multiple payments' },
        { title: 'Track Delivery', description: 'Monitor your order in real-time' },
      ]}
      ctaText="Start Shopping →"
    />
  );
}