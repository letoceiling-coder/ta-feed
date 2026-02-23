import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_REGIONS = ["Москва и МО", "Санкт-Петербург и ЛО", "Краснодарский край", "Сочи"];

interface RegionSelectorProps {
  value?: string;
  onChange?: (region: string) => void;
  className?: string;
}

const RegionSelector = ({ value = "Москва и МО", onChange, className }: RegionSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto py-2 px-0 gap-1.5 text-base font-normal text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>{value}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {DEFAULT_REGIONS.map((region) => (
          <DropdownMenuItem
            key={region}
            onClick={() => onChange?.(region)}
            className={value === region ? "bg-accent" : ""}
          >
            {region}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegionSelector;
