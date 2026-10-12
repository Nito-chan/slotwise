/* Slotwise FAQ accordion (§7.12). One open at a time,
   button[aria-expanded], Home/End navigation. */

export function initFaq() {
  document.querySelectorAll("[data-faq]").forEach(initFaqRoot);
}

function initFaqRoot(root) {
  const btns = [...root.querySelectorAll("[data-faq-button]")];
  if (btns.length === 0) return;

  const regionOf = (btn) => document.getElementById(btn.getAttribute("aria-controls"));

  function set(btn, open) {
    btn.setAttribute("aria-expanded", String(open));
    const region = regionOf(btn);
    if (region) region.hidden = !open;
  }

  btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      btns.forEach((b) => set(b, false));
      if (willOpen) set(btn, true);
    });
    btn.addEventListener("keydown", (event) => {
      if (event.key === "Home") {
        event.preventDefault();
        btns[0].focus();
      } else if (event.key === "End") {
        event.preventDefault();
        btns[btns.length - 1].focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        btns[(i + 1) % btns.length].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        btns[(i - 1 + btns.length) % btns.length].focus();
      }
    });
  });
}
