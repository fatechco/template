import { NextRequest } from "next/server";
import { locationService } from "@/server/services/location.service";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const countryId = params.get("countryId") || undefined;
    const provinceId = params.get("provinceId") || undefined;

    if (provinceId) {
      const cities = await locationService.getCities(provinceId);
      return successResponse(cities);
    }
    if (countryId) {
      const provinces = await locationService.getProvinces(countryId);
      return successResponse(provinces);
    }
    const countries = await locationService.getCountries();
    return successResponse(countries);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
