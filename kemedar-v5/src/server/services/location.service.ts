import prisma from "@/server/lib/prisma";

export const locationService = {
  async getCountries() {
    return prisma.country.findMany({ orderBy: { name: "asc" } });
  },

  async getProvinces(countryId: string) {
    return prisma.province.findMany({ where: { countryId }, orderBy: { name: "asc" } });
  },

  async getCities(provinceId: string) {
    return prisma.city.findMany({ where: { provinceId }, orderBy: { name: "asc" } });
  },

  async getDistricts(cityId: string) {
    return prisma.district.findMany({ where: { cityId }, orderBy: { name: "asc" } });
  },

  async getAreas(districtId: string) {
    return prisma.area.findMany({ where: { districtId }, orderBy: { name: "asc" } });
  },
};
