/**
 * Returns true if the current session should use the mobile UI.
 * Criteria: screen width < 768px OR launched from home screen (standalone PWA).
 */
export function isMobileSession() {
  const isNarrow = window.innerWidth < 768;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  return isNarrow || isStandalone;
}

/**
 * Given a desktop path, returns the equivalent /m/* path.
 * Used when redirecting from a desktop URL on a mobile device.
 */
export function toMobilePath(desktopPath) {
  const exact = {
    "/":                          "/m",
    "/Home":                      "/m",
    "/search-properties":         "/m/find/property",
    "/kemedar/search-properties": "/m/find/property",
    "/SearchProperties":          "/m/find/property",
    "/search-projects":           "/m/find/project",
    "/kemedar/search-projects":   "/m/find/project",
    "/SearchProjects":            "/m/find/project",
    "/create/property":           "/m/add/property",
    "/kemedar/add/property":      "/m/add/property",
    "/CreateProperty":            "/m/add/property",
    "/create/buy-request":        "/m/add/buy-request",
    "/kemedar/add/buy-request":   "/m/add/buy-request",
    "/CreateBuyRequest":          "/m/add/buy-request",
    "/create/project":            "/m/add/project",
    "/kemedar/add/project":       "/m/add/project",
    "/CreateProject":             "/m/add/project",
    "/kemetro":                   "/m/kemetro",
    "/kemework":                  "/m/kemework",
    "/kemefrac":                  "/m/kemefrac",
    "/auctions":                  "/m/auctions",
    "/dashboard":                 "/m/dashboard",
    "/Dashboard":                 "/m/dashboard",
    "/dashboard/swap":            "/m/swap",
    "/dashboard/auctions":        "/m/dashboard/auctions",
    "/kemetro/search":            "/m/kemetro/search",
    "/kemetro/cart":              "/m/kemetro/cart",
    "/kemetro/build":             "/m/kemetro/build",
    "/kemetro/flash":             "/m/kemetro/flash",
    "/kemetro/surplus":           "/m/kemetro/surplus",
    "/kemetro/kemekits":          "/m/kemetro/kemekits",
    "/kemework/tasks":            "/m/kemework/tasks",
    "/kemework/find-professionals": "/m/kemework/find-professionals",
    "/kemework/post-task":        "/m/kemework/post-task",
    "/kemedar/predict":           "/m/kemedar/predict",
    "/kemedar/life-score":        "/m/kemedar/life-score",
    "/kemedar/coach":             "/m/kemedar/coach",
    "/kemedar/live":              "/m/kemedar/live",
    "/kemedar/pricing":           "/m/kemedar/pricing",
  };

  if (exact[desktopPath]) return exact[desktopPath];

  // Prefix-based mappings
  const prefixes = [
    ["/cp/user",           "/m/cp/user"],
    ["/cp/agent",          "/m/cp/agent"],
    ["/cp/agency",         "/m/cp/agency"],
    ["/cp/developer",      "/m/cp/developer"],
    ["/cp/pro",            "/m/cp/pro"],
    ["/cp/company",        "/m/cp/company"],
    ["/kemedar/franchise", "/m/kemedar/franchise"],
    ["/kemetro/seller",    "/m/kemetro/seller"],
    ["/kemetro/shipper",   "/m/kemetro/shipper"],
    ["/kemetro/product",   "/m/kemetro/product"],
    ["/kemetro/kemekits",  "/m/kemetro/kemekits"],
    ["/kemetro/surplus",   "/m/kemetro/surplus"],
    ["/kemetro",           "/m/kemetro"],
    ["/kemework",          "/m/kemework"],
    ["/dashboard",         "/m/dashboard"],
    ["/auctions",          "/m/auctions"],
    ["/kemefrac",          "/m/kemefrac"],
  ];

  for (const [from, to] of prefixes) {
    if (desktopPath.startsWith(from)) {
      return to + desktopPath.slice(from.length);
    }
  }

  return "/m";
}