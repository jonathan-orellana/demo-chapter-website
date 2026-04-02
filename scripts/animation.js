document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stateClassMap = new Map([
    ["hero", "hero--visible"],
    ["section-wrapper", "section-wrapper--visible"],
    ["pillars-section", "pillars-section--visible"],
    ["feature-highlight", "feature-highlight--visible"],
    ["events-section", "events-section--visible"],
    ["feature-highlight__second", "feature-highlight__second--visible"]
  ]);

  const animatedSelectors = [
    ".hero",
    ".section-wrapper",
    ".pillars-section",
    ".feature-highlight",
    ".events-section",
    ".feature-highlight__second",
    ".exec-hero__content",
    ".exec-card",
    ".reveal"
  ];

  const animatedElements = [...new Set(animatedSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector))))];
  if (!animatedElements.length) return;

  const applyStateClasses = (element) => {
    stateClassMap.forEach((stateClass, sourceClass) => {
      if (element.classList.contains(sourceClass)) {
        element.classList.add(stateClass);
      }
    });
  };

  const showElement = (element, delay = 0) => {
    window.setTimeout(() => {
      element.classList.add("is-visible");
      applyStateClasses(element);
    }, delay);
  };

  if (prefersReducedMotion) {
    animatedElements.forEach((element) => showElement(element, 0));
    return;
  }

  document.documentElement.style.scrollBehavior = "auto";
  window.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = "";
      });
    },
    { once: true }
  );

  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("load", () => showElement(hero, 0), { once: true });
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        showElement(entry.target, Math.min(index * 70, 280));
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  animatedElements
    .filter((element) => element !== hero)
    .forEach((element) => observer.observe(element));
});
