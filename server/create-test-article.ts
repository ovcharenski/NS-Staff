import { db, migrate } from "./db";

function generateId8(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

async function main() {
  // Ensure schema exists
  migrate();

  const endpoint = "ovcharenski";

  // Try to reuse localized author name from developers table if it exists
  const devRow = db
    .prepare(
      `SELECT name_json FROM developers WHERE endpoint = ?`,
    )
    .get(endpoint) as { name_json?: string } | undefined;

  const defaultAuthorName = {
    ru: "Овчаренко Михаил",
    en: "Ovcharenko Michael",
  };

  const authorName =
    devRow && devRow.name_json
      ? JSON.parse(devRow.name_json)
      : defaultAuthorName;

  const id = generateId8();
  const nowIso = new Date().toISOString();

  const title = {
    ru: "Тестовая статья",
    en: "Test article",
  };

  const summary = {
    ru: "Краткое описание тестовой статьи.",
    en: "Short description of the test article.",
  };

  const content = {
    ru: [
      "# Привет из тестовой статьи",
      "",
      "Это **markdown**‑контент с ссылкой и кодом.",
      "",
      "[Markdown Live Preview](https://markdownlivepreview.com/)",
      "",
      "```ts",
      "console.log('hello from test article');",
      "```",
    ].join("\n"),
    en: [
      "# Hello from test article",
      "",
      "This is **markdown** content with a link and code.",
      "",
      "[Markdown Live Preview](https://markdownlivepreview.com/)",
      "",
      "```ts",
      "console.log('hello from test article');",
      "```",
    ].join("\n"),
  };

  const avatarUrl = `/api/staff/${endpoint}/photo/1`;

  db.prepare(
    `INSERT INTO news (
      id, title_json, summary_json, content_json, banner_url,
      author_endpoint, author_name_json, author_avatar_url,
      tags_json, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    JSON.stringify(title),
    JSON.stringify(summary),
    JSON.stringify(content),
    null, // banner_url
    endpoint,
    JSON.stringify(authorName),
    avatarUrl,
    JSON.stringify(["test", "demo"]),
    nowIso,
    nowIso,
    nowIso,
  );

  // Log info for manual check
  console.log("Created test article:");
  console.log(`  id: ${id}`);
  console.log(`  GET /api/news/${id}`);
  console.log(`  Author endpoint: ${endpoint}`);
  console.log(`  Author avatarUrl: ${avatarUrl}`);
  console.log("");
  console.log("Открой в браузере:");
  console.log(`  /news/${id}`);
  console.log("и проверь, что аватар статьи грузится с 1.png автора.");
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

