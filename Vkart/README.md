# Vkart — Grocery E‑commerce Storefront

Premium grocery & daily essentials storefront built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Drizzle ORM**, and **PostgreSQL**.

## Features

- Product catalog with categories, tags, collections, ratings & reviews
- Shop page: search, category/collection filters, price range, sorting
- Product detail with image gallery, related products, reviews
- Cart (localStorage) + checkout flow + order API
- **Wishlist** (localStorage) — heart on product cards & detail, drawer in header
- Responsive, editorial UI with Inter + Playfair Display

## Bug fixes in this branch

1. **Next.js Image remote host** — Unsplash product images failed without `images.remotePatterns` in `next.config.ts`.
2. **Missing image fallbacks** — Product cards/gallery no longer crash when `images` is empty; SVG placeholders are used.
3. **Missing logo asset** — Added `public/logo-mark.svg` and pointed metadata/header at it.
4. **Search control** — Header search now links to `/shop`.

## New feature: Wishlist

- Heart button on every product card and product detail page
- Persisted in `localStorage` (`vkart-wishlist-v1`)
- Header badge + slide-over drawer
- Move item to cart or clear list from the drawer

## Setup

```bash
npm install
cp .env.example .env   # set DATABASE_URL
# run migrations / seed (see drizzle + src/db/seed.ts)
npm run dev
```

Required env:

```
DATABASE_URL=postgresql://user:pass@host:5432/vkart
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Stack

- Next.js App Router
- Drizzle ORM + `pg`
- Tailwind CSS v4
- Client cart & wishlist providers

## Project structure

```
src/
  app/           # routes (home, shop, product, checkout, api)
  components/    # cart, wishlist, layout, ui
  db/            # schema, seed, client
  lib/           # product DTOs & queries
public/          # logo & static assets
```

---

Part of [first-year-Project](https://github.com/buildwith-vaibhav/first-year-Project) — branch `feature/vkart-storefront`.
