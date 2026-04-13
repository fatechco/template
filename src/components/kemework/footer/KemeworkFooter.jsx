// DEPRECATED — use SuperFooter from components/layout/SuperFooter instead
import { Link } from "react-router-dom";
import { Facebook, Linkedin, Youtube, Twitter, MessageCircle } from "lucide-react";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1EMrJEGmvV/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/kemedar-com/" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@kemedar?si=SsSARyIiid1UpDns" },
  { icon: Twitter, label: "X / Twitter", href: "https://x.com/InfoMisr" },
  { icon: MessageCircle, label: "TikTok", href: "https://www.tiktok.com/@kemedar?_r=1&_t=ZS-94u93BhfsOa" },
];

const FOR_CUSTOMERS = [
  { label: "Post a Task", to: "/kemework/post-task" },
  { label: "Find Professionals", to: "/kemework/find-professionals" },
  { label: "Browse Services", to: "/kemework/services" },
  { label: "How It Works", to: "/kemework/how-it-works" },
  { label: "Customer Support", to: "/kemework/support" },
];

const FOR_PROS = [
  { label: "Register as Professional", to: "/kemework/register" },
  { label: "Post Your Services", to: "/kemework/post-service" },
  { label: "Kemedar Preferred Program", to: "/kemework/accreditation" },
  { label: "Professional Benefits", to: "/kemework/pro-benefits" },
  { label: "Subscription Plans", to: "/kemework/plans" },
];

const USER_BENEFITS = [
  { label: "Property Owner", to: "/user-benefits/property-seller" },
  { label: "Property Buyer", to: "/user-benefits/property-buyer" },
  { label: "Real Estate Agent", to: "/user-benefits/real-estate-agent" },
  { label: "Professional / Handyman", to: "/user-benefits/handyman-or-technician" },
  { label: "Franchise Owner", to: "/user-benefits/franchise-owner-area" },
  { label: "Product Seller", to: "/user-benefits/product-seller" },
];

const USEFUL_LINKS = [
  { label: "About Us", to: "/kemework/about" },
  { label: "Contact Us", to: "/kemework/contact" },
  { label: "Privacy Policy", to: "/kemework/privacy" },
  { label: "Terms of Service", to: "/kemework/terms" },
  { label: "Cookie Policy", to: "/kemework/cookies" },
  { label: "Careers", to: "/kemework/careers" },
  { label: "Blog", to: "/kemework/blog" },
];

function FooterColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h4 className="font-bold text-sm text-white pb-2">{title}</h4>
        <div className="w-8 h-0.5 rounded-full" style={{ background: "#C41230" }} />
      </div>
      <ul className="flex flex-col gap-2">
        {links.map(link => (
          <li key={link.to}>
            <Link to={link.to} className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C41230"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KemeworkFooter() {
  return (
    <footer style={{ background: "#1a1a2e" }}>
      {/* Main grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1: Logo + about */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <img
              src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/2bde78c0d_final-logo.png"
              alt="Kemework"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Your ultimate destination for connecting with skilled professionals who can transform your home.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {SOCIALS.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#C41230"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  >
                    <SocialIcon size={15} className="text-white" />
                  </a>
                );
              })}
            </div>
            {/* Install App (PWA) */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-xs font-bold text-gray-300">📱 Install Our App</p>
              <div className="flex flex-col gap-1.5">
                <a href="/m" className="flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#C41230"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                  🍎 For iOS (Add to Home Screen)
                </a>
                <a href="/m" className="flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#C41230"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                  🤖 For Android (Install App)
                </a>
              </div>
            </div>
          </div>

          <FooterColumn title="For Customers" links={FOR_CUSTOMERS} />
          <FooterColumn title="For Professionals" links={FOR_PROS} />
          <FooterColumn title="User Benefits" links={USER_BENEFITS} />
          <FooterColumn title="Useful Links" links={USEFUL_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} Kemework® — Part of Kemedar Ecosystem
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Link to="/kemework/terms" className="hover:text-white transition-colors">Terms</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <Link to="/kemework/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <Link to="/kemework/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => {
              const SocialIcon = social.icon;
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                  className="w-6 h-6 flex items-center justify-center transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  <SocialIcon size={14} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}