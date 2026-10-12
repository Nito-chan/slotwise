/* Slotwise entry: init everything (Phase 1: nav, brand hydration, announcement). */

import { SITE, ANNOUNCEMENT, LEGAL } from "./config.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initCalculator } from "./calculator.js";
import { initChatDemo } from "./chat-demo.js";
import { initTabs } from "./industry-tabs.js";
import { initFaq } from "./faq.js";
import { initPricingToggle } from "./pricing-toggle.js";
import { initDemoForm } from "./form.js";

function hydrateBrand() {
  document.querySelectorAll("[data-brand-name]").forEach((el) => {
    el.textContent = SITE.name;
  });
  document.querySelectorAll("[data-brand-year]").forEach((el) => {
    el.textContent = String(SITE.year);
  });
  document.querySelectorAll("[data-concept-notice]").forEach((el) => {
    el.textContent = LEGAL.conceptNotice;
  });
}

function initAnnouncement() {
  const bar = document.querySelector("[data-announce]");
  if (!bar) return;
  try {
    if (sessionStorage.getItem(ANNOUNCEMENT.storageKey) === "1") {
      bar.setAttribute("hidden", "");
      return;
    }
  } catch {
    /* storage unavailable: keep the bar visible */
  }
  bar.querySelector("[data-announce-close]")?.addEventListener("click", () => {
    bar.setAttribute("hidden", "");
    try {
      sessionStorage.setItem(ANNOUNCEMENT.storageKey, "1");
    } catch {
      /* ignore */
    }
  });
}

/* Shared reduced-motion flag (must be declared before the init calls below). */
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

hydrateBrand();
initNav();
initAnnouncement();
initReveal();
initCalculator();
initChatDemo();
initTabs(document.querySelector("[data-tabs]"));
initFaq();
initCarousel();
initHeroLoop();
initPricingToggle();
initDemoForm();

/* Slotwise hero loop (§7.1): 9s state machine. Pauses off-screen,
   on document hidden, and entirely under prefers-reduced-motion
   (the static refilled end-state from Phase 2 stays). */

function initHeroLoop() {
  const card = document.querySelector(".schedule");
  if (!card || REDUCED || !("IntersectionObserver" in window)) return;
  const slot =
    [...card.querySelectorAll(".slot")].find(
      (li) => li.querySelector(".slot__time")?.textContent.trim() === "10:30"
    ) ?? null;
  const tag = card.querySelector(".recovered-tag");
  if (!slot || !tag) return;

  const label = slot.querySelector(".slot__time")?.nextElementSibling;
  if (!label) return;
  const bookedLabel = label.textContent;

  const toast = document.createElement("p");
  toast.className = "hero-toast";
  toast.textContent = "Cancelled";
  toast.hidden = true;
  const pill = document.createElement("p");
  pill.className = "hero-pill";
  pill.textContent = "Offering to 3 on waitlist…";
  pill.hidden = true;
  card.append(toast, pill);

  let timers = [];
  let running = false;
  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
  };

  function reset() {
    slot.className = "slot slot--booked";
    label.textContent = bookedLabel;
    slot.querySelector("svg")?.remove();
    toast.hidden = true;
    pill.hidden = true;
    tag.hidden = true;
  }

  function cycle() {
    reset();
    later(() => {
      slot.classList.replace("slot--booked", "slot--noshow");
      label.textContent = "Cancelled";
      toast.hidden = false;
    }, 1500);
    later(() => {
      toast.hidden = true;
      pill.hidden = false;
    }, 3000);
    later(() => {
      pill.hidden = true;
      slot.classList.replace("slot--noshow", "slot--refilled");
      label.textContent = "Refilled · Ayesha M.";
      slot.insertAdjacentHTML(
        "beforeend",
        '<svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#sparkles"/></svg>'
      );
      tag.hidden = false;
      tag.classList.remove("pop");
      void tag.offsetWidth;
      tag.classList.add("pop");
    }, 4500);
    later(() => {
      if (running) cycle();
    }, 9000);
  }

  function start() {
    if (running) return;
    running = true;
    cycle();
  }

  function stop() {
    running = false;
    clear();
  }

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !document.hidden) start();
    else stop();
  }).observe(card);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
}

/* Slotwise testimonial carousel (§7.8). Autoplay off; arrows, dots,
   swipe on mobile. */

function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const slides = [...root.querySelectorAll("[data-carousel-slide]")];
  const dots = [...root.querySelectorAll("[data-carousel-dot]")];
  if (slides.length === 0) return;
  let i = 0;

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.hidden = k !== i;
    });
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
  }

  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(i - 1));
  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(i + 1));
  dots.forEach((d) =>
    d.addEventListener("click", () => go(Number(d.getAttribute("data-carousel-dot")) - 1))
  );

  let startX = 0;
  root.addEventListener(
    "pointerdown",
    (e) => {
      startX = e.clientX;
    },
    { passive: true }
  );
  root.addEventListener("pointerup", (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;
    go(i + (dx < 0 ? 1 : -1));
  });
}
