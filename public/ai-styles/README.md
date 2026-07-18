# AI style thumbnails

Curated images for the design-style picker on `/dashboard/ai-designs/new`.

- One image per style **id** returned by `GET /api/v1/ai/styles`, named `{id}.webp`.
- The style cards load `/ai-styles/{id}.webp`. A missing file degrades gracefully
  to a generated swatch, so the grid always looks intentional — add images as you
  get them, no code change needed.
- Recommended: 4:3 aspect, ~600×450, WEBP, representative of the style.

Current style ids (from the dev backend, `GET /ai/styles`):

    modern.webp
    minimalist.webp
    wabi-sabi.webp
    tropical.webp
    farmhouse.webp
    memphis.webp
    afro-minimalism.webp
    contemporary-african.webp
    industrial.webp
    bohemian.webp

Re-check the live list before finalising — the backend may add or rename styles.
