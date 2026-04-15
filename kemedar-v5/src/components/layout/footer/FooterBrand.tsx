// @ts-nocheck
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const SOCIALS = [
  { Icon: Facebook,  label: "Facebook",  href: "https://www.facebook.com/kemedarglobal" },
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/kemedar/" },
  { Icon: Linkedin,  label: "LinkedIn",  href: "https://www.linkedin.com/company/kemedar-com/" },
  { Icon: Youtube,   label: "YouTube",   href: "https://www.youtube.com/@kemedar" },
  { Icon: Twitter,   label: "X",         href: "https://x.com/InfoMisr" },
];

export default function FooterBrand() {
  return (
    <div className="flex flex-col" style={{ width: "100%" }}>
      {/* Logo */}
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
        alt="Kemedar"
        style={{ width: 160, height: "auto" }}
        className="object-contain brightness-0 invert"
      />

      {/* Description */}
      <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.7, marginTop: 16 }}>
        The region's #1 PropTech Super App. Real estate, home services, building materials all in one platform.
      </p>

      {/* Social Icons */}
      <div className="flex gap-2 flex-wrap" style={{ marginTop: 20 }}>
        {SOCIALS.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex items-center justify-center transition-all"
            style={{ width: 30, height: 30, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid #1E3A5F", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B00"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E3A5F"; }}
          >
            <Icon size={14} color="#fff" />
          </a>
        ))}
      </div>


      {/* ThinkDar Card */}
      <Link
        href="/thinkdar"
        style={{ background: "#0F0E1A", border: "1px solid #4338CA", borderRadius: 10, padding: 10, textDecoration: "none", display: "block", marginTop: 20 }}
      >
        <div className="flex items-start gap-3">
          <span style={{ fontSize: 16 }}>🧠</span>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>ThinkDar™</p>
            <p style={{ color: "#9CA3AF", fontSize: 10, lineHeight: 1.4 }}>The First AI Model Built</p>
            <p style={{ color: "#6366F1", fontWeight: 700, fontSize: 10 }}>Exclusively for Real Estate</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2D2B5A", margin: "10px 0" }} />
        <p style={{ color: "#6B7280", fontSize: 10, lineHeight: 1.5 }}>
          ThinkDar™ is Kemedar's proprietary AI engine trained on millions of Egyptian and MENA real estate data points.
        </p>
      </Link>
    </div>
  );
}