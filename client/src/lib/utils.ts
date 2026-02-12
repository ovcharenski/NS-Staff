import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a localized value from a record that may contain
 * both new-style keys ("ru", "en") and legacy ones ("ru-RU", "en-EN").
 */
export function getLocalizedValue(record: Record<string, string>, i18nLanguage: string): string {
  if (!record) return "";

  // Normalise language to base code: "ru-RU" -> "ru"
  const hasDash = i18nLanguage.includes("-");
  const baseLang = hasDash ? i18nLanguage.split("-")[0] : i18nLanguage;

  // 1) Prefer exact match ("ru", "en")
  if (record[baseLang]) {
    return record[baseLang];
  }

  // 2) Prefer full code as-is ("ru-RU", "en-EN")
  if (record[i18nLanguage]) {
    return record[i18nLanguage];
  }

  // 3) Legacy common fallbacks
  const regionCandidates: Record<string, string[]> = {
    en: ["en-EN", "en-US", "en-GB"],
    ru: ["ru-RU"],
  };
  const candidates: string[] = regionCandidates[baseLang] || [];
  for (const key of candidates) {
    if (record[key]) return record[key];
  }

  // 4) Keys starting with base language (e.g. "en-GB", "ru-KZ")
  const startsWith = Object.keys(record).find((k) =>
    k.toLowerCase().startsWith(baseLang.toLowerCase()),
  );
  if (startsWith) return record[startsWith];

  // 5) Fallback to English if present (either new or legacy key)
  if (record["en"]) return record["en"];
  if (record["en-EN"]) return record["en-EN"];

  const values = Object.values(record);
  return values.length ? values[0] : "";
}

/**
 * Format published date for articles:
 * - < 24h  -> "1h ago" / "1ч назад"
 * - < 7d   -> "1d ago" / "1д назад"
 * - >= 7d  -> "dd.MM.yyyy"
 */
export function formatPublishedAt(isoDate: string, i18nLanguage: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  const hasDash = i18nLanguage.includes("-");
  const baseLang = hasDash ? i18nLanguage.split("-")[0] : i18nLanguage;
  const lang = baseLang === "ru" ? "ru" : "en";

  if (diffHours < 24) {
    const h = Math.max(diffHours, 1);
    return lang === "ru" ? `${h}ч назад` : `${h}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    const d = Math.max(diffDays, 1);
    return lang === "ru" ? `${d}д назад` : `${d}d ago`;
  }

  return format(date, "dd.MM.yyyy");
}
