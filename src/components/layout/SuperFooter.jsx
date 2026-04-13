import FooterTicker from "./footer/FooterTicker";
import FooterBrand from "./footer/FooterBrand";
import {
  FooterPlatformsServices,
  FooterKemedarRealEstate,
  FooterKemedarAI,
  FooterKemework,
  FooterKemetro,
  MobileAccordionCol,
} from "./footer/FooterColumns";
import FooterMegaMenu from "./footer/FooterMegaMenu";
import FooterBottomBar from "./footer/FooterBottomBar";

const COL_DIVIDER = (
  <div style={{ width: 1, background: "#1E3A5F", alignSelf: "stretch", flexShrink: 0 }} />
);

export default function SuperFooter() {
  return (
    <footer style={{ background: "#0A1628", color: "#fff", width: "100%" }}>
      {/* Layer 1: Ticker */}
      <FooterTicker />

      {/* Layer 2: 6-column desktop grid */}
      <div
        className="hidden lg:flex"
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "48px 60px",
          gap: 0,
          alignItems: "stretch",
        }}
      >
        {/* Col 1 — Brand (fixed 200px) */}
        <div style={{ width: 200, flexShrink: 0, paddingRight: 32 }}>
          <FooterBrand />
        </div>

        {COL_DIVIDER}

        {/* Col 2 — Platforms & Generic Services */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <FooterPlatformsServices />
        </div>

        {COL_DIVIDER}

        {/* Col 3 — Kemedar Real Estate */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <FooterKemedarRealEstate />
        </div>

        {COL_DIVIDER}

        {/* Col 4 — Innovation / Kemedar AI */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <FooterKemedarAI />
        </div>

        {COL_DIVIDER}

        {/* Col 5 — Kemework */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <FooterKemework />
        </div>

        {COL_DIVIDER}

        {/* Col 6 — Kemetro */}
        <div style={{ flex: 1, paddingLeft: 32 }}>
          <FooterKemetro />
        </div>
      </div>

      {/* Layer 2: Mobile accordion */}
      <div className="lg:hidden" style={{ padding: "32px 20px" }}>
        {/* Brand always visible */}
        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #1E3A5F" }}>
          <FooterBrand />
        </div>

        <MobileAccordionCol title="Kemedar Real Estate">
          <FooterKemedarRealEstate />
        </MobileAccordionCol>

        <MobileAccordionCol title="Platforms & Generic Services">
          <FooterPlatformsServices />
        </MobileAccordionCol>

        <MobileAccordionCol title="Innovation — Kemedar AI">
          <FooterKemedarAI />
        </MobileAccordionCol>

        <MobileAccordionCol title="Kemework">
          <FooterKemework />
        </MobileAccordionCol>

        <MobileAccordionCol title="Kemetro">
          <FooterKemetro />
        </MobileAccordionCol>
      </div>

      {/* Layer 3: Mega-menu strip */}
      <FooterMegaMenu />

      {/* Layer 4: Copyright bar */}
      <FooterBottomBar />
    </footer>
  );
}