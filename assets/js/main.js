// ---------- Scroll-spy: highlight nav link for the section in view ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const link = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (link) link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => spy.observe(s));

// ---------- Mobile menu ----------
const navToggle = document.getElementById("navToggle");
const navLinksBox = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinksBox.classList.toggle("open"));
navLinks.forEach((l) => l.addEventListener("click", () => navLinksBox.classList.remove("open")));

// ---------- Board tabs ----------
document.querySelectorAll("#boardTabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("#boardTabs .tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ---------- Publication type filter ----------
document.querySelectorAll(".pub-filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pub-filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.type;
    document.querySelectorAll(".pub-item").forEach((item) => {
      item.style.display = type === "all" || item.dataset.type === type ? "" : "none";
    });
    // hide year blocks with no visible items
    document.querySelectorAll(".pub-year-block").forEach((block) => {
      const visible = Array.from(block.querySelectorAll(".pub-item")).some((i) => i.style.display !== "none");
      block.style.display = visible ? "" : "none";
    });
  });
});

// ---------- Gallery lightbox ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach((fig) => {
  fig.addEventListener("click", () => {
    lightboxImg.src = fig.dataset.full;
    lightbox.classList.add("open");
  });
});
lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
