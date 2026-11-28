import { BaseEntity } from "@/types";

export type LightRequirement = "LOW" | "MEDIUM" | "BRIGHT_INDIRECT" | "DIRECT";
export type CareLevel = "EASY" | "MODERATE" | "DIFFICULT";
export type PlantSize = "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
export type BillingUnit = "DAY" | "WEEK" | "MONTH";

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface RentalRate extends BaseEntity {
  billing_unit: BillingUnit;
  unit_display: string;
  price_vnd: number;
  is_active: boolean;
}

export interface ProductVariant extends BaseEntity {
  sku: string;
  size: string;
  size_display: string;
  height_cm?: number;
  sale_price_vnd?: number;
  stock_quantity?: number;
  deposit_vnd?: number;
  can_sell: boolean;
  can_rent: boolean;
  is_active: boolean;
  rental_rates: RentalRate[];
}

export interface ProductImage extends BaseEntity {
  image: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  category: string;
  category_name: string;
  description?: string;
  care_instructions?: string;
  light_requirement?: LightRequirement;
  care_level?: CareLevel;
  primary_image?: string;
  min_sale_price_vnd?: number;
  min_rental_price_vnd?: number;
  units_sold?: number;
  is_active: boolean;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  light_requirement?: LightRequirement;
  care_level?: CareLevel;
  can_rent?: boolean;
  can_sell?: boolean;
  sort_by?: "price_asc" | "price_desc" | "newest" | "name" | "popular";
  page?: number;
  page_size?: number;
}
