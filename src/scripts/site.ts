import Lenis from "lenis";

// smooth scroll
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = prefersReducedMotion ? null : new Lenis({ autoRaf: true, lerp: 0.12 });

// header height, exposed as a CSS var for the sticky filter bar + tape offset
const nav = document.getElementById("site-nav");
const root = document.documentElement;

function setHeaderHeight(): void {
    if (nav) root.style.setProperty("--header-h", `${nav.offsetHeight}px`);
}

// livery toggle
type Airline = "delta" | "southwest" | "united" | "american";

const liveryCredits: Record<Airline, string> = {
    delta: "REG: N653DL",
    united: "REG: N91007",
    american: "REG: N953NN",
    southwest: "REG: N1776R",
};

let lightsOn = false;
let gainOn = true;

function airlineFor(lights: boolean, gain: boolean): Airline {
    if (!lights && gain) return "delta";
    if (!lights && !gain) return "southwest";
    if (lights && gain) return "united";
    return "american";
}

function applyTheme(): void {
    const airline = airlineFor(lightsOn, gainOn);
    root.setAttribute("data-airline", airline);
    root.classList.toggle("dark", !lightsOn);

    const liveryCredit = document.getElementById("livery-credit");
    if (liveryCredit) liveryCredit.textContent = liveryCredits[airline];

    document.getElementById("lights-led")?.classList.toggle("is-on", lightsOn);
    document.getElementById("contrast-led")?.classList.toggle("is-on", gainOn);
    document.getElementById("lights-toggle")?.classList.toggle("is-on", lightsOn);
    document.getElementById("contrast-toggle")?.classList.toggle("is-on", gainOn);
}

document.getElementById("lights-toggle")?.addEventListener("click", () => {
    lightsOn = !lightsOn;
    applyTheme();
});
document.getElementById("contrast-toggle")?.addEventListener("click", () => {
    gainOn = !gainOn;
    applyTheme();
});

applyTheme();

// instrument panel
const machNeedle = document.getElementById("mach-needle");
const compassGroup = document.getElementById("compass-rose-group");
const horizonCard = document.getElementById("horizon-card");
const machDigitalTop = document.getElementById("mach-digital");
const machDigitalBox = document.getElementById("mach-display-box");
const hdgDigitalTop = document.getElementById("hdg-digital");
const hdgDigitalBox = document.getElementById("hdg-display-box");
const pitchDisplay = document.getElementById("pitch-display");
const rollDisplay = document.getElementById("roll-display");

if (machNeedle && compassGroup && horizonCard) {
    const MACH_MIN = 0.2;
    const MACH_MAX = 0.95;
    const SWEEP_DEG = 240;

    /* Targets set by pointer input (or the idle drift); the frame loop below
       eases the dial toward them. */
    let targetY = 0.5;
    let targetX = 0.5;
    let targetHeading = 0;

    /* Continuous, unwrapped dial rotation. Kept outside 0-360 on purpose so a
       359 -> 0 crossing is a small step rather than a full reverse spin. */
    let hdgRotation = 0;

    /* Heading is the angle from the viewport centre to the cursor. atan2 is
       ill-conditioned at its origin: passing through the reference point is a
       genuine 180deg flip, and a few px of travel there would snap the needle
       round. So the dial is eased toward the target with a per-frame cap,
       which turns that flip into a fast-but-smooth swing and doubles as
       instrument damping everywhere else. */
    const HDG_EASE = 0.25;
    const HDG_MAX_STEP = 9; // deg per frame

    const render = (yFrac: number, xFrac: number, rotation: number): void => {
        const machFrac = xFrac;
        const mach = MACH_MIN + machFrac * (MACH_MAX - MACH_MIN);
        machNeedle.setAttribute("transform", `rotate(${-(SWEEP_DEG / 2) + machFrac * SWEEP_DEG} 50 50)`);
        const machText = mach.toFixed(2);
        if (machDigitalTop) machDigitalTop.textContent = machText;
        if (machDigitalBox) machDigitalBox.textContent = machText;

        compassGroup.setAttribute("transform", `rotate(${-rotation} 50 50)`);
        const shown = String(((Math.round(rotation) % 360) + 360) % 360).padStart(3, "0");
        if (hdgDigitalTop) hdgDigitalTop.textContent = shown;
        if (hdgDigitalBox) hdgDigitalBox.textContent = shown;

        const rollDeg = (xFrac - 0.5) * 40;
        const pitchDeg = (yFrac - 0.5) * -15;
        horizonCard.style.transform = `translateY(${(yFrac - 0.5) * -30}px) rotate(${rollDeg}deg)`;
        if (pitchDisplay) pitchDisplay.textContent = (pitchDeg >= 0 ? "+" : "") + Math.round(pitchDeg);
        if (rollDisplay) rollDisplay.textContent = (rollDeg >= 0 ? "+" : "") + Math.round(rollDeg);
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let idleActive = true;
    let frameId = 0;

    const frame = (time: number): void => {
        if (idleActive) {
            // keeps the panel visibly alive before any input, which matters
            // most on touch devices where there's no hover to discover
            const t = time / 1000;
            targetY = 0.5 + Math.sin(t * 0.35) * 0.28;
            targetX = 0.5 + Math.sin(t * 0.22 + 1.4) * 0.32;
            targetHeading = 180 + Math.sin(t * 0.18 + 0.6) * 150;
        }

        // shortest signed path to the target, then eased and rate-capped
        let delta = targetHeading - (((hdgRotation % 360) + 360) % 360);
        delta = ((delta + 540) % 360) - 180;
        let step = delta * HDG_EASE;
        if (step > HDG_MAX_STEP) step = HDG_MAX_STEP;
        if (step < -HDG_MAX_STEP) step = -HDG_MAX_STEP;
        hdgRotation += step;

        render(targetY, targetX, hdgRotation);
        frameId = requestAnimationFrame(frame);
    };

    if (prefersReducedMotion) {
        idleActive = false;
        render(0.5, 0.5, 0);
    } else {
        frameId = requestAnimationFrame(frame);
    }

    const updateInstruments = (clientX: number, clientY: number): void => {
        idleActive = false;
        targetY = clientY / window.innerHeight;
        targetX = clientX / window.innerWidth;

        const dx = clientX - window.innerWidth / 2;
        const dy = clientY - window.innerHeight / 2;
        targetHeading = (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;

        if (prefersReducedMotion) {
            hdgRotation = targetHeading;
            render(targetY, targetX, hdgRotation);
        }
    };

    window.addEventListener("mousemove", (e) => updateInstruments(e.clientX, e.clientY));
    window.addEventListener(
        "touchmove",
        (e) => {
            if (e.touches.length > 0) updateInstruments(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: true }
    );
    window.addEventListener("pagehide", () => cancelAnimationFrame(frameId));
}

// hero scroll cue — fades once the person has actually started scrolling
const scrollCueWrap = document.querySelector<HTMLElement>(".scroll-cue-wrap");
if (scrollCueWrap) {
    const updateScrollCue = (): void => {
        scrollCueWrap.classList.toggle("is-hidden", window.scrollY > 80);
    };
    window.addEventListener("scroll", updateScrollCue, { passive: true });
    updateScrollCue();
}

// altimeter tape + scroll spy
const tapeSections = Array.from(document.querySelectorAll<HTMLElement>("[data-tape-section]"));
const tapeTicks = Array.from(document.querySelectorAll<HTMLElement>(".tape-tick"));
const bottomTapeTicks = Array.from(document.querySelectorAll<HTMLElement>(".bottom-tape-tick"));
const tapeMarker = document.getElementById("tapeMarker");
const tapeLabel = document.getElementById("tapeLabel");
const tapeAlt = document.getElementById("tapeAlt");

let sectionTops: number[] = [];
let totalScroll = 1;

function formatAltitude(frac: number): string {
    const fl = Math.round((400 * (1 - frac)) / 5) * 5;
    return fl <= 0 ? "GND" : "FL" + String(fl).padStart(3, "0");
}

function scrollTargetFor(el: HTMLElement): number {
    const headerH = nav ? nav.offsetHeight : 0;
    return Math.max(el.getBoundingClientRect().top + window.scrollY - headerH - 12, 0);
}

function tapeLayout(): void {
    setHeaderHeight();
    totalScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    sectionTops = tapeSections.map((sec) => scrollTargetFor(sec));
    sectionTops.forEach((top, i) => {
        const tick = tapeTicks[i];
        if (!tick) return;
        const frac = Math.min(Math.max(top / totalScroll, 0), 1);
        tick.style.top = `${frac * 100}%`;
        const altSpan = tick.querySelector<HTMLElement>(".tape-tick-alt");
        if (altSpan) altSpan.textContent = formatAltitude(frac);
    });
    tapeUpdate();
}

function tapeUpdate(): void {
    const scrollY = window.scrollY;
    const frac = Math.min(Math.max(scrollY / totalScroll, 0), 1);
    if (tapeMarker) tapeMarker.style.top = `${frac * 100}%`;

    const readPoint = scrollY + window.innerHeight * 0.35;
    let activeIndex = 0;
    for (let i = 0; i < sectionTops.length; i++) {
        if (readPoint >= sectionTops[i]) activeIndex = i;
    }
    // force last section at bottom of page, short trailing sections can miss the lookahead above
    if (scrollY >= totalScroll - 1) {
        activeIndex = tapeSections.length - 1;
    }

    const activeSection = tapeSections[activeIndex];
    const activeId = activeSection ? activeSection.id : "";
    const flLabel = activeSection ? activeSection.dataset.tapeLabel : "";
    if (tapeLabel && flLabel) tapeLabel.textContent = flLabel;
    if (tapeAlt) tapeAlt.textContent = formatAltitude(frac);

    tapeTicks.forEach((t, i) => t.classList.toggle("active", i === activeIndex));
    bottomTapeTicks.forEach((t) => t.classList.toggle("active", t.dataset.id === activeId));
}

/* Cached offsets above go stale whenever the document height changes —
   filtering strips, opening a boarding pass, late-loading images. Recalibrate
   on those, debounced to a frame and guarded so we only redo the work when the
   height really moved (tapeLayout writes --header-h, which feeds the hero's
   padding, so an unguarded observer could feed back on itself). */
let lastDocHeight = 0;
let tapeFrame = 0;
function scheduleTapeLayout(force = false): void {
    if (tapeFrame) return;
    tapeFrame = requestAnimationFrame(() => {
        tapeFrame = 0;
        const h = document.documentElement.scrollHeight;
        if (!force && h === lastDocHeight) return;
        lastDocHeight = h;
        tapeLayout();
    });
}

if (tapeSections.length && tapeTicks.length) {
    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                tapeUpdate();
                ticking = false;
            });
        },
        { passive: true }
    );
    window.addEventListener("resize", tapeLayout);
    window.addEventListener("load", () => scheduleTapeLayout(true));
    if ("ResizeObserver" in window) {
        new ResizeObserver(() => scheduleTapeLayout()).observe(document.body);
    }
    tapeLayout();
    lastDocHeight = document.documentElement.scrollHeight;
} else {
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
}

// nav links, routed through lenis when active
document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const hash = link.getAttribute("href");
    if (hash === "#" || hash === "") {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        return;
    }
    const targetEl = document.getElementById(hash!.slice(1));
    if (!targetEl) return;
    if (lenis) lenis.scrollTo(scrollTargetFor(targetEl));
    else targetEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
});

// project strip filters
let scope = "featured"; // "featured" shows only featured; "*" shows all
let activeOnly = false;
// hook on .strip / the data attribute, not on styling classes (those moved to Tailwind)
const strips = Array.from(document.querySelectorAll<HTMLElement>("#research .strip"));
const scopeGroup = document.querySelector<HTMLElement>('[data-filter-group="scope"]');

function applyStripFilter(): void {
    strips.forEach((item) => {
        const scopeOk = scope === "*" || item.dataset.featured === "true";
        const statusOk = !activeOnly || item.dataset.status === "current" || item.dataset.status === "ongoing";
        item.hidden = !(scopeOk && statusOk);
    });
    // showing/hiding strips changes the page height, which invalidates the
    // altimeter tape's cached section offsets and scroll range
    scheduleTapeLayout(true);
}

function setScope(next: string): void {
    scope = next;
    scopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.filterValue === next);
    });
}

scopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        setScope(btn.dataset.filterValue || "featured");
        applyStripFilter();
    });
});

const activeToggle = document.querySelector<HTMLButtonElement>("#activeToggle");
if (activeToggle) {
    activeToggle.addEventListener("click", () => {
        activeOnly = !activeOnly;
        activeToggle.classList.toggle("is-active", activeOnly);
        activeToggle.setAttribute("aria-pressed", String(activeOnly));
        // filtering to active work across only the featured subset leaves almost
        // nothing on screen, so widen the scope automatically
        if (activeOnly) setScope("*");
        applyStripFilter();
    });
}

applyStripFilter();
