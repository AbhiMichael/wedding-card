# Aisha & Rohan — Scroll Sequence Wedding Site

An Apple-product-page-style scroll experience, built as a Vite + React
project: as the visitor scrolls, a 241-frame JPEG sequence plays back
frame-by-frame on a full-screen `<canvas>`, pinned to the viewport with
`position: sticky`. No external animation/scroll libraries — just
canvas, `requestAnimationFrame`, and `requestIdleCallback`.

## Files

```
wedding-scroll-sequence/
├── index.html          ← Vite's HTML entry (just mounts React — not the old standalone file)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx         ← mounts <App />
│   └── App.jsx           ← the scroll-sequence component (all the logic lives here)
├── public/
│   └── images/            ← put frame_01.jpg … frame_241.jpg here
└── README.md
```

## 1. Install dependencies

```bash
cd wedding-scroll-sequence
npm install
```

## 2. Add your images

Copy your 241 JPEGs straight into `public/images/`, so they sit at:

```
public/images/frame_01.jpg
public/images/frame_02.jpg
...
public/images/frame_241.jpg
```

Vite serves everything in `public/` from the site root untouched, so
`public/images/frame_01.jpg` is reachable at `/images/frame_01.jpg` —
which is exactly what `src/App.jsx` requests. Nothing else to wire up.

## 3. Run it

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) —
open that and scroll.

For a production build:

```bash
npm run build     # outputs to dist/
npm run preview   # serves that build locally to sanity-check it
```

## 4. How the scroll → frame mapping works

- `.wc-track` is **400vh** tall — that's the total scroll distance the
  sequence plays across. Make it taller (e.g. `600vh`) to slow the
  animation down, or shorter to speed it up. It's set in the `<style>`
  block inside `App.jsx`.
- `.wc-stage` is `position: sticky; top: 0; height: 100vh`, so it stays
  pinned to the screen while its 400vh parent scrolls underneath it.
- On every scroll event, `computeScrollProgress()` measures how far the
  track has scrolled past the top of the viewport, turns that into a
  0–1 progress value, and maps it directly onto frame numbers 1–241
  with `Math.round(progress * (FRAME_COUNT - 1)) + 1`.
- Drawing happens inside `requestAnimationFrame` (`renderLoop`), so the
  canvas is only ever repainted once per browser frame no matter how
  many scroll events fire.

## 5. How the loading strategy works

1. `frame_01.jpg` is fetched immediately on mount and painted the
   moment it's ready — that's what the visitor sees first.
2. The loading screen hides as soon as frame 1 is on screen; the
   visitor can start scrolling right away.
3. Frames 2–241 load in the background in **chunks of 10**, scheduled
   with `requestIdleCallback` so they never compete with scrolling or
   rendering for main-thread time.
4. Safari doesn't implement `requestIdleCallback`, so a small
   `setTimeout`-based shim is included at the top of `App.jsx` —
   background loading behaves the same across browsers.
5. If a frame is requested by scroll position before it's finished
   loading, the canvas simply keeps showing the last successfully
   loaded frame until the requested one arrives — never a blank or
   broken frame.

## 6. Canvas sizing — why it fills the screen without letterboxing

The canvas's **display size** is controlled entirely by CSS:

```css
.wc-canvas{
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
```

No JavaScript ever sets `canvas.style.width/height`, and there's no
resize listener recalculating layout — the browser handles all of that
on any screen size, automatically.

Separately, `drawFrame()` sets `canvas.width` / `canvas.height` (the
canvas's internal *pixel buffer*, not its on-screen size) once, to
match your source images' native resolution — that's what keeps frames
sharp instead of blurry. It's a drawing-quality detail, not a layout
decision, so it doesn't conflict with the CSS-only sizing above.

## 7. Customizing

- **Names / date / venue**: edit the JSX inside the `.wc-hero` block in
  `src/App.jsx`.
- **Colors / fonts**: everything is driven by the CSS custom properties
  at the top of the `<style>` block in `App.jsx` (`--bg`, `--gold`,
  `--ivory`, `--serif`, `--sans`, etc).
- **Details section**: the "A celebration of love" block under the
  sequence is placeholder copy — replace with your real ceremony/
  reception details, or delete the `<section>` entirely if you just
  want the sequence.

## 8. A note on performance

241 full-size JPEGs can add up in total size. For the smoothest mobile
experience:

- Export frames no wider than **1600–1920px** on the long edge — the
  canvas will still fill any screen via `object-fit: cover`, and mobile
  visitors don't need 4K source frames.
- Compress JPEGs to roughly **60–75% quality** — sequence frames rarely
  need to be pixel-perfect since they're seen briefly and in motion.
- Keeping each frame under ~80–150KB (rather than multi-MB camera
  exports) makes a very noticeable difference in how quickly the
  background chunks finish loading on mobile networks.
