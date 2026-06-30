const SUPPORTED_LANGS = ["en", "nl", "de", "fr", "es"];
const DEFAULT_LANG = "nl";
const LANG_STORAGE_VERSION = "2";

const translationCache = new Map();

async function loadTranslations(lang) {
  if (translationCache.has(lang)) {
    return translationCache.get(lang);
  }

  try {
    const res = await fetch(`i18n/${lang}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
    const data = await res.json();
    translationCache.set(lang, data);
    return data;
  } catch (err) {
    console.warn("[i18n] Error loading language", lang, err);
    if (lang !== DEFAULT_LANG) {
      return loadTranslations(DEFAULT_LANG);
    }
    return {};
  }
}

function resolveKey(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

function applyTranslations(langData) {
  const elements = document.querySelectorAll("[data-i18n]");
  const currentYear = String(new Date().getFullYear());

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const value = resolveKey(langData, key);
    if (typeof value === "string") {
      el.textContent = value.replaceAll("{{CURRENT_YEAR}}", currentYear);
    }
  });

  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    const value = resolveKey(langData, key);
    if (typeof value === "string") {
      el.setAttribute("placeholder", value);
    }
  });
}

function updateHtmlLang(lang) {
  document.documentElement.lang = lang;
}

function updateLangUI(lang) {
  const current = document.querySelector("[data-lang-code]");
  if (current) current.textContent = lang.toUpperCase();

  const menuButtons = document.querySelectorAll(".lang-menu button[data-lang]");
  menuButtons.forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.setAttribute("aria-selected", String(isActive));
  });
}

async function setLanguage(lang, options = {}) {
  const target = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const data = await loadTranslations(target);

  applyTranslations(data);
  updateHtmlLang(target);
  updateLangUI(target);

  if (options.persist !== false) {
    try {
      window.localStorage.setItem("preferredLang", target);
      window.localStorage.setItem("preferredLangVersion", LANG_STORAGE_VERSION);
    } catch {
      // ignore
    }
  }

  return target;
}

function initLanguageSwitcher() {
  const toggle = document.querySelector(".lang-toggle");
  const menu = document.querySelector(".lang-menu");

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-lang]");
    if (!btn) return;
    event.stopPropagation();
    await setLanguage(btn.getAttribute("data-lang"));
    closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("open")) return;
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

export async function initI18n() {
  initLanguageSwitcher();

  let lang = DEFAULT_LANG;

  try {
    const stored = window.localStorage.getItem("preferredLang");
    const storedVersion = window.localStorage.getItem("preferredLangVersion");
    if (storedVersion === LANG_STORAGE_VERSION && stored && SUPPORTED_LANGS.includes(stored)) {
      lang = stored;
    }
  } catch {
    // ignore
  }

  await setLanguage(lang, { persist: lang !== DEFAULT_LANG });
}


