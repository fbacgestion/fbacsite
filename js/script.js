let events = [];
let news = []

const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const showAllNews = document.querySelector("#showAllNews");

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


if (news.length < 4) {
  showAllNews.style.display = "none";
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