# Tuki Tales — Marketing Website

A marketing website for the **Tuki Tales** YouTube channel — Hindi Nursery Rhymes & Kids Poems for ages 1-6.

**Live site:** https://tukitales.netlify.app/

## Tech Stack

- Pure static HTML / CSS / JavaScript (no build step)
- Auto-deployed by Netlify from the `main` branch of this repo
- Mobile-responsive, kid-friendly design
- Lazy-loaded YouTube thumbnails + modal video player
- SEO meta tags + Open Graph + Twitter cards

## File Structure

```
tuki-tales/
├── index.html       # Main marketing page
├── styles.css       # Styles (pink/yellow kid-friendly palette)
├── app.js           # Video grid renderer + modal player
├── netlify.toml     # Netlify deploy config
├── _redirects        # Netlify redirect rules
├── README.md         # This file
└── LICENSE           # MIT
```

## Local Development

Just open `index.html` in a browser. No build step, no dependencies.

Or, to run a tiny local server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

Push to `main` — Netlify auto-deploys within ~30 seconds.

## Channel

- **YouTube:** https://www.youtube.com/@Tuki-Tales
- **Channel ID:** UCn1SrgsVonl3OUb9m5oM_vw
- **Content:** Hindi Nursery Rhymes, Kids Poems, Cartoon Videos for ages 1-6
