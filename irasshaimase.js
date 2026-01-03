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
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <link rel="stylesheet" href="main.css" />
</head>

<body>
  <!-- HEADER -->
  <header class="container py-3">
    <a 
      href="index.html" 
      class="text-decoration-none text-muted d-inline-flex align-items-center gap-2"
    >
      ← Voltar para lista
    </a>
  </header>

  <!-- MAIN -->
  <main class="container restaurant-page">

    <!-- Capa -->
    <div class="mb-4">
      <a href="#" target="_blank">
      <img
        src="${cover}"
        alt="Capa de ${name}"
        class="img-fluid w-100 shadow-sm"
        style="height: 40vh; object-fit: cover; border-radius: 2rem;"
      />
      </a>
    </div>

    <!-- Título + estrelas -->
    <div class="mb-3">
      <h1 class="fw-bold mb-1">${name}</h1>

      <h3 class="stars mb-1">
        <span class="rounded py-1 d-inline-block text-warning">
          ${stars}
        </span>
        /5
      </h3>

      <a class="endereco text-muted mb-0" href="#" target="_blank"></a>
    </div>

  </main>

  <!-- REVIEW -->
  <article class="container mt-4 mb-5">
    <div class="bg-white p-4 rounded shadow-sm">
      <p class="review-date mb-0 p-4" style="opacity: 60%;"></p>
      <p class="review-text mb-0 p-4"></p>
      <img 
        src="images/icon_sombrinha.svg" 
        class="d-block mx-auto"
        style="width: 16px; height: 16px;"
        alt="Fim do Texto"
      >
    </div>
  </article>

  <!-- FOOTER -->
  <footer class="site-footer border-top py-3 mt-auto">
    <div class="container">
      <div class="footer-content d-flex align-items-center justify-content-center gap-2">
        <img
          src="images/icon_insta.svg"
          alt="Instagram"
          class="footer-icon"
          style="width: 24px; height: 24px;"
        />
        <a
          href="https://instagram.com/lamen.recife"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link text-decoration-none"
        >
          instagram.com/lamen.recife
        </a>
      </div>
    </div>
  </footer>
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
