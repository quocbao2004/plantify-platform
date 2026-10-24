export const STORAGE_KEYS = {
  ACCESS_TOKEN: "plantify_access_token",
  REFRESH_TOKEN: "plantify_refresh_token",
  USER: "plantify_user",
  THEME: "plantify_theme",
  NEWSLETTER_INTEREST: "plantify-newsletter-interest-v1",
} as const;

export { LABELS, PRODUCT_LABELS } from "./labels";
export { MESSAGES, VALIDATION_MESSAGES } from "./messages";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const CURRENCY = {
  CODE: "VND",
  SYMBOL: "₫",
  LOCALE: "vi-VN",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/accounts/login/",
    REGISTER: "/accounts/register/",
    REFRESH: "/accounts/refresh/",
    ME: "/accounts/me/",
    CHANGE_PASSWORD: "/accounts/change-password/",
  },
  CATALOG: {
    PRODUCTS: "/catalog/products/",
    CATEGORIES: "/catalog/categories/",
  },
  INVENTORY: {
    STOCK: "/inventory/stock/",
    PLANT_ASSETS: "/inventory/plant-assets/",
  },
  ORDERS: {
    CART: "/orders/cart/",
    CHECKOUT: "/orders/checkout/",
    ORDERS: "/orders/orders/",
  },
  RENTALS: {
    CONTRACTS: "/rentals/contracts/",
    EXTENSIONS: "/rentals/extensions/",
    INSPECTIONS: "/rentals/inspections/",
  },
  PAYMENTS: {
    INITIATE: "/payments/initiate/",
    DEPOSITS: "/payments/deposits/",
  },
  LOYALTY: {
    ACCOUNT: "/loyalty/account/",
    VOUCHERS: "/loyalty/vouchers/",
    CLAIM_VOUCHER: "/loyalty/vouchers/claim/",
  },
  REVIEWS: {
    LIST: "/reviews/",
  },
  CHATBOT: {
    CONVERSATIONS: "/chatbot/conversations/",
  },
  RECOMMENDATIONS: {
    FEED: "/recommendations/",
    TRACK_EVENT: "/recommendations/events/",
  },
  ADMIN: {
    SETTINGS: "/settings/admin/settings/",
    AUDIT_LOGS: "/settings/admin/audit-logs/",
  },
} as const;
