# 🛒 ShopLite — Product Listing & Detail App

A React + TypeScript e-commerce application built as part of the Leegality Frontend Engineer Assessment. It displays products from the [DummyJSON API](https://dummyjson.com/docs/products) with filtering, pagination, and a product detail view.

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd amazon-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other Commands

```bash
npm run build      # Production build (outputs to /dist)
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

---

## Assumptions Made

1. **All products fit within a single API call.** DummyJSON exposes 194 products total. A single `GET /products?limit=200` fetch retrieves the full catalogue, making client-side filtering accurate without multiple round-trips.

2. **Category selection is single-select.** The assessment did not specify single vs. multi-select for categories. Single-select was chosen to keep the UX intuitive — selecting a category fetches that category's products from the API, and deselecting returns to the full catalogue.

3. **Brand selection is multi-select.** Brands are secondary filters applied on top of the already-fetched product list, so allowing multiple brand selections makes more sense for the user.

4. **Price filter applies on "Apply" click.** Applying price on every keystroke would cause excessive re-renders while typing. The explicit Apply button (also shown in the assessment's reference UI) gives users control over when the filter fires.

5. **Brands are derived from the currently visible category.** When a category is selected, only that category's brands are shown in the Brand filter. Changing the category resets the selected brands to avoid stale cross-category selections.

6. **Product navigation on the detail page** uses the list of product IDs from the last listing page visit. This lets users browse Previous / Next through results without going back to the listing page.

7. **No authentication or cart functionality** was implemented — the cart and user icons in the header are decorative, matching the reference UI.

---

## Architectural Decisions

### State Management — React Context
Filter state (`category`, `brands`, `minPrice`, `maxPrice`), the current page number, and the current page's product ID list are stored in a single `FilterContext` that wraps the entire app. This means filters survive navigation to the detail page and back — no URL query-string encoding or external state library needed.

### Data Fetching — Custom Hook (`useProducts`)
All product-fetching logic lives in `useProducts`. It accepts `filters` and `page` as inputs and returns `products`, `totalPages`, `loading`, `error`, and `allBrands`. The hook:
- Fetches by category from the API when a category is selected, or fetches all products otherwise.
- Applies brand and price filters client-side on the fetched array.
- Uses `AbortController` to cancel in-flight requests when filters change quickly, preventing stale data races.

### Component Breakdown

| Component | Responsibility |
|---|---|
| `Header` | Search input, navigation, icon strip |
| `FilterPanel` | Category, price range, and brand filters |
| `ProductGrid` | Renders product cards or skeleton/error/empty states |
| `ProductCard` | Single card — image, title, price, rating |
| `StarRating` | Reusable filled/half/empty star display |
| `Pagination` | Page buttons with ellipsis for large page counts |

### Styling — Tailwind CSS v4
CSS Modules were migrated to Tailwind CSS v4 (`@tailwindcss/vite`). Utility classes are applied inline with no separate stylesheet per component, reducing context-switching and keeping styles co-located with markup.

### Layout — Viewport-locked, No Page Scroll
The listing page is locked to `100vh`. Only the FilterPanel aside scrolls (`overflow-y-auto`) when the filter list overflows. The product grid area never scrolls — pagination handles navigation between pages. This prevents the awkward experience of the page scrolling past the header.

### Performance
- `React.memo` wraps every component to prevent unnecessary re-renders.
- `useCallback` and `useMemo` are applied to event handlers and derived data in `ProductListingPage`.
- Product images use `loading="lazy"` with an opacity-fade-in on load.
- The `fetchProducts` call uses `select=` to fetch only the fields needed for the listing page, keeping the payload small.

---

## Improvements If Given More Time

1. **URL-synced filters.** Encode active filters and page number in the URL (`?category=smartphones&page=2`). This makes filtered views shareable and preserves state on hard refresh.

2. **Debounced search.** The header search currently filters the visible page only. A proper debounced search against the API (`/products/search?q=...`) would search the full catalogue.

3. **Virtualised grid.** For very large product lists, rendering all cards at once can be slow. `react-virtual` or a similar windowing library would render only the visible rows.

4. **Optimistic skeleton count.** The loading skeleton always renders 8 cards. Storing the last known `ITEMS_PER_PAGE` count and rendering that many skeletons would reduce layout shift between pages.

5. **Error retry.** The current error state just shows a message. A Retry button that re-triggers the fetch would improve resilience against transient network failures.

6. **Accessibility.** Add `aria-label` attributes to icon buttons, `aria-current="page"` to the active pagination button, and keyboard-navigable filter checkboxes with proper focus management.

7. **Unit and integration tests.** `useProducts`, `FilterContext`, and the filter combination logic are good candidates for unit tests. Component rendering tests with React Testing Library would cover the grid, pagination, and filter panel.

8. **PWA / offline support.** Cache the product catalogue with a service worker so the app remains usable on slow or intermittent connections.
