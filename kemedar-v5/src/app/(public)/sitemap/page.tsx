import Link from "next/link";

export default function SitemapPage() {
  const sections = [
    {
      title: "Kemedar",
      links: [
        { label: "Home", href: "/" },
        { label: "Search Properties", href: "/search/properties" },
        { label: "Search Projects", href: "/search/projects" },
        { label: "Auctions", href: "/kemedar/auctions" },
        { label: "KemeFrac", href: "/kemefrac" },
        { label: "AI Search", href: "/kemedar/ai-search" },
        { label: "Life Score", href: "/kemedar/life-score" },
        { label: "Property Match", href: "/kemedar/match" },
        { label: "Advisor", href: "/kemedar/advisor" },
      ],
    },
    {
      title: "Kemetro",
      links: [
        { label: "Marketplace", href: "/kemetro" },
        { label: "Flash Deals", href: "/kemetro/flash" },
        { label: "KemeKits", href: "/kemetro/kemekits" },
        { label: "Surplus", href: "/kemetro/surplus" },
        { label: "Shop the Look", href: "/kemetro/shop-the-look" },
      ],
    },
    {
      title: "Kemework",
      links: [
        { label: "Services", href: "/kemework" },
        { label: "Snap & Fix", href: "/kemework/snap-fix" },
        { label: "Professionals", href: "/kemework/professionals" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-lg mb-3">{s.title}</h2>
            <ul className="space-y-1.5">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-blue-600 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
