import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { adminRepository } from "@/server/repositories/admin.repository";

export const adminService = {
  async seedRBACData() {
    // Seed system roles
    const roles = [
      { name: "guest", nameAr: "زائر", isSystem: true },
      { name: "common_user", nameAr: "مستخدم عادي", isSystem: true },
      { name: "agent", nameAr: "وسيط عقاري", isSystem: true },
      { name: "agency", nameAr: "شركة عقارية", isSystem: true },
      { name: "developer", nameAr: "مطور عقاري", isSystem: true },
      { name: "franchise_owner", nameAr: "مالك فرانشايز", isSystem: true },
      { name: "professional", nameAr: "محترف", isSystem: true },
      { name: "product_seller", nameAr: "بائع منتجات", isSystem: true },
      { name: "shipper", nameAr: "شركة شحن", isSystem: true },
      { name: "admin", nameAr: "مدير", isSystem: true },
      { name: "super_admin", nameAr: "مدير أعلى", isSystem: true },
    ];

    let created = 0;
    for (const role of roles) {
      // Direct prisma: complex query not in repository (upsert systemRole by name not in admin repo)
      await prisma.systemRole.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
      created++;
    }

    return { rolesSeeded: created };
  },

  async importTranslations(data: Array<{ key: string; module: string; locale: string; value: string }>) {
    let imported = 0;
    for (const item of data) {
      await adminRepository.upsertTranslation({
        key: item.key,
        module: item.module,
        locale: item.locale,
        value: item.value,
      } as any);
      imported++;
    }
    return { imported };
  },

  async exportTranslations(module?: string, locale?: string) {
    return adminRepository.findTranslations(module, locale);
  },

  async getTranslations(module: string, locale: string) {
    const translations = await adminRepository.findTranslations(module, locale);

    const map: Record<string, string> = {};
    for (const t of translations) {
      map[t.key] = t.value;
    }
    return map;
  },

  async importEgyptLocations(locations: Array<{ governorate: string; city: string; district?: string; area?: string }>) {
    let imported = 0;

    // Direct prisma: complex query not in repository (country/province/city/district/area not in admin repo)
    // Ensure Egypt country exists
    const egypt = await prisma.country.upsert({
      where: { code: "EG" },
      update: {},
      create: { name: "Egypt", nameAr: "مصر", code: "EG" },
    });

    for (const loc of locations) {
      // Province (governorate)
      let province = await prisma.province.findFirst({ where: { name: loc.governorate, countryId: egypt.id } });
      if (!province) {
        province = await prisma.province.create({ data: { name: loc.governorate, countryId: egypt.id } });
      }

      // City
      let city = await prisma.city.findFirst({ where: { name: loc.city, provinceId: province.id } });
      if (!city) {
        city = await prisma.city.create({ data: { name: loc.city, provinceId: province.id } });
      }

      // District
      if (loc.district) {
        let district = await prisma.district.findFirst({ where: { name: loc.district, cityId: city.id } });
        if (!district) {
          district = await prisma.district.create({ data: { name: loc.district, cityId: city.id } });
        }

        // Area
        if (loc.area) {
          const existingArea = await prisma.area.findFirst({ where: { name: loc.area, districtId: district.id } });
          if (!existingArea) {
            await prisma.area.create({ data: { name: loc.area, districtId: district.id } });
          }
        }
      }

      imported++;
    }

    return { imported };
  },
};
