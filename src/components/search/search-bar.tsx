import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search reservations..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`
        relative flex items-center transition-all duration-200
        ${isFocused ? 'scale-[1.02]' : ''}
      `}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-background/70 backdrop-blur-sm border-border/50 focus:bg-background/90 transition-all duration-200"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 h-8 w-8 p-0 z-10"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}