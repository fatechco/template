import { z } from "zod";

export const createPropertySchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  purposeId: z.string().min(1, "Purpose is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  priceAmount: z.number().positive().optional(),
  currencyId: z.string().optional(),
  cityId: z.string().optional(),
  districtId: z.string().optional(),
  areaId: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  featuredImage: z.string().url().optional(),
  imageGallery: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  isContactForPrice: z.boolean().optional(),
  isNegotiable: z.boolean().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFilterSchema = z.object({
  categoryId: z.string().optional(),
  purposeId: z.string().optional(),
  cityId: z.string().optional(),
  districtId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  isAuction: z.coerce.boolean().optional(),
  isFracOffering: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
