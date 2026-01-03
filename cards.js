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
      <img src="${r.cover}" alt="${r.name}">
      <h2>${r.name}</h2>
      <a href="${r.url}">Ver restaurante</a>
    `;

    container.appendChild(card);
  });
}
