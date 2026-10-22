/* =========================================================
   Gauri Savale Portfolio: script.js
   Plain JavaScript, no libraries. Each block below is one feature.
   ========================================================= */

/* ---------- 1. EDIT YOUR DATA HERE ---------- */

// Certificates. Save each image as assets/certificates/<file>.
const CERTIFICATES = [
  { title: "Network Automation with Red Hat Ansible Automation Platform (DO457)", issuer: "Red Hat", date: "Jul 2026", file: "redhat-do457.jpg", short: "DO457",
    verify: "https://www.credly.com/badges/72f47bc8-1907-4037-9d03-9d4f9d2e2ea2" },
  { title: "Red Hat System Administration I (RH124 v10)", issuer: "Red Hat", date: "Apr 2026", file: "redhat-rh124.jpg", short: "RH124" },
  { title: "Python Programming with Red Hat (AD141 v9.0)", issuer: "Red Hat", date: "Apr 2025", file: "redhat-ad141.jpg", short: "AD141" },
  { title: "Data Structures and Algorithms using Python, Part 1", issuer: "Infosys Springboard", date: "Nov 2025", file: "infosys-dsa.jpg", short: "DSA" },
  { title: "Cloud Security Essentials for Executives", issuer: "AWS Training & Certification", date: "Jul 2025", file: "aws-cloud-security.jpg", short: "AWS" },
  { title: "AI for Beginners", issuer: "HP LIFE", date: "Jul 2025", file: "hp-ai-beginners.jpg", short: "AI" },
];

// Gallery photos. Save each as assets/gallery/<file>.
const GALLERY = [
  { file: "drowsiness-demo.jpg", caption: "Drowsiness detection prototype" },
  { file: "acm-workshop.jpg",    caption: "ACM chapter workshop" },
  { file: "hackathon.jpg",       caption: "Hackathon team" },
  { file: "project-expo.jpg",    caption: "Project presentation" },
  { file: "mindease-demo.jpg",   caption: "MindEase demo" },
  { file: "campus.jpg",          caption: "SIT Pune campus" },
];

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Safe localStorage (can throw in private windows)
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

// Shows an image, or calls onMissing() if the file isn't there yet
function loadImage(img, onMissing) {
  const fail = () => { img.remove(); onMissing && onMissing(); };
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) { fail(); return; } // already failed
  img.addEventListener("error", fail, { once: true });
}

/* ---------- 2. Theme toggle (light / dark) ---------- */
(function theme() {
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved) root.dataset.theme = saved;
  $("#themeBtn").addEventListener("click", () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    store.set("theme", next);
  });
})();

/* ---------- 3. Tab switching ----------
   Only one section (panel) is shown at a time. Any link to "#something"
   that matches a panel id switches to that tab, so the "See my projects"
   button works too. The URL hash is updated so tabs can be bookmarked. */
(function tabs() {
  const panels = $$(".panel");
  const tabLinks = $$(".tab");
  const ids = panels.map(p => p.id);
  document.documentElement.classList.add("js-tabs"); // CSS hides inactive panels only when JS runs

  function show(id, { scroll = true } = {}) {
    if (!ids.includes(id)) id = "home";
    panels.forEach(p => p.classList.toggle("is-active", p.id === id));
    tabLinks.forEach(t => {
      const on = t.getAttribute("href") === "#" + id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on) t.scrollIntoView({ block: "nearest", inline: "nearest" }); // keep active tab visible on phones
    });
    try { history.replaceState(null, "", "#" + id); } catch { /* ignore */ }
    if (scroll) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // clicks on any in-page link
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    if (!ids.includes(id)) return;
    e.preventDefault();
    show(id);
  });

  // arrow keys move between tabs (accessibility)
  $(".tabs").addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabLinks.indexOf(document.activeElement);
    if (i < 0) return;
    const next = tabLinks[(i + (e.key === "ArrowRight" ? 1 : -1) + tabLinks.length) % tabLinks.length];
    next.focus();
    show(next.getAttribute("href").slice(1));
  });

  window.addEventListener("hashchange", () => show(location.hash.slice(1)));
  show(location.hash.slice(1) || "home", { scroll: false });
})();

/* ---------- 4. Hero: rotating word ---------- */
(function rotator() {
  const el = $("#rotator");
  const words = ["see", "listen", "understand", "keep people safe", "tell stories"];
  if (reduceMotion) return;
  let i = 0;
  setInterval(() => {
    el.style.opacity = 0;
    setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.style.opacity = 1; }, 250);
  }, 2400);
})();

/* ---------- 5. Hero: blinking eyes + motor readout ----------
   Mirrors the real drowsiness project: Python counts the eyes OpenCV finds.
   2 eyes found -> send '1' -> Arduino runs the motor.
   0 eyes found -> send '0' -> Arduino stops the motor.
   Here we just fake the blinking to show the idea. */
(function drowsyDemo() {
  const monitor = $(".monitor"), value = $("#earValue"), state = $("#earState");
  const photo = $("#profilePhoto");
  loadImage(photo); // falls back to the "GS" initials if profile.jpg is missing

  function show(eyes) {
    value.textContent = eyes;
    const running = eyes > 0;               // same rule as the Python script
    state.textContent = running ? "motor on" : "motor off";
    state.className = "state " + (running ? "awake" : "drowsy");
  }
  function blink(duration) {
    monitor.classList.add("blink"); show(0);
    setTimeout(() => { monitor.classList.remove("blink"); show(2); }, duration);
  }
  if (reduceMotion) return;
  // a quick blink every few seconds, and every 4th one is a long "drowsy" close
  let n = 0;
  setInterval(() => { n++; blink(n % 4 === 0 ? 1400 : 180); }, 3200);
})();

/* ---------- 6. Project filter ---------- */
(function filters() {
  const buttons = $$(".filter"), cards = $$(".project");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    buttons.forEach(b => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    cards.forEach(c => { c.hidden = f !== "all" && !c.dataset.tags.split(" ").includes(f); });
  }));
})();

/* ---------- 7. Certificates grid + viewer ---------- */
(function certificates() {
  const grid = $("#certGrid"), dialog = $("#certDialog");
  CERTIFICATES.forEach(c => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cert";
    card.innerHTML = `
      <div class="cert-thumb"><span class="cert-ph">${c.short}</span>
        <img src="assets/certificates/${c.file}" alt="" loading="lazy"></div>
      <div class="cert-info"><strong>${c.title}</strong>
        <span>${c.issuer} · ${c.date}${c.inProgress ? ' · <b class="status">in progress</b>' : ""}</span></div>`;
    const img = card.querySelector("img");
    img.style.position = "relative"; img.style.zIndex = 1;
    loadImage(img);
    card.addEventListener("click", () => openCert(c));
    grid.appendChild(card);
  });

  function openCert(c) {
    $("#dlgTitle").textContent = c.title;
    const body = $("#dlgBody");
    body.innerHTML = `<p class="muted">${c.issuer} · ${c.date}${c.inProgress ? " · in progress" : ""}</p>` +
      (c.verify ? `<p><a href="${c.verify}" target="_blank" rel="noopener">Verify on Credly →</a></p>` : "");
    const img = new Image();
    img.alt = "Certificate: " + c.title;
    img.src = "assets/certificates/" + c.file;
    img.onerror = () => { img.replaceWith(Object.assign(document.createElement("p"), { className: "muted", textContent: "Certificate image coming soon." })); };
    body.appendChild(img);
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  $("#dlgClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); }); // click outside closes
})();

/* ---------- 8. Gallery ---------- */
(function gallery() {
  const grid = $("#galleryGrid");
  GALLERY.forEach(g => {
    const fig = document.createElement("figure");
    fig.className = "shot";
    fig.innerHTML = `<div class="frame"><span class="ph">assets/gallery/${g.file}</span>
      <img src="assets/gallery/${g.file}" alt="${g.caption}" loading="lazy"></div>
      <figcaption>${g.caption}</figcaption>`;
    const img = fig.querySelector("img");
    img.style.position = "relative"; img.style.zIndex = 1;
    loadImage(img);
    grid.appendChild(fig);
  });
})();

/* ---------- 9. Copy email button ---------- */
(function copyEmail() {
  const btn = $("#copyEmail"), text = $("#emailText");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text.textContent);
      btn.textContent = "Copied";
    } catch {
      // fallback: select the text so the visitor can copy it
      const r = document.createRange(); r.selectNodeContents(text);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = "Selected";
    }
    setTimeout(() => (btn.textContent = "Copy"), 1800);
  });
})();

/* ---------- 10. Contact form (validates, then opens the visitor's email app) ---------- */
(function contactForm() {
  const form = $("#contactForm"), note = $("#formNote");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
    note.classList.remove("error");
    if (!name || !msg) { note.textContent = "Please add your name and a message."; note.classList.add("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = "That email address doesn't look right. Check it and try again."; note.classList.add("error"); return; }
    const subject = encodeURIComponent("Hello from " + name);
    const body = encodeURIComponent(msg + "\n\n" + name + " (" + email + ")");
    window.location.href = `mailto:gauri.s.savale@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app. If nothing opens, write to gauri.s.savale@gmail.com.";
  });
})();

/* ---------- 11. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
