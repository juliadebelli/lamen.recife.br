document.addEventListener("DOMContentLoaded", () => {
  carregarRestaurantes();
});

async function carregarRestaurantes() {
  try {
    const response = await fetch("./restaurants.csv");
    const csvText = await response.text();
    const restaurantes = parseCSV(csvText);
    renderCards(restaurantes);
  } catch (err) {
    console.error("Erro ao carregar restaurantes:", err);
  }
}

function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, "").trim();
  const linhas = clean.split("\n");

  if (linhas.length <= 1) return [];

  const headers = linhas.shift().split(",").map(h => h.trim());

  return linhas.map(linha => {
    const valores = linha.split(",");
    const obj = {};
    headers.forEach((h, i) => obj[h] = valores[i]?.trim());
    return obj;
  });
}

function renderCards(restaurantes) {
  const container = document.getElementById("listaSection");

  restaurantes.forEach(r => {
    const card = document.createElement("article");
    card.className = "restaurant-card";

    card.innerHTML = `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm" style="background-color: #fefefe;">
          <img 
            src="${r.cover}" 
            class="card-img-top" 
            alt="${r.name}"
          >
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${r.name}</h5>
            <h5>${r.stars}</h5>
            <br>
            <a 
              href="${r.url}" 
              target="_blank"
              class="btn btn-outline-dark mt-auto"
            >
              Ver restaurante
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
