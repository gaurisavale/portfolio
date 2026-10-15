# Gauri Savale Portfolio

Personal portfolio website for the CA3 JavaScript Lab mini project.
Built with plain HTML, CSS and JavaScript. No frameworks or libraries.

## Files

```
index.html      page structure and content
style.css       design: colours, fonts, layout, light/dark themes
script.js       interactivity + editable data (certificates, gallery)
assets/
  Gauri_Savale_Resume.pdf
  profile.jpg               add your photo (square works best)
  certificates/             add certificate images (names listed in script.js)
  gallery/                  add photos (names listed in script.js)
```

## JavaScript features (good for the viva)

1. Light / dark theme toggle, remembered with `localStorage`
2. Tab switching: one section shown at a time, URL hash updated, arrow-key navigation
3. Rotating word in the hero (`setInterval`)
4. Blinking-eyes demo with a live Eye Aspect Ratio readout, based on the drowsiness detection project
5. Project filter buttons using `data-tags`
6. Certificate cards generated from data, opening in a `<dialog>` viewer
7. Gallery generated from data, with placeholders for missing images
8. Copy-email button using the Clipboard API, with a fallback
9. Contact form validation (regex email check) that opens the visitor's email app

## To finish before submission

- [ ] Add `assets/profile.jpg`
- [ ] Add Class X / XII school details in `index.html` (Education section)
- [ ] Replace `YOUR-GITHUB-USERNAME` in `index.html` with your GitHub username / repo links
- [ ] Add certificate and gallery images using the file names in `script.js`

## Publish on GitHub Pages

1. Create a new public repo, e.g. `portfolio`.
2. Upload all files in this folder (keep the `assets` folder structure).
3. Repo → Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, folder `/ (root)` → Save.
4. Your site goes live at `https://<username>.github.io/portfolio/` within a minute or two.
