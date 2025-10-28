import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [options, setOptions] = useState<{ code: string; label: string }[]>([]);

  useEffect(() => {
    fetch('/api/supported')
      .then(r => r.json())
      .then((data) => setOptions(data.languages || []))
      .catch(() => setOptions([{ code: 'en', label: 'EN' }, { code: 'ru', label: 'RU' }]));
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <Select
        value={i18n.language}
        onValueChange={(val) => i18n.changeLanguage(val)}
      >
        <SelectTrigger className="w-[110px] h-8" aria-label="Select language">
          <SelectValue placeholder={i18n.language.toUpperCase()} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
