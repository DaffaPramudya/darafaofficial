// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
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
