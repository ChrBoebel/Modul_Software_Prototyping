# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React + Vite application source.
  - `src/App.jsx` wires the main layout and view switching.
  - `src/components/` is feature‑based (e.g., `dashboard/`, `leads/`, `lm-flows/`, `leadjourney/`, `layout/`, `ui/`). Keep new UI close to its feature folder.
  - `src/hooks/` holds reusable hooks (pattern: `useX.js`, e.g., `useToast.js`).
  - `src/data/` stores mock JSON and helpers (`*.json`, `mockData.js`). Treat as demo data unless stated otherwise.
  - `src/theme/` centralizes JS color constants for charts; keep in sync with CSS tokens.
- `public/` is for static assets served as‑is (currently `stadtwerke-logo.svg`).
- `index.html` is the Vite entry point; `dist/` is build output (do not edit manually).

## Build, Test, and Development Commands
- `npm install` installs dependencies (repo uses `package-lock.json`, so prefer npm).
- `npm run dev` starts the local Vite dev server (default: `http://localhost:5173`).
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build for smoke checks.

## Coding Style & Naming Conventions
- Use 2‑space indentation, single quotes, and semicolons to match existing `.jsx` files.
- React components: PascalCase file/class names (e.g., `DashboardView.jsx`), exported as default or named.
- Folder names follow existing kebab‑case or German feature names; keep terminology consistent.
- CSS lives in `src/index.css`. Follow `styleguide.md` and prefer design tokens like `var(--swk-red)` over hard‑coded hex in components. Use `src/theme/colors.js` only when JS needs a palette (e.g., Recharts).

## Testing Guidelines
There is no automated test suite configured yet. If you add tests, introduce them with a clear PR and use `*.test.jsx` naming near the feature they cover.

## Commit & Pull Request Guidelines
- Commit messages largely follow Conventional Commits: `feat: …`, `chore: …`, optional scope like `chore(css): …`. Keep subjects imperative and under ~72 chars.
- PRs should be small and focused. Include a brief description, link related issues, and add screenshots or GIFs for UI changes. Ensure `npm run build` succeeds before requesting review.
