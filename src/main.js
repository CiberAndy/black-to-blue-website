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



// Automatische Video-Vorschaubilder: einen Frame direkt im Browser auslesen.
document.querySelectorAll(".video-frame video").forEach((video) => {
  const frame = video.closest(".video-frame");
  if (!frame) return;

  const createPoster = () => {
    if (video.dataset.posterCreated === "true" || !video.videoWidth || !video.videoHeight) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      video.poster = canvas.toDataURL("image/jpeg", 0.82);
      video.dataset.posterCreated = "true";
      video.classList.add("has-auto-poster");
      video.removeEventListener("seeked", createPoster);
      video.removeEventListener("loadeddata", onLoadedData);
    } catch (error) {
      // Externe Videodateien ohne passende CORS-Freigabe lassen sich nicht
      // auf ein Canvas zeichnen. Die normale Videowiedergabe bleibt nutzbar.
      frame.classList.add("poster-unavailable");
      console.warn("Video-Vorschaubild konnte nicht erzeugt werden (möglicherweise CORS):", error);
    }
  };

  const onLoadedData = () => {
    if (video.dataset.posterCreated === "true") return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const targetTime = duration > 2 ? Math.min(1.5, duration * 0.1) : 0;
    if (Math.abs(video.currentTime - targetTime) < 0.1) {
      createPoster();
      return;
    }
    video.addEventListener("seeked", createPoster, { once: true });
    try {
      video.currentTime = targetTime;
    } catch {
      createPoster();
    }
  };

  // CORS muss vor dem Neuladen gesetzt sein, damit Canvas-Zugriff erlaubt ist.
  video.crossOrigin = "anonymous";
  video.addEventListener("loadeddata", onLoadedData);
  video.addEventListener("error", () => frame.classList.add("poster-unavailable"), { once: true });
  video.load();
});
