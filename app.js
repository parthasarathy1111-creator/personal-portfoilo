const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menu-toggle");
const navigation = document.getElementById("site-nav");
const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
const filterStatus = document.getElementById("filter-status");
const filterGroup = document.querySelector(".filter-group");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-project]")];
let resetTimer;

document.getElementById("year").textContent = new Date().getFullYear();

function applyTheme(theme) {
  root.dataset.theme = theme === "dark" ? "dark" : "light";
  const label = root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", root.dataset.theme === "dark" ? "#131719" : "#f8fafb");
}

try { applyTheme(localStorage.getItem("partha-portfolio-theme")); }
catch { applyTheme("light"); }
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  try { localStorage.setItem("partha-portfolio-theme", root.dataset.theme); } catch {}
});

function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.title = "Open navigation";
}

root.classList.add("js-nav");
menuButton.hidden = false;
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuButton.title = open ? "Close navigation" : "Open navigation";
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

filterGroup.hidden = false;
for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    for (const option of filterButtons) option.setAttribute("aria-pressed", String(option === button));
    let count = 0;
    for (const card of projectCards) {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
      if (!card.hidden) { count += 1; card.classList.add("is-visible"); }
    }
    filterStatus.textContent = `Showing ${count} ${count === 1 ? "project" : "projects"}.`;
  });
}

if (navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    clearTimeout(resetTimer);
    copyButton.disabled = true;
    try {
      await navigator.clipboard.writeText("t.parthasarathy1111@gmail.com");
      copyStatus.textContent = "Email address copied.";
    } catch {
      copyStatus.textContent = "Couldn't copy. You can select the address shown above.";
    } finally {
      copyButton.disabled = false;
      resetTimer = setTimeout(() => { copyStatus.textContent = ""; }, 4000);
    }
  });
}

const reducedMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typeof IntersectionObserver === "function" && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  root.classList.add("js-motion");
  for (const element of document.querySelectorAll(".reveal")) revealObserver.observe(element);
}

if (typeof IntersectionObserver === "function") {
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const activeObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navLinks) {
        if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
  for (const link of navLinks) {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) activeObserver.observe(target);
  }
}
