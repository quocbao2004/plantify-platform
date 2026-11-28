import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { httpClient } from "@/services/api";
import { MESSAGES } from "@/constants/messages";
import { productsApi } from "@/features/catalog/api/productsApi";
import { useCartStore } from "@/features/cart/cartStore";
import { HomeFeaturedPlants } from "@/features/catalog/components/home/HomeFeaturedPlants";
import { HomeCollections } from "@/features/catalog/components/home/HomeCollections";
import { ProductDetailPage } from "@/features/catalog/pages/ProductDetailPage";
import { LABELS } from "@/constants/labels";
import type { LightRequirement, ProductQueryParams } from "@/features/catalog/types";

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
    next: "http://localhost:8001/api/v1/catalog/plants/?page=3",
    previous: "http://localhost:8001/api/v1/catalog/plants/?page=1" },
  data: [product],
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useCartStore.setState({ items: [], checkoutAttempt: null });
});

describe("catalog API contract", () => {
  it("renders the Django paginated response on the homepage and supports filters", async () => {
    const otherPlant = { ...product, id: "product-2", name: "Cây ở trang sau" };
    const get = vi.spyOn(httpClient, "get").mockImplementation(async (url, config) => {
      if (url === "/catalog/categories/") return { data: [category] };
      const params = config?.params as ProductQueryParams | undefined;
      return { data: params?.category ? { ...page, data: [otherPlant] } : page };
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter><HomeFeaturedPlants /></MemoryRouter>
      </QueryClientProvider>,
    );
    const image = await screen.findByRole("img", { name: product.name });
    expect(image).toHaveAttribute("src", "http://localhost:8001/media/demo/home/product-zz.webp");
    expect(screen.queryByText("Trầu bà lá xẻ")).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: category.name }));
    expect(await screen.findByRole("img", { name: otherPlant.name })).toBeInTheDocument();
    expect(get).toHaveBeenLastCalledWith("/catalog/plants/", {
      params: expect.objectContaining({ category: category.slug, page_size: 4, sort_by: "popular" }),
    });
    client.clear();
  });

  it("opens the variant shown in quick view when a different size comes first in the API", async () => {
    const plant = {
      ...product,
      min_sale_price_vnd: 159000,
      variants: [
        { id: "size-m", size_display: "Size M", sale_price_vnd: 219000, can_sell: true, is_active: true, stock_quantity: 5 },
        { id: "size-s", size_display: "Size S", sale_price_vnd: 159000, can_sell: true, is_active: true, stock_quantity: 5 },
      ],
    };
    vi.spyOn(httpClient, "get").mockImplementation(async (url) => {
      if (url === "/catalog/categories/") return { data: [category] };
      if (url === `/catalog/plants/${product.slug}/`) return { data: plant };
      return { data: [plant] };
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    const { container } = render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomeFeaturedPlants />} />
            <Route path="/catalog/:idOrSlug" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // JSDOM does not implement the native dialog methods.
    const dialog = container.querySelector("dialog")!;
    dialog.showModal = () => { dialog.open = true; };
    dialog.close = () => { dialog.open = false; };
    fireEvent.click(await screen.findByRole("button", { name: `Xem nhanh ${plant.name}` }));
    const preview = within(screen.getByRole("dialog", { name: plant.name }));
    expect(preview.getByText("Size S")).toBeInTheDocument();
    fireEvent.click(preview.getByRole("link", { name: LABELS.catalog.STORE_CTA }));

    expect(await screen.findByRole("button", { name: "Size S", pressed: true })).toBeInTheDocument();
    expect(screen.getByText("159.000 ₫")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Size M" }));
    expect(screen.getByRole("button", { name: "Size M", pressed: true })).toBeInTheDocument();
    expect(screen.getByText("219.000 ₫")).toBeInTheDocument();
    client.clear();
  });

  it("adds a valid quantity and offers contact when stock cannot cover the request", async () => {
    const variant = { id: "size-s", size_display: "Size S", sale_price_vnd: 159000,
      can_sell: true, is_active: true, stock_quantity: 5 };
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: { ...product, variants: [variant] } });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[`/catalog/${product.slug}`]}>
          <Routes>
            <Route path="/catalog/:idOrSlug" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const quantity = await screen.findByRole("spinbutton", { name: "Số lượng" });
    const addToCart = screen.getByRole("button", { name: LABELS.catalog.ADD_TO_CART });
    expect(quantity).toHaveValue(1);
    for (const value of ["", "0", "1.5"]) {
      fireEvent.change(quantity, { target: { value } });
      expect(addToCart).toBeDisabled();
      expect(screen.getByText(LABELS.catalog.INVALID_QUANTITY)).toBeVisible();
    }

    fireEvent.change(quantity, { target: { value: "6" } });
    const contact = screen.getByRole("link", { name: LABELS.catalog.CONTACT_TO_ORDER });
    expect(contact).toHaveAttribute("href", "tel:19006868");
    expect(screen.getByText(LABELS.catalog.STOCK_CONTACT)).toBeVisible();
    expect(quantity).not.toHaveAttribute("aria-invalid", "true");
    expect(useCartStore.getState().items).toEqual([]);

    fireEvent.change(quantity, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: LABELS.catalog.ADD_TO_CART }));
    expect(useCartStore.getState().items).toEqual([{ plant_detail: variant.id, quantity: 3 }]);
    expect(screen.getByRole("link", { name: LABELS.catalog.CONTACT_TO_ORDER })).toBeVisible();
    fireEvent.change(quantity, { target: { value: "2" } });
    expect(screen.getByRole("button", { name: LABELS.catalog.ADD_TO_CART })).toBeEnabled();
    client.clear();
  });

  it("shows empty sections when the database catalog has no records", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: [] });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter><HomeCollections /><HomeFeaturedPlants /></MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(LABELS.home.COLLECTION_EMPTY)).toBeInTheDocument();
    expect(await screen.findByText(LABELS.catalog.EMPTY_TITLE)).toBeInTheDocument();
    expect(screen.queryByText("Kim tiền")).not.toBeInTheDocument();
    expect(screen.queryByText("Cây để bàn")).not.toBeInTheDocument();
    client.clear();
  });

  it("offers a retry when the homepage API fails without showing sample products", async () => {
    const get = vi.spyOn(httpClient, "get").mockRejectedValue(new Error("Offline"));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter><HomeCollections /><HomeFeaturedPlants /></MemoryRouter>
      </QueryClientProvider>,
    );

    const featured = within(screen.getByRole("region", { name: LABELS.home.FEATURED_TITLE }));
    expect(await featured.findByRole("alert")).toHaveTextContent(LABELS.home.FEATURED_ERROR);
    expect(screen.getByText(LABELS.home.COLLECTION_ERROR)).toBeInTheDocument();
    expect(featured.queryAllByRole("img")).toHaveLength(0);
    get.mockResolvedValue({ data: [product] });
    fireEvent.click(featured.getByRole("button", { name: LABELS.home.RETRY }));
    expect(await featured.findByRole("img", { name: product.name })).toBeInTheDocument();
    client.clear();
  });

  it("preserves count and navigation links from pagination metadata", async () => {
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: page });
    const result = await productsApi.getProducts({ page: 2, page_size: 4 });
    expect(result).toMatchObject({ count: 25, next: page.pagination.next,
      previous: page.pagination.previous, results: [{ id: product.id, light_requirement: "LOW" }] });
  });

  it("accepts the unpaginated categories endpoint", async () => {
    const remoteCategory = { ...category, image_url: "/media/category.webp" };
    const localCategory = { ...category, id: "category-2", image_url: "/images/home/category-indoor.webp" };
    vi.spyOn(httpClient, "get").mockResolvedValue({ data: [remoteCategory, localCategory] });
    expect(await productsApi.getCategories()).toEqual({ count: 2, next: null,
      previous: null, results: [{ ...remoteCategory, image_url: "http://localhost:8001/media/category.webp" }, localCategory] });
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

  it("reads images and prices from current plant details", async () => {
    const detail = {
      id: "detail-1", sku: "KT-M", size: "M", height: "45.00",
      sale_price: "299000.00", rental_price: "0.00", status: "AVAILABLE",
      media: [
        { file_url: "/media/video.mp4", media_type: "VIDEO", is_primary: true, display_order: 0 },
        { file_url: "/media/secondary.webp", media_type: "IMAGE", is_primary: false, display_order: 0 },
        { file_url: "/media/primary.webp", media_type: "IMAGE", is_primary: true, display_order: 1 },
      ],
    };
    const apiPlant = {
      id: product.id, slug: product.slug, name: product.name, category: category.id,
      category_name: category.name, care_guide: "Tưới khi đất khô", care_level: "",
      light_requirement: "", is_active: true,
      details: [detail, { ...detail, id: "detail-2", sale_price: "0.00", media: [] }],
    };
    const get = vi.spyOn(httpClient, "get").mockResolvedValue({ data: apiPlant });

    expect(await productsApi.getProductDetail(product.slug)).toMatchObject({
      primary_image: "http://localhost:8001/media/primary.webp",
      care_instructions: "Tưới khi đất khô",
      care_level: undefined,
      min_sale_price_vnd: 299000,
      variants: [{ id: detail.id, size_display: "M", height_cm: 45, sale_price_vnd: 299000 },
        { id: "detail-2", sale_price_vnd: undefined }],
    });
    expect(get).toHaveBeenCalledWith(`/catalog/plants/${product.slug}/`);
  });
});
