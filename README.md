# Wildlife Ops — Mziki Private Game Reserve

A high-fidelity operations dashboard for **Mziki Private Game Reserve**, a 6,000-hectare
Big Five reserve in KwaZulu-Natal, South Africa, part of the greater Munywana Conservancy
(alongside &Beyond Phinda and Zuka). Built as a product-design portfolio case study.

> Aesthetic: *Palantir meets National Geographic* — a serious operational tool that feels
> at home in the African bush.

## Tech stack

- **React 18** (functional components + hooks)
- **Vite** build tooling
- **Tailwind CSS** for layout
- **Recharts** for data visualisation
- **Lucide React** for icons
- Static / hardcoded mock data — no backend

## Develop locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Production build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploy

Deployed on Netlify. Build command `npm run build`, publish directory `dist`
(see [`netlify.toml`](./netlify.toml)). Every push to the default branch triggers
an automatic rebuild and deploy.
