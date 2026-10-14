/* =========================================================
   Gauri Savale Portfolio: script.js
   Plain JavaScript, no libraries. Each block below is one feature.
   ========================================================= */

/* ---------- 1. EDIT YOUR DATA HERE ---------- */

// Academic scores. Put a number in `score` (out of 10, or a % with outOf: 100).
// Leave score as null and the row shows "to be added".
const MARKS = [
  { level: "B.Tech Semester 1", score: null, outOf: 10 },
  { level: "B.Tech Semester 2", score: null, outOf: 10 },
  { level: "B.Tech Semester 3", score: null, outOf: 10 },
  { level: "B.Tech Semester 4", score: null, outOf: 10 },
  { level: "Class XII",         score: null, outOf: 100 },
  { level: "Class X",           score: null, outOf: 100 },
];

// Certificates. Save each image as assets/certificates/<file>.
const CERTIFICATES = [
  { title: "Red Hat System Administration I (RH124 v10)", issuer: "Red Hat", date: "Apr 2026", file: "redhat-rh124.jpg", short: "RH124" },
  { title: "Python Programming with Red Hat (AD141 v9.0)", issuer: "Red Hat", date: "Apr 2025", file: "redhat-ad141.jpg", short: "AD141" },
  { title: "Data Structures and Algorithms using Python, Part 1", issuer: "Infosys Springboard", date: "Nov 2025", file: "infosys-dsa.jpg", short: "DSA" },
  { title: "Cloud Security Essentials for Executives", issuer: "AWS Training & Certification", date: "Jul 2025", file: "aws-cloud-security.jpg", short: "AWS" },
  { title: "AI for Beginners", issuer: "HP LIFE", date: "Jul 2025", file: "hp-ai-beginners.jpg", short: "AI" },
  { title: "Cybersecurity Essentials", issuer: "Cisco Networking Academy", date: "2026", file: "cisco-cybersecurity.jpg", short: "Cisco", inProgress: true },
];

// Gallery photos. Save each as assets/gallery/<file>.
const GALLERY = [
  { file: "drowsiness-demo.jpg", caption: "Drowsiness detection prototype" },
  { file: "acm-workshop.jpg",    caption: "ACM chapter workshop" },
  { file: "hackathon.jpg",       caption: "Hackathon team" },
  { file: "servicenow.jpg",      caption: "ServiceNow internship" },
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

/* ---------- 3. Mobile menu ---------- */
(function menu() {
  const btn = $("#menuBtn"), menu = $("#menu");
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  $$("#menu a").forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }));
})();

/* ---------- 4. Highlight the nav link for the section on screen ---------- */
(function activeLink() {
  const links = $$("#menu a");
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => io.observe(s));
})();

/* ---------- 5. Hero: rotating word ---------- */
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

/* ---------- 6. Hero: blinking eyes + Eye Aspect Ratio readout ----------
   The real project measures the Eye Aspect Ratio (EAR): open eyes ~0.3,
   closed eyes drop near 0.1. Here we fake the signal to show the idea. */
(function drowsyDemo() {
  const monitor = $(".monitor"), value = $("#earValue"), state = $("#earState");
  const photo = $("#profilePhoto");
  loadImage(photo); // falls back to the "GS" initials if profile.jpg is missing

  const OPEN = 0.31, CLOSED = 0.09, THRESHOLD = 0.2;
  function show(ear) {
    value.textContent = ear.toFixed(2);
    const drowsy = ear < THRESHOLD;
    state.textContent = drowsy ? "eyes closed" : "awake";
    state.className = "state " + (drowsy ? "drowsy" : "awake");
  }
  function blink(duration) {
    monitor.classList.add("blink"); show(CLOSED);
    setTimeout(() => { monitor.classList.remove("blink"); show(OPEN); }, duration);
  }
  if (reduceMotion) return;
  // jitter the open-eye value a little so it looks live
  setInterval(() => { if (!monitor.classList.contains("blink")) show(OPEN + (Math.random() - .5) * 0.03); }, 700);
  // a normal blink every few seconds, and an occasional long "drowsy" one
  let n = 0;
  setInterval(() => { n++; blink(n % 4 === 0 ? 1100 : 160); }, 3200);
})();

/* ---------- 7. Academic performance table ---------- */
(function marks() {
  const body = $("#marksBody");
  body.innerHTML = MARKS.map(m => {
    const has = typeof m.score === "number";
    const shown = has ? (m.outOf === 100 ? m.score + "%" : m.score.toFixed(2)) : '<span class="pending">to be added</span>';
    const pct = has ? Math.min(100, (m.score / m.outOf) * 100) : 0;
    return `<tr><td>${m.level}</td><td>${shown}</td>
      <td><div class="bar" role="img" aria-label="${has ? Math.round(pct) + ' percent' : 'no score yet'}"><span style="width:${pct}%"></span></div></td></tr>`;
  }).join("");
})();

/* ---------- 8. Project filter ---------- */
(function filters() {
  const buttons = $$(".filter"), cards = $$(".project");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    buttons.forEach(b => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    cards.forEach(c => { c.hidden = f !== "all" && !c.dataset.tags.split(" ").includes(f); });
  }));
})();

/* ---------- 9. Certificates grid + viewer ---------- */
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
    body.innerHTML = `<p class="muted">${c.issuer} · ${c.date}${c.inProgress ? " · in progress" : ""}</p>`;
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

/* ---------- 10. Gallery ---------- */
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

/* ---------- 11. Copy email button ---------- */
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

/* ---------- 12. Contact form (validates, then opens the visitor's email app) ---------- */
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

/* ---------- 13. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
