let events = [];
let news = []
let gallery = [];
let currentGallery = [];
let currentPhotoIndex = 0;

const galleryLightbox = document.querySelector("#galleryLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxCounter = document.querySelector("#lightboxCounter");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrev = document.querySelector("#lightboxPrev");
const lightboxNext = document.querySelector("#lightboxNext");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const showAllNews = document.querySelector("#showAllNews");
const galleryList = document.querySelector("#galleryList");
const showMoreGallery = document.querySelector("#showMoreGallery");

function renderNews(items = news) {

  const sortedNews = [...items].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  document.querySelector("#newsGrid").innerHTML = sortedNews.map((n, index) => `
        <article class="news-card ${index >= 3 ? "hidden-news" : ""}">
            <div class="news-image">
                <img src="${n.image}" alt="${n.title}">
            </div>

            <div class="news-body">
                <span class="tag">${n.tag}</span>
                <h3>${n.title}</h3>
                <p>${n.text}</p>
                <div class="news-date">${n.date}</div>
            </div>
        </article>
    `).join("");
}

function renderEvents() {
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  document.querySelector("#eventsList").innerHTML = sortedEvents.map(e => `
      <article class="event">
          <div class="event-date">
              <small>${e.month}</small>
              ${e.day}
              <small>${e.year}</small>
          </div>

          <div>
              <h3>${e.title}</h3>
              <p>${e.info}</p>
          </div>

          <span class="event-type">${e.type}</span>
          
          <span class="event-type"><p>${e.lieu}</p></span>  
      </article>
  `).join("");
}

function renderGallery() {

  const sortedGallery = [...gallery].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  document.querySelector("#galleryList").innerHTML = sortedGallery.map((item, index) => `
    <article 
      class="gallery-item ${index >= 6 ? "hidden-gallery" : ""}"
      data-gallery-index="${index}"
    >
      <img src="${item.cover}" alt="${item.title}">

      <div class="gallery-overlay">
        <span class="tag">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      </div>
    </article>
  `).join("");
}


fetch("js/events.json")
  .then(response => response.json())
  .then(data => {
    events = data;
    renderEvents();
  });

fetch("js/news.json")
  .then(response => response.json())
  .then(data => {
    news = data;
    renderNews();
  });

fetch("js/gallery.json")
  .then(response => response.json())
  .then(data => {
    gallery = data;
    renderGallery();
  });

if (news.length < 4) {
  showAllNews.style.display = "none";
}

function openLightbox(galleryIndex) {

  const sortedGallery = [...gallery].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  currentGallery = sortedGallery[galleryIndex].images;
  currentPhotoIndex = 0;

  lightboxTitle.textContent = sortedGallery[galleryIndex].title;

  updateLightbox();

  galleryLightbox.classList.add("active");
  galleryLightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}


function updateLightbox() {

  lightboxImage.src = currentGallery[currentPhotoIndex];

  lightboxCounter.textContent =
    `${currentPhotoIndex + 1} / ${currentGallery.length}`;

  lightboxImage.alt =
    `${lightboxTitle.textContent} - photo ${currentPhotoIndex + 1}`;
}


function closeLightbox() {

  galleryLightbox.classList.remove("active");
  galleryLightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}


function nextPhoto() {

  currentPhotoIndex++;

  if (currentPhotoIndex >= currentGallery.length) {
    currentPhotoIndex = 0;
  }

  updateLightbox();
}


function previousPhoto() {

  currentPhotoIndex--;

  if (currentPhotoIndex < 0) {
    currentPhotoIndex = currentGallery.length - 1;
  }

  updateLightbox();
}

showAllNews.addEventListener("click", () => {

  document.querySelectorAll(".hidden-news").forEach(card => {
    card.classList.remove("hidden-news");
  });

  showAllNews.style.display = "none";
});

document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".main-nav").classList.toggle("open");
});

document.querySelectorAll(".main-nav a").forEach(a => a.addEventListener("click", () => {
  document.querySelector(".main-nav").classList.remove("open");
}));

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  contactForm.style.display = "none";

  formStatus.classList.add("active");
  document.querySelector("#contact").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  formStatus.innerHTML = `
    <div class="loader">
        <span></span>
    </div>

    <strong>ENVOI EN COURS...</strong>
    <small>TRANSMISSION DU MESSAGE</small>
  `;

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json"
      }
    });

    if (response.ok) {

      formStatus.innerHTML = `
      <div class="form-success">
            <svg viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24"></circle>
                <path d="M14 27 L22 35 L38 18"></path>
            </svg>

            <strong>MESSAGE ENVOYÉ</strong>
            <p>Votre message a bien été transmis au FBAC.</p>
      </div>
      `;
      contactForm.reset();
    } else {

      formStatus.innerHTML = `
        <div class="form-error">✕</div>
        <strong>ÉCHEC DE L'ENVOI</strong>
        <p>Une erreur est survenue. Veuillez réessayer.</p>
      `;
    }

  } catch (error) {

    formStatus.innerHTML = `
      <div class="form-error">✕</div>
      <strong>ÉCHEC DE L'ENVOI</strong>
      <p>Impossible de contacter le serveur.</p>
  `;
  }
});

showMoreGallery.addEventListener("click", () => {

  document.querySelectorAll(".hidden-gallery").forEach(card => {
    card.classList.remove("hidden-gallery");
  });

  showMoreGallery.style.display = "none";
});

document.querySelector("#galleryList").addEventListener("click", (e) => {

  const card = e.target.closest(".gallery-item");

  if (!card) return;

  const galleryIndex = Number(card.dataset.galleryIndex);

  openLightbox(galleryIndex);
});

lightboxClose.addEventListener("click", closeLightbox);

lightboxNext.addEventListener("click", nextPhoto);

lightboxPrev.addEventListener("click", previousPhoto);

document.addEventListener("keydown", (e) => {

  if (!galleryLightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeLightbox();
  }

  if (e.key === "ArrowRight") {
    nextPhoto();
  }

  if (e.key === "ArrowLeft") {
    previousPhoto();
  }
});

galleryLightbox.addEventListener("click", (e) => {

  if (e.target === galleryLightbox) {
    closeLightbox();
  }
});