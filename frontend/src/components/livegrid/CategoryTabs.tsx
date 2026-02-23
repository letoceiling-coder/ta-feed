import { cn } from "@/lib/utils";

const TABS = ["Квартиры", "Паркинги", "Дома с участками", "Участки", "Коммерция"];

interface CategoryTabsProps {
  value: number;
  onChange: (index: number) => void;
  className?: string;
}

const CategoryTabs = ({ value, onChange, className }: CategoryTabsProps) => (
  <div
    className={cn(
      "flex items-center gap-1 overflow-x-auto max-w-full",
      className,
    )}
    role="tablist"
    aria-label="Категории"
  >
    {TABS.map((tab, i) => (
      <button
        key={tab}
        role="tab"
        aria-selected={value === i}
        onClick={() => onChange(i)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
          value === i
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:bg-lg-gray-100 hover:text-foreground",
        )}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
export { TABS };
