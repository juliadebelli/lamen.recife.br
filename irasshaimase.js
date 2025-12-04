#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🍜 IRASSHAIMASE! GERADOR DE RESTAURANTES 🍥\n");

rl.question("Nome do restaurante: ", function (name) {

  if (!name.trim()) {
    console.log("Nenhum nome digitado. Encerrando...");
    return rl.close();
  }

  const slug = name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // 👉 Pasta onde os HTMLs serão salvos
  const restaurantsDir = path.join(__dirname, "restaurants");

  // 👉 Cria a pasta /restaurants se ainda não existir
  if (!fs.existsSync(restaurantsDir)) {
    fs.mkdirSync(restaurantsDir);
    console.log("📁 Pasta 'restaurants' criada!");
  }

  const filename = `${slug}.html`;
  const outputPath = path.join(restaurantsDir, filename);

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
</head>
<body>
  <h1>${name}</h1>
  <p>Arquivo gerado automaticamente pelo irasshaimase.js 🍥</p>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, "utf8");

  console.log(`\n🍥 HTML criado em /restaurants: ${filename}`);

  // CSV
  const csvPath = path.join(__dirname, "restaurants.csv");

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, "NAME,STARS,COORDINATES,ADDRESS,IMG,URL\n", "utf8");
    console.log("📄 CSV criado: restaurants.csv");
  }

  const newLine = [
    name,
    1,
    "-8.05|-34.9",
    "Endereço não definido",
    "img/default.jpg",
    `restaurants/${filename}`  // 👉 URL agora aponta pra /restaurants
  ].join(",");

  fs.appendFileSync(csvPath, newLine + "\n", "utf8");

  console.log("📦 CSV atualizado com o novo restaurante!");
  console.log(`➡ URL associada: restaurants/${filename}\n`);

  rl.close();
});
