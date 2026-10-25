import { BaseEntity } from "@/types";

export type LightRequirement = "LOW" | "MEDIUM" | "BRIGHT_INDIRECT" | "DIRECT";
export type CareLevel = "EASY" | "MODERATE" | "DIFFICULT";
export type PlantSize = "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
export type BillingUnit = "DAY" | "WEEK" | "MONTH";

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export interface RentalRate extends BaseEntity {
  billing_unit: BillingUnit;
  unit_display: string;
  price_vnd: number;
  is_active: boolean;
}

export interface ProductVariant extends BaseEntity {
  sku: string;
  size: PlantSize;
  size_display: string;
  height_cm?: number;
  sale_price_vnd?: number;
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
  light_requirement: LightRequirement;
  care_level: CareLevel;
  primary_image?: string;
  min_sale_price_vnd?: number;
  is_active: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  light_requirement?: LightRequirement;
  care_level?: CareLevel;
  page?: number;
  page_size?: number;
}
