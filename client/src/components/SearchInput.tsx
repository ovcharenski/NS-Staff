import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  testId?: string;
}

export function SearchInput({ value, onChange, placeholder, testId }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 h-11 rounded-full bg-card border-card-border focus-visible:ring-primary"
        data-testid={testId}
      />
    </div>
  );
}
