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
const throttleLever = document.getElementById("throttle-lever");
const throttleDisplay = document.getElementById("throttle-display");
const hdgGauge = document.getElementById("hdg-gauge");

if (machNeedle && compassGroup && horizonCard) {
    const MACH_MIN = 0.2;
    const MACH_MAX = 0.95;
    const SWEEP_DEG = 240;

    // shared apply step: both live pointer input and the idle drift below
    // funnel through this, so the two behave identically once handed off.
    // yFrac drives pitch/horizon-shift/throttle; xFrac drives roll/mach;
    // headingDeg is a separate angle-from-center calc, not a single axis.
    const applyInstruments = (yFrac: number, xFrac: number, headingDeg: number): void => {
        const machFrac = xFrac;
        const mach = MACH_MIN + machFrac * (MACH_MAX - MACH_MIN);
        const machRotation = -(SWEEP_DEG / 2) + machFrac * SWEEP_DEG;
        machNeedle.setAttribute("transform", `rotate(${machRotation} 50 50)`);
        const machText = mach.toFixed(2);
        if (machDigitalTop) machDigitalTop.textContent = machText;
        if (machDigitalBox) machDigitalBox.textContent = machText;

        const targetedHeading = Math.round(headingDeg) % 360;
        compassGroup.setAttribute("transform", `rotate(${-targetedHeading} 50 50)`);
        const paddedHeading = String(targetedHeading).padStart(3, "0");
        if (hdgDigitalTop) hdgDigitalTop.textContent = paddedHeading;
        if (hdgDigitalBox) hdgDigitalBox.textContent = paddedHeading;

        const rollDeg = (xFrac - 0.5) * 40;
        const pitchDeg = (yFrac - 0.5) * -15;
        horizonCard.style.transform = `translateY(${(yFrac - 0.5) * -30}px) rotate(${rollDeg}deg)`;
        if (pitchDisplay) pitchDisplay.textContent = (pitchDeg >= 0 ? "+" : "") + Math.round(pitchDeg);
        if (rollDisplay) rollDisplay.textContent = (rollDeg >= 0 ? "+" : "") + Math.round(rollDeg);

        // throttle now tracks y independently — no longer a mach mirror
        const throttleFrac = yFrac;
        if (throttleLever) throttleLever.style.bottom = `${8 + throttleFrac * 76}%`;
        if (throttleDisplay) throttleDisplay.textContent = String(Math.round(throttleFrac * 100));
    };

    // idle drift: keeps the instruments visibly alive before any input,
    // which matters most on touch devices where there's no hover to discover
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let idleActive = true;
    let idleFrameId = 0;

    const idleTick = (time: number): void => {
        if (!idleActive) return;
        const t = time / 1000;
        const yDrift = 0.5 + Math.sin(t * 0.35) * 0.28;
        const xDrift = 0.5 + Math.sin(t * 0.22 + 1.4) * 0.32;
        const headingDrift = 180 + Math.sin(t * 0.18 + 0.6) * 150;
        applyInstruments(yDrift, xDrift, headingDrift);
        idleFrameId = requestAnimationFrame(idleTick);
    };

    if (prefersReducedMotion) {
        applyInstruments(0.5, 0.5, 0);
        idleActive = false;
    } else {
        idleFrameId = requestAnimationFrame(idleTick);
    }

    const stopIdle = (): void => {
        if (!idleActive) return;
        idleActive = false;
        cancelAnimationFrame(idleFrameId);
    };

    const updateInstruments = (clientX: number, clientY: number): void => {
        stopIdle();
        const mouseXRatio = clientX / window.innerWidth;
        const mouseYRatio = clientY / window.innerHeight;

        // heading tracks the angle from the gauge's own center to the
        // pointer — falls back to viewport center if the gauge isn't found
        const gaugeRect = hdgGauge?.getBoundingClientRect();
        const centerX = gaugeRect ? gaugeRect.left + gaugeRect.width / 2 : window.innerWidth / 2;
        const centerY = gaugeRect ? gaugeRect.top + gaugeRect.height / 2 : window.innerHeight / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const headingDeg = (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;

        applyInstruments(mouseYRatio, mouseXRatio, headingDeg);
    };

    window.addEventListener("mousemove", (e) => updateInstruments(e.clientX, e.clientY));
    window.addEventListener(
        "touchmove",
        (e) => {
            if (e.touches.length > 0) updateInstruments(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: true }
    );
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
    window.addEventListener("load", tapeLayout);
    tapeLayout();
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
const strips = Array.from(document.querySelectorAll<HTMLElement>(".strip-rack .strip"));
const scopeGroup = document.querySelector<HTMLElement>('.filter-group[data-filter-group="scope"]');

function applyStripFilter(): void {
    strips.forEach((item) => {
        const scopeOk = scope === "*" || item.dataset.featured === "true";
        const statusOk = !activeOnly || item.dataset.status === "current" || item.dataset.status === "ongoing";
        item.hidden = !(scopeOk && statusOk);
    });
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
