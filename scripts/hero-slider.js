const HERO_SLIDES = [
  "assets/images/hero1.jpg",
  "assets/images/hero2.jpg",
  "assets/images/hero3.jpg"
];

const HERO_SLIDE_INTERVAL_MS = 5000;

function initHeroSlider() {
  const hero = document.querySelector(".hero");
  const backgrounds = hero?.querySelector(".hero__backgrounds");

  if (!hero || !backgrounds) {
    return;
  }

  const slides = HERO_SLIDES.filter(Boolean);

  if (slides.length === 0) {
    return;
  }

  const slideElements = slides.map((slideUrl, index) => {
    const slide = document.createElement("div");
    slide.className = "hero__background";
    slide.style.backgroundImage = `url("${slideUrl}")`;

    if (index === 0) {
      slide.classList.add("is-active");
    }

    backgrounds.appendChild(slide);
    return slide;
  });

  if (slideElements.length === 1) {
    return;
  }

  let activeIndex = 0;

  window.setInterval(() => {
    slideElements[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slideElements.length;
    slideElements[activeIndex].classList.add("is-active");
  }, HERO_SLIDE_INTERVAL_MS);
}

initHeroSlider();
