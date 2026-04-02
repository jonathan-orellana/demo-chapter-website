document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const menuButton = document.querySelector(".site-header__menu-button");
  const dropdownItems = document.querySelectorAll(".site-nav__item--dropdown");
  const navLinks = document.querySelectorAll(".site-nav a");
  const mobileBreakpoint = 980;

  if (!siteHeader || !menuButton) return;

  let lastScrollY = window.scrollY;

  const isMobileView = () => window.innerWidth <= mobileBreakpoint;

  const setDropdownState = (item, shouldOpen) => {
    const toggle = item.querySelector(".site-nav__toggle");
    const menu = item.querySelector(".dropdown-menu");

    item.classList.toggle("is-open", shouldOpen);
    if (toggle) toggle.setAttribute("aria-expanded", String(shouldOpen));

    if (!menu) return;

    if (isMobileView()) {
      menu.style.maxHeight = shouldOpen ? `${menu.scrollHeight}px` : "0px";
      menu.style.marginTop = shouldOpen ? "0.5rem" : "0";
      menu.style.marginBottom = shouldOpen ? "0.75rem" : "0";
    } else {
      menu.style.maxHeight = "";
      menu.style.marginTop = "";
      menu.style.marginBottom = "";
    }
  };

  const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => setDropdownState(item, false));
  };

  const syncMenuState = (isOpen) => {
    siteHeader.classList.toggle("is-menu-open", isOpen);
    siteHeader.classList.remove("site-header--hidden");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", isOpen && isMobileView());

    if (!isOpen) closeAllDropdowns();
  };

  const closeMenu = () => syncMenuState(false);

  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    syncMenuState(!siteHeader.classList.contains("is-menu-open"));
  });

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector(".site-nav__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const willOpen = !item.classList.contains("is-open");
      dropdownItems.forEach((otherItem) => {
        if (otherItem !== item) setDropdownState(otherItem, false);
      });
      setDropdownState(item, willOpen);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".site-header")) return;
    closeAllDropdowns();
    if (isMobileView()) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAllDropdowns();
    closeMenu();
    menuButton.focus();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeAllDropdowns();
      if (isMobileView()) closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    document.body.classList.remove("menu-open");

    if (!isMobileView()) {
      siteHeader.classList.remove("is-menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      siteHeader.classList.remove("site-header--hidden");
    }

    dropdownItems.forEach((item) => {
      setDropdownState(item, item.classList.contains("is-open"));
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10 || siteHeader.classList.contains("is-menu-open")) {
        siteHeader.classList.remove("site-header--hidden");
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY) {
        siteHeader.classList.add("site-header--hidden");
      } else {
        siteHeader.classList.remove("site-header--hidden");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );
});
