/* Slotwise nav: sticky state via IntersectionObserver sentinel (§11),
   mobile drawer with focus trap, ESC close, scroll lock (§6). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initNav() {
  const nav = document.querySelector("[data-site-nav]");
  const sentinel = document.querySelector("[data-nav-sentinel]");
  if (nav && sentinel && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => nav.classList.toggle("is-scrolled", !entry.isIntersecting),
      { rootMargin: "-8px 0px 0px 0px" }
    );
    io.observe(sentinel);
  } else if (nav) {
    nav.classList.add("is-scrolled");
  }

  const toggle = document.querySelector("[data-drawer-open]");
  const drawer = document.querySelector("[data-drawer]");
  if (!toggle || !drawer) return;

  const panel = drawer.querySelector("[data-drawer-panel]");
  const closeBtn = drawer.querySelector("[data-drawer-close]");
  let lastFocused = null;

  const focusables = () =>
    [...drawer.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null
    );

  function open() {
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    drawer.removeAttribute("hidden");
    document.body.classList.add("no-scroll");
    toggle.setAttribute("aria-expanded", "true");
    (closeBtn || focusables()[0] || panel).focus({ preventScroll: true });
    document.addEventListener("keydown", onKey);
  }

  function close() {
    drawer.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKey);
    window.setTimeout(() => drawer.setAttribute("hidden", ""), 340);
    if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  }

  function onKey(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener("click", () =>
    drawer.classList.contains("is-open") ? close() : open()
  );
  if (closeBtn) closeBtn.addEventListener("click", close);
  drawer
    .querySelector("[data-drawer-backdrop]")
    ?.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}
