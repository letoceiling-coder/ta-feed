import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  showCount?: number;
  className?: string;
}

function objectWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "объект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "объекта";
  return "объектов";
}

const SearchBar = ({
  placeholder = "Поиск по сайту",
  showCount = 121563,
  className,
}: SearchBarProps) => {
  const label = `Показать ${showCount.toLocaleString("ru-RU")} ${objectWord(showCount)}`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 flex items-center bg-secondary rounded-xl h-12 px-4 gap-3 border border-border">
        <Search size={18} className="text-muted-foreground shrink-0" aria-hidden />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          aria-label={placeholder}
        />
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Фильтр в поле поиска"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <Button
        size="icon"
        className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-lg-blue-hover shrink-0"
        aria-label="Открыть фильтры"
      >
        <SlidersHorizontal size={18} />
      </Button>
      <Button
        className="h-12 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-lg-blue-hover whitespace-nowrap shrink-0"
        type="button"
      >
        {label}
      </Button>
    </div>
  );
};

export default SearchBar;
