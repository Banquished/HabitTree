# HabitTree

A full-stack habit tracking and body composition management platform. Track daily operations (habits), weight, nutrition (fuel intake), and run time-boxed "missions" with calorie/macro targets derived from your bio profile.

Built as an **npm/Turborepo monorepo** with a React web app, React Native mobile app, and a FastAPI backend backed by PostgreSQL.

## Architecture

```
habittree/
├── apps/
│   ├── webapp/        React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── mobile/        React Native (Expo 54) + NativeWind
│   └── backend/       Python 3.12 + FastAPI + SQLAlchemy 2 + asyncpg
├── packages/
│   ├── types/         Shared TypeScript type definitions
│   └── api-client/    Typed HTTP client consumed by both frontends
├── docker-compose.yml PostgreSQL 16 + API service
├── turbo.json         Turborepo task orchestration
└── package.json       Root workspace config
```

### Design System

The UI follows a **Technical Brutalism** design language (documented in [`DESIGN.md`](DESIGN.md)):

- Dark charcoal surfaces (`#0e0e0e`) with neon lime accents (`#ABFF02`)
- Zero border-radius, no divider lines — depth through tonal surface layering
- Dual-font: **Inter** for body, **Space Grotesk** for monospaced data labels
- Glassmorphism for overlays, CRT "scanline" texture headers

## Features

### Bio Calculator

User body profile (age, sex, weight, height, activity level) used to compute BMR → TDEE → target calories and macro splits. Supports custom TDEE overrides and calorie adjustments.

### Missions

Time-boxed cut/bulk/maintain plans with:

- Weekly milestones (target weight per week)
- Checkpoint tracking (actual vs target)
- Overlap detection — only one active mission at a time
- Full lifecycle: active → completed / abandoned

### Operations (Habits)

Trackable daily/weekly/specific-day habits with:

- Priority levels, categories, sort ordering
- Completion logging with timestamps and notes
- Aggregation endpoints: **heatmap** (date-range completion rates) and **daily summary**
- Soft-delete for templates (archive without losing history)

### Fuel Intake (Nutrition)

- Log individual food entries with macros (protein, carbs, fat)
- Food item library (macros per 100g)
- Recipe builder with ingredient composition
- Meal protocols (reusable meal templates)
- Source tracking (manual / food item / recipe / protocol)

### Weight Log

Time-series weight entries with optional notes. Drives the weight chart and mission checkpoint comparisons.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router v7, Zustand 5, TanStack Query 5, Recharts 3 |
| **Mobile frontend** | React Native 0.81, Expo 54, NativeWind 4, Expo Router |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2 (async), Pydantic v2 |
| **Database** | PostgreSQL 16 (via asyncpg) |
| **Tooling** | UV (Python), Turborepo, Alembic (migrations), Ruff (linting), Docker Compose |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and npm
- **Python** ≥ 3.12
- **UV** ([astral.sh/uv](https://docs.astral.sh/uv/))
- **Docker** (for PostgreSQL)

### Install

```bash
# Install JS dependencies (root + all workspaces)
npm install

# Install Python dependencies
cd apps/backend
uv sync
cd ../..
```

### Development

```bash
# Start everything (PostgreSQL + API + web app)
npm run dev

# Or individually:
npm run dev:db       # PostgreSQL via Docker Compose (port 5433)
npm run dev:api      # FastAPI dev server (port 8000)
npm run dev:web      # Vite dev server (port 5173)
npm run dev:mobile   # Expo dev server
```

### Database Migrations

```bash
cd apps/backend

# Apply migrations
uv run alembic upgrade head

# Create a new migration after model changes
uv run alembic revision --autogenerate -m "description"
```

### Build

```bash
npm run build        # Turborepo builds all packages + webapp
```

## API

All endpoints are versioned under `/v1`. The API serves camelCase JSON with Pydantic alias generators.

| Resource | Endpoints |
|----------|----------|
| **Bio Profile** | `GET /v1/bio-profile` · `PUT /v1/bio-profile` |
| **Missions** | `GET /v1/missions` · `GET /v1/missions/active` · `POST /v1/missions` · `PUT /v1/missions/:id` |
| **Weight** | `GET /v1/weight-entries` · `POST` · `PUT /:id` · `DELETE /:id` |
| **Fuel Entries** | `GET /v1/fuel-entries` · `POST` · `DELETE /:id` |
| **Food Items** | `GET /v1/food-items` · `POST` · `PUT /:id` · `DELETE /:id` |
| **Recipes** | `GET /v1/recipes` · `POST` · `PUT /:id` · `DELETE /:id` |
| **Meal Protocols** | `GET /v1/meal-protocols` · `POST` · `DELETE /:id` |
| **Operations** | Templates: `GET /v1/operations/templates` · `POST` · `PUT /:id` · `DELETE /:id` |
| | Logs: `GET /v1/operations/logs?date=` · `POST` · `PUT /:id` · `DELETE /:id` |
| | Aggregation: `GET /v1/operations/heatmap?start=&end=` · `GET /v1/operations/daily-summary?date=` |
| **Health** | `GET /` |

Interactive docs available at `/v1/docs` (Swagger UI) when running the API in dev mode.

## Project Structure

### `packages/types`

Shared TypeScript interfaces matching the API's camelCase JSON shape. Includes: `WeightEntry`, `BioProfile`, `BioResult`, `Mission`, `FuelEntry`, `FoodItem`, `Recipe`, `OperationTemplate`, `OperationLog`, `HeatmapDay`, `DailySummary`.

### `packages/api-client`

Generic typed HTTP client factory (`createApiClient(baseUrl)`) consumed by both the web and mobile apps. All requests are typed against `@HabitTree/types`.

### `apps/webapp`

Feature-based React SPA:

```
src/
├── app/         Layout, providers, bottom nav, sidebar, global stores
├── entities/    (reserved for shared domain types)
├── features/
│   ├── home/           Dashboard with mission tracker + habit heatmap
│   ├── bio-calc/       Bio profile form + TDEE analysis + mission creation
│   ├── weight-log/     Weight chart + entry management
│   ├── fuel-intake/    Daily/weekly macro tracking + food library + recipes
│   └── operations/     Daily habit checklist + template management
├── routes/      Centralized route definitions
├── shared/      Shared components (modal, date-utils, api-context)
└── test/        Test utilities
```

Each feature is self-contained with its own `api/` (TanStack Query hooks + Zustand stores), `components/`, and `page.tsx`.

### `apps/mobile`

Expo 54 app with NativeWind for styling. Currently in scaffolding phase with the Expo template structure. Shares the same design tokens (Tailwind config mirrors the web app's color palette) and depends on `@HabitTree/types` and `@HabitTree/api-client`.

### `apps/backend`

Domain-driven FastAPI backend:

```
app/
├── config.py     Pydantic settings (DATABASE_URL, CORS_ORIGINS)
├── database.py   Async SQLAlchemy engine + session factory
├── models/       SQLAlchemy ORM models (UUID PKs, JSONB for milestones/macros)
├── schemas/      Pydantic v2 schemas with camelCase alias generators
└── routers/      FastAPI route handlers
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://habittree:habittree@localhost:5432/habittree` | Async PostgreSQL connection string |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |

Set via `.env` file in `apps/backend/` or as environment variables.

## License

[MIT](LICENSE)
