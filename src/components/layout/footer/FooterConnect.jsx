import { Facebook, Instagram, Linkedin, Youtube, MessageCircle, Twitter } from "lucide-react";

const SOCIALS = [
  { icon: <Facebook size={20} className="text-white" />,      label: "Facebook",  href: "https://www.facebook.com/kemedarglobal" },
  { icon: <Instagram size={20} className="text-white" />,     label: "Instagram", href: "https://www.instagram.com/kemedar/" },
  { icon: <Linkedin size={20} className="text-white" />,      label: "LinkedIn",  href: "https://www.linkedin.com/company/kemedar-com/" },
  { icon: <Youtube size={20} className="text-white" />,       label: "YouTube",   href: "https://www.youtube.com/@kemedar" },
  { icon: <MessageCircle size={20} className="text-white" />, label: "WhatsApp",  href: "https://wa.me/201001234567" },
  { icon: <Twitter size={20} className="text-white" />,       label: "X",         href: "https://x.com/InfoMisr" },
];

const TRUST = ["🔒 SSL Secured", "🧠 AI Powered", "🔷 NEAR Protocol", "💳 XeedWallet™"];

function Divider() {
  return <div style={{ borderTop: "1px solid #1E3A5F", margin: "20px 0" }} />;
}

export default function FooterConnect() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Connect</p>
        <div style={{ width: 30, height: 2, background: "#FF6B00" }} />
      </div>

      {/* Social Grid */}
      <p style={{ color: "#9CA3AF", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Follow Us</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {SOCIALS.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex flex-col items-center justify-center transition-all"
            style={{ height: 44, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid #1E3A5F", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,0,0.12)"; e.currentTarget.style.borderColor = "#FF6B00"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "#1E3A5F"; }}
          >
            {icon}
            <span style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}>{label}</span>
          </a>
        ))}
      </div>

      <Divider />

      {/* App Download */}
      <p style={{ color: "#9CA3AF", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Download App</p>
      <a href="/m"
        className="flex items-center gap-3 w-full transition-all hover:border-orange-400"
        style={{ background: "#060D1A", border: "1px solid #1E3A5F", borderRadius: 10, padding: "12px 16px", marginBottom: 8, textDecoration: "none" }}
      >
        <span style={{ fontSize: 20 }}>🍎</span>
        <div>
          <p style={{ color: "#9CA3AF", fontSize: 10, lineHeight: 1 }}>Download on</p>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>App Store</p>
        </div>
      </a>
      <a href="/m"
        className="flex items-center gap-3 w-full transition-all hover:border-orange-400"
        style={{ background: "#060D1A", border: "1px solid #1E3A5F", borderRadius: 10, padding: "12px 16px", textDecoration: "none" }}
      >
        <span style={{ fontSize: 20 }}>🤖</span>
        <div>
          <p style={{ color: "#9CA3AF", fontSize: 10, lineHeight: 1 }}>Get it on</p>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>Google Play</p>
        </div>
      </a>

      <Divider />

      {/* Trust Badges */}
      <p style={{ color: "#9CA3AF", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Trusted & Secured</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {TRUST.map(badge => (
          <span key={badge} className="flex items-center gap-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1E3A5F", borderRadius: 20, padding: "6px 12px", color: "#6B7280", fontSize: 11 }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}