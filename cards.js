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
  container.innerHTML = "";

  restaurantes.forEach(r => {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-12 col-md-4 col-lg-3 my-2";

    col.innerHTML = `
      <div class="card h-100 shadow-sm mx-2" style="background-color: #fefefe;">
        <img 
          src="${r.cover}" 
          class="card-img-top"
          alt="${r.name}"
        >
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${r.name}</h5>
          <div class="mb-2">${r.stars}</div>

          <a
            href="${r.url}"
            target="_blank"
            class="btn btn-outline-dark mt-auto"
          >
            Ver restaurante
          </a>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}
