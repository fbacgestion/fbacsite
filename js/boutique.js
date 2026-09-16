/* =========================================================
ARTICLES
========================================================= */
let articles = [];

/* =========================================================
FETCH ARTICLES
========================================================= */
async function chargerBoutique() {
    try {
        const response = await fetch("js/boutique.json");

        if (!response.ok) {
            throw new Error("Impossible de charger boutique.json");
        }

        articles = await response.json();

        renderProducts();
        populateArticles();

    } catch (error) {
        console.error("Erreur chargement boutique :", error);

        const products = document.getElementById("products");

        if (products) {
            products.innerHTML = `
                <p class="error-message">
                    Impossible de charger les articles de la boutique.
                </p>
            `;
        }
    }
}

chargerBoutique();


/* =========================================================
ÉTAT
========================================================= */
let selected = null;
let quantity = 1;
let cart = [];


/* =========================================================
FORMAT PRIX
========================================================= */
function money(value) {
    return value.toFixed(2).replace(".", ",") + " €";

}

/* =========================================================
AFFICHAGE PRODUITS
========================================================= */
function renderProducts() {

    const container = document.getElementById("products");

    container.innerHTML = articles.map(article => `

      <article class="product">

        <div class="product-image">
          <img class="img-article" src="${article.image}" alt="${article.name}">
        </div>

        <div class="product-body">

          <h2>
            ${article.name}
          </h2>

          <div class="description">
            ${article.info}
          </div>

          <div class="product-footer">

            <div class="price">
              ${money(article.price)}
            </div>

            <button
              class="choose"
              onclick="selectArticle('${article.id}')">

              Choisir

            </button>

          </div>

        </div>

      </article>

    `).join("");

}

/* =========================================================
LISTE ARTICLES
========================================================= */
function populateArticles() {

    const select = document.getElementById("articleSelect");

    articles.forEach(article => {

        const option = document.createElement("option");
        option.value = article.id;
        option.textContent = article.name;

        select.appendChild(option);

    });

}

/* =========================================================
SÉLECTION ARTICLE
========================================================= */
function selectArticle(id) {

    const article = articles.find(a => a.id === id);

    if (!article) {
        return;
    }

    selected = article;
    quantity = 1;
    document.getElementById("articleSelect").value = article.id;
    document.getElementById("selectedName").textContent = article.name;
    document.getElementById("selectedInfo").textContent = article.info;
    document.getElementById("quantity").textContent = "1";

    const variant = document.getElementById("variantSelect");

    variant.innerHTML = article.sizes.map(size => `
      <option value="${size}">
        ${size}
      </option>

    `).join("");

}

/* =========================================================
QUANTITÉ
========================================================= */
function changeQuantity(value) {

    quantity += value;

    if (quantity < 1) {
        quantity = 1;
    }
    if (quantity > 20) {
        quantity = 20;
    }

    document.getElementById("quantity").textContent = quantity;

}

/* =========================================================
AJOUT PANIER
========================================================= */
function addToCart() {

    if (!selected) {
        alert("Sélectionnez d'abord un article.");
        return;
    }

    const size = document.getElementById("variantSelect").value;
    const existing =
        cart.find(item =>
            item.id === selected.id &&
            item.size === size
        );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: selected.id,
            name: selected.name,
            size: size,
            quantity: quantity,
            price: selected.price
        });
    }

    renderCart();
}

/* =========================================================
AFFICHAGE PANIER
========================================================= */
function renderCart() {

    const container = document.getElementById("cartItems");

    if (!cart.length) {

        container.innerHTML = `

      <div class="empty">
        Votre commande est actuellement vide.
      </div>

    `;

    } else {

        container.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

          <div class="cart-name">
            ${item.name}
          </div>

          <div class="cart-meta">
            ${item.size}
            ·
            ${item.quantity}
            ×
            ${money(item.price)}
          </div>

          <div class="cart-price">${money(item.price * item.quantity)}</div>

          <button class="remove" onclick="removeItem(${index})">Supprimer</button>

        </div>

      `).join("");

    }

    let total =0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
    });

    document.getElementById("total").textContent = money(total);
    document.getElementById("cartCount").textContent = count;

}

/* =========================================================
SUPPRIMER ARTICLE
========================================================= */
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}


/* =========================================================
GÉNÉRER LE BON
========================================================= */
function generateOrder() {

    if (!cart.length) {
        alert("Votre commande est vide.");
        return;
    }

    const now = new Date();
    const number = "FBAC-" + now.getFullYear() + "-" + "___";

    document.getElementById("orderNumber").textContent = "N° " + number;
    document.getElementById("orderDate").textContent = "Édité le " + now.toLocaleDateString("fr-FR");
    document.getElementById("orderLines").innerHTML = cart.map(item => `

      <tr>

        <td>
          <strong>
            ${item.name}
          </strong>
        </td>

        <td>
          ${item.size}
        </td>

        <td>
          ${item.quantity}
        </td>

        <td>
          ${money(item.price * item.quantity)}
        </td>

      </tr>

    `).join("");

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById("orderTotal").textContent = money(total);
    document.getElementById("orderModal").classList.add("show");

}


/* =========================================================
IMPRESSION
========================================================= */
function printOrder() {
    const customerInput = document.getElementById("customerName");
    if(!customerInput.value.trim()){
        alert("Veuillez renseigner le nom et prénom de l'adhérent.");
        customerInput.focus();
        return;
    }
    window.print();
}


/* =========================================================
FERMER LE BON
========================================================= */
function closeOrder() {
    document.getElementById("orderModal").classList.remove("show");
}

/* =========================================================
ALLER AU PANIER
========================================================= */
function goCart() {
    document.getElementById("cartSection").scrollIntoView({behavior: "smooth"});
}
/* =========================================================
INITIALISATION
========================================================= */

renderCart();
