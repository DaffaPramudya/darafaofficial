// navbar.js

// normalize path: map "/" => "/index.html", hapus trailing slash
function normalizePath(pathname) {
  let p = pathname.replace(/\/+$/, '');      // hapus trailing slash
  if (p === '') p = '/';
  if (p === '/') return '/index.html';       // anggap root sebagai index.html
  return p;
}

function initNavbarIndicator() {
  const links = Array.from(document.querySelectorAll("#navMenu .nav-link"));
  const indicator = document.querySelector(".nav-indicator");
  if (!links.length || !indicator) return;

  const loc = new URL(window.location.href);
  const locPath = normalizePath(loc.pathname);
  const locHash = loc.hash || "";

  // Helper: parse link href into path + hash (robust terhadap relative/absolute/#only)
  function parseLink(link) {
    try {
      // gunakan window.location.origin sebagai base supaya '#id' jadi absolute dengan path saat ini
      const url = new URL(link.getAttribute("href"), window.location.origin);
      return {
        el: link,
        path: normalizePath(url.pathname),
        hash: url.hash || ""
      };
    } catch (e) {
      return { el: link, path: null, hash: null };
    }
  }

  const parsed = links.map(parseLink);

  // 1) cari exact path + hash match (prioritas tertinggi)
  let active = parsed.find(p => p.path === locPath && p.hash === locHash);

  // 2) kalau belum ada, cari exact path match (tanpa hash)
  if (!active) active = parsed.find(p => p.path === locPath);

  // 3) jika masih belum ada, jika kita di index (root), dan ada link dengan hash yang sama (anchor-only),
  //    cari link whose hash equals locHash (covers cases where link href might be '#home' or '/index.html#home')
  if (!active && (locPath === '/index.html') && locHash) {
    active = parsed.find(p => p.hash === locHash);
  }

  // 4) fallback: link pertama
  if (!active) active = parsed[0];

  // set class active on chosen element
  links.forEach(l => l.classList.remove("active"));
  if (active && active.el) active.el.classList.add("active");

  // function to move indicator under the active link
  function moveIndicator(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ulRect = el.closest("ul").getBoundingClientRect();
    indicator.style.width = rect.width + "px";
    indicator.style.left = (rect.left - ulRect.left) + "px";
  }

  // apply initial position
  moveIndicator(active.el);

  // click behavior: update active and move indicator (user clicks may navigate away though)
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      // if it's an anchor (same page) prevent default to allow animation before scroll? optional.
      // but we keep default navigation: still set classes for immediate UX
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
    });
  });

  // reposition on resize
  window.addEventListener("resize", () => {
    const cur = document.querySelector("#navMenu .nav-link.active");
    if (cur) moveIndicator(cur);
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