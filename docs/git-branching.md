# Git branching

## Chosen model: **`main` = Astro (deployed); `vanilla` = preserved snapshot**

| Branch | Role |
|--------|------|
| **`main`** | Current Astro + Vue site. GitHub Pages deploys from this branch. |
| **`vanilla`** | Frozen snapshot of the earlier static HTML/CSS/JS prototype. Do not delete. |
| **`astro`** | Historical migration working branch (source of the Astro work before promotion to `main`). |

## Why this (not “main stays vanilla”)

- GitHub Pages / Actions expect the deployable site on **`main`**.
- The vanilla prototype must stay recoverable without blocking deploys → dedicated **`vanilla`** branch.
- Documented choice for this repo: promote Astro to `main`, keep vanilla as `vanilla`.

## Workflow

1. Preserve vanilla: `git branch vanilla main` (from the pre-Astro `main` tip) before overwriting `main`.
2. Point `main` at the Astro tree (merge `astro` → `main`, or reset `main` to match `astro` without force-pushing remote history that others rely on).
3. Push `main` and `vanilla` to `origin`.
4. Deploy runs on push to `main` (see `.github/workflows/deploy.yml`).

## Not ignored (must stay in history)

- `public/assets/img/` — site images are part of the project and must be tracked.
