import { LABELS } from "@/constants/labels";
import { MESSAGES } from "@/constants/messages";
import type { PaginatedResponse } from "@/types";
import type { Category, LightRequirement, Product } from "../types";

export type CollectionResponse<T> = T[] | PaginatedResponse<T> | {
  success: boolean;
  data: T[];
  pagination: Omit<PaginatedResponse<T>, "results">;
};

type BackendLightRequirement = "LOW_LIGHT" | "MEDIUM_LIGHT" | "BRIGHT_DIRECT";

export type ApiProduct = Omit<Product, "category" | "category_name" | "light_requirement" | "primary_image"> & {
  category: string | Category;
  category_name?: string;
  light_requirement: LightRequirement | BackendLightRequirement;
  primary_image?: string | null;
  sale_price?: number | string | null;
  rental_price?: number | string | null;
  details?: any[];
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

export function normalizeProduct(product: ApiProduct, apiBaseUrl: string): Product {
  const mediaUrl = (path?: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
      return path;
    }
    try {
      return new URL(path, apiBaseUrl).href;
    } catch {
      return path;
    }
  };

  const images = product.images?.map((image) => ({
    ...image,
    image: image.image?.startsWith("http") ? image.image : (mediaUrl(image.image) || image.image),
  }));

  const primaryImage =
    product.primary_image ||
    images?.find((image) => image.is_primary)?.image ||
    images?.[0]?.image;

  const light = product.light_requirement;

  // Map variants from either backend `variants` or `details`
  const variants = (product.variants && product.variants.length > 0)
    ? product.variants.map((v) => ({
        ...v,
        sale_price_vnd: v.sale_price_vnd != null ? Number(v.sale_price_vnd) : undefined,
        deposit_vnd: v.deposit_vnd != null ? Number(v.deposit_vnd) : undefined,
      }))
    : (product.details?.map((d: any) => ({
        id: String(d.id),
        sku: d.sku || "",
        size: d.size || "M",
        size_display: d.size ? `Size ${d.size}` : LABELS.common.DEFAULT,
        height_cm: d.height ? Number(d.height) : undefined,
        sale_price_vnd: d.sale_price != null ? Number(d.sale_price) : undefined,
        deposit_vnd: d.rental_price != null ? Number(d.rental_price) : undefined,
        can_sell: d.sale_price != null && Number(d.sale_price) > 0,
        can_rent: d.rental_price != null && Number(d.rental_price) > 0,
        is_active: d.status === "AVAILABLE",
        rental_rates: [],
        created_at: d.created_at || "",
        updated_at: d.updated_at || "",
      })) ?? []);

  // Compute lowest sale price
  const variantPrices = variants
    .map((v) => v.sale_price_vnd)
    .filter((p): p is number => typeof p === "number" && p > 0);

  const minSalePrice =
    product.min_sale_price_vnd != null && Number(product.min_sale_price_vnd) > 0
      ? Number(product.min_sale_price_vnd)
      : product.sale_price != null && Number(product.sale_price) > 0
        ? Number(product.sale_price)
        : variantPrices.length > 0
          ? Math.min(...variantPrices)
          : undefined;

  return {
    ...product,
    category: typeof product.category === "string" ? product.category : product.category.id,
    category_name: product.category_name || (typeof product.category === "string" ? "" : product.category.name),
    light_requirement: light in lightFromApi ? lightFromApi[light as BackendLightRequirement] : (light as LightRequirement),
    primary_image: mediaUrl(primaryImage),
    min_sale_price_vnd: minSalePrice,
    variants,
    images,
  };
}
