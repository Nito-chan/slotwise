/* Slotwise chat demo: reminder conversation simulator (§7.5).
   Data-driven bubbles, 700ms typing indicator, 6s auto-advance.
   Clicking a step selects it and pauses auto-advance. Reduced motion
   renders everything instantly with no auto-advance. */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TYPE_MS = 700;
const GAP_MS = 350;
const AUTO_MS = 6000;

const SCRIPTS = {
  2: [
    { from: "in", text: "Hi Sara! Reminder: Dental check-up tomorrow at 10:30. Reply C to confirm or R to reschedule." },
    { from: "out", text: "C" },
    { from: "in", text: "Confirmed ✓ See you tomorrow!" },
  ],
  3: [
    { from: "in", text: "A 10:30 slot just opened today. Want it? Reply Y" },
    { from: "out", text: "Y" },
    { from: "in", text: "Booked ✓ You're in for 10:30." },
  ],
};

export function initChatDemo() {
  const phone = document.querySelector("[data-chat-phone]");
  const stepBtns = [...document.querySelectorAll("[data-step]")];
  if (!phone || stepBtns.length === 0) return;

  let current = 1;
  let auto = !REDUCED;
  let timers = [];
  let autoTimer = 0;
  let onScreen = true;

  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const clearTimers = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
  };
  const stopAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = 0;
  };

  const screens = () => [...phone.querySelectorAll("[data-chat-screen]")];

  function bubble(msg) {
    const p = document.createElement("p");
    p.className = `bubble bubble--${msg.from}`;
    p.textContent = msg.text;
    return p;
  }

  function typing() {
    const p = document.createElement("p");
    p.className = "bubble bubble--in bubble--typing";
    p.setAttribute("aria-hidden", "true");
    p.innerHTML = "<i></i><i></i><i></i>";
    return p;
  }

  function playScript(chat, script) {
    chat.innerHTML = "";
    if (REDUCED) {
      script.forEach((msg) => chat.append(bubble(msg)));
      return;
    }
    let i = 0;
    const next = () => {
      if (i >= script.length) return;
      const dots = typing();
      chat.append(dots);
      later(() => {
        dots.replaceWith(bubble(script[i]));
        i += 1;
        later(next, GAP_MS);
      }, TYPE_MS);
    };
    next();
  }

  function render(step) {
    current = step;
    clearTimers();
    screens().forEach((s) => {
      s.hidden = s.getAttribute("data-chat-screen") !== String(step);
    });
    stepBtns.forEach((b) => {
      const on = b.getAttribute("data-step") === String(step);
      b.closest(".step")?.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    if (step !== 1 && onScreen && !document.hidden) {
      const chat = phone.querySelector(`[data-chat-screen="${step}"]`);
      if (chat) playScript(chat, SCRIPTS[step]);
    } else if (step !== 1) {
      /* Off-screen: render instantly so it is complete when scrolled to. */
      const chat = phone.querySelector(`[data-chat-screen="${step}"]`);
      if (chat) {
        chat.innerHTML = "";
        SCRIPTS[step].forEach((msg) => chat.append(bubble(msg)));
      }
    }
  }

  function scheduleAuto() {
    stopAuto();
    if (!auto || REDUCED) return;
    autoTimer = window.setInterval(() => {
      if (!onScreen || document.hidden) return;
      render(current === 3 ? 1 : current + 1);
    }, AUTO_MS);
  }

  stepBtns.forEach((b) => {
    b.addEventListener("click", () => {
      auto = false; /* manual select pauses auto-advance */
      stopAuto();
      render(Number(b.getAttribute("data-step")));
    });
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (!onScreen) clearTimers();
      else render(current);
    }).observe(phone);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimers();
    else render(current);
  });

  render(1);
  scheduleAuto();
}
