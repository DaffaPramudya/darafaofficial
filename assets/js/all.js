const scripts = [
  "/assets/bootstrap/js/bootstrap.min.js",
  "/assets/js/aos.min.js",
  "/assets/js/bs-init.js",
  "/assets/js/baguetteBox.min.js",
  "/assets/js/vanilla-zoom.js",
  "/assets/js/theme.js",
  "/assets/js/landing-page.js"
];

scripts.forEach(src => {
  const s = document.createElement('script');
  s.src = src;
  s.defer = false;     // ubah ke true jika boleh dieksekusi setelah parse
  document.body.appendChild(s);
});