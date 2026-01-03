#!/usr/bin/env node
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(pergunta) {
  return new Promise(resolve => rl.question(pergunta, resolve));
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

(async () => {
  try {
    console.log("🍜 IRASSHAIMASE! GERADOR DE RESTAURANTES 🍥\n");

    const name = (await perguntar("Nome do restaurante: ")).trim();
    if (!name) {
      console.log("❌ Nome inválido. Encerrando.");
      rl.close();
      return;
    }

    const starsNumber = await perguntar("Estrelas (1 a 5): ");
    const stars = "🍥".repeat(
      Math.max(1, Math.min(5, Number(starsNumber)))
    );

    const coordinates = (await perguntar("Coordenadas (lat|lng): ")).trim();

    const slug = slugify(name);
    const url = `${slug}.html`;

    const coverName = (await perguntar(
      "Nome do arquivo da capa (ex: ramen.png): "
    )).trim();

    const cover = `images/${coverName}`;

    // -------------------------
    // CSV
    // -------------------------
    const csvPath = "./restaurants.csv";

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(
        csvPath,
        "name,stars,coordinates,slug,cover,url\n",
        "utf8"
      );
    }

    const linha = `${name},${stars},${coordinates},${slug},${cover},${url}\n`;
    fs.appendFileSync(csvPath, linha, "utf8");

    // -------------------------
    // HTML do restaurante
    // -------------------------
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${name} | lamen.recife</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans:wght@100..900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="main.css" />
</head>

<body>
  <header class="restaurant-header">
    <a href="index.html">← Voltar para lista</a>
  </header>

  <main class="restaurant-page">
    <img
      src="${cover}"
      alt="Capa de ${name}"
      class="restaurant-cover"
      style="height: 10em; width: auto"
    />

    <h1>${name}</h1>
    <p class="stars">${stars}</p>
    <p class="coordinates">${coordinates}</p>
  </main>
</body>
</html>
`;

    fs.writeFileSync(`./${url}`, html, "utf8");

    console.log("\n✔ Restaurante adicionado com sucesso!");
    console.log(`📄 HTML criado: ${url}`);
    console.log("📦 CSV atualizado\n");

    rl.close();
  } catch (err) {
    console.error("❌ Erro ao criar restaurante:", err);
    rl.close();
  }
})();
