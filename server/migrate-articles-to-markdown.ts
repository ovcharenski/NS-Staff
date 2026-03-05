/**
 * One-time migration: move article content from content_json (SQLite) to Markdown files.
 * Run: npx tsx server/migrate-articles-to-markdown.ts
 */

import { db, migrate } from "./db";
import { writeArticleContent } from "./article-storage";

function safeParseJsonRecord(value: unknown): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function main() {
  migrate();
  const rows = db
    .prepare(`SELECT id, content_json FROM news`)
    .all() as { id: string; content_json: string }[];

  let migrated = 0;
  let skipped = 0;

  for (const row of rows) {
    const content = safeParseJsonRecord(row.content_json);
    const hasContent = Object.values(content).some((v) => v && v.length > 0);

    if (!hasContent) {
      skipped++;
      continue;
    }

    await writeArticleContent(row.id, content);
    db.prepare(`UPDATE news SET content_json = ? WHERE id = ?`).run("{}", row.id);
    migrated++;
    console.log(`Migrated article ${row.id}`);
  }

  console.log(`Done. Migrated: ${migrated}, skipped: ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
