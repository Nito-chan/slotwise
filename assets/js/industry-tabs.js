/* Slotwise industry tabs (§7.7). WAI-ARIA tablist: roving tabindex,
   arrow keys, Home/End, automatic activation. */

export function initTabs(root) {
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  if (tabs.length === 0) return;

  const panelOf = (tab) => document.getElementById(tab.getAttribute("aria-controls"));

  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    tabs.forEach((t) => {
      const panel = panelOf(t);
      if (panel) panel.hidden = t !== tab;
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      let j = null;
      if (event.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (event.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") j = 0;
      else if (event.key === "End") j = tabs.length - 1;
      if (j === null) return;
      event.preventDefault();
      select(tabs[j]);
      tabs[j].focus();
    });
  });
}
