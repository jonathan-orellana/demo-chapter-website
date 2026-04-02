document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".site-footer");
  if (!footer || footer.classList.contains("is-visible")) return;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        footer.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(footer);
});
