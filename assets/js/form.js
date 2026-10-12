/* Slotwise demo form (§9): inline validation on blur + submit,
   accessible errors via aria-describedby, honeypot-aware fake submit
   with same-page success panel. Netlify Forms attributes in markup. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLANS = ["trial", "starter", "growth", "pro"];

export function initDemoForm() {
  const form = document.querySelector("[data-demo-form]");
  if (!form) return;

  const planInput = form.querySelector('[name="plan"]');
  if (planInput) {
    const plan = new URLSearchParams(window.location.search).get("plan");
    planInput.value = PLANS.includes(plan) ? plan : "trial";
  }

  const fields = [
    { input: form.querySelector("#demo-name"), validate: (v) => v.trim().length >= 2 || "Please enter your full name." },
    { input: form.querySelector("#demo-email"), validate: (v) => EMAIL_RE.test(v.trim()) || "Please enter a valid work email." },
    { input: form.querySelector("#demo-business"), validate: (v) => v.trim().length >= 2 || "Please enter your business name." },
    { input: form.querySelector("#demo-type"), validate: (v) => v !== "" || "Please choose a business type." },
  ].filter((f) => f.input);

  function showError(input, message) {
    clearError(input);
    input.setAttribute("aria-invalid", "true");
    const id = `err-${input.id}`;
    const p = document.createElement("p");
    p.className = "field-error";
    p.id = id;
    p.innerHTML =
      '<svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#x"/></svg>';
    p.append(document.createTextNode(message));
    input.insertAdjacentElement("afterend", p);
    input.setAttribute("aria-describedby", id);
  }

  function clearError(input) {
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    const old = document.getElementById(`err-${input.id}`);
    if (old) old.remove();
  }

  function check(field) {
    const ok = field.validate(field.input.value);
    if (ok === true) {
      clearError(field.input);
      return true;
    }
    showError(field.input, ok);
    return false;
  }

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => {
      if (field.input.value !== "") check(field);
    });
    field.input.addEventListener("input", () => {
      if (field.input.hasAttribute("aria-invalid")) check(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = fields.map(check);
    const firstBad = fields.find((_, i) => !results[i]);
    if (firstBad) {
      firstBad.input.focus();
      return;
    }

    /* Honeypot filled: pretend success, send nothing. */
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    window.setTimeout(() => {
      form.hidden = true;
      const done = document.querySelector("[data-demo-success]");
      if (done) {
        done.hidden = false;
        done.querySelector("h2")?.setAttribute("tabindex", "-1");
        done.querySelector("h2")?.focus({ preventScroll: false });
      }
    }, 900);
  });
}
