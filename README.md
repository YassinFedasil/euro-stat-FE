# EURO-STAT frontend

React 19 + TypeScript + Vite + Tailwind CSS + ApexCharts.

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

Dev server: http://localhost:5173

## Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check (tsc -b) + production build
npm run preview   # preview the production build
npm run lint      # eslint
```

## Configuration

The API base URL comes from `VITE_API_URL` (see `src/config.ts`), defaulting to
`http://localhost:8000`. All backend calls go through `src/services/api.ts`.
