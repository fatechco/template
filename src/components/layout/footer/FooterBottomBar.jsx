import { Link } from "react-router-dom";
import { useI18n, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";

export default function FooterBottomBar() {
  const { lang, setLang, langMeta } = useI18n();
  const { selectedCurrency, currencies, setCurrency } = useCurrency();

  const year = new Date().getFullYear();

  return (
    <div
      className="w-full border-t"
      style={{ background: "#030810", borderColor: "#1E3A5F" }}
    >
      {/* Desktop */}
      <div
        className="hidden md:flex items-center justify-between"
        style={{ padding: "0 80px", height: 48 }}
      >
        {/* Left */}
        <div style={{ flex: "0 0 35%" }}>
          <p style={{ color: "#6B7280", fontSize: 11 }}>© {year} Kemedar® Super App PropTech Ecosystem. All rights reserved.</p>
        </div>

        {/* Center */}
        <div style={{ flex: "0 0 30%" }} className="flex items-center justify-center gap-1 flex-wrap" style={{ color: "#6B7280", fontSize: 11 }}>
          <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
          <span style={{ color: "#374151", margin: "0 6px" }}>·</span>
          <Link to="/terms" className="hover:text-orange-400 transition-colors">Privacy</Link>
          <span style={{ color: "#374151", margin: "0 6px" }}>·</span>
          <Link to="/terms" className="hover:text-orange-400 transition-colors">Cookies</Link>
          <span style={{ color: "#374151", margin: "0 6px" }}>·</span>
          <Link to="/sitemap" className="hover:text-orange-400 transition-colors">Sitemap</Link>
          <span style={{ color: "#374151", margin: "0 6px" }}>·</span>
          <Link to="/thinkdar" className="hover:text-orange-400 transition-colors">API Terms</Link>
        </div>

        {/* Right */}
        <div style={{ flex: "0 0 35%" }} className="flex items-center justify-end gap-2">
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{ background: "transparent", border: "1px solid #374151", color: "#6B7280", fontSize: 11, borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: "#1a1a2e", color: "#fff" }}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
          <select
            value={selectedCurrency}
            onChange={e => setCurrency(e.target.value)}
            style={{ background: "transparent", border: "1px solid #374151", color: "#6B7280", fontSize: 11, borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
          >
            {currencies.length > 0
              ? currencies.map(c => (
                  <option key={c.code} value={c.code} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {c.symbol} {c.code}
                  </option>
                ))
              : ["EGP","USD","EUR","AED","SAR"].map(c => (
                  <option key={c} value={c} style={{ background: "#1a1a2e", color: "#fff" }}>{c}</option>
                ))
            }
          </select>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col items-center gap-2 md:hidden py-4 px-5 text-center">
        <p style={{ color: "#6B7280", fontSize: 11 }}>© {year} Kemedar® Super App PropTech Ecosystem. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-2" style={{ color: "#6B7280", fontSize: 10 }}>
          <Link to="/terms" className="hover:text-orange-400">Terms</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-orange-400">Privacy</Link>
          <span>·</span>
          <Link to="/sitemap" className="hover:text-orange-400">Sitemap</Link>
          <span>·</span>
          <Link to="/thinkdar" className="hover:text-orange-400">API Terms</Link>
        </div>
        <div className="flex gap-2">
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "transparent", border: "1px solid #374151", color: "#6B7280", fontSize: 11, borderRadius: 6, padding: "2px 6px" }}>
            {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: "#1a1a2e", color: "#fff" }}>{l.flag} {l.label}</option>)}
          </select>
          <select value={selectedCurrency} onChange={e => setCurrency(e.target.value)} style={{ background: "transparent", border: "1px solid #374151", color: "#6B7280", fontSize: 11, borderRadius: 6, padding: "2px 6px" }}>
            {(currencies.length > 0 ? currencies : [{code:"EGP"},{code:"USD"},{code:"EUR"},{code:"AED"}]).map(c => (
              <option key={c.code} value={c.code} style={{ background: "#1a1a2e", color: "#fff" }}>{c.code}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}