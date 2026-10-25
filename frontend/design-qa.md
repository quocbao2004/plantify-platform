# Homepage design QA

final result: passed

## Visual source and implementation

- Source: `C:/Users/ADMIN/AppData/Local/Temp/codex-clipboard-381b49ab-9a3b-4bfe-bb49-05675482043d.png`.
- Local page: `http://127.0.0.1:3001/`.
- Screenshots and comparisons: `C:/Users/ADMIN/.codex/visualizations/2026/10/24/01a16cbf-baf8-7f30-bf77-552d27f8599f/`.
- Final desktop: `homepage-desktop.png`. Preview: `homepage-preview.png`.
- Mobile: `homepage-mobile.png`, `homepage-mobile-320.png`. Tablet: `homepage-tablet.png`.
- Combined visual evidence: `homepage-comparison.jpg` (source on left, implementation on right); `homepage-hero-comparison.jpg` (source above implementation).
- Source raster: 498 × 900. Removed the supplied image's 5px left border and 1px top border to compare the actual page at 493 × 899.
- Desktop CSS viewport: 1440 × 1000, density 1. Final full-page raster is 1434 × 2619 (scrollbar excluded by browser capture). Normalized proportionally to 493 × 900; no content stretching.
- Additional CSS widths checked: 320, 390 and 768. Mobile uses stacked hero and care banner, two-column collection/product grids, and a collapsible navigation.
- State: homepage, all products selected, signed out, no product dialog, no favorites selected. Form validation and focus states were tested separately.

## Findings and fixes

No remaining actionable P0/P1/P2 findings in the homepage scope.

1. [P2, resolved] Hero text sat approximately 25px too low at desktop size. Changed `.hero-copy` to start alignment and adjusted the display heading to match the source's line lengths. The final full-view and focused comparisons confirm alignment.
2. [P2, resolved] Product prices became uneven when descriptions wrapped at narrow widths. Made product cards and their copy flex columns and pushed price rows to the bottom. At 320px, the two cards in each row have equal price-row positions.
3. [P2, resolved] Storefront CSS import order caused PostCSS to omit the stylesheet in the initial production build. Moved the import before Tailwind directives. Production output now includes the storefront styles with no import-order warning.
4. [P2, resolved] Header search/category links originally could not initialize catalog filters. Catalog now reads/writes URL search parameters; verified searching for Kim tiền navigates with the matching input value.
5. [P3, resolved] React 18 warned about `fetchPriority`. Replaced that prop with eager loading for the hero.
6. [P3, resolved] A negatively positioned skip link could appear in full-page captures while scrolled. Replaced offscreen placement with a clipped, keyboard-revealed link.

## Fidelity surfaces

- Typography: Lora for display headings and brand, Be Vietnam Pro for Vietnamese UI/body copy. Checked the actual rendered family, headline wrapping, weights, smaller captions and four-column information density against the reference.
- Layout rhythm: matched the split hero (46.5%/53.5%), 580px hero height, 98px benefits strip, contained four-column grids, filter pills, image proportions, care banner and four-column desktop footer. The normalized full-page height differs from the source by about 1px.
- Colors/tokens: dark botanical green text, sage hero/care backgrounds, white page, muted supporting copy, thin neutral borders and green actions. Source palette and foreground/background balance retained.
- Images: ten locally served WebP photos, generated from the supplied reference's art direction. Subjects, ceramic pots, materials, light and crops match the intended roles. Exact source photographs were not provided; recreated photographic compositions are an expected asset-level variation. All images loaded; no remote image placeholders.
- Content: retained the source's brand, hero, collection headings, product names/prices, featured heading and care headline. Footer help/contact copy uses functional information dialogs instead of inventing a telephone number.

## Interaction and accessibility checks

- Easy-care filter shows three curated items; desktop filter shows two; all filter restores four.
- Favorite button updates `aria-pressed`, persists through reload, and was reset after testing.
- Quick-view dialog renders price/care details, traps focus using native dialog, closes with Escape, and restores trigger focus.
- Search dialog submits to catalog with the query retained in the catalog input.
- Mobile menu opens/closes and exposes navigation; homepage anchors and existing catalog/account/cart routes remain wired.
- Care guide opens with working native disclosure controls.
- Empty newsletter submission is rejected by native required/email validation.
- No horizontal overflow at 320, 390, 768 or 1440px. All ten homepage photos load successfully.
- Latest console check: no new React/application errors; the existing React Router v7 future-flag warning remains.

## Comparison history

- Initial combined evidence: `homepage-comparison-before.jpg`; initial desktop capture: `homepage-desktop-before.png`. Hero copy and indoor collection image required refinement.
- Updated hero alignment/type and replaced the reused hero thumbnail with the dedicated indoor photo. Recaptured and inspected `homepage-comparison.jpg` and the focused hero comparison together with the reference.
- Checked mobile/tablet captures, resolved price alignment and skip-link capture artifact, then recaptured the final desktop. The final combined comparison confirms all source sections, proportions and layout rhythm.

## Validation and limits

- `npm run build`: passed.
- `npm test -- --run`: passed, 2 existing currency-format tests.
- `git diff --check`: passed.
- Existing catalog API integration remains; four curated display products are shown when the API has no results or is unavailable. A populated backend purchase/checkout flow is outside this homepage task and was not verified.
- Newsletter interest is stored locally only; no mailing service was added or email sent.
- Asset paths and generation prompts: `public/images/home/README.md`. Generated with the built-in image tool, encoded to WebP quality 87, total image payload approximately 2.14 MB.

## Implementation checklist

- [x] Update existing Header, Footer, MainLayout and ProductCard.
- [x] Compose homepage from reusable hero, collections, featured plants and care components.
- [x] Integrate all local optimized images.
- [x] Match desktop layout and check responsive behavior.
- [x] Verify primary homepage interactions and build.

## Follow-up polish

- Exact original photographs and font files can replace recreated assets if provided later.
- An actual newsletter service can replace the local interest form when required.

## Common component refactor — 2026-10-24

The user requested shared controls across the frontend, constants for labels, toast notifications, and a gray footer. The footer color change intentionally supersedes the original white-footer reference.

- Shared controls: ButtonCommon, LinkCommon, TextFieldCommon, SelectCommon, FormCommon, ModalCommon and ToastCommon. Native form controls occur only inside common primitives, excluding test fixtures.
- Application copy lives in constants/labels.ts and constants/messages.ts; existing catalog content remains in feature constants.
- Global toast host is mounted once. Query/mutation notifications are centralized; auth, favorites, newsletter and validation use the same notification service.
- Compatibility exports for legacy Button/Input/Modal/StoreDialog delegate to the common components.
- Refactor evidence: common-refactor-footer.png, common-refactor-footer-toast.png and common-refactor-mobile.png in the visualization directory listed above.
- Browser verified: favorite add/remove toasts; invalid login/register and newsletter form toasts; search-to-catalog value persistence; three accessible filter dropdowns; care-level selection in the URL; newsletter local save success; mobile menu and modal open/close.
- Mobile 390px: no horizontal overflow, no missing images, no nested anchor/button controls. Footer computed background is rgb(242, 243, 240). No new application console errors in the final check.
- Automated tests: all 11 passed (2 existing and 9 new). New tests cover button default type/loading, unique field IDs and error descriptions, select forwarding, one validation toast with focus, duplicate submit protection, semantic links, and login API/error-notification integration using mocks.
- Production build passed. Vite reports the current main chunk is over its 500kB advisory threshold; no build errors.
- The newsletter remains a local-interest form without a mailing integration. No external email was sent.
