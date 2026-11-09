# jacobwinickdesigns.com

Personal portfolio of Jacob Winick, drawn as an engineering drawing set ("Sheet A-001").

- **Stack:** Astro (static), TypeScript, hand-written CSS, inline SVG. No UI framework.
- **Content:** projects live in `src/content/work/*.md` (schema in `src/content.config.ts`); résumé data in `src/data/resume.ts`; plot data in `src/data/figures.json`.
- **Dev:** `npm install && npm run dev` → http://localhost:4321
- **Deploy:** push to `main`; GitHub Actions builds and publishes to GitHub Pages (`.github/workflows/deploy.yml`).

To add a project: copy a file in `src/content/work/`, give it the next drawing number in its series (100 research, 200 software, 300 builds), and push.
To add a revision: append to `revisions` in `src/data/resume.ts`.
