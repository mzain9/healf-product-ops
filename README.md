# Healf — Health & Wellness Product Manager

A modern product operations and inventory management application for health and wellness products. Manage products, owners, stock levels, and view analytics from a single dashboard with light and dark theme support.

---

## Project overview

**Healf Product Ops** is a full-stack web application for catalog and inventory management. It provides:

- **Dashboard** — Overview with status distribution, low-stock alerts, recent products, and charts (products by owner, over time).
- **Products** — List with filters and search, create/edit product forms, and product detail views.
- **Owners** — Product owner management and association with products.
- **Theming** — System/light/dark mode via `next-themes`.

---

## Tech stack

| Category        | Technology |
|----------------|------------|
| **Framework**  | [Next.js](https://nextjs.org/) 16 (App Router) |
| **Language**   | TypeScript |
| **Database**   | PostgreSQL with [Prisma](https://www.prisma.io/) ORM |
| **UI**         | React 19, [Tailwind CSS](https://tailwindcss.com/) 4, [Radix UI](https://www.radix-ui.com/) (shadcn/ui) |
| **Forms**      | React Hook Form, Zod validation |
| **Charts**     | Recharts |
| **Analytics**  | Vercel Analytics (optional) |

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** (or npm / yarn)
- **PostgreSQL** (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or local install)

---

## How to run

### 1. Clone and install

```bash
git clone <repository-url>
cd healf-product-ops
pnpm install
```

### 2. Environment variables

Copy the example env file and set your database URL:

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string, for example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

### 3. Database setup

Generate the Prisma client and apply migrations (and optionally seed data):

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

- `db:generate` — generates Prisma Client from `prisma/schema.prisma`
- `db:push` — applies migrations to the database
- `db:seed` — runs `prisma/seed.ts` to populate sample products and owners

### 4. Start the app

**Development:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
pnpm build
pnpm start
```

---

## Available scripts

| Script        | Description |
|---------------|-------------|
| `pnpm dev`   | Start Next.js dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm lint`  | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Apply migrations to DB |
| `pnpm db:seed` | Seed database |

---

## File structure

```
healf-product-ops/
├── app/
│   ├── api/
│   │   ├── owners/
│   │   │   └── route.ts          # GET owners API
│   │   └── products/
│   │       ├── route.ts          # GET (list) / POST (create)
│   │       └── [id]/
│   │           └── route.ts      # GET / PATCH / DELETE single product
│   ├── layout.tsx                # Root layout, theme, sidebar
│   ├── page.tsx                  # Dashboard (home)
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── owners/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── products/
│       ├── page.tsx              # Products list
│       ├── products-content.tsx  # List + filters client component
│       ├── new/
│       │   └── page.tsx          # New product form
│       └── [id]/
│           ├── page.tsx          # Product detail
│           ├── loading.tsx
│           └── edit/
│               ├── page.tsx      # Edit product form
│               └── loading.tsx
├── components/
│   ├── dashboard/
│   │   ├── status-donut.tsx
│   │   ├── low-stock-alerts.tsx
│   │   ├── recent-products.tsx
│   │   ├── products-by-owner-chart.tsx
│   │   └── products-over-time-chart.tsx
│   ├── ui/                       # shadcn-style components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── product-form.tsx
│   ├── products-table.tsx
│   ├── products-filters.tsx
│   ├── sidebar.tsx
│   ├── theme-toggle.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── api-response.ts
│   ├── product-validation.ts
│   ├── product-serializer.ts
│   ├── products.ts
│   ├── products-api-query.ts
│   ├── owners.ts
│   ├── dashboard.ts
│   ├── slug.ts
│   ├── currency.ts
│   ├── constants.ts
│   └── utils.ts
├── hooks/
│   └── use-owners.ts
├── prisma/
│   ├── schema.prisma             # DB schema (Product, ProductOwner)
│   └── seed.ts                   # Seed data
├── .env.example
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── components.json
├── package.json
└── README.md
```

---

## UI screenshots

### 1. Dashboard — Light theme

![Dashboard — Light theme](./docs/screenshots/dashboard-light.png)

### 2. Dashboard — Dark theme

![Dashboard — Dark theme](./docs/screenshots/dashboard-dark.png)

### 3. Products list

![Products list](./docs/screenshots/products-list.png)

### 4. Product edit page

![Product edit page](./docs/screenshots/product-edit.png)

### 5. Product detail page

![Product detail page](./docs/screenshots/product-detail.png)

---

## Environment variables

| Variable       | Description |
|----------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required). Example: `postgresql://user:password@localhost:5432/healf` |

See `.env.example` for a template.

---
