# Maulworks

Personal portfolio of Maulana Raji Shofil Fuadi, built with Next.js 14 (App Router), Tailwind CSS and Motion.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Portfolio content lives in `app/data/portfolio.ts`. Design and engineering conventions are documented in [MAULWORKS_DESIGN_DNA.md](MAULWORKS_DESIGN_DNA.md).

Set `NEXT_PUBLIC_BASE_URL` to override the site URL used for metadata, `robots.txt` and the sitemap (defaults to `https://maulworks.vercel.app`).
