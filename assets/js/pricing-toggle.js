/* Slotwise billing toggle (pricing page): monthly / annual swap
   with a small number-change animation. Values mirror config.js. */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initPricingToggle() {
  const toggle = document.querySelector("[data-billing-toggle]");
  if (!toggle) return;
  const buttons = [...toggle.querySelectorAll("[data-billing]")];
  const prices = [...document.querySelectorAll("[data-price]")];
  const notes = [...document.querySelectorAll("[data-billing-note]")];
  if (buttons.length === 0 || prices.length === 0) return;

  function set(period) {
    buttons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.getAttribute("data-billing") === period))
    );
    prices.forEach((p) => {
      const val = p.getAttribute(period === "annual" ? "data-annual" : "data-monthly");
      if (val === null) return;
      p.textContent = `$${val}`;
      if (!REDUCED) {
        p.classList.remove("is-swapping");
        void p.offsetWidth;
        p.classList.add("is-swapping");
      }
    });
    notes.forEach((n) => {
      n.textContent =
        period === "annual" ? "per month, billed annually" : "per month, billed monthly";
    });
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => set(b.getAttribute("data-billing")))
  );

  const details = document.querySelector("[data-compare-details]");
  const mq = window.matchMedia("(min-width: 768px)");
  const syncDetails = () => {
    if (details && mq.matches) details.open = true;
  };
  if (details) {
    syncDetails();
    mq.addEventListener?.("change", syncDetails);
  }
}
