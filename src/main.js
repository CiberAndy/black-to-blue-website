const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();


// Blätterbare Bildergalerie: immer ein Foto gleichzeitig anzeigen.
const gallery = document.querySelector(".photo-carousel");
if (gallery) {
  const slides = [...gallery.querySelectorAll(".photo")];
  const count = gallery.querySelector(".gallery-count");
  const prev = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      const image = slide.querySelector("img");
      if (image) image.loading = active ? "eager" : "lazy";
    });
    if (count) count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (prev) prev.disabled = slides.length < 2;
    if (next) next.disabled = slides.length < 2;
  };

  prev?.addEventListener("click", () => showSlide(activeIndex - 1));
  next?.addEventListener("click", () => showSlide(activeIndex + 1));
  showSlide(0);
}


// Erzeuge Vorschaubilder aus echten Videoframes (ohne die Videos abzuspielen).
document.querySelectorAll(".video-frame video").forEach((video) => {
  const makePoster = () => {
    if (video.dataset.posterCaptured === "true" || !video.videoWidth || !video.videoHeight) return;
    const originalTime = video.currentTime;
    const targetTime = Math.min(2.5, Math.max(0.5, (video.duration || 5) * 0.12));
    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL("image/jpeg", 0.84);
        video.dataset.posterCaptured = "true";
      } catch (error) {
        // Wenn der Video-Host das Auslesen aus Sicherheitsgründen verhindert,
        // bleibt der normale Video-Player weiterhin nutzbar.
      } finally {
        video.removeEventListener("seeked", onSeeked);
        if (Number.isFinite(originalTime)) {
          try { video.currentTime = originalTime; } catch (_) {}
        }
      }
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    try { video.currentTime = targetTime; } catch (_) {
      video.removeEventListener("seeked", onSeeked);
    }
  };
  video.addEventListener("loadedmetadata", makePoster, { once: true });
  if (video.readyState >= 1) makePoster();
});
