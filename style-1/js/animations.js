function prefersReducedMotion() {
  return window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyMotionPreference(isReduced) {
  document.body.dataset.reducedMotion = isReduced ? "true" : "false";
}

function initObserver() {
  const elements = document.querySelectorAll("[data-observe]");
  if (elements.length === 0) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 }
  );

  elements.forEach((el) => observer.observe(el));
}

function initSkillMeters() {
  const meters = document.querySelectorAll(".skill-meter");
  if (meters.length === 0) return;

  meters.forEach((meter) => {
    const fill = meter.querySelector(".skill-fill");
    const level = Number(meter.dataset.skillLevel || "0");
    if (!fill) return;

    requestAnimationFrame(() => {
      fill.style.width = `${Math.max(0, Math.min(level, 100))}%`;
    });
  });
}

function initMotionToggle() {
  const btn = document.querySelector(".motion-toggle");
  if (!btn) return;

  function syncFromStorage() {
    let stored;
    try {
      stored = window.localStorage.getItem("reducedMotion");
    } catch {
      stored = null;
    }
    const reduced =
      stored === "true" || (stored === null && prefersReducedMotion());
    applyMotionPreference(reduced);
    btn.setAttribute("aria-pressed", String(reduced));
    btn.textContent = reduced ? "Animations: Off" : "Animations: On";
  }

  syncFromStorage();

  btn.addEventListener("click", () => {
    const pressed = btn.getAttribute("aria-pressed") === "true";
    const next = !pressed;
    applyMotionPreference(next);
    btn.setAttribute("aria-pressed", String(next));
    btn.textContent = next ? "Animations: Off" : "Animations: On";
    try {
      window.localStorage.setItem("reducedMotion", String(next));
    } catch {
      // ignore
    }
  });
}

export function initAnimations() {
  applyMotionPreference(prefersReducedMotion());
  initObserver();
  initSkillMeters();
  initMotionToggle();
}

