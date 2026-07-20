// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

function currentTheme() {
    return htmlEl.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    try {
        localStorage.setItem("theme", theme);
    } catch (e) {}
}

// Sync with whatever the inline head script already applied, no flash on load
applyTheme(currentTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        applyTheme(currentTheme() === "light" ? "dark" : "light");
    });
}

// Altitude tape + scroll spy
const sections = Array.from(document.querySelectorAll("[data-tape-section]"));
const ticks = Array.from(document.querySelectorAll(".tape-tick"));
const headerLinks = Array.from(document.querySelectorAll(".header-nav a[data-id]"));
const marker = document.getElementById("tapeMarker");
const label = document.getElementById("tapeLabel");
const altReadout = document.getElementById("tapeAlt");
const header = document.querySelector(".site-header");
const root = document.documentElement;

// Header is fixed, so keep its real height in a css var - changes at the
// 900px breakpoint when the nav row wraps in
function setHeaderHeight() {
    if (header) root.style.setProperty("--header-h", `${header.offsetHeight}px`);
}

// Where a section actually lands once scrolled to - its offset minus the
// header height and a small gap. Tick placement uses this same number so
// the marker lands exactly on the tick you clicked, not short by a header
function scrollTargetFor(el) {
    const headerH = header ? header.offsetHeight : 0;
    return Math.max(el.getBoundingClientRect().top + window.scrollY - headerH - 12, 0);
}

let sectionTops = [];
let total = 1;

function layout() {
    setHeaderHeight();
    total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    sectionTops = sections.map((sec) => scrollTargetFor(sec));
    sectionTops.forEach((top, i) => {
        const tick = ticks[i];
        if (!tick) return;
        const frac = Math.min(Math.max(top / total, 0), 1);
        tick.style.top = `${frac * 100}%`;
    });
    update();
}

let ticking = false;

function update() {
    const scrollY = window.scrollY;
    const frac = Math.min(Math.max(scrollY / total, 0), 1);
    if (marker) marker.style.top = `${frac * 100}%`;

    // active section = last one whose top has been reached, read a little
    // above true viewport-top so the highlighted tick matches what's on screen
    const readPoint = scrollY + window.innerHeight * 0.35;
    let activeIndex = 0;
    for (let i = 0; i < sectionTops.length; i++) {
        if (readPoint >= sectionTops[i]) activeIndex = i;
    }

    const activeSection = sections[activeIndex];
    const id = activeSection?.id;
    const flLabel = activeSection?.dataset.tapeLabel || id;
    if (label && label.textContent !== flLabel) label.textContent = flLabel;

    const tickAlt = ticks[activeIndex]?.dataset.alt;
    if (altReadout && tickAlt && altReadout.textContent !== tickAlt) altReadout.textContent = tickAlt;

    ticks.forEach((t, i) => t.classList.toggle("active", i === activeIndex));
    headerLinks.forEach((a) => a.classList.toggle("active", a.dataset.id === id));

    ticking = false;
}

function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
}

// Nav links all use href="#id" so they still work with js disabled, but a
// plain anchor jump drops "#id" into the address bar - intercept and scroll
// ourselves instead
document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    window.scrollTo({ top: scrollTargetFor(target), behavior: "smooth" });
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", layout);

// Covers late font swaps and image loads too, not just resizes
if ("ResizeObserver" in window) {
    new ResizeObserver(layout).observe(document.body);
    if (header) new ResizeObserver(setHeaderHeight).observe(header);
} else {
    window.addEventListener("load", layout);
}

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layout);
}

layout();
