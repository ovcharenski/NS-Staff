import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "./db";

function getArticlesDir(): string {
  return path.join(DATA_DIR, "articles");
}

export function getArticleContentPath(id: string, lang: string): string {
  return path.join(getArticlesDir(), id, `${lang}.md`);
}

export async function readArticleContent(id: string): Promise<Record<string, string>> {
  const content: Record<string, string> = {};
  const langs = ["ru", "en"];

  for (const lang of langs) {
    const filePath = getArticleContentPath(id, lang);
    try {
      content[lang] = await fs.readFile(filePath, "utf-8");
    } catch {
      content[lang] = "";
    }
  }

  return content;
}

export async function writeArticleContent(id: string, content: Record<string, string>): Promise<void> {
  const dir = path.join(getArticlesDir(), id);
  await fs.mkdir(dir, { recursive: true });

  for (const [lang, text] of Object.entries(content)) {
    if (lang !== "ru" && lang !== "en") continue;
    const filePath = getArticleContentPath(id, lang);
    await fs.writeFile(filePath, text, "utf-8");
  }
}

export async function writeArticleContentFile(id: string, lang: string, text: string): Promise<void> {
  if (lang !== "ru" && lang !== "en") {
    throw new Error(`Invalid lang: ${lang}. Must be ru or en.`);
  }

  const dir = path.join(getArticlesDir(), id);
  await fs.mkdir(dir, { recursive: true });

  const filePath = getArticleContentPath(id, lang);
  await fs.writeFile(filePath, text, "utf-8");
}

export async function deleteArticleContent(id: string): Promise<void> {
  const dir = path.join(getArticlesDir(), id);
  try {
    await fs.rm(dir, { recursive: true });
  } catch {
    // Ignore if dir does not exist
  }
}
