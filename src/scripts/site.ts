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
type Airline = "delta" | "sia" | "united" | "american";

const liveryCredits: Record<Airline, string> = {
    delta: "REG: N845MH",
    united: "REG: N91007",
    american: "REG: N735AT",
    sia: "REG: 9V-SMF",
};

let lightsOn = root.dataset.panelLights === "on";
let gainOn = root.dataset.panelGain !== "off";

function persistPanelState(): void {
    try {
        localStorage.setItem("panel-state", JSON.stringify({ lights: lightsOn, gain: gainOn }));
    } catch (e) {
        /* private mode or blocked storage; the choice just won't survive a reload */
    }
}

function airlineFor(lights: boolean, gain: boolean): Airline {
    if (!lights && gain) return "delta";
    if (!lights && !gain) return "sia";
    if (lights && gain) return "united";
    return "american";
}

function applyTheme(): void {
    const airline = airlineFor(lightsOn, gainOn);
    root.setAttribute("data-airline", airline);
    root.classList.toggle("dark", !lightsOn);

    const liveryCredit = document.getElementById("livery-credit");
    if (liveryCredit) liveryCredit.textContent = liveryCredits[airline];

    /* aria-pressed is the only state written: header.css derives both the lit
       border and the LED from it, so there's no mirrored class to keep in sync */
    document.getElementById("lights-toggle")?.setAttribute("aria-pressed", String(lightsOn));
    document.getElementById("contrast-toggle")?.setAttribute("aria-pressed", String(gainOn));

    root.dataset.panelLights = lightsOn ? "on" : "off";
    root.dataset.panelGain = gainOn ? "on" : "off";
}

document.getElementById("lights-toggle")?.addEventListener("click", () => {
    lightsOn = !lightsOn;
    applyTheme();
    persistPanelState();
});
document.getElementById("contrast-toggle")?.addEventListener("click", () => {
    gainOn = !gainOn;
    applyTheme();
    persistPanelState();
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
    let running = false;

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
        if (running) frameId = requestAnimationFrame(frame);
    };

    const startLoop = (): void => {
        if (running || prefersReducedMotion) return;
        running = true;
        frameId = requestAnimationFrame(frame);
    };
    const stopLoop = (): void => {
        running = false;
        cancelAnimationFrame(frameId);
    };

    if (prefersReducedMotion) {
        idleActive = false;
        render(0.5, 0.5, 0);
    } else {
        /* The panel used to animate for as long as the tab was open, including the
           whole time it was scrolled out of view - a needless drain on battery and
           a busy main thread while reading the rest of the page. */
        const heroEl = document.getElementById("hero-viewport");
        if (heroEl && "IntersectionObserver" in window) {
            new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) startLoop();
                    else stopLoop();
                },
                { threshold: 0 }
            ).observe(heroEl);
        } else {
            startLoop();
        }
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
    window.addEventListener("pagehide", stopLoop);
}

/* Autoplaying loops are motion the same as any animation, and CSS can't stop a
   <video>. The poster frame stays visible, so nothing is lost. */
if (prefersReducedMotion) {
    document.querySelectorAll<HTMLVideoElement>("video.strip-media").forEach((v) => {
        v.autoplay = false;
        v.removeAttribute("autoplay");
        v.pause();
    });
}

// altimeter tape + scroll spy. Only relevant in the sectioned view (both tapes
// are hidden entirely in grid view via CSS) - restores what the tape
// originally did before sections were merged into one filterable board.
const tapeSectionEls = Array.from(document.querySelectorAll<HTMLElement>("[data-tape-section]"));
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
    sectionTops = tapeSectionEls.map((sec) => scrollTargetFor(sec));
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

    /* Which section's top has reached the top of the viewport. This has to be
       the same measure the ticks are positioned by (sectionTops / totalScroll)
       and the same one goToSection scrolls to, or the lit tick, the marker and
       the click target all disagree. The couple of px absorbs subpixel landings
       from lenis's programmatic scrolls. */
    const readPoint = scrollY + 2;
    let activeIndex = 0;
    for (let i = 0; i < sectionTops.length; i++) {
        if (readPoint >= sectionTops[i]) activeIndex = i;
    }
    /* A trailing section whose top sits past the maximum scroll can never be
       reached by the measure above, so pin it at the bottom of the page. */
    if (scrollY >= totalScroll - 1) {
        activeIndex = tapeSectionEls.length - 1;
    }

    const activeSection = tapeSectionEls[activeIndex];
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

if (tapeSectionEls.length && tapeTicks.length) {
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

// view toggle: isotope grid (filterable board) vs sectioned (traditional scroll,
// everything open, tape doubles as section nav)
let sectionedView = root.dataset.view === "sectioned";
const viewChoices = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-view-choice]"));

function applyView(): void {
    const current = sectionedView ? "sectioned" : "grid";
    root.setAttribute("data-view", current);
    /* aria-pressed doubles as the seated-position styling hook (see header.css) */
    viewChoices.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.viewChoice === current));
    });
    try {
        localStorage.setItem("view-state-v2", current);
    } catch (e) {}
    scheduleTapeLayout();
}

viewChoices.forEach((btn) => {
    btn.addEventListener("click", () => {
        const next = btn.dataset.viewChoice === "sectioned";
        if (next === sectionedView) return; // already seated here
        sectionedView = next;
        applyView();
    });
});

applyView();

// nav links, routed through lenis when active
function goToSection(id: string, smooth = true): boolean {
    const el = document.getElementById(id);
    if (!el) return false;
    const top = scrollTargetFor(el);
    if (!smooth) {
        if (lenis) lenis.scrollTo(top, { immediate: true });
        else window.scrollTo({ top, behavior: "auto" });
    } else if (lenis) {
        lenis.scrollTo(top);
    } else {
        el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
    return true;
}

function goToTop(smooth = true): void {
    if (lenis) lenis.scrollTo(0, smooth ? undefined : { immediate: true });
    else window.scrollTo({ top: 0, behavior: smooth && !prefersReducedMotion ? "smooth" : "auto" });
}

document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (hash === "#" || hash === "") {
        e.preventDefault();
        goToTop();
        /* drop the fragment so a copied URL doesn't carry a bare "#" */
        history.pushState(null, "", window.location.pathname + window.location.search);
        return;
    }
    const id = hash!.slice(1);
    if (!document.getElementById(id)) return; // let the browser handle a dead fragment
    e.preventDefault();
    goToSection(id);
    /* Deliberately no pushState: the fragment shouldn't show up in the address
       bar. If one arrived on an inbound link, drop it so it doesn't linger
       while the visitor navigates elsewhere. */
    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }
});

/* An inbound URL with a fragment still needs handling here: lenis takes over the
   scroll position, and the tape offsets aren't measured until layout settles, so
   the browser's native jump lands in the wrong place. */
if (window.location.hash.length > 1) {
    const initialId = window.location.hash.slice(1);
    window.addEventListener("load", () => {
        requestAnimationFrame(() => goToSection(initialId, false));
    });
}

// work grid filters: category (all/education/experience/projects) is exclusive,
// combined with the projects-only scope (featured/all) and an active-only toggle
// that applies to every dated category
let category = "all";
let scope = "featured"; // "featured" shows only featured projects; "*" shows all
let activeOnly = false;

const tiles = Array.from(document.querySelectorAll<HTMLElement>("#workGrid .tile"));
const catGroup = document.querySelector<HTMLElement>('.grid-view [data-filter-group="category"]');
const scopeGroup = document.querySelector<HTMLElement>('.grid-view [data-filter-group="scope"]');
const workEmpty = document.getElementById("workEmpty");

function applyWorkFilter(): void {
    let visible = 0;
    tiles.forEach((tile) => {
        const cat = tile.dataset.cat ?? "";
        const status = tile.dataset.status;

        const catOk = category === "all" || cat === category;
        // featured only ever narrows projects; the other categories have no
        // featured notion and shouldn't vanish when it's on
        const scopeOk = cat !== "projects" || scope === "*" || tile.dataset.featured === "true";
        const activeOk = !activeOnly || status === "current" || status === "ongoing";

        const show = catOk && scopeOk && activeOk;
        tile.hidden = !show;
        if (show) visible++;
    });
    if (workEmpty) workEmpty.classList.toggle("is-visible", visible === 0);
}

function setCategory(next: string): void {
    category = next;
    catGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((b) => {
        const selected = b.dataset.catFilter === next;
        b.classList.toggle("is-active", selected);
        b.setAttribute("aria-pressed", String(selected));
    });
}

catGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const next = btn.dataset.catFilter || "all";
        // clicking the already-active category returns to "all", matching a
        // toggle rather than a plain radio button
        setCategory(category === next && next !== "all" ? "all" : next);
        applyWorkFilter();
    });
});

function setScope(next: string): void {
    scope = next;
    scopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((b) => {
        const selected = b.dataset.filterValue === next;
        b.classList.toggle("is-active", selected);
        b.setAttribute("aria-pressed", String(selected));
    });
}

scopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        setScope(btn.dataset.filterValue || "featured");
        applyWorkFilter();
    });
});

const activeToggle = document.querySelector<HTMLButtonElement>("#activeToggle");
if (activeToggle) {
    activeToggle.addEventListener("click", () => {
        activeOnly = !activeOnly;
        activeToggle.classList.toggle("is-active", activeOnly);
        activeToggle.setAttribute("aria-pressed", String(activeOnly));
        // active + featured together can leave almost nothing on screen, so
        // turning on active-only widens the project scope to compensate
        if (activeOnly) setScope("*");
        applyWorkFilter();
    });
}

applyWorkFilter();

/* Open education/project tiles hide their summary header (it would repeat the
   title above the nested list-view component), so the content row itself takes
   over closing. It's a role="button" div rather than a real <button> (it
   contains an <h3>, invalid inside one), so Enter/Space need wiring by hand. */
document.querySelectorAll<HTMLElement>(".tile-close").forEach((el) => {
    function collapse(): void {
        const details = el.closest("details");
        if (!details) return;
        details.open = false;
        // the summary reappears once closed; move focus there so keyboard
        // users aren't stranded on a now-hidden element
        details.querySelector<HTMLElement>("summary")?.focus();
    }
    el.addEventListener("click", collapse);
    el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            collapse();
        }
    });
});

// list view: same idea, applied to the always-visible flight strips instead of
// the grid's tiles. Kept as a separate, independently-scoped instance rather
// than generalising the grid's, since the two filter bars are unrelated DOM
// (a shared #id or query would otherwise collide between the two views).
let listScope = "featured";
let listActiveOnly = false;

const flightstrips = Array.from(document.querySelectorAll<HTMLElement>("#sec-projects .flightstrip"));
const listScopeGroup = document.querySelector<HTMLElement>('#sec-projects [data-filter-group="scope"]');

function applyListFilter(): void {
    flightstrips.forEach((strip) => {
        const scopeOk = listScope === "*" || strip.dataset.featured === "true";
        const statusOk = !listActiveOnly || strip.dataset.status === "current" || strip.dataset.status === "ongoing";
        strip.hidden = !(scopeOk && statusOk);
    });
    // showing/hiding strips changes page height, which invalidates the
    // altimeter tape's cached section offsets and scroll range
    scheduleTapeLayout();
}

function setListScope(next: string): void {
    listScope = next;
    listScopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((b) => {
        const selected = b.dataset.filterValue === next;
        b.classList.toggle("is-active", selected);
        b.setAttribute("aria-pressed", String(selected));
    });
}

listScopeGroup?.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        setListScope(btn.dataset.filterValue || "featured");
        applyListFilter();
    });
});

const activeToggleList = document.querySelector<HTMLButtonElement>("#activeToggleList");
if (activeToggleList) {
    activeToggleList.addEventListener("click", () => {
        listActiveOnly = !listActiveOnly;
        activeToggleList.classList.toggle("is-active", listActiveOnly);
        activeToggleList.setAttribute("aria-pressed", String(listActiveOnly));
        if (listActiveOnly) setListScope("*");
        applyListFilter();
    });
}

applyListFilter();
