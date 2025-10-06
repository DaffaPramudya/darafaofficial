// navbar.js

// normalize path: map "/" => "/index.html", hapus trailing slash
function normalizePath(p) {
  // hilangkan trailing slash
  p = p.replace(/\/+$/, "");
  // hilangkan .html di akhir
  p = p.replace(/\.html$/, "");
  // root dianggap /index
  if (p === "" || p === "/") return "/";
  return p;
}

function initNavbarIndicator() {
  const links = document.querySelectorAll("#navMenu .nav-link");
  const indicator = document.querySelector(".nav-indicator");
  const { pathname, hash } = window.location;

  const current = normalizePath(pathname);
  let activeLink;

  links.forEach((link) => {
    const url = new URL(link.getAttribute("href"), window.location.origin);
    const linkPath = normalizePath(url.pathname);

    if (current === "/") {
      // halaman home
      if (hash) {
        if (url.hash === hash) activeLink = link;
      } else if (url.hash === "#home") {
        activeLink = link;
      }
    } else if (linkPath === current) {
      // halaman lain
      activeLink = link;
    }
  });

  if (!activeLink) activeLink = links[0];

  links.forEach(link => link.classList.remove("active"));
  activeLink.classList.add("active");

  function moveIndicator(link) {
    const rectangle = link.getBoundingClientRect();
    const parentRectangle = link.closest("ul").getBoundingClientRect();
    indicator.style.width = rectangle.width + "px";
    indicator.style.left = rectangle.left - parentRectangle.left + "px";
  }

  moveIndicator(activeLink);

  // klik
  links.forEach((link) =>
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
    })
  );

  // resize
  window.addEventListener("resize", () => {
    const active = document.querySelector("#navMenu .nav-link.active");
    if (active) moveIndicator(active);
  });

  if (typeof updateNavIndicatorOnScroll === "function") {
    updateNavIndicatorOnScroll();

    // Also attach scroll listener
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateNavIndicatorOnScroll();
      }, 10);
    });
  }
}

function loadNavbar() {
  fetch("../partials/navbar.html")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch navbar: " + res.status);
      return res.text();
    })
    .then((html) => {
      const container = document.getElementById("navbar-container");
      if (!container) {
        console.error("No #navbar-container found in this page.");
        return;
      }
      container.innerHTML = html;
      // run after injection
      setTimeout(() => {
        initNavbarIndicator();
      }, 50)
    })
    .catch((err) => console.error(err));
}
