/* =========================================================
   Gauri Savale Portfolio: script.js
   Plain JavaScript, no libraries. Each block below is one feature.
   ========================================================= */

/* ---------- 1. EDIT YOUR DATA HERE ---------- */

// Certificates. Save each image as assets/certificates/<file>.
const CERTIFICATES = [
  { title: "Mastering Agentic AI: From Prompt to Protocols to Production", issuer: "Udemy", date: "Aug 2026", file: "udemy-agentic-ai.jpg", short: "Agentic AI",
    verify: "https://ude.my/UC-79f26fb9-40d7-47e3-8d02-edf84ce5c157" },
  { title: "Network Automation with Red Hat Ansible Automation Platform (DO457)", issuer: "Red Hat", date: "Jul 2026", file: "redhat-do457.jpg", short: "DO457",
    verify: "https://www.credly.com/badges/72f47bc8-1907-4037-9d03-9d4f9d2e2ea2" },
  { title: "Virtual Internship Program", issuer: "ServiceNow University × AICTE × SmartBridge", date: "Jun 2026", file: "servicenow-virtual-internship.jpg", short: "ServiceNow" },
  { title: "Red Hat System Administration I (RH124 v10)", issuer: "Red Hat", date: "Apr 2026", file: "redhat-rh124.jpg", short: "RH124" },
  { title: "Data Structures and Algorithms using Python, Part 1", issuer: "Infosys Springboard", date: "Nov 2025", file: "infosys-dsa.jpg", short: "DSA" },
  { title: "Cloud Security Essentials for Executives", issuer: "AWS Training & Certification", date: "Jul 2025", file: "aws-cloud-security.jpg", short: "AWS" },
  { title: "AI for Beginners", issuer: "HP LIFE", date: "Jul 2025", file: "hp-ai-beginners.jpg", short: "AI" },
  { title: "Python Programming with Red Hat (AD141 v9.0)", issuer: "Red Hat", date: "Apr 2025", file: "redhat-ad141.jpg", short: "AD141" },
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
      if (on) { // keep the active tab visible in the scrollable tab bar on phones (without scrolling the page)
        const bar = t.parentElement;
        if (t.offsetLeft < bar.scrollLeft || t.offsetLeft + t.offsetWidth > bar.scrollLeft + bar.clientWidth)
          bar.scrollTo({ left: t.offsetLeft - 16, behavior: "smooth" });
      }
    });
    // update the URL only when it changes (Chrome jumps to the anchor otherwise)
    if (location.hash !== "#" + id && (scroll || location.hash)) {
      try { history.replaceState(null, "", "#" + id); } catch { /* ignore */ }
    }
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
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  show(location.hash.slice(1) || "home", { scroll: false });
  window.scrollTo({ top: 0, behavior: "instant" }); // a #hash in the URL would otherwise jump past the header
  window.addEventListener("load", () => window.scrollTo({ top: 0, behavior: "instant" }), { once: true });
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
      (c.verify ? `<p><a href="${c.verify}" target="_blank" rel="noopener">Verify certificate →</a></p>` : "");
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

/* ---------- 8. Copy email button ---------- */
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

/* ---------- 9. Contact form (validates, then opens the visitor's email app) ---------- */
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

/* ---------- 10. Visitor counter ----------
   GitHub Pages can't store data, so the count lives in Abacus, a free
   counter API (no signup). "hit" adds 1 and returns the new total; "get"
   just reads it. Each browser session is counted once, so refreshing or
   switching tabs doesn't inflate the number. */
(async function viewCounter() {
  const API = "https://abacus.jasoncameron.dev";
  const NAMESPACE = "gaurisavale-portfolio", KEY = "visits";
  const box = $("#viewCount"), num = $("#viewNumber");

  let alreadyCounted = false;
  try { alreadyCounted = sessionStorage.getItem("visitCounted") === "1"; } catch { /* ignore */ }

  try {
    const res = await fetch(`${API}/${alreadyCounted ? "get" : "hit"}/${NAMESPACE}/${KEY}`);
    if (!res.ok) throw new Error("counter unavailable");
    const { value } = await res.json();
    try { sessionStorage.setItem("visitCounted", "1"); } catch { /* ignore */ }
    box.hidden = false;
    countUp(num, value);
  } catch {
    box.hidden = true; // if the service is down, just hide the counter
  }

  // animate 0 -> value
  function countUp(el, target) {
    if (reduceMotion || target < 10) { el.textContent = target.toLocaleString("en-IN"); return; }
    const start = performance.now(), duration = 900;
    (function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString("en-IN");
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }
})();

/* ---------- 11. Resume skill extractor ----------
   1. Read the file: PDFs go through pdf.js (loaded only when needed),
      TXT files are read with FileReader.
   2. Search the text for every skill in SKILL_DICTIONARY using regex.
   3. Compare with the skills listed on this page and show the overlap. */
const SKILL_DICTIONARY = {
  "Languages": {
    "Python": ["python"], "JavaScript": ["javascript", "js"], "TypeScript": ["typescript"],
    "Java": ["java"], "C": ["c"], "C++": ["c++", "cpp"], "C#": ["c#"], "Go": ["golang"],
    "Rust": ["rust"], "Kotlin": ["kotlin"], "Swift": ["swift"], "PHP": ["php"], "Ruby": ["ruby"],
    "Dart": ["dart"], "SQL": ["sql"], "PL/SQL": ["pl/sql", "plsql"], "HTML": ["html", "html5"],
    "CSS": ["css", "css3"], "Bash": ["bash", "shell scripting"], "MATLAB": ["matlab"]
  },
  "Web & frameworks": {
    "React": ["react", "react.js", "reactjs"], "Next.js": ["next.js", "nextjs"], "Angular": ["angular"],
    "Vue": ["vue", "vue.js"], "Node.js": ["node.js", "nodejs"], "Express": ["express.js", "expressjs"],
    "Django": ["django"], "Flask": ["flask"], "FastAPI": ["fastapi"], "Spring Boot": ["spring boot"],
    "Tailwind CSS": ["tailwind", "tailwind css"], "Bootstrap": ["bootstrap"], "jQuery": ["jquery"],
    "REST APIs": ["rest api", "rest apis", "restful"], "GraphQL": ["graphql"]
  },
  "AI / ML": {
    "Machine Learning": ["machine learning", "ml"], "Deep Learning": ["deep learning"],
    "NLP": ["nlp", "natural language processing"], "Computer Vision": ["computer vision"],
    "Generative AI": ["generative ai", "genai", "gen ai"], "LLMs": ["llm", "llms", "large language models"],
    "Agentic AI": ["agentic ai", "ai agents"], "Prompt Engineering": ["prompt engineering"],
    "Sentiment Analysis": ["sentiment analysis"], "TensorFlow": ["tensorflow"], "PyTorch": ["pytorch"],
    "Keras": ["keras"], "scikit-learn": ["scikit-learn", "sklearn"], "OpenCV": ["opencv"],
    "Pandas": ["pandas"], "NumPy": ["numpy"], "Matplotlib": ["matplotlib"],
    "Hugging Face": ["hugging face", "huggingface"], "LangChain": ["langchain"]
  },
  "Data & databases": {
    "MySQL": ["mysql"], "PostgreSQL": ["postgresql", "postgres"], "MongoDB": ["mongodb"],
    "SQLite": ["sqlite"], "Firebase": ["firebase"], "Redis": ["redis"], "Oracle": ["oracle"],
    "DBMS": ["dbms"], "Power BI": ["power bi"], "Tableau": ["tableau"], "Excel": ["ms excel", "microsoft excel"]
  },
  "Cloud & DevOps": {
    "AWS": ["aws", "amazon web services"], "Azure": ["azure"], "Google Cloud": ["gcp", "google cloud"],
    "Docker": ["docker"], "Kubernetes": ["kubernetes", "k8s"], "Git": ["git"], "GitHub": ["github"],
    "CI/CD": ["ci/cd"], "Linux": ["linux"], "Red Hat / RHEL": ["rhel", "red hat"], "Ansible": ["ansible"],
    "Jenkins": ["jenkins"], "Terraform": ["terraform"], "ServiceNow": ["servicenow"]
  },
  "Security": {
    "Cybersecurity": ["cybersecurity", "cyber security"], "Network Security": ["network security"],
    "Cloud Security": ["cloud security"], "Risk Management": ["risk management"],
    "Threat Analysis": ["threat analysis"], "Penetration Testing": ["penetration testing", "pentesting"]
  },
  "Hardware & IoT": {
    "Arduino": ["arduino"], "Raspberry Pi": ["raspberry pi"], "IoT": ["iot", "internet of things"],
    "Embedded Systems": ["embedded systems", "embedded"]
  },
  "CS fundamentals": {
    "Data Structures & Algorithms": ["data structures", "algorithms", "dsa"], "OOP": ["oop", "object oriented", "object-oriented"],
    "Operating Systems": ["operating systems"], "Computer Networks": ["computer networks", "networking"],
    "SDLC": ["sdlc"], "Agile": ["agile", "scrum"], "Debugging": ["debugging"]
  }
};

// Builds one regex per alias. The lookarounds stop "java" matching inside
// "javascript", "c" matching inside "c++", or "git" inside "github".
function aliasRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z0-9+#])${escaped}(?![a-z0-9+#])`, "i");
}
const SKILL_PATTERNS = Object.entries(SKILL_DICTIONARY).flatMap(([group, skills]) =>
  Object.entries(skills).map(([name, aliases]) => ({ group, name, patterns: aliases.map(aliasRegex) }))
);

function extractSkills(text) {
  const clean = text.replace(/\s+/g, " ");
  return SKILL_PATTERNS.filter(s => s.patterns.some(re => re.test(clean)));
}

(function resumeExtractor() {
  const input = $("#resumeInput"), drop = $("#dropZone");
  const status = $("#exStatus"), results = $("#exResults");

  // Gauri's own skills = whatever the dictionary finds in the Skills tab itself
  const mySkills = new Set(extractSkills($(".skill-grid").textContent).map(s => s.name));

  function setStatus(msg, isError = false) {
    status.textContent = msg;
    status.classList.toggle("error", isError);
  }

  // pdf.js is ~300 KB, so it's only downloaded the first time a PDF is read
  let pdfjsReady;
  function loadPdfJs() {
    if (!pdfjsReady) {
      pdfjsReady = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        s.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(window.pdfjsLib);
        };
        s.onerror = () => { pdfjsReady = null; reject(new Error("Couldn't load the PDF reader. Check your connection and try again.")); };
        document.head.appendChild(s);
      });
    }
    return pdfjsReady;
  }

  async function pdfToText(arrayBuffer) {
    const pdfjsLib = await loadPdfJs();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    return text;
  }

  async function analyse(fileName, getText) {
    results.hidden = true;
    setStatus(`Reading ${fileName}…`);
    try {
      const text = await getText();
      if (!text.trim()) throw new Error("No text found. If this is a scanned PDF, try a text-based PDF or a TXT file.");
      render(fileName, extractSkills(text));
    } catch (err) {
      setStatus(err.message || "Couldn't read that file. Try a PDF or TXT resume.", true);
    }
  }

  function render(fileName, found) {
    if (!found.length) { setStatus(`No known skills found in ${fileName}.`, true); return; }
    const shared = found.filter(s => mySkills.has(s.name)).length;
    const groups = {};
    found.forEach(s => (groups[s.group] = groups[s.group] || []).push(s.name));

    results.innerHTML = `
      <div class="ex-summary">
        <div class="ex-stat"><b>${found.length}</b><span>skills found</span></div>
        <div class="ex-stat"><b>${Object.keys(groups).length}</b><span>areas</span></div>
        <div class="ex-stat"><b>${shared}</b><span>shared with me</span></div>
      </div>
      ${Object.entries(groups).map(([group, names]) => `
        <div class="ex-group">
          <h4>${group}</h4>
          <ul class="chips">${names.map(n => `<li class="${mySkills.has(n) ? "match" : ""}">${n}</li>`).join("")}</ul>
        </div>`).join("")}
      <p class="ex-legend"><i></i> Highlighted skills are ones I list too</p>`;
    results.hidden = false;
    setStatus(`Done. Found ${found.length} skills in ${fileName}.`);
  }

  function handleFile(file) {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    const isTxt = file.type === "text/plain" || /\.txt$/i.test(file.name);
    if (!isPdf && !isTxt) { setStatus("Please choose a PDF or TXT file.", true); return; }
    analyse(file.name, async () => isPdf ? pdfToText(await file.arrayBuffer()) : file.text());
  }

  $("#pickResume").addEventListener("click", () => input.click());
  input.addEventListener("change", () => { handleFile(input.files[0]); input.value = ""; });

  $("#useMyResume").addEventListener("click", () =>
    analyse("Gauri_Savale_Resume.pdf", async () => {
      const res = await fetch("assets/Gauri_Savale_Resume.pdf");
      if (!res.ok) throw new Error("Couldn't find my resume file.");
      return pdfToText(await res.arrayBuffer());
    })
  );

  // drag and drop
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("is-over"); }));
  drop.addEventListener("drop", e => handleFile(e.dataTransfer.files[0]));
})();

/* ---------- 12. Visual effects ----------
   a) live background: particles that link up like a neural network and
      reach toward the cursor (canvas + requestAnimationFrame)
   b) hero name animates in letter by letter, then gets a moving sheen
   c) cards glow where the cursor is, and project cards tilt in 3D
   d) the eyes in the hero follow the cursor
   e) a gradient pill slides between tabs
   f) items rise in one after another when a tab opens
   g) skill bars fill up when the Skills tab opens */
(function visuals() {
  const root = document.documentElement;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* a) live background */
  const canvas = $("#bgCanvas"), ctx = canvas.getContext("2d");
  const mouse = { x: -9999, y: -9999 };
  const LINK = 130, REACH = 170;
  let W, H, nodes = [], colors = {}, rafId = null;

  function readColors() {
    const cs = getComputedStyle(root);
    colors.a = cs.getPropertyValue("--accent").trim();
    colors.b = cs.getPropertyValue("--accent-2").trim();
  }
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, (W * H) / 13000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.8, c: Math.random() < 0.5 ? "a" : "b"
    }));
  }
  function move() {
    for (const p of nodes) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < REACH && d > 1) { p.vx += (dx / d) * 0.012; p.vy += (dy / d) * 0.012; } // drift toward cursor
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 1.1) { p.vx *= 0.92; p.vy *= 0.92; }
      if (speed < 0.15) { p.vx *= 1.04; p.vy *= 1.04; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.35;
          ctx.strokeStyle = colors[p.c];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < REACH) {
        ctx.globalAlpha = (1 - dm / REACH) * 0.75;
        ctx.strokeStyle = colors.a;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    for (const p of nodes) {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colors[p.c];
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function loop() { move(); draw(); rafId = requestAnimationFrame(loop); }
  function start() { if (!rafId && !reduceMotion) loop(); }
  function stop() { cancelAnimationFrame(rafId); rafId = null; }

  readColors(); resize();
  reduceMotion ? draw() : start();          // reduced motion: one still frame
  window.addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start())); // save battery
  // recolour when the theme changes
  new MutationObserver(() => { readColors(); if (reduceMotion) draw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);

  window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  /* b) hero name: letters fly in, then the gradient sheen takes over */
  const h1 = $(".hero h1"), name = h1.textContent;
  if (!reduceMotion) {
    h1.setAttribute("aria-label", name);
    h1.innerHTML = [...name].map((ch, i) =>
      `<span class="ch${ch === " " ? " sp" : ""}" style="--i:${i}" aria-hidden="true">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    setTimeout(() => { h1.textContent = name; h1.removeAttribute("aria-label"); h1.classList.add("shine"); }, name.length * 45 + 750);
  } else {
    h1.classList.add("shine");
  }

  /* c) cursor glow on cards (event delegation, so it works on cards made later too) */
  const GLOW = ".project, .cert, .list li, .ex-stat, .form, .extractor, .contact-line";
  document.addEventListener("pointermove", e => {
    const card = e.target.closest(GLOW);
    if (!card) return;
    card.classList.add("glow");
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  // 3D tilt (mouse only, not touch)
  if (finePointer && !reduceMotion) {
    $$(".project, .monitor").forEach(el => {
      el.classList.add("tilt");
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* d) eyes follow the cursor */
  const eyes = $$(".eye");
  window.addEventListener("pointermove", e => {
    eyes.forEach(svg => {
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const angle = Math.atan2(dy, dx), pull = Math.min(1, Math.hypot(dx, dy) / 300);
      const iris = svg.querySelector(".iris");
      iris.setAttribute("cx", (50 + Math.cos(angle) * 22 * pull).toFixed(1));
      iris.setAttribute("cy", (25 + Math.sin(angle) * 8 * pull).toFixed(1));
    });
  });

  /* e) sliding tab indicator */
  const tabs = $(".tabs");
  const pill = document.createElement("span");
  pill.className = "tab-indicator";
  pill.setAttribute("aria-hidden", "true");
  tabs.prepend(pill);
  tabs.classList.add("has-indicator");
  function placePill() {
    const active = tabs.querySelector('.tab[aria-selected="true"]');
    if (!active) return;
    pill.style.width = active.offsetWidth + "px";
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  new MutationObserver(placePill).observe(tabs, { subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
  window.addEventListener("resize", placePill);
  if (document.fonts) document.fonts.ready.then(placePill);
  placePill();

  /* f) staggered entrance: number the items in each panel */
  const STAGGER = ".hero-text > *, .split > .label, .body > *, .project, .cert, .skill-group, .list li, .timeline li, .two-col > div, .two-col > form, .section-head";
  $$(".panel").forEach(panel => {
    panel.querySelectorAll(STAGGER).forEach((el, i) => {
      el.classList.add("stagger");
      el.style.setProperty("--i", Math.min(i, 14));
    });
  });

  /* g) skill bars fill up each time the Skills tab opens */
  const meters = $$("#skills meter").map(m => ({ el: m, target: +m.value }));
  function fillMeters() {
    if (reduceMotion) return;
    const t0 = performance.now();
    (function frame(now) {
      const t = Math.min(1, (now - t0) / 1100), ease = 1 - Math.pow(1 - t, 3);
      meters.forEach(m => (m.el.value = m.target * ease));
      if (t < 1) requestAnimationFrame(frame);
    })(t0);
  }
  const skills = $("#skills");
  new MutationObserver(() => { if (skills.classList.contains("is-active")) fillMeters(); })
    .observe(skills, { attributes: true, attributeFilter: ["class"] });
  if (skills.classList.contains("is-active")) fillMeters();
})();

/* ---------- 13. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
