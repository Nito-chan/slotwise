/* Slotwise scroll reveal + stat count-up (§11).
   IntersectionObserver threshold 0.15; stagger via --i (80ms steps).
   Targets are auto-selected so no markup changes are needed. */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SELECTOR = [
  ".section-head",
  ".hero__copy > *",
  ".hero__visual",
  ".chip",
  ".card",
  ".calc",
  ".step",
  ".phone",
  ".tab",
  ".industry-visual",
  ".stat",
  ".quote",
  ".compare",
  ".app",
  ".faq__item",
  ".cta-panel",
  ".trust > p",
].join(",");

export function initReveal() {
  initCountUp();

  const targets = [...document.querySelectorAll(SELECTOR)];
  if (targets.length === 0) return;

  if (REDUCED || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const perParent = new Map();
  targets.forEach((el) => {
    const key = el.parentElement;
    const n = perParent.get(key) ?? 0;
    perParent.set(key, n + 1);
    el.style.setProperty("--i", String(n));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        window.setTimeout(() => el.classList.add("is-settled"), 850);
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => io.observe(el));
}

const INT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function animateCount(el) {
  const target = Number(el.dataset.target || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const group = el.dataset.group === "true";
  const dur = 1200;
  const t0 = performance.now();

  function frame(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
    const val = Math.round(target * eased);
    el.textContent = prefix + (group ? INT.format(val) : String(val)) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initCountUp() {
  const nums = [...document.querySelectorAll("[data-countup]")];
  if (nums.length === 0) return;
  if (REDUCED || !("IntersectionObserver" in window)) return; /* static values stay */

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target); /* runs once */
      });
    },
    { threshold: 0.15 }
  );
  nums.forEach((el) => io.observe(el));
}
