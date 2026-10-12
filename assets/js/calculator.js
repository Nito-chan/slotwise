/* Slotwise no-show revenue calculator (§7.4).
   lost_month = appts_week * 4.33 * rate * value; recovered = lost * 0.40. */

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initCalculator() {
  const root = document.querySelector("[data-calculator]");
  if (!root) return;

  const inputs = {
    appts: root.querySelector("#calc-appts"),
    value: root.querySelector("#calc-value"),
    rate: root.querySelector("#calc-rate"),
  };
  if (!inputs.appts || !inputs.value || !inputs.rate) return;

  const lostEl = root.querySelector("[data-calc-lost]");
  const recEl = root.querySelector("[data-calc-recovered]");
  const readout = (key) => root.querySelector(`[data-calc-readout="${key}"]`);
  const shown = { lost: 0, recovered: 0 };
  let raf = 0;
  let first = true;

  const read = () => ({
    appts: Number(inputs.appts.value),
    value: Number(inputs.value.value),
    rate: Number(inputs.rate.value),
  });

  function paint(s) {
    readout("appts").textContent = `${s.appts} per week`;
    inputs.appts.setAttribute("aria-valuetext", `${s.appts} per week`);
    readout("value").textContent = USD.format(s.value);
    inputs.value.setAttribute("aria-valuetext", USD.format(s.value));
    readout("rate").textContent = `${s.rate}%`;
    inputs.rate.setAttribute("aria-valuetext", `${s.rate} percent`);
  }

  function render(lost, recovered) {
    if (lostEl) lostEl.textContent = `${USD.format(Math.round(lost))} / month`;
    if (recEl) recEl.textContent = `${USD.format(Math.round(recovered))} / month`;
  }

  function update() {
    const s = read();
    paint(s);
    const lost = s.appts * 4.33 * (s.rate / 100) * s.value;
    const recovered = lost * 0.4;

    if (REDUCED || first) {
      first = false;
      cancelAnimationFrame(raf);
      shown.lost = lost;
      shown.recovered = recovered;
      render(lost, recovered);
      return;
    }

    cancelAnimationFrame(raf);
    const from = { ...shown };
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 350, 1);
      const e = 1 - Math.pow(1 - p, 3);
      shown.lost = from.lost + (lost - from.lost) * e;
      shown.recovered = from.recovered + (recovered - from.recovered) * e;
      render(shown.lost, shown.recovered);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  Object.values(inputs).forEach((el) => el.addEventListener("input", update));

  root.querySelectorAll("[data-calc-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [key, dir] = btn.getAttribute("data-calc-step").split("|");
      const el = inputs[key];
      if (!el) return;
      const step = Number(el.step || 1);
      const next = Number(el.value) + step * Number(dir);
      el.value = String(Math.min(Number(el.max), Math.max(Number(el.min), next)));
      update();
    });
  });

  update();
}
