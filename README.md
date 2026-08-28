# hiAnzy — Brand Operating Systems

The marketing site for **hiAnzy**, a Business Systems & Transformation Consultancy. Strategy, brand, technology, growth and operations look like separate departments until you realise they're all working on the same business — the site's job is to make that argument, then make it easy to act on.

Full-stack: a React frontend with three.js/WebGL scenes, GSAP-driven motion and a light/dark theme system, backed by a FastAPI + MongoDB API for case studies, insights, network listings, and the contact/subscribe flow.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Create React App + [craco](https://craco.js.org/), Tailwind CSS 3, React Router 6 |
| Motion | GSAP + ScrollTrigger, [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll, Framer Motion |
| 3D | three.js, [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei) |
| Backend | FastAPI, Motor (async MongoDB driver), Uvicorn |
| Data | MongoDB |
| Infra | Docker Compose (nginx-served static frontend + API + Mongo) |

## Features

- **Content-driven pages** — What We Do, How We Work, Work (case studies), Network, Why hiAnzy, Insights, all served from the API rather than hardcoded.
- **Three.js scenes** — a hero visualization on the homepage and a network constellation, both gated behind WebGL/reduced-motion checks with static SVG fallbacks so nothing ever ships a blank frame.
- **Package builder** — an interactive service picker (175+ modules across 6 categories) that composes a brief and hands it straight to the contact form.
- **Light/dark theme** — a real night mode, not an inverted filter: a separate palette pass with the [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions/) for the toggle's circular reveal, falling back to an instant swap where unsupported.
- **Command palette**, deck-motif illustrations, magnetic buttons, scroll-triggered reveals, and a full responsive pass from 320px to 2560px.
- **Accessibility & SEO baked into the build** — a `prebuild` step checks every Tailwind opacity modifier against the design system's scale, verifies the `Seo` component emits the required meta/OG/JSON-LD blocks, and regenerates `sitemap.xml`, so a regression fails the build instead of shipping.

## Project structure

```
hi-anzy-website/
├── frontend/               React app (CRA + craco)
│   ├── src/
│   │   ├── pages/          Route-level pages
│   │   ├── components/     Shared UI, deck motifs, three.js scenes
│   │   ├── lib/            API client, motion/animation helpers
│   │   └── data/           Static content (categories, capabilities)
│   ├── scripts/            Build-time gates (opacity scale, SEO, sitemap) + dark-mode generator
│   └── public/
├── backend/                 FastAPI service
│   ├── server.py            Routes: case studies, insights, network, contact, subscribe, analytics
│   └── seed_data.py         Seeds MongoDB with initial content
├── docker-compose.yml        web (nginx) + api (uvicorn) + mongo
└── tests/                    Backend test suite
```

## Getting started

### Local dev (frontend + backend running separately)

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env        # fill in your own values — see below
uvicorn server:app --reload --port 8001

# Frontend, in a second terminal
cd frontend
npm install
cp .env.example .env
npm start                    # http://localhost:3000
```

### Docker (matches production)

```bash
cp .env.docker.example .env  # fill in your own values
docker compose up -d --build
```

Brings up nginx-served static frontend on `127.0.0.1:8080`, the API on `127.0.0.1:8010`, and MongoDB (internal only). See `docker-compose.yml` for the exact port mapping.

### Environment variables

Every `.env` this project reads has a matching `.env.example` beside it (repo root, `backend/`, `frontend/`) — copy it and fill in your own values. **Nothing in this repo ships real credentials**; the actual `.env` files are gitignored. You'll need, at minimum, a MongoDB connection string for the backend and the API's base URL for the frontend; check the `.env.example` files for the full list (email delivery, analytics, etc. are optional).

## Scripts

| Command | What it does |
|---|---|
| `npm start` (frontend) | Dev server with hot reload |
| `npm run build` (frontend) | Runs the opacity/SEO/sitemap gates, then a production build |
| `npm run check:opacity` | Just the opacity-scale check |
| `npm run check:seo` | Just the SEO-output check |
| `python scripts/gen-dark.py` (frontend) | Regenerates the dark-mode CSS from the colour utilities actually in use |
| `uvicorn server:app --reload` (backend) | Dev server with hot reload |
| `pytest` (repo root, `tests/`) | Backend test suite |

## License

Private and unlicensed — all rights reserved. Not for reuse without permission.
