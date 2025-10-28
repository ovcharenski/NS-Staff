import RU from 'country-flag-icons/react/3x2/RU';
import US from 'country-flag-icons/react/3x2/US';
import GB from 'country-flag-icons/react/3x2/GB';
import DE from 'country-flag-icons/react/3x2/DE';
import FR from 'country-flag-icons/react/3x2/FR';
import ES from 'country-flag-icons/react/3x2/ES';
import IT from 'country-flag-icons/react/3x2/IT';
import JP from 'country-flag-icons/react/3x2/JP';
import CN from 'country-flag-icons/react/3x2/CN';
import IN from 'country-flag-icons/react/3x2/IN';
import UA from 'country-flag-icons/react/3x2/UA';
import PL from 'country-flag-icons/react/3x2/PL';
import BR from 'country-flag-icons/react/3x2/BR';
import KZ from 'country-flag-icons/react/3x2/KZ';

interface FlagProps {
  className?: string;
  title?: string;
}

export const countryFlagComponents: Record<string, React.FC<FlagProps>> = {
  russia: RU,
  usa: US,
  uk: GB,
  germany: DE,
  france: FR,
  spain: ES,
  italy: IT,
  japan: JP,
  china: CN,
  india: IN,
  ukraine: UA,
  poland: PL,
  brazil: BR,
  kazakhstan: KZ
};

function normalizeCountry(input: string): string {
  const value = (input || '').trim();
  if (!value) return '';
  const lower = value.toLowerCase();

  if (countryFlagComponents[lower]) return lower;

  // Map ISO codes to our internal keys
  const isoToKey: Record<string, string> = {
    ru: 'russia',
    us: 'usa',
    uk: 'uk',
    gb: 'uk',
    de: 'germany',
    fr: 'france',
    es: 'spain',
    it: 'italy',
    jp: 'japan',
    cn: 'china',
    in: 'india',
    ua: 'ukraine',
    pl: 'poland',
    br: 'brazil',
    kz: 'kazakhstan',
  };

  if (isoToKey[lower]) return isoToKey[lower];

  // Try stripping non-letters and re-check
  const lettersOnly = lower.replace(/[^a-z]/g, '');
  if (countryFlagComponents[lettersOnly]) return lettersOnly;
  if (isoToKey[lettersOnly]) return isoToKey[lettersOnly];

  return '';
}

export function CountryFlag({ country, className = "w-6 h-4" }: { country: string; className?: string }) {
  const key = normalizeCountry(country);
  const FlagComponent = key ? countryFlagComponents[key] : undefined;
  
  if (!FlagComponent) {
    return <div className={`${className} bg-muted rounded`} />;
  }
  
  return <FlagComponent className={className} title={country} />;
}

export const languageFlagComponents: Record<string, React.FC<FlagProps>> = {
  Russian: RU,
  English: GB,
  Spanish: ES,
  French: FR,
  German: DE,
  Chinese: CN,
  Japanese: JP,
};

export function LanguageFlag({ language, className = "w-5 h-4" }: { language: string; className?: string }) {
  const FlagComponent = languageFlagComponents[language];
  
  if (!FlagComponent) {
    return <div className={`${className} bg-muted rounded`} />;
  }
  
  return <FlagComponent className={className} title={language} />;
}
