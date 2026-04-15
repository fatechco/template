import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Currencies
  const currencies = [
    { code: "EGP", name: "Egyptian Pound", nameAr: "جنيه مصري", symbol: "EGP", rate: 1 },
    { code: "USD", name: "US Dollar", nameAr: "دولار أمريكي", symbol: "$", rate: 0.0204 },
    { code: "EUR", name: "Euro", nameAr: "يورو", symbol: "€", rate: 0.0188 },
    { code: "AED", name: "UAE Dirham", nameAr: "درهم إماراتي", symbol: "AED", rate: 0.075 },
    { code: "SAR", name: "Saudi Riyal", nameAr: "ريال سعودي", symbol: "SAR", rate: 0.0765 },
    { code: "GBP", name: "British Pound", nameAr: "جنيه إسترليني", symbol: "£", rate: 0.0162 },
  ];
  for (const c of currencies) {
    await prisma.currency.upsert({ where: { code: c.code }, update: c, create: c });
  }
  console.log("✅ Currencies seeded");

  // 2. Seed Property Categories
  const categories = [
    { name: "Apartment", nameAr: "شقة", slug: "apartment", sortOrder: 1 },
    { name: "Villa", nameAr: "فيلا", slug: "villa", sortOrder: 2 },
    { name: "Townhouse", nameAr: "تاون هاوس", slug: "townhouse", sortOrder: 3 },
    { name: "Duplex", nameAr: "دوبلكس", slug: "duplex", sortOrder: 4 },
    { name: "Penthouse", nameAr: "بنتهاوس", slug: "penthouse", sortOrder: 5 },
    { name: "Studio", nameAr: "استديو", slug: "studio", sortOrder: 6 },
    { name: "Office", nameAr: "مكتب", slug: "office", sortOrder: 7 },
    { name: "Shop", nameAr: "محل", slug: "shop", sortOrder: 8 },
    { name: "Land", nameAr: "أرض", slug: "land", sortOrder: 9 },
    { name: "Warehouse", nameAr: "مخزن", slug: "warehouse", sortOrder: 10 },
    { name: "Chalet", nameAr: "شاليه", slug: "chalet", sortOrder: 11 },
    { name: "Farm", nameAr: "مزرعة", slug: "farm", sortOrder: 12 },
  ];
  for (const cat of categories) {
    await prisma.propertyCategory.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }
  console.log("✅ Property categories seeded");

  // 3. Seed Property Purposes
  const purposes = [
    { name: "For Sale", nameAr: "للبيع", slug: "sale" },
    { name: "For Rent", nameAr: "للإيجار", slug: "rent" },
    { name: "For Exchange", nameAr: "للتبادل", slug: "exchange" },
  ];
  for (const p of purposes) {
    await prisma.propertyPurpose.upsert({ where: { slug: p.slug }, update: p, create: p });
  }
  console.log("✅ Property purposes seeded");

  // 4. Seed Egypt Locations
  const egypt = await prisma.country.upsert({ where: { code: "EG" }, update: {}, create: { name: "Egypt", nameAr: "مصر", code: "EG" } });
  const governorates = [
    { name: "Cairo", nameAr: "القاهرة", cities: [{ name: "Nasr City", nameAr: "مدينة نصر" }, { name: "Heliopolis", nameAr: "مصر الجديدة" }, { name: "New Cairo", nameAr: "القاهرة الجديدة" }, { name: "Maadi", nameAr: "المعادي" }] },
    { name: "Giza", nameAr: "الجيزة", cities: [{ name: "6th of October", nameAr: "السادس من أكتوبر" }, { name: "Sheikh Zayed", nameAr: "الشيخ زايد" }, { name: "Dokki", nameAr: "الدقي" }] },
    { name: "Alexandria", nameAr: "الإسكندرية", cities: [{ name: "Montazah", nameAr: "المنتزه" }, { name: "Smouha", nameAr: "سموحة" }] },
    { name: "Red Sea", nameAr: "البحر الأحمر", cities: [{ name: "Hurghada", nameAr: "الغردقة" }, { name: "El Gouna", nameAr: "الجونة" }] },
    { name: "North Coast", nameAr: "الساحل الشمالي", cities: [{ name: "Marina", nameAr: "مارينا" }, { name: "Alamein", nameAr: "العلمين" }] },
  ];
  for (const gov of governorates) {
    const province = await prisma.province.upsert({ where: { id: `prov-${gov.name.toLowerCase().replace(/ /g, "-")}` }, update: {}, create: { id: `prov-${gov.name.toLowerCase().replace(/ /g, "-")}`, name: gov.name, nameAr: gov.nameAr, countryId: egypt.id } });
    for (const city of gov.cities) {
      await prisma.city.upsert({ where: { id: `city-${city.name.toLowerCase().replace(/ /g, "-")}` }, update: {}, create: { id: `city-${city.name.toLowerCase().replace(/ /g, "-")}`, name: city.name, nameAr: city.nameAr, provinceId: province.id } });
    }
  }
  console.log("✅ Egypt locations seeded");

  // 5. Seed Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@kemedar.com" },
    update: {},
    create: { email: "admin@kemedar.com", passwordHash: adminPassword, name: "Admin", role: "admin", isActive: true, isVerified: true },
  });
  console.log("✅ Admin user seeded (admin@kemedar.com / admin123)");

  // 6. Seed System Roles
  const systemRoles = ["guest", "common_user", "agent", "agency", "developer", "franchise_owner", "professional", "product_seller", "shipper", "admin", "super_admin"];
  for (const r of systemRoles) {
    await prisma.systemRole.upsert({ where: { name: r }, update: {}, create: { name: r, isSystem: true } });
  }
  console.log("✅ System roles seeded");

  // 7. Seed Auction Settings
  await prisma.auctionSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", isActive: true, sellerDepositPercent: 0.5, sellerDepositMinEGP: 2000, buyerDepositPercent: 1, buyerDepositMinEGP: 5000, winnerPaymentDeadlineHours: 48, defaultMinBidIncrementEGP: 5000, defaultExtensionMinutes: 5, defaultMaxExtensions: 3, platformCommissionPercent: 2, requireVerifyProLevel: 2, requireBuyerKYC: true, maxAuctionDurationDays: 30, minAuctionDurationDays: 1, featuredAuctionFeeEGP: 500, updatedAt: new Date() },
  });
  console.log("✅ Auction settings seeded");

  console.log("\n🎉 Database seeded successfully!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
