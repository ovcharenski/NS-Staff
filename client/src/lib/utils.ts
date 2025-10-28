import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalizedValue(record: Record<string, string>, i18nLanguage: string): string {
  if (!record) return '';
  const direct = record[i18nLanguage];
  if (direct) return direct;

  const hasDash = i18nLanguage.includes('-');
  const lang = hasDash ? i18nLanguage.split('-')[0] : i18nLanguage;

  // Common region fallbacks
  const regionCandidates: Record<string, string[]> = {
    en: ['en-EN', 'en-US', 'en-GB'],
    ru: ['ru-RU'],
  };
  const candidates = [
    ...((regionCandidates[lang] || []) as string[]),
  ];

  for (const key of candidates) {
    if (record[key]) return record[key];
  }

  // Keys starting with the base language (e.g. de-*, fr-*)
  const startsWith = Object.keys(record).find(k => k.toLowerCase().startsWith(lang.toLowerCase()))
  if (startsWith) return record[startsWith];

  // English fallback
  if (record['en-EN']) return record['en-EN'];

  const values = Object.values(record);
  return values.length ? values[0] : '';
}
