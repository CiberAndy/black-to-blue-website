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



// Stabiles Video-Standbild: Ein eigenes Bild-Overlay verhindert, dass der
// Browser das Vorschaubild beim Laden/Entladen des Videoframes schwarz übermalt.
document.querySelectorAll(".video-frame video").forEach((video) => {
  const frame = video.closest(".video-frame");
  if (!frame) return;

  let posterImage = null;
  let posterReady = false;

  const hidePoster = () => {
    if (posterImage) posterImage.hidden = true;
  };

  const createPoster = () => {
    if (posterReady || !video.videoWidth || !video.videoHeight) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const posterUrl = canvas.toDataURL("image/jpeg", 0.86);

      posterImage = document.createElement("img");
      posterImage.className = "video-poster";
      posterImage.alt = "Vorschaubild – zum Abspielen klicken";
      posterImage.src = posterUrl;
      posterImage.tabIndex = 0;
      posterImage.setAttribute("role", "button");
      posterImage.setAttribute("aria-label", "Video abspielen");
      posterImage.addEventListener("click", async () => {
        hidePoster();
        try {
          await video.play();
        } catch (error) {
          posterImage.hidden = false;
          console.warn("Video konnte nicht gestartet werden:", error);
        }
      });
      posterImage.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          posterImage.click();
        }
      });
      frame.appendChild(posterImage);
      video.poster = posterUrl;
      posterReady = true;
      video.dataset.posterCreated = "true";

      // Nach dem Erstellen an den Anfang zurückspringen; das Overlay bleibt
      // sichtbar, auch wenn der Videoplayer beim Seek kurz einen schwarzen Frame zeigt.
      if (video.currentTime > 0.05) {
        const resetToStart = () => {
          video.removeEventListener("seeked", resetToStart);
        };
        video.addEventListener("seeked", resetToStart, { once: true });
        video.currentTime = 0;
      }
    } catch (error) {
      frame.classList.add("poster-unavailable");
      console.warn("Video-Vorschaubild konnte nicht erzeugt werden (möglicherweise CORS):", error);
    }
  };

  const onLoadedData = () => {
    if (posterReady) return;
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

  // Erst CORS setzen, dann die Quelle einmal neu laden, damit Canvas-Zugriff
  // erlaubt ist. Das Overlay bleibt unabhängig vom Zustand des Videoframes.
  video.crossOrigin = "anonymous";
  video.addEventListener("loadeddata", onLoadedData);
  video.addEventListener("play", hidePoster);
  video.addEventListener("error", () => frame.classList.add("poster-unavailable"), { once: true });
  video.load();
});
