import { initI18n } from "./i18n.js";
import { initCarousel } from "./carousel.js";
import { initAnimations } from "./animations.js";

async function loadProjects() {
  try {
    const res = await fetch("data/projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load projects.json");
    const data = await res.json();
    if (!data || !Array.isArray(data.projects)) {
      throw new Error("Invalid projects.json format");
    }
    return data.projects;
  } catch (err) {
    console.warn("[projects] Error loading projects.json", err);
    return [];
  }
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const statusEl = form.querySelector("[data-form-status]");

  function setError(input, message) {
    const id = input.id;
    const errorEl = form.querySelector(`[data-error-for="${id}"]`);
    if (errorEl) {
      errorEl.textContent = message;
    }
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    const id = input.id;
    const errorEl = form.querySelector(`[data-error-for="${id}"]`);
    if (errorEl) {
      errorEl.textContent = "";
    }
    input.removeAttribute("aria-invalid");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (statusEl) statusEl.textContent = "";

    const isBot = form.website && form.website.value.trim().length > 0;
    if (isBot) {
      if (statusEl) {
        statusEl.textContent = "Something went wrong. Please try again.";
      }
      return;
    }

    const name = form.name;
    const email = form.email;
    const message = form.message;

    let valid = true;

    [name, email, message].forEach((field) => {
      if (!field) return;
      clearError(field);
      if (!field.value.trim()) {
        setError(field, "This field is required.");
        valid = false;
      }
    });

    if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (!valid) {
      if (statusEl) {
        statusEl.textContent = "Please correct the highlighted fields.";
      }
      return;
    }

    if (statusEl) {
      statusEl.textContent =
        "Form validation passed. Connect this form to your backend or service to handle submissions.";
    }
  });
}

function setYear() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

async function bootstrap() {
  setYear();
  initNavToggle();
  initContactForm();
  initAnimations();
  await initI18n();

  const projects = await loadProjects();
  if (projects.length > 0) {
    initCarousel(projects);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

