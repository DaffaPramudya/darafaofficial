// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".clean-navbar");
  if (window.scrollY > 50) {
    navbar.style.padding = "0.5rem 0";
  } else {
    navbar.style.padding = "1rem 0";
  }
});

// Animated navbar indicator based on scroll position
function updateNavIndicatorOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  const indicator = document.querySelector(".nav-indicator");

  if (!indicator || !navLinks.length) return;

  let currentSection = "";
  const scrollPosition = window.scrollY + 200; // offset for better detection

  // Find which section is currently in view
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  // Update active link and move indicator
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const sectionId = href.substring(href.indexOf("#") + 1);
    if (sectionId === currentSection) {
      // Remove active from all links
      navLinks.forEach((l) => l.classList.remove("active"));
      // Add active to current link
      link.classList.add("active");
      // Move indicator
      moveIndicator(link, indicator);
    }
  });
}

// Function to move indicator smoothly
function moveIndicator(link, indicator) {
  const rectangle = link.getBoundingClientRect();
  const parentRectangle = link.closest("ul").getBoundingClientRect();

  indicator.style.width = rectangle.width + "px";
  indicator.style.left = rectangle.left - parentRectangle.left + "px";
}

// Initialize on load
window.addEventListener("load", () => {
  updateNavIndicatorOnScroll();
});

// Update on scroll
let scrollTimeout;
window.addEventListener("scroll", () => {
  // Debounce for better performance
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    updateNavIndicatorOnScroll();
  }, 10);
});

// Update on resize
window.addEventListener("resize", () => {
  updateNavIndicatorOnScroll();
});
