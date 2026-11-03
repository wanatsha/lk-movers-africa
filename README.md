# LK Movers Africa

Static relocation and logistics website. Deploy the `dist` directory from `main` with Cloudflare Pages. No build command is required.

Preview locally with `node serve.cjs` (http://localhost:5644).

When CSS or JS changes, bump the `?v=` token on the `style.css` and `app.js` links in `dist/index.html` so browsers fetch the new files.
