import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { httpClient } from "@/services/api";
import { MESSAGES } from "@/constants/messages";
import { productsApi } from "@/features/catalog/api/productsApi";
import { HomeFeaturedPlants } from "@/features/catalog/components/home/HomeFeaturedPlants";
import type { LightRequirement } from "@/features/catalog/types";

const category = { id: "category-1", name: "Cây để bàn", slug: "cay-de-ban", is_active: true };
const product = {
  id: "product-1", name: "Cây từ database", slug: "cay-tu-database",
  category: category.id, category_name: category.name, is_active: true,
  light_requirement: "LOW_LIGHT", care_level: "EASY",
  primary_image: "/media/demo/home/product-zz.webp", min_sale_price_vnd: 299000,
};
const page = {
  success: true,
  pagination: { count: 25, total_pages: 7, current_page: 2, page_size: 4,
    next: "http://localhost:8001/api/v1/catalog/products/?page=3",
    previous: "http://localhost:8001/api/v1/catalog/products/?page=1" },
  data: [product],
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("catalog API contract", () => {
  it("renders the Django paginated response on the homepage and supports filters", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: page });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter><HomeFeaturedPlants /></MemoryRouter>
      </QueryClientProvider>,
    );
    const image = await screen.findByRole("img", { name: product.name });
    expect(image).toHaveAttribute("src", "http://localhost:8001/media/demo/home/product-zz.webp");
    expect(screen.queryByText("Trầu bà lá xẻ")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cây để bàn" }));
    expect(screen.getByRole("img", { name: product.name })).toBeInTheDocument();
    client.clear();
  });

  it("preserves count and navigation links from pagination metadata", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: page });
    const result = await productsApi.getProducts({ page: 2, page_size: 4 });
    expect(result).toMatchObject({ count: 25, next: page.pagination.next,
      previous: page.pagination.previous, results: [{ id: product.id, light_requirement: "LOW" }] });
  });

  it("accepts the unpaginated categories endpoint", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: [category] });
    expect(await productsApi.getCategories()).toEqual({ count: 1, next: null,
      previous: null, results: [category] });
  });

  it("continues to accept standard DRF pagination", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: {
      count: 1, next: null, previous: null, results: [{ ...product, light_requirement: "MEDIUM" }],
    } });
    const result = await productsApi.getProducts();
    expect(result.results[0].light_requirement).toBe("MEDIUM");
  });

  it("returns a defined empty results array for an empty catalog", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: { ...page, data: [],
      pagination: { ...page.pagination, count: 0, next: null, previous: null } } });
    expect(await productsApi.getProducts()).toEqual({ count: 0, next: null,
      previous: null, results: [] });
  });

  it("rejects malformed list payloads at the API boundary", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: { success: true } });
    await expect(productsApi.getProducts()).rejects.toThrow(MESSAGES.INVALID_API_RESPONSE);
  });

  it.each([
    ["LOW", "LOW_LIGHT"], ["MEDIUM", "MEDIUM_LIGHT"],
    ["BRIGHT_INDIRECT", "MEDIUM_LIGHT"], ["DIRECT", "BRIGHT_DIRECT"],
  ] as const)("sends the backend light filter for %s", async (uiValue, apiValue) => {
    const get = vi.spyOn(httpClient, "get").mockResolvedValue({ data: page });
    await productsApi.getProducts({ light_requirement: uiValue as LightRequirement });
    expect(get).toHaveBeenCalledWith(expect.any(String), {
      params: expect.objectContaining({ light_requirement: apiValue }),
    });
  });

  it("normalizes the nested detail category and chooses the primary detail image", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: {
      ...product, category, category_name: undefined, primary_image: undefined,
      light_requirement: "BRIGHT_DIRECT",
      images: [{ id: "image-1", image: product.primary_image, is_primary: true, sort_order: 0 }],
    } });
    expect(await productsApi.getProductDetail(product.slug)).toMatchObject({
      category: category.id, category_name: category.name, light_requirement: "DIRECT",
      primary_image: "http://localhost:8001/media/demo/home/product-zz.webp",
    });
  });
});
