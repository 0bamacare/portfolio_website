let currentIndex = 0;
let items = [];
let dots = [];

function updateCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  if (!track || items.length === 0) return;

  const clampedIndex = Math.max(0, Math.min(currentIndex, items.length - 1));
  currentIndex = clampedIndex;

  const offset = -clampedIndex * 100;
  track.style.transform = `translateX(${offset}%)`;

  dots.forEach((dot, index) => {
    dot.setAttribute("aria-current", index === clampedIndex ? "true" : "false");
  });
}

function goTo(index) {
  currentIndex = index;
  updateCarousel();
}

function next() {
  if (items.length === 0) return;
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
}

function prev() {
  if (items.length === 0) return;
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
}

function initKeyboardSupport() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      next();
    } else if (event.key === "ArrowLeft") {
      prev();
    }
  });
}

function initTouchSupport(track) {
  let startX = 0;
  let deltaX = 0;
  let isSwiping = false;

  track.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    deltaX = 0;
    isSwiping = true;
  });

  track.addEventListener("touchmove", (event) => {
    if (!isSwiping) return;
    const touch = event.touches[0];
    deltaX = touch.clientX - startX;
  });

  track.addEventListener("touchend", () => {
    if (!isSwiping) return;
    const threshold = 40;
    if (deltaX > threshold) {
      prev();
    } else if (deltaX < -threshold) {
      next();
    }
    isSwiping = false;
  });
}

export function initCarousel(projects) {
  const carouselEl = document.querySelector("[data-carousel]");
  const track = document.querySelector("[data-carousel-track]");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");
  const dotsContainer = document.querySelector("[data-carousel-dots]");

  if (!carouselEl || !track || !prevBtn || !nextBtn || !dotsContainer) {
    return;
  }

  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  projects.forEach((project, index) => {
    const item = document.createElement("article");
    item.className = "carousel-item";
    item.setAttribute("role", "group");
    item.setAttribute("aria-label", `${index + 1} of ${projects.length}`);

    item.innerHTML = `
      <div class="carousel-media">
        <img
          src="${project.previewImage}"
          alt="Screenshot van ${project.title}"
          loading="lazy"
        />
      </div>
      <div class="carousel-body">
        <div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.shortDescription}</p>
          ${project.longDescription ? `<p class="project-detail">${project.longDescription}</p>` : ""}
          <div class="project-tags">
            ${project.techTags
              .map((tag) => `<span class="project-tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
        <div class="project-links">
          ${
            project.liveUrl
              ? `<a class="project-link" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Bekijk project</a>`
              : ""
          }
          ${
            project.repoUrl
              ? `<a class="project-link" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`
              : ""
          }
        </div>
      </div>
    `;

    track.appendChild(item);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Ga naar project ${index + 1}`);
    dot.addEventListener("click", () => goTo(index));
    dotsContainer.appendChild(dot);
  });

  items = Array.from(track.children);
  dots = Array.from(dotsContainer.children);

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  initKeyboardSupport();
  initTouchSupport(track);
  updateCarousel();
}
