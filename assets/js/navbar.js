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

  links.forEach(link => {
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

  links.forEach(l => l.classList.remove("active"));
  activeLink.classList.add("active");

  function moveIndicator(link) {
    const rect = link.getBoundingClientRect();
    const parentRect = link.closest("ul").getBoundingClientRect();
    indicator.style.width = rect.width + "px";
    indicator.style.left = (rect.left - parentRect.left) + "px";
  }

  moveIndicator(activeLink);

  // klik
  links.forEach(link => link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(link);
  }));

  // resize
  window.addEventListener("resize", () => {
    const active = document.querySelector("#navMenu .nav-link.active");
    if (active) moveIndicator(active);
  });
}

function loadNavbar() {
  fetch("../partials/navbar.html")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch navbar: " + res.status);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("navbar-container");
      if (!container) {
        console.error("No #navbar-container found in this page.");
        return;
      }
      container.innerHTML = html;
      // run after injection
      initNavbarIndicator();
    })
    .catch(err => console.error(err));
}