# Imbecis UI

Frontend for the Imbecis platform, focused on documenting and reporting abusive parking in Portugal.  
The app combines citizen reports, community voting, and plate history to surface repeated offenders.

## What the product does

- Lets users submit a parking abuse report with photo + geolocation.
- Sends reports into a review queue where other users vote/classify them.
- Builds a searchable history of confirmed abusive plates.
- Provides operational pages for report curation and notification regions.

In practice, the core business loop is:
1. **Report** (`/adicionar`)
2. **Review/Vote** (`/votar`)
3. **Confirm + Expose history** (`/matriculas`, `/procurar`)

## Tech stack

- **Framework:** SvelteKit + Svelte 4 + TypeScript
- **Build tooling:** Vite
- **UI:** Tailwind CSS + Flowbite Svelte (+ Flowbite icons)
- **Maps/geospatial:** Leaflet ecosystem (`leaflet`, `leaflet-draw`, `leaflet.heat`, `leaflet-editable`)
- **HTTP:** Axios (service layer) + SvelteKit `fetch` in route loaders
- **Deployment target:** Cloudflare adapter (`@sveltejs/adapter-cloudflare`)

## Project structure

```text
src/
  routes/        # File-based pages and route-level data loading
  lib/
    components/  # Shared UI pieces (camera, maps, nav, loader, etc.)
    stores/      # Lightweight Svelte stores (loading, location, notifications)
    utils/       # Constants and helper functions
    api.ts       # Main API client for reports/plates/voting
    reportsApi.ts / regionsApi.ts  # Operations-oriented API modules
static/          # Static assets + SEO files (robots/sitemaps)
```

## Main routes and responsibilities

- `/` - feed of reports with paging/filtering.
- `/adicionar` - create a new report and upload its picture.
- `/votar` - fetch a report for review and submit vote/plate details.
- `/procurar` - search plate information.
- `/matriculas` and `/matriculas/[country]/[plate]` - browse and inspect confirmed plate history.
- `/mapa` - map-based visualization.
- `/reports` and `/reports/[id]` - operational report management/editing.
- `/regions` - notification region management.
- `/sobre` (and `/sobre/mais`) - product/about pages.

## Data flow and business logic

### 1) Device identity and request context

- On app boot, layout ensures a `deviceUUID` is stored in `localStorage`.
- API calls use this value via `device-uuid` header to identify request origin.
- Some routes/pages that depend on browser-only behavior run with SSR disabled.

### 2) Reporting flow

- User captures/selects an image and location.
- UI calls `createReport(...)` first (metadata + location).
- On success, UI calls `uploadPicture(...)` for the binary image.
- Optional reporter information can be attached based on user choice.

### 3) Voting flow

- UI requests one candidate report with `getReportForReview()`.
- User submits decision using `submitReportVote(...)` with plate info and verdict.
- API handles anti-abuse constraints (for example, rate-limit responses).

### 4) Search and history flow

- Plate lookup uses country + plate number.
- Plate detail pages fetch both plate metadata and associated reports.
- Paginated plate listing supports browsing confirmed offenders over time.

### 5) Operational/curation flow

- Dedicated pages allow report listing, single-report edits, and related map/region operations.
- These paths support moderation and downstream notification workflows.

## API integration model

- `src/lib/api.ts` is the main client module for:
  - feed retrieval
  - report creation/picture upload
  - review/vote submission
  - plate lookup and plate report retrieval
- Base URL is configurable through `VITE_API_BASE_URL` (falls back to `http://localhost:3000`).
- CSRF token is captured from response headers and reused for mutation endpoints that require it.

## State management

This app uses simple Svelte stores (no global state framework):

- `isLoading` + `loadingMessage` for UX feedback.
- `location` for coordinates used in reporting.
- notification store for transient UI notifications.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Create `.env` from `.env.example`
   - Set `VITE_API_BASE_URL` to the backend base URL
3. Run dev server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run preview` - preview built app
- `npm run check` - Svelte/TypeScript checks
- `npm run lint` - Prettier check + ESLint
- `npm run format` - format repository with Prettier

## Quality and conventions

- Type safety via TypeScript + `svelte-check`.
- Linting with ESLint (Svelte + TypeScript plugins).
- Formatting via Prettier (+ Svelte plugin).
- Static assets and SEO descriptors live in `static/` and are served as-is.