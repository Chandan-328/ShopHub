# ShopHub

Modern e‑commerce experience showcasing curated products, fast browsing, and Supabase-backed data.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS with shadcn/ui
- Supabase (database + authentication)

## Getting Started

1. Ensure Node.js 18+ and npm are installed.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```

## Environment Variables

Create a `.env` (or `.env.local`) in the project root:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Deployment

Any static hosting provider that supports Vite builds will work (e.g., Netlify, Vercel, Cloudflare Pages, or traditional servers). Run `npm run build` and deploy the contents of the `dist` folder.

## Project Structure

- `src/pages` — top-level routes (home, cart, checkout, etc.)
- `src/components` — shared UI (navbar, cards, ratings)
- `src/integrations/supabase` — Supabase client and generated types
- `supabase/migrations` — SQL migrations for database schema, categories, and product catalog

## Testing Checklist

- Home page loads featured products
- Auth flow (sign in/out) works with Supabase
- Wishlist, cart, and checkout interactions behave as expected
- Supabase migrations apply cleanly on new environments
