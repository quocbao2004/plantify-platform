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
  const mediaUrl = (path?: string | null) => path ? new URL(path, apiBaseUrl).href : undefined;
  const images = product.images?.map((image) => ({
    ...image,
    image: new URL(image.image, apiBaseUrl).href,
  }));
  const primaryImage = product.primary_image || images?.find((image) => image.is_primary)?.image || images?.[0]?.image;
  const light = product.light_requirement;
  return {
    ...product,
    category: typeof product.category === "string" ? product.category : product.category.id,
    category_name: product.category_name || (typeof product.category === "string" ? "" : product.category.name),
    light_requirement: light in lightFromApi ? lightFromApi[light as BackendLightRequirement] : light as LightRequirement,
    primary_image: mediaUrl(primaryImage),
    images,
  };
}
