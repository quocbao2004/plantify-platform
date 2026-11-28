import { MESSAGES } from "@/constants/messages";
import type { PaginatedResponse } from "@/types";
import type { Category, LightRequirement, Product, ProductVariant } from "../types";

export type CollectionResponse<T> = T[] | PaginatedResponse<T> | {
  success: boolean;
  data: T[];
  pagination: Omit<PaginatedResponse<T>, "results">;
};

type BackendLightRequirement = "LOW_LIGHT" | "MEDIUM_LIGHT" | "BRIGHT_DIRECT";

type ApiPlantDetail = {
  id: string;
  sku: string;
  size: string;
  height: string | null;
  sale_price: string;
  rental_price: string;
  status: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  media: { file_url: string; media_type: string; is_primary: boolean; display_order: number }[];
};

export type ApiProduct = Omit<Product, "category" | "category_name" | "care_level" | "light_requirement" | "primary_image"> & {
  category: string | Category;
  category_name?: string;
  care_guide?: string;
  care_level?: Product["care_level"] | "";
  light_requirement?: LightRequirement | BackendLightRequirement | "";
  primary_image?: string | null;
  sale_price?: number | string | null;
  rental_price?: number | string | null;
  details?: ApiPlantDetail[];
};

const lightFromApi: Record<BackendLightRequirement, LightRequirement> = {
  LOW_LIGHT: "LOW",
  MEDIUM_LIGHT: "MEDIUM",
  BRIGHT_DIRECT: "DIRECT",
};

export const lightToApi: Record<LightRequirement, BackendLightRequirement> = {
  LOW: "LOW_LIGHT",
  MEDIUM: "MEDIUM_LIGHT",
  BRIGHT_INDIRECT: "MEDIUM_LIGHT",
  DIRECT: "BRIGHT_DIRECT",
};

export function normalizeCollection<T>(payload: CollectionResponse<T>): PaginatedResponse<T> {
  if (Array.isArray(payload)) {
    return { count: payload.length, next: null, previous: null, results: payload };
  }
  if (payload && "results" in payload && Array.isArray(payload.results)) {
    return payload;
  }
  if (payload && "data" in payload && Array.isArray(payload.data) && payload.pagination) {
    return {
      count: payload.pagination.count,
      next: payload.pagination.next,
      previous: payload.pagination.previous,
      results: payload.data,
    };
  }
  throw new Error(MESSAGES.INVALID_API_RESPONSE);
}

export function resolveMediaUrl(path: string | null | undefined, apiBaseUrl: string) {
  if (!path?.trim()) return undefined;
  if (path.startsWith("/images/home/")) return path;

  try {
    const url = new URL(path, apiBaseUrl);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    return undefined;
  }
}

function positiveNumber(value: number | string | null | undefined) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function normalizeVariant(detail: ApiPlantDetail): ProductVariant {
  const salePrice = positiveNumber(detail.sale_price);
  return {
    id: detail.id,
    sku: detail.sku,
    size: detail.size,
    size_display: detail.size || detail.sku,
    height_cm: positiveNumber(detail.height),
    sale_price_vnd: salePrice,
    stock_quantity: detail.stock_quantity,
    can_sell: salePrice !== undefined,
    can_rent: positiveNumber(detail.rental_price) !== undefined,
    is_active: detail.status === "AVAILABLE",
    rental_rates: [],
    created_at: detail.created_at,
    updated_at: detail.updated_at,
  };
}

export function normalizeProduct(product: ApiProduct, apiBaseUrl: string): Product {
  const images = product.images?.map((image) => ({
    ...image,
    image: resolveMediaUrl(image.image, apiBaseUrl) ?? image.image,
  }));
  const detailImages = (product.details ?? [])
    .flatMap((detail) => detail.media ?? [])
    .filter((media) => media.media_type === "IMAGE")
    .sort((first, second) => Number(second.is_primary) - Number(first.is_primary) || first.display_order - second.display_order);
  const primaryImage = [product.primary_image, images?.find((image) => image.is_primary)?.image, images?.[0]?.image, ...detailImages.map((image) => image.file_url)]
    .map((path) => resolveMediaUrl(path, apiBaseUrl))
    .find(Boolean);
  const variants = product.variants?.length
    ? product.variants.map((variant) => ({
        ...variant,
        sale_price_vnd: positiveNumber(variant.sale_price_vnd),
        deposit_vnd: positiveNumber(variant.deposit_vnd),
        stock_quantity: variant.stock_quantity ?? product.details?.find((detail) => detail.id === variant.id)?.stock_quantity,
      }))
    : product.details?.map(normalizeVariant);
  const salePrices = (variants ?? []).flatMap((variant) => variant.sale_price_vnd ? [variant.sale_price_vnd] : []);
  const light = product.light_requirement;

  return {
    ...product,
    category: typeof product.category === "string" ? product.category : product.category.id,
    category_name: product.category_name || (typeof product.category === "string" ? "" : product.category.name),
    care_instructions: product.care_instructions || product.care_guide,
    care_level: product.care_level || undefined,
    light_requirement: light ? (lightFromApi[light as BackendLightRequirement] ?? light as LightRequirement) : undefined,
    primary_image: primaryImage,
    min_sale_price_vnd: positiveNumber(product.min_sale_price_vnd) ?? positiveNumber(product.sale_price)
      ?? (salePrices.length ? Math.min(...salePrices) : undefined),
    variants,
    images,
  };
}
