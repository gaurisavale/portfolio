# Gauri Savale Portfolio

Personal portfolio website for the CA3 JavaScript Lab mini project.
Built with plain HTML, CSS and JavaScript. No frameworks. The only library is pdf.js, loaded only when someone reads a PDF resume.

## Files

```
index.html      page structure and content
style.css       design: colours, fonts, layout, light/dark themes
script.js       interactivity + editable data (certificates)
assets/
  Gauri_Savale_Resume.pdf
  profile.jpg               add your photo (square works best)
  certificates/             add certificate images (names listed in script.js)
```

## JavaScript features (good for the viva)

1. Light / dark theme toggle, remembered with `localStorage`
2. Tab switching: one section shown at a time, URL hash updated, arrow-key navigation
3. Rotating word in the hero (`setInterval`)
4. Blinking-eyes demo that mirrors the drowsiness project: eyes found = motor on, no eyes = motor off
5. Project filter buttons using `data-tags`
6. Certificate cards generated from data, opening in a `<dialog>` viewer
7. Copy-email button using the Clipboard API, with a fallback
8. Contact form validation (regex email check) that opens the visitor's email app
9. Visitor counter: `fetch()` to the free Abacus counter API (`/hit` adds 1, `/get` reads), counted once per session with `sessionStorage`, animated with `requestAnimationFrame`
10. Resume skill extractor: upload a PDF/TXT (button or drag-and-drop), text pulled out with pdf.js or `FileReader`, matched against a skills dictionary with regex, results grouped and compared with my own skills. Runs fully in the browser

### Visual effects (script.js block 12)

- **Live background**: `<canvas>` particle network drawn with `requestAnimationFrame`. Nearby particles link up like a neural net and reach toward the cursor. Pauses when the tab is hidden, recolours with the theme
- **Aurora blobs**: blurred gradient circles drifting with CSS `@keyframes`
- **Hero name**: letters fly in one by one, then a gradient sheen sweeps across
- **Cursor glow + 3D tilt** on cards (`pointermove`, CSS variables, `perspective`)
- **Eyes follow the cursor** (`Math.atan2` to aim each iris)
- **Sliding tab pill** (`MutationObserver` watches `aria-selected`)
- **Staggered entrance** when a tab opens, **skill bars fill up** on the Skills tab
- Everything respects `prefers-reduced-motion`

## To finish before submission

- [ ] Add `assets/profile.jpg`
- [ ] Add Class X / XII school details in `index.html` (Education section)
- [ ] Add certificate images using the file names in `script.js`

## Publish on GitHub Pages

1. Create a new public repo, e.g. `portfolio`.
2. Upload all files in this folder (keep the `assets` folder structure).
3. Repo → Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, folder `/ (root)` → Save.
4. Your site goes live at `https://<username>.github.io/portfolio/` within a minute or two.
