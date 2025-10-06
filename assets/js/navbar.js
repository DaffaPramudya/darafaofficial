// navbar.js

// normalize path: map "/" => "/index.html", hapus trailing slash
function normalizePath(path) {
  // hapus trailing slash
  let p = path.replace(/\/+$/, "");
  if (p === "" || p === "/") return "/index.html";
  return p;
}

function initNavbarIndicator() {
  console.log("== DEBUG NAVBAR ==");
  console.log("location.pathname:", window.location.pathname);
  console.log("location.hash:", window.location.hash);

  document.querySelectorAll("#navMenu .nav-link").forEach(link => {
    const url = new URL(link.getAttribute("href"), window.location.origin);
    console.log("link:", link.textContent.trim(),
      "->", url.pathname, url.hash);
  });

  const links = document.querySelectorAll("#navMenu .nav-link");
  const indicator = document.querySelector(".nav-indicator");

  const loc = window.location;
  const currentPath = normalizePath(loc.pathname);
  const currentHash = loc.hash;

  let activeLink = null;

  links.forEach(link => {
    const url = new URL(link.getAttribute("href"), loc.origin);
    const linkPath = normalizePath(url.pathname);
    const linkHash = url.hash;

    // jika di home
    if (currentPath === "/index.html" && linkPath === "/index.html") {
      if (currentHash && linkHash === currentHash) {
        activeLink = link;
      }
      if (!currentHash && linkHash === "#home") {
        activeLink = link;
      }
    }

    // jika di halaman lain
    if (linkPath !== "/index.html" && linkPath === currentPath) {
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

  // click & resize
  links.forEach(link => link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(link);
  }));

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